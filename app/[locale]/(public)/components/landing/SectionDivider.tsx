interface SectionDividerProps {
  accent?: boolean;
}

export function SectionDivider({ accent = false }: SectionDividerProps) {
  return (
    <div
      className={`h-px mx-auto max-w-4xl bg-gradient-to-r from-transparent ${
        accent ? 'via-amber-500/30' : 'via-zinc-700/50'
      } to-transparent`}
    />
  );
}
