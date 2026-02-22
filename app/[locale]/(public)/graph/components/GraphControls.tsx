'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { GraphStats } from '../types';
import { SCHEMA_LABELS, LABEL_COLORS } from '../types';

interface GraphControlsProps {
  stats: GraphStats | null;
  visibleCount: number;
  totalMatching: number | null;
  onSearch: (query: string) => void;
  onFilterLabel: (label: string) => void;
  onFilterGraph: (graph: string) => void;
  onReset: () => void;
  activeLabel: string;
  activeGraph: string;
}

export default function GraphControls({
  stats,
  visibleCount,
  totalMatching,
  onSearch,
  onFilterLabel,
  onFilterGraph,
  onReset,
  activeLabel,
  activeGraph,
}: GraphControlsProps) {
  const [searchValue, setSearchValue] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const labels = stats
    ? Object.keys(stats.by_label)
        .filter((l) => !SCHEMA_LABELS.includes(l))
        .sort()
    : [];

  const graphs = stats?.graphs ?? Object.keys(stats?.by_graph ?? {}).sort();

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(value.trim());
      }, 300);
    },
    [onSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleReset = () => {
    setSearchValue('');
    onReset();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-zinc-900/80 border-b border-zinc-800">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search nodes..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition"
        />
      </div>

      {/* Label filter */}
      <select
        value={activeLabel}
        onChange={(e) => onFilterLabel(e.target.value)}
        className="px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:border-amber-500/50 transition appearance-none cursor-pointer"
        style={{ minWidth: '140px' }}
      >
        <option value="">All labels</option>
        {labels.map((label) => (
          <option key={label} value={label}>
            {label.replace(/_/g, ' ')} ({stats?.by_label[label] ?? 0})
          </option>
        ))}
      </select>

      {/* Graph filter */}
      <select
        value={activeGraph}
        onChange={(e) => onFilterGraph(e.target.value)}
        className="px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:border-amber-500/50 transition appearance-none cursor-pointer"
        style={{ minWidth: '140px' }}
      >
        <option value="">All graphs</option>
        {graphs.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition"
      >
        Reset
      </button>

      {/* Stats */}
      <div className="flex items-center gap-4 ml-auto text-xs text-zinc-500">
        <span>
          <span className="text-zinc-300 font-medium">{visibleCount}</span> nodes
          {totalMatching != null && totalMatching > visibleCount && (
            <span> of {totalMatching}</span>
          )}
        </span>
        {stats && (
          <span className="hidden sm:inline">
            <span className="text-zinc-300 font-medium">{stats.total_nodes}</span> total
          </span>
        )}
        {/* Legend dots for active labels */}
        <div className="hidden md:flex items-center gap-2">
          {labels.slice(0, 6).map((label) => (
            <div key={label} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: LABEL_COLORS[label] || LABEL_COLORS.default }}
              />
              <span className="text-[10px]">{label.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
