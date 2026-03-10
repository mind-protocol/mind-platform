'use client';

import { useState } from 'react';
import { FALLEN_TRACKS, type FallenTrack } from '@/lib/fallen/data/tracks';
import TrackSelector from './TrackSelector';
import PlaybackBar from './PlaybackBar';
import InterpretationPanel from './InterpretationPanel';
import LyricsPanel from './LyricsPanel';
import ContextSidebar from './ContextSidebar';

type MobileTab = 'tracks' | 'context' | 'interpretation';

export default function FallenExperience() {
  const [activeTrack, setActiveTrack] = useState<FallenTrack>(FALLEN_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [mobileTab, setMobileTab] = useState<MobileTab>('tracks');

  const handlePrevTrack = () => {
    const idx = FALLEN_TRACKS.findIndex((t) => t.id === activeTrack.id);
    if (idx > 0) {
      setActiveTrack(FALLEN_TRACKS[idx - 1]);
      setCurrentTime(0);
    }
  };

  const handleNextTrack = () => {
    const idx = FALLEN_TRACKS.findIndex((t) => t.id === activeTrack.id);
    if (idx < FALLEN_TRACKS.length - 1) {
      setActiveTrack(FALLEN_TRACKS[idx + 1]);
      setCurrentTime(0);
    }
  };

  return (
    <div className="w-full h-full pt-12 flex flex-col">
      {/* ── Desktop layout ── */}
      <div className="hidden md:flex flex-1 min-h-0">
        {/* Left sidebar */}
        <aside className="w-[280px] flex-shrink-0 border-r border-fallen-border flex flex-col">
          <TrackSelector
            tracks={FALLEN_TRACKS}
            activeTrack={activeTrack}
            isPlaying={isPlaying}
            onSelect={(track) => {
              setActiveTrack(track);
              setCurrentTime(0);
            }}
          />
          {/* Context sidebar */}
          <div className="flex-1 border-t border-fallen-border p-4 overflow-y-auto">
            <ContextSidebar trackSlug={activeTrack.slug} />
          </div>
        </aside>

        {/* Center: visualization + lyrics */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Tunnel visualization placeholder */}
          <div className="flex-[6] relative bg-fallen-bg flex items-center justify-center border-b border-fallen-border">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto rounded-full border border-fallen-border/50 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, #4a7ab5 0%, transparent 70%)',
                  }}
                />
                <p
                  className="text-2xl text-fallen-accent font-semibold relative z-10"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {activeTrack.title}
                </p>
              </div>
              <p className="text-fallen-muted text-xs mt-4 tracking-wider uppercase">
                Tunnel Visualization
              </p>
            </div>
          </div>

          {/* Lyrics panel */}
          <div className="flex-[4] overflow-hidden">
            <LyricsPanel
              trackSlug={activeTrack.slug}
              currentTimeSec={currentTime}
              locale="en"
            />
          </div>
        </main>

        {/* Right sidebar: interpretation */}
        <aside className="w-[320px] flex-shrink-0 border-l border-fallen-border p-4 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-fallen-muted mb-3">
            Interpretation
          </p>
          <InterpretationPanel
            trackSlug={activeTrack.slug}
            currentTimeSec={currentTime}
            locale="en"
          />
        </aside>
      </div>

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden flex-1 flex-col min-h-0">
        {/* Tab bar */}
        <div className="flex border-b border-fallen-border">
          {(
            [
              { key: 'tracks', label: 'Tracks' },
              { key: 'context', label: 'Context' },
              { key: 'interpretation', label: 'Analysis' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className={`flex-1 py-2.5 text-xs uppercase tracking-wider transition ${
                mobileTab === tab.key
                  ? 'text-fallen-accent border-b-2 border-fallen-accent'
                  : 'text-fallen-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile content area */}
        <div className="flex-1 overflow-y-auto">
          {mobileTab === 'tracks' && (
            <div className="flex flex-col h-full">
              {/* Mini visualization */}
              <div className="h-40 flex items-center justify-center border-b border-fallen-border relative">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, #4a7ab5 0%, transparent 70%)',
                  }}
                />
                <p
                  className="text-xl text-fallen-accent font-semibold relative z-10"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {activeTrack.title}
                </p>
              </div>
              <TrackSelector
                tracks={FALLEN_TRACKS}
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                onSelect={(track) => {
                  setActiveTrack(track);
                  setCurrentTime(0);
                }}
              />
            </div>
          )}

          {mobileTab === 'context' && (
            <div className="p-4">
              <ContextSidebar trackSlug={activeTrack.slug} />
              <div className="mt-6 h-64">
                <p className="text-[10px] uppercase tracking-wider text-fallen-muted mb-3">
                  Lyrics
                </p>
                <LyricsPanel
                  trackSlug={activeTrack.slug}
                  currentTimeSec={currentTime}
                  locale="en"
                />
              </div>
            </div>
          )}

          {mobileTab === 'interpretation' && (
            <div className="p-4 flex flex-col h-full">
              <InterpretationPanel
                trackSlug={activeTrack.slug}
                currentTimeSec={currentTime}
                locale="en"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom playback bar */}
      <PlaybackBar
        track={activeTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        volume={volume}
        playbackSpeed={playbackSpeed}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onSeek={setCurrentTime}
        onVolumeChange={setVolume}
        onSpeedChange={setPlaybackSpeed}
      />
    </div>
  );
}
