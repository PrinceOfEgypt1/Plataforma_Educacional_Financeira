# Sprint 3.5 - Validacao Oficial

Data: 2026-05-06

## Veredito

Status da F3: aprovada com pendencias nao bloqueantes.

## Criterios de aceite

| Criterio | Status | Evidencia |
| --- | --- | --- |
| Partir de `main = origin/main = 2fcf231` | OK | `F3-git-baseline.md` |
| Nao iniciar Sprint 4 | OK | Execucao F3 local |
| Nao alterar backend/API/OpenAPI/calculos | OK | Escopo proibido e diff final |
| Home validada | OK | `F3-auditoria-final-uiux.md` |
| `/juros` validada | OK | `F3-auditoria-final-uiux.md` |
| `/amortizacao` validada | OK | `F3-auditoria-final-uiux.md` |
| Cockpit consistente | OK | Testes e auditoria |
| Conteudo educativo sob demanda | OK | Paineis/modais do cockpit |
| Responsividade basica | OK | Ajuste F3 + `F3-validacao-responsividade-a11y.md` |
| Acessibilidade basica | OK | `F3-validacao-responsividade-a11y.md` |
| Pipeline verde | OK | `F3-gates.md` |
| Runtime limpo verde | OK | `F3-gates.md` |
| Planilha nao alterada pela Codex | OK | Governanca |

## Home

Validada como tela compacta, com apresentacao curta e atalhos diretos para os
modulos disponiveis.

## `/juros`

Validada com Financial Cockpit, subtabs, KPIs, grafico central, painel
educacional e modal de aprofundamento.

## `/amortizacao`

Validada com Financial Cockpit, subtabs PRICE/SAC/Comparar, KPIs, grafico
central, tabela sob demanda, glossario/cuidados e modal de aprofundamento.

## Pendencias

- Residuo nao bloqueante: warning Recharts/jsdom em testes.
- Residuo nao bloqueante: refino mobile dedicado pode ser planejado em sprint futura.

## Decisao

A Sprint 3.5 esta apta a fechamento.
