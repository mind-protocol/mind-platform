import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const GraphView = dynamic(
  () => import('./components/GraphView'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Knowledge Graph | Mind Protocol',
  description: 'Explore the Mind Protocol knowledge graph — concepts, principles, realizations and their connections.',
};

export default function GraphPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-zinc-950 flex flex-col">
      <GraphView />
    </div>
  );
}
