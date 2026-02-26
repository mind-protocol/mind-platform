/* ── Skybox Intelligence — Shared Types ──────────────────────────── */

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

export type TimePhase =
  | 'night'
  | 'dawn'
  | 'sunrise'
  | 'morning'
  | 'noon'
  | 'afternoon'
  | 'golden-hour'
  | 'sunset'
  | 'dusk';

export interface CameraAnalysis {
  luminance: number;                        // 0-1 relative luminance (WCAG)
  brightness: number;                       // 0-255 perceived brightness
  colorTempK: number;                       // Correlated Color Temperature in Kelvin
  dominantRGB: [number, number, number];    // average color
  isAvailable: boolean;
  lastCapture: number;                      // timestamp ms
}

export interface SunState {
  altitude: number;                         // radians — 0 = horizon, PI/2 = zenith
  azimuth: number;                          // radians
  position: [number, number, number];       // Three.js vector for <Sky sunPosition>
  phase: TimePhase;
}

export interface MoonState {
  altitude: number;
  azimuth: number;
  phase: number;                            // 0-1 — 0=new, 0.5=full
  illumination: number;                     // 0-1
}

export type SkyboxMode =
  | 'uploaded'          // user-uploaded equirectangular
  | 'procedural-day'    // drei <Sky> with real sun position
  | 'procedural-night'  // dark sky + stars + moon
  | 'indoor-default';   // yoga room default texture

export interface SkyParams {
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
}

export interface EnvironmentProfile {
  // ── Sources ──
  geo: GeoPosition | null;
  sun: SunState;
  moon: MoonState;
  camera: CameraAnalysis;

  // ── Induction ──
  isOutdoor: boolean;
  confidence: number;                       // 0-1

  // ── Resolved ──
  skyboxMode: SkyboxMode;
  veilOpacity: number;                      // 0-1
  skyParams: SkyParams;
}
