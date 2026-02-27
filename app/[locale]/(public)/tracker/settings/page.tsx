'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/useSession';
import { useToast } from '@/components/Toast';
import { SUBSTANCE_CONFIG, SUBSTANCE_KEYS, type SubstanceKey } from '@/lib/tracker/constants';
import { useSubstanceConfig } from '@/lib/tracker/hooks/useSubstanceConfig';

// ─── Types ──────────────────────────────────────────────────────

interface LinkedAccounts {
  garmin: boolean;
  spotify: boolean;
  gmail: boolean;
}

// ─── Components ─────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-zinc-800/60 rounded-2xl bg-zinc-900/40 p-5 sm:p-6">
      <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-1">{title}</h3>
      {description && <p className="text-xs text-zinc-600 mb-4">{description}</p>}
      {!description && <div className="mb-4" />}
      {children}
    </section>
  );
}

function Toggle({
  label,
  sublabel,
  checked,
  onChange,
  color,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 cursor-pointer group">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-sm text-zinc-300 group-hover:text-white transition truncate">
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] text-zinc-600 font-mono shrink-0">{sublabel}</span>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
          checked ? (color || 'bg-blue-500') : 'bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
    </label>
  );
}

// ─── Main ───────────────────────────────────────────────────────

export default function SettingsPage() {
  const { session, loading: sessionLoading, logout } = useSession();
  const { toast } = useToast();
  const { visibleKeys, toggleSubstance, resetToDefaults } = useSubstanceConfig();

  const [linked, setLinked] = useState<LinkedAccounts>({ garmin: false, spotify: false, gmail: false });
  const [loadingLinked, setLoadingLinked] = useState(true);

  // Fetch linked account status
  useEffect(() => {
    async function fetchLinked() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          // Session is valid — check linked accounts
          const uid = encodeURIComponent(session?.user_id || '');
          const [garminRes, spotifyRes, gmailRes] = await Promise.allSettled([
            fetch(`/api/garmin/status?user_id=${uid}`),
            fetch('/api/spotify/status'),
            fetch(`/api/gmail/status?user_id=${uid}`),
          ]);
          setLinked({
            garmin: garminRes.status === 'fulfilled' && garminRes.value.ok,
            spotify: spotifyRes.status === 'fulfilled' && spotifyRes.value.ok,
            gmail: gmailRes.status === 'fulfilled' && gmailRes.value.ok,
          });
        }
      } catch {
        // silent
      } finally {
        setLoadingLinked(false);
      }
    }
    fetchLinked();
  }, []);

  const visibleSet = new Set(visibleKeys);

  // Group substances by category
  const bodyKeys = SUBSTANCE_KEYS.filter(
    (k) => !SUBSTANCE_CONFIG[k].hidden && !['thc', 'cbd', 'caffeine', 'ketamine', 'lsd', 'nicotine'].includes(k),
  );
  const substanceKeys = SUBSTANCE_KEYS.filter(
    (k) => ['thc', 'cbd', 'caffeine', 'ketamine', 'lsd', 'nicotine'].includes(k),
  );
  const hiddenKeys = SUBSTANCE_KEYS.filter((k) => SUBSTANCE_CONFIG[k].hidden);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/tracker"
              className="text-zinc-500 hover:text-white text-xs font-mono transition"
            >
              &larr; tracker
            </Link>
            <span className="text-zinc-700">/</span>
            <h1 className="text-xl font-bold font-mono">Settings</h1>
          </div>
          <p className="text-zinc-500 text-sm">
            Configure your tracker, manage linked accounts, and customize substances.
          </p>
        </header>

        <div className="space-y-6">
          {/* ── Account ── */}
          <Section title="Account">
            {sessionLoading ? (
              <div className="h-12 bg-zinc-800 rounded animate-pulse" />
            ) : session ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">{session.name}</div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {session.user_id} &middot; trust: {session.trust}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await logout();
                      toast('Logged out', 'info');
                    }}
                    className="text-xs px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Not logged in</span>
                <Link
                  href="/login"
                  className="text-xs px-3 py-1.5 rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition"
                >
                  Login
                </Link>
              </div>
            )}
          </Section>

          {/* ── Linked Accounts ── */}
          <Section
            title="Linked Accounts"
            description="Connect external services for biometric data and context."
          >
            {loadingLinked ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">&#x231A;</span>
                    <div>
                      <span className="text-sm text-zinc-300">Garmin</span>
                      <span className="block text-[10px] text-zinc-600 font-mono">
                        Heart rate, stress, sleep, body battery
                      </span>
                    </div>
                  </div>
                  {linked.garmin ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                      linked
                    </span>
                  ) : (
                    <Link
                      href="/link/garmin"
                      className="text-xs px-3 py-1.5 rounded border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition"
                    >
                      Link
                    </Link>
                  )}
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">&#x1F3B5;</span>
                    <div>
                      <span className="text-sm text-zinc-300">Spotify</span>
                      <span className="block text-[10px] text-zinc-600 font-mono">
                        Music context and mood detection
                      </span>
                    </div>
                  </div>
                  {linked.spotify ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                      linked
                    </span>
                  ) : (
                    <Link
                      href="/link/spotify"
                      className="text-xs px-3 py-1.5 rounded border border-green-500/30 text-green-400 hover:bg-green-500/10 transition"
                    >
                      Link
                    </Link>
                  )}
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">&#x2709;</span>
                    <div>
                      <span className="text-sm text-zinc-300">Gmail</span>
                      <span className="block text-[10px] text-zinc-600 font-mono">
                        Email context and notifications
                      </span>
                    </div>
                  </div>
                  {linked.gmail ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                      linked
                    </span>
                  ) : (
                    <Link
                      href="/link/gmail"
                      className="text-xs px-3 py-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                    >
                      Link
                    </Link>
                  )}
                </div>
              </div>
            )}
          </Section>

          {/* ── Visible Substances ── */}
          <Section
            title="Substances"
            description="Toggle which substances appear in your tracker. Hidden substances require explicit opt-in."
          >
            <div className="space-y-4">
              {/* Body / supplements */}
              <div>
                <h4 className="text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">
                  Body &amp; Supplements
                </h4>
                <div className="space-y-0.5">
                  {bodyKeys.map((k) => {
                    const cfg = SUBSTANCE_CONFIG[k];
                    return (
                      <Toggle
                        key={k}
                        label={`${cfg.icon} ${cfg.label}`}
                        sublabel={cfg.unit}
                        checked={visibleSet.has(k)}
                        onChange={() => toggleSubstance(k)}
                        color={`bg-[${cfg.color}]`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Recreational */}
              <div>
                <h4 className="text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">
                  Recreational
                </h4>
                <div className="space-y-0.5">
                  {substanceKeys.map((k) => {
                    const cfg = SUBSTANCE_CONFIG[k];
                    return (
                      <Toggle
                        key={k}
                        label={`${cfg.icon} ${cfg.label}`}
                        sublabel={cfg.unit}
                        checked={visibleSet.has(k)}
                        onChange={() => toggleSubstance(k)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Hidden / Controlled */}
              <div>
                <h4 className="text-xs font-mono text-amber-500/70 mb-2 uppercase tracking-wider">
                  Hidden (harm reduction)
                </h4>
                <p className="text-[10px] text-zinc-600 mb-2">
                  These substances are hidden by default. Enabling them is for harm reduction tracking only.
                </p>
                <div className="space-y-0.5">
                  {hiddenKeys.map((k) => {
                    const cfg = SUBSTANCE_CONFIG[k];
                    return (
                      <Toggle
                        key={k}
                        label={`${cfg.icon} ${cfg.label}`}
                        sublabel={cfg.danger === 'critical' ? 'CRITICAL' : cfg.danger}
                        checked={visibleSet.has(k)}
                        onChange={() => toggleSubstance(k)}
                      />
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  resetToDefaults();
                  toast('Reset to default substances', 'info');
                }}
                className="text-xs px-3 py-1.5 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition"
              >
                Reset to defaults
              </button>
            </div>
          </Section>

          {/* ── Health Profile ── */}
          <Section
            title="Health Profile"
            description="Your health sheet — identity, body, allergies, conditions, medications."
          >
            <Link
              href="/tracker/profile"
              className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 transition"
            >
              <span>{'📋'}</span>
              Fiche Santé
              <span className="text-zinc-600 text-xs font-mono">&rarr;</span>
            </Link>
          </Section>

          {/* ── Data ── */}
          <Section
            title="Data &amp; Privacy"
            description="Your data is stored locally on the Mind Protocol server. Nothing is shared without your consent."
          >
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Tracker logs</span>
                <span className="text-emerald-400">local + encrypted</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Biometric data</span>
                <span className="text-emerald-400">local only</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Chat history</span>
                <span className="text-emerald-400">local + encrypted</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Food photos</span>
                <span className="text-emerald-400">local only</span>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-zinc-800/30 text-center">
          <p className="text-xs text-zinc-600 font-mono">
            Mind Protocol &mdash; sovereignty begins with knowing your own data
          </p>
        </footer>
      </div>
    </main>
  );
}
