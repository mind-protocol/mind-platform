export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded" />
          <div className="h-4 w-72 bg-zinc-800/60 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="h-12 w-12 bg-zinc-800 rounded-full mb-3" />
                <div className="h-4 w-32 bg-zinc-800 rounded mb-2" />
                <div className="h-3 w-24 bg-zinc-800/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
