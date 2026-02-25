'use client';

import { useState, useRef, useEffect } from 'react';
import { SUBSTANCE_CONFIG, SUBSTANCE_KEYS, type SubstanceKey } from '@/lib/tracker/constants';
import { useSubstanceConfig } from '@/lib/tracker/hooks/useSubstanceConfig';

const DANGER_BADGE: Record<string, string> = {
  moderate: '\u{26A0}\u{FE0F}',
  high: '\u{1F6A8}',
  critical: '\u{2620}\u{FE0F}',
};

export default function SubstanceConfigMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { enabledSet, toggle } = useSubstanceConfig();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Group: visible (non-hidden) first, then hidden/controlled
  const standard = SUBSTANCE_KEYS.filter((k) => !SUBSTANCE_CONFIG[k].hidden);
  const controlled = SUBSTANCE_KEYS.filter((k) => SUBSTANCE_CONFIG[k].hidden);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        title="Configure substances"
        className="text-sm px-2 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition"
      >
        ...
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-72 max-h-[70vh] overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 p-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Substances actives
          </h3>

          {/* Standard substances */}
          <div className="space-y-1 mb-3">
            {standard.map((key) => (
              <SubstanceToggleRow key={key} substanceKey={key} enabled={enabledSet.has(key)} onToggle={toggle} />
            ))}
          </div>

          {/* Controlled / hidden by default */}
          <div className="border-t border-zinc-700 pt-2 mt-2">
            <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>{'\u{26A0}\u{FE0F}'}</span> Substances contr{'\u{00F4}'}l{'\u{00E9}'}es
            </h3>
            <p className="text-[10px] text-zinc-500 mb-2">
              Harm reduction : ces substances sont masqu{'\u{00E9}'}es par d{'\u{00E9}'}faut. Activez-les pour le suivi.
            </p>
            <div className="space-y-1">
              {controlled.map((key) => (
                <SubstanceToggleRow key={key} substanceKey={key} enabled={enabledSet.has(key)} onToggle={toggle} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SubstanceToggleRow({
  substanceKey,
  enabled,
  onToggle,
}: {
  substanceKey: SubstanceKey;
  enabled: boolean;
  onToggle: (k: SubstanceKey) => void;
}) {
  const cfg = SUBSTANCE_CONFIG[substanceKey];
  const danger = cfg.danger || 'none';
  const badge = DANGER_BADGE[danger] || '';

  return (
    <label className="flex items-center gap-2 cursor-pointer group py-0.5">
      <input
        type="checkbox"
        checked={enabled}
        onChange={() => onToggle(substanceKey)}
        className="w-3.5 h-3.5 rounded accent-amber-500"
      />
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: cfg.color }}
      />
      <span className={`text-xs flex-1 ${enabled ? 'text-zinc-200' : 'text-zinc-500'} group-hover:text-zinc-100 transition`}>
        {cfg.icon} {cfg.label}
      </span>
      {badge && <span className="text-xs">{badge}</span>}
      {cfg.forms && cfg.forms.length > 0 && (
        <span className="text-[9px] text-zinc-600">{cfg.forms.length} formes</span>
      )}
    </label>
  );
}
