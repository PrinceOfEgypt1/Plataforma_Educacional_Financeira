# Especificação Visual Determinística — Módulo Financiamento Imobiliário

**Item:** 14F-F8C-v6.2
**Gate:** PO/UX/Valor
**Status:** Especificação aguardando aprovação visual do PO
**Base:** `origin/gate-po-ux-valor/item-14f-f8c-fidelidade-visual-wireframe-imovel` (`2acd1cc`)
**Data:** 2026-05-25

---

## 1. Contexto

As versões anteriores do módulo Imóvel foram rejeitadas pelo PO por razões registradas formalmente em:

- `docs/gates/gate-po-ux-valor/14f/05-fail-oficial-uiux-imovel/RELATORIO_FAIL_OFICIAL_UIUX_IMOVEL_ITEM_14F_F1.md`
- `docs/gates/gate-po-ux-valor/14f/08-validacao-visual-final-f6/RELATORIO_NAO_ACEITE_VISUAL_UIUX_IMOVEL_ITEM_14F_F6.md`

Causa raiz documentada: liberdade criativa excessiva das IAs implementadoras, levando a:

1. Interface visualmente pobre e sem aparência premium.
2. Excesso de espaço vazio e layout esticado.
3. Composição de cores ruim (tela morta em cinza/preto).
4. Rolagem vertical irritante resolvida de forma artificial com `overflow: hidden`.
5. Tabelas ilegíveis com microtexto e colunas desalinhadas.
6. Campos de formulário desalinhados.
7. Alteração indevida do cenário financeiro demonstrativo.
8. Comparação SAC x PRICE com base inconsistente (taxas diferentes).
9. Uso insuficiente de abas internas.
10. Ausência de Aurora/Gradient Border estratégico.
11. Entrega autodeclarada como correta sem evidência visual suficiente.

Esta especificação existe para **eliminar ambiguidade de design** e **restringir a liberdade criativa da IA implementadora futura** a zero nos aspectos cobertos por este documento.

---

## 2. Objetivo

Produzir documentação governada, objetiva e auditável que defina exatamente como o módulo Imóvel deve ser visualmente organizado em implementação futura, cobrindo:

- Arquitetura de navegação (etapas + abas)
- Design system (tokens, cores, tipografia, componentes)
- Layout de cada tela (etapa × aba)
- Conteúdo obrigatório de cada tela
- Regras de rolagem
- Regras para tabelas, formulários, gráficos, cards
- Critérios de aceite por tela
- Cenário financeiro fixo não alterável

---

## 3. Escopo e Não-Escopo

### Escopo desta entrega

- Documentação especificativa determinística.
- Wireframe textual de cada combinação etapa × aba.
- Design system com tokens obrigatórios.
- Matrizes de componentes e critérios de aceite.
- Contrato visual legível por máquina (JSON).
- Script de autovalidação estrutural.

### Fora do escopo desta entrega

- Implementação React/TypeScript.
- Alteração de componentes existentes.
- Alteração de backend ou fórmulas financeiras.
- Abertura de PR para `main`.
- Criação de wireframe HTML livre.

---

## 4. Cenário Financeiro Fixo — Imutável

O cenário financeiro demonstrativo abaixo é **fixo e imutável**. Nenhuma IA implementadora, revisor ou processo automatizado pode alterá-lo sem decisão explícita e auditável do PO.

| Parâmetro | Valor |
|---|---|
| Valor do imóvel | R$ 870.000,00 |
| Entrada | R$ 700.000,00 |
| Valor financiado | R$ 170.000,00 |
| Prazo | 120 meses |
| Taxa mensal | 0,85% a.m. |
| Encargos mensais | R$ 205,00 |
| Encargos totais | R$ 24.600,00 |
| Sistema principal | SAC |
| Comparação secundária | PRICE |

**Regra de comparação SAC x PRICE:**

A comparação deve usar base justa:
- Mesmo principal (R$ 170.000,00).
- Mesmo prazo (120 meses).
- Mesma taxa (0,85% a.m.).
- Mesmos encargos (R$ 205,00/mês).
- Mesma fórmula de total pago: `principal + juros totais + encargos totais`.

É **proibido** usar taxas diferentes para SAC e PRICE em comparação que se apresenta como comparação entre sistemas.

---

## 5. Arquitetura Global de Navegação

A interface usa **duas camadas de navegação**:

### Camada 1 — Stepper Principal (7 etapas)

```
[1. Preparar] → [2. Simular] → [3. Resultado] → [4. Entender]
→ [5. Comparar] → [6. Conferir] → [7. Decidir]
```

- Stepper horizontal, posicionado no topo da área de conteúdo.
- Compacto: altura máxima 56px.
- Etapa ativa: destaque visual em `--royal-blue` ou `--violet`.
- Etapas concluídas: check mark + cor reduzida.
- Etapas futuras: cor neutra.
- Stepper não rola com o conteúdo (sticky).

### Camada 2 — Abas Internas Contextuais (por etapa)

Cada etapa contém abas internas que distribuem o conteúdo em fatias sem rolagem vertical.

Ver Seção 6 para lista completa de abas por etapa.

**Regra central:** Cada combinação "etapa + aba ativa" é tratada como uma tela própria, com objetivo claro, conteúdo útil, layout definido e sem empilhamento vertical excessivo.

---

## 6. Abas Obrigatórias por Etapa

### Etapa 1 — Preparar
1. Visão Geral
2. Entrada
3. Valor Financiado
4. SAC x PRICE
5. Cuidados

### Etapa 2 — Simular
1. Dados do Imóvel
2. Condições
3. Custos
4. Sistema
5. Resumo

### Etapa 3 — Resultado
1. Resumo
2. Cenário
3. Alertas
4. Interpretação

### Etapa 4 — Entender
1. Parcela
2. Amortização
3. Juros
4. Saldo Devedor
5. SAC x PRICE

### Etapa 5 — Comparar
1. Resumo Comparativo
2. Tabela SAC
3. Tabela PRICE
4. Gráfico
5. Leitura Pedagógica

### Etapa 6 — Conferir
1. Fórmulas SAC
2. Fórmulas PRICE
3. Variáveis
4. Passo a Passo
5. Auditoria

### Etapa 7 — Decidir
1. Diagnóstico
2. Checklist
3. Próximos Passos
4. Cuidados
5. Conclusão

---

## 7. Regras de Rolagem

### Objetivo

Em desktop 1920×1080, cada combinação "etapa + aba ativa" deve caber na viewport **sem barra de rolagem vertical do navegador**.

### Proibido

- `body { overflow: hidden }` escondendo conteúdo real.
- Conteúdo cortado ou oculto artificialmente.
- Cards vazios para ocupar espaço.
- Remoção de conteúdo relevante para caber na tela.
- Microfontes (font-size < 12px) para compactar conteúdo.
- Excesso de espaço inútil vertical.
- Layout esticado para preencher altura.
- Rodapé sobrepondo conteúdo.

### Solução Obrigatória

- Abas internas contextuais distribuindo o conteúdo.
- Conteúdo bem distribuído entre abas.
- Tabelas com paginação interna (máx. 8–10 linhas visíveis, sem scroll vertical).
- Gráficos com altura proporcional (máx. 280px em telas compartilhadas).
- Cards com altura definida por tokens, não por conteúdo livre.
- Header compacto (máx. 64px).
- Stepper compacto (máx. 56px).
- Navegação inferior compacta (máx. 56px).
- Densidade visual útil: sem padding excessivo, sem gap excessivo.

### Cálculo de Orçamento Vertical Disponível (Referência Arquitetural)

```
Viewport: 1080px
- Header: 64px
- Stepper: 56px
- Tab bar: 48px
- Navegação inferior: 56px
- Padding top/bottom: 32px
= Área útil de conteúdo: ~824px
```

Este valor de **~824px** é uma **referência arquitetural centralizada**, derivada
do orçamento vertical da viewport desktop 1920×1080 menos os elementos
estruturais persistentes (header, stepper, tab bar, navegação). **Não é uma
altura fixa a ser hardcoded em cada aba ou componente.**

### Como cada tela deve respeitar o orçamento

- A meta é **caber na viewport** sem scrollbar vertical no `body`, não atingir
  uma altura específica em pixels.
- A solução estrutural correta é **composição proporcional**: abas internas,
  paginação de tabelas (8–10 linhas), gráficos com altura proporcional, cards
  com altura definida por tokens, densidade visual útil.
- **Proibido** prender conteúdo em `height: 824px` ou `max-height: 824px` por
  aba como forma de forçar o ajuste — isso é antipadrão.
- **Proibido** `overflow: hidden` em containers para esconder conteúdo
  excedente; o conteúdo deve caber por design, não por corte.
- A referência ~824px serve apenas para **dimensionar o design**, não para
  travá-lo no DOM/CSS.

Critérios de aceite das telas individuais referenciam esta seção (não repetem
o valor numérico), garantindo que uma eventual revisão do header/stepper/nav
recalcule o orçamento em um único lugar.

---

## 8. Direção Visual Obrigatória

### A interface deve parecer

- Produto educacional financeiro premium.
- Moderna, viva, clara, confiável.
- Didática e sofisticada.
- Visualmente muito superior ao estado atual.

### A interface não deve parecer

- Formulário esticado.
- Dashboard genérico de BI.
- Planilha apertada.
- Protótipo cru.
- Tela bancária burocrática.
- Cards soltos sem coesão visual.
- Tela morta em cinza/preto.
- Tela com muito espaço vazio inútil.

### Fonte

**Manrope** — única fonte permitida.
Fallback: `system-ui, sans-serif`.

### Regra de Contraste (Absoluta)

Em fundo escuro ou cor forte (navy, deep-blue, royal-blue, violet, purple):
- Texto: **branco (#FFFFFF)**.
- Títulos: **branco**.
- Números: **branco**.
- Subtítulos: branco ou `rgba(255,255,255,0.85)` mínimo.

**Proibido** texto preto (`#000`, `#111`, `#333`) sobre fundo escuro.

---

## 9. Regras por Etapa — Resumo

| Etapa | Objetivo Principal | Tipo de Conteúdo Dominante |
|---|---|---|
| 1 — Preparar | Contextualizar o usuário antes da simulação | Cards informativos, texto pedagógico, comparativo simples |
| 2 — Simular | Capturar os dados do financiamento | Formulário distribuído em abas |
| 3 — Resultado | Exibir o resultado calculado da simulação | Cards de KPI, alertas, interpretação |
| 4 — Entender | Explicar os componentes financeiros | Cards explicativos, mini-gráficos |
| 5 — Comparar | Comparar SAC x PRICE com base justa | Tabelas paginadas, gráfico comparativo |
| 6 — Conferir | Apresentar as fórmulas e auditoria | Fórmulas tipografadas, tabela variáveis |
| 7 — Decidir | Apoiar a decisão do usuário | Checklist, diagnóstico, CTAs finais |

Detalhamento completo de cada etapa × aba está em `WIREFRAME_TEXTUAL_DETERMINISTICO.md`.

---

## 10. Regra de Aprovação Humana

Esta especificação é entregue como documentação governada. A aprovação para uso como base de implementação depende **exclusivamente** do PO.

Nenhuma IA pode declarar esta especificação como:
- Aprovada pelo PO.
- Final.
- Pronta para implementação sem revisão humana.

O aceite visual e funcional do PO é etapa obrigatória e insubstituível antes de qualquer implementação React.

---

*Esta entrega foi autoverificada estruturalmente, mas permanece pendente de aprovação visual e funcional do PO.*
