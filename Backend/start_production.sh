#!/bin/bash
echo "Starting Thenali AI Backend (Production)"
echo "Workers: 4 (supports 5-6 concurrent users)"

uvicorn main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4 \
  --loop uvloop \
  --http httptools \
  --log-level info \
  --access-log \
  --no-use-colors
