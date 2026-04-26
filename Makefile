.PHONY: help verify verify-full install install-be install-fe \
        test-unit test-integration test-contract test-regression test-mutation \
        lint lint-be lint-fe format format-be format-fe \
        typecheck typecheck-be typecheck-fe \
        migrate migrate-dryrun \
        build build-be build-fe \
        up down logs healthcheck \
        secret-scan sast deps-audit impact \
        docs-check a11y-smoke lint-pedagogical

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

# ── Lint pedagógico ────────────────────────────────────────────────────────
lint-pedagogical:  ## Lint pedagógico (subset Doc 08 §20 — implementação Sprint 7)
	$(PYTHON) -m tools.edu_lint

