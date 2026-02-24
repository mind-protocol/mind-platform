'use client';

import { useEffect, useRef, useCallback } from 'react';

// ── Key groups for sound variation ─────────────────────────────────────
// Uses event.code (physical position) — works regardless of AZERTY/QWERTY layout
type KeyGroup = 'alpha' | 'space' | 'enter' | 'backspace' | 'tab' | 'shift' | 'modifier' | 'arrow' | 'nav' | 'escape' | 'num' | 'punct' | 'fn' | 'other';

function classifyKey(code: string): KeyGroup {
  if (code.startsWith('Key')) return 'alpha';
  if (code === 'Space') return 'space';
  if (code === 'Enter' || code === 'NumpadEnter') return 'enter';
  if (code === 'Backspace') return 'backspace';
  if (code === 'Tab') return 'tab';
  if (code === 'Escape') return 'escape';
  if (code === 'ShiftLeft' || code === 'ShiftRight') return 'shift';
  if (code === 'CapsLock') return 'modifier';
  if (code.startsWith('Control') || code.startsWith('Alt') || code.startsWith('Meta')) return 'modifier';
  if (code.startsWith('Arrow')) return 'arrow';
  if (['Delete', 'Insert', 'Home', 'End', 'PageUp', 'PageDown'].includes(code)) return 'nav';
  if (code.startsWith('Digit') || code.startsWith('Numpad')) return 'num';
  if (code.startsWith('F') && /^F\d+$/.test(code)) return 'fn';
  if (['BracketLeft', 'BracketRight', 'Semicolon', 'Quote', 'Backquote', 'Backslash',
       'Comma', 'Period', 'Slash', 'Minus', 'Equal', 'IntlBackslash'].includes(code)) return 'punct';
  return 'other';
}

// ── Sound profiles per key group ───────────────────────────────────────
// Calibrated from spectral analysis of Nicolas's ASUS Vivobook 17 chiclet
// recording (31min, Opus 48kHz). Key findings:
//   - Dominant energy: 100-500Hz (chassis resonance is the PRIMARY sound)
//   - Peaks: ~200Hz (letters), ~250Hz (modifiers), ~400Hz (secondary)
//   - Attack: ~3-5ms, Decay: 17-35ms (much longer than typical synth keyboards)
//   - "Thocky" character — bass-heavy, not clicky
//   - Firm but light presses — moderate amplitude, clean transients
interface SoundProfile {
  // Primary: chassis body thump (the dominant "thock")
  bodyFreq: number;        // Lowpass filter cutoff for body noise (Hz)
  bodyQ: number;           // Body filter resonance
  bodyGain: number;        // Body volume (this is the MAIN sound)
  bodyDecay: number;       // Body decay time (s) — 15-35ms
  // Secondary: transient click (the brief "tick" on impact)
  clickFreq: number;       // Bandpass center for click transient (Hz)
  clickQ: number;          // Click filter Q
  clickGain: number;       // Click volume (secondary, subtle)
  clickDecay: number;      // Click decay (s) — 3-8ms, very fast
  // Tonal resonance: chassis vibration mode
  toneFreq: number;        // Sine tone frequency (Hz) — chassis fundamental
  toneGain: number;        // Tone volume
  toneDuration: number;    // Tone duration (s)
  // Common
  attackTime: number;      // How fast the sound starts (s)
  upGainRatio: number;     // Key-up volume relative to key-down
  upFreqShift: number;     // Key-up frequency multiplier
}

const PROFILES: Record<KeyGroup, SoundProfile> = {
  // ── Letters: the core sound ──
  // Recording: 200Hz peak, strong 100-400Hz, attack 4ms, decay 35ms
  alpha: {
    bodyFreq: 450,
    bodyQ: 0.8,
    bodyGain: 0.14,
    bodyDecay: 0.028,
    clickFreq: 1200,
    clickQ: 1.2,
    clickGain: 0.04,
    clickDecay: 0.004,
    toneFreq: 200,
    toneGain: 0.06,
    toneDuration: 0.018,
    attackTime: 0.001,
    upGainRatio: 0.3,
    upFreqShift: 1.3,
  },
  // ── Spacebar: wider key, deeper resonance, stabilizer bar ──
  // Larger surface = more chassis coupling, lower fundamental, longer decay
  space: {
    bodyFreq: 350,
    bodyQ: 0.6,
    bodyGain: 0.18,
    bodyDecay: 0.035,
    clickFreq: 900,
    clickQ: 1.0,
    clickGain: 0.035,
    clickDecay: 0.005,
    toneFreq: 140,
    toneGain: 0.08,
    toneDuration: 0.025,
    attackTime: 0.001,
    upGainRatio: 0.35,
    upFreqShift: 1.15,
  },
  // ── Enter: satisfying, slightly louder ──
  // Medium-large key, stabilizer, distinct from letters
  enter: {
    bodyFreq: 400,
    bodyQ: 0.7,
    bodyGain: 0.16,
    bodyDecay: 0.030,
    clickFreq: 1000,
    clickQ: 1.1,
    clickGain: 0.04,
    clickDecay: 0.005,
    toneFreq: 170,
    toneGain: 0.07,
    toneDuration: 0.020,
    attackTime: 0.001,
    upGainRatio: 0.32,
    upFreqShift: 1.2,
  },
  // ── Backspace: slightly muted for repetitive action ──
  backspace: {
    bodyFreq: 420,
    bodyQ: 0.7,
    bodyGain: 0.12,
    bodyDecay: 0.022,
    clickFreq: 1100,
    clickQ: 1.1,
    clickGain: 0.035,
    clickDecay: 0.004,
    toneFreq: 185,
    toneGain: 0.05,
    toneDuration: 0.015,
    attackTime: 0.001,
    upGainRatio: 0.28,
    upFreqShift: 1.3,
  },
  // ── Tab: medium key, stabilizer ──
  tab: {
    bodyFreq: 380,
    bodyQ: 0.7,
    bodyGain: 0.13,
    bodyDecay: 0.025,
    clickFreq: 1000,
    clickQ: 1.1,
    clickGain: 0.035,
    clickDecay: 0.004,
    toneFreq: 160,
    toneGain: 0.06,
    toneDuration: 0.018,
    attackTime: 0.001,
    upGainRatio: 0.3,
    upFreqShift: 1.2,
  },
  // ── Escape: top-left, slightly sharper ──
  escape: {
    bodyFreq: 480,
    bodyQ: 0.9,
    bodyGain: 0.13,
    bodyDecay: 0.020,
    clickFreq: 1400,
    clickQ: 1.4,
    clickGain: 0.05,
    clickDecay: 0.004,
    toneFreq: 220,
    toneGain: 0.04,
    toneDuration: 0.012,
    attackTime: 0.0008,
    upGainRatio: 0.28,
    upFreqShift: 1.35,
  },
  // ── Shift: wide stabilizer bar, deeper ──
  // Recording section 2: even more sub-bass dominant, 50Hz peak
  shift: {
    bodyFreq: 320,
    bodyQ: 0.6,
    bodyGain: 0.13,
    bodyDecay: 0.032,
    clickFreq: 800,
    clickQ: 0.9,
    clickGain: 0.03,
    clickDecay: 0.005,
    toneFreq: 120,
    toneGain: 0.07,
    toneDuration: 0.022,
    attackTime: 0.001,
    upGainRatio: 0.35,
    upFreqShift: 1.15,
  },
  // ── Modifiers (Ctrl/Alt/AltGr/CapsLock): muted, low ──
  modifier: {
    bodyFreq: 350,
    bodyQ: 0.6,
    bodyGain: 0.10,
    bodyDecay: 0.025,
    clickFreq: 900,
    clickQ: 1.0,
    clickGain: 0.025,
    clickDecay: 0.004,
    toneFreq: 140,
    toneGain: 0.05,
    toneDuration: 0.018,
    attackTime: 0.001,
    upGainRatio: 0.3,
    upFreqShift: 1.2,
  },
  // ── Arrow keys: smaller keycap, less chassis coupling ──
  // Recording section 5-6: shifted to low-mid (250-450Hz), more hi-mid, 7kHz peak
  arrow: {
    bodyFreq: 550,
    bodyQ: 1.0,
    bodyGain: 0.11,
    bodyDecay: 0.018,
    clickFreq: 1600,
    clickQ: 1.5,
    clickGain: 0.05,
    clickDecay: 0.003,
    toneFreq: 260,
    toneGain: 0.04,
    toneDuration: 0.010,
    attackTime: 0.0008,
    upGainRatio: 0.28,
    upFreqShift: 1.4,
  },
  // ── Navigation cluster (Del/Ins/Home/End/PgUp/PgDn) ──
  nav: {
    bodyFreq: 480,
    bodyQ: 0.8,
    bodyGain: 0.12,
    bodyDecay: 0.022,
    clickFreq: 1300,
    clickQ: 1.3,
    clickGain: 0.04,
    clickDecay: 0.004,
    toneFreq: 230,
    toneGain: 0.04,
    toneDuration: 0.014,
    attackTime: 0.001,
    upGainRatio: 0.3,
    upFreqShift: 1.3,
  },
  // ── Number row ──
  num: {
    bodyFreq: 460,
    bodyQ: 0.8,
    bodyGain: 0.13,
    bodyDecay: 0.026,
    clickFreq: 1250,
    clickQ: 1.2,
    clickGain: 0.04,
    clickDecay: 0.004,
    toneFreq: 210,
    toneGain: 0.05,
    toneDuration: 0.016,
    attackTime: 0.001,
    upGainRatio: 0.3,
    upFreqShift: 1.3,
  },
  // ── Punctuation (incl. ² IntlBackslash, dead keys ^`~) ──
  // Recording section 3: more mid content, 3.7kHz peak (dead keys = double hit)
  punct: {
    bodyFreq: 440,
    bodyQ: 0.8,
    bodyGain: 0.13,
    bodyDecay: 0.025,
    clickFreq: 1300,
    clickQ: 1.3,
    clickGain: 0.045,
    clickDecay: 0.004,
    toneFreq: 195,
    toneGain: 0.05,
    toneDuration: 0.016,
    attackTime: 0.001,
    upGainRatio: 0.3,
    upFreqShift: 1.3,
  },
  // ── Function keys (F1-F12): smaller keycaps, top row ──
  fn: {
    bodyFreq: 500,
    bodyQ: 0.9,
    bodyGain: 0.09,
    bodyDecay: 0.018,
    clickFreq: 1400,
    clickQ: 1.3,
    clickGain: 0.04,
    clickDecay: 0.003,
    toneFreq: 240,
    toneGain: 0.03,
    toneDuration: 0.010,
    attackTime: 0.0008,
    upGainRatio: 0.28,
    upFreqShift: 1.35,
  },
  // ── Fallback ──
  other: {
    bodyFreq: 430,
    bodyQ: 0.8,
    bodyGain: 0.11,
    bodyDecay: 0.024,
    clickFreq: 1200,
    clickQ: 1.2,
    clickGain: 0.035,
    clickDecay: 0.004,
    toneFreq: 190,
    toneGain: 0.05,
    toneDuration: 0.016,
    attackTime: 0.001,
    upGainRatio: 0.3,
    upFreqShift: 1.25,
  },
};

// ── Subtle per-press variation ─────────────────────────────────────────
// Prevents machine-gun effect — real keys vary slightly each press
function vary(base: number, pct: number): number {
  return base * (1 + (Math.random() - 0.5) * 2 * pct);
}

// ── Hook ───────────────────────────────────────────────────────────────
interface UseKeyboardSoundOptions {
  enabled?: boolean;
  volume?: number;  // 0-1, master volume
}

export function useKeyboardSound({ enabled = true, volume = 0.6 }: UseKeyboardSoundOptions = {}) {
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const heldKeysRef = useRef<Set<string>>(new Set());
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize AudioContext + noise buffer lazily (requires user gesture)
  const ensureContext = useCallback(() => {
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      return ctxRef.current;
    }

    const ctx = new AudioContext({ sampleRate: 44100 });
    ctxRef.current = ctx;

    // Pre-generate 0.1s white noise buffer (reused for all synthesis)
    const length = Math.floor(ctx.sampleRate * 0.1);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBufferRef.current = buffer;

    // Master gain node
    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    return ctx;
  }, [volume]);

  // Update master volume when it changes
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [volume]);

  // Play a single chiclet keypress sound
  const playClick = useCallback((group: KeyGroup, isKeyUp: boolean) => {
    const ctx = ensureContext();
    if (!ctx || !noiseBufferRef.current || !masterGainRef.current) return;

    const p = PROFILES[group];
    const now = ctx.currentTime;
    const dest = masterGainRef.current;

    // Key-up is lighter and shorter
    const upScale = isKeyUp ? p.upGainRatio : 1;
    const freqShift = isKeyUp ? p.upFreqShift : 1;

    // ── 1. Body thump (PRIMARY — the chassis resonance) ──
    // This is the dominant sound of the ASUS chiclet keyboard
    // Lowpass-filtered noise burst with ~20-35ms decay
    {
      const src = ctx.createBufferSource();
      src.buffer = noiseBufferRef.current;

      // Lowpass shapes the noise into a warm thump
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = vary(p.bodyFreq * freqShift, 0.08);
      lp.Q.value = vary(p.bodyQ, 0.15);

      // Subtle peak filter to emphasize the chassis resonance
      const peak = ctx.createBiquadFilter();
      peak.type = 'peaking';
      peak.frequency.value = vary(p.toneFreq, 0.1);
      peak.Q.value = 2.0;
      peak.gain.value = 6; // +6dB boost at resonance frequency

      const gain = ctx.createGain();
      const bodyVol = vary(p.bodyGain * upScale, 0.12);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(bodyVol, now + p.attackTime);
      const decay = isKeyUp ? p.bodyDecay * 0.5 : vary(p.bodyDecay, 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.attackTime + decay);

      src.connect(lp);
      lp.connect(peak);
      peak.connect(gain);
      gain.connect(dest);

      src.start(now);
      src.stop(now + p.attackTime + decay + 0.01);
    }

    // ── 2. Click transient (SECONDARY — the brief impact "tick") ──
    // Brief bandpass-filtered noise for the keycap-on-membrane impact
    {
      const src = ctx.createBufferSource();
      src.buffer = noiseBufferRef.current;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = vary(p.clickFreq * freqShift, 0.10);
      bp.Q.value = vary(p.clickQ, 0.2);

      const gain = ctx.createGain();
      const clickVol = vary(p.clickGain * upScale, 0.15);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(clickVol, now + p.attackTime * 0.5);
      const clickDec = isKeyUp ? p.clickDecay * 0.6 : vary(p.clickDecay, 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.attackTime * 0.5 + clickDec);

      src.connect(bp);
      bp.connect(gain);
      gain.connect(dest);

      src.start(now);
      src.stop(now + p.attackTime + clickDec + 0.01);
    }

    // ── 3. Tonal resonance (chassis vibration fundamental) ──
    // Sine wave at the chassis resonance frequency — adds warmth
    if (!isKeyUp && p.toneGain > 0) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = vary(p.toneFreq, 0.08);

      const gain = ctx.createGain();
      const toneVol = vary(p.toneGain, 0.15);
      gain.gain.setValueAtTime(toneVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + vary(p.toneDuration, 0.12));

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + p.toneDuration + 0.02);
    }
  }, [ensureContext, volume]);

  // Key event handlers
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Skip held keys (repeat) — real keyboards don't click on hold
      if (e.repeat) return;

      // Skip if typing in an input/textarea/contenteditable
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

      const code = e.code;
      if (heldKeysRef.current.has(code)) return;
      heldKeysRef.current.add(code);

      playClick(classifyKey(code), false);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      if (!heldKeysRef.current.has(code)) return;
      heldKeysRef.current.delete(code);

      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

      playClick(classifyKey(code), true);
    };

    // Clear held keys on blur (prevents stuck keys)
    const onBlur = () => {
      heldKeysRef.current.clear();
    };

    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('keyup', onKeyUp, { passive: true });
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [enabled, playClick]);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
    };
  }, []);

  return { enabled };
}
