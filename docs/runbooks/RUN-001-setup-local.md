# RUN-001: Setup Local do Ambiente de Desenvolvimento

**Versão:** 1.0 | **Sprint:** 0 | **Tipo:** Operacional

---

## Pré-requisitos

- Ubuntu 22+ (ou WSL2 com Ubuntu)
- Git, curl, Python 3.12+, Node 20+, pnpm
- PostgreSQL 16 instalado e rodando

## Passo 1 — Clonar e entrar no repositório

```bash
git clone https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira.git
cd Plataforma_Educacional_Financeira
```

## Passo 2 — Backend: criar virtualenv e instalar dependências

```bash
cd backend
uv venv .venv
uv pip install -e ".[dev]" --python .venv/bin/python
cd ..
```

## Passo 3 — Frontend: instalar dependências

```bash
cd frontend && pnpm install && cd ..
```

## Passo 4 — Configurar variáveis de ambiente

```bash
cp .env.example .env
# Editar .env com suas credenciais locais:
#   DATABASE_URL=postgresql+psycopg://SEU_USUARIO:SENHA@localhost:5432/pef_dev  # pragma: allowlist secret
#   ALLOWED_ORIGINS=["http://localhost:3000"]
```

## Passo 5 — Criar bancos de dados

```bash
psql -U postgres -c "CREATE DATABASE pef_dev;"
psql -U postgres -c "CREATE DATABASE pef_test;"
# Ou com usuário local:
createdb pef_dev && createdb pef_test
```

## Passo 6 — Rodar migrations

```bash
cd backend
.venv/bin/python -m alembic upgrade head
cd ..
```

## Passo 7 — Instalar pre-commit hooks

```bash
uv tool install pre-commit
pre-commit install
```

## Passo 8 — Verificar setup

```bash
make verify
```

Saída esperada: todos os 8 gates verdes, coverage ≥ 75%.

## Passo 9 — Rodar testes de integração

```bash
cd backend && .venv/bin/python -m pytest tests/integration -v -m integration
```

## Verificação de saúde

```bash
cd backend && .venv/bin/python -m uvicorn app.main:app --reload &
curl http://localhost:8000/health/ready
# Esperado: {"status": "ready"}
```

## Problemas comuns

| Sintoma | Causa | Solução |
|---------|-------|---------|
| `externally-managed-environment` | Ubuntu bloqueia pip global | Usar `uv venv .venv` |
| `ALLOWED_ORIGINS parse error` | pydantic-settings v2 exige JSON | `ALLOWED_ORIGINS=["http://localhost:3000"]` |
| `No script_location` | alembic.ini não encontrado | Rodar alembic de dentro de `backend/` |
| `connection refused postgres` | PostgreSQL não está rodando | `sudo service postgresql start` |
