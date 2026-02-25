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

// 3-stop blue gradient for active keys
const ACTIVE_BG = (g: number) =>
  `linear-gradient(180deg, rgba(130,170,255,${(0.85 + g * 0.10).toFixed(2)}) 0%, rgba(85,125,235,${(0.85 + g * 0.10).toFixed(2)}) 55%, rgba(45,78,175,${(0.90 + g * 0.08).toFixed(2)}) 100%)`;
const ACTIVE_BORDER = (g: number) =>
  `rgba(150,190,255,${(0.35 + g * 0.30).toFixed(2)})`;
const ACTIVE_SHADOW = (g: number) =>
  `0 0 0 1px rgba(110,160,255,${(0.15 + g * 0.15).toFixed(2)}), 0 0 ${(10 + g * 14).toFixed(0)}px rgba(75,130,255,.35), inset 0 1px 0 rgba(255,255,255,.25)`;
const ACTIVE_LABEL = (g: number) =>
  `rgba(245,250,255,${(0.85 + g * 0.15).toFixed(2)})`;

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
  const [locks, setLocks] = useState({ caps: false, num: false, scroll: false });
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

  // Direct keydown/keyup for immediate visual response + lock state
  useEffect(() => {
    const updateLocks = (e: KeyboardEvent) => {
      setLocks({
        caps: e.getModifierState('CapsLock'),
        num: e.getModifierState('NumLock'),
        scroll: e.getModifierState('ScrollLock'),
      });
    };
    const onDown = (e: KeyboardEvent) => {
      pressedRef.current.add(e.code);
      updateLocks(e);
    };
    const onUp = (e: KeyboardEvent) => {
      pressedRef.current.delete(e.code);
      updateLocks(e);
    };
    window.addEventListener('keydown', onDown, { passive: true });
    window.addEventListener('keyup', onUp, { passive: true });
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
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
          el.style.transform = `translateY(${(glow * 1.5).toFixed(1)}px) scale(0.995)`;
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

  return (
    <div
      className="fixed bottom-3 left-1/2 z-[52] pointer-events-none select-none"
      style={{
        transform: `translateX(-50%) perspective(1200px) rotateX(8deg) scale(${scale})`,
        transformOrigin: 'bottom center',
        opacity: typing ? 1.0 : 0.92,
        transition: 'opacity 300ms',
      }}
      aria-hidden="true"
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
  );
}
