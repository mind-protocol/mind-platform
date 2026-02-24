'use client';

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
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
import FloatingKeyboard from './FloatingKeyboard';
import EnvironmentRenderer from './environments/EnvironmentRenderer';
import { useKeyboardReactive, type KeyboardDebugStats } from '@/lib/tracker/hooks/useKeyboardReactive';

export default function AwarenessMirror() {
  const { awareness, loading } = useAwarenessState();
  const { active: activeEnv } = useEnvironments();
  const [dpr, setDpr] = useState<number>(1.5);
  const { keyStatesRef, decayKeys, debugRef, lastTypingRef, listening, startMic, stopMic } = useKeyboardReactive({ enabled: true });

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

      {/* Floating keyboard — audio-reactive AZERTY ghost */}
      <group raycast={() => null}>
        <FloatingKeyboard
          keyStatesRef={keyStatesRef}
          decayKeys={decayKeys}
          position={[0, -1.5, 7]}
          rotation={[-0.35, 0, 0]}
          scale={2.0}
        />
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

/** Mini Awareness HUD — glowing dots with collapse, resizable */
const HUD_WIDTH_KEY = 'awareness-hud-width';
const DEFAULT_HUD_WIDTH = 200;
const MIN_HUD_WIDTH = 120;
const MAX_HUD_WIDTH = 420;

export function AwarenessHUD({ className }: { className?: string }) {
  const { awareness } = useAwarenessState();
  const [collapsed, setCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_HUD_WIDTH);
  const widthRef = useRef(DEFAULT_HUD_WIDTH);
  const resizingRef = useRef(false);

  // Load saved width on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HUD_WIDTH_KEY);
      if (saved) {
        const w = Math.max(MIN_HUD_WIDTH, Math.min(MAX_HUD_WIDTH, parseInt(saved, 10)));
        setPanelWidth(w);
        widthRef.current = w;
      }
    } catch { /* ignore */ }
  }, []);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = true;
    const startX = e.clientX;
    const startW = widthRef.current;

    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = ev.clientX - startX;
      const next = Math.max(MIN_HUD_WIDTH, Math.min(MAX_HUD_WIDTH, startW + delta));
      widthRef.current = next;
      setPanelWidth(next);
    };

    const onUp = () => {
      resizingRef.current = false;
      localStorage.setItem(HUD_WIDTH_KEY, String(widthRef.current));
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const activeSubstances = SUBSTANCE_KEYS.filter(k => awareness.substances[k] > 0.02);

  // Collapsed: just a column of glowing dots
  if (collapsed) {
    return (
      <div className={`flex items-center gap-1.5 ${className || ''}`}>
        <button
          onClick={() => setCollapsed(false)}
          className="text-zinc-700 hover:text-zinc-400 transition text-xs"
          title="Expand"
        >
          &rsaquo;
        </button>
        <div className="flex flex-col gap-1.5">
          {/* Biometric dots */}
          {awareness.hr != null && (
            <div
              className="rounded-full animate-pulse"
              style={{
                width: 6, height: 6,
                backgroundColor: '#ef4444',
                boxShadow: '0 0 6px #ef444480',
              }}
              title={`HR ${awareness.hr}`}
            />
          )}
          {awareness.stress != null && (
            <div
              className="rounded-full"
              style={{
                width: 5 + (awareness.stress / 100) * 4,
                height: 5 + (awareness.stress / 100) * 4,
                backgroundColor: awareness.stress > 50 ? '#ef4444' : '#a1a1aa',
                boxShadow: awareness.stress > 50 ? '0 0 8px #ef444480' : '0 0 4px #a1a1aa40',
                filter: `blur(${awareness.stress > 70 ? 0.5 : 0}px)`,
              }}
              title={`Stress ${awareness.stress}`}
            />
          )}
          {awareness.bodyBattery != null && (
            <div
              className="rounded-full"
              style={{
                width: 4 + (awareness.bodyBattery / 100) * 5,
                height: 4 + (awareness.bodyBattery / 100) * 5,
                backgroundColor: awareness.bodyBattery < 30 ? '#f59e0b' : '#22d3ee',
                boxShadow: `0 0 ${4 + (awareness.bodyBattery / 100) * 8}px ${awareness.bodyBattery < 30 ? '#f59e0b60' : '#22d3ee60'}`,
              }}
              title={`BB ${awareness.bodyBattery}`}
            />
          )}
          {/* Substance dots */}
          {activeSubstances.map(key => {
            const cfg = SUBSTANCE_CONFIG[key];
            const intensity = awareness.substances[key];
            const size = 4 + intensity * 7;
            return (
              <div
                key={key}
                className="rounded-full transition-all duration-500"
                style={{
                  width: size, height: size,
                  backgroundColor: cfg.color,
                  boxShadow: `0 0 ${4 + intensity * 12}px ${cfg.color}80`,
                  filter: `blur(${intensity > 0.5 ? 0.5 : 0}px)`,
                }}
                title={`${cfg.label} ${(intensity * 100).toFixed(0)}%`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 rounded-lg p-2.5 relative ${className || ''}`}
      style={{ width: panelWidth }}
    >
      {/* Right-edge resize handle */}
      <div
        onMouseDown={onResizeStart}
        className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize group z-10 rounded-r-lg"
        title="Drag to resize"
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full bg-zinc-700/0 group-hover:bg-zinc-500/60 transition-colors" />
      </div>
      {/* Header with collapse button */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[9px] uppercase tracking-wider text-zinc-600">Awareness</div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-zinc-800 font-mono">{panelWidth}px</span>
          <button
            onClick={() => setCollapsed(true)}
            className="text-zinc-700 hover:text-zinc-400 transition text-[10px] px-1"
            title="Collapse"
          >
            &lsaquo;
          </button>
        </div>
      </div>

      {/* Biometric vitals — compact row with dots */}
      <div className="flex items-center gap-2.5 mb-2">
        {awareness.hr != null && (
          <span className="flex items-center gap-1 text-[10px] text-zinc-500">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: '#ef4444', boxShadow: '0 0 4px #ef444480' }}
            />
            {awareness.hr}
          </span>
        )}
        {awareness.stress != null && (
          <span className="flex items-center gap-1 text-[10px]" style={{ color: awareness.stress > 50 ? '#ef4444' : '#a1a1aa' }}>
            <span
              className="inline-block rounded-full"
              style={{
                width: 5 + (awareness.stress / 100) * 3,
                height: 5 + (awareness.stress / 100) * 3,
                backgroundColor: awareness.stress > 50 ? '#ef4444' : '#a1a1aa',
                boxShadow: awareness.stress > 50 ? '0 0 6px #ef444460' : 'none',
              }}
            />
            {awareness.stress}
          </span>
        )}
        {awareness.bodyBattery != null && (
          <span className="flex items-center gap-1 text-[10px]" style={{ color: awareness.bodyBattery < 30 ? '#f59e0b' : '#22d3ee' }}>
            <span
              className="inline-block rounded-full"
              style={{
                width: 4 + (awareness.bodyBattery / 100) * 4,
                height: 4 + (awareness.bodyBattery / 100) * 4,
                backgroundColor: awareness.bodyBattery < 30 ? '#f59e0b' : '#22d3ee',
                boxShadow: `0 0 ${3 + (awareness.bodyBattery / 100) * 6}px ${awareness.bodyBattery < 30 ? '#f59e0b50' : '#22d3ee50'}`,
              }}
            />
            {awareness.bodyBattery}
          </span>
        )}
      </div>

      {/* Active substances — dot + label, no bars */}
      {activeSubstances.length > 0 ? (
        <div className="space-y-1">
          {activeSubstances.map(key => {
            const cfg = SUBSTANCE_CONFIG[key];
            const intensity = awareness.substances[key];
            const dotSize = 5 + intensity * 6;
            const glowSize = 3 + intensity * 10;
            return (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="inline-block rounded-full shrink-0 transition-all duration-500"
                  style={{
                    width: dotSize, height: dotSize,
                    backgroundColor: cfg.color,
                    boxShadow: `0 0 ${glowSize}px ${cfg.color}80`,
                    filter: intensity > 0.6 ? `blur(0.5px)` : 'none',
                  }}
                />
                <span className="text-[10px] text-zinc-500">{cfg.label}</span>
                <span className="text-[9px] text-zinc-700 font-mono ml-auto">
                  {(intensity * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-[10px] text-zinc-700">Baseline</div>
      )}
    </div>
  );
}
