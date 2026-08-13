import sys
from pathlib import Path

# Set root directory in sys.path
SCRIPTS_DIR = Path(__file__).resolve().parent
TASK2_DIR = SCRIPTS_DIR.parent
ROOT_DIR = TASK2_DIR.parent
sys.path.insert(0, str(ROOT_DIR))

from task2.rag.ingestion.download_dataset import load_or_download_dataset
from task2.rag.ingestion.clean_dataset import clean_dataset
from task2.rag.ingestion.chunk_dataset import chunk_dataset
from task2.rag.ingestion.embed_dataset import embed_dataset
from task2.rag.ingestion.build_index import build_index

def run_full_pipeline():
    print("=========================================================")
    print("   STARTING TASK 2 DATASET INGESTION & INDEX PIPELINE  ")
    print("=========================================================")
    
    print("\n[Step 1/5] Downloading / Loading MSMARCO-XI dataset...")
    load_or_download_dataset()

    print("\n[Step 2/5] Cleaning text & extracting metadata...")
    clean_dataset()

    print("\n[Step 3/5] Generating multi-strategy chunks (Fixed, Semantic, Metadata, Parent-Child)...")
    chunk_dataset(strategy="semantic")

    print("\n[Step 4/5] Precomputing dense vector embeddings...")
    embed_dataset()

    print("\n[Step 5/5] Building FAISS / NumPy vector index & BM25 sparse index...")
    build_index()

    print("\n=========================================================")
    print("   INGESTION & INDEXING COMPLETED SUCCESSFULLY!         ")
    print("=========================================================")

if __name__ == "__main__":
    run_full_pipeline()
