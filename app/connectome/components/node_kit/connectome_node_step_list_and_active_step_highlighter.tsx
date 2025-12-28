"use client";

// DOCS: docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md

import type { CallType } from "../../lib/flow_event_schema_and_normalization_contract";
import { useConnectomeStore } from "../../lib/zustand_connectome_state_store_with_atomic_commit_actions";

type StepItem = {
  step_key: string;
  label: string;
  call_type: CallType;
};

const color_for_call_type = (callType: CallType) => {
  switch (callType) {
    case "graphQuery":
      return "var(--membrane)";
    case "graphLink":
      return "var(--stream)";
    case "llm":
      return "var(--canon)";
    case "moment":
      return "var(--canon)";
    default:
      return "var(--potential)";
  }
};

export default function StepList({ steps }: { steps: StepItem[] }) {
  const activeStepKey = useConnectomeStore((state) => state.active_focus.active_step_key);
  return (
    <div className="node-steps">
      {steps.map((step) => {
        const isActive = step.step_key === activeStepKey;
        return (
          <div
            key={step.step_key}
            className={`node-step ${isActive ? "node-step-active" : ""}`}
            style={isActive ? { color: color_for_call_type(step.call_type) } : undefined}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
}
