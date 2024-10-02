'use client';

import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Plane, useTexture } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Extend THREE to use PointsMaterial (which isn't part of React Three Fiber by default)
extend({ PointsMaterial: THREE.PointsMaterial });

interface ParticleEdgesProps {
  geometry: THREE.BufferGeometry;
}

// Component to render a particle cloud around the X-shape
function ParticleCloud({ count = 500, radius = 5 }) {
  const particles = useRef<THREE.Points>(null!); // Reference for particle cloud to animate later

  // Memoize particle cloud positions to optimize performance
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  // Animate particle cloud rotation to create a floating effect
  useFrame((state, delta) => {
    particles.current.rotation.x += delta * 0.05;
    particles.current.rotation.y += delta * 0.075;
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="white" transparent opacity={0.6} />{' '}
      {/* Semi-transparent white particles */}
    </points>
  );
}

// Main component that renders the X-shape using intersecting wireframe boxes
function XShape() {
  const groupRef = useRef<THREE.Group>(null!); // Reference for the group of objects to animate later
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(4, 0.4, 0.4), []); // Box geometry for the X-shape

  // Animate the entire X-shape rotation over time
  useFrame((state, delta) => {
    groupRef.current.rotation.x += delta * 0.1;
    groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* First box for the X, rotated by 45 degrees */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[4, 0.4, 0.4]} />
        <meshBasicMaterial color="darkgray" wireframe /> {/* Lime color, wireframe mode */}
      </mesh>
      {/* Second box for the X, rotated by -45 degrees */}
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[4, 0.4, 0.4]} />
        <meshBasicMaterial color="darkgray" wireframe />
      </mesh>
      {/* Add particle effects along the edges and a surrounding particle cloud */}

      <ParticleCloud count={500} radius={5} />
    </group>
  );
}

// Ground component that renders an image (universe.jpg) as a plane under the X-shape
function Ground() {
  const texture = useTexture('./universe.jpg'); // Load the universe texture
  return (
    <Plane args={[10, 10]} rotation-x={-Math.PI / 2} position={[0, -2, 0]} receiveShadow>
      <meshStandardMaterial map={texture} /> {/* Apply texture to the ground */}
    </Plane>
  );
}

// Main component to render the entire scene
export default function Component() {
  return (
    <div
      style={{
        width: '100%',
        height: '420px',
      }}
      className="rounded-md bg-black flex justify-center items-center">
      <Canvas camera={{ position: [0, 15, 0] }} shadows>
        {/* Render the rotating X-shape and ground */}
        <XShape />
        <Ground />
        {/* Add lighting and controls */}
        <pointLight position={[5, 5, 5]} intensity={1} castShadow />
        <ambientLight intensity={0.2} />
        <OrbitControls enableZoom={true} maxDistance={12} minDistance={5} />{' '}
        {/* Controls for rotating and zooming */}
      </Canvas>
    </div>
  );
}
