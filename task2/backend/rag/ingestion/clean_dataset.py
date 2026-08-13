import re
import json
from pathlib import Path
from typing import List, Dict, Any

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
RAW_DATA_PATH = DATA_DIR / "msmarco_raw.json"
CLEAN_DATA_PATH = DATA_DIR / "msmarco_cleaned.json"

def clean_text(text: str) -> str:
    if not text:
        return ""
    # Normalize unicode whitespace and control characters
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    # Strip HTML tags if present
    text = re.sub(r'<[^>]+>', '', text)
    return text

def clean_dataset(input_path: Path = RAW_DATA_PATH, output_path: Path = CLEAN_DATA_PATH) -> List[Dict[str, Any]]:
    if not input_path.exists():
        from task2.rag.ingestion.download_dataset import load_or_download_dataset
        raw_docs = load_or_download_dataset()
    else:
        with open(input_path, "r", encoding="utf-8") as f:
            raw_docs = json.load(f)

    cleaned_docs = []
    for doc in raw_docs:
        cleaned_text = clean_text(doc.get("text", ""))
        if len(cleaned_text) >= 15:
            cleaned_doc = {
                "document_id": doc.get("document_id", f"doc_{len(cleaned_docs)}"),
                "title": clean_text(doc.get("title", "Untitled")),
                "source": doc.get("source", "MSMARCO-XI"),
                "language": doc.get("language", "en"),
                "section": doc.get("section", "General"),
                "text": cleaned_text
            }
            cleaned_docs.append(cleaned_doc)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(cleaned_docs, f, indent=2, ensure_ascii=False)

    print(f"[Ingestion] Cleaned {len(cleaned_docs)} dataset documents -> {output_path}.")
    return cleaned_docs

if __name__ == "__main__":
    clean_dataset()
