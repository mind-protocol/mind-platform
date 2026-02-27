'use client';

import { useEffect, useState } from 'react';

interface Rec {
  substance: string;
  priority: number;
  action: string;
  reason: string;
  details: Record<string, unknown>;
}

interface RecContext {
  period: string;
  hour: number;
  biometrics: {
    hr: number | null;
    stress: number | null;
    body_battery: number | null;
    ans_mode: string;
  } | null;
  today_counts: Record<string, number>;
  last_intake: Record<string, number | null>;
}

interface SurveillanceAlert {
  substances: string[];
  severity: string;
  note: string;
}

interface SurveillanceSymptom {
  key: string;
  label: string;
  icon: string;
  severity: string;
}

interface Surveillance {
  active: boolean;
  max_severity?: string;
  alerts: SurveillanceAlert[];
  symptoms: SurveillanceSymptom[];
  adverse_effects: { key: string; label: string; icon: string }[];
}

interface RecResponse {
  recommendations: Rec[];
  surveillance?: Surveillance;
  context: RecContext;
}

const SUB_COLORS: Record<string, string> = {
  thc: '#22c55e',
  cbd: '#84cc16',
  lions_mane: '#b45309',
  caffeine: '#d97706',
  ketamine: '#8b5cf6',
  lsd: '#ec4899',
  nicotine: '#f59e0b',
  hydration: '#3b82f6',
  melatonin: '#6366f1',
  venlafaxine: '#14b8a6',
  sertraline: '#06b6d4',
  prazepam: '#94a3b8',
  cyamemazine: '#7e22ce',
  dynabiane: '#10b981',
  omegabiane: '#0ea5e9',
  griffonia: '#a855f7',
  valeriane: '#65a30d',
  safran: '#f97316',
  yoga: '#f472b6',
  vitamine_c: '#fb923c',
  cocaine: '#e2e8f0',
  mmc: '#22d3ee',
  heroine: '#78350f',
  none: '#52525b',
};

const SUB_ICONS: Record<string, string> = {
  thc: '🌿',
  cbd: '🌱',
  lions_mane: '🦁',
  caffeine: '☕',
  ketamine: '💎',
  lsd: '🔮',
  nicotine: '💨',
  hydration: '💧',
  melatonin: '🌙',
  venlafaxine: '💊',
  sertraline: '💊',
  prazepam: '🫧',
  cyamemazine: '🌌',
  dynabiane: '🧬',
  omegabiane: '🐟',
  griffonia: '🌰',
  valeriane: '🌾',
  safran: '🌸',
  yoga: '🧘',
  vitamine_c: '🍊',
  cocaine: '⚠️',
  mmc: '⚠️',
  heroine: '🚨',
  none: '✓',
};

const SYMPTOM_TOOLTIPS: Record<string, string> = {
  // Serotonin
  agitation: "Nervosité excessive, incapacité à rester immobile, besoin de bouger constamment",
  tremors: "Tremblements involontaires des mains, doigts ou membres — fins et rapides",
  sweating: "Transpiration excessive sans effort physique, sueurs froides ou chaudes",
  diarrhea: "Selles fréquentes et liquides, urgence intestinale",
  tachycardia: "Coeur qui bat vite (>100 bpm au repos) — vérifiable au poignet ou sur la Garmin",
  hyperthermia: "Température corporelle élevée (>38°C), sensation de chaleur interne intense",
  confusion: "Difficulté à penser clairement, désorientation, pensées désorganisées",
  myoclonus: "Contractions musculaires brusques et involontaires — sursauts, spasmes",
  // GABA/sedation
  excessive_sedation: "Somnolence anormale, difficulté à garder les yeux ouverts, envie irrésistible de dormir",
  respiratory_slow: "Respiration anormalement lente (<12/min), pauses entre les respirations",
  ataxia: "Perte d'équilibre, démarche instable, impression d'ébriété sans alcool",
  hypotension: "Vertige en se levant rapidement, vision qui noircit brièvement, tête qui tourne",
  // Gastrointestinal
  nausea: "Envie de vomir sans vomir, malaise gastrique, estomac retourné",
  retching: "Haut-le-coeur — contractions abdominales réflexes sans vomissement effectif",
  vomiting: "Vomissement effectif — expulsion du contenu gastrique",
  stomach_pain: "Douleur ou crampe dans le ventre, sensation de brûlure ou pression abdominale",
  // Respiratory
  breathing_shallow: "Respiration haute et superficielle — seul le haut du thorax bouge, souffle court",
  breathing_blocked: "Sensation de ne pas pouvoir inspirer à fond, blocage respiratoire, oppression",
  breathing_panting: "Respiration rapide et courte comme après un sprint, essoufflement au repos",
  hyperventilation: "Respiration excessive et rapide, fourmillements aux extrémités, tête légère",
  chest_tightness: "Pression ou serrement dans la poitrine, sensation de poids sur le sternum",
  // Neurological
  headache: "Douleur dans la tête — pression, pulsation ou serrement, localisée ou diffuse",
  dizziness: "Sensation de vertige, pièce qui tourne, instabilité même assis",
  tremors_general: "Tremblements des mains ou du corps, fins ou grossiers, au repos ou en mouvement",
  numbness: "Engourdissement, fourmillements, perte de sensibilité dans les extrémités (doigts, orteils, lèvres)",
  brain_fog: "Brouillard mental — difficulté à se concentrer, pensées ralenties, impression de coton",
  visual_disturbance: "Troubles visuels — vision floue, halos, points lumineux, difficultés de mise au point",
  // Cardiovascular
  palpitations: "Conscience anormale des battements du coeur — sensation de coeur qui saute ou bat fort",
  // Thermoregulation
  hot_flash: "Bouffée de chaleur soudaine, rougeur du visage, sensation de brûlure interne",
  cold_flash: "Frisson soudain, chair de poule, sensation de froid intense sans raison externe",
  // Psychological
  anxiety_spike: "Montée d'anxiété brutale — oppression, pensées catastrophiques, besoin de fuir",
  mood_crash: "Chute d'humeur soudaine — tristesse, irritabilité ou vide émotionnel inattendu",
  fatigue_sudden: "Fatigue brutale, comme si l'énergie était coupée d'un coup",
  // Musculoskeletal
  muscle_tension: "Tensions musculaires — raideur dans la nuque, épaules, mâchoire ou dos",
};

const PERIOD_LABELS: Record<string, string> = {
  morning: '🌅 Matin',
  afternoon: '☀️ Après-midi',
  evening: '🌆 Soirée',
  night: '🌙 Nuit',
};

export default function Recommendation({
  refreshKey,
  onQuickLog,
  onSchedule,
}: {
  refreshKey: number;
  onQuickLog: (substance: string, details: Record<string, unknown>) => void;
  onSchedule?: (substance: string, details: Record<string, unknown>) => void;
}) {
  const [data, setData] = useState<RecResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingEffect, setLoggingEffect] = useState<string | null>(null);
  const [loggedEffects, setLoggedEffects] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    fetch('/api/tracker/recommend')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.recommendations) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-zinc-800 rounded w-1/3 mb-2" />
        <div className="h-6 bg-zinc-800 rounded w-2/3" />
      </div>
    );
  }

  if (!data) return null;

  const top = data.recommendations[0];
  const rest = data.recommendations.slice(1).filter((r) => r.priority > 0);
  const ctx = data.context;
  const bio = ctx.biometrics;
  const surv = data.surveillance;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      {/* Context bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">
            {PERIOD_LABELS[ctx.period] || ctx.period}
          </span>
          {bio && (
            <span className="text-xs text-zinc-600">
              {bio.stress != null && (
                <span className={bio.stress >= 60 ? 'text-red-400' : ''}>
                  σ{bio.stress}
                </span>
              )}
              {bio.body_battery != null && (
                <span className={`ml-2 ${bio.body_battery < 30 ? 'text-amber-400' : ''}`}>
                  ⚡{bio.body_battery}
                </span>
              )}
              {bio.hr != null && <span className="ml-2">♡{bio.hr}</span>}
            </span>
          )}
        </div>
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Recommandation</span>
      </div>

      {/* Top recommendation */}
      {top && (
        <div
          className="flex items-start gap-3 p-3 rounded-lg border mb-2"
          style={{
            borderColor: SUB_COLORS[top.substance] + '30',
            backgroundColor: SUB_COLORS[top.substance] + '08',
          }}
        >
          <span className="text-xl mt-0.5">{SUB_ICONS[top.substance] || '•'}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm" style={{ color: SUB_COLORS[top.substance] }}>
              {top.action}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">{top.reason}</div>
          </div>
          {top.substance !== 'none' && (
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => onQuickLog(top.substance, top.details)}
                className="px-3 py-1.5 rounded text-xs font-medium transition hover:opacity-80"
                style={{ backgroundColor: SUB_COLORS[top.substance], color: '#000' }}
              >
                Log
              </button>
              {onSchedule && (
                <button
                  onClick={() => onSchedule(top.substance, top.details)}
                  className="px-2 py-1.5 rounded text-xs font-medium border transition hover:opacity-80"
                  style={{ borderColor: SUB_COLORS[top.substance] + '60', color: SUB_COLORS[top.substance] }}
                >
                  Plan
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Secondary recommendations */}
      {rest.length > 0 && (
        <div className="space-y-1">
          {rest.map((rec, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800/40 transition">
              <span className="text-sm">{SUB_ICONS[rec.substance] || '•'}</span>
              <span className="text-xs text-zinc-400 flex-1 truncate">{rec.action}</span>
              <span className="text-[10px] text-zinc-600 shrink-0">{rec.reason}</span>
              {rec.substance !== 'none' && (
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onQuickLog(rec.substance, rec.details)}
                    className="text-[10px] px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 transition"
                  >
                    log
                  </button>
                  {onSchedule && (
                    <button
                      onClick={() => onSchedule(rec.substance, rec.details)}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-indigo-500/30 text-indigo-400/60 hover:text-indigo-300 transition"
                    >
                      plan
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Surveillance section — active interaction monitoring */}
      {surv?.active && (
        <div className={`mt-3 rounded-lg border p-3 ${
          surv.max_severity === 'high'
            ? 'border-red-500/40 bg-red-500/5'
            : surv.max_severity === 'moderate'
            ? 'border-amber-500/30 bg-amber-500/5'
            : 'border-zinc-700 bg-zinc-800/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">
              {surv.max_severity === 'high' ? '🚨' : surv.max_severity === 'moderate' ? '⚠️' : '👁️'}
            </span>
            <span className={`text-xs font-medium uppercase tracking-wider ${
              surv.max_severity === 'high' ? 'text-red-400' : surv.max_severity === 'moderate' ? 'text-amber-400' : 'text-zinc-400'
            }`}>
              Surveillance active
            </span>
          </div>

          {/* Active interaction alerts */}
          <div className="space-y-1.5 mb-3">
            {surv.alerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full ${
                  alert.severity === 'high' ? 'bg-red-400' : alert.severity === 'moderate' ? 'bg-amber-400' : 'bg-zinc-500'
                }`} />
                <span className="text-zinc-400">
                  <span className="font-medium">
                    {alert.substances.map(s => SUB_ICONS[s] || '').join(' + ')}
                  </span>
                  {' '}{alert.note}
                </span>
              </div>
            ))}
          </div>

          {/* Symptoms to monitor */}
          {surv.symptoms.length > 0 && (
            <div className="mb-3">
              <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">
                Symptomes a surveiller
              </div>
              <div className="flex flex-wrap gap-1.5">
                {surv.symptoms.map((sym) => (
                  <span
                    key={sym.key}
                    title={SYMPTOM_TOOLTIPS[sym.key] || sym.label}
                    className={`text-[10px] px-1.5 py-0.5 rounded border cursor-help ${
                      sym.severity === 'high'
                        ? 'border-red-500/30 text-red-400/80 bg-red-500/5'
                        : sym.severity === 'moderate'
                        ? 'border-amber-500/20 text-amber-400/70 bg-amber-500/5'
                        : 'border-zinc-700 text-zinc-500'
                    }`}
                  >
                    {sym.icon} {sym.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Adverse effect quick-log buttons */}
          {surv.adverse_effects.length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">
                Signaler un effet
              </div>
              <div className="flex flex-wrap gap-1.5">
                {surv.adverse_effects.map((effect) => (
                  <button
                    key={effect.key}
                    title={SYMPTOM_TOOLTIPS[effect.key] || effect.label}
                    disabled={loggingEffect === effect.key || loggedEffects.has(effect.key)}
                    onClick={async () => {
                      setLoggingEffect(effect.key);
                      try {
                        const res = await fetch('/api/tracker/adverse', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            effect: effect.key,
                            severity: surv.symptoms.find(s => s.key === effect.key)?.severity || 'unknown',
                            notes: '',
                          }),
                        });
                        if (res.ok) {
                          setLoggedEffects(prev => new Set(prev).add(effect.key));
                        }
                      } catch { /* network error — button stays enabled for retry */ }
                      setLoggingEffect(null);
                    }}
                    className={`text-xs px-2 py-1 rounded border transition ${
                      loggedEffects.has(effect.key)
                        ? 'border-red-500/40 text-red-300 bg-red-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5'
                    }`}
                  >
                    {loggingEffect === effect.key ? '...' : loggedEffects.has(effect.key) ? `${effect.icon} ${effect.label} ✓` : `${effect.icon} ${effect.label}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
