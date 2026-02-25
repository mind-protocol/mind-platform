'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mind_sanitize_mode';

/** Substances hidden in sanitize mode (illegal / recreational / age-restricted) */
export const SANITIZED_SUBSTANCES = new Set([
  'thc', 'cbd', 'ketamine', 'lsd', 'nicotine',
]);

/** Adverse effect keys hidden in sanitize mode (intimate / private) */
export const SANITIZED_EFFECTS = new Set([
  'diarrhea', 'vomiting', 'vomiting_blood', 'vomiting_bile', 'vomiting_food', 'vomiting_dry',
  'retching', 'stomach_pain', 'flatulence', 'bloating',
  'frequent_urination', 'urinary_retention', 'urination', 'incontinence',
  'libido_change', 'anorgasmia',
]);

/** Check if a substance entry should be hidden */
export function isSanitized(substance: string): boolean {
  return SANITIZED_SUBSTANCES.has(substance);
}

/** Check if an adverse effect should be hidden */
export function isEffectSanitized(effectKey: string): boolean {
  return SANITIZED_EFFECTS.has(effectKey);
}

/**
 * Global sanitize mode hook.
 * Persists across pages via localStorage.
 * When active, hides recreational substances and intimate health data.
 */
export function useSanitizeMode() {
  const [sanitized, setSanitized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') setSanitized(true);
  }, []);

  const toggle = useCallback(() => {
    setSanitized((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { sanitized, toggle };
}
