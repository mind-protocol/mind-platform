"use client";

// DOCS: docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md

import { useEffect, useMemo, useState } from "react";
import { useConnectomeStore } from "../../lib/zustand_connectome_state_store_with_atomic_commit_actions";

const color_for_seconds = (seconds: number) => {
  if (seconds < 1) {
    return "var(--membrane)";
  }
  if (seconds < 2) {
    return "var(--canon)";
  }
  if (seconds < 3) {
    return "var(--stream)";
  }
  return "var(--stream)";
};

export default function PlayerWaitProgressBar() {
  const waitProgress = useConnectomeStore((state) => state.wait_progress);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!waitProgress.started_at_ms || waitProgress.stopped_at_ms) {
      setTick(0);
      return;
    }
    const interval = window.setInterval(() => {
      setTick(Date.now());
    }, 120);
    return () => {
      window.clearInterval(interval);
    };
  }, [waitProgress.started_at_ms, waitProgress.stopped_at_ms]);

  const progress = useMemo(() => {
    if (!waitProgress.started_at_ms) {
      return { value_0_1: 0, seconds_display: 0 };
    }
    const now_ms = waitProgress.stopped_at_ms ?? tick ?? Date.now();
    const elapsed_s = Math.min(
      Math.max((now_ms - waitProgress.started_at_ms) / 1000, 0),
      waitProgress.max_seconds
    );
    return {
      value_0_1: elapsed_s / waitProgress.max_seconds,
      seconds_display: Number(elapsed_s.toFixed(1)),
    };
  }, [tick, waitProgress.max_seconds, waitProgress.started_at_ms, waitProgress.stopped_at_ms]);
  return (
    <div>
      <div className="wait-bar">
        <div
          className="wait-bar-fill"
          style={{
            width: `${progress.value_0_1 * 100}%`,
            background: color_for_seconds(progress.seconds_display),
          }}
        />
      </div>
      <div className="node-path">Wait {progress.seconds_display.toFixed(1)}s</div>
    </div>
  );
}
