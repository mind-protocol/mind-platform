'use client';

import { useState } from 'react';

interface SensationCategory {
  key: string;
  label: string;
  icon: string;
  items: SensationItem[];
}

interface SensationItem {
  key: string;
  label: string;
  icon: string;
}

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

const SENSATION_CATEGORIES: SensationCategory[] = [
  {
    key: 'gastrointestinal',
    label: 'Gastro-intestinal',
    icon: '🤢',
    items: [
      { key: 'nausea', label: 'Nausée', icon: '🤢' },
      { key: 'retching', label: 'Haut-le-coeur', icon: '😫' },
      { key: 'vomiting', label: 'Vomissement', icon: '🤮' },
      { key: 'diarrhea', label: 'Diarrhée', icon: '🚽' },
      { key: 'stomach_pain', label: 'Douleur abdominale', icon: '🫄' },
    ],
  },
  {
    key: 'respiratory',
    label: 'Respiratoire',
    icon: '🫁',
    items: [
      { key: 'breathing_shallow', label: 'Haute / superficielle', icon: '🫁' },
      { key: 'breathing_blocked', label: 'Bloquée', icon: '🚫' },
      { key: 'breathing_panting', label: 'Haletante', icon: '💨' },
      { key: 'respiratory_slow', label: 'Lente', icon: '🐢' },
      { key: 'hyperventilation', label: 'Hyperventilation', icon: '🌬️' },
      { key: 'chest_tightness', label: 'Oppression thoracique', icon: '🫀' },
    ],
  },
  {
    key: 'neurological',
    label: 'Neurologique',
    icon: '🧠',
    items: [
      { key: 'headache', label: 'Céphalée', icon: '🤕' },
      { key: 'dizziness', label: 'Vertiges', icon: '💫' },
      { key: 'tremors_general', label: 'Tremblements', icon: '🫨' },
      { key: 'numbness', label: 'Engourdissement', icon: '🧊' },
      { key: 'brain_fog', label: 'Brouillard mental', icon: '🌫️' },
      { key: 'visual_disturbance', label: 'Troubles visuels', icon: '👁️' },
    ],
  },
  {
    key: 'cardiovascular',
    label: 'Cardiovasculaire',
    icon: '💗',
    items: [
      { key: 'tachycardia', label: 'Tachycardie', icon: '💓' },
      { key: 'palpitations', label: 'Palpitations', icon: '💗' },
      { key: 'hypotension', label: 'Vertige orthostatique', icon: '⬇️' },
    ],
  },
  {
    key: 'thermoregulation',
    label: 'Thermorégulation',
    icon: '🌡️',
    items: [
      { key: 'hot_flash', label: 'Bouffée de chaleur', icon: '🥵' },
      { key: 'cold_flash', label: 'Frisson / froid', icon: '🥶' },
      { key: 'sweating', label: 'Sueurs', icon: '💦' },
      { key: 'hyperthermia', label: 'Fièvre', icon: '🌡️' },
    ],
  },
  {
    key: 'psychological',
    label: 'Psychologique',
    icon: '🧠',
    items: [
      { key: 'anxiety_spike', label: "Pic d'anxiété", icon: '😰' },
      { key: 'mood_crash', label: "Chute d'humeur", icon: '📉' },
      { key: 'agitation', label: 'Agitation', icon: '⚡' },
      { key: 'confusion', label: 'Confusion', icon: '🌀' },
      { key: 'fatigue_sudden', label: 'Fatigue soudaine', icon: '🔋' },
    ],
  },
  {
    key: 'musculoskeletal',
    label: 'Musculaire',
    icon: '💪',
    items: [
      { key: 'myoclonus', label: 'Contractions', icon: '💪' },
      { key: 'ataxia', label: "Perte d'équilibre", icon: '🥴' },
      { key: 'muscle_tension', label: 'Tensions', icon: '🔗' },
    ],
  },
];

const SEVERITY_OPTIONS = [
  { key: 'mild', label: 'Léger', color: '#facc15' },
  { key: 'moderate', label: 'Modéré', color: '#f97316' },
  { key: 'severe', label: 'Sévère', color: '#ef4444' },
];

export default function SensationLogger({ onLogged }: { onLogged: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedEffects, setSelectedEffects] = useState<
    Map<string, { severity: string; notes: string }>
  >(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const toggleEffect = (key: string) => {
    setSelectedEffects((prev) => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.set(key, { severity: 'mild', notes: '' });
      }
      return next;
    });
  };

  const setSeverity = (key: string, severity: string) => {
    setSelectedEffects((prev) => {
      const next = new Map(prev);
      const existing = next.get(key);
      if (existing) next.set(key, { ...existing, severity });
      return next;
    });
  };

  const submit = async () => {
    if (selectedEffects.size === 0) return;
    setSubmitting(true);
    setFeedback('');

    let ok = 0;
    for (const [key, { severity, notes }] of selectedEffects) {
      try {
        const res = await fetch('/api/tracker/adverse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ effect: key, severity, notes }),
        });
        if (res.ok) ok++;
      } catch {
        // continue
      }
    }

    if (ok > 0) {
      setFeedback(`${ok} effet${ok > 1 ? 's' : ''} enregistré${ok > 1 ? 's' : ''}`);
      setSelectedEffects(new Map());
      onLogged();
      setTimeout(() => setFeedback(''), 3000);
    } else {
      setFeedback('Erreur');
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/40 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🩺</span>
          <span className="text-sm font-medium text-zinc-300">
            Sensations & Effets secondaires
          </span>
          {selectedEffects.size > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              {selectedEffects.size}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {feedback && (
            <span className="text-xs text-green-400">{feedback}</span>
          )}
          <span className={`text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {SENSATION_CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">
                {cat.icon} {cat.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => {
                  const isSelected = selectedEffects.has(item.key);
                  const severity = selectedEffects.get(item.key)?.severity;
                  const severityColor =
                    severity === 'severe'
                      ? 'border-red-500/50 bg-red-500/15 text-red-300'
                      : severity === 'moderate'
                      ? 'border-orange-500/50 bg-orange-500/15 text-orange-300'
                      : isSelected
                      ? 'border-yellow-500/50 bg-yellow-500/15 text-yellow-300'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600';

                  return (
                    <div key={item.key} className="flex flex-col items-start gap-0.5">
                      <button
                        onClick={() => toggleEffect(item.key)}
                        title={SYMPTOM_TOOLTIPS[item.key] || item.label}
                        className={`text-xs px-2 py-1 rounded border transition ${severityColor}`}
                      >
                        {item.icon} {item.label}
                      </button>
                      {isSelected && (
                        <div className="flex gap-0.5 ml-0.5">
                          {SEVERITY_OPTIONS.map((sev) => (
                            <button
                              key={sev.key}
                              onClick={() => setSeverity(item.key, sev.key)}
                              className={`text-[9px] px-1 py-0.5 rounded transition ${
                                severity === sev.key
                                  ? 'text-black font-medium'
                                  : 'text-zinc-600 hover:text-zinc-400'
                              }`}
                              style={
                                severity === sev.key
                                  ? { backgroundColor: sev.color }
                                  : undefined
                              }
                            >
                              {sev.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {selectedEffects.size > 0 && (
            <div className="pt-2 border-t border-zinc-800">
              <button
                onClick={submit}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50"
              >
                {submitting
                  ? 'Enregistrement...'
                  : `Enregistrer ${selectedEffects.size} effet${selectedEffects.size > 1 ? 's' : ''}`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
