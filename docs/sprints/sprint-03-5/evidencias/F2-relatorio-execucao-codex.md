# Sprint 3.5/F2 — Relatório de execução Codex

## Estado operacional

- Branch: `sprint-3.5/f2-financial-cockpit-fiel-codex`
- Base: `origin/main = fc21560`
- Correção aplicada sobre: `c44f18e fix(ui): replicar cockpit financeiro da referencia visual`
- Push: não executado
- PR: não aberto
- Merge: não executado

## Correções realizadas

- Campos de taxa do cockpit deixam de usar `type="number"`.
- Formulários do cockpit usam `noValidate` para impedir popover nativo indevido.
- Entradas decimais com vírgula e ponto são normalizadas antes de chamar services/API.
- Conteúdo educativo dos painéis e modais foi expandido e alinhado ao texto obrigatório do Financial Cockpit.
- Tabela comparativa de amortização foi criada com uma linha por período e coluna `Δ Parcela`.
- Builders de dados de gráfico foram exportados para prova testável de uma série/ponto por período real.
- Testes de regressão foram ampliados para inputs, conteúdo, modais, tabelas, gráficos e governança.

## Arquivos criados

- `frontend/src/__tests__/components/cockpitDynamicData.test.tsx`
- `docs/sprints/sprint-03-5/evidencias/F2-conteudo-educativo-proof.md`
- `docs/sprints/sprint-03-5/evidencias/F2-input-taxa-decimal-proof.md`
- `docs/sprints/sprint-03-5/evidencias/F2-periodos-dinamicos-proof.md`
- `docs/sprints/sprint-03-5/evidencias/F2-requisitos-anteriores-preservados.md`

## Arquivos alterados

- `frontend/src/__tests__/app/amortizacao.test.tsx`
- `frontend/src/__tests__/app/cockpitGovernance.test.ts`
- `frontend/src/__tests__/app/juros.test.tsx`
- `frontend/src/app/globals.css`
- `frontend/src/components/amortization/AmortizationCockpit.tsx`
- `frontend/src/components/interest/InterestCockpit.tsx`
- `frontend/src/components/ui/cockpit/CockpitCharts.tsx`
- `frontend/src/components/ui/cockpit/CockpitPrimitives.tsx`
- `frontend/src/components/ui/cockpit/CockpitTables.tsx`
- `docs/sprints/sprint-03-5/evidencias/F2-gates-pipeline.md`
- `docs/sprints/sprint-03-5/evidencias/F2-tests.md`
- `docs/sprints/sprint-03-5/evidencias/F2-user-navigation-script-proof.md`
- `docs/sprints/sprint-03-5/evidencias/F2-relatorio-execucao-codex.md`

## Requisitos preservados

- Financial Cockpit preservado;
- topbar preservada;
- sidebar não renderizada;
- subtabs preservadas;
- layout em três colunas preservado;
- KPIs, gráfico central, painel educativo e insight inferior preservados;
- Syne e IBM Plex Mono preservadas;
- overflow global sem scroll de página preservado;
- Recharts preservado, sem CDN;
- backend, OpenAPI, pipeline, workflow, baseline, Prompt-Mestre e planilha não foram alterados.

## Evidência visual

Screenshots não foram atualizadas nesta rodada porque o layout geral aprovado como base não foi refeito. A rodada foi corretiva para inputs, conteúdo, períodos dinâmicos e testes.

## Gates

- `pnpm lint`: OK
- `pnpm format:check`: OK
- `pnpm typecheck`: OK
- `pnpm test -- --run`: OK — 26 arquivos / 187 testes
- `pnpm build`: OK — 16/16 páginas
- `make lint-pedagogical`: OK
- `bash scripts/pipeline.sh`: OK — pipeline verde

## Pendências

Sem pendências bloqueantes conhecidas. Permanece apenas warning conhecido de Recharts em jsdom durante testes, sem falha de gate.
