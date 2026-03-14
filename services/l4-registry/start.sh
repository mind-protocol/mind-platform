#!/bin/bash
# Start L4 Registry backend service
# Usage: ./start.sh [--daemon]

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

export FALKORDB_HOST="${FALKORDB_HOST:-localhost}"
export FALKORDB_PORT="${FALKORDB_PORT:-6379}"
export FALKORDB_GRAPH="${FALKORDB_GRAPH:-mind_protocol}"

if [ "$1" = "--daemon" ]; then
    nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8766 > /tmp/l4-registry.log 2>&1 &
    echo "L4 Registry started (PID: $!, log: /tmp/l4-registry.log)"
else
    python3 -m uvicorn main:app --host 0.0.0.0 --port 8766
fi
