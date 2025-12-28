# IMPLEMENTATION: Connectome Graph Listing API Architecture

## CHAIN

OBJECTIVES:       ./OBJECTIVES_Connectome_Graphs.md
PATTERNS:        ./PATTERNS_Connectome_Graphs.md
BEHAVIORS:       ./BEHAVIORS_Listing_Available_Connectome_Graphs.md
ALGORITHM:       ./ALGORITHM_Proxying_Graph_Listing_CLI.md
VALIDATION:      ./VALIDATION_Connectome_Graph_Listing_Invariants.md
HEALTH:          ./HEALTH_Connectome_Graph_Listing_Verification.md
SYNC:            ./SYNC_Connectome_Graphs_Sync_Current_State.md
THIS:            ./IMPLEMENTATION_Connectome_Graph_Listing_API_Architecture.md

## Overview

This document details the architectural structure and implementation specifics of the `connectome/graphs` module. This module provides an API endpoint for listing available FalkorDB graphs by proxying requests to a Python CLI tool.

## Code Structure

The `connectome/graphs` module is implemented as a Next.js API route.

## File Responsibilities

| File Name | Line Count (approx) | Status | Purpose |
|---|---|---|---|
| `route.ts` | < 100L | OK | Defines the GET handler for the `/api/connectome/graphs` endpoint. It orchestrates the invocation of the external Python CLI tool and processes its output. |

## Design Patterns

### Architecture Pattern: API Gateway / Backend for Frontend (BFF) Lite

- **Why**: The module acts as a lightweight API gateway, providing a defined HTTP interface for a backend service (the Python CLI tool interacting with FalkorDB). This decouples the frontend client from direct interaction with the CLI, allowing for centralized error handling, data transformation, and security.

### Code Patterns in Use

- **Proxy Pattern**: The primary pattern is a proxy, where `route.ts` forwards client requests to an underlying CLI tool and returns the tool's response. This abstracts the complexity of CLI execution from the API consumer.
- **Error Handling Pattern**: Centralized error handling within `route.ts` ensures consistent error responses for clients, irrespective of the underlying CLI tool's failure mode.

### Anti-patterns to Avoid

- **Direct CLI Invocation from Frontend**: Clients should not directly invoke the CLI tool, as this introduces security risks and couples the client to backend implementation details.
- **Excessive Logic in API Route**: `route.ts` should primarily focus on orchestration (request/response, CLI invocation, basic parsing). Complex business logic or database interactions should reside in separate, testable units (e.g., the CLI tool itself).

### Boundary Definitions

- **Inside the Module**: The Next.js API route (`route.ts`) and any helper functions directly used by it for command construction or output parsing.
- **Outside the Module**: The Python CLI tool (`connectome_read_cli.py`), the FalkorDB database, and the client application consuming this API.

## Data Flow

1.  **Client Request**: An HTTP GET request is sent from a client to `/api/connectome/graphs`.
2.  **Route Handler**: `route.ts` receives the request.
3.  **Command Construction**: `route.ts` constructs the shell command for `connectome_read_cli.py list-graphs`.
4.  **CLI Execution**: The shell command is executed, invoking the Python CLI tool.
5.  **CLI Response**: The Python CLI tool queries FalkorDB and returns a JSON string (list of graph names) to stdout.
6.  **Output Processing**: `route.ts` captures the stdout, parses the JSON string, and handles any errors.
7.  **API Response**: `route.ts` formats the parsed list of graph names into a JSON HTTP response and sends it back to the client.
