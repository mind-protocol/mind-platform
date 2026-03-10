'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AudioEngineState {
  isPlaying: boolean;
  currentTime: number;       // seconds
  duration: number;          // seconds
  volume: number;            // 0-1
  playbackRate: number;      // 0.5-2.0
  isLoaded: boolean;
  error: string | null;
}

export interface FrequencyData {
  /** Raw FFT magnitude data (0-255), typically 1024 bins */
  frequencyData: Uint8Array;
  /** Raw time-domain waveform (0-255) */
  timeDomainData: Uint8Array;
  /** Derived frequency bands, each normalised 0-1 */
  bass: number;       // 20-250 Hz
  midLow: number;     // 250-500 Hz
  mid: number;        // 500-2000 Hz
  midHigh: number;    // 2000-4000 Hz
  treble: number;     // 4000-20000 Hz
  /** Overall RMS energy, 0-1 */
  energy: number;
}

export interface AudioEngine {
  state: AudioEngineState;
  frequencyRef: React.MutableRefObject<FrequencyData>;

  load(url: string): Promise<void>;
  play(): void;
  pause(): void;
  toggle(): void;
  seek(time: number): void;
  setVolume(vol: number): void;
  setPlaybackRate(rate: number): void;

  /** Read latest FFT / waveform into frequencyRef. Call in rAF loop. */
  updateFrequencyData(): void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const FFT_SIZE = 2048;
const BIN_COUNT = FFT_SIZE / 2; // 1024

/**
 * Average a slice of a Uint8Array and normalise to 0-1.
 */
function bandAverage(data: Uint8Array, lo: number, hi: number): number {
  if (lo >= hi || data.length === 0) return 0;
  const end = Math.min(hi, data.length);
  let sum = 0;
  for (let i = lo; i < end; i++) {
    sum += data[i];
  }
  return sum / ((end - lo) * 255);
}

/**
 * Compute RMS energy from time-domain bytes (centred at 128).
 */
function computeEnergy(timeDomain: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < timeDomain.length; i++) {
    const v = (timeDomain[i] - 128) / 128; // -1..1
    sum += v * v;
  }
  return Math.sqrt(sum / timeDomain.length);
}

function emptyFrequencyData(): FrequencyData {
  return {
    frequencyData: new Uint8Array(BIN_COUNT),
    timeDomainData: new Uint8Array(BIN_COUNT),
    bass: 0,
    midLow: 0,
    mid: 0,
    midHigh: 0,
    treble: 0,
    energy: 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Cross-browser AudioContext                                         */
/* ------------------------------------------------------------------ */

function createAudioContext(): AudioContext {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  return new Ctor();
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAudioEngine(): AudioEngine {
  /* ---- mutable refs (no re-renders) ---- */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const frequencyRef = useRef<FrequencyData>(emptyFrequencyData());

  /* ---- state (triggers re-render on play/pause/load etc.) ---- */
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    playbackRate: 1,
    isLoaded: false,
    error: null,
  });

  // Keep a ref mirror of volume/playbackRate so imperative methods stay
  // in sync without needing fresh closure captures.
  const volumeRef = useRef(state.volume);
  const rateRef = useRef(state.playbackRate);

  /* ---- Ensure AudioContext + graph exist (lazy, on user gesture) ---- */
  const ensureContext = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      return audioCtxRef.current;
    }

    // Context was closed (React Strict Mode cleanup) — recreate everything.
    // MediaElementSource binds to one context, so audio element must also be new.
    sourceRef.current = null;
    audioElRef.current = null;

    const ctx = createAudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.8;

    const gain = ctx.createGain();
    gain.gain.value = volumeRef.current;

    analyser.connect(gain);
    gain.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    gainRef.current = gain;

    return ctx;
  }, []);

  /* ---- Resume suspended context (Chrome autoplay policy) ---- */
  const resumeContext = useCallback(async () => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }
  }, []);

  /* ---- Attach <audio> event listeners (called from load) ---- */
  const listenersRef = useRef<(() => void) | null>(null);

  const attachListeners = useCallback((audio: HTMLAudioElement) => {
    listenersRef.current?.();

    const onTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };
    const onEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };
    const onDurationChange = () => {
      if (Number.isFinite(audio.duration)) {
        setState((prev) => ({ ...prev, duration: audio.duration }));
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('durationchange', onDurationChange);

    listenersRef.current = () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('durationchange', onDurationChange);
    };
  }, []);

  /* ---- load ---- */
  const load = useCallback(
    async (url: string) => {
      try {
        const ctx = ensureContext();

        // Tear down previous source node if audio element changed
        if (sourceRef.current) {
          sourceRef.current.disconnect();
          sourceRef.current = null;
        }

        // Reuse or create <audio>
        let audio = audioElRef.current;
        if (!audio) {
          audio = new Audio();
          audio.crossOrigin = 'anonymous';
          audioElRef.current = audio;
        }

        audio.src = url;
        audio.playbackRate = rateRef.current;
        attachListeners(audio);

        // Wait for enough data to determine duration
        await new Promise<void>((resolve, reject) => {
          const onLoaded = () => {
            audio!.removeEventListener('loadedmetadata', onLoaded);
            audio!.removeEventListener('error', onError);
            resolve();
          };
          const onError = () => {
            audio!.removeEventListener('loadedmetadata', onLoaded);
            audio!.removeEventListener('error', onError);
            reject(new Error('Failed to load audio'));
          };
          audio!.addEventListener('loadedmetadata', onLoaded);
          audio!.addEventListener('error', onError);
          audio!.load();
        });

        // Connect to Web Audio graph (only once per element)
        if (!sourceRef.current) {
          const src = ctx.createMediaElementSource(audio);
          src.connect(analyserRef.current!);
          sourceRef.current = src;
        }

        setState((prev) => ({
          ...prev,
          duration: audio!.duration,
          currentTime: 0,
          isLoaded: true,
          error: null,
          isPlaying: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Unknown load error',
          isLoaded: false,
        }));
      }
    },
    [ensureContext, attachListeners],
  );

  /* ---- play / pause / toggle ---- */
  const play = useCallback(async () => {
    const audio = audioElRef.current;
    if (!audio) return;
    await resumeContext();
    await audio.play();
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, [resumeContext]);

  const pause = useCallback(() => {
    const audio = audioElRef.current;
    if (!audio) return;
    audio.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const toggle = useCallback(() => {
    const audio = audioElRef.current;
    if (!audio) return;
    if (audio.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  /* ---- seek ---- */
  const seek = useCallback((time: number) => {
    const audio = audioElRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
    setState((prev) => ({ ...prev, currentTime: audio!.currentTime }));
  }, []);

  /* ---- volume ---- */
  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    volumeRef.current = clamped;
    if (gainRef.current) {
      gainRef.current.gain.value = clamped;
    }
    setState((prev) => ({ ...prev, volume: clamped }));
  }, []);

  /* ---- playback rate ---- */
  const setPlaybackRate = useCallback((rate: number) => {
    const clamped = Math.max(0.5, Math.min(2, rate));
    rateRef.current = clamped;
    if (audioElRef.current) {
      audioElRef.current.playbackRate = clamped;
    }
    setState((prev) => ({ ...prev, playbackRate: clamped }));
  }, []);

  /* ---- frequency data (call in rAF) ---- */
  const updateFrequencyData = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const fd = frequencyRef.current;
    analyser.getByteFrequencyData(fd.frequencyData);
    analyser.getByteTimeDomainData(fd.timeDomainData);

    // Derived bands  (44100 Hz sample rate, 1024 bins, ~21.5 Hz/bin)
    fd.bass = bandAverage(fd.frequencyData, 1, 12);       // 20-250 Hz
    fd.midLow = bandAverage(fd.frequencyData, 12, 23);    // 250-500 Hz
    fd.mid = bandAverage(fd.frequencyData, 23, 93);       // 500-2000 Hz
    fd.midHigh = bandAverage(fd.frequencyData, 93, 186);  // 2000-4000 Hz
    fd.treble = bandAverage(fd.frequencyData, 186, 930);  // 4000-20000 Hz
    fd.energy = computeEnergy(fd.timeDomainData);
  }, []);

  /* ---- cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      /* eslint-disable react-hooks/exhaustive-deps */
      listenersRef.current?.();
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current.src = '';
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      /* eslint-enable react-hooks/exhaustive-deps */
    };
  }, []);

  /* ---- return stable interface ---- */
  return {
    state,
    frequencyRef,
    load,
    play,
    pause,
    toggle,
    seek,
    setVolume,
    setPlaybackRate,
    updateFrequencyData,
  };
}
