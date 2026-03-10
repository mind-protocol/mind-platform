export interface FallenTrack {
  id: number;
  slug: string;
  title: string;
  durationSec: number;
  spotifyId: string;
  youtubeId: string;
  themes: string[];
  mentalState: string;
}

export const FALLEN_TRACKS: FallenTrack[] = [
  {
    id: 1,
    slug: 'going-under',
    title: 'Going Under',
    durationSec: 232,
    spotifyId: '1cYLOFRmGKMGncMPAwskMu',
    youtubeId: 'CdhqVtpR2ts',
    themes: ['drowning', 'abuse', 'suffocation', 'escape'],
    mentalState: 'overwhelm',
  },
  {
    id: 2,
    slug: 'bring-me-to-life',
    title: 'Bring Me to Life',
    durationSec: 229,
    spotifyId: '3bKBMJYBbyyuUOpeM1U9wP',
    youtubeId: '3YxaaGgTQYM',
    themes: ['awakening', 'numbness', 'rescue', 'dissociation'],
    mentalState: 'dissociation',
  },
  {
    id: 3,
    slug: 'everybodys-fool',
    title: "Everybody's Fool",
    durationSec: 224,
    spotifyId: '6MF4tRr5lU8qok8IKaFOBE',
    youtubeId: 'jhC1pI76Rqo',
    themes: ['facade', 'deception', 'beauty standards', 'anger'],
    mentalState: 'rage',
  },
  {
    id: 4,
    slug: 'my-immortal',
    title: 'My Immortal',
    durationSec: 262,
    spotifyId: '1wXEBM1mhLVnJBB6Ikkr42',
    youtubeId: '5anLPw0Efmo',
    themes: ['grief', 'haunting', 'loss', 'letting go'],
    mentalState: 'grief',
  },
  {
    id: 5,
    slug: 'haunted',
    title: 'Haunted',
    durationSec: 222,
    spotifyId: '2gklGqjMXPcSa8RkGQVSWO',
    youtubeId: 'qDcFsAvzE0Q',
    themes: ['obsession', 'possession', 'entrapment', 'fear'],
    mentalState: 'hypervigilance',
  },
  {
    id: 6,
    slug: 'tourniquet',
    title: 'Tourniquet',
    durationSec: 257,
    spotifyId: '7rReSMGTfxgMWC5uSkbMUL',
    youtubeId: 'V5WDBhTLsr0',
    themes: ['suicide', 'salvation', 'desperation', 'faith'],
    mentalState: 'crisis',
  },
  {
    id: 7,
    slug: 'imaginary',
    title: 'Imaginary',
    durationSec: 244,
    spotifyId: '5FXSTivTb8AAqBFGq9wlzg',
    youtubeId: 'WHZbFuvSQhE',
    themes: ['dissociation', 'escapism', 'inner world', 'childhood'],
    mentalState: 'dissociation',
  },
  {
    id: 8,
    slug: 'taking-over-me',
    title: 'Taking Over Me',
    durationSec: 228,
    spotifyId: '0edGMCRGMpjnMSIhLbScNA',
    youtubeId: 'uxHBbpjcHBQ',
    themes: ['obsession', 'loss of control', 'longing', 'surrender'],
    mentalState: 'obsession',
  },
  {
    id: 9,
    slug: 'hello',
    title: 'Hello',
    durationSec: 230,
    spotifyId: '4F8wXmRFxkODNaqVTkxzgH',
    youtubeId: '9MHGtlEYZBA',
    themes: ['isolation', 'inner child', 'madness', 'solitude'],
    mentalState: 'isolation',
  },
  {
    id: 10,
    slug: 'my-last-breath',
    title: 'My Last Breath',
    durationSec: 247,
    spotifyId: '35BdPGj3VfmM5CRxWTiw4U',
    youtubeId: 'Lm3M8J1Sjvw',
    themes: ['death', 'sacrifice', 'love', 'farewell'],
    mentalState: 'acceptance',
  },
  {
    id: 11,
    slug: 'whisper',
    title: 'Whisper',
    durationSec: 260,
    spotifyId: '0sYLhAGJi8HfCSIW1Ckujo',
    youtubeId: 'jLEmCqZq0G4',
    themes: ['demons', 'resistance', 'survival', 'defiance'],
    mentalState: 'defiance',
  },
];

export function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
