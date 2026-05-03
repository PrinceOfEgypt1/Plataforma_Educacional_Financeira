# F5 — Docs vivos e diff

Data: 2026-05-03

## Docs vivos alterados

- `docs/07_UX_UI_e_Navegacao.md`
- `docs/08_Conteudo_Educacional.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`

## Docs não alterados por escopo

- `docs/baseline/**`
- `docs/api/openapi.json`
- `backend/**`

## Validação JSON

```bash
jq empty docs/_meta/living_docs.json
```

Saída:

```text
<sem saída; exit code 0>
```

## Verificação de escopo proibido

```bash
git diff -- backend docs/baseline docs/api/openapi.json
```

Saída:

```text
<sem saída; zero diff rastreado>
```

## Resumo do diff

```bash
git diff --stat
```

Saída observada antes das evidências:

```text
docs/07_UX_UI_e_Navegacao.md                    | 16 +++++++
docs/08_Conteudo_Educacional.md                 | 40 ++++++++++++++++
docs/19_Matriz_Rastreabilidade.md               | 24 ++++++----
docs/_meta/living_docs.json                     |  7 +--
frontend/src/__tests__/app/amortizacao.test.tsx | 36 ++++++++++++++
frontend/src/app/(app)/amortizacao/page.tsx     | 63 +++++++++++++++++++++++++
```

Observação: o `git diff --stat` não lista arquivos novos ainda não
rastreados. O inventário completo está em `F5-content-inventory.md`.

## Interpretação

Os docs vivos foram atualizados apenas para refletir o conteúdo e a UI
realmente implementados na F5. Não houve alteração em baseline, backend,
API ou OpenAPI.
