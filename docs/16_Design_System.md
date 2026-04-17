# DOCUMENTO 16 — DESIGN SYSTEM E WIREFRAMES OPERACIONAIS
## Plataforma Educacional Financeira Completa

**Nome provisório do produto:** Plataforma Educacional Financeira
**Versão do documento:** 1.0
**Tipo de documento:** Design System e Wireframes Operacionais
**Status:** Base operacional de interface
**Objetivo do documento:** transformar as diretrizes de UX/UI em especificação operacional de layout, componentes, tokens, comportamento visual e wireframes textuais.

---

## 1. Finalidade do documento

Este documento operacionaliza o Documento 07.

Ele define:
- tokens principais;
- grid e espaçamentos;
- componentes com comportamento mínimo;
- variantes;
- estados;
- wireframes textuais por tela;
- regras de responsividade.

---

## 2. Tokens oficiais

### 2.1 Cores semânticas
- Primária: azul institucional
- Sucesso: verde
- Atenção: amarelo
- Risco: vermelho
- Informação: azul-claro
- Neutros: escala de cinza

### 2.2 Espaçamentos
Escala recomendada:
- 4
- 8
- 12
- 16
- 24
- 32
- 40
- 48

### 2.3 Raios
- `sm`: 6px
- `md`: 10px
- `lg`: 16px
- `xl`: 24px

### 2.4 Sombras
- leve para cards padrão
- média para blocos prioritários
- evitar sombras pesadas

---

## 3. Grid e layout

### Desktop
- sidebar fixa à esquerda
- header superior
- conteúdo central com largura confortável
- área opcional de apoio contextual em telas largas

### Tablet
- sidebar recolhível
- conteúdo principal em coluna central
- componentes lado a lado apenas quando couberem bem

### Mobile
- menu recolhível
- coluna única
- cards empilhados
- tabelas com scroll horizontal controlado

---

## 4. Componentes oficiais mínimos

### 4.1 `Sidebar`
Props mínimas:
- items
- activeItem
- collapsed

Estados:
- expandida
- recolhida
- mobile aberta/fechada

### 4.2 `Header`
Props mínimas:
- title
- subtitle
- actions

### 4.3 `ModuleHeader`
Exibe:
- nome do módulo
- descrição curta
- objetivo de aprendizagem

### 4.4 `FinancialForm`
Estrutura:
- grupos de campos
- labels claros
- ajuda contextual opcional
- ação primária
- ação secundária

### 4.5 `SummaryCard`
Props mínimas:
- title
- value
- subtitle
- tone

### 4.6 `AlertBanner`
Props mínimas:
- level
- title opcional
- message

Níveis:
- info
- success
- warning
- danger

### 4.7 `DataTable`
Deve suportar:
- cabeçalhos
- linhas
- rolagem horizontal
- estado vazio

### 4.8 `ComparisonChart`
Deve suportar:
- uma ou mais séries
- legenda
- tooltip
- título

### 4.9 `EducationPanel`
Deve suportar:
- introdução
- explicação
- dica
- link relacionado
- FAQ relacionada

### 4.10 `ExportButton`
Deve suportar:
- PDF
- Excel
- estado carregando

---

## 5. Padrão de formulário

### Blocos recomendados
- bloco de contexto
- grupo de dados principais
- grupo de parâmetros
- grupo de contexto de renda/custos
- ações

### Regras
- labels sempre visíveis
- placeholder apenas complementar
- taxa com periodicidade explícita
- moeda sem formatação rígida no input, mas com contexto claro

---

## 6. Wireframe operacional da página inicial

## Estrutura
1. Header global
2. Hero curto com proposta da plataforma
3. Bloco “por onde começar”
4. Cards de acesso rápido
5. Bloco de módulos principais
6. Bloco de educação financeira
7. Rodapé simples

---

## 7. Wireframe operacional do módulo padrão

## Estrutura
1. `ModuleHeader`
2. `EducationPanel` introdutório
3. `FinancialForm`
4. botão `Simular`
5. linha de `SummaryCard`
6. gráfico principal
7. tabela detalhada
8. `AlertBanner`
9. `EducationPanel` interpretativo
10. FAQ relacionada

---

## 8. Wireframe — Diagnóstico

### Bloco de entrada
- renda mensal
- despesas fixas
- despesas variáveis
- dívidas mensais
- valor guardado

### Bloco de resultado
- saldo mensal
- comprometimento da renda
- capacidade de poupança
- reserva sugerida
- gráfico renda x despesas
- classificação
- alertas e interpretação

---

## 9. Wireframe — Juros

### Bloco de entrada
- valor inicial
- taxa
- periodicidade
- prazo
- aporte opcional

### Bloco de resultado
- cards lado a lado:
  - valor final simples
  - valor final composto
  - diferença
- gráfico comparativo
- tabela temporal
- explicação do conceito

---

## 10. Wireframe — Amortização / Financiamentos

### Bloco de entrada
- principal / valor do bem
- entrada quando aplicável
- taxa
- prazo
- sistema de amortização
- renda mensal

### Bloco de resultado
- valor financiado
- parcela inicial
- parcela final
- total pago
- total de juros
- comprometimento
- gráfico saldo devedor
- tabela de parcelas
- bloco educativo

---

## 11. Wireframe — Rotativo

### Bloco de entrada
- valor da fatura
- valor pago
- taxa do rotativo
- meses
- encargos adicionais

### Bloco de resultado
- saldo remanescente
- crescimento projetado
- comparação entre cenários
- alerta de risco
- explicação do rotativo

---

## 12. Wireframe — Parcela em Atraso

### Bloco de entrada
- valor original
- vencimento
- pagamento ou dias em atraso
- multa
- mora
- correção

### Bloco de resultado
- multa
- mora
- correção
- total atualizado
- memória de cálculo
- tabela de atraso padrão
- observação jurídica/educacional

---

## 13. Regras de responsividade operacional

### Desktop
- cards podem ficar em grid 3 ou 4 colunas
- gráfico e tabela podem coexistir em blocos distintos

### Tablet
- cards em 2 colunas
- tabela abaixo do gráfico

### Mobile
- cards em 1 coluna
- formulário em 1 coluna
- gráficos redimensionados
- tabela com rolagem

---

## 14. Acessibilidade mínima operacional
- contraste AA
- foco visível
- labels e `aria-label` quando necessário
- não depender só de cor
- cabeçalhos semânticos por nível

---

## 15. Critérios de aceite
Este documento estará aceito quando:
- frontend puder implementá-lo sem ambiguidade relevante;
- componentes-base estiverem claramente definidos;
- layout e wireframes estiverem suficientes para execução.
