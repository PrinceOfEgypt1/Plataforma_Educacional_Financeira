# Evidência F2 — OpenAPI

**Sprint:** 4 / Fatia F2  
**Data:** 2026-05-08  
**Executor:** Claude Code  

---

## Comando executado

```bash
APP_ENV=ci \
DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/pef_dev" \
ALLOWED_ORIGINS='["http://localhost:3000"]' \
APP_SECRET_KEY="test-not-real" \
PYTHONPATH=backend \
backend/.venv/bin/python scripts/export_openapi.py
```

## Saída real

```
✅ OpenAPI spec exportado : .../docs/api/openapi.json
   openapi version        : 3.1.0
   api version            : 0.1.0
   endpoints              : 11
   component schemas      : 47
   paths                  : [
     '/health', '/health/live', '/health/ready',
     '/api/v1/contract/ping',
     '/api/v1/interest/simple', '/api/v1/interest/compound', '/api/v1/interest/compare',
     '/api/v1/amortization/price', '/api/v1/amortization/sac', '/api/v1/amortization/compare',
     '/api/v1/diagnostic/analyze'
   ]
```

## Verificação de presença no JSON

```bash
grep -n '"/api/v1/diagnostic/analyze"' docs/api/openapi.json
# 462:    "/api/v1/diagnostic/analyze": {
```

## Conteúdo da operação no OpenAPI

- Método: `POST`
- Tag: `diagnostic`
- Summary: "Executa o diagnóstico financeiro completo."
- RequestBody: `DiagnosticAnalyzeRequest` (todos os campos obrigatórios)
- Response 200: `ResponseEnvelope[DiagnosticAnalyzeResponseData]`
- Response 422: `application/problem+json`
- Component schemas adicionados: `DiagnosticAnalyzeRequest`, `DiagnosticAnalyzeResponseData`, `DiagnosticAlertResponse`

## Total de schemas no OpenAPI

- Antes da F2: 44 (estimado)
- Depois da F2: 47 (confirmado pela saída do script)
