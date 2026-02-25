'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const POLL_INTERVAL_MS = 10_000; // Poll every 10s

export interface MusicState {
  isPlaying: boolean;
  trackId: string;
  track: string;
  artist: string;
  album: string;
  albumArt: string;
  albumArtSmall: string;
  progressMs: number;
  durationMs: number;
  trackUrl: string;
  // Audio features
  energy: number;
  valence: number;
  tempo: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  loudness: number;
  key: number;
  mode: number;
  // Lyrics
  lyrics: string | null;
  lyricsSource: string | null;
  lyricsSynced: boolean;
}

const EMPTY_STATE: MusicState = {
  isPlaying: false,
  trackId: '',
  track: '',
  artist: '',
  album: '',
  albumArt: '',
  albumArtSmall: '',
  progressMs: 0,
  durationMs: 0,
  trackUrl: '',
  energy: 0,
  valence: 0,
  tempo: 0,
  danceability: 0,
  acousticness: 0,
  instrumentalness: 0,
  loudness: 0,
  key: -1,
  mode: -1,
  lyrics: null,
  lyricsSource: null,
  lyricsSynced: false,
};

export function useSpotifyNowPlaying(): {
  musicState: MusicState;
  musicStateRef: React.RefObject<MusicState>;
  loading: boolean;
} {
  const [musicState, setMusicState] = useState<MusicState>(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const musicStateRef = useRef<MusicState>(EMPTY_STATE);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch('/api/spotify/now-playing');
      if (!res.ok) return;

      const data = await res.json();

      const state: MusicState = {
        isPlaying: data.is_playing || false,
        trackId: data.track_id || '',
        track: data.track || '',
        artist: data.artist || '',
        album: data.album || '',
        albumArt: data.album_art || '',
        albumArtSmall: data.album_art_small || '',
        progressMs: data.progress_ms || 0,
        durationMs: data.duration_ms || 0,
        trackUrl: data.track_url || '',
        // Audio features
        energy: data.audio_features?.energy || 0,
        valence: data.audio_features?.valence || 0,
        tempo: data.audio_features?.tempo || 0,
        danceability: data.audio_features?.danceability || 0,
        acousticness: data.audio_features?.acousticness || 0,
        instrumentalness: data.audio_features?.instrumentalness || 0,
        loudness: data.audio_features?.loudness || 0,
        key: data.audio_features?.key ?? -1,
        mode: data.audio_features?.mode ?? -1,
        // Lyrics
        lyrics: data.lyrics || null,
        lyricsSource: data.lyrics_source || null,
        lyricsSynced: data.lyrics_synced || false,
      };

      musicStateRef.current = state;
      setMusicState(state);
    } catch {
      // Silent fail — keep last known state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNowPlaying();
    const id = setInterval(fetchNowPlaying, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchNowPlaying]);

  return { musicState, musicStateRef, loading };
}
