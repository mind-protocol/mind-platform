// DOCS: docs/connectome/flow_canvas/IMPLEMENTATION_Connectome_Flow_Canvas_Code_Structure_With_React_Flow_And_Zones.md

import { forceCenter, forceLink, forceManyBody, forceSimulation, SimulationNodeDatum } from "d3-force";
import type {
  ConnectomeEdgeDefinition,
  ConnectomeNodeDefinition,
  ConnectomeZoneId,
} from "../lib/connectome_system_map_node_edge_manifest";

export type ZoneLayout = {
  zone_id: ConnectomeZoneId;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
};

export type NodeLayout = {
  node_id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

interface ConnectomeSimulationNode extends SimulationNodeDatum {
  id: string;
}

const BASE_ZONE_LAYOUT: Record<ConnectomeZoneId, Omit<ZoneLayout, "zone_id">> = {
  FRONTEND: { x: 40, y: 40, width: 420, height: 520, title: "Frontend" },
  BACKEND: { x: 520, y: 40, width: 520, height: 720, title: "Backend" },
  GRAPH: { x: 1080, y: 40, width: 420, height: 520, title: "Graph" },
  AGENTS: { x: 1080, y: 600, width: 420, height: 260, title: "Agents" },
};

export const NODE_SPACING_X = 1680;
export const NODE_SPACING_Y = 1280;
const NODE_WIDTH = 1360;
const NODE_HEIGHT = 800;
const NODE_PADDING = 40;

export const compute_zones = (viewportWidth: number): ZoneLayout[] => {
  const scale = viewportWidth < 1400 ? 0.9 : 1;
  return (Object.keys(BASE_ZONE_LAYOUT) as ConnectomeZoneId[]).map((zone_id) => {
    const base = BASE_ZONE_LAYOUT[zone_id];
    return {
      zone_id,
      x: base.x * scale,
      y: base.y * scale,
      width: base.width * scale,
      height: base.height * scale,
      title: base.title,
    };
  });
};

export const compute_node_positions = (
  nodes: ConnectomeNodeDefinition[],
  zones: ZoneLayout[],
  edges: ConnectomeEdgeDefinition[]
): NodeLayout[] => {
  const zoneMap = new Map(zones.map((zone) => [zone.zone_id, zone]));
  const seeded = nodes.map((node) => {
    const zone = zoneMap.get(node.zone_id);
    const baseX = zone ? zone.x : 40;
    const baseY = zone ? zone.y : 40;
    const x = baseX + NODE_PADDING + node.slot.col * NODE_SPACING_X;
    const y = baseY + NODE_PADDING + node.slot.row * NODE_SPACING_Y;
    return {
      node_id: node.node_id,
      x,
      y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    };
  });

  const forceNodes: ConnectomeSimulationNode[] = seeded.map((node) => ({
    id: node.node_id,
    x: node.x + NODE_WIDTH / 2,
    y: node.y + NODE_HEIGHT / 2,
  }));
  const forceLinks = edges.map((edge) => ({
    source: edge.from_node_id,
    target: edge.to_node_id,
  }));

  const iterationCount =
    forceNodes.length > 800 ? 120 : forceNodes.length > 300 ? 180 : 260;
  const simulation = forceSimulation<ConnectomeSimulationNode>(forceNodes)
    .force("charge", forceManyBody().strength(-240).distanceMax(900))
    .force("link", forceLink<ConnectomeSimulationNode, any>(forceLinks).id((d) => d.id).distance(220).strength(0.08))
    .force("center", forceCenter(800, 520))
    .stop();

  for (let i = 0; i < iterationCount; i += 1) {
    simulation.tick();
  }

  const map = new Map(forceNodes.map((node) => [node.id, node]));
  return seeded.map((node) => {
    const placed = map.get(node.node_id);
    const cx = Number.isFinite(placed?.x) ? (placed?.x as number) : node.x;
    const cy = Number.isFinite(placed?.y) ? (placed?.y as number) : node.y;
    return {
      node_id: node.node_id,
      x: cx - NODE_WIDTH / 2,
      y: cy - NODE_HEIGHT / 2,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    };
  });
};
