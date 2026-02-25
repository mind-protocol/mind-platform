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
 * Central consciousness sphere — translucent, diffuse, glowing, with halo and reverberation.
 *
 * Multiple concentric layers:
 * - Inner ember: tiny bright core
 * - Mid sphere: translucent distorted volume
 * - Outer halo: large, very faint glow shell
 * - Reverberation rings: pulsing echo rings that expand outward
 * - Energy envelope: body battery wireframe
 */
export default function ConsciousnessCore({ awareness }: CoreProps) {
  const midRef = useRef<THREE.Mesh>(null);
  const emberRef = useRef<THREE.Mesh>(null);
  const halo1Ref = useRef<THREE.Mesh>(null);
  const halo2Ref = useRef<THREE.Mesh>(null);
  const reverb1Ref = useRef<THREE.Mesh>(null);
  const reverb2Ref = useRef<THREE.Mesh>(null);
  const reverb3Ref = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const colorRef = useRef(new THREE.Color('#4a5568'));
  const emissiveRef = useRef(new THREE.Color('#1a1a2e'));

  const targetColor = useMemo(() => {
    const s = awareness.substances;
    const c = new THREE.Color('#2d3748');

    if (s.thc > 0.05) c.lerp(new THREE.Color('#22c55e'), s.thc * 0.4);
    if (s.ketamine > 0.05) c.lerp(new THREE.Color('#8b5cf6'), s.ketamine * 0.5);
    if (s.lsd > 0.05) c.lerp(new THREE.Color('#ec4899'), s.lsd * 0.6);
    if (s.nicotine > 0.05) c.lerp(new THREE.Color('#f59e0b'), s.nicotine * 0.3);
    if (s.melatonin > 0.05) c.lerp(new THREE.Color('#6366f1'), s.melatonin * 0.3);
    if (s.prazepam > 0.05) c.lerp(new THREE.Color('#94a3b8'), s.prazepam * 0.3);
    if (s.venlafaxine > 0.05) c.lerp(new THREE.Color('#14b8a6'), s.venlafaxine * 0.2);
    if (s.sertraline > 0.05) c.lerp(new THREE.Color('#06b6d4'), s.sertraline * 0.2);
    if (s.cyamemazine > 0.05) c.lerp(new THREE.Color('#7e22ce'), s.cyamemazine * 0.4);

    return c;
  }, [awareness.substances]);

  const smoothPointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pointer = state.pointer;

    smoothPointer.current.lerp(pointer, 0.08);
    const px = smoothPointer.current.x;
    const py = smoothPointer.current.y;
    const cursorDist = Math.sqrt(px * px + py * py);

    colorRef.current.lerp(targetColor, 0.02);

    const bpm = awareness.hr ?? 65;
    const pulseRate = bpm / 60;
    const pulse = 1 + Math.sin(t * pulseRate * Math.PI * 2) * 0.06 * (1 + awareness.alterationDepth * 0.5);

    const stressGlow = awareness.stress != null ? awareness.stress / 100 : 0.3;

    // === Mid sphere: translucent distorted core ===
    if (midRef.current) {
      const baseScale = 1.0 + awareness.alterationDepth * 0.6;
      const cursorInfluence = 1 + cursorDist * 0.1;
      midRef.current.scale.setScalar(baseScale * pulse * cursorInfluence);

      const leanStrength = 0.15 + awareness.psychedelicLoad * 0.2;
      midRef.current.rotation.x = -py * leanStrength;
      midRef.current.rotation.z = px * leanStrength;

      const mat = midRef.current.material as THREE.MeshStandardMaterial & { distort?: number; speed?: number };
      if (mat.color) mat.color.copy(colorRef.current);
      if (mat.emissive) {
        emissiveRef.current.copy(colorRef.current).multiplyScalar(0.5 + awareness.psychedelicLoad * 0.5 + cursorDist * 0.2);
        mat.emissive.copy(emissiveRef.current);
      }
      if ('distort' in mat) {
        mat.distort = 0.2 + awareness.psychedelicLoad * 0.4 + awareness.sedativeLoad * 0.1 + cursorDist * 0.1;
      }
      if ('speed' in mat) {
        mat.speed = 1.5 + awareness.psychedelicLoad * 3 + cursorDist * 2;
      }
    }

    // === Inner ember: bright hot core ===
    if (emberRef.current) {
      emberRef.current.scale.setScalar((0.25 + stressGlow * 0.15) * pulse);
      emberRef.current.rotation.y = t * 0.15 + px * 0.5;
      emberRef.current.rotation.x = Math.sin(t * 0.07) * 0.2 + py * 0.3;
      const mat = emberRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = 0.4 + stressGlow * 0.4 + awareness.alterationDepth * 0.2;
      }
    }

    // === Halo layers: diffuse glow shells ===
    const halos = [
      { ref: halo1Ref, baseScale: 2.2, opacityBase: 0.06, rotSpeed: 0.008 },
      { ref: halo2Ref, baseScale: 3.5, opacityBase: 0.03, rotSpeed: -0.005 },
    ];
    for (const h of halos) {
      if (h.ref.current) {
        const haloPulse = 1 + Math.sin(t * 0.4 + h.baseScale) * 0.08;
        h.ref.current.scale.setScalar(h.baseScale * haloPulse * pulse);
        h.ref.current.rotation.y = t * h.rotSpeed + px * 0.05;
        h.ref.current.rotation.x = t * h.rotSpeed * 0.7 + py * 0.04;
        const mat = h.ref.current.material as THREE.MeshBasicMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity = h.opacityBase + awareness.alterationDepth * 0.04 + cursorDist * 0.02;
        }
      }
    }

    // === Reverberation rings: expanding echo pulses ===
    const reverbs = [reverb1Ref, reverb2Ref, reverb3Ref];
    for (let i = 0; i < reverbs.length; i++) {
      const ref = reverbs[i];
      if (ref.current) {
        // Each ring cycles on a different phase, expanding then fading
        const cycleSpeed = 0.25 + awareness.alterationDepth * 0.15;
        const phase = (t * cycleSpeed + (i / 3) * Math.PI * 2) % (Math.PI * 2);
        const progress = phase / (Math.PI * 2); // 0 to 1
        const reverbScale = 1.5 + progress * 4;
        const reverbOpacity = (1 - progress) * (0.06 + awareness.alterationDepth * 0.04);

        ref.current.scale.setScalar(reverbScale * pulse);
        ref.current.rotation.x = Math.PI / 2 + py * 0.08;
        ref.current.rotation.z = px * 0.06;

        const mat = ref.current.material as THREE.MeshBasicMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity = Math.max(0, reverbOpacity);
        }
      }
    }

    // === Energy envelope ===
    if (shellRef.current) {
      const bb = awareness.bodyBattery != null ? awareness.bodyBattery / 100 : 0.5;
      shellRef.current.scale.setScalar(2.5 + bb * 0.5);
      shellRef.current.rotation.y = -t * 0.02 + px * 0.1;
      shellRef.current.rotation.z = t * 0.015 + py * 0.08;
      const mat = shellRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = 0.02 + bb * 0.04 + cursorDist * 0.02;
      }
    }
  });

  return (
    <group>
      {/* Mid sphere: translucent distorted volume */}
      <mesh ref={midRef}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#4a5568"
          emissive="#1a1a2e"
          emissiveIntensity={0.5}
          distort={0.2}
          speed={1.5 + awareness.psychedelicLoad * 3}
          roughness={0.8}
          metalness={0.05}
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Inner ember — bright concentrated core */}
      <mesh ref={emberRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color={awareness.stress != null && awareness.stress > 50 ? '#ef4444' : '#818cf8'}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Halo layer 1 — close diffuse glow */}
      <mesh ref={halo1Ref}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial
          color={colorRef.current}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Halo layer 2 — far diffuse aura */}
      <mesh ref={halo2Ref}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={colorRef.current}
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Reverberation ring 1 */}
      <mesh ref={reverb1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial
          color={colorRef.current}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Reverberation ring 2 */}
      <mesh ref={reverb2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial
          color={colorRef.current}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Reverberation ring 3 */}
      <mesh ref={reverb3Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial
          color={colorRef.current}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Energy envelope — body battery shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          roughness={0}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Central consciousness light — brighter emanation */}
      <pointLight
        color={colorRef.current}
        intensity={1.0 + awareness.alterationDepth * 2.0}
        distance={20}
        decay={2}
      />

      {/* Soft wide fill light for halo visibility */}
      <pointLight
        color={colorRef.current}
        intensity={0.3 + awareness.alterationDepth * 0.5}
        distance={35}
        decay={1.5}
      />
    </group>
  );
}
