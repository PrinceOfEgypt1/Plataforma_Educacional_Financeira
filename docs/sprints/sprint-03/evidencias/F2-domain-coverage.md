# F2 - Cobertura do dominio de amortizacao

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F2 - Dominio puro de amortizacao PRICE/SAC
**Executor:** Codex
**Data WSL:** 2026-05-02T23:34:42-03:00
**Branch:** sprint-3/f2-dominio-amortizacao-codex
**Commit-base:** 55d5d44

## 1. Objetivo

Registrar a cobertura real dos testes criados para o dominio puro de amortizacao, incluindo PRICE, SAC, propriedades/invariantes e regressao pedagogica herdada do modulo de juros.

## 2. Escopo exercitado

Arquivos de dominio exercitados:

- backend/app/domain/amortization/__init__.py
- backend/app/domain/amortization/_common.py
- backend/app/domain/amortization/price.py
- backend/app/domain/amortization/sac.py

Testes novos exercitados:

- backend/tests/unit/domain/amortization/test_price.py
- backend/tests/unit/domain/amortization/test_sac.py
- backend/tests/unit/domain/amortization/test_properties.py
- backend/tests/regression/pedagogical/test_interest.py

## 3. Pytest minimo da F2

```bash
$ cd /home/moses/workspace/Plataforma_Educacional_Financeira
$ PYTHONPATH=backend backend/.venv/bin/python -m pytest backend/tests/unit/domain/amortization -q
.......................................                                  [100%]
39 passed in 0.70s
```

## 4. Cobertura do dominio de amortizacao

```bash
$ cd /home/moses/workspace/Plataforma_Educacional_Financeira/backend
$ .venv/bin/python -m pytest tests/unit/domain/amortization --cov=app.domain.amortization --cov-report=term-missing
============================= test session starts ==============================
platform linux -- Python 3.12.3, pytest-9.0.3, pluggy-1.6.0
collected 39 items

tests/unit/domain/amortization/test_price.py ................            [ 41%]
tests/unit/domain/amortization/test_properties.py ......                 [ 56%]
tests/unit/domain/amortization/test_sac.py .................             [100%]

================================ tests coverage ================================
Name                                  Stmts   Miss  Cover   Missing
-------------------------------------------------------------------
app/domain/amortization/__init__.py      14      1    93%   56
app/domain/amortization/_common.py       47      3    94%   36, 66, 73
app/domain/amortization/price.py         44      0   100%
app/domain/amortization/sac.py           39      0   100%
-------------------------------------------------------------------
TOTAL                                   144      4    97%
Coverage precision: 2
TOTAL                                 97.22%
============================== 39 passed in 1.55s ==============================
```

## 5. Suite unit completa do backend

```bash
$ cd /home/moses/workspace/Plataforma_Educacional_Financeira/backend
$ .venv/bin/python -m pytest tests/unit -m unit
collected 133 items

tests/unit/domain/amortization/test_price.py ................            [ 12%]
tests/unit/domain/amortization/test_properties.py ......                 [ 16%]
tests/unit/domain/amortization/test_sac.py .................             [ 29%]
tests/unit/domain/interest/test_compound.py ............................ [ 50%]
.                                                                        [ 51%]
tests/unit/domain/interest/test_properties.py ............               [ 60%]
tests/unit/domain/interest/test_simple.py ......................         [ 76%]
tests/unit/services/interest/test_calcular_juros_service.py ............ [ 85%]
...                                                                      [ 87%]
tests/unit/test_envelope.py .............                                [ 97%]
tests/unit/test_health.py ...                                            [100%]

============================= 133 passed in 2.92s ==============================
```

## 6. Regressao pedagogica herdada da Sprint 2

```bash
$ cd /home/moses/workspace/Plataforma_Educacional_Financeira/backend
$ .venv/bin/python -m pytest tests/regression -m regression
collected 3 items

tests/regression/pedagogical/test_interest.py ...                        [100%]

============================== 3 passed in 0.13s ===============================
```

## 7. Gates de qualidade backend

```bash
$ cd /home/moses/workspace/Plataforma_Educacional_Financeira/backend
$ .venv/bin/python -m ruff check .
All checks passed!

$ .venv/bin/python -m ruff format --check .
101 files already formatted

$ .venv/bin/python -m mypy app/
Success: no issues found in 67 source files
```

## 8. Pipeline oficial

A primeira execucao do pipeline sem ajuste ambiental falhou em pre-requisito frontend porque `node` nao estava no PATH do WSL. Foi encontrado Node local via nvm em `/home/moses/.nvm/versions/node/v22.21.1/bin/node`.

Execucao final com PATH temporario, sem alterar o repositorio:

```bash
$ env PATH=/home/moses/.nvm/versions/node/v22.21.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin bash scripts/pipeline.sh
[INFO] Node: v22.21.1
[INFO] pnpm: /home/moses/.nvm/versions/node/v22.21.1/bin/pnpm
[ OK ] backend.ruff_check
[ OK ] backend.ruff_format_check
[ OK ] backend.mypy_app
[ OK ] backend.bandit
============================= 133 passed in 2.96s ==============================
[ OK ] backend.pytest_unit
[ OK ] frontend.install
[ OK ] frontend.lint
[ OK ] frontend.format_check
[ OK ] frontend.typecheck
Test Files  21 passed (21)
Tests  149 passed (149)
[ OK ] frontend.test
[ OK ] frontend.build

=== PIPELINE VERDE ===
[INFO] Modo: standard
[INFO] Todos os gates obrigatorios passaram.
```

Observacao: o pipeline emitiu o aviso legado ja conhecido do Recharts em testes frontend (`width(0) and height(0)`), sem falhar o gate.

## 9. Invariantes cobertas por testes

Os testes de PRICE e SAC verificam explicitamente:

- `linha.juros + linha.amortizacao == linha.parcela` em todas as linhas.
- `sum(parcelas) == total_pago`.
- `sum(juros) == total_juros`.
- `sum(amortizacoes) == principal`.
- `resultado.tabela_periodo[-1].saldo_final == resultado.saldo_final`.
- `resultado.saldo_final == Decimal("0.00")`.
- PRICE com parcela regular ate a penultima linha e ajuste financeiro na ultima linha.
- SAC com amortizacao regular ate a penultima linha e ajuste financeiro na ultima linha.
- Comparativo SAC com juros totais menores que PRICE em cenarios materiais.
- Casos de taxa zero, prazo unitario, principal zero, entradas invalidas e imutabilidade de dataclasses.
