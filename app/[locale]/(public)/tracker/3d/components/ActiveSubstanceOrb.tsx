'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, MeshTransmissionMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';

interface OrbProps {
  substance: SubstanceKey;
  intensity: number;    // 0-1 from PK engine
  orbitIndex: number;   // Position in orbit ring
  totalActive: number;  // Total active substances for spacing
}

/**
 * An orbiting substance orb in the awareness mirror.
 *
 * - Orbit radius and speed based on substance type
 * - Size scales with current PK intensity
 * - Fades in/out as substance activates/decays
 * - Each substance has its own perceptual material
 */
export default function ActiveSubstanceOrb({ substance, intensity, orbitIndex, totalActive }: OrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const cfg = SUBSTANCE_CONFIG[substance];

  // Don't render if intensity is negligible
  if (intensity < 0.02) return null;

  const angle = (orbitIndex / Math.max(totalActive, 1)) * Math.PI * 2;
  const baseRadius = 4 + intensity * 2;

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <OrbPosition angle={angle} radius={baseRadius} substance={substance} intensity={intensity}>
        <OrbShape substance={substance} intensity={intensity} hovered={hovered} />

        {/* Orbit trail — faint ring showing the path */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[0.01, 0.15 * intensity, 12]} />
          <meshBasicMaterial color={cfg.color} transparent opacity={0.15 * intensity} />
        </mesh>

        {/* Intensity label on hover */}
        {hovered && (
          <Html distanceFactor={12} style={{ pointerEvents: 'none' }}>
            <div className="bg-zinc-900/95 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl backdrop-blur-sm">
              <div className="font-medium" style={{ color: cfg.color }}>
                {cfg.icon} {cfg.label}
              </div>
              <div className="text-zinc-400 mt-0.5">
                Intensity: {(intensity * 100).toFixed(0)}%
              </div>
            </div>
          </Html>
        )}
      </OrbPosition>
    </group>
  );
}

/** Handles orbital positioning + rotation */
function OrbPosition({
  angle,
  radius,
  substance,
  intensity,
  children,
}: {
  angle: number;
  radius: number;
  substance: SubstanceKey;
  intensity: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  // Different orbit speeds per substance class
  const speeds: Record<SubstanceKey, number> = {
    thc: 0.08,
    ketamine: 0.05,
    lsd: 0.03,        // Slow, expansive orbit
    nicotine: 0.25,    // Fast, jittery
    hydration: 0.06,
    melatonin: 0.04,   // Slow, dreamy
    venlafaxine: 0.02, // Very slow, steady
    prazepam: 0.035,   // Slow, calming
    cyamemazine: 0.03, // Very slow, heavy
  };

  // Vertical offsets — psychedelics float higher, sedatives lower
  const yOffsets: Record<SubstanceKey, number> = {
    lsd: 2.5,
    ketamine: 1.5,
    thc: 0.5,
    nicotine: 0,
    hydration: -0.5,
    venlafaxine: -1,
    melatonin: -1.5,
    prazepam: -2,
    cyamemazine: -2.5,
  };

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      const speed = speeds[substance];
      const currentAngle = angle + t * speed;

      // Orbital position
      const r = radius * (0.8 + intensity * 0.4);
      ref.current.position.x = Math.cos(currentAngle) * r;
      ref.current.position.z = Math.sin(currentAngle) * r;
      ref.current.position.y = (yOffsets[substance] ?? 0) + Math.sin(t * 0.3 + angle) * 0.3;
    }
  });

  return <group ref={ref}>{children}</group>;
}

/** Substance-specific visual shape */
function OrbShape({
  substance,
  intensity,
  hovered,
}: {
  substance: SubstanceKey;
  intensity: number;
  hovered: boolean;
  children?: React.ReactNode;
}) {
  const cfg = SUBSTANCE_CONFIG[substance];
  const scale = 0.3 + intensity * 0.8;
  const emissiveBoost = hovered ? 0.8 : 0;

  switch (substance) {
    case 'thc':
      return (
        <Float speed={1.5} rotationIntensity={0.3 * intensity} floatIntensity={0.4}>
          <mesh scale={scale}>
            <icosahedronGeometry args={[0.5, 3]} />
            <MeshDistortMaterial
              color={cfg.color}
              emissive={cfg.color}
              emissiveIntensity={0.2 + intensity * 0.4 + emissiveBoost}
              distort={0.2 + intensity * 0.3}
              speed={1.5 + intensity * 2}
              roughness={0.6}
              metalness={0.1}
              transparent
              opacity={0.3 + intensity * 0.5}
            />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 2} distance={5} decay={2} />
        </Float>
      );

    case 'ketamine':
      return (
        <OrbSpin speed={0.15 + intensity * 0.2}>
          <mesh scale={scale}>
            <octahedronGeometry args={[0.45, 0]} />
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.5}
              chromaticAberration={intensity * 0.15}
              distortion={intensity * 0.2}
              distortionScale={0.3}
              temporalDistortion={intensity * 0.15}
              roughness={0.05}
              color={cfg.color}
              transmission={0.85}
              ior={2.0 + intensity * 0.8}
            />
          </mesh>
          <mesh scale={scale * 0.5} position={[0.15 * scale, 0.2 * scale, 0.1 * scale]}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshPhysicalMaterial
              color={cfg.color}
              metalness={0.9}
              roughness={0.05}
              emissive={cfg.color}
              emissiveIntensity={0.15 + intensity * 0.3 + emissiveBoost}
              transparent
              opacity={0.4 + intensity * 0.4}
            />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={6} decay={2} />
        </OrbSpin>
      );

    case 'lsd':
      return (
        <OrbSpin speed={0.2 + intensity * 0.15} axes="xyz">
          <mesh scale={scale * 0.9}>
            <icosahedronGeometry args={[0.5, 2]} />
            <MeshWobbleMaterial
              color={cfg.color}
              emissive={cfg.color}
              emissiveIntensity={0.2 + intensity * 0.5 + emissiveBoost}
              factor={0.3 + intensity * 0.6}
              speed={1 + intensity * 3}
              metalness={0.7}
              roughness={0.15}
              transparent
              opacity={0.3 + intensity * 0.5}
            />
          </mesh>
          <mesh scale={scale * 0.45}>
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.1}
              roughness={0}
              iridescence={1}
              iridescenceIOR={1.8}
              iridescenceThicknessRange={[100, 800]}
              emissive={cfg.color}
              emissiveIntensity={0.3 + intensity * 0.3}
              transparent
              opacity={0.5 + intensity * 0.4}
            />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 4} distance={8} decay={2} />
        </OrbSpin>
      );

    case 'nicotine':
      return (
        <Float speed={3} rotationIntensity={0.1} floatIntensity={0.6 * intensity}>
          <OrbSpin speed={1.5 + intensity}>
            <mesh scale={scale * 0.8}>
              <torusGeometry args={[0.3, 0.05, 8, 24]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.3 + intensity * 0.5 + emissiveBoost}
                metalness={0.3}
                roughness={0.4}
                transparent
                opacity={0.3 + intensity * 0.5}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 0.15}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.3 + intensity * 0.4} />
          </mesh>
        </Float>
      );

    case 'hydration':
      return (
        <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.3}>
          <mesh scale={[scale * 0.7, scale * 0.85, scale * 0.7]}>
            <sphereGeometry args={[0.4, 20, 20]} />
            <MeshTransmissionMaterial
              backside
              samples={3}
              thickness={0.6}
              chromaticAberration={0.02}
              distortion={0.1 + intensity * 0.15}
              distortionScale={0.3}
              temporalDistortion={0.15}
              roughness={0}
              color={cfg.color}
              transmission={0.92}
              ior={1.33}
            />
          </mesh>
          <mesh scale={scale * 0.2}>
            <sphereGeometry args={[0.3, 10, 10]} />
            <MeshDistortMaterial
              color={cfg.color}
              emissive={cfg.color}
              emissiveIntensity={0.3 + emissiveBoost}
              distort={0.3}
              speed={2}
              transparent
              opacity={0.3 + intensity * 0.3}
            />
          </mesh>
        </Float>
      );

    case 'melatonin':
      return (
        <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
          <OrbSpin speed={0.08}>
            <mesh scale={scale * 0.8} rotation={[0, 0, 0.3]}>
              <torusGeometry args={[0.3, 0.12, 12, 24, Math.PI * 1.3]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.2 + intensity * 0.4 + emissiveBoost}
                metalness={0.1}
                roughness={0.8}
                transparent
                opacity={0.4 + intensity * 0.4}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 0.2}>
            <sphereGeometry args={[0.35, 12, 12]} />
            <MeshDistortMaterial
              color="#c4b5fd"
              emissive={cfg.color}
              emissiveIntensity={0.3}
              distort={0.1}
              speed={0.5}
              transparent
              opacity={0.2 + intensity * 0.3}
            />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 1.5} distance={4} decay={2} />
        </Float>
      );

    case 'venlafaxine':
      return (
        <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.15}>
          <OrbSpin speed={0.1}>
            <mesh scale={scale * 0.7} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.18, 0.35, 8, 16]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.15 + intensity * 0.3 + emissiveBoost}
                metalness={0.3}
                roughness={0.3}
                clearcoat={0.8}
                clearcoatRoughness={0.1}
                transparent
                opacity={0.5 + intensity * 0.4}
              />
            </mesh>
          </OrbSpin>
        </Float>
      );

    case 'prazepam':
      return (
        <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.2}>
          <OrbSpin speed={0.12}>
            <mesh scale={scale * 0.7}>
              <cylinderGeometry args={[0.3, 0.3, 0.07, 20]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.1 + intensity * 0.3 + emissiveBoost}
                metalness={0.05}
                roughness={0.7}
                transparent
                opacity={0.4 + intensity * 0.4}
              />
            </mesh>
          </OrbSpin>
          {/* Dissolving aura */}
          <mesh scale={scale * 0.9} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.35, 20]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={intensity * 0.12} side={THREE.DoubleSide} />
          </mesh>
        </Float>
      );

    case 'cyamemazine':
      return (
        <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.15}>
          <OrbSpin speed={0.1}>
            <mesh scale={scale * 0.7}>
              <tetrahedronGeometry args={[0.4, 0]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.15 + intensity * 0.35 + emissiveBoost}
                metalness={0.6}
                roughness={0.2}
                clearcoat={0.5}
                transparent
                opacity={0.4 + intensity * 0.4}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 0.2}>
            <sphereGeometry args={[0.25, 10, 10]} />
            <meshBasicMaterial color="#1a0a2e" transparent opacity={0.2 + intensity * 0.3} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 1.5} distance={4} decay={2} />
        </Float>
      );

    default:
      return null;
  }
}

/** Helper: auto-spinning group */
function OrbSpin({
  speed,
  axes = 'y',
  children,
}: {
  speed: number;
  axes?: 'y' | 'xyz';
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = t * speed;
      if (axes === 'xyz') {
        ref.current.rotation.x = Math.sin(t * speed * 0.7) * 0.3;
        ref.current.rotation.z = Math.cos(t * speed * 0.5) * 0.2;
      }
    }
  });
  return <group ref={ref}>{children}</group>;
}
