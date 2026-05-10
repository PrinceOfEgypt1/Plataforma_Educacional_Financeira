# INVENTARIO UI COMPONENTS ATUAIS — SPRINT 4.5 / F1

**Projeto:** Plataforma Educacional Financeira (PEF)
**Sprint:** 4.5 — F1 — Inventario Real de UI Components e Divergencias
**Data:** 2026-05-09
**Branch de trabalho:** `codex/sprint-4-5-f1-inventario-ui-components`
**Base:** `main` / `origin/main @ 589c8c9`
**Escopo:** documentacao e analise; nenhuma implementacao de codigo.

---

## 1. Resumo executivo

A F1 confirma que a UI atual opera com uma shell principal unificada
(`FinancialCockpitShell`) e quatro modulos funcionais: diagnostico, juros,
amortizacao e financiamento imobiliario. Os demais oito modulos existem como
rotas e placeholders via `ModulePage`.

O inventario confirma a principal tese da F0: existem dois estilos de
implementacao coexistindo. O sistema `cockpit/` e dominante nos modulos de
juros e amortizacao, enquanto diagnostico e financiamento combinam primitives
do cockpit com Tailwind direto e componentes UI basicos (`AlertBanner`,
`SummaryCard`, `EducationPanel`). A divergencia mais sensivel esta nas tabelas
financeiras: ha quatro tabelas cockpit usando `.cockpit-table-wrap` com
`overflow: auto`, tres tabelas com `overflow-auto`, e duas tabelas de
financiamento com `overflow-x-auto`.

Esta F1 nao decide a abstracao final de tabelas. Ela recomenda que a F2 decida
formalmente entre `FinancialTable`, componentes por dominio com contrato comum
ou abordagem hibrida.

---

## 2. Estado inicial comprovado

Comandos executados antes da criacao desta entrega:

```bash
git status -sb
git branch --show-current
git fetch origin --prune
git checkout main
git pull --ff-only origin main
git rev-parse --short HEAD
git rev-parse --short origin/main
git diff --quiet HEAD origin/main && echo "OK: HEAD local = origin/main"
git log --oneline -5
ls -lh docs/sprints/sprint-04-5/00-plano/PLANO_EXECUCAO_SPRINT_4_5.md
grep -n "F1" docs/sprints/sprint-04-5/00-plano/PLANO_EXECUCAO_SPRINT_4_5.md | head -20
```

Resultado relevante:

```text
## main...origin/main
main
589c8c9
589c8c9
OK: HEAD local = origin/main
589c8c9 docs(sprint-4.5): planejar padronizacao de UI Components (#32)
7cd90c2 feat(financing): evoluir financiamento imobiliario com comparacao SAC x PRICE (#31)
e0f9da6 feat(financing): implementar financiamento imobiliario RF-FIN-001 (#30)
68dede4 feat(content): fechar Sprint 4 — conteudo educacional do diagnostico financeiro (#29)
f529d0b feat(ui): implementar cockpit do diagnostico financeiro (#28)
```

Branch criada para a F1:

```text
codex/sprint-4-5-f1-inventario-ui-components
```

---

## 3. Fatos, inferencias e limitacoes

### Fatos comprovados

- `frontend/src/app/(app)/layout.tsx` usa `ShellLayout`.
- `ShellLayout` delega para `FinancialCockpitShell`, nao para `Header` +
  `Sidebar`.
- `FinancialCockpitShell` usa `VISIBLE_MODULE_IDS` hardcoded com 8 ids.
- `MODULES` contem 12 modulos; 4 estao `disponivel` e 8
  `em-construcao`.
- `DiagnosticoSaibaMais` usa `CockpitModal`.
- `FinanciamentoSaibaMais` usa `CockpitModal`.
- `.cockpit-table-wrap` existe em `globals.css` e define `overflow: auto`.
- As tabelas de producao usam `.map(...)` ou `Array.from(...)`; nenhuma tabela
  de producao usa `.slice(` para cortar linhas.
- `Header.tsx` e `Sidebar.tsx` sao testados, mas nao aparecem no caminho ativo
  de runtime da shell.
- Existem dois exports chamados `EducationPanel` com semanticas diferentes.

### Inferencias

- `Header`, `Sidebar` e `NavItem` sao componentes legados ou candidatos a
  remocao, mas a F2/F3 deve decidir porque ainda possuem testes dedicados.
- `JurosTabs`, `JurosSimplesPanel`, `JurosCompostosPanel`,
  `CompararJurosPanel`, `AmortizacaoTabs`, `PricePanel`, `SacPanel` e
  `ComparePanel` parecem ser implementacoes anteriores, nao usadas pelas rotas
  ativas que renderizam `InterestCockpit` e `AmortizationCockpit`.
- O risco de importacao ambigua de `EducationPanel` e real quando se importa de
  barrels (`@/components/ui` vs `@/components/ui/cockpit`) ou se trabalha por
  autocomplete, embora os usos atuais estejam resolvidos por import explicito.

### Limitacoes

- Esta F1 fez leitura estatica e diagnosticos por shell; nao executou browser,
  Playwright ou inspecao visual responsiva.
- Testes foram mapeados por arquivos existentes e grep; a F1 nao executou a
  suite completa porque o objetivo e inventario documental.
- O diretorio `frontend/src/content/**` foi lido apenas indiretamente pelos
  imports dos componentes de conteudo/modal; nao foi inventariado como UI
  Component.

---

## 4. Metodologia de inspecao

1. Equalizacao da `main` com `origin/main @ 589c8c9`.
2. Criacao da branch F1.
3. Mapeamento de rotas com `find frontend/src/app`.
4. Mapeamento de componentes, config e estilos com `find`.
5. Leitura material dos arquivos centrais de app, shell, cockpit, modulos
   ativos, tabelas, modais, estados, tokens e docs.
6. Greps direcionados para tabelas, overflow, modais, tabs, tokens, estados,
   exports e possiveis componentes orfaos.
7. Consolidacao das hipoteses da F0 em uma tabela de confirmacao/refutacao.

---

## 5. Arquivos inspecionados e arquivos nao inspecionados

### Escopo materialmente inspecionado

Foram mapeados 91 arquivos em `frontend/src/app`, `frontend/src/components`,
`frontend/src/config` e `frontend/src/styles`:

- 16 arquivos em `frontend/src/app`.
- 72 arquivos em `frontend/src/components`.
- 1 arquivo em `frontend/src/config`.
- 2 arquivos em `frontend/src/styles`.

Tambem foram lidos:

- `docs/sprints/sprint-04-5/00-plano/PLANO_EXECUCAO_SPRINT_4_5.md`
- `docs/ui/INVENTARIO_TELAS.md`
- `docs/_meta/living_docs.json`

### Arquivos de codigo mais relevantes lidos diretamente

| Area | Arquivos |
|---|---|
| App Router | `app/(app)/layout.tsx`, `app/(app)/page.tsx`, paginas de `juros`, `amortizacao`, `diagnostico`, `financiamento-imobiliario` |
| Shell | `ShellLayout.tsx`, `ModulePage.tsx`, `Header.tsx`, `Sidebar.tsx`, `NavItem.tsx`, `FinancialCockpitShell.tsx` |
| Cockpit base | `CockpitPrimitives.tsx`, `CockpitModal.tsx`, `CockpitTables.tsx`, `CockpitCharts.tsx`, `CockpitActionButton.tsx` |
| UI base | `AlertBanner.tsx`, `SummaryCard.tsx`, `EducationPanel.tsx`, `FormSection.tsx` |
| Estados | `LoadingState.tsx`, `ErrorState.tsx`, `EmptyState.tsx` |
| Juros | `InterestCockpit.tsx`, `AmortizacaoTables.tsx`, `JurosTabs.tsx`, `JurosSaibaMais.tsx`, forms/panels legados |
| Amortizacao | `AmortizationCockpit.tsx`, `AmortizacaoTable.tsx`, `AmortizacaoTabs.tsx`, `AmortizacaoForm.tsx`, panels legados |
| Diagnostico | `DiagnosticoCockpit.tsx`, `DiagnosticoForm.tsx`, `DiagnosticoSummary.tsx`, `DiagnosticoSaibaMais.tsx` |
| Financiamento | `FinanciamentoCockpit.tsx`, `FinanciamentoForm.tsx`, `FinanciamentoTable.tsx`, `FinanciamentoCompareSummary.tsx`, `FinanciamentoSaibaMais.tsx`, `FinanciamentoCompareChart.tsx` |
| Estilos | `app/globals.css`, `styles/tokens.ts`, `styles/tokens.css` |

### Arquivos nao inventariados em detalhe

- `frontend/src/content/**`: conteudo editorial, nao UI Component.
- `frontend/src/services/**`, `frontend/src/types/**`, `frontend/src/lib/**`:
  dependencias dos componentes, lidas apenas quando necessario para contexto.
- Testes em `frontend/src/__tests__/**`: mapeados para evidenciar cobertura,
  mas nao inventariados componente a componente.

---

## 6. Mapa de rotas, paginas e modulos atuais

| Rota | Arquivo | Componente principal | Status em `MODULES` | Observacao F1 |
|---|---|---|---|---|
| `/` | `app/(app)/page.tsx` | home cockpit coming-soon + links | n/a | Usa classes `cockpit-*`; atalhos para 4 modulos ativos |
| `/diagnostico` | `app/(app)/diagnostico/page.tsx` | `DiagnosticoCockpit` | `disponivel` | Modulo funcional |
| `/juros` | `app/(app)/juros/page.tsx` | `InterestCockpit` | `disponivel` | Modulo funcional cockpit |
| `/amortizacao` | `app/(app)/amortizacao/page.tsx` | `AmortizationCockpit` | `disponivel` | Modulo funcional cockpit |
| `/financiamento-imobiliario` | `app/(app)/financiamento-imobiliario/page.tsx` | `FinanciamentoCockpit` | `disponivel` | Modulo funcional, Tailwind direto + cockpit |
| `/financiamento-veiculo` | `app/(app)/financiamento-veiculo/page.tsx` | `ModulePage` | `em-construcao` | Placeholder honesto |
| `/consignado` | `app/(app)/consignado/page.tsx` | `ModulePage` | `em-construcao` | Placeholder honesto |
| `/cdc` | `app/(app)/cdc/page.tsx` | `ModulePage` | `em-construcao` | Placeholder honesto |
| `/cartao-rotativo` | `app/(app)/cartao-rotativo/page.tsx` | `ModulePage` | `em-construcao` | Placeholder honesto |
| `/atraso` | `app/(app)/atraso/page.tsx` | `ModulePage` | `em-construcao` | Placeholder honesto |
| `/indicadores` | `app/(app)/indicadores/page.tsx` | `ModulePage` | `em-construcao` | Placeholder honesto |
| `/investir-vs-quitar` | `app/(app)/investir-vs-quitar/page.tsx` | `ModulePage` | `em-construcao` | Placeholder honesto |
| `/educacao` | `app/(app)/educacao/page.tsx` | `ModulePage` | `em-construcao` | Placeholder honesto |

---

## 7. Inventario de Shell/Layout/Navegacao

| Categoria | Componente | Arquivo | Export | Usado por | Sistema visual | Uso de tokens | Responsividade | Acessibilidade | Estados suportados | Testes existentes | Risco | Decisao recomendada para F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Shell | `ShellLayout` | `components/shell/ShellLayout.tsx` | named | `app/(app)/layout.tsx`, testes | Wrapper para cockpit | indireto via `FinancialCockpitShell` | herdada da shell | delega landmarks | n/a | `ShellLayout.test.tsx` | baixo | Manter como adapter oficial |
| Shell | `FinancialCockpitShell` | `components/ui/cockpit/FinancialCockpitShell.tsx` | named/barrel | `ShellLayout` | `cockpit-*` global | CSS vars cockpit hardcoded em `globals.css` | topbar scroll em media query | `header role=banner`, `main role=main`, `nav aria-label` | n/a | `FinancialCockpitShell.test.tsx`, governance | medio | Oficializar e corrigir fonte de modulos na F3 |
| Navegacao | `VISIBLE_MODULE_IDS` | `FinancialCockpitShell.tsx` | const local | topbar | logica local | n/a | n/a | n/a | n/a | governance | medio | Derivar de `MODULES.status` ou registrar excecao formal |
| Placeholder | `ModulePage` | `components/shell/ModulePage.tsx` | named | 8 rotas em construcao | `cockpit-coming-soon` | CSS cockpit | responsivo pela shell | usa `EmptyState` se id invalido | empty/unavailable honesto | routes tests | baixo | Manter ate cada modulo ser implementado |
| Legado provavel | `Header` | `components/shell/Header.tsx` | named | testes apenas; config comenta | Tailwind slate/white | classes Tailwind diretas | flex/truncate | `header`, breadcrumb visual | n/a | `Header.test.tsx` | medio | Decidir remover ou manter documentado |
| Legado provavel | `Sidebar` | `components/shell/Sidebar.tsx` | named | testes apenas | Tailwind slate/white | classes Tailwind diretas | coluna fixa | `aside/nav`, `data-testid=sidebar` | n/a | `Sidebar.test.tsx` | medio | Decidir remover ou preservar como legado |
| Legado acoplado | `NavItem` | `components/shell/NavItem.tsx` | named | `Sidebar` | Tailwind | classes diretas | item de lista | link com estado ativo | n/a | via `Sidebar.test.tsx` | medio | Segue decisao de `Sidebar` |
| Aviso | `EducationalNotice` | `components/shell/EducationalNotice.tsx` | named | nao encontrado no caminho ativo | Tailwind | classes diretas | bloco simples | texto educativo | n/a | nao identificado | baixo/medio | Confirmar uso desejado na F2 |

---

## 8. Inventario de botoes, CTAs e acoes

| Categoria | Componente | Arquivo | Export | Usado por | Sistema visual | Uso de tokens | Responsividade | Acessibilidade | Estados suportados | Testes existentes | Risco | Decisao recomendada para F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Botao cockpit | `CockpitButton` | `CockpitPrimitives.tsx` | named | juros, amortizacao, diagnostico | `cockpit-btn-calc` | CSS vars globais | herdada do form/panel | `type=submit`, `disabled` | busy textual | app tests | medio | Padronizar `aria-busy` na F3 se aprovado |
| CTA cockpit | `CockpitActionButton` | `CockpitActionButton.tsx` | named/barrel | financiamento tabs | Tailwind teal/amber/blue | classes hardcoded | flex | aceita props de button | variantes visual-only | financiamento tests | medio | Decidir se e tab oficial ou CTA |
| Link/modal | `MoreButton` | `CockpitPrimitives.tsx` | named | juros/amortizacao | `cockpit-btn-more` | CSS vars | inline | button type | n/a | app tests | baixo | Manter como CTA educativo |
| Submit custom | botao submit financiamento | `FinanciamentoForm.tsx` | local | financiamento | `cockpit-btn-calc` + Tailwind form | CSS cockpit | herdada | disabled | busy textual | financiamento tests | medio | Unificar com `CockpitButton` |
| Tabs buttons | `CockpitSubTabs` | `CockpitPrimitives.tsx` | named | juros/amortizacao | `cockpit-sub-tabs` | CSS vars | `overflow-x:auto` em <=1100px | `role=tablist/tab`, `aria-selected` | active | app tests | baixo/medio | Oficializar para tabs de primeiro nivel cockpit |

---

## 9. Inventario de formularios e campos

| Categoria | Componente | Arquivo | Export | Usado por | Sistema visual | Uso de tokens | Responsividade | Acessibilidade | Estados suportados | Testes existentes | Risco | Decisao recomendada para F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Campo cockpit | `CockpitField` | `CockpitPrimitives.tsx` | named | juros, amortizacao, diagnostico, financiamento | `cockpit-field-*` | CSS vars cockpit | coluna painel | label htmlFor, hint visual | sem erro semantico | app/component tests | medio | Adicionar contrato para erro/aria-invalid |
| Slider cockpit | `CockpitSlider` | `CockpitPrimitives.tsx` | named | juros, amortizacao | `cockpit-slider-*` | CSS vars cockpit | painel | label htmlFor | range | app tests | baixo | Manter |
| Painel input | `CockpitInputPanel` | `CockpitPrimitives.tsx` | named | todos modulos funcionais | `cockpit-panel-inputs` | CSS vars cockpit | grid cockpit | aside | n/a | app tests | baixo | Manter |
| Form financiamento | `FinanciamentoForm` | `financing/FinanciamentoForm.tsx` | named | `FinanciamentoCockpit` | cockpit + Tailwind direto | misto | flex | form noValidate, radio sem fieldset | busy/error por props | financiamento tests | medio | Alinhar contrato de campo/radio |
| Form diagnostico | `DiagnosticoForm` | `diagnostic/DiagnosticoForm.tsx` | named | `DiagnosticoCockpit` | cockpit | CSS cockpit | painel | form noValidate | busy por button | form tests | baixo/medio | Manter, revisar erro semantico |
| Forms juros legados | `JurosSimplesForm`, `JurosCompostosForm`, `CompararJurosForm` | `interest/*.tsx` | named | panels legados | `FormSection`/Tailwind | tokens parciais | grid | aria-invalid via `TextField` | busy/errors | unit tests | medio | Decidir se remover apos cockpit |
| Forms amortizacao legados | `AmortizacaoForm` | `amortization/AmortizacaoForm.tsx` | named | panels legados | `FormSection`/Tailwind | tokens parciais | grid | aria-label, fieldset | busy/errors | indiretos | medio | Decidir se remover apos cockpit |
| Field primitives legados | `TextField`, `SubmitBar` | `interest/formPrimitives.tsx`, `amortization/formPrimitives.tsx` | named | forms legados | Tailwind | tokens parciais | grid/flex | aria-invalid, aria-describedby, aria-busy | busy/errors | unit tests | medio | Reaproveitar ideias no contrato F2 |

---

## 10. Inventario de cards, KPIs, paineis e resumos

| Categoria | Componente | Arquivo | Export | Usado por | Sistema visual | Uso de tokens | Responsividade | Acessibilidade | Estados suportados | Testes existentes | Risco | Decisao recomendada para F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| KPI cockpit | `KpiStrip` / `KpiItem` | `CockpitPrimitives.tsx` | named | juros/amortizacao | `cockpit-kpi-*` | CSS vars cockpit | grid/flex cockpit | texto | ok/loading por `...` | app tests | baixo | Oficializar para cockpit financeiro |
| Painel central | `CenterPanel` | `CockpitPrimitives.tsx` | named | juros/amortizacao | `cockpit-panel-center` | CSS vars cockpit | grid cockpit | section | insight/chart/kpis | app tests | baixo | Manter |
| Card resumo | `SummaryCard` | `ui/SummaryCard.tsx` | named/barrel | diagnostico | Tailwind white/slate | CSS vars para trend | grid responsivo no consumidor | article aria-label | n/a | `ui.test.tsx`, diagnostico tests | baixo | Manter como UI base |
| Resumo financiamento | `FinanciamentoSummary` | `financing/FinanciamentoSummary.tsx` | named | financiamento | Tailwind direto | hardcoded `gray/blue` | flex | aria-label | ok | financiamento app tests | medio | Migrar para contrato de resumo/KPI |
| Resumo comparativo | `FinanciamentoCompareSummary` | `financing/FinanciamentoCompareSummary.tsx` | named | financiamento comparar | Tailwind + tabela | hardcoded `gray/blue/amber` | `overflow-x-auto` | aria-label/note | ok | financiamento tests | alto | Tratar junto com politica de tabelas |
| Resumo diagnostico | `DiagnosticoSummary` | `diagnostic/DiagnosticoSummary.tsx` | named | diagnostico | `SummaryCard` | tokens via component | grid 2/sm/ lg | cards aria-label | ok | diagnostico tests | baixo | Manter |
| Resumos legados juros/amortizacao | `SummaryGrid`, `AmortizacaoSummary` | `interest`, `amortization` | named | panels legados | Tailwind | tokens parciais | grid | n/a | ok | tests parciais | medio | Decidir legado na F2 |

---

## 11. Inventario de alertas, avisos e estados

| Categoria | Componente | Arquivo | Export | Usado por | Sistema visual | Uso de tokens | Responsividade | Acessibilidade | Estados suportados | Testes existentes | Risco | Decisao recomendada para F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Alerta base | `AlertBanner` | `ui/AlertBanner.tsx` | named/barrel | diagnostico, financiamento | Tailwind white/slate | `var(--color-*)` | flex | `role=status/alert` por nivel | info/success/warning/error | `ui.test.tsx`, domain tests | baixo | Manter como oficial |
| Estados base | `LoadingState` | `states/LoadingState.tsx` | named/barrel | `ModulePage`? testes; poucos usos ativos | Tailwind | classes diretas | flex center | `role=status`, `aria-live`, `aria-busy=true` | loading | `states.test.tsx` | medio | F2 decide uso obrigatorio nos modulos |
| Estados base | `ErrorState` | `states/ErrorState.tsx` | named/barrel | testes; diagnostico/financiamento usam `AlertBanner` inline | Tailwind | var para negative + classes | flex center | `role=alert` | error | `states.test.tsx` | medio | F2 decide quando substituir alertas inline |
| Estados base | `EmptyState` | `states/EmptyState.tsx` | named/barrel | `ModulePage` | Tailwind | classes diretas | flex center | `role=status` | empty | `states.test.tsx` | baixo | Manter |
| Estados inline cockpit | `cockpit-insight-bar` | modulos ativos | padrao local | diagnostico/financiamento/juros/amortizacao | CSS cockpit | CSS vars | flex/panel | `aria-live` no panel em diagnostico/financiamento | idle/loading/insight | app tests | medio | F2 decidir contrato de estados cockpit |
| Alertas dominio | `DiagnosticoAlerts`, `JurosAlerts`, `AmortizacaoAlerts` | domain dirs | named | modulos/legados | misto | `AlertBanner` ou classes | listas | roles via AlertBanner quando usado | alerts | tests diagnostico | baixo/medio | Consolidar uso de `AlertBanner` |

---

## 12. Inventario de tabelas financeiras

| Arquivo | Componente | Modulo que usa | Colunas | Tipo de dados | Overflow atual | Sticky header | `tabular-nums` | Slice/corte | 120/360/600 linhas | Risco horizontal | Recomendacao F2/F3 |
|---|---|---|---:|---|---|---|---|---|---|---|---|
| `ui/cockpit/CockpitTables.tsx` | `InterestSimpleTable` | `InterestCockpit` | 3 | juros simples mensal | `.cockpit-table-wrap` -> `overflow: auto` | sim via CSS `.cockpit-table th` | nao explicito; mono font | nao | provavel ate 360; max-height 200px | medio | Contrato comum; decidir wrapper responsivo |
| `ui/cockpit/CockpitTables.tsx` | `InterestCompoundTable` | `InterestCockpit` | 3 | juros compostos mensal | `.cockpit-table-wrap` -> `overflow: auto` | sim via CSS | nao explicito; mono font | nao | provavel ate 360 | medio | Igual acima |
| `ui/cockpit/CockpitTables.tsx` | `AmortizationCockpitTable` | `AmortizationCockpit` | 5 | PRICE/SAC periodo | `.cockpit-table-wrap` -> `overflow: auto` | sim via CSS | nao explicito; mono font | nao | 360 no slider atual | medio | Unificar com politica de tabela financeira |
| `ui/cockpit/CockpitTables.tsx` | `AmortizationCompareTable` | `AmortizationCockpit` | 4 | comparacao PRICE/SAC | `.cockpit-table-wrap` -> `overflow: auto` | sim via CSS | nao explicito; mono font | nao; usa `Array.from(max)` | 360 no slider atual | medio | Avaliar colunas e responsividade |
| `interest/AmortizacaoTables.tsx` | `AmortizacaoSimplesTable` | panels legados de juros | 4 | tabela simples | `overflow-auto` | sim | sim | nao | comentario fala ate 1200 | medio | Se legado mantido, alinhar contrato |
| `interest/AmortizacaoTables.tsx` | `AmortizacaoCompostaTable` | panels legados de juros | 5 | tabela composta com aporte | `overflow-auto` | sim | sim | nao | comentario fala ate 1200 | medio | Se legado mantido, alinhar contrato |
| `amortization/AmortizacaoTable.tsx` | `AmortizacaoTable` | panels legados amortizacao | 6 | PRICE/SAC | `overflow-auto` | sim | sim | nao | prazo legado ate 1200; cockpit atual 360 | alto | Decidir legado e politica mobile |
| `amortization/AmortizacaoTable.tsx` | `CompareTables` | panels legados amortizacao | 2 tabelas x 6 | PRICE/SAC lado a lado | grid + `overflow-auto` em cada tabela | sim | sim | nao | depende de linhas retornadas | alto | Evitar scroll horizontal duplo |
| `financing/FinanciamentoTable.tsx` | `FinanciamentoTable` | financiamento simular | 6 ou 7 | parcelas financiamento | `overflow-x-auto overflow-y-auto` | sim | nao | nao | 360 tipico; 600 possivel se API permitir | alto | Prioridade F4; contrato visual comum |
| `financing/FinanciamentoCompareSummary.tsx` | tabela interna | financiamento comparar | 3 | indicadores resumo | `overflow-x-auto` | nao | sim nas celulas | nao | poucas linhas | medio | Remover scroll horizontal se layout permitir |

Conclusao das tabelas: os dados nao sao cortados; o problema e a estrategia de
overflow horizontal/bidirecional e a ausencia de um contrato unico para
cabecalho, `caption`, `scope`, numeros tabulares e comportamento mobile.

---

## 13. Inventario de graficos e visualizacoes

| Categoria | Componente | Arquivo | Export | Usado por | Sistema visual | Uso de tokens | Responsividade | Acessibilidade | Estados suportados | Testes existentes | Risco | Decisao recomendada para F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Grafico cockpit | `InterestCockpitChart` | `CockpitCharts.tsx` | named/barrel | `InterestCockpit` | Recharts + cockpit | hex/rgba hardcoded | `ResponsiveContainer` | contexto textual no panel | empty via null chart | app tests | medio | Tokenizar cores em F3/F4 |
| Grafico cockpit | `AmortizationCompareChart` | `CockpitCharts.tsx` | named/barrel | `AmortizationCockpit` | Recharts + cockpit | hex/rgba hardcoded | `ResponsiveContainer` | contexto textual | null chart | app tests | medio | Tokenizar cores |
| Grafico cockpit | `AmortizationCompositionChart` | `CockpitCharts.tsx` | named/barrel | `AmortizationCockpit` | Recharts + cockpit | hex/rgba hardcoded | `ResponsiveContainer` | contexto textual | rows vazias | app tests | medio | Tokenizar cores |
| Grafico legado | `EvolucaoSaldoChart` | `interest/EvolucaoSaldoChart.tsx` | named | panels legados | Recharts + Tailwind | vars + fallbacks hex | `ResponsiveContainer` | texto fallback | empty | visualizacao tests | medio | Decidir legado |
| Grafico legado | `AmortizacaoSaldoChart` | `amortization/AmortizacaoSaldoChart.tsx` | named | panels legados | Recharts + Tailwind | vars + fallbacks hex | `ResponsiveContainer` | texto fallback | empty | nao identificado | medio | Decidir legado |
| Grafico financiamento | `FinanciamentoCompareChart` | `financing/FinanciamentoCompareChart.tsx` | named | financiamento comparar | Recharts + Tailwind | hex/rgba hardcoded | `ResponsiveContainer` | `aria-label` no container | ok | chart tests | medio | Tokenizar e padronizar chart card |

---

## 14. Inventario de modais, abas e navegacao contextual

| Categoria | Componente/padrao | Arquivo | Export | Usado por | Sistema visual | Uso de tokens | Responsividade | Acessibilidade | Estados suportados | Testes existentes | Risco | Decisao recomendada para F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Modal base | `CockpitModal` | `CockpitModal.tsx` | named/barrel | juros, amortizacao, diagnostico, financiamento | `cockpit-modal-*` | CSS vars cockpit | max 90vw/82vh; body scroll-y; tabs scroll-x | `role=dialog`, `aria-modal`, Escape, overlay click | open/closed, active tab | app/modal tests | medio | Manter; avaliar foco retornado |
| Modal conteudo | `ModalHeading`, `ModalText`, `ModalFormula`, `ModalExample`, `ModalDisclaimer` | `CockpitModal.tsx` | named/barrel | todos SaibaMais/cockpit | cockpit | CSS vars | body scroll | semantica parcial | n/a | app tests | baixo | Oficializar como primitivos de conteudo |
| Tabs cockpit | `CockpitSubTabs` | `CockpitPrimitives.tsx` | named | juros/amortizacao | cockpit | CSS vars | scroll-x <=1100px | tablist/tab | active | app tests | baixo | Manter como tab principal |
| Tabs financiamento | `CockpitActionButton` com `role=tab` | `FinanciamentoCockpit.tsx` | local padrao | financiamento | Tailwind/cockpit | hardcoded | flex gap | tablist/tab/aria-selected | active | financiamento tests | medio | F2 decidir se substitui por `CockpitSubTabs` |
| Tabs legadas | `JurosTabs`, `AmortizacaoTabs` | domain dirs | named | nao usado por rotas ativas | Tailwind | tokens parciais | flex wrap | APG setas/Home/End | active | unit tests | medio | Decidir remocao ou reaproveitamento |
| `DiagnosticoSaibaMais` | modal educativo | `diagnostic/DiagnosticoSaibaMais.tsx` | named | `DiagnosticoCockpit` | `CockpitModal` | CSS cockpit + Tailwind detalhe | modal responsivo | `aria-haspopup` ausente no botao; modal a11y base | open/tab | dedicated tests | baixo/medio | Manter; alinhar botao |
| `FinanciamentoSaibaMais` | modal educativo | `financing/FinanciamentoSaibaMais.tsx` | named | `FinanciamentoCockpit` | `CockpitModal` | CSS cockpit + Tailwind detalhe | modal responsivo | botao tem `aria-haspopup=dialog` | open/tab | dedicated tests | baixo | Manter |
| Modal juros/amortizacao embutido | `InterestEducationModal`, `AmortizationEducationModal` | cockpit files | local | cockpit ativo | `CockpitModal` | CSS cockpit | modal responsivo | modal base | open/tab | app tests | baixo | Manter ou extrair se F2 quiser |

---

## 15. Inventario de conteudo educativo e paineis de interpretacao

| Categoria | Componente | Arquivo | Export | Usado por | Sistema visual | Uso de tokens | Responsividade | Acessibilidade | Estados suportados | Testes existentes | Risco | Decisao recomendada para F2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Painel educativo base | `EducationPanel` | `ui/EducationPanel.tsx` | named/barrel | interpretacoes e SaibaMais legados | Tailwind blue/slate | `var(--color-brand-primary)` + classes | bloco responsivo | `role=complementary`, aria-label | n/a | `ui.test.tsx` | medio | Renomear ou namespacear para evitar conflito |
| Painel educativo cockpit | `EducationPanel<T>` | `CockpitPrimitives.tsx` | named/barrel | `InterestCockpit`, `AmortizationCockpit` | `cockpit-panel-edu` | CSS vars cockpit | grid; vira full-width <=1100px | aside + tabs internas | active tab | app tests | medio | Renomear para `CockpitEducationPanel` |
| Interpretacao juros | `JurosInterpretation` | `interest/JurosInterpretation.tsx` | named | panels legados | `EducationPanel` base | tokens via component | bloco | complementary | ok | tests | baixo | Decidir legado |
| Interpretacao amortizacao | `AmortizacaoInterpretation` | `amortization/AmortizacaoInterpretation.tsx` | named | panels legados | `EducationPanel` base | tokens via component | bloco | complementary | ok | tests | baixo | Decidir legado |
| Interpretacao diagnostico | `DiagnosticoInterpretation` | `diagnostic/DiagnosticoInterpretation.tsx` | named | diagnostico ativo | Tailwind card | hardcoded slate | bloco | article? nao explicito | ok | tests | medio | Alinhar com painel oficial |
| SaibaMais juros legado | `JurosSaibaMais` | `interest/JurosSaibaMais.tsx` | named | nao usado por rota ativa | `EducationPanel` base | tokens via component | bloco | complementary | n/a | unit tests | medio | Decidir legado |
| SaibaMais amortizacao legado | `AmortizacaoSaibaMais`, glossario/cuidados | `amortization/AmortizacaoSaibaMais.tsx` | named | nao usado por rota ativa | `EducationPanel` base + Tailwind | tokens parciais | grid | complementary/list | n/a | content tests | medio | Decidir legado |

---

## 16. Inventario de tokens, estilos e possiveis hardcodes visuais

| Area | Evidencia | Impacto | Recomendacao |
|---|---|---|---|
| Tokens TS | `styles/tokens.ts` define brand, semantic, financial, neutral, typography, spacing, radius, shadow, breakpoints | Boa base formal | Manter como fonte canonica |
| Tokens CSS | `styles/tokens.css` espelha parte de `tokens.ts` | Boa base, mas incompleta para cockpit | F2 deve decidir se cockpit vars entram nos tokens oficiais |
| Cockpit vars | `globals.css` define `--bg`, `--teal`, `--amber`, `--text`, etc. fora de `tokens.css` | Drift visual possivel | Migrar ou documentar como camada cockpit |
| Tailwind direto | financiamento, shell legado, states, forms legados usam `text-gray-*`, `bg-blue-*`, `border-slate-*` | Divergencia de contrato | Definir permissao ou substituir por tokens |
| Hex/rgba em charts | `CockpitCharts.tsx`, `FinanciamentoCompareChart.tsx`, `EvolucaoSaldoChart.tsx`, `AmortizacaoSaldoChart.tsx` | Drift e tema inconsistente | Tokenizar series financeiras |
| Overflow global | `html/body/.cockpit-app` usam `overflow:hidden`; `.cockpit-content-grid` usa overflow especifico | Pode impactar mobile | F2/F4 devem validar visualmente |
| Tabs responsivas | `.cockpit-module-tabs`, `.cockpit-sub-tabs` usam `overflow-x:auto` <=1100px | Aceitavel para tabs, mas precisa politica | Nao confundir com tabela financeira |

---

## 17. Componentes duplicados, conflitantes ou orfaos

| Item | Evidencia | Status F1 | Risco | Recomendacao |
|---|---|---|---|---|
| `EducationPanel` duplicado | `ui/EducationPanel.tsx` e `ui/cockpit/CockpitPrimitives.tsx` exportam o mesmo nome | conflito real | medio/alto | Renomear cockpit para `CockpitEducationPanel` ou namespacear barrel |
| `Header` / `Sidebar` | nao usados por `ShellLayout`; aparecem em testes e comentarios de config | legado provavel | medio | F2 decide remocao; F3 remove com ajuste de testes se aprovado |
| `NavItem` | usado apenas por `Sidebar` | legado acoplado | medio | Segue decisao de `Sidebar` |
| Tabs/forms/panels legados de juros | `JurosTabs` e panels nao usados pela rota `/juros` | legado provavel | medio | Decidir manter como fallback ou remover |
| Tabs/forms/panels legados de amortizacao | `AmortizacaoTabs`, `PricePanel`, `SacPanel`, `ComparePanel` nao usados pela rota `/amortizacao` | legado provavel | medio | Decidir manter/remover |
| `FormSection` | usado por forms legados, nao pelos cockpits ativos | util mas subutilizado | baixo/medio | F2 decide se volta ao contrato |
| Estados reutilizaveis | `LoadingState`/`ErrorState` existem, mas modulos ativos usam estados inline | divergencia funcional | medio | F2 define regra de uso por contexto |

---

## 18. Confirmacao/refutacao das hipoteses da F0

| Hipotese F0 | Veredito F1 | Evidencia |
|---|---|---|
| `DiagnosticoSaibaMais` usa `CockpitModal` | Confirmada | Importa `CockpitModal` e renderiza `<CockpitModal ...>` em `DiagnosticoSaibaMais.tsx` |
| `FinanciamentoSaibaMais` usa `CockpitModal` | Confirmada | Importa `CockpitModal` e renderiza `<CockpitModal ...>` em `FinanciamentoSaibaMais.tsx` |
| `cockpit-table-wrap` define overflow horizontal no CSS global | Parcialmente confirmada | `.cockpit-table-wrap` define `overflow: auto`, que e bidirecional; nao e `overflow-x-auto`, mas permite eixo horizontal |
| `Header.tsx` e `Sidebar.tsx` sao orfaos | Confirmada como orfaos de runtime ativo; nao remover ainda | `ShellLayout` usa `FinancialCockpitShell`; `Header`/`Sidebar` aparecem em testes e comentarios |
| `EducationPanel` duplicado gera risco real | Confirmada | Dois exports com mesmo nome e semanticas diferentes, ambos usados em contextos distintos |
| `VISIBLE_MODULE_IDS` hardcoded deve ser corrigido em F3 ou documentado | Confirmada como decisao F2/F3 | `FinancialCockpitShell` filtra `MODULES` por array local de 8 ids |
| Tabelas renderizam todas as linhas sem slice/corte artificial | Confirmada para producao | Grep achou `.slice(` apenas em teste `JurosSaibaMais.test.tsx`; tabelas usam `.map`/`Array.from(max)` |
| Existem outras ocorrencias de `overflow-x-auto` ou `overflow-auto` em contexto financeiro | Confirmada | `FinanciamentoTable`, `FinanciamentoCompareSummary`, `AmortizacaoTables`, `AmortizacaoTable`, `.cockpit-table-wrap` |

---

## 19. Divergencias e riscos priorizados

| Prioridade | Divergencia / risco | Evidencia | Impacto | Proxima fatia sugerida |
|---|---|---|---|---|
| P0 | Tabelas financeiras sem politica unica | 10 superficies de tabela com wrappers distintos | Regressao mobile e a11y | F2 define politica; F3/F4 implementam |
| P0 | `overflow-x-auto` em financiamento | `FinanciamentoTable`, `FinanciamentoCompareSummary` | UX mobile degradada | F4 |
| P0 | `overflow: auto` bidirecional no cockpit | `.cockpit-table-wrap` | Scroll horizontal latente | F2/F3 |
| P1 | `EducationPanel` duplicado | dois exports homonimos | erro de import/autocomplete | F3 |
| P1 | Shell legada viva em testes | `Header`, `Sidebar`, `NavItem` | manutencao duplicada | F2 decide; F3 remove/manter |
| P1 | `VISIBLE_MODULE_IDS` hardcoded | topbar nao deriva de `status` | novos modulos podem nao aparecer | F3 |
| P1 | Estados reutilizaveis subutilizados | modulos ativos usam inline | contrato inconsistente | F2 |
| P2 | Cores hardcoded em charts/Tailwind | grep de hex/rgba e classes | drift visual | F3/F4 |
| P2 | Modais sem garantia explicita de retorno de foco | `CockpitModal` trata Escape/overlay, mas nao foco retornado | a11y | F2/F3 |

---

## 20. Recomendacoes objetivas para a F2

1. Definir a estrategia de tabelas financeiras: `FinancialTable`, componentes
   por dominio com contrato comum ou abordagem hibrida.
2. Formalizar requisitos de tabela: `caption`, `scope`, sticky header,
   numeros tabulares, scroll vertical permitido, politica mobile sem scroll
   horizontal como experiencia principal.
3. Renomear ou namespacear o `EducationPanel` do cockpit antes de novas
   implementacoes.
4. Decidir se `Header`, `Sidebar`, `NavItem`, tabs/forms/panels legados de
   juros/amortizacao serao removidos ou mantidos com justificativa.
5. Definir contrato de estados: quando usar `LoadingState`/`ErrorState`/
   `EmptyState` e quando usar `cockpit-insight-bar`.
6. Definir politica para `CockpitSubTabs` vs `CockpitActionButton` como tabs.
7. Integrar variaveis cockpit ao design system ou documentar camada cockpit
   como excecao controlada.
8. Especificar requisitos do `auditor_de_interface` para detectar apenas
   violacoes obrigatorias nao justificadas em modo advisory.

---

## 21. Criterios de aceite recomendados para F2/F3/F4/F5

| Fatia | Criterios recomendados |
|---|---|
| F2 | Politicas de tabelas, modais/abas e contrato UI aprovadas; decisao formal sobre tabelas; lista de legados com acao definida |
| F3 | `EducationPanel` resolvido; `VISIBLE_MODULE_IDS` decidido/ajustado; componentes-base implementados conforme F2; testes atualizados |
| F4 | `overflow-x-auto` removido das tabelas financeiras ou justificado formalmente; nenhuma linha cortada; comportamento mobile evidenciado |
| F5 | `auditor_de_interface` advisory detecta overflow/corte/tokens/modais conforme contrato; alertas remanescentes classificados e rastreados |

---

## 22. Anexo — comandos utilizados e saidas relevantes

### Rotas / app

```bash
find frontend/src/app -maxdepth 5 -type f | sort
```

Saida relevante: 14 rotas/paginas no grupo `(app)`, alem de `globals.css` e
`app/layout.tsx`.

### Componentes, config e estilos

```bash
find frontend/src/app frontend/src/components frontend/src/config frontend/src/styles \
  -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) | sort | wc -l
```

Saida:

```text
91
```

### Tabelas e overflow

```bash
grep -RniE 'overflow-x-auto|overflow-x-scroll|overflow-auto|overflow-hidden|<table|sticky top-0|tabular-nums|slice\(' \
  frontend/src --include='*.tsx' --include='*.ts'
```

Saidas relevantes:

```text
FinanciamentoTable.tsx:26 overflow-x-auto overflow-y-auto
FinanciamentoCompareSummary.tsx:136 overflow-x-auto
interest/AmortizacaoTables.tsx:32 overflow-auto
interest/AmortizacaoTables.tsx:92 overflow-auto
amortization/AmortizacaoTable.tsx:19 overflow-auto
ui/cockpit/CockpitTables.tsx:12/41/73/124 <table className="cockpit-table">
```

### CSS cockpit

```bash
grep -Rni -e 'cockpit-table-wrap' -e 'overflow-x' -e 'cockpit-module-tabs' -e 'cockpit-sub-tabs' \
  frontend/src/app/globals.css frontend/src/styles/tokens.css
```

Saidas relevantes:

```text
globals.css:230 overflow-x: auto
globals.css:725 .cockpit-table-wrap
globals.css:844 overflow-x: auto
```

Leitura direta de `.cockpit-table-wrap`:

```css
.cockpit-table-wrap {
  max-height: 200px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
}
```

### Modais / abas

```bash
grep -Rni -e Modal -e Dialog -e Drawer -e Popover -e 'role="dialog"' \
  -e aria-modal -e 'role="tab"' -e 'role="tablist"' -e Tabs -e SubTabs -e SaibaMais \
  frontend/src --include='*.tsx' --include='*.ts'
```

Saidas relevantes:

```text
diagnostic/DiagnosticoSaibaMais.tsx importa e renderiza CockpitModal
financing/FinanciamentoSaibaMais.tsx importa e renderiza CockpitModal
amortization/AmortizationCockpit.tsx renderiza AmortizationEducationModal -> CockpitModal
interest/InterestCockpit.tsx renderiza InterestEducationModal -> CockpitModal
```

### Componentes orfaos / legados

```bash
grep -Rni -e 'Header' -e 'Sidebar' -e 'NavItem' -e 'ShellLayout' -e 'ModulePage' \
  frontend/src --include='*.tsx' --include='*.ts'
```

Saidas relevantes:

```text
app/(app)/layout.tsx importa ShellLayout
ShellLayout.tsx importa FinancialCockpitShell
Header.tsx e Sidebar.tsx aparecem em testes dedicados, nao no caminho ativo da shell
ModulePage e usado por 8 rotas em construcao
```

### Documentacao lida

```bash
sed -n '790,960p' docs/sprints/sprint-04-5/00-plano/PLANO_EXECUCAO_SPRINT_4_5.md
sed -n '1,220p' docs/ui/INVENTARIO_TELAS.md
sed -n '1,200p' docs/_meta/living_docs.json
```

### Escopo final esperado

Ao final da F1, o unico arquivo criado/alterado deve ser:

```text
docs/sprints/sprint-04-5/00-plano/INVENTARIO_UI_COMPONENTS_ATUAIS.md
```

---

*Fim do INVENTARIO_UI_COMPONENTS_ATUAIS.md — Sprint 4.5 / F1*
*Classificacao: artefato analitico — aguardando auditoria do Camaleao e decisao de Moises.*
