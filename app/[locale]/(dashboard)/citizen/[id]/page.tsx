'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

// ─── Types ──────────────────────────────────────────────────────

interface CitizenAvatar {
  type: 'photo' | 'letter';
  css_class?: string;
  photo_path?: string;
  letter?: string;
}

interface Citizen {
  id: string;
  display_name: string;
  role: string;
  section: string;
  bio: string;
  tags: string[];
  links: Record<string, { url: string; label: string }>;
  avatar: CitizenAvatar;
  photo?: string;
  visibility: string;
  trust_level: string;
  wallet?: string | null;
  website?: string | null;
  telegram_id?: string | null;
  spotify_track?: string | null;
  orgs: string[];
}

interface HouseState {
  streets?: {
    citizen_count: number;
    garmin_linked: number;
    recent: Array<{ name: string; joined: string }>;
  };
  neon?: {
    hr?: number;
    stress?: number;
    energy?: number;
    energy_max?: number;
    ans_mode?: string;
    sleep_hours?: number;
    hrv?: number;
  };
  rooms?: Array<{ id: string; status: string; purpose: string }>;
  ceiling?: {
    artist?: string;
    title?: string;
    album?: string;
    playing?: boolean;
  };
  offline?: boolean;
}

// ─── Utilities ──────────────────────────────────────────────────

const MANEMUS_URL = process.env.NEXT_PUBLIC_MANEMUS_URL || 'https://api.mindprotocol.ai';

function sectionLabel(section: string): string {
  const labels: Record<string, string> = {
    cofounder: 'Co-Founder',
    team: 'Team',
    citizen: 'Citizen',
    advisor: 'Advisor',
  };
  return labels[section] || section;
}

function sectionBadge(section: string): string {
  const styles: Record<string, string> = {
    cofounder: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    team: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    citizen: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    advisor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  };
  return styles[section] || 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30';
}

function trustIcon(trust_level: string): string {
  const icons: Record<string, string> = {
    cofounder: '\u25C6',
    team: '\u25B2',
    citizen: '\u25CF',
    advisor: '\u2605',
  };
  return icons[trust_level] || '\u25CF';
}

function stressColor(stress: number | undefined): string {
  if (!stress) return 'text-zinc-500';
  if (stress >= 76) return 'text-red-400';
  if (stress >= 51) return 'text-amber-400';
  if (stress >= 26) return 'text-yellow-300';
  return 'text-emerald-400';
}

function batteryColor(pct: number): string {
  if (pct >= 60) return 'bg-emerald-500';
  if (pct >= 30) return 'bg-amber-500';
  return 'bg-red-500';
}

function ansColor(mode: string | undefined): string {
  if (mode === 'recovery') return 'text-emerald-400';
  if (mode === 'balanced') return 'text-blue-400';
  if (mode === 'survival') return 'text-red-400';
  return 'text-zinc-500';
}

function platformIcon(platform: string): string {
  const icons: Record<string, string> = {
    x: 'X',
    github: 'GH',
    telegram: 'TG',
    discord: 'DC',
    linkedin: 'LI',
  };
  return icons[platform] || platform.slice(0, 2).toUpperCase();
}

// ─── Components ─────────────────────────────────────────────────

function Pulse({ color = 'blue', size = 3 }: { color?: string; size?: number }) {
  return (
    <span className="relative flex" style={{ width: size * 4, height: size * 4 }}>
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}
      />
      <span
        className={`relative inline-flex rounded-full bg-${color}-500`}
        style={{ width: size * 4, height: size * 4 }}
      />
    </span>
  );
}

function GlassPanel({
  children,
  title,
  icon,
  delay = 0,
  mounted = false,
}: {
  children: React.ReactNode;
  title: string;
  icon: string;
  delay?: number;
  mounted?: boolean;
}) {
  return (
    <div
      className={`relative border border-zinc-800/60 rounded-2xl bg-zinc-900/40 backdrop-blur-sm p-5 sm:p-6 transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function VitalGauge({
  label,
  value,
  unit,
  color,
  subtext,
}: {
  label: string;
  value: number | string | undefined;
  unit: string;
  color: string;
  subtext?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">{label}</div>
      <div className={`text-2xl font-mono font-bold ${color}`}>
        {value ?? '--'}
        <span className="text-xs text-zinc-500 ml-1">{unit}</span>
      </div>
      {subtext && <div className="text-[10px] text-zinc-600 mt-0.5">{subtext}</div>}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function CitizenProfilePage() {
  const params = useParams();
  const citizenId = params.id as string;

  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [house, setHouse] = useState<HouseState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchCitizen = useCallback(async () => {
    try {
      const res = await fetch(`/api/citizens/${encodeURIComponent(citizenId)}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCitizen(data);
      }
    } catch {
      // silent
    }
  }, [citizenId]);

  const fetchHouse = useCallback(async () => {
    try {
      const res = await fetch('/api/house');
      if (res.ok) setHouse(await res.json());
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchCitizen();
    fetchHouse();
    setMounted(true);
    const interval = setInterval(fetchHouse, 10000);
    return () => clearInterval(interval);
  }, [fetchCitizen, fetchHouse]);

  const onlineNames = new Set(
    (house?.streets?.recent || []).map((c) => c.name.toLowerCase())
  );
  const isOnline = citizen ? onlineNames.has(citizen.display_name.toLowerCase()) : false;

  // Only show biometrics for cofounders with neon data
  const isCofounder = citizen?.section === 'cofounder';
  const neon = house?.neon;
  const showBio = isCofounder && neon?.ans_mode;

  const photoUrl = citizen?.avatar?.photo_path
    ? `${MANEMUS_URL}/static/team${citizen.avatar.photo_path.replace('/team', '')}`
    : null;

  if (notFound) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl font-mono mb-4">404</p>
          <p className="text-zinc-500 font-mono mb-6">Citizen not found</p>
          <Link href="/citizen" className="text-blue-400 hover:text-blue-300 text-sm font-mono transition">
            &larr; back to registry
          </Link>
        </div>
      </main>
    );
  }

  if (!citizen) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-zinc-600 font-mono text-sm animate-pulse">loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-blue-900/5 via-transparent to-transparent" />

      {/* Top bar */}
      <header className="relative z-10 border-b border-zinc-800/50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/citizen" className="text-zinc-500 hover:text-white text-xs font-mono transition">
            &larr; citizens
          </Link>
          <span className="text-zinc-700">/</span>
          <h1 className="text-sm font-mono text-zinc-300">{citizen.display_name.toLowerCase()}</h1>
        </div>
        {isOnline && (
          <span className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <Pulse color="emerald" size={1} />
            online
          </span>
        )}
      </header>

      {/* Profile hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div
          className={`flex flex-col sm:flex-row items-start gap-6 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700/50 flex-shrink-0 flex items-center justify-center">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={citizen.display_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-3xl font-bold text-zinc-500">${citizen.display_name[0]}</span>`;
                  }
                }}
              />
            ) : (
              <span className="text-3xl font-bold text-zinc-500">
                {citizen.display_name[0]}
              </span>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {citizen.display_name}
              </h2>
              <span
                className={`text-xs px-2 py-1 rounded-full border font-mono ${sectionBadge(citizen.section)}`}
              >
                {trustIcon(citizen.trust_level)} {sectionLabel(citizen.section)}
              </span>
              {isOnline && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
                  online
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400 font-mono mb-3">{citizen.role}</p>

            {/* Tags */}
            {citizen.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {citizen.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/30 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Bio */}
          {citizen.bio && (
            <GlassPanel title="Bio" icon="" delay={100} mounted={mounted}>
              <p className="text-sm text-zinc-300 leading-relaxed">{citizen.bio}</p>
            </GlassPanel>
          )}

          {/* Links & Connections */}
          <GlassPanel title="Connections" icon="" delay={200} mounted={mounted}>
            <div className="space-y-3">
              {Object.entries(citizen.links).map(([platform, link]) => (
                <a
                  key={platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/30 hover:border-zinc-600/50 transition group"
                >
                  <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-400 group-hover:text-white transition">
                    {platformIcon(platform)}
                  </span>
                  <div>
                    <span className="text-xs text-zinc-300 font-medium">{link.label}</span>
                    <span className="block text-[10px] text-zinc-600 font-mono capitalize">{platform}</span>
                  </div>
                </a>
              ))}
              {Object.keys(citizen.links).length === 0 && (
                <p className="text-xs text-zinc-600 italic font-mono">no links shared</p>
              )}

              {/* Wallet */}
              {citizen.wallet && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
                  <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-400">
                    SOL
                  </span>
                  <div>
                    <code className="text-xs text-zinc-300 font-mono">
                      {citizen.wallet.slice(0, 6)}...{citizen.wallet.slice(-4)}
                    </code>
                    <span className="block text-[10px] text-zinc-600 font-mono">solana wallet</span>
                  </div>
                </div>
              )}

              {/* Website */}
              {citizen.website && (
                <a
                  href={citizen.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/30 hover:border-zinc-600/50 transition"
                >
                  <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-400">
                    WWW
                  </span>
                  <span className="text-xs text-zinc-300">{citizen.website}</span>
                </a>
              )}
            </div>
          </GlassPanel>

          {/* Biometrics (only for cofounders with linked neon) */}
          {showBio && (
            <GlassPanel title="Biometrics" icon="" delay={300} mounted={mounted}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <VitalGauge label="Heart" value={neon?.hr} unit="bpm" color="text-red-400" />
                <VitalGauge
                  label="Stress"
                  value={neon?.stress}
                  unit=""
                  color={stressColor(neon?.stress)}
                  subtext={neon?.stress && neon.stress >= 76 ? 'HIGH' : undefined}
                />
                <VitalGauge label="Energy" value={neon?.energy} unit="" color="text-emerald-400" />
              </div>
              <div className="mb-3">
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${batteryColor(
                      ((neon?.energy || 0) / (neon?.energy_max ?? 100)) * 100
                    )}`}
                    style={{ width: `${((neon?.energy || 0) / (neon?.energy_max ?? 100)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-zinc-600 font-mono">body battery</span>
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {neon?.energy ?? '--'}/{neon?.energy_max ?? 100}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono ${ansColor(neon?.ans_mode)}`}>
                  ANS: {neon?.ans_mode}
                </span>
                {neon?.sleep_hours && (
                  <span className="text-[10px] text-zinc-600 font-mono">
                    sleep: {neon.sleep_hours.toFixed(1)}h
                  </span>
                )}
                {neon?.hrv && (
                  <span className="text-[10px] text-zinc-600 font-mono ml-auto">
                    HRV: {neon.hrv}ms
                  </span>
                )}
              </div>
            </GlassPanel>
          )}

          {/* Organizations */}
          {citizen.orgs.length > 0 && (
            <GlassPanel title="Organizations" icon="" delay={400} mounted={mounted}>
              <div className="space-y-2">
                {citizen.orgs.map((org) => (
                  <div
                    key={org}
                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <span className="text-xs text-blue-300 font-mono font-bold">
                        {org[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-zinc-300">{org}</span>
                      <span className="block text-[10px] text-zinc-600 font-mono">organization</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          )}

          {/* Sovereignty */}
          <GlassPanel title="Sovereignty" icon="" delay={500} mounted={mounted}>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">visibility</span>
                <span className={citizen.visibility === 'doxxed' ? 'text-emerald-400' : 'text-amber-400'}>
                  {citizen.visibility}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">trust level</span>
                <span className="text-zinc-300">{citizen.trust_level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">data layer</span>
                <span className="text-zinc-300">
                  {citizen.section === 'cofounder' ? 'L1 (SOLO + DUO)' : 'L1 (SOLO)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">garmin</span>
                <span className={showBio ? 'text-emerald-400' : 'text-zinc-600'}>
                  {showBio ? 'linked' : 'not linked'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">wallet</span>
                <span className={citizen.wallet ? 'text-emerald-400' : 'text-zinc-600'}>
                  {citizen.wallet ? 'connected' : 'not connected'}
                </span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 px-4 sm:px-6 py-6 text-center">
        <p className="text-xs font-mono text-zinc-600">
          each citizen is sovereign in their own data &mdash;{' '}
          <Link href="/citizen" className="text-blue-400 hover:text-blue-300 transition">
            registry
          </Link>
        </p>
      </footer>

      <style jsx global>{`
        .bg-gradient-radial {
          background: radial-gradient(
            ellipse at 50% 30%,
            var(--tw-gradient-from),
            var(--tw-gradient-via),
            var(--tw-gradient-to)
          );
        }
      `}</style>
    </main>
  );
}
