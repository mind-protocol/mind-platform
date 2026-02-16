'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

interface Party {
  name: string;
  role?: string;
  email?: string;
}

interface Signature {
  name: string;
  email?: string;
  signed_at: string;
}

interface Contract {
  id: string;
  title: string;
  body: string;
  parties: Party[];
  created_by: string;
  created_at: string;
  expires_at: string;
  status: 'pending' | 'signed' | 'expired';
  signatures: Signature[];
}

type Step = 'loading' | 'not_found' | 'view' | 'signing' | 'signed' | 'already_signed' | 'expired' | 'error';

function SignForm() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get('id') || '';

  const [step, setStep] = useState<Step>('loading');
  const [contract, setContract] = useState<Contract | null>(null);
  const [error, setError] = useState('');

  // Signing form
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signedAt, setSignedAt] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contractId) {
      setStep('not_found');
      setError('No contract ID provided.');
      return;
    }
    loadContract();
  }, [contractId]);

  async function loadContract() {
    try {
      const res = await fetch(`/api/sign/${contractId}`);
      if (!res.ok) {
        setStep('not_found');
        setError('Contract not found or has been removed.');
        return;
      }
      const data: Contract = await res.json();
      setContract(data);

      if (data.status === 'expired') {
        setStep('expired');
      } else if (data.status === 'signed') {
        setStep('already_signed');
      } else {
        setStep('view');
      }
    } catch {
      setStep('error');
      setError('Unable to load contract. Please try again.');
    }
  }

  async function handleSign(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed || !signerName.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/sign/${contractId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signer_name: signerName.trim(),
          signer_email: signerEmail.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signing failed.');
        setIsSubmitting(false);
        return;
      }

      setSignedAt(data.signature?.signed_at || new Date().toISOString());
      setStep('signed');
    } catch {
      setError('Connection error. Please try again.');
    }

    setIsSubmitting(false);
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  // Render markdown-like body (simple: **bold**, newlines → paragraphs)
  function renderBody(text: string) {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-3" />;

      // Section headers (lines starting with ##)
      if (line.startsWith('## ')) {
        return (
          <h3 key={i} className="text-lg font-bold text-white mt-6 mb-2">
            {line.slice(3)}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3">
            {line.slice(2)}
          </h2>
        );
      }

      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={i} className="flex gap-2 ml-4">
            <span className="text-amber-500">&#x2022;</span>
            <p className="text-zinc-300 text-sm leading-relaxed">{line.slice(2)}</p>
          </div>
        );
      }

      // Regular paragraph
      return (
        <p key={i} className="text-zinc-300 text-sm leading-relaxed">
          {line}
        </p>
      );
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-zinc-500 hover:text-amber-500 text-sm">
            mind protocol
          </Link>
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Loading contract...</p>
          </div>
        )}

        {/* Not Found */}
        {step === 'not_found' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">&#x1F4C4;</div>
            <h2 className="text-lg font-bold text-red-400 mb-2">Contract Not Found</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
          </div>
        )}

        {/* Expired */}
        {step === 'expired' && contract && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h1 className="text-xl font-bold mb-1">{contract.title}</h1>
              <p className="text-zinc-500 text-sm">Created by {contract.created_by}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">&#x23F0;</div>
              <h2 className="text-lg font-bold text-red-400 mb-2">Contract Expired</h2>
              <p className="text-zinc-400 text-sm">
                This contract expired on {formatDate(contract.expires_at)}.
              </p>
            </div>
          </div>
        )}

        {/* Already Fully Signed */}
        {step === 'already_signed' && contract && (
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h1 className="text-xl font-bold mb-1">{contract.title}</h1>
              <p className="text-zinc-500 text-sm">Created by {contract.created_by}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">&#x2705;</div>
                <h2 className="text-xl font-bold text-emerald-400">Fully Signed</h2>
              </div>
              <div className="space-y-3 mt-4">
                {contract.signatures.map((sig, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-400">&#x2714;</span>
                    <span className="text-white font-medium">{sig.name}</span>
                    <span className="text-zinc-500">{formatDate(sig.signed_at)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div ref={bodyRef} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              {renderBody(contract.body)}
            </div>
            <div className="text-center">
              <a
                href={`/api/sign/${contract.id}/pdf`}
                className="inline-block px-6 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm transition"
              >
                Download PDF
              </a>
            </div>
          </div>
        )}

        {/* View Contract + Sign */}
        {step === 'view' && contract && (
          <div className="space-y-6">
            {/* Title Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold mb-1">{contract.title}</h1>
                  <p className="text-zinc-500 text-sm">
                    Created by {contract.created_by} &middot; {formatDate(contract.created_at)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                  Pending
                </span>
              </div>

              {/* Parties */}
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Parties</p>
                <div className="flex flex-wrap gap-3">
                  {contract.parties.map((p, i) => {
                    const isSigned = contract.signatures.some(
                      s => s.name.toLowerCase() === p.name.toLowerCase()
                    );
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className={isSigned ? 'text-emerald-400' : 'text-zinc-600'}>
                          {isSigned ? '\u2714' : '\u25CB'}
                        </span>
                        <span className="text-sm text-white">{p.name}</span>
                        {p.role && (
                          <span className="text-xs text-zinc-500">({p.role})</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expires */}
              {contract.expires_at && (
                <p className="text-zinc-600 text-xs mt-3">
                  Expires: {formatDate(contract.expires_at)}
                </p>
              )}
            </div>

            {/* Contract Body */}
            <div ref={bodyRef} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">Agreement</p>
              {renderBody(contract.body)}
            </div>

            {/* Existing Signatures */}
            {contract.signatures.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Signed By</p>
                {contract.signatures.map((sig, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm mb-2">
                    <span className="text-emerald-400">&#x2714;</span>
                    <span className="text-white font-medium">{sig.name}</span>
                    <span className="text-zinc-500 text-xs">{formatDate(sig.signed_at)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Sign Form */}
            <form onSubmit={handleSign} className="bg-zinc-900/50 border border-amber-500/30 rounded-xl p-6">
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">Sign This Contract</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-500 text-xs mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                    placeholder="Your full legal name"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 text-xs mb-1">Email</label>
                  <input
                    type="email"
                    value={signerEmail}
                    onChange={(e) => setSignerEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 accent-amber-500"
                  />
                  <span className="text-sm text-zinc-300">
                    I have read and agree to the terms of this contract. I understand this constitutes
                    a legally binding electronic signature.
                  </span>
                </label>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !agreed || !signerName.trim()}
                className="w-full mt-6 bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing...' : 'Sign Contract'}
              </button>

              <p className="text-zinc-600 text-xs text-center mt-3">
                Your IP address and timestamp will be recorded as proof of signature.
              </p>
            </form>
          </div>
        )}

        {/* Signing step (intermediate) */}
        {step === 'signing' && (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Recording your signature...</p>
          </div>
        )}

        {/* Successfully Signed */}
        {step === 'signed' && contract && (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">&#x2705;</div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-2">Contract Signed</h2>
              <p className="text-zinc-400 mb-1">
                <span className="text-white font-medium">{signerName}</span> signed{' '}
                <span className="text-white font-medium">{contract.title}</span>
              </p>
              <p className="text-zinc-500 text-sm">{formatDate(signedAt)}</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
              <p className="text-zinc-400 text-sm mb-4">
                A record of your signature has been saved. You can download the contract as PDF.
              </p>
              <a
                href={`/api/sign/${contract.id}/pdf`}
                className="inline-block px-6 py-2.5 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 text-sm transition"
              >
                Download PDF
              </a>
            </div>

            <p className="text-zinc-600 text-xs text-center">
              You can close this page. Both parties will receive confirmation.
            </p>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">&#x26A0;&#xFE0F;</div>
            <h2 className="text-lg font-bold text-red-400 mb-2">Error</h2>
            <p className="text-zinc-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-amber-500 hover:text-amber-400 text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-zinc-700 text-xs text-center mt-12">
          Powered by Mind Protocol &middot; Electronic signatures
        </p>
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-zinc-500">Loading...</p>
      </div>
    </main>
  );
}

export default function SignPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignForm />
    </Suspense>
  );
}
