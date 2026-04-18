# Validação Oficial — Sprint 1

**Sprint:** 01
**Responsável:** Claude Code (executora), Moisés (operador)
**Plano:** `sprint-1/00_plano/PLANO_EXECUCAO_SPRINT_1.md` v1.1
**Prompt:** `Prompt Sprint 1` §13
**Veredito proposto:** ✅ **APROVADA**
**Pendências residuais declaradas:** ver §5

---

## 1. Relação com a Sprint 0

Conforme PLANO v1.1 §13.3, esta validação declara:

> As condicionantes **C1** (migrar pacote de auditoria para `docs/`) e **C3**
> (confirmar identidade e caminho de `doc-27`) registradas em
> `docs/sprints/sprint-00/validacao-oficial.md` §4 passam a estar **atendidas
> a partir desta sprint**. O veredito histórico da Sprint 0
> ("APROVADA COM LIBERAÇÃO CONDICIONADA") permanece **inalterado**. Esta
> sprint não reabre, não reprocessa e não altera artefato algum da Sprint 0.

A confirmação granular está em
`docs/sprints/sprint-01/evidencias/pendencias-herdadas-fechamento.md`.

---

## 2. Mapeamento dos critérios de aceite do Prompt Sprint 1 §13

| # | Critério (§13 do Prompt Sprint 1) | Entregue em | Evidência |
|---|---|---|---|
| A1 | Contrato-base HTTP com envelope de sucesso `{success, message, data, meta}` | Fatia 1 | `tests/unit/test_envelope.py` (13 casos); `tests/contract/test_contract_base.py` (3 casos). |
| A2 | Erros no formato RFC 7807 (`application/problem+json`) | Fatia 1 | `backend/app/core/errors.py`; `tests/contract/test_error_handling.py` (7 casos). |
| A3 | Correlação via `X-Request-ID` (extraído ou gerado) | Fatia 1 | `backend/app/core/request_id.py`; validado em todos os casos contract. |
| A4 | Versionamento por URL `/api/v1` (ADR-0006) | Fatia 1 | `backend/app/api/v1/`; prefixo registrado em `app/main.py`. |
| A5 | Shell navegável com sidebar + header + main + footer | Fatia 2 | `frontend/src/components/shell/*.tsx`; testes em `__tests__/components/{Sidebar,Header,ShellLayout}.test.tsx`. |
| A6 | 12 rotas canônicas navegáveis (slugs do Doc 06) | Fatia 2 | `frontend/src/app/(app)/<slug>/page.tsx` × 12; `__tests__/app/routes.test.tsx` (12 casos). |
| A7 | 3 estados reutilizáveis (Loading/Error/Empty) com API uniforme | Fatia 2 | `frontend/src/components/states/*.tsx`; `__tests__/components/states.test.tsx` (9 casos). |
| A8 | 4 componentes UI reutilizáveis (SummaryCard/AlertBanner/FormSection/EducationPanel) | Fatia 2 | `frontend/src/components/ui/*.tsx`; `__tests__/components/ui.test.tsx` (11 casos). |
| A9 | Banner educacional persistente (Doc 18) | Fatia 2 | `frontend/src/components/shell/EducationalNotice.tsx`; teste de landmark em `ShellLayout.test.tsx`. |
| A10 | Fonte única dos módulos | Fatia 2 | `frontend/src/config/modules.ts` + helpers. |
| A11 | 4 artefatos canônicos de sprint-01 existem e são rastreáveis | Fatia 3 | `docs/sprints/sprint-01/{relatorio-execucao,relatorio-forense,validacao-oficial}.md` + `evidencias/`. |
| A12 | Doc 04 §6.3 atualizado refletindo a materialização do contrato-base | Fatia 3 | `docs/04_Arquitetura_de_Software.md` §6.3. |
| A13 | Inventário de telas reflete 12 slugs reais | Fatia 3 | `docs/ui/INVENTARIO_TELAS.md` §1 e §6. |
| A14 | Matriz de rastreabilidade com linhas da Sprint 1 | Fatia 3 | `docs/19_Matriz_Rastreabilidade.md` (REQ-CTR-001, RF-HEALTH-001). |
| A15 | Doc 27 registra `v1 active` com início formal | Fatia 3 | `docs/27_Versionamento_API.md` §6. |
| A16 | `living_docs.json` sincronizado | Fatia 3 | `docs/_meta/living_docs.json` (`$schema_version: 3`). |
| A17 | README pós-Sprint 1 com comandos funcionais | Fatia 3 | `README.md`. |
| A18 | Agente de impacto no CI em modo advisory | Fatia 4 | `.github/workflows/ci.yml` (job `impact-advisory`); `evidencias/impact-agent-ci.md`. |
| A19 | Nenhuma regra CND-03 transgredida silenciosamente | Fatia 3 | Divergência do promover `advisory → warning → blocking` declarada em §4 deste documento e registrada como pendência para Sprint 2. |

---

## 3. Quality gates

| Gate | Resultado | Evidência |
|---|---|---|
| `make verify` (backend) | 🟡 Ruff + pytest-unit verdes; `mypy` continua vermelho no erro **pré-existente** de `alembic` em `app/db/migrations/env.py` | `evidencias/make-verify-backend.txt` |
| `make test-contract` | ✅ 10/10 | `evidencias/make-test-contract.txt` |
| `pnpm lint` | ✅ 0 warnings/errors | `evidencias/make-verify-frontend-lint.txt` |
| `pnpm format:check` | ✅ "All matched files use Prettier code style!" | `evidencias/make-verify-frontend-format.txt` |
| `pnpm typecheck` | ✅ clean | `evidencias/make-verify-frontend-tsc.txt` |
| `pnpm test` | ✅ 8/8 arquivos; 61/61 casos | `evidencias/make-verify-frontend-test.txt` |
| `scripts/export_openapi.py` | ✅ spec regerada e verificada | `evidencias/openapi-diff.md` |
| Step `impact-advisory` no CI | ✅ verde (advisory) | `evidencias/impact-agent-ci.md` |

---

## 4. Divergência em relação a CND-03 — declarada honestamente

O `LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md` prevê, em CND-03, promoção do
agente de impacto de *advisory* → *warning* ao fim da Sprint 0 e
→ *blocking* ao fim da Sprint 1. O **Prompt Sprint 1 §5.1.5** determina
explicitamente modo **advisory** ("sem produzir bloqueio indevido"). Esta
sprint entrega o job `impact-advisory` nesse modo, e a transição para
*warning*/*blocking* é **pendência residual formal** para a Sprint 2,
condicionada a ADR-0002 (critérios de WARNING) e instrumentação adicional.

Isto foi acordado em PLANO v1.1 §6.4 e está registrado também em
`pendencias-herdadas-fechamento.md`.

---

## 5. Pendências residuais declaradas

1. `mypy import-not-found` em `backend/app/db/migrations/env.py` — herdado
   da Sprint 0 (declarado em §9 do `relatorio-execucao.md` da Sprint 0).
   **Sprint alvo:** sprint de higiene (candidata à Sprint 2).
2. Playwright / snapshots visuais das 12 rotas — §12 do Prompt Sprint 1
   exclui E2E complexo. **Sprint alvo:** Sprint 2.
3. ADR-0002 (critérios de *WARNING* do agente de impacto) + promoção do
   modo *advisory* → *warning* → *blocking*. **Sprint alvo:** Sprint 2.
4. `openapi.json` passa a incluir `/api/v1/contract/ping`, mas os 15
   endpoints de domínio do Doc 06 permanecem **não implementados**.
   **Sprint alvo:** Sprints 2–5 (por domínio).

---

## 6. Assinaturas

- **Executora:** Claude Code — 18/abr/2026
- **Operador:** Moisés — 18/abr/2026
- **Veredito:** ✅ **APROVADA** com pendências residuais §5
- **Referência cruzada:** `docs/sprints/sprint-01/relatorio-execucao.md`,
  `docs/sprints/sprint-01/relatorio-forense.md`.
