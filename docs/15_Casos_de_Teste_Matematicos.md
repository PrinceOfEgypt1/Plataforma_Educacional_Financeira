# DOCUMENTO 15 — CASOS DE TESTE MATEMÁTICOS E MASSA DE VALIDAÇÃO
## Plataforma Educacional Financeira Completa

**Nome provisório do produto:** Plataforma Educacional Financeira
**Versão do documento:** 1.0
**Tipo de documento:** Casos de Teste Matemáticos e Massa de Validação
**Status:** Base oficial de validação numérica
**Objetivo do documento:** definir casos numéricos de referência, cenários normais, extremos e inválidos para proteger a implementação do motor financeiro.

---

## 1. Finalidade do documento

Este documento existe para reduzir ambiguidade na implementação matemática.

Ele define:
- entradas oficiais de teste;
- saídas esperadas;
- tolerâncias;
- cenários de borda;
- cenários inválidos;
- massa de validação mínima por módulo.

---

## 2. Regras gerais

### 2.1 Precisão
- cálculos internos: alta precisão
- exibição: 2 casas decimais
- tolerância recomendada para testes: `±0,01` nos valores finais exibidos

### 2.2 Regra de comparação
Quando houver séries temporais:
- validar o valor final;
- validar pelo menos a primeira linha;
- validar uma linha intermediária;
- validar a última linha.

---

## 3. Casos de teste — Juros Simples

## JS-01 — Caso básico
**Entrada**
- principal: 1.000,00
- taxa: 1% ao mês
- prazo: 12 meses

**Esperado**
- juros totais: 120,00
- montante final: 1.120,00

---

## JS-02 — Caso curto
**Entrada**
- principal: 5.000,00
- taxa: 2% ao mês
- prazo: 3 meses

**Esperado**
- juros totais: 300,00
- montante final: 5.300,00

---

## JS-03 — Caso zero prazo
**Entrada**
- principal: 2.500,00
- taxa: 1,5% ao mês
- prazo: 0

**Esperado**
- rejeitar ou retornar erro de validação

---

## 4. Casos de teste — Juros Compostos

## JC-01 — Caso básico
**Entrada**
- principal: 1.000,00
- taxa: 1% ao mês
- prazo: 12 meses

**Esperado**
- montante final: aproximadamente 1.126,83

---

## JC-02 — Caso comparativo
**Entrada**
- principal: 10.000,00
- taxa: 2% ao mês
- prazo: 24 meses

**Esperado**
- montante composto maior que montante simples
- diferença absoluta positiva e relevante

---

## JC-03 — Caso com aporte mensal
**Entrada**
- principal: 1.000,00
- taxa: 1% ao mês
- prazo: 12 meses
- aporte mensal: 100,00

**Esperado**
- valor final superior ao cenário sem aporte
- tabela temporal coerente

---

## 5. Casos de teste — PRICE

## PR-01 — Caso padrão
**Entrada**
- principal: 100.000,00
- taxa: 1% ao mês
- prazo: 12 meses

**Esperado**
- parcela constante ao longo do período
- soma das amortizações próxima do principal
- saldo devedor final próximo de zero

---

## PR-02 — Verificação estrutural
**Esperado**
- juros da primeira parcela maiores que juros da última
- amortização da última parcela maior que a da primeira

---

## 6. Casos de teste — SAC

## SAC-01 — Caso padrão
**Entrada**
- principal: 100.000,00
- taxa: 1% ao mês
- prazo: 12 meses

**Esperado**
- amortização constante de aproximadamente 8.333,33 por período
- parcela inicial maior que a final
- saldo devedor final próximo de zero

---

## SAC-02 — Verificação comparativa com Price
**Esperado**
- total de juros do SAC menor que total de juros do PRICE, para mesma taxa e prazo

---

## 7. Casos de teste — Diagnóstico Financeiro

## DG-01 — Situação saudável
**Entrada**
- renda mensal: 5.000,00
- despesas fixas: 2.000,00
- despesas variáveis: 800,00
- dívidas mensais: 500,00
- valor guardado: 4.000,00

**Esperado**
- saldo mensal positivo
- capacidade de poupança positiva
- classificação não crítica

---

## DG-02 — Situação crítica
**Entrada**
- renda mensal: 3.000,00
- despesas fixas: 2.200,00
- despesas variáveis: 700,00
- dívidas mensais: 500,00

**Esperado**
- saldo mensal negativo
- capacidade de poupança nula
- alerta forte
- classificação crítica

---

## 8. Casos de teste — Financiamento Imobiliário

## FI-01 — Cenário padrão
**Entrada**
- valor do imóvel: 300.000,00
- entrada: 60.000,00
- valor financiado: 240.000,00
- taxa: 0,8% ao mês
- prazo: 360 meses
- sistema: SAC
- renda mensal: 8.000,00

**Esperado**
- valor financiado correto
- parcela inicial calculada
- parcela final menor que inicial
- comprometimento de renda calculado
- total pago maior que valor do imóvel

---

## FI-02 — Entrada inválida
**Entrada**
- entrada > valor do imóvel

**Esperado**
- erro de regra de negócio

---

## 9. Casos de teste — Financiamento de Veículo

## FV-01 — Cenário padrão
**Entrada**
- veículo: 80.000,00
- entrada: 20.000,00
- financiado: 60.000,00
- taxa: 1,8% ao mês
- prazo: 48 meses
- renda: 4.500,00

**Esperado**
- parcela calculada
- total pago calculado
- alerta se comprometimento for alto

---

## 10. Casos de teste — Consignado

## CON-01 — Dentro da margem
**Entrada**
- valor solicitado: 15.000,00
- salário líquido: 4.000,00
- taxa: 2,0% ao mês
- prazo: 24 meses

**Esperado**
- parcela <= 35% da renda
- status dentro da margem

---

## CON-02 — Fora da margem
**Entrada**
- salário líquido: 2.000,00
- demais parâmetros resultando em parcela > 35%

**Esperado**
- alerta de extrapolação
- cálculo ainda exibido, se essa for a regra da UI

---

## 11. Casos de teste — CDC

## CDC-01 — Com CET
**Entrada**
- valor solicitado: 12.000,00
- taxa: 3,5% ao mês
- CET: 4,2% ao mês
- prazo: 24 meses

**Esperado**
- total com CET > total sem CET
- alerta de alto custo

---

## 12. Casos de teste — Rotativo

## ROT-01 — Pagamento parcial
**Entrada**
- fatura: 3.500,00
- pago: 800,00
- saldo remanescente: 2.700,00
- taxa rotativo: 12% ao mês
- prazo: 6 meses

**Esperado**
- saldo remanescente calculado corretamente
- crescimento relevante da dívida
- cenário de quitação integral melhor que pagamento parcial

---

## ROT-02 — Quitação integral
**Entrada**
- pago = fatura

**Esperado**
- saldo remanescente = 0
- sem rotativo adicional

---

## 13. Casos de teste — Parcela em Atraso

## ATR-01 — Atraso de 20 dias
**Entrada**
- valor original: 1.200,00
- multa: 2%
- juros mora: 1% ao mês
- atraso: 20 dias
- correção monetária: 0

**Esperado**
- multa: 24,00
- mora proporcional: aproximadamente 8,00
- total atualizado: aproximadamente 1.232,00

---

## ATR-02 — Sem atraso
**Entrada**
- atraso: 0 dias

**Esperado**
- valor atualizado = valor original
- sem multa
- sem mora

---

## 14. Casos de teste — Indicadores

## IND-01 — Catálogo
**Esperado**
- lista contém CET, IOF, TR, Selic, IPCA

## IND-02 — Detalhe
**Esperado**
- indicador possui nome, definição, impacto e exemplo

---

## 15. Casos de teste — Investir ou Quitar Dívida

## IQD-01 — Dívida cara
**Entrada**
- dívida: 10.000,00
- taxa da dívida: 2,5% ao mês
- investimento: 1,0% ao mês
- valor mensal disponível: 800,00

**Esperado**
- cenário quitar mais vantajoso em custo total

## IQD-02 — Cenário híbrido
**Esperado**
- resultado híbrido entre quitar total e investir total

---

## 16. Casos inválidos transversais
Devem gerar erro estruturado:
- taxa negativa em contexto inválido
- prazo zero em módulo que exige prazo > 0
- entrada negativa
- valor do bem zero
- renda zero quando módulo depende de renda
- data de pagamento anterior ao vencimento em módulo de atraso
- enum inexistente

---

## 17. Artefatos recomendados para automação
Criar, no repositório:
- `tests/fixtures/financial_cases.json`
- `tests/fixtures/education_cases.json`
- `tests/golden/` para respostas oficiais de referência

---

## 18. Critérios de aceite
Este documento estará aceito quando:
- puder ser convertido diretamente em testes automatizados;
- cada módulo crítico tiver ao menos 2 casos positivos e 1 inválido;
- os cenários protegerem as fórmulas principais do sistema.
