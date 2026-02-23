'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { normalizeDose, SUBSTANCE_KEYS, type SubstanceKey } from '../constants';
import { computeAwareness, type AwarenessState, type IntakeEvent } from '../pharmacokinetics';

const POLL_INTERVAL_MS = 15_000; // Refresh data every 15s
const TICK_INTERVAL_MS = 500;    // Recompute PK curves every 500ms for smooth animation

export function useAwarenessState(): {
  awareness: AwarenessState;
  loading: boolean;
  lastUpdate: number;
} {
  const [awareness, setAwareness] = useState<AwarenessState>(() => ({
    substances: Object.fromEntries(SUBSTANCE_KEYS.map(k => [k, 0])) as Record<SubstanceKey, number>,
    psychedelicLoad: 0,
    stimulantLoad: 0,
    sedativeLoad: 0,
    antidepressantBaseline: 0,
    hydrationLevel: 0,
    alterationDepth: 0,
    dominant: null,
    stress: null,
    bodyBattery: null,
    hr: null,
  }));
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(0);

  // Refs for data that persists across ticks
  const intakesRef = useRef<IntakeEvent[]>([]);
  const biometricsRef = useRef<{ stress?: number | null; body_battery?: number | null; hr?: number | null }>({});

  // Fetch latest data from API
  const fetchData = useCallback(async () => {
    try {
      // Fetch last 24h of logs (covers longest PK duration: LSD 12h)
      const [logRes, corrRes] = await Promise.all([
        fetch('/api/tracker/log?days=1').then(r => r.json()).catch(() => ({ entries: [] })),
        fetch('/api/tracker/correlation?days=0.01').then(r => r.json()).catch(() => ({ timeseries: [] })),
      ]);

      // Build intake events from tracker log
      const entries = logRes.entries || [];
      const intakes: IntakeEvent[] = entries.map((e: { ts: string; substance: string; dose: { amount: number } }) => ({
        substance: e.substance as SubstanceKey,
        ts: e.ts,
        amount: e.dose.amount,
        normalizedDose: SUBSTANCE_KEYS.includes(e.substance as SubstanceKey)
          ? normalizeDose(e.substance as SubstanceKey, e.dose.amount)
          : 0.5,
      }));

      intakesRef.current = intakes;

      // Get latest biometric reading
      const timeseries = corrRes.timeseries || [];
      if (timeseries.length > 0) {
        const latest = timeseries[timeseries.length - 1];
        biometricsRef.current = {
          stress: latest.stress ?? null,
          body_battery: latest.body_battery ?? null,
          hr: latest.hr ?? null,
        };
      }

      setLastUpdate(Date.now());
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  // High-frequency PK tick — recomputes awareness state for smooth animation
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const state = computeAwareness(intakesRef.current, now, biometricsRef.current);
      setAwareness(state);
    };

    tick(); // Initial computation
    const interval = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [lastUpdate]); // Re-setup when data changes

  return { awareness, loading, lastUpdate };
}
