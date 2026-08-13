import os
import yaml
from pathlib import Path
from typing import Dict, Any, Optional

BASE_DIR = Path(__file__).resolve().parent.parent

DEFAULT_CONFIG: Dict[str, Any] = {
    "chunking": {
        "strategy": "semantic",  # "fixed", "semantic", "metadata_aware", "parent_child"
        "chunk_size": 512,
        "overlap": 64,
        "parent_size": 1200,
        "child_size": 300,
    },
    "embedding": {
        "model_name": "BAAI/bge-small-en-v1.5",
        "dimension": 384,
    },
    "retrieval": {
        "dense_weight": 0.6,
        "sparse_weight": 0.4,
        "top_k": 20,
        "rerank_k": 10,
        "final_k": 4,
    },
    "guardrails": {
        "minimum_similarity": 0.005,
        "minimum_context_score": 0.005,
        "max_query_length": 500,
        "enable_injection_detection": True,
        "enable_grounding_validation": True,
    },
    "llm": {
        "provider": os.getenv("LLM_PROVIDER", "groq"),
        "model": os.getenv("LLM_MODEL", "llama-3.1-8b-instant"),
        "temperature": 0.1,
        "max_tokens": 512,
    },
    "stt": {
        "provider": "sarvam",
        "endpoint": os.getenv("SARVAM_STT_ENDPOINT", "https://api.sarvam.ai/speech-to-text"),
        "model": "saarika:v1",
        "language_code": "hi-IN",
    }
}

class RAGConfig:
    def __init__(self, config_path: Optional[str] = None):
        self.config = DEFAULT_CONFIG.copy()
        if config_path and Path(config_path).exists():
            with open(config_path, "r", encoding="utf-8") as f:
                user_config = yaml.safe_load(f)
                if user_config:
                    self._deep_update(self.config, user_config)
                    
    def _deep_update(self, base: Dict[str, Any], update: Dict[str, Any]):
        for key, value in update.items():
            if isinstance(value, dict) and key in base and isinstance(base[key], dict):
                self._deep_update(base[key], value)
            else:
                base[key] = value

    def get(self, section: str, key: Optional[str] = None, default: Any = None) -> Any:
        if key is None:
            return self.config.get(section, default)
        return self.config.get(section, {}).get(key, default)

config = RAGConfig()
