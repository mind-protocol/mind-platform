'use client';

import { useState, useCallback, useEffect } from 'react';
import { SUBSTANCE_CONFIG, SUBSTANCE_KEYS, type SubstanceKey } from '../constants';

const STORAGE_KEY = 'mind_enabled_substances';

/**
 * Returns the set of user-enabled substances.
 * By default, substances with `hidden: true` are disabled.
 * Users can toggle them on/off via the config panel.
 */
export function useSubstanceConfig() {
  const [enabledSet, setEnabledSet] = useState<Set<SubstanceKey>>(() => {
    // Default: all non-hidden substances enabled
    return new Set(SUBSTANCE_KEYS.filter((k) => !SUBSTANCE_CONFIG[k].hidden));
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const arr: SubstanceKey[] = JSON.parse(stored);
        setEnabledSet(new Set(arr));
      }
    } catch {
      // fallback to defaults
    }
  }, []);

  const toggle = useCallback((key: SubstanceKey) => {
    setEnabledSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const isEnabled = useCallback((key: SubstanceKey) => enabledSet.has(key), [enabledSet]);

  const resetToDefaults = useCallback(() => {
    const defaults = new Set(SUBSTANCE_KEYS.filter((k) => !SUBSTANCE_CONFIG[k].hidden));
    setEnabledSet(defaults);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  /** Only the visible substance keys (respecting user config) */
  const visibleKeys = SUBSTANCE_KEYS.filter((k) => enabledSet.has(k));

  /** All hidden substances (for the config panel) */
  const hiddenSubstances = SUBSTANCE_KEYS.filter((k) => SUBSTANCE_CONFIG[k].hidden);

  return {
    enabledSet,
    visibleKeys,
    hiddenSubstances,
    toggle,
    toggleSubstance: toggle,
    isEnabled,
    resetToDefaults,
  };
}
