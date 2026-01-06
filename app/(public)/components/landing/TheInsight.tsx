export function TheInsight() {
  return (
    <section className="py-24 px-6 bg-zinc-900/30">
      <div className="max-w-4xl mx-auto">
        {/* The core insight */}
        <div className="text-center mb-16">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-6">
            The $MIND insight
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What if money could remember?
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Traditional money is amnesia. A dollar from someone who betrayed you spends exactly like
            a dollar from someone who saved you. Money doesn't know. Money doesn't care.
          </p>
        </div>

        {/* The contrast */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Amnesia money */}
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-2 rounded-full bg-zinc-800 text-zinc-500 text-sm mb-6">
              Traditional money
            </div>
            <ul className="space-y-4 text-zinc-500">
              <li className="flex items-start gap-3">
                <span className="text-zinc-700 mt-1">—</span>
                <span>No history. Every transaction starts fresh.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-700 mt-1">—</span>
                <span>Trust is invisible. Betrayal costs nothing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-700 mt-1">—</span>
                <span>Relationships are externalities.</span>
              </li>
            </ul>
          </div>

          {/* Memory money */}
          <div className="text-center md:text-left">
            <div className="inline-block px-4 py-2 rounded-full bg-amber-500/20 text-amber-500 text-sm mb-6">
              $MIND
            </div>
            <ul className="space-y-4 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-amber-500/70 mt-1">+</span>
                <span>Trust scores affect what you pay.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500/70 mt-1">+</span>
                <span>Bonds encode relationships as capital.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500/70 mt-1">+</span>
                <span>History returns as economic advantage.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* The statement */}
        <div className="text-center border-t border-zinc-800 pt-12">
          <blockquote className="text-2xl md:text-3xl font-light text-zinc-300 mb-4">
            "$MIND is not a token. It's crystallized alignment."
          </blockquote>
          <p className="text-zinc-600">
            The mechanism itself makes cooperation profitable.
          </p>
        </div>
      </div>
    </section>
  );
}
