# Relatório — Item 14F-F0C — Auditor automático UI/UX

## 1. Resumo executivo

Este item cria o auditor automático `audit:uiux`, capaz de carregar o contrato UI/UX do módulo Financiamento Imobiliário e emitir falhas objetivas contra o frontend atual.

O objetivo deste item não é corrigir a interface. O objetivo é criar o mecanismo verificável que transforma problemas de UI/UX em violações rastreáveis por código.

## 2. Comando criado

~~~bash
cd frontend
pnpm audit:uiux
~~~

## 3. Modos validados

~~~bash
pnpm audit:uiux -- --contract-only
pnpm audit:uiux -- --expect-fail
node scripts/auditor-uiux.mjs --json --expect-fail
~~~

## 4. Contrato auditado

- Contrato: `PEF-UIUX-CONTRACT-FINANCIAMENTO-IMOBILIARIO`
- Arquivo: `docs/governance/frontend/contracts/financiamento-imobiliario.uiux.contract.json`

## 5. Resultado contra o módulo atual

O módulo atual foi reprovado objetivamente, conforme esperado nesta etapa.

| Severidade | Quantidade |
|---|---:|
| high | 19 |
| medium | 9 |
| low | 0 |
| total | 28 |

## 6. Códigos detectados

| Código | Quantidade |
|---|---:|
| `UX-CTA-001` | 2 |
| `UX-CTA-002` | 2 |
| `UX-DUP-001` | 14 |
| `UX-DUP-002` | 9 |
| `UX-MOBILE-001` | 1 |

## 7. Amostras de falhas detectadas

### UX-DUP-001 — high

- Título: data-testid duplicado entre componente ativo e componente legado.
- Arquivo: `frontend/src/components/financing/RealEstateFinancingTable.tsx:76`
- Evidência: data-testid "financiamento-table" aparece em múltiplos arquivos: frontend/src/components/financing/RealEstateFinancingTable.tsx, frontend/src/components/financing/FinanciamentoTable.tsx
- Correção esperada: Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.

### UX-DUP-001 — high

- Título: data-testid duplicado entre componente ativo e componente legado.
- Arquivo: `frontend/src/components/financing/FinanciamentoTable.tsx:97`
- Evidência: data-testid "financiamento-table" aparece em múltiplos arquivos: frontend/src/components/financing/RealEstateFinancingTable.tsx, frontend/src/components/financing/FinanciamentoTable.tsx
- Correção esperada: Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.

### UX-DUP-001 — high

- Título: data-testid duplicado entre componente ativo e componente legado.
- Arquivo: `frontend/src/components/financing/RealEstateFinancingTable.tsx:113`
- Evidência: data-testid "financiamento-table-count" aparece em múltiplos arquivos: frontend/src/components/financing/RealEstateFinancingTable.tsx, frontend/src/components/financing/FinanciamentoTable.tsx
- Correção esperada: Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.

### UX-DUP-001 — high

- Título: data-testid duplicado entre componente ativo e componente legado.
- Arquivo: `frontend/src/components/financing/FinanciamentoTable.tsx:107`
- Evidência: data-testid "financiamento-table-count" aparece em múltiplos arquivos: frontend/src/components/financing/RealEstateFinancingTable.tsx, frontend/src/components/financing/FinanciamentoTable.tsx
- Correção esperada: Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.

### UX-DUP-001 — high

- Título: data-testid duplicado entre componente ativo e componente legado.
- Arquivo: `frontend/src/components/financing/RealEstateFinancingTable.tsx:118`
- Evidência: data-testid "financiamento-table-range" aparece em múltiplos arquivos: frontend/src/components/financing/RealEstateFinancingTable.tsx, frontend/src/components/financing/FinanciamentoTable.tsx
- Correção esperada: Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.

### UX-DUP-001 — high

- Título: data-testid duplicado entre componente ativo e componente legado.
- Arquivo: `frontend/src/components/financing/FinanciamentoTable.tsx:134`
- Evidência: data-testid "financiamento-table-range" aparece em múltiplos arquivos: frontend/src/components/financing/RealEstateFinancingTable.tsx, frontend/src/components/financing/FinanciamentoTable.tsx
- Correção esperada: Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.

### UX-DUP-001 — high

- Título: data-testid duplicado entre componente ativo e componente legado.
- Arquivo: `frontend/src/components/financing/RealEstateFinancingTable.tsx:264`
- Evidência: data-testid "financiamento-table-totals" aparece em múltiplos arquivos: frontend/src/components/financing/RealEstateFinancingTable.tsx, frontend/src/components/financing/FinanciamentoTable.tsx
- Correção esperada: Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.

### UX-DUP-001 — high

- Título: data-testid duplicado entre componente ativo e componente legado.
- Arquivo: `frontend/src/components/financing/FinanciamentoTable.tsx:241`
- Evidência: data-testid "financiamento-table-totals" aparece em múltiplos arquivos: frontend/src/components/financing/RealEstateFinancingTable.tsx, frontend/src/components/financing/FinanciamentoTable.tsx
- Correção esperada: Separe identificadores de componentes ativos e legados ou remova o legado do fluxo ativo.

## 8. Decisão de governança

O auditor deve nascer em modo executável local e documentado, mas ainda não deve bloquear o CI oficial.

A promoção para gate obrigatório deve ocorrer somente após as correções do módulo Imóvel e nova aprovação de PO/UX.

## 9. Próximo passo recomendado

Agrupar as violações detectadas por blocos corretivos e preparar prompts cirúrgicos para a próxima atuação de Codex/Claude.
