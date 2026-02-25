import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-mono font-bold text-zinc-700 mb-4">404</div>
        <h2 className="text-xl font-bold font-mono mb-2">Page not found</h2>
        <p className="text-sm text-zinc-500 mb-8 font-mono leading-relaxed">
          This page doesn&apos;t exist yet &mdash; or it moved somewhere else.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-mono hover:bg-blue-500/20 transition"
          >
            Go home
          </Link>
          <Link
            href="/tracker"
            className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono hover:bg-zinc-700 transition"
          >
            Body Tracker
          </Link>
        </div>
      </div>
    </main>
  );
}
