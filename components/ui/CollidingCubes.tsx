'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CubeProps {
  position: [number, number, number];
  size: number;
  color: string;
}

const Cube: React.FC<CubeProps> = ({ position, size, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const ConnectingCube: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  size: number;
}> = ({ start, end, size }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const [position, scale, rotation] = useMemo(() => {
    const midpoint = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    );
    const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
    const length = direction.length();
    const scale: [number, number, number] = [size, size, length];
    const rotation = new THREE.Euler(0, 0, Math.atan2(direction.y, direction.x));

    return [midpoint.toArray(), scale, rotation];
  }, [start, end, size]);

  return (
    <mesh ref={meshRef} position={position} scale={scale} rotation={rotation}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#008000" />
    </mesh>
  );
};

const Scene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const cubes: CubeProps[] = useMemo(
    () => [
      { position: [-2, 0, 0], size: 1.5, color: '#00ff00' },
      { position: [2, 0, 0], size: 1.5, color: '#00cc00' },
      { position: [0, 2, 0], size: 1.5, color: '#009900' },
    ],
    [],
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.9;
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime) * 1;
      groupRef.current.position.y = Math.cos(state.clock.elapsedTime) * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {cubes.map((cube, index) => (
        <Cube key={index} {...cube} />
      ))}
      <ConnectingCube start={cubes[0].position} end={cubes[1].position} size={0.8} />
      <ConnectingCube start={cubes[1].position} end={cubes[2].position} size={0.1} />
      <ConnectingCube start={cubes[2].position} end={cubes[0].position} size={0.1} />
    </group>
  );
};

const ConnectedCubes: React.FC = () => {
  return (
    <div className="border-lg w-[690px] h-[420px] bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 100 }}>
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 30, 10]} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default ConnectedCubes;
