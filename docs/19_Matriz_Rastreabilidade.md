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
| RF-INT-001 | interest | `POST /api/v1/interest/simple` | `JurosSimplesIn/Out` | `CalcularJurosSimplesService` | `domain.interest.simple.calcular` | JS-01..JS-10 | `tests/unit/domain/interest/test_simple.py` | `tests/integration/api/test_interest_simple.py` | `tests/contract/test_interest.py` | `tests/regression/pedagogical/test_interest.py` | 03,06,09,15,19 | pending |
| RF-INT-002 | interest | `POST /api/v1/interest/compound` | `JurosCompostosIn/Out` | `CalcularJurosCompostosService` | `domain.interest.compound.calcular` | JC-01..JC-10 | ... | ... | ... | ... | 03,06,09,15,19 | pending |
| RF-AMO-001 | amortization | `POST /api/v1/amortization/price` | `PriceIn/Out` | `CalcularPriceService` | `domain.amortization.price.calcular` | PR-01..PR-10 | ... | ... | ... | ... | 03,06,09,15,19 | pending |
| RF-AMO-002 | amortization | `POST /api/v1/amortization/sac` | `SacIn/Out` | `CalcularSacService` | `domain.amortization.sac.calcular` | SAC-01..SAC-10 | ... | ... | ... | ... | 03,06,09,15,19 | pending |
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
