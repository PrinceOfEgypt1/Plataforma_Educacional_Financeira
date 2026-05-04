# Sprint 3.5/F1 - Diagnostico UI/UX atual

Data: 2026-05-03
Base analisada: `4a9d30e`
Escopo: diagnostico documental e tecnico da UI/UX atual, sem refatoracao.

## 1. Inventario de telas analisadas

Rotas reais do App Router:

- `/`
- `/juros`
- `/amortizacao`
- `/diagnostico`
- `/financiamento-imobiliario`
- `/financiamento-veiculo`
- `/consignado`
- `/cdc`
- `/cartao-rotativo`
- `/atraso`
- `/indicadores`
- `/investir-vs-quitar`
- `/educacao`

Status funcional:

- `/juros`: pagina real com tabs, formulario, API, cards, alertas, grafico,
  tabela, interpretacao e conteudo educacional.
- `/amortizacao`: pagina real com tabs PRICE/SAC/Comparar, formulario, API,
  cards, alertas, grafico, tabela, interpretacao, glossario e cuidados.
- Demais rotas: placeholders com `ModulePage`, `AlertBanner`, `EmptyState` e
  `EducationPanel`.
- Home: grid dos 12 modulos, mas copy e badges ainda comunicam "Em
  construcao" de forma indiscriminada.

## 2. Inventario de componentes visuais relevantes

Shell:

- `ShellLayout`
- `EducationalNotice`
- `Header`
- `Sidebar`
- `NavItem`
- `ModulePage`

UI compartilhada:

- `SummaryCard`
- `AlertBanner`
- `EducationPanel`
- `FormSection`

Estados:

- `LoadingState`
- `ErrorState`
- `EmptyState`

Juros:

- `JurosTabs`
- `JurosSimplesForm`
- `JurosCompostosForm`
- `CompararJurosForm`
- `SummaryGrid`
- `EvolucaoSaldoChart`
- `AmortizacaoTables`
- `JurosAlerts`
- `JurosInterpretation`
- `JurosSaibaMais`

Amortizacao:

- `AmortizacaoTabs`
- `AmortizacaoForm`
- `AmortizacaoSummary`
- `AmortizacaoSaldoChart`
- `AmortizacaoTable`
- `AmortizacaoAlerts`
- `AmortizacaoInterpretation`
- `AmortizacaoSaibaMais`

## 3. Diagnostico por superficie

### Home/dashboard inicial

Achado principal: a home ainda comunica uma plataforma em construcao, mesmo
quando `/juros` e `/amortizacao` ja estao disponiveis. Isso enfraquece a
primeira impressao e contradiz `MODULES.status`.

Evidencia:

- `frontend/src/app/(app)/page.tsx:36-38` afirma que "Nesta Sprint os modulos
  estao em construcao".
- `frontend/src/app/(app)/page.tsx:63-68` renderiza sempre o badge "Em
  construcao".
- `frontend/src/config/modules.ts:83` marca `juros` como `disponivel`.
- `frontend/src/config/modules.ts:95` marca `amortizacao` como `disponivel`.

Impacto: usuario novo pode achar que a plataforma ainda nao tem modulo real.

Gravidade: alta.
Tipo: conteudo, visual, consistencia.
Fatia recomendada: F2.

### Navegacao global, sidebar e header

Achado principal: a sidebar desaparece abaixo de `md` e nao existe menu mobile
substituto. O comentario do `ShellLayout` diz que o conteudo segue acessivel,
mas a navegacao entre modulos deixa de existir visualmente no mobile.

Evidencia:

- `frontend/src/components/shell/ShellLayout.tsx:34-37` usa
  `md:flex-row` e `hidden ... md:block` para a sidebar.
- `frontend/src/components/shell/Header.tsx:26-49` nao possui botao de menu,
  busca, acoes ou troca de modulo.
- `docs/07_UX_UI_e_Navegacao.md` exige menu recolhivel em telas menores.

Impacto: no mobile, o usuario entra em uma rota, mas nao tem uma navegacao
global clara para mudar de modulo.

Gravidade: critica.
Tipo: responsividade, usabilidade, acessibilidade.
Fatia recomendada: F2/F4.

### Pagina `/juros`

Forcas:

- Tabs com roles WAI-ARIA e teclado.
- Estados idle/loading/error/success.
- Resultado vem da API; frontend nao recalcula dominio.
- Conteudo educacional N1 aparece abaixo da simulacao.

Problemas:

- A pagina usa estrutura linear funcional, mas ainda pouco editorial: formulario,
  cards, alertas, grafico, tabela e interpretacao aparecem como blocos empilhados
  sem uma narrativa visual forte.
- As tabelas e graficos nao tem tratamento visual premium nem resumo de decisao
  acima da dobra.
- Alguns estilos usam Tailwind direto em vez de tokens semanticos.

Evidencia:

- `frontend/src/components/interest/JurosSimplesPanel.tsx:85-90` ordena
  summary, alerts, chart, table e interpretation de modo puramente sequencial.
- `frontend/src/components/interest/SummaryGrid.tsx:20-45` cria ate 5 cards
  lado a lado em desktop.
- `frontend/src/components/interest/AmortizacaoTables.tsx:32-35` usa container
  scrollavel simples com tabela cheia.
- `frontend/src/components/interest/EvolucaoSaldoChart.tsx:105,112,122` usa
  cores hardcoded de grid/eixos.

Impacto: a tela e correta, mas ainda parece operacional, nao memoravel ou
premium.

Gravidade: media.
Tipo: visual, usabilidade, consistencia.
Fatia recomendada: F3.

### Pagina `/amortizacao`

Forcas:

- Materializa PRICE, SAC e Comparar.
- Mantem calculo no backend.
- Tem glossario e cuidados educacionais.
- Tabela, grafico, cards e interpretacao estao presentes.

Problemas:

- Copy contem texto sem acentos em componentes e metadados, reduzindo polimento
  em PT-BR.
- A densidade de cards e tabelas pode ficar pesada antes de orientar a decisao
  principal.
- O comparativo PRICE/SAC precisa de uma leitura mais executiva da diferenca de
  custo, parcela inicial/final e trade-off.

Evidencia:

- `frontend/src/app/(app)/amortizacao/page.tsx:21-31` usa "Amortizacao" sem
  acento nos fallbacks.
- `frontend/src/components/amortization/PricePanel.tsx:57-75` usa
  "simulacao", "Nao" e "amortizacao" sem acentos.
- `frontend/src/components/amortization/AmortizacaoSummary.tsx:15-35` mostra 6
  cards para PRICE.
- `frontend/src/components/amortization/AmortizacaoSummary.tsx:41-72` mostra 8
  cards para SAC.
- `frontend/src/components/amortization/AmortizacaoTable.tsx:16-22` usa tabela
  scrollavel simples.

Impacto: a pagina entrega valor funcional, mas a experiencia ainda e densa e
com acabamento linguistico inferior ao padrao do produto.

Gravidade: alta.
Tipo: visual, conteudo, usabilidade.
Fatia recomendada: F3.

### Paginas placeholder ou pendentes

Achado principal: os placeholders sao claros e honestos, mas repetem o mesmo
padrao em muitos modulos. Isso e aceitavel como scaffold, mas em uma plataforma
premium precisa virar estado de roadmap mais elegante e contextual.

Evidencia:

- `frontend/src/components/shell/ModulePage.tsx:63-74` renderiza o mesmo
  `AlertBanner` e `EmptyState` para todos os modulos pendentes.
- `frontend/src/config/modules.ts:97-204` marca os demais modulos como
  `em-construcao`.

Impacto: sensacao de produto incompleto quando o usuario explora alem dos dois
modulos prontos.

Gravidade: media.
Tipo: visual, conteudo, consistencia.
Fatia recomendada: F2/F4.

### Formularios financeiros

Forcas:

- Labels visiveis.
- Hints por campo.
- Erros inline com `role="alert"`.
- Inputs com `aria-describedby`.

Problemas:

- Existem primitivas duplicadas em `interest/formPrimitives.tsx` e
  `amortization/formPrimitives.tsx`.
- Labels e sufixos usam termos mistos como "Principal (BRL)" com sufixo "R$".
- Amortizacao usa "periodo" sem acento; juros usa "Prazo (meses)".
- Botao secundario "Limpar" e hint tecnico podem competir com a acao principal.

Evidencia:

- `frontend/src/components/interest/formPrimitives.tsx:26-151`.
- `frontend/src/components/amortization/formPrimitives.tsx:20-129`.
- `frontend/src/components/interest/JurosSimplesForm.tsx:78-85`.
- `frontend/src/components/amortization/AmortizacaoForm.tsx:103-127`.

Impacto: experiencia passa confianca tecnica, mas nao refinamento de produto.

Gravidade: media.
Tipo: consistencia, usabilidade, arquitetura frontend.
Fatia recomendada: F3.

### Cards de resumo

Achado principal: `SummaryCard` e reutilizavel, mas visualmente generico. O
valor principal tem destaque, porem falta hierarquia entre "resultado-chave" e
"metadado de entrada".

Evidencia:

- `frontend/src/components/ui/SummaryCard.tsx:40-62`.
- `frontend/src/components/interest/SummaryGrid.tsx:20-45`.
- `frontend/src/components/amortization/AmortizacaoSummary.tsx:15-35`.

Impacto: muitos cards com peso visual parecido dificultam identificar a
mensagem principal.

Gravidade: alta.
Tipo: visual, usabilidade.
Fatia recomendada: F3.

### Tabelas financeiras

Forcas:

- `caption` para leitor de tela.
- `scope="col"` e `scope="row"`.
- Container scrollavel com `role="region"`.

Problemas:

- Tratamento visual ainda basico.
- Tabelas longas renderizam integralmente ate 1200 periodos, conforme comentario
  ja reconhece.
- Em mobile, o scroll horizontal existe, mas nao ha affordance clara, resumo
  congelado ou controle de densidade.

Evidencia:

- `frontend/src/components/interest/AmortizacaoTables.tsx:12-14`.
- `frontend/src/components/interest/AmortizacaoTables.tsx:29-75`.
- `frontend/src/components/amortization/AmortizacaoTable.tsx:16-52`.

Impacto: tecnicamente correto, mas pesado para leitura e pouco didatico em
cenarios longos.

Gravidade: alta.
Tipo: responsividade, usabilidade, visual.
Fatia recomendada: F3/F4.

### Graficos

Forcas:

- Recharts centralizado.
- Series derivadas do payload da API.
- Labels e tooltips formatados em BRL.

Problemas:

- Cores hardcoded em grid/eixos e fallbacks.
- Recharts em jsdom ainda emite warning de dimensao zero nos testes.
- O grafico nao tem estado visual alternativo rico nem descricao textual
  interpretativa proxima.

Evidencia:

- `frontend/src/components/interest/EvolucaoSaldoChart.tsx:105,112,122`.
- `frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:91,98,108`.
- Residuo Sprint 3: warning Recharts/jsdom documentado em
  `docs/sprints/sprint-03/relatorio-forense.md`.

Impacto: visual funcional, mas ainda nao totalmente integrado ao design system.

Gravidade: media.
Tipo: visual, consistencia, acessibilidade.
Fatia recomendada: F3/F4.

### Alertas

Forcas:

- `AlertBanner` mapeia role por nivel.
- Usa cor e texto.

Problemas:

- A diferenca visual entre informativo, sucesso, alerta e erro e discreta
  demais para um produto que precisa orientar decisao financeira.
- Indicador circular de cor pode ser pouco significativo sozinho.

Evidencia:

- `frontend/src/components/ui/AlertBanner.tsx:22-40`.
- `frontend/src/components/ui/AlertBanner.tsx:50-73`.

Impacto: alertas existem, mas podem nao guiar bem a leitura de risco.

Gravidade: media.
Tipo: visual, acessibilidade, usabilidade.
Fatia recomendada: F3/F4.

### Estados loading/error/empty/success

Forcas:

- Estados reutilizaveis existem.
- `LoadingState` usa `role="status"` e `aria-live`.
- `ErrorState` usa `role="alert"`.
- `EmptyState` usa `role="status"`.

Problemas:

- Estados sao visualmente muito simples e pouco alinhados a uma plataforma
  premium.
- `EmptyState` usa icone textual "vazio" por padrao.
- Estados de sucesso nao tem componente proprio; cada painel monta a propria
  sequencia.

Evidencia:

- `frontend/src/components/states/LoadingState.tsx:24-44`.
- `frontend/src/components/states/ErrorState.tsx:25-53`.
- `frontend/src/components/states/EmptyState.tsx:24-42`.
- `frontend/src/components/interest/JurosSimplesPanel.tsx:57-91`.
- `frontend/src/components/amortization/PricePanel.tsx:55-91`.

Impacto: cobertura de estado boa, acabamento visual mediano.

Gravidade: media.
Tipo: visual, consistencia.
Fatia recomendada: F4.

### Conteudo educacional contextual

Forcas:

- Conteudo versionado para juros e amortizacao.
- Painel educacional com `role="complementary"`.
- Aviso educacional persistente.

Problemas:

- Conteudo muitas vezes aparece depois do uso, nao integrado ao ponto exato de
  decisao.
- Home ainda diz que calculos passariam a rodar na API a partir da Sprint 2,
  texto ja desatualizado.

Evidencia:

- `frontend/src/app/(app)/page.tsx:75-87`.
- `frontend/src/components/ui/EducationPanel.tsx:24-41`.
- `frontend/src/app/(app)/juros/page.tsx:57-78`.
- `frontend/src/app/(app)/amortizacao/page.tsx:50-101`.

Impacto: a plataforma tem conteudo, mas a pedagogia ainda pode parecer anexa
ao simulador em vez de integrada a jornada.

Gravidade: alta.
Tipo: conteudo, usabilidade.
Fatia recomendada: F3.

### Responsividade mobile/tablet/desktop

Forcas:

- Grids usam `sm`, `md`, `lg`, `xl`.
- Tabelas usam `overflow-auto`.
- Cards empilham em mobile.

Problemas:

- Nao ha menu mobile para substituir sidebar.
- Shell usa `px-6` fixo no main, que pode ser pesado em telas estreitas.
- Nao ha evidencia visual automatizada porque Chromium Playwright nao esta
  instalado no WSL atual.

Evidencia:

- `frontend/src/components/shell/ShellLayout.tsx:34-44`.
- Grep de responsive classes registrou breakpoints em shell, formularios,
  summary grids, tabelas e paginas.
- Tentativa real de screenshot falhou com Playwright sem browser instalado.

Impacto: layout provavelmente renderiza, mas navegacao mobile global esta
incompleta.

Gravidade: critica.
Tipo: responsividade, usabilidade.
Fatia recomendada: F2/F4.

### Acessibilidade basica

Forcas:

- `lang="pt-BR"` no root layout.
- Landmarks: banner, nav, main, contentinfo, complementary.
- Formularios usam label, aria-describedby e aria-invalid.
- Tabs usam role tablist/tab/tabpanel e suporte a teclado.

Problemas:

- Focus ring existe, mas depende de classes genericas e nao de token visual
  consolidado.
- A navegacao mobile ausente tambem e um problema de acessibilidade.
- Alguns icones/simbolos sao textuais ou decorativos simples.
- Nao ha gate a11y e2e executado nesta F1 por falta de browser Playwright.

Evidencia:

- `frontend/src/app/layout.tsx` foi listado no inventario de app.
- `frontend/src/components/interest/JurosTabs.tsx:87-130`.
- `frontend/src/components/amortization/AmortizacaoTabs.tsx:73-116`.
- `frontend/src/components/interest/formPrimitives.tsx:40-101`.
- `frontend/src/components/shell/ShellLayout.tsx:40-54`.

Impacto: boa base semantica, mas ainda sem comprovacao visual/a11y completa.

Gravidade: media.
Tipo: acessibilidade.
Fatia recomendada: F4.

### Consistencia visual e uso real dos tokens

Achado principal: existe design system, mas a implementacao usa mistura de CSS
vars, Tailwind direto, hex em grafico e config Tailwind paralela. O sistema e
funcional, mas ainda nao governa a UI de ponta a ponta.

Evidencia:

- `frontend/src/styles/tokens.css`.
- `frontend/src/styles/tokens.ts`.
- `frontend/tailwind.config.ts` define `brand.50`, `brand.500`, `brand.900`
  com valores diferentes da paleta canonica.
- Grep encontrou hex fora dos arquivos de tokens em graficos e `globals.css`.

Impacto: risco de drift visual e aparencia inconsistente quando novas telas
forem criadas.

Gravidade: alta.
Tipo: consistencia, arquitetura frontend, visual.
Fatia recomendada: F2.

## 4. Matriz resumida de problemas

| ID | Area | Gravidade | Tipo | Evidencia | Correcao recomendada | Fatia |
|----|------|-----------|------|-----------|----------------------|-------|
| UIUX-001 | Mobile nav | critica | responsividade/usabilidade | `ShellLayout.tsx:34-37`, `Header.tsx:26-49` | Criar menu mobile ou navegacao recolhivel acessivel | F2/F4 |
| UIUX-002 | Home | alta | conteudo/consistencia | `page.tsx:36-68`, `modules.ts:83,95` | Badge por status real e copy atualizada | F2 |
| UIUX-003 | Tokens | alta | consistencia/arquitetura | `tokens.*`, `tailwind.config.ts`, grep hex | Consolidar tokens e eliminar drift | F2 |
| UIUX-004 | Cards | alta | visual/usabilidade | `SummaryCard.tsx`, `SummaryGrid.tsx`, `AmortizacaoSummary.tsx` | Diferenciar resultado-chave de metadados | F3 |
| UIUX-005 | Amortizacao copy | alta | conteudo/polimento | `amortizacao/page.tsx`, `PricePanel.tsx`, `SacPanel.tsx` | Revisar PT-BR, acentos e tom | F3 |
| UIUX-006 | Tabelas longas | alta | responsividade/usabilidade | `AmortizacaoTables.tsx:12-14`, `AmortizacaoTable.tsx` | Melhorar densidade, affordance e leitura | F3/F4 |
| UIUX-007 | Primitivas duplicadas | media | arquitetura frontend/consistencia | `interest/formPrimitives.tsx`, `amortization/formPrimitives.tsx` | Unificar padrao de formulario | F3 |
| UIUX-008 | Graficos | media | visual/acessibilidade | charts com hex hardcoded | Tokenizar cores e melhorar fallback textual | F3/F4 |
| UIUX-009 | Estados | media | visual/consistencia | `states/*`, panels | Criar acabamento visual e sucesso padrao | F4 |
| UIUX-010 | Placeholders | media | visual/conteudo | `ModulePage.tsx` | Tratar roadmap de forma mais elegante | F2/F4 |

## 5. Analise de consistencia visual

A UI tem uma base limpa, mas ainda pouco sofisticada. O visual atual e
predominantemente utilitario: branco, slate, bordas simples, sombras pequenas,
cards retangulares e pouco contraste editorial. Isso favorece clareza inicial,
mas nao entrega sensacao premium.

O maior risco de consistencia e o design system existir mais como documento e
token do que como experiencia aplicada. A F2 deve atacar essa base antes de
polir telas especificas.

## 6. Analise de responsividade

Ha responsividade nos grids e tabelas, mas a navegacao global quebra no
conceito: a sidebar simplesmente desaparece no mobile. Esse e o principal
problema critico da Sprint 3.5.

Tabelas e graficos tem containers responsivos, mas precisam de validacao visual
real em 375px, 768px e 1280px depois que o ambiente Playwright tiver browser
instalado.

## 7. Analise de acessibilidade basica

A semantica esta acima da media para um scaffold: landmarks, labels, roles,
tabs e estados foram considerados. O problema nao e ausencia total de a11y; e
falta de comprovacao visual/e2e e ausencia de navegacao mobile global.

## 8. Riscos de regressao

- Alterar layout visual pode quebrar testes que procuram textos ou estados.
- Unificar primitivas de formulario pode afetar juros e amortizacao ao mesmo
  tempo.
- Mudar tokens pode alterar contraste e snapshots de componentes.
- Melhorar tabelas/graficos nao pode introduzir calculo financeiro no frontend.
- Qualquer mudanca em resultados deve manter contratos da API intactos.

## 9. Recomendacoes objetivas

1. Comecar por F2: shell, home, tokens e padroes globais.
2. Depois polir `/juros` e `/amortizacao` em F3 com foco em narrativa de
   resultado e decisao.
3. Separar F4 para responsividade, a11y, estados e evidencia visual.
4. Atualizar docs vivos apenas em F5, quando a UI final estiver comprovada.
5. Instalar ou preparar browsers Playwright antes de exigir screenshot/a11y
   como gate bloqueante.
