# RUN-002: Verificação de Health e Readiness

**Versão:** 1.0 | **Sprint:** 0 | **Tipo:** Operacional

---

## Endpoints disponíveis

| Endpoint | Tipo | O que verifica |
|----------|------|----------------|
| `GET /health` | liveness | App responde (sem dependências) |
| `GET /health/live` | liveness | Equivalente ao /health |
| `GET /health/ready` | readiness | App + conexão real ao PostgreSQL (SELECT 1) |

## Verificação manual (desenvolvimento)

```bash
# Com app rodando em localhost:8000
curl -s http://localhost:8000/health | python3 -m json.tool
curl -s http://localhost:8000/health/live | python3 -m json.tool
curl -s http://localhost:8000/health/ready | python3 -m json.tool
```

Saída esperada para /health/ready:
```json
{"status": "ready"}
```

## Verificação via make

```bash
make healthcheck
```

## Diagnóstico de falha no /health/ready

### Sintoma: `{"detail": "Internal Server Error"}`

1. Verificar se o PostgreSQL está rodando:
```bash
   pg_isready -h localhost -p 5432
```

2. Verificar se o banco existe:
```bash
   psql -U postgres -c "\l" | grep pef_dev
```

3. Verificar DATABASE_URL no .env:
```bash
   grep DATABASE_URL .env
```

4. Verificar conectividade manual:
```bash
   cd backend && .venv/bin/python -c "
   import asyncio
   from sqlalchemy.ext.asyncio import create_async_engine
   from sqlalchemy import text
   import os; from dotenv import load_dotenv; load_dotenv()
   async def test():
       engine = create_async_engine(os.environ['DATABASE_URL'])
       async with engine.connect() as conn:
           await conn.execute(text('SELECT 1'))
       print('OK')
   asyncio.run(test())
   "
```

## Verificação nos testes de integração

```bash
cd backend && .venv/bin/python -m pytest tests/integration/api/test_health_integration.py -v
```

Testes cobertos:
- `test_health_ok_integration`
- `test_health_live_integration`
- `test_health_ready_with_real_db` ← verifica SELECT 1 real
