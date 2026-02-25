'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { MusicState } from './useSpotifyNowPlaying';

// ── Types ─────────────────────────────────────────────────────────────────
export interface StemLevels {
  bass: number;     // 0-1: low-frequency energy
  drums: number;    // 0-1: transient / attack energy
  melody: number;   // 0-1: dominant pitch brightness
  harmony: number;  // 0-1: pitch spread / richness
  energy: number;   // 0-1: overall loudness
}

interface SpotifySegment {
  start: number;
  duration: number;
  loudness_start: number;
  loudness_max: number;
  loudness_max_time: number;
  pitches: number[];   // 12 chroma bins
  timbre: number[];    // 12 MFCC-like coefficients
}

interface SpotifyBeat {
  start: number;
  duration: number;
  confidence: number;
}

interface AnalysisData {
  segments: SpotifySegment[];
  beats: SpotifyBeat[];
  bars: { start: number; duration: number; confidence: number }[];
  sections: { start: number; duration: number; loudness: number; tempo: number; key: number; mode: number }[];
}

const EMPTY_STEMS: StemLevels = { bass: 0, drums: 0, melody: 0, harmony: 0, energy: 0 };
const SMOOTHING = 0.15; // EMA smoothing factor (lower = smoother)

// ── Hook ──────────────────────────────────────────────────────────────────
export function useMusicAudioAnalysis(musicStateRef: React.RefObject<MusicState>): {
  stemsRef: React.RefObject<StemLevels>;
  updateStems: () => void;
} {
  const stemsRef = useRef<StemLevels>({ ...EMPTY_STEMS });
  const analysisRef = useRef<AnalysisData | null>(null);
  const currentTrackIdRef = useRef<string>('');
  const fetchingRef = useRef(false);

  // Fetch analysis for a track (once per track)
  const fetchAnalysis = useCallback(async (trackId: string) => {
    if (fetchingRef.current || !trackId) return;
    fetchingRef.current = true;
    try {
      const res = await fetch(`/api/spotify/audio-analysis?track_id=${encodeURIComponent(trackId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.segments) {
          analysisRef.current = data;
          currentTrackIdRef.current = trackId;
        }
      }
    } catch {
      // Silent fail
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // Check if we need to fetch analysis for a new track
  useEffect(() => {
    const check = () => {
      const state = musicStateRef.current;
      if (state && state.trackId && state.trackId !== currentTrackIdRef.current) {
        fetchAnalysis(state.trackId);
      }
    };
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, [musicStateRef, fetchAnalysis]);

  // Update stems based on current playback position
  const updateStems = useCallback(() => {
    const state = musicStateRef.current;
    const analysis = analysisRef.current;

    if (!state || !state.isPlaying || !analysis || analysis.segments.length === 0) {
      // Decay to zero when not playing
      const s = stemsRef.current;
      s.bass *= 0.95;
      s.drums *= 0.95;
      s.melody *= 0.95;
      s.harmony *= 0.95;
      s.energy *= 0.95;
      return;
    }

    const progressSec = state.progressMs / 1000;

    // Find current segment via binary search
    const segments = analysis.segments;
    let segIdx = findSegmentIndex(segments, progressSec);
    if (segIdx < 0) segIdx = 0;

    const seg = segments[segIdx];
    if (!seg) return;

    // ── Derive pseudo-stems from segment data ──

    const pitches = seg.pitches || [];
    const timbre = seg.timbre || [];

    // Bass: low pitches (C, C#, D = indices 0,1,2) + timbre[0] (overall brightness, inverted)
    const lowPitches = (pitches[0] || 0) * 0.4 + (pitches[1] || 0) * 0.3 + (pitches[2] || 0) * 0.3;
    const bassBrightness = Math.max(0, 1 - ((timbre[0] || 0) + 40) / 80); // timbre[0] ~ -40 to 40
    const rawBass = lowPitches * 0.7 + bassBrightness * 0.3;

    // Drums: timbre[1] (attack/decay) + loudness delta (transient detection)
    const attack = Math.max(0, (timbre[1] || 0) / 200); // timbre[1] ~ 0-200
    const prevSeg = segIdx > 0 ? segments[segIdx - 1] : null;
    const loudnessDelta = prevSeg
      ? Math.max(0, seg.loudness_max - prevSeg.loudness_max) / 20
      : 0;
    const rawDrums = Math.min(1, attack * 0.6 + loudnessDelta * 0.4);

    // Melody: highest pitch + timbre[3] (spectral flux)
    let maxPitchIdx = 0;
    let maxPitchVal = 0;
    for (let i = 0; i < pitches.length; i++) {
      if (pitches[i] > maxPitchVal) {
        maxPitchVal = pitches[i];
        maxPitchIdx = i;
      }
    }
    const melodyHeight = maxPitchIdx / 11; // 0-1 range
    const flux = Math.max(0, Math.min(1, ((timbre[3] || 0) + 50) / 100));
    const rawMelody = maxPitchVal * 0.5 + melodyHeight * 0.2 + flux * 0.3;

    // Harmony: pitch spread (entropy-like measure)
    const pitchSum = pitches.reduce((a, b) => a + b, 0) || 1;
    const normalizedPitches = pitches.map(p => p / pitchSum);
    let entropy = 0;
    for (const p of normalizedPitches) {
      if (p > 0.001) entropy -= p * Math.log2(p);
    }
    const maxEntropy = Math.log2(12); // ~3.58
    const rawHarmony = entropy / maxEntropy;

    // Energy: normalized loudness
    const rawEnergy = Math.max(0, Math.min(1, (seg.loudness_max + 30) / 30)); // -30dB to 0dB → 0-1

    // Apply exponential moving average smoothing
    const s = stemsRef.current;
    s.bass = s.bass + SMOOTHING * (rawBass - s.bass);
    s.drums = s.drums + SMOOTHING * (rawDrums - s.drums);
    s.melody = s.melody + SMOOTHING * (rawMelody - s.melody);
    s.harmony = s.harmony + SMOOTHING * (rawHarmony - s.harmony);
    s.energy = s.energy + SMOOTHING * (rawEnergy - s.energy);
  }, [musicStateRef]);

  return { stemsRef, updateStems };
}

// Binary search for segment at given time
function findSegmentIndex(segments: SpotifySegment[], time: number): number {
  let lo = 0;
  let hi = segments.length - 1;
  let result = 0;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (segments[mid].start <= time) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return result;
}
