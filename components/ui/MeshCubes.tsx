// Import necessary hooks and components from React and Three.js libraries
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei'; // Import Line from drei
import * as THREE from 'three';

// Define the gradient shader material for cubes
const GradientShaderMaterial = {
  uniforms: {
    time: { value: 0 }, // Add time uniform for animation
    color1: { value: new THREE.Color('#00ff00') }, // Start color (green)
    color2: { value: new THREE.Color('#000000') }, // End color (black)
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    void main() {
      vec3 color = mix(color2, color1, vUv.y * 0.9 + 0.1 + sin(time) * 0.5); // Animate the gradient
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

// Define prop types for Cube component
interface CubeProps {
  position: [number, number, number];
}

// Cube component that renders a 3D cube with a gradient shader
function Cube({ position }: CubeProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime(); // Update time for animation
    }
  });

  return (
    <mesh position={new THREE.Vector3(...position)}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial ref={materialRef} attach="material" args={[GradientShaderMaterial]} />
    </mesh>
  );
}

// Define prop types for CubeWithLine component
interface CubeWithLineProps {
  position: [number, number, number];
}

// CubeWithLine component that renders a cube and a line to the center
function CubeWithLine({ position }: CubeWithLineProps) {
  const centralPoint = new THREE.Vector3(0, 0, 0); // Define the central point
  const lineMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (lineMaterialRef.current) {
      lineMaterialRef.current.uniforms.time.value = state.clock.getElapsedTime(); // Update time for line animation
    }
  });

  return (
    <>
      <Cube position={position} /> {/* Render the cube with gradient shader */}
      <Line
        points={[new THREE.Vector3(...position), centralPoint]} // Start at cube position, end at central point
        lineWidth={2} // Line width
        scale={1} // Scale the line
      >
        <shaderMaterial
          ref={lineMaterialRef}
          attach="material"
          uniforms={{
            time: { value: 0 },
            color1: { value: new THREE.Color('#00ff00') },
            color2: { value: new THREE.Color('#000000') },
          }}
          vertexShader={GradientShaderMaterial.vertexShader}
          fragmentShader={GradientShaderMaterial.fragmentShader}
        />
      </Line>
    </>
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
      ] as [number, number, number][],
    [],
  );

  return (
    <>
      {cubePositions.map((position, index) => (
        <CubeWithLine key={index} position={position} /> // Render each cube with its line
      ))}
    </>
  );
}

// Main component that sets up the 3D canvas and scene
export default function Component() {
  return (
    <div className="w-[100%] h-[420px] rounded-md overflow-hidden">
      <Canvas camera={{ position: [0, 15, 10], fov: 100 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene />
        <OrbitControls enableZoom={true} maxDistance={5} minDistance={1} enablePan={false} />
      </Canvas>
    </div>
  );
}
