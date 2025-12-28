"use client";

// DOCS: docs/connectome/page_shell/PATTERNS_Connectome_Page_Shell_Route_Composition_And_User_Control_Surface_Patterns.md

import { useEffect, useRef, useState } from "react";
import "../connectome.css";
import FlowCanvas from "./pannable_zoomable_zoned_flow_canvas_renderer";
import LogPanel from "./unified_now_and_copyable_ledger_log_panel";
import ConnectomeHealthPanel from "./connectome_health_panel";
import {
  dispatch_runtime_command,
  initialize_connectome_runtime,
  release_next_step,
} from "../lib/next_step_gate_and_realtime_playback_runtime_engine";
import { useConnectomeStore } from "../lib/zustand_connectome_state_store_with_atomic_commit_actions";

export default function ConnectomePageShell() {
  const mode = useConnectomeStore((state) => state.mode);
  const speed = useConnectomeStore((state) => state.speed);
  const telemetryStatus = useConnectomeStore((state) => state.telemetry_status);
  const healthEvent = useConnectomeStore((state) => state.connectome_health);
  const graphName = useConnectomeStore((state) => state.graph_name);
  const setGraphName = useConnectomeStore((state) => state.set_graph_name);
  const availableGraphs = useConnectomeStore((state) => state.available_graphs);
  const setAvailableGraphs = useConnectomeStore((state) => state.set_available_graphs);
  const setSearchResults = useConnectomeStore((state) => state.set_search_results);
  const revealNodesAndEdges = useConnectomeStore((state) => state.reveal_node_and_edge_ids);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [threshold, setThreshold] = useState(60);
  const [hops, setHops] = useState(2);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [tickLoading, setTickLoading] = useState(false);
  const tickLoadingRef = useRef(false);

  useEffect(() => {
    initialize_connectome_runtime();
  }, []);

  useEffect(() => {
    const store = useConnectomeStore.getState();
    store.set_telemetry_status("connecting");
    let source: EventSource | null = null;

    const connect = () => {
      source = new EventSource("/api/sse");
      source.addEventListener("connectome_health", (event) => {
        try {
          const payload = JSON.parse((event as MessageEvent).data);
          store.set_connectome_health(payload);
          store.set_telemetry_status("connected");
        } catch {
          store.set_telemetry_status("error");
        }
      });
      source.onerror = () => {
        store.set_telemetry_status("error");
        source?.close();
      };
    };

    connect();
    return () => {
      source?.close();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadGraphs = async () => {
      try {
        const response = await fetch("/api/connectome/graphs");
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Graph list failed");
        }
        if (cancelled) {
          return;
        }
        const graphs = Array.isArray(payload.graphs) ? payload.graphs : [];
        setAvailableGraphs(graphs);
        if (graphs.length && !graphs.includes(graphName)) {
          setGraphName(graphs[0]);
        }
      } catch (error: any) {
        if (!cancelled) {
          setSearchStatus(error?.message ?? "Graph list failed");
        }
      }
    };
    loadGraphs();
    return () => {
      cancelled = true;
    };
  }, [graphName, setAvailableGraphs, setGraphName]);

  useEffect(() => {
    let cancelled = false;
    if (!graphName) {
      return () => {};
    }
    const loadGraph = async () => {
      setSearchStatus(`Loading ${graphName}...`);
      try {
        const response = await fetch(
          `/api/connectome/graph?graph=${encodeURIComponent(graphName)}`
        );
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Graph load failed");
        }
        if (cancelled) {
          return;
        }
        const nodes = payload.nodes ?? [];
        const links = payload.links ?? [];
        setSearchResults({
          query: "",
          threshold: 1,
          hops: 1,
          matches: [],
          nodes,
          links,
        });
        const nodeIds = nodes.map((node: any) => node.id).filter(Boolean);
        const edgeIds = links.map((link: any, index: number) => {
          return `search-${link.type ?? "link"}-${index}`;
        });
        revealNodesAndEdges(nodeIds, edgeIds);
        setSearchStatus(`Loaded ${nodes.length} nodes, ${links.length} links`);
      } catch (error: any) {
        if (!cancelled) {
          setSearchStatus(error?.message ?? "Graph load failed");
        }
      }
    };
    loadGraph();
    return () => {
      cancelled = true;
    };
  }, [graphName, revealNodesAndEdges, setSearchResults]);

  // Auto-tick based on speed setting
  useEffect(() => {
    if (speed === "pause") {
      return;
    }

    // Interval in ms based on speed
    const intervals: Record<string, number> = {
      "1x": 1000,
      "2x": 500,
      "3x": 333,
    };
    const intervalMs = intervals[speed] || 1000;

    const runTick = async () => {
      if (tickLoadingRef.current) return;
      tickLoadingRef.current = true;
      setTickLoading(true);
      try {
        const result = await dispatch_runtime_command({ kind: "next_step" });
        if (result && typeof result === "object" && "status" in result) {
          if (result.status === "error") {
            setSearchStatus(`Tick error: ${result.notes}`);
          } else {
            setSearchStatus(`Tick: ${result.notes || "complete"}`);
          }
        }
      } catch (err: any) {
        setSearchStatus(`Tick failed: ${err?.message || "unknown"}`);
      } finally {
        tickLoadingRef.current = false;
        setTickLoading(false);
      }
    };

    const timer = setInterval(runTick, intervalMs);
    return () => clearInterval(timer);
  }, [speed, graphName]);

  const handleNext = async () => {
    if (tickLoadingRef.current) return;
    tickLoadingRef.current = true;
    setTickLoading(true);
    setSearchStatus("Running tick...");
    try {
      const result = await dispatch_runtime_command({ kind: "next_step" });
      if (result && typeof result === "object" && "status" in result) {
        if (result.status === "error") {
          setSearchStatus(`Tick error: ${result.notes}`);
        } else {
          setSearchStatus(`Tick: ${result.notes || "complete"}`);
        }
      }
    } catch (err: any) {
      setSearchStatus(`Tick failed: ${err?.message || "unknown"}`);
    } finally {
      tickLoadingRef.current = false;
      setTickLoading(false);
    }
  };

  const handleRestart = () => {
    dispatch_runtime_command({ kind: "restart" });
  };

  const handleSpeedChange = (value: string) => {
    dispatch_runtime_command({ kind: "set_speed", payload: { speed: value as any } });
  };

  const handleModeChange = (value: string) => {
    dispatch_runtime_command({
      kind: "set_mode",
      payload: { mode: value as any },
    });
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }
    setSearchStatus("Searching...");
    try {
      const response = await fetch(
        `/api/connectome/search?q=${encodeURIComponent(query)}&threshold=${
          threshold / 100
        }&hops=${hops}&graph=${encodeURIComponent(graphName)}`
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Search failed");
      }
      setSearchResults(payload);
      const nodeIds = (payload.nodes ?? []).map((node: any) => node.id).filter(Boolean);
      const edgeIds = (payload.links ?? []).map((link: any, index: number) => {
        return `search-${link.type ?? "link"}-${index}`;
      });
      revealNodesAndEdges(nodeIds, edgeIds);
      setSearchStatus(`Found ${payload.matches?.length ?? 0} matches`);
    } catch (error: any) {
      setSearchStatus(error?.message ?? "Search failed");
    }
  };

  const nextDisabled = mode === "realtime" || tickLoading;

  return (
    <div className="connectome-shell">
      <div className="connectome-header">
        <div className="connectome-title-group">
          <div className="connectome-title">
            <h1>Connectome</h1>
            <div className="connectome-badges">
              <span className="badge">
                Mode: <strong>{mode}</strong>
              </span>
              <span className="badge">
                Telemetry: <strong>{telemetryStatus}</strong>
              </span>
            </div>
          </div>
          <div className="connectome-search-bar">
            <select
              className="select log-search-select"
              value={graphName}
              onChange={(event) => setGraphName(event.target.value)}
            >
              {(availableGraphs.length ? availableGraphs : [graphName]).map((graph) => (
                <option key={graph} value={graph}>
                  {graph}
                </option>
              ))}
            </select>
            <input
              className="log-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Semantic search..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
            <div className="speed-buttons">
              <button
                className={`btn btn-speed ${speed === "pause" ? "btn-speed-active" : ""}`}
                onClick={() => handleSpeedChange("pause")}
                title="Pause"
              >
                ⏸
              </button>
              <button
                className={`btn btn-speed ${speed === "1x" ? "btn-speed-active" : ""}`}
                onClick={() => handleSpeedChange("1x")}
                title="1x speed"
              >
                1×
              </button>
              <button
                className={`btn btn-speed ${speed === "2x" ? "btn-speed-active" : ""}`}
                onClick={() => handleSpeedChange("2x")}
                title="2x speed"
              >
                2×
              </button>
              <button
                className={`btn btn-speed ${speed === "3x" ? "btn-speed-active" : ""}`}
                onClick={() => handleSpeedChange("3x")}
                title="3x speed"
              >
                3×
              </button>
            </div>
            <button
              className={`btn ${settingsOpen ? "btn-active" : "btn-ghost"}`}
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              Settings
            </button>
          </div>
        </div>

        {settingsOpen && (
          <div className="connectome-settings-panel">
            <div className="connectome-controls">
              <button className="btn btn-primary" onClick={handleNext} disabled={nextDisabled}>
                {tickLoading ? "Ticking..." : "Next Step"}
              </button>
              <button className="btn btn-ghost" onClick={handleRestart}>
                Restart
              </button>
              <div className="control-group">
                <span className="control-label">Speed</span>
                <select
                  className="select"
                  value={speed}
                  onChange={(event) => handleSpeedChange(event.target.value)}
                >
                  <option value="pause">Pause</option>
                  <option value="1x">1x</option>
                  <option value="2x">2x</option>
                  <option value="3x">3x</option>
                </select>
              </div>
              <div className="control-group">
                <span className="control-label">Mode</span>
                <div className="control-inline">
                  <button
                    className={`btn ${mode === "stepper" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => handleModeChange("stepper")}
                  >
                    Stepper
                  </button>
                  <button
                    className={`btn ${mode === "realtime" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => handleModeChange("realtime")}
                  >
                    Realtime
                  </button>
                </div>
              </div>
              <div className="log-search-sliders">
                <label>
                  Similarity {threshold}%
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={threshold}
                    onChange={(event) => setThreshold(Number(event.target.value))}
                  />
                </label>
                <label>
                  Hops {hops}
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={hops}
                    onChange={(event) => setHops(Number(event.target.value))}
                  />
                </label>
              </div>
            </div>
            {searchStatus && <div className="log-search-status">{searchStatus}</div>}
            <div className="settings-footer">
              Realtime is local-only until telemetry adapter ships
            </div>
          </div>
        )}
      </div>

      <div className="connectome-layout">
        <aside className="connectome-sidebar">
          <ConnectomeHealthPanel ev={healthEvent} />
        </aside>
        <main className="connectome-main-content">
          <FlowCanvas />
          <LogPanel />
        </main>
      </div>
    </div>
  );
}
