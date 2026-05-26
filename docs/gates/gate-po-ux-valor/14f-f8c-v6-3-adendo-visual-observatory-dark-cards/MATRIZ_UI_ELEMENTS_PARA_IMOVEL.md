# Matriz de UI Elements para o Módulo Imóvel
## Item 14F-F8C-v6.3 — Observatory Dark Cards

**Status:** pendente_aprovacao_po
**Base:** jornada de 7 etapas da F8C-v6.2 + UI Elements do Observatory Dark Cards
**Data:** 2026-05-26

---

## 1. UI Elements disponíveis

| ID | Componente | Descrição |
|---|---|---|
| SC | Score Card | Card com label, valor grande (DM Mono), barra de progresso e nota |
| MC | Metric Card (Task) | Card com barras horizontais finas e valores alinhados |
| CC | Checklist Card | Card com header gradient, linhas numeradas e exemplos |
| BA | Before/After Card | Grid 2 colunas com card before (vermelho) e after (verde) |
| QC | Question Card | Card com watermark numérico, título em DM Mono e hint |
| IB | Insight Box | Box com gradiente dourado, ícone e texto destacado |
| AC | Apply Card | Card com tag ciano, título e bloco interno DM Mono dourado |

---

## 2. Matriz de aplicação por etapa da jornada

### ETAPA 1 — Preparar

**Objetivo:** Levar o usuário a compreender o contexto e preparar as informações necessárias antes da simulação.

| UI Element | Uso na etapa | Conteúdo aplicado |
|---|---|---|
| QC | Perguntas iniciais (3 cards em q-grid) | "Qual é o valor do imóvel?", "Qual é sua entrada disponível?", "Qual prazo você considera?" |
| IB | Insight pedagógico | Explicação sobre a importância da entrada e seu impacto no financiamento |
| AC | Orientação de ação | Tag "PREPARAÇÃO", bloco com checklist de documentos e informações necessárias |

**Grid obrigatório:** q-grid (3 colunas para Question Cards) + apply-grid (2 colunas para Apply Cards).

---

### ETAPA 2 — Simular

**Objetivo:** Permitir que o usuário insira os parâmetros e visualize a simulação em andamento.

| UI Element | Uso na etapa | Conteúdo aplicado |
|---|---|---|
| CC | Checklist de parâmetros | Campos: valor do imóvel, entrada, prazo, taxa — numerados com DM Mono |
| AC | Cards de cenário | Tag "SIMULAÇÃO", descrição do cenário, bloco com parâmetros em DM Mono |
| SC | Score Cards compactos | Valores intermediários: percentual de entrada, comprometimento de renda |

**Grid obrigatório:** checklist (largura total) + score-grid (3 colunas para métricas intermediárias) + apply-grid (2 colunas).

---

### ETAPA 3 — Resultado

**Objetivo:** Apresentar os resultados principais da simulação de forma clara e hierarquizada.

| UI Element | Uso na etapa | Conteúdo aplicado |
|---|---|---|
| SC | Score Cards principais (score-grid 3 colunas) | Prestação SAC (1ª), Prestação PRICE, Custo total — card principal com borda verde |
| MC | Metric Cards (task-grid 2 colunas) | Amortização vs juros por sistema (barras visuais), comprometimento de renda |
| IB | Insight de resultado | Highlight do vencedor com justificativa pedagógica em DM Sans |

**Destaque obrigatório:** Score Card do sistema mais favorável recebe `border-color: #10b981` e `box-shadow: 0 0 20px rgba(16,185,129,.12)`. Máximo 2 cards destacados.

---

### ETAPA 4 — Entender

**Objetivo:** Educar o usuário sobre os mecanismos de SAC x PRICE, amortização, juros e CET.

| UI Element | Uso na etapa | Conteúdo aplicado |
|---|---|---|
| MC | Metric Cards (task-grid) | Evolução da amortização, peso dos juros ao longo do prazo |
| IB | Insight pedagógico | Explicações conceituais sobre SAC x PRICE, amortização, CET |
| BA | Before/After Card | Comparação visual: perfil de pagamentos SAC x PRICE ao longo do prazo |

**BLOQUEANTE:** Nomear sempre como "SAC x PRICE" (letra x minúscula). Proibido usar sinal de multiplicação Unicode.

---

### ETAPA 5 — Comparar

**Objetivo:** Comparação direta e detalhada entre os sistemas SAC e PRICE.

| UI Element | Uso na etapa | Conteúdo aplicado |
|---|---|---|
| BA | Before/After Card | Coluna "SAC" vs coluna "PRICE" com dados comparativos em DM Mono |
| SC | Score Cards (score-grid) | Custo total SAC, custo total PRICE, diferença absoluta — destacado no mais barato |
| MC | Metric Cards (task-grid) | Detalhe de amortização, juros, encargos por sistema |

**Layout obrigatório:** ba-grid para o Before/After Card + score-grid para os Score Cards comparativos.

---

### ETAPA 6 — Conferir

**Objetivo:** Verificar a memória de cálculo, validar fórmulas e conferir os valores item a item.

| UI Element | Uso na etapa | Conteúdo aplicado |
|---|---|---|
| CC | Checklist Card (largura total) | Memória de cálculo numerada: fórmulas em DM Mono, valores em DM Mono dourado |
| IB | Insight de validação | Aviso sobre arredondamentos, diferenças centesimais, CET |

**Cenário fixo obrigatório na conferência:**
```
Imóvel:           R$ 870.000,00
Entrada:          R$ 700.000,00
Financiado:       R$ 170.000,00
Prazo:            120 meses
Taxa mensal:      0,85% a.m.
Encargos mensais: R$ 205,00
Encargos totais:  R$ 24.600,00
```

**Regra:** fórmulas e valores na memória de cálculo devem usar DM Mono obrigatoriamente.

---

### ETAPA 7 — Decidir

**Objetivo:** Auxiliar o usuário a tomar uma decisão fundamentada com base nos dados analisados.

| UI Element | Uso na etapa | Conteúdo aplicado |
|---|---|---|
| CC | Checklist de decisão | Checklist de fatores decisórios numerados em DM Mono azul |
| QC | Question Cards (q-grid) | As 3 perguntas finais antes da decisão |
| AC | Apply Cards (apply-grid) | Orientações de ação por cenário (renda comprometida, prazo ideal, perfil de risco) |
| SC | Score Card de síntese | Card único com o sistema recomendado e borda verde — máximo 1 destacado |

---

## 3. Resumo de aplicação — tabela consolidada

| Etapa | SC | MC | CC | BA | QC | IB | AC |
|---|---|---|---|---|---|---|---|
| 1. Preparar | — | — | — | — | ✓ | ✓ | ✓ |
| 2. Simular | ✓ | — | ✓ | — | — | — | ✓ |
| 3. Resultado | ✓ | ✓ | — | — | — | ✓ | — |
| 4. Entender | — | ✓ | — | ✓ | — | ✓ | — |
| 5. Comparar | ✓ | ✓ | — | ✓ | — | — | — |
| 6. Conferir | — | — | ✓ | — | — | ✓ | — |
| 7. Decidir | ✓ | — | ✓ | — | ✓ | — | ✓ |

---

## 4. Regras de grid por etapa

| Etapa | Grid principal | Notas |
|---|---|---|
| 1. Preparar | q-grid + apply-grid | 3 Question Cards + 2 Apply Cards |
| 2. Simular | checklist (full) + score-grid + apply-grid | Checklist em largura total |
| 3. Resultado | score-grid + task-grid | 3 Score Cards + 2 Metric Cards |
| 4. Entender | task-grid + ba-grid | 2 Metric Cards + 1 Before/After |
| 5. Comparar | ba-grid + score-grid + task-grid | Before/After + Score + Metric |
| 6. Conferir | checklist (full) | Checklist em largura total |
| 7. Decidir | q-grid + apply-grid + score único | 3 Questions + 2 Apply + 1 Score |

---

## 5. Invariantes herdados da F8C-v6.2 — BLOQUEANTES

- A sequência das 7 etapas não pode ser alterada.
- As abas obrigatórias de cada etapa (definidas na F8C-v6.2) não podem ser removidas.
- Todos os UI Elements desta matriz devem usar os tokens de cor e tipografia do Design System Observatory Dark Cards.
- Nenhuma etapa pode usar UI Elements fora do padrão Observatory sem decisão explícita do PO.
- A nomenclatura "SAC x PRICE" com letra x minúscula é obrigatória em todo o módulo.
