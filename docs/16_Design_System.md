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

### Sprint 4.5/F2 — Contrato oficial de UI Components

A partir da Sprint 4.5/F2, este documento passa a ser complementado por
três documentos normativos em `docs/ui/`:

- `docs/ui/CONTRATO_UI_COMPONENTS.md`;
- `docs/ui/POLITICA_TABELAS_FINANCEIRAS.md`;
- `docs/ui/POLITICA_MODAIS_ABAS.md`.

Esses documentos formalizam o contrato visual e estrutural que deve orientar
novas implementações e refatorações de interface. O inventário da F1 permanece
como evidência do estado encontrado; a F2 define o padrão desejado para avanço
da Sprint 4.5.

Decisões oficiais da F2:
- os tokens canônicos continuam em `frontend/src/styles/tokens.ts` e
  `frontend/src/styles/tokens.css`;
- variáveis locais do cockpit podem existir apenas como camada temporária de
  compatibilidade e não devem virar nova fonte normativa;
- `FinancialCockpitShell` é a concha funcional ativa dos módulos financeiros;
- `ShellLayout`, `Header`, `Sidebar` e `NavItem` permanecem como legado ou
  candidatos a adaptação, não como padrão obrigatório de novas telas;
- tabelas financeiras devem seguir contrato visual comum, sem impor ainda um
  componente único universal;
- decisões de abstração entre `FinancialTable` único, componentes por domínio
  ou abordagem híbrida ficam formalmente atribuídas à F3, com base no inventário
  da F1 e nas políticas da F2.

### Sprint 4.5/F3 — Componentes-base materializados

A F3 implementa correções estruturais mínimas autorizadas pelo contrato:

- o painel educativo do cockpit passa a se chamar `CockpitEducationPanel`;
- `EducationPanel` permanece como componente base fora do cockpit;
- `FinancialCockpitShell` passa a obter módulos visíveis por
  `getCockpitVisibleModules`;
- a propriedade `visibleInCockpit` em `MODULES` substitui o array local
  `VISIBLE_MODULE_IDS` da shell;
- `CockpitButton` passa a expor estado ocupado por `aria-busy`;
- `CockpitField` passa a aceitar erro acessível com `aria-invalid` e
  `aria-describedby`.

Essas mudanças não alteram tokens, layout financeiro, tabelas financeiras,
cálculos, endpoints ou regras de negócio. A aplicação ampla da política de
tabelas permanece fora da F3.

### Sprint 4.5/F4 — Tabelas financeiras responsivas

A F4 formaliza o padrao de apresentacao das tabelas financeiras no design
system operacional:

- tabelas de desktop devem priorizar leitura vertical, cabecalho fixo e valores
  tabulares;
- tabelas largas em mobile devem ter representacao propria por cards ou detalhe
  equivalente;
- `FinanciamentoTable` passa a combinar tabela desktop com cards mobile por
  parcela;
- `FinanciamentoCompareSummary` passa a usar cards comparativos em vez de
  tabela larga;
- tabelas cockpit usam `caption`, `scope` e identificador de linha.

Essa materializacao preserva todas as linhas recebidas e nao altera calculos,
servicos, endpoints ou contratos de API.

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
- tabelas adaptadas; rolagem horizontal apenas como fallback justificado

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

Campos cockpit devem aceitar erro acessível sem quebrar a API existente:
`CockpitField` usa `error`, `aria-invalid` e `aria-describedby` quando há
mensagem de validação. Botões de envio cockpit devem indicar estado ocupado
com `aria-busy`.

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
- rolagem vertical para séries longas
- adaptação responsiva sem rolagem horizontal como experiência principal
- estado vazio

Para tabelas financeiras, a referência obrigatória é
`docs/ui/POLITICA_TABELAS_FINANCEIRAS.md`.

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

No cockpit financeiro, o painel equivalente deve usar o nome
`CockpitEducationPanel` para evitar ambiguidade semântica com o componente base.

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
- tabela adaptada; rolagem horizontal somente como exceção temporária

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

---

## 16. Sprint 4.5 F5 — Auditor de Interface Advisory

A F5 adiciona o `auditor_de_interface` como verificador estático em modo
advisory para proteger as decisões visuais materializadas na Sprint 4.5.

O auditor observa:

- tabelas financeiras sem rolagem horizontal como experiência principal;
- preservação de linhas financeiras sem cortes artificiais;
- caption, escopos de cabeçalho e numerais tabulares em tabelas;
- sticky header restrito ao cabeçalho da tabela do cockpit;
- `visibleInCockpit` e `getCockpitVisibleModules` como fonte da topbar;
- separação semântica entre `EducationPanel` base e `CockpitEducationPanel`;
- modais e abas como apoio contextual, não navegação principal.

O auditor não substitui revisão visual, screenshots, browser, validação por
pixel ou decisão formal de Moisés/Camaleão. Enquanto estiver em modo advisory,
alertas não bloqueiam a Sprint 4.5 por exit code, mas precisam ser justificados
e rastreados quando permanecerem.

---

## 17. Sprint 4.5 F6 — Fechamento visual formal

A F6 fecha a Sprint 4.5 como governança visual aprovada com pendências
replanejadas. O fechamento não altera componentes, CSS, hooks ou lógica de
aplicação.

Status formal:

- contrato oficial de UI Components materializado;
- política de tabelas financeiras materializada nas tabelas prioritárias;
- `auditor_de_interface` mantido em modo advisory;
- FE-058 replanejada;
- FE-059 replanejada;
- Sprint 5 não iniciada nesta fatia.
