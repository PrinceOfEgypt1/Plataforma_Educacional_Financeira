# F1 — Auditoria do Plano Aplicado — Sprint 3

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F1 — Pré-voo e plano
**Data:** 2026-05-02T18:43:01-03:00
**Ambiente:** WSL Ubuntu

## 1. Objetivo

Registrar a auditoria local do plano da Sprint 3 aplicado a partir do pacote v2 aprovado pelo auditor, incluindo a emenda textual obrigatória da pendência P2 sobre OpenAPI.

## 2. Arquivos materializados nesta F1

```bash
$ find docs/sprints/sprint-03 -type f -print | sort
docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md
docs/sprints/sprint-03/evidencias/F1-auditoria-plano-aplicado.md
docs/sprints/sprint-03/evidencias/F1-base-branch.md
docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md
docs/sprints/sprint-03/evidencias/LEITURA_DOCUMENTAL_SPRINT_3.md
```

## 3. Versões dos artefatos

```bash
$ grep -n "^\*\*Versão:" "$PLAN"
7:**Versão:** 1.1 (correção cirúrgica pós-auditoria — micro-adendo v2)

$ grep -n "Versão da evidência" "$READ"
7:**Versão da evidência:** 1.1 (correção cirúrgica pós-auditoria — micro-adendo v2)
```

## 4. Prova da emenda P2

```bash
$ grep -n "^| P2 |" "$PLAN"
1134:| P2 | OpenAPI runtime atual inspecionado pela IA e encontrado estagnado em 4 paths da Sprint 1 | Anomalia documental herdada | F1 registra snapshot oficial no WSL; F3 regenera OpenAPI e anexa diff com catch-up de juros e novos endpoints de amortização. |

$ grep -q "OpenAPI runtime atual não inspecionado pela IA antes da F3" "$PLAN" && echo "ERRO" || echo "OK: frase obsoleta P2 ausente"
OK: frase obsoleta P2 ausente
```

## 5. Prova dos bloqueadores v1 corrigidos

```bash
$ grep -n "docs/baseline/11_Prompt_Mestre.md" "$READ"
56:| Baseline | `docs/baseline/11_Prompt_Mestre.md` | ✅ | ✅ (7.590 bytes — leitura integral na v1.1). **Achados relevantes:** §3 fixa precedência (Regras de Negócio > Arquitetura > **API e Contratos** > Escopo > UX/UI > Conteúdo > Qualidade > Roadmap > Visão); §15 lista endpoints mínimos com `POST /api/v1/amortization/price-sac` (singular) — **divergente** dos 3 endpoints `{price,sac,compare}` do Doc 06 §15.4 (vivo, prevalece pela própria precedência §3 do Doc 11). Decisão: seguir Doc 06 (vivo); Doc 11 permanece **intocável em PR comum** desta sprint (baseline imutável). Próxima rebaseline de Doc 11 (fora desta sprint) deverá refletir os 3 endpoints. Plano v1.1 §2.3 incorporou como Fato. |
113:git show 840cbcb:docs/baseline/11_Prompt_Mestre.md            # 7.590 bytes — OK

$ grep -n "docs/sprints/sprint-02/relatorio-forense.md" "$READ"
60:| Sprint 2 | `docs/sprints/sprint-02/relatorio-forense.md` | ✅ | ✅ (20.563 bytes — leitura integral na v1.1). **Achados relevantes:** §1.1–§1.7 detalha cadeia commit ↔ arquivo ↔ linhas das 7 fatias da Sprint 2 (incluindo a "F5 emergencial" PR #8 fora da numeração original); §1.3 declara que F3 da Sprint 2 (commit `2ae0bb2`) regerou `docs/api/openapi.json` via `scripts/export_openapi.py` — **divergência:** leitura literal de `git show 2ae0bb2:docs/api/openapi.json` mostra apenas 4 paths Sprint 1, sem juros. Plano v1.1 incorporou esta divergência como Fato em §2.2; F3 da Sprint 3 fará catch-up. §3 (cadeia de custódia): zero push direto em main, todos squash-merge, branches por fatia (modelo §4.1 PLANO Sprint 2 confirmado). §4 (observações forenses): zero alteração em arquivos da Sprint 0/1, zero artefato de release tocado, zero gate enfraquecido — corrobora todas as decisões já no plano v1.0. **Sem novas lições estruturais** que demandem reescrita de fatias. |
114:git show 840cbcb:docs/sprints/sprint-02/relatorio-forense.md  # 20.563 bytes — OK

$ grep -n "docs/api/openapi.json" "$READ"
53:| API | `docs/api/openapi.json` | ✅ | ✅ (6.842 bytes — leitura integral via JSON parse na v1.1). **Achados:** OpenAPI 3.1.0; título "Plataforma Educacional Financeira" v0.1.0; **apenas 4 paths** (`/api/v1/contract/ping`, `/health`, `/health/live`, `/health/ready` — todos da Sprint 1); 5 schemas (`HTTPValidationError`, `Meta`, `PingData`, `ResponseEnvelope_PingData_`, `ValidationError`); zero `amortization`/`interest`/`price`/`sac`. Confirma ausência de endpoints de amortização (esperada para Sprint 3) **e** revela ausência inesperada dos endpoints de juros da Sprint 2 — divergência com `relatorio-forense.md` Sprint 2 §1.3 que declara regeneração na F3. Verificado também em `git show 2ae0bb2:docs/api/openapi.json` — mesmos 4 paths. Plano v1.1 §2.2 incorporou como Fato; F3 da Sprint 3 fará catch-up. |
60:| Sprint 2 | `docs/sprints/sprint-02/relatorio-forense.md` | ✅ | ✅ (20.563 bytes — leitura integral na v1.1). **Achados relevantes:** §1.1–§1.7 detalha cadeia commit ↔ arquivo ↔ linhas das 7 fatias da Sprint 2 (incluindo a "F5 emergencial" PR #8 fora da numeração original); §1.3 declara que F3 da Sprint 2 (commit `2ae0bb2`) regerou `docs/api/openapi.json` via `scripts/export_openapi.py` — **divergência:** leitura literal de `git show 2ae0bb2:docs/api/openapi.json` mostra apenas 4 paths Sprint 1, sem juros. Plano v1.1 incorporou esta divergência como Fato em §2.2; F3 da Sprint 3 fará catch-up. §3 (cadeia de custódia): zero push direto em main, todos squash-merge, branches por fatia (modelo §4.1 PLANO Sprint 2 confirmado). §4 (observações forenses): zero alteração em arquivos da Sprint 0/1, zero artefato de release tocado, zero gate enfraquecido — corrobora todas as decisões já no plano v1.0. **Sem novas lições estruturais** que demandem reescrita de fatias. |
115:git show 840cbcb:docs/api/openapi.json                        # 6.842 bytes — OK
```

## 6. Prova de ocorrências metalinguísticas

```bash
$ grep -n "__init__placeholder" "$PLAN" "$READ" || true
docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md:18:| 1.1 | 2026-05-02 | Equipe de Engenharia (executora de chat) | Correção cirúrgica pós-auditoria do pacote v1 pelo Camaleão (micro-adendo v2). Seis ajustes: (B1) `docs/baseline/11_Prompt_Mestre.md` lido integralmente — incorporado em §2.3 como Fato adicional sobre divergência endpoint singular `price-sac` (Doc 11 §15) vs três endpoints `{price,sac,compare}` (Doc 06 §15.4 — vivo, prevalece); (B2) `docs/sprints/sprint-02/relatorio-forense.md` lido integralmente — confirmou cadeia de custódia da Sprint 2 sem novas lições estruturais, mas revelou que F3 da Sprint 2 declara ter regerado `docs/api/openapi.json` (linha §1.3) enquanto a leitura literal mostra openapi.json estagnado em 4 paths da Sprint 1 — Fato adicional em §2.2; (B3) `docs/api/openapi.json` lido integralmente — confirmado: 4 paths somente (`/api/v1/contract/ping`, `/health`, `/health/live`, `/health/ready`); zero `amortization`, `interest`, `price`, `sac`. Implicação: F3 da Sprint 3 regenera do zero e o diff inclui catch-up de juros + amortização novos; (B4) histórico v1.0 corrigido — `Doc 11` removido da lista de fontes lidas naquela versão, declarando honestamente o que ocorreu; (B5) caminho proibido `frontend/src/services/amortization/__init__placeholder.ts` substituído por `frontend/src/services/amortization/index.ts` (padrão Sprint 2: `frontend/src/services/interest.ts` + barrel mais sub-módulos); (B6) referências frágeis ao caminho local de sandbox `outputs/CONTEXTO_DE_CONTINUIDADE_POS_SPRINT_2.md` (10 ocorrências no plano v1) substituídas pelo texto neutro estável "Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada)". Nenhuma alteração de escopo, arquitetura, fatias ou critérios de aceite. |

$ grep -n "outputs/CONTEXTO_DE_CONTINUIDADE_POS_SPRINT_2" "$PLAN" "$READ" || true
docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md:18:| 1.1 | 2026-05-02 | Equipe de Engenharia (executora de chat) | Correção cirúrgica pós-auditoria do pacote v1 pelo Camaleão (micro-adendo v2). Seis ajustes: (B1) `docs/baseline/11_Prompt_Mestre.md` lido integralmente — incorporado em §2.3 como Fato adicional sobre divergência endpoint singular `price-sac` (Doc 11 §15) vs três endpoints `{price,sac,compare}` (Doc 06 §15.4 — vivo, prevalece); (B2) `docs/sprints/sprint-02/relatorio-forense.md` lido integralmente — confirmou cadeia de custódia da Sprint 2 sem novas lições estruturais, mas revelou que F3 da Sprint 2 declara ter regerado `docs/api/openapi.json` (linha §1.3) enquanto a leitura literal mostra openapi.json estagnado em 4 paths da Sprint 1 — Fato adicional em §2.2; (B3) `docs/api/openapi.json` lido integralmente — confirmado: 4 paths somente (`/api/v1/contract/ping`, `/health`, `/health/live`, `/health/ready`); zero `amortization`, `interest`, `price`, `sac`. Implicação: F3 da Sprint 3 regenera do zero e o diff inclui catch-up de juros + amortização novos; (B4) histórico v1.0 corrigido — `Doc 11` removido da lista de fontes lidas naquela versão, declarando honestamente o que ocorreu; (B5) caminho proibido `frontend/src/services/amortization/__init__placeholder.ts` substituído por `frontend/src/services/amortization/index.ts` (padrão Sprint 2: `frontend/src/services/interest.ts` + barrel mais sub-módulos); (B6) referências frágeis ao caminho local de sandbox `outputs/CONTEXTO_DE_CONTINUIDADE_POS_SPRINT_2.md` (10 ocorrências no plano v1) substituídas pelo texto neutro estável "Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada)". Nenhuma alteração de escopo, arquitetura, fatias ou critérios de aceite. |

$ grep -nEi "\bTBD\b|a preencher|a ser preenchido|preencher depois|A confirmar pelo operador|EXIT real" "$PLAN" "$READ" || true
docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md:688:- **Sem placeholder semântico ativo.** Lição Sprint 2 #2 — proibido em doc vivo: `TBD`, `a preencher`, `EXIT real: (TBD)`, `valor futuro`, `resultado futuro`. Se o dado não existe, vai para relatório de chat, não para doc vivo.
docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md:1051:15. Placeholder materializável (`TBD`, `a preencher`, `valor futuro`, etc.) presente em doc vivo.
docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md:1071:4. Não aceitar placeholder materializável; placeholder semântico também é placeholder. Proibido em doc vivo: `TBD`, `a preencher`, `a ser preenchido`, `preencher depois`, `A confirmar pelo operador`, `EXIT real: (TBD)`, `valor futuro`, `resultado futuro`.
```

## 7. Prova dos gates da F1

```bash
$ grep -n "EXIT_LINT_PED\|EXIT_PIPELINE\|Baseline" "$VERIFY"
1:# F1 — Main Verify Baseline — Sprint 3
39:$ echo EXIT_LINT_PED=0
40:EXIT_LINT_PED=0
245:$ echo EXIT_PIPELINE=0
246:EXIT_PIPELINE=0
252:✅ Baseline verde para a F1 da Sprint 3.
254:- EXIT_LINT_PED=0
255:- EXIT_PIPELINE=0
```

## 8. Status Git

```bash
$ git status -sb
## sprint-3/f1-preveo
?? docs/sprints/sprint-03/

$ git diff --name-only
```

## 9. Resultado

✅ Plano da Sprint 3 aplicado e auditado localmente.

✅ Emenda textual P2 aplicada e validada.

✅ Baseline F1 verde: EXIT_LINT_PED=0 e EXIT_PIPELINE=0.

Esta evidência não substitui revisão humana, PR e checks do GitHub.
