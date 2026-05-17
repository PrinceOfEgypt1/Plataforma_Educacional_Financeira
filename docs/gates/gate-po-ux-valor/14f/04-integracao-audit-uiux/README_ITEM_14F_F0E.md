# PEF — Item 14F-F0E — Integração operacional do audit:uiux

## 1. Objetivo

Formalizar a integração operacional do comando `audit:uiux` ao frontend e à governança do Gate PO/UX/Valor.

## 2. Natureza do item

Este item não corrige a interface do módulo Imóvel.

Este item também não promove o auditor para gate obrigatório do CI oficial.

## 3. Entrega principal

- Criação do runbook `docs/governance/frontend/PEF_AUDIT_UIUX_COMMAND_RUNBOOK.md`
- Formalização de scripts auxiliares no `frontend/package.json`

## 4. Scripts oficiais

| Script | Finalidade |
|---|---|
| `pnpm audit:uiux` | Executa o auditor em modo padrão. |
| `pnpm audit:uiux:contract` | Valida apenas o contrato UI/UX. |
| `pnpm audit:uiux:expect-fail` | Executa auditoria esperando reprovação objetiva do módulo atual. |
| `pnpm audit:uiux:json` | Gera evidência JSON da auditoria atual. |

## 5. Decisão de governança

O auditor permanece como ferramenta diagnóstica e de governança nesta fase.

Ele só deve virar bloqueio obrigatório de CI depois que o módulo Imóvel for corrigido, auditado sem violações bloqueantes e aceito pelo PO/UX.
