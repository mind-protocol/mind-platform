'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { StatCounter } from './StatCounter';
import { FadeInSection } from './FadeInSection';

interface Stats {
  citizens: number;
  orgs: number;
}

export function LiveStats() {
  const t = useTranslations('Landing.Stats');
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  return (
    <FadeInSection direction="up">
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter
              target={stats?.citizens ?? 0}
              label={t('citizens')}
            />
            <StatCounter
              target={stats?.orgs ?? 0}
              label={t('holders')}
            />
            <StatCounter
              target={100}
              label={t('lpLocked')}
              suffix="%"
            />
            <StatCounter
              target={1000000}
              label={t('supply')}
            />
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
