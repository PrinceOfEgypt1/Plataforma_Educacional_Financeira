# Manifesto de arquivos — Item 14F-F0C

## Tipo de entrega

Auditor automático UI/UX para o módulo Financiamento Imobiliário.

## Arquivos criados

| Caminho | Finalidade |
|---|---|
| `frontend/scripts/auditor-uiux.mjs` | Auditor automático que carrega o contrato UI/UX e emite falhas objetivas. |
| `docs/gates/gate-po-ux-valor/14f/02-auditor-uiux/README_ITEM_14F_F0C.md` | Resume objetivo, escopo e uso do auditor. |
| `docs/gates/gate-po-ux-valor/14f/02-auditor-uiux/MANIFESTO_ARQUIVOS_ITEM_14F_F0C.md` | Lista arquivos criados e alterados no item. |
| `docs/gates/gate-po-ux-valor/14f/02-auditor-uiux/RELATORIO_AUDITOR_UIUX_ITEM_14F_F0C.md` | Registra evidências e resultado inicial da auditoria. |

## Arquivos alterados

| Caminho | Finalidade |
|---|---|
| `frontend/package.json` | Adiciona o script `audit:uiux`. |
| `docs/00_INDICE_GERAL.md` | Inclui referência ao Item 14F-F0C. |
| `docs/_meta/living_docs.json` | Registra os documentos vivos do item. |

## Fora de escopo

- Correção da interface do módulo Imóvel.
- Alteração de backend.
- Alteração de fórmulas financeiras.
- Alteração de contratos de API.
- Alteração de workflows de CI.
- Tornar `audit:uiux` obrigatório no gate oficial.
