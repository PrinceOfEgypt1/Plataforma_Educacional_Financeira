# Sprint 3.5/F1 - Evidencia diagnostico UI/UX

Data: 2026-05-03
Branch: `sprint-3.5/f1-uiux-diagnostico-plano-codex`

## 1. Documentos obrigatorios lidos

Foram lidos/inspecionados:

- `docs/sprints/sprint-03/validacao-oficial.md`
- `docs/sprints/sprint-03/relatorio-execucao.md`
- `docs/sprints/sprint-03/relatorio-forense.md`
- `docs/sprints/sprint-03/contexto-continuidade-pos-sprint-03.md`
- `docs/07_UX_UI_e_Navegacao.md`
- `docs/08_Conteudo_Educacional.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`
- `docs/ui/INVENTARIO_TELAS.md`
- `docs/16_Design_System.md`

Trechos materiais:

```text
docs/07_UX_UI_e_Navegacao.md:
- UX/UI deve cumprir papel de orientacao, pedagogico, analitico e emocional.
- Navegacao global preferencialmente com sidebar fixa no desktop e menu
  recolhivel em telas menores.
- Toda tela importante deve tratar estado inicial, carregamento, sucesso, vazio
  e erro.

docs/ui/INVENTARIO_TELAS.md:
- Breakpoints obrigatorios: mobile 375px, tablet 768px, desktop 1280px.
- Acessibilidade minima: navegacao por teclado, axe-core sem violacoes serious
  ou critical, labels/aria, contraste WCAG AA e foco visivel.

docs/sprints/sprint-03/relatorio-forense.md:
- Warning Recharts/jsdom permanece como residuo nao bloqueante.
```

## 2. Evidencias de superficies

### Shell mobile

Comando:

```bash
nl -ba frontend/src/components/shell/ShellLayout.tsx | sed -n '29,46p'
nl -ba frontend/src/components/shell/Header.tsx | sed -n '26,49p'
```

Saida material:

```text
ShellLayout.tsx:
29  <div
31    className="flex min-h-screen flex-col bg-slate-50"
34    <div className="flex flex-1 flex-col md:flex-row">
35      <aside className="hidden w-64 shrink-0 md:block">
36        <Sidebar {...pathnameProp} />
40      <main
44        className="flex-1 px-6 py-6"

Header.tsx:
27  <header
30    className="flex h-14 items-center justify-between
31               border-b border-slate-200 bg-white px-6"
33    <div className="flex min-w-0 items-center gap-2 text-sm">
46    <div className="text-xs text-slate-400" aria-hidden="true">
47      v1 · educacional
```

Analise: a sidebar some abaixo de `md`, e o header nao oferece menu mobile.

### Home desatualizada

Comando:

```bash
nl -ba 'frontend/src/app/(app)/page.tsx' | sed -n '34,68p'
nl -ba frontend/src/config/modules.ts | sed -n '73,96p'
```

Saida material:

```text
page.tsx:
36  <p className="mb-4 text-sm text-slate-500">
37    Nesta Sprint os módulos estão em construção — cada tela já entrega
38    contexto e aviso claro do que virá.
63  <span
67    Em construção

modules.ts:
74  id: "juros",
83  status: "disponivel",
86  id: "amortizacao",
95  status: "disponivel",
```

Analise: a home contradiz o status real dos modulos.

### Primitivas duplicadas

Comando:

```bash
nl -ba frontend/src/components/interest/formPrimitives.tsx | sed -n '26,151p'
nl -ba frontend/src/components/amortization/formPrimitives.tsx | sed -n '20,129p'
```

Saida material:

```text
interest/formPrimitives.tsx:
26  export function TextField({
106 export interface SubmitBarProps {
114 export function SubmitBar({

amortization/formPrimitives.tsx:
20  export function TextField({
98  export interface SubmitBarProps {
105 export function SubmitBar({ label, busy, onReset, hint }: SubmitBarProps) {
```

Analise: juros e amortizacao repetem o mesmo padrao visual em arquivos
separados, aumentando risco de drift.

### Graficos com hex fora de tokens

Comando:

```bash
grep -R -n -E '#[0-9a-fA-F]{3,8}' \
  frontend/src/styles frontend/src/components frontend/src/app | head -200
```

Saida material:

```text
frontend/src/components/interest/EvolucaoSaldoChart.tsx:36:  if (kind === "composto") return "var(--color-financial-positive, #0f766e)";
frontend/src/components/interest/EvolucaoSaldoChart.tsx:105:              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
frontend/src/components/interest/EvolucaoSaldoChart.tsx:112:                  fill: "#64748b",
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:26:  if (kind === "sac") return "var(--color-financial-positive, #16a34a)";
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:91:              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
frontend/src/app/globals.css:25:  color: #fff;
```

Analise: ha uso legitimo de hex nos tokens, mas tambem ha hex em graficos e
CSS global fora da fonte canonica.

### Estados existentes

Comando:

```bash
nl -ba frontend/src/components/states/LoadingState.tsx | sed -n '24,44p'
nl -ba frontend/src/components/states/ErrorState.tsx | sed -n '25,53p'
nl -ba frontend/src/components/states/EmptyState.tsx | sed -n '24,42p'
```

Saida material:

```text
LoadingState.tsx:
24  <div
26    role="status"
27    aria-live="polite"
28    aria-busy="true"

ErrorState.tsx:
25  return (
27    data-testid="error-state"
28    role="alert"

EmptyState.tsx:
24  return (
26    data-testid="empty-state"
27    role="status"
```

Analise: cobertura semantica existe, mas acabamento visual e ainda simples.

## 3. Evidencia ambiental de screenshot

Dev server iniciado para tentativa de evidencia visual:

```text
▲ Next.js 14.2.35
- Local:        http://127.0.0.1:3100
- Network:      http://127.0.0.1:3100
✓ Starting...
✓ Ready in 1357ms
GET / 200 in 1937ms
```

Tentativa real de screenshot com Playwright:

```bash
pnpm exec playwright screenshot --browser=chromium \
  --viewport-size=1280,900 http://127.0.0.1:3100 \
  /tmp/sprint35-f1-screens/home-desktop.png
```

Saida real:

```text
Error: i.parse: Executable doesn't exist at /home/moses/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell
Looks like Playwright was just installed or updated.
Please run the following command to download new browsers:

    pnpm exec playwright install
```

Conclusao honesta: nao foi produzida evidencia visual por screenshot nesta F1.
O diagnostico visual foi baseado em codigo, arvore, greps, documentos canonicos
e componentes materiais. A Sprint 3.5 deve preparar browser Playwright antes de
exigir screenshot/a11y como gate bloqueante.

## 4. Achados classificados

| Area | Arquivos | Gravidade | Tipo | Evidencia | Fatia |
|------|----------|-----------|------|-----------|-------|
| Navegacao mobile | `ShellLayout.tsx`, `Header.tsx` | critica | responsividade/usabilidade | sidebar `hidden ... md:block`, sem menu no header | F2/F4 |
| Home | `page.tsx`, `modules.ts` | alta | conteudo/consistencia | home diz "Em construcao" para todos; `juros` e `amortizacao` disponiveis | F2 |
| Tokens | `tokens.*`, `tailwind.config.ts`, charts | alta | consistencia | hex fora de tokens e Tailwind paralelo | F2 |
| Resumo financeiro | `SummaryCard.tsx`, `SummaryGrid.tsx`, `AmortizacaoSummary.tsx` | alta | visual/usabilidade | muitos cards com peso semelhante | F3 |
| Tabelas | `AmortizacaoTables.tsx`, `AmortizacaoTable.tsx` | alta | responsividade/usabilidade | scroll simples e renderizacao integral de tabelas longas | F3/F4 |
| Formularios | `formPrimitives.tsx` em dois modulos | media | arquitetura/consistencia | primitivas duplicadas | F3 |
| Graficos | `EvolucaoSaldoChart.tsx`, `AmortizacaoSaldoChart.tsx` | media | visual/acessibilidade | cores hardcoded e warning jsdom herdado | F3/F4 |
| Estados | `states/*`, panels | media | visual/consistencia | semantica boa, acabamento simples | F4 |

## 5. Conclusao do diagnostico

A aplicacao tem fundacao tecnica melhor do que a fundacao visual. Ha boas
decisoes de arquitetura frontend, semantica e contratos, mas o produto ainda
nao transmite plenamente clareza premium, confianca visual e organizacao
editorial. A Sprint 3.5 e justificada e deve comecar pela fundacao visual antes
de polir os modulos financeiros reais.
