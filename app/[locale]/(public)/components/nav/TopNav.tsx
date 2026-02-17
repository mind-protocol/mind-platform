'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { colors } from '@/lib/design';
import { LanguageSwitcher } from './LanguageSwitcher';

const NAV_KEYS = [
  { href: '/self', key: 'self' },
  { href: '/blog', key: 'blog' },
  { href: '/tokenomics', key: 'tokenomics' },
  { href: '/whitepaper', key: 'whitepaper' },
  { href: '/register', key: 'register' },
  { href: '/connectome', key: 'connectome' },
  { href: '/house', key: 'house' },
  { href: '/registry', key: 'registry' },
  { href: '/wallet', key: 'wallet' },
  { href: '/org', key: 'org' },
  { href: '/actif', key: 'actif' },
] as const;

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('Nav');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-xl font-bold"
              style={{ color: colors.accent.primary }}
            >
              {t('mind')}
            </span>
            <span className="text-xl font-bold text-white">{t('protocol')}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-400 hover:text-white transition"
              >
                {t(link.key)}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label={t('toggleMenu')}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-zinc-400 hover:text-white transition"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </Link>
            ))}
            <div className="pt-4 border-t border-zinc-800 mt-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
