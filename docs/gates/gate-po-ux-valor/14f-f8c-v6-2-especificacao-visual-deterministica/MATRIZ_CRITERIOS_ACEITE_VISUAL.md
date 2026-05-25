# Matriz de Critérios de Aceite Visual — Módulo Imóvel

**Item:** 14F-F8C-v6.2
**Status:** Aguardando aprovação do PO

---

## Tipos de Critério

| Tipo | Definição |
|---|---|
| **BLOQUEANTE** | A entrega não pode ser aceita se este critério falhar. Qualquer falha bloqueia o aceite do PO. |
| **RECOMENDADO** | Forte orientação de qualidade. A ausência exige justificativa formal. |

---

## Categoria 1 — Rolagem e Viewport

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| RV-01 | Em desktop 1920×1080, cada combinação etapa × aba cabe na viewport sem barra de rolagem vertical do navegador | BLOQUEANTE | Abrir cada tela em Chromium 1920×1080 (fullscreen) e verificar ausência de scrollbar vertical no `body` | Screenshot de cada uma das 35 telas sem scrollbar vertical |
| RV-02 | Nenhuma tela usa `body { overflow: hidden }` ou equivalente para esconder conteúdo | BLOQUEANTE | DevTools → Computed → overflow: buscar no `body` e `html` | Source/computed sem overflow hidden no body |
| RV-03 | Nenhum conteúdo relevante está cortado ou oculto artificialmente | BLOQUEANTE | Inspecionar cada tela; verificar se conteúdo do spec está visível | Nenhum elemento com `visibility: hidden` ou `display: none` escondendo conteúdo que deveria ser visível |
| RV-04 | Nenhuma tela usa font-size < 12px em texto visível | BLOQUEANTE | DevTools → Accessibility → font-size mínimo | Nenhum elemento com computed font-size < 12px |
| RV-05 | Área útil de conteúdo ≥ 750px (após header, stepper, tabs, nav) | RECOMENDADO | Medir área com DevTools rulers | Computed height da área de conteúdo ≥ 750px |

---

## Categoria 2 — Contraste e Cores

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| CC-01 | Nenhum texto preto (#000 / #111 / #222 / #333) sobre fundo escuro ou cor forte | BLOQUEANTE | DevTools → Accessibility → Color Contrast; ou inspeção visual em cada tela com fundo escuro | WCAG AA mínimo (ratio 4.5:1 para texto normal) em todas as combinações |
| CC-02 | Texto branco (#FFF ou rgba white ≥ 0.85) em todos os elementos com fundo navy, deep-blue, royal-blue, violet, purple, green, teal, cyan, gold, orange | BLOQUEANTE | Inspeção visual + DevTools computed color em cada card escuro | Computed color = #FFF ou rgba equivalente em todos os textos sobre fundo escuro |
| CC-03 | Tokens de cor do design system usados (sem cores hardcoded fora da paleta) | RECOMENDADO | Busca no código CSS por valores hex não pertencentes à paleta | Máximo de 1–2 cores utilitárias fora da paleta (ex.: cor de erro) com justificativa |
| CC-04 | Fonte Manrope aplicada em todos os elementos de texto | BLOQUEANTE | DevTools → Computed → font-family em headings, body, labels | computed font-family começa com "Manrope" em todos os seletores de texto |

---

## Categoria 3 — Stepper e Navegação

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| SN-01 | Stepper principal visível em todas as 7 etapas | BLOQUEANTE | Navegar pelas 7 etapas e confirmar presença do stepper | Screenshot de cada etapa com stepper visível |
| SN-02 | Stepper com altura ≤ 56px | RECOMENDADO | DevTools → Box Model | computed height ≤ 56px |
| SN-03 | Etapa ativa destacada visualmente no stepper | BLOQUEANTE | Verificar em cada etapa se a etapa corrente tem diferenciação visual | Etapa ativa com cor royal-blue ou violet; texto white |
| SN-04 | Tab bar com abas internas presente em todas as etapas | BLOQUEANTE | Verificar presença de tab bar em cada uma das 7 etapas | Tab bar visível com as abas corretas por etapa |
| SN-05 | Tab bar com altura ≤ 48px | RECOMENDADO | DevTools → Box Model | computed height ≤ 48px |
| SN-06 | Aba ativa destacada com borda inferior e cor branca | BLOQUEANTE | Verificar em cada etapa o indicador da aba ativa | border-bottom 2px royal-blue ou violet; color: white |
| SN-07 | Botões Anterior/Próxima visíveis em todas as etapas (exceto extremos) | BLOQUEANTE | Verificar nav inferior em cada etapa | Botões visíveis e funcionais |

---

## Categoria 4 — Tabelas Financeiras

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| TF-01 | Máximo 1 tabela completa visível por tela | BLOQUEANTE | Verificar etapa Comparar (abas 5.2 e 5.3) — apenas 1 tabela por aba | Nenhuma tela com 2 tabelas de 120 linhas simultâneas |
| TF-02 | Máximo 8–10 linhas visíveis por página na tabela paginada | BLOQUEANTE | Contar linhas visíveis nas abas 5.2 e 5.3 | ≤ 10 linhas visíveis; restantes acessíveis via paginador |
| TF-03 | Sem scroll vertical interno na tabela | BLOQUEANTE | DevTools: elemento `<table>` ou wrapper não tem overflow-y: auto/scroll | Tabela sem scrollbar interno |
| TF-04 | Cabeçalho da tabela em fundo navy com texto branco | BLOQUEANTE | Inspeção visual + DevTools computed styles no `thead` | `thead` bg: navy (#071B3A), color: white (#FFF) |
| TF-05 | Rodapé/totais da tabela em fundo deep-blue com texto branco | BLOQUEANTE | Inspeção visual + DevTools | `tfoot` bg: deep-blue (#082A5E), color: white (#FFF) |
| TF-06 | Valores monetários alinhados à direita com font-variant tabular | RECOMENDADO | DevTools computed em colunas de valores | text-align: right; font-variant-numeric: tabular-nums |
| TF-07 | Font-size mínimo 13px nas células | BLOQUEANTE | DevTools computed font-size em células | computed ≥ 13px |
| TF-08 | Paginador presente e funcional | BLOQUEANTE | Clicar nos botões de paginação e verificar mudança de conteúdo | Linhas 1–8 na página 1, linhas 9–16 na página 2, etc. |
| TF-09 | Tabelas SAC e PRICE usam mesma taxa, mesmo prazo, mesmo principal | BLOQUEANTE | Verificar valores de entrada das duas tabelas | ambas: PV=170.000, i=0,0085, n=120, E=205 |

---

## Categoria 5 — Formulários

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| FM-01 | Todos os inputs com height 44px | BLOQUEANTE | DevTools computed height em todos os `<input>` | computed height = 44px |
| FM-02 | Nenhuma coluna quebrada no grid do formulário | BLOQUEANTE | Redimensionar para 1920px e verificar alinhamento | Campos perfeitamente alinhados em grid |
| FM-03 | Labels acima dos campos (não flutuantes sem indicação) | RECOMENDADO | Inspeção visual | Label posicionado acima do input em todos os campos |
| FM-04 | Estado de foco com borda royal-blue e shadow | BLOQUEANTE | Clicar em campo e verificar estilo de foco | border-color: royal-blue; box-shadow: 0 0 0 3px rgba(37,99,235,0.15) |
| FM-05 | Unidades monetárias visíveis (prefix R$ ou suffix) | BLOQUEANTE | Verificar campos de valor monetário | Prefixo "R$" ou hint de unidade visível |
| FM-06 | Campos com valores default do cenário fixo na etapa Simular | BLOQUEANTE | Abrir etapa Simular sem interação e verificar valores default | Valor imóvel: 870.000; entrada: 700.000; prazo: 120; taxa: 0,85; encargos: 205 |

---

## Categoria 6 — Cards e KPIs

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| CK-01 | Cards KPI com fundo escuro (deep-blue ou gradiente navy→indigo) e texto branco | BLOQUEANTE | DevTools computed em KPI cards | background: dark; color: #FFF |
| CK-02 | Font-size do valor KPI ≥ 28px | BLOQUEANTE | DevTools computed font-size no número principal do KPI | computed ≥ 28px |
| CK-03 | Nenhum card vazio (sem conteúdo útil) | BLOQUEANTE | Revisão visual de todas as 35 telas | Nenhum card com apenas espaço em branco ou texto placeholder |
| CK-04 | Cards com border-radius ≥ 10px | RECOMENDADO | DevTools computed border-radius | computed ≥ 10px |

---

## Categoria 7 — Aurora Gradient Border

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| AU-01 | Aurora Gradient Border presente nas posições especificadas (etapas 2, 3, 5, 7) | BLOQUEANTE | Verificar presença do componente aurora nas 4 posições | Elemento com gradiente animado nas etapas 2/Resumo, 3/Resumo, 5/Comparativo, 7/Conclusão |
| AU-02 | Máximo 2 elementos Aurora por tela | BLOQUEANTE | Contar elementos com classe aurora ou gradiente animado por tela | ≤ 2 elementos aurora em qualquer tela |
| AU-03 | Aurora não aplicada em tabelas | BLOQUEANTE | Verificar ausência de aurora em `table`, `thead`, `tbody`, `tr`, `td` | Nenhum elemento de tabela com aurora |
| AU-04 | Aurora não aplicada em inputs ou labels de formulário | BLOQUEANTE | Verificar inputs e labels | Nenhum input/label com aurora |
| AU-05 | Aurora respeita prefers-reduced-motion | BLOQUEANTE | DevTools → Rendering → Emulate prefers-reduced-motion: reduce | Animação aurora parada quando motion reduzido |
| AU-06 | Brilho aurora discreto (box-shadow com opacidade ≤ 0.40) | RECOMENDADO | DevTools computed box-shadow | rgba opacity ≤ 0.40 no box-shadow aurora |

---

## Categoria 8 — Gráficos

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| GR-01 | Gráfico de comparação SAC x PRICE presente na aba 5.4 | BLOQUEANTE | Verificar presença do gráfico | Gráfico de barras com 3 grupos (total pago, juros, encargos) |
| GR-02 | Gráfico de evolução do saldo devedor presente na aba 4.4 | BLOQUEANTE | Verificar presença do gráfico | Gráfico de linha com 2 séries (SAC e PRICE) |
| GR-03 | Gráfico de composição de parcela presente na aba 4.1 | BLOQUEANTE | Verificar presença do gráfico | Gráfico de pizza ou área com 3 fatias (amortização, juros, encargos) |
| GR-04 | Legenda presente e legível em todos os gráficos | BLOQUEANTE | Verificar legenda em cada gráfico | Legenda com font-size ≥ 12px e contraste suficiente |
| GR-05 | Interpretação pedagógica textual acompanha cada gráfico | BLOQUEANTE | Verificar texto abaixo ou ao lado de cada gráfico | Texto de interpretação com mínimo 2 frases |
| GR-06 | Cores dos gráficos consistentes com semântica da paleta | RECOMENDADO | Comparar cores das séries com os tokens definidos | SAC = royal-blue, PRICE = violet, etc. |

---

## Categoria 9 — Cenário Financeiro

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| CF-01 | Valor do imóvel = R$ 870.000,00 em todo o módulo | BLOQUEANTE | Busca textual + verificação visual | R$ 870.000,00 em todas as ocorrências |
| CF-02 | Entrada = R$ 700.000,00 em todo o módulo | BLOQUEANTE | Busca textual + verificação visual | R$ 700.000,00 em todas as ocorrências |
| CF-03 | Valor financiado = R$ 170.000,00 em todo o módulo | BLOQUEANTE | Busca textual + verificação visual | R$ 170.000,00 em todas as ocorrências |
| CF-04 | Prazo = 120 meses em todo o módulo | BLOQUEANTE | Busca textual + verificação visual | 120 meses em todas as ocorrências |
| CF-05 | Taxa mensal = 0,85% a.m. em todo o módulo | BLOQUEANTE | Busca textual + verificação visual | 0,85% a.m. em todas as ocorrências |
| CF-06 | Encargos mensais = R$ 205,00 em todo o módulo | BLOQUEANTE | Busca textual + verificação visual | R$ 205,00/mês em todas as ocorrências |
| CF-07 | Encargos totais = R$ 24.600,00 (205 × 120) em todo o módulo | BLOQUEANTE | Verificação matemática + visual | R$ 24.600,00 em todas as ocorrências de total de encargos |
| CF-08 | Comparação SAC x PRICE usa mesma taxa (0,85%), mesmo prazo (120), mesmo principal (170.000) | BLOQUEANTE | Verificar parâmetros das duas tabelas | Tabela SAC e tabela PRICE com parâmetros idênticos |

---

## Categoria 10 — Qualidade Geral

| ID | Critério | Tipo | Como Validar | Evidência Esperada |
|---|---|---|---|---|
| QG-01 | Nenhum placeholder, "TODO", "definir depois", "ajustar futuramente" no conteúdo visível | BLOQUEANTE | Busca textual no código e renderização | Zero ocorrências de texto placeholder em elementos visíveis |
| QG-02 | Todos os textos em português do Brasil (sem inglês em UI voltada ao usuário) | RECOMENDADO | Revisão visual de todas as 35 telas | Nenhum texto de UI em inglês (exceto termos técnicos consagrados como "SAC", "PRICE") |
| QG-03 | Interface visualmente premium (não parece formulário esticado, protótipo cru ou tela bancária burocrática) | BLOQUEANTE | Avaliação visual humana do PO | Aprovação explícita do PO após revisão visual |
| QG-04 | Aceite visual do PO é obrigatório antes de qualquer uso em produção | BLOQUEANTE | Registro formal de aceite pelo PO | Documento de aceite assinado/registrado pelo PO |

---

## Resumo Estatístico

| Categoria | BLOQUEANTE | RECOMENDADO | Total |
|---|---|---|---|
| Rolagem e Viewport | 4 | 1 | 5 |
| Contraste e Cores | 3 | 1 | 4 |
| Stepper e Navegação | 6 | 1 | 7 |
| Tabelas Financeiras | 8 | 1 | 9 |
| Formulários | 5 | 1 | 6 |
| Cards e KPIs | 3 | 1 | 4 |
| Aurora Gradient Border | 5 | 1 | 6 |
| Gráficos | 5 | 1 | 6 |
| Cenário Financeiro | 8 | 0 | 8 |
| Qualidade Geral | 2 | 2 | 4 |
| **Total** | **49** | **10** | **59** |

---

*Esta matriz deve ser revisada para cada release. A ausência de evidência de critério BLOQUEANTE equivale a não aceite. Critérios BLOQUEANTES com falha bloqueiam integralmente o merge para a branch de produção.*
