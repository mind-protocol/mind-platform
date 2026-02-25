'use client';

import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import {
  AZERTY_ROWS, FUNCTION_ROW, NUMPAD_ROWS,
  NAV_ROW_1, NAV_ROW_2, ARROW_ROW_1, ARROW_ROW_2,
  KEY_STATES, type KeyDef,
} from '@/lib/tracker/hooks/useKeyboardReactive';

// ── Neighbor map for glow spill ──────────────────────────────────────────
const ALL_ROWS = [...AZERTY_ROWS];
function buildNeighborMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const positions = new Map<string, { row: number; col: number }>();
  ALL_ROWS.forEach((row, rowIdx) => {
    row.forEach((key, colIdx) => {
      positions.set(key.code, { row: rowIdx, col: colIdx });
    });
  });
  positions.forEach(({ row, col }, code) => {
    const neighbors: string[] = [];
    const rowKeys = ALL_ROWS[row];
    if (col > 0) neighbors.push(rowKeys[col - 1].code);
    if (col < rowKeys.length - 1) neighbors.push(rowKeys[col + 1].code);
    if (row > 0) {
      const above = ALL_ROWS[row - 1];
      for (let i = Math.max(0, col - 1); i <= Math.min(above.length - 1, col + 1); i++)
        neighbors.push(above[i].code);
    }
    if (row < ALL_ROWS.length - 1) {
      const below = ALL_ROWS[row + 1];
      for (let i = Math.max(0, col - 1); i <= Math.min(below.length - 1, col + 1); i++)
        neighbors.push(below[i].code);
    }
    map.set(code, neighbors);
  });
  return map;
}
const NEIGHBOR_MAP = buildNeighborMap();

// ── Sizing ──────────────────────────────────────────────────────────────
const U = 42;          // base key unit (px)
const GAP = 3;         // gap between keys
const H = 38;          // key height
const FN_H = 28;       // function row key height (smaller)
const SECTION_GAP = 12; // gap between keyboard sections

// ── Styles ──────────────────────────────────────────────────────────────
// 3-stop silver gradient for idle keys (more depth/dimension)
const IDLE_BG = 'linear-gradient(180deg, rgba(92,98,112,0.96) 0%, rgba(63,68,80,0.98) 52%, rgba(38,42,52,1) 100%)';
const IDLE_BORDER = 'rgba(180,190,215,0.16)';
const IDLE_SHADOW = 'inset 0 1px 0 rgba(255,255,255,.10), inset 0 -1px 0 rgba(0,0,0,.35), 0 1px 2px rgba(0,0,0,.4)';
const IDLE_LABEL = 'rgba(225,232,245,.88)';

// ── Color palettes ──────────────────────────────────────────────────────
type Palette = {
  key: string;
  name: string;
  swatch: string; // CSS color for the picker dot
  bg: (g: number) => string;
  border: (g: number) => string;
  shadow: (g: number) => string;
  label: (g: number) => string;
};

const PALETTES: Palette[] = [
  {
    key: 'ice', name: 'Ice', swatch: '#5588ff',
    bg: (g) => `linear-gradient(180deg, rgba(130,170,255,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(85,125,235,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(45,78,175,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(150,190,255,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(110,160,255,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(75,130,255,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(245,250,255,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'amber', name: 'Amber', swatch: '#f59e0b',
    bg: (g) => `linear-gradient(180deg, rgba(255,190,80,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(235,150,45,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(175,95,25,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(255,200,100,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(255,170,50,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(255,150,30,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(255,250,235,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'emerald', name: 'Emerald', swatch: '#10b981',
    bg: (g) => `linear-gradient(180deg, rgba(80,220,160,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(40,180,120,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(20,120,80,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(100,230,170,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(60,200,140,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(40,180,120,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(240,255,248,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'violet', name: 'Violet', swatch: '#8b5cf6',
    bg: (g) => `linear-gradient(180deg, rgba(170,120,255,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(130,80,235,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(85,45,175,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(180,140,255,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(150,100,255,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(120,70,255,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(250,245,255,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'rose', name: 'Rose', swatch: '#f43f5e',
    bg: (g) => `linear-gradient(180deg, rgba(255,110,140,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(235,70,100,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(175,35,65,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(255,130,160,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(255,90,120,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(255,60,100,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(255,245,248,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'sunset', name: 'Sunset', swatch: 'linear-gradient(135deg, #f97316, #ef4444)',
    bg: (g) => `linear-gradient(180deg, rgba(255,150,60,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(240,100,50,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(180,50,30,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(255,160,80,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(255,120,50,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(240,80,40,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(255,250,240,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'cyan', name: 'Cyan', swatch: '#06b6d4',
    bg: (g) => `linear-gradient(180deg, rgba(60,210,240,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(30,170,210,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(15,110,155,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(80,220,245,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(40,200,235,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(20,180,220,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(240,252,255,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'mono', name: 'Mono', swatch: '#d4d4d8',
    bg: (g) => `linear-gradient(180deg, rgba(210,215,225,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(170,175,185,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(120,125,135,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(220,225,235,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(200,205,215,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(180,185,195,.25), inset 0 1px 0 rgba(255,255,255,.30)`,
    label: (g) => `rgba(255,255,255,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'sakura', name: 'Sakura', swatch: 'linear-gradient(135deg, #fbb6ce, #c084fc)',
    bg: (g) => `linear-gradient(180deg, rgba(251,182,206,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(220,140,200,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(160,80,160,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(250,190,220,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(240,160,200,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(220,130,190,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(255,248,252,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'aurora', name: 'Aurora', swatch: 'linear-gradient(135deg, #34d399, #818cf8)',
    bg: (g) => `linear-gradient(180deg, rgba(80,220,170,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(100,160,230,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(70,90,180,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(110,210,200,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(80,190,180,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(70,170,200,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(240,255,250,${(0.85+g*0.15).toFixed(2)})`,
  },
];

const PALETTE_MAP = new Map(PALETTES.map(p => [p.key, p]));
const DEFAULT_PALETTE = 'ice';

function loadPalette(): string {
  try { return localStorage.getItem('kbd-palette') || DEFAULT_PALETTE; } catch { return DEFAULT_PALETTE; }
}
function savePalette(key: string) {
  try { localStorage.setItem('kbd-palette', key); } catch { /* noop */ }
}

// ── Render a row of keys ────────────────────────────────────────────────
function KeyRow({
  keys,
  keyH,
  keyEls,
  labelEls,
  offsetPx = 0,
  locks,
}: {
  keys: KeyDef[];
  keyH: number;
  keyEls: React.RefObject<Map<string, HTMLDivElement>>;
  labelEls: React.RefObject<Map<string, HTMLSpanElement>>;
  offsetPx?: number;
  locks?: { caps: boolean; num: boolean; scroll: boolean };
}) {
  return (
    <div className="flex" style={{ gap: GAP, paddingLeft: offsetPx }}>
      {keys.map((k) => {
        const w = k.w * U + (k.w - 1) * GAP;
        const showLabel = k.label.length <= 5;
        const hasLed = k.code === 'CapsLock' || k.code === 'NumLock';
        const ledOn = k.code === 'CapsLock' ? locks?.caps : k.code === 'NumLock' ? locks?.num : false;
        return (
          <div
            key={k.code}
            ref={(el) => { if (el) keyEls.current!.set(k.code, el); }}
            style={{
              width: w,
              height: keyH,
              background: IDLE_BG,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: IDLE_BORDER,
              borderRadius: 5,
              boxShadow: IDLE_SHADOW,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'background 60ms, border-color 60ms, box-shadow 80ms, transform 60ms',
            }}
          >
            {showLabel && (
              <span
                ref={(el) => { if (el) labelEls.current!.set(k.code, el); }}
                style={{
                  fontSize: keyH > 30 ? (k.label.length === 1 ? 13 : k.label.length <= 2 ? 10 : 8) : (k.label.length === 1 ? 10 : 8),
                  color: IDLE_LABEL,
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  userSelect: 'none',
                  lineHeight: 1,
                  transition: 'color 60ms',
                }}
              >
                {k.label}
              </span>
            )}
            {/* Lock LED indicator (CapsLock / NumLock) */}
            {hasLed && (
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  right: 4,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: ledOn ? 'rgba(120,220,255,.95)' : 'rgba(90,95,110,.35)',
                  boxShadow: ledOn ? '0 0 8px rgba(80,180,255,.65)' : 'none',
                  transition: 'all 200ms',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────
export default function FloatingKeyboardOverlay({ typing = false }: { typing?: boolean }) {
  const keyEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const labelEls = useRef<Map<string, HTMLSpanElement>>(new Map());
  const pressedRef = useRef<Set<string>>(new Set());
  const locksRef = useRef({ caps: false, num: false, scroll: false });
  const [locks, setLocks] = useState({ caps: false, num: false, scroll: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Drag + resize state
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null); // null = auto centered
  const [userScale, setUserScale] = useState<number | null>(null); // null = auto
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  // Palette state
  const [paletteKey, setPaletteKey] = useState(DEFAULT_PALETTE);
  const paletteRef = useRef<Palette>(PALETTES[0]);
  const [showPalettes, setShowPalettes] = useState(false);

  // Load palette from localStorage on mount
  useEffect(() => {
    const key = loadPalette();
    setPaletteKey(key);
    paletteRef.current = PALETTE_MAP.get(key) || PALETTES[0];
  }, []);

  const selectPalette = useCallback((key: string) => {
    setPaletteKey(key);
    paletteRef.current = PALETTE_MAP.get(key) || PALETTES[0];
    savePalette(key);
    setShowPalettes(false);
  }, []);

  // Max AZERTY row width for centering
  const maxRowUnits = useMemo(() =>
    Math.max(...AZERTY_ROWS.map(row => row.reduce((s, k) => s + k.w, 0))),
  []);

  // Compute responsive scale on mount + resize (smaller default)
  const computeScale = useCallback(() => {
    if (!containerRef.current) return;
    const naturalW = containerRef.current.scrollWidth;
    const viewW = window.innerWidth * 0.70;
    const viewH = window.innerHeight * 0.35;
    const naturalH = containerRef.current.scrollHeight;
    const s = Math.min(viewW / naturalW, viewH / naturalH, 0.85);
    setScale(Math.max(0.35, s));
  }, []);

  useEffect(() => {
    // Delay to let layout settle
    const t = setTimeout(computeScale, 50);
    window.addEventListener('resize', computeScale);
    return () => { clearTimeout(t); window.removeEventListener('resize', computeScale); };
  }, [computeScale]);

  // Direct keydown/keyup for immediate visual response + lock state
  // Only call setLocks when modifier state actually changes (avoids re-render on every keystroke)
  useEffect(() => {
    const maybeUpdateLocks = (e: KeyboardEvent) => {
      const caps = e.getModifierState('CapsLock');
      const num = e.getModifierState('NumLock');
      const scroll = e.getModifierState('ScrollLock');
      const prev = locksRef.current;
      if (caps !== prev.caps || num !== prev.num || scroll !== prev.scroll) {
        const next = { caps, num, scroll };
        locksRef.current = next;
        setLocks(next);
      }
    };
    const onDown = (e: KeyboardEvent) => {
      pressedRef.current.add(e.code);
      maybeUpdateLocks(e);
    };
    const onUp = (e: KeyboardEvent) => {
      pressedRef.current.delete(e.code);
      maybeUpdateLocks(e);
    };
    window.addEventListener('keydown', onDown, { passive: true });
    window.addEventListener('keyup', onUp, { passive: true });
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // Animation loop — combine KEY_STATES glow + direct pressed state
  // Reads paletteRef for zero-cost palette switching (no re-render needed)
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      const pal = paletteRef.current;
      for (const [code, el] of keyEls.current) {
        const stateGlow = KEY_STATES.get(code)?.glow ?? 0;
        const pressed = pressedRef.current.has(code);

        // Neighbor spill
        let neighborGlow = 0;
        const neighbors = NEIGHBOR_MAP.get(code);
        if (neighbors) {
          for (const nc of neighbors) {
            const ns = KEY_STATES.get(nc);
            if (ns && ns.glow > neighborGlow) neighborGlow = ns.glow;
          }
        }

        // Combine: pressed gives instant 0.9, KEY_STATES gives smooth decay
        // Neighbor spill is very subtle (0.015) to avoid "group typing" look
        const glow = Math.min(1, Math.max(pressed ? 0.85 : 0, stateGlow) + neighborGlow * 0.015);
        const active = glow > 0.08;

        if (active) {
          el.style.background = pal.bg(glow);
          el.style.borderColor = pal.border(glow);
          el.style.boxShadow = pal.shadow(glow);
          el.style.transform = `translateY(${(glow * 1.5).toFixed(1)}px) scale(0.995)`;
        } else {
          el.style.background = IDLE_BG;
          el.style.borderColor = IDLE_BORDER;
          el.style.boxShadow = IDLE_SHADOW;
          el.style.transform = 'translateY(0)';
        }

        const label = labelEls.current.get(code);
        if (label) {
          label.style.color = active ? pal.label(glow) : IDLE_LABEL;
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const effectiveScale = userScale ?? scale;

  // Drag handlers
  const onDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    const rect = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
    dragStart.current = { mx: e.clientX, my: e.clientY, px: rect.left, py: rect.top };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setPos({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
  }, []);

  const onDragEnd = useCallback(() => { dragging.current = false; }, []);

  const handleResize = useCallback((delta: number) => {
    setUserScale(prev => {
      const cur = prev ?? scale;
      return Math.max(0.25, Math.min(2.0, cur + delta));
    });
  }, [scale]);

  const handleReset = useCallback(() => {
    setPos(null);
    setUserScale(null);
  }, []);

  return (
    <div
      className="fixed z-[52] select-none"
      style={{
        ...(pos
          ? { left: pos.x, top: pos.y }
          : { bottom: 12, left: '50%', transform: 'translateX(-50%)' }),
        opacity: typing ? 1.0 : 0.92,
        transition: dragging.current ? 'none' : 'opacity 300ms',
      }}
      aria-hidden="true"
    >
      {/* Control bar — always interactive */}
      <div className="flex justify-end gap-1 mb-1 pointer-events-auto" style={{ opacity: 0.5, transition: 'opacity 200ms' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.5'; }}
      >
        <button
          onClick={() => handleResize(-0.1)}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-zinc-400 hover:text-white"
          style={{ background: 'rgba(30,33,40,0.9)', border: '1px solid rgba(120,130,155,0.25)' }}
          title="Shrink"
        >−</button>
        <button
          onClick={() => handleResize(0.1)}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-zinc-400 hover:text-white"
          style={{ background: 'rgba(30,33,40,0.9)', border: '1px solid rgba(120,130,155,0.25)' }}
          title="Grow"
        >+</button>
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-zinc-400 hover:text-white cursor-grab active:cursor-grabbing"
          style={{ background: 'rgba(30,33,40,0.9)', border: '1px solid rgba(120,130,155,0.25)', touchAction: 'none' }}
          title="Drag to move"
        >⠿</div>
        {(pos || userScale) && (
          <button
            onClick={handleReset}
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-zinc-400 hover:text-white"
            style={{ background: 'rgba(30,33,40,0.9)', border: '1px solid rgba(120,130,155,0.25)' }}
            title="Reset position & size"
          >↺</button>
        )}
        {/* Palette picker */}
        <div className="relative">
          <button
            onClick={() => setShowPalettes(v => !v)}
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-zinc-400 hover:text-white"
            style={{ background: 'rgba(30,33,40,0.9)', border: '1px solid rgba(120,130,155,0.25)' }}
            title="Color palette"
          >
            <span
              style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: PALETTE_MAP.get(paletteKey)?.swatch || '#5588ff',
              }}
            />
          </button>
          {showPalettes && (
            <div
              className="absolute bottom-full right-0 mb-1 rounded-lg p-2"
              style={{
                background: 'rgba(15,18,25,0.95)',
                border: '1px solid rgba(120,130,155,0.3)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,.5)',
              }}
            >
              <div className="grid grid-cols-5 gap-1.5" style={{ width: 130 }}>
                {PALETTES.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => selectPalette(p.key)}
                    title={p.name}
                    className="group relative"
                    style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: p.swatch,
                      border: paletteKey === p.key
                        ? '2px solid rgba(255,255,255,0.9)'
                        : '1px solid rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transition: 'transform 100ms, border-color 100ms',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="pointer-events-none"
        style={{
          transform: `perspective(1200px) rotateX(8deg) scale(${effectiveScale})`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          ref={containerRef}
          className="rounded-2xl border backdrop-blur-md p-3"
          style={{
            background: 'rgba(5,7,12,0.88)',
            borderColor: 'rgba(120,130,155,0.22)',
            boxShadow: '0 18px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)',
          }}
        >
        {/* Lock indicator LEDs — top right */}
        <div className="flex justify-end gap-3 mb-1.5 mr-1">
          {([
            { on: locks.caps, label: 'CAPS' },
            { on: locks.num, label: 'NUM' },
            { on: locks.scroll, label: 'SCRL' },
          ] as const).map(({ on, label }) => (
            <div key={label} className="flex items-center gap-1.5" style={{ fontSize: 9 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: on ? 'rgba(120,220,255,.95)' : 'rgba(90,95,110,.35)',
                  boxShadow: on ? '0 0 8px rgba(80,180,255,.65)' : 'none',
                  transition: 'all 200ms',
                }}
              />
              <span style={{ color: on ? 'rgba(190,220,255,.9)' : 'rgba(120,130,150,.5)', fontFamily: 'ui-monospace, monospace', transition: 'color 200ms' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex" style={{ gap: SECTION_GAP }}>
          {/* ── Main keyboard section ── */}
          <div className="flex flex-col" style={{ gap: GAP }}>
            {/* Function row */}
            <div className="flex" style={{ gap: GAP, marginBottom: 6 }}>
              {/* Esc separate */}
              <KeyRow
                keys={[FUNCTION_ROW[0]]}
                keyH={FN_H}
                keyEls={keyEls}
                labelEls={labelEls}
              />
              <div style={{ width: U * 0.5 }} /> {/* gap after Esc */}
              {/* F1-F4 */}
              <KeyRow
                keys={FUNCTION_ROW.slice(1, 5)}
                keyH={FN_H}
                keyEls={keyEls}
                labelEls={labelEls}
              />
              <div style={{ width: U * 0.3 }} /> {/* gap */}
              {/* F5-F8 */}
              <KeyRow
                keys={FUNCTION_ROW.slice(5, 9)}
                keyH={FN_H}
                keyEls={keyEls}
                labelEls={labelEls}
              />
              <div style={{ width: U * 0.3 }} /> {/* gap */}
              {/* F9-F12 */}
              <KeyRow
                keys={FUNCTION_ROW.slice(9, 13)}
                keyH={FN_H}
                keyEls={keyEls}
                labelEls={labelEls}
              />
            </div>

            {/* AZERTY rows */}
            {AZERTY_ROWS.map((row, rowIdx) => {
              const rowUnits = row.reduce((s, k) => s + k.w, 0);
              const offsetPx = ((maxRowUnits - rowUnits) / 2) * U;
              return (
                <KeyRow
                  key={rowIdx}
                  keys={row}
                  keyH={H}
                  keyEls={keyEls}
                  labelEls={labelEls}
                  offsetPx={offsetPx}
                  locks={locks}
                />
              );
            })}
          </div>

          {/* ── Navigation cluster ── */}
          <div className="flex flex-col" style={{ gap: GAP, paddingTop: FN_H + 6 + GAP }}>
            <KeyRow keys={NAV_ROW_1} keyH={H} keyEls={keyEls} labelEls={labelEls} />
            <KeyRow keys={NAV_ROW_2} keyH={H} keyEls={keyEls} labelEls={labelEls} />
            {/* Arrow keys — centered */}
            <div style={{ height: H + GAP }} /> {/* spacer */}
            <div className="flex justify-center">
              <KeyRow keys={ARROW_ROW_1} keyH={H} keyEls={keyEls} labelEls={labelEls} />
            </div>
            <KeyRow keys={ARROW_ROW_2} keyH={H} keyEls={keyEls} labelEls={labelEls} />
          </div>

          {/* ── Numpad ── */}
          <div className="flex flex-col" style={{ gap: GAP, paddingTop: FN_H + 6 + GAP }}>
            {NUMPAD_ROWS.map((row, rowIdx) => (
              <KeyRow
                key={rowIdx}
                keys={row}
                keyH={H}
                keyEls={keyEls}
                labelEls={labelEls}
                locks={locks}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
