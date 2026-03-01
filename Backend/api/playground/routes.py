"""
Playground API routes — code execution sandbox and analysis.
"""
import logging
import sys
import io
import time
import threading
import platform
from typing import Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException

from config import settings
from database import get_dynamodb_resource
from models.schemas import PlaygroundRunRequest, PlaygroundAnalyzeRequest
from utils.auth import get_current_user
from utils.helpers import generate_id, utc_now_iso, truncate_text
from services.aws import invoke_model_structured

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/playground", tags=["Playground"])


def get_playground_table():
    return get_dynamodb_resource().Table(settings.DYNAMODB_PLAYGROUND_SESSIONS_TABLE)


# ─── Sandboxed Execution ──────────────────────────────────────────────────────

BLOCKED_MODULES = {
    "os", "subprocess", "sys", "shutil", "socket",
    "requests", "urllib", "http", "ftplib", "smtplib",
    "pickle", "marshal", "ctypes", "importlib",
    "multiprocessing", "threading",
}

BLOCKED_BUILTINS = {"open", "exec", "eval", "__import__", "compile"}


class SandboxTimeoutError(Exception):
    pass


def _execute_python_sandbox(code: str, timeout: int = None) -> Dict[str, Any]:
    """
    Execute Python code in a restricted sandbox.
    Limits: time, no filesystem access, no network.
    """
    timeout = timeout or settings.SANDBOX_TIMEOUT
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    result = {"output": "", "error": None, "execution_time_ms": 0}

    # Build restricted globals
    safe_builtins = {
        "print": print,
        "range": range,
        "len": len, "str": str, "int": int, "float": float,
        "bool": bool, "list": list, "dict": dict, "tuple": tuple,
        "set": set, "type": type, "isinstance": isinstance,
        "enumerate": enumerate, "zip": zip, "map": map, "filter": filter,
        "sorted": sorted, "reversed": reversed,
        "min": min, "max": max, "sum": sum, "abs": abs,
        "round": round, "pow": pow, "divmod": divmod,
        "any": any, "all": all,
        "repr": repr, "format": format,
        "True": True, "False": False, "None": None,
        "__build_class__": __build_class__,
    }

    restricted_globals = {
        "__builtins__": safe_builtins,
        "__name__": "__main__",
    }

    exception_holder = []
    timed_out = []

    def run_code():
        import sys as _sys
        old_stdout, old_stderr = _sys.stdout, _sys.stderr
        _sys.stdout = stdout_capture
        _sys.stderr = stderr_capture
        try:
            exec(compile(code, "<sandbox>", "exec"), restricted_globals)
        except Exception as exc:
            exception_holder.append(exc)
        finally:
            _sys.stdout = old_stdout
            _sys.stderr = old_stderr

    start = time.time()
    t = threading.Thread(target=run_code, daemon=True)
    t.start()
    t.join(timeout=timeout)
    elapsed = round((time.time() - start) * 1000, 2)

    if t.is_alive():
        result["error"] = f"Execution timed out after {timeout}s"
        result["output"] = stdout_capture.getvalue()
        result["execution_time_ms"] = elapsed
        return result

    result["execution_time_ms"] = elapsed
    result["output"] = stdout_capture.getvalue()
    stderr_out = stderr_capture.getvalue()

    if exception_holder:
        exc = exception_holder[0]
        result["error"] = f"{type(exc).__name__}: {exc}"
    elif stderr_out:
        result["error"] = stderr_out

    return result


@router.post("/run")
async def run_code(
    body: PlaygroundRunRequest,
    current_user: dict = Depends(get_current_user),
):
    """Execute code in a sandboxed environment."""
    user_id = current_user["sub"]
    language = body.language.lower()

    if language != "python":
        return {
            "output": f"Live execution for '{language}' is not yet supported. Only Python is available.",
            "error": None,
            "execution_time_ms": 0,
            "language": language,
        }

    # Safety check: basic pattern analysis
    forbidden_patterns = ["import os", "import subprocess", "import socket", "__import__", "eval(", "exec("]
    for pattern in forbidden_patterns:
        if pattern in body.code:
            return {
                "output": "",
                "error": f"Security violation: Pattern '{pattern}' is not allowed in the sandbox.",
                "execution_time_ms": 0,
                "language": language,
            }

    result = _execute_python_sandbox(body.code, timeout=settings.SANDBOX_TIMEOUT)
    result["language"] = language

    # Log session
    try:
        get_playground_table().put_item(Item={
            "id": generate_id("play_"),
            "user_id": user_id,
            "code": body.code[:2000],
            "language": language,
            "analysis_score": None,
            "created_at": utc_now_iso(),
        })
    except Exception:
        pass

    return result


@router.post("/analyze")
async def analyze_code(
    body: PlaygroundAnalyzeRequest,
    current_user: dict = Depends(get_current_user),
):
    """Analyze code quality and get AI feedback."""
    context = ""
    if body.repo_id:
        from services.rag.pipeline import rag_pipeline
        context = rag_pipeline.get_relevant_context(body.repo_id, "code patterns best practices", top_k=3)

    prompt = f"""Analyze the following {body.language} code and provide comprehensive feedback.

CODE:
```{body.language}
{truncate_text(body.code, 3000)}
```

{"REPOSITORY CONTEXT:\\n" + context if context else ""}

Return a JSON analysis:
{{
  "overall_score": <0-100>,
  "quality_grade": "A+|A|B|C|D|F",
  "summary": "...",
  "issues": [
    {{
      "type": "bug|style|performance|security|maintainability",
      "severity": "critical|high|medium|low",
      "line": <number or null>,
      "description": "...",
      "suggestion": "..."
    }}
  ],
  "strengths": ["..."],
  "improvements": ["..."],
  "complexity": {{
    "cyclomatic": <number>,
    "cognitive": "low|medium|high"
  }},
  "best_practices": {{
    "followed": ["..."],
    "missing": ["..."]
  }},
  "refactored_snippet": "optional improved version of critical section..."
}}"""

    analysis = invoke_model_structured(
        prompt=prompt,
        system_prompt="You are a senior software engineer specializing in code review and quality analysis.",
        schema_description="Code analysis object with score, issues, strengths",
    )

    return {"success": True, "language": body.language, "analysis": analysis}


@router.get("/history")
async def get_playground_history(current_user: dict = Depends(get_current_user)):
    """Get the user's playground session history."""
    user_id = current_user["sub"]
    try:
        response = get_playground_table().scan(
            FilterExpression="user_id = :uid",
            ExpressionAttributeValues={":uid": user_id},
        )
        sessions = sorted(
            response.get("Items", []),
            key=lambda x: x.get("created_at", ""),
            reverse=True,
        )
        return {"sessions": sessions[:20]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
