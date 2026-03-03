'use client';

import { memo, lazy, Suspense } from 'react';

const KCalculator = lazy(() => import('./KCalculator'));

// ── Constants ────────────────────────────────────────────────────

const K_PRESETS = [
  { mg: 15, label: 'Bump', desc: 'tiny line' },
  { mg: 30, label: 'Light', desc: 'small key' },
  { mg: 50, label: 'Moderate', desc: 'medium line' },
  { mg: 80, label: 'Strong', desc: 'fat line' },
  { mg: 120, label: 'Deep', desc: 'heavy dose' },
];

const K_LIQUID_PRESETS = [
  { ml: 1, label: 'Micro-boost', desc: '100mg', intent: 'micro-boost' },
  { ml: 4, label: 'Dissociation', desc: '400mg', intent: 'dissociation' },
  { ml: 8, label: 'Dissolution', desc: '800mg', intent: 'identity-dissolution' },
];

const LSD_PRESETS = [
  { dose: 0.25, label: '¼ carton', desc: 'microdose', ug: 25 },
  { dose: 0.5, label: '½ carton', desc: 'light / threshold', ug: 50 },
  { dose: 1, label: '1 carton', desc: 'standard', ug: 100 },
  { dose: 1.5, label: '1½ cartons', desc: 'strong', ug: 150 },
  { dose: 2, label: '2 cartons', desc: 'heavy', ug: 200 },
];

const ADDITIVES = ['sodium', 'potassium', 'magnesium', 'vitC', 'B12', 'B6', 'B2'];

const RESISTANCE_OPTIONS = [0.2, 0.4, 0.6, 0.8, 1.2];
const VAPE_MODES = ['POWER', 'BYPASS', 'TC-SS', 'TC-Ni', 'TC-Ti', 'ATL', 'MTL'] as const;

export const VAPE_REACTIONS = [
  { key: 'clean', label: 'Clean', icon: '✅' },
  { key: 'cough-light', label: 'Cough (light)', icon: '😤' },
  { key: 'cough-strong', label: 'Cough (strong)', icon: '🫁' },
  { key: 'cough-very-strong', label: 'Cough (very strong)', icon: '💀' },
  { key: 'gag', label: 'Gag', icon: '🤢' },
  { key: 'vomit', label: 'Vomit', icon: '🤮' },
] as const;

export const NICOTINE_FORMS = [
  { key: 'vape', label: 'Vape', icon: '💨', unit: 'puffs', hasVapeDetails: true },
  { key: 'roulee', label: 'Roulée', icon: '🚬', unit: 'cig' },
  { key: 'industrielle', label: 'Industrielle', icon: '🚬', unit: 'cig' },
  { key: 'cigarillo', label: 'Cigarillo', icon: '🚬', unit: 'pcs' },
  { key: 'cigare', label: 'Cigare', icon: '🚬', unit: 'pcs' },
  { key: 'shisha', label: 'Shisha', icon: '🫧', unit: 'session' },
  { key: 'tabac_macher', label: 'Tabac à mâcher', icon: '🫘', unit: 'pcs' },
  { key: 'snuff', label: 'Snuff', icon: '👃', unit: 'pincée' },
  { key: 'patch', label: 'Patch', icon: '🩹', unit: 'mg' },
  { key: 'gomme', label: 'Gomme', icon: '🫧', unit: 'pcs' },
] as const;

// ── Props ────────────────────────────────────────────────────────

interface SubstanceFieldsProps {
  tab: string;
  amount: number;
  setAmount: (n: number) => void;
  details: Record<string, unknown>;
  setDetails: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  showKCalc: boolean;
  setShowKCalc: (v: boolean) => void;
  setIntent: (i: string) => void;
}

// ── Component ────────────────────────────────────────────────────

function SubstanceFieldsInner({
  tab,
  amount,
  setAmount,
  details,
  setDetails,
  showKCalc,
  setShowKCalc,
  setIntent,
}: SubstanceFieldsProps) {
  if (tab === 'yoga') return null;

  return (
    <>
      {tab === 'thc' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">THC %</label>
              <input
                type="number"
                value={(details.strain_thc as number) || 22}
                onChange={(e) => setDetails({ ...details, strain_thc: Number(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Temp °C</label>
              <input
                type="number"
                value={(details.temp_c as number) || 230}
                onChange={(e) => setDetails({ ...details, temp_c: Number(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Reaction</label>
            <div className="flex gap-1.5 flex-wrap">
              {VAPE_REACTIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setDetails({ ...details, reaction: r.key })}
                  className={`px-2 py-1.5 rounded text-xs border transition ${
                    (details.reaction as string || 'clean') === r.key
                      ? 'border-green-500/50 text-green-400 bg-green-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'hashish' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Forme</label>
            <div className="flex flex-wrap gap-1.5">
              {([
                { key: 'joint', label: 'Joint', icon: '🚬' },
                { key: 'pipe', label: 'Pipe', icon: '🪈' },
                { key: 'bong', label: 'Bong', icon: '🫧' },
                { key: 'vaporisé', label: 'Vaporisé', icon: '💨' },
                { key: 'space-cake', label: 'Space cake', icon: '🍰' },
              ] as const).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setDetails({ ...details, form: f.key })}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.form === f.key
                      ? 'border-yellow-700/50 text-yellow-600 bg-yellow-700/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Quantité (g)</label>
              <div className="flex flex-wrap gap-1.5">
                {[0.1, 0.2, 0.3, 0.5, 0.7, 1].map((g) => (
                  <button
                    key={g}
                    onClick={() => setAmount(g)}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      amount === g
                        ? 'border-yellow-700/50 text-yellow-600 bg-yellow-700/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {g}g
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">THC %</label>
              <input
                type="number"
                value={(details.thc_pct as number) || 15}
                onChange={(e) => setDetails({ ...details, thc_pct: Number(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Mix</label>
            <div className="flex gap-1.5">
              {(['tabac', 'pur', 'cbd', 'herbes'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setDetails({ ...details, mix: m })}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.mix === m
                      ? 'border-yellow-700/50 text-yellow-600 bg-yellow-700/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Reaction</label>
            <div className="flex gap-1.5 flex-wrap">
              {VAPE_REACTIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setDetails({ ...details, reaction: r.key })}
                  className={`px-2 py-1.5 rounded text-xs border transition ${
                    (details.reaction as string || 'clean') === r.key
                      ? 'border-green-500/50 text-green-400 bg-green-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'cbd_joint' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Forme</label>
            <div className="flex flex-wrap gap-1.5">
              {([
                { key: 'pré-roulé', label: 'Pré-roulé', icon: '🚬' },
                { key: 'roulé-maison', label: 'Roulé maison', icon: '✋' },
                { key: 'infusion', label: 'Infusion', icon: '🍵' },
                { key: 'vaporisé', label: 'Vaporisé', icon: '💨' },
              ] as const).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setDetails({ ...details, form: f.key })}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.form === f.key
                      ? 'border-lime-500/50 text-lime-400 bg-lime-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Quantité</label>
              <div className="flex flex-wrap gap-1.5">
                {[0.5, 1, 1.5, 2].map((n) => (
                  <button
                    key={n}
                    onClick={() => setAmount(n)}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      amount === n
                        ? 'border-lime-500/50 text-lime-400 bg-lime-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {n} joint{n > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">CBD %</label>
              <input
                type="number"
                value={(details.cbd_pct as number) || 15}
                onChange={(e) => setDetails({ ...details, cbd_pct: Number(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Marque / Variété</label>
            <input
              type="text"
              value={(details.brand as string) || ''}
              onChange={(e) => setDetails({ ...details, brand: e.target.value })}
              placeholder="ex: Strawberry Haze CBD"
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Reaction</label>
            <div className="flex gap-1.5 flex-wrap">
              {VAPE_REACTIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setDetails({ ...details, reaction: r.key })}
                  className={`px-2 py-1.5 rounded text-xs border transition ${
                    (details.reaction as string || 'clean') === r.key
                      ? 'border-green-500/50 text-green-400 bg-green-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'cbd' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Forme</label>
            <div className="flex gap-2">
              {([
                { key: 'complex', label: '💊 Complexe', desc: 'Comprimé multi-composé' },
                { key: 'sublingual', label: '💧 Sublingual', desc: 'Huile CBD' },
                { key: 'vaporized', label: '🌿 Vaporisé 230°C', desc: 'Chambre' },
              ] as const).map((r) => (
                <button
                  key={r.key}
                  onClick={() => {
                    if (r.key === 'complex') {
                      setDetails({ ...details, route: 'complex', form: 'tablet' });
                      setAmount(1);
                    } else if (r.key === 'sublingual') {
                      setDetails({ ...details, route: 'sublingual', cbd_pct: (details.cbd_pct as number) || 20 });
                      setAmount(5);
                    } else {
                      setDetails({ ...details, route: 'vaporized', cbd_pct: (details.cbd_pct as number) || 7, temp_c: 230 });
                      setAmount(1);
                    }
                  }}
                  className={`px-3 py-1.5 rounded text-sm border transition ${
                    details.route === r.key
                      ? 'border-lime-500/50 text-lime-400 bg-lime-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {(details.route === 'complex' || !details.route) && (
            <>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Nombre de comprimés</label>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      onClick={() => setAmount(count)}
                      className={`px-3 py-1.5 rounded text-sm border transition ${
                        amount === count
                          ? 'border-lime-500/50 text-lime-300 bg-lime-500/15'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {count} comprimé{count > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
                <div className="text-xs text-zinc-400 mb-2 font-medium">
                  Composition par comprimé <span className="text-zinc-600">&times; {amount}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    { name: 'CBD isolat', mg: 45, color: 'text-lime-400' },
                    { name: 'Griffonia (5-HTP)', mg: 50.5, color: 'text-purple-400' },
                    { name: 'Rhodiola', mg: 30, color: 'text-rose-400' },
                    { name: 'Ashwagandha', mg: 280, color: 'text-amber-400' },
                    { name: 'Magnésium', mg: 117, color: 'text-blue-400', note: '31% AJR' },
                    { name: 'Vitamine B6', mg: 1.4, color: 'text-teal-400', note: '100% AJR' },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-xs py-0.5">
                      <span className={c.color}>{c.name}</span>
                      <span className="text-zinc-500 font-mono">
                        {(c.mg * amount).toFixed(c.mg < 2 ? 1 : 0)} mg
                        {c.note && <span className="text-zinc-600 ml-1">({c.note})</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Anxiolytique', color: 'border-lime-500/30 text-lime-400/70' },
                  { label: 'Adaptogène', color: 'border-amber-500/30 text-amber-400/70' },
                  { label: 'Sérotoninergique', color: 'border-purple-500/30 text-purple-400/70' },
                  { label: 'Sans THC', color: 'border-zinc-600 text-zinc-500' },
                ].map((tag) => (
                  <span key={tag.label} className={`text-[10px] px-2 py-0.5 rounded-full border ${tag.color}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </>
          )}

          {details.route === 'sublingual' && (
            <>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">CBD %</label>
                <div className="flex flex-wrap gap-1.5">
                  {[10, 20, 30, 40].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setDetails({ ...details, cbd_pct: pct })}
                      className={`px-2 py-1 rounded text-xs border transition ${
                        (details.cbd_pct as number) === pct
                          ? 'border-lime-500/50 text-lime-300 bg-lime-500/15'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Gouttes</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[3, 5, 8, 10, 15].map((g) => (
                    <button
                      key={g}
                      onClick={() => setAmount(g)}
                      className={`px-2 py-1 rounded text-xs border transition ${
                        amount === g
                          ? 'border-lime-500/50 text-lime-300 bg-lime-500/15'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {g} gttes
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={1}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div className="text-[10px] text-zinc-600">
                {amount} goutte{amount > 1 ? 's' : ''} &times; huile CBD {(details.cbd_pct as number) || 20}% — voie sublinguale
              </div>
            </>
          )}

          {details.route === 'vaporized' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">CBD %</label>
                  <input
                    type="number"
                    value={(details.cbd_pct as number) || 7}
                    onChange={(e) => setDetails({ ...details, cbd_pct: Number(e.target.value) })}
                    min={1}
                    max={100}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Temp °C</label>
                  <input
                    type="number"
                    value={(details.temp_c as number) || 230}
                    onChange={(e) => setDetails({ ...details, temp_c: Number(e.target.value) })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Chambers</label>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3].map((chambers) => (
                    <button
                      key={chambers}
                      onClick={() => setAmount(chambers)}
                      className={`px-2 py-1 rounded text-xs border transition ${
                        amount === chambers
                          ? 'border-lime-500/50 text-lime-300 bg-lime-500/15'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {chambers} chamber{chambers > 1 ? 's' : ''} <span className="text-zinc-600">· {(details.cbd_pct as number) || 7}%</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Reaction</label>
                <div className="flex gap-1.5 flex-wrap">
                  {VAPE_REACTIONS.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setDetails({ ...details, reaction: r.key })}
                      className={`px-2 py-1.5 rounded text-xs border transition ${
                        (details.reaction as string || 'clean') === r.key
                          ? 'border-lime-500/50 text-lime-400 bg-lime-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'lions_mane' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Quick dose (420mg/capsule)</label>
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4].map((caps) => {
              const mg = caps * 420;
              return (
                <button
                  key={caps}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-amber-600/50 text-amber-400 bg-amber-600/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {caps} cap{caps > 1 ? 's' : ''} <span className="text-zinc-600">· {mg}mg</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'caffeine' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Variante</label>
            <div className="flex flex-wrap gap-1.5">
              {([
                { key: 'espresso', label: 'Espresso', icon: '☕', mg: 75, shots: 1 },
                { key: 'double', label: 'Double', icon: '☕', mg: 150, shots: 2 },
                { key: 'triple', label: 'Triple', icon: '☕', mg: 225, shots: 3 },
                { key: 'americano', label: 'Americano', icon: '🇺🇸', mg: 120 },
                { key: 'cappuccino', label: 'Cappuccino', icon: '☁️', mg: 150 },
                { key: 'latte', label: 'Latte', icon: '🥛', mg: 150 },
                { key: 'moccachino', label: 'Moccachino', icon: '🍫', mg: 150 },
                { key: 'caramel', label: 'Caramel Latte', icon: '🍮', mg: 150 },
                { key: 'flat-white', label: 'Flat White', icon: '🤍', mg: 130 },
                { key: 'cortado', label: 'Cortado', icon: '🫗', mg: 75 },
                { key: 'noisette', label: 'Noisette', icon: '🌰', mg: 75 },
                { key: 'italian', label: 'Italien', icon: '🇮🇹', mg: 100 },
                { key: 'nitro', label: 'Nitro', icon: '🧊', mg: 215, desc: 'Grounded, sugar integrated, chilled with ice cubes', sugar: 1, milk: false },
                { key: 'turkish', label: 'Turc', icon: '🫖', mg: 200 },
                { key: 'vietnamese', label: 'Vietnamien', icon: '🇻🇳', mg: 200 },
                { key: 'bonbon', label: 'Bonbon', icon: '🍬', mg: 160 },
                { key: 'irish', label: 'Irish', icon: '🍀', mg: 80 },
                { key: 'macchiato', label: 'Macchiato', icon: '🔘', mg: 75 },
                { key: 'ristretto', label: 'Ristretto', icon: '⚡', mg: 65 },
                { key: 'lungo', label: 'Lungo', icon: '💧', mg: 90 },
              ] as const).map((v) => (
                <button
                  key={v.key}
                  onClick={() => {
                    setAmount(v.mg);
                    setDetails({
                      ...details,
                      form: v.key,
                      ...('shots' in v ? { shots: v.shots } : {}),
                      ...('sugar' in v ? { sugar: v.sugar } : {}),
                      ...('milk' in v ? { milk: v.milk } : {}),
                    });
                  }}
                  title={'desc' in v ? v.desc : undefined}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.form === v.key
                      ? 'border-amber-500/50 text-amber-300 bg-amber-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {v.icon} {v.label} <span className="text-zinc-600">· {v.mg}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Lait</label>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => setDetails({ ...details, milk: v })}
                    className={`px-3 py-1.5 rounded text-sm border transition ${
                      details.milk === v
                        ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {v ? '🥛 Oui' : 'Non'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Sucre</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDetails({ ...details, sugar: Math.max(0, ((details.sugar as number) || 0) - 1) })}
                  className="w-7 h-7 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 flex items-center justify-center text-sm transition"
                >
                  −
                </button>
                {[0, 1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setDetails({ ...details, sugar: s })}
                    className={`px-1.5 py-1 rounded text-xs border transition min-w-[28px] ${
                      (details.sugar as number) === s
                        ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {s === 0 ? '∅' : s}
                  </button>
                ))}
                <button
                  onClick={() => setDetails({ ...details, sugar: ((details.sugar as number) || 0) + 1 })}
                  className="w-7 h-7 rounded border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 flex items-center justify-center text-sm transition"
                >
                  +
                </button>
                {(details.sugar as number) > 4 && (
                  <span className="text-xs text-amber-400 font-mono ml-1">{details.sugar as number}</span>
                )}
              </div>
            </div>
          </div>

          {(details.sugar as number) > 0 && (
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Type de sucre</label>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { key: 'blanc', label: 'Blanc' },
                  { key: 'brun', label: 'Brun' },
                  { key: 'sucrette', label: 'Sucrette' },
                  { key: 'coco', label: 'Fleur de coco' },
                  { key: 'miel', label: 'Miel' },
                  { key: 'agave', label: 'Agave' },
                  { key: 'stevia', label: 'Stévia' },
                  { key: 'sirop', label: 'Sirop' },
                  { key: 'muscovado', label: 'Muscovado' },
                  { key: 'demerara', label: 'Demerara' },
                  { key: 'rapadura', label: 'Rapadura' },
                ] as const).map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setDetails({ ...details, sugarType: st.key })}
                    className={`px-2 py-1 rounded text-[11px] border transition ${
                      (details.sugarType || 'blanc') === st.key
                        ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                        : 'border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'ketamine' && (
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Form</label>
              <div className="flex gap-2">
                {(['liquid', 'crystal', 'spray'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    if (f === 'liquid') {
                      setDetails({ ...details, form: 'liquid', route: 'oral', crystal_mg: 1000, water_ml: 10 });
                      if (amount > 20) setAmount(1);
                    } else if (f === 'crystal') {
                      setDetails({ ...details, form: 'crystal', route: 'intranasal', estimate: 'visual' });
                      if (amount < 5) setAmount(30);
                    } else {
                      setDetails({ ...details, form: 'spray', route: 'intranasal' });
                      if (amount > 20) setAmount(3);
                    }
                  }}
                  className={`px-3 py-1.5 rounded text-sm border transition ${
                    details.form === f
                      ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f === 'liquid' ? '💧 Liquide' : f === 'crystal' ? '💎 Crystal' : '🔬 Spray'}
                </button>
              ))}
              </div>
            </div>
            <button
              onClick={() => setShowKCalc(!showKCalc)}
              className={`px-2.5 py-1.5 rounded text-xs border transition shrink-0 ${
                showKCalc
                  ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                  : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🧮 Calc
            </button>
          </div>

          {showKCalc && (
            <Suspense fallback={<div className="h-20 bg-zinc-800/50 rounded-lg animate-pulse" />}>
              <KCalculator />
            </Suspense>
          )}

          {details.form === 'liquid' && (() => {
            const crystalMg = (details.crystal_mg as number) || 1000;
            const waterMl = (details.water_ml as number) || 10;
            const mgPerMl = waterMl > 0 ? crystalMg / waterMl : 0;
            return (
              <>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
                  <div className="flex flex-wrap gap-1.5">
                    {K_LIQUID_PRESETS.map((p) => (
                      <button
                        key={p.ml}
                        onClick={() => {
                          setAmount(p.ml);
                          setIntent(p.intent);
                        }}
                        className={`px-2 py-1 rounded text-xs border transition ${
                          amount === p.ml
                            ? 'border-purple-500/50 text-purple-300 bg-purple-500/15'
                            : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {p.ml}ml <span className="text-zinc-600">· {p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-2 text-center">
                  <span className="text-xs text-zinc-500">Concentration: </span>
                  <span className="text-sm font-mono text-purple-300 font-bold">{mgPerMl.toFixed(0)} mg/ml</span>
                  <span className="text-xs text-zinc-500 ml-2">= </span>
                  <span className="text-sm font-mono text-purple-400">{(mgPerMl * amount).toFixed(0)} mg</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Cristal (mg)</label>
                    <input
                      type="number"
                      min={0}
                      value={crystalMg}
                      onChange={(e) => setDetails({ ...details, crystal_mg: Number(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Eau (ml)</label>
                    <input
                      type="number"
                      min={0.1}
                      step={0.5}
                      value={waterMl}
                      onChange={(e) => setDetails({ ...details, water_ml: Number(e.target.value) })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              </>
            );
          })()}

          {details.form === 'crystal' && (
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
              <div className="flex flex-wrap gap-1.5">
                {K_PRESETS.map((p) => (
                  <button
                    key={p.mg}
                    onClick={() => setAmount(p.mg)}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      amount === p.mg
                        ? 'border-purple-500/50 text-purple-300 bg-purple-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {p.mg}mg <span className="text-zinc-600">· {p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {details.form === 'spray' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">mg/spray</label>
                <input
                  type="number"
                  step={0.1}
                  value={(details.mg_per_spray as number) || 0}
                  onChange={(e) => {
                    const mgps = Number(e.target.value);
                    setDetails({ ...details, mg_per_spray: mgps, total_mg: mgps * amount });
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Total mg</label>
                <div className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-purple-400 font-mono text-sm">
                  {((details.mg_per_spray as number) || 0) * amount || '—'}
                </div>
              </div>
            </div>
          )}

          {(details.form === 'liquid' || details.form === 'spray') && (
            <>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Narine visée</label>
                <div className="flex gap-2">
                  {(['gauche', 'droite', 'les deux'] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setDetails({ ...details, nostril: n })}
                      className={`px-2.5 py-1 rounded text-xs border transition ${
                        details.nostril === n
                          ? 'border-purple-500/50 text-purple-300 bg-purple-500/15'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {n === 'gauche' ? '👃 Gauche' : n === 'droite' ? 'Droite 👃' : '👃 Les deux'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-1">Observations</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDetails({ ...details, nasal_drip: !details.nasal_drip })}
                    className={`px-2.5 py-1 rounded text-xs border transition ${
                      details.nasal_drip
                        ? 'border-blue-500/50 text-blue-300 bg-blue-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    💧 Écoulement nez
                  </button>
                  <button
                    onClick={() => setDetails({ ...details, heart_reaction: !details.heart_reaction })}
                    className={`px-2.5 py-1 rounded text-xs border transition ${
                      details.heart_reaction
                        ? 'border-red-500/50 text-red-300 bg-red-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    ❤️ Palpitations
                  </button>
                  <button
                    onClick={() => setDetails({ ...details, eye_accident: !details.eye_accident })}
                    className={`px-2.5 py-1 rounded text-xs border transition ${
                      details.eye_accident
                        ? 'border-amber-500/50 text-amber-300 bg-amber-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    👁️ Accident oeil
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-1">Ressenti final</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDetails({ ...details, feeling: 'underdosed' })}
                    className={`px-2.5 py-1 rounded text-xs border transition ${
                      details.feeling === 'underdosed'
                        ? 'border-blue-500/50 text-blue-300 bg-blue-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    📉 Sous-dosé
                  </button>
                  <button
                    onClick={() => setDetails({ ...details, feeling: 'good' })}
                    className={`px-2.5 py-1 rounded text-xs border transition ${
                      details.feeling === 'good'
                        ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    ✅ Bonne quantité
                  </button>
                  <button
                    onClick={() => setDetails({ ...details, feeling: 'overdosed' })}
                    className={`px-2.5 py-1 rounded text-xs border transition ${
                      details.feeling === 'overdosed'
                        ? 'border-red-500/50 text-red-300 bg-red-500/15'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    📈 Surdosé
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'lsd' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {LSD_PRESETS.map((p) => (
                <button
                  key={p.dose}
                  onClick={() => {
                    setAmount(p.dose);
                    setDetails({ ...details, ug_estimate: p.ug });
                  }}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === p.dose
                      ? 'border-pink-500/50 text-pink-300 bg-pink-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {p.label} <span className="text-zinc-600">· ~{p.ug}ug</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">ug estimate</label>
            <input
              type="number"
              step={5}
              min={0}
              value={(details.ug_estimate as number) || 100}
              onChange={(e) => setDetails({ ...details, ug_estimate: Number(e.target.value) })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>
      )}

      {tab === 'nicotine' && (
        <div className="space-y-3 sm:col-span-2">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Forme</label>
            <div className="flex flex-wrap gap-1.5">
              {NICOTINE_FORMS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    const newDetails: Record<string, unknown> = { form: f.key };
                    if (f.key === 'vape') {
                      Object.assign(newDetails, { strength_pct: 20, mode: 'POWER', wattage: 22, resistance: 1.2, voltage_v: null, puff_duration_s: null, reaction: 'clean' });
                      setAmount(3);
                    } else if (f.key === 'shisha') {
                      setAmount(1);
                    } else if (f.key === 'patch') {
                      setAmount(21);
                    } else {
                      setAmount(1);
                    }
                    setDetails(newDetails);
                  }}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    (details.form as string || 'vape') === f.key
                      ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          {(details.form as string || 'vape') !== 'vape' && (
            <div>
              <label className="text-xs text-zinc-500 block mb-1">
                Quantité ({NICOTINE_FORMS.find((f) => f.key === details.form)?.unit || 'pcs'})
              </label>
              <div className="flex gap-1.5">
                {((details.form as string) === 'shisha'
                  ? [1, 2, 3]
                  : (details.form as string) === 'patch'
                  ? [7, 14, 21]
                  : [1, 2, 3, 4, 5]
                ).map((n) => (
                  <button
                    key={n}
                    onClick={() => setAmount(n)}
                    className={`px-3 py-1.5 rounded text-sm font-mono border transition ${
                      amount === n
                        ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {(details.form as string) === 'patch' ? `${n}mg` : n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(details.form as string || 'vape') === 'vape' && (
            <>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Puffs</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setAmount(n)}
                      className={`px-3 py-1.5 rounded text-sm font-mono border transition ${
                        amount === n
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Wattage (W)</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    step={0.5}
                    value={(details.wattage as number) ?? 22}
                    onChange={(e) => setDetails({ ...details, wattage: Number(e.target.value) })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Résistance (ohm)</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {RESISTANCE_OPTIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setDetails({ ...details, resistance: r })}
                        className={`px-2.5 py-1.5 rounded text-xs font-mono border transition ${
                          (details.resistance as number) === r
                            ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                            : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-1">Mode</label>
                <div className="flex gap-1.5 flex-wrap">
                  {VAPE_MODES.map((m) => (
                    <button
                      key={m}
                      onClick={() => setDetails({ ...details, mode: m })}
                      className={`px-2.5 py-1.5 rounded text-xs border transition ${
                        details.mode === m
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Voltage (V)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={(details.voltage_v as number) ?? ''}
                    onChange={(e) => setDetails({ ...details, voltage_v: e.target.value ? Number(e.target.value) : null })}
                    placeholder="ex: 3.7"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">S (sec)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    step={0.01}
                    value={(details.puff_duration_s as number) ?? ''}
                    onChange={(e) => setDetails({ ...details, puff_duration_s: e.target.value ? Number(e.target.value) : null })}
                    placeholder="ex: 1.25"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 block mb-1">Reaction</label>
                <div className="flex gap-1.5 flex-wrap">
                  {VAPE_REACTIONS.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setDetails({ ...details, reaction: r.key })}
                      className={`px-2 py-1.5 rounded text-xs border transition ${
                        (details.reaction as string || 'clean') === r.key
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {r.icon} {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'hydration' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Additives</label>
          <div className="flex flex-wrap gap-1.5">
            {ADDITIVES.map((a) => {
              const active = ((details.additives as string[]) || []).includes(a);
              return (
                <button
                  key={a}
                  onClick={() => {
                    const current = (details.additives as string[]) || [];
                    setDetails({
                      ...details,
                      additives: active
                        ? current.filter((x) => x !== a)
                        : [...current, a],
                    });
                  }}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    active
                      ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'melatonin' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Form</label>
          <div className="flex gap-2">
            {(['tablet', 'gummy', 'liquid', 'spray'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDetails({ ...details, form: f })}
                className={`px-3 py-1.5 rounded text-sm border transition ${
                  details.form === f
                    ? 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'venlafaxine' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Release</label>
          <div className="flex gap-2">
            {(['extended', 'immediate'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDetails({ ...details, release: r })}
                className={`px-3 py-1.5 rounded text-sm border transition ${
                  details.release === r
                    ? 'border-teal-500/50 text-teal-400 bg-teal-500/10'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {r === 'extended' ? 'LP (Extended)' : 'Immediate'}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'sertraline' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
          <div className="flex flex-wrap gap-1.5">
            {[50, 100, 150, 200].map((mg) => (
              <button
                key={mg}
                onClick={() => setAmount(mg)}
                className={`px-2 py-1 rounded text-xs border transition ${
                  amount === mg
                    ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/15'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {mg}mg
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'griffonia' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Quick dose (5-HTP)</label>
          <div className="flex flex-wrap gap-1.5">
            {[450, 900, 1800].map((mg) => (
              <button
                key={mg}
                onClick={() => setAmount(mg)}
                className={`px-2 py-1 rounded text-xs border transition ${
                  amount === mg
                    ? 'border-purple-400/50 text-purple-400 bg-purple-400/15'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {mg}mg
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'valeriane' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
          <div className="flex flex-wrap gap-1.5">
            {[100, 200, 300, 450, 600].map((mg) => (
              <button
                key={mg}
                onClick={() => setAmount(mg)}
                className={`px-2 py-1 rounded text-xs border transition ${
                  amount === mg
                    ? 'border-lime-600/50 text-lime-500 bg-lime-600/15'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {mg}mg
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'safran' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
          <div className="flex flex-wrap gap-1.5">
            {[500, 1000, 2000].map((mg) => (
              <button
                key={mg}
                onClick={() => setAmount(mg)}
                className={`px-2 py-1 rounded text-xs border transition ${
                  amount === mg
                    ? 'border-orange-500/50 text-orange-400 bg-orange-500/15'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {mg}mg
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'cyamemazine' && (
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
          <div className="flex flex-wrap gap-1.5">
            {[12.5, 25, 50, 100].map((mg) => (
              <button
                key={mg}
                onClick={() => setAmount(mg)}
                className={`px-2 py-1 rounded text-xs border transition ${
                  amount === mg
                    ? 'border-purple-600/50 text-purple-400 bg-purple-600/15'
                    : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {mg}mg
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'prazepam' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose (gouttes sublinguales)</label>
            <div className="flex flex-wrap gap-1.5">
              {[5, 10, 15, 20, 30, 40].map((g) => (
                <button
                  key={g}
                  onClick={() => setAmount(g)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === g
                      ? 'border-slate-400/50 text-slate-300 bg-slate-500/10'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {g} gttes
                </button>
              ))}
            </div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
            <div className="text-xs text-zinc-400 mb-1 font-medium">Lysanxia (prazepam) solution buvable</div>
            <div className="text-xs text-zinc-500">
              1 goutte = 1mg prazepam — voie sublinguale. Max: 40 gouttes/jour.
            </div>
          </div>
        </div>
      )}

      {tab === 'dynabiane' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Nombre de gélules</label>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2].map((count) => (
                <button
                  key={count}
                  onClick={() => setAmount(count)}
                  className={`px-3 py-1.5 rounded text-sm border transition ${
                    amount === count
                      ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {count} gélule{count > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
            <div className="text-xs text-zinc-400 mb-1 font-medium">PiLeJe Dynabiane</div>
            <div className="text-xs text-zinc-500">
              Probiotique axe intestin-cerveau — soutien microbiote, humeur, immunité
            </div>
          </div>
        </div>
      )}

      {tab === 'omegabiane' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Nombre de gélules</label>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => setAmount(count)}
                  className={`px-3 py-1.5 rounded text-sm border transition ${
                    amount === count
                      ? 'border-sky-500/50 text-sky-300 bg-sky-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {count} gélule{count > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
            <div className="text-xs text-zinc-400 mb-1 font-medium">PiLeJe Omegabiane EPA/DHA</div>
            <div className="text-xs text-zinc-500">
              Omega-3 haute concentration — neuroprotection, anti-inflammatoire, cardiovasculaire
            </div>
          </div>
        </div>
      )}

      {tab === 'vitamine_c' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Forme</label>
            <div className="flex flex-wrap gap-1.5">
              {['pilule à croquer', 'comprimé effervescent', 'gélule', 'poudre', 'injectable IV'].map((f) => (
                <button
                  key={f}
                  onClick={() => setDetails((d) => ({ ...d, form: f }))}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.form === f
                      ? 'border-orange-400/50 text-orange-400 bg-orange-400/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {[120, 250, 500, 1000, 2000].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-orange-400/50 text-orange-400 bg-orange-400/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg >= 1000 ? `${mg / 1000}g` : `${mg}mg`}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-3">
            <div className="text-xs text-zinc-400 mb-1 font-medium">Vitamine C (acide ascorbique)</div>
            <div className="text-xs text-zinc-500">
              Antioxydant, soutien immunitaire. Défaut: pilule à croquer 120mg. Max recommandé: 2000mg/jour.
            </div>
          </div>
        </div>
      )}

      {tab === 'cocaine' && (
        <div className="space-y-3">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="text-xs text-red-400 font-medium mb-1">Substance dangereuse — Reduction des risques</div>
            <div className="text-[10px] text-red-400/70">Cardiotoxique. Ne JAMAIS combiner avec opiaces (speedball) ou stimulants. Tester au reactif. Hydratation.</div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Voie</label>
            <div className="flex flex-wrap gap-1.5">
              {['insufflation (ligne)', 'fumé (crack)', 'injectable', 'gencive'].map((f) => (
                <button
                  key={f}
                  onClick={() => setDetails((d) => ({ ...d, form: f }))}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.form === f
                      ? 'border-zinc-300/50 text-zinc-200 bg-zinc-400/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {[20, 50, 100, 200, 500].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-zinc-300/50 text-zinc-200 bg-zinc-400/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg}mg
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'mmc' && (
        <div className="space-y-3">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="text-xs text-red-400 font-medium mb-1">Substance dangereuse — Reduction des risques</div>
            <div className="text-[10px] text-red-400/70">Neurotoxique + cardiotoxique. NE PAS combiner avec ISRS/IRSN (risque serotonine). Espacer les prises (min 1 mois). Hydratation + electrolytes.</div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Voie</label>
            <div className="flex flex-wrap gap-1.5">
              {['insufflation', 'oral', 'injectable'].map((f) => (
                <button
                  key={f}
                  onClick={() => setDetails((d) => ({ ...d, form: f }))}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.form === f
                      ? 'border-cyan-400/50 text-cyan-300 bg-cyan-400/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {[50, 100, 200, 300, 500].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-cyan-400/50 text-cyan-300 bg-cyan-400/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg}mg
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'heroine' && (
        <div className="space-y-3">
          <div className="bg-red-600/15 border border-red-600/40 rounded-lg p-3">
            <div className="text-xs text-red-400 font-medium mb-1">Substance a haut risque — Naloxone recommandee</div>
            <div className="text-[10px] text-red-400/70">Risque mortel de depression respiratoire. NE JAMAIS combiner avec benzodiazepines ou alcool. Avoir du Naloxone (Narcan) a portee. Ne jamais consommer seul.</div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Voie</label>
            <div className="flex flex-wrap gap-1.5">
              {['insufflation', 'fumé', 'injectable', 'sublingual'].map((f) => (
                <button
                  key={f}
                  onClick={() => setDetails((d) => ({ ...d, form: f }))}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.form === f
                      ? 'border-amber-900/50 text-amber-700 bg-amber-900/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick dose</label>
            <div className="flex flex-wrap gap-1.5">
              {[10, 30, 50, 100, 200].map((mg) => (
                <button
                  key={mg}
                  onClick={() => setAmount(mg)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === mg
                      ? 'border-amber-900/50 text-amber-700 bg-amber-900/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mg}mg
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'alcohol' && (
        <div className="space-y-3">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="text-xs text-red-400 font-medium mb-1">Reduction des risques</div>
            <div className="text-[10px] text-red-400/70">1 verre standard = 10g alcool pur. NE PAS combiner avec benzodiazepines, opiaces ou somniferes. Hydratation entre chaque verre. Manger avant.</div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Type</label>
            <div className="flex flex-wrap gap-1.5">
              {([
                { key: 'bière', label: 'Bière', icon: '🍺', abv: 5 },
                { key: 'bière-forte', label: 'Bière forte', icon: '🍺', abv: 8 },
                { key: 'vin-rouge', label: 'Vin rouge', icon: '🍷', abv: 13 },
                { key: 'vin-blanc', label: 'Vin blanc', icon: '🥂', abv: 12 },
                { key: 'vin-rosé', label: 'Rosé', icon: '🌸', abv: 12 },
                { key: 'champagne', label: 'Champagne', icon: '🍾', abv: 12 },
                { key: 'cocktail', label: 'Cocktail', icon: '🍸', abv: 15 },
                { key: 'cocktail-fort', label: 'Cocktail fort', icon: '🍹', abv: 25 },
                { key: 'shot', label: 'Shot', icon: '🥃', abv: 40 },
                { key: 'whisky', label: 'Whisky', icon: '🥃', abv: 40 },
                { key: 'vodka', label: 'Vodka', icon: '🧊', abv: 40 },
                { key: 'rhum', label: 'Rhum', icon: '🏴‍☠️', abv: 40 },
                { key: 'gin', label: 'Gin', icon: '🫒', abv: 40 },
                { key: 'tequila', label: 'Tequila', icon: '🌵', abv: 40 },
                { key: 'pastis', label: 'Pastis', icon: '☀️', abv: 45 },
                { key: 'digestif', label: 'Digestif', icon: '🫗', abv: 35 },
                { key: 'apéritif', label: 'Apéritif', icon: '🍊', abv: 18 },
                { key: 'cidre', label: 'Cidre', icon: '🍏', abv: 5 },
                { key: 'saké', label: 'Saké', icon: '🍶', abv: 15 },
              ] as const).map((v) => (
                <button
                  key={v.key}
                  onClick={() => {
                    setDetails({ ...details, form: v.key, abv: v.abv });
                  }}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    details.form === v.key
                      ? 'border-red-500/50 text-red-300 bg-red-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {v.icon} {v.label} <span className="text-zinc-600">· {v.abv}%</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Nombre de verres</label>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setAmount(n)}
                  className={`px-2 py-1 rounded text-xs border transition ${
                    amount === n
                      ? 'border-red-500/50 text-red-300 bg-red-500/15'
                      : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {n} {n === 1 ? 'verre' : 'verres'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const SubstanceFields = memo(SubstanceFieldsInner);
export default SubstanceFields;
