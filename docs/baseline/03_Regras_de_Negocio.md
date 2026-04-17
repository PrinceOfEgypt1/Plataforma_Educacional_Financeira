# DOCUMENTO 03 — REGRAS DE NEGÓCIO E MATEMÁTICA FINANCEIRA
## Plataforma Educacional Financeira Completa

**Versão:** 1.0
**Tipo:** Regras de Negócio e Matemática Financeira
**Status:** Base oficial de regras funcionais e matemáticas

## 1. Finalidade
Definir convenções, fórmulas, critérios, restrições, interpretações e regras de negócio que governarão os cálculos e a lógica financeira da plataforma.

## 2. Princípios
- clareza;
- consistência;
- transparência;
- separação entre cálculo e interpretação;
- configurabilidade;
- finalidade educacional.

## 3. Convenções gerais
### Monetária
- moeda: Real brasileiro (R$);
- exibição com 2 casas decimais;
- arredondamento preferencialmente apenas na apresentação.

### Percentual
- taxa sempre com periodicidade explícita;
- nunca assumir automaticamente taxa mensal.

### Tempo
- meses para financiamentos;
- dias para atraso;
- conversões sempre explícitas.

## 4. Notação padronizada
- PV = valor presente
- FV = valor futuro
- i = taxa do período
- n = número de períodos
- PMT = parcela
- J = juros
- A = amortização
- SD = saldo devedor

## 5. Validação de entrada
- não permitir campos obrigatórios vazios;
- não permitir taxa inválida sem alerta;
- não permitir prazo zero onde o cálculo exige prazo positivo;
- não permitir valor financiado negativo;
- não permitir entrada maior que o valor do bem sem tratamento;
- não permitir datas incoerentes.

## 6. Conversões de taxa
### Anual para mensal equivalente
`i_mensal = (1 + i_anual)^(1/12) - 1`

### Mensal para anual equivalente
`i_anual = (1 + i_mensal)^12 - 1`

## 7. Diagnóstico Financeiro
### Saldo mensal
`Saldo mensal = renda mensal - despesas fixas - despesas variáveis`

### Comprometimento da renda
`Comprometimento = (obrigações mensais / renda mensal) × 100`

### Reserva de emergência
`Reserva sugerida = despesas mensais essenciais × fator`
Fatores educacionais: 3, 6 e 12 meses.

### Classificação da saúde financeira
Heurística educacional configurável, com faixas como:
- saudável
- atenção
- crítica

## 8. Juros Simples
### Juros
`J = PV × i × n`

### Montante
`FV = PV × (1 + i × n)`

## 9. Juros Compostos
### Montante
`FV = PV × (1 + i)^n`

### Juros totais
`J = FV - PV`

### Com aporte periódico
A plataforma deve deixar claro se o aporte ocorre no início ou no fim do período. Convenção padrão inicial sugerida: aporte ao fim do período.

## 10. PRICE
### Parcela
`PMT = PV × [ i × (1 + i)^n ] / [ (1 + i)^n - 1 ]`

### Por período
- juros = saldo devedor anterior × i
- amortização = parcela - juros
- novo saldo = saldo anterior - amortização

## 11. SAC
### Amortização constante
`A = PV / n`

### Por período
- juros = saldo devedor anterior × i
- parcela = amortização + juros
- novo saldo = saldo anterior - amortização

## 12. Regras dos financiamentos
### Valor financiado
`Valor financiado = valor do bem - entrada + custos financiáveis`

### Total pago
Soma das parcelas + custos não financiados, quando aplicável.

### Total de juros
`Total de juros = total pago - principal financiado - custos adicionais não classificados como juros`

### Percentual pago acima do valor do bem
`Percentual excedente = [(total pago - valor do bem) / valor do bem] × 100`

### Equivalência em quantidade de bens
`Equivalência = total pago / valor original do bem`

### Comprometimento da renda
`Comprometimento = (parcela / renda mensal) × 100`

## 13. Consignado
### Margem consignável
`Percentual comprometido = (parcela / salário líquido) × 100`
A margem é parâmetro configurável. O padrão recomendado é alertar, não bloquear.

### CET
Se informado, mostrar custo com CET e diferenciar juros nominais de custo efetivo.

## 14. CDC
- deixar claro se o cálculo considera taxa nominal, CET e/ou tarifas;
- comparar custo com e sem CET;
- alerta de alto custo tratado como heurística configurável.

## 15. Cartão de Crédito e Rotativo
### Saldo remanescente
`Saldo remanescente = valor da fatura - valor pago`

### Projeção no rotativo
`FV = saldo remanescente × (1 + i)^n`

O módulo deve comparar:
- pagar o mínimo;
- parcelar;
- quitar integralmente.

## 16. Parcela em Atraso
### Valor atualizado
`Valor atualizado = valor original + multa + juros de mora + correção monetária`

### Multa
`Multa = valor original × percentual de multa`

### Mora proporcional simplificada
`Juros de mora = valor original × taxa mensal × (dias de atraso / 30)`

### Correção monetária
`Correção = valor original × índice de correção`

Deve simular ao menos: 1, 7, 15, 30, 60 e 90 dias.

## 17. Indicadores Financeiros
### CET
Apresentar como medida do custo total da operação de crédito.

### IOF
Tratar como parâmetro configurável por contexto de simulação.

### TR, Selic e IPCA
Podem ser inicialmente explicados didaticamente e usados em exemplos fixos ou parametrizados.

### Taxa real
Aproximação simples: `taxa real ≈ taxa nominal - inflação`
Fórmula mais precisa: `[(1 + taxa nominal) / (1 + inflação)] - 1`

## 18. Investir ou Quitar Dívida
Deve comparar:
- cenário quitar;
- cenário investir;
- cenário híbrido.

A interpretação deve considerar:
- custo da dívida;
- retorno estimado;
- previsibilidade;
- risco;
- custo de oportunidade.

## 19. Regras de parametrização
Parâmetros ajustáveis:
- faixas de alerta;
- margem consignável;
- percentual de multa;
- taxa de mora;
- fatores da reserva de emergência;
- limiares de classificação;
- hipóteses de CET e IOF educacionais.

## 20. Limites de interpretação
A plataforma não é:
- cálculo contratual definitivo;
- simulador oficial de banco específico;
- consultoria individual formal;
- recomendador regulado de investimento.

## 21. Tabela-resumo das fórmulas centrais
- Juros simples: `FV = PV × (1 + i × n)`
- Juros compostos: `FV = PV × (1 + i)^n`
- PRICE: `PMT = PV × [ i × (1 + i)^n ] / [ (1 + i)^n - 1 ]`
- SAC: `A = PV / n`
- Multa: `Multa = valor original × percentual de multa`
- Mora: `valor original × taxa mensal × (dias / 30)`
- Comprometimento: `(parcela / renda mensal) × 100`
- Percentual excedente: `[(total pago - valor do bem) / valor do bem] × 100`
