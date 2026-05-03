# Sprint 3/F4 - Relatorio de execucao Codex

## 1. Resumo executivo

A F4 materializou o frontend real da rota `/amortizacao`, substituindo o placeholder `ModulePage` por uma UI funcional para PRICE, SAC e comparacao PRICE vs SAC. O frontend consome os endpoints da F3 via service tipado e nao reimplementa calculo financeiro.

## 2. Branch e base

- Branch: `sprint-3/f4-frontend-amortizacao-codex`.
- Commit-base: `a297b9c`.
- Base oficial confirmada: `main = origin/main = a297b9c`.
- Trabalho direto na `main`: nao.

## 3. Arquivos lidos

Foram lidos o prompt operacional F4, docs operacionais, evidencias F1/F2/F3, docs vivos relevantes, contratos backend de amortizacao, `docs/api/openapi.json`, pagina `/juros`, pagina `/amortizacao`, services frontend, componentes de juros, componentes UI compartilhados e testes existentes.

## 4. Arquivos criados

- `frontend/src/types/amortization.ts`
- `frontend/src/services/amortization/amortizationService.ts`
- `frontend/src/components/amortization/AmortizacaoAlerts.tsx`
- `frontend/src/components/amortization/AmortizacaoForm.tsx`
- `frontend/src/components/amortization/AmortizacaoInterpretation.tsx`
- `frontend/src/components/amortization/AmortizacaoSaldoChart.tsx`
- `frontend/src/components/amortization/AmortizacaoSummary.tsx`
- `frontend/src/components/amortization/AmortizacaoTable.tsx`
- `frontend/src/components/amortization/AmortizacaoTabs.tsx`
- `frontend/src/components/amortization/ComparePanel.tsx`
- `frontend/src/components/amortization/PricePanel.tsx`
- `frontend/src/components/amortization/SacPanel.tsx`
- `frontend/src/components/amortization/formPrimitives.tsx`
- `frontend/src/components/amortization/formValidation.ts`
- `frontend/src/components/amortization/simulationState.ts`
- `frontend/src/__tests__/app/amortizacao.test.tsx`
- `frontend/src/__tests__/services/amortization/amortizationService.test.ts`
- evidencias F4 em `docs/sprints/sprint-03/evidencias/`.

## 5. Arquivos alterados

- `frontend/src/app/(app)/amortizacao/page.tsx`
- `frontend/src/config/modules.ts`

Nao foram alterados backend, OpenAPI, docs baseline, Prompt-Mestre ou planilha.

## 6. Service frontend

Arquivo: `frontend/src/services/amortization/amortizationService.ts`.

Funcoes:

- `simularPrice`
- `simularSac`
- `compararAmortizacao`

Paths consumidos:

- `/amortization/price`
- `/amortization/sac`
- `/amortization/compare`

O service usa `postJson<TIn, TOut>` e normaliza erro com `toInterestApiError`.

## 7. UI implementada

Rota `/amortizacao`:

- header real do modulo;
- tabs `PRICE`, `SAC`, `Comparar`;
- formulario real;
- validacao client-side;
- estados idle/loading/error/success;
- resumo financeiro;
- tabela de amortizacao;
- grafico de saldo devedor;
- alertas;
- interpretacao pedagogica;
- comparativo PRICE vs SAC.

## 8. Politica de calculo

O frontend nao calcula PRICE/SAC. Ele valida entrada, formata valores e renderiza a resposta da API. A fonte oficial dos calculos continua sendo o backend da F3/F2.

## 9. Testes criados

- Service:
  - endpoint PRICE correto;
  - endpoint SAC correto;
  - endpoint compare correto;
  - envelope;
  - Problem+JSON;
  - falha de rede.
- Pagina:
  - nao placeholder;
  - validacao obrigatoria;
  - happy path PRICE;
  - happy path SAC;
  - happy path compare;
  - loading;
  - erro de API;
  - resumo, tabela, grafico, alertas e interpretacao.

## 10. Comandos executados

```bash
cd frontend
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test -- --run
pnpm build
```

Resultados:

```text
lint: No ESLint warnings or errors
format: All matched files use Prettier code style
typecheck: exit code 0
test: 23 files / 161 tests passed
build: compiled successfully, /amortizacao gerada
```

```bash
cd backend
.venv/bin/python -m pytest tests/unit/services/amortization -q
.venv/bin/python -m pytest tests/integration/api/amortization -q
.venv/bin/python -m pytest tests/contract -q
```

Resultados:

```text
5 passed
14 passed
22 passed
```

```bash
make lint-pedagogical
bash scripts/pipeline.sh
```

Resultados:

```text
EXIT_LINT_PED=0
EXIT_PIPELINE=0
PIPELINE VERDE
```

## 11. Falhas encontradas e corrigidas

- Primeira execucao de `pnpm test -- --run` falhou em dois testes de `/amortizacao` porque o mesmo valor monetario aparecia corretamente no resumo e na tabela. Ajuste: trocar `getByText` por `getAllByText` nos asserts afetados.
- O `vitest` exibiu warning nao bloqueante do Recharts em jsdom sobre largura/altura zero. Os testes e o build passaram. Warning semelhante ja aparece em teste existente de juros.

## 12. Docs vivos

Nao alterei docs vivos nem `docs/_meta/living_docs.json`, porque a F4 ficou materializada em codigo, testes e evidencias especificas da Sprint 3. A matriz viva pode ser atualizada em uma fatia documental posterior se o Camaleao/Moises decidir consolidar status rastreavel apos a auditoria.

## 13. Riscos e pendencias

- Pendencia nao bloqueante: validacao visual manual em navegador pode ser feita na auditoria.
- Risco residual: o grafico usa Recharts/ResponsiveContainer, que em jsdom gera warning de dimensao zero, mas o build de producao da rota passou.

## 14. Status final

F4 implementada localmente, com gates verdes, sem merge, sem push e sem PR aberto.
