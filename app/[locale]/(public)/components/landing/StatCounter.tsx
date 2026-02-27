'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface StatCounterProps {
  target: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function StatCounter({ target, label, suffix = '', duration = 1500 }: StatCounterProps) {
  const { ref, inView } = useInView({ threshold: 0.3 });
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setCount(target);
      return;
    }

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  const formatted = count >= 1000000
    ? `${(count / 1000000).toFixed(0)}M`
    : count >= 1000
      ? `${(count / 1000).toFixed(0)}K`
      : count.toLocaleString();

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-3xl md:text-4xl font-bold text-amber-500">
        {formatted}{suffix}
      </div>
      <div className="text-zinc-500 text-sm mt-2">{label}</div>
    </div>
  );
}
