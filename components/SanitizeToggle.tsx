'use client';

import { useSanitizeMode } from '@/lib/use-sanitize';

/**
 * Crossed-eye toggle button for sanitize mode.
 * Hides recreational substances and intimate health data.
 * State persists across pages via localStorage.
 */
export default function SanitizeToggle() {
  const { sanitized, toggle } = useSanitizeMode();

  return (
    <button
      onClick={toggle}
      title={sanitized ? 'Mode privé actif — cliquer pour tout afficher' : 'Masquer substances récréatives et données intimes'}
      className={`text-sm px-2.5 py-1.5 rounded border transition ${
        sanitized
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
      }`}
    >
      {sanitized ? '🙈' : '👁️'}
    </button>
  );
}
