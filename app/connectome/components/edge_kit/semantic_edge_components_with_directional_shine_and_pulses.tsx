"use client";

// DOCS: docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md

import type { EdgeProps } from "reactflow";
import { getBezierPath } from "reactflow";
import EdgeLabel from "./connectome_edge_label_renderer_with_halo_and_zoom_policy";
import {
  color_for_call_type,
  dash_for_trigger,
} from "./connectome_edge_style_tokens_for_trigger_and_calltype_mapping";
import { edge_shine_class_for_trigger } from "./connectome_edge_directional_shine_animation_helpers";
import { pulse_strength_from_energy } from "./connectome_edge_pulse_particle_animation_and_boundary_clamp_helpers";
import { intersect_line_with_rect } from "./connectome_node_boundary_intersection_geometry_helpers";

const EdgeComponent = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const callType = data?.call_type ?? "code";
  const trigger = data?.trigger ?? "direct";
  const label = data?.label ?? "?";
  const isActive = Boolean(data?.active);
  const color = color_for_call_type(callType);
  const dash = dash_for_trigger(trigger);
  const pulseStrength = pulse_strength_from_energy(data?.energy_delta);
  const energyIntensity = Math.max(0.2, Math.min(1, data?.energy_delta ?? 0.4));
  const strokeWidth = (isActive ? 3.2 : 2.2) + energyIntensity * 0.6;
  const glowOpacity = isActive ? pulseStrength : 0.25 + energyIntensity * 0.2;
  const glowColor = `rgba(183, 65, 14, ${glowOpacity})`;
  const pulseDuration = Math.max(0.2, (data?.duration_ms ?? 400) / 1000);
  const durationText = data?.duration_ms ? `${Math.round(data.duration_ms)}ms` : "?";
  const tooltip = `Trigger: ${trigger}; Call: ${callType}; Duration: ${durationText}; Energy: ${
    data?.energy_delta ?? "?"
  }${data?.payload_summary ? `; ${data.payload_summary}` : ""}`;

  const sourceBounds = data?.source_bounds;
  const targetBounds = data?.target_bounds;
  let pulsePath = edgePath;
  if (sourceBounds && targetBounds) {
    const sourceCenter = {
      x: sourceBounds.x + sourceBounds.width / 2,
      y: sourceBounds.y + sourceBounds.height / 2,
    };
    const targetCenter = {
      x: targetBounds.x + targetBounds.width / 2,
      y: targetBounds.y + targetBounds.height / 2,
    };
    const clampedSource = intersect_line_with_rect(sourceCenter, targetCenter, sourceBounds);
    const clampedTarget = intersect_line_with_rect(targetCenter, sourceCenter, targetBounds);
    const [clampedPath] = getBezierPath({
      sourceX: clampedSource.x,
      sourceY: clampedSource.y,
      targetX: clampedTarget.x,
      targetY: clampedTarget.y,
      sourcePosition,
      targetPosition,
    });
    pulsePath = clampedPath;
  }

  const reduceMotion = Boolean(data?.render_hint?.reduce_motion);
  const showLabel = data?.render_hint?.show_label ?? true;
  const shineClass = edge_shine_class_for_trigger(trigger);
  const animation = reduceMotion
    ? undefined
    : shineClass === "edge-shine-stream"
      ? "edgeFlow 1.6s linear infinite"
      : shineClass === "edge-shine-async"
        ? "edgeFlow 2.4s linear infinite"
        : undefined;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: color,
          strokeWidth,
          strokeDasharray: dash,
          opacity: 0.9,
          filter: `drop-shadow(0 0 6px ${glowColor})`,
          animation,
        }}
      >
        <title>{tooltip}</title>
      </path>
      {isActive && !reduceMotion ? (
        <path
          id={`${id}-pulse`}
          d={pulsePath}
          markerEnd={markerEnd}
          style={{
            stroke: color,
            strokeWidth: 1.5 + pulseStrength * 2.2,
            strokeDasharray: "8 28",
            opacity: 0.9,
            animation: `edgePulse ${pulseDuration}s var(--ease-tension-release) infinite`,
          }}
        />
      ) : null}
      {isActive && !reduceMotion ? (
        <>
          <defs>
            <path id={`edge-motion-${id}`} d={pulsePath} />
          </defs>
          <circle r={2 + energyIntensity * 3.5} fill="var(--stream)" opacity={0.9}>
            <animateMotion
              dur={`${pulseDuration}s`}
              repeatCount="indefinite"
              keySplines="0.2 0.6 0.2 1"
              keyTimes="0;1"
              calcMode="spline"
              path={pulsePath}
            />
          </circle>
        </>
      ) : null}
      <EdgeLabel text={label} x={labelX} y={labelY} color={color} show={showLabel} />
    </>
  );
};

export const DirectEdge = EdgeComponent;
export const StreamEdge = EdgeComponent;
export const AsyncEdge = EdgeComponent;
