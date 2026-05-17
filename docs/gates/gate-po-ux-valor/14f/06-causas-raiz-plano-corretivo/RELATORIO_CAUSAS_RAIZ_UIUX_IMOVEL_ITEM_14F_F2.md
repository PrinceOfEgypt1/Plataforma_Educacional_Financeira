# Relatório — Item 14F-F2 — Causas raiz das violações UI/UX do módulo Imóvel

## 1. Resumo executivo

Este relatório agrupa as 28 violações UI/UX do módulo Financiamento Imobiliário, registradas oficialmente no Item 14F-F1, em causas raiz operacionais.

O objetivo é impedir que a próxima correção trate apenas sintomas isolados. A correção deve atacar a estrutura que gerou as violações.

## 2. Fonte analisada

- `docs/gates/gate-po-ux-valor/14f/05-fail-oficial-uiux-imovel/EVIDENCIA_AUDITOR_UIUX_IMOVEL_ITEM_14F_F1.json`

Resumo da fonte:

| Severidade | Quantidade |
|---|---:|
| high | 19 |
| medium | 9 |
| low | 0 |
| total | 28 |

## 3. Distribuição por código

| Código | Quantidade |
|---|---:|
| `UX-DUP-001` | 14 |
| `UX-DUP-002` | 9 |
| `UX-CTA-001` | 2 |
| `UX-CTA-002` | 2 |
| `UX-MOBILE-001` | 1 |

## 4. Causas raiz identificadas

### F2-RC-001 — Duplicidade e ambiguidade entre componentes ativos e legados

Quantidade: 23 violações.

Códigos envolvidos:

| Código | Quantidade |
|---|---:|
| `UX-DUP-001` | 14 |
| `UX-DUP-002` | 9 |

Arquivos afetados:

- `frontend/src/components/financing/RealEstateFinancingTable.tsx`
- `frontend/src/components/financing/FinanciamentoTable.tsx`
- `frontend/src/components/financing/RealEstateCompareChart.tsx`
- `frontend/src/components/financing/FinanciamentoCompareChart.tsx`
- `frontend/src/components/financing/FinanciamentoSummary.tsx`
- `frontend/src/components/financing/FinanciamentoSaibaMais.tsx`

Interpretação:

Há componentes canônicos e componentes legados compartilhando identificadores ou permanecendo expostos como se fossem ativos. Isso cria ambiguidade de teste, risco de regressão e ruído de manutenção.

Correção esperada:

- definir componente canônico;
- remover legado do fluxo ativo quando possível;
- marcar legado com sufixo `-legacy` quando precisar permanecer;
- atualizar testes e referências;
- exigir eliminação de `UX-DUP-001` e `UX-DUP-002`.

### F2-RC-002 — CTAs da sidebar navegam para destino genérico

Quantidade: 3 violações.

Códigos envolvidos:

| Código | Quantidade |
|---|---:|
| `UX-CTA-001` | 1 |
| `UX-CTA-002` | 2 |

Arquivo afetado:

- `frontend/src/components/financing/RealEstateScenarioSidebar.tsx`

Interpretação:

CTAs com rótulos diferentes continuam apontando para destino genérico, especialmente `resultado`. Isso quebra a regra de propósito único e enfraquece a navegação por zonas.

Correção esperada:

- substituir destino genérico por zona explícita;
- garantir rótulo, promessa e destino coerentes;
- aplicar `tabbed single-panel interaction`;
- testar estado ativo após clique.

### F2-RC-003 — CTAs de próximos passos reutilizam destino sem diferenciação

Quantidade: 1 violação.

Código envolvido:

| Código | Quantidade |
|---|---:|
| `UX-CTA-001` | 1 |

Arquivo afetado:

- `frontend/src/components/financing/RealEstateNextStepsZone.tsx`

Interpretação:

A zona de próximos passos possui CTAs diferentes apontando para o mesmo destino sem diferenciação clara de propósito, contexto ou resultado.

Correção esperada:

- consolidar CTAs redundantes; ou
- diferenciar rótulo, contexto e destino; e
- manter função única para cada card/botão.

### F2-RC-004 — Sidebar com largura fixa sem proteção responsiva

Quantidade: 1 violação.

Código envolvido:

| Código | Quantidade |
|---|---:|
| `UX-MOBILE-001` | 1 |

Arquivo afetado:

- `frontend/src/components/financing/RealEstateScenarioSidebar.tsx`

Interpretação:

A sidebar possui largura fixa sem guarda clara de breakpoint, gerando risco de quebra em telas menores.

Correção esperada:

- ocultar ou transformar a sidebar abaixo do breakpoint definido;
- substituir por bloco superior, drawer, accordion ou cards compactos;
- preservar legibilidade e navegação em mobile.

## 5. Conclusão

As 28 violações não representam 28 problemas independentes.

Elas se agrupam em quatro causas raiz. A maior concentração está na convivência ambígua entre componentes ativos e legados.

A próxima etapa deve gerar prompt ou plano de implementação que ataque estas causas raiz em ordem, começando por `F2-RC-001`.
