'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Practice Types ────────────────────────────────────────────────────

type PracticeCategory = 'yoga' | 'breathwork' | 'meditation' | 'movement';

interface Practice {
  id: string;
  name: string;
  category: PracticeCategory;
  style: string;
  duration_min: number;
  description: string;
  /** When to recommend based on cockpit state */
  when: {
    bb_max?: number;     // recommend when BB below this
    bb_min?: number;     // recommend when BB above this
    stress_min?: number; // recommend when stress above this
    stress_max?: number; // recommend when stress below this
    time_of_day?: 'morning' | 'evening' | 'night' | 'any';
    intent?: string[];   // coping, performance, recovery, etc.
  };
  /** Poses/steps if applicable */
  poses?: PoseStep[];
  /** ANS target */
  ans_target: 'parasympathetic' | 'sympathetic' | 'balanced';
  /** Intensity 0-1 */
  intensity: number;
  icon: string;
}

interface PoseStep {
  name: string;
  duration_sec: number;
  cue: string;
  side?: 'left' | 'right' | 'both';
}

interface SessionLog {
  id: string;
  practice_id: string;
  started_at: string;
  ended_at?: string;
  bio_before?: BiometricSnapshot;
  bio_after?: BiometricSnapshot;
  completed: boolean;
  notes?: string;
}

interface BiometricSnapshot {
  hr?: number;
  stress?: number;
  body_battery?: number;
  hrv?: number;
}

// ─── Practice Library ──────────────────────────────────────────────────

const PRACTICES: Practice[] = [
  // ── Yoga Yin ──
  {
    id: 'yin-recovery',
    name: 'Yin Récupération',
    category: 'yoga',
    style: 'yin',
    duration_min: 25,
    description: 'Poses longues au sol, relâchement profond des fascias. Idéal BB < 30.',
    when: { bb_max: 35, stress_min: 30, time_of_day: 'any', intent: ['recovery', 'coping'] },
    ans_target: 'parasympathetic',
    intensity: 0.15,
    icon: '🧘',
    poses: [
      { name: 'Child\'s Pose', duration_sec: 180, cue: 'Front du corps déposé, bras allongés ou le long du corps' },
      { name: 'Sphinx', duration_sec: 180, cue: 'Avant-bras au sol, coeur ouvert, respiration dans le bas du dos' },
      { name: 'Pigeon (gauche)', duration_sec: 180, cue: 'Hanche gauche ouverte, relâcher le poids du corps', side: 'left' },
      { name: 'Pigeon (droite)', duration_sec: 180, cue: 'Hanche droite ouverte, respiration dans la hanche', side: 'right' },
      { name: 'Caterpillar', duration_sec: 240, cue: 'Flexion avant, laisser le dos arrondir, tête lourde' },
      { name: 'Reclined Twist (gauche)', duration_sec: 150, cue: 'Genoux à gauche, épaules au sol', side: 'left' },
      { name: 'Reclined Twist (droite)', duration_sec: 150, cue: 'Genoux à droite, épaules au sol', side: 'right' },
      { name: 'Savasana', duration_sec: 300, cue: 'Immobile. Observe la respiration naturelle. Lâche tout.' },
    ],
  },
  {
    id: 'yin-sleep',
    name: 'Yin Nuit',
    category: 'yoga',
    style: 'yin',
    duration_min: 15,
    description: 'Séquence courte pré-sommeil. Down-regulation du système nerveux.',
    when: { bb_max: 40, time_of_day: 'night', intent: ['recovery'] },
    ans_target: 'parasympathetic',
    intensity: 0.1,
    icon: '🌙',
    poses: [
      { name: 'Legs Up The Wall', duration_sec: 180, cue: 'Jambes contre le mur, bras ouverts, yeux fermés' },
      { name: 'Supta Baddha Konasana', duration_sec: 180, cue: 'Plantes de pieds ensemble, genoux ouverts, coussins sous les cuisses' },
      { name: 'Reclined Twist (gauche)', duration_sec: 120, cue: 'Genoux à gauche, bras en T', side: 'left' },
      { name: 'Reclined Twist (droite)', duration_sec: 120, cue: 'Genoux à droite, relâcher les épaules', side: 'right' },
      { name: 'Savasana', duration_sec: 300, cue: 'Scan corporel des pieds à la tête. Chaque expiration, plus lourd.' },
    ],
  },
  // ── Yoga Yang / Vinyasa ──
  {
    id: 'vinyasa-energy',
    name: 'Vinyasa Énergie',
    category: 'yoga',
    style: 'vinyasa',
    duration_min: 30,
    description: 'Flow dynamique pour activer le corps. BB > 40 recommandé.',
    when: { bb_min: 40, stress_max: 50, time_of_day: 'morning', intent: ['performance'] },
    ans_target: 'sympathetic',
    intensity: 0.6,
    icon: '🔥',
    poses: [
      { name: 'Sun Salutation A x5', duration_sec: 300, cue: 'Inspir = extension, expir = flexion. Rythme soutenu.' },
      { name: 'Warrior I → II Flow', duration_sec: 180, cue: 'Enchaîner Warrior I et II à chaque respiration', side: 'both' },
      { name: 'Chaturanga Flow', duration_sec: 120, cue: 'Plank → Chaturanga → Updog → Downdog. 5 cycles.' },
      { name: 'Standing Balance (Arbre)', duration_sec: 120, cue: 'Enracinement, regard fixe, 1 min par côté', side: 'both' },
      { name: 'Chair Pose Hold', duration_sec: 60, cue: 'Cuisses parallèles, bras au ciel, respirer dans l\'effort' },
      { name: 'Cool Down + Savasana', duration_sec: 300, cue: 'Forward fold → pigeon passif → savasana 3min' },
    ],
  },
  {
    id: 'vinyasa-flow',
    name: 'Vinyasa Flow Doux',
    category: 'yoga',
    style: 'vinyasa_flow',
    duration_min: 20,
    description: 'Flow fluide, transitions douces. Stable → flow transition.',
    when: { bb_min: 30, stress_max: 60, time_of_day: 'any', intent: ['performance', 'recovery'] },
    ans_target: 'balanced',
    intensity: 0.4,
    icon: '🌊',
    poses: [
      { name: 'Cat-Cow Flow', duration_sec: 120, cue: 'Synchroniser mouvement et respiration. Lent.' },
      { name: 'Sun Salutation B x3', duration_sec: 240, cue: 'Avec Warrior I intégré. Respiration Ujjayi.' },
      { name: 'Low Lunge → Half Split', duration_sec: 180, cue: 'Transition fluide entre les deux, 3x par côté', side: 'both' },
      { name: 'Seated Twist', duration_sec: 120, cue: 'Inspir = allonger, expir = tourner plus loin', side: 'both' },
      { name: 'Bridge Pose', duration_sec: 90, cue: 'Monter sur inspir, tenir 5 respirations, descendre' },
      { name: 'Savasana', duration_sec: 180, cue: 'Intégration. Observer les sensations post-flow.' },
    ],
  },
  // ── Chi / Tai Chi ──
  {
    id: 'chi-grounding',
    name: 'Chi Grounding',
    category: 'yoga',
    style: 'chi',
    duration_min: 15,
    description: 'Mouvements lents d\'ancrage. Circulation Qi. Idéal haute alteration.',
    when: { stress_min: 40, time_of_day: 'any', intent: ['coping', 'recovery'] },
    ans_target: 'parasympathetic',
    intensity: 0.2,
    icon: '☯️',
    poses: [
      { name: 'Wuji (Standing Still)', duration_sec: 120, cue: 'Pieds parallèles, genoux micro-fléchis, mains au dantian' },
      { name: 'Cloud Hands', duration_sec: 180, cue: 'Poids alternant gauche-droite, mains dessinent des cercles' },
      { name: 'Lifting Water', duration_sec: 120, cue: 'Inspir = mains montent, expir = mains descendent doucement' },
      { name: 'Brush Knee Push', duration_sec: 180, cue: 'Pas avant, main pousse, autre main balaie le genou', side: 'both' },
      { name: 'Closing Form', duration_sec: 120, cue: 'Mains au dantian, 3 respirations profondes, immobilité' },
    ],
  },
  // ── Breathwork ──
  {
    id: 'coherence',
    name: 'Cohérence Cardiaque',
    category: 'breathwork',
    style: 'coherence',
    duration_min: 5,
    description: '5 secondes inspir, 5 secondes expir. 6 cycles/min. Reset vagal.',
    when: { stress_min: 50, time_of_day: 'any', intent: ['coping'] },
    ans_target: 'parasympathetic',
    intensity: 0.1,
    icon: '💓',
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    category: 'breathwork',
    style: 'box',
    duration_min: 5,
    description: '4-4-4-4 : inspir, rétention, expir, rétention. Contrôle total.',
    when: { stress_min: 40, time_of_day: 'any', intent: ['performance', 'coping'] },
    ans_target: 'balanced',
    intensity: 0.15,
    icon: '📦',
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof (3 rounds)',
    category: 'breathwork',
    style: 'wim_hof',
    duration_min: 15,
    description: '30 respirations rapides → rétention max → recovery breath. x3.',
    when: { bb_min: 30, time_of_day: 'morning', intent: ['performance'] },
    ans_target: 'sympathetic',
    intensity: 0.5,
    icon: '🧊',
  },
  {
    id: 'physiological-sigh',
    name: 'Soupir Physiologique',
    category: 'breathwork',
    style: 'sigh',
    duration_min: 2,
    description: 'Double inspir nasal court + long expir bouche. Désamorce le stress en 30s.',
    when: { stress_min: 60, time_of_day: 'any', intent: ['coping'] },
    ans_target: 'parasympathetic',
    intensity: 0.05,
    icon: '😮‍💨',
  },
  // ── Meditation ──
  {
    id: 'body-scan',
    name: 'Body Scan',
    category: 'meditation',
    style: 'body_scan',
    duration_min: 10,
    description: 'Scan attentionnel des pieds à la tête. Conscience intéroceptive.',
    when: { time_of_day: 'any', intent: ['recovery', 'coping'] },
    ans_target: 'parasympathetic',
    intensity: 0.1,
    icon: '🔍',
  },
  {
    id: 'zazen',
    name: 'Zazen (Assise)',
    category: 'meditation',
    style: 'zazen',
    duration_min: 20,
    description: 'Posture immobile, attention sur la respiration. Observation sans jugement.',
    when: { bb_min: 20, time_of_day: 'any', intent: ['performance', 'recovery'] },
    ans_target: 'balanced',
    intensity: 0.15,
    icon: '🪷',
  },
  // ── Movement ──
  {
    id: 'walk-mindful',
    name: 'Marche Consciente',
    category: 'movement',
    style: 'walk',
    duration_min: 15,
    description: 'Marche lente, attention sur chaque pas. Ancrage + circulation.',
    when: { bb_min: 15, time_of_day: 'any', intent: ['recovery'] },
    ans_target: 'balanced',
    intensity: 0.2,
    icon: '🚶',
  },
];

// ─── Component ─────────────────────────────────────────────────────────

interface PracticesProps {
  refreshKey?: number;
}

export default function Practices({ refreshKey }: PracticesProps) {
  const [bio, setBio] = useState<BiometricSnapshot>({});
  const [filter, setFilter] = useState<PracticeCategory | 'all' | 'recommended'>('recommended');
  const [activePractice, setActivePractice] = useState<Practice | null>(null);
  const [sessionState, setSessionState] = useState<{
    running: boolean;
    poseIndex: number;
    elapsed: number;
    bioStart: BiometricSnapshot;
  } | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionLog[]>([]);

  // Fetch current biometrics for recommendations
  useEffect(() => {
    fetch('/api/tracker/correlation?days=0.01')
      .then(r => r.json())
      .then(d => {
        const ts = d.timeseries || [];
        if (ts.length > 0) {
          const latest = ts[ts.length - 1];
          setBio({
            hr: latest.hr ?? undefined,
            stress: latest.stress ?? undefined,
            body_battery: latest.body_battery ?? undefined,
          });
        }
      })
      .catch(() => {});
  }, [refreshKey]);

  // Load session history
  useEffect(() => {
    try {
      const saved = localStorage.getItem('practice-history');
      if (saved) setSessionHistory(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Timer for active session
  useEffect(() => {
    if (!sessionState?.running) return;
    const id = setInterval(() => {
      setSessionState(prev => prev ? { ...prev, elapsed: prev.elapsed + 1 } : null);
    }, 1000);
    return () => clearInterval(id);
  }, [sessionState?.running]);

  // Get recommended practices based on current state
  const getRecommended = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay = hour < 7 ? 'night' : hour < 12 ? 'morning' : hour < 20 ? 'any' : 'evening';

    return PRACTICES.filter(p => {
      const w = p.when;
      if (w.bb_max != null && bio.body_battery != null && bio.body_battery > w.bb_max) return false;
      if (w.bb_min != null && bio.body_battery != null && bio.body_battery < w.bb_min) return false;
      if (w.stress_min != null && bio.stress != null && bio.stress < w.stress_min) return false;
      if (w.stress_max != null && bio.stress != null && bio.stress > w.stress_max) return false;
      if (w.time_of_day && w.time_of_day !== 'any' && w.time_of_day !== timeOfDay) return false;
      return true;
    }).sort((a, b) => {
      // Prioritize by relevance to current state
      let scoreA = 0, scoreB = 0;
      if (bio.body_battery != null && bio.body_battery < 20) {
        scoreA += a.ans_target === 'parasympathetic' ? 2 : 0;
        scoreB += b.ans_target === 'parasympathetic' ? 2 : 0;
      }
      if (bio.stress != null && bio.stress > 60) {
        scoreA += a.ans_target === 'parasympathetic' ? 2 : 0;
        scoreB += b.ans_target === 'parasympathetic' ? 2 : 0;
      }
      scoreA += (1 - a.intensity);
      scoreB += (1 - b.intensity);
      return scoreB - scoreA;
    });
  }, [bio]);

  const recommended = getRecommended();
  const filtered = filter === 'all' ? PRACTICES
    : filter === 'recommended' ? recommended
    : PRACTICES.filter(p => p.category === filter);

  // Start a practice session
  const startSession = (practice: Practice) => {
    setActivePractice(practice);
    setSessionState({
      running: true,
      poseIndex: 0,
      elapsed: 0,
      bioStart: { ...bio },
    });
  };

  // Complete session
  const completeSession = () => {
    if (!activePractice || !sessionState) return;
    const log: SessionLog = {
      id: `${Date.now()}`,
      practice_id: activePractice.id,
      started_at: new Date(Date.now() - sessionState.elapsed * 1000).toISOString(),
      ended_at: new Date().toISOString(),
      bio_before: sessionState.bioStart,
      bio_after: { ...bio },
      completed: true,
    };
    const updated = [log, ...sessionHistory].slice(0, 50);
    setSessionHistory(updated);
    localStorage.setItem('practice-history', JSON.stringify(updated));

    // Also log to backend yoga analyzer
    fetch('/api/tracker/yoga/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        style: activePractice.style,
        duration: activePractice.duration_min,
        bio_before: sessionState.bioStart,
      }),
    }).catch(() => {});

    setActivePractice(null);
    setSessionState(null);
  };

  const cancelSession = () => {
    setActivePractice(null);
    setSessionState(null);
  };

  // Format seconds as mm:ss
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
    recommended: { label: 'Pour toi', icon: '✨', color: 'text-amber-400 border-amber-500/30' },
    all: { label: 'Tout', icon: '📋', color: 'text-zinc-400 border-zinc-600' },
    yoga: { label: 'Yoga', icon: '🧘', color: 'text-purple-400 border-purple-500/30' },
    breathwork: { label: 'Respiration', icon: '🌬️', color: 'text-cyan-400 border-cyan-500/30' },
    meditation: { label: 'Méditation', icon: '🪷', color: 'text-indigo-400 border-indigo-500/30' },
    movement: { label: 'Mouvement', icon: '🚶', color: 'text-green-400 border-green-500/30' },
  };

  // ── Active Session View ──
  if (activePractice && sessionState) {
    const poses = activePractice.poses || [];
    const currentPose = poses[sessionState.poseIndex];
    const totalPoseDuration = poses.reduce((s, p) => s + p.duration_sec, 0);
    const elapsedInPose = sessionState.elapsed - poses.slice(0, sessionState.poseIndex).reduce((s, p) => s + p.duration_sec, 0);
    const poseProgress = currentPose ? Math.min(1, elapsedInPose / currentPose.duration_sec) : 0;

    // Auto-advance pose
    if (currentPose && elapsedInPose >= currentPose.duration_sec && sessionState.poseIndex < poses.length - 1) {
      setSessionState(prev => prev ? { ...prev, poseIndex: prev.poseIndex + 1 } : null);
    }

    return (
      <div className="space-y-4">
        {/* Session header */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activePractice.icon}</span>
              <span className="font-mono font-bold text-sm">{activePractice.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono text-white">{fmtTime(sessionState.elapsed)}</span>
              <span className="text-xs text-zinc-500">/ {activePractice.duration_min}min</span>
            </div>
          </div>

          {/* Global progress */}
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-purple-500 to-cyan-400"
              style={{ width: `${Math.min(100, (sessionState.elapsed / (activePractice.duration_min * 60)) * 100)}%` }}
            />
          </div>

          {/* Current pose */}
          {currentPose ? (
            <div className="bg-zinc-950/60 border border-zinc-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">{currentPose.name}</span>
                <span className="text-xs font-mono text-zinc-500">
                  {sessionState.poseIndex + 1}/{poses.length}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mb-2">{currentPose.cue}</p>
              {currentPose.side && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {currentPose.side === 'left' ? 'Gauche' : currentPose.side === 'right' ? 'Droite' : 'Les deux côtés'}
                </span>
              )}
              {/* Pose timer bar */}
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${poseProgress * 100}%`,
                    backgroundColor: poseProgress > 0.8 ? '#f59e0b' : '#818cf8',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-zinc-600 font-mono">{fmtTime(Math.max(0, elapsedInPose))}</span>
                <span className="text-[10px] text-zinc-600 font-mono">{fmtTime(currentPose.duration_sec)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-400">Session libre — pas de poses guidées</p>
              <p className="text-xs text-zinc-600 mt-1">Suis ton rythme</p>
            </div>
          )}

          {/* Pose list */}
          {poses.length > 0 && (
            <div className="mt-3 space-y-1">
              {poses.map((pose, i) => (
                <button
                  key={i}
                  onClick={() => setSessionState(prev => prev ? { ...prev, poseIndex: i } : null)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] transition ${
                    i === sessionState.poseIndex
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      : i < sessionState.poseIndex
                        ? 'text-zinc-600 line-through'
                        : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span>{pose.name}</span>
                  <span className="font-mono">{fmtTime(pose.duration_sec)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setSessionState(prev => prev ? { ...prev, running: !prev.running } : null)}
              className="flex-1 py-2 rounded-lg text-sm font-mono border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
            >
              {sessionState.running ? 'Pause' : 'Reprendre'}
            </button>
            <button
              onClick={completeSession}
              className="flex-1 py-2 rounded-lg text-sm font-mono bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition"
            >
              Terminer
            </button>
            <button
              onClick={cancelSession}
              className="px-3 py-2 rounded-lg text-sm font-mono border border-zinc-800 text-zinc-600 hover:text-red-400 hover:border-red-500/30 transition"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Library View ──
  return (
    <div className="space-y-4">
      {/* Current state banner */}
      {(bio.stress != null || bio.body_battery != null) && (
        <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-lg px-3 py-2 flex items-center gap-3 text-[11px]">
          {bio.hr != null && (
            <span className="text-zinc-500">❤️ {bio.hr}</span>
          )}
          {bio.stress != null && (
            <span style={{ color: bio.stress > 50 ? '#ef4444' : '#a1a1aa' }}>⚡ {bio.stress}</span>
          )}
          {bio.body_battery != null && (
            <span style={{ color: bio.body_battery < 30 ? '#f59e0b' : '#22d3ee' }}>🔋 {bio.body_battery}</span>
          )}
          <span className="ml-auto text-zinc-600 font-mono">
            {recommended.length} pratique{recommended.length !== 1 ? 's' : ''} recommandée{recommended.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {Object.entries(CATEGORY_LABELS).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`flex-none flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] border transition ${
              filter === key
                ? `${cfg.color} bg-opacity-10`
                : 'text-zinc-600 border-zinc-800 hover:text-zinc-400'
            }`}
            style={filter === key ? { backgroundColor: `${cfg.color.includes('amber') ? '#f59e0b' : cfg.color.includes('purple') ? '#a855f7' : cfg.color.includes('cyan') ? '#06b6d4' : cfg.color.includes('indigo') ? '#818cf8' : cfg.color.includes('green') ? '#22c55e' : '#71717a'}10` } : undefined}
          >
            <span>{cfg.icon}</span>
            <span>{cfg.label}</span>
          </button>
        ))}
      </div>

      {/* Practice cards */}
      <div className="space-y-2">
        {filtered.map(practice => (
          <div
            key={practice.id}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-lg p-3 hover:border-zinc-700 transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{practice.icon}</span>
                <div>
                  <div className="text-sm font-medium text-zinc-200">{practice.name}</div>
                  <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                    <span>{practice.duration_min} min</span>
                    <span>·</span>
                    <span className={
                      practice.ans_target === 'parasympathetic' ? 'text-blue-400' :
                      practice.ans_target === 'sympathetic' ? 'text-orange-400' : 'text-zinc-400'
                    }>
                      {practice.ans_target === 'parasympathetic' ? '↓ Para' :
                       practice.ans_target === 'sympathetic' ? '↑ Sympa' : '⇄ Équilibre'}
                    </span>
                    {practice.poses && (
                      <>
                        <span>·</span>
                        <span>{practice.poses.length} poses</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => startSession(practice)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition opacity-70 group-hover:opacity-100"
              >
                Start
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">{practice.description}</p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-zinc-600 text-sm">
            Aucune pratique ne correspond à ton état actuel.
          </div>
        )}
      </div>

      {/* Recent sessions */}
      {sessionHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800/50">
          <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Sessions récentes</div>
          <div className="space-y-1">
            {sessionHistory.slice(0, 5).map(log => {
              const practice = PRACTICES.find(p => p.id === log.practice_id);
              if (!practice) return null;
              const duration = log.ended_at && log.started_at
                ? Math.round((new Date(log.ended_at).getTime() - new Date(log.started_at).getTime()) / 60000)
                : 0;
              return (
                <div key={log.id} className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span>{practice.icon}</span>
                    <span>{practice.name}</span>
                  </span>
                  <span className="font-mono text-zinc-600">
                    {duration}min · {new Date(log.started_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
