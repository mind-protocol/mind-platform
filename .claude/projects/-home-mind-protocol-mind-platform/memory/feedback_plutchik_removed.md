---
name: Plutchik emotions completely removed
description: trust_disgust, joy_sadness, fear_anger, surprise_anticipation are GONE from the protocol. Never reference them.
type: feedback
---

The 4 Plutchik bipolar emotion axes (trust_disgust, joy_sadness, fear_anger, surprise_anticipation) are COMPLETELY REMOVED from the protocol.

**Why:** Schema v2.0 replaced them with the limbic system (valence, arousal, drives). The old emotion fields are dead.

**How to apply:** Never reference trust_disgust or any Plutchik axis in any code or docs. Trust calculation uses link permanence × weight, not trust_disgust. If you see Plutchik references, delete them.
