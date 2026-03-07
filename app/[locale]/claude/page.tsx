'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_MANEMUS_URL || 'https://api.mindprotocol.ai';

type Step = 'loading' | 'invalid' | 'otp' | 'consent' | 'upload' | 'processing' | 'success' | 'error';

function ClaudeIntegrationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [step, setStep] = useState<Step>('loading');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [tier, setTier] = useState('free');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Consent
  const [consentAnalyze, setConsentAnalyze] = useState(false);
  const [consentSave, setConsentSave] = useState(false);

  // Upload + Processing
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scope, setScope] = useState('30d');
  const [uploadId, setUploadId] = useState('');
  const [convCount, setConvCount] = useState(0);
  const [jobId, setJobId] = useState('');
  const [progress, setProgress] = useState(0);
  const [insightsFound, setInsightsFound] = useState(0);
  const [insightsCount, setInsightsCount] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Verify session on mount
  useEffect(() => {
    if (!token) {
      setStep('invalid');
      setError('Lien invalide. Tape /claude dans ton chat pour en obtenir un nouveau.');
      return;
    }
    checkSession();
  }, [token]);

  async function checkSession() {
    try {
      const res = await fetch(`${API_URL}/claude/session/${token}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStep('invalid');
        setError(data.error || 'Ce lien a expire. Tape /claude dans ton chat pour en generer un nouveau.');
        return;
      }
      const data = await res.json();
      setUserId(data.user_id);
      setTier(data.tier || 'free');

      if (data.status === 'otp_verified') {
        setStep('consent');
      } else if (data.status === 'consented_no_upload' || data.status === 'upload_received' || data.status === 'processing_failed') {
        setStep('upload');
      } else if (data.status === 'processing_accepted' || data.status === 'processing') {
        setStep('processing');
      } else if (data.status === 'active') {
        setStep('success');
      } else {
        setStep('otp');
      }
    } catch {
      setStep('error');
      setError('Impossible de se connecter au serveur. Reessaie.');
    }
  }

  // OTP input handlers
  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/claude/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: token, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Code invalide.');
        setIsSubmitting(false);
        return;
      }

      setUserId(data.user_id);
      setStep('consent');
    } catch {
      setError('Erreur de connexion. Reessaie.');
    }

    setIsSubmitting(false);
  }

  async function handleConsentSubmit() {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/claude/consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_token: token,
          scopes: {
            analyze_conversations: consentAnalyze,
            save_insights: consentSave,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Erreur lors de l\'enregistrement du consentement.');
        setIsSubmitting(false);
        return;
      }

      setStep('upload');
    } catch {
      setError('Erreur de connexion. Reessaie.');
    }

    setIsSubmitting(false);
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  async function handleUpload() {
    if (!selectedFile) return;
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(`${API_URL}/claude/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'upload.');
        setIsSubmitting(false);
        return;
      }

      setUploadId(data.upload_id);
      setConvCount(data.conversation_count);
    } catch {
      setError('Erreur de connexion. Reessaie.');
    }

    setIsSubmitting(false);
  }

  async function handleAnalyze() {
    if (!uploadId) return;
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/claude/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ upload_id: uploadId, scope }),
      });

      const data = await res.json();

      if (res.status !== 202) {
        // If upload expired (server restart), reset to file picker
        if (data.error?.includes('Upload not found') || data.error?.includes('re-upload')) {
          setUploadId('');
          setSelectedFile(null);
          setConvCount(0);
        }
        setError(data.error || 'Erreur lors du lancement de l\'analyse.');
        setIsSubmitting(false);
        return;
      }

      setJobId(data.job_id);
      setStep('processing');
      startPolling(data.job_id);
    } catch {
      setError('Erreur de connexion. Reessaie.');
    }

    setIsSubmitting(false);
  }

  function startPolling(jid: string) {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/claude/status/${jid}`);
        if (!res.ok) return;

        const data = await res.json();
        setProgress(data.progress_pct || 0);

        if (data.insights_found !== undefined) setInsightsFound(data.insights_found);

        if (data.status === 'completed') {
          if (pollRef.current) clearInterval(pollRef.current);
          setInsightsCount(data.insights_count || 0);
          setProgress(100);
          setStep('success');
        } else if (data.status === 'failed') {
          if (pollRef.current) clearInterval(pollRef.current);
          setError(data.error === 'extraction_error'
            ? 'L\'analyse a echoue. Tes donnees brutes ont ete supprimees. Reessaie.'
            : 'Erreur d\'analyse. Reessaie.');
          setStep('error');
        }
      } catch {
        // Silent — will retry on next interval
      }
    }, 3000);
  }

  function handleConsentRefuse() {
    setStep('invalid');
    setError('Pas de souci. Tu peux revenir quand tu veux en tapant /claude dans ton chat MIND. Aucune donnee n\'a ete enregistree.');
  }

  const bothChecked = consentAnalyze && consentSave;

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-zinc-500 text-sm">mind protocol</p>
          <h1 className="text-2xl font-bold font-mono mt-2">MIND x Claude</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Memoire augmentee
          </p>
        </div>

        {/* Step indicator */}
        {step !== 'loading' && step !== 'invalid' && step !== 'error' && step !== 'success' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {(['otp', 'consent', 'upload', 'processing'] as const).map((s, i) => {
              const steps = ['otp', 'consent', 'upload', 'processing'];
              const currentIdx = steps.indexOf(step);
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono
                    ${step === s ? 'bg-amber-500 text-black' :
                      currentIdx > i ?
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-zinc-800 text-zinc-500'}`}>
                    {currentIdx > i ? '\u2713' : i + 1}
                  </div>
                  {i < 3 && <div className="w-6 h-px bg-zinc-700" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {step === 'loading' && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Verification du lien...</p>
          </div>
        )}

        {/* Invalid / Expired */}
        {step === 'invalid' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
            <p className="text-zinc-400 text-sm whitespace-pre-line">{error}</p>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-400 text-sm mb-6 text-center">
                Un code de verification a ete envoye dans ton chat.
                <br />Entre-le ici pour continuer.
              </p>

              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    aria-label={`Digit ${i + 1}`}
                    className="w-12 h-14 bg-zinc-900 border border-zinc-700 rounded-lg text-center text-xl font-mono text-white focus:border-amber-500 focus:outline-none transition"
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otp.join('').length !== 6}
              className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verification...' : 'Verifier'}
            </button>

            <p className="text-zinc-600 text-xs text-center">
              Tu n&apos;as pas recu le code ? Tape /claude dans ton chat.
            </p>
          </form>
        )}

        {/* Consent Step */}
        {step === 'consent' && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-center">Qu&apos;est-ce que MIND va faire ?</h2>

              <ol className="text-zinc-400 text-sm space-y-2 list-decimal list-inside">
                <li>Lire les conversations de ton export Claude</li>
                <li>En extraire des insights structures
                  <br /><span className="text-zinc-500 text-xs ml-4">(projets, objectifs, preferences, contraintes, relations)</span>
                </li>
                <li>Sauvegarder ces insights dans ton profil MIND</li>
                <li>Supprimer les conversations brutes</li>
              </ol>

              <div className="border-t border-zinc-800 pt-4 space-y-3 text-sm">
                <div>
                  <span className="text-zinc-500">Ce que MIND lit</span>
                  <p className="text-zinc-400">Les conversations dans l&apos;export que tu fournis, dans la periode que tu choisis.</p>
                </div>
                <div>
                  <span className="text-zinc-500">Ce que MIND garde</span>
                  <p className="text-zinc-400">Des insights structures. Jamais le texte brut de tes conversations.</p>
                </div>
                <div>
                  <span className="text-zinc-500">Ce que MIND supprime</span>
                  <p className="text-zinc-400">Les conversations brutes — chiffrees pendant l&apos;analyse, puis supprimees automatiquement.</p>
                </div>
                <div>
                  <span className="text-zinc-500">Tes droits</span>
                  <p className="text-zinc-400">Voir, modifier, exporter ou supprimer tes insights a tout moment.</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    Politique complete : mindprotocol.ai/privacy
                    <br />Contact : privacy@mindprotocol.ai
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consentAnalyze}
                    onChange={(e) => setConsentAnalyze(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"
                  />
                  <span className="text-sm text-zinc-300 group-hover:text-white transition">
                    J&apos;autorise MIND a analyser mes conversations Claude pour en extraire des insights structures.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consentSave}
                    onChange={(e) => setConsentSave(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-zinc-600 text-amber-500 focus:ring-amber-500 bg-zinc-900"
                  />
                  <span className="text-sm text-zinc-300 group-hover:text-white transition">
                    J&apos;autorise MIND a sauvegarder ces insights dans mon profil memoire.
                  </span>
                </label>
              </div>

              <p className="text-zinc-500 text-xs">
                Tes conversations brutes sont chiffrees pendant l&apos;analyse puis supprimees automatiquement. Elles ne sont jamais conservees.
              </p>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </div>

            <button
              onClick={handleConsentSubmit}
              disabled={!bothChecked || isSubmitting}
              className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enregistrement...' : 'J\'accepte et je continue'}
            </button>

            <button
              onClick={handleConsentRefuse}
              className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-2 transition"
            >
              Refuser
            </button>
          </div>
        )}

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="space-y-6">
            {!uploadId ? (
              <>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-center mb-4">Upload ton export Claude</h2>

                  <div className="bg-zinc-800/50 rounded-lg p-4 text-left text-sm text-zinc-400 space-y-2 mb-6">
                    <p className="text-zinc-300 font-medium">Comment obtenir ton export :</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Va sur claude.ai &rarr; Parametres &rarr; Compte</li>
                      <li>Clique &quot;Exporter mes donnees&quot;</li>
                      <li>Anthropic t&apos;envoie un email avec un lien</li>
                      <li>Telecharge le fichier .zip</li>
                      <li>Selectionne-le ci-dessous</li>
                    </ol>
                  </div>

                  <label className="block w-full cursor-pointer">
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition
                      ${selectedFile ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-700 hover:border-zinc-600'}`}>
                      {selectedFile ? (
                        <div>
                          <p className="text-amber-400 font-mono text-sm">{selectedFile.name}</p>
                          <p className="text-zinc-500 text-xs mt-1">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-zinc-400 text-sm">Clique ou glisse ton fichier .zip ici</p>
                          <p className="text-zinc-600 text-xs mt-1">Max 100 MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setSelectedFile(f);
                      }}
                    />
                  </label>

                  {error && (
                    <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
                  )}
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isSubmitting}
                  className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Upload en cours...' : 'Uploader'}
                </button>
              </>
            ) : (
              <>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">
                      &#x2713;
                    </div>
                    <p className="text-emerald-400 text-sm font-medium">
                      {convCount} conversations detectees
                    </p>
                  </div>

                  <h2 className="text-lg font-bold mb-3">Choisis la periode</h2>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '30d', label: '30 jours' },
                      { value: '90d', label: '90 jours' },
                      { value: '6m', label: '6 mois' },
                      { value: 'all', label: 'Tout' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setScope(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-mono transition
                          ${scope === opt.value
                            ? 'bg-amber-500 text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {tier === 'free' && (
                    <p className="text-zinc-500 text-xs mt-3">
                      Import gratuit : max 30 conversations. Passe a Lifeline+ pour 200.
                    </p>
                  )}

                  {error && (
                    <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
                  )}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Lancement...' : 'Analyser mes conversations'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-center mb-4">Analyse en cours</h2>

              <div className="w-full bg-zinc-800 rounded-full h-3 mb-3">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-zinc-500">
                <span>{progress}%</span>
                <span>{insightsFound} insights trouves</span>
              </div>

              <p className="text-zinc-500 text-xs text-center mt-4">
                Tes conversations sont analysees puis supprimees.
                <br />Tu peux fermer cette page, l&apos;analyse continue.
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">&#x2705;</div>
            <h2 className="text-xl font-bold text-emerald-400 mb-2">Analyse terminee</h2>
            <p className="text-zinc-400 text-sm mb-2">
              {insightsCount > 0
                ? `${insightsCount} insights extraits de tes conversations.`
                : 'Tes insights sont disponibles.'}
            </p>
            <p className="text-zinc-500 text-xs">
              Tape /insights dans ton chat pour les voir.
              <br />Tes conversations brutes ont ete supprimees.
            </p>
          </div>
        )}

        {/* Generic Error */}
        {step === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold text-red-400 mb-2">Erreur</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-amber-500 hover:text-amber-400 text-sm"
            >
              Reessayer
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-zinc-700 text-xs text-center mt-8">
          mind protocol &middot; memoire augmentee
        </p>
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-zinc-500">Chargement...</p>
      </div>
    </main>
  );
}

export default function ClaudePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClaudeIntegrationForm />
    </Suspense>
  );
}
