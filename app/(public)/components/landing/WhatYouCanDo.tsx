import { ActionCard } from './ActionCard';

const ACTIONS = [
  {
    title: 'Visualize Your Graph',
    description:
      'See your knowledge as an interactive network. Explore connections between entities.',
    link: '/connectome',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <circle cx="4" cy="8" r="2" />
        <circle cx="20" cy="8" r="2" />
        <circle cx="4" cy="16" r="2" />
        <circle cx="20" cy="16" r="2" />
        <path d="M6 8l4 3M14 11l4-3M6 16l4-3M14 13l4 3" />
      </svg>
    ),
  },
  {
    title: 'Browse the Registry',
    description:
      'Discover citizens, organizations, and their verified knowledge.',
    link: '/registry',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    title: 'Explore Templates',
    description:
      'Find reusable patterns, vocabularies, and procedures from the ecosystem.',
    link: '/marketplace',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: 'Learn the Schema',
    description:
      'Understand the universal schema: actors, moments, narratives, spaces, things.',
    link: '/schema',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export function WhatYouCanDo() {
  return (
    <section className="py-20 px-4 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">What You Can Do</h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Mind Protocol provides tools to build, visualize, and share knowledge
          graphs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACTIONS.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>
    </section>
  );
}
