# F3 ? Relatorio de execucao Codex

Data: 2026-05-03
Sprint: 3
Fatia: F3 ? Service + API + Contrato + OpenAPI catch-up
Branch: `sprint-3/f3-api-amortizacao-codex`
Commit-base: `dd23c6d`

## 1. Resumo executivo

A F3 materializou a borda backend de amortizacao sobre o dominio puro F2, sem reescrever a matematica. Foram criados service, schemas Pydantic, router FastAPI, testes unitarios/integracao/contrato e atualizado o OpenAPI versionado via `scripts/export_openapi.py`. O catch-up do OpenAPI tambem incluiu os endpoints de juros ja existentes no runtime.

## 2. Arquivos lidos

Foram lidos os documentos e codigo definidos na fase de entendimento: Prompt Mestre e baseline, docs vivos 06/19/09/15, plano/evidencias F1/F2, arquitetura FastAPI real, routers, schemas/services de juros, dominio F2 de amortizacao, testes unit/integration/contract existentes e `docs/api/openapi.json`.

## 3. Arquivos criados

- `backend/app/api/v1/amortization.py`
- `backend/app/schemas/amortization/base.py`
- `backend/app/schemas/amortization/price.py`
- `backend/app/schemas/amortization/sac.py`
- `backend/app/schemas/amortization/compare.py`
- `backend/app/services/amortization/calcular_amortizacao_service.py`
- `backend/tests/unit/services/amortization/__init__.py`
- `backend/tests/unit/services/amortization/test_calcular_amortizacao_service.py`
- `backend/tests/integration/api/amortization/__init__.py`
- `backend/tests/integration/api/amortization/test_price.py`
- `backend/tests/integration/api/amortization/test_sac.py`
- `backend/tests/integration/api/amortization/test_compare.py`
- `backend/tests/integration/api/amortization/test_errors.py`
- `backend/tests/contract/test_amortization.py`
- evidencias F3 em `docs/sprints/sprint-03/evidencias/`.

## 4. Arquivos alterados

- `backend/app/api/v1/router.py`
- `backend/app/schemas/amortization/__init__.py`
- `backend/app/services/amortization/__init__.py`
- `docs/api/openapi.json`
- `docs/06_API_e_Contratos.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`

## 5. Formulas e politica matematica

A F3 nao alterou formulas nem politica de fechamento da F2. O service chama `calcular_price` e `calcular_sac` do dominio puro e serializa o resultado em envelope pedagogico `summary/tables/charts/interpretation/alerts`.

## 6. Principal zero

Confirmacao material:

```text
PRICE ACCEPTS_ZERO 0.00 0.00 0.00
SAC ACCEPTS_ZERO 0.00 0.00 0.00
```

Regra F2: `backend/app/domain/amortization/_common.py` rejeita apenas `principal < 0`.
Decisao F3: rejeitar `principal <= 0` na borda de API/schema/service, com `Field(gt=0)` no schema e guarda explicita no service. Nao houve alteracao da matematica F2.

## 7. Endpoints implementados

- `POST /api/v1/amortization/price`
- `POST /api/v1/amortization/sac`
- `POST /api/v1/amortization/compare`

## 8. OpenAPI

Antes: 4 paths versionados.
Depois: 10 paths versionados e 43 component schemas.
Adicionados: 3 endpoints de juros em catch-up + 3 endpoints de amortizacao F3.
Comandos verdes: `scripts/export_openapi.py`, `scripts/export_openapi.py --check`, `python3 -m json.tool docs/api/openapi.json`.

## 9. Testes criados

- Unit service: 5 testes.
- Integration amortization: 14 testes.
- Contract amortization: 6 testes.

Os testes de API validam invariantes financeiras usando `Decimal` apos desserializar strings JSON.

## 10. Comandos executados e resultados

- `py_compile` nos arquivos F3: exit 0.
- `ruff check .`: `All checks passed!`.
- `ruff format --check .`: verde apos formatar 3 testes novos.
- `mypy app/`: `Success: no issues found in 73 source files`.
- `bandit -r app/ -c pyproject.toml`: `No issues identified`.
- `pytest tests/unit/domain/amortization -q`: 39 passed.
- `pytest tests/unit -m unit`: 138 passed.
- `pytest tests/regression -m regression`: 3 passed.
- `pytest tests/integration -q`: 36 passed.
- `pytest tests/contract -q`: 22 passed.
- `make lint-pedagogical`: 0 bloqueios, 0 avisos.
- `bash scripts/pipeline.sh` com PATH NVM: PIPELINE VERDE.

## 11. Falhas encontradas e corrigidas

- `ruff format --check` pediu formatacao em 3 testes novos; corrigido com `ruff format` localizado.
- Um teste unitario esperava o codigo especifico no campo errado; ajustado para o padrao real (`ValidationError.code == VALIDATION_ERROR`, detalhe em `errors[0]["code"]`).
- `git merge-base --short` nao existe na versao local; repetido com `git merge-base HEAD origin/main | cut -c1-7`.

## 12. Riscos e pendencias

- A jornada frontend de amortizacao permanece fora do escopo da F3.
- O endpoint debug `/api/v1/contract/errors/{kind}` segue fora do OpenAPI publico.
- Nao ha pendencia tecnica bloqueante identificada nos gates executados.

## 13. Status final

F3 implementada localmente e pronta para auditoria do Camaleao/Moises.

Nao houve merge.
Nao houve push.
Nao houve abertura de PR.
