# Plano de Execução — Sprint 1

**Plataforma Educacional Financeira**
**Autor:** Equipe de Engenharia (papel coletivo operado pela IA executora)
**Data (original):** 2026-04-18
**Versão:** 1.1-histórica (publicada retroativamente em Sprint 2 / Fatia F1 — 2026-04-21)
**Status:** ✅ Sprint 1 encerrada (PR #1 squash-merged em `main`; branch `sprint-1` descartada; P07–P15 aplicados, P15 fechou o ciclo — ver `FECHAMENTO_SPRINT_1.md`)

---

> **Nota de institucionalização retroativa (v1.1-histórica — 2026-04-21).** Este arquivo é publicado no repositório retroativamente, como parte da **Fatia F1 da Sprint 2**, em cumprimento à regra de governança §8.7 do `PLANO_EXECUCAO_SPRINT_2.md` (v1.2): **todo `PLANO_EXECUCAO_SPRINT_XX.md` é artefato oficial versionado em `docs/sprints/sprint-<XX>/00-plano/`**. O conteúdo abaixo é preservado integralmente como foi lido e aprovado na época da Sprint 1; nenhuma decisão histórica é reescrita. Esta versão v1.1-histórica difere da v1.1 original apenas neste bloco introdutório e no cabeçalho (Versão + Status atualizados para refletir que a sprint foi encerrada). O corpo do plano é imutável. Edições futuras de fato na Sprint 1 não são admitidas; se necessário, abrir Adendo formal ou ADR.

---

## 1. Finalidade deste documento

Este é o **plano operacional** que precede qualquer alteração de código na Sprint 1.
Consolida o que foi lido durante o Discovery, enuncia as decisões arquiteturais de cada fatia,
lista os arquivos que serão criados/alterados por fatia, a estratégia de testes e o Definition
of Done. Nenhuma fatia de código começa antes da aprovação deste plano.

Fonte documental lida durante o Discovery:

- `docs/baseline/11_Prompt_Mestre.md` (Doc 11)
- `docs/06_API_e_Contratos.md` (Doc 06 v2.0)
- `docs/adr/ADR-0007-http-errors-rfc7807.md`
- `docs/adr/ADR-0006-api-versioning-url.md`
- `docs/sprints/sprint-00/relatorio-execucao.md`
- `docs/sprints/sprint-00/relatorio-forense.md`
- `docs/sprints/sprint-00/validacao-oficial.md`
- `docs/_meta/living_docs.json` (schema v3)
- `docs/baseline/gate-forense/LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md`
- `docs/ui/INVENTARIO_TELAS.md`
- `docs/qualidade/AGENTE_DE_ANALISE_DE_IMPACTO.md` (referência)
- `.github/workflows/ci.yml`
- `backend/app/main.py`, `backend/app/core/config.py`, `backend/pyproject.toml`
- `backend/tests/unit/test_health.py`
- `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx`
- `frontend/src/styles/tokens.ts`, `frontend/tailwind.config.ts`, `frontend/tsconfig.json`, `frontend/package.json`
- `scripts/impact_analysis_guard.py`
- `Makefile`
- `README.md`

---

## 2. Regime de execução

- **Branch única da sprint:** `sprint-1` criado a partir de `main` (SHA base `773a843`).
- **Commits atômicos por camada**, na ordem: `backend → frontend → docs → CI`.
  Nenhum commit mistura camadas.
- **Cada fatia passa nos testes locais antes de avançar** (`make verify` para BE+FE onde aplicável).
- **Operador:** Moisés executa os comandos no CLI autenticado. A IA gera o conteúdo
  (arquivos, mensagens, comandos), espelha em `Matemática Financeira/sprint-1/<fatia>/` e produz
  o bloco de comandos pronto para colar.
- **Encerramento:** PR único `main ← sprint-1` ao final, com corpo canônico §10.

---

## 3. Prefixo de commit-messages

Seguindo o padrão observado na Sprint 0 (Conventional Commits em PT-BR):

- Backend: `feat(sprint-01/backend): ...`
- Frontend: `feat(sprint-01/frontend): ...`
- Docs: `docs(sprint-01): ...`
- CI: `ci(sprint-01): ...`

---

## 4. Fatia 1 — Backend: contrato-base + erros + testes

### 4.1 Objetivo
Materializar o envelope padrão de sucesso (Doc 06 §4.1) e o contrato de erro RFC 7807
(Doc 06 §4.2 + ADR-0007), de forma que **toda rota futura herde automaticamente** o contrato.

### 4.2 Decisões arquiteturais

| Decisão | Motivo |
|---|---|
| `ResponseEnvelope[T]` como genérico Pydantic | Usar `typing.Generic` para preservar tipagem forte de `data` por endpoint |
| `Problem` como modelo único dos erros (compatível RFC 7807) | Single source of truth — o handler sempre produz um `Problem` |
| `DomainError` como exceção raiz + 5 subclasses canônicas | `ValidationError`, `BusinessRuleError`, `NotFoundError`, `ConflictError`, `RateLimitedError` — map 1:1 com Doc 06 §5 |
| Handler para `RequestValidationError` do FastAPI | Converte erros Pydantic da request em `Problem(code=VALIDATION_ERROR)` com lista `errors[]` |
| Handler para `HTTPException` genérico | Mantém comportamento 404/405 do FastAPI mas formata como `Problem` |
| Handler para `DomainError` | Serializa status + code + detail; `UNAUTHENTICATED`/`UNAUTHORIZED` já previstos mesmo sem auth (serão levantados só a partir da sprint de auth) |
| Handler para `Exception` (fallback) | Nunca expõe stack; loga com `structlog` e responde `INTERNAL_ERROR` 500 |
| `X-Request-ID` via middleware + injetado em `meta.request_id` e `Problem.request_id` | Rastreabilidade ponta a ponta |
| Rota-demo `GET /api/v1/contract/ping` (marcada `include_in_schema=True`) | Prova viva do envelope — usada pelos contract tests; não é feature de produto |
| Rota-demo `GET /api/v1/contract/errors/{kind}` (internal=debug) — apenas em `APP_DEBUG=True` | Exercita cada ramo de erro para testes; não aparece em prod |

**Não incluído nesta fatia:** idempotência, rate-limit real, paginação, pydantic-settings-aware
CSP headers. Tudo isso está fora do escopo da Sprint 1 (seção §12 do Prompt Sprint 1).

### 4.3 Árvore de arquivos da fatia

```
backend/app/core/envelope.py                      (novo)
backend/app/core/errors.py                        (novo)
backend/app/core/request_id.py                    (novo)
backend/app/api/__init__.py                       (alterado — expõe o router v1)
backend/app/api/v1/__init__.py                    (novo)
backend/app/api/v1/router.py                      (novo — monta o router agregado)
backend/app/api/v1/contract.py                    (novo — rotas-demo /contract/*)
backend/app/main.py                               (alterado — registra middleware + handlers + inclui router v1)
backend/tests/unit/test_envelope.py               (novo)
backend/tests/contract/__init__.py                (já existe)
backend/tests/contract/test_contract_base.py      (novo)
backend/tests/contract/test_error_handling.py     (novo)
docs/api/openapi.json                             (regenerado por scripts/export_openapi.py)
```

### 4.4 Estratégia de testes

**Unit (`backend/tests/unit/test_envelope.py`):**
- `ResponseEnvelope` serializa `data` preservando tipagem (Pydantic round-trip).
- `Problem` tem media_type `application/problem+json` no response handler.
- `DomainError` e subclasses herdam `status_code` e `code` corretos.

**Contract (`backend/tests/contract/test_contract_base.py`):**
- `GET /api/v1/contract/ping` retorna 200 com corpo `{success:true, message, data:{pong:true}, meta:{request_id, version:"v1", generated_at}}`.
- `Content-Type` é `application/json`.
- `meta.request_id` é UUID4.
- Header `X-Request-ID` propagado no response quando enviado no request.

**Contract (`backend/tests/contract/test_error_handling.py`):**
- `VALIDATION_ERROR` — payload inválido (Pydantic) em rota-demo → 422, `application/problem+json`, `errors[]` listando campos.
- `BUSINESS_RULE_ERROR` — `/contract/errors/business` → 400, `code=BUSINESS_RULE_ERROR`.
- `NOT_FOUND` — `/contract/errors/not_found` → 404, `code=NOT_FOUND`.
- `CONFLICT` — `/contract/errors/conflict` → 409, `code=CONFLICT`.
- `INTERNAL_ERROR` — `/contract/errors/boom` → 500, sem stack exposto, `code=INTERNAL_ERROR`.
- Todos os erros incluem `instance`, `request_id`, `type`, `title`, `status`, `detail`.

### 4.5 DoD da Fatia 1
- `make verify` verde (ruff, ruff-format, mypy strict, pytest unit).
- `make test-contract` verde (schemathesis roda somente se houver OpenAPI — nesta fatia basta pytest dos novos testes).
- Cobertura de `app/core/envelope.py`, `app/core/errors.py` ≥ 90%.
- `docs/api/openapi.json` regenerado e commitado (mesmo commit ou commit separado `docs(sprint-01): regenera openapi.json` — decisão na fatia docs).
- Commit atômico único.

---

## 5. Fatia 2 — Frontend: shell navegável + testes

### 5.1 Objetivo
Transformar o scaffold Next.js em uma **shell visualmente premium e navegável** com layout
global (sidebar + header + área de conteúdo), 12 rotas-base dos módulos, 3 estados reutilizáveis
e 4 componentes-base — tudo consumindo `tokens.ts`.

### 5.2 Decisões arquiteturais

| Decisão | Motivo |
|---|---|
| **App Router com grupo `(app)` para páginas com shell** | Permite `/login` ou `/embed` futuramente sem a shell, sem quebrar as rotas atuais |
| **Shell em `src/app/(app)/layout.tsx`** + mantém `src/app/layout.tsx` como root (lang + banner) | Root cuida de HTML/lang/banner; shell cuida de sidebar+header |
| **12 rotas mapeadas** — todas com conteúdo educativo já minimamente real | Prompt §6 exige 12 rotas navegáveis, com aviso de "em construção" coerente, não cosmético |
| **Componentes em `src/components/shell/*` e `src/components/ui/*`** | Separa concerns: shell é único, ui é reutilizável |
| **Estados reutilizáveis em `src/components/states/*`** | `<LoadingState />`, `<ErrorState />`, `<EmptyState />` — API uniforme (`title`, `description`, `action?`) |
| **Nenhuma lógica financeira no frontend** | Prompt-Mestre §9 / ADR-0004 — backend é fonte de verdade |
| **Tailwind + tokens via CSS vars já existentes (tokens.css)** — não altera `tailwind.config.ts` | Evita quebrar tokens.test.ts; consumo via classes utilitárias + `style={{ color: "var(--brand-primary)" }}` onde necessário |
| **vitest com `environment: 'jsdom'` + `@testing-library/jest-dom`** | Habilita testes de componente reais (pendência P3 da Sprint 0) |

**Não incluído nesta fatia:** formulários reais, integração com API (não há rotas de domínio
ainda), Playwright/E2E (ficam como pendência honesta para Sprint 2), dark mode, i18n.

### 5.3 Árvore de arquivos da fatia

```
frontend/vitest.config.ts                                            (novo)
frontend/src/tests/setup.ts                                          (novo)
frontend/src/lib/cn.ts                                               (novo — clsx+tw-merge)
frontend/src/config/modules.ts                                       (novo — 12 módulos canônicos)

frontend/src/components/shell/Sidebar.tsx                            (novo)
frontend/src/components/shell/Header.tsx                             (novo)
frontend/src/components/shell/ShellLayout.tsx                        (novo)
frontend/src/components/shell/NavItem.tsx                            (novo)
frontend/src/components/shell/EducationalNotice.tsx                  (novo — extraído do root layout)

frontend/src/components/states/LoadingState.tsx                      (novo)
frontend/src/components/states/ErrorState.tsx                        (novo)
frontend/src/components/states/EmptyState.tsx                        (novo)
frontend/src/components/states/index.ts                              (novo — barrel)

frontend/src/components/ui/SummaryCard.tsx                           (novo)
frontend/src/components/ui/AlertBanner.tsx                           (novo)
frontend/src/components/ui/FormSection.tsx                           (novo)
frontend/src/components/ui/EducationPanel.tsx                        (novo)
frontend/src/components/ui/index.ts                                  (novo — barrel)

frontend/src/app/layout.tsx                                          (alterado — enxuga, extrai banner p/ componente)
frontend/src/app/page.tsx                                            (alterado — vira Home dentro da shell)
frontend/src/app/(app)/layout.tsx                                    (novo — shell wrapping)
frontend/src/app/(app)/juros/page.tsx                                (novo)
frontend/src/app/(app)/amortizacao/page.tsx                          (novo)
frontend/src/app/(app)/financiamento-imobiliario/page.tsx            (novo)
frontend/src/app/(app)/financiamento-veiculo/page.tsx                (novo)
frontend/src/app/(app)/consignado/page.tsx                           (novo)
frontend/src/app/(app)/cdc/page.tsx                                  (novo)
frontend/src/app/(app)/cartao-rotativo/page.tsx                      (novo)
frontend/src/app/(app)/atraso/page.tsx                               (novo)
frontend/src/app/(app)/indicadores/page.tsx                          (novo)
frontend/src/app/(app)/investir-vs-quitar/page.tsx                   (novo)
frontend/src/app/(app)/diagnostico/page.tsx                          (novo)
frontend/src/app/(app)/educacao/page.tsx                             (novo)

frontend/src/__tests__/components/Sidebar.test.tsx                   (novo)
frontend/src/__tests__/components/Header.test.tsx                    (novo)
frontend/src/__tests__/components/ShellLayout.test.tsx               (novo)
frontend/src/__tests__/components/states.test.tsx                    (novo)
frontend/src/__tests__/components/ui.test.tsx                        (novo)
frontend/src/__tests__/app/home.test.tsx                             (novo)
frontend/src/__tests__/app/routes.test.tsx                           (novo — cada rota-base renderiza o título e o EducationalNotice)
```

### 5.4 Nomenclatura e mapa dos 12 módulos

O arquivo `src/config/modules.ts` será a fonte única. Ele alimenta a Sidebar, o breadcrumb do
Header e os testes de rotas, eliminando duplicação:

| Slug da rota | Título | Grupo | Status Sprint 1 |
|---|---|---|---|
| `/diagnostico` | Diagnóstico Financeiro | Diagnóstico | em-construcao |
| `/juros` | Juros Simples e Compostos | Cálculos Básicos | em-construcao |
| `/amortizacao` | Amortização — PRICE e SAC | Cálculos Básicos | em-construcao |
| `/financiamento-imobiliario` | Financiamento Imobiliário | Financiamentos | em-construcao |
| `/financiamento-veiculo` | Financiamento de Veículo | Financiamentos | em-construcao |
| `/consignado` | Empréstimo Consignado | Empréstimos | em-construcao |
| `/cdc` | CDC / Crédito Pessoal | Empréstimos | em-construcao |
| `/cartao-rotativo` | Cartão de Crédito / Rotativo | Cartão | em-construcao |
| `/atraso` | Parcela em Atraso | Dívida | em-construcao |
| `/indicadores` | Indicadores Financeiros | Referência | em-construcao |
| `/investir-vs-quitar` | Investir ou Quitar Dívida | Decisão | em-construcao |
| `/educacao` | Glossário, FAQ e Conteúdo | Educação | em-construcao |

*Obs.:* O inventário Sprint 0 usava `/cartao`; a Sprint 1 vai para `/cartao-rotativo` para
casar com `/api/v1/credit-card/revolving` do Doc 06. Essa divergência será registrada como
atualização do `INVENTARIO_TELAS.md` na fatia docs.

### 5.5 Estratégia de testes

Todos com `@testing-library/react` + `jsdom`:

- **Sidebar.test.tsx** — renderiza 12 links, destaca a rota atual (mock `usePathname`), tem `role="navigation"`, `aria-label`.
- **Header.test.tsx** — exibe título canônico, breadcrumb derivado do slug corrente.
- **ShellLayout.test.tsx** — renderiza children na área principal; educational notice presente.
- **states.test.tsx** — cada estado renderiza título, descrição e botão de ação opcional.
- **ui.test.tsx** — `<SummaryCard>` renderiza título/valor/delta; `<AlertBanner>` respeita `level`; `<FormSection>` envelopa `<fieldset>`/`<legend>`; `<EducationPanel>` tem `role="complementary"`.
- **home.test.tsx** — Home renderiza grid com 12 cards, cada card aponta para rota correta.
- **routes.test.tsx** — para cada slug do módulo, `render(<Page/>)` contém o título e o `EducationPanel` com `role="complementary"`.

Snapshot leve apenas para `<ShellLayout>` (renderização de dois children) — cumpre o requisito
"pelo menos uma prova visual ou snapshot coerente da shell" (§5.1.7 do Prompt).

### 5.6 DoD da Fatia 2
- `make verify` verde (eslint, prettier --check, tsc --noEmit, vitest).
- Todos os testes de componente novos passam.
- Navegação manual pelos 12 slugs funciona (smoke local: `pnpm dev` e clicar nos links).
- Nenhum "em breve" cosmético: cada página tem título real + copy educativa curta + aviso claro do que virá.
- Commit atômico único.

---

## 6. Fatia 3 — Docs: artefatos Sprint 1 + higiene herdada

### 6.1 Objetivo
Produzir os 4 artefatos canônicos da Sprint 1 e fechar as pendências documentais herdadas
que foram explicitamente atribuídas a esta sprint pela §9 do `relatorio-execucao.md` da Sprint 0.

### 6.2 Árvore de arquivos da fatia

```
docs/sprints/sprint-01/relatorio-execucao.md                         (novo)
docs/sprints/sprint-01/relatorio-forense.md                          (novo)
docs/sprints/sprint-01/validacao-oficial.md                          (novo)
docs/sprints/sprint-01/evidencias/README.md                          (novo — índice das evidências)
docs/sprints/sprint-01/evidencias/make-verify-backend.txt            (novo — log capturado)
docs/sprints/sprint-01/evidencias/make-verify-frontend.txt           (novo — log capturado)
docs/sprints/sprint-01/evidencias/openapi-diff.md                    (novo — diff v0→v1 da spec)
docs/sprints/sprint-01/evidencias/impact-agent-ci.md                 (novo — prova do step no CI)
docs/sprints/sprint-01/evidencias/screens/README.md                  (novo — onde colocar capturas)

docs/_meta/living_docs.json                                          (alterado — sync Sprint 1)
docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md                            (novo — matriz desta sprint)

docs/ui/INVENTARIO_TELAS.md                                          (alterado — 12 módulos canônicos, slugs consistentes com Doc 06)
README.md                                                            (alterado — pós-Sprint 1: rotas, estados, shell, setup testes FE)
docs/19_Matriz_Rastreabilidade.md                                    (alterado — adiciona entradas da Sprint 1)
docs/27_Versionamento_API.md                                         (alterado — registra v1 como versão em vigor e política de nota de versão)

docs/sprints/sprint-01/evidencias/pendencias-herdadas-fechamento.md  (novo — checklist do §9 Sprint 0 com status)
```

### 6.3 Pendências herdadas atendidas (rastreáveis)

| Pendência Sprint 0 | Sprint 1 | Tratativa |
|---|---|---|
| Migrar docs AUDITORIA_PROMPT_1_FINAL → docs/ | Sprint 1 | ✅ Já executada em commit `c31790a` (Sprint 0 adendo) — só confirmamos no `pendencias-herdadas-fechamento.md` |
| `living_docs.json` com paths reais | Sprint 1 | ✅ Atualização explícita nesta fatia |
| Agente de impacto no CI advisory | Sprint 1 | ✅ Fatia 4 |
| README atualizado pós-Sprint 0 | Sprint 1 | ✅ Nesta fatia |
| Testes render de componentes FE | Sprint 1 | ✅ Fatia 2 |
| Snapshots visuais (Playwright) | Sprint 1 | 🟡 **Parcial** — snapshot leve de ShellLayout entregue; Playwright ficará como pendência residual declarada (§12 do Prompt Sprint 1 exclui E2E complexo) |
| `docs/19_Matriz_Rastreabilidade.md` | Sprint 1 | ✅ Já existia; atualizado nesta fatia |
| `docs/27_Versionamento_API.md` | Sprint 1 | ✅ Já existia; atualizado nesta fatia |
| ADR-002 (critérios WARNING do agente) | Sprint 2 | ❌ Fora de escopo por decisão explícita (Prompt §12) |
| openapi.json reflete só health | Contínuo | 🟢 Diminui nesta sprint: passa a incluir `/api/v1/contract/*` |

### 6.4 Divergência em relação a CND-03 (bloqueadores)

O `LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md` prevê, em CND-03, transição do agente de impacto
de *advisory* → *warning* ao fim da Sprint 0 e → *blocking* ao fim da Sprint 1. O **Prompt Sprint 1
§5.1.5** determina explicitamente modo *advisory* ("sem produzir bloqueio indevido"). Essa
divergência será **declarada honestamente** na `validacao-oficial.md` e registrada como
pendência residual formal para a Sprint 2 (onde seria emitido o ADR-0015 e feita a promoção).

### 6.5 DoD da Fatia 3
- Os 4 artefatos canônicos existem e estão commitados.
- `living_docs.json` sem `materialized_in_repo: false` exceto os que permanecem pendentes por decisão formal, com `note` explicativa.
- README raiz atualizado, testado (comandos funcionam como descritos).
- Inventário de telas reflete os 12 slugs reais usados no frontend.
- Matriz de rastreabilidade inclui as linhas da Sprint 1.
- Commit atômico único.

---

## 7. Fatia 4 — CI: agente de impacto em modo advisory

### 7.1 Objetivo
Tornar o agente `scripts/impact_analysis_guard.py` parte visível do pipeline do GitHub Actions
em modo **advisory** (sem bloquear), conforme §5.1.5 do Prompt Sprint 1.

### 7.2 Decisões arquiteturais

| Decisão | Motivo |
|---|---|
| Job novo e separado `impact-advisory` em `.github/workflows/ci.yml` | Isolar a informação, facilitar leitura do log, manter backend/frontend não poluídos |
| `needs: []` — paralelo a backend e frontend | Não bloqueia os demais; o resultado é sempre verde |
| `continue-on-error: true` redundante (script já dá `sys.exit(0)`) mas explícito no workflow | Defesa-em-profundidade |
| Base de diff: `${{ github.event.pull_request.base.sha || 'HEAD~1' }}` | Funciona tanto em PR quanto em push |
| Resumo no GitHub Step Summary (`$GITHUB_STEP_SUMMARY`) | Aparece no sumário da PR sem poluir logs |
| Sem `setup-python uv` pesado — usa Python 3.11 do runner + stdlib | O script não tem dependências externas |

### 7.3 Árvore de arquivos da fatia

```
.github/workflows/ci.yml                (alterado — adiciona job impact-advisory)
```

### 7.4 DoD da Fatia 4
- `ci.yml` passa no `yamllint` (se existir) e no próprio GitHub parser.
- Job `impact-advisory` aparece no checks da PR e reporta em Step Summary.
- Nunca falha o pipeline mesmo em risco CRITICAL.
- Commit atômico único.

---

## 8. Sequência de operação

```
1. git checkout -b sprint-1 origin/main
2. Fatia 1 — Backend (escrever arquivos, make verify, commit "feat(sprint-01/backend): ...")
3. Fatia 2 — Frontend (escrever arquivos, make verify, commit "feat(sprint-01/frontend): ...")
4. Fatia 3 — Docs (escrever arquivos, commit "docs(sprint-01): ...")
5. Fatia 4 — CI (alterar ci.yml, commit "ci(sprint-01): ...")
6. git push -u origin sprint-1
7. Abrir PR main←sprint-1 com corpo canônico
```

---

## 9. Critérios de aceite da Sprint 1 — rastreabilidade ponto a ponto

| Critério (§13 do Prompt) | Fatia | Evidência prevista |
|---|---|---|
| Layout global com sidebar, header, área de conteúdo | 2 | `ShellLayout.tsx` + `ShellLayout.test.tsx` + screenshot |
| 12 rotas-base navegáveis | 2 | 12 `page.tsx` + `routes.test.tsx` |
| Loading/Error/EmptyState reutilizáveis | 2 | 3 componentes + `states.test.tsx` |
| SummaryCard/AlertBanner/FormSection/EducationPanel | 2 | 4 componentes + `ui.test.tsx` |
| Contrato-base de sucesso/erro backend padronizado | 1 | `envelope.py` + `errors.py` + `test_contract_base.py` |
| Tratamento inicial de exceções seguro | 1 | handlers em `main.py` + `test_error_handling.py` |
| Testes protegendo shell e contrato | 1 + 2 | 11 arquivos de teste |
| Documentação viva impactada atualizada | 3 | diffs do `INVENTARIO_TELAS.md`, `README.md`, `19`, `27` |
| `living_docs.json` em caminhos reais | 3 | diff do arquivo |
| README reconciliado | 3 | diff do arquivo |
| Agente de impacto no CI advisory | 4 | link do Actions run no `evidencias/impact-agent-ci.md` |
| 4 artefatos canônicos Sprint 1 | 3 | 3 .md + `evidencias/` |
| Pendências declaradas honestamente | 3 | seção em `validacao-oficial.md` |

---

## 10. Corpo canônico do PR (rascunho)

O PR final usará como corpo exatamente este esqueleto (será preenchido na última etapa):

```markdown
# Sprint 1 — Base navegável do produto, contrato-base da API e fechamento herdado

## Resumo executivo
<1 parágrafo de contexto e entrega>

## Decisões técnicas adotadas
<tabela sintética dos §4.2 / §5.2 / §7.2 deste plano>

## Estrutura de arquivos criados/alterados
<árvore resumida por fatia>

## Testes e resultados
<contagens pytest + vitest + cobertura>

## Atualizações documentais
<bullets das alterações em docs/>

## Impacto identificado pelo agente
<recorte do step summary>

## Evidências de quality gates
<links / capturas>

## Validação dos critérios de aceite
<tabela do §9 deste plano com ✅ ao lado de cada item>

## Pendências honestamente declaradas
- Playwright/E2E real (adiado p/ Sprint 2, cf. §12 Prompt Sprint 1)
- Promoção advisory → warning/blocking do agente (adiado p/ Sprint 2, cf. CND-03 + ADR-0015)
- ADR-002 (critérios WARNING) — Sprint 2
```

---

## 11. Pendências declaradas por antecipação (honestidade técnica)

Antes mesmo de iniciar, estas limitações já são conhecidas e serão registradas na
`validacao-oficial.md` da Sprint 1 — não como descaso, mas como recorte consciente:

1. **Playwright/E2E** — fora de escopo por §12 do Prompt. Fica snapshot leve apenas.
2. **Promoção advisory → warning/blocking do agente de impacto** — o Prompt Sprint 1 exige advisory; CND-03 previa warning ao fim da Sprint 0 e blocking ao fim da Sprint 1. Divergência documentada.
3. **ADR-0015** (critérios formais de promoção de estágio) — Sprint 2.
4. **Conexão real do frontend com a API** — as rotas-base são estruturais/educativas. Não há `fetch` nesta sprint.
5. **Tokens consumidos via `tailwind.config.ts`** — mantém-se via `tokens.css`/CSS vars para não invalidar `tokens.test.ts`. Refinamento em sprint de consolidação visual.

---

## 12. Aprovação

Este plano está pronto para revisão. Ao aprovar, o squad inicia a Fatia 1 imediatamente.
O documento final em `docs/sprints/sprint-01/relatorio-execucao.md` ao fim da Sprint referenciará
este mesmo plano como o baseline executado.

— Equipe de Engenharia de Software (papel coletivo operado pela IA executora)
