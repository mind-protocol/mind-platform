'use client';

import { SUBSTANCE_CONFIG, type SubstanceKey } from '@/lib/tracker/constants';
import type { PlannedDose } from '@/lib/tracker/planning';

interface PlannedDoseCardProps {
  dose: PlannedDose;
  onTake: (id: string) => void;
  onSkip: (id: string) => void;
  onSnooze: (id: string, minutes: number) => void;
  style?: React.CSSProperties;
}

export default function PlannedDoseCard({ dose, onTake, onSkip, onSnooze, style }: PlannedDoseCardProps) {
  const cfg = SUBSTANCE_CONFIG[dose.substance as SubstanceKey];
  if (!cfg) return null;

  const isTaken = dose.status === 'taken';
  const isSkipped = dose.status === 'skipped';
  const isSnoozed = dose.status === 'snoozed';
  const isActive = dose.status === 'scheduled' || dose.status === 'snoozed';

  const displayTime = dose.status === 'snoozed' && dose.snooze_until
    ? new Date(dose.snooze_until)
    : new Date(dose.ts_scheduled);

  const timeStr = displayTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`absolute rounded-lg px-2 py-1.5 text-xs transition-all group ${
        isTaken ? 'opacity-60' : isSkipped ? 'opacity-30 line-through' : ''
      } ${isSnoozed ? 'ring-1 ring-amber-500/40' : ''}`}
      style={{
        backgroundColor: `${cfg.color}18`,
        borderLeft: `3px solid ${cfg.color}${isActive ? '80' : '30'}`,
        minWidth: '80px',
        ...style,
      }}
    >
      {/* Header: icon + substance + time */}
      <div className="flex items-center gap-1.5 mb-0.5">
        <span>{cfg.icon}</span>
        <span className="font-medium text-zinc-200" style={{ color: isActive ? cfg.color : undefined }}>
          {dose.dose.amount}{dose.dose.unit}
        </span>
        <span className="text-zinc-600 ml-auto">{timeStr}</span>
      </div>

      {/* Intent */}
      {dose.intent && (
        <div className="text-[10px] text-zinc-500">{dose.intent}</div>
      )}

      {/* Status badge */}
      {isTaken && (
        <div className="text-[10px] text-emerald-500 mt-0.5">Taken</div>
      )}
      {isSnoozed && (
        <div className="text-[10px] text-amber-400 mt-0.5">Snoozed → {timeStr}</div>
      )}

      {/* Actions — visible on hover for active doses */}
      {isActive && (
        <div className="hidden group-hover:flex gap-1 mt-1.5 pt-1 border-t border-zinc-700/50">
          <button
            onClick={(e) => { e.stopPropagation(); onTake(dose.id); }}
            className="flex-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 transition"
          >
            Take
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSnooze(dose.id, 30); }}
            className="flex-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-600/20 text-amber-400 hover:bg-amber-600/40 transition"
            title="Snooze 30 min"
          >
            +30m
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSnooze(dose.id, 60); }}
            className="px-1.5 py-0.5 rounded text-[10px] bg-amber-600/20 text-amber-400 hover:bg-amber-600/40 transition"
            title="Snooze 1 hour"
          >
            +1h
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSkip(dose.id); }}
            className="px-1.5 py-0.5 rounded text-[10px] bg-red-600/20 text-red-400 hover:bg-red-600/40 transition"
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
}
