# Inventário de Telas, Estados e Superfícies — Plataforma Educacional Financeira

**Versão:** 1.0 | **Sprint:** 0 | **Status:** VIVO
**Prioridade P0** = Sprint 0-1 | **P1** = Sprint 2-3 | **P2** = Sprint 4+

---

## 1. Estrutura de navegação (scaffold Sprint 0)
/                        → Home (lista de módulos)
/juros                   → Simulador de Juros Compostos
/amortizacao             → Simulador PRICE / SAC
/financiamento           → Financiamento imobiliário / veículos
/emprestimos             → Empréstimos e CET
/cartao                  → Cartão de crédito / rotativo
/atraso                  → Juros de atraso e multas
/indicadores             → Selic, IPCA, CDI, TR
/investir-vs-quitar      → Comparativo investir vs. quitar
/diagnostico             → Diagnóstico financeiro
/educacao/:slug          → Conteúdo educacional contextual

/                        → Home (lista de módulos)
/juros                   → Simulador de Juros Compostos
/amortizacao             → Simulador PRICE / SAC
/financiamento           → Financiamento imobiliário / veículos
/emprestimos             → Empréstimos e CET
/cartao                  → Cartão de crédito / rotativo
/atraso                  → Juros de atraso e multas
/indicadores             → Selic, IPCA, CDI, TR
/investir-vs-quitar      → Comparativo investir vs. quitar
/diagnostico             → Diagnóstico financeiro
/educacao/:slug          → Conteúdo educacional contextual

---

## 2. Telas e estados mínimos obrigatórios

### 2.1 Layout base (todas as telas) — P0

| Estado | Componente | Descrição |
|--------|-----------|-----------|
| default | `<RootLayout>` | HTML, lang=pt-BR, metadados SEO |
| default | `<EducationalNotice>` | Banner persistente "produto educacional" |
| default | `<Header>` | Logo + navegação principal |
| default | `<Footer>` | Links legais + aviso educacional |
| default | `<MainContent>` | Área principal com padding responsivo |

### 2.2 Home (/) — P0

| Estado | Descrição |
|--------|-----------|
| `default` | Grid de cards com todos os módulos disponíveis |
| `loading` | Skeleton loader (se módulos carregados via API) |
| `empty` | Mensagem quando nenhum módulo disponível |

### 2.3 Simulador de Juros (/juros) — P0

| Estado | Descrição |
|--------|-----------|
| `idle` | Formulário com campos vazios + botão calcular desabilitado |
| `valid` | Formulário preenchido corretamente + botão calcular habilitado |
| `invalid` | Campo(s) com erro + mensagem de validação inline |
| `loading` | Spinner + botão desabilitado durante chamada à API |
| `success` | Resultado com summary, tabela, gráfico e interpretação |
| `error` | Mensagem de erro da API + botão tentar novamente |
| `empty` | Estado inicial sem resultado (pré-cálculo) |

### 2.4 Simulador de Amortização (/amortizacao) — P0

| Estado | Descrição |
|--------|-----------|
| `idle` | Formulário + seletor PRICE/SAC/SAM |
| `valid` | Formulário válido com tipo selecionado |
| `invalid` | Validação inline por campo |
| `loading` | Processando tabela de amortização |
| `success` | Tabela de parcelas + gráfico saldo devedor + interpretação |
| `error` | Erro de cálculo com mensagem compreensível |
| `comparison` | Vista lado a lado PRICE vs SAC (P1) |

### 2.5 Módulos de Financiamento, Empréstimos, Cartão — P1

Cada módulo segue o mesmo contrato de estados:

| Estado | Obrigatório |
|--------|-------------|
| `idle` | ✅ |
| `valid` / `invalid` | ✅ |
| `loading` | ✅ |
| `success` | ✅ (com summary + interpretation + alerts) |
| `error` | ✅ (RFC 7807 — mensagem humana) |
| `empty` | ✅ |
| `unavailable` | ✅ (quando serviço externo indisponível, ex: Selic) |

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

Todo componente de cálculo DEVE implementar:

```typescript
type ComponentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ResultadoCalculo }
  | { status: "error"; message: string; code?: string }
  | { status: "empty" }
  | { status: "unavailable"; reason: string };
```

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

- Navegação completa por teclado (Tab, Enter, Escape)
- axe-core: zero violações `serious` ou `critical`
- ARIA labels em formulários e resultados
- Contraste mínimo WCAG AA (4.5:1 para texto normal)
- `lang="pt-BR"` no elemento html
- Foco visível em todos os elementos interativos

---

## 6. Status de implementação por sprint

| Tela | Sprint 0 | Sprint 1 | Sprint 2 |
|------|----------|----------|----------|
| Layout base + RootLayout | scaffold | real | — |
| Home (/) | scaffold | real | — |
| /juros | — | P0 | — |
| /amortizacao | — | P0 | — |
| /financiamento | — | — | P1 |
| /emprestimos | — | — | P1 |
| /cartao | — | — | P1 |
| /indicadores | — | — | P1 |
| /investir-vs-quitar | — | — | P2 |
| /diagnostico | — | — | P2 |
