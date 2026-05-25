# Design System Determinístico — Módulo Imóvel

**Item:** 14F-F8C-v6.2
**Escopo:** Tokens, tipografia, paleta, componentes, regras de uso
**Status:** Aguardando aprovação do PO

---

## 1. Fonte

**Família:** Manrope
**Fallback:** `system-ui, -apple-system, sans-serif`
**Import:** `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap`

Nenhuma outra fonte é permitida neste módulo.

---

## 2. Escala Tipográfica

| Token | `font-size` | `font-weight` | `line-height` | Uso |
|---|---|---|---|---|
| `--text-display` | 28px | 800 | 1.2 | Título principal de etapa |
| `--text-h1` | 22px | 700 | 1.3 | Título de seção |
| `--text-h2` | 18px | 700 | 1.35 | Título de card |
| `--text-h3` | 15px | 600 | 1.4 | Label de destaque |
| `--text-body` | 14px | 400 | 1.5 | Texto corrido |
| `--text-body-sm` | 13px | 400 | 1.5 | Texto auxiliar |
| `--text-caption` | 12px | 400 | 1.4 | Hints, rótulos menores |
| `--text-mono` | 13px | 500 | 1.4 | Fórmulas, código, valores tabelados |
| `--text-kpi` | 32px | 800 | 1.0 | Número principal de KPI |
| `--text-kpi-sm` | 22px | 700 | 1.1 | Número secundário de KPI |

**Proibido:** `font-size < 12px` em qualquer elemento visível.

---

## 3. Paleta de Cores — Tokens Obrigatórios

```css
:root {
  /* Fundos e estrutura */
  --navy:       #071B3A;
  --deep-blue:  #082A5E;
  --royal-blue: #2563EB;
  --indigo:     #29338C;

  /* Destaques e ação */
  --purple:     #6426A8;
  --violet:     #7C3AED;

  /* Dados financeiros */
  --green:      #0B5D3B;
  --teal:       #007C78;
  --cyan:       #0088A9;
  --gold:       #B77900;
  --orange:     #C76A00;

  /* Superfícies claras */
  --soft-bg:    #F2F6FB;
  --white:      #FFFFFF;

  /* Textos sobre escuro */
  --text-on-dark:      #FFFFFF;
  --text-on-dark-muted: rgba(255, 255, 255, 0.85);

  /* Textos sobre claro */
  --text-on-light:      #071B3A;
  --text-on-light-muted: #29338C;

  /* Bordas */
  --border-subtle:  rgba(255, 255, 255, 0.12);
  --border-card:    rgba(7, 27, 58, 0.12);
}
```

### 3.1 Semântica de Cores — Dados Financeiros

| Dado | Cor | Token |
|---|---|---|
| Saldo devedor | Azul marinho / índigo | `--navy` / `--indigo` |
| Juros | Roxo / violeta | `--purple` / `--violet` |
| Amortização | Verde escuro / teal | `--green` / `--teal` |
| Encargos | Dourado / laranja | `--gold` / `--orange` |
| Total pago | Azul forte | `--royal-blue` |
| Economia/vantagem | Verde escuro | `--green` |
| Alerta/atenção | Laranja | `--orange` |
| Erro/bloqueio | Derivado `#C0392B` | (não está na paleta — usar com moderação) |

### 3.2 Regra de Contraste — Absoluta

| Fundo | Texto obrigatório |
|---|---|
| `--navy` | `--text-on-dark` (#FFF) |
| `--deep-blue` | `--text-on-dark` (#FFF) |
| `--royal-blue` | `--text-on-dark` (#FFF) |
| `--indigo` | `--text-on-dark` (#FFF) |
| `--purple` | `--text-on-dark` (#FFF) |
| `--violet` | `--text-on-dark` (#FFF) |
| `--green` | `--text-on-dark` (#FFF) |
| `--teal` | `--text-on-dark` (#FFF) |
| `--cyan` | `--text-on-dark` (#FFF) |
| `--gold` | `--text-on-dark` (#FFF) |
| `--orange` | `--text-on-dark` (#FFF) |
| `--soft-bg` | `--text-on-light` (#071B3A) |
| `--white` | `--text-on-light` (#071B3A) |

**Proibido:** texto preto, `#000`, `#111`, `#222`, `#333` sobre qualquer fundo de cor escura ou saturada.

---

## 4. Tokens de Espaçamento

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
}
```

---

## 5. Tokens de Raio de Borda

```css
:root {
  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  14px;
  --radius-xl:  20px;
  --radius-pill: 9999px;
}
```

---

## 6. Tokens de Sombra

```css
:root {
  --shadow-card:    0 2px 12px rgba(7, 27, 58, 0.10);
  --shadow-modal:   0 8px 32px rgba(7, 27, 58, 0.18);
  --shadow-aurora:  0 0 32px rgba(124, 58, 237, 0.35), 0 0 64px rgba(37, 99, 235, 0.20);
}
```

---

## 7. Layout de Estrutura de Página

```
┌─────────────────────────────────────────────────────┐
│  HEADER (64px)  — logo + progresso geral             │
├─────────────────────────────────────────────────────┤
│  STEPPER (56px) — 7 etapas, horizontal               │
├─────────────────────────────────────────────────────┤
│  TAB BAR (48px) — abas internas da etapa ativa       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CONTEÚDO PRINCIPAL (~824px disponíveis)            │
│  padding: 16px 24px                                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│  NAV INFERIOR (56px) — Anterior | Próxima           │
└─────────────────────────────────────────────────────┘
```

**Total:** 64 + 56 + 48 + 824 + 56 = 1048px ≤ 1080px ✓
**Margem de segurança:** 32px (padding top/bottom do conteúdo)

---

## 8. Componente: Card Padrão

```
Estrutura:
  background: --white ou gradiente escuro (ver subtipo)
  border-radius: --radius-lg (14px)
  padding: --space-6 (24px)
  box-shadow: --shadow-card
  border: 1px solid --border-card

Variantes:
  card-light: bg --white, texto --text-on-light
  card-dark:  bg --navy / --deep-blue, texto --text-on-dark
  card-kpi:   bg gradiente linear(--deep-blue, --indigo), texto --text-on-dark
  card-alert: borda esquerda 4px --orange, bg --white, texto --text-on-light
  card-aurora: ver Seção 13
```

### 8.1 Card KPI

```
┌──────────────────────────────┐
│  [ícone SVG 24px]  Rótulo   │  ← --text-body-sm, --text-on-dark-muted
│                              │
│  R$ 170.000,00               │  ← --text-kpi, --text-on-dark
│                              │
│  sub-rótulo / variação       │  ← --text-caption, --text-on-dark-muted
└──────────────────────────────┘
bg: gradient(135deg, --deep-blue, --indigo)
```

---

## 9. Componente: Botão

### Variantes obrigatórias

| Variante | Background | Texto | Border | Uso |
|---|---|---|---|---|
| `btn-primary` | `--royal-blue` | `--white` | none | Ação principal |
| `btn-secondary` | transparent | `--royal-blue` | 2px `--royal-blue` | Ação secundária |
| `btn-ghost` | transparent | `--text-on-dark-muted` | 1px `--border-subtle` | Ação terciária |
| `btn-cta` | gradiente `--violet` → `--royal-blue` | `--white` | none (ver Aurora) | CTA principal Simular |
| `btn-danger` | `#C0392B` | `--white` | none | Ação destrutiva |

### Dimensões

```css
.btn {
  height: 44px;
  padding: 0 24px;
  border-radius: var(--radius-md);
  font-family: Manrope, system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
}
.btn:hover  { opacity: 0.88; }
.btn:active { transform: scale(0.98); }
.btn:focus-visible { outline: 2px solid var(--royal-blue); outline-offset: 2px; }
```

---

## 10. Componente: Tabs Internas (Tab Bar)

```
Altura: 48px
Background: --navy (ou gradiente navy → deep-blue)
Border-bottom: 2px solid --border-subtle

Tab item:
  padding: 0 20px
  font-size: 13px
  font-weight: 500
  cor normal: --text-on-dark-muted (rgba white 0.65)
  cor ativa: --white
  indicador ativo: borda inferior 2px --royal-blue (ou --violet)
  transition: color 0.2s ease

Regra: tabs não geram rolagem horizontal — se necessário, comprimir labels.
Máximo de 5 abas por etapa (todas as etapas respeitam isso).
```

---

## 11. Componente: Tabela Financeira

### Estrutura obrigatória

```
┌──────────────────────────────────────────────────────────────────┐
│  CABEÇALHO  │ Parcela │ Saldo Ini. │ Juros │ Amort. │ Encarg. │ Total │ Saldo Fin. │
│  bg: --navy, texto: --white, font-weight: 600, font-size: 13px  │
├──────────────────────────────────────────────────────────────────┤
│  linha ímpar: --white                                            │
│  linha par:   --soft-bg                                          │
│  texto: --text-on-light (navy), font-size: 13px                  │
│  valores monetários: text-align: right, font-variant: tabular    │
├──────────────────────────────────────────────────────────────────┤
│  RODAPÉ TOTAL │ bg: --deep-blue, texto: --white, font-weight:700 │
└──────────────────────────────────────────────────────────────────┘
```

### Regras absolutas

- Mostrar **uma tabela por vez** (nunca duas completas lado a lado).
- Fonte mínima: **13px**.
- Máximo de **8 a 10 linhas visíveis** por página — paginação interna obrigatória.
- **Sem scroll vertical** dentro da tabela.
- Valores monetários: alinhamento à direita, `font-variant-numeric: tabular-nums`.
- Colunas com `padding: 8px 12px` mínimo.
- Separação de linhas: `border-bottom: 1px solid rgba(0,0,0,0.06)`.
- Nunca espremida (tabela tem `min-width` que pode provocar scroll **horizontal** se necessário).

### Colunas mínimas obrigatórias

| Coluna | Cor semântica (cabeçalho) |
|---|---|
| Parcela (nº) | `--navy` |
| Saldo inicial | `--indigo` |
| Juros | `--purple` |
| Amortização | `--green` |
| Encargos | `--gold` |
| Total da parcela | `--royal-blue` |
| Saldo final | `--teal` |

### Paginador de tabela

```
[ < ]  Página 1 de 12  [ > ]
fonte: 13px, --text-on-light-muted
botões: --radius-sm, bg --soft-bg, borda --border-card
```

---

## 12. Componente: Formulário

### Grid obrigatório

```
Layout: CSS Grid, 2 colunas em desktop (≥1280px), 1 coluna em mobile
Gap: --space-5 (20px) vertical, --space-6 (24px) horizontal
```

### Field (unidade de formulário)

```
┌─────────────────────────────┐
│  Label  [hint?]             │  ← font-size: 13px, font-weight: 600, --text-on-light
│  ┌───────────────────────┐  │
│  │  Input / Select       │  │  ← height: 44px, border-radius: --radius-md
│  └───────────────────────┘  │
│  Hint ou erro               │  ← font-size: 12px, --text-caption
└─────────────────────────────┘
```

### Estados do Input

```css
input {
  height: 44px;
  padding: 0 12px;
  border: 1.5px solid rgba(7, 27, 58, 0.20);
  border-radius: var(--radius-md);
  font-family: Manrope, system-ui, sans-serif;
  font-size: 14px;
  color: var(--text-on-light);
  background: var(--white);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
input:focus {
  border-color: var(--royal-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  outline: none;
}
input.error {
  border-color: #C0392B;
}
```

### Regras absolutas para formulários

- Todos os campos com mesma altura (44px).
- Labels alinhados (sempre acima do campo, nunca flutuantes sem indicação clara).
- Unidades monetárias mostradas como prefix/suffix dentro do campo ou hint.
- Nenhum campo solto fora do grid.
- Nenhuma coluna quebrada.
- Distribuição entre abas: não mostrar todos os campos da etapa Simular em uma única aba.

---

## 13. Componente: Aurora Gradient Border

### Definição

O Aurora Gradient Border é uma borda animada com gradiente iridescente que confere aparência premium ao elemento.

### Implementação CSS

```css
.aurora-border {
  position: relative;
  border-radius: var(--radius-lg);
  padding: 2px; /* espessura da borda aurora */
  background: linear-gradient(135deg,
    #2563EB, #7C3AED, #0088A9, #6426A8, #2563EB
  );
  background-size: 300% 300%;
  animation: aurora-shift 4s ease infinite;
  box-shadow: var(--shadow-aurora);
}
.aurora-border > .aurora-inner {
  border-radius: calc(var(--radius-lg) - 2px);
  background: var(--deep-blue); /* ou cor do card interno */
  width: 100%;
  height: 100%;
}

@keyframes aurora-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-border {
    animation: none;
    background-size: 100% 100%;
  }
}
```

### Uso Permitido (máximo 2 elementos por tela)

| Elemento | Etapa |
|---|---|
| CTA principal "Simular" | Etapa 2 — Simular (aba Resumo) |
| Card principal de resultado | Etapa 3 — Resultado (aba Resumo) |
| Card vencedor/insight comparativo | Etapa 5 — Comparar (aba Resumo Comparativo) |
| Card de decisão final | Etapa 7 — Decidir (aba Conclusão) |
| Alerta educativo estratégico | Qualquer etapa, 1 por tela máximo |

### Proibições absolutas

- **Não aplicar** em todos os cards de uma tela.
- **Não aplicar** em tabela inteira nem em linhas de tabela.
- **Não aplicar** em inputs ou labels de formulário.
- **Não aplicar** em mais de 2 elementos na mesma tela.
- Brilho deve ser discreto e premium, nunca piscante ou agressivo.

---

## 14. Componente: Gráfico

### Regras gerais

- Gráficos devem **explicar, não decorar**.
- Legenda sempre visível e legível (font-size ≥ 12px).
- Escala legível sem microtexto.
- Cores consistentes com semântica financeira (Seção 3.1).
- Sempre acompanhados de interpretação pedagógica textual abaixo ou ao lado.
- Altura máxima: 280px quando compartilhando espaço com outros elementos; 360px quando é o elemento principal da tela.

### Gráficos Obrigatórios

| Gráfico | Etapa/Aba | Tipo | Dados |
|---|---|---|---|
| Comparação SAC x PRICE (total pago, juros, encargos) | 5 — Comparar / Gráfico | Barras agrupadas ou stacked | Total pago, juros totais, encargos totais |
| Evolução do saldo devedor | 4 — Entender / Saldo Devedor | Linha | Saldo SAC vs saldo PRICE ao longo dos 120 meses |
| Composição da parcela | 4 — Entender / Parcela | Área empilhada ou pizza de parcela específica | Amortização + Juros + Encargos da parcela selecionada |

### Paleta de Gráficos

| Série | Cor |
|---|---|
| SAC | `--royal-blue` (#2563EB) |
| PRICE | `--violet` (#7C3AED) |
| Juros | `--purple` (#6426A8) |
| Amortização | `--green` (#0B5D3B) |
| Encargos | `--gold` (#B77900) |
| Saldo | `--indigo` (#29338C) |
| Total | `--navy` (#071B3A) |

---

## 15. Tokens de Animação

```css
:root {
  --duration-fast:   100ms;
  --duration-normal: 200ms;
  --duration-slow:   350ms;
  --ease-default:    cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

Todas as transições de tabs, cards, hover e focus devem usar `--duration-normal` e `--ease-default`.

---

*Este design system é determinístico e obrigatório. Desvios requerem aprovação explícita do PO e registro formal de decisão.*
