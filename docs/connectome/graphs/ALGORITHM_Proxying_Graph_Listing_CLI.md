# ALGORITHM: Proxying Graph Listing CLI

## CHAIN

OBJECTIVES:       ./OBJECTIVES_Connectome_Graphs.md
PATTERNS:        ./PATTERNS_Connectome_Graphs.md
BEHAVIORS:       ./BEHAVIORS_Listing_Available_Connectome_Graphs.md
VALIDATION:      ./VALIDATION_Connectome_Graph_Listing_Invariants.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Graph_Listing_API_Architecture.md
HEALTH:          ./HEALTH_Connectome_Graph_Listing_Verification.md
SYNC:            ./SYNC_Connectome_Graphs_Sync_Current_State.md
THIS:            ./ALGORITHM_Proxying_Graph_Listing_CLI.md

## Overview

This document details the step-by-step process (algorithm) by which the `connectome/graphs` module proxies requests to a Python CLI tool to list available FalkorDB graphs.

## Algorithm Steps

### 1. Receive HTTP Request

- The module's API endpoint (`/api/connectome/graphs`) receives an HTTP GET request.

### 2. Construct CLI Command

- Based on the internal configuration, the module constructs the appropriate shell command to invoke the Python CLI tool responsible for listing FalkorDB graphs. This typically involves:
    - Identifying the Python interpreter (e.g., `python3`)
    - Specifying the path to the CLI script (e.g., `../tools/connectome_read_cli.py`)
    - Appending the necessary subcommand and arguments for listing graphs (e.g., `list-graphs`)
- Example command structure: `python3 ../tools/connectome_read_cli.py list-graphs`

### 3. Execute CLI Command

- The constructed shell command is executed using a secure process execution mechanism (e.g., `subprocess.run` in Python, or similar in Node.js).
- The execution is performed synchronously, waiting for the CLI tool to complete and return its output.

### 4. Capture CLI Output

- The standard output (stdout) of the CLI tool's execution is captured.
- The standard error (stderr) is also captured for debugging purposes, but typically not exposed directly to the client.

### 5. Parse CLI Output

- The captured stdout, which is expected to be a JSON string representing a list of graph names, is parsed into a native data structure (e.g., a JavaScript array).
- Robust error handling is applied during parsing to catch malformed or unexpected output from the CLI tool.

### 6. Handle CLI Execution Errors

- If the CLI command exits with a non-zero status code, or if an exception occurs during its execution, the error details (from stderr or the exception) are logged.
- A generic internal server error is prepared for the client.

### 7. Format and Send Response

- If parsing is successful, the native data structure (list of graph names) is serialized back into a JSON string.
- This JSON string is then sent as the HTTP response body with a 200 OK status code.
- In case of an error during any step, the prepared error response is sent with an appropriate HTTP status code (e.g., 500 Internal Server Error).

## Key Data Structures

- **CLI Command String**: A string representing the shell command to execute.
- **CLI Output (Raw)**: A string containing the stdout and stderr from the CLI execution.
- **Graph Names (Parsed)**: A list or array of strings, where each string is a graph name.

## Complexity Considerations

- **CLI Tool Dependency**: The algorithm's correctness heavily relies on the external Python CLI tool's stability and consistent output format.
- **Error Propagation**: Ensuring that CLI errors are properly caught, logged, and translated into meaningful API error responses is crucial.
- **Performance**: The synchronous execution of the CLI tool can introduce latency. For very large numbers of graphs, this could become a bottleneck, but is generally acceptable for metadata listing.
