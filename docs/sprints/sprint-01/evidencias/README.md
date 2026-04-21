# Evidências — Sprint 1

**Sprint:** 01
**Finalidade:** Reunir todas as saídas executáveis e os diffs que suportam
o veredito de `validacao-oficial.md`.

---

## Índice

| Arquivo | Conteúdo | Fatia que materializa |
|---|---|---|
| `base-branch.md` | Hashes de `HEAD` na abertura do branch e nas fronteiras entre fatias (PLANO §2.1). | Fatias 1–3 (appends) |
| `make-verify-backend.txt` | Saída integral de `make verify` pós-Fatia 1. | Fatia 1 |
| `make-test-contract.txt` | Saída integral de `make test-contract` pós-Fatia 1. | Fatia 1 |
| `make-verify-frontend-full.txt` | Saída integral de `make verify` pós-Fatia 2 (pipeline completo). | Fatia 2 |
| `make-verify-frontend-lint.txt` | `pnpm lint` isolado. | Fatia 2 |
| `make-verify-frontend-format.txt` | `pnpm format:check` isolado. | Fatia 2 |
| `make-verify-frontend-tsc.txt` | `pnpm typecheck` isolado. | Fatia 2 |
| `make-verify-frontend-test.txt` | `pnpm test` isolado (Vitest). | Fatia 2 |
| `openapi-diff.md` | Diff declarativo v0→v1 de `docs/api/openapi.json` (o que mudou do baseline da Sprint 0 para pós-Fatia 1). | Fatia 3 |
| `impact-agent-ci.md` | Prova do step `impact-advisory` no CI (hash do run + snippet do log). | Fatia 4 |
| `pendencias-herdadas-fechamento.md` | Checklist dos itens da §9 da Sprint 0 com status de fechamento. | Fatia 3 |
| `screens/README.md` | Onde colocar capturas de tela das 12 rotas e dos 3 estados reutilizáveis. | Fatia 3 |

---

## Como esta pasta é alimentada

- Os arquivos `*.txt` são **gravados pelos `CLI_BLOCK.sh`** de cada fatia
  (via `tee`), sendo committados dentro do commit atômico da fatia correspondente.
- Os arquivos `*.md` são **redigidos nesta Fatia 3** (docs), exceto
  `impact-agent-ci.md` que é finalizado na Fatia 4 após o primeiro run
  verde do step.
- `screens/` é reservado para capturas manuais do operador, opcionais nesta
  sprint — o conteúdo das telas já é validado determinisricamente por
  Vitest + Testing Library.

---

## Rastreabilidade cruzada

- Mapa global desta sprint: `docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md`.
- Veredito que consome estas evidências: `../validacao-oficial.md`.
- Relatório de execução narrativo: `../relatorio-execucao.md`.
- Relatório forense granular: `../relatorio-forense.md`.
