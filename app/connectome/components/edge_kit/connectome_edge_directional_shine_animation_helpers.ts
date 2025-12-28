// DOCS: docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md

import type { TriggerKind } from "../../lib/flow_event_schema_and_normalization_contract";

export const edge_shine_class_for_trigger = (trigger: TriggerKind) => {
  if (trigger === "stream") {
    return "edge-shine-stream";
  }
  if (trigger === "async") {
    return "edge-shine-async";
  }
  return "edge-shine-direct";
};
