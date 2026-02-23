'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, MeshDistortMaterial, MeshWobbleMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { SUBSTANCE_CONFIG, normalizeDose, type SubstanceKey } from '@/lib/tracker/constants';
import type { TrackerEntry } from '@/lib/tracker/hooks/useTrackerData';

interface MarkerProps {
  substance: SubstanceKey;
  position: [number, number, number];
  amount: number;
  entry?: TrackerEntry;
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// THC: organic, warm, breathing volume — distorted sphere with inner glow
function THCMarker({ scale, hovered, color }: { scale: number; hovered: boolean; color: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh scale={scale * 0.7}>
        <icosahedronGeometry args={[0.5, 3]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.25}
          distort={hovered ? 0.5 : 0.3}
          speed={2}
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* Inner core glow */}
      <mesh scale={scale * 0.3}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.6 : 0.3} />
      </mesh>
    </Float>
  );
}

// Ketamine: crystalline, fractured, reflective diamond — transmission glass with angular facets
function KetamineMarker({ scale, hovered, color }: { scale: number; hovered: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary crystal */}
      <mesh scale={scale * 0.7}>
        <octahedronGeometry args={[0.45, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          chromaticAberration={hovered ? 0.15 : 0.05}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          roughness={0.05}
          color={color}
          transmission={0.9}
          ior={2.4}
        />
      </mesh>
      {/* Secondary shard — offset */}
      <mesh position={[0.15 * scale, 0.2 * scale, 0.1 * scale]} scale={scale * 0.35}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.15}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Light refraction point */}
      <pointLight
        color={color}
        intensity={hovered ? 2 : 0.5}
        distance={3 * scale}
        decay={2}
      />
    </group>
  );
}

// LSD: prismatic, kaleidoscopic, morphing — wobble material with iridescence
function LSDMarker({ scale, hovered, color }: { scale: number; hovered: boolean; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(time.current * 0.4) * 0.3;
      groupRef.current.rotation.y = time.current * 0.2;
      groupRef.current.rotation.z = Math.cos(time.current * 0.3) * 0.2;
    }
  });

  // Prismatic color cycling
  const prismColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    prismColor.setHSL((t * 0.05) % 1, 0.8, 0.55);
  });

  return (
    <group ref={groupRef}>
      {/* Outer morphing shell */}
      <mesh scale={scale * 0.65}>
        <icosahedronGeometry args={[0.5, 2]} />
        <MeshWobbleMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.7 : 0.2}
          factor={hovered ? 0.8 : 0.4}
          speed={hovered ? 3 : 1.5}
          metalness={0.7}
          roughness={0.15}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Inner prismatic core */}
      <mesh scale={scale * 0.35}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          iridescence={1}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[100, 800]}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Prismatic light projection */}
      <pointLight
        color={color}
        intensity={hovered ? 3 : 0.8}
        distance={4 * scale}
        decay={2}
      />
    </group>
  );
}

// Nicotine: sharp, ephemeral, smoke-like — fast spinning ring with particle trail
function NicotineMarker({ scale, hovered, color }: { scale: number; hovered: boolean; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 1.5;
      ringRef.current.rotation.z = t * 0.8;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 1.2;
      ring2Ref.current.rotation.x = t * 0.5;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.1} floatIntensity={0.6}>
      {/* Primary smoke ring */}
      <mesh ref={ringRef} scale={scale * 0.7}>
        <torusGeometry args={[0.35, 0.06, 8, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.9 : 0.3}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={hovered ? 0.8 : 0.5}
        />
      </mesh>
      {/* Secondary ring — crossed */}
      <mesh ref={ring2Ref} scale={scale * 0.55}>
        <torusGeometry args={[0.3, 0.04, 6, 24]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          transparent
          opacity={0.3}
          roughness={0.6}
        />
      </mesh>
      {/* Sharp center point */}
      <mesh scale={scale * 0.15}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.8 : 0.4} />
      </mesh>
    </Float>
  );
}

// Hydration: fluid, clear, rippling — transmission sphere with water caustics
function HydrationMarker({ scale, hovered, color }: { scale: number; hovered: boolean; color: string }) {
  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.5}>
      {/* Outer water droplet */}
      <mesh scale={[scale * 0.6, scale * 0.75, scale * 0.6]}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.8}
          chromaticAberration={hovered ? 0.08 : 0.02}
          anisotropy={0.1}
          distortion={hovered ? 0.3 : 0.15}
          distortionScale={0.3}
          temporalDistortion={0.2}
          roughness={0}
          color={color}
          transmission={0.95}
          ior={1.33}
        />
      </mesh>
      {/* Inner ripple core */}
      <mesh scale={scale * 0.2}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          distort={0.4}
          speed={3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

// Main marker component — dispatches to substance-specific renderer
export default function SubstanceMarker({ substance, position, amount, entry }: MarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const cfg = SUBSTANCE_CONFIG[substance];
  const scale = normalizeDose(substance, amount);

  const MarkerContent = () => {
    switch (substance) {
      case 'thc':
        return <THCMarker scale={scale} hovered={hovered} color={cfg.color} />;
      case 'ketamine':
        return <KetamineMarker scale={scale} hovered={hovered} color={cfg.color} />;
      case 'lsd':
        return <LSDMarker scale={scale} hovered={hovered} color={cfg.color} />;
      case 'nicotine':
        return <NicotineMarker scale={scale} hovered={hovered} color={cfg.color} />;
      case 'hydration':
        return <HydrationMarker scale={scale} hovered={hovered} color={cfg.color} />;
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <MarkerContent />

      {/* Ground projection — light cone cast below */}
      <mesh position={[0, -cfg.laneY - 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3 * scale, 16]} />
        <meshBasicMaterial color={cfg.color} transparent opacity={hovered ? 0.25 : 0.08} />
      </mesh>

      {hovered && entry && (
        <Html distanceFactor={15} style={{ pointerEvents: 'none' }}>
          <div className="bg-zinc-900/95 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap shadow-xl backdrop-blur-sm">
            <div className="font-medium" style={{ color: cfg.color }}>
              {cfg.label} — {amount} {cfg.unit}
            </div>
            <div className="text-zinc-400 mt-0.5">{formatTime(entry.ts)}</div>
            {entry.intent && <div className="text-zinc-500">{entry.intent}</div>}
            {entry.biometrics_at_log && (
              <div className="text-zinc-600 mt-1 flex gap-2">
                {entry.biometrics_at_log.hr && <span>HR:{entry.biometrics_at_log.hr}</span>}
                {entry.biometrics_at_log.stress != null && <span>Stress:{entry.biometrics_at_log.stress}</span>}
                {entry.biometrics_at_log.body_battery != null && <span>BB:{entry.biometrics_at_log.body_battery}</span>}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
