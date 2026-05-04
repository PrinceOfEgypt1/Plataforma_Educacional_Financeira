# Sprint 3.5/F2 - Inventario da fundacao visual

Data: 2026-05-03
Branch: `sprint-3.5/f2-fundacao-visual-design-system-codex`

## 1. App tree

Comando:

```bash
find frontend/src/app -maxdepth 4 -type f | sort
```

Saida real:

```text
frontend/src/app/(app)/amortizacao/page.tsx
frontend/src/app/(app)/atraso/page.tsx
frontend/src/app/(app)/cartao-rotativo/page.tsx
frontend/src/app/(app)/cdc/page.tsx
frontend/src/app/(app)/consignado/page.tsx
frontend/src/app/(app)/diagnostico/page.tsx
frontend/src/app/(app)/educacao/page.tsx
frontend/src/app/(app)/financiamento-imobiliario/page.tsx
frontend/src/app/(app)/financiamento-veiculo/page.tsx
frontend/src/app/(app)/indicadores/page.tsx
frontend/src/app/(app)/investir-vs-quitar/page.tsx
frontend/src/app/(app)/juros/page.tsx
frontend/src/app/(app)/layout.tsx
frontend/src/app/(app)/page.tsx
frontend/src/app/globals.css
frontend/src/app/layout.tsx
```

## 2. Shell, UI, states e tokens

Comando:

```bash
find frontend/src/components/shell -maxdepth 2 -type f | sort
find frontend/src/components/ui -maxdepth 2 -type f | sort
find frontend/src/components/states -maxdepth 2 -type f | sort
find frontend/src/styles -maxdepth 4 -type f | sort
```

Saida real:

```text
frontend/src/components/shell/BackLink.tsx
frontend/src/components/shell/EducationalNotice.tsx
frontend/src/components/shell/Header.tsx
frontend/src/components/shell/MobileModuleNav.tsx
frontend/src/components/shell/ModuleHeader.tsx
frontend/src/components/shell/ModulePage.tsx
frontend/src/components/shell/NavItem.tsx
frontend/src/components/shell/ShellLayout.tsx
frontend/src/components/shell/Sidebar.tsx
frontend/src/components/ui/AlertBanner.tsx
frontend/src/components/ui/EducationPanel.tsx
frontend/src/components/ui/FormSection.tsx
frontend/src/components/ui/SummaryCard.tsx
frontend/src/components/ui/index.ts
frontend/src/components/states/EmptyState.tsx
frontend/src/components/states/ErrorState.tsx
frontend/src/components/states/LoadingState.tsx
frontend/src/components/states/index.ts
frontend/src/styles/tokens.css
frontend/src/styles/tokens.ts
```

## 3. Testes impactados

Comando:

```bash
find frontend/src/__tests__ -maxdepth 3 -type f | sort
```

Saida material relevante:

```text
frontend/src/__tests__/app/home.test.tsx
frontend/src/__tests__/app/routes.test.tsx
frontend/src/__tests__/components/Header.test.tsx
frontend/src/__tests__/components/ShellLayout.test.tsx
frontend/src/__tests__/components/Sidebar.test.tsx
frontend/src/__tests__/components/states.test.tsx
frontend/src/__tests__/components/ui.test.tsx
frontend/src/__tests__/tokens.test.ts
```

## 4. Leituras de inventario

- A home era o principal ponto para separar modulos disponiveis e planejados.
- A shell ja tinha sidebar desktop, mas faltava um menu compacto mobile real.
- As paginas internas nao tinham acao clara de voltar.
- Tokens existiam em `tokens.css` e `tokens.ts`, mas o Tailwind ainda mantinha
  cores de marca hardcoded.
- Estados e componentes UI tinham semantica funcional, mas pouca diferenciacao
  visual por cor/superficie.
- `/juros` e `/amortizacao` permanecem paginas reais; a F2 aplicou apenas o
  header/padrao global, deixando o polimento profundo para F3.
