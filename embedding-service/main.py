import asyncio
import logging
import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from model import embed, get_model

logger = logging.getLogger("embedding-service")

app = FastAPI(title="Embedding Service", version="1.0.0")

_EMBED_TIMEOUT = 30
_start_time: float = 0.0


class EmbedRequest(BaseModel):
    text: str = Field(..., min_length=1)


class EmbedResponse(BaseModel):
    embedding: list[float]


@app.on_event("startup")
async def startup():
    global _start_time
    _start_time = time.time()
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, get_model)
    _, fallback = get_model()
    if fallback:
        logger.warning("sentence-transformers unavailable — using deterministic hash fallback")


@app.exception_handler(Exception)
async def global_handler(request: Request, exc: Exception):
    logger.exception("unhandled exception")
    return JSONResponse(status_code=500, content={"detail": "internal server error"})


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "uptime_seconds": time.time() - _start_time,
    }


@app.post("/embed", response_model=EmbedResponse)
async def embed_endpoint(req: EmbedRequest):
    loop = asyncio.get_event_loop()
    try:
        result = await asyncio.wait_for(
            loop.run_in_executor(None, embed, req.text),
            timeout=_EMBED_TIMEOUT,
        )
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="embedding timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return EmbedResponse(embedding=result)
