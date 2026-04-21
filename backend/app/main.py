"""Ponto de entrada da API — Plataforma Educacional Financeira."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import make_asgi_app

from app.api.v1 import v1_router
from app.api.v1.contract import contract_debug_router
from app.core.config import settings
from app.core.errors import PROBLEM_MEDIA_TYPE, DomainError, Problem
from app.core.logging import configure_logging
from app.core.request_id import RequestIdMiddleware, get_request_id

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

# ── Middlewares ────────────────────────────────────────────────────────────
app.add_middleware(RequestIdMiddleware)
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
    from sqlalchemy import text

    from app.db.session import AsyncSessionLocal

    async with AsyncSessionLocal() as db:
        await db.execute(text("SELECT 1"))
    return {"status": "ready"}


# ── Handlers globais de erro (Doc 06 §4.2 + ADR-0007) ──────────────────────
def _problem_response(problem: Problem) -> JSONResponse:
    return JSONResponse(
        status_code=problem.status,
        content=problem.model_dump(exclude_none=True),
        media_type=PROBLEM_MEDIA_TYPE,
    )


@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
    request_id = get_request_id(request)
    logger.warning(
        "domain_error",
        code=exc.code,
        status=exc.status_code,
        path=str(request.url.path),
        request_id=request_id,
    )
    problem = Problem(
        title=exc.title,
        status=exc.status_code,
        detail=exc.detail,
        instance=str(request.url.path),
        code=exc.code,
        request_id=request_id,
        errors=exc.errors,
    )
    return _problem_response(problem)


@app.exception_handler(RequestValidationError)
async def request_validation_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    request_id = get_request_id(request)
    errors = [
        {
            "loc": list(err.get("loc", [])),
            "msg": err.get("msg", ""),
            "type": err.get("type", ""),
        }
        for err in exc.errors()
    ]
    problem = Problem(
        title="Unprocessable Entity",
        status=422,
        detail="Corpo da requisição não passou na validação.",
        instance=str(request.url.path),
        code="VALIDATION_ERROR",
        request_id=request_id,
        errors=errors,
    )
    return _problem_response(problem)


_HTTP_STATUS_TO_CODE: dict[int, tuple[str, str]] = {
    401: ("UNAUTHENTICATED", "Unauthenticated"),
    403: ("UNAUTHORIZED", "Unauthorized"),
    404: ("NOT_FOUND", "Not Found"),
    405: ("METHOD_NOT_ALLOWED", "Method Not Allowed"),
    429: ("RATE_LIMITED", "Too Many Requests"),
}


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    request_id = get_request_id(request)
    code, title = _HTTP_STATUS_TO_CODE.get(exc.status_code, ("HTTP_ERROR", "HTTP Error"))
    problem = Problem(
        title=title,
        status=exc.status_code,
        detail=str(exc.detail) if exc.detail is not None else title,
        instance=str(request.url.path),
        code=code,
        request_id=request_id,
    )
    return _problem_response(problem)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = get_request_id(request)
    logger.error(
        "unhandled_exception",
        path=str(request.url.path),
        error=exc.__class__.__name__,
        request_id=request_id,
    )
    problem = Problem(
        title="Internal Server Error",
        status=500,
        detail="An unexpected error occurred.",
        instance=str(request.url.path),
        code="INTERNAL_ERROR",
        request_id=request_id,
    )
    return _problem_response(problem)


# ── Routers da API v1 ──────────────────────────────────────────────────────
app.include_router(v1_router, prefix="/api/v1")

if settings.APP_ENV != "prod":
    app.include_router(
        contract_debug_router,
        prefix="/api/v1",
        include_in_schema=False,
    )
