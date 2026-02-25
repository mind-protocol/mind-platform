'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';

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
    ans_mode?: string;
  };
  meta?: {
    room_count: number;
    has_neon: boolean;
    has_music: boolean;
  };
  offline?: boolean;
}

// ─── Utilities ──────────────────────────────────────────────────

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
    cofounder: '\u25C6', // diamond
    team: '\u25B2', // triangle
    citizen: '\u25CF', // circle
    advisor: '\u2605', // star
  };
  return icons[trust_level] || '\u25CF';
}

const MANEMUS_URL = process.env.NEXT_PUBLIC_MANEMUS_URL || 'https://api.mindprotocol.ai';

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

function StatCard({
  label,
  value,
  color,
  mounted,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  mounted: boolean;
  delay: number;
}) {
  return (
    <div
      className={`border border-zinc-800/60 rounded-xl bg-zinc-900/40 backdrop-blur-sm p-4 text-center transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`text-3xl font-mono font-bold ${color}`}>{value}</div>
      <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mt-1">{label}</div>
    </div>
  );
}

function CitizenCard({
  citizen,
  mounted,
  delay,
  isOnline,
}: {
  citizen: Citizen;
  mounted: boolean;
  delay: number;
  isOnline: boolean;
}) {
  const photoUrl = citizen.avatar?.photo_path
    ? `${MANEMUS_URL}/static/team${citizen.avatar.photo_path.replace('/team', '')}`
    : null;

  return (
    <div
      className={`group relative border border-zinc-800/60 rounded-2xl bg-zinc-900/40 backdrop-blur-sm p-5 transition-all duration-700 hover:border-zinc-700/80 hover:bg-zinc-900/60 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Online indicator */}
      {isOnline && (
        <div className="absolute top-3 right-3">
          <Pulse color="emerald" size={1.5} />
        </div>
      )}

      {/* Avatar + Name */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/50 flex-shrink-0 flex items-center justify-center">
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
                  parent.innerHTML = `<span class="text-lg font-bold text-zinc-500">${citizen.display_name[0]}</span>`;
                }
              }}
            />
          ) : (
            <span className="text-lg font-bold text-zinc-500">
              {citizen.display_name[0]}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium text-white truncate">
              {citizen.display_name}
            </h3>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${sectionBadge(citizen.section)}`}
            >
              {trustIcon(citizen.trust_level)} {sectionLabel(citizen.section)}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate">{citizen.role}</p>
        </div>
      </div>

      {/* Bio */}
      {citizen.bio && (
        <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">
          {citizen.bio}
        </p>
      )}

      {/* Tags */}
      {citizen.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {citizen.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/30 font-mono"
            >
              {tag}
            </span>
          ))}
          {citizen.tags.length > 4 && (
            <span className="text-[10px] text-zinc-600 font-mono">
              +{citizen.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Links */}
      {Object.keys(citizen.links).length > 0 && (
        <div className="flex gap-3 pt-2 border-t border-zinc-800/30">
          {Object.entries(citizen.links).map(([platform, link]) => (
            <a
              key={platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-blue-400 hover:text-blue-300 transition"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Orgs */}
      {citizen.orgs.length > 0 && (
        <div className="flex gap-1.5 mt-2">
          {citizen.orgs.map((org) => (
            <span
              key={org}
              className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/40 text-zinc-500 font-mono"
            >
              {org}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

type FilterSection = 'all' | 'cofounder' | 'team' | 'citizen';

export default function CitizenDashboard() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [house, setHouse] = useState<HouseState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterSection>('all');
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchCitizens = useCallback(async () => {
    try {
      const res = await fetch('/api/citizens');
      if (res.ok) {
        const data = await res.json();
        setCitizens(data.citizens || []);
      }
    } catch {
      // silent
    }
  }, []);

  const fetchHouse = useCallback(async () => {
    try {
      const res = await fetch('/api/house');
      if (res.ok) {
        const data = await res.json();
        setHouse(data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchCitizens();
    fetchHouse();
    setMounted(true);
    const citizenInterval = setInterval(fetchCitizens, 30000);
    const houseInterval = setInterval(fetchHouse, 10000);
    return () => {
      clearInterval(citizenInterval);
      clearInterval(houseInterval);
    };
  }, [fetchCitizens, fetchHouse]);

  // Derived data
  const onlineNames = new Set(
    (house?.streets?.recent || []).map((c) => c.name.toLowerCase())
  );

  const filtered = citizens.filter((c) => {
    if (filter !== 'all' && c.section !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.display_name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const cofounders = citizens.filter((c) => c.section === 'cofounder');
  const team = citizens.filter((c) => c.section === 'team');
  const community = citizens.filter((c) => c.section === 'citizen');
  const isOffline = !house || house.offline;

  const filters: { key: FilterSection; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: citizens.length },
    { key: 'cofounder', label: 'Founders', count: cofounders.length },
    { key: 'team', label: 'Team', count: team.length },
    { key: 'citizen', label: 'Citizens', count: community.length },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-blue-900/5 via-transparent to-transparent" />

      {/* Top bar */}
      <header className="relative z-10 border-b border-zinc-800/50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-zinc-500 hover:text-white text-xs font-mono transition">
            &larr; mind protocol
          </Link>
          <span className="text-zinc-700">/</span>
          <h1 className="text-sm font-mono text-zinc-300">citizens</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/house" className="text-zinc-600 hover:text-zinc-300 text-xs font-mono transition">
            the house
          </Link>
          {!isOffline && (
            <span className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
              <Pulse color="emerald" size={1} />
              live &middot; {lastUpdate}
            </span>
          )}
          {isOffline && (
            <span className="text-[10px] font-mono text-zinc-600">offline</span>
          )}
        </div>
      </header>

      {/* Hero section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div
          className={`transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Citizens
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-xl font-mono">
            The people who inhabit the protocol. Founders, builders, believers.
            Each sovereign in their own data, connected by shared substrate.
          </p>
        </div>
      </section>

      {/* Stats row */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total"
            value={citizens.length}
            color="text-white"
            mounted={mounted}
            delay={100}
          />
          <StatCard
            label="Co-Founders"
            value={cofounders.length}
            color="text-amber-400"
            mounted={mounted}
            delay={150}
          />
          <StatCard
            label="Team"
            value={team.length}
            color="text-blue-400"
            mounted={mounted}
            delay={200}
          />
          <StatCard
            label="Garmin Linked"
            value={house?.streets?.garmin_linked || 0}
            color="text-emerald-400"
            mounted={mounted}
            delay={250}
          />
        </div>
      </section>

      {/* Search + Filter */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div
          className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search citizens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 text-xs font-mono"
              >
                clear
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                  filter === f.key
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f.label}
                <span className="ml-1 text-zinc-600">{f.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Citizens grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((citizen, i) => (
              <CitizenCard
                key={citizen.id}
                citizen={citizen}
                mounted={mounted}
                delay={350 + i * 50}
                isOnline={onlineNames.has(citizen.display_name.toLowerCase())}
              />
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-16 transition-all duration-700 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-zinc-600 font-mono text-sm">
              {search ? `No citizens matching "${search}"` : 'No citizens found'}
            </p>
          </div>
        )}
      </section>

      {/* Join CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div
          className={`border border-zinc-800/60 rounded-2xl bg-zinc-900/40 backdrop-blur-sm p-8 text-center transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <h3 className="text-lg font-medium text-white mb-2">Become a Citizen</h3>
          <p className="text-sm text-zinc-500 font-mono mb-4 max-w-md mx-auto">
            Connect through Telegram or WhatsApp. Link your Garmin for biometric
            awareness. Your data stays sovereign.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="https://t.me/manemus_mind_protocol_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono hover:bg-blue-500/20 transition"
            >
              Telegram
            </a>
            <Link
              href="/link/garmin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-emerald-500/20 transition"
            >
              Link Garmin
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/50 px-4 sm:px-6 py-6 text-center">
        <p className="text-xs font-mono text-zinc-600">
          sovereignty begins with knowing your own data &mdash;{' '}
          <Link href="/house" className="text-blue-400 hover:text-blue-300 transition">
            the house
          </Link>
        </p>
        <p className="text-[10px] font-mono text-zinc-700 mt-1">
          {citizens.length} citizens registered &middot; mind protocol
        </p>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        .bg-gradient-radial {
          background: radial-gradient(
            ellipse at 50% 30%,
            var(--tw-gradient-from),
            var(--tw-gradient-via),
            var(--tw-gradient-to)
          );
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}
