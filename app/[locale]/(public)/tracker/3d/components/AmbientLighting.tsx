'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AmbientLighting() {
  const pulseRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      // Subtle breathing pulse
      pulseRef.current.intensity = 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <>
      {/* Base ambient — deep space blue */}
      <ambientLight intensity={0.12} color="#2d3748" />

      {/* Key light — warm overhead */}
      <directionalLight
        position={[10, 18, 8]}
        intensity={0.45}
        color="#e2e8f0"
        castShadow={false}
      />

      {/* Back rim light — cyberpunk purple */}
      <pointLight
        position={[0, 8, -20]}
        intensity={0.4}
        color="#7c3aed"
        distance={50}
        decay={2}
      />

      {/* Breathing pulse — center */}
      <pointLight
        ref={pulseRef}
        position={[0, 3, 5]}
        intensity={0.2}
        color="#4a5568"
        distance={30}
        decay={2}
      />

      {/* Low fill from below — illuminates terrain */}
      <pointLight
        position={[0, -6, 0]}
        intensity={0.15}
        color="#0891b2"
        distance={25}
        decay={2}
      />

      {/* Side accent — warm orange (food/energy spectrum) */}
      <pointLight
        position={[-20, 5, 0]}
        intensity={0.15}
        color="#f97316"
        distance={35}
        decay={2}
      />
    </>
  );
}
