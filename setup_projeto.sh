#!/usr/bin/env bash
# =============================================================================
# setup_projeto.sh — Plataforma Educacional Financeira
# Executa em: ~/workspace/Plataforma_Educacional_Financeira (já criado + git init)
# Uso: bash setup_projeto.sh
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Cores e helpers
# ---------------------------------------------------------------------------
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
section() { echo -e "\n${GREEN}══════════════════════════════════════════${NC}"; \
            echo -e "${GREEN}  $*${NC}"; \
            echo -e "${GREEN}══════════════════════════════════════════${NC}"; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"
info "Raiz do projeto: $ROOT_DIR"

# ---------------------------------------------------------------------------
# 1. PRÉ-REQUISITOS
# ---------------------------------------------------------------------------
section "1. Verificando pré-requisitos"

check_cmd() {
  if ! command -v "$1" &>/dev/null; then
    warn "$1 não encontrado — $2"
    return 1
  else
    info "$1 OK ($(command -v "$1"))"
    return 0
  fi
}

MISSING=0
check_cmd git    "instale via apt" || MISSING=1
check_cmd python3 "instale python3.11+" || MISSING=1
check_cmd node   "instale via nvm (v20+)" || MISSING=1
check_cmd npm    "vem com Node.js" || MISSING=1
check_cmd docker "instale Docker Engine" || warn "Docker não encontrado — containers não disponíveis (opcional no setup inicial)"

# pnpm
if ! command -v pnpm &>/dev/null; then
  info "Instalando pnpm via npm..."
  npm install -g pnpm
fi
info "pnpm OK"

# uv (gerenciador de deps Python rápido)
if ! command -v uv &>/dev/null; then
  info "Instalando uv..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi
# Garante que uv e uv tool installs estão no PATH
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
info "uv OK"

# pre-commit (instala via uv, que já está disponível)
if ! command -v pre-commit &>/dev/null; then
  info "Instalando pre-commit via uv..."
  uv tool install pre-commit
  export PATH="$HOME/.local/bin:$PATH"
fi
info "pre-commit OK"

if [ "$MISSING" -eq 1 ]; then
  echo -e "${RED}[ERRO]${NC} Instale os pré-requisitos acima e execute novamente."
  exit 1
fi

# ---------------------------------------------------------------------------
# 2. ESTRUTURA DE DIRETÓRIOS
# ---------------------------------------------------------------------------
section "2. Criando estrutura de diretórios"

DOMAINS="diagnostic interest amortization financing loans credit_card late_payment indicators invest_vs_debt education export"

# ── frontend ──
mkdir -p frontend/src/app
mkdir -p frontend/src/components/critical
for d in $DOMAINS; do mkdir -p "frontend/src/components/$d"; done
mkdir -p frontend/src/lib/api
mkdir -p frontend/src/lib/finance
mkdir -p frontend/src/hooks
mkdir -p frontend/src/types
mkdir -p frontend/src/content
mkdir -p frontend/src/styles
mkdir -p frontend/tests
mkdir -p frontend/public

# ── backend ──
mkdir -p backend/app/api
mkdir -p backend/app/schemas
mkdir -p backend/app/services
for d in $DOMAINS; do
  mkdir -p "backend/app/domain/$d"
  mkdir -p "backend/app/services/$d"
  mkdir -p "backend/app/schemas/$d"
  touch "backend/app/domain/$d/__init__.py"
  touch "backend/app/services/$d/__init__.py"
  touch "backend/app/schemas/$d/__init__.py"
done
mkdir -p backend/app/repositories
mkdir -p backend/app/core
mkdir -p backend/app/db/migrations/versions
mkdir -p backend/app/exporters
mkdir -p backend/seeds/{dev,ci,homolog,demo}
mkdir -p backend/tests/unit/domain
mkdir -p backend/tests/unit/schemas
mkdir -p backend/tests/unit/services
mkdir -p backend/tests/integration/api
mkdir -p backend/tests/contract
mkdir -p backend/tests/regression/financial
mkdir -p backend/tests/regression/pedagogical
mkdir -p backend/tests/regression/visual
mkdir -p backend/tests/regression/contract
mkdir -p backend/tests/visual
mkdir -p backend/tests/recovery

# ── docs ──
mkdir -p docs/baseline/auditoria
mkdir -p docs/baseline/governanca
mkdir -p docs/qualidade
mkdir -p docs/20_ADR
mkdir -p docs/24_runbooks
mkdir -p "docs/_meta"

# ── infra / docker / scripts / github ──
mkdir -p docker
mkdir -p scripts/impact
mkdir -p infra
mkdir -p .github/workflows

info "Estrutura de diretórios criada."

# ---------------------------------------------------------------------------
# 3. ARQUIVOS __init__.py DO BACKEND
# ---------------------------------------------------------------------------
section "3. Criando __init__.py do backend"

BACKEND_PKGS="
backend/app
backend/app/api
backend/app/schemas
backend/app/services
backend/app/domain
backend/app/repositories
backend/app/core
backend/app/db
backend/app/exporters
backend/tests
backend/tests/unit
backend/tests/integration
backend/tests/contract
backend/tests/regression
backend/seeds
"
for pkg in $BACKEND_PKGS; do
  touch "$pkg/__init__.py"
done
info "__init__.py criados."

# ---------------------------------------------------------------------------
# 4. pyproject.toml (backend)
# ---------------------------------------------------------------------------
section "4. Criando pyproject.toml (backend)"

cat > backend/pyproject.toml << 'PYPROJECT'
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "plataforma-educacional-financeira-backend"
version = "0.1.0"
description = "Backend da Plataforma Educacional Financeira"
requires-python = ">=3.11"

dependencies = [
  # Web framework
  "fastapi>=0.111.0",
  "uvicorn[standard]>=0.29.0",
  "gunicorn>=22.0.0",
  # Validação
  "pydantic>=2.7.0",
  "pydantic-settings>=2.2.0",
  # ORM / DB
  "sqlalchemy>=2.0.30",
  "alembic>=1.13.0",
  "psycopg[binary,pool]>=3.1.19",
  # Cache (opcional)
  "redis>=5.0.4",
  # Logging / Observabilidade
  "structlog>=24.2.0",
  "prometheus-client>=0.20.0",
  # Exportação
  "reportlab>=4.2.0",
  "openpyxl>=3.1.3",
  # Utilitários
  "python-dotenv>=1.0.1",
  "httpx>=0.27.0",
  "python-multipart>=0.0.9",
]

[project.optional-dependencies]
dev = [
  # Testes
  "pytest>=8.2.0",
  "pytest-asyncio>=0.23.7",
  "pytest-cov>=5.0.0",
  "pytest-xdist>=3.5.0",
  "httpx>=0.27.0",
  "hypothesis>=6.103.0",
  "schemathesis>=3.27.0",
  "mutmut>=2.4.4",
  "testcontainers[postgres]>=4.5.0",
  # Qualidade de código
  "mypy>=1.10.0",
  "ruff>=0.4.7",
  "bandit[toml]>=1.7.8",
  "pip-audit>=2.7.3",
  # Segurança
  "detect-secrets>=1.5.0",
  # Tipos
  "types-redis>=4.6.0.20240425",
]

[tool.ruff]
target-version = "py311"
line-length = 100
select = ["E", "F", "W", "I", "N", "UP", "S", "B", "A", "C4", "PT", "RET", "SIM"]
ignore = ["S101"]

[tool.ruff.isort]
known-first-party = ["app"]

[tool.mypy]
python_version = "3.11"
strict = true
ignore_missing_imports = false

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
addopts = "--strict-markers -ra"
markers = [
  "unit: testes unitários",
  "integration: testes de integração (requer DB)",
  "contract: testes de contrato",
  "regression: testes de regressão",
  "slow: testes lentos",
]

[tool.coverage.run]
source = ["app"]
omit = ["app/db/migrations/*", "tests/*"]

[tool.coverage.report]
fail_under = 75
show_missing = true

[tool.bandit]
exclude_dirs = ["tests"]
skips = ["B101"]
PYPROJECT

info "pyproject.toml criado."

# ---------------------------------------------------------------------------
# 5. package.json (frontend)
# ---------------------------------------------------------------------------
section "5. Criando package.json (frontend)"

cat > frontend/package.json << 'PKGJSON'
{
  "name": "plataforma-educacional-financeira-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint && eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:smoke": "playwright test --grep @smoke",
    "test:a11y": "playwright test --grep @a11y",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "next": "^14.2.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.12.7",
    "axios": "^1.7.2",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.4",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.4",
    "@typescript-eslint/eslint-plugin": "^7.13.0",
    "@typescript-eslint/parser": "^7.13.0",
    "prettier": "^3.3.2",
    "vitest": "^1.6.0",
    "@vitest/coverage-v8": "^1.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@testing-library/jest-dom": "^6.4.6",
    "jsdom": "^24.1.0",
    "@playwright/test": "^1.44.1",
    "axe-playwright": "^2.0.1"
  }
}
PKGJSON

info "package.json criado."

# ---------------------------------------------------------------------------
# 6. tsconfig.json (frontend — TypeScript estrito)
# ---------------------------------------------------------------------------
section "6. Criando tsconfig.json"

cat > frontend/tsconfig.json << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSCONFIG

info "tsconfig.json criado."

# ---------------------------------------------------------------------------
# 7. next.config.ts (frontend)
# ---------------------------------------------------------------------------
section "7. Criando next.config.ts"

cat > frontend/next.config.ts << 'NEXTCFG'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    typedRoutes: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
NEXTCFG

info "next.config.ts criado."

# ---------------------------------------------------------------------------
# 8. tailwind.config.ts + postcss.config.js
# ---------------------------------------------------------------------------
section "8. Criando Tailwind CSS config"

cat > frontend/tailwind.config.ts << 'TWCFG'
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a5f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
TWCFG

cat > frontend/postcss.config.js << 'POSTCSS'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
POSTCSS

info "Tailwind e PostCSS configurados."

# ---------------------------------------------------------------------------
# 9. app/main.py (backend)
# ---------------------------------------------------------------------------
section "9. Criando backend/app/main.py"

cat > backend/app/main.py << 'MAINPY'
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
MAINPY

info "main.py criado."

# ---------------------------------------------------------------------------
# 10. core/config.py (backend)
# ---------------------------------------------------------------------------
section "10. Criando backend/app/core/config.py"

cat > backend/app/core/config.py << 'CORECFG'
"""Configurações da aplicação via pydantic-settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_ENV: str = "dev"
    APP_DEBUG: bool = True
    APP_VERSION: str = "0.1.0"
    APP_SECRET_KEY: str = "change-me-in-production"

    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/pef_dev"
    REDIS_URL: str | None = None

    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]
    LOG_LEVEL: str = "INFO"
    RATE_LIMIT_DEFAULT: str = "100/minute"
    IDEMPOTENCY_TTL_SECONDS: int = 86400
    STORAGE_BUCKET: str = "local"


settings = Settings()
CORECFG

info "core/config.py criado."

# ---------------------------------------------------------------------------
# 11. core/logging.py (backend)
# ---------------------------------------------------------------------------
section "11. Criando backend/app/core/logging.py"

cat > backend/app/core/logging.py << 'CORELOG'
"""Configuração de logging estruturado com structlog."""

import logging
import sys

import structlog


def configure_logging() -> None:
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(file=sys.stdout),
        cache_logger_on_first_use=True,
    )
CORELOG

info "core/logging.py criado."

# ---------------------------------------------------------------------------
# 12. db/session.py + db/base.py (backend)
# ---------------------------------------------------------------------------
section "12. Criando backend/app/db/"

cat > backend/app/db/session.py << 'DBSESSION'
"""Sessão SQLAlchemy — escopo por request."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.APP_DEBUG,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
DBSESSION

cat > backend/app/db/base.py << 'DBBASE'
"""Base declarativa do SQLAlchemy."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
DBBASE

info "db/session.py e db/base.py criados."

# ---------------------------------------------------------------------------
# 13. .env.example
# ---------------------------------------------------------------------------
section "13. Criando .env.example"

cat > .env.example << 'ENVEXAMPLE'
# ── App ────────────────────────────────────────────────────────────────────
APP_ENV=dev
APP_DEBUG=true
APP_VERSION=0.1.0
APP_SECRET_KEY=CHANGE_ME_IN_PRODUCTION_USE_STRONG_SECRET

# ── Backend ────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/pef_dev
REDIS_URL=                          # deixe vazio para desativar cache
ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
RATE_LIMIT_DEFAULT=100/minute
IDEMPOTENCY_TTL_SECONDS=86400
STORAGE_BUCKET=local

# ── Frontend ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_ENV=dev

# ── Observabilidade (opcional) ─────────────────────────────────────────────
# SENTRY_DSN=
# NEXT_PUBLIC_SENTRY_DSN=
# OTEL_EXPORTER_OTLP_ENDPOINT=
ENVEXAMPLE

cp .env.example .env
info ".env.example e .env criados."

# ---------------------------------------------------------------------------
# 14. Docker (frontend.Dockerfile, backend.Dockerfile, docker-compose.yml)
# ---------------------------------------------------------------------------
section "14. Criando Dockerfiles e docker-compose"

cat > docker/backend.Dockerfile << 'BKDF'
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
BKDF

cat > docker/frontend.Dockerfile << 'FEDF'
# ── Build stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /build
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY frontend .
RUN pnpm build

# ── Runtime stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup --system appgroup && adduser --system -G appgroup appuser
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public
USER appuser
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
FEDF

cat > docker/docker-compose.yml << 'DKCMP'
version: "3.9"

services:
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: pef_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    profiles: ["cache"]

  backend:
    build:
      context: ..
      dockerfile: docker/backend.Dockerfile
    restart: unless-stopped
    env_file: ../.env
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build:
      context: ..
      dockerfile: docker/frontend.Dockerfile
    restart: unless-stopped
    env_file: ../.env
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
DKCMP

info "Dockerfiles e docker-compose criados."

# ---------------------------------------------------------------------------
# 15. Makefile
# ---------------------------------------------------------------------------
section "15. Criando Makefile"

cat > Makefile << 'MAKEFILE'
.PHONY: help verify verify-full install install-be install-fe \
        test-unit test-integration test-contract test-regression test-mutation \
        lint lint-be lint-fe format format-be format-fe \
        typecheck typecheck-be typecheck-fe \
        migrate migrate-dryrun \
        build build-be build-fe \
        up down logs healthcheck \
        secret-scan sast deps-audit impact \
        docs-check a11y-smoke

PYTHON := python3
VENV   := backend/.venv
PYTEST := cd backend && .venv/bin/python -m pytest
VITEST := cd frontend && pnpm test
BE_SRC := backend
FE_SRC := frontend

help:  ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

# ── Instalação ─────────────────────────────────────────────────────────────
install: install-be install-fe  ## Instala todas as dependências

install-be:  ## Instala dependências do backend (cria .venv se necessário)
	cd $(BE_SRC) && uv venv .venv --python python3 && uv pip install -e ".[dev]" --python .venv/bin/python

install-fe:  ## Instala dependências do frontend
	cd $(FE_SRC) && pnpm install

# ── Lint e format ──────────────────────────────────────────────────────────
lint: lint-be lint-fe  ## Lint em todo o projeto

lint-be:  ## Lint no backend (ruff)
	cd $(BE_SRC) && .venv/bin/python -m ruff check .

lint-fe:  ## Lint no frontend (eslint)
	cd $(FE_SRC) && pnpm lint

format: format-be format-fe  ## Formata todo o projeto

format-be:  ## Formata backend (ruff format)
	cd $(BE_SRC) && .venv/bin/python -m ruff format .

format-fe:  ## Formata frontend (prettier)
	cd $(FE_SRC) && pnpm format

# ── Typecheck ─────────────────────────────────────────────────────────────
typecheck: typecheck-be typecheck-fe  ## Verifica tipos em todo o projeto

typecheck-be:  ## Typecheck backend (mypy)
	cd $(BE_SRC) && .venv/bin/python -m mypy app/

typecheck-fe:  ## Typecheck frontend (tsc)
	cd $(FE_SRC) && pnpm typecheck

# ── Testes ─────────────────────────────────────────────────────────────────
test-unit:  ## Testes unitários
	$(PYTEST) tests/unit -v --cov=app --cov-report=term-missing -m unit
	$(VITEST)

test-integration:  ## Testes de integração (requer Postgres)
	$(PYTEST) tests/integration -v -m integration

test-contract:  ## Testes de contrato (schemathesis)
	$(PYTEST) tests/contract -v -m contract

test-regression:  ## Testes de regressão (financeira + pedagógica)
	$(PYTEST) tests/regression -v -m regression

test-mutation:  ## Teste de mutação no domain/ (semanal)
	cd $(BE_SRC) && .venv/bin/python -m mutmut run --paths-to-mutate app/domain/

# ── Verificação completa ────────────────────────────────────────────────────
verify: lint format typecheck test-unit  ## lint + format + typecheck + unit tests

verify-full: verify test-integration test-contract test-regression  ## Verificação completa

# ── Migrations ─────────────────────────────────────────────────────────────
migrate:  ## Executa migrations pendentes
	cd $(BE_SRC) && .venv/bin/python -m alembic upgrade head

migrate-dryrun:  ## Mostra SQL das migrations sem executar
	cd $(BE_SRC) && .venv/bin/python -m alembic upgrade --sql head

# ── Build ──────────────────────────────────────────────────────────────────
build: build-be build-fe  ## Build de todos os containers

build-be:  ## Build do container backend
	docker build -f docker/backend.Dockerfile -t pef-backend:dev .

build-fe:  ## Build do container frontend
	docker build -f docker/frontend.Dockerfile -t pef-frontend:dev .

# ── Docker Compose ─────────────────────────────────────────────────────────
up:  ## Sobe serviços locais (Postgres + Redis opcional)
	docker compose -f docker/docker-compose.yml up -d postgres

down:  ## Para todos os serviços
	docker compose -f docker/docker-compose.yml down

logs:  ## Exibe logs dos serviços
	docker compose -f docker/docker-compose.yml logs -f

healthcheck:  ## Verifica saúde da API
	@curl -sf http://localhost:8000/health | python3 -m json.tool
	@curl -sf http://localhost:8000/health/ready | python3 -m json.tool
	@curl -sf http://localhost:8000/health/live | python3 -m json.tool

# ── Segurança ──────────────────────────────────────────────────────────────
secret-scan:  ## Scan de segredos no código
	detect-secrets scan . --baseline .secrets.baseline

sast:  ## Análise estática de segurança
	cd $(BE_SRC) && python -m bandit -r app/ -c pyproject.toml

deps-audit:  ## Auditoria de dependências com vulnerabilidades
	cd $(BE_SRC) && .venv/bin/python -m pip_audit
	cd $(FE_SRC) && pnpm audit

# ── Agente de impacto ──────────────────────────────────────────────────────
impact:  ## Executa agente de análise de impacto
	$(VENV)/bin/python scripts/impact_analysis_guard.py

# ── A11y ──────────────────────────────────────────────────────────────────
a11y-smoke:  ## Teste de acessibilidade nas telas críticas
	cd $(FE_SRC) && pnpm test:a11y
MAKEFILE

info "Makefile criado."

# ---------------------------------------------------------------------------
# 16. .pre-commit-config.yaml
# ---------------------------------------------------------------------------
section "16. Criando .pre-commit-config.yaml"

cat > .pre-commit-config.yaml << 'PRECOMMIT'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-merge-conflict
      - id: check-added-large-files
        args: ["--maxkb=500"]
      - id: no-commit-to-branch
        args: ["--branch", "main"]

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.7
    hooks:
      - id: ruff
        args: ["--fix"]
        files: ^backend/
      - id: ruff-format
        files: ^backend/

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.10.0
    hooks:
      - id: mypy
        files: ^backend/app/
        additional_dependencies:
          - "pydantic>=2.7.0"
          - "pydantic-settings>=2.2.0"

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets
        args: ["--baseline", ".secrets.baseline"]

  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.8
    hooks:
      - id: bandit
        args: ["-c", "backend/pyproject.toml"]
        files: ^backend/app/
PRECOMMIT

info ".pre-commit-config.yaml criado."

# ---------------------------------------------------------------------------
# 17. GitHub Actions CI
# ---------------------------------------------------------------------------
section "17. Criando .github/workflows/ci.yml"

cat > .github/workflows/ci.yml << 'CIYML'
name: CI

on:
  push:
    branches: [main, "feat/**", "fix/**"]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: "3.11"
  NODE_VERSION: "20"

jobs:
  backend:
    name: Backend — lint / typecheck / test
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: pef_test
        ports: ["5432:5432"]
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Install uv
        run: curl -LsSf https://astral.sh/uv/install.sh | sh && echo "$HOME/.cargo/bin" >> $GITHUB_PATH

      - name: Install backend deps
        run: cd backend && uv pip install -e ".[dev]" --system

      - name: Lint (ruff)
        run: cd backend && python -m ruff check .

      - name: Format check (ruff format)
        run: cd backend && python -m ruff format --check .

      - name: Typecheck (mypy)
        run: cd backend && python -m mypy app/

      - name: Secret scan
        run: pip install detect-secrets && detect-secrets scan --baseline .secrets.baseline

      - name: SAST (bandit)
        run: cd backend && python -m bandit -r app/ -c pyproject.toml

      - name: Tests (unit)
        run: cd backend && python -m pytest tests/unit -v --cov=app --cov-report=xml -m unit
        env:
          DATABASE_URL: postgresql+psycopg://postgres:postgres@localhost:5432/pef_test
          APP_ENV: ci

      - name: Tests (integration)
        run: cd backend && python -m pytest tests/integration -v -m integration
        env:
          DATABASE_URL: postgresql+psycopg://postgres:postgres@localhost:5432/pef_test
          APP_ENV: ci

  frontend:
    name: Frontend — lint / typecheck / test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install frontend deps
        run: cd frontend && pnpm install --frozen-lockfile

      - name: Lint (eslint)
        run: cd frontend && pnpm lint

      - name: Format check (prettier)
        run: cd frontend && pnpm format:check

      - name: Typecheck (tsc)
        run: cd frontend && pnpm typecheck

      - name: Tests (vitest)
        run: cd frontend && pnpm test:coverage
CIYML

info ".github/workflows/ci.yml criado."

# ---------------------------------------------------------------------------
# 18. GitHub PR Template + CODEOWNERS
# ---------------------------------------------------------------------------
section "18. Criando PR template e CODEOWNERS"

cat > .github/pull_request_template.md << 'PRTEMPLATE'
## Descrição
<!-- O que esta PR faz? Qual problema resolve? -->

## Tipo de mudança
- [ ] feat: nova funcionalidade
- [ ] fix: correção de bug
- [ ] refactor: refatoração sem mudança de comportamento
- [ ] test: adição ou atualização de testes
- [ ] docs: atualização de documentação
- [ ] chore: tarefa de manutenção

## REQ-IDs relacionados
<!-- Ex: RF-INT-001, RF-AMO-002 -->

## Checklist (obrigatório)
- [ ] Testes unitários adicionados/atualizados
- [ ] Testes de integração adicionados (se nova rota)
- [ ] Sem fórmula matemática duplicada no frontend
- [ ] Documentos vivos atualizados (se aplicável)
- [ ] `.env.example` atualizado (se novas variáveis)
- [ ] Sem segredos no código
- [ ] Erros tratados com RFC 7807
- [ ] TypeScript sem `any` sem justificativa
- [ ] Sem `--no-verify` utilizado

## Impacto arquitetural
<!-- Alguma fronteira de módulo foi alterada? Algum ADR precisa ser atualizado? -->

## Como testar
<!-- Passos para revisar e testar esta PR -->
PRTEMPLATE

cat > .github/CODEOWNERS << 'CODEOWNERS'
# Donos padrão para todo o repositório
* @PrinceOfEgypt1

# Domínio financeiro — revisão obrigatória
/backend/app/domain/         @PrinceOfEgypt1
/backend/tests/regression/   @PrinceOfEgypt1

# Infraestrutura
/docker/                     @PrinceOfEgypt1
/infra/                      @PrinceOfEgypt1
/.github/                    @PrinceOfEgypt1
CODEOWNERS

info "PR template e CODEOWNERS criados."

# ---------------------------------------------------------------------------
# 19. .gitignore
# ---------------------------------------------------------------------------
section "19. Criando .gitignore"

cat > .gitignore << 'GITIGNORE'
# Python / Virtual environments
.venv/
venv/
__pycache__/
*.py[cod]
*.pyo
*.pyd
.Python
*.egg-info/
dist/
build/
.venv/
venv/
env/
.eggs/
.mypy_cache/
.ruff_cache/
.pytest_cache/
.coverage
coverage.xml
htmlcov/
.mutmut-cache
mutmut-results.json

# Node / Next.js
node_modules/
.next/
out/
.turbo/
.vercel/
.pnpm-store/
pnpm-lock.yaml

# Env
.env
.env.local
.env.*.local
!.env.example

# Secrets
.secrets.baseline

# Docker
*.log

# OS
.DS_Store
Thumbs.db

# IDEs
.idea/
.vscode/
*.swp
*.swo

# Alembic (não versionar banco de dev)
backend/app/db/migrations/versions/*.pyc
GITIGNORE

info ".gitignore criado."

# ---------------------------------------------------------------------------
# 20. README.md
# ---------------------------------------------------------------------------
section "20. Criando README.md"

cat > README.md << 'README'
# Plataforma Educacional Financeira

Plataforma web educacional para simulações de matemática financeira acessíveis ao público geral.

## Stack

| Camada     | Tecnologia                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 14+, React 18+, TypeScript 5+  |
| Backend    | Python 3.11+, FastAPI, Pydantic v2     |
| Banco      | PostgreSQL 15+                          |
| Cache      | Redis 7+ (opcional)                     |
| ORM        | SQLAlchemy 2.0+ / Alembic              |
| Testes BE  | pytest, hypothesis, schemathesis        |
| Testes FE  | vitest, @testing-library/react, Playwright |

## Setup rápido

```bash
# 1. Clone e entre no diretório
git clone https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira.git
cd Plataforma_Educacional_Financeira

# 2. Configure variáveis de ambiente
cp .env.example .env
# edite .env conforme necessário

# 3. Suba o banco de dados
make up

# 4. Instale dependências
make install

# 5. Execute migrations
make migrate

# 6. Inicie o backend (em um terminal)
cd backend && uvicorn app.main:app --reload

# 7. Inicie o frontend (em outro terminal)
cd frontend && pnpm dev
```

## Comandos principais

```bash
make verify          # lint + format + typecheck + unit tests
make verify-full     # verificação completa
make test-unit       # testes unitários
make test-integration # testes de integração
make migrate         # executa migrations
make healthcheck     # verifica saúde da API
make up              # sobe Postgres local
make down            # para serviços
```

## Documentação

Toda a documentação do projeto está em `/docs/`. Principais referências:

- `docs/baseline/01_Visao_do_Produto.md`
- `docs/04_Arquitetura_de_Software.md`
- `docs/06_API_e_Contratos.md`
- `docs/20_ADR/` — Decisões arquiteturais

## Licença

Uso interno — todos os direitos reservados.
README

info "README.md criado."

# ---------------------------------------------------------------------------
# 21. docs/_meta/living_docs.json
# ---------------------------------------------------------------------------
section "21. Criando docs/_meta/living_docs.json"

cat > "docs/_meta/living_docs.json" << 'LIVEDOCS'
{
  "version": "1.0",
  "description": "Índice de documentos vivos do projeto",
  "documents": [
    { "id": "doc-01", "title": "Visão do Produto",         "path": "docs/baseline/01_Visao_do_Produto.md",   "status": "live" },
    { "id": "doc-02", "title": "Escopo Funcional",         "path": "docs/02_Escopo_Funcional.md",            "status": "live" },
    { "id": "doc-03", "title": "Regras de Negócio",        "path": "docs/baseline/03_Regras_de_Negocio.md",  "status": "live" },
    { "id": "doc-04", "title": "Arquitetura de Software",  "path": "docs/04_Arquitetura_de_Software.md",     "status": "live" },
    { "id": "doc-05", "title": "Modelagem de Dados",       "path": "docs/05_Modelagem_de_Dados.md",          "status": "live" },
    { "id": "doc-06", "title": "API e Contratos",          "path": "docs/06_API_e_Contratos.md",             "status": "live" },
    { "id": "doc-09", "title": "Qualidade e Testes",       "path": "docs/09_Qualidade_Testes.md",            "status": "live" },
    { "id": "doc-19", "title": "Matriz de Rastreabilidade","path": "docs/19_Matriz_Rastreabilidade.md",       "status": "live" },
    { "id": "doc-27", "title": "Versionamento de API",     "path": "docs/27_Versionamento_API.md",           "status": "live" }
  ]
}
LIVEDOCS

info "living_docs.json criado."

# ---------------------------------------------------------------------------
# 22. Teste unitário mínimo (backend)
# ---------------------------------------------------------------------------
section "22. Criando teste mínimo do backend"

cat > backend/tests/unit/test_health.py << 'TESTHEALTH'
"""Teste mínimo de sanidade da API."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_ok() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_live() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health/live")
    assert response.status_code == 200


@pytest.mark.unit
@pytest.mark.asyncio
async def test_health_ready() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health/ready")
    assert response.status_code == 200
TESTHEALTH

info "Teste mínimo criado."

# ---------------------------------------------------------------------------
# 23. Alembic — alembic.ini + env.py
# ---------------------------------------------------------------------------
section "23. Inicializando Alembic"

cd backend
python -m alembic init app/db/migrations 2>/dev/null || true

# Sobrescreve env.py com versão assíncrona
cat > app/db/migrations/env.py << 'ALEMBICENV'
"""Configuração do Alembic para migrações assíncronas."""

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import settings
from app.db.base import Base

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = settings.DATABASE_URL
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    connectable = create_async_engine(settings.DATABASE_URL)
    async with connectable.connect() as connection:
        await connection.run_sync(
            lambda conn: context.configure(connection=conn, target_metadata=target_metadata)
        )
        async with connection.begin():
            await connection.run_sync(lambda _: context.run_migrations())
    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
ALEMBICENV

cd ..
info "Alembic configurado."

# ---------------------------------------------------------------------------
# 24. Instalar dependências do backend (virtual environment)
# ---------------------------------------------------------------------------
section "24. Instalando dependências do backend"
cd backend
info "Criando virtual environment em backend/.venv ..."
uv venv .venv --python python3
info "Instalando pacotes no venv..."
uv pip install -e ".[dev]" --python .venv/bin/python
# Adiciona helpers de ativação no .env
if ! grep -q "VIRTUAL_ENV" ../.env 2>/dev/null; then
  echo "" >> ../.env
  echo "# Ative o venv antes de rodar: source backend/.venv/bin/activate" >> ../.env
fi
cd ..
info "Dependências do backend instaladas em backend/.venv"
info "Para ativar: source backend/.venv/bin/activate"

# ---------------------------------------------------------------------------
# 25. Instalar dependências do frontend
# ---------------------------------------------------------------------------
section "25. Instalando dependências do frontend"
cd frontend
pnpm install
cd ..
info "Dependências do frontend instaladas."

# ---------------------------------------------------------------------------
# 26. Instalar hooks de pre-commit
# ---------------------------------------------------------------------------
section "26. Instalando hooks de pre-commit"
pre-commit install --hook-type pre-commit --hook-type pre-push
info "Hooks de pre-commit instalados."

# ---------------------------------------------------------------------------
# 27. Inicializar .secrets.baseline
# ---------------------------------------------------------------------------
section "27. Inicializando .secrets.baseline"
# Instala detect-secrets via uv se não disponível
if ! command -v detect-secrets &>/dev/null; then
  info "Instalando detect-secrets via uv..."
  uv tool install detect-secrets
  export PATH="$HOME/.local/bin:$PATH"
fi
detect-secrets scan > .secrets.baseline 2>/dev/null || \
  echo '{"version": "1.5.0", "plugins_used": [], "results": {}, "generated_at": ""}' > .secrets.baseline
info ".secrets.baseline criado."

# ---------------------------------------------------------------------------
# 28. Primeiro commit completo
# ---------------------------------------------------------------------------
section "28. Commit inicial completo"
git add -A
git commit -m "feat: scaffold completo da Plataforma Educacional Financeira

- Estrutura de diretórios frontend/backend/docs/docker/scripts
- pyproject.toml com stack Python (FastAPI, SQLAlchemy, pytest, mypy, ruff)
- package.json com stack TypeScript (Next.js 14, vitest, Playwright)
- main.py com health checks, CORS, métricas Prometheus, error handler RFC 7807
- core/config.py, core/logging.py (structlog), db/session.py, db/base.py
- Alembic configurado (migrations assíncronas)
- Dockerfiles multi-stage (frontend + backend) e docker-compose.yml
- Makefile com alvos canônicos (verify, test, migrate, build, up, sast...)
- .pre-commit-config.yaml (ruff, mypy, detect-secrets, bandit)
- .github/workflows/ci.yml (GitHub Actions)
- .github/pull_request_template.md e CODEOWNERS
- .env.example com todas as variáveis documentadas
- .gitignore completo
- Teste mínimo do backend (/health)
- README.md com setup e referências

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

info "Commit inicial realizado."

# ---------------------------------------------------------------------------
# 29. Push para o GitHub
# ---------------------------------------------------------------------------
section "29. Push para o GitHub"
git push -u origin main
info "Push realizado com sucesso."

# ---------------------------------------------------------------------------
# FIM
# ---------------------------------------------------------------------------
section "✅ Setup concluído!"
echo ""
echo "  Próximos passos:"
echo "  1. Suba o banco:    make up"
echo "  2. Execute migr.:   make migrate"
echo "  3. Inicie backend:  cd backend && uvicorn app.main:app --reload"
echo "  4. Inicie frontend: cd frontend && pnpm dev"
echo "  5. Verifique tudo:  make verify"
echo ""
echo "  Repositório: https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira"
echo ""
