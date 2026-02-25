'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import React from 'react';

// ── Types ─────────────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** The currently applied theme (after auto-resolution) */
  theme: ResolvedTheme;
  /** The user-selected mode */
  mode: ThemeMode;
  /** Change the mode */
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  mode: 'dark',
  setMode: () => {},
});

// ── Solar calculation ─────────────────────────────────────────────
// Simplified sunrise equation (no external API needed)

interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

const DEFAULT_LAT = 48.8566; // Paris
const DEFAULT_LNG = 2.3522;

function computeSunTimes(lat: number, lng: number, date: Date): SunTimes {
  const start = new Date(date.getFullYear(), 0, 1);
  const n = Math.ceil((date.getTime() - start.getTime()) / 86400000);

  // Solar declination (degrees)
  const declination =
    -23.45 * Math.cos(((360 / 365) * (n + 10) * Math.PI) / 180);

  const latRad = (lat * Math.PI) / 180;
  const declRad = (declination * Math.PI) / 180;

  // Hour angle
  const cosH =
    (Math.cos((90.833 * Math.PI) / 180) -
      Math.sin(latRad) * Math.sin(declRad)) /
    (Math.cos(latRad) * Math.cos(declRad));

  // Clamp for polar regions where sun never sets / never rises
  const clampedCosH = Math.max(-1, Math.min(1, cosH));
  const H = (Math.acos(clampedCosH) * 180) / Math.PI;

  // Solar noon in hours UTC
  const solarNoon = 12 - lng / 15;

  const sunriseHoursUTC = solarNoon - H / 15;
  const sunsetHoursUTC = solarNoon + H / 15;

  const toDate = (hoursUTC: number): Date => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCMinutes(Math.round(hoursUTC * 60));
    return d;
  };

  return {
    sunrise: toDate(sunriseHoursUTC),
    sunset: toDate(sunsetHoursUTC),
  };
}

function resolveAutoTheme(lat: number, lng: number): ResolvedTheme {
  const now = new Date();
  const { sunrise, sunset } = computeSunTimes(lat, lng, now);

  // Dark theme starts 30 minutes after sunset
  const darkStart = new Date(sunset.getTime() + 30 * 60 * 1000);

  if (now >= sunrise && now < darkStart) {
    return 'light';
  }
  return 'dark';
}

// ── Storage helpers ───────────────────────────────────────────────
const STORAGE_KEY = 'mind_theme';

function loadMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }
  } catch {
    // SSR or blocked localStorage
  }
  return 'dark';
}

function saveMode(mode: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // blocked localStorage
  }
}

// ── Apply theme to <html> ─────────────────────────────────────────
function applyThemeClass(theme: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

// ── Provider ──────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [theme, setTheme] = useState<ResolvedTheme>('dark');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
  });

  // Load persisted mode on mount
  useEffect(() => {
    const stored = loadMode();
    setModeState(stored);
  }, []);

  // Request geolocation once (for auto mode)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // Permission denied or error — keep Paris defaults
      },
      { timeout: 5000, maximumAge: 3600000 }
    );
  }, []);

  // Resolve theme whenever mode or coords change, and re-check every minute in auto mode
  useEffect(() => {
    const resolve = () => {
      let resolved: ResolvedTheme;
      if (mode === 'auto') {
        resolved = resolveAutoTheme(coords.lat, coords.lng);
      } else {
        resolved = mode;
      }
      setTheme(resolved);
      applyThemeClass(resolved);
    };

    resolve();

    if (mode === 'auto') {
      const interval = setInterval(resolve, 60_000); // re-check every minute
      return () => clearInterval(interval);
    }
  }, [mode, coords]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    saveMode(m);
  }, []);

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, mode, setMode } },
    children
  );
}

// ── Hook ──────────────────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
