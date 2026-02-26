'use client';

import { useState } from 'react';
import type { VoicePhase } from '@/lib/voice/types';

interface VoiceCallControlsProps {
  isActive: boolean;
  phase: VoicePhase;
  transcript: string;
  responseText: string;
  onStart: () => Promise<void>;
  onStop: () => void;
  chromeVisible: boolean;
  typing: boolean;
}

const PHASE_LABELS: Record<VoicePhase, string> = {
  idle: '',
  connecting: 'Connecting...',
  listening: 'Listening',
  processing: 'Processing...',
  speaking: 'Manemus speaks',
};

const PHASE_COLORS: Record<VoicePhase, string> = {
  idle: '#71717a',
  connecting: '#f59e0b',
  listening: '#22c55e',
  processing: '#a78bfa',
  speaking: '#f59e0b',
};

export default function VoiceCallControls({
  isActive,
  phase,
  transcript,
  responseText,
  onStart,
  onStop,
  chromeVisible,
  typing,
}: VoiceCallControlsProps) {
  const phaseColor = PHASE_COLORS[phase];
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    setError(null);
    setStarting(true);
    try {
      await onStart();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[VoiceCall] Start failed:', msg);
      setError(msg);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[52] flex flex-col items-center gap-3 transition-opacity duration-500"
      style={{
        opacity: chromeVisible ? (typing ? 0.2 : 1) : 0.3,
        // Always keep pointer events — voice button should always be clickable
      }}
    >
      {/* Error message */}
      {error && (
        <div className="max-w-sm bg-red-900/80 backdrop-blur-sm border border-red-700 rounded-lg px-3 py-1.5 text-center">
          <p className="text-[10px] text-red-300 font-mono">{error}</p>
        </div>
      )}

      {/* Transcript / response text */}
      {isActive && (transcript || responseText) && (
        <div className="max-w-md bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-4 py-2 text-center">
          {transcript && (
            <p className="text-[11px] text-zinc-400 font-mono mb-1">
              {transcript}
            </p>
          )}
          {responseText && (
            <p className="text-[11px] text-amber-400/80 font-mono">
              {responseText}
            </p>
          )}
        </div>
      )}

      {/* Call button + phase indicator */}
      <div className="flex items-center gap-3">
        {/* Phase label */}
        {isActive && phase !== 'idle' && (
          <span
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color: phaseColor }}
          >
            {PHASE_LABELS[phase]}
          </span>
        )}

        {/* Talk button */}
        <button
          onClick={isActive ? onStop : handleStart}
          disabled={starting}
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            starting
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 animate-pulse'
              : isActive
                ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30 text-red-400'
                : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-400 hover:border-amber-500/50'
          }`}
          title={starting ? 'Connecting...' : isActive ? 'End call' : 'Start voice call'}
        >
          {isActive ? (
            // Stop icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          ) : (
            // Mic icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        {/* Pulsing indicator when listening */}
        {isActive && phase === 'listening' && (
          <div className="relative w-3 h-3">
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: `${phaseColor}40` }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: phaseColor }}
            />
          </div>
        )}

        {/* Spinning indicator when processing */}
        {isActive && phase === 'processing' && (
          <div
            className="w-3 h-3 border-2 rounded-full animate-spin"
            style={{ borderColor: `${phaseColor}30`, borderTopColor: phaseColor }}
          />
        )}
      </div>
    </div>
  );
}
