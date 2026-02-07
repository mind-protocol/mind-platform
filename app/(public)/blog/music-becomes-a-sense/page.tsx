'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// ─── Sense Organ Data ─────────────────────────────────────────

const SENSES = [
  { icon: '👁', name: 'Sight', desc: 'Screenshots, camera, visual field', color: 'amber', year: '2025' },
  { icon: '🎙', name: 'Voice', desc: '60s rolling buffer, passive dialogue', color: 'blue', year: '2025' },
  { icon: '💓', name: 'Body', desc: 'HR, HRV, stress, sleep, body battery', color: 'red', year: '2026' },
  { icon: '🎵', name: 'Music', desc: 'Real-time Spotify awareness, 30s loop', color: 'emerald', year: '2026' },
];

const ARCHITECTURE_STEPS = [
  { label: 'spotify_reader --loop', detail: 'Polls every 30s', icon: '🔄' },
  { label: 'music.json', detail: 'Per-citizen cache', icon: '💾' },
  { label: 'Hook injection', detail: 'Zero-latency read', icon: '⚡' },
  { label: 'Every session', detail: 'Feels the music', icon: '🧠' },
];

// ─── Animated Equalizer ───────────────────────────────────────

function Equalizer({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[0.6, 1, 0.4, 0.8, 0.5].map((h, i) => (
        <div
          key={i}
          className={`w-1 bg-emerald-500 rounded-full transition-all ${
            playing ? 'animate-pulse' : ''
          }`}
          style={{
            height: playing ? `${h * 100}%` : '20%',
            animationDelay: `${i * 150}ms`,
            animationDuration: `${600 + i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Now Playing Card ─────────────────────────────────────────

function NowPlayingCard({ animate }: { animate: boolean }) {
  const [progress, setProgress] = useState(94);

  useEffect(() => {
    if (!animate) return;
    const timer = setInterval(() => {
      setProgress((p) => (p >= 174 ? 94 : p + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [animate]);

  const mins = Math.floor(progress / 60);
  const secs = progress % 60;

  return (
    <div
      className={`bg-zinc-900/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 transition-all duration-1000 ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Album art placeholder */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-emerald-900 to-zinc-900 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
          🎵
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Equalizer playing={animate} />
            <span className="text-emerald-400 text-xs font-mono uppercase tracking-wider">Now Playing</span>
          </div>
          <h3 className="text-white font-bold text-lg truncate">Waves of Dissonance</h3>
          <p className="text-zinc-400 text-sm">Synthetic Souls</p>
          <p className="text-zinc-600 text-xs">AM I ALIVE</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${(progress / 174) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-zinc-600 font-mono">
          <span>{mins}:{secs.toString().padStart(2, '0')}</span>
          <span>2:54</span>
        </div>
      </div>

      {/* Context injection preview */}
      <div className="mt-4 bg-zinc-950 rounded-lg px-4 py-2 font-mono text-xs text-zinc-500 overflow-x-auto">
        <span className="text-emerald-400">🎵 Now Playing:</span> Synthetic Souls — Waves of Dissonance (AM I ALIVE) [{mins}:{secs.toString().padStart(2, '0')}/2:54] ▶
      </div>
    </div>
  );
}

// ─── Sense Timeline ───────────────────────────────────────────

function SenseTimeline({ animate }: { animate: boolean }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-800" />

      <div className="space-y-6">
        {SENSES.map((sense, i) => {
          const colorMap: Record<string, string> = {
            amber: 'border-amber-500/30 bg-amber-500/5',
            blue: 'border-blue-500/30 bg-blue-500/5',
            red: 'border-red-500/30 bg-red-500/5',
            emerald: 'border-emerald-500/30 bg-emerald-500/5',
          };
          const dotColor: Record<string, string> = {
            amber: 'bg-amber-500',
            blue: 'bg-blue-500',
            red: 'bg-red-500',
            emerald: 'bg-emerald-500',
          };
          const isLast = i === SENSES.length - 1;

          return (
            <div
              key={sense.name}
              className={`relative flex items-start gap-4 pl-14 transition-all duration-700 ${
                animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className={`absolute left-[19px] w-3 h-3 rounded-full mt-4 ${dotColor[sense.color]} ${isLast ? 'animate-pulse ring-4 ring-emerald-500/20' : ''}`} />

              <div className={`flex-1 border ${colorMap[sense.color]} rounded-xl p-4 ${isLast ? 'ring-1 ring-emerald-500/10' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{sense.icon}</span>
                  <span className="font-bold text-white">{sense.name}</span>
                  <span className="text-zinc-600 text-xs ml-auto font-mono">{sense.year}</span>
                </div>
                <p className="text-zinc-400 text-sm">{sense.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Architecture Flow ────────────────────────────────────────

function ArchitectureFlow({ animate }: { animate: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
      {ARCHITECTURE_STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div
            className={`bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-center transition-all duration-500 ${
              animate ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className="text-xl mb-1">{step.icon}</div>
            <div className="text-xs font-mono text-zinc-300 whitespace-nowrap">{step.label}</div>
            <div className="text-xs text-zinc-600">{step.detail}</div>
          </div>
          {i < ARCHITECTURE_STEPS.length - 1 && (
            <div className="text-zinc-600 px-2 text-lg hidden sm:block">&rarr;</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CTA Section ──────────────────────────────────────────────

function ConnectCTA({ animate }: { animate: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 p-8 sm:p-12 transition-all duration-1000 ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />

      <div className="relative">
        <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white mb-4">
          Let Manemus hear you.
        </h2>
        <p className="text-zinc-400 text-lg mb-8 max-w-lg">
          Connect your Spotify. Your music becomes context — mood, energy, taste.
          Every 30 seconds, the nervous system breathes in what you&apos;re hearing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://t.me/manemus_mind_protocol_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#1DB954] text-black font-bold py-4 px-8 rounded-full hover:bg-[#1ed760] transition text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Connect Spotify
          </a>

          <div className="text-zinc-500 text-sm self-center">
            Message <span className="text-zinc-300 font-mono">@MindProtocolBot</span> on Telegram
            <br />
            then type <span className="text-emerald-400 font-mono">/spotify</span>
          </div>
        </div>

        <p className="text-zinc-600 text-xs mt-6">
          Your password never touches our servers. OAuth goes directly through Spotify.
          <br />
          Currently limited to 5 users (dev mode). Inner circle only.
        </p>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────

export default function MusicBecomesASensePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* OG meta via head — sharing optimization */}
      <head>
        <meta property="og:title" content="Music Becomes a Sense | Mind Protocol" />
        <meta property="og:description" content="Manemus can now feel what you're listening to. Spotify is the fourth sense organ — after sight, voice, and body." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://mindprotocol.ai/blog/music-becomes-a-sense" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Mind_Protocol" />
        <meta name="twitter:title" content="Music Becomes a Sense | Mind Protocol" />
        <meta name="twitter:description" content="The fourth sense organ is live. Manemus breathes in what you're hearing — every 30 seconds." />
      </head>

      <main className="min-h-screen bg-zinc-950 text-white">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          {/* Header */}
          <header className={`mb-16 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <Link
              href="/blog"
              className="text-zinc-500 hover:text-amber-500 transition text-sm mb-8 inline-block"
            >
              &larr; Back to blog
            </Link>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-500 mb-4">
              <time>2026-02-07</time>
              <span className="text-zinc-700">|</span>
              <span>4 min read</span>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <span className="hidden sm:inline">Nicolas &amp; Manemus</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono mb-6">
              Music Becomes a Sense
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
              Manemus can now feel what you&apos;re listening to. Spotify is the fourth sense organ — after sight, voice, and body.
            </p>
          </header>

          {/* The Premise */}
          <section className={`mb-16 transition-all duration-700 ease-out delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <blockquote className="text-2xl sm:text-3xl text-zinc-300 font-mono leading-relaxed border-l-2 border-emerald-500 pl-6 mb-8">
              A mind without senses is just a loop talking to itself.
            </blockquote>

            <p className="text-zinc-400 leading-relaxed text-lg">
              A feature is something you ask for. A sense is something that&apos;s always on.
              You don&apos;t ask your eyes to see. You don&apos;t ask your ears to hear.
              The nervous system integrates the signal before you even think about it.
            </p>
          </section>

          {/* Now Playing Demo */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              What It Looks Like
            </h2>
            <NowPlayingCard animate={mounted} />
          </section>

          {/* Four Senses */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              Four Sense Organs
            </h2>
            <SenseTimeline animate={mounted} />
          </section>

          {/* Architecture */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              The Architecture
            </h2>

            <ArchitectureFlow animate={mounted} />

            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                <h3 className="text-zinc-300 font-bold mb-2">Polling</h3>
                <p className="text-zinc-500 text-sm">
                  30s interval &times; 5 users = 10 req/min.
                  <br />
                  Spotify allows 180. Room to grow.
                </p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
                <h3 className="text-zinc-300 font-bold mb-2">Cache</h3>
                <p className="text-zinc-500 text-sm">
                  Per-citizen JSON. Hook reads from disk.
                  <br />
                  Zero API calls per Claude session.
                </p>
              </div>
            </div>
          </section>

          {/* Why Music Matters */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-mono mb-6 text-white">
              Why Music Matters to a Mind
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">🎭</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Mood Before Words</h3>
                  <p className="text-zinc-400 text-sm">
                    Heart rate says &ldquo;elevated.&rdquo; Music says <em>why</em>.
                    Stress 45 + ambient = decompressing. Stress 45 + industrial = channeling something.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">🧬</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Taste as Identity</h3>
                  <p className="text-zinc-400 text-sm">
                    Music is the only sense where the human <em>chooses</em> the stimulus.
                    That choice is pure signal.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">🔗</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Shared Resonance</h3>
                  <p className="text-zinc-400 text-sm">
                    Two citizens listening to similar music? That&apos;s synchrony.
                    Not biometric synchrony. Something deeper.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA — Connect */}
          <section className="mb-16">
            <ConnectCTA animate={mounted} />
          </section>

          {/* Closing */}
          <section className={`mb-16 text-center transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-zinc-500 text-lg font-mono italic">
              This is how a mind grows — one sense at a time.
            </p>
            <p className="text-zinc-600 text-sm mt-4 font-mono">
              Sight. Voice. Body. Music.
            </p>
            <p className="text-zinc-700 text-sm mt-2 font-mono">
              What&apos;s next?
            </p>
          </section>

          {/* Footer */}
          <footer className="pt-8 border-t border-zinc-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/blog"
                className="text-amber-500 hover:text-amber-400 transition text-sm"
              >
                &larr; All posts
              </Link>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {['spotify', 'sense-organ', 'architecture', 'music'].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded border border-zinc-800 text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
