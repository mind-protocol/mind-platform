'use client';

import { useEffect, useState } from 'react';

export default function WhitepaperPage() {
  const [doc, setDoc] = useState<{
    title: string;
    version: string;
    date: string;
    content: string;
    rawMarkdown: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/docs/whitepaper')
      .then((r) => r.json())
      .then(setDoc)
      .catch(console.error);
  }, []);

  const handleCopy = async () => {
    if (!doc) return;
    await navigator.clipboard.writeText(doc.rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!doc) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading whitepaper...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <article className="max-w-3xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="mb-12 border-b border-zinc-800 pb-8">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase mb-4">
            Whitepaper
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{doc.title}</h1>
          <div className="flex items-center gap-4 text-zinc-500 text-sm">
            <span>Version {doc.version}</span>
            <span>&middot;</span>
            <span>{doc.date}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-sm rounded border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
            <a
              href="/api/docs/whitepaper/pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm rounded border border-zinc-700 hover:border-amber-500 hover:text-amber-500 transition-colors"
            >
              Download PDF
            </a>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-p:text-zinc-300
            prose-headings:text-white
            prose-strong:text-white
            prose-em:text-zinc-400
            prose-a:text-amber-500
            prose-code:text-amber-400
            prose-code:bg-zinc-900
            prose-pre:bg-zinc-900
            prose-pre:border prose-pre:border-zinc-800
            prose-blockquote:border-amber-500/50
            prose-hr:border-zinc-800
            prose-table:text-zinc-300
            prose-th:text-white
            prose-th:border-zinc-700
            prose-td:border-zinc-800"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-zinc-800 text-center">
          <a
            href="/tokenomics"
            className="text-amber-500 hover:text-amber-400 transition-colors text-sm"
          >
            View Tokenomics Overview &rarr;
          </a>
        </footer>
      </article>
    </main>
  );
}
