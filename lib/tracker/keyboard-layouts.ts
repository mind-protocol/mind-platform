// ── Keyboard layout definitions ─────────────────────────────────────────
// Each layout provides label overrides for physical key codes.
// Structure (codes + widths) is shared — only keycap labels change.

export interface LayoutDef {
  key: string;
  name: string;
  flag: string;
  labels: Record<string, string>;
}

// ── Animation modes ─────────────────────────────────────────────────────
export type AnimMode = 'none' | 'light' | 'strong' | 'full' | 'rgb';

export const ANIM_MODES: { key: AnimMode; label: string; icon: string }[] = [
  { key: 'none',   label: 'None',   icon: '○' },
  { key: 'light',  label: 'Light',  icon: '◔' },
  { key: 'strong', label: 'Strong', icon: '●' },
  { key: 'full',   label: 'Full',   icon: '◉' },
  { key: 'rgb',    label: 'RGB',    icon: '🌈' },
];

// ── Layout label maps ───────────────────────────────────────────────────
// Only alphanumeric + symbol keys need layout-specific labels.
// Modifier keys (Shift, Ctrl, Alt, etc.), function keys, and numpad are universal.

const FR_LEGACY: Record<string, string> = {
  // Row 0: Number row
  Backquote: '²', Digit1: '&1', Digit2: 'é2', Digit3: '"3', Digit4: "'4",
  Digit5: '(5', Digit6: '-6', Digit7: 'è7', Digit8: '_8', Digit9: 'ç9',
  Digit0: 'à0', Minus: ')°', Equal: '=+',
  // Row 1: Top alpha
  KeyQ: 'A', KeyW: 'Z', KeyE: 'E', KeyR: 'R', KeyT: 'T', KeyY: 'Y',
  KeyU: 'U', KeyI: 'I', KeyO: 'O', KeyP: 'P',
  BracketLeft: '^¨', BracketRight: '$£',
  // Row 2: Home row
  KeyA: 'Q', KeyS: 'S', KeyD: 'D', KeyF: 'F', KeyG: 'G', KeyH: 'H',
  KeyJ: 'J', KeyK: 'K', KeyL: 'L', Semicolon: 'M', Quote: 'ù%', Backslash: '*µ',
  // Row 3: Bottom alpha
  IntlBackslash: '<>', KeyZ: 'W', KeyX: 'X', KeyC: 'C', KeyV: 'V',
  KeyB: 'B', KeyN: 'N', KeyM: ',?', Comma: ';.', Period: ':/', Slash: '!§',
};

const QWERTY_US: Record<string, string> = {
  Backquote: '`~', Digit1: '1!', Digit2: '2@', Digit3: '3#', Digit4: '4$',
  Digit5: '5%', Digit6: '6^', Digit7: '7&', Digit8: '8*', Digit9: '9(',
  Digit0: '0)', Minus: '-_', Equal: '=+',
  KeyQ: 'Q', KeyW: 'W', KeyE: 'E', KeyR: 'R', KeyT: 'T', KeyY: 'Y',
  KeyU: 'U', KeyI: 'I', KeyO: 'O', KeyP: 'P',
  BracketLeft: '[{', BracketRight: ']}',
  KeyA: 'A', KeyS: 'S', KeyD: 'D', KeyF: 'F', KeyG: 'G', KeyH: 'H',
  KeyJ: 'J', KeyK: 'K', KeyL: 'L', Semicolon: ';:', Quote: '\'"', Backslash: '\\|',
  IntlBackslash: '\\|', KeyZ: 'Z', KeyX: 'X', KeyC: 'C', KeyV: 'V',
  KeyB: 'B', KeyN: 'N', KeyM: 'M', Comma: ',<', Period: '.>', Slash: '/?',
};

const QWERTY_UK: Record<string, string> = {
  ...QWERTY_US,
  Backquote: '`¬', Digit2: '2"', Digit3: '3£',
  Quote: '\'@', Backslash: '#~', IntlBackslash: '\\|',
};

const QWERTZ_DE: Record<string, string> = {
  Backquote: '^°', Digit1: '1!', Digit2: '2"', Digit3: '3§', Digit4: '4$',
  Digit5: '5%', Digit6: '6&', Digit7: '7/', Digit8: '8(', Digit9: '9)',
  Digit0: '0=', Minus: 'ß?', Equal: '´`',
  KeyQ: 'Q', KeyW: 'W', KeyE: 'E', KeyR: 'R', KeyT: 'T', KeyY: 'Z',
  KeyU: 'U', KeyI: 'I', KeyO: 'O', KeyP: 'P',
  BracketLeft: 'Ü', BracketRight: '+*',
  KeyA: 'A', KeyS: 'S', KeyD: 'D', KeyF: 'F', KeyG: 'G', KeyH: 'H',
  KeyJ: 'J', KeyK: 'K', KeyL: 'L', Semicolon: 'Ö', Quote: 'Ä', Backslash: '#\'',
  IntlBackslash: '<>', KeyZ: 'Y', KeyX: 'X', KeyC: 'C', KeyV: 'V',
  KeyB: 'B', KeyN: 'N', KeyM: 'M', Comma: ',;', Period: '.:', Slash: '-_',
};

const DVORAK: Record<string, string> = {
  Backquote: '`~', Digit1: '1!', Digit2: '2@', Digit3: '3#', Digit4: '4$',
  Digit5: '5%', Digit6: '6^', Digit7: '7&', Digit8: '8*', Digit9: '9(',
  Digit0: '0)', Minus: '[{', Equal: ']}',
  KeyQ: '\'"', KeyW: ',<', KeyE: '.>', KeyR: 'P', KeyT: 'Y', KeyY: 'F',
  KeyU: 'G', KeyI: 'C', KeyO: 'R', KeyP: 'L',
  BracketLeft: '/?', BracketRight: '=+',
  KeyA: 'A', KeyS: 'O', KeyD: 'E', KeyF: 'U', KeyG: 'I', KeyH: 'D',
  KeyJ: 'H', KeyK: 'T', KeyL: 'N', Semicolon: 'S', Quote: '-_', Backslash: '\\|',
  IntlBackslash: '<>', KeyZ: ';:', KeyX: 'Q', KeyC: 'J', KeyV: 'K',
  KeyB: 'X', KeyN: 'B', KeyM: 'M', Comma: 'W', Period: 'V', Slash: 'Z',
};

const COLEMAK: Record<string, string> = {
  ...QWERTY_US,
  KeyE: 'F', KeyR: 'P', KeyT: 'G', KeyY: 'J', KeyU: 'L', KeyI: 'U',
  KeyO: 'Y', KeyP: ';:',
  KeyS: 'R', KeyD: 'S', KeyF: 'T', KeyG: 'D', KeyJ: 'N', KeyK: 'E',
  KeyL: 'I', Semicolon: 'O',
};

// ── Layout registry ─────────────────────────────────────────────────────
export const KEYBOARD_LAYOUTS: LayoutDef[] = [
  { key: 'fr-legacy',  name: 'FR Legacy',  flag: '🇫🇷', labels: FR_LEGACY },
  { key: 'qwerty-us',  name: 'QWERTY US',  flag: '🇺🇸', labels: QWERTY_US },
  { key: 'qwerty-uk',  name: 'QWERTY UK',  flag: '🇬🇧', labels: QWERTY_UK },
  { key: 'qwertz-de',  name: 'QWERTZ DE',  flag: '🇩🇪', labels: QWERTZ_DE },
  { key: 'dvorak',     name: 'Dvorak',      flag: '⌨', labels: DVORAK },
  { key: 'colemak',    name: 'Colemak',     flag: '⌨', labels: COLEMAK },
];

export const LAYOUT_MAP = new Map(KEYBOARD_LAYOUTS.map(l => [l.key, l]));
export const DEFAULT_LAYOUT = 'fr-legacy';

// ── Auto-detect via Keyboard Layout Map API (Chrome/Edge) ───────────────
export async function detectLayout(): Promise<string | null> {
  try {
    const kb = (navigator as unknown as Record<string, unknown>).keyboard as
      | { getLayoutMap?: () => Promise<Map<string, string>> }
      | undefined;
    if (!kb?.getLayoutMap) return null;
    const map = await kb.getLayoutMap();
    const q = map.get('KeyQ');
    const z = map.get('KeyZ');
    const f = map.get('KeyF');
    const j = map.get('KeyJ');

    // AZERTY: KeyQ → 'a'
    if (q === 'a') return 'fr-legacy';
    // QWERTZ: KeyZ → 'y'
    if (q === 'q' && z === 'y') return 'qwertz-de';
    // Dvorak: KeyQ → "'"
    if (q === "'") return 'dvorak';
    // Colemak: KeyF → 't', KeyJ → 'n'
    if (f === 't' && j === 'n') return 'colemak';
    // QWERTY: distinguish US vs UK
    if (q === 'q') {
      const d3 = map.get('Digit3');
      if (d3 === '£') return 'qwerty-uk';
      return 'qwerty-us';
    }
  } catch { /* API not available */ }
  return null;
}

// ── localStorage helpers ────────────────────────────────────────────────
export function loadLayout(): string {
  try { return localStorage.getItem('kbd-layout') || DEFAULT_LAYOUT; } catch { return DEFAULT_LAYOUT; }
}
export function saveLayout(key: string) {
  try { localStorage.setItem('kbd-layout', key); } catch { /* noop */ }
}
export function loadAnimMode(): AnimMode {
  try { return (localStorage.getItem('kbd-anim') as AnimMode) || 'strong'; } catch { return 'strong'; }
}
export function saveAnimMode(mode: AnimMode) {
  try { localStorage.setItem('kbd-anim', mode); } catch { /* noop */ }
}
