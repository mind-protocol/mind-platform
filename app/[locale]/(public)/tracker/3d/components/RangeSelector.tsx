'use client';

const RANGES = [
  { days: 7, label: '7d' },
  { days: 14, label: '14d' },
  { days: 30, label: '30d' },
];

interface RangeSelectorProps {
  days: number;
  onChange: (days: number) => void;
}

export default function RangeSelector({ days, onChange }: RangeSelectorProps) {
  return (
    <div className="flex gap-1 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg p-1">
      {RANGES.map((r) => (
        <button
          key={r.days}
          onClick={() => onChange(r.days)}
          className={`px-3 py-1 text-xs font-mono rounded transition ${
            days === r.days
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
