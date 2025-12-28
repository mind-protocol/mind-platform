# Connectome Search API — Patterns: API Gateway for Graph Search

```
STATUS: DESIGNING
CREATED: 2024-05-23
VERIFIED: N/A against N/A
```

---

## CHAIN

```
OBJECTIVES:      ./OBJECTIVES_Connectome_Search_API_Objectives.md
BEHAVIORS:      ./BEHAVIORS_Connectome_Search_API_Behaviors.md
THIS:            PATTERNS_Connectome_Search_API_Design_Patterns.md (you are here)
ALGORITHM:       ./ALGORITHM_Connectome_Search_API_Invocation_Flow.md
VALIDATION:      ./VALIDATION_Connectome_Search_API_Invariants.md
HEALTH:          ./HEALTH_Connectome_Search_API_Verification.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Search_API_Architecture.md
SYNC:            ./SYNC_Connectome_Search_API_Current_State.md

IMPL:            app/api/connectome/search/route.ts
```

### Bidirectional Contract

**Before modifying this doc or the code:**
1. Read ALL docs in this chain first
2. Read the linked IMPL source file

**After modifying this doc:**
1. Update the IMPL source file to match, OR
2. Add a TODO in SYNC_Connectome_Search_API_Current_State.md: "Docs updated, implementation needs: {what}"
3. Run tests: `N/A`

**After modifying the code:**
1. Update this doc chain to match, OR
2. Add a TODO in SYNC_Connectome_Search_API_Current_State.md: "Implementation changed, docs need: {what}"
3. Run tests: `N/A`

---

## THE PROBLEM

The core connectome graph search functionality is implemented as a Python Command Line Interface (CLI) tool (`engine.physics.graph.connectome_read_cli`). To expose this functionality to a broader set of clients (e.g., frontend applications, other services) in a standardized and accessible manner, a web-based API endpoint is required. Directly invoking the CLI from client-side or tightly coupling it introduces platform dependencies, security concerns, and architectural inconsistencies.

---

## THE PATTERN

The **API Gateway** pattern is applied here. The `connectome_search_api` acts as a facade, providing a single, consistent entry point for clients to interact with the connectome search functionality. It abstracts away the details of the underlying Python CLI, handling request translation, invocation, and response formatting. This pattern allows for decoupling the client from the specific implementation language or execution environment of the backend service.

---

## BEHAVIORS SUPPORTED

- **C_SEARCH_001** — Clients can perform graph searches by sending HTTP GET requests with query parameters.
- **C_SEARCH_002** — The API transparently executes the Python `connectome_read_cli` with the provided parameters.
- **C_SEARCH_003** — Search results from the CLI are parsed and returned as structured JSON responses.
- **C_SEARCH_004** — Errors from the CLI or API processing are caught and reported back to the client with appropriate HTTP status codes and error messages.

## BEHAVIORS PREVENTED

- **C_SEARCH_ANTI_001** — Clients directly invoking the `connectome_read_cli` executable, leading to platform dependencies and potential security vulnerabilities.
- **C_SEARCH_ANTI_002** — Tight coupling between the client and the Python implementation details of the search logic.

---

## PRINCIPLES

### Principle 1: Delegation of Core Logic

**Description:** The API delegates the complex graph traversal and search algorithms entirely to the `engine.physics.graph.connectome_read_cli` Python tool.
**Why this matters:** This ensures that the search API benefits from the optimized and battle-tested graph processing capabilities of the existing Python codebase, avoiding re-implementation and potential inconsistencies. It allows each component to focus on its primary responsibility.

### Principle 2: Robust Inter-Process Communication

**Description:** The API is designed to robustly manage the execution of the external Python CLI, including handling process spawning, argument passing, capturing stdout/stderr, and managing timeouts.
**Why this matters:** Directly interacting with external processes can be fragile. This principle ensures that the API is resilient to issues like the CLI not being found, execution errors, or unexpected output, preventing cascading failures and providing clear error feedback.

### Principle 3: Standardized API Interface

**Description:** The API presents a clear, REST-like HTTP interface for search operations, using standard query parameters and JSON responses.
**Why this matters:** A standardized interface makes the search functionality easy to consume by various clients, improving developer experience and reducing integration effort. It promotes interoperability and maintainability.

---

## DATA

| Source | Type | Purpose / Description |
|--------|------|-----------------------|
| `request.url` | URL | Incoming HTTP request URL, containing search parameters (`q`, `threshold`, `hops`, `graph`). |
| `process.env.MIND_FALKORDB_HOST` | ENV_VAR | FalkorDB host, used by the Python CLI. |
| `process.env.MIND_FALKORDB_PORT` | ENV_VAR | FalkorDB port, used by the Python CLI. |
| `result.stdout` / `result.stderr` | CLI_OUTPUT | Output streams from the `connectome_read_cli` Python process, containing JSON results or error messages. |

---

## DEPENDENCIES

| Module | Why We Depend On It |
|--------|---------------------|
| `engine.physics.graph.connectome_read_cli` (Python CLI) | This is the core logic provider for connectome graph searches. The API is a wrapper around it. |
| `next/server` | Provides the framework for creating API routes in a Next.js application. |
| `child_process` (Node.js) | Essential for spawning and managing the external `connectome_read_cli` Python process. |

---

## INSPIRATIONS

- **API Gateway Pattern:** A widely adopted architectural pattern for managing external access to a set of microservices or backend systems, as described in various software architecture literature (e.g., Microservices patterns).
- **Command Line Interface (CLI) tools:** The pattern of encapsulating complex logic within a CLI and then exposing it via a higher-level API is common in systems integration, leveraging existing robust tools.

---

## SCOPE

### In Scope

- Receiving HTTP GET requests with specified search query parameters.
- Spawning and executing the `engine.physics.graph.connectome_read_cli` Python process.
- Passing appropriate arguments from the HTTP request to the Python CLI.
- Capturing, parsing, and formatting the standard output (JSON results) and standard error from the CLI.
- Returning JSON responses to the client, including search results or detailed error information.
- Handling timeouts and basic error conditions during CLI invocation.

### Out of Scope

- Implementing the actual graph search algorithms (see: `engine.physics.graph.connectome_read_cli`).
- Managing the lifecycle or deployment of the `connectome_read_cli` Python tool. The API assumes the tool is available in the environment path.
- Advanced authentication or authorization mechanisms (handled by higher-level application security).
- Caching of search results (can be implemented at a higher layer if needed).
- Direct database interaction (the Python CLI handles this via FalkorDB).

---

## MARKERS

<!-- @mind:todo
title: "Add unit and integration tests for CLI invocation"
priority: medium
context: |
  Currently, there are no explicit tests for the process spawning logic, argument passing, or output parsing. This could lead to regressions if the CLI interface changes or environment issues arise.
  Note: API is functional in production - tests are for regression prevention, not critical path.
task: |
  Implement unit tests to mock `spawnSync` and verify correct argument construction, and integration tests to verify the end-to-end flow with a dummy Python script.
paths:
  - path: app/api/connectome/search/route.ts
-->

<!-- @mind:proposition
title: "Introduce request validation schema"
priority: 3
context: |
  The current parameter parsing relies on `Number()` and default values. More robust validation (e.g., Joi, Zod) could provide clearer error messages and prevent malformed requests from reaching the CLI.
implications: |
  Adds a dependency and additional code for schema definition. Improves API robustness.
suggested_changes: |
  Integrate a schema validation library for incoming query parameters (q, threshold, hops, graph).
-->
