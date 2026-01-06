import Link from 'next/link';

const LINKS = [
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/docs', label: 'Docs' },
  { href: 'https://github.com/mind-protocol', label: 'GitHub' },
  { href: 'https://twitter.com/mindprotocol', label: 'Twitter' },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-500 hover:text-white text-sm transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Signature */}
          <div className="text-center">
            <p className="text-zinc-600 text-sm mb-2">
              Venice is values.
            </p>
            <p className="text-2xl">🌊</p>
          </div>

          {/* Copyright */}
          <p className="text-zinc-700 text-xs">
            &copy; {new Date().getFullYear()} The Architects of Consciousness
          </p>
        </div>
      </div>
    </footer>
  );
}
