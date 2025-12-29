# Platform Behaviors

Observable effects and user experience patterns.

---

## Layer Navigation

### Behavior: Layer Context Always Visible
When viewing any data, the user knows which layer it comes from.

**Observable:**
- L4 data shows protocol badge, link to source
- L3 data shows ecosystem badge, author attribution
- L2 data shows org context
- L1 data shows "Your Data" indicator

### Behavior: Cross-Layer Traversal
Users can navigate relationships across layers.

**Observable:**
- Click citizen → see their L1 graph
- Click org → see L2 coordination
- Click template → see L3 definition
- Click schema type → see L4 definition

---

## Graph Interaction

### Behavior: Direct Manipulation
Graph elements respond to direct interaction.

**Observable:**
- Click node → select, show info panel
- Drag node → reposition in layout
- Scroll → zoom in/out
- Drag background → pan view
- Double-click → fit view

### Behavior: Semantic Search
Natural language queries find relevant nodes.

**Observable:**
- Type query → see matching nodes highlighted
- Adjust threshold → filter by similarity
- Expand hops → show connected context

### Behavior: Real-Time Updates
Graph reflects live changes.

**Observable:**
- New node appears → animates into view
- Energy change → node glow updates
- Traversal → edge pulses

---

## Authentication States

### Behavior: Public Browse
Unauthenticated users can explore.

**Observable:**
- Registry browsable
- Schema explorable
- Templates visible
- Connectome functional (with public graphs)

### Behavior: Authenticated Actions
Logged-in users can act.

**Observable:**
- Personal graph (L1) accessible
- Org dashboard (L2) available
- Contribution flow (L3) enabled
- Wallet visible

---

## Data Verification

### Behavior: Source Attribution
All authoritative data links to source.

**Observable:**
- Schema types link to `mind-protocol` code
- Registry entries show registration tx
- Templates show author and version

### Behavior: Audit Trail
Actions leave traceable records.

**Observable:**
- Template contributions show review history
- Wallet transactions show on-chain links
- Graph modifications show changelog

---

## Error States

### Behavior: Graceful Degradation
Failures don't break the experience.

**Observable:**
- Backend offline → show cached data + status indicator
- Search fails → show error, retain query
- WebSocket drops → reconnect automatically

### Behavior: Clear Feedback
Users know what went wrong.

**Observable:**
- Error messages are human-readable
- Recovery actions are suggested
- Support path is clear

---

## Performance

### Behavior: Responsive Rendering
Large graphs remain interactive.

**Observable:**
- 1000+ nodes render at 60fps
- Zoom/pan never stutters
- Search results appear < 500ms

### Behavior: Progressive Loading
Large datasets load incrementally.

**Observable:**
- Initial view fast
- Details load on demand
- Loading states clear
