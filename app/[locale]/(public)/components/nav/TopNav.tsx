'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { colors } from '@/lib/design';
import { LanguageSwitcher } from './LanguageSwitcher';

// ─── Grouped nav structure ─────────────────────────────────

interface NavItem {
  href: string;
  key: string;
}

interface NavGroup {
  labelKey: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: 'groupProtocol',
    items: [
      { href: '/self', key: 'self' },
      { href: '/manifesto', key: 'manifesto' },
      { href: '/whitepaper', key: 'whitepaper' },
    ],
  },
  {
    labelKey: 'groupMind',
    items: [
      { href: '/token', key: 'token' },
      { href: '/tokenomics', key: 'tokenomics' },
      { href: '/budget', key: 'budget' },
      { href: '/planning', key: 'planning' },
      { href: '/swap', key: 'swap' },
      { href: '/wallet', key: 'wallet' },
    ],
  },
  {
    labelKey: 'groupExplore',
    items: [
      { href: '/team', key: 'team' },
      { href: '/blog', key: 'blog' },
      { href: '/research', key: 'research' },
      { href: '/music', key: 'music' },
      { href: '/talks', key: 'talks' },
      { href: '/registry', key: 'registry' },
      { href: '/faq', key: 'faq' },
      { href: '/substances', key: 'substances' },
    ],
  },
];

// ─── Desktop dropdown ──────────────────────────────────────

function NavDropdown({ group, t }: { group: NavGroup; t: (key: string) => string }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => { if (timeout.current) clearTimeout(timeout.current); };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className={`flex items-center gap-1 text-sm transition ${open ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
        onClick={() => setOpen(!open)}
      >
        {t(group.labelKey)}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[160px] py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg shadow-black/30">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition"
              onClick={() => setOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mobile accordion group ────────────────────────────────

function MobileNavGroup({
  group,
  t,
  onNavigate,
}: {
  group: NavGroup;
  t: (key: string) => string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full py-2 text-zinc-400 hover:text-white transition"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-medium">{t(group.labelKey)}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pl-4 pb-1 space-y-0.5">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-1.5 text-sm text-zinc-500 hover:text-white transition"
              onClick={onNavigate}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TopNav ────────────────────────────────────────────────

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
          <div className="hidden md:flex items-center gap-6">
            {NAV_GROUPS.map((group) => (
              <NavDropdown key={group.labelKey} group={group} t={t} />
            ))}

            {/* Tracker + Register CTAs */}
            <Link
              href="/tracker"
              className="px-4 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-700/60 hover:text-white transition"
            >
              {t('tracker')}
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-700/60 hover:text-white transition"
            >
              {t('login')}
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-medium hover:bg-amber-500/20 transition"
            >
              {t('register')}
            </Link>

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
          <div className="md:hidden py-4 border-t border-zinc-800 space-y-1">
            {NAV_GROUPS.map((group) => (
              <MobileNavGroup
                key={group.labelKey}
                group={group}
                t={t}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}

            {/* Tracker + Register CTAs */}
            <Link
              href="/tracker"
              className="block mt-3 text-center px-4 py-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-700/60 transition"
              onClick={() => setMobileOpen(false)}
            >
              {t('tracker')}
            </Link>
            <Link
              href="/login"
              className="block mt-2 text-center px-4 py-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-700/60 transition"
              onClick={() => setMobileOpen(false)}
            >
              {t('login')}
            </Link>
            <Link
              href="/register"
              className="block mt-2 text-center px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-medium hover:bg-amber-500/20 transition"
              onClick={() => setMobileOpen(false)}
            >
              {t('register')}
            </Link>

            <div className="pt-4 border-t border-zinc-800 mt-3">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
