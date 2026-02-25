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
const IDLE_BG = 'linear-gradient(180deg, rgba(60,65,80,0.92), rgba(38,42,55,0.96))';
const IDLE_BORDER = 'rgba(150,160,185,0.20)';
const IDLE_SHADOW = 'inset 0 1px 0 rgba(180,190,210,.10), 0 1px 2px rgba(0,0,0,.5)';
const IDLE_LABEL = '#8a95ab';

const ACTIVE_BG = (g: number) =>
  `linear-gradient(180deg, rgba(80,140,230,${(0.7 + g * 0.3).toFixed(2)}), rgba(50,100,200,${(0.6 + g * 0.3).toFixed(2)}))`;
const ACTIVE_BORDER = (g: number) =>
  `rgba(100,170,255,${(0.5 + g * 0.4).toFixed(2)})`;
const ACTIVE_SHADOW = (g: number) =>
  `inset 0 1px 0 rgba(200,220,255,.25), 0 0 ${(6 + g * 12).toFixed(0)}px rgba(90,170,255,.35), 0 0 ${(16 + g * 16).toFixed(0)}px rgba(90,170,255,.15)`;
const ACTIVE_LABEL = (g: number) =>
  `rgba(210,230,255,${(0.7 + g * 0.3).toFixed(2)})`;

// ── Render a row of keys ────────────────────────────────────────────────
function KeyRow({
  keys,
  keyH,
  keyEls,
  labelEls,
  offsetPx = 0,
  capsLock,
}: {
  keys: KeyDef[];
  keyH: number;
  keyEls: React.RefObject<Map<string, HTMLDivElement>>;
  labelEls: React.RefObject<Map<string, HTMLSpanElement>>;
  offsetPx?: number;
  capsLock?: boolean;
}) {
  return (
    <div className="flex" style={{ gap: GAP, paddingLeft: offsetPx }}>
      {keys.map((k) => {
        const w = k.w * U + (k.w - 1) * GAP;
        const showLabel = k.label.length <= 5;
        const isCaps = k.code === 'CapsLock';
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
            {/* Caps Lock LED indicator */}
            {isCaps && (
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  right: 4,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: capsLock ? '#4ade80' : 'rgba(100,110,130,0.3)',
                  boxShadow: capsLock ? '0 0 6px #4ade80' : 'none',
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
export default function FloatingKeyboardOverlay() {
  const keyEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const labelEls = useRef<Map<string, HTMLSpanElement>>(new Map());
  const pressedRef = useRef<Set<string>>(new Set());
  const [capsLock, setCapsLock] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Max AZERTY row width for centering
  const maxRowUnits = useMemo(() =>
    Math.max(...AZERTY_ROWS.map(row => row.reduce((s, k) => s + k.w, 0))),
  []);

  // Compute responsive scale on mount + resize
  const computeScale = useCallback(() => {
    if (!containerRef.current) return;
    const naturalW = containerRef.current.scrollWidth;
    const viewW = window.innerWidth * 0.94;
    const viewH = window.innerHeight * 0.55;
    const naturalH = containerRef.current.scrollHeight;
    const s = Math.min(viewW / naturalW, viewH / naturalH, 1.8);
    setScale(Math.max(0.5, s));
  }, []);

  useEffect(() => {
    // Delay to let layout settle
    const t = setTimeout(computeScale, 50);
    window.addEventListener('resize', computeScale);
    return () => { clearTimeout(t); window.removeEventListener('resize', computeScale); };
  }, [computeScale]);

  // Direct keydown/keyup for immediate visual response
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      pressedRef.current.add(e.code);
      if (e.code === 'CapsLock') setCapsLock(prev => !prev);
    };
    const onUp = (e: KeyboardEvent) => {
      pressedRef.current.delete(e.code);
    };
    // Detect initial caps lock state
    const onKeyCheck = (e: KeyboardEvent) => {
      setCapsLock(e.getModifierState('CapsLock'));
    };
    window.addEventListener('keydown', onDown, { passive: true });
    window.addEventListener('keyup', onUp, { passive: true });
    window.addEventListener('keydown', onKeyCheck, { passive: true });
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('keydown', onKeyCheck);
    };
  }, []);

  // Animation loop — combine KEY_STATES glow + direct pressed state
  useEffect(() => {
    let rafId: number;
    const loop = () => {
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

        // Combine: pressed gives instant 0.9, KEY_STATES gives smooth decay, neighbor gives spill
        const glow = Math.min(1, Math.max(pressed ? 0.85 : 0, stateGlow) + neighborGlow * 0.08);
        const active = glow > 0.02;

        if (active) {
          el.style.background = ACTIVE_BG(glow);
          el.style.borderColor = ACTIVE_BORDER(glow);
          el.style.boxShadow = ACTIVE_SHADOW(glow);
          el.style.transform = `translateY(${(glow * 1.5).toFixed(1)}px)`;
        } else {
          el.style.background = IDLE_BG;
          el.style.borderColor = IDLE_BORDER;
          el.style.boxShadow = IDLE_SHADOW;
          el.style.transform = 'translateY(0)';
        }

        const label = labelEls.current.get(code);
        if (label) {
          label.style.color = active ? ACTIVE_LABEL(glow) : IDLE_LABEL;
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Numpad total width for alignment
  const numpadW = 4 * U + 3 * GAP;

  return (
    <div
      className="fixed bottom-3 left-1/2 z-[52] pointer-events-none select-none"
      style={{
        transform: `translateX(-50%) perspective(1200px) rotateX(8deg) scale(${scale})`,
        transformOrigin: 'bottom center',
        opacity: 0.92,
      }}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        className="rounded-xl border border-zinc-700/30 bg-zinc-950/90 backdrop-blur-sm p-3"
        style={{ boxShadow: '0 -2px 30px rgba(0,0,0,.5), 0 8px 40px rgba(0,0,0,.6)' }}
      >
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
                  capsLock={capsLock}
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
