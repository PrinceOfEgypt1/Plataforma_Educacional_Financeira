# Matriz de Etapas × Abas × Componentes — Módulo Imóvel

**Item:** 14F-F8C-v6.2
**Status:** Especificação aguardando aprovação do PO

---

## Legenda de Componentes

| Sigla | Componente |
|---|---|
| `KPI` | Card KPI (número grande em fundo escuro) |
| `CARD-L` | Card claro (fundo --white / --soft-bg) |
| `CARD-D` | Card escuro (fundo --navy / --deep-blue) |
| `CARD-A` | Card Aurora Gradient Border |
| `TBL` | Tabela financeira paginada |
| `FORM` | Formulário com campo(s) |
| `GRF` | Gráfico |
| `ALERTA` | Card de alerta (borda esquerda --orange) |
| `FORMULA` | Bloco de fórmula tipografada |
| `CHECKLIST` | Lista de checagem interativa |
| `CTA` | Botão CTA (ação principal) |
| `CTA-A` | Botão CTA com Aurora Border |
| `NAV` | Botões Anterior/Próxima |

---

## Etapa 1 — Preparar

### Aba 1.1 — Visão Geral

| Atributo | Valor |
|---|---|
| **Objetivo** | Apresentar o módulo ao usuário e explicar o que ele vai aprender e simular |
| **Layout** | Grid 2 colunas: coluna esquerda (60%) texto + KPI summary; coluna direita (40%) card informativo |
| **Componentes** | `CARD-D` (resumo do que é financiamento imobiliário), `KPI` ×3 (valor imóvel, entrada, financiado), `CARD-L` (o que você vai aprender neste módulo) |
| **Conteúdo obrigatório** | Definição de financiamento imobiliário; o que é SAC e PRICE (1 parágrafo cada); cenário demonstrativo com valores fixos; lista das 7 etapas do módulo |
| **Critério de aceite** | Respeita o orçamento vertical sem rolagem vertical (ver Especificação §7); KPIs com os valores do cenário fixo; texto legível (≥14px); nenhum espaço vazio inútil |

### Aba 1.2 — Entrada

| Atributo | Valor |
|---|---|
| **Objetivo** | Explicar o conceito de entrada e seu impacto no financiamento |
| **Layout** | Grid 2 colunas: esquerda (65%) explicação educacional; direita (35%) KPI + cálculo simples |
| **Componentes** | `CARD-L` (definição de entrada), `KPI` (valor da entrada R$700.000), `KPI` (percentual da entrada 80,5%), `CARD-D` (regra geral de entrada no Brasil: mínimo 20%), `ALERTA` (quanto maior a entrada, menor o custo total) |
| **Conteúdo obrigatório** | Definição de entrada; cálculo do percentual entrada/valor imóvel; impacto da entrada no valor financiado; regra prática (mínimo 20% exigido pela maioria dos bancos); lição educacional sobre entrada estratégica |
| **Critério de aceite** | Percentual calculado corretamente (700.000/870.000 = 80,46%); Respeita o orçamento vertical da viewport (ver Especificação §7); texto didático e não técnico |

### Aba 1.3 — Valor Financiado

| Atributo | Valor |
|---|---|
| **Objetivo** | Explicar o que é o valor financiado e como ele é base de todos os cálculos |
| **Layout** | Grid 2 colunas: esquerda (60%) explicação + fórmula; direita (40%) KPIs |
| **Componentes** | `CARD-D` (definição de valor financiado), `KPI` (R$170.000), `FORMULA` (valor financiado = valor imóvel − entrada), `CARD-L` (impacto do valor financiado no custo total), `CARD-L` (dica educacional) |
| **Conteúdo obrigatório** | Definição; fórmula; cálculo com os valores do cenário fixo; explicação de por que o prazo e a taxa são aplicados sobre o financiado, não sobre o imóvel |
| **Critério de aceite** | Fórmula legível; valores corretos (870.000 − 700.000 = 170.000); Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 1.4 — SAC x PRICE

| Atributo | Valor |
|---|---|
| **Objetivo** | Apresentar os dois sistemas de amortização de forma comparativa e acessível |
| **Layout** | Grid 2 colunas side-by-side: SAC à esquerda, PRICE à direita; rodapé com mensagem de comparação justa |
| **Componentes** | `CARD-D` (SAC: definição + características), `CARD-D` (PRICE: definição + características), `CARD-L` (comparação pedagógica: quando usar cada um), `ALERTA` (atenção: comparação justa exige mesma taxa e mesmo prazo) |
| **Conteúdo obrigatório** | Definição de SAC; definição de PRICE; como a parcela varia em cada sistema; qual sistema tende a ser mais barato (SAC); por que a comparação justa exige mesma base |
| **Critério de aceite** | Dois cards lado a lado sem rolagem; destaque visual diferente entre SAC e PRICE; alerta de base justa visível |

### Aba 1.5 — Cuidados

| Atributo | Valor |
|---|---|
| **Objetivo** | Alertar sobre os principais cuidados antes de contratar um financiamento imobiliário |
| **Layout** | Lista de cards de alerta, 2 colunas × 2 linhas + 1 card de conclusão |
| **Componentes** | `ALERTA` ×4 (cuidados: taxa efetiva vs nominal, CET, seguros obrigatórios, prazo longo = custo alto), `CARD-D` (mensagem de encerramento da etapa Preparar) |
| **Conteúdo obrigatório** | 4 cuidados concretos com texto curto; destaque visual de cada alerta; CTA de transição para etapa Simular |
| **Critério de aceite** | 4 alertas visíveis sem rolagem; CTA legível e clicável |

---

## Etapa 2 — Simular

### Aba 2.1 — Dados do Imóvel

| Atributo | Valor |
|---|---|
| **Objetivo** | Capturar o valor do imóvel e da entrada |
| **Layout** | Grid 1 coluna centralizada (max-width: 600px), campos empilhados |
| **Componentes** | `FORM` (campo: valor do imóvel, prefixo R$, valor default 870.000), `FORM` (campo: valor da entrada, prefixo R$, valor default 700.000), `KPI` derivado (valor financiado calculado em tempo real: 170.000), `CARD-L` (hint pedagógico) |
| **Conteúdo obrigatório** | Dois campos com valores default do cenário fixo; valor financiado derivado em tempo real; hint sobre entrada mínima recomendada |
| **Critério de aceite** | Campos com height 44px; cálculo em tempo real; hint visível; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 2.2 — Condições

| Atributo | Valor |
|---|---|
| **Objetivo** | Capturar prazo e taxa de juros |
| **Layout** | Grid 2 colunas (600px max), 1 campo por coluna |
| **Componentes** | `FORM` (prazo em meses: default 120), `FORM` (taxa mensal em %: default 0,85), `KPI` (taxa anual equivalente calculada), `CARD-L` (hint: taxa praticada pelos bancos no Brasil) |
| **Conteúdo obrigatório** | Campos com valores default do cenário; taxa anual derivada (aprox. 10,65% a.a.); hint contextual |
| **Critério de aceite** | Derivação da taxa anual correta; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 2.3 — Custos

| Atributo | Valor |
|---|---|
| **Objetivo** | Capturar os encargos mensais (seguros, taxas administrativas) |
| **Layout** | Grid 1 coluna (max-width: 500px) |
| **Componentes** | `FORM` (encargos mensais: default 205,00), `KPI` (encargos totais calculados: 205 × 120 = 24.600), `CARD-L` (o que são os encargos: MIP, DFI, taxa de administração), `ALERTA` (encargos não amortizam o saldo devedor) |
| **Conteúdo obrigatório** | Campo com default 205,00; cálculo automático do total; explicação do que são os encargos |
| **Critério de aceite** | 205 × 120 = 24.600 calculado corretamente; alerta visível; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 2.4 — Sistema

| Atributo | Valor |
|---|---|
| **Objetivo** | Selecionar o sistema de amortização principal e o secundário para comparação |
| **Layout** | Grid 2 colunas: seletor de sistema principal + card do sistema selecionado |
| **Componentes** | `FORM` (radio/toggle: SAC — padrão, ou PRICE), `CARD-D` (explicação do sistema selecionado com mini-resumo de vantagens), `CARD-L` (comparação secundária: sempre SAC x PRICE com base justa) |
| **Conteúdo obrigatório** | Seletor de sistema; mini-explicação dinâmica; confirmação de que a comparação usa base justa |
| **Critério de aceite** | SAC selecionado por default; texto dinâmico conforme seleção; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 2.5 — Resumo

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir o resumo dos dados preenchidos e CTA para calcular |
| **Layout** | Grid 2 colunas: esquerda resumo dos parâmetros; direita CTA Aurora |
| **Componentes** | `CARD-D` (resumo completo: todos os parâmetros preenchidos), `KPI` ×3 (valor financiado, prazo, taxa), `CTA-A` (botão "Calcular — Ver Resultado" com Aurora Border) |
| **Conteúdo obrigatório** | Todos os parâmetros listados com valores; CTA com Aurora Border proeminente e legível |
| **Critério de aceite** | Todos os valores do cenário visíveis; CTA Aurora visível e chamativo; Respeita o orçamento vertical da viewport (ver Especificação §7) |

---

## Etapa 3 — Resultado

### Aba 3.1 — Resumo

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir o resultado principal do cálculo SAC de forma impactante |
| **Layout** | Grid 3 colunas de KPIs + 1 card Aurora de destaque |
| **Componentes** | `KPI` (1ª parcela SAC), `KPI` (última parcela SAC), `KPI` (total pago SAC), `CARD-A` (card Aurora: síntese do resultado — você vai pagar X de juros em Y meses) |
| **Conteúdo obrigatório** | 1ª parcela SAC calculada; última parcela SAC; total pago (principal + juros + encargos); mensagem pedagógica de custo do financiamento |
| **Critério de aceite** | Valores corretos para SAC 170.000 / 120 meses / 0,85% + 205/mês; card Aurora não sobreposto; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 3.2 — Cenário

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir os parâmetros do cenário simulado em formato de referência |
| **Layout** | Grid 2 colunas de cards com os parâmetros |
| **Componentes** | `CARD-D` ×2 (parâmetros do imóvel e condições), `CARD-L` (o que muda se você alterar os parâmetros), `KPI` ×2 (valor financiado, prazo) |
| **Conteúdo obrigatório** | Todos os parâmetros do cenário fixo visíveis; nota de que os valores são demonstrativos; link textual para voltar a Simular |
| **Critério de aceite** | Todos os parâmetros listados; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 3.3 — Alertas

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir alertas financeiros sobre o resultado calculado |
| **Layout** | Coluna de alertas (max-width: 700px, centralizada) |
| **Componentes** | `ALERTA` ×3 a 4 (alertas contextuais baseados no resultado: custo de juros alto, prazo longo, parcela inicial vs capacidade de pagamento, encargos como componente oculto) |
| **Conteúdo obrigatório** | Mínimo 3 alertas relevantes ao cenário simulado; cada alerta com título, ícone e texto explicativo; linguagem educacional, não alarmista |
| **Critério de aceite** | 3–4 alertas visíveis sem rolagem; linguagem acessível; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 3.4 — Interpretação

| Atributo | Valor |
|---|---|
| **Objetivo** | Interpretar pedagogicamente o resultado para o usuário |
| **Layout** | Grid 2 colunas: esquerda (60%) texto interpretativo; direita (40%) KPI + CARD |
| **Componentes** | `CARD-L` (interpretação: o que significa pagar R$ X de juros), `CARD-D` (perspectiva: custo do financiamento vs aluguel), `KPI` (relação juros/principal), `CARD-L` (próximo passo: entender como a parcela funciona) |
| **Conteúdo obrigatório** | Interpretação em linguagem acessível do custo total; relação percentual juros/principal; comparação pedagógica; CTA textual para etapa Entender |
| **Critério de aceite** | Texto legível e educacional; KPI correto; Respeita o orçamento vertical da viewport (ver Especificação §7) |

---

## Etapa 4 — Entender

### Aba 4.1 — Parcela

| Atributo | Valor |
|---|---|
| **Objetivo** | Explicar como é composta a parcela no sistema SAC |
| **Layout** | Grid 2 colunas: esquerda explicação; direita mini-gráfico de composição |
| **Componentes** | `CARD-D` (composição: amortização + juros + encargos), `KPI` ×3 (amortização fixa, juros decrescentes, encargos fixos — para 1ª parcela), `GRF` (pizza ou área: composição da 1ª parcela), `CARD-L` (como a parcela muda ao longo do tempo no SAC) |
| **Conteúdo obrigatório** | Decomposição da 1ª parcela SAC nos 3 componentes com valores reais; gráfico de composição; explicação da redução de juros ao longo do tempo |
| **Critério de aceite** | Valores corretos da 1ª parcela SAC; gráfico legível; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 4.2 — Amortização

| Atributo | Valor |
|---|---|
| **Objetivo** | Explicar o conceito de amortização e seu valor fixo no SAC |
| **Layout** | Grid 2 colunas: esquerda texto + fórmula; direita KPI + card |
| **Componentes** | `CARD-D` (definição de amortização), `FORMULA` (amortização SAC = principal / prazo = 170.000 / 120 = R$1.416,67), `KPI` (valor da amortização fixa SAC: R$1.416,67), `CARD-L` (diferença entre SAC e PRICE na amortização) |
| **Conteúdo obrigatório** | Definição clara; fórmula tipografada; valor calculado correto; contraste com PRICE (amortização crescente) |
| **Critério de aceite** | Fórmula legível; 170.000/120 = 1.416,67 correto; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 4.3 — Juros

| Atributo | Valor |
|---|---|
| **Objetivo** | Explicar como os juros são calculados e decrescem no SAC |
| **Layout** | Grid 2 colunas: esquerda texto + fórmula; direita KPI + ALERTA |
| **Componentes** | `CARD-D` (como os juros são calculados no SAC), `FORMULA` (juros parcela n = saldo devedor(n-1) × taxa), `KPI` (juros 1ª parcela), `KPI` (juros última parcela), `ALERTA` (os juros representam X% do total pago) |
| **Conteúdo obrigatório** | Fórmula dos juros SAC; valor dos juros na 1ª parcela (0,0085 × 170.000 = R$1.445,00); valor na última parcela; percentual de juros sobre o total |
| **Critério de aceite** | 0,0085 × 170.000 = 1.445,00 correto; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 4.4 — Saldo Devedor

| Atributo | Valor |
|---|---|
| **Objetivo** | Mostrar como o saldo devedor evolui ao longo do tempo no SAC |
| **Layout** | Grid 2 colunas: esquerda KPIs de marco; direita gráfico de linha |
| **Componentes** | `KPI` (saldo inicial: 170.000), `KPI` (saldo no mês 60: 85.000), `KPI` (saldo final: 0), `GRF` (linha: evolução do saldo SAC vs PRICE ao longo de 120 meses), `CARD-L` (interpretação: SAC amortiza mais rápido no início) |
| **Conteúdo obrigatório** | Gráfico de linha com SAC e PRICE; KPIs de marcos (início, meio, fim); interpretação pedagógica |
| **Critério de aceite** | Gráfico com 2 séries (SAC azul, PRICE violeta); saldos nos marcos corretos; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 4.5 — SAC x PRICE

| Atributo | Valor |
|---|---|
| **Objetivo** | Comparar os dois sistemas de amortização em nível conceitual e numérico resumido |
| **Layout** | Grid 2 colunas side-by-side + 1 linha de KPIs comparativos |
| **Componentes** | `CARD-D` (SAC: características principais + vantagens), `CARD-D` (PRICE: características principais + vantagens), `KPI` ×2 (total pago SAC vs total pago PRICE), `ALERTA` (SAC é geralmente mais barato no total — base justa) |
| **Conteúdo obrigatório** | Características e vantagens de cada sistema; totais comparados; alerta de base justa |
| **Critério de aceite** | Dois cards lado a lado; totais com valores corretos calculados na mesma base; Respeita o orçamento vertical da viewport (ver Especificação §7) |

---

## Etapa 5 — Comparar

### Aba 5.1 — Resumo Comparativo

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir a comparação SAC x PRICE de forma sintética e impactante |
| **Layout** | Grid 2 colunas principais + 1 card Aurora de vencedor |
| **Componentes** | `CARD-D` (SAC: total pago, juros totais, 1ª parcela, última parcela), `CARD-D` (PRICE: total pago, juros totais, parcela fixa), `CARD-A` (card Aurora: vencedor SAC — economia de R$X), `KPI` (economia total SAC vs PRICE) |
| **Conteúdo obrigatório** | Métricas de comparação com mesma base; card Aurora para o sistema mais vantajoso; valor da economia; nota de base justa |
| **Critério de aceite** | Base justa confirmada; card Aurora presente; economia calculada corretamente; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 5.2 — Tabela SAC

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir a tabela completa de amortização SAC com paginação |
| **Layout** | 1 tabela paginada ocupando toda a largura disponível |
| **Componentes** | `TBL` (tabela SAC paginada, 8 linhas/página, 120 parcelas = 15 páginas), paginador |
| **Conteúdo obrigatório** | 7 colunas: Parcela, Saldo inicial, Juros, Amortização, Encargos, Total parcela, Saldo final; rodapé com totais |
| **Critério de aceite** | Cabeçalho navy/branco; 8 linhas visíveis; paginador funcional; valores corretos; sem scroll vertical; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 5.3 — Tabela PRICE

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir a tabela completa de amortização PRICE com paginação |
| **Layout** | Idêntico ao da aba 5.2 |
| **Componentes** | `TBL` (tabela PRICE paginada, 8 linhas/página), paginador |
| **Conteúdo obrigatório** | Mesmas 7 colunas da tabela SAC; mesmos totais de encargos (base justa); rodapé com totais |
| **Critério de aceite** | Mesma taxa, mesmo prazo, mesmo principal que SAC; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 5.4 — Gráfico

| Atributo | Valor |
|---|---|
| **Objetivo** | Visualizar graficamente as diferenças SAC x PRICE |
| **Layout** | 1 gráfico de barras agrupadas ou stacked + legenda + interpretação |
| **Componentes** | `GRF` (barras: total pago, juros totais, encargos para SAC vs PRICE), `CARD-L` (interpretação do gráfico em 3–4 frases) |
| **Conteúdo obrigatório** | 3 grupos de barras (total pago, juros, encargos); legenda SAC azul / PRICE violeta; interpretação pedagógica |
| **Critério de aceite** | Gráfico legível; legenda visível; encargos iguais (base justa); interpretação presente; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 5.5 — Leitura Pedagógica

| Atributo | Valor |
|---|---|
| **Objetivo** | Ensinar o usuário a interpretar a comparação e tomar a decisão certa |
| **Layout** | Coluna única (max-width: 700px, centralizada), 3–4 blocos de texto |
| **Componentes** | `CARD-L` ×3 (lição 1: quando SAC é melhor; lição 2: quando PRICE pode ser preferível; lição 3: fatores que afetam a decisão), `CTA` (próximo: Conferir os cálculos) |
| **Conteúdo obrigatório** | Quando SAC é vantajoso; quando PRICE pode ser justificado (fluxo de caixa inicial); fatores de decisão; nota sobre parcela inicial menor no SAC mas total mais baixo |
| **Critério de aceite** | Texto educacional; sem jargão excessivo; Respeita o orçamento vertical da viewport (ver Especificação §7) |

---

## Etapa 6 — Conferir

### Aba 6.1 — Fórmulas SAC

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir as fórmulas matemáticas do SAC de forma auditável |
| **Layout** | 2 colunas: fórmula (esquerda) + cálculo com valores do cenário (direita) |
| **Componentes** | `FORMULA` ×4 (amortização fixa, juros, total parcela, saldo devedor), `CARD-D` (exemplo calculado para parcela 1 com valores do cenário) |
| **Conteúdo obrigatório** | 4 fórmulas SAC tipografadas; cálculo demonstrado com valores reais do cenário |
| **Critério de aceite** | Fórmulas legíveis em fonte mono; cálculos conferíveis; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 6.2 — Fórmulas PRICE

| Atributo | Valor |
|---|---|
| **Objetivo** | Exibir as fórmulas matemáticas do PRICE (HP) de forma auditável |
| **Layout** | Idêntico à aba 6.1 |
| **Componentes** | `FORMULA` ×3 (parcela fixa HP, juros, amortização crescente), `CARD-D` (exemplo calculado para parcela 1 PRICE com valores do cenário) |
| **Conteúdo obrigatório** | Fórmula da parcela PRICE (HP); decomposição juros/amortização; demonstração com os valores do cenário |
| **Critério de aceite** | Fórmula HP visível e legível; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 6.3 — Variáveis

| Atributo | Valor |
|---|---|
| **Objetivo** | Listar todas as variáveis usadas nas fórmulas com seus valores no cenário |
| **Layout** | Tabela de variáveis simples (2 colunas) |
| **Componentes** | `TBL` (tabela de variáveis: símbolo, descrição, valor no cenário) — tabela simples, não paginada (cabe em 1 tela) |
| **Conteúdo obrigatório** | PV (170.000), i (0,0085), n (120), E (205,00), A (1.416,67), juros(1) (1.445,00), e todas as demais variáveis usadas |
| **Critério de aceite** | Tabela legível; todos os valores corretos; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 6.4 — Passo a Passo

| Atributo | Valor |
|---|---|
| **Objetivo** | Demonstrar o cálculo passo a passo para a parcela 1 e a parcela 60 |
| **Layout** | Grid 2 colunas: passo a passo parcela 1 (esquerda) e parcela 60 (direita) |
| **Componentes** | `CARD-D` ×2 (passo a passo numerado de cada parcela), `FORMULA` inline em cada passo |
| **Conteúdo obrigatório** | 4–5 passos para calcular parcela 1 SAC; 4–5 passos para parcela 60 SAC; valores reais |
| **Critério de aceite** | Passos numerados; fórmulas legíveis; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 6.5 — Auditoria

| Atributo | Valor |
|---|---|
| **Objetivo** | Confirmar a consistência dos cálculos através de verificações auditáveis |
| **Layout** | Lista de verificações com status visual |
| **Componentes** | `CHECKLIST` (verificações: soma das amortizações = principal; saldo final = 0; total de encargos = 24.600; base justa SAC x PRICE confirmada), `CARD-L` (conclusão: cálculos conferidos) |
| **Conteúdo obrigatório** | 4–6 verificações com resultado esperado e resultado calculado; status de cada verificação (OK ou DIVERGÊNCIA) |
| **Critério de aceite** | Todas as verificações passando; linguagem auditável; Respeita o orçamento vertical da viewport (ver Especificação §7) |

---

## Etapa 7 — Decidir

### Aba 7.1 — Diagnóstico

| Atributo | Valor |
|---|---|
| **Objetivo** | Apresentar um diagnóstico educacional sobre a viabilidade do financiamento |
| **Layout** | Grid 2 colunas: diagnóstico (esquerda) + KPIs de diagnóstico (direita) |
| **Componentes** | `CARD-D` (diagnóstico: custo total do financiamento, comprometimento de renda típico, tempo de comprometimento), `KPI` ×3 (total pago, total de juros, percentual de juros sobre total) |
| **Conteúdo obrigatório** | Síntese do custo do financiamento; explicação do comprometimento de renda para uma renda hipotética; alertas de prazo longo |
| **Critério de aceite** | Diagnóstico educacional e não alarmista; KPIs corretos; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 7.2 — Checklist

| Atributo | Valor |
|---|---|
| **Objetivo** | Ajudar o usuário a verificar se está pronto para contratar o financiamento |
| **Layout** | Coluna única (max-width: 650px, centralizada) com checklist interativo |
| **Componentes** | `CHECKLIST` (8–10 itens: você tem entrada suficiente? avaliou o CET? comparou propostas de diferentes bancos? tem reserva de emergência? etc.) |
| **Conteúdo obrigatório** | 8–10 itens de checklist práticos e educacionais; nenhum item vazio ou genérico |
| **Critério de aceite** | Todos os itens visíveis sem rolagem; itens práticos e relevantes; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 7.3 — Próximos Passos

| Atributo | Valor |
|---|---|
| **Objetivo** | Orientar o usuário sobre os próximos passos concretos após a simulação |
| **Layout** | Grid 2 colunas de cards de ação |
| **Componentes** | `CARD-L` ×4 (próximos passos: 1. simule em diferentes bancos; 2. peça a proposta formal; 3. analise o CET; 4. revise o contrato com especialista) |
| **Conteúdo obrigatório** | 4 passos concretos com ação clara; nenhum passo genérico ou vago |
| **Critério de aceite** | 4 cards visíveis; texto acionável; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 7.4 — Cuidados

| Atributo | Valor |
|---|---|
| **Objetivo** | Reforçar os principais cuidados na hora de contratar |
| **Layout** | Coluna de alertas (similar à aba 1.5) |
| **Componentes** | `ALERTA` ×4 (cuidados de contratação: leia o contrato; verifique o ITBI e cartório; entenda o seguro obrigatório; cuidado com portabilidade de crédito) |
| **Conteúdo obrigatório** | 4 alertas diferentes dos da etapa Preparar, focados no momento da contratação |
| **Critério de aceite** | 4 alertas legíveis sem rolagem; Respeita o orçamento vertical da viewport (ver Especificação §7) |

### Aba 7.5 — Conclusão

| Atributo | Valor |
|---|---|
| **Objetivo** | Encerrar a jornada com uma mensagem de empoderamento e CTA final |
| **Layout** | Coluna centralizada (max-width: 700px) + card Aurora de conclusão |
| **Componentes** | `CARD-A` (card Aurora de conclusão: síntese da jornada completa), `CARD-L` (o que você aprendeu neste módulo), `CTA` (reiniciar simulação), `CTA` (explorar outros módulos da plataforma) |
| **Conteúdo obrigatório** | Mensagem de encerramento empolgante e educacional; listagem do que o usuário aprendeu; 2 CTAs claros |
| **Critério de aceite** | Card Aurora presente e legível; mensagem positiva; CTAs visíveis; Respeita o orçamento vertical da viewport (ver Especificação §7) |

---

*Toda combinação etapa × aba acima constitui uma tela própria com critério de aceite independente. A ausência de qualquer aba desta matriz constitui entrega incompleta.*
