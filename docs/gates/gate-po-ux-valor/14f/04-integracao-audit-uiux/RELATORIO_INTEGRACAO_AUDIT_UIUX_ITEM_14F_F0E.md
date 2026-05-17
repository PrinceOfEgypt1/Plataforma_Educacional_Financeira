# Relatório — Item 14F-F0E — Integração operacional do audit:uiux

## 1. Resumo executivo

Este item formaliza o comando `audit:uiux` como ferramenta operacional do frontend e da governança UI/UX.

A entrega consolida scripts auxiliares no `frontend/package.json` e cria um runbook oficial para orientar uso, limites e critérios de promoção futura para gate bloqueante.

## 2. Scripts formalizados

| Script | Comando |
|---|---|
| `audit:uiux` | `node scripts/auditor-uiux.mjs` |
| `audit:uiux:contract` | `node scripts/auditor-uiux.mjs --contract-only` |
| `audit:uiux:expect-fail` | `node scripts/auditor-uiux.mjs --expect-fail` |
| `audit:uiux:json` | `node scripts/auditor-uiux.mjs --json --expect-fail` |

## 3. Validações esperadas

~~~bash
cd frontend
pnpm audit:uiux:contract
pnpm audit:uiux:expect-fail
pnpm --silent audit:uiux:json
pnpm test -- src/__tests__/scripts/auditorUiux.test.ts
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
~~~

## 4. Decisão de CI

O auditor ainda não será obrigatório no CI oficial.

Motivo: o módulo Imóvel ainda está em estado conhecido de reprovação UI/UX. Tornar o auditor bloqueante agora travaria a linha principal antes da correção planejada.

## 5. Próximo passo

Após esta integração, o próximo passo correto é o Item 14F-F1: registrar o FAIL oficial do módulo Imóvel com base no auditor já criado, testado e formalizado.
