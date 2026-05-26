# Matriz de Conformidade F8D × F8C-v6.2 + F8C-v6.3

**Data:** 2026-05-26
**Status:** Autoavaliação estrutural — aceite visual humano pendente

---

## Conformidade F8C-v6.2 (Especificação Visual Determinística)

| Requisito F8C-v6.2 | Status | Evidência |
|-------------------|--------|-----------|
| 7 etapas da jornada preservadas | ✓ | JOURNEY_STEPS em FinanciamentoCockpit.tsx |
| Etapa 1 — Preparar: HomeView com conceitos | ✓ | HomeView + QuestionCard × 3 |
| Etapa 2 — Simular: formulário real → API | ✓ | SimulationPanel → simularFinanciamentoImobiliario |
| Etapa 3 — Resultado: ScoreCard + InsightBox | ✓ | RealEstateSummaryZone refatorado |
| Etapa 4 — Entender: ConceptPanel | ✓ | ConceptPanel preservado |
| Etapa 5 — Comparar: BeforeAfterCard + gráfico | ✓ | ComparePanel com BeforeAfterCard |
| Etapa 6 — Conferir: tabela + memória | ✓ | TablePanel + RealEstateMemoryPanel |
| Etapa 7 — Decidir: fontes + próximos passos | ✓ | RealEstateSourcesPanel + RealEstateNextStepsZone |
| API real sem mock | ✓ | compararFinanciamentos, simularFinanciamentoImobiliario |
| Backend não alterado | ✓ | Nenhum arquivo em /backend/ modificado |

---

## Conformidade F8C-v6.3 (Observatory Dark Cards)

| Requisito F8C-v6.3 | Status | Evidência |
|-------------------|--------|-----------|
| Fonte DM Sans carregada | ✓ | layout.tsx — DM_Sans, --font-dm-sans |
| Fonte DM Mono carregada | ✓ | layout.tsx — DM_Mono, --font-dm-mono |
| Token OBS.bg = #030811 | ✓ | ObservatoryDarkCards.tsx |
| Token OBS.surface = #0a1628 | ✓ | ObservatoryDarkCards.tsx |
| Token OBS.accent = #3b82f6 | ✓ | ObservatoryDarkCards.tsx |
| Token OBS.accent2 = #06b6d4 | ✓ | ObservatoryDarkCards.tsx |
| Token OBS.gold = #f59e0b | ✓ | ObservatoryDarkCards.tsx |
| Token OBS.green = #10b981 | ✓ | ObservatoryDarkCards.tsx |
| Token OBS.red = #ef4444 | ✓ | ObservatoryDarkCards.tsx |
| ScoreCard implementado | ✓ | ObservatoryDarkCards.tsx — export ScoreCard |
| MetricCard implementado | ✓ | ObservatoryDarkCards.tsx — export MetricCard |
| ChecklistCard implementado | ✓ | ObservatoryDarkCards.tsx — export ChecklistCard |
| BeforeAfterCard implementado | ✓ | ObservatoryDarkCards.tsx — export BeforeAfterCard |
| QuestionCard implementado | ✓ | ObservatoryDarkCards.tsx — export QuestionCard |
| InsightBox implementado | ✓ | ObservatoryDarkCards.tsx — export InsightBox |
| ApplyCard implementado | ✓ | ObservatoryDarkCards.tsx — export ApplyCard |
| Nomenclatura "SAC x PRICE" (x minúsculo) | ✓ | Corrigido em FinanciamentoCockpit.tsx linha 1340 |
| Unicode × proibido | ✓ | Grep: 0 ocorrências nos arquivos F8D |
| Tokens inline (não Tailwind custom) | ✓ | Todos os tokens via CSSProperties inline |

---

## Requisitos PROIBIDOS (conformidade negativa)

| Proibição | Violação? | Evidência |
|-----------|-----------|-----------|
| Alterar backend | NÃO | Nenhum arquivo em /backend/ |
| Alterar API | NÃO | financiamentoService.ts não modificado |
| Alterar fórmulas financeiras | NÃO | formValidation.ts não modificado |
| Criar motor financeiro paralelo | NÃO | Cálculos via API real |
| Usar mock estático | NÃO | Integração real preservada |
| Remover testes | NÃO | 459 → 493 (34 novos) |
| Usar SAC × PRICE (U+00D7) | NÃO | Corrigido para x minúsculo |
| Declarar aceite visual humano | NÃO | Documento declara explicitamente que não |
| Declarar Sprint 5 liberada | NÃO | Não mencionado |
