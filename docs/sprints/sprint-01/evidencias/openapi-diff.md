# `openapi.json` — Diff v0 (Sprint 0) → v1 (Sprint 1, pós-Fatia 1)

**Fonte autoritativa:** `docs/api/openapi.json` (regerado por
`scripts/export_openapi.py`).
**Metodologia:** diff declarativo do *schema público* (rotas com
`include_in_schema=True`) — rotas internas de debug ficam ocultas
via `include_in_schema=False` e não aparecem neste diff.

---

## 1. Antes (baseline Sprint 0 — commit `7a83045`)

- `info.title`: `"Plataforma Educacional Financeira"`
- `info.version`: `"0.1.0"`
- `paths`:
  - `GET /health`
  - `GET /health/live`
  - `GET /health/ready`
- `components.schemas`: (vazio)

## 2. Depois (pós-Fatia 1 da Sprint 1)

- `info.title`: `"Plataforma Educacional Financeira"` *(inalterado)*
- `info.version`: `"0.1.0"` *(inalterado — bump major/minor só com o
  primeiro domínio, conforme Doc 27 §4)*
- `paths`:
  - `GET /health` *(inalterado)*
  - `GET /health/live` *(inalterado)*
  - `GET /health/ready` *(inalterado)*
  - **`GET /api/v1/contract/ping`** — nova, pública, retornando
    `ResponseEnvelope[ContractPingData]` com `meta.request_id` e
    `meta.version: "v1"`.
- `components.schemas` (novas entradas introduzidas pela Fatia 1):
  - `ResponseEnvelope_ContractPingData_` — envelope genérico tipado.
  - `ContractPingData` — payload da rota-demo.
  - `Meta` — envelope de metadados.
  - `Problem` — modelo RFC 7807 (`type`, `title`, `status`, `detail`,
    `instance`, `code`, + `extra` permitidos).

## 3. Rotas **não** expostas (gate intencional)

As rotas de debug `/api/v1/contract/errors/{kind}` (registradas somente
quando `APP_ENV != "prod"`) são marcadas com `include_in_schema=False`,
portanto **não aparecem** em `openapi.json`. Isto é verificado
manualmente via inspeção do diff: nenhuma entrada em
`paths` cujo caminho contenha `/errors/` existe no arquivo gerado.

## 4. Como reproduzir o diff localmente

```bash
# Com backend/.venv ativo (Python 3.11+) e APP_ENV=ci:
backend/.venv/bin/python scripts/export_openapi.py

# Diff contra main:
git diff origin/main -- docs/api/openapi.json | less
```

## 5. Observações de aderência

- ADR-0006 (versionamento por URL) fica formalmente materializada: a
  primeira rota sob `/api/v1/*` está publicada.
- ADR-0007 (RFC 7807) fica refletida no schema `Problem`, que se torna o
  corpo padrão de todas as respostas de erro (`default` response).
- Doc 27 §6 passa a registrar `v1 active` com data de início formal
  **2026-04** (mês desta sprint).
- O hash real do commit que acompanha a regeneração está registrado em
  `base-branch.md` como `HEAD_AFTER_FATIA_3`.
