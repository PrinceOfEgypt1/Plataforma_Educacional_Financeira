# F5 — Staging proof

Data: 2026-05-03

## Status antes do staging

```bash
git status -sb
```

Saída observada antes da criação deste arquivo:

```text
## sprint-3/f5-conteudo-docs-amortizacao-codex
 M docs/07_UX_UI_e_Navegacao.md
 M docs/08_Conteudo_Educacional.md
 M docs/19_Matriz_Rastreabilidade.md
 M docs/_meta/living_docs.json
 M frontend/src/__tests__/app/amortizacao.test.tsx
 M frontend/src/app/(app)/amortizacao/page.tsx
?? docs/sprints/sprint-03/evidencias/F5-base-branch.md
?? docs/sprints/sprint-03/evidencias/F5-content-inventory.md
?? docs/sprints/sprint-03/evidencias/F5-docs-vivos-diff.md
?? docs/sprints/sprint-03/evidencias/F5-gates-pipeline.md
?? docs/sprints/sprint-03/evidencias/F5-relatorio-execucao-codex.md
?? docs/sprints/sprint-03/evidencias/F5-tests.md
?? docs/sprints/sprint-03/evidencias/F5-ui-content-proof.md
?? frontend/src/__tests__/content/amortizacao/
?? frontend/src/components/amortization/AmortizacaoSaibaMais.tsx
?? frontend/src/content/amortizacao/
```

## Interpretação

O working tree continha apenas arquivos da F5: conteúdo educacional,
UI de amortização, testes, docs vivos e evidências.

## Status após staging

```bash
git status -sb
```

Saída:

```text
## sprint-3/f5-conteudo-docs-amortizacao-codex
M  docs/07_UX_UI_e_Navegacao.md
M  docs/08_Conteudo_Educacional.md
M  docs/19_Matriz_Rastreabilidade.md
M  docs/_meta/living_docs.json
A  docs/sprints/sprint-03/evidencias/F5-base-branch.md
A  docs/sprints/sprint-03/evidencias/F5-content-inventory.md
A  docs/sprints/sprint-03/evidencias/F5-docs-vivos-diff.md
A  docs/sprints/sprint-03/evidencias/F5-gates-pipeline.md
A  docs/sprints/sprint-03/evidencias/F5-relatorio-execucao-codex.md
A  docs/sprints/sprint-03/evidencias/F5-staging-proof.md
A  docs/sprints/sprint-03/evidencias/F5-tests.md
A  docs/sprints/sprint-03/evidencias/F5-ui-content-proof.md
M  frontend/src/__tests__/app/amortizacao.test.tsx
A  frontend/src/__tests__/content/amortizacao/conteudo.test.ts
M  frontend/src/app/(app)/amortizacao/page.tsx
A  frontend/src/components/amortization/AmortizacaoSaibaMais.tsx
A  frontend/src/content/amortizacao/alertas.ts
A  frontend/src/content/amortizacao/glossario.ts
A  frontend/src/content/amortizacao/index.ts
A  frontend/src/content/amortizacao/nivel-1.ts
A  frontend/src/content/amortizacao/nivel-2.ts
A  frontend/src/content/amortizacao/types.ts
```

```bash
git diff --cached --name-status
```

Saída:

```text
M	docs/07_UX_UI_e_Navegacao.md
M	docs/08_Conteudo_Educacional.md
M	docs/19_Matriz_Rastreabilidade.md
M	docs/_meta/living_docs.json
A	docs/sprints/sprint-03/evidencias/F5-base-branch.md
A	docs/sprints/sprint-03/evidencias/F5-content-inventory.md
A	docs/sprints/sprint-03/evidencias/F5-docs-vivos-diff.md
A	docs/sprints/sprint-03/evidencias/F5-gates-pipeline.md
A	docs/sprints/sprint-03/evidencias/F5-relatorio-execucao-codex.md
A	docs/sprints/sprint-03/evidencias/F5-staging-proof.md
A	docs/sprints/sprint-03/evidencias/F5-tests.md
A	docs/sprints/sprint-03/evidencias/F5-ui-content-proof.md
M	frontend/src/__tests__/app/amortizacao.test.tsx
A	frontend/src/__tests__/content/amortizacao/conteudo.test.ts
M	frontend/src/app/(app)/amortizacao/page.tsx
A	frontend/src/components/amortization/AmortizacaoSaibaMais.tsx
A	frontend/src/content/amortizacao/alertas.ts
A	frontend/src/content/amortizacao/glossario.ts
A	frontend/src/content/amortizacao/index.ts
A	frontend/src/content/amortizacao/nivel-1.ts
A	frontend/src/content/amortizacao/nivel-2.ts
A	frontend/src/content/amortizacao/types.ts
```

## Interpretação final

O índice contém apenas os arquivos autorizados para a F5. Não há staging
de backend, OpenAPI, baseline, planilha, Prompt-Mestre ou frontend fora
do escopo.
