# DOCUMENTO 03 — REGRAS DE NEGÓCIO E MATEMÁTICA FINANCEIRA
## Plataforma Educacional Financeira Completa

**Versão:** 1.1
**Tipo:** Regras de Negócio e Matemática Financeira
**Status:** Base oficial de regras funcionais e matemáticas

**Histórico de revisões:**
- v1.0 — baseline inicial (sprint-00/sinc-documental)
- v1.1 — 2026-05-06 — Sprint 4/F0.1: §7 expandido com thresholds documentados,
  fórmulas detalhadas, algoritmo de saúde financeira e referências.
  Branch: sprint-4/f0.1-rebaseline-doc03-diagnostico-claude

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

**Propósito:** fornecer ao usuário uma leitura educacional de sua saúde financeira
com base em dados declarados. Não é avaliação de crédito, consultoria financeira
individual ou instrumento regulatório.

**Aviso educacional:** os thresholds desta seção são heurísticas educacionais
calibradas com referências reconhecidas (BCB, St. Louis Fed, jurisprudência
brasileira). São instrumentos de educação financeira, não normas legais vinculantes.
A situação individual pode variar.

---

### 7.1 Entradas do diagnóstico

| Campo | Tipo | Descrição |
| --- | --- | --- |
| renda_mensal | Decimal | Renda líquida mensal total (salários, aluguéis, etc.) |
| total_despesas_fixas | Decimal | Despesas fixas mensais (habitação, alimentação, transporte, saúde) |
| total_despesas_variaveis | Decimal | Despesas variáveis mensais (lazer, vestuário, etc.) |
| total_dividas_mensais | Decimal | Soma das parcelas mensais de dívidas e financiamentos |
| total_reserva_atual | Decimal | Valor total disponível como reserva de emergência |

Restrições: todos os valores ≥ 0; renda_mensal > 0.

---

### 7.2 Fórmulas base

#### Sobra mensal
```
Sobra mensal = renda_mensal - total_despesas_fixas - total_despesas_variaveis - total_dividas_mensais
```

Sobra ≥ 0 indica equilíbrio orçamentário. Sobra < 0 indica déficit estrutural.

#### Comprometimento da renda
```
Comprometimento = (total_dividas_mensais / renda_mensal) × 100
```

Mede o percentual da renda consumido por obrigações de dívida (não inclui despesas
essenciais de subsistência).

#### Reserva de emergência em meses
```
Despesas_essenciais_mensais = total_despesas_fixas + total_despesas_variaveis
Reserva_em_meses = total_reserva_atual / Despesas_essenciais_mensais
```

Se Despesas_essenciais_mensais = 0, retornar erro de entrada.

---

### 7.3 Classificação do comprometimento de renda

| Nível | Faixa | Rótulo | comprometimento_nivel |
| --- | --- | --- | --- |
| Baixo | ≤ 20% | Saudável | "baixo" |
| Moderado | > 20% e ≤ 30% | Atenção | "moderado" |
| Alto | > 30% e ≤ 40% | Elevado | "alto" |
| Crítico | > 40% | Crítico | "critico" |

**Âncoras documentais:**
- 30% como fronteira principal: média empírica das famílias brasileiras ~29,7%
  (BCB, série BCB-29037, fev/2026); limite do crédito consignado (Lei 10.820/2003,
  art. 1º §1º); critério jurisprudencial de comprometimento excessivo (TJDFT/TJSP,
  Lei 14.181/2021). DECISÃO DE PRODUTO: extensão como threshold educacional geral.
- 40% como fronteira crítica: acima do limite da CMN 5.115/2024 (35% para crédito
  pessoal especial, vigência 01/07/2027). DECISÃO DE PRODUTO: threshold educacional.
- 20% como fronteira "Baixo": HEURÍSTICA — abaixo da média empírica nacional.
  DECISÃO DE PRODUTO.

---

### 7.4 Classificação da reserva de emergência

| Nível | Faixa (meses) | Rótulo | reserva_nivel |
| --- | --- | --- | --- |
| Crítica | < 1 mês | Sem reserva | "critica" |
| Insuficiente | ≥ 1 e < 3 meses | Insuficiente | "insuficiente" |
| Mínima | ≥ 3 e < 6 meses | Mínima adequada | "minima" |
| Adequada | ≥ 6 e < 12 meses | Adequada | "adequada" |
| Confortável | ≥ 12 meses | Confortável | "confortavel" |

**Fatores educacionais:** 3, 6 e 12 meses (breakpoints mantidos do baseline v1.0).

**Âncoras documentais:** St. Louis Fed recomenda 3–6 meses de despesas essenciais
(publicações educacionais do Federal Reserve Bank of St. Louis). CFPB: "depende da
situação" — confirma que qualquer threshold é heurística educacional. DECISÃO DE
PRODUTO: os rótulos e cortes abaixo de 3 meses são heurísticos.

---

### 7.5 Classificação da sobra mensal

| Nível | Faixa (% da renda) | Rótulo | sobra_nivel |
| --- | --- | --- | --- |
| Negativa | < 0% | Déficit | "negativa" |
| Mínima | ≥ 0% e < 10% | Equilíbrio mínimo | "minima" |
| Moderada | ≥ 10% e < 20% | Moderada | "moderada" |
| Boa | ≥ 20% | Boa | "boa" |

```
Sobra_percentual = (Sobra_mensal / renda_mensal) × 100
```

**Âncoras documentais:** meta de 20% de poupança — regra 50/30/20 de Warren &
Tyagi ("All Your Worth", Simon & Schuster, 2006). Heurística educacional para
contexto americano, adotada como referência orientadora. A fronteira de 10% é
DECISÃO DE PRODUTO sem referência normativa direta.

---

### 7.6 Classificação consolidada de saúde financeira

#### Algoritmo de pontuação

Score total = pontos_comprometimento + pontos_reserva + pontos_sobra (intervalo 0–9)

| Dimensão | Nível | Pontos |
| --- | --- | --- |
| Comprometimento | Baixo (≤ 20%) | 3 |
| Comprometimento | Moderado (≤ 30%) | 2 |
| Comprometimento | Alto (≤ 40%) | 1 |
| Comprometimento | Crítico (> 40%) | 0 |
| Reserva | Confortável (≥ 12 m) ou Adequada (≥ 6 m) | 3 |
| Reserva | Mínima (≥ 3 m) | 2 |
| Reserva | Insuficiente (≥ 1 m) | 1 |
| Reserva | Crítica (< 1 m) | 0 |
| Sobra | Boa (≥ 20%) | 3 |
| Sobra | Moderada (≥ 10%) | 2 |
| Sobra | Mínima (≥ 0%) | 1 |
| Sobra | Negativa (< 0%) | 0 |

#### Classificação por score

| Score | saude_nivel | Rótulo |
| --- | --- | --- |
| 0–1 | "critica" | Situação financeira crítica |
| 2–3 | "fragil" | Situação financeira frágil |
| 4–5 | "moderada" | Situação financeira moderada |
| 6–7 | "boa" | Situação financeira boa |
| 8–9 | "otima" | Situação financeira ótima |

#### Override de sobra negativa

Se `Sobra_mensal < 0`, o saude_nivel é no máximo `"fragil"`, independente do
score total. Déficit orçamentário é incompatível com classificação "Boa" ou "Ótima".

#### Natureza do algoritmo

HEURÍSTICA EDUCACIONAL inspirada na abordagem multidimensional do I-SFB (Índice
de Saúde Financeira do Brasileiro, Febraban/BCB), adaptada para dados quantitativos
declarados. Não é equivalente ao I-SFB (que usa questionário comportamental). Os
cortes de score são DECISÃO DE PRODUTO passíveis de calibração posterior.

---

### 7.7 Alertas educativos

O diagnóstico deve gerar alertas educativos baseados nos níveis individuais:

- comprometimento_nivel = "alto" ou "critico" → alerta de risco de endividamento
- reserva_nivel = "critica" ou "insuficiente" → alerta de vulnerabilidade a imprevistos
- sobra_nivel = "negativa" → alerta de déficit orçamentário estrutural
- sobra_nivel = "minima" → alerta de margem insuficiente para emergências

Os alertas são educativos, não prescritivos. Não devem recomendar produtos
financeiros específicos ou instituições.

---

### 7.8 Referências da seção §7

| Referência | Tipo | Uso |
| --- | --- | --- |
| BCB — série BCB-29037 (comprometimento de renda, fev/2026) | FATO | Âncora do threshold 30% |
| CMN 5.115/2024 — limite 35% crédito pessoal especial | FATO | Âncora do threshold 40% |
| Lei 10.820/2003 — 30% crédito consignado | FATO | Âncora jurídica do threshold 30% |
| Lei 14.181/2021 — superendividamento | FATO | Contexto regulatório brasileiro |
| St. Louis Fed — "3 a 6 meses de reserva de emergência" | HEURÍSTICA | Âncora dos breakpoints 3/6 |
| Warren & Tyagi — "All Your Worth" (2006) — regra 50/30/20 | HEURÍSTICA | Âncora do threshold 20% |
| I-SFB (Febraban/BCB) — saúde financeira multidimensional | HEURÍSTICA | Inspiração do algoritmo composto |

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
