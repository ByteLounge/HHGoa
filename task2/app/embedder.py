import sys
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
TASK2_DIR = CURRENT_DIR.parent
REPO_ROOT = TASK2_DIR.parent
BACKEND_DIR = TASK2_DIR / "backend"

for p in [str(REPO_ROOT), str(TASK2_DIR), str(BACKEND_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.app.embedder import embed, embed_one, get_model, embed_query, embed_passage, embed_passages, get_engine
except ImportError:
    try:
        from task2.backend.app.embedder import embed, embed_one, get_model, embed_query, embed_passage, embed_passages, get_engine
    except ImportError:
        from app.embedder import embed, embed_one, get_model, embed_query, embed_passage, embed_passages, get_engine
