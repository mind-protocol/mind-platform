import Link from 'next/link';

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm text-zinc-400 hover:text-white transition">
          mind protocol
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/blog"
            className="text-zinc-500 hover:text-white transition"
          >
            Research
          </Link>
          <Link
            href="/manifesto"
            className="text-zinc-500 hover:text-white transition"
          >
            Manifesto
          </Link>
          <Link
            href="/connectome"
            className="text-zinc-500 hover:text-white transition"
          >
            Connectome
          </Link>
        </div>
      </div>
    </nav>
  );
}
