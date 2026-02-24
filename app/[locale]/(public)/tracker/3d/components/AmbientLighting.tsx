'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AmbientLighting() {
  const pulseRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      // Subtle breathing pulse
      pulseRef.current.intensity = 0.23 + Math.sin(state.clock.elapsedTime * 0.5) * 0.09;
    }
  });

  return (
    <>
      {/* Base ambient — deep space blue (+15%) */}
      <ambientLight intensity={0.14} color="#2d3748" />

      {/* Key light — warm overhead (+15%) */}
      <directionalLight
        position={[10, 18, 8]}
        intensity={0.52}
        color="#e2e8f0"
        castShadow={false}
      />

      {/* Back rim light — cyberpunk purple (+15%) */}
      <pointLight
        position={[0, 8, -20]}
        intensity={0.46}
        color="#7c3aed"
        distance={50}
        decay={2}
      />

      {/* Breathing pulse — center */}
      <pointLight
        ref={pulseRef}
        position={[0, 3, 5]}
        intensity={0.23}
        color="#4a5568"
        distance={30}
        decay={2}
      />

      {/* Low fill from below — illuminates terrain (+15%) */}
      <pointLight
        position={[0, -6, 0]}
        intensity={0.17}
        color="#0891b2"
        distance={25}
        decay={2}
      />

      {/* Side accent — warm orange (+15%) */}
      <pointLight
        position={[-20, 5, 0]}
        intensity={0.17}
        color="#f97316"
        distance={35}
        decay={2}
      />
    </>
  );
}
