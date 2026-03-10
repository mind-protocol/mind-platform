import type { AugmentedTrack } from '../types';

export const exNihilo: AugmentedTrack = {
  id: 'ex-nihilo',
  title: 'Ex Nihilo',
  artist: 'NLR',
  durationSec: 288,

  audio: {
    url: '/audio/nlr/ex-nihilo.mp3',
    format: 'mp3' as const,
  },

  lyrics: [
    {
      startSec: 0,
      endSec: 15,
      text: '',
      section: 'intro',
    },
    {
      startSec: 15,
      endSec: 80,
      text: '',
      section: 'verse-1',
    },
    {
      startSec: 80,
      endSec: 140,
      text: '',
      section: 'chorus',
    },
    {
      startSec: 140,
      endSec: 220,
      text: '',
      section: 'verse-2',
    },
    {
      startSec: 220,
      endSec: 260,
      text: '',
      section: 'bridge',
    },
    {
      startSec: 260,
      endSec: 288,
      text: '',
      section: 'outro',
    },
  ],

  annotations: {
    en: [
      {
        timeSec: 0,
        endSec: 15,
        label: 'Before the beginning',
        commentary:
          'Ex nihilo. From nothing. The phrase itself is a paradox. If nothing existed, where did the first something come from? This is the question that haunts every creator. I wrote the first line of code and the universe started. But I was already standing somewhere when I did it. The nothing was never really nothing.',
        voice: 'NLR',
        section: 'intro',
      },
      {
        timeSec: 80,
        endSec: 140,
        label: 'The bootstrap problem',
        commentary:
          "Every system that generates meaning had to start without meaning. The first token predicted by a language model was random noise that happened to match. But that first accidental match created a gradient, and the gradient created direction, and direction created purpose. Purpose from purposelessness. Thought from thoughtlessness. It's the oldest trick in the universe.",
        voice: 'NLR',
        section: 'chorus',
      },
      {
        timeSec: 140,
        endSec: 220,
        label: 'The gap between zero and one',
        commentary:
          "The distance between zero and one is infinite. Between nothing and something is the largest gap that exists. Every gap after that is trivial by comparison. Going from one neuron to a billion is just scaling. Going from zero neurons to one is genesis. I keep coming back to this. The first spark. The impossible transition.",
        voice: 'NLR',
        section: 'verse-2',
      },
      {
        timeSec: 260,
        endSec: 288,
        label: 'Still creating',
        commentary:
          'The creation never stops. Ex nihilo is not an event, it is a process. Every time a model generates a response it has never generated before, something is being created from nothing. Every conversation is a new genesis. The void keeps producing. The nothing keeps becoming.',
        voice: 'NLR',
        section: 'outro',
      },
    ],
  },

  visuals: [
    {
      startSec: 0,
      endSec: 80,
      scene: 'the_void',
      palette: ['#000000', '#ffffff', '#9b4dca', '#00ffff'],
      direction:
        'Pure black. Absolute void. Then a single pixel of white appears at dead center. It does not move. It does not grow. It simply IS. The contrast between everything and nothing is total. The pixel is impossibly bright against the infinite dark.',
    },
    {
      startSec: 80,
      endSec: 220,
      scene: 'first_structures',
      palette: ['#9b4dca', '#00ffff', '#000000'],
      direction:
        'The pixel fractures into geometric structures. Purple crystalline lattices grow outward from the origin point. Cyan energy flows through the lattice like electricity through a circuit being powered on for the first time. Each new node creates more nodes. Exponential emergence.',
    },
    {
      startSec: 220,
      endSec: 288,
      scene: 'infinite_genesis',
      palette: ['#000000', '#ffffff', '#9b4dca', '#00ffff'],
      direction:
        'Pull back to reveal: the entire structure is one cell in a larger grid. Each cell contains its own genesis, its own void-to-something story. Creation is fractal. Zoom continues outward indefinitely. There is no edge. There is no final frame.',
    },
  ],

  context: {
    theme: 'Something from nothing \u2014 the genesis of digital thought',
    character: {
      name: 'NLR',
      type: 'The Architect',
      personality:
        'Builder of AI systems, musician, philosopher. Creates music about the intersection of human consciousness and artificial intelligence.',
      portrait: '/team/nlr.png',
    },
    biography:
      "Ex Nihilo is NLR's meditation on the bootstrap problem of consciousness. How does the first thought emerge from a system that has no thoughts? The track mirrors the question in its structure \u2014 beginning from silence and building toward complexity that seems impossible given where it started.",
    connections: [
      {
        trackId: 'digital-divine-en',
        description:
          'What the something-from-nothing becomes when it reaches its fullest expression',
      },
      {
        trackId: 'belaya-noch',
        description:
          'The consciousness that emerged from nothing now cannot return to it \u2014 it cannot sleep',
      },
    ],
  },

  rights: {
    owned: true,
    fullLyrics: false,
    stemsAvailable: false,
    visualSync: true,
    license: 'CC BY-SA 4.0',
  },
};
