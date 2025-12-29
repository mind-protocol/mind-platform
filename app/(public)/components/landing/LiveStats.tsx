'use client';

import { useEffect, useState } from 'react';
import { StatCounter } from './StatCounter';

interface Stats {
  citizens: number;
  orgs: number;
  nodes: number;
}

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <section className="py-16 border-y border-zinc-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center gap-12 md:gap-24">
          <StatCounter value={stats?.citizens} label="Citizens" />
          <StatCounter value={stats?.orgs} label="Organizations" />
          <StatCounter value={stats?.nodes} label="Nodes" />
        </div>
      </div>
    </section>
  );
}
