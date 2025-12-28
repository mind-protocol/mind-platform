// DOCS: docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md

import type { CallType, TriggerKind } from "../../lib/flow_event_schema_and_normalization_contract";

export const dash_for_trigger = (trigger: TriggerKind) => {
  switch (trigger) {
    case "stream":
      return "2 6";
    case "async":
      return "8 6";
    case "hook":
      return "3 4";
    case "timer":
      return "6 4";
    default:
      return "";
  }
};

export const color_for_call_type = (callType: CallType) => {
  switch (callType) {
    case "graphLink":
      return "var(--stream)";
    case "graphQuery":
      return "var(--membrane)";
    case "llm":
      return "var(--canon)";
    case "moment":
      return "var(--canon)";
    default:
      return "var(--potential)";
  }
};

export const trigger_label = (trigger: TriggerKind) => {
  return trigger.toUpperCase();
};
