# F5 — Relatório de execução Codex

Data: 2026-05-03
Branch: `sprint-3/f5-conteudo-docs-amortizacao-codex`
Commit-base: `f20780e`

## 1. Resumo executivo

A F5 consolidou conteúdo educacional de amortização PRICE/SAC, tornou o
conteúdo visível na página `/amortizacao`, adicionou testes editoriais e
atualizou documentação viva mínima.

## 2. Arquivos criados

- `frontend/src/content/amortizacao/types.ts`
- `frontend/src/content/amortizacao/nivel-1.ts`
- `frontend/src/content/amortizacao/nivel-2.ts`
- `frontend/src/content/amortizacao/glossario.ts`
- `frontend/src/content/amortizacao/alertas.ts`
- `frontend/src/content/amortizacao/index.ts`
- `frontend/src/components/amortization/AmortizacaoSaibaMais.tsx`
- `frontend/src/__tests__/content/amortizacao/conteudo.test.ts`
- `docs/sprints/sprint-03/evidencias/F5-base-branch.md`
- `docs/sprints/sprint-03/evidencias/F5-content-inventory.md`
- `docs/sprints/sprint-03/evidencias/F5-ui-content-proof.md`
- `docs/sprints/sprint-03/evidencias/F5-docs-vivos-diff.md`
- `docs/sprints/sprint-03/evidencias/F5-tests.md`
- `docs/sprints/sprint-03/evidencias/F5-gates-pipeline.md`
- `docs/sprints/sprint-03/evidencias/F5-relatorio-execucao-codex.md`

## 3. Arquivos alterados

- `frontend/src/app/(app)/amortizacao/page.tsx`
- `frontend/src/__tests__/app/amortizacao.test.tsx`
- `docs/07_UX_UI_e_Navegacao.md`
- `docs/08_Conteudo_Educacional.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`

## 4. Conteúdo educacional implementado

- O que é amortização.
- Parcela, juros, amortização e saldo devedor.
- Total pago, total de juros e saldo final.
- PRICE como sistema de parcela constante.
- SAC como sistema de amortização constante.
- Comparação PRICE x SAC.
- Glossário com 12 termos essenciais.
- Cuidados educacionais sobre contrato real, custo total, taxa/prazo e
  fechamento de centavos.

## 5. Integração na UI

O conteúdo aparece em `/amortizacao` nas seções:

- `amortizacao-aprenda-mais`
- `amortizacao-glossario`
- `amortizacao-cuidados`

A página continua usando a API/backend como fonte oficial dos cálculos.
Nenhum cálculo PRICE/SAC foi reimplementado no frontend.

## 6. Docs vivos

Atualizados:

- Doc 07: registra a materialização UX da seção educacional.
- Doc 08: registra conteúdo e glossário de amortização.
- Doc 19: promove RF-AMO-001/002/003 para `done`.
- `living_docs.json`: atualiza notas dos docs vivos tocados.

## 7. Comandos executados

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test -- --run`
- `pnpm build`
- `make lint-pedagogical`
- `bash scripts/pipeline.sh`
- Smoke backend de domínio, service, integração e contrato de amortização.
- `jq empty docs/_meta/living_docs.json`
- `git diff --check`
- `git diff -- backend docs/baseline docs/api/openapi.json`

## 8. Saídas relevantes

- Frontend: `24 passed (24)` arquivos de teste, `189 passed (189)` testes.
- Build frontend: compilação e geração estática concluídas.
- Lint pedagógico: `0 bloqueio(s), 0 aviso(s)`.
- Pipeline: `PIPELINE VERDE`.
- Smoke backend:
  - domínio amortização: `39 passed`
  - service amortização: `5 passed`
  - integração API amortização: `14 passed`
  - contrato: `22 passed`

## 9. Falhas e correções durante a execução

- O primeiro uso de patch interpretou `/home/...` como `C:\home\...` no
  ambiente Windows. O artefato foi removido após verificação do caminho
  absoluto e os arquivos foram aplicados no caminho WSL real por UNC.
- Um comando `rg` tentou usar um binário do ambiente Windows sem permissão.
  A verificação foi refeita com `grep`.
- Comandos com caminho contendo parênteses precisaram de `bash -lc` e aspas
  explícitas.

## 10. Riscos e mitigação

- Risco de conteúdo invisível: mitigado por teste de página com
  `data-testid`.
- Risco de aconselhamento financeiro: mitigado por testes editoriais e
  disclaimer educacional.
- Risco de alteração fora de escopo: mitigado por `git diff -- backend
  docs/baseline docs/api/openapi.json`, sem saída.

## 11. Pendências

Nenhuma pendência técnica identificada nesta fatia.

## 12. Status final

F5 implementada localmente e pronta para auditoria do Camaleão/Moisés.

Não houve merge.
Não houve push.
Não houve abertura de PR.
