"use client";

// DOCS: docs/connectome/node_kit/IMPLEMENTATION_Connectome_Node_Kit_Component_Map_And_Styling_Tokens.md

import type { ReactNode } from "react";
import { Handle, Position } from "reactflow";

type NodeFrameProps = {
  title: string;
  titleColor: string;
  path?: string;
  className: string;
  tooltip?: string;
  compact?: boolean;
  showPath?: boolean;
  children?: ReactNode;
};

export default function NodeFrame({
  title,
  titleColor,
  path,
  className,
  tooltip,
  compact = false,
  showPath = true,
  children,
}: NodeFrameProps) {
  return (
    <div
      className={`node-frame ${className} ${compact ? "node-compact" : ""}`}
      title={tooltip}
    >
      <Handle
        id="target"
        type="target"
        position={Position.Left}
        className="node-handle node-handle-target"
      />
      <Handle
        id="source"
        type="source"
        position={Position.Right}
        className="node-handle node-handle-source"
      />
      <div className="node-title" style={{ color: titleColor }}>
        {title}
      </div>
      {path && showPath ? <div className="node-path">{path}</div> : null}
      {children}
    </div>
  );
}
