'use client';

import { colors } from '@/lib/design';

type Tab = 'citizens' | 'orgs';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  counts?: { citizens: number; orgs: number };
}

export function RegistryTabs({ active, onChange, counts }: Props) {
  const tabs: { id: Tab; label: string; color: string }[] = [
    { id: 'citizens', label: 'Citizens', color: colors.layer.L1 },
    { id: 'orgs', label: 'Organizations', color: colors.layer.L2 },
  ];

  return (
    <div className="flex gap-2 border-b border-zinc-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition relative ${
            active === tab.id
              ? 'text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {tab.label}
          {counts && (
            <span className="ml-2 text-xs text-zinc-600">
              ({counts[tab.id]})
            </span>
          )}
          {active === tab.id && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: tab.color }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
