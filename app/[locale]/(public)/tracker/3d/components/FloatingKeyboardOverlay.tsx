'use client';

import { useEffect, useRef, useMemo } from 'react';
import { AZERTY_ROWS, KEY_STATES, type KeyState } from '@/lib/tracker/hooks/useKeyboardReactive';

// ── Neighbor map for glow spill ──────────────────────────────────────────
function buildNeighborMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const positions = new Map<string, { row: number; col: number }>();
  AZERTY_ROWS.forEach((row, rowIdx) => {
    row.forEach((key, colIdx) => {
      positions.set(key.code, { row: rowIdx, col: colIdx });
    });
  });
  positions.forEach(({ row, col }, code) => {
    const neighbors: string[] = [];
    const rowKeys = AZERTY_ROWS[row];
    if (col > 0) neighbors.push(rowKeys[col - 1].code);
    if (col < rowKeys.length - 1) neighbors.push(rowKeys[col + 1].code);
    if (row > 0) {
      const above = AZERTY_ROWS[row - 1];
      const start = Math.max(0, col - 1);
      const end = Math.min(above.length - 1, col + 1);
      for (let i = start; i <= end; i++) neighbors.push(above[i].code);
    }
    if (row < AZERTY_ROWS.length - 1) {
      const below = AZERTY_ROWS[row + 1];
      const start = Math.max(0, col - 1);
      const end = Math.min(below.length - 1, col + 1);
      for (let i = start; i <= end; i++) neighbors.push(below[i].code);
    }
    map.set(code, neighbors);
  });
  return map;
}
const NEIGHBOR_MAP = buildNeighborMap();

// ── Sizing ──────────────────────────────────────────────────────────────
const KEY_UNIT_PX = 28;
const KEY_GAP_PX = 2;
const KEY_HEIGHT_PX = 26;

// ── Component ───────────────────────────────────────────────────────────
export default function FloatingKeyboardOverlay({ scale = 1 }: { scale?: number }) {
  const keyEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const labelEls = useRef<Map<string, HTMLSpanElement>>(new Map());

  // Max row width for centering offset
  const maxRowUnits = useMemo(() =>
    Math.max(...AZERTY_ROWS.map(row => row.reduce((s, k) => s + k.w, 0))),
  []);

  // Animation loop — poll KEY_STATES + compute neighbor spill + update DOM
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      for (const [code, el] of keyEls.current) {
        const state: KeyState | undefined = KEY_STATES.get(code);
        const glow = state?.glow ?? 0;

        // Neighbor spill
        let neighborGlow = 0;
        const neighbors = NEIGHBOR_MAP.get(code);
        if (neighbors) {
          for (const nc of neighbors) {
            const ns = KEY_STATES.get(nc);
            if (ns && ns.glow > neighborGlow) neighborGlow = ns.glow;
          }
        }
        const totalGlow = Math.min(1, glow + neighborGlow * 0.10);
        const active = totalGlow > 0.02;

        if (active) {
          const g = totalGlow;
          el.style.background = `linear-gradient(180deg, rgba(210,230,255,0.98), rgba(124,170,255,${(0.65 + g * 0.25).toFixed(2)}))`;
          el.style.borderColor = `rgba(120,180,255,${(0.55 + g * 0.35).toFixed(2)})`;
          el.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,.65), 0 0 ${(8 + g * 10).toFixed(0)}px rgba(90,170,255,.40), 0 0 ${(18 + g * 14).toFixed(0)}px rgba(90,170,255,.18)`;
          el.style.transform = `translateY(${(g * 1).toFixed(1)}px)`;
        } else {
          el.style.background = 'linear-gradient(180deg, rgba(245,247,250,0.94), rgba(208,214,223,0.88))';
          el.style.borderColor = 'rgba(255,255,255,0.30)';
          el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.55), inset 0 -1px 0 rgba(120,130,150,.20)';
          el.style.transform = 'translateY(0)';
        }

        const label = labelEls.current.get(code);
        if (label) {
          label.style.color = active
            ? `rgba(30,50,100,${(0.7 + totalGlow * 0.3).toFixed(2)})`
            : '#5b6b86';
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="fixed bottom-5 left-1/2 z-[52] pointer-events-none select-none"
      style={{
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: 'bottom center',
        opacity: 0.88,
      }}
      aria-hidden="true"
    >
      <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm px-3 py-2.5">
        <div className="flex flex-col" style={{ gap: KEY_GAP_PX }}>
          {AZERTY_ROWS.map((row, rowIdx) => {
            const rowUnits = row.reduce((s, k) => s + k.w, 0);
            const offsetPx = ((maxRowUnits - rowUnits) / 2) * KEY_UNIT_PX;
            return (
              <div key={rowIdx} className="flex" style={{ gap: KEY_GAP_PX, paddingLeft: offsetPx }}>
                {row.map((k) => {
                  const widthPx = k.w * KEY_UNIT_PX + (k.w - 1) * KEY_GAP_PX;
                  const showLabel = k.label.length <= 5;
                  return (
                    <div
                      key={k.code}
                      ref={(el) => { if (el) keyEls.current.set(k.code, el); }}
                      style={{
                        width: widthPx,
                        height: KEY_HEIGHT_PX,
                        background: 'linear-gradient(180deg, rgba(245,247,250,0.94), rgba(208,214,223,0.88))',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: 'rgba(255,255,255,0.30)',
                        borderRadius: 6,
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55), inset 0 -1px 0 rgba(120,130,150,.20)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 70ms, border-color 70ms, box-shadow 70ms, transform 70ms',
                      }}
                    >
                      {showLabel && (
                        <span
                          ref={(el) => { if (el) labelEls.current.set(k.code, el); }}
                          style={{
                            fontSize: k.label.length === 1 ? 11 : k.label.length <= 2 ? 9 : 7,
                            color: '#5b6b86',
                            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                            userSelect: 'none',
                            lineHeight: 1,
                            transition: 'color 70ms',
                          }}
                        >
                          {k.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
