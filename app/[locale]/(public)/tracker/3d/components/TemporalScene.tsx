'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, Environment } from '@react-three/drei';
import { useTrackerData } from '@/lib/tracker/hooks/useTrackerData';
import { useTimeScale } from '@/lib/tracker/hooks/useTimeScale';
import { SUBSTANCE_KEYS, type SubstanceKey } from '@/lib/tracker/constants';
import SceneControls from './SceneControls';
import AmbientLighting from './AmbientLighting';
import TimeAxis from './TimeAxis';
import SubstanceLane from './SubstanceLane';
import BiometricTerrain from './BiometricTerrain';
import ReflectorFloor from './ReflectorFloor';

interface TemporalSceneProps {
  days: number;
}

export default function TemporalScene({ days }: TemporalSceneProps) {
  const { entries, timeseries, events, loading } = useTrackerData(days);
  const { xScale, gridLines, worldWidth } = useTimeScale(events, days);
  const [dpr, setDpr] = useState<number>(1.5);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-zinc-600 text-sm font-mono animate-pulse">Loading temporal data...</div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 10, 25], fov: 50 }}
      dpr={dpr}
      gl={{ antialias: true, alpha: false, toneMapping: 3 }}
      style={{ background: '#09090b' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
      <color attach="background" args={['#09090b']} />
      <fog attach="fog" args={['#09090b', 40, 90]} />

      {/* Environment map for reflections/refractions on transmission materials */}
      <Environment preset="night" />

      <AmbientLighting />
      <SceneControls />
      <TimeAxis gridLines={gridLines} worldWidth={worldWidth} />

      {/* Reflective ground plane */}
      <ReflectorFloor worldWidth={worldWidth} />

      {SUBSTANCE_KEYS.map((sub: SubstanceKey) => (
        <SubstanceLane
          key={sub}
          substance={sub}
          events={events.filter(e => e.substance === sub)}
          entries={entries.filter(e => e.substance === sub)}
          xScale={xScale as (date: Date) => number}
          worldWidth={worldWidth}
        />
      ))}

      <BiometricTerrain
        timeseries={timeseries}
        xScale={xScale as (date: Date) => number}
      />
    </Canvas>
  );
}
