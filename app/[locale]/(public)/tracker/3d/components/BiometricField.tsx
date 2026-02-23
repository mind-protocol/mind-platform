'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { AwarenessState } from '@/lib/tracker/pharmacokinetics';

interface FieldProps {
  awareness: AwarenessState;
}

/**
 * Biometric environmental field — the atmosphere of consciousness.
 *
 * - Stress: red particle rings that pulse faster and brighter
 * - Body Battery: cyan energy sphere envelope
 * - Heart Rate: breathing pulse on fog density
 * - Psychedelic load: chromatic fog tinting
 */
export default function BiometricField({ awareness }: FieldProps) {
  return (
    <group>
      <StressRings stress={awareness.stress} />
      <EnergyEnvelope bodyBattery={awareness.bodyBattery} />
      <AtmosphericLighting awareness={awareness} />
      <OrbitRing awareness={awareness} />
    </group>
  );
}

/** Stress rings — concentric rings that pulse with stress level */
function StressRings({ stress }: { stress: number | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const stressNorm = stress != null ? stress / 100 : 0.3;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulseSpeed = 0.5 + stressNorm * 2; // Faster pulse under stress

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02;
    }

    const rings = [ring1Ref, ring2Ref, ring3Ref];
    rings.forEach((ref, i) => {
      if (ref.current) {
        const phase = (i / 3) * Math.PI * 2;
        const pulse = 1 + Math.sin(t * pulseSpeed + phase) * 0.1;
        const baseScale = 6 + i * 2;
        ref.current.scale.setScalar(baseScale * pulse);
        ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.1 + i) * 0.15;

        const mat = ref.current.material as THREE.MeshBasicMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity = stressNorm * 0.08 * (1 - i * 0.2);
        }
      }
    });
  });

  if (stressNorm < 0.1) return null;

  return (
    <group ref={groupRef}>
      {[ring1Ref, ring2Ref, ring3Ref].map((ref, i) => (
        <mesh key={i} ref={ref} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.95, 1, 64]} />
          <meshBasicMaterial
            color={stressNorm > 0.6 ? '#ef4444' : stressNorm > 0.3 ? '#f59e0b' : '#22c55e'}
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Energy envelope — body battery as a glowing wireframe sphere */
function EnergyEnvelope({ bodyBattery }: { bodyBattery: number | null }) {
  const ref = useRef<THREE.Mesh>(null);
  const bb = bodyBattery != null ? bodyBattery / 100 : 0.5;

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      ref.current.rotation.x = state.clock.elapsedTime * 0.008;

      const mat = ref.current.material as THREE.MeshPhysicalMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = 0.02 + bb * 0.04;
      }
      if (mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = bb * 0.3;
      }
    }
  });

  return (
    <mesh ref={ref} scale={10 + bb * 3}>
      <icosahedronGeometry args={[1, 1]} />
      <meshPhysicalMaterial
        color={bb > 0.5 ? '#06b6d4' : bb > 0.25 ? '#f59e0b' : '#ef4444'}
        emissive={bb > 0.5 ? '#06b6d4' : bb > 0.25 ? '#f59e0b' : '#ef4444'}
        emissiveIntensity={0.15}
        transparent
        opacity={0.03}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Atmospheric lighting that responds to overall state */
function AtmosphericLighting({ awareness }: { awareness: AwarenessState }) {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const bpm = awareness.hr ?? 65;
    const breathRate = bpm / 60;
    const breathPulse = Math.sin(t * breathRate * Math.PI) * 0.5 + 0.5;

    if (light1Ref.current) {
      // Warm/cool shift based on state
      const warmth = awareness.stimulantLoad * 0.5 + (awareness.stress ?? 30) / 200;
      light1Ref.current.intensity = 0.3 + breathPulse * 0.2 + awareness.alterationDepth * 0.3;
      light1Ref.current.color.setHSL(
        0.6 - warmth * 0.4, // Blue → warm shift
        0.4 + awareness.psychedelicLoad * 0.4,
        0.5,
      );
    }

    if (light2Ref.current) {
      // Sedative/psychedelic ambient
      light2Ref.current.intensity = 0.15 + awareness.sedativeLoad * 0.2;
      light2Ref.current.position.x = Math.cos(t * 0.05) * 15;
      light2Ref.current.position.z = Math.sin(t * 0.05) * 15;
    }
  });

  return (
    <>
      {/* Primary atmospheric light */}
      <pointLight
        ref={light1Ref}
        position={[0, 10, 0]}
        intensity={0.4}
        distance={30}
        decay={2}
      />
      {/* Orbiting ambient fill */}
      <pointLight
        ref={light2Ref}
        position={[15, 3, 0]}
        intensity={0.15}
        color="#7c3aed"
        distance={25}
        decay={2}
      />
    </>
  );
}

/** Orbital reference ring — shows the "plane of consciousness" */
function OrbitRing({ awareness }: { awareness: AwarenessState }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.005;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = 0.03 + awareness.alterationDepth * 0.04;
      }
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[4.5, 4.6, 128]} />
      <meshBasicMaterial
        color="#475569"
        transparent
        opacity={0.04}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
