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
      } catch (err) {
        console.error('Failed to load registry:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Registry</h1>
        <p className="text-zinc-400 mb-8">
          Explore registered citizens and organizations in the Mind Protocol
          ecosystem.
        </p>

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
    </div>
  );
}
