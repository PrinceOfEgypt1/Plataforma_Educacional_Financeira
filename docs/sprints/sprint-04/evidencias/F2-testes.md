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

**Resultado original não aprovado:** `test_health_ready_with_real_db` falhou no ambiente da Claude

Causa corrigida pela auditoria WSL oficial: PostgreSQL disponível; pef_dev e pef_test responderam SELECT 1; a suíte completa de integração passou com 52 passed.
Status corrigido: falha ambiental da execução original da Claude; a revalidação no WSL oficial demonstrou que o projeto passa a suíte completa de integração.

---

## Impact Agent

```
make impact || backend/.venv/bin/python scripts/impact_analysis_guard.py || true
```

**Correção de auditoria WSL oficial:** o script `scripts/impact_analysis_guard.py` existe no repositório oficial WSL e foi executado localmente.

Status corrigido: Impact Agent executado localmente no WSL oficial, com resultado `HIGH/advisory` para API, schemas, services e OpenAPI do domínio diagnostic.

A auditoria no WSL oficial executou o Impact Agent localmente; o CI também poderá exercê-lo na PR.

---

## Pendências honestas

1. **F1-A materialmente incorporada**: o conteúdo da F1-A está na `main` por squash; a ausência do hash original `fea3b99` no histórico linear não significa ausência da correção.
2. **PostgreSQL disponível no WSL oficial**: `pg_isready` respondeu `accepting connections`, `pef_dev` e `pef_test` responderam `SELECT 1`, e a suíte completa de integração passou com `52 passed`.
3. **Impact Agent disponível e executado localmente**: `scripts/impact_analysis_guard.py` existe no WSL oficial e foi executado; resultado `HIGH/advisory` para API, schemas, services e OpenAPI do domínio diagnostic.
4. **Vertical slice incompleto**: RF-DIAG-001 permanece `in_progress` até F3 (frontend) e F4 (conteúdo educacional/docs vivos) serem concluídas.

## Adendo de auditoria Camaleão/Moisés — correções de narrativa

Durante a auditoria no repositório oficial WSL, foram identificadas imprecisões na resposta original da Claude Code:

- `scripts/impact_analysis_guard.py` existe no repositório oficial WSL e não deve ser tratado como inexistente.
- A F1-A está materialmente incorporada à `main` por squash; ausência do hash `fea3b99` não significa ausência da correção.
- A falha de `test_health_ready_with_real_db` no ambiente da Claude não pode ser classificada como pré-existente sem revalidação no WSL oficial.
- Gate com `51 passed / 1 failed` não é gate verde.
- A aprovação da F2 depende dos gates reais executados no WSL oficial.


## Adendo de auditoria WSL oficial — revalidação local

Revalidação executada no repositório oficial WSL de Moisés.

Resultados materiais observados:

- PostgreSQL disponível no WSL oficial.
- `pg_isready`: `/var/run/postgresql:5432 - accepting connections`.
- `pef_dev`: `SELECT current_database(), current_user, 1 AS ok;` executado com sucesso.
- `pef_test`: `SELECT current_database(), current_user, 1 AS ok;` executado com sucesso.
- Testes unitários do service diagnostic: 10 passed.
- Testes de integração API diagnostic: 16 passed.
- Testes de contrato: 30 passed.
- Testes unitários backend completos: 224 passed.
- Testes de integração backend completos: 52 passed.
- Impact Agent executado localmente no WSL oficial.
- Resultado do Impact Agent: HIGH/advisory para api, schemas, services e openapi no domínio diagnostic.

Correção adicional aplicada após mypy:

- A primeira correção removeu `Any` de produção usando `TypedDict`.
- O `mypy` apontou incompatibilidade porque `ValidationError` ainda espera `list[dict[str, Any]] | None`.
- O service foi ajustado para não declarar `Any` novo e passar o literal de erro diretamente ao `ValidationError`.
