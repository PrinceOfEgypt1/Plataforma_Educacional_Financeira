# PEF — Item 14F-F1 — FAIL oficial UI/UX do módulo Imóvel

## 1. Objetivo

Registrar oficialmente a reprovação UI/UX atual do módulo Financiamento Imobiliário com base no auditor `audit:uiux`.

## 2. Natureza do item

Este item não corrige a interface.

Este item cria uma fotografia oficial, versionada e auditável do estado atual de reprovação do módulo Imóvel.

## 3. Resultado oficial

O módulo Financiamento Imobiliário está reprovado no auditor UI/UX nesta etapa.

Resumo da auditoria:

| Severidade | Quantidade |
|---|---:|
| high | 19 |
| medium | 9 |
| low | 0 |
| total | 28 |

## 4. Códigos detectados

| Código | Quantidade | Interpretação |
|---|---:|---|
| `UX-DUP-001` | 14 | `data-testid` duplicado entre componente ativo e legado. |
| `UX-DUP-002` | 9 | Componente legado exposto ou testado como se fosse ativo. |
| `UX-CTA-001` | 2 | CTAs diferentes apontam para o mesmo destino sem justificativa. |
| `UX-CTA-002` | 2 | Rótulo do CTA não corresponde ao destino real. |
| `UX-MOBILE-001` | 1 | Layout mobile viola regra mínima de navegação e legibilidade. |

## 5. Evidência material

A evidência JSON oficial está versionada em:

- `docs/gates/gate-po-ux-valor/14f/05-fail-oficial-uiux-imovel/EVIDENCIA_AUDITOR_UIUX_IMOVEL_ITEM_14F_F1.json`

## 6. Decisão de governança

O módulo Imóvel não deve avançar para aceite PO/UX enquanto estas violações permanecerem sem tratamento.

A próxima etapa deve agrupar as violações por causa raiz para orientar correções cirúrgicas.
