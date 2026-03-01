"""
Virtual Environment Setup Script
Creates D:\ai_env if it doesn't exist and installs all dependencies.
Run this script once before starting the backend.
"""
import os
import sys
import subprocess
import shutil

VENV_PATH = r"D:\ai_env"
REQUIREMENTS_FILE = os.path.join(os.path.dirname(__file__), "requirements.txt")


def run(cmd, check=True, **kwargs):
    print(f"  → {' '.join(cmd)}")
    result = subprocess.run(cmd, check=check, **kwargs)
    return result


def main():
    print("=" * 60)
    print("  Bharat AI Operational Hub — Environment Setup")
    print("=" * 60)

    # Create venv if not exists
    if os.path.exists(VENV_PATH):
        print(f"\n✅ Virtual environment already exists at: {VENV_PATH}")
    else:
        print(f"\n📦 Creating virtual environment at: {VENV_PATH}")
        run([sys.executable, "-m", "venv", VENV_PATH])
        print(f"✅ Virtual environment created.")

    # Paths to pip inside venv
    if sys.platform == "win32":
        pip_path = os.path.join(VENV_PATH, "Scripts", "pip.exe")
        python_path = os.path.join(VENV_PATH, "Scripts", "python.exe")
    else:
        pip_path = os.path.join(VENV_PATH, "bin", "pip")
        python_path = os.path.join(VENV_PATH, "bin", "python")

    # Upgrade pip
    print("\n🔧 Upgrading pip...")
    run([python_path, "-m", "pip", "install", "--upgrade", "pip", "--quiet"])

    # Install requirements
    print(f"\n📥 Installing dependencies from: {REQUIREMENTS_FILE}")
    run([pip_path, "install", "-r", REQUIREMENTS_FILE])

    print("\n" + "=" * 60)
    print("  ✅ Setup complete!")
    print(f"\n  Activate the environment:")
    if sys.platform == "win32":
        print(f"    {VENV_PATH}\\Scripts\\activate")
        print(f"\n  Start the backend:")
        print(f"    {VENV_PATH}\\Scripts\\uvicorn.exe main:app --host 0.0.0.0 --port 8000 --reload")
    else:
        print(f"    source {VENV_PATH}/bin/activate")
        print(f"\n  Start the backend:")
        print(f"    uvicorn main:app --host 0.0.0.0 --port 8000 --reload")
    print("=" * 60)


if __name__ == "__main__":
    main()
