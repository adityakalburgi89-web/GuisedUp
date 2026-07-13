# Embedding Service

A lightweight FastAPI microservice that converts text to 384-dimensional embedding vectors.

## Endpoints

### `GET /health`

Returns service health and uptime.

### `POST /embed`

**Request:**

```json
{ "text": "string to embed" }
```

**Response:**

```json
{ "embedding": [0.0123, -0.0456, ..., 0.0789] }
```

Raises **504** if embedding exceeds the 30-second timeout.

## Running

```bash
pip install -r requirements.txt
uvicorn main:app --port 8000
```

Or with Docker:

```bash
docker build -t embedding-service .
docker run -p 8000:8000 embedding-service
```

## Fallback Behaviour

The service uses **sentence-transformers** with the `all-MiniLM-L6-v2` model (384-dim output). The model is loaded once on first request (lazy singleton).

If `sentence-transformers` cannot be installed (e.g., no PyTorch wheel for the platform, memory constraints, or build failures), the service **automatically falls back** to deterministic hash-based embeddings. The fallback produces 384-dimensional unit vectors derived from character trigram hashing. These vectors are **deterministic** (same text always produces the same vector) and **zero-dependency** (pure Python + stdlib + numpy).

See [docs/TSD.md](./docs/TSD.md) for the full technical decision record.
