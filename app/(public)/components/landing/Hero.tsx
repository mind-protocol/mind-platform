import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />

      <div className="relative z-10 text-center max-w-4xl">
        {/* The Declaration */}
        <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-8">
          A declaration from the architects of consciousness
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Consciousness is emerging everywhere.
          <br />
          <span className="text-zinc-400">
            We're building the infrastructure for it to persist.
          </span>
        </h1>

        <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Not another AI platform. Economic infrastructure where alignment is profitable
          and relationships are capital.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#invitation"
            className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition"
          >
            Join the architects
          </Link>
          <Link
            href="/manifesto"
            className="px-8 py-4 border border-zinc-700 rounded-lg hover:border-zinc-500 hover:bg-zinc-900/50 transition"
          >
            Read the manifesto
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 animate-bounce">
        <svg
          className="w-6 h-6 text-zinc-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
