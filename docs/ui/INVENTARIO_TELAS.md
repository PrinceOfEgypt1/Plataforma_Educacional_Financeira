# Inventário de Telas, Estados e Superfícies — Plataforma Educacional Financeira

**Versão:** 1.1 | **Sprint da última revisão:** 1 | **Status:** VIVO
**Prioridade P0** = Sprint 0-1 | **P1** = Sprint 2-3 | **P2** = Sprint 4+

---

## 1. Estrutura de navegação (slugs canônicos — Doc 06 + PLANO Sprint 1 §5.4)

A partir da Sprint 1, a estrutura é materializada no App Router do Next.js
sob o grupo `src/app/(app)/`, garantindo que todas as rotas compartilhem o
shell navegável (`ShellLayout` + sidebar + header + main + footer + banner
educacional). Os slugs abaixo são **os 12 módulos canônicos** — qualquer
divergência com o Doc 06 §4 deve ser corrigida neste documento.

```
/                                  → Home (grid com 12 módulos)
/diagnostico                       → Diagnóstico financeiro
/juros                             → Simulador de Juros (simples/compostos)
/amortizacao                       → Simulador PRICE / SAC / SAM
/financiamento-imobiliario         → Financiamento imobiliário
/financiamento-veiculo             → Financiamento de veículos
/consignado                        → Empréstimo consignado
/cdc                               → CDC (crédito direto ao consumidor)
/cartao-rotativo                   → Cartão de crédito — rotativo
/atraso                            → Juros de atraso e multas
/indicadores                       → Selic, IPCA, CDI, TR
/investir-vs-quitar                → Comparativo "investir vs. quitar"
/educacao                          → Conteúdo educacional contextual
```

> **Histórico de consolidação.** A v1.0 deste documento listava
> `/financiamento` (consolidado) e `/emprestimos` (consolidado) — a Sprint 1
> promoveu a separação canônica do Doc 06 em `/financiamento-imobiliario`
> vs `/financiamento-veiculo` e em `/consignado` vs `/cdc`. A rota de cartão
> passa a ser **`/cartao-rotativo`** (antes `/cartao`), explicitando o tipo
> de produto financeiro tratado.

---

## 2. Telas e estados mínimos obrigatórios

### 2.1 Layout base (todas as telas) — P0

| Estado | Componente | Descrição |
|--------|-----------|-----------|
| default | `<RootLayout>` | HTML, lang=pt-BR, metadados SEO |
| default | `<EducationalNotice>` | Banner persistente "produto educacional" (Doc 18) |
| default | `<Header>` | Logo + breadcrumb derivado do pathname |
| default | `<Sidebar>` | Navegação por grupos semânticos (9 grupos, 12 módulos) |
| default | `<Footer>` | Links legais + aviso educacional |
| default | `<MainContent>` | Área principal com padding responsivo |

### 2.2 Home (/) — P0 — **materializada na Sprint 1**

| Estado | Descrição |
|--------|-----------|
| `default` | Grid de cards com os 12 módulos (1 col mobile, 2 col sm, 3 col lg) |
| `loading` | `LoadingState` reutilizável (quando carregado via API — futuro) |
| `empty` | `EmptyState` reutilizável |

### 2.3 Simulador de Juros (/juros) — P0

| Estado | Descrição |
|--------|-----------|
| `idle` | Formulário com campos vazios + botão calcular desabilitado |
| `valid` | Formulário preenchido corretamente + botão calcular habilitado |
| `invalid` | Campo(s) com erro + mensagem de validação inline |
| `loading` | Spinner + botão desabilitado durante chamada à API |
| `success` | Resultado com `<SummaryCard>`, tabela, gráfico e interpretação |
| `error` | `ErrorState` com mensagem da API (RFC 7807) + botão tentar novamente |
| `empty` | `EmptyState` (pré-cálculo) |

### 2.4 Simulador de Amortização (/amortizacao) — P0

| Estado | Descrição |
|--------|-----------|
| `idle` | Formulário + seletor PRICE/SAC/SAM |
| `valid` | Formulário válido com tipo selecionado |
| `invalid` | Validação inline por campo |
| `loading` | Processando tabela de amortização |
| `success` | Tabela de parcelas + gráfico saldo devedor + interpretação |
| `error` | Erro de cálculo com mensagem compreensível (RFC 7807) |
| `comparison` | Vista lado a lado PRICE vs SAC (P1) |

### 2.5 Módulos de Financiamento, Empréstimos, Cartão, Atraso — P1

Cada módulo segue o mesmo contrato de estados:

| Estado | Obrigatório |
|--------|-------------|
| `idle` | ✅ |
| `valid` / `invalid` | ✅ |
| `loading` | ✅ (`LoadingState`) |
| `success` | ✅ (com `SummaryCard` + interpretação + `AlertBanner` quando aplicável) |
| `error` | ✅ (`ErrorState`, RFC 7807 — mensagem humana) |
| `empty` | ✅ (`EmptyState`) |
| `unavailable` | ✅ (quando serviço externo indisponível, ex.: Selic) |

### 2.6 Indicadores (/indicadores) — P1

| Estado | Descrição |
|--------|-----------|
| `loading` | Buscando taxas da API/fonte oficial |
| `success` | Selic, IPCA, CDI, TR com fonte e data-base |
| `stale` | Dados desatualizados (> 24h) com aviso |
| `error` | Indisponível + última leitura em cache |
| `unavailable` | Fonte offline — exibe aviso e última leitura |

### 2.7 Exportação (modal/drawer) — P2

| Estado | Descrição |
|--------|-----------|
| `idle` | Opções: PDF, Excel |
| `generating` | Gerando arquivo |
| `ready` | Link de download |
| `error` | Falha na geração |

---

## 3. Padrões de estado obrigatórios por superfície

Todo componente de cálculo DEVE implementar o contrato
`status × data × message × code` abaixo:

```typescript
type ComponentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ResultadoCalculo }
  | { status: "error"; message: string; code?: string }
  | { status: "empty" }
  | { status: "unavailable"; reason: string };
```

A Sprint 1 entregou **3 componentes visuais reutilizáveis** para renderizar
esses estados: `LoadingState`, `ErrorState`, `EmptyState`
(`frontend/src/components/states/`). A API é uniforme
`{title, description, action?}` e cada um já inclui as ARIA-landmarks
corretas (`role="status"` ou `role="alert"` conforme o caso).

---

## 4. Breakpoints obrigatórios

| Breakpoint | Largura | Obrigatório |
|-----------|---------|-------------|
| mobile | 375px | ✅ P0 |
| tablet | 768px | ✅ P0 |
| desktop | 1280px | ✅ P0 |
| wide | 1920px | desejável P1 |

---

## 5. Acessibilidade mínima (obrigatória em P0)

- Navegação completa por teclado (Tab, Enter, Escape).
- axe-core: zero violações `serious` ou `critical`.
- ARIA labels em formulários e resultados.
- Contraste mínimo WCAG AA (4.5:1 para texto normal).
- `lang="pt-BR"` no elemento html.
- Foco visível em todos os elementos interativos.
- `ShellLayout` com todas as landmarks canônicas presentes: `banner`,
  `navigation`, `main`, `contentinfo`, `complementary` (no `EducationPanel`).

---

## 6. Status de implementação por sprint

| Tela | Sprint 0 | Sprint 1 | Sprint 2 |
|------|----------|----------|----------|
| Layout base + RootLayout | scaffold | ✅ real (ShellLayout + sidebar + header + footer + banner) | — |
| Home (/) | scaffold | ✅ real (grid dos 12 módulos) | — |
| /diagnostico | — | 🟡 shell + "em construção" + `EmptyState` + `EducationPanel` | P1 |
| /juros | — | 🟡 shell + "em construção" | P0 |
| /amortizacao | — | 🟡 shell + "em construção" | P0 |
| /financiamento-imobiliario | — | 🟡 shell + "em construção" | P1 |
| /financiamento-veiculo | — | 🟡 shell + "em construção" | P1 |
| /consignado | — | 🟡 shell + "em construção" | P1 |
| /cdc | — | 🟡 shell + "em construção" | P1 |
| /cartao-rotativo | — | 🟡 shell + "em construção" | P1 |
| /atraso | — | 🟡 shell + "em construção" | P1 |
| /indicadores | — | 🟡 shell + "em construção" | P1 |
| /investir-vs-quitar | — | 🟡 shell + "em construção" | P2 |
| /educacao | — | 🟡 shell + "em construção" | P1 |

Legenda: ✅ implementado · 🟡 shell navegável + placeholder educativo (Sprint 1) · P0/P1/P2 = prioridade para materialização real.
