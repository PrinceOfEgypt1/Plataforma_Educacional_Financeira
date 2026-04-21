"""Middleware de correlação ``X-Request-ID``.

Extrai o cabeçalho ``X-Request-ID`` do request (ou gera UUID4 quando ausente),
grava em ``request.state.request_id``, publica no context-var do structlog
durante o ciclo da requisição e reflete no cabeçalho da resposta.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from uuid import uuid4

import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

REQUEST_ID_HEADER = "X-Request-ID"


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Extrai/gera ``X-Request-ID`` e propaga ponta-a-ponta."""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        incoming = request.headers.get(REQUEST_ID_HEADER)
        request_id = incoming if incoming else str(uuid4())
        request.state.request_id = request_id

        structlog.contextvars.bind_contextvars(request_id=request_id)
        try:
            response = await call_next(request)
        finally:
            structlog.contextvars.unbind_contextvars("request_id")

        response.headers[REQUEST_ID_HEADER] = request_id
        return response


def get_request_id(request: Request) -> str:
    """Lê ``request_id`` do state; gera UUID4 como fallback seguro."""
    rid: str | None = getattr(request.state, "request_id", None)
    return rid if rid else str(uuid4())
