# DOCUMENTO 19-B — MATRIZ DE RASTREABILIDADE: REQUISITOS ↔ TESTES ↔ CÓDIGO

**Versão:** 1.0
**Status:** VIVO
**Finalidade:** Garantir rastreabilidade total entre requisito funcional, regra de negócio matemática, contrato de API, código implementado e teste comprovador.

---

## 1. Estrutura da matriz

Cada linha cruza:
- **REQ-ID** — requisito (Doc 02) ou regra (Doc 03/18).
- **Módulo** — domínio.
- **Endpoint** — rota REST associada.
- **Schema** — schema Pydantic in/out.
- **Service** — service no backend.
- **Domínio** — função de domínio puro.
- **Caso de teste matemático** — referência ao Doc 15 (ex.: `JS-01`).
- **Teste unitário** — caminho do arquivo de teste.
- **Teste de integração** — caminho.
- **Teste de contrato** — caminho.
- **Teste pedagógico** — caminho.
- **Doc vivo associado** — quais docs vivos atualizar quando esta linha mudar.
- **Status** — `pending`, `in_progress`, `done`, `regression_safe`.

## 2. Tabela canônica (sementes)

| REQ-ID | Módulo | Endpoint | Schema | Service | Domínio | Doc 15 ref | Unit | Integ | Contract | Pedagógico | Docs vivos | Status |
|--------|--------|----------|--------|---------|---------|------------|------|-------|----------|------------|------------|--------|
| REQ-CTR-001 | contract-base (transversal) | `GET /api/v1/contract/ping` + envelope + RFC 7807 em todas as rotas | `ResponseEnvelope[T]`, `Meta`, `Problem` | — | `app/core/envelope`, `app/core/errors`, `app/core/request_id` | — | `tests/unit/test_envelope.py` | — | `tests/contract/test_contract_base.py`, `tests/contract/test_error_handling.py` | — | 04,06,09,19,27,ADR-0006,ADR-0007 | done |
| RF-HEALTH-001 | infra | `GET /health`, `/health/live`, `/health/ready` | — | — | `app/api/health` | — | `tests/unit/test_health.py` | `tests/integration/api/test_health_integration.py` | — | — | 04,06,09,19 | done |
| RF-INT-001 | interest | `POST /api/v1/interest/simple` | `JurosSimplesIn/Out` | `CalcularJurosSimplesService` | `domain.interest.simple.calcular` | JS-01..JS-03 (exercidos), JS-04..JS-10 (planejados) | `backend/tests/unit/domain/interest/test_simple.py`, `backend/tests/unit/domain/interest/test_properties.py`, `backend/tests/unit/services/interest/test_calcular_juros_service.py` | `backend/tests/integration/api/interest/test_simple.py`, `backend/tests/integration/api/interest/test_errors.py` | `backend/tests/contract/test_interest.py` | (regressao pedagogica BE: pendente; runtime FE: `frontend/src/__tests__/content/juros/conteudo.test.ts`) | 03,06,08,09,15,19 | done (Sprint 2 — F2/F3/F4/F5) |
| RF-INT-002 | interest | `POST /api/v1/interest/compound` | `JurosCompostosIn/Out` | `CalcularJurosCompostosService` | `domain.interest.compound.calcular` | JC-01..JC-03 (exercidos), JC-04..JC-10 (planejados) | `backend/tests/unit/domain/interest/test_compound.py`, `backend/tests/unit/domain/interest/test_properties.py`, `backend/tests/unit/services/interest/test_calcular_juros_service.py` | `backend/tests/integration/api/interest/test_compound.py`, `backend/tests/integration/api/interest/test_compare.py`, `backend/tests/integration/api/interest/test_errors.py` | `backend/tests/contract/test_interest.py` | (regressao pedagogica BE: pendente; runtime FE: `frontend/src/__tests__/content/juros/conteudo.test.ts`) | 03,06,08,09,15,19 | done (Sprint 2 — F2/F3/F4/F5) |
| RF-AMO-001 | amortization | `POST /api/v1/amortization/price` | `PriceIn/PriceOut` | `simular_price`, `CalcularAmortizacaoService` | `domain.amortization.price.calcular_price` | PR-01..PR-10; canonico PV=100000, i=1%, n=12 exercido | `backend/tests/unit/domain/amortization/test_price.py`, `backend/tests/unit/domain/amortization/test_properties.py`, `backend/tests/unit/services/amortization/test_calcular_amortizacao_service.py` | `backend/tests/integration/api/amortization/test_price.py`, `backend/tests/integration/api/amortization/test_errors.py` | `backend/tests/contract/test_amortization.py` | - | 03,06,09,15,19 | in_progress (Sprint 3 F2/F3 backend) |
| RF-AMO-002 | amortization | `POST /api/v1/amortization/sac` | `SacIn/SacOut` | `simular_sac`, `CalcularAmortizacaoService` | `domain.amortization.sac.calcular_sac` | SAC-01..SAC-10; canonico PV=100000, i=1%, n=12 exercido | `backend/tests/unit/domain/amortization/test_sac.py`, `backend/tests/unit/domain/amortization/test_properties.py`, `backend/tests/unit/services/amortization/test_calcular_amortizacao_service.py` | `backend/tests/integration/api/amortization/test_sac.py`, `backend/tests/integration/api/amortization/test_errors.py` | `backend/tests/contract/test_amortization.py` | - | 03,06,09,15,19 | in_progress (Sprint 3 F2/F3 backend) |
| RF-AMO-003 | amortization | `POST /api/v1/amortization/compare` | `CompareIn/CompareOut` | `comparar_price_sac`, `CalcularAmortizacaoService` | `domain.amortization.price.calcular_price` + `domain.amortization.sac.calcular_sac` | comparativo PRICE vs SAC; SAC.total_juros < PRICE.total_juros quando i>0 e n>1 | `backend/tests/unit/services/amortization/test_calcular_amortizacao_service.py` | `backend/tests/integration/api/amortization/test_compare.py`, `backend/tests/integration/api/amortization/test_errors.py` | `backend/tests/contract/test_amortization.py` | - | 03,06,09,15,19 | in_progress (Sprint 3 F3 backend) |
| RF-FIN-001 | financing | `POST /api/v1/financing/real_estate` | `FinanciamentoImobIn/Out` | ... | ... | FI-01..FI-10 | ... | ... | ... | ... | 03,06,09,15,19 | pending |
| RF-FIN-002 | financing | `POST /api/v1/financing/vehicle` | `FinanciamentoVeicIn/Out` | ... | ... | FV-01..FV-10 | ... | ... | ... | ... | 03,06,09,15,19 | pending |
| RF-LOA-001 | loans | `POST /api/v1/loans/payroll` | `ConsignadoIn/Out` | ... | ... | CO-01..CO-08 | ... | ... | ... | ... | 03,06,09,15,18,19 | pending |
| RF-LOA-002 | loans | `POST /api/v1/loans/cdc` | `CdcIn/Out` | ... | ... | CDC-01..CDC-08 | ... | ... | ... | ... | 03,06,09,15,18,19 | pending |
| RF-CC-001 | credit_card | `POST /api/v1/credit_card/rotativo` | `RotativoIn/Out` | ... | ... | RT-01..RT-08 | ... | ... | ... | ... | 03,06,09,15,18,19 | pending |
| RF-LP-001 | late_payment | `POST /api/v1/late/atraso` | `AtrasoIn/Out` | ... | ... | AT-01..AT-08 | ... | ... | ... | ... | 03,06,09,15,18,19 | pending |
| RF-IND-001 | indicators | `GET /api/v1/indicators/{id}` | `IndicadorOut` | ... | ... | — | ... | ... | ... | ... | 06,08,19 | pending |
| RF-IVQ-001 | invest_vs_debt | `POST /api/v1/decision/invest-vs-debt` | `InvestVsQuitarIn/Out` | ... | ... | IVQ-01..IVQ-08 | ... | ... | ... | ... | 03,06,09,15,19 | pending |
| RF-EDU-001 | education | `GET /api/v1/education/glossary/{slug}` | `GlossarioOut` | ... | ... | — | ... | ... | ... | `tests/regression/pedagogical/test_glossary.py` | 08,19 | pending |
| RF-EXP-001 | export | `POST /api/v1/export/pdf` | `ExportPdfIn/Out` | ... | ... | — | `tests/unit/export/test_pdf.py` | `tests/integration/export/test_pdf.py` | `tests/contract/test_export.py` | — | 06,17,19 | pending |
| RF-EXP-002 | export | `POST /api/v1/export/excel` | `ExportXlsxIn/Out` | ... | ... | — | ... | ... | ... | — | 06,17,19 | pending |

> Esta tabela é **semente**. A cada nova rota/feature, a Claude Code adiciona linha **na mesma PR** que cria a feature. O agente de impacto bloqueia se a linha não for adicionada/atualizada.

## 3. Regras de manutenção

1. Sem REQ-ID, não há feature.
2. REQ-ID estável; nunca renumerar.
3. Status de uma linha só vai para `done` quando todos os testes daquele requisito existem e estão verdes.
4. `regression_safe` quando o requisito está coberto também por mutação ≥80% e snapshot visual (se aplicável).
5. Mudança em qualquer célula de uma linha exige atualização nos documentos vivos listados.


## 6. Atualizações de status — Sprint 2 (F2/F3/F4/F5 oficiais)

| Linha   | Mudança                                                                              | Sprint / Fatia |
|---------|--------------------------------------------------------------------------------------|----------------|
| RF-INT-001 | `pending` → `done` (Sprint 2 — F2/F3/F4/F5). Caminhos materializados no repo.    | Sprint 2       |
| RF-INT-002 | `pending` → `done` (Sprint 2 — F2/F3/F4/F5). Caminhos materializados no repo.    | Sprint 2       |

Notas:
- "JS-01..JS-03 (exercidos)" e "JC-01..JC-03 (exercidos)" refletem
  os casos do Doc 15 cobertos por testes existentes no repositório
  Windows. Casos JS-04..JS-10 e JC-04..JC-10 permanecem planejados
  para sprints subsequentes.
- "Doc vivo associado" inclui agora `08` (conteúdo educacional)
  porque a F5 da Sprint 2 materializou o corpus pedagógico em
  `frontend/src/content/juros/` e o subset de lint pedagógico em
  `tools/edu_lint/`.
- Os testes pedagógicos de regressão (`backend/tests/regression/pedagogical/`)
  permanecem **pendentes** — `materialized_in_repo=false` para esse caminho.
  A cobertura runtime equivalente (presença de blocos pedagógicos no
  conteúdo do frontend) é exercida por
  `frontend/src/__tests__/content/juros/conteudo.test.ts`.

## 7. Atualiza??es de status ? Sprint 3 (F2/F3 oficiais)

| Linha | Mudan?a | Sprint / Fatia |
|-------|---------|----------------|
| RF-AMO-001 | `pending` -> `in_progress` com dominio puro F2 e service/API/contrato F3 materializados no backend. | Sprint 3 F2/F3 |
| RF-AMO-002 | `pending` -> `in_progress` com dominio puro F2 e service/API/contrato F3 materializados no backend. | Sprint 3 F2/F3 |
| RF-AMO-003 | Linha adicionada para o comparativo `POST /api/v1/amortization/compare`, com contrato OpenAPI runtime e versionado. | Sprint 3 F3 |

Notas:
- O status permanece `in_progress` porque a jornada completa de amortizacao ainda nao inclui frontend nesta fatia.
- A F3 tambem sincroniza `docs/api/openapi.json`, incluindo catch-up dos endpoints de juros ja existentes e os tres endpoints publicos de amortizacao.
