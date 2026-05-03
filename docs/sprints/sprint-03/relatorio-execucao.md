# Sprint 3 — Relatório de execução

Data: 2026-05-03
Branch de fechamento local: `sprint-3/f6-fechamento-governanca-codex`
Base da F6: `main = origin/main = 81e8cbb`

## 1. Resumo executivo

A Sprint 3 materializou o módulo de amortização PRICE/SAC de ponta a
ponta, partindo do plano aprovado e chegando a domínio puro, service,
API, contrato, OpenAPI, frontend real, conteúdo educacional, docs vivos
e validação final.

A F6 não implementa funcionalidade nova. Esta fatia consolida evidências,
valida a `main` pós-F5 e deixa a Sprint 3 pronta para auditoria final do
Camaleão/Moisés.

## 2. Fatias executadas

| Fatia | PR | Commit | Entrega |
|-------|----|--------|---------|
| F1 | #12 | `55d5d44` | Plano da Sprint 3 materializado. |
| F2 | #13 | `dd23c6d` | Domínio puro PRICE/SAC com fechamento em centavos. |
| F3 | #14 | `a297b9c` | Service, API, contrato e OpenAPI catch-up. |
| F4 | #15 | `f20780e` | Frontend real da rota `/amortizacao`. |
| F5 | #16 | `81e8cbb` | Conteúdo educacional de amortização e docs vivos. |

## 3. Arquitetura final materializada

### Backend

- Domínio puro:
  - `backend/app/domain/amortization/price.py`
  - `backend/app/domain/amortization/sac.py`
  - `backend/app/domain/amortization/_common.py`
- Service:
  - `backend/app/services/amortization/calcular_amortizacao_service.py`
- API:
  - `backend/app/api/v1/amortization.py`
- Schemas:
  - `backend/app/schemas/amortization/`

### Frontend

- Página:
  - `frontend/src/app/(app)/amortizacao/page.tsx`
- Componentes:
  - `frontend/src/components/amortization/`
- Service:
  - `frontend/src/services/amortization/amortizationService.ts`
- Tipos:
  - `frontend/src/types/amortization.ts`
- Conteúdo educacional:
  - `frontend/src/content/amortizacao/`

## 4. Endpoints disponíveis

OpenAPI final versionado contém 10 paths, incluindo:

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

## 5. Validações finais executadas na F6

### OpenAPI

```text
openapi.json sincronizado: /home/moses/workspace/Plataforma_Educacional_Financeira/docs/api/openapi.json
```

Resultado: `EXIT_OPENAPI_CHECK=0`.

### Backend

```text
ruff check .                 -> All checks passed!
ruff format --check .        -> 115 files already formatted
mypy app/                    -> Success: no issues found in 73 source files
bandit -r app/ -c pyproject  -> No issues identified
pytest tests/unit -m unit    -> 138 passed
pytest tests/integration -q  -> 36 passed
pytest tests/contract -q     -> 22 passed
```

### Frontend

```text
pnpm lint          -> No ESLint warnings or errors
pnpm format:check  -> All matched files use Prettier code style
pnpm typecheck     -> tsc --noEmit, exit code 0
pnpm test -- --run -> 24 passed files, 189 passed tests
pnpm build         -> Compiled successfully; 16 static pages generated
```

### Gates de raiz

```text
make lint-pedagogical -> 0 bloqueio(s), 0 aviso(s)
bash scripts/pipeline.sh -> PIPELINE VERDE
```

Resultados:

- `EXIT_LINT_PED=0`
- `EXIT_PIPELINE=0`

## 6. Status final

Estado local da F6: validado e pronto para auditoria.

Não houve merge.
Não houve push.
Não houve abertura de PR.
