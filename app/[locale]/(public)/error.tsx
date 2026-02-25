'use client';

import { useEffect } from 'react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[public] Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">&#x26A0;&#xFE0F;</div>
        <h2 className="text-xl font-bold font-mono mb-2">Something went wrong</h2>
        <p className="text-sm text-zinc-500 mb-6 font-mono leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-mono hover:bg-blue-500/20 transition"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono hover:bg-zinc-700 transition"
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
