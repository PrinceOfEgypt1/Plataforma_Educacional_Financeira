# Plano corretivo cirúrgico — Item 14F-F2 — Módulo Financiamento Imobiliário

## 1. Objetivo

Definir o plano de correção para reduzir as 28 violações UI/UX do módulo Financiamento Imobiliário sem maquiagem, sem alteração oportunista do auditor e sem mudança indevida de contrato.

## 2. Princípios obrigatórios

A implementação corretiva deve obedecer aos seguintes princípios:

1. corrigir causa raiz, não sintoma isolado;
2. preservar fórmulas financeiras e contratos de cálculo;
3. não alterar o auditor para esconder falhas;
4. não alterar o contrato UI/UX para reduzir contador artificialmente;
5. manter testes frontend verdes;
6. manter linguagem em português correto;
7. preservar acessibilidade;
8. manter a navegação por zonas como `tabbed single-panel interaction`;
9. garantir CTAs/cards com propósito único;
10. validar o resultado com `audit:uiux`.

## 3. Ordem cirúrgica recomendada

### Etapa 1 — Resolver F2-RC-001

Causa raiz:

Duplicidade e ambiguidade entre componentes ativos e legados.

Ações:

- inventariar componentes ativos e legados do módulo;
- definir quais componentes são canônicos;
- remover legados do contrato ativo quando não forem usados no fluxo real;
- renomear testids legados com `-legacy` quando a permanência for necessária;
- atualizar testes para selecionar componentes canônicos;
- rodar `audit:uiux`.

Critério de aceite:

- `UX-DUP-001 = 0`;
- `UX-DUP-002 = 0`.

### Etapa 2 — Resolver F2-RC-002

Causa raiz:

CTAs da sidebar navegam para destino genérico.

Ações:

- substituir `resultado` genérico por zonas específicas;
- garantir relação direta entre rótulo e destino;
- manter estado ativo claro;
- testar clique e renderização da zona correta.

Critério de aceite:

- `UX-CTA-001` zerado em `RealEstateScenarioSidebar.tsx`;
- `UX-CTA-002` zerado em `RealEstateScenarioSidebar.tsx`.

### Etapa 3 — Resolver F2-RC-003

Causa raiz:

CTAs de próximos passos reutilizam destino sem diferenciação.

Ações:

- revisar CTAs da zona de próximos passos;
- consolidar redundâncias;
- diferenciar destino, microcopy ou contexto;
- testar que cards diferentes não levam ao mesmo resultado sem justificativa.

Critério de aceite:

- `UX-CTA-001` zerado em `RealEstateNextStepsZone.tsx`.

### Etapa 4 — Resolver F2-RC-004

Causa raiz:

Sidebar com largura fixa sem proteção responsiva.

Ações:

- aplicar breakpoint explícito;
- ocultar, transformar ou reposicionar sidebar em mobile;
- evitar largura fixa ativa em telas pequenas;
- manter navegação e legibilidade.

Critério de aceite:

- `UX-MOBILE-001 = 0`.

## 4. Comandos mínimos de validação da próxima implementação

~~~bash
cd frontend
pnpm audit:uiux:contract
pnpm audit:uiux:expect-fail
pnpm --silent audit:uiux:json
pnpm test -- src/__tests__/scripts/auditorUiux.test.ts
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
~~~

## 5. Critério final de sucesso da correção

A correção só poderá ser considerada tecnicamente bem-sucedida quando:

| Métrica | Estado esperado |
|---|---:|
| `UX-DUP-001` | 0 |
| `UX-DUP-002` | 0 |
| `UX-CTA-001` | 0 |
| `UX-CTA-002` | 0 |
| `UX-MOBILE-001` | 0 |
| Violações high | 0 |
| Violações medium | 0 |
| Violações totais do auditor atual | 0 |

## 6. Observação de governança

Se a implementação descobrir que alguma violação não deve mais ser considerada falha, isso deve ser tratado por alteração formal do contrato UI/UX, com justificativa técnica e aprovação PO/UX. Não é aceitável alterar o auditor ou o contrato apenas para passar no gate.
