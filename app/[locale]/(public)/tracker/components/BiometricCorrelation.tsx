'use client';

import { useEffect, useState, useRef } from 'react';

interface TimeseriesPoint {
  ts: string;
  ts_ms: number;
  stress?: number;
  body_battery?: number;
}

interface SubstanceEvent {
  ts: string;
  ts_ms: number;
  substance: string;
  dose: { amount: number; unit: string };
  intent: string;
}

interface CorrelationData {
  timeseries: TimeseriesPoint[];
  events: SubstanceEvent[];
}

const SUB_COLORS: Record<string, string> = {
  thc: '#22c55e',
  cbd: '#84cc16',
  lions_mane: '#b45309',
  caffeine: '#d97706',
  ketamine: '#8b5cf6',
  lsd: '#ec4899',
  nicotine: '#f59e0b',
  hydration: '#3b82f6',
  melatonin: '#6366f1',
  venlafaxine: '#14b8a6',
  sertraline: '#06b6d4',
  prazepam: '#94a3b8',
  cyamemazine: '#7e22ce',
  dynabiane: '#10b981',
  omegabiane: '#0ea5e9',
  griffonia: '#a855f7',
  valeriane: '#65a30d',
  safran: '#f97316',
  yoga: '#f472b6',
  vitamine_c: '#fb923c',
  cocaine: '#e2e8f0',
  mmc: '#22d3ee',
  heroine: '#78350f',
};

const SUB_ICONS: Record<string, string> = {
  thc: '🌿',
  cbd: '🌱',
  lions_mane: '🦁',
  caffeine: '☕',
  ketamine: '💎',
  lsd: '🔮',
  nicotine: '💨',
  hydration: '💧',
  melatonin: '🌙',
  venlafaxine: '💊',
  sertraline: '💊',
  prazepam: '🫧',
  cyamemazine: '🌌',
  dynabiane: '🧬',
  omegabiane: '🐟',
  griffonia: '🌰',
  valeriane: '🌾',
  safran: '🌸',
  yoga: '🧘',
  vitamine_c: '🍊',
  cocaine: '⚠️',
  mmc: '⚠️',
  heroine: '🚨',
};

export default function BiometricCorrelation({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<CorrelationData | null>(null);
  const [range, setRange] = useState(1);
  const [hover, setHover] = useState<{ x: number; point?: TimeseriesPoint; event?: SubstanceEvent } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/tracker/correlation?days=${range}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (!d) { setData({ timeseries: [], events: [] }); return; }
        if (d.timeseries && d.events) setData(d);
        else setData({ timeseries: [], events: [] });
      })
      .catch(() => setData({ timeseries: [], events: [] }));
  }, [refreshKey, range]);

  useEffect(() => {
    if (!data || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = 200;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const pad = { top: 10, right: 10, bottom: 30, left: 40 };
    const cw = Math.max(1, w - pad.left - pad.right);
    const ch = Math.max(1, h - pad.top - pad.bottom);

    ctx.clearRect(0, 0, w, h);

    const { timeseries, events } = data;
    if (timeseries.length === 0) {
      ctx.fillStyle = '#52525b';
      ctx.font = '13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('No biometric data available', w / 2, h / 2);
      return;
    }

    const minTs = timeseries[0].ts_ms;
    const maxTs = timeseries[timeseries.length - 1].ts_ms;
    const tsRange = maxTs - minTs || 1;

    const x = (ts: number) => pad.left + ((ts - minTs) / tsRange) * cw;
    const yStress = (v: number) => pad.top + ch - (v / 100) * ch;
    const yBB = (v: number) => pad.top + ch - (v / 100) * ch;

    // Grid lines
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 0.5;
    for (let v = 0; v <= 100; v += 25) {
      const y = pad.top + ch - (v / 100) * ch;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = '#52525b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(String(v), pad.left - 4, y + 3);
    }

    // Time labels
    const labelCount = Math.min(6, timeseries.length);
    ctx.fillStyle = '#52525b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.floor((i / (labelCount - 1)) * (timeseries.length - 1));
      const p = timeseries[idx];
      const d = new Date(p.ts);
      const label = range <= 1
        ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      ctx.fillText(label, x(p.ts_ms), h - 5);
    }

    // Draw stress line (red/orange)
    const stressPoints = timeseries.filter((p) => p.stress !== undefined);
    if (stressPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.8;
      stressPoints.forEach((p, i) => {
        const px = x(p.ts_ms);
        const py = yStress(p.stress!);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw body battery line (cyan)
    const bbPoints = timeseries.filter((p) => p.body_battery !== undefined);
    if (bbPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.8;
      bbPoints.forEach((p, i) => {
        const px = x(p.ts_ms);
        const py = yBB(p.body_battery!);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw substance event markers
    for (const evt of events) {
      const ex = x(evt.ts_ms);
      const color = SUB_COLORS[evt.substance] || '#ffffff';

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ex, pad.top);
      ctx.lineTo(ex, pad.top + ch);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Marker dot at top
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(ex, pad.top + 4, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Legend
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    const legendY = pad.top + 4;

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(w - pad.right - 120, legendY - 4, 8, 2);
    ctx.fillStyle = '#71717a';
    ctx.fillText('Stress', w - pad.right - 108, legendY);

    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(w - pad.right - 60, legendY - 4, 8, 2);
    ctx.fillStyle = '#71717a';
    ctx.fillText('BB', w - pad.right - 48, legendY);
  }, [data, range]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!data || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    setHover({ x: mx });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-400">Biometric Correlation</h3>
        <div className="flex gap-1">
          {[1, 7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-2 py-0.5 rounded text-xs transition ${
                range === d
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {d === 1 ? 'Today' : `${d}d`}
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="relative" onMouseMove={handleMouseMove} onMouseLeave={() => setHover(null)}>
        <canvas ref={canvasRef} className="w-full" />
      </div>

      {/* Event legend */}
      {data && data.events.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {data.events.slice(0, 8).map((evt, i) => (
            <span
              key={i}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: SUB_COLORS[evt.substance] + '15', color: SUB_COLORS[evt.substance] }}
            >
              {SUB_ICONS[evt.substance]} {new Date(evt.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              {evt.intent && ` · ${evt.intent}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
