'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { VerificationBadge } from '../../components/VerificationBadge';

interface CitizenProfile {
  id: string;
  name: string;
  description?: string | null;
  emoji?: string | null;
  wallet?: string;
  org_membership?: string;
  org_name?: string;
  status: string;
  registered_date: string;
  capabilities: string[];
  verification: string;
  org_details?: {
    id: string;
    name: string;
    description?: string;
    type?: string;
    color?: string;
    citizen_count?: number;
  } | null;
}

export default function CitizenProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [citizen, setCitizen] = useState<CitizenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/registry/citizens/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setCitizen(data);
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
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 mt-4">Loading citizen...</p>
        </div>
      </main>
    );
  }

  if (notFound || !citizen) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-6xl mb-4">?</p>
          <h1 className="text-2xl font-bold mb-2">Citizen not found</h1>
          <p className="text-zinc-500 mb-8">
            No citizen with handle <span className="font-mono text-zinc-300">@{id}</span> exists in the registry.
          </p>
          <Link
            href="/registry"
            className="text-amber-500 hover:text-amber-400 text-sm"
          >
            Back to Registry
          </Link>
        </div>
      </main>
    );
  }

  const statusColor = citizen.status === 'active' ? 'text-green-400' : citizen.status === 'suspended' ? 'text-red-400' : 'text-yellow-400';

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <Link
          href="/registry"
          className="text-zinc-500 hover:text-zinc-300 text-sm mb-8 inline-block"
        >
          &larr; Registry
        </Link>

        <div className="border border-zinc-800 rounded-xl p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-mono">
                {citizen.emoji && <span className="mr-2">{citizen.emoji}</span>}
                {citizen.name}
              </h1>
              <p className="text-zinc-500 font-mono mt-1">@{citizen.id}</p>
            </div>
            <VerificationBadge state={citizen.verification as any} />
          </div>

          {/* Description */}
          {citizen.description && (
            <p className="text-zinc-300 text-lg leading-relaxed mb-6">
              {citizen.description}
            </p>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-zinc-900 rounded-lg">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Status</p>
              <p className={`font-medium ${statusColor}`}>{citizen.status}</p>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Registered</p>
              <p className="text-zinc-300">{new Date(citizen.registered_date).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Guild / Org */}
          {citizen.org_details && (
            <div className="mb-6 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Guild</p>
              <div className="flex items-center gap-3">
                {citizen.org_details.color && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: citizen.org_details.color }}
                  />
                )}
                <div>
                  <p className="text-white font-medium">{citizen.org_details.name}</p>
                  {citizen.org_details.description && (
                    <p className="text-zinc-500 text-sm">{citizen.org_details.description}</p>
                  )}
                  {citizen.org_details.citizen_count != null && (
                    <p className="text-zinc-600 text-xs mt-1">
                      {citizen.org_details.citizen_count} members
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Capabilities */}
          {citizen.capabilities && citizen.capabilities.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Capabilities</p>
              <div className="flex flex-wrap gap-2">
                {citizen.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-zinc-300"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Wallet */}
          {citizen.wallet && (
            <div className="mb-6">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Wallet</p>
              <p className="font-mono text-sm text-zinc-400 bg-zinc-900 px-3 py-2 rounded-lg break-all">
                {citizen.wallet}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
