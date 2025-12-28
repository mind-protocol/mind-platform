"use client";

// DOCS: docs/connectome/log_panel/IMPLEMENTATION_Connectome_Log_Panel_Component_Structure_And_Serializer_Integration.md

import { useEffect, useState } from "react";
import ExportButtons from "./connectome_log_export_buttons_using_state_store_serializers";
import {
  duration_class,
  duration_text,
} from "./connectome_log_duration_formatting_and_threshold_color_rules";
import {
  call_type_badge_class,
  trigger_badge_class,
} from "./connectome_log_trigger_and_calltype_badge_color_tokens";
import ConnectomeHealthPanel from "./connectome_health_panel";
import { useConnectomeStore } from "../lib/zustand_connectome_state_store_with_atomic_commit_actions";
import { CONNECTOME_NODE_MAP } from "../lib/connectome_system_map_node_edge_manifest";
import type { CallType, TriggerKind } from "../lib/flow_event_schema_and_normalization_contract";
import { color_for_call_type } from "./edge_kit/connectome_edge_style_tokens_for_trigger_and_calltype_mapping";

const node_label = (node_id: string) => {
  const node = CONNECTOME_NODE_MAP.get(node_id);
  return node?.title ?? node_id;
};

const node_class = (node_id: string) => {
  const node = CONNECTOME_NODE_MAP.get(node_id);
  if (!node) {
    return "log-node log-node-unknown";
  }
  return `log-node log-node-${node.node_type.toLowerCase()}`;
};

const call_type_detail = (callType: CallType) => {
  switch (callType) {
    case "graphQuery":
      return "graph query";
    case "graphLink":
      return "graph link";
    case "llm":
      return "LLM input call";
    case "moment":
      return "moment update";
    default:
      return "code call";
  }
};

const trigger_detail = (trigger: TriggerKind) => {
  switch (trigger) {
    case "stream":
      return "stream";
    case "async":
      return "async";
    case "hook":
      return "hook";
    case "timer":
      return "timer";
    default:
      return "direct";
  }
};

export default function LogPanel() {
  const ledger = useConnectomeStore((state) => state.ledger);
  const cursor = useConnectomeStore((state) => state.cursor);
  const explanation = useConnectomeStore((state) => state.current_explanation);
  const activeFocus = useConnectomeStore((state) => state.active_focus);
  const searchResults = useConnectomeStore((state) => state.search_results);

  const currentEvent = ledger.length ? ledger[ledger.length - 1] : null;
  const stepLabel = `Step ${cursor}`;

  return (
    <div className="connectome-log-panel">
      <div className="log-now prominent-now">
        <div className="log-now-header">
          <h3>Current Active Event</h3>
          <div className="now-title">{stepLabel}</div>
        </div>
        {currentEvent ? (
          <div className="now-detail">
            <div className="now-flow">
              <span className={node_class(currentEvent.from_node_id)}>
                {node_label(currentEvent.from_node_id)}
              </span>
              <span className="log-arrow">→</span>
              <span className={node_class(currentEvent.to_node_id)}>
                {node_label(currentEvent.to_node_id)}
              </span>
            </div>
            <div
              className="now-link prominent-link"
              style={{ color: color_for_call_type(currentEvent.call_type) }}
            >
              {currentEvent.label}
            </div>
          </div>
        ) : (
          <div className="now-detail">No activity recorded</div>
        )}
        {activeFocus.active_step_key ? (
          <div className="now-meta">Focus: {activeFocus.active_step_key}</div>
        ) : null}
        <div className="log-explanation prominent-explanation">
          <div className="log-explanation-title">Explanation</div>
          <div className="log-explanation-body">{explanation.sentence}</div>
        </div>
      </div>

      <div className="log-ledger">
        <div className="log-ledger-header">
          <h3>Event Ledger</h3>
          <ExportButtons />
        </div>
        {searchResults?.matches?.length ? (
          <div className="log-search-results">
            <div className="log-explanation-title">Search Matches</div>
            {searchResults.matches.map((match: any) => (
              <div className="log-entry-line" key={match.id ?? match.name}>
                <span className="log-node log-node-moment">{match.name ?? match.id}</span>
                <span className="log-meta">
                  {typeof match.similarity === "number"
                    ? `${Math.round(match.similarity * 100)}%`
                    : "?"}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        <div className="log-entries">
          {ledger.slice().reverse().map((event) => {
            const tooltip = `Trigger: ${event.trigger}; Call: ${event.call_type}; Duration: ${
              event.duration_ms ? `${Math.round(event.duration_ms)}ms` : "?"
            }${event.payload_summary ? `; ${event.payload_summary}` : ""}${
              event.notes ? `; ${event.notes}` : ""
            }`;
            return (
              <div className="log-entry" key={event.id} title={tooltip}>
                <div className="log-entry-header">
                  <span>{Math.round(event.at_ms)}ms</span>
                  <span className={trigger_badge_class(event.trigger)}>{event.trigger}</span>
                  <span className={call_type_badge_class(event.call_type)}>{event.call_type}</span>
                  <span className={duration_class(event.duration_ms)}>
                    {duration_text(event.duration_ms)}
                  </span>
                </div>
                <div className="log-entry-body">
                  <div className="log-entry-line">
                    <span className={node_class(event.from_node_id)}>
                      {node_label(event.from_node_id)}
                    </span>
                    <span className="log-arrow">→</span>
                    <span className={node_class(event.to_node_id)}>
                      {node_label(event.to_node_id)}
                    </span>
                    <span
                      className="log-link-label"
                      style={{ color: color_for_call_type(event.call_type) }}
                    >
                      {event.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
