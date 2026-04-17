# RUN-003: Recuperação Básica do Ambiente

**Versão:** 1.0 | **Sprint:** 0 | **Tipo:** Recovery

---

## Cenário 1: Banco de dados corrompido ou inacessível

### Diagnóstico
```bash
pg_isready -h localhost -p 5432
psql -U postgres -c "SELECT 1"
```

### Recuperação
```bash
# Recriar banco de desenvolvimento (DESTRÓI DADOS)
psql -U postgres -c "DROP DATABASE IF EXISTS pef_dev;"
psql -U postgres -c "CREATE DATABASE pef_dev;"
cd backend && .venv/bin/python -m alembic upgrade head
```

### Recuperação do banco de testes
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS pef_test;"
psql -U postgres -c "CREATE DATABASE pef_test;"
# O banco de testes não precisa de migrate — testes criam/destroem schema
```

## Cenário 2: Migration em estado inconsistente

### Diagnóstico
```bash
cd backend && .venv/bin/python -m alembic current
.venv/bin/python -m alembic history
```

### Recuperação
```bash
# Reverter última migration
.venv/bin/python -m alembic downgrade -1

# Ou reverter ao início
.venv/bin/python -m alembic downgrade base

# Reaplicar
.venv/bin/python -m alembic upgrade head
```

## Cenário 3: Dependências Python corrompidas

```bash
cd backend
rm -rf .venv
uv venv .venv
uv pip install -e ".[dev]" --python .venv/bin/python
```

## Cenário 4: Dependências Node corrompidas

```bash
cd frontend
rm -rf node_modules .pnpm-store
pnpm install
```

## Cenário 5: Pre-commit hooks quebrando

```bash
# Resetar cache do pre-commit
pre-commit clean
pre-commit install

# Verificar manualmente
pre-commit run --all-files
```

## Cenário 6: make verify falhando por motivo desconhecido

```bash
# Rodar cada gate individualmente para isolar
cd backend && .venv/bin/python -m ruff check . && echo "ruff OK"
cd backend && .venv/bin/python -m ruff format --check . && echo "format OK"
cd backend && .venv/bin/python -m mypy app/ && echo "mypy OK"
cd backend && .venv/bin/python -m pytest tests/unit -v && echo "pytest OK"
cd frontend && pnpm lint && echo "eslint OK"
cd frontend && pnpm typecheck && echo "tsc OK"
cd frontend && pnpm test && echo "vitest OK"
```

## Verificação pós-recuperação

```bash
# Sempre rodar após qualquer recovery
make verify
python scripts/export_openapi.py --check
python scripts/impact_analysis_guard.py --base HEAD~1
```
