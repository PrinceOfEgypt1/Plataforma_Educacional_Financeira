# Relatório de Execução — Sprint 2

**Sprint:** 02
**Responsável:** Claude Code (executora), Moisés (operador)
**Período:** 21/abr/2026 (planejamento) — 26/abr/2026 (F6 — fechamento documental)
**Plano de referência:** `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` v1.5
**Prompts de referência:** Prompt Sprint 2 (planejamento + 6 fatias) + micro-adendos de F5 (v1, v2) e F6 (v1, v2).
**Status:** **F6 EM CURSO** — encerramento formal pendente de auditoria do
pacote v2 + pipeline verde no WSL Ubuntu pelo operador + merge da F6 em
`main` + janela de observação 30 min + atualização da planilha
operacional pelo PO/ChatGPT.

> Nota relacional com a Sprint 1 (PLANO Sprint 1 §13.3). Este relatório
> não reabre, não reprocessa e não altera artefato algum da Sprint 1. As
> linhas RF-INT-001 / RF-INT-002 da Doc 19 foram promovidas a `done`
> nesta sprint (F5 oficial).

---

## 1. Objetivo da Sprint

Materializar o **módulo de Juros** ponta-a-ponta:

- **Backend:** domínio puro de juros simples e compostos, service,
  endpoints REST `POST /api/v1/interest/{simple,compound,compare}`,
  com testes unit/integration/contract verdes e tipagem estrita.
- **Frontend:** página `/juros` com tabs (simples / compostos /
  comparar), formulário tipado, resultado completo (summary + tabela +
  gráfico + interpretação + alertas), estados Loading/Empty/Error/Success
  e suíte Vitest cobrindo o fluxo.
- **Conteúdo educacional + docs vivos:** corpus de Nível 1 e 2
  para juros, glossário mínimo, integração visível na rota `/juros`,
  subset determinístico do lint pedagógico (Doc 08 §20), atualização
  cirúrgica das Docs 06, 08, 09, 15, 19 e do `living_docs.json`.
- **Pipeline oficial:** `scripts/pipeline.{ps1,sh}` materializado.
- **Governança:** decisão registrada sobre o Impact Agent (default
  preservar `advisory`, conforme PLANO §3.4 / §5.6).

---

## 2. Escopo tratado

### 2.1 Fatia F1 — Pré-voo e higiene herdada

- Atualização de `CLAUDE.md` e prompts operacionais da Sprint 2.
- Evidências em `docs/sprints/sprint-02/evidencias/`:
  `base-branch.md`, `main-verify-baseline.md` (+ `.log`),
  `impact-agent-estado-inicial.md`, `F1-staging-proof.md`.
- Mergeada via PR #5 (commit `0251c42`).

### 2.2 Fatia F2 — Domínio de Juros

- `backend/app/domain/interest/simple.py` — função pura
  `domain.interest.simple.calcular`.
- `backend/app/domain/interest/compound.py` — função pura
  `domain.interest.compound.calcular` com suporte a aporte mensal.
- `backend/app/domain/interest/_rounding.py` — utilitário interno
  de arredondamento.
- Testes unit em `backend/tests/unit/domain/interest/`:
  `test_simple.py`, `test_compound.py`, `test_properties.py`.
- Massa do Doc 15 exercida (JS-01..03, JC-01..03).
- Mergeada via PR #6 (commit `e4e56ac`).

### 2.3 Fatia F3 — Service + Endpoints REST + Contrato

- Service de juros em `backend/app/services/interest/`.
- Endpoint canônico `backend/app/api/v1/interest.py` expondo
  `POST /api/v1/interest/{simple,compound,compare}` com schemas
  Pydantic em I/O e RFC 7807 nos erros.
- Testes integration em
  `backend/tests/integration/api/interest/test_{simple,compound,compare,errors}.py`
  e contract em `backend/tests/contract/test_interest.py`.
- OpenAPI regenerado via `scripts/export_openapi.py`.
- Mergeada via PR #7 (commit `2ae0bb2`).

### 2.4 Fatia "F5 emergencial" / Pipeline oficial

- `scripts/pipeline.ps1` (Windows) + `scripts/pipeline.sh` (Linux/WSL)
  com gates de lint/format/typecheck/unit/contract/regression no
  backend e lint/format/typecheck/test no frontend.
- Materializada fora da numeração F1..F6 do plano original por
  necessidade operacional (auditor solicitou via micro-adendo).
- Mergeada via PR #8 (commit `7841049`).

### 2.5 Fatia F4 — Frontend `/juros`

- `frontend/src/app/(app)/juros/page.tsx` — página real do módulo,
  substituindo o placeholder genérico `ModulePage`.
- `frontend/src/components/interest/`:
  `JurosTabs.tsx`, `JurosSimplesPanel.tsx`, `JurosCompostosPanel.tsx`,
  `CompararJurosPanel.tsx`, `JurosSimplesForm.tsx`,
  `JurosCompostosForm.tsx`, `CompararJurosForm.tsx`,
  `formValidation.ts`, `formPrimitives.tsx`,
  `AmortizacaoTables.tsx`, `EvolucaoSaldoChart.tsx`,
  `JurosAlerts.tsx`, `JurosInterpretation.tsx`,
  `SummaryGrid.tsx`, `JurosSimulationState.ts`, `index.ts`.
- `frontend/src/types/interest.ts` — tipos espelhados do contrato
  do backend.
- `frontend/src/services/interest.ts` — wrapper Axios.
- `frontend/src/lib/api/{client,envelope,problem}.ts` — fronteira
  de API.
- Suíte Vitest com 19 arquivos de teste em `frontend/src/__tests__/`
  (~112 casos exercidos no pipeline WSL Ubuntu durante esta fatia).
- Mergeada via PR #9 (commit `f1336d8`).

### 2.6 Fatia F5 oficial — Conteúdo Educacional + Docs vivos

- `frontend/src/content/juros/`: `index.ts` (tipos + barrel +
  `DISCLAIMER_EDUCACIONAL`), `nivel-1.ts` (4 blocos), `nivel-2.ts`
  (4 blocos), `glossario.ts` (8 termos).
- `frontend/src/components/interest/JurosSaibaMais.tsx` — bloco
  pedagógico que reusa `<EducationPanel />`.
- Integração **visível** na rota `/juros`: a página renderiza, abaixo
  do `<JurosTabs />`, uma `<section data-testid="juros-aprenda-mais">`
  com 4 cards `<JurosSaibaMais />` cobrindo os temas de Nível 1.
- Tests novos:
  `frontend/src/__tests__/content/juros/conteudo.test.ts` (8 casos),
  `frontend/src/__tests__/components/interest/JurosSaibaMais.test.tsx`
  (5 casos), e reescrita de
  `frontend/src/__tests__/app/juros.test.tsx` (7 casos: 2 da F4
  preservados + 5 novos da F5 cobrindo a integração visível).
- `tools/edu_lint/` — subset determinístico do lint pedagógico do
  Doc 08 §20, com regras objetivas (promessa de retorno, moralismo,
  placeholders, disclaimer ausente).
- `Makefile` — alvo `lint-pedagogical`.
- Docs vivos atualizados de forma cirúrgica:
  - Doc 08 §13.1 (glossário materializado) + nota Sprint 2 em §20.
  - Doc 09 §16 (massa F4 confirmada) e §16.3 (política de registro
    de execução, sem placeholder).
  - Doc 15 §9 + cross-link "Materializado em código:" em
    JS-01..03 e JC-01..03.
  - Doc 19: RF-INT-001/002 promovidos `pending → done` com caminhos
    reais; +§6 histórico Sprint 2.
  - `docs/_meta/living_docs.json`: bump `updated_at` + notas
    individuais.
- Evidências em `docs/sprints/sprint-02/evidencias/`:
  `F5-revisao-editorial.md`, `F5-lint-pedagogico.md`,
  `F5-validacoes-locais.md`.
- Mergeada via PR #10 (commit `f20a180`).

### 2.7 Fatia F6 — Fechamento + Governança (esta sessão, doc-only)

- Evidências F6 em `docs/sprints/sprint-02/evidencias/`:
  `F6-decisao-impact-agent.md`, `F6-validacao-final.md`,
  `F6-relatorio-final-sprint-2.md` (consolidado).
- Os **três relatórios canônicos** desta sprint, conforme convenção
  da Sprint 1:
  - `docs/sprints/sprint-02/relatorio-execucao.md` (este arquivo);
  - `docs/sprints/sprint-02/relatorio-forense.md`;
  - `docs/sprints/sprint-02/validacao-oficial.md`.
- Atualização cirúrgica do PLANO (linhas 1.4 e 1.5 no histórico de
  revisões) e do `living_docs.json` (registro dos 3 canônicos).
- **Decisão Impact Agent:** preservar `advisory` (kill-switch §3.4
  acionado). Promoção para `blocking` adiada para Sprint 3 ou
  P-Refino, com ADR-NNNN a abrir antes da próxima tentativa.
- F6 é **doc-only**: nenhum arquivo de runtime (backend, frontend,
  testes, scripts, workflows, configs) foi alterado nesta fatia.

---

## 3. Decisões técnicas registradas

1. **Regime canônico de transporte de moeda e taxa.** Strings com
   2 casas (moeda) e 6 casas (taxa) na fronteira backend↔frontend,
   conforme Doc 06 §4.3 / §5.3 e PLANO §F4. Sem `number` no
   transporte para evitar perda de precisão.
2. **Casos canônicos de validação.** JS-01..03 e JC-01..03 do Doc 15
   exercidos por código nesta sprint (JS-04..10 / JC-04..10
   permanecem planejados).
3. **Conteúdo educacional opt-out via componente isolado, OPT-IN via
   página.** A primeira tentativa da F5 oficial deixou `<JurosSaibaMais />`
   apenas exportado; a v2 corrigiu acoplando à `/juros/page.tsx` em
   `<section data-testid="juros-aprenda-mais">`.
4. **Lint pedagógico parcial agora, completo na Sprint 7.** Doc 08
   §20 prescreve `tools/edu_lint/` em Python; o subset
   determinístico atende ao DoD da Sprint 2 sem prometer o que
   ainda não foi implementado.
5. **Impact Agent preservado em `advisory` na Sprint 2.** Kill-switch
   §3.4 acionado: gatilho `(c)` (aprovação explícita do PO) ausente;
   gatilhos `(a)` e `(b)` indeterminados sem leitura literal dos
   comentários de advisory das PRs no GitHub.
6. **Pipeline oficial materializado fora do número da fatia
   original** (PR #8) por necessidade operacional, sem mudar critérios
   de aceite do plano.

---

## 4. PRs e commits relevantes

| Fatia        | PR  | Commit (squash) | Mensagem                                                                                  |
|--------------|-----|-----------------|--------------------------------------------------------------------------------------------|
| F1           | #5  | `0251c42`       | chore(governance): versionar CLAUDE.md e prompts operacionais da Sprint 2                  |
| F2           | #6  | `e4e56ac`       | feat(interest): implementar dominio de juros simples e compostos                          |
| F3           | #7  | `2ae0bb2`       | feat(interest): expor endpoints REST de juros                                              |
| F5 emergencial | #8 | `7841049`       | chore(sprint-2): materializar pipeline oficial                                             |
| F4           | #9  | `f1336d8`       | feat(sprint-2): implementar frontend de juros                                              |
| F5 oficial   | #10 | `f20a180`       | feat(sprint-2): materializar conteúdo educacional e docs vivos                             |
| F6           | (a abrir) | (a definir)  | doc-only — fechamento + governança da Sprint 2                                             |

Branches utilizadas (modelo branch-por-fatia, PLANO §4.1):
- `sprint-2/f5-conteudo-docs-vivos` (F5 oficial — ainda visível em local).
- `sprint-2/f6-fechamento-governanca` (F6 — esta sessão).
- Demais branches mergeadas e removidas após squash.

---

## 5. Testes criados e ajustados

### Backend

- `backend/tests/unit/domain/interest/test_simple.py`
- `backend/tests/unit/domain/interest/test_compound.py`
- `backend/tests/unit/domain/interest/test_properties.py`
- `backend/tests/unit/services/interest/test_calcular_juros_service.py`
- `backend/tests/integration/api/interest/test_simple.py`
- `backend/tests/integration/api/interest/test_compound.py`
- `backend/tests/integration/api/interest/test_compare.py`
- `backend/tests/integration/api/interest/test_errors.py`
- `backend/tests/contract/test_interest.py`
- (`backend/tests/regression/pedagogical/test_interest.py` continua
  planejado — pendência declarada para Sprint 3.)

### Frontend

19 arquivos de teste em `frontend/src/__tests__/`, dos quais 3 são
novos da F5 oficial:
- `frontend/src/__tests__/content/juros/conteudo.test.ts` (8 casos);
- `frontend/src/__tests__/components/interest/JurosSaibaMais.test.tsx`
  (5 casos);
- reescrita de `frontend/src/__tests__/app/juros.test.tsx` (7 casos:
  2 da F4 preservados + 5 novos da F5).

A contagem total final é determinada pela execução real de
`pnpm test --run` no WSL Ubuntu pelo operador.

---

## 6. Quality gates executados

A execução **vinculante** dos gates é responsabilidade do operador no
WSL Ubuntu via `bash scripts/pipeline.sh`. Esta sessão de chat **não
roda** o pipeline oficial.

### Backend (responsabilidade do operador no WSL)

```
$ make verify
# ruff check, ruff format --check, mypy strict, pytest unit + cov
```

### Frontend (responsabilidade do operador no WSL)

```
$ pnpm format:check
$ pnpm typecheck
$ pnpm test --run
```

### Lint pedagógico (subset Sprint 2 — F5 oficial)

```
$ make lint-pedagogical
# python -m tools.edu_lint
```

### Sandbox de chat — saídas literais executadas nesta sessão

| Validação                                  | Resultado                                              |
|---------------------------------------------|--------------------------------------------------------|
| `prettier --check` (10 arquivos da F5 v2)   | `All matched files use Prettier code style!` / EXIT 0  |
| `python -m tools.edu_lint frontend/src/content` | `0 bloqueio(s), 0 aviso(s)` / EXIT 0              |
| `python -m tools.edu_lint --strict ...`     | idem / EXIT 0                                           |
| Validação JSON `living_docs.json`           | `JSON OK`                                               |
| `tsc --noEmit` (typecheck)                  | NÃO RODOU — limitação ambiental (pnpm + FUSE)          |
| `vitest run`                                | NÃO RODOU — mesma limitação                             |
| `bash scripts/pipeline.sh`                  | NÃO RODOU — vinculante apenas no WSL Ubuntu             |

Detalhes em `docs/sprints/sprint-02/evidencias/F5-validacoes-locais.md`
(F5 oficial) e `docs/sprints/sprint-02/evidencias/F6-validacao-final.md`
(F6).

---

## 7. Problemas encontrados e resolvidos

1. **F5 oficial v1 — conteúdo isolado.** O componente `<JurosSaibaMais />`
   ficou inicialmente apenas exportado, sem acoplamento à UI. O
   auditor reprovou. **Correção (v2):** integração direta em
   `/juros/page.tsx`, com 5 testes novos provando a renderização.
2. **F5 oficial v1 — Doc 09 §16.3 com placeholder TBD.** Tabela
   "EXIT real: TBD" violava a regra "doc vivo sem placeholder".
   **Correção (v2):** §16.3 reescrita como **política** (sem tabela
   vazia).
3. **F6 v1 — contradição dos relatórios canônicos.** O consolidado
   F6 dizia que os 3 canônicos podiam ficar para sub-PR mas listava
   esses mesmos arquivos como critério de encerramento. **Correção
   (v2 — Opção A):** os 3 canônicos foram criados nesta F6 (este
   arquivo, `relatorio-forense.md`, `validacao-oficial.md`).
4. **F6 v1 — caminho WSL incorreto.** Instruções usavam
   `cd ~/Plataforma_Educacional_Financeira`. **Correção (v2):**
   `cd ~/workspace/Plataforma_Educacional_Financeira`.
5. **F6 v1 — varredura de placeholders incompleta.** Foi declarado
   "zero ocorrências" no plano, mas existem 3 ocorrências históricas
   de "placeholder" em §5.4 e §5.5 do plano e na tabela §10 R7.
   **Correção (v2):** lista completa em
   `F6-validacao-final.md` §1.4 com classificação por ocorrência.

---

## 8. Documentação atualizada nesta sprint

- Doc 06 §15.3 — confirmação dos 3 endpoints de juros (sem
  alteração estrutural).
- Doc 08 §13.1 — glossário materializado do módulo de juros.
- Doc 08 §20 — nota Sprint 2 sobre o subset de lint.
- Doc 09 §16 — massa F4 confirmada + §16.3 política de registro.
- Doc 15 §9 + linhas JS-01..03 / JC-01..03 — cross-link com testes.
- Doc 19 — RF-INT-001 / RF-INT-002 promovidos a `done` com caminhos
  reais; +§6 histórico Sprint 2.
- `docs/_meta/living_docs.json` — bump `updated_at` + notas
  individuais.
- `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` —
  linhas 1.3 (F5 oficial), 1.4 (F6 v1) e 1.5 (F6 v2) no histórico
  de revisões.
- `docs/sprints/sprint-02/evidencias/` — 3 novas evidências F6.
- `docs/sprints/sprint-02/{relatorio-execucao,relatorio-forense,validacao-oficial}.md`
  — novos canônicos da Sprint 2 (Opção A do micro-adendo F6).

Doc 03 **NÃO foi tocado** nesta sprint (decisão binária do PLANO
§7.1 / §7.2). A planilha xlsx **NÃO foi tocada** — sua atualização
final é responsabilidade do PO/ChatGPT após o pipeline verde no
WSL Ubuntu.

---

## 9. Pendências honestamente declaradas

| Item                                                                                  | Destino concreto                                          |
|---------------------------------------------------------------------------------------|-----------------------------------------------------------|
| Promoção do Impact Agent `advisory → blocking`                                        | ADR-NNNN no início da Sprint 3 ou P-Refino.               |
| Casos JS-04..10 / JC-04..10 do Doc 15 ainda não exercidos                              | Sprints subsequentes.                                     |
| `backend/tests/regression/pedagogical/test_interest.py`                                | Sprint 3 (cobertura runtime equivalente já existe via FE).|
| Conteúdo Nível 3 (Doc 08 §10)                                                         | Pós-MVP / P-Refino.                                       |
| Glossário ampliado (≥ 25 termos do MVP)                                               | Conforme módulos da Sprint 3+ entrarem.                   |
| FAQ inicial (Doc 08 §18)                                                              | Sprint 3 / P-Refino.                                      |
| Lint pedagógico completo (Doc 08 §20)                                                  | Sprint 7 (roadmap).                                       |
| Mutation ≥ 80% em `backend/app/domain/interest/`                                      | Reportar número real; reabrir se < 80%.                   |
| Snapshot visual Playwright em `/juros`                                                 | P-Refino se infra de visual testing pronta.               |
| Responsividade mobile (375)                                                            | P-Refino.                                                 |

Todas as pendências têm destino concreto. Conforme regra de ouro do
PLANO §3.4: silêncio sobre desligamento é falha de governança.

---

## 10. Instruções de reprodução

```bash
cd ~/workspace/Plataforma_Educacional_Financeira
git checkout sprint-2/f6-fechamento-governanca

# 1. Aplicar pacote F6 v2
unzip -o ~/Downloads/F6_FECHAMENTO_GOVERNANCA_SPRINT_2_PACOTE_v2.zip
git status -sb
git diff --stat

# 2. Lint pedagógico
make lint-pedagogical
echo "EXIT_LINT_PED=$?"     # esperado: 0

# 3. Frontend
cd frontend
pnpm format:check
pnpm typecheck
pnpm test --run

# 4. Backend
cd ../backend
.venv/bin/python -m ruff check .
.venv/bin/python -m ruff format --check .
.venv/bin/python -m mypy app/
.venv/bin/python -m pytest tests/unit -m unit

# 5. Pipeline oficial — VINCULANTE
cd ..
bash scripts/pipeline.sh
echo "EXIT_PIPELINE=$?"     # exigido: 0 (PIPELINE VERDE)
```

Critério de encerramento formal: ver `validacao-oficial.md` §6.

---

## 11. Referências

- `docs/sprints/sprint-02/relatorio-forense.md` — granularidade por
  fatia + cadeia de custódia.
- `docs/sprints/sprint-02/validacao-oficial.md` — veredito formal +
  pendências residuais + assinaturas.
- `docs/sprints/sprint-02/evidencias/F5-revisao-editorial.md`
- `docs/sprints/sprint-02/evidencias/F5-lint-pedagogico.md`
- `docs/sprints/sprint-02/evidencias/F5-validacoes-locais.md`
- `docs/sprints/sprint-02/evidencias/F6-decisao-impact-agent.md`
- `docs/sprints/sprint-02/evidencias/F6-validacao-final.md`
- `docs/sprints/sprint-02/evidencias/F6-relatorio-final-sprint-2.md`
  (consolidado executivo).
- `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md`
  (plano executivo da sprint).
