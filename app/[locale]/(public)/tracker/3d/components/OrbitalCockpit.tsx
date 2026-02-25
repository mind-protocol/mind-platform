'use client';

import { useCallback } from 'react';
import type { AwarenessState } from '@/lib/tracker/pharmacokinetics';
import type { CockpitState } from '@/lib/tracker/hooks/useCockpitState';
import { SUBSTANCE_KEYS, SUBSTANCE_CONFIG } from '@/lib/tracker/constants';
import OrbitalPanel from './OrbitalPanel';
import type { RegionId } from './CockpitRegions';

// ─── Orbital Layout ─────────────────────────────────────────────────────

/** Panel positions in a 180-degree arc in front of the user */
const PANEL_POSITIONS: Record<RegionId, { azimuth: number; elevation: number; distance: number }> = {
  body:    { azimuth: -60, elevation: -10, distance: 6 },
  mind:    { azimuth: -30, elevation: 0,   distance: 6 },
  mission: { azimuth: 0,   elevation: 10,  distance: 6 },
  env:     { azimuth: 30,  elevation: 0,   distance: 6 },
  logs:    { azimuth: 60,  elevation: -10, distance: 6 },
};

/** Tab strip position — centered above the content panels */
const TAB_POSITION = { azimuth: 0, elevation: 20, distance: 5.5 };

// ─── Region definitions (mirrored from CockpitRegions for consistency) ─

interface RegionDef {
  id: RegionId;
  label: string;
  icon: string;
  color: string;
}

const REGIONS: RegionDef[] = [
  { id: 'body',    label: 'Body',    icon: '\u{1FAC0}', color: '#ef4444' },
  { id: 'mind',    label: 'Mind',    icon: '\u{1F9E0}', color: '#818cf8' },
  { id: 'mission', label: 'Mission', icon: '\u{1F3AF}', color: '#f59e0b' },
  { id: 'env',     label: 'Env',     icon: '\u{1F30D}', color: '#22c55e' },
  { id: 'logs',    label: 'Logs',    icon: '\u{1F4CB}', color: '#6b7280' },
];

// ─── Props ──────────────────────────────────────────────────────────────

export interface OrbitalCockpitProps {
  awareness: AwarenessState;
  cockpit: CockpitState;
  activeRegion: RegionId | null;
  setActiveRegion: (region: RegionId | null) => void;
}

// ─── Component ──────────────────────────────────────────────────────────

/**
 * OrbitalCockpit — arranges the 5 Consciousness Cockpit region panels in 3D
 * orbital space around the camera.
 *
 * Must be rendered inside a React Three Fiber Canvas context.
 *
 * Layout:
 *   - Tab strip (navigation buttons) at elevation 20, centered
 *   - Content panels in a 180-degree arc at varying azimuth/elevation
 *   - Only the active region's content panel is visible at a time
 */
export default function OrbitalCockpit({
  awareness,
  cockpit,
  activeRegion,
  setActiveRegion,
}: OrbitalCockpitProps) {
  const handleTabClick = useCallback(
    (id: RegionId) => {
      setActiveRegion(activeRegion === id ? null : id);
    },
    [activeRegion, setActiveRegion],
  );

  return (
    <>
      {/* ── Tab Strip ──────────────────────────────────────────────── */}
      <OrbitalPanel
        azimuth={TAB_POSITION.azimuth}
        elevation={TAB_POSITION.elevation}
        distance={TAB_POSITION.distance}
        visible
        billboard
      >
        <div className="flex items-center gap-1 px-2 py-1.5 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 rounded-xl">
          {REGIONS.map((r) => {
            const isActive = activeRegion === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleTabClick(r.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all duration-300 border ${
                  isActive
                    ? 'border-opacity-50 bg-opacity-20'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: `${r.color}50`,
                        backgroundColor: `${r.color}20`,
                        color: r.color,
                        boxShadow: `0 0 12px ${r.color}15`,
                      }
                    : undefined
                }
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </OrbitalPanel>

      {/* ── Content Panels ─────────────────────────────────────────── */}
      {REGIONS.map((r) => {
        const pos = PANEL_POSITIONS[r.id];
        return (
          <OrbitalPanel
            key={r.id}
            azimuth={pos.azimuth}
            elevation={pos.elevation}
            distance={pos.distance}
            visible={activeRegion === r.id}
            billboard
          >
            <div
              className="bg-zinc-950/85 backdrop-blur-md border rounded-xl p-4 w-72 max-h-80 overflow-y-auto scrollbar-hide"
              style={{
                borderColor: `${r.color}30`,
                boxShadow: `0 0 20px ${r.color}08, inset 0 1px 0 ${r.color}10`,
              }}
            >
              {/* Region header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800/40">
                <span className="text-sm">{r.icon}</span>
                <span
                  className="text-[11px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: r.color }}
                >
                  {r.label}
                </span>
              </div>

              {/* Region content */}
              {r.id === 'body' && <OrbitalBodyRegion awareness={awareness} />}
              {r.id === 'mind' && <OrbitalMindRegion awareness={awareness} cockpit={cockpit} />}
              {r.id === 'mission' && <OrbitalMissionRegion cockpit={cockpit} />}
              {r.id === 'env' && <OrbitalEnvRegion />}
              {r.id === 'logs' && <OrbitalLogsRegion />}
            </div>
          </OrbitalPanel>
        );
      })}
    </>
  );
}

// ─── Body Region ────────────────────────────────────────────────────────

function OrbitalBodyRegion({ awareness }: { awareness: AwarenessState }) {
  const metrics = [
    { label: 'Heart Rate', value: awareness.hr, unit: 'bpm', color: '#ef4444', icon: '\u2764\uFE0F' },
    {
      label: 'Stress',
      value: awareness.stress,
      unit: '',
      color: awareness.stress != null && awareness.stress > 50 ? '#ef4444' : '#a1a1aa',
      icon: '\u26A1',
    },
    {
      label: 'Body Battery',
      value: awareness.bodyBattery,
      unit: '%',
      color: awareness.bodyBattery != null && awareness.bodyBattery < 30 ? '#f59e0b' : '#22d3ee',
      icon: '\u{1F50B}',
    },
    {
      label: 'Hydration',
      value: awareness.hydrationLevel > 0 ? `${(awareness.hydrationLevel * 100).toFixed(0)}%` : null,
      unit: '',
      color: '#3b82f6',
      icon: '\u{1F4A7}',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Biometrics</div>
      {metrics.map((m) => {
        if (m.value == null) return null;
        return (
          <div key={m.label} className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <span>{m.icon}</span> {m.label}
            </span>
            <span className="text-[11px] font-mono font-medium" style={{ color: m.color }}>
              {typeof m.value === 'number' ? m.value : m.value}
              {m.unit}
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
        ]
          .filter((l) => l.value > 0.02)
          .map((l) => (
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

// ─── Mind Region ────────────────────────────────────────────────────────

function OrbitalMindRegion({
  awareness,
  cockpit,
}: {
  awareness: AwarenessState;
  cockpit: CockpitState;
}) {
  const activeSubstances = SUBSTANCE_KEYS.filter((k) => awareness.substances[k] > 0.02);

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
        <span className="text-[9px] text-zinc-600 font-mono">
          {(awareness.alterationDepth * 100).toFixed(0)}%
        </span>
      </div>

      {/* Active substances */}
      {activeSubstances.length > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-800/40 space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">
            Active Substances
          </div>
          {activeSubstances.map((key) => {
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
            {cockpit.signals.map((sig) => (
              <span
                key={sig.source}
                className="px-1.5 py-0.5 rounded text-[8px] font-mono border"
                style={{
                  borderColor:
                    sig.severity === 'alert'
                      ? '#ef444440'
                      : sig.severity === 'warn'
                        ? '#f59e0b40'
                        : '#22c55e40',
                  color:
                    sig.severity === 'alert'
                      ? '#ef4444'
                      : sig.severity === 'warn'
                        ? '#f59e0b'
                        : '#22c55e',
                  backgroundColor:
                    sig.severity === 'alert'
                      ? '#ef444410'
                      : sig.severity === 'warn'
                        ? '#f59e0b10'
                        : '#22c55e10',
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

// ─── Mission Region ─────────────────────────────────────────────────────

function OrbitalMissionRegion({ cockpit }: { cockpit: CockpitState }) {
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

// ─── Environment Region ─────────────────────────────────────────────────

function OrbitalEnvRegion() {
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
        <span
          className="text-[10px] font-mono"
          style={{ color: isNight ? '#818cf8' : isDaytime ? '#f59e0b' : '#6b7280' }}
        >
          {isNight ? 'Night' : isDaytime ? 'Day' : 'Twilight'}
        </span>
      </div>
    </div>
  );
}

// ─── Logs Region ────────────────────────────────────────────────────────

function OrbitalLogsRegion() {
  return (
    <div className="space-y-2">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-1">Recent Events</div>
      <div className="text-[10px] text-zinc-600">
        Event stream coming soon. Use the tracker timeline for full history.
      </div>
    </div>
  );
}
