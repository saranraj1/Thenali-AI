#!/bin/bash
# ─── Thenali AI — Production Backend Server ─────────────────────────────────
# Workers: 2 (balanced for t3.medium: 4GB RAM)
# Each worker loads Whisper base (~300MB RAM) + Bedrock thread pool.
# Upgrade to t3.large (8GB RAM) before raising to 4 workers.
#
# Usage:
#   chmod +x start_production.sh
#   ./start_production.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> Working directory: $SCRIPT_DIR"

# Activate virtual environment (adjust path if your venv is elsewhere)
if [ -f "$SCRIPT_DIR/venv/bin/activate" ]; then
    source "$SCRIPT_DIR/venv/bin/activate"
    echo "==> Virtual environment activated"
else
    echo "⚠️  venv not found at $SCRIPT_DIR/venv — using system Python"
fi

# Verify key dependencies
python -c "import fastapi, uvicorn, boto3" || {
    echo "❌ Required packages missing. Run: pip install -r requirements.txt"
    exit 1
}

# Linux: ensure git is available
export GIT_PYTHON_GIT_EXECUTABLE=$(which git 2>/dev/null || echo "/usr/bin/git")
export GIT_PYTHON_REFRESH=quiet

echo "==> Git executable: $GIT_PYTHON_GIT_EXECUTABLE"
echo "==> Starting Thenali AI Backend (Production) with 2 workers..."

uvicorn main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 2 \
  --loop uvloop \
  --http httptools \
  --log-level info \
  --access-log \
  --no-use-colors
