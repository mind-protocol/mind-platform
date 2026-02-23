'use client';

import { useMemo } from 'react';
import { scaleTime } from 'd3';

export interface GridLine {
  x: number;
  label: string;
}

const WORLD_WIDTH = 40; // -20 to +20

export function useTimeScale(events: { ts: string }[], days: number) {
  return useMemo(() => {
    const now = new Date();
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const xScale = scaleTime()
      .domain([start, now])
      .range([-WORLD_WIDTH / 2, WORLD_WIDTH / 2]);

    // Generate grid lines
    const gridLines: GridLine[] = [];
    const intervalHours = days <= 7 ? 6 : days <= 14 ? 12 : 24;
    const cursor = new Date(start);
    cursor.setMinutes(0, 0, 0);
    cursor.setHours(Math.ceil(cursor.getHours() / intervalHours) * intervalHours);

    while (cursor <= now) {
      const x = xScale(cursor) as number;
      const label = intervalHours >= 24
        ? cursor.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        : cursor.toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      gridLines.push({ x, label });
      cursor.setTime(cursor.getTime() + intervalHours * 60 * 60 * 1000);
    }

    return { xScale, gridLines, worldWidth: WORLD_WIDTH };
  }, [events.length, days]);
}
