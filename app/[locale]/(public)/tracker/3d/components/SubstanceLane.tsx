'use client';

import { Line } from '@react-three/drei';
import { SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';
import type { TrackerEntry, SubstanceEvent } from '@/lib/tracker/hooks/useTrackerData';
import SubstanceMarker from './SubstanceMarker';

interface LaneProps {
  substance: SubstanceKey;
  events: SubstanceEvent[];
  entries: TrackerEntry[];
  xScale: (date: Date) => number;
  worldWidth: number;
}

export default function SubstanceLane({ substance, events, entries, xScale, worldWidth }: LaneProps) {
  const cfg = SUBSTANCE_CONFIG[substance];
  const laneY = cfg.laneY;

  // Build entry lookup by timestamp for biometric data
  const entryMap = new Map<string, TrackerEntry>();
  for (const e of entries) {
    entryMap.set(e.ts, e);
  }

  return (
    <group>
      {/* Lane rail — faint horizontal line */}
      {events.length > 0 && (
        <Line
          points={[[-worldWidth / 2, laneY, 0], [worldWidth / 2, laneY, 0]]}
          color={cfg.color}
          lineWidth={0.5}
          transparent
          opacity={0.12}
        />
      )}

      {/* Substance event markers */}
      {events.map((event, i) => {
        const x = xScale(new Date(event.ts)) as number;
        const entry = entryMap.get(event.ts);
        return (
          <SubstanceMarker
            key={`${substance}-${i}`}
            substance={substance}
            position={[x, laneY, 0]}
            amount={event.dose.amount}
            entry={entry}
          />
        );
      })}
    </group>
  );
}
