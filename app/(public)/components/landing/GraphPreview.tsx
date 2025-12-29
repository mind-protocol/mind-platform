'use client';

import { useEffect, useRef } from 'react';
import { colors } from '@/lib/design/tokens';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  radius: number;
}

interface Edge {
  source: number;
  target: number;
}

const NODE_TYPES = Object.keys(colors.nodeType) as Array<
  keyof typeof colors.nodeType
>;

export function GraphPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes: Node[] = generateNodes(30, canvas.offsetWidth, canvas.offsetHeight);
    const edges: Edge[] = generateEdges(nodes.length, 40);

    let animationId: number;
    const animate = () => {
      updatePhysics(nodes, edges, canvas.offsetWidth, canvas.offsetHeight);
      draw(ctx, nodes, edges, canvas.offsetWidth, canvas.offsetHeight);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

function generateNodes(count: number, width: number, height: number): Node[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0,
    vy: 0,
    type: NODE_TYPES[Math.floor(Math.random() * NODE_TYPES.length)],
    radius: 4 + Math.random() * 4,
  }));
}

function generateEdges(nodeCount: number, edgeCount: number): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < edgeCount; i++) {
    edges.push({
      source: Math.floor(Math.random() * nodeCount),
      target: Math.floor(Math.random() * nodeCount),
    });
  }
  return edges;
}

function updatePhysics(
  nodes: Node[],
  _edges: Edge[],
  width: number,
  height: number,
) {
  const centerX = width / 2;
  const centerY = height / 2;

  nodes.forEach((node) => {
    node.vx += (centerX - node.x) * 0.0001;
    node.vy += (centerY - node.y) * 0.0001;
    node.x += node.vx;
    node.y += node.vy;
    node.vx *= 0.99;
    node.vy *= 0.99;
    if (node.x < 0 || node.x > width) node.vx *= -0.5;
    if (node.y < 0 || node.y > height) node.vy *= -0.5;
  });
}

function draw(
  ctx: CanvasRenderingContext2D,
  nodes: Node[],
  edges: Edge[],
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  edges.forEach((edge) => {
    const source = nodes[edge.source];
    const target = nodes[edge.target];
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
  });

  nodes.forEach((node) => {
    const color =
      colors.nodeType[node.type as keyof typeof colors.nodeType] || '#fff';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });
}
