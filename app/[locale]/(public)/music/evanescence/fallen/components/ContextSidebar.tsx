'use client';

import { useState, useEffect, useRef } from 'react';
import { TRACK_ANALYSES, type TrackAnalysis } from '@/lib/fallen/data/analysis';
import { BIOGRAPHICAL_CONTEXTS, type BiographicalContext } from '@/lib/fallen/data/context';
import { FALLEN_TRACKS } from '@/lib/fallen/data/tracks';

interface ContextSidebarProps {
  trackSlug: string;
}

export default function ContextSidebar({ trackSlug }: ContextSidebarProps) {
  const analysis = TRACK_ANALYSES[trackSlug];
  const relevantContexts = BIOGRAPHICAL_CONTEXTS.filter((ctx) =>
    ctx.relevantTracks.includes(trackSlug)
  );

  const [expandedMechanisms, setExpandedMechanisms] = useState(false);
  const [expandedContextId, setExpandedContextId] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const prevSlugRef = useRef(trackSlug);

  useEffect(() => {
    if (prevSlugRef.current !== trackSlug) {
      setFadeIn(false);
      setExpandedMechanisms(false);
      setExpandedContextId(null);
      const timer = setTimeout(() => setFadeIn(true), 50);
      prevSlugRef.current = trackSlug;
      return () => clearTimeout(timer);
    } else {
      setFadeIn(true);
    }
  }, [trackSlug]);

  if (!analysis) {
    return (
      <div className="p-4">
        <p className="text-xs text-fallen-muted italic">
          No analysis available for this track.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`space-y-5 transition-opacity duration-500 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* ── Track Analysis Card ── */}
      <section>
        <p className="text-[10px] uppercase tracking-wider text-fallen-muted mb-3">
          Analysis
        </p>

        {/* Theme badge */}
        <div className="mb-3">
          <span className="inline-block text-[11px] px-2.5 py-1 rounded-full bg-fallen-accent/10 text-fallen-accent border border-fallen-accent/20 font-medium">
            {analysis.theme}
          </span>
        </div>

        {/* Mental state */}
        <p className="text-xs text-fallen-muted mb-4">
          Mental state:{' '}
          <span className="text-fallen-highlight">{analysis.mentalState}</span>
        </p>

        {/* Psychological mechanisms */}
        <div className="mb-4">
          <button
            onClick={() => setExpandedMechanisms(!expandedMechanisms)}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-fallen-muted hover:text-fallen-highlight transition mb-2 w-full text-left"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${
                expandedMechanisms ? 'rotate-90' : ''
              }`}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            Psychological Mechanisms ({analysis.mechanisms.length})
          </button>

          {expandedMechanisms && (
            <div className="space-y-3 ml-1">
              {analysis.mechanisms.map((mech, i) => (
                <MechanismCard key={i} mechanism={mech} />
              ))}
            </div>
          )}

          {!expandedMechanisms && analysis.mechanisms.length > 0 && (
            <div className="ml-1 space-y-1.5">
              {analysis.mechanisms.map((mech, i) => (
                <p key={i} className="text-xs text-fallen-text/50">
                  <span className="text-fallen-accent/70 mr-1">&bull;</span>
                  {mech.label}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Amy Lee quote */}
        {analysis.amyLeeQuote && (
          <blockquote className="border-l-2 border-fallen-accent/30 pl-3 mb-4">
            <p
              className="text-xs text-fallen-text/70 italic leading-relaxed"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              &ldquo;{analysis.amyLeeQuote}&rdquo;
            </p>
            <cite className="text-[10px] text-fallen-muted not-italic block mt-1">
              &mdash; Amy Lee
            </cite>
          </blockquote>
        )}

        {/* Origin story */}
        {analysis.origin && (
          <div className="p-3 rounded-lg bg-fallen-surface border border-fallen-border mb-4">
            <p className="text-[10px] uppercase tracking-wider text-fallen-muted mb-1.5">
              Origin
            </p>
            <p className="text-xs text-fallen-text/60 leading-relaxed">
              {analysis.origin}
            </p>
          </div>
        )}

        {/* Emotional structure */}
        {analysis.emotionalStructure && analysis.emotionalStructure.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-fallen-muted mb-2">
              Emotional Structure
            </p>
            <div className="space-y-1.5">
              {analysis.emotionalStructure.map((es, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-fallen-accent/70 font-medium flex-shrink-0 min-w-[60px]">
                    {es.section}
                  </span>
                  <span className="text-fallen-text/50">{es.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Divider ── */}
      {relevantContexts.length > 0 && (
        <div className="border-t border-fallen-border/50" />
      )}

      {/* ── Relevant Biographical Contexts ── */}
      {relevantContexts.length > 0 && (
        <section>
          <p className="text-[10px] uppercase tracking-wider text-fallen-muted mb-3">
            Biographical Context
          </p>
          <div className="space-y-2">
            {relevantContexts.map((ctx) => (
              <ContextCard
                key={ctx.id}
                context={ctx}
                isExpanded={expandedContextId === ctx.id}
                onToggle={() =>
                  setExpandedContextId(
                    expandedContextId === ctx.id ? null : ctx.id
                  )
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Divider ── */}
      {analysis.connections && analysis.connections.length > 0 && (
        <div className="border-t border-fallen-border/50" />
      )}

      {/* ── Track Connections ── */}
      {analysis.connections && analysis.connections.length > 0 && (
        <section>
          <p className="text-[10px] uppercase tracking-wider text-fallen-muted mb-3">
            Connected Tracks
          </p>
          <div className="space-y-2.5">
            {analysis.connections.map((conn, i) => {
              const connectedTrack = FALLEN_TRACKS.find(
                (t) => t.slug === conn.trackSlug
              );
              return (
                <div key={i} className="flex items-start gap-2">
                  <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-fallen-surface border border-fallen-border text-fallen-accent flex-shrink-0 mt-0.5 font-medium">
                    {connectedTrack?.title ?? conn.trackSlug}
                  </span>
                  <p className="text-[11px] text-fallen-text/40 leading-relaxed">
                    {conn.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function MechanismCard({
  mechanism,
}: {
  mechanism: { label: string; quote: string; explanation: string };
}) {
  return (
    <div className="p-2.5 rounded-lg bg-fallen-surface border border-fallen-border">
      <p className="text-[11px] text-fallen-accent font-semibold mb-1">
        {mechanism.label}
      </p>
      <p
        className="text-[11px] text-fallen-highlight/80 italic mb-1.5 leading-relaxed"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        &ldquo;{mechanism.quote}&rdquo;
      </p>
      <p className="text-[11px] text-fallen-text/50 leading-relaxed">
        {mechanism.explanation}
      </p>
    </div>
  );
}

function ContextCard({
  context,
  isExpanded,
  onToggle,
}: {
  context: BiographicalContext;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const firstSentence = context.content.split(/\.(?:\s|$)/)[0] + '.';

  return (
    <button
      onClick={onToggle}
      className="w-full text-left p-3 rounded-lg bg-fallen-surface border border-fallen-border hover:border-fallen-accent/20 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-xs text-fallen-accent font-semibold leading-tight"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {context.title}
        </p>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-fallen-muted flex-shrink-0 mt-0.5 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {isExpanded ? (
        <p className="text-[11px] text-fallen-text/50 leading-relaxed mt-2">
          {context.content}
        </p>
      ) : (
        <p className="text-[11px] text-fallen-text/40 leading-relaxed mt-1.5 line-clamp-2">
          {firstSentence}
        </p>
      )}
    </button>
  );
}
