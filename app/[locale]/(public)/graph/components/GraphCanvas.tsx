'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphLink } from '../types';
import { getNodeColor, getNodeRadius } from '../types';

interface GraphCanvasProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeSelect: (nodeId: string) => void;
}

export default function GraphCanvas({ nodes, links, onNodeSelect }: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  const renderGraph = useCallback(() => {
    if (!svgRef.current) return;
    const svgEl = svgRef.current;
    const svg = d3.select(svgEl);

    // Clear previous render
    svg.selectAll('g.graph-root').remove();
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }

    if (!nodes.length) return;

    const rect = svgEl.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Build node map and filter valid links
    const nodeMap = new Map<string, GraphNode>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const validLinks = links.filter((l) => {
      const sId = typeof l.source === 'object' ? l.source.id : l.source;
      const tId = typeof l.target === 'object' ? l.target.id : l.target;
      return nodeMap.has(sId) && nodeMap.has(tId);
    });

    // Root group for zoom/pan
    const g = svg.append('g').attr('class', 'graph-root');

    // Zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.05, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoomBehavior);

    // Click on canvas background to deselect
    svg.on('click', () => {
      // Only if click is directly on SVG (not a node)
    });

    // Force simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3.forceLink<GraphNode, GraphLink>(validLinks)
          .id((d) => d.id)
          .distance(60)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide().radius(20));

    simulationRef.current = simulation;

    // Links
    const linkEls = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(validLinks)
      .join('line')
      .attr('stroke', '#2a2a3a')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 1);

    // Node groups
    const nodeGroups = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Circles
    nodeGroups
      .append('circle')
      .attr('r', (d) => getNodeRadius(d))
      .attr('fill', (d) => getNodeColor(d))
      .attr('stroke', '#0a0a0a')
      .attr('stroke-width', 1);

    // Labels (hidden by default, shown on hover)
    const labelEls = nodeGroups
      .append('text')
      .text((d) => (d.name ? d.name.substring(0, 30) : ''))
      .attr('x', 10)
      .attr('y', 3)
      .attr('font-size', '10px')
      .attr('fill', '#a1a1aa')
      .attr('pointer-events', 'none')
      .attr('opacity', 0);

    // Hover highlight
    nodeGroups
      .on('mouseover', (_event, d) => {
        const connected = new Set<string>();
        connected.add(d.id);
        validLinks.forEach((l) => {
          const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
          const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
          if (sId === d.id) connected.add(tId as string);
          if (tId === d.id) connected.add(sId as string);
        });

        nodeGroups.style('opacity', (n) => (connected.has(n.id) ? 1 : 0.12));
        labelEls.attr('opacity', (n) => (connected.has(n.id) ? 1 : 0));
        linkEls.style('opacity', (l) => {
          const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
          const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
          return sId === d.id || tId === d.id ? 1 : 0.03;
        });
      })
      .on('mouseout', () => {
        nodeGroups.style('opacity', 1);
        labelEls.attr('opacity', 0);
        linkEls.style('opacity', 0.5);
      });

    // Click to select node
    nodeGroups.on('click', (event, d) => {
      event.stopPropagation();
      onNodeSelect(d.id);
    });

    // Tick
    simulation.on('tick', () => {
      linkEls
        .attr('x1', (d) => (d.source as GraphNode).x ?? 0)
        .attr('y1', (d) => (d.source as GraphNode).y ?? 0)
        .attr('x2', (d) => (d.target as GraphNode).x ?? 0)
        .attr('y2', (d) => (d.target as GraphNode).y ?? 0);

      nodeGroups.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });
  }, [nodes, links, onNodeSelect]);

  useEffect(() => {
    renderGraph();
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [renderGraph]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      renderGraph();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderGraph]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full bg-zinc-950"
      style={{ minHeight: '100%' }}
    />
  );
}
