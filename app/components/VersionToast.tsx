'use client';

import { useState } from 'react';
import { useVersionCheck } from '@/lib/hooks/useVersionCheck';

export default function VersionToast() {
  const { update, dismiss, applyUpdate } = useVersionCheck();
  const [expanded, setExpanded] = useState(false);

  if (!update) return null;

  const timeAgo = (() => {
    if (!update.date) return '';
    const diff = Date.now() - new Date(update.date).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-zinc-900/95 backdrop-blur-md border border-emerald-500/30 rounded-xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-emerald-400">Nouvelle version</div>
            <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
              <span>{update.branch}/{update.hash}</span>
              <span className="text-zinc-700">{timeAgo}</span>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="text-zinc-600 hover:text-zinc-400 transition p-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Commit message */}
        <div className="px-4 pb-2">
          <p className="text-xs text-zinc-300 leading-relaxed">{update.message}</p>
          {update.author && (
            <p className="text-[10px] text-zinc-600 mt-0.5">{update.author}</p>
          )}
        </div>

        {/* Expandable file changes */}
        {update.filesChanged.length > 0 && (
          <div className="px-4 pb-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] text-zinc-600 hover:text-zinc-400 transition flex items-center gap-1"
            >
              <svg
                className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {update.filesChanged.length} fichier{update.filesChanged.length > 1 ? 's' : ''} modifie{update.filesChanged.length > 1 ? 's' : ''}
            </button>
            {expanded && (
              <div className="mt-1.5 max-h-32 overflow-y-auto space-y-0.5 scrollbar-hide">
                {update.filesChanged.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-zinc-500 truncate flex-1">{f.file}</span>
                    <span className="text-zinc-700 shrink-0">{f.changes}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-2.5 border-t border-zinc-800/50 flex gap-2">
          <button
            onClick={applyUpdate}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
          >
            Rafraichir
          </button>
          <button
            onClick={dismiss}
            className="px-3 py-1.5 rounded-lg text-xs text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700 transition"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
