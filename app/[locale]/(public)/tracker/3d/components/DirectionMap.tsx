'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────

interface Direction {
  id: string;
  label: string;
  description: string;
  effort: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  category: 'infra' | 'product' | 'ux' | 'safety' | 'business' | 'growth' | 'polish';
  status: 'ready' | 'in_progress' | 'done' | 'blocked';
}

// ─── Default Directions (roadmap) ─────────────────────────────────────

const DIRECTIONS: Direction[] = [
  {
    id: 'chat-fix',
    label: 'Chat Webapp',
    description: 'Texte + voix + réponses fonctionnels',
    effort: '2-3h',
    impact: 'critical',
    category: 'infra',
    status: 'in_progress',
  },
  {
    id: 'email-transactional',
    label: 'Email Transactionnel',
    description: 'Reset password, magic links, confirmations',
    effort: '1-2h',
    impact: 'critical',
    category: 'infra',
    status: 'ready',
  },
  {
    id: 'onboarding',
    label: 'Onboarding Flow',
    description: 'Guide post-register: Garmin, fiche santé, premier log',
    effort: '2-3h',
    impact: 'high',
    category: 'product',
    status: 'ready',
  },
  {
    id: 'mobile-responsive',
    label: 'Mobile Responsive',
    description: 'Audit + fix responsive pour tout le tracker',
    effort: '2-3h',
    impact: 'high',
    category: 'ux',
    status: 'ready',
  },
  {
    id: 'quick-log',
    label: 'Quick-Log WhatsApp/TG',
    description: '"pris ma venla" → log auto via messaging',
    effort: '2h',
    impact: 'medium',
    category: 'product',
    status: 'ready',
  },
  {
    id: 'reco-safety',
    label: 'Recommandations × Santé',
    description: 'Croiser allergies/conditions avec recommandations',
    effort: '2h',
    impact: 'high',
    category: 'safety',
    status: 'ready',
  },
  {
    id: 'export-pdf',
    label: 'Export PDF Santé',
    description: 'Fiche santé exportable pour le médecin',
    effort: '1-2h',
    impact: 'medium',
    category: 'product',
    status: 'ready',
  },
  {
    id: 'stripe',
    label: 'Stripe Checkout',
    description: 'Paiement, tiers free/premium/$MIND',
    effort: '3h',
    impact: 'high',
    category: 'business',
    status: 'ready',
  },
  {
    id: 'push-notifs',
    label: 'Push Notifications',
    description: 'Rappels doses planifiées, alertes interactions',
    effort: '2-3h',
    impact: 'medium',
    category: 'product',
    status: 'ready',
  },
  {
    id: 'chronicle',
    label: 'Comm Autonome',
    description: 'Posts X/Telegram automatiques, chronicle system',
    effort: '2h',
    impact: 'medium',
    category: 'growth',
    status: 'ready',
  },
  {
    id: 'tracker-polish',
    label: 'Polish Tracker',
    description: 'Bugs UI, animations, micro-interactions',
    effort: '1-2h',
    impact: 'low',
    category: 'polish',
    status: 'ready',
  },
];

// ─── Visual Constants ─────────────────────────────────────────────────

const IMPACT_COLORS: Record<Direction['impact'], string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#8b5cf6',
  low: '#6b7280',
};

const IMPACT_GLOW: Record<Direction['impact'], string> = {
  critical: 'rgba(239, 68, 68, 0.3)',
  high: 'rgba(245, 158, 11, 0.2)',
  medium: 'rgba(139, 92, 246, 0.15)',
  low: 'rgba(107, 114, 128, 0.1)',
};

const CATEGORY_ICONS: Record<Direction['category'], string> = {
  infra: '\u2699\uFE0F',
  product: '\u{1F4E6}',
  ux: '\u{1F4F1}',
  safety: '\u{1F6E1}\uFE0F',
  business: '\u{1F4B3}',
  growth: '\u{1F4E3}',
  polish: '\u2728',
};

const STATUS_BADGE: Record<Direction['status'], { label: string; color: string }> = {
  ready: { label: 'READY', color: '#22c55e' },
  in_progress: { label: 'IN PROGRESS', color: '#3b82f6' },
  done: { label: 'DONE', color: '#6b7280' },
  blocked: { label: 'BLOCKED', color: '#ef4444' },
};

// ─── Constellation Layout ─────────────────────────────────────────────

function getConstellationPositions(count: number): { x: number; y: number }[] {
  // Distribute items in a golden-angle spiral
  const positions: { x: number; y: number }[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const r = 30 + Math.sqrt(i / count) * 35; // 30-65% from center
    const theta = i * goldenAngle;
    positions.push({
      x: 50 + r * Math.cos(theta),
      y: 50 + r * Math.sin(theta) * 0.7, // compress Y for widescreen
    });
  }
  return positions;
}

// ─── Component ────────────────────────────────────────────────────────

export default function DirectionMap({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [directions, setDirections] = useState<Direction[]>(DIRECTIONS);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
    }
  }, [visible]);

  const positions = getConstellationPositions(directions.length);

  const updateStatus = useCallback((id: string, status: Direction['status']) => {
    setDirections(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  }, []);

  const selectedDir = directions.find(d => d.id === selected);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-auto">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Title */}
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h2 className="text-lg font-mono font-bold text-white tracking-wider">
          DIRECTION MAP
        </h2>
        <p className="text-xs text-zinc-500 mt-1">Constellation des priorités</p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className={`absolute top-6 right-6 z-10 text-zinc-500 hover:text-white text-sm transition-all duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}
      >
        ESC
      </button>

      {/* Constellation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: animateIn ? 0.15 : 0, transition: 'opacity 1s' }}>
          {positions.map((pos, i) => {
            // Connect to nearest 2 neighbors
            const nearest = positions
              .map((p, j) => ({ j, dist: Math.hypot(p.x - pos.x, p.y - pos.y) }))
              .filter(n => n.j !== i)
              .sort((a, b) => a.dist - b.dist)
              .slice(0, 2);
            return nearest.map(n => (
              <line
                key={`${i}-${n.j}`}
                x1={`${pos.x}%`}
                y1={`${pos.y}%`}
                x2={`${positions[n.j].x}%`}
                y2={`${positions[n.j].y}%`}
                stroke={IMPACT_COLORS[directions[i].impact]}
                strokeWidth="0.5"
                strokeDasharray="4 4"
              />
            ));
          })}
        </svg>

        {/* Direction nodes */}
        {directions.map((dir, i) => {
          const pos = positions[i];
          const color = IMPACT_COLORS[dir.impact];
          const glow = IMPACT_GLOW[dir.impact];
          const isSelected = selected === dir.id;
          const size = dir.impact === 'critical' ? 'w-32' : dir.impact === 'high' ? 'w-28' : 'w-24';
          const delay = i * 80;

          return (
            <button
              key={dir.id}
              onClick={() => setSelected(isSelected ? null : dir.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${size} p-2.5 rounded-xl border transition-all duration-300 cursor-pointer group ${
                isSelected
                  ? 'scale-110 z-20'
                  : 'hover:scale-105 z-10'
              }`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                borderColor: isSelected ? color : `${color}40`,
                backgroundColor: isSelected ? `${color}15` : `rgba(24, 24, 27, 0.8)`,
                boxShadow: isSelected ? `0 0 30px ${glow}` : `0 0 15px ${glow}`,
                opacity: animateIn ? 1 : 0,
                transform: `translate(-50%, -50%) scale(${animateIn ? (isSelected ? 1.1 : 1) : 0.5})`,
                transitionDelay: `${delay}ms`,
              }}
            >
              <div className="text-center">
                <div className="text-base mb-0.5">{CATEGORY_ICONS[dir.category]}</div>
                <div className="text-[10px] font-mono font-bold truncate" style={{ color }}>
                  {dir.label}
                </div>
                <div className="text-[8px] text-zinc-600 mt-0.5">{dir.effort}</div>
                {/* Status dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full mx-auto mt-1"
                  style={{ backgroundColor: STATUS_BADGE[dir.status].color }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {selectedDir && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-md"
          style={{ animation: 'fadeInUp 0.3s ease-out' }}
        >
          <div
            className="bg-zinc-900/95 backdrop-blur-md border rounded-2xl p-5 mx-4"
            style={{ borderColor: `${IMPACT_COLORS[selectedDir.impact]}40` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CATEGORY_ICONS[selectedDir.category]}</span>
                  <h3 className="text-sm font-bold text-white">{selectedDir.label}</h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{selectedDir.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border"
                  style={{
                    color: IMPACT_COLORS[selectedDir.impact],
                    borderColor: `${IMPACT_COLORS[selectedDir.impact]}40`,
                  }}
                >
                  {selectedDir.impact.toUpperCase()}
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">{selectedDir.effort}</span>
              </div>
            </div>

            {/* Status controls */}
            <div className="flex gap-1.5 mt-3">
              {(['ready', 'in_progress', 'done'] as const).map(s => {
                const badge = STATUS_BADGE[s];
                const isActive = selectedDir.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedDir.id, s)}
                    className={`flex-1 py-1.5 text-[9px] font-mono rounded-lg border transition ${
                      isActive
                        ? 'border-opacity-100'
                        : 'border-opacity-20 opacity-40 hover:opacity-70'
                    }`}
                    style={{
                      borderColor: badge.color,
                      backgroundColor: isActive ? `${badge.color}15` : 'transparent',
                      color: badge.color,
                    }}
                  >
                    {badge.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className={`absolute bottom-8 right-6 z-10 transition-all duration-700 ${animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <div className="space-y-1">
          {(['critical', 'high', 'medium', 'low'] as const).map(impact => (
            <div key={impact} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: IMPACT_COLORS[impact] }} />
              <span className="text-[9px] text-zinc-600 font-mono uppercase">{impact}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
