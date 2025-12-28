// DOCS: docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md

import type { ConnectomeNodeDefinition } from "../../lib/connectome_system_map_node_edge_manifest";

export const theme_for_node = (node: ConnectomeNodeDefinition) => {
  switch (node.node_type) {
    case "Player":
      return "node-theme-player";
    case "UI":
      return "node-theme-ui";
    case "GraphQueries":
      return "node-theme-graph";
    case "Moment":
      return "node-theme-moment";
    case "Agent":
      return "node-theme-agent";
    case "TickCron":
      return "node-theme-tick";
    case "Module":
      return node.language === "PY" ? "node-theme-module-py" : "node-theme-module-ts";
    default:
      return "node-theme-neutral";
  }
};

export const title_color_for_node = (node: ConnectomeNodeDefinition) => {
  switch (node.node_type) {
    case "Player":
      return "var(--canon)";
    case "UI":
      return "var(--membrane)";
    case "GraphQueries":
      return "var(--membrane)";
    case "Moment":
      return "var(--canon)";
    case "Agent":
      return "var(--canon)";
    case "TickCron":
      return "var(--potential)";
    case "Module":
      return "var(--potential)";
    default:
      return "var(--potential)";
  }
};
