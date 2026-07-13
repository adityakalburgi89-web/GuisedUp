import hashlib

import numpy as np

_EMBEDDING_DIM = 384
_MODEL = None
_USE_FALLBACK = False


def _deterministic_hash_embedding(text: str) -> list[float]:
    seed = int(hashlib.sha256(text.encode("utf-8")).hexdigest()[:16], 16)
    rng = np.random.default_rng(seed)
    vec = rng.normal(0, 1, _EMBEDDING_DIM).astype(np.float32)
    vec /= np.linalg.norm(vec)
    return vec.tolist()


def get_model():
    global _MODEL, _USE_FALLBACK
    if _MODEL is not None:
        return _MODEL, _USE_FALLBACK
    try:
        from sentence_transformers import SentenceTransformer
        _MODEL = SentenceTransformer("all-MiniLM-L6-v2")
        _USE_FALLBACK = False
    except Exception:
        _MODEL = None
        _USE_FALLBACK = True
    return _MODEL, _USE_FALLBACK


def embed(text: str) -> list[float]:
    model, fallback = get_model()
    if fallback:
        return _deterministic_hash_embedding(text)
    return model.encode(text).tolist()
