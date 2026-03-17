'use client';

import { useEffect, useState } from 'react';

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

function BarChart({ repos, field }: { repos: RepoStats[]; field: 'lines' | 'commits' | 'files' }) {
  const max = Math.max(...repos.map(r => r[field]));
  const sorted = [...repos].sort((a, b) => b[field] - a[field]).slice(0, 12);

  return (
    <div className="space-y-1">
      {sorted.map(repo => (
        <div key={repo.name} className="flex items-center gap-2 text-sm">
          <span className="w-32 text-right text-gray-400 truncate">{repo.name}</span>
          <div className="flex-1 h-5 bg-gray-800 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded"
              style={{ width: `${(repo[field] / max) * 100}%` }}
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
      <div className="text-gray-400 animate-pulse">Loading repository stats...</div>
    </div>
  );

  if (!data || !data.totals) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400">Stats not available. Run: python3 scripts/generate_repo_stats.py</div>
    </div>
  );

  const { totals, repos, categories, generated_at } = data;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Mind Protocol</h1>
        <p className="text-gray-400">Repository Statistics — the infrastructure of a civilization</p>
        <p className="text-gray-600 text-sm mt-1">
          Updated {timeAgo(generated_at)} · Cache refreshes every 24h
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Repositories', value: totals.repos, icon: '📦' },
          { label: 'Commits', value: totals.commits, icon: '📝' },
          { label: 'Files', value: totals.files, icon: '📄' },
          { label: 'Lines of Code', value: totals.lines, icon: '⚡' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-3xl font-bold text-white">{formatNumber(value)}</div>
            <div className="text-gray-400 text-sm mt-1">{label}</div>
          </div>
        ))}
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
              <div key={cat} className={`border rounded-xl p-4 ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.other}`}>
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
              <tr key={repo.name} className="border-b border-gray-800/50 hover:bg-gray-800/30">
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
        <p>Data generated by <code className="text-gray-400">scripts/generate_repo_stats.py</code></p>
        <p className="mt-1">
          {totals.repos} repos · {totals.commits.toLocaleString()} commits · {totals.lines.toLocaleString()} lines of code
        </p>
      </div>
    </div>
  );
}
