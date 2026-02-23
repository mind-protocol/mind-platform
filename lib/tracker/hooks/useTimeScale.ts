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

    // Adaptive grid interval based on range
    let intervalMs: number;
    let formatLabel: (d: Date) => string;

    const totalMs = days * 24 * 60 * 60 * 1000;

    if (totalMs <= 10 * 60 * 1000) {
      // <= 10 minutes: grid every 1 minute
      intervalMs = 60 * 1000;
      formatLabel = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else if (totalMs <= 60 * 60 * 1000) {
      // <= 1 hour: grid every 5 minutes
      intervalMs = 5 * 60 * 1000;
      formatLabel = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (totalMs <= 6 * 60 * 60 * 1000) {
      // <= 6 hours: grid every 30 minutes
      intervalMs = 30 * 60 * 1000;
      formatLabel = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (totalMs <= 24 * 60 * 60 * 1000) {
      // <= 1 day: grid every 2 hours
      intervalMs = 2 * 60 * 60 * 1000;
      formatLabel = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      // > 1 day: grid every 6 hours
      intervalMs = 6 * 60 * 60 * 1000;
      formatLabel = (d) => d.toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    // Generate grid lines
    const gridLines: GridLine[] = [];
    const cursor = new Date(Math.ceil(start.getTime() / intervalMs) * intervalMs);

    while (cursor <= now) {
      const x = xScale(cursor) as number;
      gridLines.push({ x, label: formatLabel(cursor) });
      cursor.setTime(cursor.getTime() + intervalMs);
    }

    return { xScale, gridLines, worldWidth: WORLD_WIDTH };
  }, [events.length, days]);
}
