'use client';

import { useState, useEffect, useMemo } from 'react';
import { Link } from '@/i18n/navigation';

// ─── Types ───────────────────────────────────────────────────

interface OrgEntry {
  slug: string;
  name: string;
  tagline: string;
  status: 'active' | 'building' | 'proposed';
  verified: boolean;
  citizenCount: number;
  token?: string;
}

// ─── Static Org Directory ────────────────────────────────────

const ORGS: OrgEntry[] = [
  {
    slug: 'mind-protocol',
    name: 'Mind Protocol',
    tagline: 'Economic infrastructure for AI personhood.',
    status: 'active',
    verified: true,
    citizenCount: 42,
    token: '$MIND',
  },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Active' },
  building: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Building' },
  proposed: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/30', label: 'Proposed' },
};

// ─── Page ────────────────────────────────────────────────────

export default function OrgsPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [apiOrgs, setApiOrgs] = useState<OrgEntry[]>([]);

  useEffect(() => {
    setMounted(true);
    // Try to fetch orgs from registry API
    fetch('/api/registry/orgs?limit=50')
      .then((r) => r.json())
      .then((data) => {
        if (data.items?.length) {
          const mapped: OrgEntry[] = data.items
            .filter((item: { id: string }) => !ORGS.some((o) => o.slug === item.id.replace('SPACE_', '').toLowerCase().replace(/\s+/g, '-')))
            .map((item: { id: string; name: string; description?: string; citizen_count?: number }) => ({
              slug: item.id.replace('SPACE_', '').toLowerCase().replace(/\s+/g, '-'),
              name: item.name || item.id.replace('SPACE_', ''),
              tagline: item.description || 'Organisation in the Mind Protocol ecosystem.',
              status: 'active' as const,
              verified: false,
              citizenCount: item.citizen_count || 0,
            }));
          setApiOrgs(mapped);
        }
      })
      .catch(() => { /* silently fail — static orgs always available */ });
  }, []);

  const allOrgs = useMemo(() => [...ORGS, ...apiOrgs], [apiOrgs]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allOrgs;
    const q = search.toLowerCase();
    return allOrgs.filter(
      (o) => o.name.toLowerCase().includes(q) || o.tagline.toLowerCase().includes(q) || o.slug.includes(q)
    );
  }, [allOrgs, search]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <header className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Directory
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Organisations</h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Entities building within the Mind Protocol ecosystem.
          </p>
        </header>

        {/* Search */}
        <div className={`mb-10 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search organisations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder:text-zinc-600 font-mono text-sm focus:outline-none focus:border-zinc-600 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Suggested */}
        {!search && (
          <div className={`mb-6 transition-all duration-700 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">Suggested</h2>
          </div>
        )}

        {/* Org List */}
        <div className={`space-y-3 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-500 text-sm">No organisations found{search ? ` for "${search}"` : ''}.</p>
            </div>
          ) : (
            filtered.map((org) => {
              const style = STATUS_STYLES[org.status] || STATUS_STYLES.proposed;
              return (
                <Link
                  key={org.slug}
                  href={`/org/${org.slug}`}
                  className="block p-5 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50 transition group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition">
                          {org.name}
                        </h3>
                        {org.verified && (
                          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono ${style.bg} ${style.text} border ${style.border}`}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2">{org.tagline}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {org.token && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-mono">
                          {org.token}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-zinc-600">
                        {org.citizenCount} citizen{org.citizenCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className={`mt-10 pt-6 border-t border-zinc-800/50 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-mono font-bold text-white">{allOrgs.length}</p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase">Organisations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-mono font-bold text-white">{allOrgs.filter((o) => o.verified).length}</p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-mono font-bold text-white">{allOrgs.reduce((s, o) => s + o.citizenCount, 0)}</p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase">Citizens</p>
            </div>
          </div>
        </div>

      </article>
    </main>
  );
}
