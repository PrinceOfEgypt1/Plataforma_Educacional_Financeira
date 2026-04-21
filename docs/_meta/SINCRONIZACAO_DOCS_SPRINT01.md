# Matriz de sincronização documental — Sprint 1

**Versão:** 1.0
**Gerado em:** 2026-04-18
**Status:** VIVO
**Precedente:** `docs/_meta/SINCRONIZACAO_DOCS_BASELINE.md` (Sprint 0),
quando aplicável. Esta matriz **não substitui** o `living_docs.json` — ela
é a narrativa focada desta sprint, enquanto o JSON é o índice global.

---

## 1. Documentos vivos **atualizados** nesta sprint

| Doc | Caminho | Escopo da alteração | Fatia que alterou |
|---|---|---|---|
| Doc 04 | `docs/04_Arquitetura_de_Software.md` | §6.3 — +2 sub-bullets documentando que `app/core/` passa a conter o contrato-base (`envelope`, `errors`, `request_id`) e que `app/api/` passa a agrupar sob `v1/` (ADR-0006). | Fatia 3 |
| Doc 19 | `docs/19_Matriz_Rastreabilidade.md` | +2 linhas (`REQ-CTR-001`, `RF-HEALTH-001`). | Fatia 3 |
| Doc 27 | `docs/27_Versionamento_API.md` | Apêndice vivo: `v1 active, 2026-04`. **Também serve como confirmação formal de C3** (identidade e caminho do doc-27). | Fatia 3 |
| Doc `INVENTARIO_TELAS` | `docs/ui/INVENTARIO_TELAS.md` | §1 reescrito com 12 slugs canônicos (`/cartao-rotativo` e `/investir-vs-quitar` em vez de `/cartao` e `/cartao-rotativo` duplicado); §6 com status real pós-Sprint 1. | Fatia 3 |
| `README.md` | `README.md` | Atualizado pós-Sprint 1; comandos reais validados; referência a `docs/adr/` (não mais `docs/20_ADR/`); novas seções sobre testes de componente. | Fatia 3 |
| `living_docs.json` | `docs/_meta/living_docs.json` | `generated_at: 2026-04-18`; entradas de `sprint-01`; `note` corrigida em `doc_20_index`; entradas de contrato-base anotadas com `added_sprint: sprint-01`. | Fatia 3 |
| `openapi.json` | `docs/api/openapi.json` | Regerado — inclui `/api/v1/contract/ping` + schemas `ResponseEnvelope_*`, `Meta`, `Problem`. | Fatia 3 |

---

## 2. Documentos **criados** nesta sprint

| Doc | Caminho | Natureza |
|---|---|---|
| Relatório de execução | `docs/sprints/sprint-01/relatorio-execucao.md` | Governança da sprint. |
| Relatório forense | `docs/sprints/sprint-01/relatorio-forense.md` | Cadeia de custódia. |
| Validação oficial | `docs/sprints/sprint-01/validacao-oficial.md` | Veredito formal. |
| Índice de evidências | `docs/sprints/sprint-01/evidencias/README.md` | Navegação. |
| Diff do OpenAPI | `docs/sprints/sprint-01/evidencias/openapi-diff.md` | Evidência técnica. |
| Impact agent no CI | `docs/sprints/sprint-01/evidencias/impact-agent-ci.md` | Prova do step advisory no GitHub Actions (stub até Fatia 4). |
| Screens | `docs/sprints/sprint-01/evidencias/screens/README.md` | Reserva para capturas opcionais. |
| Fechamento de pendências | `docs/sprints/sprint-01/evidencias/pendencias-herdadas-fechamento.md` | Checklist §9 Sprint 0. |
| Matriz desta sprint | `docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md` | Este arquivo. |

---

## 3. Documentos **não alterados** e por quê (rastreabilidade explícita)

| Doc | Motivo de não alteração |
|---|---|
| Doc 00 (`00_INDICE_GERAL.md`) | Sem mudança estrutural de índice — apenas entradas adicionadas já cobertas pelo `living_docs.json`. |
| Doc 02 (`02_Escopo_Funcional.md`) | Sprint 1 não altera escopo funcional — apenas materializa contrato-base e shell. |
| Doc 03 (`baseline/03_Regras_de_Negocio.md`) | BASELINE, estático por definição. |
| Doc 05 (`05_Modelagem_de_Dados.md`) | Sem mudanças de modelo na Sprint 1. |
| Doc 06 (`06_API_e_Contratos.md`) | Contrato já previa envelope + RFC 7807; a materialização em código não exige rewrite — a rastreabilidade fica no Doc 19 + Doc 27. |
| Doc 07, 08, 10, 12, 13–18, 22–26 | Fora de escopo desta sprint. |
| Doc 09 (`09_Qualidade_Testes.md`) | Mantém a política; implementações concretas (Vitest + Testing Library) rastreadas por Doc 19 e pelo relatório de execução. |
| ADRs 0001–0007 | Já existentes; Sprint 1 referencia ADR-0006 e ADR-0007, mas não altera os arquivos. |

---

## 4. Entradas do `living_docs.json` atualizadas nesta Fatia 3

- Campo global `generated_at` → `"2026-04-18"`.
- Todos os documentos tocados pela Sprint 1 ganham, quando aplicável:
  - `commit`: hash do commit da fatia docs (preenchido pelo operador
    imediatamente após o `git commit` desta fatia).
  - `added_sprint` ou nota `note` com `"Atualizado na Sprint 1"`.
- Entradas novas de governança da Sprint 1:
  - `sprint_01_execucao` → `docs/sprints/sprint-01/relatorio-execucao.md`.
  - `sprint_01_forense` → `docs/sprints/sprint-01/relatorio-forense.md`.
  - `sprint_01_validacao` → `docs/sprints/sprint-01/validacao-oficial.md`.
  - `sinc_sprint01` → `docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md`.

---

## 5. Invariantes preservadas

- Cada documento vivo alterado mantém `Versão` + `Status` + seu próprio
  cabeçalho canônico.
- Nenhum documento BASELINE foi modificado.
- Nenhum documento da Sprint 0 foi modificado.
- `docs/_meta/POLITICA_OPERACIONAL_DE_SINCRONIZACAO_DOCUMENTAL.md`
  permanece autoritativo.

---

## 6. Rastreabilidade cruzada

- Narrativa executiva: `docs/sprints/sprint-01/relatorio-execucao.md` §8.
- Granularidade forense: `docs/sprints/sprint-01/relatorio-forense.md` §1.3.
- Veredito: `docs/sprints/sprint-01/validacao-oficial.md`.
- Fechamento de pendências: `docs/sprints/sprint-01/evidencias/pendencias-herdadas-fechamento.md`.
