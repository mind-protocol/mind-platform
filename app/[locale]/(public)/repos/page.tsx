'use client';

import { useEffect, useState, useRef } from 'react';

interface RepoStats {
  name: string;
  commits: number;
  files: number;
  lines: number;
  last_commit: string;
  primary_language: string;
  category: string;
  contributors: { count: number; name: string }[];
}

interface StatsData {
  generated_at: string;
  totals: { repos: number; commits: number; files: number; lines: number };
  categories: Record<string, string[]>;
  repos: RepoStats[];
}

const CATEGORY_COLORS: Record<string, string> = {
  core: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  universes: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  products: 'bg-green-500/20 text-green-300 border-green-500/30',
  apps: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  tools: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  creative: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const CATEGORY_LABELS: Record<string, string> = {
  core: 'Core Infrastructure',
  universes: 'Universes',
  products: 'Products & Services',
  apps: 'Applications',
  tools: 'Developer Tools',
  creative: 'Creative Projects',
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'unknown';
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// Animated counter hook
function useAnimatedNumber(target: number, duration: number = 1500): number {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) return;
    startTime.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - (startTime.current || 0);
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return current;
}

function AnimatedStat({ value, label, subtitle, icon, delay = 0 }: {
  value: number; label: string; subtitle: string; icon: string; delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const animated = useAnimatedNumber(visible ? value : 0, 2000);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white">{formatNumber(animated)}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
      <div className="text-gray-600 text-xs mt-1">{subtitle}</div>
    </div>
  );
}

function BarChart({ repos, field }: { repos: RepoStats[]; field: 'lines' | 'commits' | 'files' }) {
  const max = Math.max(...repos.map(r => r[field]));
  const sorted = [...repos].sort((a, b) => b[field] - a[field]).slice(0, 14);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, [field]);

  return (
    <div className="space-y-1.5">
      {sorted.map((repo, i) => (
        <div key={repo.name} className="flex items-center gap-2 text-sm">
          <span className="w-36 text-right text-gray-400 truncate font-mono text-xs">{repo.name}</span>
          <div className="flex-1 h-5 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded transition-all duration-1000 ease-out"
              style={{
                width: visible ? `${(repo[field] / max) * 100}%` : '0%',
                transitionDelay: `${i * 50}ms`,
              }}
            />
          </div>
          <span className="w-16 text-right text-gray-300 font-mono text-xs">
            {formatNumber(repo[field])}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ReposPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'lines' | 'commits' | 'files'>('lines');

  useEffect(() => {
    fetch('/api/stats/repos')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 animate-pulse text-lg">Loading repository stats...</div>
    </div>
  );

  if (!data || !data.totals) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Stats not available.</div>
    </div>
  );

  const { totals, repos, categories, generated_at } = data;

  // Compute subtitles
  const firstCommitDate = new Date('2025-06-01'); // approximate project start
  const daysSinceStart = Math.max(1, Math.floor((Date.now() - firstCommitDate.getTime()) / 86400000));
  const commitsPerDay = (totals.commits / daysSinceStart).toFixed(1);

  // A book ≈ 200 files, a page ≈ 40 lines
  const books = Math.round(totals.files / 200);
  const pages = Math.round(totals.lines / 40);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Mind Protocol
        </h1>
        <p className="text-gray-400 text-lg">The infrastructure of a civilization, in numbers</p>
        <p className="text-gray-600 text-sm mt-1">
          Updated {timeAgo(generated_at)}
        </p>
      </div>

      {/* Totals — animated counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <AnimatedStat
          value={totals.repos} label="Repositories" icon="📦"
          subtitle="across the ecosystem"
          delay={0}
        />
        <AnimatedStat
          value={totals.commits} label="Commits" icon="📝"
          subtitle={`~${commitsPerDay} per day`}
          delay={200}
        />
        <AnimatedStat
          value={totals.files} label="Files" icon="📄"
          subtitle={`~${books} books worth`}
          delay={400}
        />
        <AnimatedStat
          value={totals.lines} label="Lines of Code" icon="⚡"
          subtitle={`~${formatNumber(pages)} pages`}
          delay={600}
        />
      </div>

      {/* Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">By Repository</h2>
          <div className="flex gap-2">
            {(['lines', 'commits', 'files'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  view === v
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <BarChart repos={repos} field={view} />
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categories).map(([cat, repoNames]) => {
            const catRepos = repos.filter(r => repoNames.includes(r.name));
            const catLines = catRepos.reduce((s, r) => s + r.lines, 0);
            const catCommits = catRepos.reduce((s, r) => s + r.commits, 0);

            return (
              <div key={cat} className={`border rounded-xl p-4 transition-all hover:scale-[1.02] ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.other}`}>
                <h3 className="font-semibold mb-2">{CATEGORY_LABELS[cat] || cat}</h3>
                <div className="text-2xl font-bold">{formatNumber(catLines)} lines</div>
                <div className="text-sm opacity-70">{catRepos.length} repos · {catCommits} commits</div>
                <div className="mt-2 text-xs opacity-60">
                  {repoNames.join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="text-left p-3">Repository</th>
              <th className="text-left p-3">Category</th>
              <th className="text-right p-3">Commits</th>
              <th className="text-right p-3">Files</th>
              <th className="text-right p-3">Lines</th>
              <th className="text-left p-3">Language</th>
              <th className="text-right p-3">Last Commit</th>
            </tr>
          </thead>
          <tbody>
            {repos.map(repo => (
              <tr key={repo.name} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="p-3 font-mono text-blue-300">
                  <a
                    href={`https://github.com/mind-protocol/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {repo.name}
                  </a>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${CATEGORY_COLORS[repo.category] || CATEGORY_COLORS.other}`}>
                    {repo.category}
                  </span>
                </td>
                <td className="p-3 text-right font-mono">{repo.commits.toLocaleString()}</td>
                <td className="p-3 text-right font-mono">{repo.files.toLocaleString()}</td>
                <td className="p-3 text-right font-mono font-bold">{repo.lines.toLocaleString()}</td>
                <td className="p-3 text-gray-400">{repo.primary_language}</td>
                <td className="p-3 text-right text-gray-400">{timeAgo(repo.last_commit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p className="mt-1">
          {totals.repos} repos · {totals.commits.toLocaleString()} commits · {totals.lines.toLocaleString()} lines
        </p>
        <p className="mt-1 text-gray-700">
          Event-driven refresh — stats update on every commit, no cron
        </p>
      </div>
    </div>
  );
}
