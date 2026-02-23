'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { SUBSTANCE_KEYS, SUBSTANCE_CONFIG, normalizeDose, type SubstanceKey } from '@/lib/tracker/constants';
import { usePlanningData } from '@/lib/tracker/hooks/usePlanningData';
import { useProjection } from '@/lib/tracker/hooks/useProjection';
import type { IntakeEvent } from '@/lib/tracker/pharmacokinetics';
import type { PlannedDose } from '@/lib/tracker/planning';
import PlannedDoseCard from './PlannedDoseCard';
import PKProjectionOverlay from './PKProjectionOverlay';
import ScheduleDoseForm from './ScheduleDoseForm';
import RegimenManager from './RegimenManager';

const LANE_HEIGHT = 52;
const SIDEBAR_WIDTH = 80;
const HOUR_WIDTH = 120; // pixels per hour

type TimeRange = '24h' | '7d';

export default function PlanningCalendar() {
  const [range, setRange] = useState<TimeRange>('24h');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleDefaults, setScheduleDefaults] = useState<{
    substance?: SubstanceKey;
    ts?: string;
    dose?: { amount: number; unit: string; details?: Record<string, unknown> };
    intent?: string;
    source?: string;
  }>({});
  const [showRegimens, setShowRegimens] = useState(false);
  const [pastIntakes, setPastIntakes] = useState<IntakeEvent[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const nowLineRef = useRef<HTMLDivElement>(null);

  const hoursAhead = range === '24h' ? 24 : 168;
  const hoursBehind = range === '24h' ? 6 : 24;
  const pixelsPerHour = range === '24h' ? HOUR_WIDTH : 18;

  const { planned, regimens, loading, takeDose, skipDose, snoozeDose, scheduleDose, createRegimen, toggleRegimen, refresh } = usePlanningData(range === '24h' ? 2 : 8);

  // Fetch past intakes for PK projection
  useEffect(() => {
    const fetchPast = async () => {
      try {
        const res = await fetch('/api/tracker/log?days=1');
        const data = await res.json();
        const entries = data.entries || [];
        const intakes: IntakeEvent[] = entries.map((e: { ts: string; substance: string; dose: { amount: number } }) => ({
          substance: e.substance as SubstanceKey,
          ts: e.ts,
          amount: e.dose.amount,
          normalizedDose: SUBSTANCE_KEYS.includes(e.substance as SubstanceKey)
            ? normalizeDose(e.substance as SubstanceKey, e.dose.amount)
            : 0.5,
        }));
        setPastIntakes(intakes);
      } catch { /* silent */ }
    };
    fetchPast();
    const interval = setInterval(fetchPast, 30_000);
    return () => clearInterval(interval);
  }, []);

  const projection = useProjection(pastIntakes, planned, hoursAhead, hoursBehind, range === '24h' ? 5 : 30);

  // Time calculations
  const now = Date.now();
  const startMs = now - hoursBehind * 60 * 60_000;
  const totalHours = hoursAhead + hoursBehind;
  const totalWidth = totalHours * pixelsPerHour;

  // Convert timestamp to X position
  const tsToX = useCallback((ts: string | number) => {
    const ms = typeof ts === 'number' ? ts : new Date(ts).getTime();
    return ((ms - startMs) / (totalHours * 60 * 60_000)) * totalWidth;
  }, [startMs, totalHours, totalWidth]);

  // NOW line position
  const nowX = tsToX(now);

  // Scroll to NOW on mount
  useEffect(() => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = Math.max(0, nowX - containerWidth / 3);
    }
  }, [nowX, range]);

  // Update NOW line every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (nowLineRef.current) {
        const currentNowX = tsToX(Date.now());
        nowLineRef.current.style.left = `${currentNowX}px`;
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [tsToX]);

  // Generate hour grid lines
  const gridLines = useMemo(() => {
    const lines: { x: number; label: string; major: boolean }[] = [];
    const start = new Date(startMs);
    start.setMinutes(0, 0, 0);
    const intervalHours = range === '24h' ? 1 : 6;

    let cursor = new Date(start);
    while (cursor.getTime() <= startMs + totalHours * 60 * 60_000) {
      const x = tsToX(cursor.getTime());
      if (x >= 0 && x <= totalWidth) {
        const h = cursor.getHours();
        const major = h === 0 || (range === '24h' && h % 6 === 0);
        const label = range === '24h'
          ? cursor.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          : cursor.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        lines.push({ x, label, major });
      }
      cursor = new Date(cursor.getTime() + intervalHours * 60 * 60_000);
    }
    return lines;
  }, [startMs, totalHours, totalWidth, tsToX, range]);

  // Click on empty area to schedule
  const handleCalendarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = scrollRef.current?.scrollLeft || 0;
    const x = e.clientX - rect.left + scrollLeft - SIDEBAR_WIDTH;
    const y = e.clientY - rect.top - 28; // subtract ruler height

    if (x < 0 || y < 0) return;

    // Determine time from x
    const timeMs = startMs + (x / totalWidth) * totalHours * 60 * 60_000;
    if (timeMs < now) return; // can't schedule in the past

    // Round to nearest 15 min
    const rounded = new Date(Math.round(timeMs / (15 * 60_000)) * 15 * 60_000);
    const ts = rounded.toISOString();

    // Determine substance from y (which lane was clicked)
    const laneIndex = Math.floor(y / LANE_HEIGHT);
    const substance = SUBSTANCE_KEYS[laneIndex] as SubstanceKey | undefined;

    setScheduleDefaults({
      substance: substance || undefined,
      ts,
    });
    setShowScheduleForm(true);
  }, [startMs, totalWidth, totalHours, now]);

  // Position planned doses
  const positionedDoses = useMemo(() => {
    return planned.map(dose => {
      const displayTs = dose.status === 'snoozed' && dose.snooze_until
        ? dose.snooze_until : dose.ts_scheduled;
      const x = tsToX(displayTs);
      const laneIndex = SUBSTANCE_KEYS.indexOf(dose.substance as SubstanceKey);
      const y = laneIndex >= 0 ? laneIndex * LANE_HEIGHT : 0;
      return { dose, x, y };
    }).filter(d => d.x >= -100 && d.x <= totalWidth + 100);
  }, [planned, tsToX, totalWidth]);

  if (loading) {
    return (
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
        <div className="text-zinc-600 text-sm font-mono animate-pulse">Loading planning data...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-zinc-300">Dose Planner</h3>
          <div className="flex bg-zinc-800 rounded p-0.5 text-[11px]">
            {(['24h', '7d'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-0.5 rounded transition ${
                  range === r ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRegimens(!showRegimens)}
            className={`text-[11px] px-2 py-1 rounded transition ${
              showRegimens ? 'bg-indigo-600/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Regimens
          </button>
          <button
            onClick={() => {
              setScheduleDefaults({});
              setShowScheduleForm(true);
            }}
            className="text-[11px] px-2 py-1 rounded bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition"
          >
            + Schedule
          </button>
        </div>
      </div>

      {/* Calendar area */}
      <div className="relative" style={{ height: SUBSTANCE_KEYS.length * LANE_HEIGHT + 28 }}>
        {/* Sticky sidebar with substance labels */}
        <div
          className="absolute left-0 top-0 bottom-0 z-20 bg-zinc-900/95 border-r border-zinc-800"
          style={{ width: SIDEBAR_WIDTH }}
        >
          {/* Empty corner (ruler height) */}
          <div className="h-7 border-b border-zinc-800" />
          {/* Substance lane labels */}
          {SUBSTANCE_KEYS.map((key) => {
            const cfg = SUBSTANCE_CONFIG[key];
            return (
              <div
                key={key}
                className="flex items-center gap-1.5 px-2 border-b border-zinc-800/50"
                style={{ height: LANE_HEIGHT }}
              >
                <span className="text-sm">{cfg.icon}</span>
                <span className="text-[10px] text-zinc-500 truncate">{cfg.label}</span>
              </div>
            );
          })}
        </div>

        {/* Scrollable calendar content */}
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-hidden"
          style={{ marginLeft: SIDEBAR_WIDTH }}
        >
          <div
            className="relative"
            style={{ width: totalWidth, height: SUBSTANCE_KEYS.length * LANE_HEIGHT + 28 }}
            onClick={handleCalendarClick}
          >
            {/* Time ruler */}
            <div className="sticky top-0 z-10 h-7 bg-zinc-900/95 border-b border-zinc-800">
              {gridLines.map((line, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full flex items-end pb-1"
                  style={{ left: line.x }}
                >
                  <span className={`text-[9px] font-mono whitespace-nowrap ${
                    line.major ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {line.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Grid lines + lane rows */}
            <div className="absolute top-7 left-0 right-0 bottom-0">
              {/* Vertical grid lines */}
              {gridLines.map((line, i) => (
                <div
                  key={i}
                  className={`absolute top-0 bottom-0 ${
                    line.major ? 'border-l border-zinc-700/40' : 'border-l border-zinc-800/30'
                  }`}
                  style={{ left: line.x }}
                />
              ))}

              {/* Lane separators */}
              {SUBSTANCE_KEYS.map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-b border-zinc-800/30"
                  style={{ top: (i + 1) * LANE_HEIGHT }}
                />
              ))}

              {/* Future region highlight */}
              <div
                className="absolute top-0 bottom-0 bg-zinc-800/10"
                style={{ left: nowX, right: 0 }}
              />

              {/* PK Projection curves */}
              <PKProjectionOverlay
                projection={projection}
                startMs={startMs}
                totalWidth={totalWidth}
                totalDurationMs={totalHours * 60 * 60_000}
                laneHeight={LANE_HEIGHT}
                nowMs={now}
              />

              {/* NOW line */}
              <div
                ref={nowLineRef}
                className="absolute top-0 bottom-0 z-10"
                style={{ left: nowX }}
              >
                <div className="w-0.5 h-full bg-red-500/60" />
                <div className="absolute -top-0.5 -left-3 text-[8px] font-mono text-red-400 bg-zinc-900/90 px-1 rounded">
                  NOW
                </div>
              </div>

              {/* Planned dose cards */}
              {positionedDoses.map(({ dose, x, y }) => (
                <PlannedDoseCard
                  key={dose.id}
                  dose={dose}
                  onTake={takeDose}
                  onSkip={skipDose}
                  onSnooze={snoozeDose}
                  style={{ left: x, top: y + 4 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regimen manager (collapsible) */}
      {showRegimens && (
        <div className="border-t border-zinc-800">
          <RegimenManager
            regimens={regimens}
            onCreateRegimen={createRegimen}
            onToggleRegimen={toggleRegimen}
          />
        </div>
      )}

      {/* Schedule dose form (modal) */}
      {showScheduleForm && (
        <ScheduleDoseForm
          defaults={scheduleDefaults}
          onSchedule={async (data) => {
            await scheduleDose(data);
            setShowScheduleForm(false);
          }}
          onClose={() => setShowScheduleForm(false)}
        />
      )}
    </div>
  );
}
