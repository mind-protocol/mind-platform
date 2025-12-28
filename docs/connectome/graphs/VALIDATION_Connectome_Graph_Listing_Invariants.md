# VALIDATION: Connectome Graph Listing Invariants

## CHAIN

OBJECTIVES:       ./OBJECTIVES_Connectome_Graphs.md
PATTERNS:        ./PATTERNS_Connectome_Graphs.md
BEHAVIORS:       ./BEHAVIORS_Listing_Available_Connectome_Graphs.md
ALGORITHM:       ./ALGORITHM_Proxying_Graph_Listing_CLI.md
IMPLEMENTATION:  ./IMPLEMENTATION_Connectome_Graph_Listing_API_Architecture.md
HEALTH:          ./HEALTH_Connectome_Graph_Listing_Verification.md
SYNC:            ./SYNC_Connectome_Graphs_Sync_Current_State.md
THIS:            ./VALIDATION_Connectome_Graph_Listing_Invariants.md

## Overview

This document outlines the critical invariants, checks, and verification steps for the `connectome/graphs` module, ensuring its reliable operation in listing FalkorDB graphs.

## Invariants (Must Always Be True)

1.  **CLI Tool Availability**: The configured Python CLI tool (`connectome_read_cli.py`) must be accessible and executable from the module's runtime environment.
2.  **CLI Tool Output Format**: The Python CLI tool, when invoked with `list-graphs`, must consistently produce valid JSON representing an array of strings.
3.  **JSON Parsability**: The response from the CLI tool, if successful, must be parsable into a list of strings by the module.
4.  **Endpoint Accessibility**: The `/api/connectome/graphs` endpoint must be reachable and respond to HTTP GET requests.
5.  **No Side Effects**: A GET request to the graph listing endpoint must not alter the state of the FalkorDB database or any other persistent system.
6.  **Error Transparency**: Internal errors from the CLI tool or parsing failures must be translated into appropriate HTTP error responses (e.g., 500 Internal Server Error) and logged.
7.  **Empty List Correctness**: If no graphs exist in FalkorDB, the endpoint must return an empty JSON array `[]` and not an error.

## Verification Checks

### 1. Unit Tests (or Integration Tests for CLI Call)

- **CLI Command Construction**: Test that the correct shell command string is generated based on configuration.
- **CLI Output Parsing**: Test the parsing logic with various valid and invalid JSON inputs from a mock CLI.
- **Error Handling**: Test how the module reacts to different CLI exit codes (0 for success, non-zero for failure) and malformed output.
- **Empty Result**: Test that an empty list is returned when the mock CLI reports no graphs.

### 2. Integration Tests

- **End-to-End API Call**: Make an actual HTTP GET request to `/api/connectome/graphs`.
    - Verify a 200 OK status code when graphs are expected.
    - Verify the returned JSON array contains the expected graph names.
    - Verify an empty array `[]` is returned when the database is empty.
- **CLI Tool Execution**: Ensure the actual Python CLI tool is correctly invoked and its output is processed.
- **FalkorDB Connection**: If possible, run integration tests against a test FalkorDB instance to ensure real connectivity.

### 3. Manual Testing / Smoke Test

- Use `curl` or a web browser to hit the `/api/connectome/graphs` endpoint.
- Observe the JSON response for correctness.
- In scenarios where the FalkorDB is known to be empty, verify `[]` is returned.

### 4. Logging and Monitoring

- Check application logs for any errors or warnings related to CLI execution or response parsing.
- Monitor API endpoint uptime and response times.

## Edge Cases and Failure Modes

- **CLI Tool Not Found**: The configured CLI script path is incorrect or the script is missing.
- **CLI Tool Permissions**: The CLI script does not have execute permissions.
- **FalkorDB Unreachable**: The underlying CLI tool fails to connect to the FalkorDB instance.
- **Invalid JSON from CLI**: The CLI tool outputs something that is not valid JSON.
- **CLI Timeout**: The CLI tool takes too long to respond, leading to a timeout.
- **Resource Exhaustion**: Excessive requests could lead to resource limits on the process executing the CLI.
