"""
Task 2 Target Configuration
"""
import os
from pathlib import Path
from dotenv import load_dotenv

CURRENT_DIR = Path(__file__).resolve().parent
TASK2_DIR = CURRENT_DIR.parent
BACKEND_DIR = TASK2_DIR / "backend"

for env_file in [BACKEND_DIR / ".env", TASK2_DIR / ".env"]:
    if env_file.exists():
        load_dotenv(env_file, override=False)

GENERATION_BACKEND = "api"
LATENCY_BUDGET_MS = 200
GENERATION_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
LOCAL_GENERATION_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
