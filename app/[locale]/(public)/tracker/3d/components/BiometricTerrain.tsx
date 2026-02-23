'use client';

import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute, DoubleSide } from 'three';
import type { TimeseriesPoint } from '@/lib/tracker/hooks/useTrackerData';

interface TerrainProps {
  timeseries: TimeseriesPoint[];
  xScale: (date: Date) => number;
}

function buildRibbon(
  timeseries: TimeseriesPoint[],
  xScale: (date: Date) => number,
  field: 'stress' | 'body_battery',
  baseY: number,
  maxHeight: number,
  color: [number, number, number],
): BufferGeometry | null {
  const filtered = timeseries.filter(p => p[field] != null);
  if (filtered.length < 2) return null;

  // Downsample if too many points (keep every Nth)
  const maxPoints = 2000;
  const step = Math.max(1, Math.floor(filtered.length / maxPoints));
  const sampled = filtered.filter((_, i) => i % step === 0);

  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < sampled.length; i++) {
    const p = sampled[i];
    const x = xScale(new Date(p.ts)) as number;
    const val = (p[field] ?? 0) / 100;
    const height = val * maxHeight;

    // Top vertex
    positions.push(x, baseY + height, 0);
    colors.push(color[0] * val + 0.1 * (1 - val), color[1] * val + 0.1 * (1 - val), color[2] * val + 0.1 * (1 - val));

    // Bottom vertex
    positions.push(x, baseY, 0);
    colors.push(0.1, 0.1, 0.12);

    // Build triangle strip indices
    if (i > 0) {
      const v = i * 2;
      indices.push(v - 2, v - 1, v);
      indices.push(v - 1, v + 1, v);
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export default function BiometricTerrain({ timeseries, xScale }: TerrainProps) {
  const stressGeo = useMemo(
    () => buildRibbon(timeseries, xScale, 'stress', -2, 2.5, [0.9, 0.2, 0.2]),
    [timeseries, xScale],
  );

  const bbGeo = useMemo(
    () => buildRibbon(timeseries, xScale, 'body_battery', -5, 2.5, [0.05, 0.7, 0.8]),
    [timeseries, xScale],
  );

  return (
    <group>
      {stressGeo && (
        <mesh geometry={stressGeo}>
          <meshBasicMaterial vertexColors transparent opacity={0.5} side={DoubleSide} />
        </mesh>
      )}
      {bbGeo && (
        <mesh geometry={bbGeo}>
          <meshBasicMaterial vertexColors transparent opacity={0.5} side={DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
