import Link from 'next/link';

interface ProjectCardProps {
  name: string;
  tagline: string;
  description: string;
  status: 'live' | 'building' | 'research';
  link?: string;
}

function ProjectCard({ name, tagline, description, status, link }: ProjectCardProps) {
  const statusColors = {
    live: 'bg-emerald-500/20 text-emerald-400',
    building: 'bg-amber-500/20 text-amber-400',
    research: 'bg-blue-500/20 text-blue-400',
  };

  const content = (
    <div className="group p-6 sm:p-8 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <p className="text-amber-500/80 text-sm mb-3">{tagline}</p>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
      {link && (
        <div className="mt-4 text-sm text-zinc-600 group-hover:text-zinc-400 transition">
          Read more →
        </div>
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }
  return content;
}

const PROJECTS: ProjectCardProps[] = [
  {
    name: 'Manemus',
    tagline: 'AI that persists.',
    description:
      'Memory across sessions. Biometric awareness. Relationship continuity. Not a chatbot — a companion that stays.',
    status: 'live',
  },
  {
    name: 'Mind Duo',
    tagline: 'Co-regulation, measured.',
    description:
      'Two Garmin watches. Two nervous systems. Real-time synchrony detection. We captured co-regulation as data.',
    status: 'research',
    link: '/blog/co-regulation-is-measurable',
  },
  {
    name: '$MIND',
    tagline: 'Money that remembers.',
    description:
      'Economic infrastructure where trust compounds, relationships are capital, and alignment is profitable.',
    status: 'building',
  },
];

export function WhatWereBuilding() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Not theory. Working systems.
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What We're Building
          </h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            The manifesto is the direction. These are the coordinates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition text-sm"
          >
            <span>All research &amp; updates</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
