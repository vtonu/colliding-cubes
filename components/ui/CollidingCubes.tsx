'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei'; // Import OrbitControls for mouse interaction

interface CubeProps {
  position: [number, number, number];
  size: number;
  color: string;
}

// Cube component that renders each individual 3D cube
const Cube: React.FC<CubeProps> = ({ position, size, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={position}>
      {/* A box geometry for the cube */}
      <boxGeometry args={[size, size, size]} />
      {/* Mesh material with color */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// ConnectingCube component that renders cubes connecting the main cubes
const ConnectingCube: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  size: number;
}> = ({ start, end, size }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const [position, scale, rotation] = useMemo(() => {
    // Find midpoint between the two points
    const midpoint = new THREE.Vector3(
      (start[0] + end[0]) / 1,
      (start[1] + end[1]) / 1,
      (start[2] + end[2]) / 1,
    );
    // Calculate the direction between the two points and its length
    const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
    const length = direction.length();
    // Define scale and rotation based on the start and end points
    const scale: [number, number, number] = [size, size, length];
    const rotation = new THREE.Euler(0, 0, Math.atan2(direction.y, direction.x));

    return [midpoint.toArray(), scale, rotation];
  }, [start, end, size]);

  return (
    <mesh ref={meshRef} position={position} scale={scale} rotation={rotation}>
      {/* Black Boxes Size */}
      <boxGeometry args={[1, 1, 0.2]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

// Main Scene component that contains the rotating group of cubes
const Scene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Define the positions and properties of the cubes
  const cubes: CubeProps[] = useMemo(
    () => [
      // The 2 big cubes left and right
      { position: [-2, 0, 0], size: 1, color: '#00ff33' }, // Green
      { position: [2, 0, 0], size: 1, color: '#00ff33' }, // Green

      // Top Cubes
      { position: [0, 0.2, 0], size: 0.1, color: '#00ff00' }, // Green
      { position: [0, 0.4, 0], size: 0.2, color: '#00ff00' }, // Green
      { position: [0, 0.7, 0], size: 0.3, color: '#00ff00' }, // Green
      { position: [0, 1.1, 0], size: 0.4, color: '#00ff00' }, // Green

      // Bottom Cubes
      { position: [0, -0.2, 0], size: 0.1, color: '#00ff00' }, // Green
      { position: [0, -0.4, 0], size: 0.2, color: '#00ff00' }, // Green
      { position: [0, -0.7, 0], size: 0.3, color: '#00ff00' }, // Green
      { position: [0, -1.1, 0], size: 0.4, color: '#00ff00' }, // Green
    ],
    [],
  );

  // UseFrame hook to update the rotation of the group in each frame
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotating the group around the Z axis
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      {/* A group of cubes that rotates as one */}
      <group ref={groupRef}>
        {/* Render each cube */}
        {cubes.map((cube, index) => (
          <Cube key={index} position={cube.position} size={cube.size} color={cube.color} />
        ))}
        {/* Render connecting cubes */}

        {/* Connecting all, center kinda */}
        <ConnectingCube start={[-0.2, 0, 0]} end={[0.2, 0, 0]} size={0.2} />

        {/* The 2 big cubes left and right */}
        <ConnectingCube start={[0, 0, 0]} end={[-2, 0, 0]} size={1.2} />
        <ConnectingCube start={[0, 0, 0]} end={[2, 0, 0]} size={1.2} />

        {/* Left */}
        <ConnectingCube start={[0, 0, 0]} end={[0.2, 0, 0]} size={0.1} />
        <ConnectingCube start={[0, 0, 0]} end={[0.4, 0, 0]} size={0.1} />
        <ConnectingCube start={[0, 0, 0]} end={[0.6, 0, 0]} size={0.1} />
        <ConnectingCube start={[0, 0, 0]} end={[0.8, 0, 0]} size={0.1} />
        <ConnectingCube start={[0, 0, 0]} end={[1, 0, 0]} size={0.1} />

        {/* Right */}
        <ConnectingCube start={[0, 0, 0]} end={[-0.2, 0, 0]} size={0.1} />
        <ConnectingCube start={[0, 0, 0]} end={[-0.4, 0, 0]} size={0.1} />
        <ConnectingCube start={[0, 0, 0]} end={[-0.6, 0, 0]} size={0.1} />
        <ConnectingCube start={[0, 0, 0]} end={[-0.8, 0, 0]} size={0.1} />
        <ConnectingCube start={[0, 0, 0]} end={[-1, 0, 0]} size={0.1} />
      </group>
      {/* OrbitControls to allow camera rotation with the mouse */}
      <OrbitControls
        enableZoom={true} // Enable zooming
        maxDistance={5} // Maximum zoom distance
        minDistance={1} // Minimum zoom distance
        enablePan={false} // Disable panning
      />
    </>
  );
};

// Main ConnectedCubes component that sets up the canvas
const ConnectedCubes: React.FC = () => {
  return (
    <Canvas
      style={{
        width: '100%',
        height: '420px',
      }}
      className="rounded-md bg-black">
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 55]} intensity={1} />
      <Scene />
    </Canvas>
  );
};

export default ConnectedCubes;
