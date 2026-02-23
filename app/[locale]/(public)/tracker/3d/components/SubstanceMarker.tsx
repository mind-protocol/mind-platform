'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh } from 'three';
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

export default function SubstanceMarker({ substance, position, amount, entry }: MarkerProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const cfg = SUBSTANCE_CONFIG[substance];
  const scale = normalizeDose(substance, amount);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0] * 2) * 0.06;
      meshRef.current.rotation.y += 0.003;
    }
  });

  const geometryNode = (() => {
    switch (cfg.geometry) {
      case 'cylinder':
        return <cylinderGeometry args={[0.25 * scale, 0.25 * scale, 0.6 * scale, 8]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.35 * scale]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.3 * scale, 1]} />;
      case 'torus':
        return <torusGeometry args={[0.25 * scale, 0.08 * scale, 8, 16]} />;
      case 'sphere':
        return <sphereGeometry args={[0.3 * scale, 16, 16]} />;
    }
  })();

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.4 : 1}
    >
      {geometryNode}
      <meshStandardMaterial
        color={cfg.color}
        emissive={cfg.color}
        emissiveIntensity={hovered ? 1.0 : 0.35}
        transparent
        opacity={0.88}
        roughness={0.2}
        metalness={0.6}
      />
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
    </mesh>
  );
}
