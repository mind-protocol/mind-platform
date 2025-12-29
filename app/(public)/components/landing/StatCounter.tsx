'use client';

import { useEffect, useState } from 'react';

interface StatCounterProps {
  value: number | undefined;
  label: string;
}

export function StatCounter({ value, label }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === undefined) return;

    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-amber-500">
        {value === undefined ? '-' : displayValue.toLocaleString()}
      </div>
      <div className="text-zinc-400 mt-1">{label}</div>
    </div>
  );
}
