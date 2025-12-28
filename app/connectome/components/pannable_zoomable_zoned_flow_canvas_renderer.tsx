"use client";

// DOCS: docs/connectome/flow_canvas/PATTERNS_Connectome_Flow_Canvas_Pannable_Zoomable_Zoned_System_Map_Rendering_Patterns.md
// Renders FalkorDB graph nodes with D3 force-directed layout (scales to 2000+ nodes)

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConnectomeStore } from "../lib/zustand_connectome_state_store_with_atomic_commit_actions";
import {
  NODE_TYPE_COLORS,
  EDGE_TYPE_COLORS,
  GraphNodeType,
} from "../lib/connectome_system_map_node_edge_manifest";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from "d3-force";

// Map FalkorDB labels to GraphNodeType
function mapLabelToNodeType(label?: string): GraphNodeType {
  if (!label) return "Narrative";
  const normalized = label.toLowerCase();
  if (normalized === "actor" || normalized === "character") return "Actor";
  if (normalized === "space" || normalized === "place") return "Space";
  if (normalized === "thing") return "Thing";
  if (normalized === "narrative") return "Narrative";
  if (normalized === "moment") return "Moment";
  return "Narrative";
}

// Removed WebGL helper functions - using Canvas 2D for simpler rendering

interface GraphNode extends SimulationNodeDatum {
  id: string;
  title: string;
  node_type: GraphNodeType;
  energy: number;
  // Extended data from API
  description?: string;
  detail?: string;
  weight?: number;
  text?: string;
  status?: string;
  date?: string;
}

interface GraphEdge extends SimulationLinkDatum<GraphNode> {
  id: string;
  type: string;
}

const CanvasInner = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [renderTick, setRenderTick] = useState(0);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [simulationReady, setSimulationReady] = useState(false);

  const activeNodeId = useConnectomeStore((state) => state.active_focus.active_node_id);
  const activeEdgeId = useConnectomeStore((state) => state.active_focus.active_edge_id);
  const searchResults = useConnectomeStore((state) => state.search_results);

  // Store simulation nodes/edges with positions
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const simulationRef = useRef<ReturnType<typeof forceSimulation<GraphNode>> | null>(null);

  // Build and run D3 force simulation
  useEffect(() => {
    if (!searchResults?.nodes?.length) {
      nodesRef.current = [];
      edgesRef.current = [];
      setSimulationReady(false);
      return;
    }

    // Create nodes - initialize in a circle around origin
    const n = searchResults.nodes.length;
    const radius = Math.sqrt(n) * 20; // Scale radius with node count
    const nodes: GraphNode[] = searchResults.nodes.map((node: any, i) => ({
      id: node.id,
      title: node.name ?? node.id,
      node_type: mapLabelToNodeType(node.type),
      energy: node.energy ?? 0.5,
      description: node.description,
      detail: node.detail,
      weight: node.weight,
      text: node.text,
      status: node.status,
      date: node.date,
      x: radius * Math.cos((2 * Math.PI * i) / n),
      y: radius * Math.sin((2 * Math.PI * i) / n),
    }));

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Create edges (only for nodes that exist)
    const edges: GraphEdge[] = (searchResults.links ?? [])
      .filter((link) => link.from_id && link.to_id && nodeMap.has(link.from_id) && nodeMap.has(link.to_id))
      .map((link, i) => ({
        id: `edge-${i}`,
        source: link.from_id!,
        target: link.to_id!,
        type: link.type ?? "LINK",
      }));

    nodesRef.current = nodes;
    edgesRef.current = edges;

    // Set initial transform to fit nodes in view
    const initFit = () => {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      nodes.forEach((n) => {
        if (n.x != null && n.y != null) {
          minX = Math.min(minX, n.x);
          maxX = Math.max(maxX, n.x);
          minY = Math.min(minY, n.y);
          maxY = Math.max(maxY, n.y);
        }
      });
      if (minX === Infinity) return;
      const graphWidth = Math.max(maxX - minX, 100) + 100;
      const graphHeight = Math.max(maxY - minY, 100) + 100;
      const fitScale = Math.min(size.width / graphWidth, size.height / graphHeight, 1.5);
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      transformRef.current = {
        x: size.width / (2 * fitScale) - cx,
        y: size.height / (2 * fitScale) - cy,
        scale: fitScale,
      };
    };
    initFit();
    setRenderTick((t) => t + 1);

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Create new simulation with Barnes-Hut optimization (theta parameter)
    // More sparse layout: stronger repulsion, longer links
    const simulation = forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphEdge>(edges)
          .id((d) => d.id)
          .distance(120)  // Longer links for more spacing
          .strength(0.1)  // Weaker link force
      )
      .force("charge", forceManyBody<GraphNode>().strength(-300).theta(0.9))  // Stronger repulsion
      .force("center", forceCenter(0, 0))
      .force("collide", forceCollide<GraphNode>(25))  // Larger collision radius
      .alphaDecay(0.02)  // Slower decay for better layout
      .velocityDecay(0.3);

    simulationRef.current = simulation;

    // Update on each tick
    simulation.on("tick", () => {
      setRenderTick((t) => t + 1);
    });

    simulation.on("end", () => {
      setSimulationReady(true);
      // Auto-fit after simulation ends
      setTimeout(() => {
        if (nodes.length === 0) return;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodes.forEach((n) => {
          if (n.x != null && n.y != null) {
            minX = Math.min(minX, n.x);
            maxX = Math.max(maxX, n.x);
            minY = Math.min(minY, n.y);
            maxY = Math.max(maxY, n.y);
          }
        });
        if (minX === Infinity) return;
        const graphWidth = Math.max(maxX - minX, 100) + 100;
        const graphHeight = Math.max(maxY - minY, 100) + 100;
        const fitScale = Math.min(size.width / graphWidth, size.height / graphHeight, 1.5);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        transformRef.current = {
          x: size.width / (2 * fitScale) - cx,
          y: size.height / (2 * fitScale) - cy,
          scale: fitScale,
        };
        setRenderTick((t) => t + 1);
      }, 100);
    });

    // Run simulation for fixed iterations for large graphs
    if (nodes.length > 500) {
      simulation.alpha(1).restart();
      // Let it run naturally but cap at 300 iterations
      let iterations = 0;
      const maxIterations = 300;
      simulation.on("tick.limit", () => {
        iterations++;
        if (iterations >= maxIterations) {
          simulation.stop();
          setSimulationReady(true);
        }
      });
    }

    return () => {
      simulation.stop();
    };
  }, [searchResults, size.width, size.height]);

  // Initial transform: will be set properly when nodes load
  const transformRef = useRef({ x: 0, y: 0, scale: 1.0 });

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.contentRect;
        setSize({ width: rect.width, height: rect.height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.width;
    canvas.height = size.height;
    setRenderTick((t) => t + 1); // Trigger re-render when size changes
  }, [size]);

  // Pan to active node when it changes
  useEffect(() => {
    if (!activeNodeId || !simulationReady) return;
    const nodes = nodesRef.current;
    const activeNode = nodes.find((n) => n.id === activeNodeId);
    if (!activeNode || activeNode.x == null || activeNode.y == null) return;

    // Smoothly pan to center on active node
    const targetScale = Math.max(transformRef.current.scale, 0.8); // Ensure reasonable zoom
    transformRef.current = {
      x: size.width / (2 * targetScale) - activeNode.x,
      y: size.height / (2 * targetScale) - activeNode.y,
      scale: targetScale,
    };
    setRenderTick((t) => t + 1);
  }, [activeNodeId, simulationReady, size.width, size.height]);

  // Canvas 2D rendering (simpler, more debuggable than WebGL)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const { x: offsetX, y: offsetY, scale } = transformRef.current;

    // Clear canvas
    ctx.fillStyle = "#0f0f12";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    edges.forEach((edge) => {
      const source = typeof edge.source === "object" ? edge.source : nodes.find((n) => n.id === edge.source);
      const target = typeof edge.target === "object" ? edge.target : nodes.find((n) => n.id === edge.target);
      if (!source || !target || source.x == null || target.x == null) return;

      const sx = (source.x + offsetX) * scale;
      const sy = (source.y! + offsetY) * scale;
      const tx = (target.x + offsetX) * scale;
      const ty = (target.y! + offsetY) * scale;

      ctx.strokeStyle = EDGE_TYPE_COLORS[edge.type as keyof typeof EDGE_TYPE_COLORS] ?? "#444444";
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    });

    // Draw nodes
    ctx.globalAlpha = 1.0;
    nodes.forEach((node) => {
      if (node.x == null || node.y == null) return;
      const sx = (node.x + offsetX) * scale;
      const sy = (node.y + offsetY) * scale;
      const radius = (6 + Math.min(node.energy, 5) * 2) * scale;

      ctx.fillStyle = NODE_TYPE_COLORS[node.node_type] ?? "#808080";
      if (node.id === activeNodeId) {
        ctx.fillStyle = "#ffdd33";
      } else if (node.id === hoverNodeId) {
        ctx.fillStyle = "#ffffff";
      }

      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(radius, 3), 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw labels (only when zoomed in enough)
    if (scale >= 0.4 && nodes.length < 500) {
      ctx.font = `${Math.max(10 * scale, 8)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(200, 195, 185, 0.8)";
      nodes.forEach((node) => {
        if (node.x == null || node.y == null) return;
        const sx = (node.x + offsetX) * scale;
        const sy = (node.y + offsetY) * scale;
        ctx.fillText(node.title.slice(0, 15), sx, sy + 16 * scale);
      });
    }
  }, [renderTick, activeNodeId, hoverNodeId, size]);

  // Mouse interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let dragging = false;
    let didDrag = false;
    let lastX = 0;
    let lastY = 0;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = container.getBoundingClientRect();
      const { x: offsetX, y: offsetY, scale: oldScale } = transformRef.current;

      // Faster zoom: 0.003 instead of 0.001
      const zoomFactor = 1 - event.deltaY * 0.003;
      const newScale = Math.min(5.0, Math.max(0.05, oldScale * zoomFactor));

      // Zoom centered on mouse position
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // World position under mouse before zoom
      const worldX = mouseX / oldScale - offsetX;
      const worldY = mouseY / oldScale - offsetY;

      // Adjust offset so world position stays under mouse after zoom
      transformRef.current = {
        x: mouseX / newScale - worldX,
        y: mouseY / newScale - worldY,
        scale: newScale,
      };
      setRenderTick((t) => t + 1);
    };

    const handleMouseDown = (event: MouseEvent) => {
      dragging = true;
      didDrag = false;
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const { x, y, scale } = transformRef.current;
      const worldX = (event.clientX - rect.left) / scale - x;
      const worldY = (event.clientY - rect.top) / scale - y;

      // Find node under cursor (with larger hit area based on zoom)
      const hitRadius = Math.max(20, 15 / scale);
      let found: string | null = null;
      let closestDist = hitRadius;
      for (const node of nodesRef.current) {
        if (node.x == null || node.y == null) continue;
        const dx = worldX - node.x;
        const dy = worldY - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < closestDist) {
          closestDist = dist;
          found = node.id;
        }
      }
      setHoverNodeId(found);
      // Update hover position for tooltip
      if (found) {
        setHoverPos({ x: event.clientX, y: event.clientY });
      } else {
        setHoverPos(null);
      }

      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag = true;
      transformRef.current.x += dx / transformRef.current.scale;
      transformRef.current.y += dy / transformRef.current.scale;
      setRenderTick((t) => t + 1);
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!didDrag && hoverNodeId) {
        // Click on node - open info panel
        const clickedNode = nodesRef.current.find(n => n.id === hoverNodeId);
        if (clickedNode) {
          setSelectedNode(clickedNode);
        }
      }
      dragging = false;
    };

    const handleClick = (event: MouseEvent) => {
      // Double-click to fit view
      if (event.detail === 2) {
        const nodes = nodesRef.current;
        if (nodes.length === 0) return;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodes.forEach((n) => {
          if (n.x != null && n.y != null) {
            minX = Math.min(minX, n.x);
            maxX = Math.max(maxX, n.x);
            minY = Math.min(minY, n.y);
            maxY = Math.max(maxY, n.y);
          }
        });
        if (minX === Infinity) return;
        const graphWidth = Math.max(maxX - minX, 100) + 200;
        const graphHeight = Math.max(maxY - minY, 100) + 200;
        const fitScale = Math.min(size.width / graphWidth, size.height / graphHeight, 1.5);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        transformRef.current = {
          x: size.width / (2 * fitScale) - cx,
          y: size.height / (2 * fitScale) - cy,
          scale: fitScale,
        };
        setRenderTick((t) => t + 1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("dblclick", handleClick);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("dblclick", handleClick);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hoverNodeId, size]);

  const handleFitView = useCallback(() => {
    // Center on nodes
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach((n) => {
      if (n.x != null && n.y != null) {
        minX = Math.min(minX, n.x);
        maxX = Math.max(maxX, n.x);
        minY = Math.min(minY, n.y);
        maxY = Math.max(maxY, n.y);
      }
    });
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const graphWidth = maxX - minX + 100;
    const graphHeight = maxY - minY + 100;
    const scale = Math.min(size.width / graphWidth, size.height / graphHeight, 1.5);
    transformRef.current = {
      x: size.width / (2 * scale) - cx,
      y: size.height / (2 * scale) - cy,
      scale,
    };
    setRenderTick((t) => t + 1);
  }, [size]);

  const nodeCount = nodesRef.current.length;
  const edgeCount = edgesRef.current.length;

  // Get hovered node for tooltip
  const hoveredNode = hoverNodeId ? nodesRef.current.find(n => n.id === hoverNodeId) : null;

  return (
    <div className="connectome-canvas" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="connectome-webgl-canvas"
        style={{ cursor: hoverNodeId ? 'pointer' : 'grab' }}
      />

      {/* Hover tooltip */}
      {hoveredNode && hoverPos && (
        <div
          className="node-tooltip"
          style={{
            position: 'fixed',
            left: hoverPos.x + 15,
            top: hoverPos.y - 10,
            pointerEvents: 'none',
          }}
        >
          <div className="tooltip-header">
            <span className={`tooltip-type tooltip-type-${hoveredNode.node_type.toLowerCase()}`}>
              {hoveredNode.node_type}
            </span>
            <span className="tooltip-title">{hoveredNode.title}</span>
          </div>
          {hoveredNode.text && (
            <div className="tooltip-text">{hoveredNode.text.slice(0, 120)}{hoveredNode.text.length > 120 ? '...' : ''}</div>
          )}
          {hoveredNode.detail && !hoveredNode.text && (
            <div className="tooltip-text">{hoveredNode.detail.slice(0, 120)}{hoveredNode.detail.length > 120 ? '...' : ''}</div>
          )}
          <div className="tooltip-meta">
            {hoveredNode.energy != null && <span>Energy: {hoveredNode.energy.toFixed(1)}</span>}
            {hoveredNode.weight != null && <span>Weight: {hoveredNode.weight}</span>}
            {hoveredNode.date && <span>{hoveredNode.date}</span>}
          </div>
        </div>
      )}

      {/* Selected node info panel */}
      {selectedNode && (
        <div className="node-info-panel">
          <div className="info-panel-header">
            <span className={`info-type info-type-${selectedNode.node_type.toLowerCase()}`}>
              {selectedNode.node_type}
            </span>
            <h3>{selectedNode.title}</h3>
            <button className="btn btn-ghost btn-close" onClick={() => setSelectedNode(null)}>×</button>
          </div>
          <div className="info-panel-body">
            {selectedNode.text && (
              <div className="info-section">
                <div className="info-label">Content</div>
                <p>{selectedNode.text}</p>
              </div>
            )}
            {selectedNode.detail && (
              <div className="info-section">
                <div className="info-label">Detail</div>
                <p>{selectedNode.detail}</p>
              </div>
            )}
            {selectedNode.description && (
              <div className="info-section">
                <div className="info-label">Description</div>
                <p>{selectedNode.description}</p>
              </div>
            )}
            <div className="info-section info-meta">
              <div><span className="info-label">ID:</span> {selectedNode.id}</div>
              {selectedNode.energy != null && <div><span className="info-label">Energy:</span> {selectedNode.energy.toFixed(2)}</div>}
              {selectedNode.weight != null && <div><span className="info-label">Weight:</span> {selectedNode.weight}</div>}
              {selectedNode.status && <div><span className="info-label">Status:</span> {selectedNode.status}</div>}
              {selectedNode.date && <div><span className="info-label">Date:</span> {selectedNode.date}</div>}
            </div>
          </div>
        </div>
      )}

      <div className="canvas-overlay">
        <span className="node-count">
          {nodeCount} nodes, {edgeCount} edges
          {!simulationReady && nodeCount > 0 && " (simulating...)"}
        </span>
        <button className="btn btn-ghost" onClick={handleFitView}>
          Fit View
        </button>
      </div>
    </div>
  );
};

export default function FlowCanvas() {
  return <CanvasInner />;
}
