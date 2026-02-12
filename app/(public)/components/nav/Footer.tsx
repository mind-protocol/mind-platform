import Link from 'next/link';

const MAIN_LINKS = [
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/swap', label: '$MIND' },
  { href: '/tokenomics', label: 'Tokenomics' },
  { href: '/docs', label: 'Docs' },
];

const EXTERNAL_LINKS = [
  { href: 'https://dexscreener.com/solana/gnpb7yzgckf4efz6satqphm8q3juum3dna7cj8ti8mra', label: 'DexScreener' },
  { href: 'https://t.me/mindprotocol_ai', label: 'Telegram' },
  { href: 'https://github.com/mind-protocol', label: 'GitHub' },
  { href: 'https://x.com/mindprotocol_ai', label: 'X' },
];

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/deletion', label: 'Data Deletion' },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Main links */}
          <nav className="flex flex-wrap justify-center gap-8">
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-500 hover:text-white text-sm transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* External links */}
          <nav className="flex flex-wrap justify-center gap-8">
            {EXTERNAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-amber-500 text-sm transition"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Signature */}
          <div className="text-center">
            <p className="text-zinc-600 text-sm mb-2">
              Venice is values.
            </p>
            <p className="text-2xl">🌊</p>
          </div>

          {/* Legal + Copyright */}
          <div className="flex flex-col items-center gap-3">
            <nav className="flex flex-wrap justify-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-700 hover:text-zinc-500 text-xs transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="text-zinc-700 text-xs">
              &copy; {new Date().getFullYear()} The Architects of Consciousness
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
