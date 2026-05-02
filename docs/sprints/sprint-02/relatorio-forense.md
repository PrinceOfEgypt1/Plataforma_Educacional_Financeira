# Relatório Forense — Sprint 2

**Sprint:** 02
**Responsável:** Claude Code (executora), Moisés (operador)
**Plano:** `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` v1.5
**Status:** doc-only (F6) — encerramento formal pendente do operador.
**Escopo deste documento:** granularidade técnica fatia-a-fatia +
cadeia de custódia + observações forenses.

---

## 1. Granularidade das evidências (commit ↔ arquivo ↔ linhas)

### 1.1 Fatia F1 — Pré-voo / governança (commit `0251c42`, PR #5)

| Arquivo                                                          | Mudança                                  |
|-------------------------------------------------------------------|-------------------------------------------|
| `CLAUDE.md`                                                       | Versionada explicitamente neste commit.   |
| `docs/sprints/sprint-02/evidencias/base-branch.md`                | Estado inicial da branch.                 |
| `docs/sprints/sprint-02/evidencias/main-verify-baseline.md` + `.log` | Saída do `make verify` em `main` antes da F2. |
| `docs/sprints/sprint-02/evidencias/impact-agent-estado-inicial.md` | Confirmação da presença do workflow advisory. |
| `docs/sprints/sprint-02/evidencias/F1-staging-proof.md`           | Prova de staging/commit antes da F1.       |

Sem alteração em código de produção nesta fatia.

### 1.2 Fatia F2 — Domínio de Juros (commit `e4e56ac`, PR #6)

| Arquivo                                                                   | Mudança                                        |
|----------------------------------------------------------------------------|------------------------------------------------|
| `backend/app/domain/interest/__init__.py`                                  | barrel do domínio.                              |
| `backend/app/domain/interest/simple.py`                                    | função pura `calcular`.                         |
| `backend/app/domain/interest/compound.py`                                  | função pura `calcular` com aporte opcional.     |
| `backend/app/domain/interest/_rounding.py`                                  | utilitário interno de arredondamento.            |
| `backend/tests/unit/domain/interest/__init__.py`                            | pacote de testes.                                |
| `backend/tests/unit/domain/interest/test_simple.py`                         | exercita JS-01..03.                              |
| `backend/tests/unit/domain/interest/test_compound.py`                       | exercita JC-01..03 (incl. aporte).               |
| `backend/tests/unit/domain/interest/test_properties.py`                     | property-based (Hypothesis).                     |

### 1.3 Fatia F3 — Service + Endpoints + Contrato (commit `2ae0bb2`, PR #7)

| Arquivo                                                                          | Mudança                                          |
|----------------------------------------------------------------------------------|---------------------------------------------------|
| `backend/app/services/interest/calcular_juros_service.py`                         | service que orquestra simples/compostos/comparar. |
| `backend/app/api/v1/interest.py`                                                  | router `POST /api/v1/interest/{simple,compound,compare}`. |
| `backend/app/api/v1/router.py`                                                    | inclusão do router de interest no v1.             |
| `backend/tests/integration/api/interest/test_simple.py`                            | rodada full do endpoint simples.                  |
| `backend/tests/integration/api/interest/test_compound.py`                          | rodada full do endpoint compostos.                |
| `backend/tests/integration/api/interest/test_compare.py`                           | rodada full do endpoint comparar.                 |
| `backend/tests/integration/api/interest/test_errors.py`                            | erros 422 / RFC 7807.                              |
| `backend/tests/contract/test_interest.py`                                          | contrato (schemathesis).                           |
| `backend/tests/unit/services/interest/test_calcular_juros_service.py`              | unit do service.                                  |
| `docs/api/openapi.json`                                                            | regerado por `scripts/export_openapi.py`.         |

### 1.4 Fatia "F5 emergencial" / Pipeline oficial (commit `7841049`, PR #8)

| Arquivo                                | Mudança                                                                |
|-----------------------------------------|------------------------------------------------------------------------|
| `scripts/pipeline.ps1`                  | gates Windows: ruff, ruff format, mypy, bandit, pytest unit + contract; pnpm format:check + typecheck + test. |
| `scripts/pipeline.sh`                   | gates Linux/WSL: idem.                                                  |

### 1.5 Fatia F4 — Frontend `/juros` (commit `f1336d8`, PR #9)

| Arquivo                                                                | Mudança                                              |
|-------------------------------------------------------------------------|-------------------------------------------------------|
| `frontend/src/app/(app)/juros/page.tsx`                                 | página real do módulo (substitui `ModulePage`).       |
| `frontend/src/components/interest/JurosTabs.tsx`                        | tabs WAI-ARIA (3 abas).                                |
| `frontend/src/components/interest/JurosSimplesPanel.tsx`                | painel simples.                                        |
| `frontend/src/components/interest/JurosCompostosPanel.tsx`              | painel compostos.                                      |
| `frontend/src/components/interest/CompararJurosPanel.tsx`               | painel comparar.                                       |
| `frontend/src/components/interest/JurosSimplesForm.tsx`                 | form simples.                                          |
| `frontend/src/components/interest/JurosCompostosForm.tsx`               | form compostos.                                        |
| `frontend/src/components/interest/CompararJurosForm.tsx`                | form comparar.                                         |
| `frontend/src/components/interest/{formValidation,formPrimitives}.tsx`  | validação e primitivas.                                |
| `frontend/src/components/interest/AmortizacaoTables.tsx`                | tabelas de amortização.                                |
| `frontend/src/components/interest/EvolucaoSaldoChart.tsx`               | gráfico recharts.                                      |
| `frontend/src/components/interest/JurosAlerts.tsx`                      | render de alertas tipados.                             |
| `frontend/src/components/interest/JurosInterpretation.tsx`              | render do `interpretation` do backend.                 |
| `frontend/src/components/interest/SummaryGrid.tsx`                      | painéis de resumo (3 variantes).                        |
| `frontend/src/components/interest/JurosSimulationState.ts`              | máquina de estado mínima do painel.                    |
| `frontend/src/components/interest/index.ts`                              | barrel.                                                |
| `frontend/src/types/interest.ts`                                         | tipos espelhados do backend.                           |
| `frontend/src/services/interest.ts`                                      | wrapper Axios.                                         |
| `frontend/src/lib/api/{client,envelope,problem}.ts`                       | fronteira de API.                                      |
| `frontend/src/__tests__/app/juros.test.tsx` (versão F4)                  | smoke da rota.                                         |
| `frontend/src/__tests__/components/interest/*.test.tsx` (5 arquivos)     | unit dos componentes.                                  |

### 1.6 Fatia F5 oficial — Conteúdo Educacional + Docs vivos (commit `f20a180`, PR #10)

| Arquivo                                                                                      | Mudança                                                                                                                            |
|-----------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `frontend/src/content/juros/index.ts`                                                          | tipos + barrel + `DISCLAIMER_EDUCACIONAL`.                                                                                          |
| `frontend/src/content/juros/nivel-1.ts`                                                        | 4 blocos N1.                                                                                                                       |
| `frontend/src/content/juros/nivel-2.ts`                                                        | 4 blocos N2.                                                                                                                       |
| `frontend/src/content/juros/glossario.ts`                                                      | 8 termos.                                                                                                                          |
| `frontend/src/components/interest/JurosSaibaMais.tsx`                                          | bloco pedagógico.                                                                                                                   |
| `frontend/src/components/interest/index.ts`                                                    | +export `JurosSaibaMais`.                                                                                                          |
| `frontend/src/app/(app)/juros/page.tsx`                                                        | reescrita: `<section data-testid="juros-aprenda-mais">` com 4 cards `<JurosSaibaMais />`.                                          |
| `frontend/src/__tests__/app/juros.test.tsx`                                                     | reescrita: 7 casos (2 F4 + 5 F5).                                                                                                  |
| `frontend/src/__tests__/components/interest/JurosSaibaMais.test.tsx`                            | 5 casos.                                                                                                                           |
| `frontend/src/__tests__/content/juros/conteudo.test.ts`                                         | 8 casos.                                                                                                                           |
| `tools/__init__.py`, `tools/edu_lint/{__init__,__main__,edu_lint,README}.{py,md}`              | subset determinístico do lint pedagógico.                                                                                          |
| `Makefile`                                                                                     | +alvo `lint-pedagogical` e `.PHONY` atualizada.                                                                                    |
| `docs/06_API_e_Contratos.md`                                                                   | sem alteração estrutural; §15.3 já listava os 3 endpoints.                                                                         |
| `docs/08_Conteudo_Educacional.md`                                                              | +§13.1 (glossário materializado) + nota Sprint 2 em §20.                                                                           |
| `docs/09_Qualidade_Testes.md`                                                                  | +§16 (massa F4) + §16.3 política (sem placeholder).                                                                                 |
| `docs/15_Casos_de_Teste_Matematicos.md`                                                        | "Materializado em código:" em JS-01..03 / JC-01..03 + §9 cross-link.                                                               |
| `docs/19_Matriz_Rastreabilidade.md`                                                            | RF-INT-001 / RF-INT-002 → `done` com caminhos reais; +§6 histórico.                                                                 |
| `docs/_meta/living_docs.json`                                                                  | bump `updated_at` + notas individuais.                                                                                              |
| `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md`                                    | +linha 1.3 no histórico de revisões.                                                                                                |
| `docs/sprints/sprint-02/evidencias/F5-{revisao-editorial,lint-pedagogico,validacoes-locais}.md` | 3 evidências F5.                                                                                                                    |

### 1.7 Fatia F6 — Fechamento + Governança (esta sessão, doc-only)

| Arquivo                                                                          | Mudança                                                  |
|----------------------------------------------------------------------------------|----------------------------------------------------------|
| `docs/sprints/sprint-02/evidencias/F6-decisao-impact-agent.md`                    | Decisão: preservar `advisory`.                             |
| `docs/sprints/sprint-02/evidencias/F6-validacao-final.md`                         | Comandos rodados/não rodados + protocolo do operador.     |
| `docs/sprints/sprint-02/evidencias/F6-relatorio-final-sprint-2.md`                | Consolidado executivo.                                     |
| `docs/sprints/sprint-02/relatorio-execucao.md`                                    | NOVO — canônico (Opção A do micro-adendo F6 v2).         |
| `docs/sprints/sprint-02/relatorio-forense.md`                                     | NOVO — este arquivo.                                      |
| `docs/sprints/sprint-02/validacao-oficial.md`                                     | NOVO — canônico.                                          |
| `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md`                      | +linhas 1.4 (F6 v1) e 1.5 (F6 v2) no histórico.           |
| `docs/_meta/living_docs.json`                                                     | bump `updated_at` + notas F6 + 3 entradas novas dos canônicos. |

Nenhum outro arquivo é tocado pela F6 v2.

---

## 2. Saídas integrais das execuções

### 2.1 Fase 0 da F6 v2 (sandbox de chat — saída literal)

```
$ git status -sb
## sprint-2/f6-fechamento-governanca...origin/main

$ git branch --show-current
sprint-2/f6-fechamento-governanca

$ git rev-parse --short HEAD
f20a180

$ git rev-parse --short origin/main
f20a180

$ git log --oneline --decorate -5
f20a180 (HEAD -> sprint-2/f6-fechamento-governanca, origin/main, origin/HEAD, main) feat(sprint-2): materializar conteúdo educacional e docs vivos (#10)
f1336d8 (sprint-2/f5-conteudo-docs-vivos) feat(sprint-2): implementar frontend de juros (#9)
7841049 chore(sprint-2): materializar pipeline oficial (#8)
2ae0bb2 feat(interest): expor endpoints REST de juros (#7)
e4e56ac feat(interest): implementar dominio de juros simples e compostos (#6)
```

### 2.2 Sandbox — gates rodados

| Comando                                           | Resultado                                              |
|---------------------------------------------------|--------------------------------------------------------|
| `prettier --check` (10 arquivos da F5 v2)         | `All matched files use Prettier code style!` / EXIT 0  |
| `python -m tools.edu_lint frontend/src/content`   | `0 bloqueio(s), 0 aviso(s)` / EXIT 0                  |
| `python -m tools.edu_lint --strict ...`           | idem / EXIT 0                                           |
| Validação JSON `living_docs.json`                  | `JSON OK`                                               |

### 2.3 Sandbox — gates NÃO rodados (limitação ambiental ou política)

| Comando                              | Motivo                                                                                |
|--------------------------------------|---------------------------------------------------------------------------------------|
| `bash scripts/pipeline.sh`           | Vinculante apenas no WSL Ubuntu pelo operador (CLAUDE.md + PLANO §10).                |
| `make lint-pedagogical`              | F6 v2 é doc-only; o lint pedagógico apenas confirma o que a F5 oficial já entregou.   |
| `pnpm format:check`                  | F6 v2 não toca arquivos `.ts`/`.tsx`.                                                |
| `pnpm typecheck`                     | Idem.                                                                                  |
| `pnpm test --run`                    | Idem.                                                                                  |
| `tsc --noEmit` (na sandbox)          | FUSE quebra symlinks pnpm.                                                            |
| Dry-run de Impact Agent `blocking`   | Decisão F6 é **preservar `advisory`** — ver `F6-decisao-impact-agent.md`.            |

---

## 3. Cadeia de custódia (reprodutibilidade)

1. **Branches por fatia, derivadas de `main`** atualizado a cada
   merge (PLANO §4.1).
   - F1: branch interna mergeada via PR #5 → `0251c42`.
   - F2: branch `sprint-2/f2-...` → PR #6 → `e4e56ac`.
   - F3: branch `sprint-2/f3-...` → PR #7 → `2ae0bb2`.
   - F5 emergencial: PR #8 → `7841049` (operacional, fora do
     número original do plano).
   - F4: branch `sprint-2/f4-...` → PR #9 → `f1336d8`.
   - F5 oficial: branch `sprint-2/f5-conteudo-docs-vivos` (ainda
     visível em local) → PR #10 → `f20a180`.
   - F6: branch `sprint-2/f6-fechamento-governanca` (esta sessão)
     → PR a abrir.
2. **Squash-merge direto em `main`**, uma PR por fatia. Sem branch-mãe
   persistente. Sem PR agregador.
3. **Nenhum push direto em `main`** durante toda a sprint. O `main`
   só recebeu merge via squash.
4. **Nenhuma credencial ou segredo** foi commitada — varredura
   visual dos diffs e hook de pré-commit herdado da Sprint 0.
5. **OpenAPI regenerado** na F3 com `APP_ENV=ci` via
   `scripts/export_openapi.py`. O router debug
   `/api/v1/contract/errors/{kind}` continua **fora** do OpenAPI
   público.
6. **Nenhuma escrita em `main`, repositório ou PR pelo executor de
   chat** durante a F6 v2: a entrega é OFF-REPO em pacote auditável
   substitutivo.

---

## 4. Observações forenses finais

- Nenhum arquivo da Sprint 0 ou Sprint 1 foi alterado por qualquer
  fatia desta sprint.
- Nenhum artefato de release, tag ou branch protegida foi tocado.
- A duplicidade "F5 emergencial" (PR #8) × "F5 oficial" (PR #10)
  foi tratada como dupla materialização consciente, registrada
  literalmente no histórico do plano (linhas 1.3 e 1.4).
- A correção em duas etapas da F5 oficial (v1 rejeitada → v2
  aceita pelo auditor → mergeada como #10) está registrada em
  `docs/sprints/sprint-02/evidencias/F5-validacoes-locais.md` e
  referenciada em §7 do `relatorio-execucao.md`.
- A correção em duas etapas da F6 (v1 rejeitada → v2 — esta sessão)
  está registrada em §3 deste documento e em §3 do
  `relatorio-execucao.md`.
- Nenhum gate foi enfraquecido em qualquer fatia. Pendências
  STRETCH/CONDICIONAL foram **declaradas explicitamente** com
  destino concreto, conforme regra de ouro do PLANO §3.4.
- Doc 03 e a planilha xlsx **NÃO foram tocados** em nenhum momento
  da Sprint 2 pela executora de chat.
- O Impact Agent permanece em `advisory`, conforme decisão registrada
  em `docs/sprints/sprint-02/evidencias/F6-decisao-impact-agent.md`.
- Numeração de diretórios: `sprint-02` no repositório (consistente
  com `sprint-01` do espelho da Sprint 1).

Cadeia íntegra. Nenhuma divergência forense não-declarada.
