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
