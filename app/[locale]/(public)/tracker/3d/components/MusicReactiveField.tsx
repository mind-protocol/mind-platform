'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { StemLevels } from '@/lib/tracker/hooks/useMusicAudioAnalysis';

interface MusicFieldProps {
  stemsRef: React.RefObject<StemLevels>;
}

const BASS_COLOR = new THREE.Color(0x4c1d95);    // deep purple
const BASS_GLOW = new THREE.Color(0x7c3aed);     // bright purple
const DRUM_COLOR = new THREE.Color(0x06b6d4);     // cyan
const MELODY_COLOR = new THREE.Color(0x8b5cf6);   // violet
const HARMONY_COLOR = new THREE.Color(0x3b82f6);  // blue
const _tmpColor = new THREE.Color();

/**
 * MusicReactiveField — 3D visualization of pseudo-stem analysis.
 *
 * Positioned around ConsciousnessCore:
 * - Bass: pulsing torus at the base
 * - Drums: burst particles on transients
 * - Melody: orbiting ribbon that shifts with pitch
 * - Harmony: ambient glow sphere that breathes with richness
 */
export default function MusicReactiveField({ stemsRef }: MusicFieldProps) {
  return (
    <group>
      <BassRing stemsRef={stemsRef} />
      <DrumBursts stemsRef={stemsRef} />
      <MelodyOrbit stemsRef={stemsRef} />
      <HarmonyAura stemsRef={stemsRef} />
      <MusicAmbientLight stemsRef={stemsRef} />
    </group>
  );
}

// ── Bass Ring ─────────────────────────────────────────────────────────────
// Torus at the base that scales and pulses with bass
function BassRing({ stemsRef }: MusicFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const bass = stemsRef.current?.bass || 0;
    const t = state.clock.elapsedTime;

    // Scale pulses with bass
    const baseScale = 3.5;
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    const bassScale = baseScale + bass * 2;
    meshRef.current.scale.setScalar(bassScale * pulse);

    // Rotate slowly
    meshRef.current.rotation.z = t * 0.1;

    // Color intensity with bass
    _tmpColor.copy(BASS_COLOR).lerp(BASS_GLOW, bass);
    matRef.current.color.copy(_tmpColor);
    matRef.current.opacity = 0.05 + bass * 0.35;
  });

  return (
    <mesh ref={meshRef} position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.08, 16, 64]} />
      <meshBasicMaterial
        ref={matRef}
        color={BASS_COLOR}
        transparent
        opacity={0.05}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Drum Bursts ──────────────────────────────────────────────────────────
// Particles that flash on drum transients
const DRUM_PARTICLE_COUNT = 24;

function DrumBursts({ stemsRef }: MusicFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const prevDrums = useRef(0);

  // Pre-compute particle positions (spread in a shell)
  const positions = useMemo(() => {
    const pos = new Float32Array(DRUM_PARTICLE_COUNT * 3);
    for (let i = 0; i < DRUM_PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  // Particle sizes store individual flash state
  const sizes = useMemo(() => new Float32Array(DRUM_PARTICLE_COUNT).fill(0), []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const drums = stemsRef.current?.drums || 0;
    const geom = pointsRef.current.geometry;
    const sizeAttr = geom.getAttribute('size') as THREE.BufferAttribute;

    // Detect transient (drums spike)
    const isTransient = drums > 0.3 && drums - prevDrums.current > 0.1;
    prevDrums.current = drums;

    for (let i = 0; i < DRUM_PARTICLE_COUNT; i++) {
      if (isTransient && Math.random() < 0.4) {
        sizes[i] = 0.15 + Math.random() * 0.15;
      }
      // Decay
      sizes[i] *= 0.92;
      sizeAttr.setX(i, sizes[i]);
    }
    sizeAttr.needsUpdate = true;

    // Overall opacity
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = drums > 0.1 ? 0.4 + drums * 0.6 : drums * 4;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[new Float32Array(DRUM_PARTICLE_COUNT).fill(0.05), 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={DRUM_COLOR}
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Melody Orbit ──────────────────────────────────────────────────────────
// Orbiting ring that shifts brightness with melody
function MelodyOrbit({ stemsRef }: MusicFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const melody = stemsRef.current?.melody || 0;
    const t = state.clock.elapsedTime;

    // Orbit around Y axis
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.3;

    // Scale with melody
    const scale = 4 + melody * 1.5;
    meshRef.current.scale.setScalar(scale);

    // Brightness
    matRef.current.opacity = 0.02 + melody * 0.2;
    _tmpColor.copy(MELODY_COLOR);
    _tmpColor.multiplyScalar(0.5 + melody * 0.5);
    matRef.current.color.copy(_tmpColor);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[1, 0.015, 8, 128]} />
      <meshBasicMaterial
        ref={matRef}
        color={MELODY_COLOR}
        transparent
        opacity={0.02}
        toneMapped={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Harmony Aura ──────────────────────────────────────────────────────────
// Ambient glow sphere that expands with harmonic richness
function HarmonyAura({ stemsRef }: MusicFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !matRef.current) return;
    const harmony = stemsRef.current?.harmony || 0;
    const t = state.clock.elapsedTime;

    // Breathing scale
    const breath = 1 + Math.sin(t * 0.5) * 0.05;
    const scale = (3 + harmony * 3) * breath;
    meshRef.current.scale.setScalar(scale);

    // Opacity
    matRef.current.opacity = harmony * 0.08;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshBasicMaterial
        ref={matRef}
        color={HARMONY_COLOR}
        transparent
        opacity={0}
        toneMapped={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Ambient Light ─────────────────────────────────────────────────────────
// Point light that pulses with overall music energy
function MusicAmbientLight({ stemsRef }: MusicFieldProps) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!lightRef.current) return;
    const energy = stemsRef.current?.energy || 0;
    lightRef.current.intensity = energy * 0.4;
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 0]}
      color={0x7c3aed}
      intensity={0}
      distance={15}
      decay={2}
    />
  );
}
