# Fechamento das pendências herdadas — §9 do `relatorio-execucao.md` da Sprint 0

**Fonte:** `docs/sprints/sprint-00/relatorio-execucao.md` §9
**Plano de referência:** `sprint-1/00_plano/PLANO_EXECUCAO_SPRINT_1.md` v1.1 §6.3 e §13

> Nota de preservação do veredito da Sprint 0 (PLANO v1.1 §13.3):
>
> As condicionantes **C1** e **C3** registradas em
> `docs/sprints/sprint-00/validacao-oficial.md` §4 passam a estar **atendidas
> a partir desta sprint**. A Sprint 0 continua com o veredito histórico
> "APROVADA COM LIBERAÇÃO CONDICIONADA"; nenhum artefato da Sprint 0 é
> alterado por esta sprint.

---

## 1. Checklist integral

| # | Pendência declarada na Sprint 0 | Sprint alvo | Status após Sprint 1 | Evidência |
|---|---|---|---|---|
| 1 | Migrar docs de `AUDITORIA_PROMPT_1_FINAL/` para `docs/` com paths corretos | Sprint 1 | ✅ **CONCLUÍDA** — executada em commit **`c31790a`** (Sprint 0 adendo). Confirmada nesta sprint pela atualização de `_meta/living_docs.json` e pelo `SINCRONIZACAO_DOCS_SPRINT01.md`. | `docs/_meta/living_docs.json`; `docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md` |
| 2 | Atualizar `living_docs.json` com paths reais | Sprint 1 | ✅ **CONCLUÍDA** — arquivo regerado nesta Fatia 3 (`$schema_version: 3`; 63+ documentos; `generated_at: 2026-04-18`; entradas de `sprint-01` adicionadas). | `docs/_meta/living_docs.json` |
| 3 | Integrar impact agent no CI (step advisory) | Sprint 1 | ✅ **CONCLUÍDA** na Fatia 4 — job `impact-advisory` em `.github/workflows/ci.yml` paralelo, `continue-on-error: true`, advisory (CND-03 declarada abaixo). | `.github/workflows/ci.yml`; `evidencias/impact-agent-ci.md` |
| 4 | Atualizar `README.md` com guia de setup pós-Sprint 0 | Sprint 1 | ✅ **CONCLUÍDA** — `README.md` atualizado nesta Fatia 3 (seção "Pós-Sprint 1" + comandos reais validados). | `README.md` |
| 5 | Testes de render de componentes frontend | Sprint 1 | ✅ **CONCLUÍDA** na Fatia 2 — 61 casos Vitest em 8 arquivos cobrindo shell, estados, UI, Home e as 12 rotas. | `frontend/src/__tests__/**`; `evidencias/make-verify-frontend-test.txt` |
| 6 | Snapshots visuais (Playwright) | Sprint 1 | 🟡 **PARCIAL** — snapshot leve de `ShellLayout` entregue nesta Fatia 2. Playwright completo fica como pendência residual (Prompt §12 exclui E2E complexo). | `frontend/src/__tests__/components/ShellLayout.test.tsx` |
| 7 | `docs/19_Matriz_Rastreabilidade.md` | Sprint 1 | ✅ **CONCLUÍDA** — linhas do contrato-base (REQ-CTR-001) e do health (RF-HEALTH-001) adicionadas. | `docs/19_Matriz_Rastreabilidade.md` |
| 8 | `docs/27_Versionamento_API.md` | Sprint 1 | ✅ **CONCLUÍDA** — apêndice vivo atualizado para `v1 active, 2026-04`. **Atende também à condicionante C3 da Sprint 0** (confirmação de identidade e caminho do doc-27). | `docs/27_Versionamento_API.md` §6 |
| 9 | ADR-002 (critérios WARNING do agente) | Sprint 2 | ❌ **Fora de escopo por decisão explícita** — §12 do Prompt Sprint 1 exclui evolução do agente; promoção *advisory → warning* exige este ADR. **Reafirmado como pendência Sprint 2.** | `validacao-oficial.md` §4; `PLANO` v1.1 §6.4 |
| 10 | `openapi.json` reflete apenas endpoints de health (domínios não implementados) | Contínuo | 🟢 **PARCIAL** — passa a incluir `/api/v1/contract/ping` (rota-demo pública) com envelope + RFC 7807 registrados como `default`. Domínios permanecem pendentes, a serem materializados nas Sprints 2–5. | `docs/api/openapi.json`; `evidencias/openapi-diff.md` |

Legenda: ✅ concluída · 🟢 parcial (com plano) · 🟡 parcial (com risco declarado) · ❌ fora de escopo

---

## 2. Condicionantes formais da Sprint 0 (§4 de `validacao-oficial.md`)

| Código | Condicionante | Status após Sprint 1 | Observação |
|---|---|---|---|
| **C1** | Migrar docs do pacote de auditoria para `docs/` e atualizar `living_docs.json` | ✅ ATENDIDA A PARTIR DESTA SPRINT | Migração já ocorreu em `c31790a`; `living_docs.json` atualizado nesta fatia. |
| **C2** | *(não aplicável à Sprint 1 — escopo da Sprint 0 fechada)* | — | Preservada por §13.3 do PLANO. |
| **C3** | Confirmar identidade e caminho de `doc-27` (Versionamento de API) | ✅ ATENDIDA A PARTIR DESTA SPRINT | `docs/27_Versionamento_API.md` atualizado como confirmação formal; entrada correspondente em `living_docs.json`. |

**Importante:** o veredito histórico da Sprint 0
("APROVADA COM LIBERAÇÃO CONDICIONADA" — §7 Status final) permanece
**inalterado**. Esta sprint apenas desbloqueia prospectivamente C1 e C3
para fins operacionais da Sprint 1 em diante.

---

## 3. Divergência CND-03 declarada honestamente

O `LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md` prevê, em CND-03, a promoção
*advisory → warning* ao fim da Sprint 0 e → *blocking* ao fim da Sprint 1.
O Prompt Sprint 1 §5.1.5 determina **advisory** nesta sprint; a promoção
é pendência residual formal para a Sprint 2.

Rastreabilidade:

- `docs/sprints/sprint-01/validacao-oficial.md` §4.
- `sprint-1/00_plano/PLANO_EXECUCAO_SPRINT_1.md` v1.1 §6.4.
- Este checklist, item #9.

---

## 4. Referências cruzadas

- `docs/sprints/sprint-01/relatorio-execucao.md` §9 — resumo executivo das
  pendências remanescentes pós-Sprint 1.
- `docs/sprints/sprint-01/validacao-oficial.md` §5 — pendências residuais
  formais pós-aprovação.
- `docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md` — matriz documental completa.
