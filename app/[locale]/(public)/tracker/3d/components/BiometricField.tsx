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
    const pointer = state.pointer;
    const pulseSpeed = 0.5 + stressNorm * 2; // Faster pulse under stress

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02;
      // Stress rings tilt toward cursor
      groupRef.current.rotation.x = pointer.y * 0.1;
      groupRef.current.rotation.z = -pointer.x * 0.1;
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
          // Stress rings brighten on cursor proximity
          const cursorDist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
          mat.opacity = stressNorm * 0.08 * (1 - i * 0.2) + cursorDist * 0.02;
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

/** Atmospheric lighting that responds to overall state + cursor */
function AtmosphericLighting({ awareness }: { awareness: AwarenessState }) {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const cursorLightRef = useRef<THREE.PointLight>(null);
  const smoothPointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pointer = state.pointer;
    smoothPointer.current.lerp(pointer, 0.06);
    const px = smoothPointer.current.x;
    const py = smoothPointer.current.y;

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
      // Key light subtly follows cursor
      light1Ref.current.position.x = px * 5;
      light1Ref.current.position.z = 3 + py * 3;
    }

    if (light2Ref.current) {
      // Sedative/psychedelic ambient
      light2Ref.current.intensity = 0.15 + awareness.sedativeLoad * 0.2;
      light2Ref.current.position.x = Math.cos(t * 0.05) * 15;
      light2Ref.current.position.z = Math.sin(t * 0.05) * 15;
    }

    // Cursor light — probes the scene, reveals structure
    if (cursorLightRef.current) {
      cursorLightRef.current.position.x = px * 8;
      cursorLightRef.current.position.y = 2 + py * 4;
      cursorLightRef.current.position.z = 6;
      // Intensity based on cursor distance from center
      const dist = Math.sqrt(px * px + py * py);
      cursorLightRef.current.intensity = 0.3 + dist * 0.5 + awareness.alterationDepth * 0.3;
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
      {/* Cursor-tracking probe light */}
      <pointLight
        ref={cursorLightRef}
        position={[0, 2, 6]}
        intensity={0.3}
        color="#e2e8f0"
        distance={20}
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
      const pointer = state.pointer;
      ref.current.rotation.z = state.clock.elapsedTime * 0.005 + pointer.x * 0.05;
      ref.current.rotation.x = Math.PI / 2 + pointer.y * 0.08;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== undefined) {
        const cursorDist = Math.sqrt(pointer.x * pointer.x + pointer.y * pointer.y);
        mat.opacity = 0.03 + awareness.alterationDepth * 0.04 + cursorDist * 0.03;
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
