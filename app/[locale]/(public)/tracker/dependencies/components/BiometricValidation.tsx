'use client';

import type { SubstanceDependency } from '@/lib/tracker/types/dependencies';

interface Props {
  biometrics: {
    hr: number | null;
    hrv: number | null;
    stress: number | null;
    body_battery: number | null;
    sleep_score: number | null;
    ans_mode: string;
  } | null;
  substances: Record<string, SubstanceDependency>;
  selected: string | null;
}

function MetricGauge({
  label,
  current,
  baseline,
  threshold,
  unit,
  invertAlert,
}: {
  label: string;
  current: number | null;
  baseline: number | undefined;
  threshold: number | undefined;
  unit: string;
  invertAlert?: boolean;
}) {
  if (current === null && !baseline) return null;

  const isAlert = current !== null && threshold !== undefined &&
    (invertAlert ? current < threshold : current > threshold);
  const diff = current !== null && baseline !== undefined
    ? current - baseline
    : null;

  return (
    <div className={`p-4 rounded-lg border ${isAlert ? 'border-red-500/30 bg-red-500/5' : 'border-zinc-700 bg-zinc-800/50'}`}>
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-mono font-bold ${isAlert ? 'text-red-400' : 'text-zinc-200'}`}>
          {current !== null ? current : '—'}
        </span>
        <span className="text-xs text-zinc-500 mb-1">{unit}</span>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs">
        {baseline !== undefined && (
          <span className="text-zinc-500">
            Baseline : {baseline}
          </span>
        )}
        {diff !== null && diff !== 0 && (
          <span className={diff > 0 ? (invertAlert ? 'text-green-400' : 'text-red-400') : (invertAlert ? 'text-red-400' : 'text-green-400')}>
            {diff > 0 ? '+' : ''}{diff.toFixed(1)}
          </span>
        )}
        {threshold !== undefined && (
          <span className="text-zinc-600">
            Seuil : {threshold}
          </span>
        )}
      </div>
      {isAlert && (
        <div className="mt-2 text-xs text-red-400 font-medium">
          ⚠️ Signe de sevrage détecté
        </div>
      )}
    </div>
  );
}

export default function BiometricValidation({ biometrics, substances, selected }: Props) {
  if (!biometrics) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-amber-400 mb-3">Validation Biométrique Temps Réel</h2>
        <p className="text-zinc-500 text-sm">Données biométriques indisponibles — connectez votre Garmin.</p>
      </div>
    );
  }

  // Get selected substance's validation data, or aggregate
  const selectedDep = selected ? substances[selected] : null;
  const validation = selectedDep?.biometric_validation;
  const baseline = validation?.baseline_during_use;
  const thresholds = validation?.withdrawal_thresholds;

  // Count substances showing withdrawal signs
  const withdrawalCount = Object.values(substances).filter(
    (d) => d.biometric_validation?.status === 'withdrawal_signs'
  ).length;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-amber-400">
          Validation Biométrique Temps Réel
        </h2>
        <div className="flex items-center gap-2">
          {withdrawalCount > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {withdrawalCount} alerte{withdrawalCount > 1 ? 's' : ''} sevrage
            </span>
          )}
          {biometrics.ans_mode && biometrics.ans_mode !== 'unknown' && (
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              ANS: {biometrics.ans_mode}
            </span>
          )}
        </div>
      </div>

      {selected && !validation && (
        <p className="text-zinc-500 text-sm mb-4">
          Pas de données de validation pour {selected} — insuffisamment de prises enregistrées.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MetricGauge
          label="Stress"
          current={biometrics.stress}
          baseline={baseline?.stress}
          threshold={thresholds?.stress_alert}
          unit=""
        />
        <MetricGauge
          label="HRV"
          current={biometrics.hrv}
          baseline={baseline?.hrv}
          threshold={thresholds?.hrv_alert}
          unit="ms"
          invertAlert
        />
        <MetricGauge
          label="FC"
          current={biometrics.hr}
          baseline={baseline?.hr}
          threshold={undefined}
          unit="bpm"
        />
        <MetricGauge
          label="Body Battery"
          current={biometrics.body_battery}
          baseline={undefined}
          threshold={undefined}
          unit=""
        />
        <MetricGauge
          label="Sommeil"
          current={biometrics.sleep_score}
          baseline={undefined}
          threshold={thresholds?.sleep_alert}
          unit=""
          invertAlert
        />
      </div>

      {/* Withdrawal detection summary */}
      {withdrawalCount > 0 && (
        <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <div className="text-sm text-red-400 font-medium mb-1">Détection de sevrage active</div>
          <div className="text-xs text-red-300/70">
            {Object.entries(substances)
              .filter(([, d]) => d.biometric_validation?.status === 'withdrawal_signs')
              .map(([key]) => key)
              .join(', ')}
            {' '}— vos biomarqueurs indiquent un possible sevrage. Consultez les protocoles ci-dessous.
          </div>
        </div>
      )}
    </div>
  );
}
