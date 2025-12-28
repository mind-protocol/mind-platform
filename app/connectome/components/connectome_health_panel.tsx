"use client";

// DOCS: docs/connectome/health/HEALTH_Connectome_Live_Signals.md

import type {
  ConnectomeHealthEvent,
  HealthStatus,
  PhysicsIndicator,
  MembraneIndicator,
  ExplorationIndicator,
} from "../lib/zustand_connectome_state_store_with_atomic_commit_actions";

const status_label = (state?: HealthStatus) => state ?? "UNKNOWN";

const STATUS_ICON: Record<string, string> = {
  ok: "✓",
  warn: "⚠",
  error: "✗",
  unknown: "?",
};

const PHYSICS_LABELS: Record<string, string> = {
  energy_conservation: "Energy",
  no_negative: "Non-negative",
  link_state: "Link State",
  tick_integrity: "Tick Order",
  moment_lifecycle: "Moments",
};

const MEMBRANE_LABELS: Record<string, string> = {
  session_state: "Session",
  step_ordering: "Steps",
  cluster_integrity: "Cluster",
  answer_validation: "Answers",
  call_depth: "Call Stack",
};

const EXPLORATION_LABELS: Record<string, string> = {
  exploration_errors: "Errors",
  exploration_warnings: "Warnings",
  exploration_check: "Check",
};

function IndicatorRow({ name, status, message, labels }: {
  name: string;
  status: string;
  message: string;
  labels: Record<string, string>;
}) {
  const statusLower = status.toLowerCase();
  const icon = STATUS_ICON[statusLower] || "?";
  const label = labels[name] || name;

  return (
    <div className={`physics-indicator physics-indicator-${statusLower}`}>
      <span className="physics-indicator-icon">{icon}</span>
      <span className="physics-indicator-label">{label}</span>
      <span className="physics-indicator-message">{message}</span>
    </div>
  );
}

function PhysicsIndicatorRow({ indicator }: { indicator: PhysicsIndicator }) {
  return (
    <IndicatorRow
      name={indicator.name}
      status={indicator.status}
      message={indicator.message}
      labels={PHYSICS_LABELS}
    />
  );
}

function MembraneIndicatorRow({ indicator }: { indicator: MembraneIndicator }) {
  return (
    <IndicatorRow
      name={indicator.name}
      status={indicator.status}
      message={indicator.message}
      labels={MEMBRANE_LABELS}
    />
  );
}

function ExplorationIndicatorRow({ indicator }: { indicator: ExplorationIndicator }) {
  return (
    <IndicatorRow
      name={indicator.name}
      status={indicator.status}
      message={indicator.message}
      labels={EXPLORATION_LABELS}
    />
  );
}

export default function ConnectomeHealthPanel({ ev }: { ev: ConnectomeHealthEvent | null }) {
  if (!ev) {
    return (
      <div className="connectome-health-panel connectome-health-empty">
        Waiting for health stream…
      </div>
    );
  }

  const status = ev.status?.state ?? "UNKNOWN";
  const score = typeof ev.status?.score === "number" ? ev.status.score : null;
  const notes = ev.status?.notes ?? [];
  const runner = ev.runner;
  const counters = ev.counters;
  const attention = ev.attention;
  const pressure = ev.pressure;
  const physics = ev.physics;
  const membrane = ev.membrane;
  const exploration = ev.exploration;

  return (
    <div className="connectome-health-panel">
      <div className="connectome-health-header">
        <div>
          <div className="connectome-health-title">Connectome Health</div>
          <div className="connectome-health-subtitle">Live invariants and drift signals</div>
        </div>
        <div className="connectome-health-status">
          <span className={`health-badge health-${status.toLowerCase()}`}>{status_label(status)}</span>
          <span className="health-score">score {score !== null ? score.toFixed(2) : "?"}</span>
        </div>
      </div>

      {notes.length ? (
        <div className="connectome-health-notes">
          {notes.map((note, index) => (
            <div key={`${note}-${index}`}>• {note}</div>
          ))}
        </div>
      ) : null}

      {/* Physics Health Indicators */}
      {physics && physics.indicators.length > 0 && (
        <div className="connectome-health-physics">
          <div className="physics-header">
            <span className="physics-title">Physics Health</span>
            <span className={`health-badge health-badge-sm health-${physics.overall}`}>
              {physics.overall.toUpperCase()}
            </span>
          </div>
          <div className="physics-indicators">
            {physics.indicators.map((indicator) => (
              <PhysicsIndicatorRow key={indicator.name} indicator={indicator} />
            ))}
          </div>
          {physics.graph_name && (
            <div className="physics-meta">
              graph: <strong>{physics.graph_name}</strong>
            </div>
          )}
        </div>
      )}

      {/* Membrane Health Indicators */}
      {membrane && (membrane.indicators.length > 0 || membrane.active_sessions > 0) && (
        <div className="connectome-health-physics">
          <div className="physics-header">
            <span className="physics-title">Membrane Health</span>
            <span className={`health-badge health-badge-sm health-${membrane.overall}`}>
              {membrane.overall.toUpperCase()}
            </span>
          </div>
          {membrane.indicators.length > 0 && (
            <div className="physics-indicators">
              {membrane.indicators.map((indicator, idx) => (
                <MembraneIndicatorRow key={`${indicator.name}-${idx}`} indicator={indicator} />
              ))}
            </div>
          )}
          <div className="physics-meta">
            active sessions: <strong>{membrane.active_sessions}</strong>
          </div>
        </div>
      )}

      {/* Exploration Health Indicators */}
      {exploration && (exploration.indicators.length > 0 || exploration.active_explorations > 0) && (
        <div className="connectome-health-physics">
          <div className="physics-header">
            <span className="physics-title">Exploration Health</span>
            <span className={`health-badge health-badge-sm health-${exploration.overall}`}>
              {exploration.overall.toUpperCase()}
            </span>
          </div>
          {exploration.indicators.length > 0 && (
            <div className="physics-indicators">
              {exploration.indicators.map((indicator, idx) => (
                <ExplorationIndicatorRow key={`${indicator.name}-${idx}`} indicator={indicator} />
              ))}
            </div>
          )}
          <div className="physics-meta">
            explorations: <strong>{exploration.active_explorations}</strong>
            <span> · </span>
            anomalies: <strong>{exploration.total_anomalies}</strong>
          </div>
        </div>
      )}

      <div className="connectome-health-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="connectome-health-card">
          <div className="health-card-label">Runner</div>
          <div className="health-row">
            <span>speed</span>
            <strong>{runner?.speed ?? "?"}</strong>
          </div>
          <div className="health-row">
            <span>tick</span>
            <strong>{runner?.tick ?? "?"}</strong>
          </div>
          <div className="health-meta">
            last interrupt: <strong>{runner?.last_interrupt?.reason ?? "none"}</strong>
          </div>
        </div>

        <div className="connectome-health-card">
          <div className="health-card-label">Attention</div>
          <div className="health-row">
            <span>sinks p50</span>
            <strong>{attention?.sink_set_size?.p50 ?? 0}</strong>
          </div>
          <div className="health-row">
            <span>p95</span>
            <strong>{attention?.sink_set_size?.p95 ?? 0}</strong>
          </div>
          <div className="health-meta">
            reconfig/min <strong>{attention?.focus_reconfig_rate_per_min ?? 0}</strong>
            <span> · </span>
            plateau <strong>{attention?.plateau_seconds ?? 0}s</strong>
          </div>
        </div>

        <div className="connectome-health-card">
          <div className="health-card-label">Pressure</div>
          <div className="health-row">
            <span>contradiction</span>
            <strong>{pressure?.contradiction ?? 0}</strong>
          </div>
          <div className="health-meta">local, bounded</div>
        </div>

        <div className="connectome-health-card">
          <div className="health-card-label">Hard counters</div>
          <div className="health-row">
            <span>query writes</span>
            <strong>{counters?.query_write_attempts ?? 0}</strong>
          </div>
          <div className="health-row">
            <span>DMZ</span>
            <strong>{counters?.dmz_violation_attempts ?? 0}</strong>
          </div>
          <div className="health-meta">
            async mismatch <strong>{counters?.async_epoch_mismatch ?? 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
