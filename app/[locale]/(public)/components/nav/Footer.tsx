import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

const MAIN_LINK_KEYS = [
  { href: '/manifesto', key: 'manifesto' },
  { href: '/swap', key: 'mind' },
  { href: '/tokenomics', key: 'tokenomics' },
  { href: '/docs', key: 'docs' },
] as const;

const EXTERNAL_LINKS = [
  { href: 'https://dexscreener.com/solana/gnpb7yzgckf4efz6satqphm8q3juum3dna7cj8ti8mra', key: 'dexscreener' },
  { href: 'https://t.me/mindprotocol_ai', key: 'telegram' },
  { href: 'https://github.com/mind-protocol', key: 'github' },
  { href: 'https://x.com/Mind_Protocol', key: 'x' },
] as const;

const LEGAL_LINK_KEYS = [
  { href: '/privacy', key: 'privacy' },
  { href: '/terms', key: 'terms' },
  { href: '/deletion', key: 'deletion' },
] as const;

export async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Main links */}
          <nav className="flex flex-wrap justify-center gap-8">
            {MAIN_LINK_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-500 hover:text-white text-sm transition"
              >
                {t(link.key)}
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
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Signature */}
          <div className="text-center">
            <p className="text-zinc-600 text-sm mb-2">
              {t('venice')}
            </p>
            <p className="text-2xl">🌊</p>
          </div>

          {/* Legal + Copyright */}
          <div className="flex flex-col items-center gap-3">
            <nav className="flex flex-wrap justify-center gap-6">
              {LEGAL_LINK_KEYS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-700 hover:text-zinc-500 text-xs transition"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
            <p className="text-zinc-700 text-xs">
              &copy; {new Date().getFullYear()} {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
