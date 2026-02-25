'use client';

import { useEffect, useState, useCallback } from 'react';

interface Props {
  onTabSwitch: (tab: 'body' | 'substances') => void;
  onRefresh: () => void;
}

export default function KeyboardShortcuts({ onTabSwitch, onRefresh }: Props) {
  const [showHelp, setShowHelp] = useState(false);

  const handleKey = useCallback((e: KeyboardEvent) => {
    // Don't trigger in inputs/textareas
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    switch (e.key) {
      case '1':
        onTabSwitch('body');
        break;
      case '2':
        onTabSwitch('substances');
        break;
      case 'r':
        if (!e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          onRefresh();
        }
        break;
      case '?':
        setShowHelp((v) => !v);
        break;
      case 'Escape':
        setShowHelp(false);
        break;
    }
  }, [onTabSwitch, onRefresh]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!showHelp) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-medium text-zinc-300 mb-4 uppercase tracking-wider">
          Keyboard Shortcuts
        </h3>
        <div className="space-y-2.5 text-sm">
          {[
            { key: '1', desc: 'Switch to Body tab' },
            { key: '2', desc: 'Switch to Substances tab' },
            { key: 'r', desc: 'Refresh data' },
            { key: '?', desc: 'Toggle this help' },
            { key: 'Esc', desc: 'Close dialogs' },
          ].map(({ key, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-zinc-400">{desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs">
                {key}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-zinc-600 mt-4">
          Press <kbd className="text-zinc-500">?</kbd> to toggle
        </p>
      </div>
    </div>
  );
}
