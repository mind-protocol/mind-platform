'use client';

import { useState, useRef, useCallback } from 'react';
import { formatDuration, type FallenTrack } from '@/lib/fallen/data/tracks';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5];

interface PlaybackBarProps {
  track: FallenTrack;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  playbackSpeed: number;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onSpeedChange: (speed: number) => void;
}

export default function PlaybackBar({
  track,
  isPlaying,
  currentTime,
  volume,
  playbackSpeed,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onSpeedChange,
}: PlaybackBarProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const progress =
    track.durationSec > 0 ? (currentTime / track.durationSec) * 100 : 0;

  const handleSeekClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!seekBarRef.current) return;
      const rect = seekBarRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeek(Math.round(pct * track.durationSec));
    },
    [track.durationSec, onSeek],
  );

  return (
    <div className="flex-shrink-0 border-t border-fallen-border bg-fallen-surface/80 backdrop-blur-sm">
      {/* Seek bar (full width, thin) */}
      <div
        ref={seekBarRef}
        onClick={handleSeekClick}
        className="w-full h-1.5 bg-fallen-border cursor-pointer group relative"
      >
        <div
          className="h-full bg-fallen-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
        {/* Hover thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-fallen-accent opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 gap-4">
        {/* Left: track info */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink">
          <div className="min-w-0">
            <p
              className="text-sm text-fallen-text truncate font-semibold"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {track.title}
            </p>
            <p className="text-[10px] text-fallen-muted">Evanescence</p>
          </div>
        </div>

        {/* Center: playback controls */}
        <div className="flex items-center gap-3">
          {/* Previous */}
          <button
            onClick={onPrev}
            className="text-fallen-muted hover:text-fallen-text transition p-1"
            title="Previous track"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-fallen-accent hover:bg-fallen-highlight transition flex items-center justify-center text-fallen-bg"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="text-fallen-muted hover:text-fallen-text transition p-1"
            title="Next track"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          {/* Time display */}
          <span className="text-[11px] font-mono text-fallen-muted ml-2 hidden sm:inline">
            {formatDuration(currentTime)} / {formatDuration(track.durationSec)}
          </span>
        </div>

        {/* Right: volume, speed, source */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Speed selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="text-[11px] font-mono text-fallen-muted hover:text-fallen-text transition px-1.5 py-0.5 rounded border border-fallen-border hover:border-fallen-accent/30"
            >
              {playbackSpeed}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full mb-1 right-0 bg-fallen-surface border border-fallen-border rounded-lg py-1 min-w-[60px] z-10">
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      onSpeedChange(speed);
                      setShowSpeedMenu(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 text-xs font-mono transition ${
                      playbackSpeed === speed
                        ? 'text-fallen-accent bg-fallen-accent/10'
                        : 'text-fallen-muted hover:text-fallen-text hover:bg-fallen-bg'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => onVolumeChange(volume > 0 ? 0 : 80)}
              className="text-fallen-muted hover:text-fallen-text transition"
              title={volume > 0 ? 'Mute' : 'Unmute'}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {volume === 0 ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                ) : volume < 50 ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </>
                )}
              </svg>
            </button>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-20 h-1 bg-fallen-border rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fallen-accent
                [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-fallen-accent
                [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Source indicator */}
          <div className="flex items-center gap-1.5 hidden lg:flex">
            {/* Spotify icon */}
            <a
              href={`https://open.spotify.com/track/${track.spotifyId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fallen-muted hover:text-[#1DB954] transition"
              title="Open in Spotify"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381C8.64 5.801 15.6 6.001 20.1 8.82c.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.44.3z" />
              </svg>
            </a>
            {/* YouTube icon */}
            <a
              href={`https://www.youtube.com/watch?v=${track.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fallen-muted hover:text-[#FF0000] transition"
              title="Watch on YouTube"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
