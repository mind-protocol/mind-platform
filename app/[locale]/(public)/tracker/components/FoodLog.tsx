'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  cal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

interface FoodEntry {
  id: string;
  ts: string;
  description: string;
  meal_type: string;
  items: FoodItem[];
  totals: { cal: number; protein_g: number; fat_g: number; carbs_g: number };
  notes: string;
  photo?: string;
  estimation_source?: string;
  biometrics_at_log?: Record<string, unknown>;
}

interface TodayStats {
  cal: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  meals: number;
}

const MEAL_ICONS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '🌞',
  dinner: '🌙',
  snack: '🍿',
  other: '🍽️',
};

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime'];
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

function autoMealType(): string {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h >= 11 && h < 15) return 'lunch';
  if (h >= 18 && h < 22) return 'dinner';
  return 'snack';
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function FoodLog({ refreshKey }: { refreshKey: number }) {
  const t = useTranslations('Tracker');
  const [description, setDescription] = useState('');
  const [mealType, setMealType] = useState(autoMealType);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Photo upload state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [todayStats, setTodayStats] = useState<TodayStats>({ cal: 0, protein_g: 0, fat_g: 0, carbs_g: 0, meals: 0 });
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    fetch('/api/tracker/food?days=7')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.entries) setEntries(d.entries); })
      .catch(() => {});
    fetch('/api/tracker/food-stats?days=1')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.today) setTodayStats(d.today); })
      .catch(() => {});
  }, []);

  useEffect(() => { fetchData(); }, [fetchData, refreshKey]);

  // Handle file selection (from input or drop)
  const handleFile = useCallback(async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFeedback('Type non supporté. Utilisez PNG, JPG, WebP, HEIC, MP4 ou MOV.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setFeedback('Fichier trop volumineux (max 20MB).');
      return;
    }

    setPhotoFile(file);
    setFeedback('');

    // Generate preview
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
      setPhotoPreview(null); // Video: no preview thumbnail
    }

    // Upload and analyze
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('meal_type', mealType);

      const res = await fetch('/api/tracker/food/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.description) {
          setDescription(data.description);
        }
        if (data.needs_description) {
          setFeedback('Photo enregistrée. Ajoutez une description pour analyser la nutrition.');
        } else {
          const cal = data.totals?.cal || 0;
          setFeedback(`Analysé — ${cal} cal (${data.items?.length || 0} items détectés)`);
          fetchData();
          // Auto-clear after successful vision log
          setTimeout(() => {
            setPhotoFile(null);
            setPhotoPreview(null);
            setDescription('');
            setFeedback('');
          }, 3000);
        }
      } else {
        const err = await res.json();
        setFeedback(err.error || 'Échec de l\'upload');
      }
    } catch {
      setFeedback('Erreur réseau');
    } finally {
      setAnalyzing(false);
    }
  }, [mealType, fetchData]);

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleFile]);

  const clearPhoto = () => {
    setPhotoFile(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
  };

  // Text-only submit (existing behavior)
  const submit = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    setFeedback('');
    try {
      const res = await fetch('/api/tracker/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim(), meal_type: mealType, notes }),
      });
      if (res.ok) {
        const entry = await res.json();
        setFeedback(`Logged — ${entry.totals?.cal || 0} cal`);
        setDescription('');
        setNotes('');
        clearPhoto();
        fetchData();
        setTimeout(() => setFeedback(''), 3000);
      } else {
        const err = await res.json();
        setFeedback(err.error || 'Failed');
      }
    } catch {
      setFeedback(t('networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  // Group entries by date
  const grouped: Record<string, FoodEntry[]> = {};
  for (const e of entries) {
    const date = e.ts.slice(0, 10);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(e);
  }
  const dates = Object.keys(grouped).sort().reverse();

  const totalCal = todayStats.cal;
  const totalP = todayStats.protein_g;
  const totalF = todayStats.fat_g;
  const totalC = todayStats.carbs_g;
  const macroTotal = totalP + totalF + totalC || 1;

  const isDisabled = submitting || analyzing;

  return (
    <div className="space-y-4">
      {/* Header + daily summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          🍽️ {t('foodTracker')}
        </h2>
        {todayStats.meals > 0 && (
          <div className="text-xs text-zinc-400 flex items-center gap-3">
            <span className="text-orange-400 font-mono font-medium">{totalCal} cal</span>
            <span>{totalP}g prot</span>
            <span>{totalF}g fat</span>
            <span>{totalC}g carbs</span>
          </div>
        )}
      </div>

      {/* Macro bar */}
      {todayStats.meals > 0 && (
        <div className="h-2 rounded-full overflow-hidden flex bg-zinc-800">
          <div
            className="h-full transition-all"
            style={{ width: `${(totalP / macroTotal) * 100}%`, backgroundColor: '#ef4444' }}
            title={`Protein ${totalP}g`}
          />
          <div
            className="h-full transition-all"
            style={{ width: `${(totalF / macroTotal) * 100}%`, backgroundColor: '#eab308' }}
            title={`Fat ${totalF}g`}
          />
          <div
            className="h-full transition-all"
            style={{ width: `${(totalC / macroTotal) * 100}%`, backgroundColor: '#3b82f6' }}
            title={`Carbs ${totalC}g`}
          />
        </div>
      )}

      {/* Input form */}
      <div
        className={`bg-zinc-900 border rounded-lg p-4 transition-colors ${
          dragOver ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-800'
        }`}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Photo drop zone / preview */}
        {!photoFile && !analyzing && (
          <div
            className="mb-3 border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-800/50 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/heic,video/mp4,video/quicktime"
              className="hidden"
              onChange={handleFileInput}
              disabled={isDisabled}
            />
            <div className="text-zinc-500 text-sm">
              <span className="text-lg">📸</span>
              <p className="mt-1">Glissez une photo ou cliquez pour uploader</p>
              <p className="text-xs text-zinc-600 mt-0.5">PNG, JPG, WebP, HEIC, MP4, MOV — max 20MB</p>
            </div>
          </div>
        )}

        {/* Analyzing spinner */}
        {analyzing && (
          <div className="mb-3 border border-orange-500/30 rounded-lg p-4 bg-orange-500/5 flex items-center gap-3">
            {photoPreview && (
              <img src={photoPreview} alt="food" className="w-16 h-16 rounded object-cover shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-orange-400">Analyse en cours...</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">GPT-4o identifie les aliments et estime la nutrition</p>
            </div>
          </div>
        )}

        {/* Photo preview (after analysis) */}
        {photoFile && !analyzing && (
          <div className="mb-3 flex items-start gap-3">
            {photoPreview && (
              <img src={photoPreview} alt="food" className="w-20 h-20 rounded-lg object-cover shrink-0 border border-zinc-700" />
            )}
            {!photoPreview && photoFile.type.startsWith('video/') && (
              <div className="w-20 h-20 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <span className="text-2xl">🎬</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 truncate">{photoFile.name}</span>
                <button
                  onClick={clearPhoto}
                  className="text-zinc-500 hover:text-zinc-300 text-xs ml-2 shrink-0"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">{(photoFile.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
        )}

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={photoFile ? 'Description auto-remplie par la vision...' : 'Décrivez ce que vous mangez... (ex: 2 crêpes avec sucre de coco)'}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
          rows={2}
          disabled={isDisabled}
        />

        <div className="flex items-center justify-between mt-3">
          {/* Meal type pills */}
          <div className="flex gap-1.5">
            {Object.entries(MEAL_ICONS).filter(([k]) => k !== 'other').map(([key, icon]) => (
              <button
                key={key}
                onClick={() => setMealType(key)}
                className={`px-2.5 py-1 rounded-full text-xs border transition ${
                  mealType === key
                    ? 'border-orange-500/50 text-orange-400 bg-orange-500/10'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {icon} {key}
              </button>
            ))}
          </div>

          <button
            onClick={submit}
            disabled={isDisabled || !description.trim()}
            className="px-5 py-2 rounded font-medium text-sm transition disabled:opacity-40 bg-orange-500 text-black"
          >
            {submitting ? t('analyzing') : 'Log'}
          </button>
        </div>

        {feedback && (
          <div className={`mt-2 text-xs ${feedback.includes('Analysé') || feedback.includes('Logged') ? 'text-green-400' : 'text-zinc-400'}`}>
            {feedback}
          </div>
        )}
      </div>

      {/* Food timeline */}
      {dates.map((date) => (
        <div key={date}>
          <div className="text-xs text-zinc-600 font-medium mb-2">
            {date === new Date().toISOString().slice(0, 10) ? "Aujourd'hui" : new Date(date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
          <div className="space-y-1.5">
            {grouped[date].map((e) => {
              const isExpanded = expanded === e.id;
              return (
                <div key={e.id}>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : e.id)}
                    className="w-full text-left bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-3 py-2 hover:border-zinc-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-zinc-600 font-mono w-10 shrink-0">{formatTime(e.ts)}</span>
                        <span className="text-sm">{MEAL_ICONS[e.meal_type] || '🍽️'}</span>
                        {e.photo && <span className="text-xs" title="Photo logged">📸</span>}
                        <span className="text-sm text-zinc-300 truncate">{e.description}</span>
                      </div>
                      <span className="text-xs font-mono text-orange-400 ml-2 shrink-0">{e.totals.cal} cal</span>
                    </div>
                  </button>

                  {/* Expanded: show photo + items */}
                  {isExpanded && (
                    <div className="ml-12 mt-1 mb-2 border-l-2 border-orange-500/20 pl-3 space-y-1">
                      {e.photo && (
                        <div className="mb-2">
                          <img
                            src={`/api/tracker/food/photo/${e.photo}`}
                            alt={e.description}
                            className="max-w-full max-h-48 rounded-lg object-contain border border-zinc-700"
                            loading="lazy"
                          />
                        </div>
                      )}
                      {e.items.length > 0 && e.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-zinc-400">
                          <span>{item.quantity} {item.unit} {item.name}</span>
                          <span className="font-mono text-zinc-500">
                            {item.cal}cal · {item.protein_g}p · {item.fat_g}f · {item.carbs_g}c
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-xs text-orange-400/70 font-medium pt-1 border-t border-zinc-800">
                        <span>Total</span>
                        <span className="font-mono">
                          {e.totals.cal}cal · {e.totals.protein_g}p · {e.totals.fat_g}f · {e.totals.carbs_g}c
                        </span>
                      </div>
                      {e.estimation_source === 'vision' && (
                        <div className="text-[10px] text-zinc-600 mt-1">via GPT-4o vision</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
