'use client';

import { useEffect, useState } from 'react';
import type { NodeDetail } from '../types';
import { LABEL_COLORS } from '../types';

interface NodePanelProps {
  nodeId: string | null;
  onClose: () => void;
  onNavigate: (nodeId: string) => void;
}

const SKIP_PROPS = new Set(['name', 'description', 'id', 'embeddable_text']);

export default function NodePanel({ nodeId, onClose, onNavigate }: NodePanelProps) {
  const [detail, setDetail] = useState<NodeDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nodeId) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/graph/node/${encodeURIComponent(nodeId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setDetail(null);
        } else {
          setDetail(data);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  const isOpen = nodeId !== null;

  return (
    <>
      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed z-40 bg-zinc-900 border-zinc-800 overflow-y-auto transition-transform duration-300 ease-out
          md:right-0 md:top-0 md:h-full md:w-[350px] md:border-l
          bottom-0 left-0 right-0 md:bottom-auto md:left-auto
          ${isOpen
            ? 'translate-y-0 md:translate-x-0'
            : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }
        `}
        style={{
          maxHeight: 'calc(100vh - 0px)',
        }}
      >
        {/* Mobile: limited height, slides up from bottom */}
        <div className="md:hidden max-h-[70vh] overflow-y-auto">
          <PanelContent
            detail={detail}
            loading={loading}
            onClose={onClose}
            onNavigate={onNavigate}
          />
        </div>
        {/* Desktop: full height */}
        <div className="hidden md:block h-full overflow-y-auto">
          <PanelContent
            detail={detail}
            loading={loading}
            onClose={onClose}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </>
  );
}

function PanelContent({
  detail,
  loading,
  onClose,
  onNavigate,
}: {
  detail: NodeDetail | null;
  loading: boolean;
  onClose: () => void;
  onNavigate: (nodeId: string) => void;
}) {
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
          <CloseButton onClick={onClose} />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-zinc-500 text-sm">No node selected</span>
          <CloseButton onClick={onClose} />
        </div>
      </div>
    );
  }

  const { node, neighbors } = detail;
  const properties = node.properties || {};
  const visibleProps = Object.entries(properties).filter(
    ([k, v]) => !SKIP_PROPS.has(k) && v != null && v !== ''
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-lg font-bold text-white leading-tight pr-4">
          {node.name || 'Untitled'}
        </h2>
        <CloseButton onClick={onClose} />
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(node.labels || []).map((label) => {
          const color = LABEL_COLORS[label] || LABEL_COLORS.default;
          return (
            <span
              key={label}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${color}20`,
                color: color,
                border: `1px solid ${color}40`,
              }}
            >
              {label.replace(/_/g, ' ')}
            </span>
          );
        })}
      </div>

      {/* Description */}
      {node.description && (
        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
          {node.description}
        </p>
      )}

      {/* Properties */}
      {visibleProps.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Properties
          </h3>
          <div className="space-y-1.5">
            {visibleProps.map(([key, value]) => {
              let displayValue = String(value);
              if (displayValue.length > 200) {
                displayValue = displayValue.substring(0, 197) + '...';
              }
              return (
                <div key={key} className="flex gap-2 text-sm">
                  <span className="text-zinc-500 font-mono text-xs shrink-0">
                    {key}
                  </span>
                  <span className="text-zinc-300 break-words">
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Neighbors */}
      {neighbors && neighbors.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Connections ({neighbors.length})
          </h3>
          <div className="space-y-1">
            {neighbors.slice(0, 30).map((nb) => (
              <button
                key={`${nb.id}-${nb.relation}`}
                onClick={() => onNavigate(nb.id)}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md hover:bg-zinc-800 transition group"
              >
                <span className="text-xs text-zinc-600 font-mono shrink-0 group-hover:text-zinc-400 transition">
                  {nb.relation}
                </span>
                <span className="text-sm text-zinc-300 truncate group-hover:text-white transition">
                  {nb.name}
                </span>
                <svg
                  className="w-3 h-3 text-zinc-600 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition shrink-0"
      aria-label="Close panel"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
