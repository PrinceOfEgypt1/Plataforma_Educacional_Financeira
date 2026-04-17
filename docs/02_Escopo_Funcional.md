# DOCUMENTO 02 — ESCOPO FUNCIONAL
## Plataforma Educacional Financeira Completa

**Versão:** 1.0
**Tipo:** Escopo Funcional
**Status:** Base oficial de funcionalidades

## 1. Finalidade
Traduzir a visão do produto em uma estrutura funcional concreta, definindo:
- o que a plataforma deve fazer;
- módulos;
- funcionalidades obrigatórias;
- entradas e saídas;
- dependências entre módulos;
- o que entra no MVP;
- o que fica para depois.

## 2. Escopo funcional geral
A plataforma deverá funcionar como um ambiente web de **aprendizado financeiro interativo**, organizado em módulos independentes, porém integrados por uma experiência única de navegação.

Ela deverá permitir ao usuário:
- informar dados financeiros;
- executar simulações;
- comparar cenários;
- visualizar tabelas e gráficos;
- receber alertas interpretativos;
- compreender os conceitos por trás dos cálculos;
- consultar conteúdos educativos.

## 3. Estrutura funcional macro
Módulos principais:
1. Diagnóstico Financeiro Pessoal
2. Juros Simples e Compostos
3. Sistemas de Amortização — PRICE e SAC
4. Financiamento Imobiliário
5. Financiamento de Veículo
6. Empréstimo Consignado
7. Crédito Pessoal / CDC
8. Cartão de Crédito e Crédito Rotativo
9. Parcela em Atraso
10. Indicadores Financeiros
11. Investir ou Quitar Dívida
12. Aprendizado Guiado e Conteúdo Educacional

## 4. Requisitos funcionais transversais
- entrada de dados validada;
- simulação;
- comparação;
- visualização por cards, tabelas, gráficos, alertas e textos;
- educação contextual;
- alertas automáticos;
- exportação futura;
- reaproveitamento opcional de dados entre módulos.

## 5. Detalhamento dos módulos

### Módulo 01 — Diagnóstico Financeiro Pessoal
**Objetivo:** visualizar condição financeira básica.
**Entradas:** renda, despesas fixas, despesas variáveis, dívidas, valor guardado, meta.
**Saídas:** saldo mensal, comprometimento, capacidade de poupança, reserva sugerida, status financeiro.
**Exibição:** cards, gráfico, texto explicativo e alertas.
**Prioridade:** MVP obrigatório.

### Módulo 02 — Juros Simples e Compostos
**Objetivo:** comparar os dois regimes de juros.
**Entradas:** valor inicial, taxa, periodicidade, prazo, aporte opcional.
**Saídas:** valor final em cada regime, diferença acumulada, tabela de evolução, gráfico comparativo, interpretação.
**Prioridade:** MVP obrigatório.

### Módulo 03 — Sistemas de Amortização (PRICE e SAC)
**Objetivo:** comparar sistemas de amortização.
**Entradas:** valor financiado, taxa, periodicidade, prazo.
**Saídas:** tabelas PRICE e SAC, total pago, total de juros, comparação e gráficos.
**Prioridade:** MVP obrigatório.

### Módulo 04 — Financiamento Imobiliário
**Objetivo:** simular financiamento de imóvel.
**Entradas:** valor do imóvel, entrada, prazo, taxa, tipo de taxa, sistema, renda mensal, custos adicionais.
**Saídas:** valor financiado, parcela inicial/final, total pago, juros, percentual excedente, equivalência em imóveis, comprometimento de renda, alertas.
**Prioridade:** MVP obrigatório.

### Módulo 05 — Financiamento de Veículo
**Objetivo:** simular compra financiada de veículo.
**Entradas:** valor do veículo, entrada, prazo, taxa mensal, renda mensal, custos adicionais.
**Saídas:** valor financiado, parcela, total pago, juros, comprometimento de renda.
**Prioridade:** MVP obrigatório.

### Módulo 06 — Empréstimo Consignado
**Objetivo:** simular consignado com verificação de margem.
**Entradas:** valor solicitado, salário líquido, taxa mensal, prazo, CET opcional.
**Saídas:** parcela, total pago, juros, margem comprometida, status da margem, custo com e sem CET.
**Prioridade:** MVP obrigatório.

### Módulo 07 — Crédito Pessoal / CDC
**Objetivo:** simular CDC e destacar custo efetivo.
**Entradas:** valor solicitado, taxa mensal, prazo, CET, renda mensal, tarifas opcionais.
**Saídas:** parcela, total pago, juros, custo com CET, comprometimento da renda, alertas de alto custo.
**Prioridade:** MVP obrigatório.

### Módulo 08 — Cartão de Crédito e Crédito Rotativo
**Objetivo:** mostrar o efeito do pagamento parcial da fatura.
**Entradas:** valor da fatura, valor pago, taxa do rotativo, meses em aberto, multa e encargos opcionais.
**Saídas:** saldo remanescente, custo acumulado, projeção da dívida, cenários comparativos, alertas.
**Prioridade:** MVP obrigatório.

### Módulo 09 — Parcela em Atraso
**Objetivo:** simular impacto financeiro do atraso.
**Entradas:** valor original, vencimento, pagamento ou dias em atraso, multa, juros de mora, correção opcional.
**Saídas:** multa, juros, correção, valor atualizado, tabela comparativa por faixa de atraso.
**Prioridade:** MVP obrigatório.

### Módulo 10 — Indicadores Financeiros
**Objetivo:** explicar indicadores que afetam crédito e investimento.
**Escopo inicial:** CET, IOF, TR, Selic, IPCA e taxa real aproximada.
**Saídas:** conceito, impacto prático, exemplo numérico e relação com módulos.
**Prioridade:** MVP obrigatório em versão inicial simplificada.

### Módulo 11 — Investir ou Quitar Dívida
**Objetivo:** comparar quitação versus investimento.
**Entradas:** saldo da dívida, taxa da dívida, prazo restante, valor disponível mensal, taxa estimada de investimento, perfil de cenário.
**Saídas:** cenário quitar, investir e híbrido; custo total; retorno estimado; interpretação comparativa.
**Prioridade:** pós-MVP prioritário.

### Módulo 12 — Aprendizado Guiado e Conteúdo Educacional
**Objetivo:** garantir aprendizado efetivo.
**Componentes:** glossário, explicações por módulo, FAQ, exemplos, “você sabia?”, painéis de ajuda, quizzes futuros.
**Prioridade:** MVP obrigatório em versão inicial essencial.

## 6. Funcionalidades globais
- navegação por menu;
- painel inicial;
- reutilização de informações;
- alertas padronizados;
- interpretação textual;
- exportação de resultados;
- histórico futuro.

## 7. Dependências funcionais
- Juros e Amortização fundamentam financiamentos;
- Diagnóstico melhora interpretação dos módulos de crédito;
- Indicadores contextualizam financiamentos e dívidas;
- Conteúdo educacional atravessa todos os módulos.

## 8. MVP oficial
### Módulos obrigatórios no MVP
- Diagnóstico Financeiro
- Juros Simples e Compostos
- PRICE e SAC
- Financiamento Imobiliário
- Financiamento de Veículo
- Empréstimo Consignado
- CDC
- Cartão Rotativo
- Parcela em Atraso
- Indicadores iniciais
- Conteúdo educacional inicial

### Conteúdo mínimo do MVP
Cada módulo deve ter:
- formulário funcional;
- processamento do cálculo;
- resultado em cards;
- ao menos uma tabela ou gráfico;
- explicação resumida;
- alertas básicos.

## 9. O que fica para pós-MVP
- histórico persistido;
- autenticação;
- painel administrativo;
- quizzes avançados;
- trilhas adaptativas;
- recomendações sofisticadas;
- integrações externas.

## 10. Critérios funcionais gerais de aceite
Uma funcionalidade é aceita quando:
- recebe corretamente as entradas definidas;
- valida dados obrigatórios;
- produz saídas coerentes;
- exibe resultados compreensíveis;
- apresenta interpretação quando aplicável;
- mantém consistência com o objetivo do módulo.
