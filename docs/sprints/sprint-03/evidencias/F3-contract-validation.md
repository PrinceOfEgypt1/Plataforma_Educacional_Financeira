# F3 ? Contract validation

Data: 2026-05-03

## Contrato publico implementado

- `POST /api/v1/amortization/price`
- `POST /api/v1/amortization/sac`
- `POST /api/v1/amortization/compare`

Todos usam:

- FastAPI router `api/v1`;
- schemas Pydantic em `app/schemas/amortization`;
- service em `app/services/amortization`;
- envelope `ResponseEnvelope[T]`;
- erros RFC 7807 por handlers existentes em `app/main.py`.

## Principal zero ? confirmacao material

Comando:

```bash
cd backend
.venv/bin/python - <<'PY'
from decimal import Decimal
from app.domain.amortization import calcular_price, calcular_sac
for name, fn in [('PRICE', calcular_price), ('SAC', calcular_sac)]:
    try:
        result = fn(Decimal('0.00'), Decimal('0.01'), 2)
    except Exception as exc:
        print(name, 'REJECTS_ZERO', type(exc).__name__, getattr(exc, 'code', None))
    else:
        print(name, 'ACCEPTS_ZERO', result.principal, result.total_pago, result.saldo_final)
PY
```

Saida real:

```text
PRICE ACCEPTS_ZERO 0.00 0.00 0.00
SAC ACCEPTS_ZERO 0.00 0.00 0.00
```

Linhas relevantes:

```text
backend/app/domain/amortization/_common.py:79:    if principal < 0:
backend/app/schemas/amortization/base.py:50:        gt=0,
backend/app/services/amortization/calcular_amortizacao_service.py:35:    if principal <= 0:
```

Decisao F3: o dominio F2 continua aceitando `principal == Decimal("0.00")`; a borda F3 rejeita `principal <= 0` no schema (`gt=0`) e no service (`principal <= 0`). A matematica da F2 nao foi reescrita.

## Testes de contrato completos

Comando:

```bash
cd backend
.venv/bin/python -m pytest tests/contract -q
```

Saida real:

```text
......................                                                   [100%]
22 passed in 0.74s
```

## Integracao completa

Comando:

```bash
cd backend
.venv/bin/python -m pytest tests/integration -q
```

Saida real:

```text
....................................                                     [100%]
36 passed in 0.74s
```
