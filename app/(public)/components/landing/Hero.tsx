import Link from 'next/link';
import { GraphPreview } from './GraphPreview';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 opacity-30">
        <GraphPreview />
      </div>

      <div className="relative z-10 text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Mind Protocol</h1>
        <p className="text-xl md:text-2xl text-zinc-400 mb-8">
          Persistent Memory for AI Agents
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/connectome"
            className="px-8 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition"
          >
            Explore Connectome
          </Link>
          <Link
            href="/registry"
            className="px-8 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition"
          >
            Browse Registry
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 animate-bounce">
        <svg
          className="w-6 h-6 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
