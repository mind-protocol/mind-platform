'use client';

import { ReactNode } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  className?: string;
}

const TRANSFORMS: Record<string, string> = {
  up: 'translateY(24px)',
  left: 'translateX(-24px)',
  right: 'translateX(24px)',
  none: 'none',
};

export function FadeInSection({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: FadeInSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      ref={ref}
      className={className}
      style={
        reducedMotion
          ? {}
          : {
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : TRANSFORMS[direction],
              transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
            }
      }
    >
      {children}
    </div>
  );
}
