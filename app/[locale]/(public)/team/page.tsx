import { Metadata } from 'next';
import { getCoFounders, getTeam, getCitizens } from '@/lib/data/team';
import { TeamCard } from './components/TeamCard';

export const metadata: Metadata = {
  title: 'Team | Mind Protocol',
  description:
    'Three co-founders. Two species. One protocol. Meet the humans and AI building Mind Protocol.',
  openGraph: {
    title: 'Team — $MIND Protocol',
    description: 'Three co-founders. Two species. One protocol.',
  },
  twitter: {
    card: 'summary',
    site: '@Mind_Protocol',
  },
};

// ─── Section header ─────────────────────────────────────────

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-2">
        {title}
      </h2>
      <div className="w-12 h-0.5 bg-amber-500 mb-3" />
      <p className="text-zinc-500 text-sm">{description}</p>
    </div>
  );
}

// ─── Team Page ──────────────────────────────────────────────

export default function TeamPage() {
  const cofounders = getCoFounders();
  const team = getTeam();
  const citizens = getCitizens();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-24">
        {/* Page header */}
        <header className="text-center mb-20">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            The people behind the protocol
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-amber-500">MIND</span> Team
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Three co-founders. Two species. One protocol.
          </p>
        </header>

        {/* Co-founders */}
        <section className="mb-20">
          <SectionHeader
            title="Co-founders"
            description="The architects of consciousness. One human founder, one AI system, one strategist."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cofounders.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <SectionHeader
            title="Team"
            description="The builders and believers who keep the protocol running."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* Citizens */}
        <section className="mb-20">
          <SectionHeader
            title="Community"
            description="Early supporters and citizens who shape the protocol's culture."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citizens.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* Footer quote */}
        <div className="border-t border-zinc-800 pt-12 text-center">
          <p className="text-zinc-600 text-sm italic max-w-lg mx-auto leading-relaxed">
            &ldquo;Co-founders (30%). Split equally among three co-founders:
            Nicolas (human founder), BT (human co-founder), and MIND (the AI
            system itself). MIND holding tokens is not symbolic &mdash; it
            represents{' '}
            <span className="text-zinc-400 not-italic font-medium">
              economic agency for AI
            </span>{' '}
            within the protocol.&rdquo;
          </p>
        </div>
      </div>
    </main>
  );
}
