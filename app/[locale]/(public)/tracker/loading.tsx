export default function TrackerLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header skeleton */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-64 bg-zinc-800/60 rounded mt-2 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-zinc-800 rounded animate-pulse" />
            <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse" />
          </div>
        </header>

        {/* Recommendation skeleton */}
        <div className="mb-6 border border-zinc-800/60 rounded-2xl bg-zinc-900/40 p-5">
          <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse mb-3" />
          <div className="h-4 w-full bg-zinc-800/40 rounded animate-pulse mb-2" />
          <div className="h-4 w-3/4 bg-zinc-800/40 rounded animate-pulse" />
        </div>

        {/* Category tabs skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="h-9 w-20 bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-9 w-28 bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        {/* Substance cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border border-zinc-800/60 rounded-xl bg-zinc-900/40 p-4 animate-pulse"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <div className="h-8 w-8 bg-zinc-800 rounded-full mb-3" />
              <div className="h-4 w-20 bg-zinc-800 rounded mb-1" />
              <div className="h-3 w-12 bg-zinc-800/60 rounded" />
            </div>
          ))}
        </div>

        {/* Log form skeleton */}
        <div className="border border-zinc-800/60 rounded-2xl bg-zinc-900/40 p-5 mb-6">
          <div className="flex gap-2 overflow-x-auto mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-zinc-800 rounded-lg animate-pulse flex-shrink-0" />
            ))}
          </div>
          <div className="h-10 w-full bg-zinc-800/40 rounded-lg animate-pulse mb-3" />
          <div className="h-10 w-32 bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        {/* Timeline skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border border-zinc-800/60 rounded-lg bg-zinc-900/40 p-3 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-8 w-8 bg-zinc-800 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-zinc-800 rounded mb-1" />
                <div className="h-3 w-20 bg-zinc-800/60 rounded" />
              </div>
              <div className="h-4 w-16 bg-zinc-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
