import re
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CLEAN_DATA_PATH = DATA_DIR / "msmarco_cleaned.json"
CHUNKS_DATA_PATH = DATA_DIR / "msmarco_chunks.json"

class DocumentChunker:
    """
    Implements 4 advanced chunking strategies:
    Strategy A: Fixed/Recursive Chunking
    Strategy B: Sentence/Semantic Boundary Chunking
    Strategy C: Metadata-Aware Chunking
    Strategy D: Parent/Child Hierarchical Chunking
    """

    @staticmethod
    def fixed_recursive_chunk(
        text: str, chunk_size: int = 400, overlap: int = 50
    ) -> List[str]:
        if not text:
            return []
        chunks = []
        start = 0
        text_len = len(text)
        while start < text_len:
            end = start + chunk_size
            chunk = text[start:end]
            if chunk:
                chunks.append(chunk)
            start += chunk_size - overlap
            if start >= text_len or chunk_size <= overlap:
                break
        return chunks

    @staticmethod
    def sentence_semantic_chunk(
        text: str, max_chunk_chars: int = 500, min_chunk_chars: int = 100
    ) -> List[str]:
        if not text:
            return []
        # Split text by sentence boundaries (. ! ?)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        current_chunk = []
        current_len = 0

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            if current_len + len(sentence) <= max_chunk_chars:
                current_chunk.append(sentence)
                current_len += len(sentence) + 1
            else:
                if current_chunk:
                    chunks.append(" ".join(current_chunk))
                current_chunk = [sentence]
                current_len = len(sentence)

        if current_chunk:
            chunks.append(" ".join(current_chunk))

        return chunks if chunks else [text]

    @staticmethod
    def metadata_aware_chunk(
        doc: Dict[str, Any],
        strategy_name: str = "metadata_aware",
        chunk_size: int = 400,
        overlap: int = 50
    ) -> List[Dict[str, Any]]:
        text = doc.get("text", "")
        raw_chunks = DocumentChunker.fixed_recursive_chunk(text, chunk_size, overlap)
        chunk_objects = []

        for idx, chunk_text in enumerate(raw_chunks):
            chunk_obj = {
                "chunk_id": f"{doc['document_id']}_c{idx:03d}",
                "document_id": doc.get("document_id", ""),
                "title": doc.get("title", ""),
                "source": doc.get("source", "MSMARCO-XI"),
                "language": doc.get("language", "en"),
                "section": doc.get("section", "General"),
                "chunk_index": idx,
                "total_chunks": len(raw_chunks),
                "chunk_strategy": strategy_name,
                "text": chunk_text,
                "parent_text": text,
            }
            chunk_objects.append(chunk_obj)
        return chunk_objects

    @staticmethod
    def parent_child_chunk(
        doc: Dict[str, Any],
        parent_size: int = 1000,
        child_size: int = 250,
        child_overlap: int = 40
    ) -> List[Dict[str, Any]]:
        text = doc.get("text", "")
        parents = DocumentChunker.fixed_recursive_chunk(text, parent_size, overlap=100)
        all_child_objects = []

        for p_idx, parent_text in enumerate(parents):
            parent_id = f"{doc['document_id']}_p{p_idx:02d}"
            children = DocumentChunker.fixed_recursive_chunk(parent_text, child_size, child_overlap)

            for c_idx, child_text in enumerate(children):
                child_obj = {
                    "chunk_id": f"{parent_id}_c{c_idx:03d}",
                    "parent_id": parent_id,
                    "document_id": doc.get("document_id", ""),
                    "title": doc.get("title", ""),
                    "source": doc.get("source", "MSMARCO-XI"),
                    "language": doc.get("language", "en"),
                    "section": doc.get("section", "General"),
                    "chunk_strategy": "parent_child",
                    "text": child_text,  # Child text for vector similarity search
                    "parent_text": parent_text  # Larger parent text for generator context
                }
                all_child_objects.append(child_obj)
        return all_child_objects

def chunk_dataset(
    strategy: str = "semantic",
    input_path: Path = CLEAN_DATA_PATH,
    output_path: Path = CHUNKS_DATA_PATH
) -> List[Dict[str, Any]]:
    if not input_path.exists():
        from task2.rag.ingestion.clean_dataset import clean_dataset
        docs = clean_dataset()
    else:
        with open(input_path, "r", encoding="utf-8") as f:
            docs = json.load(f)

    all_chunks = []
    for doc in docs:
        if strategy == "fixed":
            texts = DocumentChunker.fixed_recursive_chunk(doc["text"], chunk_size=400, overlap=50)
            for idx, txt in enumerate(texts):
                all_chunks.append({
                    "chunk_id": f"{doc['document_id']}_f{idx:03d}",
                    "document_id": doc["document_id"],
                    "title": doc["title"],
                    "source": doc["source"],
                    "language": doc["language"],
                    "section": doc["section"],
                    "chunk_strategy": "fixed",
                    "text": txt,
                    "parent_text": doc["text"]
                })

        elif strategy == "semantic":
            texts = DocumentChunker.sentence_semantic_chunk(doc["text"], max_chunk_chars=450)
            for idx, txt in enumerate(texts):
                all_chunks.append({
                    "chunk_id": f"{doc['document_id']}_s{idx:03d}",
                    "document_id": doc["document_id"],
                    "title": doc["title"],
                    "source": doc["source"],
                    "language": doc["language"],
                    "section": doc["section"],
                    "chunk_strategy": "semantic",
                    "text": txt,
                    "parent_text": doc["text"]
                })

        elif strategy == "metadata_aware":
            chunks = DocumentChunker.metadata_aware_chunk(doc, strategy_name="metadata_aware")
            all_chunks.extend(chunks)

        elif strategy == "parent_child":
            chunks = DocumentChunker.parent_child_chunk(doc)
            all_chunks.extend(chunks)

        else:
            # Default to semantic chunking
            chunks = DocumentChunker.metadata_aware_chunk(doc, strategy_name="semantic")
            all_chunks.extend(chunks)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)

    print(f"[Ingestion] Generated {len(all_chunks)} chunks using strategy '{strategy}' -> {output_path}.")
    return all_chunks

if __name__ == "__main__":
    chunk_dataset()
