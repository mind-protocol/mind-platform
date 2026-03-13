'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

interface OrgMember {
  id: string;
  name: string;
  description?: string | null;
  emoji?: string | null;
  status: string;
  verification: string;
  capabilities: string[];
}

interface OrgDetail {
  id: string;
  name: string;
  description?: string;
  type?: string;
  color?: string;
  status: string;
  verification: string;
  citizen_count: number;
  members: OrgMember[];
}

export default function OrgProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/registry/orgs/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        if (data.error) { setNotFound(true); return; }
        setOrg(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 mt-4">Loading organization...</p>
        </div>
      </main>
    );
  }

  if (notFound || !org) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-5xl mb-4 opacity-20">{'\u2205'}</p>
          <h1 className="text-2xl font-bold mb-2">Organization not found</h1>
          <p className="text-zinc-500 mb-8">
            No organization with ID <span className="font-mono text-zinc-300">{id}</span> exists in the registry.
          </p>
          <Link href="/registry" className="text-violet-400 hover:text-violet-300 text-sm">
            Back to Registry
          </Link>
        </div>
      </main>
    );
  }

  const activeMembers = org.members.filter((m) => m.status === 'active');
  const typeLabel = org.type ? org.type.charAt(0).toUpperCase() + org.type.slice(1) : 'Organization';

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <Link href="/registry" className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block">
          &larr; Registry
        </Link>

        {/* Org header */}
        <div className="border border-zinc-800 rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            {org.color && (
              <div
                className="w-12 h-12 rounded-lg border border-zinc-700 shrink-0"
                style={{ backgroundColor: org.color }}
              />
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">{org.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{typeLabel}</span>
                <span className={`text-xs font-medium ${org.status === 'active' ? 'text-green-400' : 'text-zinc-500'}`}>
                  {org.status}
                </span>
              </div>
            </div>
          </div>

          {org.description && (
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{org.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-900 rounded-lg">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Members</p>
              <p className="text-xl font-bold text-zinc-300">{activeMembers.length}</p>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Registered</p>
              <p className="text-xl font-bold text-zinc-300">{org.citizen_count}</p>
            </div>
          </div>
        </div>

        {/* Members list */}
        <div className="border border-zinc-800 rounded-xl p-6 sm:p-8">
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-4">
            Members ({activeMembers.length})
          </p>
          <div className="grid gap-2">
            {activeMembers.map((member) => (
              <Link
                key={member.id}
                href={`/registry/citizens/${member.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm shrink-0">
                  {member.emoji || member.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-zinc-600 font-mono truncate">@{member.id}</p>
                </div>
                {member.capabilities && member.capabilities.length > 0 && (
                  <div className="hidden sm:flex gap-1">
                    {member.capabilities.slice(0, 2).map((cap) => (
                      <span key={cap} className="px-1.5 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-500">
                        {cap}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
