// DOCS: docs/connectome/log_panel/IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md

import type { CallType, TriggerKind } from "../lib/flow_event_schema_and_normalization_contract";

export const trigger_badge_class = (trigger: TriggerKind) => {
  switch (trigger) {
    case "direct":
      return "badge-trigger badge-direct";
    case "stream":
      return "badge-trigger badge-stream";
    case "async":
      return "badge-trigger badge-async";
    case "hook":
      return "badge-trigger badge-hook";
    case "timer":
      return "badge-trigger badge-timer";
    default:
      return "badge-trigger";
  }
};

export const call_type_badge_class = (callType: CallType) => {
  switch (callType) {
    case "graphLink":
      return "badge-calltype badge-graphlink";
    case "graphQuery":
      return "badge-calltype badge-graphquery";
    case "llm":
      return "badge-calltype badge-llm";
    case "moment":
      return "badge-calltype badge-moment";
    default:
      return "badge-calltype badge-code";
  }
};
