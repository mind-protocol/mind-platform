'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import GraphCanvas from './GraphCanvas';
import GraphControls from './GraphControls';
import NodePanel from './NodePanel';
import type { GraphNode, GraphLink, GraphStats } from '../types';

export default function GraphView() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState('');
  const [activeGraph, setActiveGraph] = useState('');
  const [totalMatching, setTotalMatching] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if this is a search result (vs filter/default)
  const isSearchRef = useRef(false);

  // Fetch stats on mount
  useEffect(() => {
    fetch('/api/graph/stats')
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setStats(data);
        }
      })
      .catch(() => {
        // Stats are optional — controls will work without them
      });
  }, []);

  // Load graph data
  const loadGraph = useCallback((params?: { label?: string; graph?: string; limit?: number }) => {
    isSearchRef.current = false;
    setLoading(true);
    setError(null);

    const searchParams = new URLSearchParams();
    if (params?.label) searchParams.set('label', params.label);
    if (params?.graph) searchParams.set('graph', params.graph);
    searchParams.set('limit', String(params?.limit ?? 200));

    const qs = searchParams.toString();
    const url = `/api/graph${qs ? `?${qs}` : ''}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setNodes([]);
          setLinks([]);
        } else {
          setNodes(data.nodes || []);
          setLinks(data.links || []);
          setTotalMatching(data.total_matching ?? null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load graph data. Please try again.');
        setNodes([]);
        setLinks([]);
        setLoading(false);
      });
  }, []);

  // Search
  const handleSearch = useCallback((query: string) => {
    if (!query) {
      // Empty search — reload default
      isSearchRef.current = false;
      loadGraph({ label: activeLabel, graph: activeGraph });
      return;
    }

    isSearchRef.current = true;
    setLoading(true);
    setError(null);

    fetch(`/api/graph/search?q=${encodeURIComponent(query)}&limit=30`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setNodes([]);
          setLinks([]);
        } else {
          setNodes(data.nodes || []);
          setLinks(data.links || []);
          setTotalMatching(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Search failed. Please try again.');
        setNodes([]);
        setLinks([]);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLabel, activeGraph]);

  // Filter by label
  const handleFilterLabel = useCallback((label: string) => {
    setActiveLabel(label);
    loadGraph({ label, graph: activeGraph });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGraph, loadGraph]);

  // Filter by graph
  const handleFilterGraph = useCallback((graph: string) => {
    setActiveGraph(graph);
    loadGraph({ label: activeLabel, graph });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLabel, loadGraph]);

  // Reset
  const handleReset = useCallback(() => {
    setActiveLabel('');
    setActiveGraph('');
    setSelectedNodeId(null);
    loadGraph();
  }, [loadGraph]);

  // Select node
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  // Navigate to node from panel
  const handleNavigate = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  // Initial load
  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Controls bar */}
      <GraphControls
        stats={stats}
        visibleCount={nodes.length}
        totalMatching={totalMatching}
        onSearch={handleSearch}
        onFilterLabel={handleFilterLabel}
        onFilterGraph={handleFilterGraph}
        onReset={handleReset}
        activeLabel={activeLabel}
        activeGraph={activeGraph}
      />

      {/* Graph area */}
      <div className="relative flex-1 min-h-0">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/80">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
              <span className="text-sm text-zinc-400">Loading graph...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950">
            <div className="text-center">
              <p className="text-zinc-400 mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover:border-zinc-600 transition"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && nodes.length === 0 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950">
            <div className="text-center">
              <p className="text-zinc-500 text-sm">No nodes found.</p>
              <button
                onClick={handleReset}
                className="mt-3 px-4 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover:border-zinc-600 transition"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}

        {/* Canvas */}
        <GraphCanvas
          nodes={nodes}
          links={links}
          onNodeSelect={handleNodeSelect}
        />

        {/* Node detail panel */}
        <NodePanel
          nodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}
