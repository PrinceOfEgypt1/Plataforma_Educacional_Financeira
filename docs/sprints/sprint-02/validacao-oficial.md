# Validação Oficial — Sprint 2

**Sprint:** 02
**Responsável:** Claude Code (executora), Moisés (operador)
**Plano:** `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` v1.5
**Veredito proposto pela executora:** ✅ **APROVADA com pendências
residuais §5**, sujeita à confirmação do operador via §6.
**Status:** **F6 EM CURSO** — encerramento formal pendente.

> Esta sessão de chat **não declara** a Sprint 2 aprovada. O veredito
> proposto acima é **dependente** da auditoria do pacote F6 v2, da
> execução literal de `bash scripts/pipeline.sh` no WSL Ubuntu pelo
> operador (com `EXIT_PIPELINE=0` e mensagem `PIPELINE VERDE`), do
> merge da F6 em `main`, da janela de observação 30 min sem regressão
> e da atualização da planilha operacional pelo PO/ChatGPT.

---

## 1. Relação com a Sprint 1

Conforme PLANO §13.3 do plano da Sprint 1, esta validação declara:

- Esta sprint **não reabre, não reprocessa e não altera** artefato algum
  da Sprint 1.
- As linhas RF-INT-001 / RF-INT-002 da Doc 19, deixadas como `pending`
  na Sprint 1, foram promovidas para `done` na **F5 oficial** desta
  sprint (PR #10, commit `f20a180`). O veredito histórico da Sprint 1
  permanece **inalterado**.

---

## 2. Mapeamento dos critérios de aceite do PLANO Sprint 2

### 2.1 CORE (PLANO §3.4) — todos atendidos

| # | Critério CORE                                                                                                                | Entregue em                              | Evidência                                                                                  |
|---|------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|--------------------------------------------------------------------------------------------|
| C1 | Domínio `interest.simple` + `interest.compound` com unit tests cobrindo JS-01..03 e JC-01..03                                | F2 — PR #6 / `e4e56ac`                  | `backend/tests/unit/domain/interest/test_{simple,compound,properties}.py`                  |
| C2 | Schemas + Service + Endpoints `POST /api/v1/interest/{simple,compound,compare}` com integration + contract tests              | F3 — PR #7 / `2ae0bb2`                  | `backend/app/api/v1/interest.py`; `backend/tests/integration/api/interest/*`; `backend/tests/contract/test_interest.py` |
| C3 | Página `/juros` com formulário + resultado (summary + tabela + gráfico + alertas) e estados Loading/Empty/Error/Success      | F4 — PR #9 / `f1336d8`                  | `frontend/src/app/(app)/juros/page.tsx`; `frontend/src/components/interest/*`; `frontend/src/__tests__/...`  |
| C4 | Docs vivas mínimas: Doc 06 (endpoints), Doc 19 (RF-INT-001/002 com caminhos), `_meta/living_docs.json`                       | F5 oficial — PR #10 / `f20a180`         | Doc 06 §15.3; Doc 19 RF-INT-001/002 + §6; `docs/_meta/living_docs.json` (`updated_at=2026-04-26`) |
| C5 | Artefatos de sprint canônicos + planilha com aviso do chat                                                                   | F6 (esta sessão) — pendente de merge      | `docs/sprints/sprint-02/{relatorio-execucao,relatorio-forense,validacao-oficial}.md`; planilha xlsx fica com o operador |
| C6 | Axe-core verde em `/juros` sem `serious`/`critical`                                                                          | F4 — PR #9                                | `frontend/src/__tests__/components/...` + smoke a11y do pipeline (operador no WSL)         |
| C7 | `main` verde em CI ao fim de cada PR de fatia                                                                                | F1..F5 (PRs #5..#10)                     | Verificável no histórico de runs do CI no GitHub.                                          |

### 2.2 STRETCH (PLANO §3.4) — declarações honestas

| # | Critério STRETCH                                                                  | Status nesta sprint                                                                  |
|---|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| S1 | Property-based estendido + diff de cenários                                       | Property-based base entregue (`test_properties.py`); diff de 100 cenários pendente.  |
| S2 | Mutation ≥ 80% em `backend/app/domain/interest/`                                  | Não medido nesta sprint — declarado para Sprint 3 ou P-Refino.                       |
| S3 | Snapshot visual Playwright em `/juros`                                            | Não materializado — substituído por testes de unidade do JSX (F4 + F5).              |
| S4 | Conteúdo nível 2                                                                   | **ENTREGUE** na F5 oficial (4 blocos N2 em `nivel-2.ts`).                            |
| S5 | Docs 08 (textos níveis 1/2), 09 (massa confirmada), 15 (cross-links de casos)     | **ENTREGUES** na F5 oficial.                                                          |

### 2.3 CONDICIONAL (PLANO §3.4)

| # | Critério CONDICIONAL                                                              | Status nesta sprint                                                                  |
|---|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| K1 | Elevação do Impact Agent `advisory → blocking`                                    | **NÃO PROMOVIDO** — kill-switch §3.4 acionado. Decisão registrada em `F6-decisao-impact-agent.md`. ADR-NNNN a abrir antes da próxima tentativa. |
| K2 | Responsividade mobile (375) em `/juros`                                           | Não verificada formalmente nesta sprint — fica para P-Refino.                        |

---

## 3. Quality gates

A execução **vinculante** dos gates é responsabilidade do operador no
WSL Ubuntu via `bash scripts/pipeline.sh`. Esta sessão de chat **não
roda** o pipeline oficial.

### 3.1 Sandbox de chat — gates rodados (saídas literais)

| Validação                                          | Resultado                                              |
|----------------------------------------------------|--------------------------------------------------------|
| Fase 0 git (branch / HEAD / origin / WT)            | branch=`sprint-2/f6-fechamento-governanca`; HEAD=`f20a180`; origin=`f20a180`; WT limpo |
| `prettier --check` (10 arquivos da F5 v2)           | `All matched files use Prettier code style!` / EXIT 0  |
| `python -m tools.edu_lint frontend/src/content`     | `0 bloqueio(s), 0 aviso(s)` / EXIT 0                   |
| `python -m tools.edu_lint --strict frontend/src/content` | idem / EXIT 0                                      |
| Validação JSON `living_docs.json`                    | `JSON OK`                                              |
| Sintaxe Python `tools/edu_lint/edu_lint.py`           | `SYNTAX OK`                                            |

### 3.2 Operador no WSL Ubuntu — gates **vinculantes** para o veredito final

```bash
cd ~/workspace/Plataforma_Educacional_Financeira
git checkout sprint-2/f6-fechamento-governanca
unzip -o ~/Downloads/F6_FECHAMENTO_GOVERNANCA_SPRINT_2_PACOTE_v2.zip

make lint-pedagogical                                  ; echo "EXIT_LINT_PED=$?"
cd frontend && pnpm format:check                       ; echo "EXIT_FMT=$?"
pnpm typecheck                                         ; echo "EXIT_TYPECHECK=$?"
pnpm test --run                                        ; echo "EXIT_TEST=$?"
cd ../backend
.venv/bin/python -m ruff check .                       ; echo "EXIT_RUFF=$?"
.venv/bin/python -m ruff format --check .               ; echo "EXIT_FMT_BE=$?"
.venv/bin/python -m mypy app/                           ; echo "EXIT_MYPY=$?"
.venv/bin/python -m pytest tests/unit -m unit            ; echo "EXIT_PYTEST_UNIT=$?"
cd ..
bash scripts/pipeline.sh                                ; echo "EXIT_PIPELINE=$?"
```

Critério: **TODOS** com `EXIT=0`. Em particular `EXIT_PIPELINE=0`
literal **+** mensagem `PIPELINE VERDE` é **vinculante** para a
aprovação.

---

## 4. Divergências registradas honestamente

### 4.1 Numeração das fatias

A "F5 emergencial" (Pipeline oficial — PR #8 / `7841049`) foi
materializada **fora** da numeração F1..F6 do plano original. Foi uma
atividade operacional solicitada via micro-adendo do auditor; não
substitui a "F5 oficial" do plano (Conteúdo Educacional + Docs vivos —
PR #10 / `f20a180`). A duplicidade está registrada nas linhas 1.3 e
1.4 do histórico do plano.

### 4.2 Correção em duas etapas

A F5 oficial e a F6 foram entregues em **duas etapas (v1 + v2)** cada,
após auditoria que detectou:
- F5 v1: conteúdo isolado (sem integração visível) + Doc 09 §16.3 com
  TBD;
- F6 v1: contradição dos relatórios canônicos + caminho WSL incorreto +
  varredura de placeholders incompleta.

A v2 de cada uma corrigiu os bloqueadores. **Apenas a v2 foi
recomendada para materialização.** Os pacotes v1 estão truncados a
zero bytes em `outputs/` da sessão e não devem ser auditados.

### 4.3 Três relatórios canônicos materializados nesta F6 v2 (Opção A)

O auditor explicitou que a F6 v1 não podia tratar os 3 canônicos como
"sub-PR futuro" e ao mesmo tempo manter o critério de encerramento.
A **Opção A** do micro-adendo F6 v2 foi escolhida: os 3 canônicos
**foram materializados** nesta sessão:

- `docs/sprints/sprint-02/relatorio-execucao.md`
- `docs/sprints/sprint-02/relatorio-forense.md`
- `docs/sprints/sprint-02/validacao-oficial.md` (este arquivo)

O consolidado executivo `F6-relatorio-final-sprint-2.md` permanece
como evidência F6 dentro de `evidencias/`, mas **não substitui** os
canônicos — coexiste com eles.

### 4.4 Doc 03 fora do escopo

Conforme PLANO §7.1 / §7.2, Doc 03 **NÃO foi tocado** nesta sprint.
Nenhuma alteração matemática silenciosa foi feita. Se houver
ambiguidade no Doc 03, ela continua existindo intocada — abrir Adendo
ou ADR formal nas próximas sprints, conforme decisão do PO.

---

## 5. Pendências residuais declaradas

| Item                                                                                  | Destino concreto                                          |
|---------------------------------------------------------------------------------------|-----------------------------------------------------------|
| Promoção do Impact Agent `advisory → blocking`                                        | ADR-NNNN no início da Sprint 3 ou P-Refino.               |
| Casos JS-04..10 / JC-04..10 do Doc 15 ainda não exercidos                              | Sprints subsequentes.                                     |
| `backend/tests/regression/pedagogical/test_interest.py`                                | Sprint 3.                                                 |
| Conteúdo Nível 3 (Doc 08 §10)                                                         | Pós-MVP / P-Refino.                                       |
| Glossário ampliado (≥ 25 termos do MVP)                                               | Sprint 3+ (conforme módulos novos forem entrando).        |
| FAQ inicial (Doc 08 §18)                                                              | Sprint 3 / P-Refino.                                      |
| Lint pedagógico completo (Doc 08 §20)                                                  | Sprint 7 (roadmap).                                       |
| Mutation ≥ 80% em `backend/app/domain/interest/`                                      | Reportar número real; reabrir se < 80%.                   |
| Snapshot visual Playwright em `/juros`                                                 | P-Refino se infra de visual testing pronta.               |
| Responsividade mobile (375)                                                            | P-Refino.                                                 |

Todas as pendências têm destino concreto. Conforme regra de ouro do
PLANO §3.4: silêncio sobre desligamento é falha de governança.

---

## 6. Critério de encerramento formal e protocolo de aprovação

A Sprint 2 só é declarada **APROVADA** após, **cumulativamente**:

1. Auditoria do pacote `F6_FECHAMENTO_GOVERNANCA_SPRINT_2_PACOTE_v2.zip`
   concluída pelo PO/ChatGPT.
2. Pipeline oficial **VERDE** no WSL Ubuntu (`bash scripts/pipeline.sh`
   → `EXIT_PIPELINE=0` literal, com mensagem `PIPELINE VERDE`).
3. Smoke pós-merge na `main` verde.
4. Janela de observação de 30 minutos sem regressão (PLANO §5.6 DoD
   Release).
5. PR da F6 mergeado em `main` via squash-merge.
6. Atualização da planilha operacional pelo PO/ChatGPT
   (`docs/operacional/backlog_operacional_acompanhamento.xlsx`) com
   aviso final "Sprint 2 — FECHADA em [data]; chat de origem:
   Sprint 2 / chat atual" — **não** feita pela sessão de chat.

Enquanto qualquer item acima estiver pendente, este documento declara
explicitamente: **Sprint 2 não está encerrada.** A executora de chat
**não tem** autoridade de declarar aprovação sem a confirmação do
operador na §7.

---

## 7. Assinaturas

- **Executora:** Claude Code — proposição de veredito **APROVADA com
  pendências residuais §5**, sujeita à execução do protocolo §6.
- **Operador:** Moisés — pendente. A confirmação literal acontece
  após pipeline verde + merge + planilha.
- **Auditor:** ChatGPT — pendente. A auditoria do pacote v2 acontece
  antes do operador.
- **Veredito final:** ⏳ **PENDENTE** até cumprimento integral do
  §6.
- **Referência cruzada:** `docs/sprints/sprint-02/relatorio-execucao.md`,
  `docs/sprints/sprint-02/relatorio-forense.md`,
  `docs/sprints/sprint-02/evidencias/F6-decisao-impact-agent.md`,
  `docs/sprints/sprint-02/evidencias/F6-validacao-final.md`,
  `docs/sprints/sprint-02/evidencias/F6-relatorio-final-sprint-2.md`.
