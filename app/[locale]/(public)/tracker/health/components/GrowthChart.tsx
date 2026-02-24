'use client';
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { GrowthPoint } from '@/lib/tracker/types/health';

interface Props {
  points: GrowthPoint[];
  dob: string;
}

export default function GrowthChart({ points, dob }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || points.length === 0) return;

    const margin = { top: 20, right: 60, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('viewBox', `0 0 800 400`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(points, d => d.age_years) || 18])
      .range([0, width]);

    const weightPoints = points.filter(p => p.weight_kg != null);
    const heightPoints = points.filter(p => p.height_cm != null);
    const headPoints = points.filter(p => p.head_circ_cm != null);

    const yWeight = d3.scaleLinear()
      .domain([0, d3.max(weightPoints, d => d.weight_kg!) || 100])
      .nice()
      .range([height, 0]);

    const yHeight = d3.scaleLinear()
      .domain([0, d3.max(heightPoints, d => d.height_cm!) || 200])
      .nice()
      .range([height, 0]);

    // Grid
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(xScale.ticks(10))
      .join('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', '#3f3f46').attr('stroke-dasharray', '2,4');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => `${d} ans`))
      .selectAll('text').attr('fill', '#a1a1aa').style('font-size', '11px');
    g.selectAll('.domain, .tick line').attr('stroke', '#52525b');

    g.append('g')
      .call(d3.axisLeft(yWeight).ticks(6).tickFormat(d => `${d}kg`))
      .selectAll('text').attr('fill', '#2dd4bf').style('font-size', '11px');

    g.append('g')
      .attr('transform', `translate(${width},0)`)
      .call(d3.axisRight(yHeight).ticks(6).tickFormat(d => `${d}cm`))
      .selectAll('text').attr('fill', '#f59e0b').style('font-size', '11px');

    // Weight line (cyan/teal)
    const weightLine = d3.line<GrowthPoint>()
      .defined(d => d.weight_kg != null)
      .x(d => xScale(d.age_years))
      .y(d => yWeight(d.weight_kg!));

    g.append('path')
      .datum(weightPoints)
      .attr('fill', 'none')
      .attr('stroke', '#2dd4bf')
      .attr('stroke-width', 2)
      .attr('d', weightLine);

    g.selectAll('.weight-dot')
      .data(weightPoints)
      .join('circle')
      .attr('cx', d => xScale(d.age_years))
      .attr('cy', d => yWeight(d.weight_kg!))
      .attr('r', 4)
      .attr('fill', '#2dd4bf')
      .attr('stroke', '#18181b')
      .attr('stroke-width', 2);

    // Height line (amber)
    const heightLine = d3.line<GrowthPoint>()
      .defined(d => d.height_cm != null)
      .x(d => xScale(d.age_years))
      .y(d => yHeight(d.height_cm!));

    g.append('path')
      .datum(heightPoints)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 2)
      .attr('d', heightLine);

    g.selectAll('.height-dot')
      .data(heightPoints)
      .join('circle')
      .attr('cx', d => xScale(d.age_years))
      .attr('cy', d => yHeight(d.height_cm!))
      .attr('r', 4)
      .attr('fill', '#f59e0b')
      .attr('stroke', '#18181b')
      .attr('stroke-width', 2);

    // Head circumference (purple, 0-3 years only)
    if (headPoints.length > 0) {
      const yHead = d3.scaleLinear()
        .domain([30, 55])
        .range([height, 0]);

      const headLine = d3.line<GrowthPoint>()
        .defined(d => d.head_circ_cm != null)
        .x(d => xScale(d.age_years))
        .y(d => yHead(d.head_circ_cm!));

      g.append('path')
        .datum(headPoints)
        .attr('fill', 'none')
        .attr('stroke', '#a78bfa')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,3')
        .attr('d', headLine);

      g.selectAll('.head-dot')
        .data(headPoints)
        .join('circle')
        .attr('cx', d => xScale(d.age_years))
        .attr('cy', d => yHead(d.head_circ_cm!))
        .attr('r', 3)
        .attr('fill', '#a78bfa')
        .attr('stroke', '#18181b')
        .attr('stroke-width', 1.5);
    }

    // Tooltip
    const tooltip = d3.select(svgRef.current.parentElement)
      .append('div')
      .attr('class', 'absolute hidden bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 pointer-events-none z-50')
      .style('max-width', '250px');

    // Invisible larger hit areas for all points
    const allPoints = points.filter(p => p.weight_kg != null || p.height_cm != null);
    g.selectAll('.hit-area')
      .data(allPoints)
      .join('circle')
      .attr('cx', d => xScale(d.age_years))
      .attr('cy', d => {
        if (d.weight_kg != null) return yWeight(d.weight_kg);
        if (d.height_cm != null) return yHeight(d.height_cm);
        return 0;
      })
      .attr('r', 12)
      .attr('fill', 'transparent')
      .on('mouseenter', (event, d) => {
        const lines = [];
        if (d.age_label) lines.push(`<strong>${d.age_label}</strong> (${d.date})`);
        else lines.push(`<strong>${d.date}</strong>`);
        if (d.weight_kg != null) lines.push(`Poids: ${d.weight_kg}kg`);
        if (d.height_cm != null) lines.push(`Taille: ${d.height_cm}cm`);
        if (d.head_circ_cm != null) lines.push(`PC: ${d.head_circ_cm}cm`);
        if (d.notes) lines.push(`<em class="text-zinc-400">${d.notes}</em>`);
        tooltip.html(lines.join('<br>'))
          .classed('hidden', false)
          .style('left', `${event.offsetX + 15}px`)
          .style('top', `${event.offsetY - 10}px`);
      })
      .on('mouseleave', () => tooltip.classed('hidden', true));

    // Legend
    const legend = g.append('g').attr('transform', `translate(${width - 200}, 0)`);
    [
      { label: 'Poids (kg)', color: '#2dd4bf' },
      { label: 'Taille (cm)', color: '#f59e0b' },
      { label: 'PC (cm)', color: '#a78bfa' },
    ].forEach((item, i) => {
      legend.append('line').attr('x1', 0).attr('x2', 20).attr('y1', i * 18).attr('y2', i * 18).attr('stroke', item.color).attr('stroke-width', 2);
      legend.append('text').attr('x', 26).attr('y', i * 18 + 4).text(item.label).attr('fill', '#a1a1aa').style('font-size', '11px');
    });

    return () => { tooltip.remove(); };
  }, [points, dob]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-teal-400 mb-4">Courbe de Croissance</h3>
      <div className="relative">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  );
}
