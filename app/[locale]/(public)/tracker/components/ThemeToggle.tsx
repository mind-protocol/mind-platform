'use client';

import { useTheme, type ThemeMode } from '@/lib/theme';

const MODE_CYCLE: ThemeMode[] = ['dark', 'light', 'auto'];
const MODE_ICON: Record<ThemeMode, string> = {
  light: '\u2600\uFE0F',  // sun
  dark: '\uD83C\uDF19',   // crescent moon
  auto: '\uD83D\uDD04',   // cycle arrows
};
const MODE_LABEL: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  auto: 'Auto (solar)',
};

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const next = () => {
    const idx = MODE_CYCLE.indexOf(mode);
    setMode(MODE_CYCLE[(idx + 1) % MODE_CYCLE.length]);
  };

  return (
    <button
      onClick={next}
      title={`Theme: ${MODE_LABEL[mode]}`}
      aria-label={`Theme: ${MODE_LABEL[mode]}. Click to change.`}
      className="text-sm px-2.5 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition select-none"
    >
      <span className="mr-1">{MODE_ICON[mode]}</span>
      <span className="hidden sm:inline text-xs">{MODE_LABEL[mode]}</span>
    </button>
  );
}
