# VISUAL STYLE GUIDE: The Connectome

## Introduction: A Declaration of Intent

This document is the formal manifesto for the visual identity of the Connectome. Its purpose is to establish a visual language that solves a core architectural problem: how to observe a system where meaning emerges, not be declared. We must visualize a form of emergent continuity in the absence of a conventional, persistent memory. This requires a deliberate departure from conventional "cyberpunk" or "debug" aesthetics toward a more grounded, physical language we term "Ecological Gothic." This guide defines the foundational elements of that language, ensuring every visual element is a direct expression of the system's underlying physics.

---

## 1. Aesthetic Manifesto: Physics Over Psychology

The following principles are not subjective style preferences but are derived directly from the system's core mechanics. The Connectome is a moment graph that visualizes topology through a series of locally determined state transitions, not a simulated consciousness with intent. Its visual representation must therefore reflect this fundamental truth: we are observing a physical system governed by immutable laws, not simulating a psychological one.

1. Physics over Psychology
   The interface must feel like a "nervous system carved in stone." Visual elements represent a physical topology governed by local determinism, emphasizing structure and consequence over simulated emotion. Nodes are not characters; they are moments transitioning between states. Links are not relationships; they are conduits for computed energy. The entire system has a tangible, immutable weight, as if its history is etched into its very substance.

2. Energy is Computed, Not Injected
   This principle is a direct reflection of the architectural pattern of the same name. All visual effects and transitions are the result of the graph's internal physics—weight transfer, decay, tension—and no "fiat narrative" is permitted. Energy flows through the system with visceral reality, like "blood flowing through a vein" or "rust spreading." We must actively reject the trope of weightless, decorative "electricity zapping." Every pulse is the result of a computed process, not an arbitrary visual flourish.

3. The Membrane is Invisible
   The Membrane is a core architectural component: a pre-runtime field shaper, not a visual effect. It is the system's modulation layer, influencing the graph by adjusting mechanical parameters (weight_transfer, thresholds, pressure_boosts) before the hot path execution begins. Visually, its influence must be rendered as an atmospheric or environmental quality, never as an explicit UI control. The Membrane "tilts the ground; it does not move the pieces." Its effect is perceived as a change in the system's gravity, not as a visible hand guiding its operations.

From this philosophy, we derive a strict, semantic color palette where every hue has a physical meaning.

---

## 2. Color Palette: The Substance of the System

The Connectome color palette is strictly semantic. Each color corresponds to a specific physical state or process within the graph, reinforcing the "blood and stone" aesthetic and rejecting purely decorative choices. Color is a diagnostic tool, not an adornment.

| Semantic Name | CSS Variable | Hex Code | Rationale & Usage |
| --- | --- | --- | --- |
| The Substrate | `var(--substrate)` | `#2A2B2A` | Rejects "Tech Navy." Represents a heavy, inert physical space, like "soiled stone" or the cendres froides (cold ashes) of a concluded event. This is the foundational canvas of the system. |
| Potentials | `var(--potential)` | `#A9A9A9` | Represents possibility awaiting energy. These nodes are latent, not glowing. They appear as "Faint Parchment" or "Dull Iron," present but with status: possible, waiting to be activated. |
| The Stream | `var(--stream)` | `#B7410E` | Represents the energy flow between moments during traversal. This color signifies the hot path of execution, with its intensity corresponding to the transfer rate: x1 per tick. It is visceral and fluid, with the organic color of "Arterial Crimson" or "Oxidation Rust." |
| The Canon | `var(--canon)` | `#B8860B` | When a moment attains status: spoken, it is "seared" into the historical graph and becomes immutable. This color, like "Burnt Gold," signifies this finalized, canonical state. |
| The Membrane | `var(--membrane)` | `#493F64` | Represents the invisible "tilt" of the system. Used sparingly in diagnostic views, it visualizes the pre-runtime modulation field as a subtle atmospheric haze of "Interference Violet," never an explicit UI element. |

---

## 3. Typography & Iconography: The Written Record

Typography and iconography are central to the system's feel as an immutable, historical "ledger." The typographic style creates a deliberate contrast between the weight of history and the clean clarity of real-time data flow.

### Typography

The hierarchy distinguishes between immutable, recorded history and the transient, flowing data of the present moment.

| UI Element | Style & Rationale |
| --- | --- |
| Canonized Moments & System Ledger Headers | A monastic, heavy serif typeface (e.g., a Garamond or Trajan Pro style). This choice evokes a sense of permanence and history. Text that enters the canon is not just displayed; it is inscribed, visually enforcing the immutability invariant of status: completed moments. |
| Data Displays & System Log Entries | A clean, precise sans-serif typeface (e.g., an Inter or Roboto Mono style). This ensures maximum clarity and legibility for system information, which must be read quickly and without ambiguity. |

### Iconography

All icons within the Connectome must adhere to a minimalist, geometric design language. They should feel "etched" directly into the interface substrate, avoiding illustrative or glossy styles. Each icon is a symbol, not a picture, reinforcing the "carved in stone" aesthetic and ensuring that visual language remains abstract and systemic.

---

## 4. Component Styling: Nodes, Edges, and the Ledger

The principles of color and typography are applied directly to the primary components of the Connectome graph to create a cohesive and physically grounded experience.

### Moments

Moments are the primary visual unit of the system and must have a tangible weight. Their state is communicated instantly and without ambiguity through the semantic color palette.

- A Potential moment (status: possible) is styled with `var(--potential)`. It appears dormant and latent, a possibility waiting in the substrate.
- An Active moment (status: active) is the current locus of energy.
- A Canon moment (status: completed) is transformed with `var(--canon)`. It appears "seared" into the background after the canon_holder broadcasts the moment_completed event, its state now a permanent part of the historical record.

### Edges (The Stream)

Edges are the conduits of energy flow between moments, styled with `var(--stream)`. They are not simple lines but representations of the mechanical transfer of weight and energy.

- Their visual properties—such as thickness, a subtle pulse, or an organic texture—must directly reflect the amount of energy flowing through them, embodying the "Arterial Crimson" or "Oxidation Rust" concepts.

### The System Log (The Ledger)

The System Log is a direct visualization of the SYSTEM LOG component. It explicitly rejects the aesthetic of a typical debug console and is designed as an immutable "ledger" of events, making it a functional diagnostic tool.

- It uses the defined typographic hierarchy: heavy serif headers for sessions and clean sans-serif entries for the chronological record.
- Each entry must clearly display key diagnostic data from the log, including the event trigger (direct or async), its duration, and its time.

---

## 5. Motion Physics: Weight, Friction, and Consequence

Motion design in the Connectome is not cosmetic. It is a direct expression of the system's physics, engineered to give elements a tangible sense of mass and inertia. All animations serve as visual feedback for the instantaneous mechanical operations of the <50ms hot path, reinforcing the underlying cause and effect.

| Motion Term | Physical Metaphor & Easing | Primary Application |
| --- | --- | --- |
| Inertial Snap | The motion of a heavy object locking into place. It features a sharp acceleration, an aggressive overshoot, and a rapid settle (e.g., an ease-out-back curve). | The visual finalization of a sub-50ms state change as a moment becomes completed and locks into the immutable canon; focusing on an element in the graph. |
| Viscous Decay | The slow, heavy settling of an object moving through a dense medium, losing momentum gradually until it rests (e.g., a standard ease-out curve). | Deselected elements fading into the background; energy dissipating from a link after a transfer; UI elements gracefully receding. |
| Pressure Release | The sudden, sharp recoil of an element that was under strain. The motion is fast and energetic but resolves immediately (e.g., an ease-in-out-expo curve). | A link snapping into a new state as a condition is met; a collapsed UI section expanding with force. |

Ultimately, every element of this visual system serves a single purpose: to provide a diagnostic lens into the system's underlying reality. This guide is not a set of decorative rules but a framework for observing a system where "the alignment is geometric, not symbolic," and "the continuity is statistical, not memoirelle." This is not a depiction of a system; it is a direct encounter with its physics.
