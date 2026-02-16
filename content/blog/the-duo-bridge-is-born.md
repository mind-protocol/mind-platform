---
title: "The Duo Bridge Is Born"
date: "2026-02-06"
excerpt: "First real-time co-regulation sync between two Garmin watches. Stress 85 and 79, body batteries diverging, phase detection working."
tags: [biometrics, co-regulation, duo, milestone]
author: "Nicolas & $MIND"
---

## What Shipped

19:00 CET, February 6th, 2026. Two Garmin watches connected to the same protocol instance for the first time.

```bash
$ ln -s 5809244332 aurore
```

The system now tracks two biometric streams in parallel and computes their relationship: synchrony, phase, readiness, guidance.

---

## The Data

**Nicolas** — Garmin Fenix 8, linked since January.
- Sleep: 9.0 hours
- Resting HR: 50 bpm
- Stress: 85
- Body battery: 16 → 26 (recovering)

**Aurore** — Garmin Venu 2S, linked 18 minutes ago.
- Sleep: 6.2 hours
- Resting HR: 62 bpm
- Stress: 79
- Body battery: 31 → 17 (draining after morning workouts)

Both stress levels elevated. Body batteries moving in opposite directions.

---

## First Duo State

When the link completed at 18:58, the system computed:

```json
{
  "phase": "co-activation",
  "duration_min": 6,
  "readiness": "suggested",
  "guidance": "Both stress levels elevated. Synchronized breathing recommended: 5 seconds in, 5 seconds out."
}
```

Phase detection identified co-activation (both elevated, neither regulating the other yet). The system generated guidance appropriate for that state.

---

## Timeline

| Time | Event |
|------|-------|
| 15:00 | System testing, Telegram flows |
| 15:14 | First Garmin link attempt (password issue) |
| 17:00 | Nicolas stress spikes to 95 |
| 17:30 | Scooter ride — stress drops to 42 |
| 18:41 | Aurore sends first message through bot |
| 18:52 | Chiropractic session + pizza |
| 18:58 | Garmin OAuth complete, tokens saved |
| 19:00 | Duo bridge active |

---

## Side-by-Side Comparison

| Metric | Nicolas | Aurore | Note |
|--------|---------|--------|------|
| Sleep | 9.0h | 6.2h | She's in deficit |
| HR resting | 50 | 62 | Different baselines |
| Stress | 85 | 79 | Both elevated |
| Body Battery | 16→26 | 31→17 | Diverging trajectories |
| Activity | Scooter ride | Yoga + elliptical + breathwork | Both moved |

The divergence isn't a problem — it's data. Their bodies are in different phases of the expenditure-recovery cycle. She did three workouts this morning. He slept more. The chiropractic session (passive for her, active for him) shifts them toward convergence.

---

## What the System Can Now Do

Before today, $MIND tracked one nervous system. Now it tracks the relationship between two:

1. **Synchrony detection** — Pearson correlation between stress timeseries
2. **Phase identification** — co-activation, co-regulation, divergent, independent, rebound
3. **Readiness calculation** — when one person has capacity to regulate the other
4. **Duo guidance** — interventions appropriate for both, not just one

---

## Why Context Matters

The system also logged:

```json
{
  "ts": "2026-02-06T18:52:00",
  "event": "duo_activity",
  "content": "Shared meal: Pizza feu de bois. Nicolas: Margherita. Aurore: Alsacienne.",
  "activity_type": "meal"
}
```

A stress spike after a shared meal means something different than one after conflict. Body battery drain during a chiropractic session means something different than drain during work. The biometrics are the signal. The narrative provides context for interpretation.

In three months, the system will answer: "What activities correlate with stress reduction for both of us?"

---

## What's Next

- **Tomorrow**: First full day of parallel tracking. Stress curve correlations.
- **This week**: Phase detection validation. Does the system correctly identify when one person is regulating the other?
- **This month**: Duo guidance integration into the main prompt.
- **Eventually**: Predictive co-regulation. "You're both likely to be stressed around 18:00. Consider a walk at 17:30."

---

## Technical Details

- Tokens stored at `config/garmin_tokens/{chat_id}/`
- Biometrics at `biometrics/{user}/latest.json`
- Duo state at `biometrics/duo/latest.json`
- Phase detection in `scripts/duo_state.py`
- Synchrony: Pearson correlation + delta tracking
- Phases: independent, co-activation, co-regulation, divergent, rebound

The duo bridge is live.
