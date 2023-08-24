import React, { useRef, useEffect, useMemo } from "react";
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

  const baseNoise = (x: number, y: number) => {
    const position = new Vector2(x, y);
    let adjustedAmp = amplitude;
    let adjustedFreq = frequency;
    let value = 0;
    for (let i = 0; i < octaves; i++) {
      value +=
        adjustedAmp *
        Math.abs(noise2D((x + 1) * adjustedFreq, (y + 1) * adjustedFreq));
      adjustedAmp *= 0.5;
      adjustedFreq *= 2;
    }
    const distance = position.distanceTo(new Vector2(0, 0));
    const gradient = Math.pow(
      Math.max(0, gradientEdge - distance),
      gradientSharpness
    );
    return value * gradient;
  };

  const [
    {
      seed,
      biome,
      octaves,
      amplitude,
      frequency,
      gradientSharpness,
      gradientEdge,
    },
    set,
  ] = useControls(() => ({
    seed: {
      value: props.seed,
    },
    biome: {
      value: 0,
      min: 0,
      max: 1,
      step: 1,
    },
    octaves: {
      value: 3,
      min: 1,
      max: 8,
      step: 1,
    },
    amplitude: {
      value: 0.65,
      min: 0.2,
      max: 1,
      step: 0.01,
    },
    frequency: {
      value: 0.5,
      min: 0.15,
      max: 1,
      step: 0.01,
    },
    gradientSharpness: {
      value: 1.2,
      min: 0.5,
      max: 2,
      step: 0.01,
    },
    gradientEdge: {
      value: 1.0,
      min: 0.5,
      max: 0.85,
      step: 0.01,
    },
  }));

  const prng = useMemo(() => new Alea(seed), [seed]);
  const noise2D = createNoise2D(prng);

  const points: Vector3[] = useMemo(() => {
    prng.restart();

    const insidePointsCount = 8000;
    const edgePointsCount = 449;
    const size = 2;

    // Start with corner points
    const points = [
      new Vector3(-1, -1, baseNoise(-1, -1)),
      new Vector3(1, -1, baseNoise(1, -1)),
      new Vector3(1, 1, baseNoise(1, 1)),
      new Vector3(-1, 1, baseNoise(-1, 1)),
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
        points.push(new Vector3(x, y, baseNoise(x, y)));
      }
    }

    // Fill in the rest
    for (let i = 0; i < insidePointsCount; i++) {
      let x = prng() * size * 0.98 - (size * 0.98) / 2;
      let y = prng() * size * 0.98 - (size * 0.98) / 2;
      points.push(new Vector3(x, y, baseNoise(x, y)));
    }

    return points;
  }, [seed, octaves, amplitude, frequency, gradientSharpness, gradientEdge]);

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
          .domain([0.3, 0.4, 0.5, 0.7, 0.8, 1.0]);
      case 1:
        return chroma
          .scale(["F2DEB9", "DAA46D", "9C4F20", "746354", "FFFFFF"])
          .domain([0.3, 0.4, 0.5, 0.6, 1.0]);
    }
  }, [biome]);

  // Set new random values from prng for amplitude and frequency and gradientEdge and gradientSharpness when seed changes
  useEffect(() => {
    set({
      biome: prng() > 0.5 ? 0 : 1,
      amplitude: prng() * 0.8 + 0.2,
      frequency: prng() * 0.85 + 0.15,
      gradientEdge: prng() * 0.35 + 0.5,
      gradientSharpness: prng() * 1.5 + 0.5,
    });
  }, [seed]);

  // Update geometry with points, faces, and colouring
  useEffect(() => {
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
  }, [
    seed,
    biome,
    octaves,
    amplitude,
    frequency,
    gradientSharpness,
    gradientEdge,
  ]);

  return (
    <mesh {...props} castShadow={true} receiveShadow={true}>
      <bufferGeometry ref={geometryRef} />
      <meshStandardMaterial flatShading={true} vertexColors={true} />
    </mesh>
  );
}
