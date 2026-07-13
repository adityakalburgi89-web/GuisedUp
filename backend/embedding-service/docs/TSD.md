# Technical Service Decision — Embedding Fallback

## Status

Accepted.

## Context

The embedding service uses `sentence-transformers` with `all-MiniLM-L6-v2` to produce 384-dimensional text embeddings. This library depends on PyTorch, which can be difficult or impossible to install in constrained environments (Alpine Linux, resource-limited containers, ARM without prebuilt wheels, etc.).

## Decision

If `sentence-transformers` fails to import or load, the service silently falls back to deterministic hash embeddings implemented in pure Python + numpy.

### How the fallback works

1. Hash the input text with SHA-256.
2. Use the first 16 hex chars of the digest as a seed for numpy's PCG64 random generator.
3. Draw 384 i.i.d. samples from a standard normal distribution.
4. L2-normalize the resulting vector.

This produces a **deterministic** embedding (same text → same vector every run) without any ML dependencies. The 384-dim output shape is preserved so downstream consumers never need to know which backend produced the vector.

### Trade-offs

| Aspect | sentence-transformers | Hash fallback |
|---|---|---|
| Semantic quality | High (trained on sentence pairs) | None (random projection) |
| Dependency weight | ~1 GB (PyTorch + CUDA libs) | Zero beyond numpy |
| Startup time | 5–30 s (model download + load) | Instant |
| Determinism | Model weights are fixed, output is deterministic | Deterministic per seed |

## Consequences

- The service runs anywhere Python 3.10 + numpy is available, even without PyTorch.
- Consumers should not rely on semantic quality when the fallback is active — they can detect the fallback by the absence of `sentence-transformers` in the installed packages.
- The fallback vector is a seeded random unit vector; different texts produce orthogonal vectors on average, so the fallback satisfies the API contract but carries no semantic signal.
