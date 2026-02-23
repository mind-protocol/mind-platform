'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Environment } from '@react-three/drei';
import { useAwarenessState } from '@/lib/tracker/hooks/useAwarenessState';
import { SUBSTANCE_KEYS, SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';
import SceneControls from './SceneControls';
import ConsciousnessCore from './ConsciousnessCore';
import ActiveSubstanceOrb from './ActiveSubstanceOrb';
import BiometricField from './BiometricField';

export default function AwarenessMirror() {
  const { awareness, loading } = useAwarenessState();
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
    return '#09090b'; // Default dark
  }, [awareness.psychedelicLoad, awareness.sedativeLoad, awareness.stimulantLoad]);

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

      <Environment preset="night" />

      {/* Base ambient — very dim, state-dependent */}
      <ambientLight intensity={0.08 + awareness.alterationDepth * 0.04} color="#1e1b4b" />

      {/* Key light — shifts warm/cool with state */}
      <directionalLight
        position={[5, 12, 5]}
        intensity={0.2 + awareness.alterationDepth * 0.15}
        color="#c4b5fd"
      />

      <SceneControls />

      {/* Core consciousness sphere */}
      <ConsciousnessCore awareness={awareness} />

      {/* Orbiting active substance orbs */}
      {activeSubstances.map((sub, i) => (
        <ActiveSubstanceOrb
          key={sub}
          substance={sub}
          intensity={awareness.substances[sub]}
          orbitIndex={i}
          totalActive={activeSubstances.length}
        />
      ))}

      {/* Biometric environmental field */}
      <BiometricField awareness={awareness} />
    </Canvas>
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
          </div>
        </div>
      )}
    </div>
  );
}
