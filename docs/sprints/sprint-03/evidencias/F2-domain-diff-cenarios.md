# F2 - Diff de cenarios financeiros PRICE/SAC

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F2 - Dominio puro de amortizacao PRICE/SAC
**Executor:** Codex
**Data WSL:** 2026-05-02T23:34:42-03:00
**Branch:** sprint-3/f2-dominio-amortizacao-codex
**Commit-base:** 55d5d44

## 1. Objetivo

Registrar os principais cenarios financeiros calculados pelo dominio implementado, com foco no caso canonico `PV=100000`, taxa `1% a.m.`, prazo `12`, e na eliminacao das divergencias historicas das tentativas F2 anteriores.

## 2. Comando executado

```bash
$ cd /home/moses/workspace/Plataforma_Educacional_Financeira
$ PYTHONPATH=backend backend/.venv/bin/python - <<'PY'
from decimal import Decimal
from app.domain.amortization import calcular_price, calcular_sac

principal = Decimal('100000.00')
taxa = Decimal('0.01')
prazo = 12
price = calcular_price(principal=principal, taxa_periodo=taxa, n_periodos=prazo)
sac = calcular_sac(principal=principal, taxa_periodo=taxa, n_periodos=prazo)
# impressao resumida das primeiras/ultimas linhas e somatorios
PY
```

## 3. Saida real - PRICE PR-01

```text
PRICE_PR_01
parcela_regular= 8884.88
total_pago= 106618.53
total_juros= 6618.53
saldo_final= 0.00
primeira_linha= {'periodo': 1, 'saldo_inicial': '100000.00', 'juros': '1000.00', 'amortizacao': '7884.88', 'parcela': '8884.88', 'saldo_final': '92115.12'}
ultima_linha= {'periodo': 12, 'saldo_inicial': '8796.88', 'juros': '87.97', 'amortizacao': '8796.88', 'parcela': '8884.85', 'saldo_final': '0.00'}
soma_parcelas= 106618.53
soma_juros= 6618.53
soma_amortizacao= 100000.00
PRICE_LINHAS_FECHAM= True
```

Leitura: a parcela regular PRICE e `8884.88` ate a penultima linha. A ultima parcela e ajustada para `8884.85` para fechar exatamente amortizacao total `100000.00` e saldo final `0.00`. Isso evita a falha historica `parcela x 12 != total_pago` e tambem evita divergencia linha a linha.

## 4. Saida real - SAC SAC-01

```text
SAC_SAC_01
amortizacao_constante= 8333.33
parcela_inicial= 9333.33
parcela_final= 8416.70
total_pago= 106500.00
total_juros= 6500.00
saldo_final= 0.00
primeira_linha= {'periodo': 1, 'saldo_inicial': '100000.00', 'juros': '1000.00', 'amortizacao': '8333.33', 'parcela': '9333.33', 'saldo_final': '91666.67'}
ultima_linha= {'periodo': 12, 'saldo_inicial': '8333.37', 'juros': '83.33', 'amortizacao': '8333.37', 'parcela': '8416.70', 'saldo_final': '0.00'}
soma_parcelas= 106500.00
soma_juros= 6500.00
soma_amortizacao= 100000.00
SAC_LINHAS_FECHAM= True
```

Leitura: a amortizacao SAC regular e `8333.33` ate a penultima linha. A ultima amortizacao e `8333.37` para absorver centavos residuais e fechar saldo final `0.00`.

## 5. Comparativo PRICE vs SAC

```text
DIFERENCA_TOTAL_JUROS_PRICE_MENOS_SAC= 118.53
```

No caso canonico, SAC paga `118.53` a menos em juros do que PRICE, preservando a expectativa pedagogica registrada nos documentos matematicos da Sprint.

## 6. Fixtures adicionadas

Arquivo alterado: `backend/tests/fixtures/financial_cases.json`.

Secao adicionada: `amortization`.

Conteudo material:

- 4 casos PRICE: `PR-01`, `PR-ZERO-RATE`, `PR-UNIT`, `PR-ROUNDING`.
- 4 casos SAC: `SAC-01`, `SAC-ZERO-RATE`, `SAC-UNIT`, `SAC-ROUNDING`.
- 3 comparativos PRICE vs SAC: `SAC-02`, `CMP-24M`, `CMP-LONG`.
- 36 casos em `massa_grid`, combinando principais, taxas e prazos para ambos os sistemas.

As fixtures foram geradas a partir do dominio implementado e validadas pelos testes golden cases.
