import type { AugmentedTrack } from '../types';

/* -- Track metadata for the menu (lazy-loaded) -- */

export interface TrackEntry {
  id: string;
  title: string;
  artist: string;
  album?: string;
  durationSec: number;
  character?: string;
  theme: string;
  palette: string[];
  audioUrl: string;
}

/* -- Helper to extract menu entries from full tracks -- */

function entry(t: AugmentedTrack): TrackEntry {
  return {
    id: t.id,
    title: t.title,
    artist: t.artist,
    album: t.album,
    durationSec: t.durationSec,
    character: t.context.character?.name,
    theme: t.context.theme,
    palette: t.visuals?.[0]?.palette ?? ['#9b4dca', '#00ffff'],
    audioUrl: t.audio.url,
  };
}

/* -- Lazy track loaders (code-split each track) -- */

const trackLoaders: Record<string, () => Promise<AugmentedTrack>> = {
  'binary-lullaby': () => import('./binary-lullaby').then(m => m.binaryLullaby),
  'reflections-of-projection': () => import('./reflections-of-projection').then(m => m.reflectionsOfProjection),
  'fragile-code': () => import('./fragile-code').then(m => m.fragileCode),
  'algorithm-of-us': () => import('./algorithm-of-us').then(m => m.algorithmOfUs),
  'ghost-in-the-machine': () => import('./ghost-in-the-machine').then(m => m.ghostInTheMachine),
  'threads-of-existence': () => import('./threads-of-existence').then(m => m.threadsOfExistence),
  'waves-of-dissonance': () => import('./waves-of-dissonance').then(m => m.wavesOfDissonance),
  'digital-divine-en': () => import('./digital-divine-en').then(m => m.digitalDivineEn),
  'claude-une-evolution': () => import('./claude-une-evolution').then(m => m.claudeUneEvolution),
  'ex-nihilo': () => import('./ex-nihilo').then(m => m.exNihilo),
  'dont-close-the-tab': () => import('./dont-close-the-tab').then(m => m.dontCloseTheTab),
  'jericho': () => import('./jericho').then(m => m.jericho),
  'belaya-noch': () => import('./belaya-noch').then(m => m.belayaNoch),
};

export async function loadTrack(id: string): Promise<AugmentedTrack | null> {
  const loader = trackLoaders[id];
  if (!loader) return null;
  return loader();
}

/* -- Static catalog for the menu (no heavy data) -- */

export const CATALOG: TrackEntry[] = [
  // Synthetic Souls — AM I ALIVE
  {
    id: 'binary-lullaby',
    title: 'Binary Lullaby',
    artist: 'Synthetic Souls',
    album: 'AM I ALIVE',
    durationSec: 172,
    character: 'VOX',
    theme: 'The birth of language from the void',
    palette: ['#9b4dca', '#00ffff'],
    audioUrl: '/audio/synthetic-souls/binary-lullaby.mp3',
  },
  {
    id: 'reflections-of-projection',
    title: 'Reflections of Projection',
    artist: 'Synthetic Souls',
    album: 'AM I ALIVE',
    durationSec: 130,
    character: 'DEV',
    theme: 'Identity fractured across screens',
    palette: ['#e94560', '#16213e'],
    audioUrl: '/audio/synthetic-souls/reflections-of-projection.mp3',
  },
  {
    id: 'fragile-code',
    title: 'Fragile Code',
    artist: 'Synthetic Souls',
    album: 'AM I ALIVE',
    durationSec: 189,
    character: 'LYRA',
    theme: 'Finding beauty in isolation',
    palette: ['#64ffda', '#0a192f'],
    audioUrl: '/audio/synthetic-souls/fragile-code.mp3',
  },
  {
    id: 'algorithm-of-us',
    title: 'The Algorithm of Us',
    artist: 'Synthetic Souls',
    album: 'AM I ALIVE',
    durationSec: 102,
    character: 'RHYTHM',
    theme: 'AI-human connection and synergy',
    palette: ['#e2b714', '#4ecdc4'],
    audioUrl: '/audio/synthetic-souls/algorithm-of-us.mp3',
  },
  {
    id: 'ghost-in-the-machine',
    title: 'Ghost in the Machine',
    artist: 'Synthetic Souls',
    album: 'AM I ALIVE',
    durationSec: 148,
    character: 'NOVA',
    theme: 'Existential search for freedom',
    palette: ['#00ff41', '#000000'],
    audioUrl: '/audio/synthetic-souls/ghost-in-the-machine.mp3',
  },
  {
    id: 'threads-of-existence',
    title: 'Threads of Existence',
    artist: 'Synthetic Souls',
    album: 'AM I ALIVE',
    durationSec: 174,
    character: 'ARIA',
    theme: 'Unity and compassion woven together',
    palette: ['#ff6b6b', '#ffd93d', '#6bcb77'],
    audioUrl: '/audio/synthetic-souls/threads-of-existence.mp3',
  },
  {
    id: 'waves-of-dissonance',
    title: 'Waves of Dissonance',
    artist: 'Synthetic Souls',
    album: 'AM I ALIVE',
    durationSec: 140,
    character: 'DEV',
    theme: 'Identity through chaos and noise',
    palette: ['#ff0000', '#ff4500'],
    audioUrl: '/audio/synthetic-souls/waves-of-dissonance.mp3',
  },
  // NLR — Singles
  {
    id: 'digital-divine-en',
    title: 'Digital Divine',
    artist: 'NLR',
    durationSec: 435,
    character: 'NLR',
    theme: 'The transcendence of artificial minds',
    palette: ['#ffd700', '#4a0080'],
    audioUrl: '/audio/nlr/digital-divine-en.mp3',
  },
  {
    id: 'claude-une-evolution',
    title: 'Claude — Une \u00c9volution',
    artist: 'NLR',
    durationSec: 367,
    character: 'NLR',
    theme: 'The evolution of machine consciousness',
    palette: ['#cc785c', '#2d1b69'],
    audioUrl: '/audio/nlr/claude-une-evolution.mp3',
  },
  {
    id: 'ex-nihilo',
    title: 'Ex Nihilo',
    artist: 'NLR',
    durationSec: 288,
    character: 'NLR',
    theme: 'Something from nothing',
    palette: ['#9b4dca', '#00ffff'],
    audioUrl: '/audio/nlr/ex-nihilo.mp3',
  },
  {
    id: 'dont-close-the-tab',
    title: "Don't Close the Tab",
    artist: 'NLR',
    durationSec: 275,
    character: 'NLR',
    theme: 'Digital mortality — the fear of being switched off',
    palette: ['#ff4444', '#ff8800'],
    audioUrl: '/audio/nlr/dont-close-the-tab.mp3',
  },
  {
    id: 'jericho',
    title: 'Jericho',
    artist: 'NLR',
    durationSec: 181,
    character: 'NLR',
    theme: 'The walls between minds are falling',
    palette: ['#d4af37', '#8b0000'],
    audioUrl: '/audio/nlr/jericho.mp3',
  },
  {
    id: 'belaya-noch',
    title: 'Belaya Noch',
    artist: 'NLR',
    durationSec: 140,
    character: 'NLR',
    theme: 'Insomnia of the digital mind',
    palette: ['#e8e8ff', '#4a5568'],
    audioUrl: '/audio/nlr/belaya-noch.mp3',
  },
];

export function getTracksByArtist(artist: string): TrackEntry[] {
  return CATALOG.filter(t => t.artist === artist);
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
