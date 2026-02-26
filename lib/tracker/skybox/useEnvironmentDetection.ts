/* ── Environment Detection Hook ──────────────────────────────────
 *
 * Aggregates real-world signals to determine the correct skybox:
 *
 *   1. Browser geolocation → lat/lng → sun/moon position
 *   2. Camera feed → ambient luminance + color temperature
 *   3. Time of day → dawn/sunrise/noon/…/night classification
 *   4. Smart induction → outdoor vs indoor detection
 *
 * Returns an EnvironmentProfile used by Skybox360 to auto-select:
 *   - Procedural sky (drei <Sky>) for outdoor daytime
 *   - Stars + moon for night
 *   - Indoor default (yoga room) when inside
 *   - Camera-adaptive veil opacity in all modes
 *
 * GPS via Garmin LiveTrack: future enhancement — currently uses
 * browser geolocation. Garmin activity data could refine
 * indoor/outdoor detection.
 * ─────────────────────────────────────────────────────────────────── */

'use client';

import { useState, useEffect, useRef } from 'react';
import { getSunState, getMoonState } from './sunCalc';
import { CameraAnalyzerEngine } from './cameraAnalyzer';
import type {
  EnvironmentProfile,
  GeoPosition,
  CameraAnalysis,
  SunState,
  SkyboxMode,
  SkyParams,
} from './types';

// Default: Lyon, France
const DEFAULT_LAT = 45.764;
const DEFAULT_LNG = 4.8357;

const GEO_INTERVAL = 60_000;  // 1 min
const SUN_INTERVAL = 30_000;  // 30s
const CAMERA_INTERVAL = 5_000; // 5s

/* ── Default camera analysis (no camera) ─────────────────────────── */

const NO_CAMERA: CameraAnalysis = {
  luminance: 0.5,
  brightness: 128,
  colorTempK: 6500,
  dominantRGB: [128, 128, 128],
  isAvailable: false,
  lastCapture: 0,
};

/* ── Hook ─────────────────────────────────────────────────────────── */

export interface EnvironmentDetectionOptions {
  /** Enable camera-based ambient sensing (requires user permission) */
  cameraEnabled?: boolean;
  /** Which camera to use. Default: 'environment' (back camera) */
  facingMode?: 'user' | 'environment';
}

export function useEnvironmentDetection(
  opts?: EnvironmentDetectionOptions,
): EnvironmentProfile {
  const cameraEnabled = opts?.cameraEnabled ?? false;
  const facingMode = opts?.facingMode ?? 'environment';

  const [profile, setProfile] = useState<EnvironmentProfile>(() =>
    buildProfile(null, null),
  );
  const geoRef = useRef<GeoPosition | null>(null);
  const cameraRef = useRef<CameraAnalysis | null>(null);
  const analyzerRef = useRef<CameraAnalyzerEngine | null>(null);

  /* ── Geolocation ─────────────────────────────────────────────────── */

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    const update = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          geoRef.current = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: Date.now(),
          };
          setProfile(buildProfile(geoRef.current, cameraRef.current));
        },
        (err) => console.warn('[EnvDetection] Geo:', err.message),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 },
      );
    };

    update();
    const id = setInterval(update, GEO_INTERVAL);
    return () => clearInterval(id);
  }, []);

  /* ── Sun/moon clock (recalculates every 30s) ─────────────────────── */

  useEffect(() => {
    const tick = () =>
      setProfile(buildProfile(geoRef.current, cameraRef.current));
    const id = setInterval(tick, SUN_INTERVAL);
    return () => clearInterval(id);
  }, []);

  /* ── Camera analyzer ─────────────────────────────────────────────── */

  useEffect(() => {
    if (!cameraEnabled) {
      analyzerRef.current?.stop();
      analyzerRef.current = null;
      cameraRef.current = null;
      setProfile(buildProfile(geoRef.current, null));
      return;
    }

    const analyzer = new CameraAnalyzerEngine();
    analyzerRef.current = analyzer;

    analyzer.start(
      (a) => {
        cameraRef.current = a;
        setProfile(buildProfile(geoRef.current, a));
      },
      facingMode,
      CAMERA_INTERVAL,
    );

    return () => {
      analyzer.stop();
      analyzerRef.current = null;
    };
  }, [cameraEnabled, facingMode]);

  return profile;
}

/* ── Profile builder ─────────────────────────────────────────────── */

function buildProfile(
  geo: GeoPosition | null,
  camera: CameraAnalysis | null,
): EnvironmentProfile {
  const now = new Date();
  const lat = geo?.lat ?? DEFAULT_LAT;
  const lng = geo?.lng ?? DEFAULT_LNG;

  const sun = getSunState(now, lat, lng);
  const moon = getMoonState(now, lat, lng);
  const cam = camera ?? NO_CAMERA;

  // ── Smart induction ─────────────────────────────────────────────
  let isOutdoor = false;
  let confidence = 0.3;

  if (cam.isAvailable) {
    confidence = 0.6;

    // High brightness + daylight color temp → outdoor
    if (cam.brightness > 150 && cam.colorTempK > 5500) {
      isOutdoor = true;
      confidence = 0.85;
    }
    // Moderate brightness + very high color temp (blue sky) → outdoor
    else if (cam.brightness > 100 && cam.colorTempK > 7000) {
      isOutdoor = true;
      confidence = 0.75;
    }
    // Low brightness → indoor (or night)
    else if (cam.brightness < 60) {
      isOutdoor = false;
      confidence = 0.7;
    }
    // Warm color temp (< 4000K) → likely indoor lighting
    else if (cam.colorTempK < 4000) {
      isOutdoor = false;
      confidence = 0.65;
    }
  }

  // ── Skybox mode ─────────────────────────────────────────────────
  const isDaytime = sun.altitude > 0;
  const isNight = sun.phase === 'night';

  let skyboxMode: SkyboxMode;

  if (isOutdoor && isDaytime) {
    skyboxMode = 'procedural-day';
  } else if (isOutdoor && !isDaytime) {
    skyboxMode = 'procedural-night';
  } else if (isNight && !cam.isAvailable) {
    // No camera, nighttime → assume night sky
    skyboxMode = 'procedural-night';
  } else {
    skyboxMode = 'indoor-default';
  }

  // ── Veil opacity — camera-adaptive ──────────────────────────────
  let veilOpacity = 0.35;
  if (cam.isAvailable) {
    // Bright → thin veil, dark → heavier veil
    veilOpacity = 0.12 + (1 - cam.luminance) * 0.35;
  } else if (skyboxMode === 'procedural-night') {
    veilOpacity = 0.15; // night sky should be visible
  }

  // ── Sky shader parameters ───────────────────────────────────────
  const skyParams = computeSkyParams(sun, cam);

  return {
    geo,
    sun,
    moon,
    camera: cam,
    isOutdoor,
    confidence,
    skyboxMode,
    veilOpacity,
    skyParams,
  };
}

/* ── Sky shader parameter tuning ─────────────────────────────────── */

function computeSkyParams(sun: SunState, cam: CameraAnalysis): SkyParams {
  const { phase } = sun;

  // Base turbidity — camera brightness modulates if available
  let turbidity = 10;
  if (cam.isAvailable) {
    // Clear sky (bright) → low turbidity, hazy → high
    turbidity = 2 + (1 - cam.brightness / 255) * 14;
  } else {
    // Time-based defaults
    if (phase === 'noon') turbidity = 6;
    else if (phase === 'golden-hour' || phase === 'sunset' || phase === 'sunrise') turbidity = 3;
    else turbidity = 10;
  }

  // Rayleigh — higher during golden hour for warm orange tones
  let rayleigh = 2;
  if (phase === 'golden-hour' || phase === 'sunrise' || phase === 'sunset') {
    rayleigh = 4;
  } else if (phase === 'dawn' || phase === 'dusk') {
    rayleigh = 3;
  }

  // Mie — sun halo, stronger at low sun angles
  let mieCoefficient = 0.005;
  let mieDirectionalG = 0.8;
  if (phase === 'golden-hour' || phase === 'sunset') {
    mieCoefficient = 0.01;
    mieDirectionalG = 0.95;
  }

  return {
    turbidity: Math.max(2, Math.min(20, turbidity)),
    rayleigh: Math.max(0, Math.min(4, rayleigh)),
    mieCoefficient,
    mieDirectionalG,
  };
}
