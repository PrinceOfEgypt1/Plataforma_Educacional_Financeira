# F5 — Backend Financing

**Sprint:** 4 / Fatia: F5  
**Feature:** RF-FIN-001 — Financiamento Imobiliário  
**Data:** 2026-05-08

## Domínio puro (`app/domain/financing/`)

### `_common.py`
- `INTERNAL_PRECISION = 34` (contexto Decimal)
- `DISPLAY_QUANTUM = Decimal("0.01")` (2 casas para exibição)
- `ZERO = Decimal("0.00")`
- `ensure_precision()`: configura contexto global
- `money(value)`: arredonda para 2 casas com ROUND_HALF_EVEN

### `real_estate.py`
- `SistemaAmortizacao(StrEnum)`: PRICE | SAC
- `FinanciamentoPeriodo`: frozen dataclass — numero, saldo_inicial, juros, amortizacao, encargos, prestacao, saldo_final
- `FinanciamentoImobResultado`: frozen dataclass — summary + parcelas (tuple)
- `_validate_financing_inputs()`: 7 validações, lança `DomainValidationError`
- `calcular_financiamento_imobiliario()`: função pura; importa `calcular_price`/`calcular_sac` de `app.domain.amortization`

### `__init__.py`
- Define `DomainValidationError(ValueError)` com code/message/field/value
- Re-exporta tipos públicos

## Schemas Pydantic (`app/schemas/financing/real_estate.py`)

- `MoneyDecimal`: `Annotated[Decimal, PlainSerializer(str(q))]` — 2 casas
- `RateDecimal`: 6 casas
- `FinanciamentoImobIn`: 7 campos; `@model_validator(mode="after")` verifica `entrada < imóvel`
- `FinanciamentoPeriodoRow`: 7 campos com MoneyDecimal
- `FinanciamentoImobSummary`: 13 campos
- `FinanciamentoImobOut`: summary + parcelas

## Service (`app/services/financing/simular_financiamento_service.py`)

- `simular_financiamento_imobiliario()`: converte `taxa_percentual / 100` → decimal, chama domínio, converte resultado para dict
- Captura `DomainValidationError` → lança `app.core.errors.ValidationError` (→ 422)

## Endpoint (`app/api/v1/financing.py`)

```
POST /api/v1/financing/real_estate
Response: ResponseEnvelope[FinanciamentoImobOut]
message: "financiamento_imobiliario_simulado"
```

- Counter Prometheus `financiamento_imob_total` registrado por sistema (PRICE/SAC)
- Router incluído em `app/api/v1/router.py` com prefix="/financing", tags=["financing"]

## Invariantes matemáticos verificados

- PRICE: soma(amortizacao_i) = valor_financiado, saldo_final_n = 0
- SAC: amortizacao_i = constante, parcelas decrescentes, total_juros < PRICE total_juros
- Taxa zero: juros = 0 em todos os períodos para PRICE e SAC
- Encargos: prestacao = juros + amortizacao + encargos (separados); total_encargos = encargo × n
- `custo_total = total_juros + total_encargos`
- `total_pago = total_amortizado + custo_total`
