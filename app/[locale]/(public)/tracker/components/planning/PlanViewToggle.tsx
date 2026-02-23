'use client';

interface PlanViewToggleProps {
  mode: 'now' | 'plan';
  onChange: (mode: 'now' | 'plan') => void;
}

export default function PlanViewToggle({ mode, onChange }: PlanViewToggleProps) {
  return (
    <div className="flex bg-zinc-800/50 rounded-lg p-0.5 text-sm">
      <button
        onClick={() => onChange('now')}
        className={`px-3 py-1 rounded-md transition ${
          mode === 'now'
            ? 'bg-zinc-700 text-white'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        Now
      </button>
      <button
        onClick={() => onChange('plan')}
        className={`px-3 py-1 rounded-md transition ${
          mode === 'plan'
            ? 'bg-indigo-600 text-white'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        Plan
      </button>
    </div>
  );
}
