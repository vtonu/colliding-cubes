'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const GradientShaderMaterial = {
  uniforms: {
    color1: { value: new THREE.Color('#00ff00') },
    color2: { value: new THREE.Color('#000000') },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    void main() {
      vec3 color = mix(color2, color1, vUv.y * 0.9 + 0.1);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

interface CubeProps {
  position: [number, number, number];
  size?: number;
}

function Cube({ position, size = 1 }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={new THREE.Vector3(...position)}>
      <boxGeometry args={[size, size, size]} />
      <shaderMaterial attach="material" args={[GradientShaderMaterial]} />
    </mesh>
  );
}

interface ConnectionProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
}

function Connection({ start, end }: ConnectionProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      ref.current.scale.set(0.03, length, 0.05); // Adjusted size
      ref.current.position.copy(start).add(direction.multiplyScalar(0.8));
      ref.current.lookAt(end);
    }
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
      <shaderMaterial attach="material" args={[GradientShaderMaterial]} />
    </mesh>
  );
}

function Scene() {
  const cubePositions = useMemo(
    () =>
      [
        [-2, 2, 0],
        [2, 2, 0],
        [-2, -2, 0],
        [2, -2, 0],
        [0, 0, 2],
        [0, 0, -2],
      ] as [number, number, number][],
    [],
  );

  const connections = useMemo(() => {
    const conns: [THREE.Vector3, THREE.Vector3][] = [];
    // Connections between green cubes
    for (let i = 0; i < cubePositions.length; i++) {
      for (let j = i + 1; j < cubePositions.length; j++) {
        conns.push([
          new THREE.Vector3(...cubePositions[i]),
          new THREE.Vector3(...cubePositions[j]),
        ]);
      }
    }
    return conns;
  }, [cubePositions]);

  return (
    <>
      {cubePositions.map((position, index) => (
        <Cube key={index} position={position} />
      ))}
      {connections.map(([start, end], index) => (
        <Connection key={`connection-${index}`} start={start} end={end} />
      ))}
    </>
  );
}

export default function Component() {
  return (
    <div className="w-[100%] h-[420px] rounded-md overflow-hidden">
      <Canvas camera={{ position: [0, 15, 10], fov: 100 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene />
        <OrbitControls
          enableZoom={true} // Enable zooming
          maxDistance={5} // Maximum zoom distance
          minDistance={1} // Minimum zoom distance
          enablePan={false} // Disable panning
        />
      </Canvas>
    </div>
  );
}
