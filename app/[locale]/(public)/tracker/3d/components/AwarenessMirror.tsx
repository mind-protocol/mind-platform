'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAwarenessState } from '@/lib/tracker/hooks/useAwarenessState';
import { useEnvironments } from '@/lib/tracker/hooks/useEnvironments';
import { SUBSTANCE_KEYS, SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';
import type { AwarenessState } from '@/lib/tracker/pharmacokinetics';
import SceneControls from './SceneControls';
import ConsciousnessCore from './ConsciousnessCore';
import ActiveSubstanceOrb from './ActiveSubstanceOrb';
import BiometricField from './BiometricField';
import EnvironmentRenderer from './environments/EnvironmentRenderer';

export default function AwarenessMirror() {
  const { awareness, loading } = useAwarenessState();
  const { active: activeEnv } = useEnvironments();
  const [dpr, setDpr] = useState<number>(1.5);

  // Determine which substances are currently active
  const activeSubstances = useMemo(() => {
    return SUBSTANCE_KEYS
      .filter(k => awareness.substances[k] > 0.02)
      .sort((a, b) => awareness.substances[b] - awareness.substances[a]);
  }, [awareness.substances]);

  // Dynamic fog color based on state
  const fogColor = useMemo(() => {
    if (awareness.psychedelicLoad > 0.5) return '#0a0515'; // Deep purple-black
    if (awareness.sedativeLoad > 0.5) return '#080810';    // Deep indigo-black
    if (awareness.stimulantLoad > 0.3) return '#0f0a05';   // Warm dark
    if (awareness.adaptogenicLoad > 0.3) return '#0a0d05'; // Forest-green dark
    return '#09090b'; // Default dark
  }, [awareness.psychedelicLoad, awareness.sedativeLoad, awareness.stimulantLoad, awareness.adaptogenicLoad]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-zinc-600 text-sm font-mono animate-pulse">
          Initializing awareness mirror...
        </div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 3, 12], fov: 55 }}
      dpr={dpr}
      gl={{ antialias: true, alpha: false, toneMapping: 3 }}
      style={{ background: fogColor }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 25, 60]} />

      {/* Environment: user capture or default night */}
      {activeEnv ? (
        <EnvironmentRenderer env={activeEnv} />
      ) : (
        <Environment preset="night" />
      )}

      {/* Base ambient — state-dependent */}
      <ambientLight intensity={0.1 + awareness.alterationDepth * 0.05} color="#1e1b4b" />

      {/* Key light — shifts warm/cool with state */}
      <directionalLight
        position={[5, 12, 5]}
        intensity={0.25 + awareness.alterationDepth * 0.17}
        color="#c4b5fd"
      />

      {/* Fill light — subtle warm from below to reveal dark shapes */}
      <pointLight position={[0, -4, 8]} intensity={0.12} color="#a78bfa" distance={20} decay={2} />
      <pointLight position={[-8, 2, 6]} intensity={0.08} color="#e2e8f0" distance={15} decay={2} />

      <SceneControls />

      {/* Core consciousness sphere — no pointer interaction, skip raycasting */}
      <group raycast={() => null}>
        <ConsciousnessCore awareness={awareness} />
      </group>

      {/* Orbiting active substance orbs — interactive (hover tooltip) */}
      {activeSubstances.map((sub, i) => (
        <ActiveSubstanceOrb
          key={sub}
          substance={sub}
          intensity={awareness.substances[sub]}
          orbitIndex={i}
          totalActive={activeSubstances.length}
        />
      ))}

      {/* Non-interactive scene elements — skip raycasting */}
      <group raycast={() => null}>
        {/* Cursor glow — attention probe */}
        <CursorGlow awareness={awareness} />

        {/* Biometric environmental field */}
        <BiometricField awareness={awareness} />
      </group>
    </Canvas>
  );
}

/**
 * Cursor glow — a soft luminous point that follows the mouse through 3D space.
 * Represents the observer's attention/focus probing the awareness field.
 */
function CursorGlow({ awareness }: { awareness: AwarenessState }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const smoothPos = useRef(new THREE.Vector3(0, 0, 5));
  const targetVec = useRef(new THREE.Vector3(0, 0, 5));

  useFrame((state) => {
    const pointer = state.pointer;

    // Map 2D pointer to 3D position in front of scene
    const targetX = pointer.x * 8;
    const targetY = pointer.y * 5 + 1;
    const targetZ = 5;

    targetVec.current.set(targetX, targetY, targetZ);
    smoothPos.current.lerp(targetVec.current, 0.1);

    if (groupRef.current) {
      groupRef.current.position.copy(smoothPos.current);
    }

    // Glow pulses with cursor movement speed
    if (glowRef.current) {
      const speed = Math.abs(pointer.x - (smoothPos.current.x / 8)) +
                    Math.abs(pointer.y - ((smoothPos.current.y - 1) / 5));
      const movementGlow = Math.min(1, speed * 10);
      const scale = 0.15 + movementGlow * 0.1 + awareness.alterationDepth * 0.1;
      glowRef.current.scale.setScalar(scale);

      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = 0.15 + movementGlow * 0.3 + awareness.psychedelicLoad * 0.15;
      }
    }

    // Trail — lagging soft echo
    if (trailRef.current) {
      trailRef.current.scale.setScalar(0.3 + awareness.alterationDepth * 0.2);
      const mat = trailRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== undefined) {
        mat.opacity = 0.04 + awareness.psychedelicLoad * 0.06;
      }
    }
  });

  // Color based on dominant substance or neutral
  const glowColor = awareness.dominant
    ? SUBSTANCE_CONFIG[awareness.dominant].color
    : '#818cf8';

  return (
    <group ref={groupRef}>
      {/* Core glow point */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.2}
        />
      </mesh>
      {/* Soft halo */}
      <mesh ref={trailRef}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.05}
        />
      </mesh>
      {/* Cursor light emission */}
      <pointLight
        color={glowColor}
        intensity={0.5 + awareness.alterationDepth * 0.7}
        distance={10}
        decay={2}
      />
    </group>
  );
}

/** Overlay HUD showing real-time state readout */
export function AwarenessHUD({ className }: { className?: string }) {
  const { awareness } = useAwarenessState();

  const activeSubstances = SUBSTANCE_KEYS.filter(k => awareness.substances[k] > 0.02);

  return (
    <div className={`bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-3 ${className || ''}`}>
      <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Awareness State</div>

      {/* Biometric vitals */}
      <div className="flex gap-3 text-xs text-zinc-500 mb-3">
        {awareness.hr != null && (
          <span className="flex items-center gap-1">
            <span className="text-red-400 animate-pulse">♡</span>
            {awareness.hr}
          </span>
        )}
        {awareness.stress != null && (
          <span className={awareness.stress > 50 ? 'text-red-400' : ''}>
            σ{awareness.stress}
          </span>
        )}
        {awareness.bodyBattery != null && (
          <span className={awareness.bodyBattery < 30 ? 'text-amber-400' : 'text-cyan-400'}>
            ⚡{awareness.bodyBattery}
          </span>
        )}
      </div>

      {/* Active substances with intensity bars */}
      {activeSubstances.length > 0 ? (
        <div className="space-y-1.5">
          {activeSubstances.map(key => {
            const cfg = SUBSTANCE_CONFIG[key];
            const intensity = awareness.substances[key];
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs w-5">{cfg.icon}</span>
                <span className="text-[11px] text-zinc-400 w-12 shrink-0">{cfg.label}</span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${intensity * 100}%`,
                      backgroundColor: cfg.color,
                      boxShadow: `0 0 6px ${cfg.color}60`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-zinc-600 w-8 text-right font-mono">
                  {(intensity * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-zinc-600">Baseline — no active substances</div>
      )}

      {/* Composite loads */}
      {awareness.alterationDepth > 0.05 && (
        <div className="mt-3 pt-2 border-t border-zinc-800">
          <div className="flex gap-3 text-[10px] text-zinc-600">
            {awareness.psychedelicLoad > 0.05 && (
              <span style={{ color: '#ec4899' }}>
                Psychedelic {(awareness.psychedelicLoad * 100).toFixed(0)}%
              </span>
            )}
            {awareness.sedativeLoad > 0.05 && (
              <span style={{ color: '#6366f1' }}>
                Sedative {(awareness.sedativeLoad * 100).toFixed(0)}%
              </span>
            )}
            {awareness.stimulantLoad > 0.05 && (
              <span style={{ color: '#f59e0b' }}>
                Stimulant {(awareness.stimulantLoad * 100).toFixed(0)}%
              </span>
            )}
            {awareness.adaptogenicLoad > 0.05 && (
              <span style={{ color: '#d97706' }}>
                Adaptogène {(awareness.adaptogenicLoad * 100).toFixed(0)}%
              </span>
            )}
            {awareness.serotonergicSupport > 0.05 && (
              <span style={{ color: '#a855f7' }}>
                5-HTP {(awareness.serotonergicSupport * 100).toFixed(0)}%
              </span>
            )}
            {awareness.neuroprotectiveLoad > 0.05 && (
              <span style={{ color: '#0ea5e9' }}>
                Neuro {(awareness.neuroprotectiveLoad * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
