'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { VoicePhase } from '@/lib/voice/types';

interface ManemusPresenceProps {
  /** AnalyserNode from Manemus TTS playback — drives audio reactivity */
  analyser: AnalyserNode | null;
  /** Current voice call phase */
  phase: VoicePhase;
  /** Whether the voice call is active */
  active: boolean;
}

/**
 * ManemusPresence — Audio-reactive amber orb representing Manemus's voice
 * in the Awareness Mirror. Positioned to the right of ConsciousnessCore.
 *
 * Layers: inner core + distortion shell + halo + point light
 * Same multi-layer pattern as ConsciousnessCore.
 */
export default function ManemusPresence({ analyser, phase, active }: ManemusPresenceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Audio data buffer (reused each frame)
  const freqData = useMemo(() => new Uint8Array(analyser?.frequencyBinCount ?? 128), [analyser]);

  // Smooth values for lerp-based transitions
  const smoothAmplitude = useRef(0);
  const smoothPresence = useRef(0);
  const smoothRotation = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Target presence: 0 = hidden, 1 = fully visible
    const targetPresence = active ? 1 : 0;
    smoothPresence.current += (targetPresence - smoothPresence.current) * 0.04;

    // Fade the group
    if (groupRef.current) {
      groupRef.current.visible = smoothPresence.current > 0.01;
      // Float animation
      groupRef.current.position.y = 1.5 + Math.sin(t * 0.5) * 0.15 * smoothPresence.current;
    }

    // Read audio data
    let amplitude = 0;
    let centroid = 0;
    if (analyser && phase === 'speaking') {
      analyser.getByteFrequencyData(freqData);
      let sum = 0;
      let weightedSum = 0;
      for (let i = 0; i < freqData.length; i++) {
        const val = freqData[i] / 255;
        sum += val;
        weightedSum += val * i;
      }
      amplitude = sum / freqData.length;
      centroid = sum > 0 ? weightedSum / sum / freqData.length : 0.5;
    }

    // Smooth the amplitude
    const ampTarget = phase === 'speaking' ? amplitude : (phase === 'processing' ? 0.15 : 0.05);
    smoothAmplitude.current += (ampTarget - smoothAmplitude.current) * 0.15;
    const amp = smoothAmplitude.current;

    // Rotation speed based on frequency centroid + phase
    const rotTarget = phase === 'processing' ? 1.5 : (phase === 'speaking' ? 0.3 + centroid * 2 : 0.1);
    smoothRotation.current += (rotTarget - smoothRotation.current) * 0.05;

    const presence = smoothPresence.current;

    // ── Core orb ──
    if (coreRef.current) {
      const scale = (0.3 + amp * 0.15) * presence;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.rotation.y += smoothRotation.current * 0.01;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;

      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = (0.5 + amp * 0.4) * presence;
      }
    }

    // ── Distortion shell ──
    if (shellRef.current) {
      const shellScale = (0.5 + amp * 0.25) * presence;
      shellRef.current.scale.setScalar(shellScale);
      shellRef.current.rotation.y += smoothRotation.current * 0.005;

      const mat = shellRef.current.material as THREE.MeshStandardMaterial & { distort?: number; speed?: number };
      if ('distort' in mat) {
        mat.distort = 0.15 + amp * 0.35;
      }
      if ('speed' in mat) {
        mat.speed = 1 + amp * 4;
      }
      if (mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = 0.3 + amp * 1.2;
      }
      if (mat.opacity !== undefined) {
        mat.opacity = (0.15 + amp * 0.15) * presence;
      }
    }

    // ── Halo ──
    if (haloRef.current) {
      const haloScale = (1.2 + amp * 0.6) * presence;
      haloRef.current.scale.setScalar(haloScale);
      haloRef.current.rotation.y = -t * 0.01;
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = (0.04 + amp * 0.06) * presence;
      }
    }

    // ── Point light ──
    if (lightRef.current) {
      lightRef.current.intensity = (0.3 + amp * 1.5) * presence;
    }
  });

  // Amber/gold color palette
  const coreColor = '#f59e0b';
  const shellColor = '#d97706';
  const emissiveColor = '#92400e';

  return (
    <group ref={groupRef} position={[3, 1.5, -2]}>
      {/* Inner core — bright amber */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color={coreColor}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Distortion shell — MeshDistortMaterial for organic movement */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={shellColor}
          emissive={emissiveColor}
          emissiveIntensity={0.3}
          distort={0.15}
          speed={1}
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Halo — soft outer glow */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={coreColor}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ambient light emission */}
      <pointLight
        ref={lightRef}
        color={coreColor}
        intensity={0.3}
        distance={15}
        decay={2}
      />
    </group>
  );
}
