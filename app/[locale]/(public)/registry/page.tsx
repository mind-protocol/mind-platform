// DOCS: docs/registry/IMPLEMENTATION_Registry_Code.md
'use client';

import { useEffect, useState } from 'react';
import { RegistryTabs } from './components/RegistryTabs';
import { EntityList } from './components/EntityList';
import { fetchCitizens, fetchOrgs } from './lib/api';
import type { Citizen, Org } from './lib/types';

type Tab = 'citizens' | 'orgs';

export default function RegistryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('citizens');
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [counts, setCounts] = useState({ citizens: 0, orgs: 0 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [citizensRes, orgsRes] = await Promise.all([
          fetchCitizens(),
          fetchOrgs(),
        ]);
        setCitizens(citizensRes.items);
        setOrgs(orgsRes.items);
        setCounts({
          citizens: citizensRes.count,
          orgs: orgsRes.count,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <header className="text-center mb-16">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Ecosystem
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">Registry</h1>
          <p className="text-zinc-500 text-lg">
            Explore registered citizens and organizations in the Mind Protocol
            ecosystem.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm text-center">
            Failed to load registry data. Please try again later.
          </div>
        )}

        <RegistryTabs
          active={activeTab}
          onChange={setActiveTab}
          counts={counts}
        />

        <div className="mt-6">
          {activeTab === 'citizens' ? (
            <EntityList
              entities={citizens}
              type="citizen"
              loading={loading}
            />
          ) : (
            <EntityList entities={orgs} type="org" loading={loading} />
          )}
        </div>
      </div>
    </main>
  );
}
