'use client';

import { useState } from 'react';
import type { AwarenessState } from '@/lib/tracker/pharmacokinetics';
import type { CockpitState } from '@/lib/tracker/hooks/useCockpitState';
import { SUBSTANCE_KEYS, SUBSTANCE_CONFIG } from '@/lib/tracker/constants';

// ─── Region Definitions ────────────────────────────────────────────────

export type RegionId = 'body' | 'mind' | 'mission' | 'env' | 'logs';

interface RegionDef {
  id: RegionId;
  label: string;
  icon: string;
  color: string;
}

const REGIONS: RegionDef[] = [
  { id: 'body',    label: 'Body',    icon: '🫀', color: '#ef4444' },
  { id: 'mind',    label: 'Mind',    icon: '🧠', color: '#818cf8' },
  { id: 'mission', label: 'Mission', icon: '🎯', color: '#f59e0b' },
  { id: 'env',     label: 'Env',     icon: '🌍', color: '#22c55e' },
  { id: 'logs',    label: 'Logs',    icon: '📋', color: '#6b7280' },
];

// ─── Component ─────────────────────────────────────────────────────────

export default function CockpitRegions({
  awareness,
  cockpit,
  visible,
}: {
  awareness: AwarenessState;
  cockpit: CockpitState;
  visible: boolean;
}) {
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null);

  if (!visible) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Region tab strip — vertical */}
      <div className="flex flex-col gap-1">
        {REGIONS.map(r => {
          const isActive = activeRegion === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRegion(isActive ? null : r.id)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-mono transition-all duration-300 border ${
                isActive
                  ? 'border-opacity-50 bg-opacity-15'
                  : 'border-zinc-800/50 bg-zinc-900/60 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
              }`}
              style={isActive ? {
                borderColor: `${r.color}50`,
                backgroundColor: `${r.color}15`,
                color: r.color,
              } : undefined}
            >
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Region panel */}
      {activeRegion && (
        <div
          className="bg-zinc-900/80 backdrop-blur-md border rounded-lg p-3 w-64 max-h-80 overflow-y-auto scrollbar-hide"
          style={{
            borderColor: `${REGIONS.find(r => r.id === activeRegion)!.color}30`,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {activeRegion === 'body' && <BodyRegion awareness={awareness} />}
          {activeRegion === 'mind' && <MindRegion awareness={awareness} cockpit={cockpit} />}
          {activeRegion === 'mission' && <MissionRegion cockpit={cockpit} />}
          {activeRegion === 'env' && <EnvRegion />}
          {activeRegion === 'logs' && <LogsRegion />}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Body Region ───────────────────────────────────────────────────────

function BodyRegion({ awareness }: { awareness: AwarenessState }) {
  const metrics = [
    { label: 'Heart Rate', value: awareness.hr, unit: 'bpm', color: '#ef4444', icon: '❤️' },
    { label: 'Stress', value: awareness.stress, unit: '', color: awareness.stress != null && awareness.stress > 50 ? '#ef4444' : '#a1a1aa', icon: '⚡' },
    { label: 'Body Battery', value: awareness.bodyBattery, unit: '%', color: awareness.bodyBattery != null && awareness.bodyBattery < 30 ? '#f59e0b' : '#22d3ee', icon: '🔋' },
    { label: 'Hydration', value: awareness.hydrationLevel > 0 ? `${(awareness.hydrationLevel * 100).toFixed(0)}%` : null, unit: '', color: '#3b82f6', icon: '💧' },
  ];

  return (
    <div className="space-y-2">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Biometrics</div>
      {metrics.map(m => {
        if (m.value == null) return null;
        return (
          <div key={m.label} className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <span>{m.icon}</span> {m.label}
            </span>
            <span className="text-[11px] font-mono font-medium" style={{ color: m.color }}>
              {typeof m.value === 'number' ? m.value : m.value}{m.unit}
            </span>
          </div>
        );
      })}

      {/* Composite loads */}
      <div className="mt-2 pt-2 border-t border-zinc-800/40 space-y-1.5">
        <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Loads</div>
        {[
          { label: 'Sedative', value: awareness.sedativeLoad, color: '#818cf8' },
          { label: 'Stimulant', value: awareness.stimulantLoad, color: '#f59e0b' },
          { label: 'Serotonergic', value: awareness.serotonergicSupport, color: '#22c55e' },
          { label: 'Neuroprotective', value: awareness.neuroprotectiveLoad, color: '#06b6d4' },
          { label: 'Adaptogenic', value: awareness.adaptogenicLoad, color: '#84cc16' },
          { label: 'Antidepressant', value: awareness.antidepressantBaseline, color: '#a78bfa' },
        ].filter(l => l.value > 0.02).map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-600 w-20 shrink-0">{l.label}</span>
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${l.value * 100}%`, backgroundColor: l.color }}
              />
            </div>
            <span className="text-[8px] text-zinc-700 font-mono w-7 text-right">
              {(l.value * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mind Region ───────────────────────────────────────────────────────

function MindRegion({ awareness, cockpit }: { awareness: AwarenessState; cockpit: CockpitState }) {
  const activeSubstances = SUBSTANCE_KEYS.filter(k => awareness.substances[k] > 0.02);

  return (
    <div className="space-y-2">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Consciousness State</div>

      {/* Mode display */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{
            backgroundColor: cockpit.color,
            boxShadow: `0 0 8px ${cockpit.color}60`,
          }}
        />
        <div>
          <div className="text-[11px] font-bold font-mono" style={{ color: cockpit.color }}>
            {cockpit.headline}
          </div>
          <div className="text-[9px] text-zinc-500">{cockpit.subline}</div>
        </div>
      </div>

      {/* Alteration depth */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-zinc-600 w-16 shrink-0">Alteration</span>
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${awareness.alterationDepth * 100}%`,
              background: `linear-gradient(90deg, #818cf8, ${cockpit.color})`,
            }}
          />
        </div>
        <span className="text-[9px] text-zinc-600 font-mono">{(awareness.alterationDepth * 100).toFixed(0)}%</span>
      </div>

      {/* Active substances */}
      {activeSubstances.length > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-800/40 space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Active Substances</div>
          {activeSubstances.map(key => {
            const cfg = SUBSTANCE_CONFIG[key];
            const intensity = awareness.substances[key];
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px]">{cfg.icon}</span>
                <span className="text-[10px] text-zinc-500 flex-1">{cfg.label}</span>
                <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${intensity * 100}%`, backgroundColor: cfg.color }}
                  />
                </div>
                <span className="text-[8px] text-zinc-700 font-mono w-6 text-right">
                  {(intensity * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Signals */}
      {cockpit.signals.length > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-800/40">
          <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Signals</div>
          <div className="flex flex-wrap gap-1">
            {cockpit.signals.map(sig => (
              <span
                key={sig.source}
                className="px-1.5 py-0.5 rounded text-[8px] font-mono border"
                style={{
                  borderColor: sig.severity === 'alert' ? '#ef444440' : sig.severity === 'warn' ? '#f59e0b40' : '#22c55e40',
                  color: sig.severity === 'alert' ? '#ef4444' : sig.severity === 'warn' ? '#f59e0b' : '#22c55e',
                  backgroundColor: sig.severity === 'alert' ? '#ef444410' : sig.severity === 'warn' ? '#f59e0b10' : '#22c55e10',
                }}
              >
                {sig.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mission Region ────────────────────────────────────────────────────

function MissionRegion({ cockpit }: { cockpit: CockpitState }) {
  return (
    <div className="space-y-2">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Current Mission</div>

      {cockpit.nextAction ? (
        <div
          className="p-2 rounded border text-[10px] font-mono"
          style={{
            borderColor: `${cockpit.color}30`,
            backgroundColor: `${cockpit.color}08`,
            color: cockpit.color,
          }}
        >
          {cockpit.nextAction}
        </div>
      ) : (
        <div className="text-[10px] text-zinc-600">No active directive</div>
      )}

      <div className="text-[9px] text-zinc-700 mt-2">
        Use the Direction Map to set priorities and track progress on active tasks.
      </div>
    </div>
  );
}

// ─── Environment Region ────────────────────────────────────────────────

function EnvRegion() {
  const now = new Date();
  const hour = now.getHours();
  const isNight = hour < 7 || hour > 22;
  const isDaytime = hour >= 7 && hour <= 18;

  return (
    <div className="space-y-2">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Environment</div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">Time</span>
        <span className="text-[11px] font-mono text-zinc-400">
          {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-500">Phase</span>
        <span className="text-[10px] font-mono" style={{ color: isNight ? '#818cf8' : isDaytime ? '#f59e0b' : '#6b7280' }}>
          {isNight ? 'Night' : isDaytime ? 'Day' : 'Twilight'}
        </span>
      </div>
    </div>
  );
}

// ─── Logs Region ───────────────────────────────────────────────────────

function LogsRegion() {
  return (
    <div className="space-y-2">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Recent Events</div>
      <div className="text-[10px] text-zinc-600">
        Event stream coming soon. Use the tracker timeline for full history.
      </div>
    </div>
  );
}
