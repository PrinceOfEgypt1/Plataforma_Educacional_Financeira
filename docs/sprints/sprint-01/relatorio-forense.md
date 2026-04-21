# Relatório Forense — Sprint 1

**Sprint:** 01
**Responsável forense:** Claude Code (executora)
**Período:** 17–18 de abril de 2026
**Plano de referência:** `sprint-1/00_plano/PLANO_EXECUCAO_SPRINT_1.md` v1.1
**Status:** CONCLUÍDO

> Relação com a Sprint 0 (PLANO v1.1 §13.3): as condicionantes C1 e C3
> registradas em `docs/sprints/sprint-00/validacao-oficial.md` §4 passam a
> estar atendidas a partir desta sprint. A Sprint 0 continua com o veredito
> histórico "APROVADA COM LIBERAÇÃO CONDICIONADA" e nenhum artefato dela é
> alterado por esta sprint.

---

## 1. Granularidade das evidências (commit ↔ arquivo ↔ linhas)

### 1.1 Fatia 1 — Backend (commit hash local `f0b7d5a`)

| Arquivo | Operação | Linhas | Observação forense |
|---|---|---|---|
| `backend/app/core/envelope.py` | criar | 67 | `ResponseEnvelope[T]` + `Meta` + helpers — valida por testes unit `tests/unit/test_envelope.py`. |
| `backend/app/core/errors.py` | criar | 90 | `Problem` + 5 subclasses `DomainError` mapeando `code_*` do Doc 06 §5. |
| `backend/app/core/request_id.py` | criar | 46 | `ContextVar` + `RequestIdMiddleware` + `get_request_id`. |
| `backend/app/api/v1/__init__.py` | criar | 5 | Reexporta `v1_router`. |
| `backend/app/api/v1/router.py` | criar | 12 | Agregador público; importa `contract` e `contract_debug_router`. |
| `backend/app/api/v1/contract.py` | criar | 87 | `/api/v1/contract/ping` (público) + `/api/v1/contract/errors/{kind}` (debug, `include_in_schema=False`). |
| `backend/app/main.py` | alterar | +131 | Registra handlers globais, middleware e v1 router com gating por `APP_ENV`. |
| `backend/tests/unit/test_envelope.py` | criar | 133 | 13 casos. |
| `backend/tests/contract/test_contract_base.py` | criar | 57 | 3 casos. |
| `backend/tests/contract/test_error_handling.py` | criar | 88 | 7 casos. |
| `backend/tests/unit/test_health.py` | higiene | ±12 | PT023 (sem mudança de comportamento). |
| `backend/tests/integration/api/test_health_integration.py` | higiene | ±12 | PT023 (idem). |

**Totais do commit:** 12 arquivos, **+715 / −25** linhas.

### 1.2 Fatia 2 — Frontend (commit hash local `28b5771`)

| Arquivo | Operação | Linhas | Observação forense |
|---|---|---|---|
| `frontend/vitest.config.ts` | criar | 43 | Declarativo do ambiente de teste; exige `esbuild.jsx: "automatic"`. |
| `frontend/src/tests/setup.ts` | criar | 26 | `jest-dom/vitest` + polyfill `matchMedia`. |
| `frontend/src/lib/cn.ts` | criar | 15 | `clsx + tailwind-merge`. |
| `frontend/src/config/modules.ts` | criar | 230 | Fonte única dos 12 módulos + helpers `findModuleByPathname` e `groupModules`. |
| `frontend/src/app/layout.tsx` | alterar | 28 (−127) | Enxugado para HTML lang=pt-BR + children. |
| `frontend/src/app/page.tsx` | remover | −155 | Realocado para `(app)/page.tsx`. |
| `frontend/src/app/(app)/layout.tsx` | criar | 20 | Envelopa o grupo em `ShellLayout`. |
| `frontend/src/app/(app)/page.tsx` | criar | 90 | Home com grid dos 12 módulos. |
| `frontend/src/app/(app)/<slug>/page.tsx` | criar × 12 | 9–11 cada | Uma rota por módulo (delega a `ModulePage`). |
| `frontend/src/components/shell/*.tsx` | criar × 6 | 47–88 cada | `ShellLayout`, `Sidebar`, `Header`, `NavItem`, `EducationalNotice`, `ModulePage`. |
| `frontend/src/components/states/*.tsx` | criar × 4 | 16–55 cada | Loading/Error/Empty + barrel. |
| `frontend/src/components/ui/*.tsx` | criar × 5 | 14–76 cada | Summary/Alert/FormSection/Education + barrel. |
| `frontend/src/__tests__/**` | criar × 7 | 40–121 cada | 61 casos no total. |
| `frontend/src/__tests__/placeholder.test.ts` | remover | −11 | Scaffold da Sprint 0. |

**Totais do commit:** 43 arquivos, **+1785 / −186** linhas.

### 1.3 Fatia 3 — Docs (commit local desta fatia)

| Arquivo | Operação | Papel |
|---|---|---|
| `docs/sprints/sprint-01/relatorio-execucao.md` | criar | Relatório de execução canônico (este repositório de evidência). |
| `docs/sprints/sprint-01/relatorio-forense.md` | criar | Este documento. |
| `docs/sprints/sprint-01/validacao-oficial.md` | criar | Veredito da Sprint 1 com mapeamento §13 do Prompt. |
| `docs/sprints/sprint-01/evidencias/README.md` | criar | Índice das evidências. |
| `docs/sprints/sprint-01/evidencias/openapi-diff.md` | criar | Diff v0→v1 da spec. |
| `docs/sprints/sprint-01/evidencias/impact-agent-ci.md` | criar (stub) | Placeholder — finalizado pela Fatia 4 com o hash do run. |
| `docs/sprints/sprint-01/evidencias/screens/README.md` | criar | Onde colocar capturas de tela. |
| `docs/sprints/sprint-01/evidencias/pendencias-herdadas-fechamento.md` | criar | Checklist do §9 da Sprint 0 com status. |
| `docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md` | criar | Matriz documental desta sprint. |
| `docs/_meta/living_docs.json` | alterar | `generated_at` + entradas de `sprint-01`. |
| `docs/04_Arquitetura_de_Software.md` | alterar | §6.3 — +2 sub-bullets (C4 backend). |
| `docs/ui/INVENTARIO_TELAS.md` | alterar | §1 e §6 — 12 slugs canônicos. |
| `README.md` | alterar | Pós-Sprint 1. |
| `docs/19_Matriz_Rastreabilidade.md` | alterar | Linhas do contrato-base e do health. |
| `docs/27_Versionamento_API.md` | alterar | Apêndice vivo — `v1 active, 2026-04`. |
| `docs/api/openapi.json` | regerar | Inclui `/api/v1/contract/ping` (router debug permanece oculto via `include_in_schema=False`). |

### 1.4 Fatia 4 — CI (commit local desta fatia)

| Arquivo | Operação | Papel |
|---|---|---|
| `.github/workflows/ci.yml` | alterar | Job `impact-advisory` (paralelo, `continue-on-error: true`). |
| `docs/sprints/sprint-01/evidencias/impact-agent-ci.md` | alterar | Finalização com hash do primeiro run verde do step. |

---

## 2. Saídas integrais das execuções

- `docs/sprints/sprint-01/evidencias/base-branch.md` — hashes de `HEAD` da
  base (`origin/main`) e de cada fronteira entre fatias.
- `docs/sprints/sprint-01/evidencias/make-verify-backend.txt` —
  saída completa de `make verify` após a Fatia 1.
- `docs/sprints/sprint-01/evidencias/make-test-contract.txt` —
  saída completa de `make test-contract` após a Fatia 1.
- `docs/sprints/sprint-01/evidencias/make-verify-frontend-full.txt` e os
  quatro logs isolados (`make-verify-frontend-lint.txt`, `-format.txt`,
  `-tsc.txt`, `-test.txt`) — capturados após a Fatia 2.
- `docs/sprints/sprint-01/evidencias/openapi-diff.md` — diff declarativo da
  spec: entradas pós-Fatia 1 são `/api/v1/contract/ping` e o envelope
  RFC 7807 registrado como `default` em todas as rotas.
- `docs/sprints/sprint-01/evidencias/impact-agent-ci.md` — run do
  step `impact-advisory` no CI (finalizado após a Fatia 4).

---

## 3. Cadeia de custódia (reprodutibilidade)

1. Branch `sprint-1` foi criado **dinamicamente** sobre `origin/main`
   seguindo PLANO §2.1. Não há HEAD hardcoded no PLANO nem nos
   CLI_BLOCKs — o hash da base fica gravado no `base-branch.md`.
2. Cada fatia tem um `CLI_BLOCK.sh` único em
   `sprint-1/0N_fatia-N-*/CLI_BLOCK.sh` que é o único caminho oficial de
   aplicação da fatia no CLI do operador.
3. Nenhum `git push` ocorre antes do encerramento das 4 fatias
   (PLANO §8 passo 6). O push é único na abertura do PR.
4. A numeração `sprint-01` nos diretórios do repo corresponde à numeração
   `sprint-1` nos diretórios do workspace do executor — divergência cosmética
   herdada, sem impacto funcional.

---

## 4. Observações forenses finais

- Nenhum arquivo da Sprint 0 foi alterado por qualquer fatia desta sprint.
- Nenhum artefato de release, tag ou branch protegida foi tocado.
- Nenhuma credencial ou segredo foi commitado (confirmado por varredura
  visual dos diffs e pelo hook de pré-commit herdado da Sprint 0).
- A regeneração de `docs/api/openapi.json` foi feita pelo script
  `scripts/export_openapi.py` com `APP_ENV=ci` — conforme previsto,
  o router de debug `/api/v1/contract/errors/{kind}` **não** aparece no
  OpenAPI público (validação visual do diff: a única rota nova pública é
  `/api/v1/contract/ping`).
- O erro `mypy import-not-found` em `backend/app/db/migrations/env.py`
  (herdado da Sprint 0) continua presente e está declarado em
  `pendencias-herdadas-fechamento.md`.
