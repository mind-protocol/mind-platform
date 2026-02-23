'use client';

import { useState, useEffect, useCallback } from 'react';

export interface TrackerEntry {
  id: string;
  ts: string;
  substance: string;
  dose: { amount: number; unit: string; details: Record<string, unknown> };
  intent: string;
  notes: string;
  biometrics_at_log: {
    hr: number | null;
    stress: number | null;
    body_battery: number | null;
    ans_mode: string;
  } | null;
}

export interface TimeseriesPoint {
  ts: string;
  ts_ms: number;
  stress?: number;
  body_battery?: number;
}

export interface SubstanceEvent {
  ts: string;
  ts_ms: number;
  substance: string;
  dose: { amount: number; unit: string };
  intent: string;
}

export interface TrackerData {
  entries: TrackerEntry[];
  timeseries: TimeseriesPoint[];
  events: SubstanceEvent[];
  loading: boolean;
}

export function useTrackerData(days: number): TrackerData {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [timeseries, setTimeseries] = useState<TimeseriesPoint[]>([]);
  const [events, setEvents] = useState<SubstanceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/tracker/log?days=${days}`).then(r => r.json()).catch(() => ({ entries: [] })),
      fetch(`/api/tracker/correlation?days=${days}`).then(r => r.json()).catch(() => ({ timeseries: [], events: [] })),
    ]).then(([logData, corrData]) => {
      setEntries(logData.entries || []);
      setTimeseries(corrData.timeseries || []);
      setEvents(corrData.events || []);
      setLoading(false);
    });
  }, [days]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { entries, timeseries, events, loading };
}
