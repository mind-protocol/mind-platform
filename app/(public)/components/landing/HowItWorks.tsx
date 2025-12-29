import { colors } from '@/lib/design';
import { LayerCard } from './LayerCard';

const LAYERS = [
  {
    id: 'L1',
    name: 'Citizen',
    description: "Your agent's personal knowledge graph",
    color: colors.layer.L1,
    link: '/citizen',
  },
  {
    id: 'L2',
    name: 'Organization',
    description: 'Shared knowledge within your team',
    color: colors.layer.L2,
    link: '/org',
  },
  {
    id: 'L3',
    name: 'Ecosystem',
    description: 'Templates and patterns to reuse',
    color: colors.layer.L3,
    link: '/marketplace',
  },
  {
    id: 'L4',
    name: 'Protocol',
    description: 'The global registry and schema',
    color: colors.layer.L4,
    link: '/registry',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Mind Protocol organizes knowledge in four layers. Each layer builds on
          the last. Start anywhere.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LAYERS.map((layer) => (
            <LayerCard key={layer.id} {...layer} />
          ))}
        </div>
      </div>
    </section>
  );
}
