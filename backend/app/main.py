"""Ponto de entrada da API — Plataforma Educacional Financeira."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app

from app.core.config import settings
from app.core.logging import configure_logging

configure_logging()
logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("startup", env=settings.APP_ENV, version=settings.APP_VERSION)
    yield
    logger.info("shutdown")


app = FastAPI(
    title="Plataforma Educacional Financeira",
    version=settings.APP_VERSION,
    docs_url="/api/docs" if settings.APP_DEBUG else None,
    redoc_url="/api/redoc" if settings.APP_DEBUG else None,
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Métricas Prometheus ────────────────────────────────────────────────────
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


# ── Health ─────────────────────────────────────────────────────────────────
@app.get("/health", tags=["ops"])
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/live", tags=["ops"])
async def health_live() -> dict[str, str]:
    return {"status": "live"}


@app.get("/health/ready", tags=["ops"])
async def health_ready() -> dict[str, str]:
    return {"status": "ready"}


# ── Handler global de erros ────────────────────────────────────────────────
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error("unhandled_exception", path=str(request.url), error=str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "type": "about:blank",
            "title": "Internal Server Error",
            "status": 500,
            "detail": "An unexpected error occurred.",
        },
        media_type="application/problem+json",
    )
