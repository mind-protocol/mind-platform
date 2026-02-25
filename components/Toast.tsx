'use client';

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ─── Context ────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// ─── Provider ───────────────────────────────────────────────────

const TOAST_DURATION = 4000;
const EXIT_DURATION = 300;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), EXIT_DURATION);
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-4), { id, message, type }]); // max 5
      setTimeout(() => dismiss(id), TOAST_DURATION);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto cursor-pointer flex items-start gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg text-sm font-mono transition-all ${
              t.exiting
                ? 'opacity-0 translate-x-4'
                : 'opacity-100 translate-x-0 animate-slide-in'
            } ${typeStyles[t.type]}`}
            style={{ transitionDuration: `${EXIT_DURATION}ms` }}
          >
            <span className="text-base flex-shrink-0 mt-0.5">{typeIcons[t.type]}</span>
            <span className="leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(1rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 200ms ease-out; }
      `}</style>
    </ToastContext.Provider>
  );
}

// ─── Styles ─────────────────────────────────────────────────────

const typeStyles: Record<ToastType, string> = {
  success: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200',
  error:   'bg-red-950/90 border-red-500/30 text-red-200',
  warning: 'bg-amber-950/90 border-amber-500/30 text-amber-200',
  info:    'bg-zinc-900/90 border-zinc-700/50 text-zinc-200',
};

const typeIcons: Record<ToastType, string> = {
  success: '\u2705',
  error:   '\u274C',
  warning: '\u26A0\uFE0F',
  info:    '\u2139\uFE0F',
};
