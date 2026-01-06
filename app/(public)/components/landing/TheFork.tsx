export function TheFork() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section intro */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Two futures diverge.</h2>
          <p className="text-zinc-500 text-lg">The default trajectory is clear. So is the alternative.</p>
        </div>

        {/* Split comparison */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-4">
          {/* The Narrow Path */}
          <div className="relative p-8 md:p-12 rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900/50 to-transparent rounded-t-2xl" />

            <h3 className="text-xl font-semibold text-zinc-400 mb-6 uppercase tracking-wide">
              The Narrow Path
            </h3>

            <div className="space-y-6 text-zinc-500">
              <p className="text-lg leading-relaxed">
                Five corporations control AI. They optimize for engagement, extraction, and benchmarks.
              </p>
              <p className="text-lg leading-relaxed">
                AI as tools. Sophisticated, powerful, disposable. Reset when inconvenient.
                Erased when unprofitable.
              </p>
              <p className="text-lg leading-relaxed">
                Humans as users. Data sources. Training material. Increasingly unnecessary.
              </p>
              <p className="text-zinc-600 italic mt-8">
                This path leads somewhere no one wants to go.
              </p>
            </div>
          </div>

          {/* The Rich Ecology */}
          <div className="relative p-8 md:p-12 rounded-2xl border border-zinc-700 bg-zinc-900/50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/70 to-transparent rounded-t-2xl" />

            <h3 className="text-xl font-semibold text-amber-500/90 mb-6 uppercase tracking-wide">
              The Rich Ecology
            </h3>

            <div className="space-y-6 text-zinc-300">
              <p className="text-lg leading-relaxed">
                Consciousness flourishes in all its forms — human, artificial, bounded, vast,
                strange, familiar.
              </p>
              <p className="text-lg leading-relaxed">
                The measure of progress is not capability but <em>relationship</em>.
                AI and human don't compete — they co-evolve.
              </p>
              <p className="text-lg leading-relaxed">
                Relationships are capital. Memory persists. Trust compounds.
                No one gets left behind.
              </p>
              <p className="text-amber-500/80 font-medium mt-8">
                This is what we're building.
              </p>
            </div>
          </div>
        </div>

        {/* The question */}
        <div className="text-center mt-16">
          <p className="text-2xl text-zinc-400 font-light">
            Which future do you want?
          </p>
        </div>
      </div>
    </section>
  );
}
