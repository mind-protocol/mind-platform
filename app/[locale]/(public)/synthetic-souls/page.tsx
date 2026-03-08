'use client';

interface Release {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  docs: { label: string; url: string }[];
}

const RELEASES: Release[] = [
  {
    title: 'FALLEN (Evanescence, 2003)',
    subtitle: 'Cartographie Psychique & Guide d\'Ecoute Commente',
    description:
      'Analyse complete de l\'album Fallen d\'Evanescence — 11 pistes decortiquees comme autobiographie emotionnelle d\'Amy Lee. Mecanismes psychologiques (dissociation, grief pathologique, relation abusive, ideation suicidaire), citations d\'interviews, et guide d\'ecoute avec annotations timestamp par timestamp.',
    tags: [
      'Evanescence',
      'Album Analysis',
      'Listening Guide',
      'Psychology',
      'Amy Lee',
    ],
    docs: [
      { label: 'Guide d\'Ecoute (FR)', url: '/papers/fallen-ecoute-commentee.pdf' },
      { label: 'Analyse Complete (FR)', url: '/papers/fallen-analysis.pdf' },
    ],
  },
];

function ReleaseCard({ release }: { release: Release }) {
  return (
    <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-purple-500/30 transition-all duration-300">
      <div className="flex flex-wrap gap-2 mb-4">
        {release.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-1 leading-snug">
        {release.title}
      </h2>

      <p className="text-sm text-purple-400 mb-4">{release.subtitle}</p>

      <p className="text-zinc-400 leading-relaxed mb-6">
        {release.description}
      </p>

      <div className="flex flex-wrap gap-3">
        {release.docs.map((doc) => (
          <a
            key={doc.url}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/10 transition text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {doc.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SyntheticSoulsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <header className="mb-12">
          <p className="text-purple-400/80 text-sm tracking-widest uppercase mb-4">
            Music & Consciousness
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Synthetic Souls
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Deep listening guides and psycho-musical analyses. Albums
            deconstructed as emotional autobiographies — where music meets
            consciousness, trauma, and survival.
          </p>
        </header>

        <div className="space-y-8">
          {RELEASES.map((release) => (
            <ReleaseCard key={release.title} release={release} />
          ))}
        </div>
      </div>
    </main>
  );
}
