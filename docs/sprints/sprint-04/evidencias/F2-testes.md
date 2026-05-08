# Evidência F2 — Testes e Gates

**Sprint:** 4 / Fatia F2  
**Data:** 2026-05-08  
**Executor:** Claude Code  

---

## Gates executados

### 1. ruff check backend

```
All checks passed!
```
**Resultado: ✓ VERDE**

### 2. ruff format --check backend

```
131 files already formatted
```
**Resultado: ✓ VERDE**

### 3. mypy . (strict)

```
Success: no issues found in 131 source files
```
**Resultado: ✓ VERDE**

### 4. bandit -r app

```
No issues identified.
Total lines of code: 3249
Total issues: 0 (Low: 0, Medium: 0, High: 0)
```
**Resultado: ✓ VERDE**

---

## Testes unitários — services/diagnostic

```
backend/.venv/bin/pytest tests/unit/services/diagnostic -q

10 passed in 0.67s
```
**Resultado: ✓ VERDE — 10/10**

Testes cobertos:
- `test_analisar_dg01_retorna_chaves_canonicas`
- `test_analisar_dg01_valores_canonicos`
- `test_analisar_dg01_alerta_reserva_insuficiente`
- `test_analisar_dg02_valores_canonicos`
- `test_analisar_dg02_alertas_criticos`
- `test_analisar_renda_zero_levanta_validation_error`
- `test_analisar_despesas_essenciais_zero_levanta_validation_error`
- `test_analisar_retorna_decimal_em_campos_monetarios`
- `test_analisar_retorna_int_em_pontos_e_score`
- `test_analisar_retorna_lista_alertas`

---

## Testes de integração — integration/api/diagnostic

```
backend/.venv/bin/pytest tests/integration/api/diagnostic -q

16 passed in 2.25s
```
**Resultado: ✓ VERDE — 16/16**

Testes cobertos:
- DG-01: envelope, data keys, valores canônicos, alerta RESERVA_INSUFICIENTE
- DG-02: retorno 200, valores canônicos, alertas RESERVA_CRITICA + SOBRA_NEGATIVA
- Propagação X-Request-ID, geração automática de request_id
- Aceitação de Idempotency-Key
- Payload vazio → 422 problem+json
- Renda zero → 422
- Renda negativa → 422
- Despesas negativas → 422
- Despesas essenciais = 0 → 422
- Campo extra → 422

---

## Testes de contrato

```
backend/.venv/bin/pytest tests/contract -q

30 passed in 1.19s
```
**Resultado: ✓ VERDE — 30/30**

Testes novos adicionados (8):
- `test_contract_diagnostic_endpoint_existe`
- `test_contract_diagnostic_envelope_padronizado`
- `test_contract_diagnostic_data_keys_canonicas`
- `test_contract_diagnostic_erro_segue_rfc_7807`
- `test_contract_openapi_expoe_diagnostic_analyze`
- `test_contract_openapi_runtime_expoe_diagnostic`
- `test_contract_diagnostic_nao_quebra_amortizacao_existente`
- `test_contract_diagnostic_nao_quebra_juros_existente`

---

## Suite completa de unitários

```
backend/.venv/bin/pytest tests/unit -q

224 passed in 8.12s
```
**Resultado: ✓ VERDE — 224/224** (inclui 76 testes do domínio F1 — sem regressão)

---

## Suite completa de integração

```
backend/.venv/bin/pytest tests/integration -q

51 passed, 1 failed in 1.77s
```

**1 falha pré-existente:** `test_health_ready_with_real_db`

Causa: PostgreSQL indisponível neste ambiente local (não há serviço de banco rodando).  
Status: falha pré-existente, não introduzida pela F2. Confirmado que o test existia antes da F2 e não passa nem com a codebase limpa da main.

---

## Impact Agent

```
make impact || backend/.venv/bin/python scripts/impact_analysis_guard.py || true
```

**LIMITAÇÃO AMBIENTAL:** `Makefile` não tem target `impact` e o script `scripts/impact_analysis_guard.py` não existe no repositório. O agente de impacto opera no CI (GitHub Actions), não localmente.

Status declarado: **COMANDO NÃO EXECUTADO — script inexistente no repositório local.**

O CI exercerá o impact agent na PR, conforme padrão da plataforma.

---

## Pendências honestas

1. **F1-A não mergeada**: commit `fea3b99` não está em `origin/main`. Não impactou a F2.
2. **PostgreSQL indisponível**: `test_health_ready_with_real_db` falha localmente — pré-existente.
3. **Impact Agent**: executado apenas em CI, não disponível localmente.
4. **Vertical slice incompleto**: RF-DIAG-001 status `in_progress` — F3 (frontend) e F4 (conteúdo) pendentes.
