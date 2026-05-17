# PEF — Item 14F-F2 — Causas raiz e plano corretivo cirúrgico

## 1. Objetivo

Agrupar as 28 violações UI/UX registradas no Item 14F-F1 por causa raiz e preparar um plano corretivo cirúrgico para orientar a próxima etapa de implementação.

## 2. Natureza do item

Este item não corrige código React.

Este item transforma o FAIL oficial em um diagnóstico operacional priorizado, para impedir correções cosméticas, dispersas ou orientadas apenas por sintomas.

## 3. Fonte material

A fonte deste item é a evidência oficial versionada no Item 14F-F1:

- `docs/gates/gate-po-ux-valor/14f/05-fail-oficial-uiux-imovel/EVIDENCIA_AUDITOR_UIUX_IMOVEL_ITEM_14F_F1.json`

## 4. Resultado do agrupamento

As 28 violações foram agrupadas em 4 causas raiz:

| Causa raiz | Quantidade | Severidade predominante |
|---|---:|---|
| F2-RC-001 — Duplicidade e ambiguidade entre componentes ativos e legados | 23 | high |
| F2-RC-002 — CTAs da sidebar navegam para destino genérico | 3 | high |
| F2-RC-003 — CTAs de próximos passos reutilizam destino sem diferenciação | 1 | high |
| F2-RC-004 — Sidebar com largura fixa sem proteção responsiva | 1 | high |

## 5. Entregáveis

- JSON de agrupamento por causa raiz.
- Relatório de causas raiz.
- Plano corretivo cirúrgico.
- Manifesto de arquivos.
- Atualização do índice geral.
- Atualização do `living_docs.json`.

## 6. Decisão de governança

A próxima implementação deve atacar as causas raiz, não apenas alterar textos, esconder elementos ou modificar o auditor para reduzir contadores artificialmente.
