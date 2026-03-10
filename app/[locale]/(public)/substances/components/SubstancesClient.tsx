'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  CATEGORIES,
  SUBSTANCES,
  getSubstancesByCategory,
  type Substance,
  type RiskLevel,
} from '@/lib/substances/data';

/* ─── Helpers ─── */

function t(record: Record<string, string>, locale: string): string {
  return record[locale] ?? record.en ?? '';
}

function riskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'low':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'moderate':
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    case 'high':
      return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'extreme':
      return 'text-red-400 bg-red-500/10 border-red-500/30';
  }
}

function riskLabel(risk: RiskLevel, locale: string): string {
  const labels: Record<RiskLevel, Record<string, string>> = {
    low: { en: 'Low', fr: 'Faible' },
    moderate: { en: 'Moderate', fr: 'Mod\u00e9r\u00e9' },
    high: { en: 'High', fr: '\u00c9lev\u00e9' },
    extreme: { en: 'Extreme', fr: 'Extr\u00eame' },
  };
  return labels[risk]?.[locale] ?? labels[risk].en;
}

/* ─── Risk Badge ─── */

function RiskBadge({ risk, locale }: { risk: RiskLevel; locale: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${riskColor(risk)}`}
    >
      {riskLabel(risk, locale)}
    </span>
  );
}

/* ─── HRV Arrow ─── */

function DirectionArrow({ direction }: { direction: 'up' | 'down' | 'variable' }) {
  if (direction === 'up') return <span className="text-red-400">\u2191</span>;
  if (direction === 'down') return <span className="text-blue-400">\u2193</span>;
  return <span className="text-amber-400">\u2195</span>;
}

/* ─── Substance Card ─── */

function SubstanceCard({ substance, locale }: { substance: Substance; locale: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-all">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-zinc-800/30 transition"
      >
        {/* Color dot */}
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
          style={{ backgroundColor: substance.color }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-white">
              {t(substance.name, locale)}
            </h3>
            <span className="text-xs text-zinc-500 font-mono">
              {substance.class}
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
            {t(substance.summary, locale)}
          </p>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-zinc-500">
              {locale === 'fr' ? 'D\u00e9p. physique' : 'Physical dep.'}:{' '}
            </span>
            <RiskBadge risk={substance.dependence.physical} locale={locale} />
            <span className="text-xs text-zinc-500">
              {locale === 'fr' ? 'D\u00e9p. psy' : 'Psych dep.'}:{' '}
            </span>
            <RiskBadge risk={substance.dependence.psychological} locale={locale} />
            <span className="text-xs text-zinc-500">OD:</span>
            <RiskBadge risk={substance.overdoseRisk} locale={locale} />
          </div>
        </div>

        {/* Expand chevron */}
        <span className={`text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          \u25BC
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-zinc-800/50 space-y-6">
          {/* Aliases */}
          <div className="pt-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              {locale === 'fr' ? 'Noms de rue' : 'Street names'}
            </p>
            <p className="text-sm text-zinc-300">
              {(substance.aliases[locale] ?? substance.aliases.en ?? []).join(', ')}
            </p>
          </div>

          {/* Legal status */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              {locale === 'fr' ? 'Statut l\u00e9gal France' : 'Legal status France'}
            </p>
            <p className="text-sm text-zinc-300">{t(substance.legalStatusFR, locale)}</p>
          </div>

          {/* Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-800/30">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                {locale === 'fr' ? 'Effets court terme' : 'Short-term effects'}
              </p>
              <p className="text-sm text-zinc-300">
                {t(substance.effects.shortTerm, locale)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-zinc-800/30">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                {locale === 'fr' ? 'Effets long terme' : 'Long-term effects'}
              </p>
              <p className="text-sm text-zinc-300">
                {t(substance.effects.longTerm, locale)}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              {locale === 'fr' ? 'Dur\u00e9e' : 'Duration'}
            </p>
            <p className="text-sm text-zinc-300 font-mono">{substance.effects.duration}</p>
          </div>

          {/* Biometric Impact */}
          <div>
            <p className="text-xs text-amber-500/80 uppercase tracking-wider mb-3 font-medium">
              {locale === 'fr' ? 'Impact biom\u00e9trique (Garmin)' : 'Biometric Impact (Garmin)'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-zinc-800/40">
                <p className="text-xs text-zinc-500 mb-1">HRV</p>
                <p className="text-sm text-zinc-200">
                  <DirectionArrow direction={substance.biometric.hrv.direction} />{' '}
                  {substance.biometric.hrv.magnitude}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/40">
                <p className="text-xs text-zinc-500 mb-1">
                  {locale === 'fr' ? 'Fr\u00e9q. cardiaque' : 'Heart Rate'}
                </p>
                <p className="text-sm text-zinc-200">
                  <DirectionArrow direction={substance.biometric.heartRate.direction} />{' '}
                  {substance.biometric.heartRate.magnitude}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/40">
                <p className="text-xs text-zinc-500 mb-1">
                  {locale === 'fr' ? 'R\u00e9cup\u00e9ration' : 'Recovery'}
                </p>
                <p className="text-sm text-zinc-200">{substance.biometric.recoveryTime}</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/40 col-span-2 md:col-span-1">
                <p className="text-xs text-zinc-500 mb-1">
                  {locale === 'fr' ? 'Sommeil' : 'Sleep'}
                </p>
                <p className="text-sm text-zinc-200">{substance.biometric.sleep}</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/40">
                <p className="text-xs text-zinc-500 mb-1">Stress</p>
                <p className="text-sm text-zinc-200">{substance.biometric.stress}</p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-800/40">
                <p className="text-xs text-zinc-500 mb-1">Body Battery</p>
                <p className="text-sm text-zinc-200">{substance.biometric.bodyBattery}</p>
              </div>
            </div>
          </div>

          {/* Dangerous Interactions */}
          <div>
            <p className="text-xs text-red-400/80 uppercase tracking-wider mb-3 font-medium">
              {locale === 'fr' ? 'Interactions dangereuses' : 'Dangerous Interactions'}
            </p>
            <div className="space-y-2">
              {substance.topInteractions.map((inter) => (
                <div
                  key={inter.substance}
                  className="p-3 rounded-lg bg-zinc-800/30 flex items-start gap-3"
                >
                  <RiskBadge risk={inter.risk} locale={locale} />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-200 font-medium">{inter.substance}</p>
                    <p className="text-xs text-zinc-400">{t(inter.description, locale)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Fact */}
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <p className="text-xs text-amber-500 uppercase tracking-wider mb-2 font-medium">
              {locale === 'fr' ? '\u00c0 retenir' : 'Key Fact'}
            </p>
            <p className="text-sm text-zinc-200">{t(substance.keyFact, locale)}</p>
          </div>

          {/* Sources */}
          <div>
            <p className="text-xs text-zinc-600 mb-1">Sources</p>
            <p className="text-xs text-zinc-600">{substance.sources.join(' \u2022 ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Client ─── */

export default function SubstancesClient() {
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    return CATEGORIES.map((cat) => {
      const subs = getSubstancesByCategory(cat.id).filter((sub) => {
        if (activeCategory && cat.id !== activeCategory) return false;
        if (!q) return true;
        // Search in name, aliases, summary
        const nameMatch = Object.values(sub.name).some((n) => n.toLowerCase().includes(q));
        const aliasMatch = Object.values(sub.aliases)
          .flat()
          .some((a) => a.toLowerCase().includes(q));
        const summaryMatch = Object.values(sub.summary).some((s) => s.toLowerCase().includes(q));
        return nameMatch || aliasMatch || summaryMatch;
      });
      return { ...cat, filteredSubs: subs };
    }).filter((cat) => cat.filteredSubs.length > 0);
  }, [search, activeCategory]);

  const totalShown = filteredCategories.reduce((s, c) => s + c.filteredSubs.length, 0);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            {locale === 'fr' ? 'R\u00e9duction des risques' : 'Harm Reduction'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            {locale === 'fr' ? 'Base Substances' : 'Substance Database'}
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            {locale === 'fr'
              ? '\u00c9ducation fond\u00e9e sur la science. Effets, dosages, interactions, impact biom\u00e9trique. Ni moralisation, ni propagande.'
              : 'Science-based education. Effects, dosages, interactions, biometric impact. No moralization, no propaganda.'}
          </p>
        </header>

        {/* Stats hero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
            <p className="text-2xl font-bold font-mono text-amber-500">
              {Object.keys(SUBSTANCES).length}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {locale === 'fr' ? 'Substances' : 'Substances'}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
            <p className="text-2xl font-bold font-mono text-amber-500">
              {CATEGORIES.length}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {locale === 'fr' ? 'Cat\u00e9gories' : 'Categories'}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
            <p className="text-2xl font-bold font-mono text-amber-500">6</p>
            <p className="text-xs text-zinc-500 mt-1">
              {locale === 'fr' ? 'M\u00e9triques Garmin' : 'Garmin Metrics'}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-center">
            <p className="text-2xl font-bold font-mono text-amber-500">FR/EN</p>
            <p className="text-xs text-zinc-500 mt-1">
              {locale === 'fr' ? 'Bilingue' : 'Bilingual'}
            </p>
          </div>
        </div>

        {/* Search + Category filter */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              locale === 'fr'
                ? 'Rechercher une substance, un nom de rue...'
                : 'Search a substance, street name...'
            }
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/50 focus:outline-none transition"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                activeCategory === null
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
              }`}
            >
              {locale === 'fr' ? 'Toutes' : 'All'} ({Object.keys(SUBSTANCES).length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  activeCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {cat.icon} {t(cat.label, locale)} ({cat.substances.length})
              </button>
            ))}
          </div>
        </div>

        {/* Substance cards by category */}
        <div className="space-y-10">
          {filteredCategories.map((cat) => (
            <section key={cat.id}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{t(cat.label, locale)}</span>
                <span className="text-zinc-600 text-sm font-normal">
                  ({cat.filteredSubs.length})
                </span>
              </h2>
              <div className="space-y-3">
                {cat.filteredSubs.map((sub) => (
                  <SubstanceCard key={sub.id} substance={sub} locale={locale} />
                ))}
              </div>
            </section>
          ))}

          {totalShown === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-500 text-lg">
                {locale === 'fr' ? 'Aucune substance trouv\u00e9e.' : 'No substances found.'}
              </p>
            </div>
          )}
        </div>

        {/* Charter footer */}
        <div className="mt-16 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 text-center">
          <p className="text-zinc-500 text-sm italic mb-2">
            {locale === 'fr'
              ? '\u00ab Voir le chaos clairement, sans devenir son ing\u00e9nieur. \u00bb'
              : '\u201cSee the chaos clearly, without becoming its engineer.\u201d'}
          </p>
          <p className="text-zinc-600 text-xs">
            {locale === 'fr'
              ? 'Mind Protocol documente, mesure et \u00e9duque. Information fond\u00e9e sur la science, sans moralisation.'
              : 'Mind Protocol documents, measures, and educates. Science-based information, no moralization.'}
          </p>
          <p className="text-zinc-700 text-xs mt-3">
            {locale === 'fr'
              ? 'Urgence drogues : 0 800 23 13 13 (Drogues Info Service) \u2022 SAMU : 15'
              : 'Drug emergency: 0 800 23 13 13 (Drogues Info Service) \u2022 SAMU: 15'}
          </p>
        </div>
      </article>
    </main>
  );
}
