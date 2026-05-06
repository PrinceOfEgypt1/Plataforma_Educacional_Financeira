# Sprint 3.5/F2 — Roteiro de navegação preservado

## Juros

Roteiro preservado:

- abrir `/juros`;
- visualizar topbar do Financial Cockpit;
- navegar por `Juros simples`, `Juros compostos` e `Comparar`;
- simular usando dados vindos dos services/API;
- visualizar KPIs, gráfico central, painel educativo e insight inferior;
- abrir modal `Aprenda mais sobre juros`;
- navegar por `Juros Simples`, `Juros Compostos`, `Comparação`, `Aportes` e `Cuidados`;
- fechar o modal.

Provas automatizadas:

- `frontend/src/__tests__/app/juros.test.tsx`;
- `frontend/src/__tests__/app/cockpitGovernance.test.ts`.

## Amortização

Roteiro preservado:

- abrir `/amortizacao`;
- navegar por `PRICE`, `SAC` e `Comparar`;
- simular usando services/API;
- visualizar KPIs, gráfico central, painel educativo e insight inferior;
- consultar tabelas com uma linha por período;
- abrir modal `Entenda a amortização`;
- navegar por `O que a tabela mostra`, `PRICE`, `SAC`, `PRICE × SAC`, `Glossário` e `Cuidados`;
- fechar o modal.

Provas automatizadas:

- `frontend/src/__tests__/app/amortizacao.test.tsx`;
- `frontend/src/__tests__/components/cockpitDynamicData.test.tsx`.

## Módulos futuros

Os módulos `Imóvel`, `Consignado`, `CDC`, `Cartão` e `Investir × Quitar` continuam preservados como `Em breve`, sem funcionalidade falsa.

Provas automatizadas:

- `frontend/src/__tests__/app/home.test.tsx`;
- `frontend/src/__tests__/app/routes.test.tsx`.

## Resultado

O roteiro de navegação segue executável e agora inclui provas específicas para decimal pt-BR, conteúdo educativo completo e períodos dinâmicos.
