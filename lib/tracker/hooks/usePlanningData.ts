'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PlannedDose, Regimen } from '../planning';

const POLL_INTERVAL_MS = 30_000;

export function usePlanningData(daysAhead: number = 7) {
  const [planned, setPlanned] = useState<PlannedDose[]>([]);
  const [regimens, setRegimens] = useState<Regimen[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/tracker/plan?days_ahead=${daysAhead}&days_behind=1&include_regimens=true`);
      const data = await res.json();
      setPlanned(data.planned || []);
      setRegimens(data.regimens || []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [daysAhead]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  const scheduleDose = useCallback(async (dose: {
    substance: string;
    ts_scheduled: string;
    dose: { amount: number; unit: string; details?: Record<string, unknown> };
    intent?: string;
    source?: string;
    notes?: string;
  }) => {
    try {
      const res = await fetch('/api/tracker/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dose),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchData]);

  const updateDose = useCallback(async (id: string, update: {
    status?: string;
    snooze_until?: string;
  }) => {
    try {
      const res = await fetch(`/api/tracker/plan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchData]);

  const takeDose = useCallback((id: string) => updateDose(id, { status: 'taken' }), [updateDose]);
  const skipDose = useCallback((id: string) => updateDose(id, { status: 'skipped' }), [updateDose]);
  const snoozeDose = useCallback((id: string, minutes: number = 30) => {
    const until = new Date(Date.now() + minutes * 60_000).toISOString().replace('+00:00', 'Z');
    return updateDose(id, { status: 'snoozed', snooze_until: until });
  }, [updateDose]);

  const createRegimen = useCallback(async (regimen: {
    substance: string;
    dose: { amount: number; unit: string; details?: Record<string, unknown> };
    intent?: string;
    pattern: { type: string; times?: string[]; interval_hours?: number; waking_hours_only?: boolean };
    notes?: string;
  }) => {
    try {
      const res = await fetch('/api/tracker/regimens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regimen),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchData]);

  const toggleRegimen = useCallback(async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/tracker/regimens/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      if (res.ok) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [fetchData]);

  return {
    planned,
    regimens,
    loading,
    scheduleDose,
    takeDose,
    skipDose,
    snoozeDose,
    createRegimen,
    toggleRegimen,
    refresh: fetchData,
  };
}
