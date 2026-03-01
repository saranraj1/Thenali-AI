@echo off
echo ============================================================
echo   Bharat AI Operational Hub - Start Backend
echo ============================================================

set VENV_PATH=D:\ai_env
set BACKEND_PATH=%~dp0

REM Check if venv exists
if not exist "%VENV_PATH%\Scripts\python.exe" (
    echo.
    echo [ERROR] Virtual environment not found at %VENV_PATH%
    echo Run: python setup_env.py
    pause
    exit /b 1
)

REM Check if .env exists
if not exist "%BACKEND_PATH%.env" (
    echo.
    echo [WARNING] .env file not found. Copying from .env.example...
    copy "%BACKEND_PATH%.env.example" "%BACKEND_PATH%.env"
    echo Please edit %BACKEND_PATH%.env with your AWS credentials.
)

echo.
echo Starting FastAPI backend...
echo API Docs: http://localhost:8000/docs
echo.

cd /d "%BACKEND_PATH%"
"%VENV_PATH%\Scripts\uvicorn.exe" main:app --host 0.0.0.0 --port 8000 --reload --log-level info

pause
