# F5 — Matriz de Rastreabilidade

**Sprint:** 4 / Fatia: F5  
**Feature:** RF-FIN-001 — Financiamento Imobiliário  
**Data:** 2026-05-08

## Status RF-FIN-001

| Campo | Valor |
|-------|-------|
| ID | RF-FIN-001 |
| Descrição | Simulador de financiamento imobiliário (PRICE/SAC) |
| Status anterior | pending |
| Status atual | **done** |
| Sprint/Fatia | Sprint 4 / F5 |

## Cobertura da fatia vertical

| Camada | Artefato | Status |
|--------|---------|--------|
| Domínio | `app/domain/financing/real_estate.py` | VERDE |
| Schemas | `app/schemas/financing/real_estate.py` | VERDE |
| Service | `app/services/financing/simular_financiamento_service.py` | VERDE |
| API | `app/api/v1/financing.py` + router | VERDE |
| Testes backend | 57 testes (domínio + service + integração + contrato) | VERDE |
| Tipos frontend | `frontend/src/types/financing.ts` | VERDE |
| Service frontend | `frontend/src/services/financing/financiamentoService.ts` | VERDE |
| Componentes UI | FinanciamentoCockpit/Form/Summary/Table/SaibaMais | VERDE |
| Página | `/financiamento-imobiliario` (status disponivel) | VERDE |
| Testes frontend | 62 testes (app + components + content + service) | VERDE |
| Conteúdo educacional | N1/N2 (5 blocos cada) + glossário (12 termos) | VERDE |
| Docs vivos | 06/07/08/09/15/19 + living_docs.json | VERDE |
| Gates | ruff, pytest, Prettier, ESLint, tsc, Vitest, build | TODOS VERDES |

## Critério de done RF-FIN-001

✅ Fatia vertical completa: domínio → API → frontend → conteúdo educacional → testes → docs vivos
✅ Sem float em cálculos financeiros
✅ Encargos separados de juros e amortização
✅ CET não declarado como oficial
✅ Módulo diagnóstico não alterado
✅ Sprint 4 inteira NÃO declarada concluída
