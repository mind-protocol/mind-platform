export interface AugmentedTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  durationSec: number;
  spotifyId?: string;
  youtubeId?: string;

  audio: {
    url: string;
    format: 'mp3' | 'wav' | 'ogg';
    stems?: {
      vocals?: string;
      drums?: string;
      bass?: string;
      other?: string;
    };
  };

  lyrics: {
    startSec: number;
    endSec: number;
    text: string;
    section: string;
    words?: { text: string; startSec: number; endSec: number }[];
  }[];

  annotations: Record<string, {
    timeSec: number;
    endSec?: number;
    label: string;
    commentary: string;
    voice?: string;
    section?: string;
  }[]>;

  visuals?: {
    startSec: number;
    endSec: number;
    scene: string;
    palette: string[];
    direction: string;
  }[];

  /** 3D visual assets (depth-displaced images/video from pipeline) */
  depthVisuals?: {
    /** Path to manifest.json, e.g. "/visuals/synthetic-souls/binary-lullaby/manifest.json" */
    manifestUrl: string;
    /** Position in tunnel: 'background' | 'floating' | 'ceiling' */
    placement: 'background' | 'floating' | 'ceiling';
    /** Scale in world units (default 4) */
    scale?: number;
    /** Opacity 0-1 (default 0.6) */
    opacity?: number;
  };

  context: {
    theme: string;
    character?: {
      name: string;
      type: string;
      personality: string;
      portrait?: string;
    };
    biography?: string;
    connections?: { trackId: string; description: string }[];
  };

  rights: {
    owned: boolean;
    fullLyrics: boolean;
    stemsAvailable: boolean;
    visualSync: boolean;
    license: string;
  };
}
