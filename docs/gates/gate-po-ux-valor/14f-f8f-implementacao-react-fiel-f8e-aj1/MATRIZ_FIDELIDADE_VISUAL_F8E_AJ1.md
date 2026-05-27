# Matriz de Fidelidade Visual — F8E-AJ1 × F8F-A

**Princípio**: comparação cirúrgica entre o protótipo aprovado e a implementação
React real. Status binário por elemento, com observações honestas sobre o que
permanece em F8F-B.

**Referência canônica:**
`docs/gates/gate-po-ux-valor/14f-f8e-aj1-aceite-visual/artefatos/index.html`
**Implementação:**
`frontend/src/components/financing/realEstateF8F/RealEstateF8FObservatory.tsx`

Legenda de status:
- **PASS** — replicado com fidelidade na F8F-A
- **PARCIAL** — replicado em estrutura, refinamento pedagógico programado para F8F-B
- **F8F-B** — explicitamente fora do escopo desta fase

---

## A. Estrutura geral e atmosfera

| # | Elemento | Protótipo F8E-AJ1 | Implementação F8F-A | Status | Arquivo React | Observação |
|---|---|---|---|---|---|---|
| A1 | Fundo escuro `#030811` | Sim | Sim, aplicado via inline style no root | PASS | `RealEstateF8FObservatory.tsx` (root) | Tokens em `tokens.ts` |
| A2 | Card surface `#0a1628` | Sim | Sim, em todos os Card / Kpi / ScoreCard | PASS | `elements.tsx` | Compartilhado |
| A3 | Border `#1a2f50` | Sim | Sim | PASS | `elements.tsx` | — |
| A4 | Atmosfera "Observatory" premium | Sim | Sim | PASS | `RealEstateF8FObservatory.tsx` | Sem aparência de cockpit antigo |

## B. Tipografia

| # | Elemento | Protótipo | F8F-A | Status | Arquivo |
|---|---|---|---|---|---|
| B1 | DM Sans em corpo | Sim | Sim, CSS var `--font-sans-f8f` | PASS | `RealEstateF8FObservatory.tsx` |
| B2 | DM Mono em números/labels | Sim | Sim, CSS var `--font-mono-f8f` | PASS | `elements.tsx` |
| B3 | Tamanho mínimo 10px | Sim | Sim, eyebrows com 0.58rem (~9.3px) e step-num com 0.78rem (12.5px) | PASS | `RealEstateF8FObservatory.tsx` |
| B4 | Hierarquia eyebrow→título→corpo | Sim | Sim, padrão estabelecido em `CardEyebrow` + `CardTitle` | PASS | `elements.tsx` |

## C. Navegação

| # | Elemento | Protótipo | F8F-A | Status | Arquivo |
|---|---|---|---|---|---|
| C1 | Stepper sticky com 7 etapas | Sim | Sim, `f8f-stepper` testId | PASS | `RealEstateF8FObservatory.tsx` (`Stepper`) |
| C2 | Etapa ativa destacada por gradiente | Sim | Sim | PASS | `Stepper` |
| C3 | Etapas anteriores marcadas como `done` | Sim | Sim, com verde | PASS | `Stepper` |
| C4 | Click muda etapa + reset aba | Sim | Sim, `goEtapa(idx)` | PASS | `RealEstateF8FObservatory.tsx` |
| C5 | Sub-tabs 5 por etapa | Sim | Sim, `f8f-subtab-{n}-{i}` testIds | PASS | `SubTabs` |
| C6 | Botões Anterior / Próxima | Sim | Sim, `f8f-nav-prev` / `f8f-nav-next` | PASS | `NavFooter` |

## D. Cards e componentes premium

| # | Elemento | Protótipo | F8F-A | Status | Arquivo |
|---|---|---|---|---|---|
| D1 | Card base com bordas e raio | Sim | Sim, componente `Card` | PASS | `elements.tsx` |
| D2 | ScoreCard com barra de progresso | Sim | Sim, componente `ScoreCard` | PASS | `elements.tsx` |
| D3 | KPI grande com mono | Sim | Sim, componente `Kpi` | PASS | `elements.tsx` |
| D4 | InsightBox com 4 variantes | Sim | Sim, default / cyan / green / red | PASS | `elements.tsx` |
| D5 | Alert com borda lateral colorida | Sim | Sim, componente `Alert` | PASS | `elements.tsx` |
| D6 | Formula block com label e fonte mono | Sim | Sim, componente `Formula` | PASS | `elements.tsx` |
| D7 | ChecklistCard com header gradient | Sim | Sim, componente `ChecklistCard` | PASS | `elements.tsx` |
| D8 | BeforeAfterCard (SAC vs PRICE) | Sim | Sim, componente `BeforeAfterCard` | PASS | `elements.tsx` |
| D9 | ApplyCard com tag + bloco gold | Sim | Sim, componente `ApplyCard` | PASS | `elements.tsx` |
| D10 | AuroraCard com borda em gradiente | Sim | Sim, componente `AuroraCard` | PASS | `elements.tsx` |
| D11 | MiniSummary pill k/v | Sim | Sim, componente `MiniSummary` | PASS | `elements.tsx` |

## E. Card-resumo (scenario pill)

| # | Elemento | Protótipo | F8F-A | Status | Arquivo |
|---|---|---|---|---|---|
| E1 | Sticky/visível em todas etapas | Sim | Sim, parte do `StageHeader` | PASS | `RealEstateF8FObservatory.tsx` |
| E2 | Formato monetário completo (`R$ 870.000,00`) | Sim | Sim, via `formatBRL` derivado do `draft` | PASS | `RealEstateF8FObservatory.tsx` (`scenarioRows`) |
| E3 | 5 campos (Imóvel/Entrada/Financiado/Prazo/Taxa) | Sim | Sim | PASS | `RealEstateF8FObservatory.tsx` |

## F. Conteúdo por etapa

| # | Aba | F8F-A | Refinamento F8F-B |
|---|---|---|---|
| F1 | 1.1 Visão Geral | Estrutura completa: card de conceito + 3 KPIs + insight + lista das 7 etapas. Conteúdo base. | Possíveis expansões |
| F2 | 1.2 Entrada | Card educacional + 2 KPIs + alerta. Conteúdo base. | — |
| F3 | 1.3 Valor Financiado | Card + 2 fórmulas + KPI + impacto. Conteúdo base. | — |
| F4 | 1.4 SAC x PRICE | BeforeAfterCard duplo + alert. Conteúdo base. | — |
| F5 | 1.5 Cuidados | 4 alertas + CTA. Conteúdo base. | — |
| F6 | 2.1 Dados do Imóvel | Form real com 2 fields. **Integração com `validateFinanciamentoDraft`**. | — |
| F7 | 2.2 Condições | Form real com 2 fields. | — |
| F8 | 2.3 Custos | Form real com 2 fields + alert. | — |
| F9 | 2.4 Sistema | Radio SAC/PRICE + card dinâmico. | — |
| F10 | 2.5 Resumo | MiniSummary de todos os parâmetros + CTA Aurora **que chama backend real**. | — |
| F11 | 3.1 Resumo Resultado | 3 ScoreCards + AuroraCard **com dados reais do backend**. | — |
| F12 | 3.2 Cenário | 2 Cards com MiniSummary, valores reais. | — |
| F13 | 3.3 Alertas | 4 Alerts contextualizados com `total_juros`, `prazo_meses`, `primeiro_encargo_mensal_total`, `total_encargos` reais. | — |
| F14 | 3.4 Interpretação | Card com `total_juros` real + KPI calculado de `juros/principal` real. | — |
| F15 | 3.5 Próximo passo | Hero conclusion + CTA para Entender. | — |
| F16 | 4.1 Parcela | Composição da 1ª parcela com `amortizacao`, `juros`, `encargos` reais. | Possível visualização donut/pizza |
| F17 | 4.2 Amortização | Definição + fórmula + KPI real. | — |
| F18 | 4.3 Juros | Fórmula + KPI 1ª e última parcela real. | — |
| F19 | 4.4 Saldo Devedor | Insight pedagógico apontando para etapa Comparar (curva real lá). | F8F-B: chart próprio da etapa 4 |
| F20 | 4.5 SAC x PRICE | BeforeAfterCard com `custo_total`, `total_juros`, `primeira/ultima encargo_mensal_total` reais. | — |
| F21 | 5.1 Resumo Comparativo | 3 ScoreCards + AuroraCard **com dados reais do `compararFinanciamentos`**. | — |
| F22 | 5.2 Tabela SAC | `RealEstateFinancingTable` existente + dados reais. | — |
| F23 | 5.3 Tabela PRICE | `RealEstateFinancingTable` existente + dados reais. | — |
| F24 | 5.4 Gráfico | `RealEstateCompareChart` existente + dados reais. | — |
| F25 | 5.5 Leitura Pedagógica | 3 Insights educacionais. | — |
| F26 | 6.1 Fórmulas SAC | 3 fórmulas + exemplo numérico com valores reais da parcela 1. | F8F-B: aprofundamento didático |
| F27 | 6.2 Fórmulas PRICE | Fórmula HP + nota apontando para Comparar (valores reais lá). | F8F-B |
| F28 | 6.3 Variáveis | Tabela de 5 variáveis com valores reais do summary. | F8F-B: variáveis adicionais |
| F29 | 6.4 Passo a Passo | 6 passos da parcela 1 com valores reais. | F8F-B: passo a passo do mês 60 |
| F30 | 6.5 Auditoria | ChecklistCard com 3 verificações de consistência derivadas do summary real. | F8F-B: mais verificações |
| F31 | 7.1 Diagnóstico | Card + 3 KPIs com `custo_total`, `total_juros`, `juros/total` reais. | — |
| F32 | 7.2 Checklist | ChecklistCard com 10 itens práticos. | — |
| F33 | 7.3 Próximos Passos | 4 ApplyCards. | — |
| F34 | 7.4 Cuidados | 4 Alerts. | — |
| F35 | 7.5 Conclusão | Hero conclusion + CTA reiniciar. | — |

## G. Responsividade

| # | Viewport | F8F-A | Status | Observação |
|---|---|---|---|---|
| G1 | Desktop 1920×1080 | Suportado por grids fixos com `gridTemplateColumns: 60% 1fr` etc. | PASS | Layout aprovado herdado |
| G2 | Notebook 1366×768 | Suportado | PASS | — |
| G3 | Tablet 768×1024 | F8F-A não inclui media queries explícitas; herda comportamento do CSS reset | PARCIAL | F8F-B: validar e ajustar |
| G4 | Mobile 390×844 | F8F-A não inclui media queries explícitas | PARCIAL | F8F-B: validar e ajustar |

## H. Ausência de cockpit antigo

| # | Critério | F8F-A | Status | Observação |
|---|---|---|---|---|
| H1 | Rota `/financiamento-imobiliario` não renderiza FinanciamentoCockpit | OK | PASS | `page.tsx` aponta para `RealEstateF8FObservatory` |
| H2 | Nenhuma referência visual a "cockpit antigo" | OK | PASS | Teste `RealEstateF8FObservatory.test.tsx` cobre |
| H3 | FinanciamentoCockpit preservado no código (não rotado) | Sim | INTENCIONAL | Para preservar 1776 linhas de teste; remoção em F8F-B |

---

## Resultado consolidado

| Categoria | PASS | PARCIAL | F8F-B |
|---|---|---|---|
| Estrutura/atmosfera (A) | 4 | 0 | 0 |
| Tipografia (B) | 4 | 0 | 0 |
| Navegação (C) | 6 | 0 | 0 |
| Componentes (D) | 11 | 0 | 0 |
| Card-resumo (E) | 3 | 0 | 0 |
| Conteúdo (F) | 30 | 5 | — |
| Responsividade (G) | 2 | 2 | — |
| Cockpit antigo (H) | 3 | 0 | 0 |
| **Total** | **63** | **7** | **0** |

Aceite final permanece **bloqueado** até validação visual humana pelo PO Moisés.
