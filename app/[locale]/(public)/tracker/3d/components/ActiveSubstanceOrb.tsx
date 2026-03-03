'use client';

import { useRef } from 'react';
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
  const cfg = SUBSTANCE_CONFIG[substance];

  // Don't render if intensity is negligible
  if (intensity < 0.02) return null;

  const angle = (orbitIndex / Math.max(totalActive, 1)) * Math.PI * 2;
  const baseRadius = 4 + intensity * 2;

  return (
    <group ref={groupRef}>
      <OrbPosition angle={angle} radius={baseRadius} substance={substance} intensity={intensity}>
        <OrbShape substance={substance} intensity={intensity} />

        {/* Orbit trail — faint ring showing the path */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[0.01, 0.15 * intensity, 12]} />
          <meshBasicMaterial color={cfg.color} transparent opacity={0.15 * intensity} />
        </mesh>

        {/* Permanent label — no pointer events needed */}
        <Html distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div className="text-[9px] whitespace-nowrap font-mono opacity-70" style={{ color: cfg.color, textShadow: '0 0 4px rgba(0,0,0,0.8)' }}>
            {cfg.icon} {(intensity * 100).toFixed(0)}%
          </div>
        </Html>
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
    hashish: 0.07,     // Similar to THC — smoked cannabis
    cbd: 0.07,         // Slightly slower than THC — calming
    cbd_joint: 0.06,   // Slow, calming — CBD smoke
    lions_mane: 0.02,  // Very slow — steady supplement
    caffeine: 0.18,    // Fast, energetic
    ketamine: 0.05,
    lsd: 0.03,        // Slow, expansive orbit
    nicotine: 0.25,    // Fast, jittery
    hydration: 0.06,
    melatonin: 0.04,   // Slow, dreamy
    venlafaxine: 0.02, // Very slow, steady
    sertraline: 0.02,  // Very slow, steady — SSRI baseline
    prazepam: 0.035,   // Slow, calming
    cyamemazine: 0.03, // Very slow, heavy
    dynabiane: 0.02,   // Very slow — steady supplement
    omegabiane: 0.02,  // Very slow — steady supplement
    griffonia: 0.03,   // Slow — serotonin precursor, calming
    valeriane: 0.025,  // Very slow — sedative herb
    safran: 0.02,      // Very slow — steady supplement
    yoga: 0.04,        // Slow, meditative
    vitamine_c: 0.02,  // Very slow — steady supplement
    cocaine: 0.35,     // Very fast, frenetic
    mmc: 0.2,          // Fast, stimulant-like
    heroine: 0.04,     // Slow, heavy sedation
    alcohol: 0.06,     // Moderate, depressant sway
  };

  // Vertical offsets — psychedelics float higher, sedatives lower
  const yOffsets: Record<SubstanceKey, number> = {
    lsd: 2.5,
    ketamine: 1.5,
    thc: 0.5,
    hashish: 0.4,      // Similar to THC
    cbd: 0.3,
    cbd_joint: 0.2,    // Mild, calming
    lions_mane: 0.2,
    caffeine: 0.8,     // High up — stimulant energy
    nicotine: 0,
    hydration: -0.5,
    venlafaxine: -1,
    sertraline: -0.8,   // Slightly below neutral — SSRI baseline
    melatonin: -1.5,
    prazepam: -2,
    cyamemazine: -2.5,
    dynabiane: -0.3,    // Neutral, subtle
    omegabiane: -0.1,   // Neutral, subtle
    griffonia: -0.4,    // Slightly below — calming serotonin
    valeriane: -1.2,    // Low — sedative
    safran: 0.1,        // Neutral — mood support
    yoga: 1.0,          // Floats up — body practice
    vitamine_c: 0.0,    // Neutral — basic supplement
    cocaine: 2.0,       // High up — intense stimulant
    mmc: 1.8,           // High — stimulant/empathogen
    heroine: -3.0,      // Very low — heavy sedation/opioid
    alcohol: -1.0,      // Below neutral — CNS depressant
  };

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      const speed = speeds[substance];
      const currentAngle = angle + t * speed;
      const pointer = state.pointer;

      // Orbital position
      const r = radius * (0.8 + intensity * 0.4);
      const baseX = Math.cos(currentAngle) * r;
      const baseZ = Math.sin(currentAngle) * r;
      const baseY = (yOffsets[substance] ?? 0) + Math.sin(t * 0.3 + angle) * 0.3;

      // Cursor attraction — orbs drift toward pointer side
      const attractStrength = 1.5 * intensity;
      ref.current.position.x = baseX + pointer.x * attractStrength;
      ref.current.position.z = baseZ;
      ref.current.position.y = baseY + pointer.y * attractStrength * 0.5;
    }
  });

  return <group ref={ref}>{children}</group>;
}

/** Animated particle orbiting the CBD compound orb */
function CompoundParticle({ color, offset, scale, intensity }: { color: string; offset: number; scale: number; intensity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.set(
      Math.cos(t + offset) * 0.6 * scale,
      Math.sin(t * 0.8 + offset) * 0.3 * scale,
      Math.sin(t + offset) * 0.6 * scale,
    );
  });
  return (
    <mesh ref={ref} scale={scale * 0.25}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.4 + intensity * 0.4} />
    </mesh>
  );
}

/** Substance-specific visual shape */
function OrbShape({
  substance,
  intensity,
}: {
  substance: SubstanceKey;
  intensity: number;
}) {
  const cfg = SUBSTANCE_CONFIG[substance];
  const scale = 0.6 + intensity * 1.2;

  switch (substance) {
    case 'thc':
      return (
        <Float speed={1.5} rotationIntensity={0.3 * intensity} floatIntensity={0.4}>
          <mesh scale={scale}>
            <icosahedronGeometry args={[0.5, 3]} />
            <MeshDistortMaterial
              color={cfg.color}
              emissive={cfg.color}
              emissiveIntensity={0.4 + intensity * 0.8}
              distort={0.2 + intensity * 0.3}
              speed={1.5 + intensity * 2}
              roughness={0.4}
              metalness={0.15}
              transparent
              opacity={0.5 + intensity * 0.4}
            />
          </mesh>
          {/* Glow aura */}
          <mesh scale={scale * 1.6}>
            <icosahedronGeometry args={[0.5, 2]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.06 + intensity * 0.06} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 5} distance={8} decay={2} />
        </Float>
      );

    case 'cbd':
      return (
        <Float speed={1.2} rotationIntensity={0.15 * intensity} floatIntensity={0.3}>
          <OrbSpin speed={0.08}>
            {/* Core dodecahedron — CBD isolat */}
            <mesh scale={scale}>
              <dodecahedronGeometry args={[0.4, 0]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.3 + intensity * 0.6}
                metalness={0.1}
                roughness={0.5}
                clearcoat={0.6}
                transparent
                opacity={0.55 + intensity * 0.35}
              />
            </mesh>
            {/* Orbiting compound particles */}
            <CompoundParticle color="#a855f7" offset={0} scale={scale} intensity={intensity} />
            <CompoundParticle color="#f59e0b" offset={Math.PI * 0.66} scale={scale} intensity={intensity} />
            <CompoundParticle color="#f43f5e" offset={Math.PI * 1.33} scale={scale} intensity={intensity} />
          </OrbSpin>
          {/* Organic glow aura */}
          <mesh scale={scale * 1.5}>
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.05 + intensity * 0.06} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 4} distance={6} decay={2} />
        </Float>
      );

    case 'lions_mane':
      return (
        <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.15}>
          <OrbSpin speed={0.03}>
            <mesh scale={scale * 0.9}>
              <coneGeometry args={[0.35, 0.5, 8]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.2 + intensity * 0.4}
                metalness={0.05}
                roughness={0.7}
                clearcoat={0.3}
                transparent
                opacity={0.5 + intensity * 0.4}
              />
            </mesh>
          </OrbSpin>
          {/* Mycelium glow */}
          <mesh scale={scale * 1.3}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.05} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 2} distance={5} decay={2} />
        </Float>
      );

    case 'caffeine':
      return (
        <Float speed={2.5} rotationIntensity={0.2 * intensity} floatIntensity={0.5 * intensity}>
          <OrbSpin speed={0.3 + intensity * 0.4}>
            <mesh scale={scale} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.3, 0.12, 12, 24]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.4 + intensity * 0.7}
                metalness={0.2}
                roughness={0.4}
                clearcoat={0.5}
                transparent
                opacity={0.6 + intensity * 0.35}
              />
            </mesh>
          </OrbSpin>
          {/* Steam wisps — small bright core */}
          <mesh scale={scale * 0.2}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.3 + intensity * 0.4} />
          </mesh>
          {/* Warm aura */}
          <mesh scale={scale * 1.4}>
            <sphereGeometry args={[0.3, 10, 10]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.05 + intensity * 0.07} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 5} distance={7} decay={2} />
        </Float>
      );

    case 'ketamine':
      return (
        <OrbSpin speed={0.15 + intensity * 0.2}>
          <mesh scale={scale}>
            <octahedronGeometry args={[0.45, 0]} />
            <MeshTransmissionMaterial
              backside
              samples={2}
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
          <mesh scale={scale * 0.55} position={[0.15 * scale, 0.2 * scale, 0.1 * scale]}>
            <octahedronGeometry args={[0.3, 0]} />
            <meshPhysicalMaterial
              color={cfg.color}
              metalness={0.9}
              roughness={0.05}
              emissive={cfg.color}
              emissiveIntensity={0.3 + intensity * 0.6}
              transparent
              opacity={0.6 + intensity * 0.35}
            />
          </mesh>
          {/* Crystal glow shell */}
          <mesh scale={scale * 1.5}>
            <octahedronGeometry args={[0.45, 0]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.06} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 6} distance={10} decay={2} />
        </OrbSpin>
      );

    case 'lsd':
      return (
        <OrbSpin speed={0.2 + intensity * 0.15} axes="xyz">
          <mesh scale={scale}>
            <icosahedronGeometry args={[0.5, 2]} />
            <MeshWobbleMaterial
              color={cfg.color}
              emissive={cfg.color}
              emissiveIntensity={0.4 + intensity * 0.8}
              factor={0.3 + intensity * 0.6}
              speed={1 + intensity * 3}
              metalness={0.7}
              roughness={0.15}
              transparent
              opacity={0.5 + intensity * 0.4}
            />
          </mesh>
          <mesh scale={scale * 0.5}>
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.1}
              roughness={0}
              iridescence={1}
              iridescenceIOR={1.8}
              iridescenceThicknessRange={[100, 800]}
              emissive={cfg.color}
              emissiveIntensity={0.5 + intensity * 0.5}
              transparent
              opacity={0.6 + intensity * 0.35}
            />
          </mesh>
          {/* Psychedelic aura */}
          <mesh scale={scale * 1.7}>
            <icosahedronGeometry args={[0.5, 1]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.05 + intensity * 0.08} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 8} distance={12} decay={2} />
        </OrbSpin>
      );

    case 'nicotine':
      return (
        <Float speed={3} rotationIntensity={0.1} floatIntensity={0.6 * intensity}>
          <OrbSpin speed={1.5 + intensity}>
            <mesh scale={scale}>
              <torusGeometry args={[0.3, 0.08, 12, 32]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.5 + intensity * 0.7}
                metalness={0.3}
                roughness={0.3}
                transparent
                opacity={0.5 + intensity * 0.4}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 0.25}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.4 + intensity * 0.4} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 4} distance={6} decay={2} />
        </Float>
      );

    case 'hydration':
      return (
        <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.3}>
          <mesh scale={[scale * 0.8, scale, scale * 0.8]}>
            <sphereGeometry args={[0.4, 20, 20]} />
            <MeshTransmissionMaterial
              backside
              samples={2}
              thickness={0.6}
              chromaticAberration={0.02}
              distortion={0.1 + intensity * 0.15}
              distortionScale={0.3}
              temporalDistortion={0.15}
              roughness={0}
              color={cfg.color}
              transmission={0.88}
              ior={1.33}
            />
          </mesh>
          <mesh scale={scale * 0.3}>
            <sphereGeometry args={[0.3, 10, 10]} />
            <MeshDistortMaterial
              color={cfg.color}
              emissive={cfg.color}
              emissiveIntensity={0.5}
              distort={0.3}
              speed={2}
              transparent
              opacity={0.4 + intensity * 0.4}
            />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={6} decay={2} />
        </Float>
      );

    case 'melatonin':
      return (
        <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
          <OrbSpin speed={0.08}>
            <mesh scale={scale} rotation={[0, 0, 0.3]}>
              <torusGeometry args={[0.3, 0.14, 16, 32, Math.PI * 1.3]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.4 + intensity * 0.6}
                metalness={0.1}
                roughness={0.6}
                transparent
                opacity={0.6 + intensity * 0.35}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 0.3}>
            <sphereGeometry args={[0.35, 12, 12]} />
            <MeshDistortMaterial
              color="#c4b5fd"
              emissive={cfg.color}
              emissiveIntensity={0.5}
              distort={0.1}
              speed={0.5}
              transparent
              opacity={0.3 + intensity * 0.4}
            />
          </mesh>
          {/* Sleep aura */}
          <mesh scale={scale * 1.5}>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.05} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 4} distance={7} decay={2} />
        </Float>
      );

    case 'venlafaxine':
      return (
        <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.15}>
          <OrbSpin speed={0.1}>
            <mesh scale={scale * 0.85} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.3 + intensity * 0.5}
                metalness={0.3}
                roughness={0.2}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                transparent
                opacity={0.6 + intensity * 0.35}
              />
            </mesh>
          </OrbSpin>
          {/* Steady-state glow */}
          <mesh scale={scale * 1.3}>
            <sphereGeometry args={[0.3, 10, 10]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.04} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={5} decay={2} />
        </Float>
      );

    case 'sertraline':
      // SSRI capsule — same form as venlafaxine with cyan teal color
      return (
        <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.15}>
          <OrbSpin speed={0.1}>
            <mesh scale={scale * 0.85} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.2, 0.4, 8, 16]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.3 + intensity * 0.5}
                metalness={0.3}
                roughness={0.2}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                transparent
                opacity={0.6 + intensity * 0.35}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 1.3}>
            <sphereGeometry args={[0.3, 10, 10]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.04} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={5} decay={2} />
        </Float>
      );

    case 'prazepam':
      return (
        <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.2}>
          <OrbSpin speed={0.12}>
            <mesh scale={scale * 0.85}>
              <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.3 + intensity * 0.5}
                metalness={0.05}
                roughness={0.5}
                transparent
                opacity={0.6 + intensity * 0.35}
              />
            </mesh>
          </OrbSpin>
          {/* Dissolving aura */}
          <mesh scale={scale * 1.2} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.4, 24]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.06 + intensity * 0.1} side={THREE.DoubleSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={5} decay={2} />
        </Float>
      );

    case 'cyamemazine':
      return (
        <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.15}>
          <OrbSpin speed={0.1}>
            <mesh scale={scale * 0.85}>
              <tetrahedronGeometry args={[0.4, 0]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.3 + intensity * 0.6}
                metalness={0.6}
                roughness={0.15}
                clearcoat={0.7}
                transparent
                opacity={0.6 + intensity * 0.35}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 0.3}>
            <sphereGeometry args={[0.25, 10, 10]} />
            <meshBasicMaterial color="#2a0a4e" transparent opacity={0.3 + intensity * 0.3} />
          </mesh>
          {/* Deep void aura */}
          <mesh scale={scale * 1.4}>
            <tetrahedronGeometry args={[0.4, 0]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.05} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 4} distance={7} decay={2} />
        </Float>
      );

    case 'dynabiane':
      return (
        <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.15}>
          <OrbSpin speed={0.04}>
            {/* Pill-shaped capsule */}
            <mesh scale={scale * 0.8}>
              <capsuleGeometry args={[0.15, 0.35, 8, 16]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.2 + intensity * 0.4}
                metalness={0.05}
                roughness={0.6}
                clearcoat={0.4}
                transparent
                opacity={0.5 + intensity * 0.35}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 1.3}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.05} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={5} decay={2} />
        </Float>
      );

    case 'omegabiane':
      return (
        <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.2}>
          <OrbSpin speed={0.05}>
            {/* Droplet-like sphere — omega oil */}
            <mesh scale={[scale * 0.7, scale * 0.9, scale * 0.7]}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.25 + intensity * 0.5}
                metalness={0.15}
                roughness={0.3}
                clearcoat={0.8}
                transparent
                opacity={0.55 + intensity * 0.35}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 1.3}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.05} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={5} decay={2} />
        </Float>
      );

    case 'griffonia':
      return (
        <Float speed={0.7} rotationIntensity={0.08} floatIntensity={0.2}>
          <OrbSpin speed={0.04}>
            {/* Seed/pill shape — 5-HTP serotonin precursor */}
            <mesh scale={scale * 0.8} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.2, 0.35, 8, 16]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.3 + intensity * 0.5}
                metalness={0.2}
                roughness={0.4}
                clearcoat={0.6}
                transparent
                opacity={0.6 + intensity * 0.3}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 1.2}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.06} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={5} decay={2} />
        </Float>
      );

    case 'valeriane':
      return (
        <Float speed={0.4} rotationIntensity={0.06} floatIntensity={0.15}>
          <OrbSpin speed={0.03}>
            {/* Root/herb — organic pill shape */}
            <mesh scale={scale * 0.8} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.2, 0.35, 8, 16]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.25 + intensity * 0.45}
                metalness={0.1}
                roughness={0.6}
                clearcoat={0.4}
                transparent
                opacity={0.6 + intensity * 0.3}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 1.2}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.05} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 2.5} distance={5} decay={2} />
        </Float>
      );

    case 'safran':
      return (
        <Float speed={0.5} rotationIntensity={0.06} floatIntensity={0.18}>
          <OrbSpin speed={0.035}>
            {/* Warm saffron pill */}
            <mesh scale={scale * 0.8} rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.2, 0.35, 8, 16]} />
              <meshPhysicalMaterial
                color={cfg.color}
                emissive={cfg.color}
                emissiveIntensity={0.3 + intensity * 0.5}
                metalness={0.15}
                roughness={0.35}
                clearcoat={0.7}
                transparent
                opacity={0.6 + intensity * 0.3}
              />
            </mesh>
          </OrbSpin>
          <mesh scale={scale * 1.2}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.04 + intensity * 0.05} side={THREE.BackSide} />
          </mesh>
          <pointLight color={cfg.color} intensity={intensity * 3} distance={5} decay={2} />
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
