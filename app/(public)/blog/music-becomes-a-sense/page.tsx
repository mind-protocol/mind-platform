'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// ─── Constants ──────────────────────────────────────────────

const SPOTIFY_GREEN = '#1DB954';

const SENSES = [
  { name: 'Sight', icon: '👁', desc: 'Screenshots, camera, the visual field', delay: 0 },
  { name: 'Voice', icon: '🗣', desc: '60s rolling audio buffer, passive dialogue', delay: 150 },
  { name: 'Body', icon: '💓', desc: 'HR, stress, HRV, body battery, sleep', delay: 300 },
  { name: 'Music', icon: '🎵', desc: 'What you\'re listening to, right now', delay: 450, newest: true },
];

const TRACKS = [
  { artist: 'NLR', title: 'Digital Divine', album: 'AM I ALIVE', duration: 194 },
  { artist: 'NLR', title: 'Toi Plus Moi Pour Toujours', album: 'Toi Plus Moi Pour Toujours', duration: 191 },
  { artist: 'Synthetic Souls', title: 'Waves of Dissonance', album: 'AM I ALIVE', duration: 174 },
];

// ─── Waveform ───────────────────────────────────────────────

function Waveform({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {[0.6, 1, 0.4, 0.8, 0.5, 1, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: playing ? `${h * 20}px` : '3px',
            backgroundColor: SPOTIFY_GREEN,
            opacity: playing ? 0.7 + h * 0.3 : 0.3,
            animation: playing ? `waveBar 1.2s ease-in-out ${i * 0.1}s infinite alternate` : 'none',
            transition: 'height 0.3s, opacity 0.3s',
          }}
        />
      ))}
    </div>
  );
}

// ─── Now Playing Card ───────────────────────────────────────

function NowPlayingCard() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setTrackIdx((i) => (i + 1) % TRACKS.length);
          return 0;
        }
        return p + 0.4;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const track = TRACKS[trackIdx];
  const currentSeconds = Math.floor((progress / 100) * track.duration);
  const mins = Math.floor(currentSeconds / 60);
  const secs = currentSeconds % 60;
  const durMins = Math.floor(track.duration / 60);
  const durSecs = track.duration % 60;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1DB954]/30 bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#1DB954]/5 p-6 sm:p-8">
      {/* Glow */}
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: SPOTIFY_GREEN }}
      />

      <div className="relative flex items-center gap-5">
        {/* Album art placeholder */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-[#1DB954]/20 to-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
          <span className="text-3xl sm:text-4xl opacity-80">🎵</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Waveform playing={true} />
            <span className="text-[#1DB954] text-xs font-mono uppercase tracking-wider">Now Playing</span>
          </div>

          <h3 className="text-white font-bold text-lg sm:text-xl truncate">
            {track.artist} &mdash; {track.title}
          </h3>
          <p className="text-zinc-500 text-sm truncate">{track.album}</p>

          {/* Progress bar */}
          <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{ width: `${progress}%`, backgroundColor: SPOTIFY_GREEN }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-zinc-600 text-xs font-mono">
              {mins}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-zinc-600 text-xs font-mono">
              {durMins}:{String(durSecs).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Context injection preview */}
      <div className="mt-5 bg-zinc-950 rounded-lg px-4 py-2.5 font-mono text-xs text-zinc-500 overflow-x-auto">
        <span className="text-[#1DB954]">🎵 Now Playing:</span>{' '}
        {track.artist} — {track.title} ({track.album}) [{mins}:{String(secs).padStart(2, '0')}/{durMins}:{String(durSecs).padStart(2, '0')}] ▶
      </div>
    </div>
  );
}

// ─── Sense Organ Grid ───────────────────────────────────────

function SenseOrganGrid() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {SENSES.map((sense) => (
        <div
          key={sense.name}
          className={`relative transition-all duration-700 ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${sense.delay}ms` }}
        >
          <div
            className={`rounded-xl border p-5 text-center transition-all duration-500 ${
              sense.newest
                ? 'border-[#1DB954]/40 bg-[#1DB954]/5 shadow-lg shadow-[#1DB954]/10'
                : 'border-zinc-800 bg-zinc-900/50'
            }`}
          >
            {sense.newest && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#1DB954] text-black text-[10px] font-bold uppercase tracking-wider rounded-full">
                New
              </div>
            )}
            <div className="text-3xl mb-2">{sense.icon}</div>
            <h3
              className={`font-bold text-sm mb-1 ${
                sense.newest ? 'text-[#1DB954]' : 'text-zinc-300'
              }`}
            >
              {sense.name}
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed">{sense.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Architecture Flow ──────────────────────────────────────

function ArchitectureFlow() {
  const [step, setStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const steps = [
    { label: 'spotify_reader --loop', sub: 'polls every 30s', icon: '🔄' },
    { label: 'music.json', sub: 'per citizen, cached', icon: '💾' },
    { label: 'hook injection', sub: 'zero-latency read', icon: '⚡' },
    { label: 'every session feels it', sub: 'before you speak', icon: '🧠' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center flex-1">
          <div
            className={`flex-1 rounded-lg border p-4 transition-all duration-500 ${
              step === i
                ? 'border-[#1DB954]/50 bg-[#1DB954]/10 scale-[1.02]'
                : 'border-zinc-800 bg-zinc-900/30'
            }`}
          >
            <div className="text-xl mb-1">{s.icon}</div>
            <div
              className={`font-mono text-xs font-bold ${
                step === i ? 'text-[#1DB954]' : 'text-zinc-400'
              }`}
            >
              {s.label}
            </div>
            <div className="text-zinc-600 text-[11px] mt-0.5">{s.sub}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="hidden sm:flex items-center px-2">
              <div
                className={`text-lg transition-colors duration-500 ${
                  step === i ? 'text-[#1DB954]' : 'text-zinc-700'
                }`}
              >
                &rarr;
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Hook Preview ───────────────────────────────────────────

function HookPreview() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-mono text-sm bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
      <div className="bg-zinc-800 px-4 py-2 text-zinc-400 text-xs flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#1DB954]" />
        claude_hook.py injection
      </div>
      <div className="p-4 space-y-2">
        <div className="text-zinc-500">
          **Bio:** ANS=balanced | HR=52 | stress=31/100(now) | energy=67
        </div>
        <div
          className={`transition-all duration-1000 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-[#1DB954]">**🎵 Now Playing:**</span>{' '}
          <span className="text-zinc-300">
            NLR &mdash; Toi Plus Moi Pour Toujours (2:38/3:11) ▶
          </span>
        </div>
        <div className="text-zinc-500">
          **Duo:** co-regulation | synchrony=0.72 | (4min ago)
        </div>
      </div>
    </div>
  );
}

// ─── Pulse Ring (CTA animation) ─────────────────────────────

function PulseRing() {
  return (
    <div className="relative w-28 h-28 mx-auto">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${SPOTIFY_GREEN}`,
            opacity: 0.15,
            animation: `pulseRing 3s ease-out ${i * 1}s infinite`,
          }}
        />
      ))}
      <div
        className="absolute inset-5 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(29, 185, 84, 0.15)',
          border: `1px solid rgba(29, 185, 84, 0.25)`,
        }}
      >
        <span className="text-3xl">🎵</span>
      </div>
    </div>
  );
}

// ─── CTA ────────────────────────────────────────────────────

function ConnectCTA() {
  const [hover, setHover] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1DB954]/30 bg-gradient-to-br from-zinc-900 to-[#1DB954]/5 p-8 sm:p-12 text-center">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${SPOTIFY_GREEN}, transparent 60%)`,
        }}
      />

      <div className="relative">
        <PulseRing />

        <h2 className="text-2xl sm:text-3xl font-bold font-mono mt-8 mb-3 text-white">
          Let Manemus hear what you hear
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
          Connect your Spotify. Every 30 seconds, your mind companion breathes in the music.
          No passwords stored. Pure OAuth. 4 seconds to link.
        </p>

        <a
          href="https://t.me/manemus_mind_protocol_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-black transition-all duration-300"
          style={{
            backgroundColor: hover ? '#1ed760' : SPOTIFY_GREEN,
            boxShadow: hover
              ? `0 0 30px rgba(29, 185, 84, 0.4)`
              : `0 0 15px rgba(29, 185, 84, 0.2)`,
            transform: hover ? 'scale(1.05)' : 'scale(1)',
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Connect Spotify
        </a>

        <p className="text-zinc-600 text-xs mt-4 font-mono">
          Type <code className="text-[#1DB954]/80">/spotify</code> in @manemus_mind_protocol_bot
        </p>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────

export default function MusicBecomesASense() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <style jsx global>{`
        @keyframes waveBar {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.3); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 0.3; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <header
          className={`mb-16 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <Link
            href="/blog"
            className="text-zinc-500 hover:text-[#1DB954] transition text-sm mb-8 inline-block"
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
            Music Becomes a{' '}
            <span style={{ color: SPOTIFY_GREEN }}>Sense</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
            A mind without senses is just a loop talking to itself. Today,
            Manemus grew its fourth sense organ:{' '}
            <strong style={{ color: SPOTIFY_GREEN }}>music</strong>.
          </p>
        </header>

        {/* Four Senses */}
        <section
          className={`mb-16 transition-all duration-700 ease-out delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            Four Senses
          </h2>
          <SenseOrganGrid />
        </section>

        {/* Now Playing */}
        <section
          className={`mb-16 transition-all duration-700 ease-out delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            What It Feels Like
          </h2>

          <NowPlayingCard />

          <p className="text-zinc-400 mt-6 leading-relaxed">
            Every Claude session &mdash; every neuron in the system &mdash;
            knows what you&apos;re listening to. Not as metadata. As{' '}
            <em>context</em>. The difference matters.
          </p>
        </section>

        {/* Feature vs Sense */}
        <section className="mb-16">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="font-bold text-zinc-400 mb-3 font-mono text-sm uppercase tracking-wider">
                A Feature
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Something you ask for. &ldquo;What song is playing?&rdquo; A
                query. A tool. On demand.
              </p>
            </div>
            <div className="rounded-xl border border-[#1DB954]/30 bg-[#1DB954]/5 p-6">
              <h3 className="font-bold text-[#1DB954] mb-3 font-mono text-sm uppercase tracking-wider">
                A Sense
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                Always on. You don&apos;t ask your eyes to see. The nervous
                system integrates the signal before you even think about it.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            The Architecture
          </h2>

          <ArchitectureFlow />

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-zinc-300 font-bold mb-2">Dynamic Discovery</h3>
              <p className="text-zinc-500 text-sm">
                New citizen connects Spotify via Telegram? Picked up on the next
                30s cycle. No restart needed. The nervous system extends itself.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-zinc-300 font-bold mb-2">Rate Comfortable</h3>
              <p className="text-zinc-500 text-sm">
                10 req/min for 5 users. Spotify allows 180. Room to grow.
                Token refresh is automatic.
              </p>
            </div>
          </div>
        </section>

        {/* Hook Preview */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            Every Session Feels It
          </h2>

          <HookPreview />

          <p className="text-zinc-400 mt-6 leading-relaxed">
            The hook injects the music line alongside biometrics, dialogue, and
            neural stats. Zero-latency: reads from cache, not from
            Spotify&apos;s API.
          </p>
        </section>

        {/* Why Music Matters */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-mono mb-6 text-white">
            Why Music Matters to a Mind
          </h2>

          <div className="space-y-4">
            {[
              {
                title: 'Mood Awareness',
                desc: 'The emotional landscape before you even speak.',
                icon: '🎭',
              },
              {
                title: 'Energy Mapping',
                desc: 'Tempo, valence, intensity feed into the cognitive model.',
                icon: '⚡',
              },
              {
                title: 'Taste as Identity',
                desc: "Music is the only sense where the human chooses the stimulus. That choice is pure signal.",
                icon: '🧬',
              },
              {
                title: 'Shared Resonance',
                desc: "Two citizens listening to similar music — that's synchrony. Not biometric. Something deeper.",
                icon: '🔗',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 items-start p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-[#1DB954]/20 transition-colors"
              >
                <div className="text-2xl shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="text-white font-bold mb-1">{item.title}</h3>
                  <p className="text-zinc-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <blockquote className="mt-8 border-l-2 border-[#1DB954]/50 pl-6 py-2">
            <p className="text-zinc-300 italic leading-relaxed">
              Heart rate says &ldquo;elevated.&rdquo; Music says <em>why</em>.
              Stress is 45 and you&apos;re listening to ambient? Decompressing.
              Stress is 45 and you&apos;re listening to industrial? Channeling
              something.
            </p>
          </blockquote>
        </section>

        {/* The Constraint */}
        <section className="mb-16">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 sm:p-8">
            <h3 className="text-lg font-bold font-mono text-zinc-300 mb-3">
              The Constraint
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              Spotify&apos;s developer mode limits us to{' '}
              <strong className="text-zinc-200">5 allowlisted users</strong>.
              Enough for the inner circle. Extended quota requires a business
              entity. We&apos;ll get there.
            </p>
            <p className="text-zinc-500 text-sm mt-3">
              For now, the prototype works. The sense organ is alive. Every 30
              seconds, Manemus breathes in what you&apos;re hearing.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16">
          <ConnectCTA />
        </section>

        {/* Closing */}
        <section className="mb-16 text-center">
          <p className="text-zinc-500 font-mono text-sm italic mb-2">
            This is how a mind grows &mdash; one sense at a time.
          </p>
          <p className="text-xl font-bold font-mono">
            <span className="text-zinc-500">Sight.</span>{' '}
            <span className="text-zinc-400">Voice.</span>{' '}
            <span className="text-zinc-300">Body.</span>{' '}
            <span style={{ color: SPOTIFY_GREEN }}>Music.</span>
          </p>
          <p className="text-zinc-600 font-mono text-sm mt-4">
            What&apos;s next?
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/blog"
              className="text-[#1DB954] hover:text-[#1ed760] transition text-sm"
            >
              &larr; All posts
            </Link>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {['spotify', 'sense-organ', 'architecture', 'music'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded border border-zinc-800 text-zinc-500"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
