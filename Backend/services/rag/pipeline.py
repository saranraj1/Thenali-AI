"""
RAG Pipeline — clones a GitHub repo, parses source files,
chunks code, generates embeddings, and stores in FAISS.
"""
import os
import re
import zipfile
import logging
import shutil
import threading
from typing import List, Dict, Any, Optional
from pathlib import Path

# git must be imported at module level — local imports cause UnboundLocalError
import git

from config import settings
from utils.helpers import generate_id, utc_now_iso, chunk_list

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────────────────────
# GIT EXECUTABLE SETUP — runs at module level, before any class is defined.
# GitPython on Windows can't find git.exe unless refresh() is called first.
# ──────────────────────────────────────────────────────────────────────────────
os.environ.setdefault("GIT_PYTHON_REFRESH", "quiet")

def _setup_git() -> str | None:
    """Find git.exe and tell GitPython about it. Returns the resolved path or None."""
    import shutil as _shutil

    # Priority 1: Explicit env variable (from .env or OS)
    git_exec = os.environ.get("GIT_PYTHON_GIT_EXECUTABLE", "").strip()
    if git_exec and os.path.isfile(git_exec):
        try:
            git.refresh(git_exec)
            return git_exec
        except Exception:
            pass

    # Priority 2: Common Windows installation paths
    _username = os.environ.get("USERNAME", os.environ.get("USER", ""))
    windows_candidates = [
        r"C:\Program Files\Git\bin\git.exe",
        r"C:\Program Files (x86)\Git\bin\git.exe",
        rf"C:\Users\{_username}\AppData\Local\Programs\Git\bin\git.exe",
        r"C:\Git\bin\git.exe",
        r"C:\tools\git\bin\git.exe",
        r"C:\Program Files\Git\cmd\git.exe",
    ]
    for candidate in windows_candidates:
        if os.path.isfile(candidate):
            try:
                git.refresh(candidate)
                os.environ["GIT_PYTHON_GIT_EXECUTABLE"] = candidate
                return candidate
            except Exception:
                continue

    # Priority 3: System PATH
    found = _shutil.which("git") or _shutil.which("git.exe")
    if found:
        try:
            git.refresh(found)
            os.environ["GIT_PYTHON_GIT_EXECUTABLE"] = found
            return found
        except Exception:
            pass

    # Priority 4: Default refresh (works on Linux/Mac)
    try:
        git.refresh()
        return "system"
    except Exception:
        pass

    return None


_GIT_PATH = _setup_git()
if _GIT_PATH:
    logging.getLogger(__name__).info(f"Git executable configured: {_GIT_PATH}")
else:
    logging.getLogger(__name__).warning(
        "Git executable NOT found. Repository cloning will fail. "
        "Install Git and set GIT_PYTHON_GIT_EXECUTABLE in Backend/.env"
    )

# File extensions to parse
SUPPORTED_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx",
    ".java", ".go", ".rs", ".cpp", ".c",
    ".cs", ".php", ".rb", ".swift", ".kt",
    ".md", ".txt", ".yaml", ".yml", ".json",
    ".html", ".css", ".sh", ".sql",
}

# Files/dirs to skip
SKIP_DIRS = {
    ".git", "node_modules", "__pycache__", ".venv",
    "venv", "env", "dist", "build", ".next",
    ".nuxt", "vendor", "target",
}

MAX_FILE_SIZE_BYTES = 200_000  # 200 KB per file
CHUNK_SIZE = 1000  # characters per chunk
CHUNK_OVERLAP = 200  # overlap between chunks


class RAGPipeline:
    def __init__(self):
        self.repo_base = settings.REPO_BASE_PATH
        self._lock = threading.Lock()

    def clone_repository(self, repo_url: str, repo_id: str) -> str:
        """
        Clone a Git repository. Returns the local path.
        Skips clone if already exists and non-empty.
        Uses GitPython first; falls back to subprocess if GitPython
        can't locate git on this system (common on Windows).
        """
        repo_path = os.path.join(self.repo_base, repo_id)

        if os.path.exists(repo_path) and os.listdir(repo_path):
            logger.info(f"Repo already exists at {repo_path}, skipping clone.")
            return repo_path

        os.makedirs(repo_path, exist_ok=True)
        logger.info(f"Cloning {repo_url} → {repo_path}")

        # METHOD 1: GitPython
        try:
            git.Repo.clone_from(repo_url, repo_path, depth=1)
            logger.info("Clone successful via GitPython")
            return repo_path
        except Exception as git_err:
            logger.warning(f"GitPython clone failed: {git_err}. Trying subprocess fallback...")

        # METHOD 2: subprocess fallback — works even if GitPython
        # can't locate git.exe but git IS in PATH or GIT_PYTHON_GIT_EXECUTABLE is set
        import subprocess
        git_cmd = os.environ.get("GIT_PYTHON_GIT_EXECUTABLE") or "git"
        try:
            result = subprocess.run(
                [git_cmd, "clone", "--depth=1", repo_url, repo_path],
                capture_output=True,
                text=True,
                timeout=120,
            )
            if result.returncode == 0:
                logger.info("Clone successful via subprocess fallback")
                return repo_path
            error_msg = (result.stderr or result.stdout or "Unknown git error").strip()
            raise Exception(error_msg)

        except subprocess.TimeoutExpired:
            shutil.rmtree(repo_path, ignore_errors=True)
            raise Exception(
                "Repository clone timed out after 120 seconds. "
                "The repository may be too large."
            )
        except FileNotFoundError:
            shutil.rmtree(repo_path, ignore_errors=True)
            raise Exception(
                "Git is not installed or not in PATH on this server. "
                "Please install Git from https://git-scm.com/download/win "
                "and set GIT_PYTHON_GIT_EXECUTABLE=C:\\Program Files\\Git\\bin\\git.exe "
                "in Backend/.env, then restart the server."
            )
        except Exception as e:
            shutil.rmtree(repo_path, ignore_errors=True)
            raise Exception(f"Failed to clone repository: {str(e)}")

    def parse_files(self, repo_path: str) -> List[Dict[str, Any]]:
        """
        Walk the repository and extract all parseable source files.
        Returns list of file dicts: {path, content, language, size}.
        """
        files = []
        for root, dirs, filenames in os.walk(repo_path):
            # Skip unwanted directories in-place without slice assignment for type checker
            unwanted = [d for d in dirs if d in SKIP_DIRS or d.startswith(".")]
            for d in unwanted:
                dirs.remove(d)

            for filename in filenames:
                ext = Path(filename).suffix.lower()
                if ext not in SUPPORTED_EXTENSIONS:
                    continue

                filepath = os.path.join(root, filename)
                try:
                    size = os.path.getsize(filepath)
                    if size > MAX_FILE_SIZE_BYTES:
                        continue
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    if content.strip():
                        rel_path = os.path.relpath(filepath, repo_path)
                        files.append({
                            "path": rel_path.replace("\\", "/"),
                            "content": content,
                            "language": ext.lstrip("."),
                            "size": size,
                        })
                except (OSError, IOError) as e:
                    logger.warning(f"Could not read {filepath}: {e}")

        logger.info(f"Parsed {len(files)} files from repo.")
        return files

    def chunk_files(self, files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Split file contents into overlapping chunks.
        Returns list of chunk dicts: {text, path, language, chunk_index}.
        """
        chunks = []
        for file_info in files:
            content = file_info["content"]
            path = file_info["path"]
            lang = file_info["language"]

            # Split by lines first, then group into chunks
            lines = content.split("\n")
            current_chunk: List[str] = []
            current_len = 0
            chunk_idx = 0

            for line in lines:
                current_chunk.append(line)
                current_len += len(line) + 1

                if current_len >= CHUNK_SIZE:
                    chunk_text = "\n".join(current_chunk)
                    # Add file context header
                    header = f"# File: {path}\n\n"
                    module_name = path.replace("/", ".").replace("\\", ".")
                    chunks.append({
                        "chunk_id": f"{path}_{chunk_idx}",
                        "file_path": path,
                        "module_name": module_name,
                        "code_chunk": chunk_text,
                        "language": lang,
                        "text": header + chunk_text, # text is needed by build_store
                    })
                    # Overlap: keep last N characters worth of lines
                    overlap_lines = []
                    overlap_len = 0
                    for l in reversed(current_chunk):
                        overlap_lines.insert(0, l)
                        overlap_len += len(l) + 1
                        if overlap_len >= CHUNK_OVERLAP:
                            break
                    current_chunk = overlap_lines
                    current_len = overlap_len
                    chunk_idx += 1

            # Final chunk
            if current_chunk:
                chunk_text = "\n".join(current_chunk)
                header = f"# File: {path}\n\n"
                module_name = path.replace("/", ".").replace("\\", ".")
                chunks.append({
                    "chunk_id": f"{path}_{chunk_idx}",
                    "file_path": path,
                    "module_name": module_name,
                    "code_chunk": chunk_text,
                    "language": lang,
                    "text": header + chunk_text, # text is needed by build_store
                })

        logger.info(f"Generated {len(chunks)} chunks from {len(files)} files.")
        return chunks

    def process_repository(
        self, repo_url: str, repo_id: str
    ) -> Dict[str, Any]:
        """
        Full pipeline: clone → parse → chunk → embed → store.
        Returns summary dict.
        """
        from services.vector_store import vector_store_manager

        try:
            # 1. Clone
            repo_path = self.clone_repository(repo_url, repo_id)

            # 2. Parse
            files = self.parse_files(repo_path)
            if not files:
                return {
                    "status": "empty",
                    "files_parsed": 0,
                    "chunks_indexed": 0,
                }

            # 3. Chunk
            chunks = self.chunk_files(files)

            # 4. Embed + 5. Store in FAISS
            with self._lock:
                vector_store_manager.build_store(repo_id, chunks)

            return {
                "status": "success",
                "files_parsed": len(files),
                "chunks_indexed": len(chunks),
                "languages": list({f["language"] for f in files}),
            }

        except Exception as e:
            logger.error(f"RAG pipeline failed for repo {repo_id}: {e}", exc_info=True)
            err_msg = getattr(e, "detail", str(e))
            return {"status": "error", "error": err_msg}

    def get_relevant_context(
        self,
        repo_id: str,
        query: str,
        top_k: int = 5,
    ) -> str:
        """
        Retrieve and format relevant chunks for a query.
        """
        from services.vector_store import vector_store_manager

        results = vector_store_manager.search_store(repo_id, query, top_k=top_k)
        if not results:
            return "No relevant code context found."

        context_parts = []
        for i, chunk in enumerate(results, 1):
            file_path = chunk.get("file_path", chunk.get("path", "unknown"))
            module_name = chunk.get("module_name", "unknown")
            language = chunk.get("language", "unknown")
            code_chunk = chunk.get("code_chunk", chunk.get("text", ""))
            score = chunk.get("score", 0)

            context_parts.append(
                f"--- Result {i} ---\n"
                f"File: {file_path}\n"
                f"Module: {module_name}\n"
                f"Language: {language}\n"
                f"Score: {score:.3f}\n"
                f"Code:\n{code_chunk}\n"
            )
        return "\n\n".join(context_parts)

    def cleanup_repo(self, repo_id: str):
        """Remove cloned repository files to free disk space."""
        repo_path = os.path.join(self.repo_base, repo_id)
        if os.path.exists(repo_path):
            shutil.rmtree(repo_path, ignore_errors=True)
            logger.info(f"Cleaned up repo: {repo_path}")


    def process_zip_file(self, zip_path: str, repo_id: str) -> Dict[str, Any]:
        """
        Extract a ZIP archive and run the RAG pipeline on its contents.
        Used by POST /api/repos/upload-zip.
        """
        extract_path = os.path.join(self.repo_base, repo_id)
        os.makedirs(extract_path, exist_ok=True)

        try:
            with zipfile.ZipFile(zip_path, "r") as zf:
                zf.extractall(extract_path)
        except zipfile.BadZipFile:
            raise Exception("Invalid ZIP file. Please upload a valid .zip archive.")

        from services.vector_store import vector_store_manager

        files = self.parse_files(extract_path)
        if not files:
            return {"status": "empty", "files_parsed": 0, "chunks_indexed": 0}

        chunks = self.chunk_files(files)
        with self._lock:
            vector_store_manager.build_store(repo_id, chunks)

        return {
            "status": "success",
            "files_parsed": len(files),
            "chunks_indexed": len(chunks),
            "languages": list({f["language"] for f in files}),
        }


rag_pipeline = RAGPipeline()
