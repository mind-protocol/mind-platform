// DOCS: docs/schema-explorer/IMPLEMENTATION_Schema_Explorer.md
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schema Explorer | Mind Protocol',
  description: 'Explore the fixed MIND universal schema and node/link semantics.',
};

const nodeTypes = [
  { key: 'actor', description: 'People, agents, and identity-bearing entities.' },
  { key: 'moment', description: 'Events, observations, and temporal markers.' },
  { key: 'narrative', description: 'Stories, goals, tasks, and intent arcs.' },
  { key: 'space', description: 'Containers and bounded contexts for meaning.' },
  { key: 'thing', description: 'Artifacts, assets, and concrete objects.' },
];

export default function SchemaExplorerPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400/80">Protocol</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Schema Explorer</h1>
          <p className="mt-4 max-w-2xl text-zinc-400">
            The MIND schema is fixed: five node types, one link type, with meaning carried through content,
            synthesis, and typed relationships.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-xl font-semibold">Node types</h2>
          <ul className="mt-4 space-y-3">
            {nodeTypes.map((node) => (
              <li key={node.key} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
                <p className="font-mono text-sm text-amber-300">{node.key}</p>
                <p className="mt-1 text-sm text-zinc-300">{node.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-xl font-semibold">Links and semantics</h2>
          <p className="mt-3 text-sm text-zinc-300">
            All relationships use the <span className="font-mono">link</span> type. Semantic meaning is encoded in
            properties (for example: <span className="font-mono">type</span>, weight, provenance), not in many custom
            edge labels.
          </p>
        </section>
      </div>
    </main>
  );
}
