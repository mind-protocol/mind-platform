'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ONBOARDING_KEY = 'mind_onboarding_dismissed';

interface Props {
  userName?: string;
}

export default function WelcomeOnboarding({ userName }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if never dismissed AND no existing data (truly new user)
    if (typeof window !== 'undefined' && !localStorage.getItem(ONBOARDING_KEY)) {
      fetch('/api/tracker/log?days=1')
        .then((r) => r.json())
        .then((d) => {
          // If user already has entries, auto-dismiss
          if (d.entries && d.entries.length > 0) {
            localStorage.setItem(ONBOARDING_KEY, 'true');
          } else {
            setVisible(true);
          }
        })
        .catch(() => setVisible(true));
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 border border-amber-500/20 rounded-xl p-6 relative overflow-hidden">
      {/* Dismiss button */}
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-400 transition"
        aria-label="Dismiss"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Content */}
      <div className="max-w-xl">
        <h2 className="text-xl font-bold mb-2">
          {userName ? `Bienvenue, ${userName}.` : 'Bienvenue.'}
        </h2>
        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
          Le Body Tracker suit vos substances, nourriture, sensations et biométrie en temps réel.
          Voici comment commencer :
        </p>

        <div className="grid gap-3 sm:grid-cols-3 mb-5">
          {/* Step 1 */}
          <div className="flex gap-3 items-start p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
            <span className="text-amber-500 font-bold font-mono text-sm mt-0.5">1</span>
            <div>
              <div className="text-sm font-medium text-zinc-200">Connecter Garmin</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Fréquence cardiaque, stress, sommeil, body battery en direct.
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3 items-start p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
            <span className="text-amber-500 font-bold font-mono text-sm mt-0.5">2</span>
            <div>
              <div className="text-sm font-medium text-zinc-200">Logger vos prises</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Cliquez sur une substance pour enregistrer une dose. La timeline apparaît en bas.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3 items-start p-3 rounded-lg bg-zinc-800/40 border border-zinc-800">
            <span className="text-amber-500 font-bold font-mono text-sm mt-0.5">3</span>
            <div>
              <div className="text-sm font-medium text-zinc-200">Observer les corrélations</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Le graphique montre vos biométriques + prises superposées. Patterns visibles en 48h.
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Link
            href="/tracker/settings"
            className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition"
          >
            Connecter Garmin
          </Link>
          <button
            onClick={dismiss}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            Commencer sans Garmin
          </button>
        </div>
      </div>
    </div>
  );
}
