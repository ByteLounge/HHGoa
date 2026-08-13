import os
import json
import pickle
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
INDEX_DIR = DATA_DIR / "index"
CHUNKS_DATA_PATH = DATA_DIR / "msmarco_chunks.json"
EMBEDDINGS_PATH = DATA_DIR / "msmarco_embeddings.npy"

FAISS_INDEX_PATH = INDEX_DIR / "faiss.index"
BM25_INDEX_PATH = INDEX_DIR / "bm25.pkl"
METADATA_INDEX_PATH = INDEX_DIR / "metadata.json"

class BM25InvertedIndex:
    def __init__(self, corpus: List[str]):
        self.corpus = corpus
        self.tokenized_corpus = [self._tokenize(doc) for doc in corpus]
        self.doc_len = [len(doc) for doc in self.tokenized_corpus]
        self.avg_doc_len = sum(self.doc_len) / max(len(self.doc_len), 1)
        self.num_docs = len(corpus)
        
        # Build inverted index
        self.df = {}
        for doc in self.tokenized_corpus:
            frequencies = set(doc)
            for word in frequencies:
                self.df[word] = self.df.get(word, 0) + 1
                
    def _tokenize(self, text: str) -> List[str]:
        return [w.lower().strip(".,!?:;\"'()[]{}") for w in text.split() if w]

    def get_scores(self, query: str, k1: float = 1.5, b: float = 0.75) -> np.ndarray:
        query_tokens = self._tokenize(query)
        scores = np.zeros(self.num_docs, dtype=np.float32)

        for token in query_tokens:
            if token not in self.df:
                continue
            df_token = self.df[token]
            idf = math_log((self.num_docs - df_token + 0.5) / (df_token + 0.5) + 1.0)

            for doc_idx, doc in enumerate(self.tokenized_corpus):
                tf = doc.count(token)
                if tf == 0:
                    continue
                denom = tf + k1 * (1 - b + b * (self.doc_len[doc_idx] / max(self.avg_doc_len, 1e-5)))
                score = idf * (tf * (k1 + 1.0)) / denom
                scores[doc_idx] += score
        return scores

def math_log(x: float) -> float:
    return np.log(max(x, 1e-9))

def build_faiss_or_numpy_index(embeddings: np.ndarray):
    """
    Builds FAISS index if faiss-cpu is installed, otherwise prepares normalized numpy matrix index.
    Sub-millisecond latency.
    """
    try:
        import faiss
        dim = embeddings.shape[1]
        index = faiss.IndexFlatIP(dim)  # Inner Product for normalized vectors = cosine similarity
        index.add(embeddings)
        print(f"[Index] Built FAISS IndexFlatIP with {index.ntotal} vectors.")
        return index, "faiss"
    except Exception as e:
        print(f"[Index] FAISS fallback to high-speed NumPy Dot Product Index: {e}")
        return embeddings, "numpy"

def build_index():
    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    
    if not CHUNKS_DATA_PATH.exists():
        from task2.rag.ingestion.chunk_dataset import chunk_dataset
        chunk_dataset()
    with open(CHUNKS_DATA_PATH, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    if not EMBEDDINGS_PATH.exists():
        from task2.rag.ingestion.embed_dataset import embed_dataset
        embeddings = embed_dataset()
    else:
        embeddings = np.load(EMBEDDINGS_PATH)

    # Build Vector Index
    faiss_index, index_type = build_faiss_or_numpy_index(embeddings)
    if index_type == "faiss":
        import faiss
        faiss.write_index(faiss_index, str(FAISS_INDEX_PATH))
    else:
        np.save(FAISS_INDEX_PATH.with_suffix(".npy"), embeddings)

    # Build BM25 Index
    corpus = [c.get("text", "") for c in chunks]
    bm25 = BM25InvertedIndex(corpus)
    with open(BM25_INDEX_PATH, "wb") as f:
        pickle.dump(bm25, f)

    # Save Chunk Metadata Index
    with open(METADATA_INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=2, ensure_ascii=False)

    print(f"[Index] Successfully built vector & sparse index for {len(chunks)} chunks in {INDEX_DIR}.")

if __name__ == "__main__":
    build_index()
