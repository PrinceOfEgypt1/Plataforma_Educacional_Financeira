# LEITURA DOCUMENTAL — SPRINT 3 (rodada de planejamento)

**Sprint:** 03
**Rodada:** Planejamento auditável (sem código)
**Sessão:** Claude Code (Cowork — chat atual)
**Data:** 2026-05-02
**Versão da evidência:** 1.1 (correção cirúrgica pós-auditoria — micro-adendo v2)
**Commit-base de referência:** `840cbcb` (`main` pós-Sprint 2, PR #11 mergeada)
**Comando-base usado para leitura:** `git show 840cbcb:<path>` e `git ls-tree 840cbcb`
**Limitação ambiental ativa:** anomalia `.git/HEAD` no mount WSL/FUSE — declarada no PLANO_EXECUCAO_SPRINT_3.md §2.1.

**Histórico desta evidência:**
- v1.0 (2026-05-02) — versão inicial junto ao plano v1.0; declarava Doc 11, `relatorio-forense.md` e `openapi.json` como **não-lidos** ou parcialmente lidos.
- v1.1 (2026-05-02) — correção cirúrgica: três documentos antes não-lidos foram materialmente lidos e incorporados (B1, B2, B3 do micro-adendo v2 do auditor).

---

## 1. Finalidade deste arquivo

Este arquivo registra **literalmente** quais documentos da Sprint 3 foram lidos pela sessão de chat na rodada de planejamento, e quais não foram (com motivo). Não substitui as evidências da F1 da Sprint 3 (que serão materializadas pelo operador no WSL Ubuntu — `F1-base-branch.md`, `F1-main-verify-baseline.md`, etc.).

**Honestidade declarada:** esta sessão de chat **não** rodou `git status -sb`, `git rev-parse --short HEAD`, `bash scripts/pipeline.sh` nem `pre-commit run`. A leitura aconteceu por extração `git show 840cbcb:<path>` no sandbox WSL/FUSE, com o ponteiro HEAD do mount corrompido (objetos íntegros — vide PLANO §2.1 e §2.5).

---

## 2. Documentos do §5 do Prompt Sprint 3 — verificação literal por `git cat-file -e 840cbcb:<path>`

| Categoria | Caminho | Existe em `840cbcb`? | Lido na sessão? |
|---|---|---|---|
| Operacional | `CLAUDE.md` | ✅ | ✅ (4.412 bytes) |
| Operacional | `README.md` | ✅ | ✅ (4.033 bytes) |
| Operacional | `Makefile` | ✅ | ✅ (6.653 bytes) |
| Operacional | `scripts/pipeline.sh` | ✅ | ✅ (14.082 bytes — leitura parcial) |
| Operacional | `scripts/pipeline.ps1` | ✅ | ✅ (19.112 bytes — leitura parcial) |
| Doc | `docs/00_INDICE_GERAL.md` | ✅ | ✅ (1.047 bytes) |
| Doc | `docs/02_Escopo_Funcional.md` | ✅ | ✅ (7.320 bytes) |
| Doc | `docs/04_Arquitetura_de_Software.md` | ✅ | ✅ (16.286 bytes — leitura parcial) |
| Doc | `docs/05_Modelagem_de_Dados.md` | ✅ | ✅ (5.698 bytes — leitura parcial) |
| Doc | `docs/06_API_e_Contratos.md` | ✅ | ✅ (11.754 bytes — leitura integral) |
| Doc | `docs/07_UX_UI_e_Navegacao.md` | ✅ | ✅ (5.122 bytes — leitura integral) |
| Doc | `docs/08_Conteudo_Educacional.md` | ✅ | ✅ (12.823 bytes — leitura parcial) |
| Doc | `docs/09_Qualidade_Testes.md` | ✅ | ✅ (11.611 bytes — leitura integral) |
| Doc | `docs/10_Roadmap.md` | ✅ | ✅ (5.358 bytes) |
| Doc | `docs/12_Plano_Operacional.md` | ✅ | ✅ (8.727 bytes — leitura integral) |
| Doc | `docs/13_Backlog_Tecnico.md` | ✅ | ✅ (7.071 bytes — leitura integral) |
| Doc | `docs/15_Casos_de_Teste_Matematicos.md` | ✅ | ✅ (10.316 bytes — leitura integral) |
| Doc | `docs/16_Design_System.md` | ✅ | ✅ (5.932 bytes — leitura parcial) |
| Doc | `docs/19_Matriz_Rastreabilidade.md` | ✅ | ✅ (7.597 bytes — leitura integral) |
| Doc | `docs/25_Release_Readiness.md` | ✅ | ✅ (2.613 bytes — leitura integral) |
| Doc | `docs/26_Seeds_Fixtures.md` | ✅ | ✅ (1.802 bytes — leitura integral) |
| Doc | `docs/27_Versionamento_API.md` | ✅ | ✅ (2.567 bytes — leitura integral) |
| Meta | `docs/_meta/living_docs.json` | ✅ | ✅ (21.769 bytes — leitura cabeçalho + contagem 70 docs) |
| API | `docs/api/openapi.json` | ✅ | ✅ (6.842 bytes — leitura integral via JSON parse na v1.1). **Achados:** OpenAPI 3.1.0; título "Plataforma Educacional Financeira" v0.1.0; **apenas 4 paths** (`/api/v1/contract/ping`, `/health`, `/health/live`, `/health/ready` — todos da Sprint 1); 5 schemas (`HTTPValidationError`, `Meta`, `PingData`, `ResponseEnvelope_PingData_`, `ValidationError`); zero `amortization`/`interest`/`price`/`sac`. Confirma ausência de endpoints de amortização (esperada para Sprint 3) **e** revela ausência inesperada dos endpoints de juros da Sprint 2 — divergência com `relatorio-forense.md` Sprint 2 §1.3 que declara regeneração na F3. Verificado também em `git show 2ae0bb2:docs/api/openapi.json` — mesmos 4 paths. Plano v1.1 §2.2 incorporou como Fato; F3 da Sprint 3 fará catch-up. |
| Pipeline | `docs/operacional/PIPELINE_OFICIAL_QUALIDADE.md` | ✅ | ✅ (9.723 bytes — leitura integral) |
| Baseline | `docs/baseline/03_Regras_de_Negocio.md` | ✅ | ✅ (6.245 bytes — leitura integral; usado para PRICE/SAC §10 e §11) |
| Baseline | `docs/baseline/11_Prompt_Mestre.md` | ✅ | ✅ (7.590 bytes — leitura integral na v1.1). **Achados relevantes:** §3 fixa precedência (Regras de Negócio > Arquitetura > **API e Contratos** > Escopo > UX/UI > Conteúdo > Qualidade > Roadmap > Visão); §15 lista endpoints mínimos com `POST /api/v1/amortization/price-sac` (singular) — **divergente** dos 3 endpoints `{price,sac,compare}` do Doc 06 §15.4 (vivo, prevalece pela própria precedência §3 do Doc 11). Decisão: seguir Doc 06 (vivo); Doc 11 permanece **intocável em PR comum** desta sprint (baseline imutável). Próxima rebaseline de Doc 11 (fora desta sprint) deverá refletir os 3 endpoints. Plano v1.1 §2.3 incorporou como Fato. |
| Baseline | `docs/baseline/21_Governanca_Branches_PRs.md` | ✅ | ✅ (3.066 bytes — leitura integral) |
| Sprint 2 | `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` | ✅ | ✅ (75.620 bytes — leitura integral; gabarito estrutural) |
| Sprint 2 | `docs/sprints/sprint-02/relatorio-execucao.md` | ✅ | ✅ (19.403 bytes — leitura integral) |
| Sprint 2 | `docs/sprints/sprint-02/relatorio-forense.md` | ✅ | ✅ (20.563 bytes — leitura integral na v1.1). **Achados relevantes:** §1.1–§1.7 detalha cadeia commit ↔ arquivo ↔ linhas das 7 fatias da Sprint 2 (incluindo a "F5 emergencial" PR #8 fora da numeração original); §1.3 declara que F3 da Sprint 2 (commit `2ae0bb2`) regerou `docs/api/openapi.json` via `scripts/export_openapi.py` — **divergência:** leitura literal de `git show 2ae0bb2:docs/api/openapi.json` mostra apenas 4 paths Sprint 1, sem juros. Plano v1.1 incorporou esta divergência como Fato em §2.2; F3 da Sprint 3 fará catch-up. §3 (cadeia de custódia): zero push direto em main, todos squash-merge, branches por fatia (modelo §4.1 PLANO Sprint 2 confirmado). §4 (observações forenses): zero alteração em arquivos da Sprint 0/1, zero artefato de release tocado, zero gate enfraquecido — corrobora todas as decisões já no plano v1.0. **Sem novas lições estruturais** que demandem reescrita de fatias. |
| Sprint 2 | `docs/sprints/sprint-02/validacao-oficial.md` | ✅ | ✅ (14.146 bytes — leitura integral) |
| Sprint 2 | `docs/sprints/sprint-02/evidencias/F6-decisao-impact-agent.md` | ✅ | ✅ (leitura parcial — primeiras 60 linhas) |
| Planilha | `docs/operacional/backlog_operacional_acompanhamento.xlsx` | ✅ | ❌ Não lida (binário; decisão Prompt §4 — não tocar planilha; mapeamento "planilha → docs reais" feito a partir do contexto). |

---

## 3. Documentos não-listados no §5 do prompt mas lidos por necessidade técnica

| Caminho | Motivo da leitura |
|---|---|
| `frontend/src/app/(app)/amortizacao/page.tsx` | Confirmar que o placeholder atual ainda é `<ModulePage moduleId="amortizacao" />`. Confirmado. |
| `backend/app/domain/amortization/__init__.py` | Confirmar estado-zero (pasta existe, vazia). Confirmado. |
| `backend/app/schemas/amortization/__init__.py` | Idem. Confirmado vazio. |
| `backend/app/services/amortization/__init__.py` | Idem. Confirmado vazio. |
| `frontend/src/content/juros/types.ts` | Gabarito de tipos pedagógicos para reuso/duplicação no módulo amortização. |
| `.github/workflows/impact-agent.yml` | Confirmar `continue-on-error: true` e cabeçalho "Estágio: ADVISORY". Confirmado. |

---

## 4. Documentos não encontrados — declaração honesta

Não foram encontrados em `840cbcb`:
- `docs/formulas.md` — **inexistente.** Conteúdo equivalente está em `docs/baseline/03_Regras_de_Negocio.md` §10 (PRICE) e §11 (SAC).
- `docs/api-contract.md` — **inexistente.** Equivalente: `docs/06_API_e_Contratos.md`.
- `docs/user-guide.md` — **inexistente.** Equivalentes parciais: `docs/07_UX_UI_e_Navegacao.md` (jornadas) + `docs/16_Design_System.md` (componentes).
- `docs/content-guide.md` — **inexistente.** Equivalente: `docs/08_Conteudo_Educacional.md`.
- `docs/architecture.md` — **inexistente.** Equivalente: `docs/04_Arquitetura_de_Software.md`.

Mapeamento canônico está formalizado no PLANO §2.6 (tabela "planilha → documentos reais").

---

## 5. Verificação ambiental real-time (rodada de chat)

Comandos efetivamente executados pela sessão de chat:

```bash
# Diagnóstico ambiental
od -c .git/HEAD                                          # confirmou padding nulo após "ref: refs/heads/main\n"
git rev-parse 840cbcb                                    # OK → 840cbcbbf1157d2d82cdd758a256be6d25bd0011
git cat-file -t 840cbcb                                  # OK → commit
git for-each-ref                                         # confirmou refs/heads/main → 840cbcb
git ls-tree -r 840cbcb --name-only | wc -l               # 333 arquivos
git show --stat --no-patch 840cbcb                       # confirmou autor/data/mensagem do PR #11

# Verificação de existência por SHA explícito
git cat-file -e 840cbcb:<path>  (para 33 caminhos do §5 do prompt)

# Extração de conteúdo
git show 840cbcb:<path>  >  outputs/_work_s3/<arquivo>

# v1.1 — comandos adicionais para fechar B1, B2, B3:
git show 840cbcb:docs/baseline/11_Prompt_Mestre.md            # 7.590 bytes — OK
git show 840cbcb:docs/sprints/sprint-02/relatorio-forense.md  # 20.563 bytes — OK
git show 840cbcb:docs/api/openapi.json                        # 6.842 bytes — OK
git show 2ae0bb2:docs/api
