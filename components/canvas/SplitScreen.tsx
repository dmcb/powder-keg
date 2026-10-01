import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import {
  Color,
  Mesh,
  NoBlending,
  OrthographicCamera,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  UnsignedByteType,
  Vector2,
  Vector3,
} from "three";
import { usePlayerStore } from "stores/playerStore";
import { gameClock } from "lib/gameClock";
import { groupPlayers } from "lib/playerGroups";
import { baseDistance, frameCamera } from "components/canvas/Camera";
import {
  cellDistance,
  joinDistance,
  seedSmoothing,
  splitDistance,
  splitLineColor,
  splitLineMaxDistance,
  splitLineMaxWidth,
} from "config/camera";

const maxViews = 4;
const seedLimit = 0.75;
const groundPlane = new Plane(new Vector3(0, 0, 1), 0);

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform int uCount;
  uniform vec2 uSeeds[4];
  uniform sampler2D uTex0;
  uniform sampler2D uTex1;
  uniform sampler2D uTex2;
  uniform sampler2D uTex3;
  uniform float uAspect;
  uniform float uPixelSize;
  uniform float uPairWidths[16];
  uniform vec3 uLineColor;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= uAspect;
    float d1 = 1e9;
    float d2 = 1e9;
    int nearest = 0;
    int second = 0;
    for (int i = 0; i < 4; i++) {
      if (i >= uCount) break;
      vec2 seed = uSeeds[i];
      seed.x *= uAspect;
      float d = distance(p, seed);
      if (d < d1) {
        d2 = d1;
        second = nearest;
        d1 = d;
        nearest = i;
      } else if (d < d2) {
        d2 = d;
        second = i;
      }
    }
    vec4 color;
    if (nearest == 0) color = texture2D(uTex0, vUv);
    else if (nearest == 1) color = texture2D(uTex1, vUv);
    else if (nearest == 2) color = texture2D(uTex2, vUv);
    else color = texture2D(uTex3, vUv);
    float width = 0.0;
    int pair = nearest * 4 + second;
    for (int k = 0; k < 16; k++) {
      if (k == pair) width = uPairWidths[k];
    }
    float line = width > 0.0
      ? 1.0 - smoothstep(width - uPixelSize, width + uPixelSize, d2 - d1)
      : 0.0;
    gl_FragColor = mix(color, vec4(uLineColor, 1.0), line);
  }
`;

/**
 * Renders the board with a dynamic Voronoi split screen: players near each
 * other share a view, and players apart from each other get their own cell,
 * each cell placed on screen in the direction of its players.
 */
export default function SplitScreen() {
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);
  const aspect = size.width / size.height;

  const fboWidth = Math.floor(size.width * dpr);
  const fboHeight = Math.floor(size.height * dpr);
  const fboSettings = {
    depthBuffer: true,
    samples: 4,
    type: UnsignedByteType,
    colorSpace: SRGBColorSpace,
  };
  const fbos = [
    useFBO(fboWidth, fboHeight, fboSettings),
    useFBO(fboWidth, fboHeight, fboSettings),
    useFBO(fboWidth, fboHeight, fboSettings),
    useFBO(fboWidth, fboHeight, fboSettings),
  ];

  // three.js only applies tone mapping and output colour space conversion
  // when rendering to the screen or an XR target. Flagging the cell targets as
  // XR targets makes them match the single-view pipeline exactly, so the
  // composite pass can copy pixels through untouched.
  useEffect(() => {
    fbos.forEach((fbo) => Object.assign(fbo, { isXRRenderTarget: true }));
  });

  const cameras = useMemo(
    () =>
      Array.from(
        { length: maxViews + 1 },
        () => new PerspectiveCamera(9, 1, 0.1, 1000),
      ),
    [],
  );
  const scratchCamera = cameras[maxViews];

  useEffect(() => {
    cameras.forEach((camera) => {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    });
  }, [cameras, aspect]);

  const composite = useMemo(() => {
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      blending: NoBlending,
      toneMapped: false,
      uniforms: {
        uCount: { value: 0 },
        uSeeds: {
          value: Array.from({ length: maxViews }, () => new Vector2()),
        },
        uTex0: { value: null },
        uTex1: { value: null },
        uTex2: { value: null },
        uTex3: { value: null },
        uAspect: { value: 1 },
        uPixelSize: { value: 0 },
        uPairWidths: { value: new Array<number>(maxViews * maxViews).fill(0) },
        uLineColor: { value: new Color(splitLineColor) },
      },
    });
    const geometry = new PlaneGeometry(2, 2);
    const scene = new Scene();
    scene.add(new Mesh(geometry, material));
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    return { material, geometry, scene, camera };
  }, []);

  useEffect(
    () => () => {
      composite.material.dispose();
      composite.geometry.dispose();
    },
    [composite],
  );

  const prevGroups = useRef<number[][]>([]);
  const seeds = useRef(new Map<number, Vector2>());
  const scratch = useMemo(
    () => ({
      raycaster: new Raycaster(),
      hit: new Vector3(),
      projected: new Vector3(),
      target: new Vector2(),
      centroid: new Vector2(),
      groupCentroids: Array.from({ length: maxViews }, () => new Vector2()),
    }),
    [],
  );

  useFrame((state) => {
    const { delta } = gameClock;
    const { gl, scene } = state;
    const { raycaster, hit, projected, target, centroid, groupCentroids } =
      scratch;

    const { players, joinedPlayers } = usePlayerStore.getState();

    gl.setRenderTarget(null);

    if (!joinedPlayers.length) {
      frameCamera(cameras[0], centroid.set(0, 0), baseDistance(aspect));
      gl.render(scene, cameras[0]);
      return;
    }

    centroid.set(0, 0);
    joinedPlayers.forEach((id) => {
      centroid.x += players[id].position[0] / joinedPlayers.length;
      centroid.y += players[id].position[1] / joinedPlayers.length;
    });

    const groups = groupPlayers(
      joinedPlayers,
      (id) => players[id].position,
      prevGroups.current,
      joinDistance,
      splitDistance,
    );
    prevGroups.current = groups;

    groups.forEach((group, index) => {
      const groupCentroid = groupCentroids[index].set(0, 0);
      group.forEach((id) => {
        const { position } = players[id];
        groupCentroid.x += position[0] / group.length;
        groupCentroid.y += position[1] / group.length;
      });
    });

    if (groups.length === 1) {
      frameCamera(cameras[0], groupCentroids[0], cellDistance);
      gl.render(scene, cameras[0]);
      seeds.current.clear();
      return;
    }

    // Place each group's screen seed where it appears from the shared view
    frameCamera(scratchCamera, centroid, cellDistance);
    const nextSeeds = new Map<number, Vector2>();
    groups.forEach((group, index) => {
      const groupCentroid = groupCentroids[index];
      projected.set(groupCentroid.x, groupCentroid.y, 0).project(scratchCamera);
      target.set(
        Math.min(Math.max(projected.x, -seedLimit), seedLimit),
        Math.min(Math.max(projected.y, -seedLimit), seedLimit),
      );
      const seed = seeds.current.get(group[0]);
      nextSeeds.set(
        group[0],
        seed
          ? seed.lerp(target, 1 - Math.exp(-seedSmoothing * delta))
          : target.clone(),
      );
    });
    seeds.current = nextSeeds;

    // Offset each cell camera so its group appears at its seed
    groups.forEach((group, index) => {
      const groupCentroid = groupCentroids[index];
      const seed = nextSeeds.get(group[0])!;
      frameCamera(scratchCamera, groupCentroid, cellDistance);
      raycaster.setFromCamera(seed, scratchCamera);
      if (!raycaster.ray.intersectPlane(groundPlane, hit)) {
        hit.set(groupCentroid.x, groupCentroid.y, 0);
      }
      target.set(2 * groupCentroid.x - hit.x, 2 * groupCentroid.y - hit.y);
      frameCamera(cameras[index], target, cellDistance);
    });

    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    groups.forEach((_, index) => {
      gl.setRenderTarget(fbos[index]);
      gl.render(scene, cameras[index]);
    });
    gl.shadowMap.autoUpdate = true;
    gl.setRenderTarget(null);

    const { uniforms } = composite.material;

    // Each divider's width grows with the distance between the closest
    // players of the two groups it separates, vanishing as they join
    groups.forEach((group, i) => {
      groups.forEach((other, j) => {
        if (j <= i) return;
        let closest = Infinity;
        group.forEach((a) => {
          other.forEach((b) => {
            const [ax, ay] = players[a].position;
            const [bx, by] = players[b].position;
            closest = Math.min(closest, Math.hypot(ax - bx, ay - by));
          });
        });
        const width =
          splitLineMaxWidth *
          Math.min(
            Math.max(
              (closest - joinDistance) / (splitLineMaxDistance - joinDistance),
              0,
            ),
            1,
          );
        uniforms.uPairWidths.value[i * maxViews + j] = width;
        uniforms.uPairWidths.value[j * maxViews + i] = width;
      });
    });
    uniforms.uCount.value = groups.length;
    groups.forEach((group, index) => {
      uniforms.uSeeds.value[index].copy(nextSeeds.get(group[0])!);
    });
    fbos.forEach((fbo, index) => {
      uniforms[`uTex${index}`].value = fbo.texture;
    });
    uniforms.uAspect.value = aspect;
    uniforms.uPixelSize.value = 2 / fboHeight;
    gl.render(composite.scene, composite.camera);
  }, 1);

  return null;
}
