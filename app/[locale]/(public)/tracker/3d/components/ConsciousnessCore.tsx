'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { AwarenessState } from '@/lib/tracker/pharmacokinetics';

interface CoreProps {
  awareness: AwarenessState;
}

/**
 * Central consciousness sphere — the core of the awareness mirror.
 *
 * Morphs based on combined state:
 * - Size pulses with heart rate
 * - Distortion increases with psychedelic load
 * - Color shifts based on dominant substance
 * - Opacity reflects alteration depth
 * - Inner core glows brighter under stress
 */
export default function ConsciousnessCore({ awareness }: CoreProps) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const colorRef = useRef(new THREE.Color('#4a5568'));
  const emissiveRef = useRef(new THREE.Color('#1a1a2e'));

  // Compute target color based on dominant substance + blending
  const targetColor = useMemo(() => {
    const s = awareness.substances;
    const c = new THREE.Color('#2d3748'); // Base: dark slate

    // Blend substance colors by intensity
    if (s.thc > 0.05) c.lerp(new THREE.Color('#22c55e'), s.thc * 0.4);
    if (s.ketamine > 0.05) c.lerp(new THREE.Color('#8b5cf6'), s.ketamine * 0.5);
    if (s.lsd > 0.05) c.lerp(new THREE.Color('#ec4899'), s.lsd * 0.6);
    if (s.nicotine > 0.05) c.lerp(new THREE.Color('#f59e0b'), s.nicotine * 0.3);
    if (s.melatonin > 0.05) c.lerp(new THREE.Color('#6366f1'), s.melatonin * 0.3);
    if (s.prazepam > 0.05) c.lerp(new THREE.Color('#94a3b8'), s.prazepam * 0.3);
    if (s.venlafaxine > 0.05) c.lerp(new THREE.Color('#14b8a6'), s.venlafaxine * 0.2);
    if (s.cyamemazine > 0.05) c.lerp(new THREE.Color('#7e22ce'), s.cyamemazine * 0.4);

    return c;
  }, [awareness.substances]);

  // Smoothed pointer for fluid motion
  const smoothPointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pointer = state.pointer; // -1 to 1 normalized

    // Smooth the pointer (lerp toward actual position)
    smoothPointer.current.lerp(pointer, 0.08);
    const px = smoothPointer.current.x;
    const py = smoothPointer.current.y;

    // Cursor distance from center (0-1.414)
    const cursorDist = Math.sqrt(px * px + py * py);

    // Smooth color transition
    colorRef.current.lerp(targetColor, 0.02);

    // HR-based pulse (default 60bpm if no data)
    const bpm = awareness.hr ?? 65;
    const pulseRate = bpm / 60; // beats per second
    const pulse = 1 + Math.sin(t * pulseRate * Math.PI * 2) * 0.04 * (1 + awareness.alterationDepth * 0.5);

    // Stress affects inner glow intensity
    const stressGlow = awareness.stress != null ? awareness.stress / 100 : 0.3;

    if (outerRef.current) {
      const baseScale = 1.2 + awareness.alterationDepth * 0.8;
      // Cursor proximity makes the core breathe larger
      const cursorInfluence = 1 + cursorDist * 0.08;
      outerRef.current.scale.setScalar(baseScale * pulse * cursorInfluence);

      // Core leans toward cursor — subtle tilt
      const leanStrength = 0.15 + awareness.psychedelicLoad * 0.2;
      outerRef.current.rotation.x = -py * leanStrength;
      outerRef.current.rotation.z = px * leanStrength;

      const mat = outerRef.current.material as THREE.MeshStandardMaterial & { distort?: number; speed?: number };
      if (mat.color) mat.color.copy(colorRef.current);
      if (mat.emissive) {
        emissiveRef.current.copy(colorRef.current).multiplyScalar(0.3 + awareness.psychedelicLoad * 0.4 + cursorDist * 0.15);
        mat.emissive.copy(emissiveRef.current);
      }
      if ('distort' in mat) {
        // Distortion increases as cursor moves away from center
        mat.distort = 0.15 + awareness.psychedelicLoad * 0.5 + awareness.sedativeLoad * 0.1 + cursorDist * 0.1;
      }
      if ('speed' in mat) {
        // Morph speed responds to cursor movement
        mat.speed = 1.5 + awareness.psychedelicLoad * 3 + cursorDist * 2;
      }
    }

    if (innerRef.current) {
      innerRef.current.scale.setScalar((0.4 + stressGlow * 0.3) * pulse);
      // Inner core tracks cursor more directly
      innerRef.current.rotation.y = t * 0.1 + px * 0.5;
      innerRef.current.rotation.x = Math.sin(t * 0.07) * 0.2 + py * 0.3;
      const mat = innerRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = 0.2 + stressGlow * 0.4 + awareness.alterationDepth * 0.2 + cursorDist * 0.1;
      }
    }

    // Outer shell — represents body battery / energy envelope
    if (shellRef.current) {
      const bb = awareness.bodyBattery != null ? awareness.bodyBattery / 100 : 0.5;
      shellRef.current.scale.setScalar(2.0 + bb * 0.5);
      shellRef.current.rotation.y = -t * 0.02 + px * 0.1;
      shellRef.current.rotation.z = t * 0.015 + py * 0.08;
      const mat = shellRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = 0.03 + bb * 0.06 + cursorDist * 0.02;
      }
    }
  });

  return (
    <group>
      {/* Outer morphing consciousness sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#4a5568"
          emissive="#1a1a2e"
          emissiveIntensity={0.3}
          distort={0.2}
          speed={1.5 + awareness.psychedelicLoad * 3}
          roughness={0.5 - awareness.psychedelicLoad * 0.3}
          metalness={0.2 + awareness.psychedelicLoad * 0.4}
          transparent
          opacity={0.6 + awareness.alterationDepth * 0.2}
        />
      </mesh>

      {/* Inner stress/awareness core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color={awareness.stress != null && awareness.stress > 50 ? '#ef4444' : '#818cf8'}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Energy envelope — body battery shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          roughness={0}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Central light — consciousness emanation */}
      <pointLight
        color={colorRef.current}
        intensity={0.5 + awareness.alterationDepth * 1.5}
        distance={15}
        decay={2}
      />
    </group>
  );
}
