'use client';

import { useRef, useEffect } from 'react';
import { SUBSTANCE_KEYS, SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';
import type { ProjectionPoint } from '@/lib/tracker/planning';

interface PKProjectionOverlayProps {
  projection: ProjectionPoint[];
  startMs: number;
  totalWidth: number;
  totalDurationMs: number;
  laneHeight: number;
  nowMs: number;
}

export default function PKProjectionOverlay({
  projection,
  startMs,
  totalWidth,
  totalDurationMs,
  laneHeight,
  nowMs,
}: PKProjectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || projection.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const height = SUBSTANCE_KEYS.length * laneHeight;

    canvas.width = totalWidth * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${totalWidth}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, totalWidth, height);

    const tsToX = (tsMs: number) =>
      ((tsMs - startMs) / totalDurationMs) * totalWidth;

    const nowX = tsToX(nowMs);

    // Draw PK curve for each substance in its lane
    for (let laneIdx = 0; laneIdx < SUBSTANCE_KEYS.length; laneIdx++) {
      const key = SUBSTANCE_KEYS[laneIdx];
      const cfg = SUBSTANCE_CONFIG[key];
      const laneTop = laneIdx * laneHeight;
      const laneBottom = laneTop + laneHeight;
      const curveHeight = laneHeight * 0.8;

      // Check if this substance has any activity
      const hasActivity = projection.some(p => p.substances[key] > 0.01);
      if (!hasActivity) continue;

      // Draw filled area curve
      ctx.beginPath();
      let started = false;
      for (const point of projection) {
        const x = tsToX(point.ts);
        const intensity = point.substances[key];
        const y = laneBottom - 4 - intensity * curveHeight;

        if (!started) {
          ctx.moveTo(x, laneBottom - 4);
          ctx.lineTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      // Close the path back to baseline
      if (started && projection.length > 0) {
        const lastX = tsToX(projection[projection.length - 1].ts);
        ctx.lineTo(lastX, laneBottom - 4);
        ctx.closePath();
      }

      // Fill: past = solid, future = lighter
      const gradient = ctx.createLinearGradient(0, laneTop, 0, laneBottom);
      gradient.addColorStop(0, cfg.color + '30');
      gradient.addColorStop(1, cfg.color + '08');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Stroke: solid for past, dashed for future
      // Past portion
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, laneTop, nowX, laneHeight);
      ctx.clip();

      ctx.beginPath();
      for (let i = 0; i < projection.length; i++) {
        const x = tsToX(projection[i].ts);
        const intensity = projection[i].substances[key];
        const y = laneBottom - 4 - intensity * curveHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = cfg.color + '80';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Future portion (dashed)
      ctx.save();
      ctx.beginPath();
      ctx.rect(nowX, laneTop, totalWidth - nowX, laneHeight);
      ctx.clip();

      ctx.beginPath();
      for (let i = 0; i < projection.length; i++) {
        const x = tsToX(projection[i].ts);
        const intensity = projection[i].substances[key];
        const y = laneBottom - 4 - intensity * curveHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = cfg.color + '50';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();
    }

    // Draw alteration depth line across all lanes
    ctx.beginPath();
    for (let i = 0; i < projection.length; i++) {
      const x = tsToX(projection[i].ts);
      const totalLaneHeight = SUBSTANCE_KEYS.length * laneHeight;
      const y = totalLaneHeight - projection[i].alterationDepth * totalLaneHeight * 0.3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#a78bfa40';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [projection, startMs, totalWidth, totalDurationMs, laneHeight, nowMs]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: totalWidth, height: SUBSTANCE_KEYS.length * laneHeight }}
    />
  );
}
