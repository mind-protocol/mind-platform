'use client';

import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute, DoubleSide } from 'three';
import type { TimeseriesPoint } from '@/lib/tracker/hooks/useTrackerData';

interface TerrainProps {
  timeseries: TimeseriesPoint[];
  xScale: (date: Date) => number;
}

function buildSurface(
  timeseries: TimeseriesPoint[],
  xScale: (date: Date) => number,
  field: 'stress' | 'body_battery',
  baseY: number,
  maxHeight: number,
  depth: number,
): BufferGeometry | null {
  const filtered = timeseries.filter(p => p[field] != null);
  if (filtered.length < 2) return null;

  const maxPoints = 1500;
  const step = Math.max(1, Math.floor(filtered.length / maxPoints));
  const sampled = filtered.filter((_, i) => i % step === 0);

  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  // Build a 3D volume: front face, back face, top surface, bottom
  // Front and back Z offsets for depth
  const zFront = depth / 2;
  const zBack = -depth / 2;

  for (let i = 0; i < sampled.length; i++) {
    const p = sampled[i];
    const x = xScale(new Date(p.ts)) as number;
    const val = (p[field] ?? 0) / 100;
    const height = val * maxHeight;

    // 4 vertices per sample: front-top, front-bottom, back-top, back-bottom
    const v = i * 4;

    // Front top
    positions.push(x, baseY + height, zFront);
    colors.push(val, val * 0.3, val * 0.2);

    // Front bottom
    positions.push(x, baseY, zFront);
    colors.push(0.05, 0.05, 0.06);

    // Back top
    positions.push(x, baseY + height, zBack);
    colors.push(val * 0.6, val * 0.2, val * 0.15);

    // Back bottom
    positions.push(x, baseY, zBack);
    colors.push(0.03, 0.03, 0.04);

    if (i > 0) {
      const pv = (i - 1) * 4;

      // Front face (2 triangles)
      indices.push(pv, pv + 1, v);
      indices.push(pv + 1, v + 1, v);

      // Back face (2 triangles)
      indices.push(pv + 2, v + 2, pv + 3);
      indices.push(pv + 3, v + 2, v + 3);

      // Top surface (2 triangles connecting front-top and back-top)
      indices.push(pv, v, pv + 2);
      indices.push(pv + 2, v, v + 2);

      // Bottom surface
      indices.push(pv + 1, pv + 3, v + 1);
      indices.push(pv + 3, v + 3, v + 1);
    }
  }

  // Cap ends
  if (sampled.length > 0) {
    // Start cap
    indices.push(0, 2, 1);
    indices.push(1, 2, 3);

    // End cap
    const last = (sampled.length - 1) * 4;
    indices.push(last, last + 1, last + 2);
    indices.push(last + 1, last + 3, last + 2);
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
    () => buildSurface(timeseries, xScale, 'stress', -2, 2.5, 1.5),
    [timeseries, xScale],
  );

  const bbGeo = useMemo(
    () => buildSurface(timeseries, xScale, 'body_battery', -5, 2.5, 1.5),
    [timeseries, xScale],
  );

  return (
    <group>
      {stressGeo && (
        <mesh geometry={stressGeo}>
          <meshPhysicalMaterial
            vertexColors
            transparent
            opacity={0.55}
            side={DoubleSide}
            roughness={0.3}
            metalness={0.4}
            emissive="#ef4444"
            emissiveIntensity={0.08}
            clearcoat={0.3}
            clearcoatRoughness={0.4}
          />
        </mesh>
      )}
      {bbGeo && (
        <mesh geometry={bbGeo}>
          <meshPhysicalMaterial
            vertexColors
            transparent
            opacity={0.55}
            side={DoubleSide}
            roughness={0.2}
            metalness={0.5}
            emissive="#06b6d4"
            emissiveIntensity={0.08}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
          />
        </mesh>
      )}
    </group>
  );
}
