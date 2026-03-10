'use client';

import { useState, useRef, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { FAQ_CATEGORIES, type FAQQuestion, type FAQCategory } from '@/lib/faq/questions';

/* ── helpers ────────────────────────────────────────────── */

function t(record: Record<string, string>, locale: string): string {
  return record[locale] ?? record.en ?? '';
}

/* ── Answer card ────────────────────────────────────────── */

function AnswerCard({
  question,
  locale,
  isOpen,
  onToggle,
}: {
  question: FAQQuestion;
  locale: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const answer = t(question.answer, locale);

  return (
    <div className="border-b border-zinc-800/50 last:border-0">
      <button
        onClick={onToggle}
        className="w-full text-left py-4 px-1 flex items-start justify-between gap-4 group"
      >
        <span className="text-sm text-zinc-300 group-hover:text-white transition leading-relaxed">
          {t(question.question, locale)}
        </span>
        <svg
          className={`w-4 h-4 mt-0.5 flex-shrink-0 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && answer && (
        <div className="pb-4 px-1 space-y-3 animate-in slide-in-from-top-1 duration-200">
          <p className="text-sm text-zinc-400 leading-relaxed">{answer}</p>

          {/* Sources */}
          {question.sources && question.sources.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">Sources:</span>
              {question.sources.map((src) => (
                <Link
                  key={src.href}
                  href={src.href}
                  className="text-[11px] text-amber-500/70 hover:text-amber-400 transition underline underline-offset-2"
                >
                  {src.label}
                </Link>
              ))}
            </div>
          )}

          {/* Feedback */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-600">Helpful?</span>
            <button
              onClick={(e) => { e.stopPropagation(); setFeedback('up'); }}
              className={`text-xs transition ${feedback === 'up' ? 'text-green-400' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              {feedback === 'up' ? '👍' : '👍'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setFeedback('down'); }}
              className={`text-xs transition ${feedback === 'down' ? 'text-red-400' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              {feedback === 'down' ? '👎' : '👎'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Category accordion ─────────────────────────────────── */

function CategorySection({
  category,
  locale,
  openId,
  onOpenChange,
  filterText,
}: {
  category: FAQCategory;
  locale: string;
  openId: string | null;
  onOpenChange: (id: string | null) => void;
  filterText: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const filtered = filterText
    ? category.questions.filter(
        (q) =>
          t(q.question, locale).toLowerCase().includes(filterText) ||
          t(q.answer, locale).toLowerCase().includes(filterText),
      )
    : category.questions;

  if (filtered.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 mb-2 group"
      >
        <span className="text-lg">{category.icon}</span>
        <h2 className="text-base font-semibold text-zinc-200 group-hover:text-white transition">
          {t(category.label, locale)}
        </h2>
        <span className="text-[10px] text-zinc-600 ml-1">{filtered.length}</span>
        <svg
          className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${collapsed ? '-rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div className="ml-1 border-l border-zinc-800 pl-4">
          {filtered.map((q) => (
            <AnswerCard
              key={q.id}
              question={q}
              locale={locale}
              isOpen={openId === q.id}
              onToggle={() => onOpenChange(openId === q.id ? null : q.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── AI freeform answer ─────────────────────────────────── */

function AIAnswer({ answer, loading }: { answer: string | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-zinc-900/50 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs text-amber-500/60">Thinking...</span>
        </div>
      </div>
    );
  }

  if (!answer) return null;

  return (
    <div className="mt-4 p-4 rounded-xl bg-zinc-900/50 border border-amber-500/20">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-amber-500">Mind AI</span>
        <span className="text-[9px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">AI-generated</span>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{answer}</p>
    </div>
  );
}

/* ── Main FAQ client ────────────────────────────────────── */

export default function FAQClient() {
  const locale = useLocale();
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filterText = search.toLowerCase().trim();

  const handleAskAI = useCallback(async () => {
    const question = search.trim();
    if (!question || question.length < 5) return;

    setAiLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/faq/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || 'No answer available.');
    } catch {
      setAiAnswer('Failed to get an answer. Please try again.');
    } finally {
      setAiLoading(false);
    }
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAskAI();
    }
  };

  // Suggested questions (popular)
  const suggestions = [
    { id: 'what-is-mind-protocol', label: locale === 'fr' ? "C'est quoi Mind Protocol ?" : 'What is Mind Protocol?' },
    { id: 'what-is-duo', label: locale === 'fr' ? 'Le mode Duo ?' : 'How does Duo work?' },
    { id: 'data-shared', label: locale === 'fr' ? 'Mes données sont privées ?' : 'Is my data private?' },
    { id: 'what-is-mind-token', label: locale === 'fr' ? "C'est quoi $MIND ?" : 'What is $MIND?' },
  ];

  const matchCount = FAQ_CATEGORIES.reduce(
    (acc, cat) =>
      acc +
      cat.questions.filter(
        (q) =>
          !filterText ||
          t(q.question, locale).toLowerCase().includes(filterText) ||
          t(q.answer, locale).toLowerCase().includes(filterText),
      ).length,
    0,
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {locale === 'fr' ? 'Questions fréquentes' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-sm text-zinc-500">
          {locale === 'fr'
            ? "Trouvez des réponses ou posez votre question à l'IA"
            : 'Find answers or ask the AI anything'}
        </p>
      </div>

      {/* Search + Ask AI */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-amber-500/40 transition">
          <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setAiAnswer(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={locale === 'fr' ? 'Chercher ou poser une question...' : 'Search or ask a question...'}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none"
          />
          {search.trim().length >= 5 && (
            <button
              onClick={handleAskAI}
              disabled={aiLoading}
              className="text-[11px] font-medium text-amber-500 hover:text-amber-400 transition disabled:opacity-50 flex-shrink-0"
            >
              {aiLoading ? '...' : locale === 'fr' ? "Demander à l'IA" : 'Ask AI'}
            </button>
          )}
        </div>

        {/* AI answer */}
        <AIAnswer answer={aiAnswer} loading={aiLoading} />
      </div>

      {/* Suggested questions */}
      {!filterText && !aiAnswer && (
        <div className="flex flex-wrap gap-2 mb-8">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => setOpenId(openId === s.id ? null : s.id)}
              className={`text-[11px] px-3 py-1.5 rounded-full border transition ${
                openId === s.id
                  ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                  : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Filter count */}
      {filterText && (
        <p className="text-[11px] text-zinc-600 mb-4">
          {matchCount} {matchCount === 1 ? 'result' : 'results'}
          {matchCount === 0 && search.length >= 5 && (
            <span>
              {' — '}
              <button onClick={handleAskAI} className="text-amber-500 hover:underline">
                {locale === 'fr' ? "Demander à l'IA" : 'Ask the AI instead'}
              </button>
            </span>
          )}
        </p>
      )}

      {/* Categories */}
      <div className="space-y-8">
        {FAQ_CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            locale={locale}
            openId={openId}
            onOpenChange={setOpenId}
            filterText={filterText}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-zinc-800/50 text-center">
        <p className="text-xs text-zinc-600">
          {locale === 'fr'
            ? "Vous n'avez pas trouvé votre réponse ?"
            : "Didn't find what you're looking for?"}
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          {locale === 'fr' ? (
            <>Posez votre question dans le <span className="text-amber-500">chat</span> (coin bas-droit) ou sur <span className="text-amber-500">Telegram</span></>
          ) : (
            <>Ask in the <span className="text-amber-500">chat widget</span> (bottom-right) or on <span className="text-amber-500">Telegram</span></>
          )}
        </p>
      </div>
    </div>
  );
}
