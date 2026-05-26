# Adendo Visual Observatory Dark Cards — Módulo Financiamento Imobiliário
## Item 14F-F8C-v6.3

**Status:** pendente_aprovacao_po
**Base contratual obrigatória:** F8C-v6.2
**Implementação React autorizada:** NÃO
**Aceite visual humano:** PENDENTE — depende exclusivamente do PO (Moisés)
**Data:** 2026-05-26

---

## 1. Propósito e escopo

Este adendo formaliza o padrão visual **Observatory Dark Cards** como contrato bloqueante para a futura implementação React do módulo Financiamento Imobiliário do PEF. A fonte visual primária é o arquivo `guia-prompt-checklist.html` aprovado pelo PO.

Este adendo é exclusivamente documental/contratual. Não há implementação React, não há alteração de frontend, não há alteração de backend, não há alteração de fórmulas financeiras.

---

## 2. Decisão visual obrigatória — fontes

A futura implementação React do módulo Imóvel **deve** usar:

```
DM Sans — para textos gerais, títulos, labels, notas, botões, corpo textual.
DM Mono — para números, valores financeiros, códigos, labels técnicos, blocos de cálculo, exemplos, watermarks numéricos.
```

**Justificativa:** A fidelidade ao padrão de cards aprovado pelo PO depende da combinação DM Sans + DM Mono, pois o desenho visual usa texto limpo para leitura geral e fonte monoespaçada para números, scores, valores financeiros, barras, labels técnicos e blocos de cálculo.

Esta decisão substitui, para o módulo Imóvel, a preferência anterior por Manrope quando houver conflito visual.

**Proibido:**
- Substituir DM Sans por qualquer outra fonte sem decisão explícita e documentada do PO.
- Substituir DM Mono por qualquer outra fonte sem decisão explícita e documentada do PO.
- Usar fonte genérica "sans-serif" ou "monospace" sem especificar DM Sans / DM Mono.

---

## 3. Regra de fidelidade visual — BLOQUEANTE

A futura implementação React deve reproduzir os cards da referência com **fidelidade visual controlada**.

### 3.1. Proibição de interpretação livre

É expressamente proibido substituir a referência por:

- "algo parecido"
- "inspiração visual"
- "estilo aproximado"
- "variação criativa"
- "adaptação livre"
- "tema escuro genérico"
- "cards modernos" sem métricas objetivas
- cores alternativas sem decisão do PO
- fontes alternativas sem decisão do PO
- espaçamentos alternativos sem justificativa documental
- tamanhos de fonte improvisados

A regra correta: usar o arquivo `guia-prompt-checklist.html` e as imagens aprovadas pelo PO como referência visual determinística.

### 3.2. Tolerância visual permitida

A futura implementação poderá variar apenas quando necessário por responsividade ou integração ao layout real, respeitando:

- Nenhuma troca de fonte sem decisão explícita do PO.
- Nenhuma troca de token de cor sem decisão explícita do PO.
- Nenhuma mudança de hierarquia tipográfica sem justificativa documentada.
- Nenhuma mudança de padding/radius/gap fora da tabela de tokens.
- Nenhuma mudança estrutural dos cards sem atualização do contrato e aceite humano.

---

## 4. Tokens de cor obrigatórios

Extraídos literalmente do `guia-prompt-checklist.html`:

| Token | Valor | Uso principal |
|---|---|---|
| `--bg` | `#030811` | Fundo geral da página |
| `--surface` | `#0a1628` | Fundo dos cards |
| `--surface2` | `#0f1e35` | Fundo de elementos internos, badges |
| `--border` | `#1a2f50` | Bordas padrão, fundos de barras |
| `--accent` | `#3b82f6` | Azul principal, links, números de checklist |
| `--accent2` | `#06b6d4` | Ciano, labels de seção, tags, eyebrow |
| `--gold` | `#f59e0b` | Dourado, exemplos, highlights, insights |
| `--green` | `#10b981` | Verde, vencedor, after card, borda destacada |
| `--red` | `#ef4444` | Vermelho, before card, valores negativos |
| `--text` | `#e2e8f0` | Texto principal |
| `--text-muted` | `#64748b` | Texto mutado (footer, metadados) |
| `--text-dim` | `#94a3b8` | Texto dimmed (notas, labels secundários) |

**Proibido:** substituir esses tokens por "azul aproximado", "verde parecido", "cinza escuro" ou tokens genéricos.

---

## 5. Escala tipográfica obrigatória

Extraída literalmente do `guia-prompt-checklist.html`:

### Body
- font-family: DM Sans
- font-size: 15px
- line-height: 1.6
- color: `#e2e8f0`

### Header eyebrow
- font-family: DM Mono
- font-size: 0.7rem
- letter-spacing: 0.15em
- text-transform: uppercase
- color: `#06b6d4`

### Header h1
- font-family: DM Sans
- font-size: 2rem
- font-weight: 700
- letter-spacing: -0.02em
- color: `#ffffff`

### Header subtitle
- font-family: DM Sans
- font-size: 0.9rem
- color: `#94a3b8`

### Section h2
- font-family: DM Sans
- font-size: 1.1rem
- font-weight: 700
- letter-spacing: 0.06em
- text-transform: uppercase
- color: `#06b6d4`

### Score label
- font-family: DM Sans
- font-size: 0.78rem
- font-weight: 700
- letter-spacing: 0.08em
- text-transform: uppercase
- color: `#94a3b8`

### Score value
- font-family: DM Mono
- font-size: 2.4rem
- font-weight: 500
- line-height: 1

### Score note
- font-family: DM Sans
- font-size: 0.78rem
- color: `#94a3b8`

### Task name
- font-family: DM Sans
- font-size: 0.85rem
- font-weight: 700
- letter-spacing: 0.05em
- text-transform: uppercase
- color: `#3b82f6`

### Mini label
- font-family: DM Sans
- font-size: 0.75rem
- color: `#94a3b8`

### Mini value
- font-family: DM Mono
- font-size: 0.75rem
- text-align: right
- color: `#94a3b8`

### Checklist header
- font-family: DM Sans
- font-size: 0.85rem
- font-weight: 700
- letter-spacing: 0.06em
- text-transform: uppercase
- color: `#06b6d4`

### Checklist number
- font-family: DM Mono
- font-size: 0.9rem
- font-weight: 500
- color: `#3b82f6`

### Checklist field
- font-family: DM Sans
- font-size: 0.82rem
- font-weight: 700
- color: `#e2e8f0`

### Checklist description
- font-family: DM Sans
- font-size: 0.82rem
- color: `#94a3b8`

### Checklist example
- font-family: DM Mono
- font-size: 0.75rem
- color: `#f59e0b`

### Before/After top
- font-family: DM Sans
- font-size: 0.78rem
- font-weight: 700
- letter-spacing: 0.08em
- text-transform: uppercase

### Before/After body
- font-family: DM Mono
- font-size: 0.8rem
- line-height: 1.7
- color: `#94a3b8`

### Question title
- font-family: DM Mono
- font-size: 0.7rem
- letter-spacing: 0.1em
- text-transform: uppercase
- color: `#3b82f6`

### Question text
- font-family: DM Sans
- font-size: 0.9rem
- font-weight: 600
- color: `#ffffff`

### Question hint
- font-family: DM Sans
- font-size: 0.78rem
- color: `#94a3b8`

### Apply tag
- font-family: DM Sans
- font-size: 0.7rem
- font-weight: 700
- letter-spacing: 0.06em
- text-transform: uppercase
- color: `#06b6d4`

### Apply title
- font-family: DM Sans
- font-size: 0.9rem
- font-weight: 700

### Apply prompt/block
- font-family: DM Mono
- font-size: 0.75rem
- line-height: 1.7
- color: `#f59e0b`

---

## 6. Tokens de layout obrigatórios

Extraídos literalmente do `guia-prompt-checklist.html`:

```
main max-width: 1100px
main padding desktop: 2.5rem 3rem 4rem

section margin-bottom: 3rem

score-grid:
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 1rem

task-grid:
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 1rem

ba-grid:
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 1.2rem

q-grid:
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 1rem

apply-grid:
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 1rem
```

**Responsividade:** deve preservar proporção e alinhamento. Nunca destruir a identidade dos cards em telas menores.

---

## 7. Regra de distribuição textual interna — BLOQUEANTE

Textos dentro dos cards devem ser distribuídos como na referência:

- Label superior curto.
- Valor ou título em destaque abaixo do label.
- Corpo textual abaixo com line-height confortável (mínimo 1.6).
- Notas sempre abaixo da barra ou conteúdo principal.
- Exemplos técnicos em bloco separado (DM Mono, fundo gold tênue).
- Valores numéricos alinhados à direita quando em linhas de métrica.
- Labels alinhados à esquerda.
- Nenhum card pode parecer "amontoado".
- Nenhum texto pode encostar visualmente na borda.
- Cards do mesmo grupo devem ter altura visual equivalente.
- Grids devem manter alinhamento horizontal entre cards vizinhos.
- Títulos devem usar caixa alta e letter-spacing quando a referência usar.
- Números financeiros devem usar DM Mono obrigatoriamente.

---

## 8. Nomenclatura bloqueante

```
CORRETO:   SAC x PRICE   (letra x minúscula)
PROIBIDO:  SAC [U+00D7] PRICE   (sinal de multiplicação Unicode, não usar)
PROIBIDO:  SAC sozinho sem PRICE
PROIBIDO:  PRICE sozinho sem SAC quando a comparação estiver sendo referenciada
```

Esta regra é herdada diretamente da F8C-v6.2 e reafirmada aqui como BLOQUEANTE.

---

## 9. Cenário financeiro fixo — herdado da F8C-v6.2 — BLOQUEANTE

```
Imóvel:           R$ 870.000,00
Entrada:          R$ 700.000,00
Financiado:       R$ 170.000,00
Prazo:            120 meses
Taxa mensal:      0,85% a.m.
Encargos mensais: R$ 205,00
Encargos totais:  R$ 24.600,00
```

Esses valores são fixos para fins educacionais. Não alterar.

---

## 10. Declarações obrigatórias

- A implementação React do módulo Imóvel ainda NÃO está autorizada.
- Este adendo é documental. Nenhum código de frontend ou backend foi alterado.
- O aceite visual humano ainda depende de Moisés (PO).
- A IA executora não pode declarar aceite visual.
- A IA executora não pode declarar Sprint 5 liberada.
- A F8C-v6.2 permanece como contrato-base obrigatório e não foi enfraquecida.
