import React, { useRef, useEffect, useLayoutEffect, useMemo } from "react";
import {
  Vector2,
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import Delaunator from "delaunator";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";
import Alea from "aleaprng";
import chroma from "chroma-js";
import { useControls } from "leva";

export default function Terrain(props: { seed: string }) {
  const geometryRef = useRef<BufferGeometry>(null!);
  let prng = new Alea(props.seed);

  const [{ seed, biome, amplitude, frequency, gradientEdge, octaves }, set] =
    useControls(() => ({
      seed: {
        value: props.seed,
      },
      biome: {
        value: Math.round(prng() * 2),
        min: 0,
        max: 2,
        step: 1,
      },
      amplitude: {
        value: prng() * 0.3 + 0.1,
        min: 0.1,
        max: 0.4,
        step: 0.01,
      },
      frequency: {
        value: prng() * 0.9 + 0.85,
        min: 0.85,
        max: 1.75,
        step: 0.01,
      },
      gradientEdge: {
        value: prng() * 0.35 + 0.5,
        min: 0.5,
        max: 0.85,
        step: 0.01,
      },
      octaves: {
        value: 3,
        min: 1,
        max: 8,
        step: 1,
      },
    }));

  const baseNoise = (noise2D: NoiseFunction2D, x: number, y: number) => {
    // Generate noise
    const position = new Vector2(x, y);
    let adjustedAmp = amplitude;
    let adjustedFreq = frequency;
    let value = 0;
    for (let i = 0; i < octaves; i++) {
      value += adjustedAmp * noise2D(x * adjustedFreq, y * adjustedFreq);
      adjustedAmp *= 0.5;
      adjustedFreq *= 2;
    }

    // Drop off the edges
    let gradient = 1;
    let dropoff = 0.5;
    let closenessToEdge = 0;
    const distance = position.distanceTo(new Vector2(0, 0));
    if (distance - gradientEdge > 0) {
      closenessToEdge = Math.min(
        1,
        (distance - gradientEdge) / (1 - gradientEdge)
      );
    }
    dropoff *= closenessToEdge;
    gradient = Math.pow(1 - closenessToEdge, 0.1);
    return Math.max(-0.1, value * gradient - dropoff);
  };

  const points: Vector3[] = useMemo(() => {
    prng = new Alea(seed);
    prng.restart();
    const noise2D = createNoise2D(prng);
    const insidePointsCount = 8000;
    const edgePointsCount = 449;
    const size = 2;

    // Start with corner points
    const points = [
      new Vector3(-1, -1, baseNoise(noise2D, -1, -1)),
      new Vector3(1, -1, baseNoise(noise2D, 1, -1)),
      new Vector3(1, 1, baseNoise(noise2D, 1, 1)),
      new Vector3(-1, 1, baseNoise(noise2D, -1, 1)),
    ];

    // Add edges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < edgePointsCount; j++) {
        let x = prng() * size - size / 2;
        let y = prng() * size - size / 2;
        switch (i) {
          case 0:
            y = -1;
            break;
          case 1:
            x = 1;
            break;
          case 2:
            y = 1;
            break;
          case 3:
            x = -1;
            break;
        }
        points.push(new Vector3(x, y, baseNoise(noise2D, x, y)));
      }
    }

    // Fill in the rest
    for (let i = 0; i < insidePointsCount; i++) {
      let x = prng() * size * 0.98 - (size * 0.98) / 2;
      let y = prng() * size * 0.98 - (size * 0.98) / 2;
      points.push(new Vector3(x, y, baseNoise(noise2D, x, y)));
    }

    return points;
  }, [seed, octaves, amplitude, frequency, gradientEdge]);

  const meshIndex: number[] = useMemo(() => {
    // Triangulate
    const delaunayIndex = Delaunator.from(
      points.map((v) => {
        return [v.x, v.y];
      })
    );

    // Create faces
    const meshIndex = [];
    for (let i = 0; i < delaunayIndex.triangles.length; i++) {
      meshIndex.push(delaunayIndex.triangles[i]);
    }

    return meshIndex.reverse();
  }, [points]);

  const colourScale: chroma = useMemo(() => {
    switch (biome) {
      case 0:
        return chroma
          .scale(["dcd39f", "749909", "215322", "152A15", "746354", "FFFFFF"])
          .domain([0.0, 0.1, 0.2, 0.6, 0.95, 1.0])
          .classes(20);
      case 1:
        return chroma
          .scale(["FBD5A2", "F8D0AE", "A06743", "754228", "451304", "FFFFFF"])
          .domain([0.0, 0.1, 0.2, 0.4, 0.9, 1.0])
          .classes(20);
      case 2:
        return chroma
          .scale(["827369", "54596D", "BED6DB", "F4F5F6", "FFFFFF"])
          .domain([0.0, 0.1, 0.4, 0.6, 0.8])
          .classes(20);
    }
  }, [biome]);

  // Set new random values from prng for amplitude and frequency and gradientEdge when seed changes
  useLayoutEffect(() => {
    prng = new Alea(seed);
    prng.restart();
    set({
      biome: Math.round(prng() * 2),
      amplitude: prng() * 0.3 + 0.1,
      frequency: prng() * 0.9 + 0.85,
      gradientEdge: prng() * 0.35 + 0.5,
    });
  }, [seed]);

  // Update geometry with points, faces, and colouring
  useLayoutEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setFromPoints(points);
      geometryRef.current.setIndex(meshIndex);
      geometryRef.current.computeVertexNormals();
      geometryRef.current.copy(geometryRef.current.toNonIndexed());

      // Set colours per face
      const positionAttribute = geometryRef.current.getAttribute("position");
      const colours = [];
      for (let i = 0; i < positionAttribute.count; i += 3) {
        const avgHeightOfFace =
          positionAttribute.getZ(i) +
          positionAttribute.getZ(i + 1) +
          positionAttribute.getZ(i + 2) / 3;
        const [r, g, b] = colourScale(avgHeightOfFace).get("rgb");
        colours.push(r / 255, g / 255, b / 255);
        colours.push(r / 255, g / 255, b / 255);
        colours.push(r / 255, g / 255, b / 255);
      }
      geometryRef.current.setAttribute(
        "color",
        new Float32BufferAttribute(colours, 3)
      );
    }
  }, [seed, biome, octaves, amplitude, frequency, gradientEdge]);

  return (
    <mesh {...props} castShadow={true} receiveShadow={true}>
      <bufferGeometry ref={geometryRef} />
      <meshStandardMaterial flatShading={true} vertexColors={true} />
    </mesh>
  );
}
