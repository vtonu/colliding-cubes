'use client';

// Import necessary hooks and components from React and Three.js libraries
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Define the gradient shader material with uniforms and shaders
const GradientShaderMaterial = {
  uniforms: {
    color1: { value: new THREE.Color('#00ff00') }, // Start color (green)
    color2: { value: new THREE.Color('#000000') }, // End color (black)
  },
  vertexShader: `
    varying vec2 vUv; // Varying UV coordinates for fragment shader
    void main() {
      vUv = uv; // Pass UV coordinates to fragment shader
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // Set the vertex position
    }
  `,
  fragmentShader: `
    uniform vec3 color1; // Start color uniform
    uniform vec3 color2; // End color uniform
    varying vec2 vUv; // Received UV coordinates
    void main() {
      // Interpolate color based on vertical UV coordinate
      vec3 color = mix(color2, color1, vUv.y * 0.9 + 0.1);
      gl_FragColor = vec4(color, 1.0); // Set the fragment color
    }
  `,
};

// Define props for the Cube component
interface CubeProps {
  position: [number, number, number]; // Cube position in 3D space
  size?: number; // Optional size of the cube
}

// Cube component that renders a 3D cube with a gradient shader
function Cube({ position, size = 1 }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null); // Reference to the mesh

  return (
    <mesh ref={meshRef} position={new THREE.Vector3(...position)}>
      <boxGeometry args={[size, size, size]} /> // Cube geometry
      <shaderMaterial attach="material" args={[GradientShaderMaterial]} /> // Apply gradient shader
      material
    </mesh>
  );
}

// Define props for the Connection component
interface ConnectionProps {
  start: THREE.Vector3; // Start point of the connection
  end: THREE.Vector3; // End point of the connection
}

// Connection component that renders a cylinder between two points
function Connection({ start, end }: ConnectionProps) {
  const ref = useRef<THREE.Mesh>(null); // Reference to the mesh

  // Update the connection's scale and position on each frame
  useFrame(() => {
    if (ref.current) {
      const direction = new THREE.Vector3().subVectors(end, start); // Calculate direction vector
      const length = direction.length(); // Get the length of the connection
      ref.current.scale.set(0.03, length, 0.05); // Scale the cylinder based on length
      ref.current.position.copy(start).add(direction.multiplyScalar(0.8)); // Position the connection
      ref.current.lookAt(end); // Orient the cylinder towards the end point
    }
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.05, 0.05, 1, 8]} /> // Cylinder geometry for the connection
      <shaderMaterial attach="material" args={[GradientShaderMaterial]} /> // Apply gradient shader
      material
    </mesh>
  );
}

// Scene component that arranges the cubes and their connections
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
      ] as [number, number, number][], // Predefined positions for the cubes
    [],
  );

  // Create connections between cubes based on their positions
  const connections = useMemo(() => {
    const conns: [THREE.Vector3, THREE.Vector3][] = [];
    // Loop through cube positions to create pairs
    for (let i = 0; i < cubePositions.length; i++) {
      for (let j = i + 1; j < cubePositions.length; j++) {
        conns.push([
          new THREE.Vector3(...cubePositions[i]), // Start point of the connection
          new THREE.Vector3(...cubePositions[j]), // End point of the connection
        ]);
      }
    }
    return conns; // Return array of connections
  }, [cubePositions]);

  return (
    <>
      {cubePositions.map((position, index) => (
        <Cube key={index} position={position} /> // Render each cube
      ))}
      {connections.map(([start, end], index) => (
        <Connection key={`connection-${index}`} start={start} end={end} /> // Render each connection
      ))}
    </>
  );
}

// Main component that sets up the 3D canvas and scene
export default function Component() {
  return (
    <div className="w-[100%] h-[420px] rounded-md overflow-hidden">
      <Canvas camera={{ position: [0, 15, 10], fov: 100 }}>
        {' '}
        {/* Set up the 3D canvas */}
        <color attach="background" args={['#000000']} /> {/* Set background color */}
        <ambientLight intensity={0.5} /> {/* Add ambient light */}
        <pointLight position={[10, 10, 10]} /> {/* Add a point light */}
        <Scene /> {/* Render the scene containing cubes and connections */}
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
