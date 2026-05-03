# Contexto de continuidade pós-Sprint 3

Data: 2026-05-03

## 1. Estado final do repositório

Após F5 mergeada, o estado oficial de referência é:

- `main = origin/main = 81e8cbb`
- PR #16 mergeada
- Sprint 3/F6 executada em branch própria:
  `sprint-3/f6-fechamento-governanca-codex`

## 2. Cadeia de commits da Sprint 3

- F1 / PR #12 / `55d5d44` — plano da Sprint 3.
- F2 / PR #13 / `dd23c6d` — domínio puro PRICE/SAC.
- F3 / PR #14 / `a297b9c` — service, API, contrato e OpenAPI.
- F4 / PR #15 / `f20780e` — frontend real `/amortizacao`.
- F5 / PR #16 / `81e8cbb` — conteúdo educacional e docs vivos.

## 3. Arquitetura materializada

### Backend

- Domínio: `backend/app/domain/amortization/`
- Service: `backend/app/services/amortization/`
- Schemas: `backend/app/schemas/amortization/`
- API: `backend/app/api/v1/amortization.py`

### Frontend

- Página: `frontend/src/app/(app)/amortizacao/page.tsx`
- Componentes: `frontend/src/components/amortization/`
- Service: `frontend/src/services/amortization/amortizationService.ts`
- Tipos: `frontend/src/types/amortization.ts`
- Conteúdo: `frontend/src/content/amortizacao/`

## 4. Endpoints disponíveis

- `POST /api/v1/amortization/price`
- `POST /api/v1/amortization/sac`
- `POST /api/v1/amortization/compare`
- `POST /api/v1/interest/simple`
- `POST /api/v1/interest/compound`
- `POST /api/v1/interest/compare`
- `GET /api/v1/contract/ping`
- `GET /health`
- `GET /health/live`
- `GET /health/ready`

## 5. Documentação viva atualizada

Durante a Sprint 3, foram atualizados:

- `docs/06_API_e_Contratos.md`
- `docs/07_UX_UI_e_Navegacao.md`
- `docs/08_Conteudo_Educacional.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`

## 6. Validação final F6

Resultados locais:

- `EXIT_OPENAPI_CHECK=0`
- backend unit: 138 passed
- backend integration: 36 passed
- backend contract: 22 passed
- frontend: 24 files / 189 tests passed
- build frontend: OK
- `EXIT_LINT_PED=0`
- `EXIT_PIPELINE=0`
- `PIPELINE VERDE`

## 7. Resíduos não bloqueantes

- Recharts/jsdom emite warning de dimensão zero nos testes, sem falha.
- Mutation testing/mutmut permanece como stretch/resíduo não bloqueante.

## 8. Governança operacional

- Codex implementa em branch própria.
- Camaleão audita a entrega e a coerência documental.
- Moisés decide aprovação, merge, atualização de planilha e continuidade.
- Não trabalhar diretamente em `main`.
- Não fazer push, PR ou merge sem autorização.
- Docs baseline e Prompt-Mestre não devem ser alterados em PR comum.

## 9. Próxima etapa

Após auditoria e decisão do PO, a próxima sprint recomendada é a Sprint 4,
seguindo o roadmap vivo e o mesmo rito de entendimento, implementação,
validação e auditoria.
