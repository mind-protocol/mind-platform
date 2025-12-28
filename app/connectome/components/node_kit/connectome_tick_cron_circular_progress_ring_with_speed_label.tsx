"use client";

// DOCS: docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md

import { useEffect, useMemo, useRef, useState } from "react";
import { select_tick_display } from "../../lib/connectome_wait_timer_progress_and_tick_display_signal_selectors";
import { useConnectomeStore } from "../../lib/zustand_connectome_state_store_with_atomic_commit_actions";

const radius = 22;
const circumference = 2 * Math.PI * radius;

const color_for_speed = (speed: string) => {
  switch (speed) {
    case "1x":
      return "var(--membrane)";
    case "2x":
      return "var(--potential)";
    case "3x":
      return "var(--stream)";
    default:
      return "var(--potential)";
  }
};

export default function TickCronRing() {
  const state = useConnectomeStore();
  const display = useMemo(() => select_tick_display(state), [state]);
  const [tick, setTick] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [display.nominal_interval_ms, display.speed_label]);

  useEffect(() => {
    if (!Number.isFinite(display.nominal_interval_ms)) {
      return;
    }
    const interval = window.setInterval(() => {
      setTick(Date.now());
    }, 120);
    return () => {
      window.clearInterval(interval);
    };
  }, [display.nominal_interval_ms]);

  const progress = useMemo(() => {
    if (!Number.isFinite(display.nominal_interval_ms)) {
      return 0;
    }
    const elapsed = (tick - startRef.current) % display.nominal_interval_ms;
    return Math.min(Math.max(elapsed / display.nominal_interval_ms, 0), 1);
  }, [display.nominal_interval_ms, tick]);

  const offset = circumference - progress * circumference;
  const label = display.speed_label === "pause" ? "x0" : display.speed_label;
  return (
    <div className="tick-ring">
      <svg width="54" height="54">
        <circle
          cx="27"
          cy="27"
          r={radius}
          stroke="rgba(18, 18, 18, 0.12)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="27"
          cy="27"
          r={radius}
          stroke={color_for_speed(display.speed_label)}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="tick-ring-label">{label}</div>
    </div>
  );
}
