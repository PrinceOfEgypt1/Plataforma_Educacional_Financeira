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


**Materializado em código:** `backend/tests/unit/domain/interest/test_simple.py` (caso básico, 1.000,00 a 1% / 12m → 1.120,00 — exato)
---

## JS-02 — Caso curto
**Entrada**
- principal: 5.000,00
- taxa: 2% ao mês
- prazo: 3 meses

**Esperado**
- juros totais: 300,00
- montante final: 5.300,00


**Materializado em código:** `backend/tests/unit/domain/interest/test_simple.py` (caso curto, 5.000,00 a 2% / 3m → 5.300,00 — exato)
---

## JS-03 — Caso zero prazo
**Entrada**
- principal: 2.500,00
- taxa: 1,5% ao mês
- prazo: 0

**Esperado**
- rejeitar ou retornar erro de validação


**Materializado em código:** `backend/tests/integration/api/interest/test_errors.py` (prazo zero deve rejeitar com 422 / RFC 7807)
---

## 4. Casos de teste — Juros Compostos

## JC-01 — Caso básico
**Entrada**
- principal: 1.000,00
- taxa: 1% ao mês
- prazo: 12 meses

**Esperado**
- montante final: aproximadamente 1.126,83


**Materializado em código:** `backend/tests/unit/domain/interest/test_compound.py` (caso básico, 1.000,00 a 1% / 12m → ≈ 1.126,83)
---

## JC-02 — Caso comparativo
**Entrada**
- principal: 10.000,00
- taxa: 2% ao mês
- prazo: 24 meses

**Esperado**
- montante composto maior que montante simples
- diferença absoluta positiva e relevante


**Materializado em código:** `backend/tests/unit/domain/interest/test_compound.py` + `backend/tests/integration/api/interest/test_compare.py` (composto > simples para mesmas premissas)
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


**Materializado em código:** `backend/tests/unit/domain/interest/test_compound.py` (caso com aporte mensal, JC-03 do Doc 15)
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
- renda_mensal: 5.000,00
- total_despesas_fixas: 2.000,00
- total_despesas_variaveis: 800,00
- total_dividas_mensais: 500,00
- total_reserva_atual: 4.000,00

**Esperado**
- sobra_mensal: 1.700,00
- despesas_essenciais_mensais: 2.800,00
- comprometimento_percentual: 10,00%
- reserva_em_meses: 1,43 (4000 / 2800 = 1,4285... → arredondado)
- sobra_percentual: 34,00%
- comprometimento_nivel: "baixo" (3 pts)
- reserva_nivel: "insuficiente" (1 pt)
- sobra_nivel: "boa" (3 pts)
- score: 7
- saude_nivel: "boa"
- alertas: [RESERVA_INSUFICIENTE (warning)]

**Materializado em código:** `backend/tests/unit/domain/diagnostic/test_analyzer.py` — `test_dg01_saude_boa`

---

## DG-02 — Situação crítica
**Entrada**
- renda_mensal: 3.000,00
- total_despesas_fixas: 2.200,00
- total_despesas_variaveis: 700,00
- total_dividas_mensais: 500,00
- total_reserva_atual: 0,00

**Esperado**
- sobra_mensal: -400,00
- despesas_essenciais_mensais: 2.900,00
- comprometimento_percentual: 16,67% (500/3000×100)
- reserva_em_meses: 0,00
- sobra_percentual: -13,33%
- comprometimento_nivel: "baixo" (3 pts)
- reserva_nivel: "critica" (0 pts)
- sobra_nivel: "negativa" (0 pts)
- score: 3 (raw → "fragil")
- Override: sobra < 0 E reserva_em_meses < 1 → saude_nivel = "critica"
- saude_nivel: "critica"
- alertas: [RESERVA_CRITICA (critical), SOBRA_NEGATIVA (critical)]

**Materializado em código:** `backend/tests/unit/domain/diagnostic/test_analyzer.py` — `test_dg02_saude_critica_por_override`

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


## 9. Cross-link com a matriz de rastreabilidade — Sprint 2

A coluna "Caso de teste matemático" da Doc 19 (linhas RF-INT-001 e
RF-INT-002) cita os casos abaixo como **exercidos por código** após
a Sprint 2 (F2/F3/F4/F5):

| Caso  | Onde é exercido                                                                                  |
|-------|--------------------------------------------------------------------------------------------------|
| JS-01 | `backend/tests/unit/domain/interest/test_simple.py`                                              |
| JS-02 | `backend/tests/unit/domain/interest/test_simple.py`                                              |
| JS-03 | `backend/tests/integration/api/interest/test_errors.py` (caminho de validação)                   |
| JC-01 | `backend/tests/unit/domain/interest/test_compound.py`                                            |
| JC-02 | `backend/tests/unit/domain/interest/test_compound.py` + `backend/tests/integration/api/interest/test_compare.py` |
| JC-03 | `backend/tests/unit/domain/interest/test_compound.py`                                            |

Os demais casos (JS-04..JS-10, JC-04..JC-10) permanecem **planejados**
e não exercidos por código nesta sprint. A massa do Doc 15 segue como
referência canônica; novos casos serão adicionados em sprints
subsequentes na linha correspondente da Doc 19.

Coerência com o conteúdo educacional do frontend: os exemplos
numéricos do corpus em `frontend/src/content/juros/nivel-1.ts` e
`nivel-2.ts` citam exatamente os números de JS-01 e JC-01 desta
massa. Esta coerência é validada em runtime pelo teste
`frontend/src/__tests__/content/juros/conteudo.test.ts`.

---

## Sprint 4 — Testes pedagógicos do módulo Diagnóstico Financeiro (F4)

Os testes matemáticos DG-01 e DG-02 do diagnóstico financeiro foram exercidos
nas fatias F1/F2 (backend) e F3 (frontend). A F4 adicionou testes pedagógicos:

### Casos de teste pedagógicos (conteúdo educacional)

| ID | Arquivo | Critério |
|----|---------|----------|
| PED-DIAG-01 | `conteudo.test.ts` | Nível 1 cobre 5 temas obrigatórios |
| PED-DIAG-02 | `conteudo.test.ts` | Nível 2 cobre os mesmos 5 temas |
| PED-DIAG-03 | `conteudo.test.ts` | Cada bloco tem ≥ 4 parágrafos e disclaimer obrigatório |
| PED-DIAG-04 | `conteudo.test.ts` | Cobertura N1: diagnóstico, despesas fixas/variáveis, dívidas, reserva, sobra |
| PED-DIAG-05 | `conteudo.test.ts` | Cobertura N2: relação variáveis, pressão de dívidas, meses vs reais, equilíbrio, score/alertas |
| PED-DIAG-06 | `conteudo.test.ts` | Disclaimer menciona "educacional", "não substitui", "análise profissional", "garante resultado" |
| PED-DIAG-07 | `conteudo.test.ts` | Glossário contém 12 termos obrigatórios |
| PED-DIAG-08 | `conteudo.test.ts` | Cada termo tem definição, exemplo e relatedModule = "diagnostic" |
| PED-DIAG-09 | `conteudo.test.ts` | Alertas educacionais cobrem 6 códigos do backend |
| PED-DIAG-10 | `conteudo.test.ts` | Corpus não contém promessa financeira, recomendação individualizada ou placeholder |

---

## Sprint 4 F5 — Casos de teste matemáticos do módulo Financiamento Imobiliário

### Casos canônicos (domínio puro)

| ID | Arquivo | Descrição |
|----|---------|-----------|
| FI-01 | `test_real_estate.py` | PRICE canônico: R$ 240.000 / 360m / 0,7% a.m. — primeira parcela ≈ R$ 1.796,86; soma amortizações = principal; saldo final = 0 |
| FI-02 | `test_real_estate.py` | SAC canônico: mesmo input — amortização constante; parcelas decrescentes; total_juros < PRICE total_juros |
| FI-03 | `test_real_estate.py` | PRICE taxa zero — juros = 0 em todos os períodos; saldo fecha |
| FI-04 | `test_real_estate.py` | SAC taxa zero — juros = 0; saldo fecha |
| FI-05 | `test_real_estate.py` | Encargos mensais — aparecem em cada período; total_encargos = encargo × n; prestação = juros + amortização + encargos |
| FI-06 | `test_real_estate.py` | valor_imovel = 0 → DomainValidationError |
| FI-07 | `test_real_estate.py` | entrada = imóvel → DomainValidationError |
| FI-08 | `test_real_estate.py` | entrada > imóvel → DomainValidationError |
| FI-09 | `test_real_estate.py` | prazo = 0 → DomainValidationError |
| FI-10 | `test_real_estate.py` | taxa negativa → DomainValidationError |
| FI-11 | `test_real_estate.py` | encargo negativo → DomainValidationError |
| FI-12 | `test_real_estate.py` | sistema inválido / bool prazo → DomainValidationError |

### Casos pedagógicos (conteúdo educacional)

| ID | Arquivo | Critério |
|----|---------|----------|
| PED-FIN-01 | `conteudo.test.ts` | Nível 1 cobre 5 temas obrigatórios |
| PED-FIN-02 | `conteudo.test.ts` | Nível 2 cobre os mesmos 5 slugs |
| PED-FIN-03 | `conteudo.test.ts` | Cada bloco tem ≥ 4 parágrafos e disclaimer obrigatório |
| PED-FIN-04 | `conteudo.test.ts` | N1 explica PRICE, SAC, entrada e valor financiado |
| PED-FIN-05 | `conteudo.test.ts` | N2 menciona reais e CET |
| PED-FIN-06 | `conteudo.test.ts` | Disclaimer menciona "educacional", "proposta bancária", "profissional", "CET" |
| PED-FIN-07 | `conteudo.test.ts` | Glossário contém 12 termos obrigatórios |
| PED-FIN-08 | `conteudo.test.ts` | Cada termo tem definição, exemplo e relatedModule = "financing" |
| PED-FIN-09 | `conteudo.test.ts` | Corpus não contém linguagem prescritiva, promessa financeira ou marcador de rascunho |
