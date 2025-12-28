"use client";

// DOCS: docs/connectome/edge_kit/IMPLEMENTATION_Connectome_Edge_Kit_Component_Map_And_Render_Tokens.md

import { EdgeLabelRenderer } from "reactflow";

type EdgeLabelProps = {
  text: string;
  x: number;
  y: number;
  color: string;
  show?: boolean;
};

export default function EdgeLabel({ text, x, y, color, show = true }: EdgeLabelProps) {
  if (!show) {
    return null;
  }
  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
          fontSize: 13,
          fontWeight: 400,
          color,
          padding: "2px 6px",
          borderRadius: 6,
          background: "rgba(42, 43, 42, 0.9)",
          border: "1px solid rgba(242, 237, 225, 0.12)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </EdgeLabelRenderer>
  );
}
