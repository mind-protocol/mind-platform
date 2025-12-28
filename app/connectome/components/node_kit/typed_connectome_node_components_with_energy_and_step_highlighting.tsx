"use client";

// DOCS: docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md

import type { KeyboardEvent } from "react";
import type { NodeProps } from "reactflow";
import EnergyBadge from "./connectome_energy_badge_bucketed_glow_and_value_formatter";
import NodeFrame from "./connectome_node_frame_with_title_path_and_tooltip_shell";
import StepList from "./connectome_node_step_list_and_active_step_highlighter";
import PlayerWaitProgressBar from "./connectome_player_wait_progress_bar_with_four_second_cap";
import TickCronRing from "./connectome_tick_cron_circular_progress_ring_with_speed_label";
import { theme_for_node, title_color_for_node } from "./connectome_node_background_theme_tokens_by_type_and_language";
import type { ConnectomeNodeDefinition } from "../../lib/connectome_system_map_node_edge_manifest";
import type { FlowEvent } from "../../lib/flow_event_schema_and_normalization_contract";
import { dispatch_runtime_command } from "../../lib/next_step_gate_and_realtime_playback_runtime_engine";
import { useConnectomeStore } from "../../lib/zustand_connectome_state_store_with_atomic_commit_actions";

const build_node_tooltip = (node_id: string, ledger: FlowEvent[]) => {
  const last = [...ledger].reverse().find(
    (event) => event.from_node_id === node_id || event.to_node_id === node_id
  );
  if (!last) {
    return "No events yet.";
  }
  const duration = last.duration_ms !== undefined ? `${Math.round(last.duration_ms)}ms` : "?";
  const notes = last.notes ? ` Notes: ${last.notes}` : "";
  return `Last trigger: ${last.trigger}; call: ${last.call_type}; duration: ${duration}.${notes}`;
};

const BaseNode = ({ data }: NodeProps<ConnectomeNodeDefinition>) => {
  const renderHint = (data as any).render_hint ?? {};
  const className = theme_for_node(data);
  const titleColor = title_color_for_node(data);
  const activeNodeId = useConnectomeStore((state) => state.active_focus.active_node_id);
  const ledger = useConnectomeStore((state) => state.ledger);
  const isActive = activeNodeId === data.node_id;
  const tooltip = build_node_tooltip(data.node_id, ledger);
  return (
    <NodeFrame
      title={data.title}
      titleColor={titleColor}
      path={data.file_path}
      tooltip={tooltip}
      className={`${className} ${isActive ? "node-active-glow" : ""}`}
      compact={Boolean(renderHint.compact)}
      showPath={renderHint.show_path !== false}
    >
      {data.energy_value !== undefined ? <EnergyBadge value={data.energy_value} /> : null}
      {data.steps && renderHint.show_steps !== false ? <StepList steps={data.steps} /> : null}
    </NodeFrame>
  );
};

export const PlayerNode = ({ data }: NodeProps<ConnectomeNodeDefinition>) => {
  const renderHint = (data as any).render_hint ?? {};
  const className = theme_for_node(data);
  const titleColor = title_color_for_node(data);
  const activeNodeId = useConnectomeStore((state) => state.active_focus.active_node_id);
  const ledger = useConnectomeStore((state) => state.ledger);
  const isActive = activeNodeId === data.node_id;
  const tooltip = build_node_tooltip(data.node_id, ledger);
  const handleClick = () => {
    const content = window.prompt("Send a player message", "advance") ?? "";
    dispatch_runtime_command({ kind: "player_message", payload: { content } });
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };
  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Send player message"
    >
      <NodeFrame
        title={data.title}
        titleColor={titleColor}
        path={data.file_path}
        tooltip={tooltip}
        className={`${className} ${isActive ? "node-active-glow" : ""}`}
        compact={Boolean(renderHint.compact)}
        showPath={renderHint.show_path !== false}
      >
        <EnergyBadge value={data.energy_value} />
        {renderHint.show_wait !== false ? <PlayerWaitProgressBar /> : null}
      </NodeFrame>
    </div>
  );
};

export const UiNode = BaseNode;
export const ModuleNode = BaseNode;
export const GraphQueriesNode = BaseNode;
export const MomentNode = BaseNode;
export const AgentNode = BaseNode;

export const TickCronNode = ({ data }: NodeProps<ConnectomeNodeDefinition>) => {
  const renderHint = (data as any).render_hint ?? {};
  const className = theme_for_node(data);
  const titleColor = title_color_for_node(data);
  const activeNodeId = useConnectomeStore((state) => state.active_focus.active_node_id);
  const isActive = activeNodeId === data.node_id;
  return (
    <NodeFrame
      title={data.title}
      titleColor={titleColor}
      path={data.file_path}
      className={`${className} ${isActive ? "node-active-glow" : ""}`}
      compact={Boolean(renderHint.compact)}
      showPath={renderHint.show_path !== false}
    >
      {renderHint.show_tick !== false ? <TickCronRing /> : null}
    </NodeFrame>
  );
};
