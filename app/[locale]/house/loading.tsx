export default function HouseLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Top bar skeleton */}
      <header className="border-b border-zinc-800/50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
          <span className="text-zinc-700">/</span>
          <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse" />
      </header>

      {/* Hero skeleton */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="h-10 w-64 bg-zinc-800 rounded animate-pulse mb-3" />
        <div className="h-4 w-96 max-w-full bg-zinc-800/60 rounded animate-pulse mb-2" />
        <div className="h-4 w-80 max-w-full bg-zinc-800/40 rounded animate-pulse" />
      </section>

      {/* Grid skeleton */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-zinc-800/60 rounded-2xl bg-zinc-900/40 p-5 sm:p-6 animate-pulse"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-zinc-800 rounded" />
                <div className="h-3 w-24 bg-zinc-800 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-8 w-16 bg-zinc-800 rounded" />
                <div className="h-3 w-full bg-zinc-800/60 rounded" />
                <div className="h-3 w-3/4 bg-zinc-800/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
