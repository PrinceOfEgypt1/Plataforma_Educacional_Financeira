# Sprint 3.5/F3 - Auditoria Final UI/UX

Data: 2026-05-06

## Home

- FATO: `frontend/src/app/(app)/page.tsx` renderiza uma tela compacta em `cockpit-coming-soon`, com apresentacao curta e dois atalhos diretos: `Juros` e `Amortização`.
- FATO: nao ha lista longa aberta de proximos modulos na Home.
- FATO: os botoes principais estao padronizados por `cockpit-btn-more`.
- FATO: a Home herda o `FinancialCockpitShell`, sem sidebar visivel.

Veredito: validada para fechamento da Sprint 3.5, sem necessidade de nova reimplementacao.

## `/juros`

- FATO: `frontend/src/app/(app)/juros/page.tsx` usa `InterestCockpit`.
- FATO: o cockpit possui subtabs `Juros simples`, `Juros compostos` e `Comparar`.
- FATO: o painel esquerdo concentra entradas e CTA.
- FATO: o centro concentra KPIs, grafico amplo e insight inferior.
- FATO: o painel direito organiza conteudo educativo por abas e usa modal para aprofundamento.
- FATO: os dados financeiros sao obtidos por `simularJurosSimples`, `simularJurosCompostos` e `compararJuros`.

Veredito: validada para fechamento da Sprint 3.5.

## `/amortizacao`

- FATO: `frontend/src/app/(app)/amortizacao/page.tsx` usa `AmortizationCockpit`.
- FATO: o cockpit possui subtabs `PRICE`, `SAC` e `Comparar`.
- FATO: o painel esquerdo concentra entradas e CTA.
- FATO: o centro concentra KPIs, grafico amplo e insight inferior.
- FATO: tabela, glossario, cuidados e comparacao aparecem em abas/painel/modal, sem empilhar todo o conteudo no fluxo principal.
- FATO: os dados financeiros sao obtidos por `simularPrice`, `simularSac` e `compararAmortizacao`.

Veredito: validada para fechamento da Sprint 3.5.

## Shell e navegacao

- FATO: `ShellLayout` renderiza `FinancialCockpitShell`.
- FATO: `FinancialCockpitShell` oferece topbar com modulos ativos e futuros.
- FATO: os modulos futuros exibem estado `EM BREVE` e as rotas em construcao renderizam empty state sem funcionalidade falsa.
- FATO: a busca por `Dashboard` no frontend nao aponta breadcrumb ativo do cockpit.
- FATO: a sidebar antiga nao aparece no shell atual do cockpit.

## Ajuste fino aplicado na F3

Foi aplicado ajuste responsivo pequeno em `frontend/src/app/globals.css`:

- em tablet, a grade deixa de depender de tres colunas fixas e passa a `minmax(240px, 0.9fr) minmax(360px, 1.4fr)`;
- o painel educacional passa a ocupar a largura total quando necessario;
- em mobile, a grade vira uma coluna com scroll interno controlado;
- topbar e subtabs passam a permitir scroll horizontal interno, evitando scroll horizontal da pagina;
- o viewport permanece com `html/body` em `overflow: hidden`.

Esse ajuste nao muda calculos, services, API, backend ou estrutura central do cockpit.
