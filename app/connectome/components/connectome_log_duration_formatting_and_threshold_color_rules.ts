// DOCS: docs/connectome/log_panel/IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md

import {
  duration_bucket_for_log,
  format_duration_for_log,
} from "../lib/flow_event_duration_bucket_color_classifier";

export const duration_text = (duration_ms?: number) => {
  return format_duration_for_log(duration_ms);
};

export const duration_class = (duration_ms?: number) => {
  const bucket = duration_bucket_for_log(duration_ms);
  switch (bucket) {
    case "blue":
      return "badge-duration duration-blue";
    case "yellow":
      return "badge-duration duration-yellow";
    case "orange":
      return "badge-duration duration-orange";
    case "red":
      return "badge-duration duration-red";
    default:
      return "badge-duration duration-muted";
  }
};
