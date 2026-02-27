'use client';

import { useEffect, useRef } from 'react';
import { colors } from '@/lib/design';

const NODE_COLORS = [
  colors.nodeType.Actor,
  colors.nodeType.Moment,
  colors.nodeType.Narrative,
  colors.nodeType.Space,
  colors.nodeType.Thing,
];

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
}

interface Edge {
  a: number;
  b: number;
}

export function HeroGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create nodes
    const NODE_COUNT = 25;
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
      radius: 2 + Math.random() * 2.5,
    }));

    // Create edges (connect nearby pairs)
    const edges: Edge[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT && edges.length < 35; j++) {
        if (Math.random() < 0.15) {
          edges.push({ a: i, b: j });
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw edges
      for (const edge of edges) {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color + '40'; // 25% opacity
        ctx.fill();
      }
    };

    const update = () => {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Gentle bounce at edges
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;

        // High damping — slow drift
        node.vx *= 0.999;
        node.vy *= 0.999;

        // Tiny random nudge to keep movement alive
        node.vx += (Math.random() - 0.5) * 0.02;
        node.vy += (Math.random() - 0.5) * 0.02;
      }
    };

    if (reducedMotion) {
      // Static render
      draw();
    } else {
      const loop = () => {
        update();
        draw();
        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      aria-hidden="true"
    />
  );
}
