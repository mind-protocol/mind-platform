'use client';

import { formatDuration, type FallenTrack } from '@/lib/fallen/data/tracks';

interface TrackSelectorProps {
  tracks: FallenTrack[];
  activeTrack: FallenTrack;
  isPlaying: boolean;
  onSelect: (track: FallenTrack) => void;
}

export default function TrackSelector({
  tracks,
  activeTrack,
  isPlaying,
  onSelect,
}: TrackSelectorProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <div className="p-3">
        <p className="text-[10px] uppercase tracking-wider text-fallen-muted mb-2 px-1">
          Tracklist
        </p>
        <ul className="space-y-0.5">
          {tracks.map((track) => {
            const isActive = track.id === activeTrack.id;
            return (
              <li key={track.id}>
                <button
                  onClick={() => onSelect(track)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center gap-3 ${
                    isActive
                      ? 'bg-fallen-accent/10 border border-fallen-accent/20'
                      : 'hover:bg-fallen-surface border border-transparent'
                  }`}
                  style={
                    isActive
                      ? {
                          boxShadow: '0 0 12px rgba(74, 122, 181, 0.15)',
                        }
                      : undefined
                  }
                >
                  {/* Track number or playing indicator */}
                  <span className="w-5 text-right flex-shrink-0">
                    {isActive && isPlaying ? (
                      <span className="inline-flex items-center gap-[2px]">
                        <span className="w-[3px] h-3 bg-fallen-accent rounded-full animate-pulse" />
                        <span
                          className="w-[3px] h-2 bg-fallen-accent rounded-full animate-pulse"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-[3px] h-3.5 bg-fallen-accent rounded-full animate-pulse"
                          style={{ animationDelay: '300ms' }}
                        />
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-mono ${
                          isActive ? 'text-fallen-accent' : 'text-fallen-muted'
                        }`}
                      >
                        {track.id}
                      </span>
                    )}
                  </span>

                  {/* Title */}
                  <span
                    className={`flex-1 text-sm truncate ${
                      isActive
                        ? 'text-fallen-accent font-semibold'
                        : 'text-fallen-text group-hover:text-white'
                    }`}
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    {track.title}
                  </span>

                  {/* Duration */}
                  <span
                    className={`text-xs font-mono flex-shrink-0 ${
                      isActive ? 'text-fallen-accent/70' : 'text-fallen-muted'
                    }`}
                  >
                    {formatDuration(track.durationSec)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
