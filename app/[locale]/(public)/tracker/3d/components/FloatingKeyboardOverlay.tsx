'use client';

import { useEffect, useRef, useMemo, useState, useCallback, memo } from 'react';
import {
  AZERTY_ROWS, FUNCTION_ROW, NUMPAD_ROWS,
  NAV_ROW_1, NAV_ROW_2, ARROW_ROW_1, ARROW_ROW_2,
  KEY_STATES, type KeyDef,
} from '@/lib/tracker/hooks/useKeyboardReactive';
import {
  type AnimMode, ANIM_MODES,
  KEYBOARD_LAYOUTS, LAYOUT_MAP, DEFAULT_LAYOUT,
  detectLayout, loadLayout, saveLayout, loadAnimMode, saveAnimMode,
} from '@/lib/tracker/keyboard-layouts';

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

// ── Key position map for RGB rainbow wave ────────────────────────────────
const KEY_POSITIONS = new Map<string, { row: number; col: number }>();
AZERTY_ROWS.forEach((row, ri) => {
  let x = 0;
  row.forEach((k) => { KEY_POSITIONS.set(k.code, { row: ri, col: x }); x += k.w; });
});
FUNCTION_ROW.forEach((k, i) => KEY_POSITIONS.set(k.code, { row: -1, col: i }));
[NAV_ROW_1, NAV_ROW_2].forEach((r, ri) => r.forEach((k, ci) => KEY_POSITIONS.set(k.code, { row: ri, col: 16 + ci })));
ARROW_ROW_1.forEach((k, ci) => KEY_POSITIONS.set(k.code, { row: 3, col: 17 + ci }));
ARROW_ROW_2.forEach((k, ci) => KEY_POSITIONS.set(k.code, { row: 4, col: 16 + ci }));
NUMPAD_ROWS.forEach((r, ri) => r.forEach((k, ci) => KEY_POSITIONS.set(k.code, { row: ri, col: 20 + ci })));

// ── Sizing ──────────────────────────────────────────────────────────────
const U = 42;
const GAP = 3;
const H = 38;
const FN_H = 28;
const SECTION_GAP = 12;

// ── Styles (transparent) ─────────────────────────────────────────────────
const IDLE_BG = 'linear-gradient(180deg, rgba(50,55,68,0.36) 0%, rgba(35,40,52,0.40) 52%, rgba(22,26,36,0.44) 100%)';
const IDLE_SHADOW = 'inset 0 1px 0 rgba(255,255,255,.05), inset 0 -1px 0 rgba(0,0,0,.16), 0 1px 2px rgba(0,0,0,.18)';

// ── Color palettes ──────────────────────────────────────────────────────
type Palette = {
  key: string; name: string; swatch: string; tintColor: string;
  bg: (g: number) => string; border: (g: number) => string;
  shadow: (g: number) => string; label: (g: number) => string;
};

const PALETTES: Palette[] = [
  {
    key: 'ice', name: 'Ice', swatch: '#5588ff', tintColor: '100,150,255',
    bg: (g) => `linear-gradient(180deg, rgba(130,170,255,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(85,125,235,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(45,78,175,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(150,190,255,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(110,160,255,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(75,130,255,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(245,250,255,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'amber', name: 'Amber', swatch: '#f59e0b', tintColor: '245,180,60',
    bg: (g) => `linear-gradient(180deg, rgba(255,190,80,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(235,150,45,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(175,95,25,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(255,200,100,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(255,170,50,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(255,150,30,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(255,250,235,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'emerald', name: 'Emerald', swatch: '#10b981', tintColor: '80,200,150',
    bg: (g) => `linear-gradient(180deg, rgba(80,220,160,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(40,180,120,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(20,120,80,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(100,230,170,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(60,200,140,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(40,180,120,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(240,255,248,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'violet', name: 'Violet', swatch: '#8b5cf6', tintColor: '150,100,255',
    bg: (g) => `linear-gradient(180deg, rgba(170,120,255,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(130,80,235,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(85,45,175,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(180,140,255,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(150,100,255,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(120,70,255,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(250,245,255,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'rose', name: 'Rose', swatch: '#f43f5e', tintColor: '255,100,130',
    bg: (g) => `linear-gradient(180deg, rgba(255,110,140,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(235,70,100,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(175,35,65,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(255,130,160,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(255,90,120,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(255,60,100,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(255,245,248,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'sunset', name: 'Sunset', swatch: 'linear-gradient(135deg, #f97316, #ef4444)', tintColor: '255,140,50',
    bg: (g) => `linear-gradient(180deg, rgba(255,150,60,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(240,100,50,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(180,50,30,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(255,160,80,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(255,120,50,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(240,80,40,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(255,250,240,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'cyan', name: 'Cyan', swatch: '#06b6d4', tintColor: '50,200,230',
    bg: (g) => `linear-gradient(180deg, rgba(60,210,240,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(30,170,210,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(15,110,155,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(80,220,245,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(40,200,235,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(20,180,220,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(240,252,255,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'mono', name: 'Mono', swatch: '#d4d4d8', tintColor: '200,205,215',
    bg: (g) => `linear-gradient(180deg, rgba(210,215,225,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(170,175,185,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(120,125,135,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(220,225,235,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(200,205,215,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(180,185,195,.25), inset 0 1px 0 rgba(255,255,255,.30)`,
    label: (g) => `rgba(255,255,255,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'sakura', name: 'Sakura', swatch: 'linear-gradient(135deg, #fbb6ce, #c084fc)', tintColor: '240,160,200',
    bg: (g) => `linear-gradient(180deg, rgba(251,182,206,${(0.85+g*0.10).toFixed(2)}) 0%, rgba(220,140,200,${(0.85+g*0.10).toFixed(2)}) 55%, rgba(160,80,160,${(0.90+g*0.08).toFixed(2)}) 100%)`,
    border: (g) => `rgba(250,190,220,${(0.35+g*0.30).toFixed(2)})`,
    shadow: (g) => `0 0 0 1px rgba(240,160,200,${(0.15+g*0.15).toFixed(2)}), 0 0 ${(10+g*14).toFixed(0)}px rgba(220,130,190,.35), inset 0 1px 0 rgba(255,255,255,.25)`,
    label: (g) => `rgba(255,248,252,${(0.85+g*0.15).toFixed(2)})`,
  },
  {
    key: 'aurora', name: 'Aurora', swatch: 'linear-gradient(135deg, #34d399, #818cf8)', tintColor: '90,200,180',
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

// ── Stable function row slices (for memo) ───────────────────────────────
const FN_ESC = [FUNCTION_ROW[0]];
const FN_F1_F4 = FUNCTION_ROW.slice(1, 5);
const FN_F5_F8 = FUNCTION_ROW.slice(5, 9);
const FN_F9_F12 = FUNCTION_ROW.slice(9, 13);

// ── Memoized key row ────────────────────────────────────────────────────
const KeyRow = memo(function KeyRow({
  keys, keyH, keyEls, labelEls, offsetPx = 0, locks, labelOverrides,
}: {
  keys: KeyDef[];
  keyH: number;
  keyEls: React.RefObject<Map<string, HTMLDivElement>>;
  labelEls: React.RefObject<Map<string, HTMLSpanElement>>;
  offsetPx?: number;
  locks?: { caps: boolean; num: boolean; scroll: boolean };
  labelOverrides?: Record<string, string> | null;
}) {
  return (
    <div className="flex" style={{ gap: GAP, paddingLeft: offsetPx }}>
      {keys.map((k) => {
        const w = k.w * U + (k.w - 1) * GAP;
        const displayLabel = labelOverrides?.[k.code] ?? k.label;
        const showLabel = displayLabel.length <= 5 && displayLabel.length > 0;
        const hasLed = k.code === 'CapsLock' || k.code === 'NumLock';
        const ledOn = k.code === 'CapsLock' ? locks?.caps : k.code === 'NumLock' ? locks?.num : false;
        return (
          <div
            key={k.code}
            ref={(el) => { if (el) keyEls.current!.set(k.code, el); }}
            style={{
              width: w, height: keyH,
              background: IDLE_BG,
              borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(120,130,155,0.12)',
              borderRadius: 5, boxShadow: IDLE_SHADOW,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              transition: 'background 60ms, border-color 60ms, box-shadow 80ms, transform 60ms',
            }}
          >
            {showLabel && (
              <span
                ref={(el) => { if (el) labelEls.current!.set(k.code, el); }}
                style={{
                  fontSize: keyH > 30 ? (displayLabel.length === 1 ? 13 : displayLabel.length <= 2 ? 10 : 8) : (displayLabel.length === 1 ? 10 : 8),
                  color: 'rgba(200,210,230,.55)',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  userSelect: 'none', lineHeight: 1,
                  transition: 'color 60ms',
                }}
              >
                {displayLabel}
              </span>
            )}
            {hasLed && (
              <div style={{
                position: 'absolute', top: 3, right: 4, width: 4, height: 4, borderRadius: '50%',
                backgroundColor: ledOn ? 'rgba(120,220,255,.95)' : 'rgba(90,95,110,.35)',
                boxShadow: ledOn ? '0 0 8px rgba(80,180,255,.65)' : 'none',
                transition: 'all 200ms',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
});

// ── Control key style ───────────────────────────────────────────────────
const CTRL_KEY: React.CSSProperties = {
  width: 22, height: 18,
  background: 'rgba(30,35,48,0.45)',
  border: '1px solid rgba(120,130,155,0.15)',
  borderRadius: 4,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 10, color: 'rgba(200,210,230,0.55)',
  cursor: 'pointer',
};
const ctrlHover = (e: React.MouseEvent, enter: boolean) => {
  (e.currentTarget as HTMLElement).style.color = enter ? 'rgba(255,255,255,0.85)' : 'rgba(200,210,230,0.55)';
};

// ── Popup style ─────────────────────────────────────────────────────────
const POPUP_STYLE: React.CSSProperties = {
  background: 'rgba(15,18,25,0.95)',
  border: '1px solid rgba(120,130,155,0.3)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 8px 32px rgba(0,0,0,.5)',
};

// ── Main component ──────────────────────────────────────────────────────
export default function FloatingKeyboardOverlay({ typing = false }: { typing?: boolean }) {
  const keyEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const labelEls = useRef<Map<string, HTMLSpanElement>>(new Map());
  const pressedRef = useRef<Set<string>>(new Set());
  const locksRef = useRef({ caps: false, num: false, scroll: false });
  const [locks, setLocks] = useState({ caps: false, num: false, scroll: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Ref-based position/scale (no re-render)
  const outerRef = useRef<HTMLDivElement>(null);
  const scaleWrapRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<{ x: number; y: number } | null>(null);
  const userScaleRef = useRef<number | null>(null);
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  // Palette
  const [paletteKey, setPaletteKey] = useState(DEFAULT_PALETTE);
  const paletteRef = useRef<Palette>(PALETTES[0]);
  const [showPalettes, setShowPalettes] = useState(false);

  // Animation mode
  const [animKey, setAnimKey] = useState<AnimMode>('strong');
  const animModeRef = useRef<AnimMode>('strong');
  const [showAnimMenu, setShowAnimMenu] = useState(false);

  // Layout
  const [layoutKey, setLayoutKey] = useState(DEFAULT_LAYOUT);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  // Layout labels (memoized for KeyRow memo)
  const layoutLabels = useMemo(() => LAYOUT_MAP.get(layoutKey)?.labels ?? null, [layoutKey]);

  // Load prefs + auto-detect layout on mount
  useEffect(() => {
    // Palette
    const pk = loadPalette();
    setPaletteKey(pk);
    paletteRef.current = PALETTE_MAP.get(pk) || PALETTES[0];
    if (containerRef.current) {
      containerRef.current.style.borderColor = `rgba(${paletteRef.current.tintColor},0.15)`;
    }
    // Animation
    const am = loadAnimMode();
    setAnimKey(am);
    animModeRef.current = am;
    // Layout
    const saved = loadLayout();
    setLayoutKey(saved);
    // Auto-detect if default
    if (saved === DEFAULT_LAYOUT) {
      detectLayout().then(detected => {
        if (detected && detected !== saved) {
          setLayoutKey(detected);
          saveLayout(detected);
        }
      });
    }
  }, []);

  const selectPalette = useCallback((key: string) => {
    setPaletteKey(key);
    const pal = PALETTE_MAP.get(key) || PALETTES[0];
    paletteRef.current = pal;
    savePalette(key);
    setShowPalettes(false);
    if (containerRef.current) containerRef.current.style.borderColor = `rgba(${pal.tintColor},0.15)`;
  }, []);

  const selectAnimMode = useCallback((mode: AnimMode) => {
    setAnimKey(mode);
    animModeRef.current = mode;
    saveAnimMode(mode);
    setShowAnimMenu(false);
  }, []);

  const selectLayout = useCallback((key: string) => {
    setLayoutKey(key);
    saveLayout(key);
    setShowLayoutMenu(false);
    // Update label DOM immediately via refs
    const labels = LAYOUT_MAP.get(key)?.labels;
    if (labels) {
      for (const [code, span] of labelEls.current) {
        if (labels[code] !== undefined) span.textContent = labels[code];
      }
    }
  }, []);

  const handleAutoDetect = useCallback(async () => {
    const detected = await detectLayout();
    if (detected) selectLayout(detected);
  }, [selectLayout]);

  // Max row width
  const maxRowUnits = useMemo(() =>
    Math.max(...AZERTY_ROWS.map(row => row.reduce((s, k) => s + k.w, 0))),
  []);

  // Responsive scale
  const computeScale = useCallback(() => {
    if (!containerRef.current) return;
    const naturalW = containerRef.current.scrollWidth;
    const viewW = window.innerWidth * 0.70;
    const viewH = window.innerHeight * 0.35;
    const naturalH = containerRef.current.scrollHeight;
    const s = Math.min(viewW / naturalW, viewH / naturalH, 0.85);
    const next = Math.max(0.35, s);
    setScale(next);
    if (userScaleRef.current == null && scaleWrapRef.current) {
      scaleWrapRef.current.style.transform = `perspective(1200px) rotateX(8deg) scale(${next})`;
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(computeScale, 50);
    window.addEventListener('resize', computeScale);
    return () => { clearTimeout(t); window.removeEventListener('resize', computeScale); };
  }, [computeScale]);

  // Keydown/keyup for lock state
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
    const onDown = (e: KeyboardEvent) => { pressedRef.current.add(e.code); maybeUpdateLocks(e); };
    const onUp = (e: KeyboardEvent) => { pressedRef.current.delete(e.code); maybeUpdateLocks(e); };
    window.addEventListener('keydown', onDown, { passive: true });
    window.addEventListener('keyup', onUp, { passive: true });
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

  // ── Animation loop ────────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      const mode = animModeRef.current;
      const pal = paletteRef.current;
      const tc = pal.tintColor;
      const bdrIdle = `rgba(${tc},0.12)`;
      const lblIdle = `rgba(${tc},0.55)`;

      if (mode === 'rgb') {
        // ── RGB rainbow wave ──
        const t = performance.now() * 0.001;
        for (const [code, el] of keyEls.current) {
          const pos = KEY_POSITIONS.get(code);
          const pressed = pressedRef.current.has(code);
          const cx = pos ? pos.col + pos.row * 3 : 0;
          const hue = (cx * 25 + t * 60) % 360;
          const light = pressed ? 58 : 38;
          const sat = pressed ? 85 : 65;
          el.style.background = `linear-gradient(180deg, hsl(${hue},${sat}%,${light+8}%) 0%, hsl(${hue},${sat}%,${light}%) 55%, hsl(${hue},${sat}%,${light-12}%) 100%)`;
          el.style.borderColor = `hsla(${hue},70%,55%,0.30)`;
          el.style.boxShadow = `0 0 ${pressed ? 14 : 5}px hsla(${hue},70%,50%,0.25), inset 0 1px 0 rgba(255,255,255,.12)`;
          el.style.transform = pressed ? 'translateY(1px) scale(0.995)' : 'translateY(0)';
          const lbl = labelEls.current.get(code);
          if (lbl) lbl.style.color = `hsla(${(hue + 30) % 360},25%,92%,0.85)`;
        }
      } else {
        // ── Palette-based modes ──
        for (const [code, el] of keyEls.current) {
          const stateGlow = KEY_STATES.get(code)?.glow ?? 0;
          const pressed = pressedRef.current.has(code);

          let neighborGlow = 0;
          const neighbors = NEIGHBOR_MAP.get(code);
          if (neighbors) {
            for (const nc of neighbors) {
              const ns = KEY_STATES.get(nc);
              if (ns && ns.glow > neighborGlow) neighborGlow = ns.glow;
            }
          }

          let glow = Math.min(1, Math.max(pressed ? 0.85 : 0, stateGlow) + neighborGlow * 0.015);

          // Apply animation mode
          if (mode === 'none') glow = 0;
          else if (mode === 'light') glow *= 0.4;
          else if (mode === 'full') glow = Math.max(0.25, glow);
          // 'strong' = default, no change

          const active = glow > 0.08;

          if (active) {
            el.style.background = pal.bg(glow);
            el.style.borderColor = pal.border(glow);
            el.style.boxShadow = pal.shadow(glow);
            el.style.transform = `translateY(${(glow * 1.5).toFixed(1)}px) scale(0.995)`;
          } else {
            el.style.background = IDLE_BG;
            el.style.borderColor = bdrIdle;
            el.style.boxShadow = IDLE_SHADOW;
            el.style.transform = 'translateY(0)';
          }

          const lbl = labelEls.current.get(code);
          if (lbl) lbl.style.color = active ? pal.label(glow) : lblIdle;
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── Position/scale helpers ────────────────────────────────────────────
  const applyPosition = useCallback(() => {
    if (!outerRef.current) return;
    const p = posRef.current;
    if (p) {
      outerRef.current.style.left = `${p.x}px`;
      outerRef.current.style.top = `${p.y}px`;
      outerRef.current.style.bottom = 'auto';
      outerRef.current.style.transform = 'none';
    } else {
      outerRef.current.style.left = '50%';
      outerRef.current.style.top = '';
      outerRef.current.style.bottom = '12px';
      outerRef.current.style.transform = 'translateX(-50%)';
    }
  }, []);

  const applyScale = useCallback(() => {
    if (!scaleWrapRef.current) return;
    const s = userScaleRef.current ?? scale;
    scaleWrapRef.current.style.transform = `perspective(1200px) rotateX(8deg) scale(${s})`;
  }, [scale]);

  const onDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragging.current = true;
    const rect = outerRef.current!.getBoundingClientRect();
    dragStart.current = { mx: e.clientX, my: e.clientY, px: rect.left, py: rect.top };
    if (outerRef.current) outerRef.current.style.transition = 'none';
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    posRef.current = { x: dragStart.current.px + (e.clientX - dragStart.current.mx), y: dragStart.current.py + (e.clientY - dragStart.current.my) };
    applyPosition();
  }, [applyPosition]);

  const onDragEnd = useCallback(() => {
    dragging.current = false;
    if (outerRef.current) outerRef.current.style.transition = 'opacity 300ms';
  }, []);

  const handleResize = useCallback((delta: number) => {
    userScaleRef.current = Math.max(0.25, Math.min(2.0, (userScaleRef.current ?? scale) + delta));
    applyScale();
  }, [scale, applyScale]);

  const handleReset = useCallback(() => {
    posRef.current = null; userScaleRef.current = null;
    applyPosition(); applyScale();
  }, [applyPosition, applyScale]);

  const effectiveScale = userScaleRef.current ?? scale;

  // Close popups on outside click
  useEffect(() => {
    const onClick = () => { setShowPalettes(false); setShowAnimMenu(false); setShowLayoutMenu(false); };
    // Delay to avoid closing on the same click that opened
    const t = setTimeout(() => document.addEventListener('click', onClick), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', onClick); };
  }, [showPalettes, showAnimMenu, showLayoutMenu]);

  const currentLayout = LAYOUT_MAP.get(layoutKey);
  const currentAnim = ANIM_MODES.find(m => m.key === animKey);

  return (
    <div
      ref={outerRef}
      className="fixed z-[52] select-none"
      style={{ bottom: 12, left: '50%', transform: 'translateX(-50%)', opacity: typing ? 1.0 : 0.92, transition: 'opacity 300ms' }}
      aria-hidden="true"
    >
      <div
        ref={scaleWrapRef}
        className="pointer-events-none"
        style={{ transform: `perspective(1200px) rotateX(8deg) scale(${effectiveScale})`, transformOrigin: 'bottom center' }}
      >
        <div
          ref={containerRef}
          className="rounded-2xl border backdrop-blur-md p-3"
          style={{
            background: 'rgba(5,7,12,0.40)',
            borderColor: 'rgba(120,130,155,0.15)',
            boxShadow: '0 18px 60px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.03)',
          }}
        >
          {/* ── Controls row ── */}
          <div className="flex items-center justify-between mb-1.5 pointer-events-auto">
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              {/* Size */}
              <button onClick={() => handleResize(-0.1)} style={CTRL_KEY} onMouseEnter={e => ctrlHover(e, true)} onMouseLeave={e => ctrlHover(e, false)} title="Shrink">−</button>
              <button onClick={() => handleResize(0.1)} style={CTRL_KEY} onMouseEnter={e => ctrlHover(e, true)} onMouseLeave={e => ctrlHover(e, false)} title="Grow">+</button>
              {/* Drag */}
              <div
                onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd}
                style={{ ...CTRL_KEY, cursor: 'grab', touchAction: 'none' }}
                onMouseEnter={e => ctrlHover(e, true)} onMouseLeave={e => ctrlHover(e, false)} title="Drag to move"
              >⠿</div>
              {/* Reset */}
              <button onClick={handleReset} style={CTRL_KEY} onMouseEnter={e => ctrlHover(e, true)} onMouseLeave={e => ctrlHover(e, false)} title="Reset">↺</button>

              {/* Palette picker */}
              <div className="relative">
                <button onClick={() => { setShowPalettes(v => !v); setShowAnimMenu(false); setShowLayoutMenu(false); }} style={CTRL_KEY} title="Color palette">
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: PALETTE_MAP.get(paletteKey)?.swatch || '#5588ff' }} />
                </button>
                {showPalettes && (
                  <div className="absolute bottom-full left-0 mb-1 rounded-lg p-2 pointer-events-auto" style={POPUP_STYLE}>
                    <div className="grid grid-cols-5 gap-1.5" style={{ width: 130 }}>
                      {PALETTES.map(p => (
                        <button
                          key={p.key} onClick={() => selectPalette(p.key)} title={p.name}
                          style={{
                            width: 22, height: 22, borderRadius: 6, background: p.swatch,
                            border: paletteKey === p.key ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.15)',
                            cursor: 'pointer', transition: 'transform 100ms',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.2)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Animation mode */}
              <div className="relative">
                <button
                  onClick={() => { setShowAnimMenu(v => !v); setShowPalettes(false); setShowLayoutMenu(false); }}
                  style={CTRL_KEY} title={`Animation: ${currentAnim?.label}`}
                  onMouseEnter={e => ctrlHover(e, true)} onMouseLeave={e => ctrlHover(e, false)}
                >{currentAnim?.icon || '●'}</button>
                {showAnimMenu && (
                  <div className="absolute bottom-full left-0 mb-1 rounded-lg p-1.5 pointer-events-auto" style={POPUP_STYLE}>
                    <div className="flex flex-col gap-0.5" style={{ width: 100 }}>
                      {ANIM_MODES.map(m => (
                        <button
                          key={m.key}
                          onClick={() => selectAnimMode(m.key)}
                          className="flex items-center gap-2 px-2 py-1 rounded text-left"
                          style={{
                            fontSize: 10, cursor: 'pointer',
                            color: animKey === m.key ? 'rgba(255,255,255,0.95)' : 'rgba(200,210,230,0.6)',
                            background: animKey === m.key ? 'rgba(100,130,255,0.2)' : 'transparent',
                          }}
                        >
                          <span>{m.icon}</span>
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Layout selector */}
              <div className="relative">
                <button
                  onClick={() => { setShowLayoutMenu(v => !v); setShowPalettes(false); setShowAnimMenu(false); }}
                  style={{ ...CTRL_KEY, width: 28 }} title={`Layout: ${currentLayout?.name}`}
                  onMouseEnter={e => ctrlHover(e, true)} onMouseLeave={e => ctrlHover(e, false)}
                >
                  <span style={{ fontSize: 12, lineHeight: 1 }}>{currentLayout?.flag || '🇫🇷'}</span>
                </button>
                {showLayoutMenu && (
                  <div className="absolute bottom-full left-0 mb-1 rounded-lg p-1.5 pointer-events-auto" style={POPUP_STYLE}>
                    <div className="flex flex-col gap-0.5" style={{ width: 130 }}>
                      <button
                        onClick={handleAutoDetect}
                        className="flex items-center gap-2 px-2 py-1 rounded text-left"
                        style={{ fontSize: 10, color: 'rgba(160,200,255,0.8)', cursor: 'pointer', background: 'transparent' }}
                      >
                        <span>🔍</span><span>Auto-detect</span>
                      </button>
                      {KEYBOARD_LAYOUTS.map(l => (
                        <button
                          key={l.key}
                          onClick={() => selectLayout(l.key)}
                          className="flex items-center gap-2 px-2 py-1 rounded text-left"
                          style={{
                            fontSize: 10, cursor: 'pointer',
                            color: layoutKey === l.key ? 'rgba(255,255,255,0.95)' : 'rgba(200,210,230,0.6)',
                            background: layoutKey === l.key ? 'rgba(100,130,255,0.2)' : 'transparent',
                          }}
                        >
                          <span style={{ fontSize: 12 }}>{l.flag}</span>
                          <span>{l.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lock LEDs */}
            <div className="flex gap-3 mr-1">
              {([
                { on: locks.caps, label: 'CAPS' },
                { on: locks.num, label: 'NUM' },
                { on: locks.scroll, label: 'SCRL' },
              ] as const).map(({ on, label }) => (
                <div key={label} className="flex items-center gap-1.5" style={{ fontSize: 9 }}>
                  <span style={{
                    display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                    backgroundColor: on ? 'rgba(120,220,255,.95)' : 'rgba(90,95,110,.35)',
                    boxShadow: on ? '0 0 8px rgba(80,180,255,.65)' : 'none', transition: 'all 200ms',
                  }} />
                  <span style={{ color: on ? 'rgba(190,220,255,.9)' : 'rgba(120,130,150,.5)', fontFamily: 'ui-monospace, monospace', transition: 'color 200ms' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Keyboard sections ── */}
          <div className="flex" style={{ gap: SECTION_GAP }}>
            {/* Main section */}
            <div className="flex flex-col" style={{ gap: GAP }}>
              <div className="flex" style={{ gap: GAP, marginBottom: 6 }}>
                <KeyRow keys={FN_ESC} keyH={FN_H} keyEls={keyEls} labelEls={labelEls} />
                <div style={{ width: U * 0.5 }} />
                <KeyRow keys={FN_F1_F4} keyH={FN_H} keyEls={keyEls} labelEls={labelEls} />
                <div style={{ width: U * 0.3 }} />
                <KeyRow keys={FN_F5_F8} keyH={FN_H} keyEls={keyEls} labelEls={labelEls} />
                <div style={{ width: U * 0.3 }} />
                <KeyRow keys={FN_F9_F12} keyH={FN_H} keyEls={keyEls} labelEls={labelEls} />
              </div>
              {AZERTY_ROWS.map((row, rowIdx) => {
                const rowUnits = row.reduce((s, k) => s + k.w, 0);
                const offsetPx = ((maxRowUnits - rowUnits) / 2) * U;
                return (
                  <KeyRow
                    key={rowIdx} keys={row} keyH={H}
                    keyEls={keyEls} labelEls={labelEls}
                    offsetPx={offsetPx} locks={locks}
                    labelOverrides={layoutLabels}
                  />
                );
              })}
            </div>
            {/* Navigation */}
            <div className="flex flex-col" style={{ gap: GAP, paddingTop: FN_H + 6 + GAP }}>
              <KeyRow keys={NAV_ROW_1} keyH={H} keyEls={keyEls} labelEls={labelEls} />
              <KeyRow keys={NAV_ROW_2} keyH={H} keyEls={keyEls} labelEls={labelEls} />
              <div style={{ height: H + GAP }} />
              <div className="flex justify-center">
                <KeyRow keys={ARROW_ROW_1} keyH={H} keyEls={keyEls} labelEls={labelEls} />
              </div>
              <KeyRow keys={ARROW_ROW_2} keyH={H} keyEls={keyEls} labelEls={labelEls} />
            </div>
            {/* Numpad */}
            <div className="flex flex-col" style={{ gap: GAP, paddingTop: FN_H + 6 + GAP }}>
              {NUMPAD_ROWS.map((row, rowIdx) => (
                <KeyRow key={rowIdx} keys={row} keyH={H} keyEls={keyEls} labelEls={labelEls} locks={locks} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
