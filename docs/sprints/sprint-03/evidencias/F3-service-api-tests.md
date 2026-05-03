# F3 ? Service/API tests

Data: 2026-05-03

## Escopo testado

- Service de amortizacao: `simular_price`, `simular_sac`, `comparar_price_sac`, `CalcularAmortizacaoService`.
- API publica:
  - `POST /api/v1/amortization/price`
  - `POST /api/v1/amortization/sac`
  - `POST /api/v1/amortization/compare`
- Rejeicoes de borda: payload vazio, `principal <= 0`, taxa negativa, `n_periodos <= 0`, campo extra.
- Invariantes com `Decimal` a partir de valores serializados pela API.

## Sintaxe e lint focado

```bash
cd backend
.venv/bin/python -m py_compile app/api/v1/amortization.py app/schemas/amortization/base.py app/schemas/amortization/price.py app/schemas/amortization/sac.py app/schemas/amortization/compare.py app/services/amortization/calcular_amortizacao_service.py tests/unit/services/amortization/test_calcular_amortizacao_service.py tests/integration/api/amortization/test_price.py tests/integration/api/amortization/test_sac.py tests/integration/api/amortization/test_compare.py tests/integration/api/amortization/test_errors.py tests/contract/test_amortization.py
.venv/bin/python -m ruff check app/api/v1/router.py app/api/v1/amortization.py app/schemas/amortization app/services/amortization tests/unit/services/amortization tests/integration/api/amortization tests/contract/test_amortization.py
```

Saida relevante real:

```text
py_compile: exit code 0
All checks passed!
```

## Unit service

```bash
cd backend
.venv/bin/python -m pytest tests/unit/services/amortization -q
```

Saida real:

```text
.....                                                                    [100%]
5 passed in 0.13s
```

## Integracao API amortizacao

```bash
cd backend
.venv/bin/python -m pytest tests/integration/api/amortization -q
```

Saida real:

```text
..............                                                           [100%]
14 passed in 0.60s
```

## Contrato dedicado de amortizacao

```bash
cd backend
.venv/bin/python -m pytest tests/contract/test_amortization.py -q
```

Saida real:

```text
......                                                                   [100%]
6 passed in 0.60s
```

## Invariantes exercidas nos testes HTTP

Os testes de API convertem strings serializadas em `Decimal` e validam:

```python
linha.juros + linha.amortizacao == linha.parcela
sum(parcelas) == total_pago
sum(juros) == total_juros
sum(amortizacoes) == principal
saldo_final == Decimal("0.00")
SAC.total_juros < PRICE.total_juros  # taxa positiva e prazo > 1
```

## Falha corrigida durante a execucao

O primeiro teste unitario do service esperava `exc_info.value.code == "NON_POSITIVE_PRINCIPAL"`. O padrao real do projeto e `ValidationError.code == "VALIDATION_ERROR"` com codigo especifico em `errors[0]["code"]`. O teste foi ajustado para o contrato real sem alterar a logica do service.
