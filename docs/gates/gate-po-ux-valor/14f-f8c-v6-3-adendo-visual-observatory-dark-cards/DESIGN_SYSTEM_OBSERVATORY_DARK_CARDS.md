# Design System Observatory Dark Cards
## Item 14F-F8C-v6.3 — Módulo Financiamento Imobiliário — PEF

**Status:** pendente_aprovacao_po
**Fonte visual:** guia-prompt-checklist.html (aprovado pelo PO)
**Implementação React autorizada:** NÃO
**Data:** 2026-05-26

---

## 1. Identidade visual

O padrão **Observatory Dark Cards** é caracterizado por:

- Fundo escuro premium (`#030811`) com gradiente sutil.
- Cards navy (`#0a1628`) com bordas azuladas sutis (`#1a2f50`).
- Borda verde/ciano em cards destacados (vencedor, after).
- Títulos pequenos em caixa alta com letter-spacing.
- Números grandes em fonte monoespaçada (DM Mono).
- Textos internos bem distribuídos com respiro adequado.
- Barras horizontais finas para métricas visuais.
- Tags pequenas e brilhantes com fundo semi-transparente.
- Grid rigoroso com alturas padronizadas.
- Espaçamento interno elegante.
- Cores fortes, brilhantes e controladas (sem paleta genérica).
- Alinhamento limpo e consistente.

---

## 2. Paleta de cores — tokens obrigatórios

Fonte: bloco `:root` literal do `guia-prompt-checklist.html`.

```css
--bg:         #030811;   /* fundo geral */
--surface:    #0a1628;   /* fundo de cards */
--surface2:   #0f1e35;   /* fundo de elementos internos */
--border:     #1a2f50;   /* bordas padrão, fundos de barras */
--accent:     #3b82f6;   /* azul principal */
--accent2:    #06b6d4;   /* ciano — seções, tags, eyebrow */
--gold:       #f59e0b;   /* dourado — exemplos, insights */
--green:      #10b981;   /* verde — vencedor, after */
--red:        #ef4444;   /* vermelho — before, negativo */
--text:       #e2e8f0;   /* texto principal */
--text-muted: #64748b;   /* texto mutado */
--text-dim:   #94a3b8;   /* texto dimmed — notas, labels */
```

### Uso de transparências controladas

Extraídas literalmente da referência:

| Uso | Valor |
|---|---|
| Checklist header gradient start | `rgba(59,130,246,.15)` |
| Checklist header gradient end | `rgba(6,182,212,.08)` |
| Score card winner shadow | `rgba(16,185,129,.12)` |
| Insight box gradient start | `rgba(245,158,11,.08)` |
| Insight box gradient end | `rgba(245,158,11,.03)` |
| Insight border | `rgba(245,158,11,.25)` |
| Apply tag background | `rgba(6,182,212,.1)` |
| Apply tag border | `rgba(6,182,212,.25)` |
| Apply prompt background | `rgba(245,158,11,.05)` |
| Checklist example background | `rgba(245,158,11,.06)` |
| Question watermark color | `rgba(59,130,246,.06)` |
| Header radial gradient | `rgba(59,130,246,.08)` |

---

## 3. Tipografia — sistema completo

### 3.1. Fontes obrigatórias

```
DM Sans  — textos gerais (Google Fonts: wght 300, 500, 700; ital 300)
DM Mono  — números e técnico (Google Fonts: wght 400, 500)
```

Import obrigatório:
```
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,500;0,700;1,300&family=DM+Mono:wght@400;500&display=swap');
```

### 3.2. Escala tipográfica completa

| Elemento | font-family | font-size | font-weight | line-height | letter-spacing | text-transform | color |
|---|---|---|---|---|---|---|---|
| Body | DM Sans | 15px | — | 1.6 | — | — | `#e2e8f0` |
| Header eyebrow | DM Mono | 0.7rem | — | — | 0.15em | uppercase | `#06b6d4` |
| Header h1 | DM Sans | 2rem | 700 | — | -0.02em | — | `#ffffff` |
| Header subtitle | DM Sans | 0.9rem | — | — | — | — | `#94a3b8` |
| Section h2 | DM Sans | 1.1rem | 700 | — | 0.06em | uppercase | `#06b6d4` |
| Score label | DM Sans | 0.78rem | 700 | — | 0.08em | uppercase | `#94a3b8` |
| Score value | DM Mono | 2.4rem | 500 | 1 | — | — | varia por estado |
| Score note | DM Sans | 0.78rem | — | — | — | — | `#94a3b8` |
| Task name | DM Sans | 0.85rem | 700 | — | 0.05em | uppercase | `#3b82f6` |
| Mini label | DM Sans | 0.75rem | — | — | — | — | `#94a3b8` |
| Mini value | DM Mono | 0.75rem | — | — | — | — | `#94a3b8` |
| Checklist header | DM Sans | 0.85rem | 700 | — | 0.06em | uppercase | `#06b6d4` |
| Checklist number | DM Mono | 0.9rem | 500 | — | — | — | `#3b82f6` |
| Checklist field | DM Sans | 0.82rem | 700 | — | — | — | `#e2e8f0` |
| Checklist description | DM Sans | 0.82rem | — | — | — | — | `#94a3b8` |
| Checklist example | DM Mono | 0.75rem | — | — | — | — | `#f59e0b` |
| Before/After top | DM Sans | 0.78rem | 700 | — | 0.08em | uppercase | varia (red/green) |
| Before/After body | DM Mono | 0.8rem | — | 1.7 | — | — | `#94a3b8` |
| Question title | DM Mono | 0.7rem | — | — | 0.1em | uppercase | `#3b82f6` |
| Question text | DM Sans | 0.9rem | 600 | — | — | — | `#ffffff` |
| Question hint | DM Sans | 0.78rem | — | — | — | — | `#94a3b8` |
| Apply tag | DM Sans | 0.7rem | 700 | — | 0.06em | uppercase | `#06b6d4` |
| Apply title | DM Sans | 0.9rem | 700 | — | — | — | `#e2e8f0` |
| Apply block | DM Mono | 0.75rem | — | 1.7 | — | — | `#f59e0b` |

---

## 4. UI Elements — especificação por componente

### 4.1. Score Card

**Uso no módulo Imóvel:** valor do imóvel, entrada, valor financiado, prazo, taxa mensal, encargos, resultado principal, comparação SAC x PRICE.

```
container:
  background:    #0a1628
  border:        1px solid #1a2f50
  border-radius: 12px
  padding:       1.4rem 1.2rem
  transition:    transform .2s

label:
  font-size:      0.78rem
  font-weight:    700
  letter-spacing: 0.08em
  text-transform: uppercase
  color:          #94a3b8
  margin-bottom:  0.6rem

value:
  font-family:   DM Mono
  font-size:     2.4rem
  font-weight:   500
  line-height:   1
  margin-bottom: 0.8rem

score-bar:
  height:        6px
  border-radius: 3px
  background:    #1a2f50
  overflow:      hidden
  margin-bottom: 0.6rem

score-fill:
  height:        100%
  border-radius: 3px

note:
  font-size: 0.78rem
  color:     #94a3b8
```

**Estado comum:**
- border: `1px solid #1a2f50`
- sem box-shadow

**Estado destacado (winner/green):**
- border-color: `#10b981`
- box-shadow: `0 0 20px rgba(16,185,129,.12)`
- score-value color: `#10b981`
- máximo 2 cards destacados por tela

**Estado ciano (alternativo):**
- border-color: `#06b6d4`
- box-shadow equivalente ciano controlado

---

### 4.2. Task / Metric Card

**Uso no módulo Imóvel:** métricas comparativas SAC x PRICE, barras de progresso por tipo de tarefa/cenário.

```
container:
  background:    #0a1628
  border:        1px solid #1a2f50
  border-radius: 12px
  padding:       1.2rem 1.4rem

task-name:
  font-weight:    700
  font-size:      0.85rem
  letter-spacing: 0.05em
  text-transform: uppercase
  margin-bottom:  1rem
  color:          #3b82f6

mini-bar-row:
  display:        flex
  align-items:    center
  gap:            0.7rem
  margin-bottom:  0.45rem

mini-label:
  font-size:  0.75rem
  color:      #94a3b8
  width:      100px
  flex-shrink: 0

mini-bar:
  flex:          1
  height:        8px
  background:    #1a2f50
  border-radius: 4px
  overflow:      hidden

mini-fill:
  height:        100%
  border-radius: 4px

mini-val:
  font-family: DM Mono
  font-size:   0.75rem
  width:       32px
  text-align:  right
  color:       #94a3b8
```

---

### 4.3. Checklist Card

**Uso no módulo Imóvel:** checklists de verificação por etapa, memória de cálculo, conferência de documentos.

```
container:
  background:    #0a1628
  border:        1px solid #3b82f6
  border-radius: 14px
  overflow:      hidden

header:
  background:    linear-gradient(90deg, rgba(59,130,246,.15), rgba(6,182,212,.08))
  padding:       1rem 1.4rem
  border-bottom: 1px solid #1a2f50
  font-weight:   700
  font-size:     0.85rem
  letter-spacing: 0.06em
  text-transform: uppercase
  color:          #06b6d4

row:
  display:               grid
  grid-template-columns: 30px 160px 1fr
  gap:                   1rem
  align-items:           start
  padding:               1rem 1.4rem
  border-bottom:         1px solid #1a2f50

row (last-child):
  border-bottom: none

check-num:
  font-family: DM Mono
  font-size:   0.9rem
  color:       #3b82f6
  font-weight: 500

check-field:
  font-weight: 700
  font-size:   0.82rem
  color:       #e2e8f0

check-desc:
  font-size: 0.82rem
  color:     #94a3b8

check-example:
  font-family:    DM Mono
  font-size:      0.75rem
  color:          #f59e0b
  background:     rgba(245,158,11,.06)
  border-radius:  6px
  padding:        0.3rem 0.6rem
  display:        inline-block
  margin-top:     0.3rem
```

---

### 4.4. Before / After Card

**Uso no módulo Imóvel:** comparação visual SAC x PRICE (antes/depois, cenário desfavorável vs favorável).

```
grid:
  display:               grid
  grid-template-columns: 1fr 1fr
  gap:                   1.2rem

before-card:
  background:    #0a1628
  border-radius: 12px
  border:        1px solid #1a2f50
  overflow:      hidden

after-card:
  background:    #0a1628
  border-radius: 12px
  border:        1px solid #10b981
  overflow:      hidden

top:
  display:        flex
  align-items:    center
  gap:            0.5rem
  padding:        0.8rem 1.2rem
  border-bottom:  1px solid #1a2f50
  font-size:      0.78rem
  font-weight:    700
  letter-spacing: 0.08em
  text-transform: uppercase

before-top color: #ef4444
after-top color:  #10b981

body:
  padding:     1.1rem 1.2rem
  font-family: DM Mono
  font-size:   0.8rem
  line-height: 1.7
  color:       #94a3b8
```

**BLOQUEANTE:** A nomenclatura "SAC x PRICE" (com letra x) deve ser usada. Proibido usar sinal de multiplicação Unicode.

---

### 4.5. Question / Decision Card

**Uso no módulo Imóvel:** perguntas de decisão por etapa (Preparar, Simular, Decidir), orientações ao usuário.

```
container:
  background:    #0a1628
  border:        1px solid #1a2f50
  border-radius: 12px
  padding:       1.4rem 1.2rem
  position:      relative
  overflow:      hidden

watermark:
  position:    absolute
  top:         -0.2rem
  right:       0.6rem
  font-family: DM Mono
  font-size:   4rem
  font-weight: 700
  color:       rgba(59,130,246,.06)
  line-height: 1
  content:     attr(data-n)  /* número ordinal da pergunta */

q-title:
  font-family:    DM Mono
  font-size:      0.7rem
  letter-spacing: 0.1em
  text-transform: uppercase
  color:          #3b82f6
  margin-bottom:  0.5rem

q-text:
  font-size:     0.9rem
  font-weight:   600
  color:         #ffffff
  margin-bottom: 0.5rem

q-hint:
  font-size: 0.78rem
  color:     #94a3b8
```

---

### 4.6. Insight Box

**Uso no módulo Imóvel:** destaques pedagógicos, avisos importantes, insights financeiros por etapa.

```
container:
  background:  linear-gradient(135deg, rgba(245,158,11,.08), rgba(245,158,11,.03))
  border:      1px solid rgba(245,158,11,.25)
  border-radius: 12px
  padding:     1.1rem 1.4rem
  display:     flex
  gap:         0.9rem
  align-items: flex-start

icon:
  font-size:  1.3rem
  flex-shrink: 0

text:
  font-size:   0.85rem
  color:       #94a3b8
  line-height: 1.6

text strong:
  color: #f59e0b
```

---

### 4.7. Apply / Action Card

**Uso no módulo Imóvel:** cards de ação por etapa, orientações operacionais, blocos de fórmula/cálculo.

```
container:
  background:    #0a1628
  border:        1px solid #1a2f50
  border-radius: 12px
  padding:       1.2rem 1.4rem

tag:
  display:        inline-block
  background:     rgba(6,182,212,.1)
  border:         1px solid rgba(6,182,212,.25)
  border-radius:  6px
  padding:        0.15rem 0.5rem
  font-size:      0.7rem
  font-weight:    700
  letter-spacing: 0.06em
  text-transform: uppercase
  color:          #06b6d4
  margin-bottom:  0.7rem

title:
  font-weight:   700
  font-size:     0.9rem
  margin-bottom: 0.4rem

internal-block:
  font-family:  DM Mono
  font-size:    0.75rem
  color:        #f59e0b
  background:   rgba(245,158,11,.05)
  border-radius: 8px
  padding:      0.7rem 0.9rem
  line-height:  1.7
  margin-top:   0.6rem
```

---

## 5. Layout tokens

```
main max-width:        1100px
main padding desktop:  2.5rem 3rem 4rem
section margin-bottom: 3rem

score-grid:
  display:               grid
  grid-template-columns: repeat(3, 1fr)
  gap:                   1rem

task-grid:
  display:               grid
  grid-template-columns: repeat(2, 1fr)
  gap:                   1rem

ba-grid:
  display:               grid
  grid-template-columns: 1fr 1fr
  gap:                   1.2rem

q-grid:
  display:               grid
  grid-template-columns: repeat(3, 1fr)
  gap:                   1rem

apply-grid:
  display:               grid
  grid-template-columns: repeat(2, 1fr)
  gap:                   1rem
```

---

## 6. Estados visuais dos cards

| Estado | Regra |
|---|---|
| Comum | border `1px solid #1a2f50`, sem shadow |
| Destacado verde | border-color `#10b981`, box-shadow `0 0 20px rgba(16,185,129,.12)` |
| Destacado ciano | border-color `#06b6d4`, box-shadow equivalente ciano |
| Before | border padrão, top color `#ef4444` |
| After | border `1px solid #10b981`, top color `#10b981` |
| Checklist | border `1px solid #3b82f6`, header com gradiente |
| Hover | transform: translateY(-2px) — apenas em Score Cards |

**Limite:** não mais que 2 cards destacados por tela simultânea.

---

## 7. Header da página

```
header:
  border-bottom: 1px solid #1a2f50
  padding:       2.5rem 3rem 2rem
  background:    linear-gradient(135deg, #030811 0%, #0a1628 100%)
  position:      relative
  overflow:      hidden

header::before (radial glow):
  background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(59,130,246,.08) 0%, transparent 70%)
```

---

## 8. Section h2 — linha decorativa

```
h2::after:
  content:    ''
  flex:       1
  height:     1px
  background: #1a2f50
```

O h2 usa `display: flex; align-items: center; gap: 0.6rem` para alinhar ícone, texto e linha.

---

## 9. Proibições formais

- Proibido usar Manrope no módulo Imóvel sem decisão explícita do PO.
- Proibido usar paleta de cores diferente dos tokens acima sem decisão do PO.
- Proibido usar border-radius diferente dos valores acima sem justificativa documental.
- Proibido usar padding/gap diferente dos valores acima sem justificativa documental.
- Proibido interpretar livremente qualquer elemento sem base na referência.
- Proibido implementar React sem aceite humano do PO.
- Proibido declarar aceite visual sem autorização do PO.
