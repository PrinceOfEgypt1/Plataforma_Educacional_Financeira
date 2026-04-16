# ── Build stage ──────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder
WORKDIR /build
COPY backend/pyproject.toml .
RUN pip install --no-cache-dir uv && uv pip install --system --no-cache .

# ── Runtime stage ─────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime
WORKDIR /app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=builder /usr/local/bin /usr/local/bin
COPY backend/app ./app
USER appuser
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
