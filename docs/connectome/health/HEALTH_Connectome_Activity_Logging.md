# Connectome Activity Logging

**Two-tier logging system for tracking all connectome activity with auto-rotation.**

## Overview

The activity logger captures everything that happens in the tick loop:
- Energy generation, flow, decay
- Pressure changes
- State transitions
- Flips and interrupts

## Log Files

| Log | Location | Max Lines | Purpose |
|-----|----------|-----------|---------|
| Summary | `mind/data/logs/health_summary.log` | 500 | Human-readable explanations |
| Detail | `mind/data/logs/health_detail.log` | 5000 | Every node-to-node operation |

## Summary Log Format

```
[HH:MM:SS] ═══ TICK N START ═══ graph=name
[HH:MM:SS] [tick:N] energy X→Y pressure A→B | explanation
[HH:MM:SS]   └─ updated: N narratives, N pressures, N moments decayed
[HH:MM:SS] ⚠ STATE CHANGE: OK → WARN | pressure exceeded 0.8
[HH:MM:SS] 💥 FLIP pressure_id | pressure 0.95 >= breaking 0.90
[HH:MM:SS] 🚨 VIOLATION: query_write | context
```

### Symbols
- `═══` Tick boundaries
- `⚠` State changes / warnings
- `💥` Energy threshold events
- `🚨` Hard violations
- `⏸` Interrupts

## Detail Log Format

```
[HH:MM:SS] ═══ TICK N START ═══
[HH:MM:SS] ── Phase 1: Compute character energies ──
[HH:MM:SS]   ⚡ char_id generated 0.100 (weight=1.00)
[HH:MM:SS] ── Phase 2: Flow energy to narratives ──
[HH:MM:SS]   actor:char_id ──+0.005──> narrative:narr_id | belief flow (str=0.58)
[HH:MM:SS]   ... and N more energy transfers
[HH:MM:SS] ── Phase 4: Decay energy ──
[HH:MM:SS]   📉 narrative:narr_id 0.500→0.490 (-0.010) rate=2.0%
[HH:MM:SS]   ... decayed N narratives, total energy lost: X.XX
```

### Symbols
- `⚡` Energy generation
- `──+X.XX──>` Energy transfer (source → target)
- `📉` Decay operation
- `🔗` Link update
- `💎` Link crystallization
- `✓` Moment completion

## Usage

### Python API

```python
from mind.health import get_activity_logger

logger = get_activity_logger()

# Summary events
logger.tick_summary(tick=5, energy_before=66.5, energy_after=65.8, ...)
logger.state_change("OK", "WARN", "pressure exceeded 0.8")
logger.flip("pressure_blood_feud", 0.95, 0.90, ["narr_1", "narr_2"])
logger.violation("query_write", "attempted write to read-only graph")

# Detail events
logger.energy_transfer("char_john", "narr_feud", 0.05, "belief flow")
logger.decay("narr_rumor", 0.5, 0.49, 0.02, "narrative")
logger.completion("moment_talk", 1.5, 42)
```

### CLI Tool

```bash
# Run ticks and generate logs
python3 tools/test_health_live.py --graph seed --ticks 5

# Watch logs in real-time
tail -f mind/data/logs/health_summary.log
tail -f mind/data/logs/health_detail.log
```

## Auto-Rotation

When logs exceed their max lines:
1. Oldest half is deleted
2. A rotation marker is inserted
3. Logging continues

```
--- LOG ROTATED at HH:MM:SS (kept last 250 lines) ---
```

## Integration Points

### Tick Engine (`mind/physics/tick.py`)

The tick engine automatically logs to the activity logger:
- Phase start/end
- Energy generation per actor
- Energy transfers (first 20 per phase)
- Decay operations (first 15)
- Flips detected

### Health Service (`mind/health/connectome_health_service.py`)

Records state-changing events:
- Violations
- Interrupts
- Context changes

### Orchestrator (`mind/infrastructure/orchestration/orchestrator.py`)

Records high-level events:
- Tick execution
- Flip processing
- World injection

## Customization

### Change Log Limits

```python
from mind.health.activity_logger import ActivityLogger, LogConfig

config = LogConfig(
    summary_max_lines=1000,  # default 500
    detail_max_lines=10000,  # default 5000
)
logger = ActivityLogger(config)
```

### Custom Log Directory

```python
from pathlib import Path

config = LogConfig(log_dir=Path("/var/log/connectome"))
```

## Troubleshooting

### Logs Not Appearing
1. Check directory exists: `mind/data/logs/`
2. Check write permissions
3. Verify ticks are running (not skipped for < MIN_TICK_MINUTES)

### Logs Growing Too Fast
- Increase rotation limits
- Reduce logging in detail phases
- Check for runaway tick loops

## Related

- `mind/health/activity_logger.py` - Logger implementation
- `mind/health/connectome_health_service.py` - Health aggregation
- `tools/test_health_live.py` - Test harness
