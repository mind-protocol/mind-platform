'use client';

import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/app/[locale]/(public)/components/nav/LanguageSwitcher';

export default function FallenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-fallen-bg text-fallen-text overflow-hidden">
      {/* Minimal immersive header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/synthetic-souls"
            className="text-fallen-muted hover:text-fallen-highlight transition text-sm flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </Link>
          <h1
            className="text-sm tracking-[0.3em] uppercase font-semibold text-fallen-accent"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            FALLEN
          </h1>
        </div>
        <LanguageSwitcher />
      </header>
      {children}
    </div>
  );
}
