# F3 ? OpenAPI diff e catch-up

Data: 2026-05-03
Arquivo: `docs/api/openapi.json`
Script oficial usado: `scripts/export_openapi.py`

## Paths antes

Comando:

```bash
cd /home/moses/workspace/Plataforma_Educacional_Financeira
python3 - <<'PY'
import json
from pathlib import Path
schema = json.loads(Path('docs/api/openapi.json').read_text())
for path in sorted(schema['paths']):
    print(path)
print('COUNT', len(schema['paths']))
PY
```

Saida real:

```text
/api/v1/contract/ping
/health
/health/live
/health/ready
COUNT 4
```

## Paths runtime apos implementar F3

Comando:

```bash
cd backend
.venv/bin/python - <<'PY'
from app.main import app
schema = app.openapi()
for path in sorted(schema['paths']):
    print(path)
print('COUNT', len(schema['paths']))
PY
```

Saida real:

```text
/api/v1/amortization/compare
/api/v1/amortization/price
/api/v1/amortization/sac
/api/v1/contract/ping
/api/v1/interest/compare
/api/v1/interest/compound
/api/v1/interest/simple
/health
/health/live
/health/ready
COUNT 10
```

## Export oficial

Comando:

```bash
cd /home/moses/workspace/Plataforma_Educacional_Financeira
backend/.venv/bin/python scripts/export_openapi.py
```

Saida real:

```text
? OpenAPI spec exportado : /home/moses/workspace/Plataforma_Educacional_Financeira/docs/api/openapi.json
   openapi version        : 3.1.0
   api version            : 0.1.0
   endpoints              : 10
   component schemas      : 43
   paths                  : ['/health', '/health/live', '/health/ready', '/api/v1/contract/ping', '/api/v1/interest/simple', '/api/v1/interest/compound', '/api/v1/interest/compare', '/api/v1/amortization/price', '/api/v1/amortization/sac', '/api/v1/amortization/compare']
```

## Validacoes apos export

Comandos:

```bash
backend/.venv/bin/python scripts/export_openapi.py --check
python3 -m json.tool docs/api/openapi.json >/tmp/f3-openapi-json-valid.txt && head -n 1 /tmp/f3-openapi-json-valid.txt && echo OK_JSON
```

Saidas reais:

```text
? openapi.json sincronizado: /home/moses/workspace/Plataforma_Educacional_Financeira/docs/api/openapi.json
{
OK_JSON
```

## Paths depois

Saida real:

```text
/api/v1/amortization/compare
/api/v1/amortization/price
/api/v1/amortization/sac
/api/v1/contract/ping
/api/v1/interest/compare
/api/v1/interest/compound
/api/v1/interest/simple
/health
/health/live
/health/ready
COUNT 10
SCHEMAS 43
```

## Endpoints adicionados ao OpenAPI versionado

Catch-up de juros ja existentes no runtime:

- `POST /api/v1/interest/simple`
- `POST /api/v1/interest/compound`
- `POST /api/v1/interest/compare`

F3 amortizacao:

- `POST /api/v1/amortization/price`
- `POST /api/v1/amortization/sac`
- `POST /api/v1/amortization/compare`

## Endpoint debug fora da spec

`/api/v1/contract/errors/{kind}` permanece fora do OpenAPI publico. O contrato dedicado valida explicitamente que esse path nao aparece no schema runtime.
