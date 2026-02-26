/* ── Solar & Lunar Position Engine ────────────────────────────────
 *
 * Wraps suncalc to provide:
 *   - Real sun position as Three.js vector (for drei <Sky>)
 *   - Time phase detection (dawn → sunrise → … → night)
 *   - Moon state (position + phase + illumination)
 *
 * Default location: Lyon, France (Nicolas).
 * ─────────────────────────────────────────────────────────────────── */

import SunCalc from 'suncalc';
import type { SunState, MoonState, TimePhase } from './types';

// Lyon, France
const DEFAULT_LAT = 45.764;
const DEFAULT_LNG = 4.8357;

/* ── Sun ─────────────────────────────────────────────────────────── */

export function getSunState(
  date: Date,
  lat = DEFAULT_LAT,
  lng = DEFAULT_LNG,
): SunState {
  const pos = SunCalc.getPosition(date, lat, lng);
  const times = SunCalc.getTimes(date, lat, lng);

  // suncalc → Three.js: altitude/azimuth → Cartesian unit vector
  const phi = Math.PI / 2 - pos.altitude;
  const theta = pos.azimuth + Math.PI;

  const position: [number, number, number] = [
    Math.sin(phi) * Math.sin(theta),   // x
    Math.cos(phi),                       // y (up)
    Math.sin(phi) * Math.cos(theta),    // z
  ];

  return {
    altitude: pos.altitude,
    azimuth: pos.azimuth,
    position,
    phase: classifyPhase(date, times),
  };
}

/* ── Moon ────────────────────────────────────────────────────────── */

export function getMoonState(
  date: Date,
  lat = DEFAULT_LAT,
  lng = DEFAULT_LNG,
): MoonState {
  const pos = SunCalc.getMoonPosition(date, lat, lng);
  const illum = SunCalc.getMoonIllumination(date);

  return {
    altitude: pos.altitude,
    azimuth: pos.azimuth,
    phase: illum.phase,
    illumination: illum.fraction,
  };
}

/* ── Phase classification ────────────────────────────────────────── */

function classifyPhase(
  date: Date,
  times: ReturnType<typeof SunCalc.getTimes>,
): TimePhase {
  const t = date.getTime();

  // Ordered from earliest to latest
  if (t < (times.nightEnd?.getTime() ?? 0))     return 'night';
  if (t < (times.dawn?.getTime() ?? 0))          return 'night';
  if (t < (times.sunrise?.getTime() ?? 0))       return 'dawn';
  if (t < (times.sunriseEnd?.getTime() ?? 0))    return 'sunrise';
  if (t < (times.goldenHourEnd?.getTime() ?? 0)) return 'morning';

  // Noon window: ±2h around solar noon
  const noon = times.solarNoon?.getTime() ?? date.setHours(12, 0, 0, 0);
  const TWO_H = 2 * 3600_000;
  if (t < noon - TWO_H)                          return 'morning';
  if (t < noon + TWO_H)                          return 'noon';

  if (t < (times.goldenHour?.getTime() ?? 0))    return 'afternoon';
  if (t < (times.sunsetStart?.getTime() ?? 0))   return 'golden-hour';
  if (t < (times.sunset?.getTime() ?? 0))        return 'sunset';
  if (t < (times.dusk?.getTime() ?? 0))           return 'dusk';

  return 'night';
}
