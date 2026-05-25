# Wireframe Textual Determinístico — Módulo Imóvel

**Item:** 14F-F8C-v6.2  
**Status:** Aguardando aprovação do PO  
**Nota:** Cada seção abaixo descreve uma tela completa (combinação etapa × aba). São 35 telas no total (7 etapas × 5 abas em média).

---

## Etapa 1 — Preparar

### Aba 1.1 — Visão Geral

**Objetivo:**  
Apresentar o módulo ao usuário, contextualizar o cenário demonstrativo e listar as etapas da jornada.

**Layout:**  
- Região A (topo, largura total): título da etapa em `--text-display`, fundo `--navy`, texto branco. "Preparar — Entenda antes de simular."
- Região B (grid 2 colunas, col-esq 60%, col-dir 40%):
  - Esquerda: Card escuro (CARD-D) com definição de financiamento imobiliário (2 parágrafos curtos).
  - Direita: 3 KPIs empilhados (valor do imóvel R$870.000 / entrada R$700.000 / financiado R$170.000), fundo gradiente navy→indigo, texto branco.
- Região C (largura total, fundo `--soft-bg`): Card claro (CARD-L) com lista das 7 etapas do módulo em 2 colunas de 3+4, com ícone e descrição curta por etapa.

**Componentes:**  
- CARD-D: definição de financiamento imobiliário  
- KPI × 3: valor imóvel, entrada, financiado (cenário fixo)  
- CARD-L: lista das 7 etapas  

**Critério de aceite:**  
- KPIs com valores do cenário fixo (870.000 / 700.000 / 170.000).  
- Todas as 7 etapas listadas.  
- Cabe em 824px sem scrollbar vertical.  

---

### Aba 1.2 — Entrada

**Objetivo:**  
Explicar o conceito de entrada no financiamento imobiliário e seu impacto no custo total.

**Layout:**  
- Região A (topo, largura total): título "Entrada — O que você traz de recursos próprios", fundo `--deep-blue`, texto branco.
- Região B (grid 2 colunas, col-esq 65%, col-dir 35%):
  - Esquerda: CARD-D com definição de entrada; texto em 3 parágrafos curtos (o que é / como calcular / impacto).
  - Direita: KPI (valor da entrada: R$700.000) + KPI (% da entrada: 80,5%) empilhados.
- Região C (largura total): CARD alerta `--orange` borda esquerda: "Quanto maior a entrada, menor o custo total do financiamento."
- Região D (grid 2 colunas menores): CARD-D "Regra prática: bancos exigem entrada mínima de 20%" | CARD-L "Sua entrada representa 80,5% do valor do imóvel — muito acima do mínimo."

**Componentes:**  
- CARD-D: definição de entrada  
- KPI × 2: valor da entrada, percentual da entrada  
- ALERTA: lição de entrada estratégica  
- CARD-D: regra de entrada mínima  
- CARD-L: análise do cenário  

**Critério de aceite:**  
- Percentual correto: 700.000 / 870.000 = 80,46% arredondado para 80,5%.  
- Alerta visível.  
- Cabe em 824px.  

---

### Aba 1.3 — Valor Financiado

**Objetivo:**  
Explicar o conceito de valor financiado e sua centralidade nos cálculos de amortização.

**Layout:**  
- Região A (topo, largura total): título "Valor Financiado — A base de todos os cálculos", fundo `--navy`, texto branco.
- Região B (grid 2 colunas, col-esq 60%, col-dir 40%):
  - Esquerda: CARD-D com definição de valor financiado; abaixo: bloco de FÓRMULA tipografado: `Valor Financiado = Valor do Imóvel − Entrada = R$870.000 − R$700.000 = R$170.000`.
  - Direita: KPI grande (R$170.000) + CARD-L "É sobre esse valor que incidem os juros mensalmente."
- Região C (largura total, fundo `--soft-bg`): CARD-L com explicação de por que o prazo e a taxa se aplicam sobre o financiado, não sobre o valor total do imóvel.

**Componentes:**  
- CARD-D: definição  
- FORMULA: equação tipografada  
- KPI: R$170.000  
- CARD-L × 2: insights pedagógicos  

**Critério de aceite:**  
- Fórmula legível em fonte mono.  
- 870.000 − 700.000 = 170.000 exibido corretamente.  
- Cabe em 824px.  

---

### Aba 1.4 — SAC × PRICE

**Objetivo:**  
Apresentar os dois sistemas de amortização de forma comparativa e acessível antes da simulação.

**Layout:**  
- Região A (topo, largura total): título "SAC × PRICE — Dois caminhos para amortizar o mesmo valor", fundo `--indigo`, texto branco.
- Região B (grid 2 colunas iguais):
  - Esquerda: CARD-D "SAC — Sistema de Amortização Constante": parcela decrescente / amortização fixa / juros sobre saldo restante / total pago menor.
  - Direita: CARD-D "PRICE — Sistema Francês de Amortização": parcela fixa / amortização crescente / juros constantes na parcela / previsibilidade.
- Região C (largura total): CARD-L comparativo: "Quando usar SAC — quando usar PRICE" em 2 colunas de bullets.
- Região D (largura total): ALERTA `--orange`: "Comparar SAC × PRICE de forma justa exige mesma taxa, mesmo prazo e mesmo principal. Taxas diferentes tornam a comparação inválida."

**Componentes:**  
- CARD-D × 2: SAC e PRICE  
- CARD-L: comparativo de uso  
- ALERTA: regra de base justa  

**Critério de aceite:**  
- Dois cards lado a lado sem quebrar layout.  
- Alerta de base justa visível.  
- Cabe em 824px.  

---

### Aba 1.5 — Cuidados

**Objetivo:**  
Alertar sobre os principais cuidados antes de contratar um financiamento imobiliário.

**Layout:**  
- Região A (topo, largura total): título "Cuidados — Antes de fechar qualquer contrato", fundo `--deep-blue`, texto branco.
- Região B (grid 2 × 2 = 4 cards de alerta):
  - Alerta 1: "Taxa nominal vs taxa efetiva — o CET pode ser muito maior que a taxa anunciada."
  - Alerta 2: "Custo Efetivo Total (CET) — exija o CET completo da proposta do banco."
  - Alerta 3: "Seguros obrigatórios (MIP/DFI) — são cobrados mensalmente e fazem parte do encargo."
  - Alerta 4: "Prazo longo = custo alto — 120 meses de encargos somam R$24.600 só em custos adicionais."
- Região C (largura total): CARD-D de encerramento: "Agora que você se preparou, vamos simular o seu financiamento." + CTA (botão secundário) "Ir para Simular".

**Componentes:**  
- ALERTA × 4: cuidados práticos  
- CARD-D: encerramento  
- CTA: transição para etapa 2  

**Critério de aceite:**  
- 4 alertas visíveis sem rolagem.  
- CTA legível e posicionado.  
- Cabe em 824px.  

---

## Etapa 2 — Simular

### Aba 2.1 — Dados do Imóvel

**Objetivo:**  
Capturar o valor do imóvel e da entrada; exibir o valor financiado derivado.

**Layout:**  
- Região A (topo, largura total): título "Dados do Imóvel", fundo `--navy`, texto branco.
- Região B (coluna centralizada max-width: 600px):
  - FORM: campo "Valor do imóvel" — prefixo R$ — valor default 870.000 — hint "Valor total de mercado ou avaliação do imóvel".
  - FORM: campo "Valor da entrada" — prefixo R$ — valor default 700.000 — hint "Valor que você já possui e não vai financiar".
  - KPI derivado em tempo real: "Valor financiado = R$170.000" — atualiza conforme os campos acima.
- Região C (largura total, fundo `--soft-bg`): CARD-L "Dica: bancos geralmente financiam até 80% do valor do imóvel. Com uma entrada maior você reduz os juros totais."

**Componentes:**  
- FORM × 2: campos de imóvel e entrada  
- KPI derivado: valor financiado em tempo real  
- CARD-L: hint pedagógico  

**Critério de aceite:**  
- Campos com altura 44px.  
- Valor financiado calculado em tempo real (imóvel − entrada).  
- Defaults carregados do cenário fixo.  
- Cabe em 824px.  

---

### Aba 2.2 — Condições

**Objetivo:**  
Capturar prazo em meses e taxa mensal de juros.

**Layout:**  
- Região A (topo, largura total): título "Condições do Financiamento", fundo `--deep-blue`, texto branco.
- Região B (grid 2 colunas max-width: 700px, centralizado):
  - Coluna esquerda: FORM campo "Prazo" — sufixo "meses" — valor default 120 — hint "Número total de parcelas mensais".
  - Coluna direita: FORM campo "Taxa mensal" — sufixo "% a.m." — valor default 0,85 — hint "Taxa nominal mensal de juros do financiamento".
- Região C (grid 2 colunas, abaixo dos campos):
  - Coluna esquerda: KPI "Taxa anual equivalente: 10,65% a.a." (calculada: (1,0085^12 − 1) × 100).
  - Coluna direita: CARD-L "Contexto: em maio/2026, taxas típicas para financiamento imobiliário variam entre 9% e 12% a.a. dependendo do banco e do perfil."

**Componentes:**  
- FORM × 2: prazo e taxa  
- KPI: taxa anual derivada  
- CARD-L: contexto de mercado  

**Critério de aceite:**  
- Defaults: 120 e 0,85.  
- Taxa anual calculada corretamente (~10,65% a.a.).  
- Cabe em 824px.  

---

### Aba 2.3 — Custos

**Objetivo:**  
Capturar os encargos mensais (seguros, taxa de administração).

**Layout:**  
- Região A (topo, largura total): título "Custos Adicionais", fundo `--navy`, texto branco.
- Região B (coluna centralizada max-width: 500px):
  - FORM campo "Encargos mensais" — prefixo R$ — valor default 205,00 — hint "Seguros (MIP + DFI) + taxa de administração mensal".
  - KPI derivado: "Total de encargos: R$24.600,00" (205 × 120, atualiza em tempo real).
- Região C (grid 2 colunas):
  - CARD-D: "O que são os encargos: MIP (seguro de morte/invalidez), DFI (seguro do imóvel), taxa de administração. Variam por banco e perfil do comprador."
  - ALERTA: "Atenção: os encargos mensais NÃO amortizam o saldo devedor. São custos puros do financiamento."

**Componentes:**  
- FORM: campo encargos  
- KPI derivado: total de encargos  
- CARD-D: definição dos encargos  
- ALERTA: encargos não amortizam  

**Critério de aceite:**  
- 205 × 120 = 24.600 calculado corretamente.  
- Alerta visível.  
- Cabe em 824px.  

---

### Aba 2.4 — Sistema

**Objetivo:**  
Selecionar o sistema de amortização para a simulação principal.

**Layout:**  
- Região A (topo, largura total): título "Sistema de Amortização", fundo `--indigo`, texto branco.
- Região B (grid 2 colunas):
  - Esquerda: grupo de seleção (radio visualmente estilizado como toggle cards):
    - Card "SAC" (selecionado por default, destacado em `--royal-blue`): "Amortização constante — parcelas decrescentes".
    - Card "PRICE": "Parcelas fixas — amortização crescente".
  - Direita: CARD-D dinâmico que mostra características do sistema selecionado (atualiza conforme seleção).
- Região C (largura total, fundo `--soft-bg`): CARD-L "Comparação automática: ao calcular, a plataforma sempre compara SAC × PRICE usando a mesma base de parâmetros — garantia de comparação justa."

**Componentes:**  
- FORM (toggle cards): seleção de sistema  
- CARD-D dinâmico: características do sistema selecionado  
- CARD-L: nota de comparação justa  

**Critério de aceite:**  
- SAC selecionado por default.  
- Conteúdo do CARD-D muda conforme seleção.  
- Nota de base justa visível.  
- Cabe em 824px.  

---

### Aba 2.5 — Resumo

**Objetivo:**  
Exibir o resumo completo dos parâmetros preenchidos e o CTA para calcular.

**Layout:**  
- Região A (topo, largura total): título "Resumo da Simulação", fundo `--navy`, texto branco.
- Região B (grid 2 colunas):
  - Esquerda (60%): CARD-D com todos os parâmetros em lista: Imóvel / Entrada / Financiado / Prazo / Taxa mensal / Encargos mensais / Sistema / Comparação.
  - Direita (40%): 3 KPIs principais (valor financiado / prazo / taxa) empilhados.
- Região C (largura total, centralizada): CTA Aurora Gradient Border: botão grande "Calcular — Ver Resultado", fundo gradiente `--violet` → `--royal-blue`, texto branco, Aurora Gradient Border animado, altura 56px.

**Componentes:**  
- CARD-D: resumo de parâmetros  
- KPI × 3: financiado, prazo, taxa  
- CTA-A: botão Calcular com Aurora  

**Critério de aceite:**  
- Todos os valores do cenário fixo visíveis.  
- CTA Aurora proeminente e visualmente impactante.  
- Cabe em 824px.  

---

## Etapa 3 — Resultado

### Aba 3.1 — Resumo

**Objetivo:**  
Exibir o resultado principal do cálculo SAC de forma impactante.

**Layout:**  
- Região A (topo, largura total): título "Resultado da Simulação SAC", fundo `--deep-blue`, texto branco.
- Região B (grid 3 colunas de KPIs):
  - KPI 1: "1ª Parcela SAC: R$2.866,67" (1.416,67 amort. + 1.445,00 juros + 205,00 encargos).
  - KPI 2: "Última Parcela SAC: R$1.633,72" (1.416,67 amort. + 12,03 juros + 205,00 encargos).
  - KPI 3: "Total Pago SAC: R$281.960,00" (170.000 + 87.360 juros + 24.600 encargos).
- Região C (largura total): CARD Aurora Gradient Border: "Você vai pagar R$87.360 em juros ao longo de 120 meses. Isso representa 51,4% do valor financiado de R$170.000." — fundo `--deep-blue`, texto branco, Aurora border.

**Componentes:**  
- KPI × 3: 1ª parcela, última parcela, total pago  
- CARD-A: síntese educacional com Aurora  

**Critério de aceite:**  
- Valores calculados corretamente para SAC 170.000 / 120 meses / 0,85%.  
- Card Aurora visível e não sobreposto.  
- Cabe em 824px.  

---

### Aba 3.2 — Cenário

**Objetivo:**  
Exibir os parâmetros do cenário simulado como referência.

**Layout:**  
- Região A (topo, largura total): título "Cenário Simulado", fundo `--navy`, texto branco.
- Região B (grid 2 × 2 = 4 cards):
  - CARD-D "Imóvel": valor do imóvel R$870.000 / entrada R$700.000 / financiado R$170.000.
  - CARD-D "Condições": prazo 120 meses / taxa 0,85% a.m. / sistema SAC.
  - CARD-D "Custos": encargos mensais R$205,00 / encargos totais R$24.600,00.
  - CARD-L "Quer alterar? Volte para a etapa Simular e ajuste os parâmetros."
- Região C (largura total, fundo `--soft-bg`): nota "Este é um cenário demonstrativo com valores fixos para fins educacionais."

**Componentes:**  
- CARD-D × 3: parâmetros do cenário  
- CARD-L: instrução de edição  

**Critério de aceite:**  
- Todos os parâmetros do cenário fixo visíveis.  
- Nota demonstrativa visível.  
- Cabe em 824px.  

---

### Aba 3.3 — Alertas

**Objetivo:**  
Exibir alertas financeiros contextuais sobre o resultado calculado.

**Layout:**  
- Região A (topo, largura total): título "Alertas Financeiros", fundo `--deep-blue`, texto branco.
- Região B (coluna única max-width: 720px, centralizada, 4 alertas):
  - ALERTA 1: "Custo de juros elevado: R$87.360 em juros ao longo de 120 meses representam 51,4% do valor financiado."
  - ALERTA 2: "Prazo longo: 10 anos de compromisso mensal. Considere sua estabilidade de renda no período."
  - ALERTA 3: "Primeira parcela maior no SAC: R$2.866,67 exige capacidade de pagamento inicial mais alta."
  - ALERTA 4: "Encargos adicionais: R$24.600 em encargos (seguros + administração) não amortizam o saldo devedor."

**Componentes:**  
- ALERTA × 4: alertas contextuais  

**Critério de aceite:**  
- 4 alertas visíveis sem rolagem.  
- Linguagem educacional, não alarmista.  
- Valores corretos.  
- Cabe em 824px.  

---

### Aba 3.4 — Interpretação

**Objetivo:**  
Interpretar pedagogicamente o resultado para o usuário.

**Layout:**  
- Região A (topo, largura total): título "Interpretando o Resultado", fundo `--indigo`, texto branco.
- Região B (grid 2 colunas, col-esq 60%, col-dir 40%):
  - Esquerda: CARD-L com interpretação em 3 parágrafos: (1) o que significa pagar R$87.360 de juros; (2) como o SAC reduz esse custo ao longo do tempo; (3) o que você pode fazer para pagar menos.
  - Direita: KPI "Juros = 51,4% do principal" + CARD-D "Em perspectiva: R$170.000 financiados custam R$257.360 entre principal + juros, mais R$24.600 de encargos."
- Região C (largura total): CARD-L com CTA textual: "Para entender como a parcela é composta, vá para a etapa Entender →"

**Componentes:**  
- CARD-L: interpretação pedagógica  
- KPI: relação juros/principal  
- CARD-D: perspectiva de custo total  
- CARD-L: CTA de transição  

**Critério de aceite:**  
- Texto legível e educacional.  
- KPI correto (87.360 / 170.000 = 51,4%).  
- Cabe em 824px.  

---

## Etapa 4 — Entender

### Aba 4.1 — Parcela

**Objetivo:**  
Explicar como é composta a parcela SAC na prática.

**Layout:**  
- Região A (topo, largura total): título "Composição da Parcela SAC", fundo `--navy`, texto branco.
- Região B (grid 2 colunas, col-esq 55%, col-dir 45%):
  - Esquerda: KPI × 3 empilhados: Amortização fixa R$1.416,67 / Juros 1ª parcela R$1.445,00 / Encargos R$205,00.
  - Direita: GRF pizza: 3 fatias (amortização azul / juros roxo / encargos dourado) para a 1ª parcela.
- Região C (largura total, fundo `--soft-bg`): CARD-D "No SAC: a amortização é sempre fixa (R$1.416,67). Os juros diminuem a cada mês porque o saldo devedor cai. Os encargos são fixos. Por isso a parcela total reduz mês a mês."

**Componentes:**  
- KPI × 3: componentes da parcela  
- GRF (pizza): composição visual  
- CARD-D: explicação da dinâmica  

**Critério de aceite:**  
- KPIs corretos: 1.416,67 / 1.445,00 / 205,00.  
- Soma = 3.066,67 (1ª parcela SAC com encargos).  
- Gráfico legível.  
- Cabe em 824px.  

---

### Aba 4.2 — Amortização

**Objetivo:**  
Explicar o conceito de amortização e seu valor fixo no SAC.

**Layout:**  
- Região A (topo): título "Amortização — Quanto você realmente quita por mês", fundo `--deep-blue`, texto branco.
- Região B (grid 2 colunas):
  - Esquerda: CARD-D "Amortização é a parcela do pagamento que reduz o saldo devedor. No SAC, é sempre constante." + FORMULA: `A = PV / n = R$170.000 / 120 = R$1.416,67/mês`.
  - Direita: KPI "Amortização SAC: R$1.416,67" + CARD-L "No PRICE: a amortização começa menor e cresce ao longo do tempo. A parcela total permanece fixa."
- Região C (largura total): CARD-L "Em 120 meses de SAC, você quitará exatamente R$170.000 em amortizações — R$1.416,67 por mês."

**Componentes:**  
- CARD-D: definição  
- FORMULA: tipografada  
- KPI: valor da amortização  
- CARD-L × 2: contraste com PRICE e síntese  

**Critério de aceite:**  
- Fórmula legível em fonte mono.  
- 170.000 / 120 = 1.416,67 correto.  
- Cabe em 824px.  

---

### Aba 4.3 — Juros

**Objetivo:**  
Explicar como os juros são calculados e como decrescem no SAC.

**Layout:**  
- Região A (topo): título "Juros — O custo do dinheiro no tempo", fundo `--purple`, texto branco.
- Região B (grid 2 colunas):
  - Esquerda: CARD-D "Juros no SAC são calculados sobre o saldo devedor do mês anterior." + FORMULA: `J(n) = SD(n-1) × i` + cálculo 1ª parcela: `J(1) = R$170.000 × 0,0085 = R$1.445,00`.
  - Direita: KPI "Juros 1ª parcela: R$1.445,00" + KPI "Juros última parcela: R$12,03" + ALERTA "Os juros representam 31,0% do total pago no SAC."
- Região C (largura total, fundo `--soft-bg`): CARD-L "Como os juros caem mês a mês no SAC: no mês 1, incide sobre R$170.000. No mês 120, incide sobre apenas R$1.416,67 (saldo restante). Cada amortização paga reduz o saldo e, consequentemente, os juros futuros."

**Componentes:**  
- CARD-D: explicação  
- FORMULA × 2: fórmula geral + exemplo  
- KPI × 2: juros 1ª e última parcela  
- ALERTA: percentual de juros no total  
- CARD-L: dinâmica de redução  

**Critério de aceite:**  
- 170.000 × 0,0085 = 1.445,00 correto.  
- Última parcela de juros: 1.416,67 × 0,0085 = 12,03 correto.  
- Cabe em 824px.  

---

### Aba 4.4 — Saldo Devedor

**Objetivo:**  
Mostrar como o saldo devedor evolui ao longo dos 120 meses no SAC.

**Layout:**  
- Região A (topo): título "Saldo Devedor — Sua dívida diminuindo com o tempo", fundo `--indigo`, texto branco.
- Região B (grid 2 colunas, col-esq 40%, col-dir 60%):
  - Esquerda: KPI "Saldo inicial: R$170.000" + KPI "Saldo mês 60: R$85.000" + KPI "Saldo final: R$0".
  - Direita: GRF linha: evolução do saldo SAC (azul) vs PRICE (violeta) de 0 a 120 meses. Escala Y: R$0 a R$170.000. Escala X: meses 0 a 120. Ponto de interseção marcado.
- Região C (largura total): CARD-L "SAC amortiza mais rápido: no mês 60 (metade do prazo), o saldo SAC é exatamente 50% do original (R$85.000). No PRICE, o saldo no mês 60 ainda é maior que 50% porque a amortização começa pequena."

**Componentes:**  
- KPI × 3: marcos do saldo (início, meio, fim)  
- GRF linha: SAC vs PRICE  
- CARD-L: interpretação  

**Critério de aceite:**  
- Gráfico com 2 séries claramente diferenciadas.  
- Saldo mês 60 SAC = 85.000 (exato, pois amortização é constante).  
- Legenda visível.  
- Cabe em 824px.  

---

### Aba 4.5 — SAC × PRICE

**Objetivo:**  
Comparar os dois sistemas de amortização em nível conceitual e numérico resumido na etapa Entender.

**Layout:**  
- Região A (topo): título "SAC × PRICE — Comparação Conceitual e Numérica", fundo `--navy`, texto branco.
- Região B (grid 2 colunas iguais):
  - CARD-D "SAC": amortização R$1.416,67/mês constante / 1ª parcela R$3.066,67 / última parcela R$1.633,72 / total SAC R$281.960.
  - CARD-D "PRICE": parcela fixa calculada / amortização crescente / total PRICE R$X (calculado com base justa).
- Região C (grid 2 KPIs, centralizado): KPI "Total SAC: R$281.960" + KPI "Total PRICE: R$XXX.XXX" (calculado).
- Região D (largura total): ALERTA "SAC é geralmente mais barato no total. Comparação usa base justa: mesmo principal, mesmo prazo, mesma taxa, mesmos encargos."

**Componentes:**  
- CARD-D × 2: SAC e PRICE  
- KPI × 2: totais comparados  
- ALERTA: base justa  

**Critério de aceite:**  
- Totais calculados na mesma base.  
- Alerta de base justa visível.  
- Cabe em 824px.  

---

## Etapa 5 — Comparar

### Aba 5.1 — Resumo Comparativo

**Objetivo:**  
Exibir a comparação SAC × PRICE de forma sintética e visualmente impactante.

**Layout:**  
- Região A (topo): título "SAC × PRICE — Qual é mais barato?", fundo `--deep-blue`, texto branco.
- Região B (grid 2 colunas):
  - CARD-D "SAC": total pago / juros totais / 1ª parcela / última parcela.
  - CARD-D "PRICE": total pago / juros totais / parcela fixa.
- Região C (largura total): CARD Aurora Gradient Border "Vencedor: SAC — Economia de R$X sobre o PRICE. Base: mesmo principal, mesmo prazo, mesma taxa, mesmos encargos." Fundo `--deep-blue`, Aurora border animado.
- Região D: KPI "Economia SAC vs PRICE: R$X".

**Componentes:**  
- CARD-D × 2: SAC e PRICE  
- CARD-A: vencedor com Aurora  
- KPI: economia  

**Critério de aceite:**  
- Base justa confirmada textualmente.  
- Card Aurora presente.  
- Economia calculada corretamente.  
- Cabe em 824px.  

---

### Aba 5.2 — Tabela SAC

**Objetivo:**  
Exibir a tabela completa de amortização SAC com paginação (120 parcelas).

**Layout:**  
- Região A (topo): título "Tabela SAC — 120 Parcelas", fundo `--navy`, texto branco.
- Região B (largura total): tabela paginada com 8 linhas visíveis por página.
- Região C (largura total, fundo `--soft-bg`): paginador "< Página 1 de 15 >".

**Componentes:**  
- TBL: tabela SAC paginada (120 linhas / 8 por página = 15 páginas)  
- Paginador  

**Critério de aceite:**  
- 7 colunas obrigatórias presentes.  
- Cabeçalho navy/branco.  
- Rodapé com totais navy.  
- Máx. 8 linhas visíveis.  
- Sem scroll vertical.  
- Cabe em 824px.  

---

### Aba 5.3 — Tabela PRICE

**Objetivo:**  
Exibir a tabela completa de amortização PRICE com paginação — mesma base do SAC.

**Layout:**  
- Idêntico à aba 5.2, trocando "SAC" por "PRICE" no título e nos valores.

**Componentes:**  
- TBL: tabela PRICE paginada  
- Paginador  

**Critério de aceite:**  
- Mesmos parâmetros da tabela SAC (base justa).  
- Cabeçalho com cor diferenciada para indicar sistema PRICE (violeta no lugar de navy, ou manter navy com subtitle PRICE).  
- Cabe em 824px.  

---

### Aba 5.4 — Gráfico

**Objetivo:**  
Visualizar graficamente as diferenças SAC × PRICE.

**Layout:**  
- Região A (topo): título "Comparação Visual SAC × PRICE", fundo `--indigo`, texto branco.
- Região B (largura total, altura max 280px): GRF barras agrupadas com 3 grupos: (1) Total Pago SAC vs PRICE / (2) Juros Totais SAC vs PRICE / (3) Encargos SAC vs PRICE. Legenda: SAC = azul royal / PRICE = violeta.
- Região C (largura total, fundo `--soft-bg`): CARD-L interpretação "O gráfico confirma: SAC tem custo total de juros menor. Os encargos são idênticos nos dois sistemas — porque usamos a mesma base. A diferença está nos juros."

**Componentes:**  
- GRF: barras agrupadas  
- CARD-L: interpretação pedagógica  

**Critério de aceite:**  
- 3 grupos de barras presentes.  
- Encargos iguais nos dois sistemas.  
- Legenda visível.  
- Interpretação presente.  
- Cabe em 824px.  

---

### Aba 5.5 — Leitura Pedagógica

**Objetivo:**  
Ensinar o usuário a interpretar a comparação SAC × PRICE e fazer a escolha certa.

**Layout:**  
- Região A (topo): título "Como Interpretar a Comparação", fundo `--navy`, texto branco.
- Região B (coluna max-width: 720px, centralizada):
  - CARD-L "Quando SAC é melhor": custo total menor / amortiza mais rápido / recomendado se você pode pagar a parcela inicial maior.
  - CARD-L "Quando PRICE pode ser preferível": parcela fixa facilita planejamento de fluxo de caixa / parcela inicial menor no início / usado quando a renda inicial é mais restrita.
  - CARD-L "Fatores que afetam a decisão": estabilidade de renda / prazo de permanência no imóvel / capacidade de pagamento inicial / taxa de juros negociada.
- Região C (largura total): CTA "Conferir os cálculos →" (botão secundário).

**Componentes:**  
- CARD-L × 3: lições pedagógicas  
- CTA: transição para Conferir  

**Critério de aceite:**  
- 3 cards pedagógicos sem rolagem.  
- Linguagem acessível.  
- Cabe em 824px.  

---

## Etapa 6 — Conferir

### Aba 6.1 — Fórmulas SAC

**Objetivo:**  
Exibir as fórmulas matemáticas do SAC de forma auditável com exemplos do cenário.

**Layout:**  
- Região A (topo): título "Fórmulas SAC — Transparência Matemática", fundo `--navy`, texto branco.
- Região B (grid 2 colunas):
  - Esquerda: 4 FORMULA blocks tipografados em fonte mono:
    1. `A = PV / n` (amortização constante)
    2. `J(k) = SD(k-1) × i` (juros do período k)
    3. `Parcela(k) = A + J(k) + E` (parcela total)
    4. `SD(k) = SD(k-1) − A` (saldo devedor)
  - Direita: CARD-D "Exemplo — Parcela 1": A = 1.416,67 / J(1) = 170.000 × 0,0085 = 1.445,00 / Parcela(1) = 1.416,67 + 1.445,00 + 205,00 = 3.066,67 / SD(1) = 170.000 − 1.416,67 = 168.583,33.

**Componentes:**  
- FORMULA × 4: fórmulas SAC  
- CARD-D: demonstração com valores reais  

**Critério de aceite:**  
- 4 fórmulas legíveis em fonte mono.  
- Cálculo demonstrado com valores corretos.  
- Cabe em 824px.  

---

### Aba 6.2 — Fórmulas PRICE

**Objetivo:**  
Exibir as fórmulas do Sistema PRICE (HP) de forma auditável.

**Layout:**  
- Região A (topo): título "Fórmulas PRICE — Sistema Francês", fundo `--deep-blue`, texto branco.
- Região B (grid 2 colunas):
  - Esquerda: 3 FORMULA blocks:
    1. `PMT = PV × [i × (1+i)^n] / [(1+i)^n − 1]` (parcela fixa PRICE)
    2. `J(k) = SD(k-1) × i` (juros do período k)
    3. `A(k) = PMT − J(k)` (amortização crescente)
  - Direita: CARD-D "Exemplo — Parcela 1 PRICE": PMT = 170.000 × [0,0085 × (1,0085)^120] / [(1,0085)^120 − 1] = R$X / J(1) = 170.000 × 0,0085 = 1.445,00 / A(1) = PMT − 1.445,00.

**Componentes:**  
- FORMULA × 3: fórmulas PRICE  
- CARD-D: demonstração com valores reais  

**Critério de aceite:**  
- Fórmula PMT legível.  
- Cálculo demonstrado.  
- Cabe em 824px.  

---

### Aba 6.3 — Variáveis

**Objetivo:**  
Listar todas as variáveis usadas nas fórmulas com seus valores no cenário.

**Layout:**  
- Região A (topo): título "Glossário de Variáveis", fundo `--indigo`, texto branco.
- Região B (largura total): TBL simples (3 colunas: Símbolo / Descrição / Valor no Cenário), não paginada (cabe em 1 tela com ~10–12 linhas).

**Componentes:**  
- TBL: tabela de variáveis (não paginada)  

**Variáveis obrigatórias:**  
PV = 170.000 / i = 0,0085 / n = 120 / E = 205,00 / A = 1.416,67 / J(1) = 1.445,00 / SD(0) = 170.000 / SD(60) = 85.000 / SD(120) = 0 / PMT (PRICE) = calculado / Total SAC = calculado / Total PRICE = calculado.

**Critério de aceite:**  
- Todos os símbolos listados.  
- Valores corretos.  
- Tabela cabe sem paginação em 824px.  

---

### Aba 6.4 — Passo a Passo

**Objetivo:**  
Demonstrar o cálculo passo a passo para a parcela 1 e a parcela 60 no SAC.

**Layout:**  
- Região A (topo): título "Passo a Passo — Calculando na Mão", fundo `--navy`, texto branco.
- Região B (grid 2 colunas):
  - Esquerda: CARD-D "Parcela 1 — SAC" com 5 passos numerados com FORMULA inline em cada passo.
  - Direita: CARD-D "Parcela 60 — SAC" com 5 passos numerados com FORMULA inline.

**Componentes:**  
- CARD-D × 2: passo a passo parcela 1 e parcela 60  

**Critério de aceite:**  
- 5 passos em cada card.  
- Fórmulas inline legíveis.  
- Valores corretos.  
- Cabe em 824px.  

---

### Aba 6.5 — Auditoria

**Objetivo:**  
Confirmar a consistência dos cálculos através de verificações auditáveis.

**Layout:**  
- Região A (topo): título "Auditoria dos Cálculos", fundo `--green`, texto branco.
- Região B (coluna max-width: 700px, centralizada): CHECKLIST de verificações com status visual (✓ ou ✗):
  1. Soma das 120 amortizações SAC = R$170.000,00 ✓
  2. Saldo devedor no mês 120 = R$0,00 ✓
  3. Total de encargos = 205 × 120 = R$24.600,00 ✓
  4. Comparação SAC × PRICE usa mesma taxa (0,85%), mesmo prazo (120), mesmo principal (170.000) ✓
  5. Primeira parcela SAC = amortização + juros + encargos = 1.416,67 + 1.445,00 + 205,00 = 3.066,67 ✓
  6. Juros 1ª parcela SAC = 170.000 × 0,0085 = 1.445,00 ✓
- Região C (largura total): CARD-L "Todos os cálculos conferidos. A especificação usa os valores corretos do cenário demonstrativo."

**Componentes:**  
- CHECKLIST: verificações com status  
- CARD-L: conclusão  

**Critério de aceite:**  
- 6 verificações presentes.  
- Linguagem auditável.  
- Cabe em 824px.  

---

## Etapa 7 — Decidir

### Aba 7.1 — Diagnóstico

**Objetivo:**  
Apresentar um diagnóstico educacional sobre o custo e a viabilidade do financiamento.

**Layout:**  
- Região A (topo): título "Diagnóstico Financeiro", fundo `--deep-blue`, texto branco.
- Região B (grid 2 colunas, col-esq 60%, col-dir 40%):
  - Esquerda: CARD-D com diagnóstico em 3 parágrafos: custo total real / comprometimento de renda típico / tempo de compromisso.
  - Direita: KPI "Total pago: R$281.960" + KPI "Total de juros: R$87.360" + KPI "Juros / Principal: 51,4%".
- Região C (largura total): ALERTA "Comprometimento de renda: para uma renda mensal de R$10.000, a 1ª parcela SAC (R$3.066,67) representaria 30,7% da renda. O limite recomendado é 30%."

**Componentes:**  
- CARD-D: diagnóstico  
- KPI × 3: custo total  
- ALERTA: comprometimento de renda  

**Critério de aceite:**  
- KPIs com valores corretos.  
- Diagnóstico educacional e não alarmista.  
- Cabe em 824px.  

---

### Aba 7.2 — Checklist

**Objetivo:**  
Ajudar o usuário a verificar se está pronto para contratar.

**Layout:**  
- Região A (topo): título "Checklist Pré-Contratação", fundo `--navy`, texto branco.
- Região B (coluna max-width: 650px, centralizada): CHECKLIST interativo com 8 itens:
  1. Tenho entrada suficiente (mínimo 20% do imóvel)?
  2. Avaliei o CET da proposta do banco?
  3. Comparei propostas de pelo menos 3 bancos diferentes?
  4. Tenho reserva de emergência de 6 meses após pagar a entrada?
  5. Minha renda é estável o suficiente para 120 parcelas?
  6. A parcela inicial cabe em menos de 30% da minha renda?
  7. Entendi os encargos mensais (seguros + administração)?
  8. Já calculei os custos de transação (ITBI, cartório, escritura)?

**Componentes:**  
- CHECKLIST: 8 itens interativos  

**Critério de aceite:**  
- 8 itens visíveis sem rolagem.  
- Itens práticos e relevantes.  
- Cabe em 824px.  

---

### Aba 7.3 — Próximos Passos

**Objetivo:**  
Orientar o usuário sobre os próximos passos concretos.

**Layout:**  
- Região A (topo): título "Próximos Passos Concretos", fundo `--teal`, texto branco.
- Região B (grid 2 × 2 = 4 cards):
  - CARD-L "1. Simule em diferentes bancos": compare propostas com as mesmas condições demonstradas aqui.
  - CARD-L "2. Peça a proposta formal (FGTS/CET)": exija o CET completo e compare com atenção.
  - CARD-L "3. Analise os custos de transação": ITBI, cartório, escritura e registro podem custar de 3% a 5% do valor do imóvel.
  - CARD-L "4. Revise com um especialista": advogado imobiliário ou assessor financeiro independente antes de assinar.

**Componentes:**  
- CARD-L × 4: próximos passos  

**Critério de aceite:**  
- 4 cards visíveis sem rolagem.  
- Texto acionável e concreto.  
- Cabe em 824px.  

---

### Aba 7.4 — Cuidados

**Objetivo:**  
Reforçar cuidados específicos da fase de contratação.

**Layout:**  
- Região A (topo): título "Cuidados na Contratação", fundo `--orange`, texto branco.
- Região B (grid 2 × 2 = 4 alertas):
  - ALERTA 1: "Leia o contrato completo: verifique cláusula de reajuste e correção monetária."
  - ALERTA 2: "ITBI e cartório: custos de até 5% do valor do imóvel, pagos à vista no ato da escritura."
  - ALERTA 3: "Seguro obrigatório: o MIP e o DFI são exigidos por lei e fazem parte do CET."
  - ALERTA 4: "Portabilidade: você pode levar seu financiamento para outro banco se encontrar taxa menor."

**Componentes:**  
- ALERTA × 4: cuidados de contratação  

**Critério de aceite:**  
- 4 alertas visíveis sem rolagem.  
- Linguagem educacional.  
- Cabe em 824px.  

---

### Aba 7.5 — Conclusão

**Objetivo:**  
Encerrar a jornada com empoderamento e CTAs finais.

**Layout:**  
- Região A (topo): título "Parabéns — Jornada Concluída", fundo `--navy`, texto branco.
- Região B (coluna centralizada max-width: 700px):
  - CARD Aurora Gradient Border: "Você completou a jornada de simulação de financiamento imobiliário. Agora você sabe calcular, interpretar e comparar SAC × PRICE com base justa." Fundo `--deep-blue`, Aurora border.
  - CARD-L "O que você aprendeu": lista de 6 itens — o que é financiamento / como funciona o SAC / como funciona o PRICE / como comparar os dois / como auditar os cálculos / como decidir com segurança.
- Região C (largura total): 2 CTAs: (1) CTA primário "Simular novamente" / (2) CTA secundário "Explorar outros módulos".

**Componentes:**  
- CARD-A: conclusão com Aurora  
- CARD-L: aprendizados  
- CTA × 2: reiniciar e explorar  

**Critério de aceite:**  
- Card Aurora presente e visualmente impactante.  
- Lista de aprendizados com mínimo 6 itens.  
- 2 CTAs visíveis.  
- Cabe em 824px.  

---

*Total: 35 telas (7 etapas × 5 abas em média). Cada tela tem objetivo, layout, componentes e critério de aceite próprios. A IA implementadora não tem liberdade para reorganizar, omitir ou substituir nenhuma tela sem aprovação explícita do PO.*
