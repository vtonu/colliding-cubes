'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function StrawberryVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Set background to black

    const camera = new THREE.PerspectiveCamera(50, 600 / 250, 0.1, 1000);
    camera.position.set(-45, -45, -45); // Camera position

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(600, 250); // Set renderer size

    // Initialize orbit controls for interactive camera movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth movement
    controls.maxDistance = 10;
    controls.minDistance = 0.5;

    // Function to create strawberry dots
    const createStrawberryDots = () => {
      const strawberryDotGeometry = new THREE.BufferGeometry();
      const strawberryDotMaterial = new THREE.PointsMaterial({ size: 0.01, vertexColors: true });

      const strawberryDotPositions = [];
      const strawberryDotColors = [];
      const strawberryColor = new THREE.Color();

      for (let i = 0; i < 2000; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        let x = Math.sin(phi) * Math.cos(theta);
        let y = Math.cos(phi);
        let z = Math.sin(phi) * Math.sin(theta);

        // Adjust shape to resemble a strawberry
        y = y * 1.2 - 0.1;
        const r = Math.sqrt(x * x + z * z);
        y *= 1 - r * 0.5; // Taper bottom part

        if (y < 0) {
          x *= 1.2;
          z *= 1.2;
        }
        if (y > 0) {
          x *= 1.2;
          z *= 1.2;
        }

        strawberryDotPositions.push(x * 0.8, y, z * 0.8);

        // Set color from red to dark red
        const hue = 0; // Red
        const saturation = 1;
        const lightness = Math.random() * 0.3 + 0.3;
        strawberryColor.setHSL(hue, saturation, lightness);

        strawberryDotColors.push(strawberryColor.r, strawberryColor.g, strawberryColor.b);
      }

      // Assign positions and colors to geometry
      strawberryDotGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(strawberryDotPositions, 3),
      );
      strawberryDotGeometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(strawberryDotColors, 3),
      );

      return new THREE.Points(strawberryDotGeometry, strawberryDotMaterial);
    };

    // Function to create leaves
    const createLeaves = () => {
      const leafDotGeometry = new THREE.BufferGeometry();
      const leafDotMaterial = new THREE.PointsMaterial({ size: 0.015, vertexColors: true });

      const leafDotPositions = [];
      const leafDotColors = [];
      const leafColor = new THREE.Color();

      // Create main leaves with star-like pattern
      for (let i = 0; i < 1000; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.6;
        const height = Math.random() * 0.2;

        const leafCount = 7;
        const leafAngle =
          Math.floor(angle / ((Math.PI * 2) / leafCount)) * ((Math.PI * 2) / leafCount);

        const x = radius * Math.cos(leafAngle) * 1.5;
        const y = height + 0.8;
        const z = radius * Math.sin(leafAngle) * 1.5;

        leafDotPositions.push(x, y, z);

        // Set leaf color from light green to dark green
        const hue = 0.3; // Green
        const saturation = 0.8;
        const lightness = Math.random() * 0.3 + 0.3;
        leafColor.setHSL(hue, saturation, lightness);

        leafDotColors.push(leafColor.r, leafColor.g, leafColor.b);
      }

      // Create smaller, random leaves
      for (let i = 0; i < 1000; i++) {
        const angle = Math.random() * Math.PI * 45;
        const radius = Math.random() * 0.5;
        const height = Math.random() * 0.5;
        const x = radius * Math.cos(angle) * 1.2;
        const y = height + 0.8;
        const z = radius * Math.sin(angle) * 1.2;

        leafDotPositions.push(x, y, z);

        // Reuse leaf color settings
        const hue = 0.3;
        const saturation = 0.8;
        const lightness = Math.random() * 0.3 + 0.3;
        leafColor.setHSL(hue, saturation, lightness);

        leafDotColors.push(leafColor.r, leafColor.g, leafColor.b);
      }

      // Assign positions and colors to geometry
      leafDotGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(leafDotPositions, 3),
      );
      leafDotGeometry.setAttribute('color', new THREE.Float32BufferAttribute(leafDotColors, 3));

      return new THREE.Points(leafDotGeometry, leafDotMaterial);
    };

    // Add strawberry dots and leaves to scene
    const strawberryDots = createStrawberryDots();
    const leafDots = createLeaves();
    scene.add(strawberryDots);
    scene.add(leafDots);

    // Animation loop
    const animate = () => {
      setTimeout(() => {
        requestAnimationFrame(animate);
        strawberryDots.rotation.y += 0.005;
        leafDots.rotation.y += 0.005;
        controls.update();
        renderer.render(scene, camera);
      }, 1000 / 30); // 30 FPS
    };

    animate(); // Start animation

    // Handle window resize
    const handleResize = () => {
      camera.aspect = 600 / 250;
      camera.updateProjectionMatrix();
      renderer.setSize(600, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render canvas for the 3D visualization
  return (
    <div
      style={{
        width: '100%',
        height: '420px',
      }}
      className="rounded-md bg-black flex justify-center items-center">
      <canvas ref={canvasRef} />
    </div>
  );
}
