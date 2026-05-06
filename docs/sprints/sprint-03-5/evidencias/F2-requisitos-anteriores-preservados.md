# Sprint 3.5/F2 — Requisitos anteriores preservados

## Requisitos preservados

- topbar do Financial Cockpit preservada;
- sidebar antiga não é renderizada no cockpit;
- subtabs de Juros e Amortização preservadas;
- layout em três colunas preservado;
- KPIs no topo preservados;
- gráfico central grande preservado;
- painel direito educativo preservado;
- insight inferior preservado;
- módulos `Em breve` preservados;
- empty states elegantes preservados para módulos futuros;
- Syne preservada via `next/font/google`;
- IBM Plex Mono preservada via `next/font/google`;
- overflow global sem scroll de página preservado;
- scroll interno limitado a tabela/modal/painel quando necessário;
- Recharts preservado, sem CDN;
- ausência de cálculo financeiro crítico no frontend preservada;
- dados financeiros seguem vindos dos services/API.

## Provas técnicas

Fonte:

```text
frontend/src/app/layout.tsx: import { IBM_Plex_Mono, Syne } from "next/font/google";
frontend/src/app/globals.css: html/body/cockpit-app com overflow hidden;
frontend/src/components/shell/ShellLayout.tsx: usa FinancialCockpitShell e não renderiza Sidebar.
```

Testes:

```text
frontend/src/__tests__/app/cockpitGovernance.test.ts
frontend/src/__tests__/components/ShellLayout.test.tsx
frontend/src/__tests__/app/home.test.tsx
frontend/src/__tests__/app/routes.test.tsx
```

## Sidebar

O grep ainda encontra código legado de `Sidebar`, mas o cockpit não a renderiza. A governança testa explicitamente que `ShellLayout.tsx` não contém renderização de `Sidebar`.

## Cálculo financeiro

O grep obrigatório de cálculo suspeito é amplo porque inclui `**`, que aparece em comentários e documentação inline. As ocorrências restantes não representam fórmulas financeiras críticas implementadas no cockpit. A governança também testa ausência de `Math.pow`, `pmt =`, `juros =`, `montante =` e `amortizacao =` nos componentes do cockpit.
