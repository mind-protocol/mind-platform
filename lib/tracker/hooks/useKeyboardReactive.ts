'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// ── AZERTY FR Legacy layout data ───────────────────────────────────────
export interface KeyDef {
  code: string;       // event.code (physical)
  label: string;      // what's printed on keycap
  w: number;          // width in units (1 = standard key)
}

export const AZERTY_ROWS: KeyDef[][] = [
  // Row 0: Number row
  [
    { code: 'Backquote', label: '²', w: 1 },
    { code: 'Digit1', label: '&1', w: 1 },
    { code: 'Digit2', label: 'é2', w: 1 },
    { code: 'Digit3', label: '"3', w: 1 },
    { code: 'Digit4', label: "'4", w: 1 },
    { code: 'Digit5', label: '(5', w: 1 },
    { code: 'Digit6', label: '-6', w: 1 },
    { code: 'Digit7', label: 'è7', w: 1 },
    { code: 'Digit8', label: '_8', w: 1 },
    { code: 'Digit9', label: 'ç9', w: 1 },
    { code: 'Digit0', label: 'à0', w: 1 },
    { code: 'Minus', label: ')°', w: 1 },
    { code: 'Equal', label: '=+', w: 1 },
    { code: 'Backspace', label: '⌫', w: 2 },
  ],
  // Row 1: AZERTY top alpha
  [
    { code: 'Tab', label: '⇥', w: 1.5 },
    { code: 'KeyQ', label: 'A', w: 1 },
    { code: 'KeyW', label: 'Z', w: 1 },
    { code: 'KeyE', label: 'E', w: 1 },
    { code: 'KeyR', label: 'R', w: 1 },
    { code: 'KeyT', label: 'T', w: 1 },
    { code: 'KeyY', label: 'Y', w: 1 },
    { code: 'KeyU', label: 'U', w: 1 },
    { code: 'KeyI', label: 'I', w: 1 },
    { code: 'KeyO', label: 'O', w: 1 },
    { code: 'KeyP', label: 'P', w: 1 },
    { code: 'BracketLeft', label: '^¨', w: 1 },
    { code: 'BracketRight', label: '$£', w: 1 },
    { code: 'Enter', label: '↵', w: 1.5 },
  ],
  // Row 2: Home row
  [
    { code: 'CapsLock', label: '⇪', w: 1.75 },
    { code: 'KeyA', label: 'Q', w: 1 },
    { code: 'KeyS', label: 'S', w: 1 },
    { code: 'KeyD', label: 'D', w: 1 },
    { code: 'KeyF', label: 'F', w: 1 },
    { code: 'KeyG', label: 'G', w: 1 },
    { code: 'KeyH', label: 'H', w: 1 },
    { code: 'KeyJ', label: 'J', w: 1 },
    { code: 'KeyK', label: 'K', w: 1 },
    { code: 'KeyL', label: 'L', w: 1 },
    { code: 'Semicolon', label: 'M', w: 1 },
    { code: 'Quote', label: 'ù%', w: 1 },
    { code: 'Backslash', label: '*µ', w: 1 },
    // Enter spans from row above (visual only, no duplicate)
  ],
  // Row 3: Bottom alpha
  [
    { code: 'ShiftLeft', label: '⇧', w: 1.25 },
    { code: 'IntlBackslash', label: '<>', w: 1 },
    { code: 'KeyZ', label: 'W', w: 1 },
    { code: 'KeyX', label: 'X', w: 1 },
    { code: 'KeyC', label: 'C', w: 1 },
    { code: 'KeyV', label: 'V', w: 1 },
    { code: 'KeyB', label: 'B', w: 1 },
    { code: 'KeyN', label: 'N', w: 1 },
    { code: 'Comma', label: ',?', w: 1 },
    { code: 'Period', label: ';.', w: 1 },
    { code: 'Slash', label: ':/', w: 1 },
    { code: 'ShiftRight', label: '⇧', w: 2.75 },
  ],
  // Row 4: Bottom modifiers + space
  [
    { code: 'ControlLeft', label: 'Ctrl', w: 1.25 },
    { code: 'MetaLeft', label: '⊞', w: 1.25 },
    { code: 'AltLeft', label: 'Alt', w: 1.25 },
    { code: 'Space', label: '', w: 6.25 },
    { code: 'AltRight', label: 'AltGr', w: 1.25 },
    { code: 'MetaRight', label: '⊞', w: 1.25 },
    { code: 'ControlRight', label: 'Ctrl', w: 1.25 },
  ],
];

// All key codes from layout
export const ALL_KEY_CODES = AZERTY_ROWS.flat().map(k => k.code);

// ── Key state (no React re-renders — ref-based for useFrame) ──────────
export interface KeyState {
  glow: number;        // 0-1, current glow intensity
  velocity: number;    // 0-1, audio-derived impact strength
  lastHitTime: number; // performance.now() of last activation
}

// Module-level singleton — shared between Canvas (useFrame decay) and DOM overlay (rAF read)
export const KEY_STATES: Map<string, KeyState> = new Map();

// ── Hook ───────────────────────────────────────────────────────────────
interface UseKeyboardReactiveOptions {
  enabled?: boolean;
  micEnabled?: boolean;
  decayRate?: number;    // glow decay per second (default: 5 = full decay in ~200ms)
}

// ── Debug stats (readable from outside for debug panel) ─────────────
export interface KeyboardDebugStats {
  noiseFloor: number;
  audioIntensity: number;
  threshold: number;
  rms: number;
  hfEnergy: number;
  activeKeys: number;
  listening: boolean;
  cooldownMs: number;
  lastTypingTime: number;
  isTyping: boolean;
}

// Module-level singleton — readable from any component without context
export const KEYBOARD_DEBUG: KeyboardDebugStats = {
  noiseFloor: 0.01, audioIntensity: 0, threshold: 0.03,
  rms: 0, hfEnergy: 0, activeKeys: 0, listening: false,
  cooldownMs: 30, lastTypingTime: 0, isTyping: false,
};

export function useKeyboardReactive({
  enabled = true,
  micEnabled = false,
  decayRate = 5,
}: UseKeyboardReactiveOptions = {}) {
  // Key states stored in a ref pointing to module singleton (shared with DOM overlay)
  const keyStatesRef = useRef<Map<string, KeyState>>(KEY_STATES);
  const [listening, setListening] = useState(false);

  // Audio analysis refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const noiseFloorRef = useRef(0.01);
  const lastTriggerRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const timeDataRef = useRef<Float32Array | null>(null);
  const freqDataRef = useRef<Uint8Array | null>(null);

  // Last audio intensity for hybrid mode
  const lastAudioIntensityRef = useRef(0);

  // Debug stats ref (read by debug panel, no re-renders)
  const debugRef = useRef<KeyboardDebugStats>({
    noiseFloor: 0.01, audioIntensity: 0, threshold: 0.03,
    rms: 0, hfEnergy: 0, activeKeys: 0, listening: false,
    cooldownMs: 30, lastTypingTime: 0, isTyping: false,
  });

  // Track last typing time for Focus Typing mode
  const lastTypingRef = useRef(0);

  // Initialize key states
  useEffect(() => {
    const map = keyStatesRef.current;
    for (const code of ALL_KEY_CODES) {
      if (!map.has(code)) {
        map.set(code, { glow: 0, velocity: 0, lastHitTime: 0 });
      }
    }
  }, []);

  // Activate a key (called from keydown + optionally modulated by audio)
  const activateKey = useCallback((code: string, velocity: number) => {
    const state = keyStatesRef.current.get(code);
    if (state) {
      state.glow = Math.min(1, velocity);
      state.velocity = velocity;
      state.lastHitTime = performance.now();
    }
  }, []);

  // Decay all keys (call this in useFrame with delta)
  const decayKeys = useCallback((delta: number) => {
    let active = 0;
    keyStatesRef.current.forEach((state) => {
      if (state.glow > 0) {
        state.glow = Math.max(0, state.glow - decayRate * delta);
        if (state.glow > 0.01) active++;
      }
    });
    debugRef.current.activeKeys = active;
    debugRef.current.listening = listening;
    const now = performance.now();
    const typing = (now - lastTypingRef.current) < 1500;
    debugRef.current.isTyping = typing;
    debugRef.current.lastTypingTime = lastTypingRef.current;
    // Mirror to module singleton for external readers
    Object.assign(KEYBOARD_DEBUG, debugRef.current);
  }, [decayRate, listening]);

  // ── Audio analysis loop ──
  const audioLoop = useCallback(() => {
    if (!analyserRef.current || !timeDataRef.current || !freqDataRef.current) return;

    analyserRef.current.getFloatTimeDomainData(timeDataRef.current);
    analyserRef.current.getByteFrequencyData(freqDataRef.current);

    const td = timeDataRef.current;
    const fd = freqDataRef.current;

    // RMS
    let sum = 0;
    for (let i = 0; i < td.length; i++) sum += td[i] * td[i];
    const rms = Math.sqrt(sum / td.length);

    // High-frequency energy (2-8kHz) — keyboard click band
    const sr = audioCtxRef.current?.sampleRate || 44100;
    const fftSize = analyserRef.current.fftSize;
    const binHz = sr / fftSize;
    const lo = Math.floor(2000 / binHz);
    const hi = Math.min(fd.length - 1, Math.floor(8000 / binHz));
    let hfSum = 0;
    for (let i = lo; i <= hi; i++) hfSum += fd[i] / 255;
    const hf = hi > lo ? hfSum / (hi - lo) : 0;

    // Adaptive noise floor
    const nf = noiseFloorRef.current;
    noiseFloorRef.current = nf * 0.995 + Math.min(rms, nf * 2) * 0.005;

    // Transient detection
    const score = (rms - nf) * 0.7 + hf * 0.6;
    const threshold = Math.max(0.03, nf * 2.5 + 0.015);

    const now = performance.now();
    if (score > threshold && (now - lastTriggerRef.current) > 30) {
      lastTriggerRef.current = now;
      lastAudioIntensityRef.current = Math.min(1, score * 6);
    } else {
      // Decay audio intensity
      lastAudioIntensityRef.current *= 0.9;
    }

    // Update debug stats (no re-render, just ref mutation)
    debugRef.current.noiseFloor = nf;
    debugRef.current.audioIntensity = lastAudioIntensityRef.current;
    debugRef.current.threshold = threshold;
    debugRef.current.rms = rms;
    debugRef.current.hfEnergy = hf;
    KEYBOARD_DEBUG.noiseFloor = nf;
    KEYBOARD_DEBUG.audioIntensity = lastAudioIntensityRef.current;
    KEYBOARD_DEBUG.threshold = threshold;
    KEYBOARD_DEBUG.rms = rms;
    KEYBOARD_DEBUG.hfEnergy = hf;

    rafIdRef.current = requestAnimationFrame(audioLoop);
  }, []);

  // ── Start/stop mic ──
  const startMic = useCallback(async () => {
    if (listening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.2;
      source.connect(analyser);
      analyserRef.current = analyser;

      timeDataRef.current = new Float32Array(analyser.fftSize);
      freqDataRef.current = new Uint8Array(analyser.frequencyBinCount);

      setListening(true);
      rafIdRef.current = requestAnimationFrame(audioLoop);
    } catch {
      // Mic permission denied or unavailable
      setListening(false);
    }
  }, [listening, audioLoop]);

  const stopMic = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    setListening(false);
  }, []);

  // Auto-start mic if requested
  useEffect(() => {
    if (micEnabled && enabled && !listening) {
      // Don't auto-start — requires user gesture. Just mark as ready.
    }
    return () => { if (listening) stopMic(); };
  }, [micEnabled, enabled, listening, stopMic]);

  // Resume AudioContext when tab regains focus (browsers suspend it on background)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume().then(() => {
          // Restart analysis loop if it died
          if (listening && !rafIdRef.current) {
            rafIdRef.current = requestAnimationFrame(audioLoop);
          }
        }).catch(() => { /* ignore resume failure */ });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [listening, audioLoop]);

  // ── Keyboard event handlers ──
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      // Hybrid: keydown gives position, audio gives intensity
      const audioIntensity = lastAudioIntensityRef.current;
      // Base velocity from keydown, modulated by audio if listening
      const velocity = listening
        ? Math.max(0.4, Math.min(1, 0.3 + audioIntensity * 0.7))
        : 0.6 + Math.random() * 0.3; // subtle variation without mic
      activateKey(e.code, velocity);
      lastTypingRef.current = performance.now();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      // Small secondary glow on release
      const state = keyStatesRef.current.get(e.code);
      if (state && state.glow < 0.15) {
        state.glow = 0.15;
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: true });
    window.addEventListener('keyup', onKeyUp, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled, listening, activateKey]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  return {
    keyStatesRef,
    decayKeys,
    activateKey,
    listening,
    startMic,
    stopMic,
    debugRef,
    lastTypingRef,
  };
}
