# PIPELINE, GOVERNANÇA E QUALITY GATES — PLATAFORMA EDUCACIONAL FINANCEIRA

**Versão:** 1.0
**Status:** VIVO

---

## 1. Princípios

1. **Falha rápida.** Quanto mais cedo o gate detectar, melhor.
2. **Reprodutível.** Mesmo comando local e CI.
3. **Bloqueante por padrão.** Gates importantes não são meramente informativos.
4. **Mensagens claras.** Falha de gate diz o que fazer.
5. **Sem `--no-verify`.** Burlar gate é defeito P1.

## 2. Stack de pipeline

- **CI:** GitHub Actions (alternativa: GitLab CI ou Buildkite).
- **Pre-commit/pre-push:** `pre-commit` + `husky`/`lefthook`.
- **Containerização:** Docker multi-stage; Postgres efêmero via service container ou `testcontainers`.
- **Empacotamento:** `pnpm` (FE), `uv`/`poetry` (BE).
- **Artefatos:** imagens OCI versionadas + sites estáticos de docs.

## 3. Scripts canônicos (Makefile)

```make
verify:                 ## lint + format + typecheck + test:unit + test:contract
verify:full:            ## verify + test:integration + test:visual + test:e2e:smoke + axe + sast
test:unit:              ## pytest + vitest
test:integration:       ## pytest tests/integration (com Postgres efêmero)
test:contract:          ## schemathesis contra OpenAPI
test:visual:            ## playwright (snapshot visual)
test:e2e:               ## playwright completo
test:e2e:smoke:         ## playwright jornadas mínimas
test:regression:        ## financial + pedagogical + visual + contract
test:mutation:          ## mutmut (alvo: domain/)
build:fe:               ## next build
build:be:               ## docker build backend
migrate:dryrun:         ## alembic upgrade --sql
healthcheck:            ## curl /health, /health/ready, /health/live
export:smoke:           ## smoke do fluxo de export PDF/Excel
a11y:smoke:             ## axe-core nas telas críticas
responsivity:check:     ## viewport sweep playwright
docs:build:             ## TypeDoc + mkdocs
docs:check:             ## valida que docs vivos foram tocados quando aplicável
impact:                 ## roda agente de análise de impacto
secret:scan:            ## gitleaks/detect-secrets
sast:                   ## bandit + eslint + semgrep
deps:audit:             ## pip-audit + npm audit
release:                ## tag + changelog + build + push
rollback:               ## rollback de release N-1
```

## 4. Gates por evento

### 4.1 pre-commit (local)
| Ordem | Gate | Bloqueia? |
|-------|------|-----------|
| 1 | `format check` (Prettier/Black/Ruff format) | SIM |
| 2 | `lint` rápido (ESLint/Ruff) | SIM |
| 3 | `typecheck` rápido (`tsc --noEmit` incremental, `mypy` por arquivo) | SIM |
| 4 | `secret:scan` (rápido) | SIM |
| 5 | `docs:check` (se PR toca docs vivos) | SIM |

### 4.2 pre-push (local)
| Ordem | Gate | Bloqueia? |
|-------|------|-----------|
| 1 | tudo do pre-commit (modo full) | SIM |
| 2 | `test:unit` | SIM |
| 3 | `impact` (modo soft local) | NÃO (informa) |

### 4.3 PR (CI obrigatório)
| Ordem | Gate | Bloqueia merge? |
|-------|------|------|
| 1 | `format check` | SIM |
| 2 | `lint` | SIM |
| 3 | `typecheck` | SIM |
| 4 | `secret:scan` | SIM |
| 5 | `sast` | SIM |
| 6 | `deps:audit` | NÃO (informativo, abre issue automática) |
| 7 | `test:unit` | SIM |
| 8 | `test:integration` | SIM |
| 9 | `test:contract` | SIM |
| 10 | `migrate:dryrun` | SIM (se PR toca `db/migrations/`) |
| 11 | `test:visual` | SIM (se PR toca `frontend/components/` ou `styles/`) |
| 12 | `test:e2e:smoke` | SIM |
| 13 | `a11y:smoke` | SIM (se PR toca FE) |
| 14 | `responsivity:check` | SIM (se PR toca FE) |
| 15 | `coverage` por área (gates de § 5) | SIM |
| 16 | `test:regression` (financial + pedagogical) | SIM |
| 17 | `docs:check` (vivos atualizados conforme matriz) | SIM |
| 18 | `docs:build` (TypeDoc+mkdocs ok) | SIM (no PR semanal de release; informativo nos demais) |
| 19 | `impact` (agente) | SIM |
| 20 | `build:fe` + `build:be` | SIM |

### 4.4 merge (após aprovação humana)
- Squash merge.
- Tag automática se for branch `release/*`.
- Geração de changelog.
- `docs:build` final e publicação.

### 4.5 Pós-deploy (homologação)
- `healthcheck` 3x intercalado (10s, 30s, 120s).
- `test:e2e:smoke` em homologação.
- `a11y:smoke` em homologação.

### 4.6 Pós-deploy (produção)
- `healthcheck` 3x.
- Smoke de produção (`tests/recovery/smoke_prod.spec.ts`).
- Janela de observação de 30 minutos com SLOs (latência p95, erro 5xx).

## 5. Gates de cobertura (resumo)

(Detalhe em `06_PADROES_DE_IMPLEMENTACAO_E_QUALIDADE_DE_CODIGO.md` § 4 e `05_ESTRATEGIA_DE_TESTES_DE_CLASSE_MUNDIAL.md` § 5.)

- `domain/` ≥ 95% / 90% (linhas/branches)
- `services/` ≥ 90% / 85%
- `api/` ≥ 85% / 80%
- `frontend/components/critical/` ≥ 85% / 80%
- demais ≥ 75% / 70%
- mutação `domain/` ≥ 80% (semanal)

PR que reduz cobertura abaixo do mínimo é **bloqueada**.

## 6. Política de falha de pipeline

1. Falha em qualquer gate bloqueante = PR vermelha.
2. Sem `--no-verify`/`--skip-checks`. Tentativa registrada e revertida.
3. Falha em gate informativo abre issue automática com label `gate-info`.
4. Falha consistente em gate flaky vai a `24_Runbooks.md`.

## 7. Política de bloqueio de merge

1. Branch `main` protegida.
2. Merge exige: 1 humano aprovador + todos gates verdes + docs vivos atualizados + ADR (se aplicável).
3. Aprovador humano não pode ser autor da PR.
4. Sem `force push` em `main`.

## 8. Política de rollback

1. Rollback **automático** se smoke pós-deploy falhar em até 5 min.
2. Rollback manual via `make rollback` aciona deploy da imagem N-1.
3. Migrations destrutivas só acontecem em PR distinta após `expand` e `backfill` (§ 12 da Governança).
4. Pós-rollback: post-mortem em até 48h em `24_Runbooks.md`.

## 9. Política de smoke tests

- Smoke local antes de pre-push (opcional).
- Smoke em PR (E2E mínimo).
- Smoke em homologação (após deploy).
- Smoke em produção (após deploy + janela de observação).

## 10. Política de regressão mínima obrigatória

Suite consolidada em `tests/regression/`:
- `financial/` — Doc 15 + property-based.
- `pedagogical/` — presença/coerência dos blocos.
- `visual/` — Playwright snapshots dos componentes críticos.
- `contract/` — schemathesis contra OpenAPI.

Roda em todo PR, em `main`, e como parte do release.

## 11. Mapa "evento → gates obrigatórios" (síntese)

| Evento | Gates bloqueantes |
|--------|--------------------|
| Mudança em `app/domain/` | unit, integration, contract, regression (financial + pedagogical), mutation (semanal), impact, docs:check |
| Mudança em `app/api/` | unit, integration, contract, docs:check, impact, openapi diff |
| Mudança em `db/migrations/` | migrate:dryrun, integration, docs:check, impact |
| Mudança em `frontend/components/` ou `styles/` | unit, visual, a11y, responsivity, e2e:smoke, impact, docs:check |
| Mudança em `pipelines/`/Makefile/CI | full PR pipeline rodando contra a branch + impact |
| Mudança em conteúdo educacional (`/docs/08_*` ou `frontend/content/`) | regression pedagogical, lint pedagógico, revisão humana |
| Release | tudo + release readiness checklist + smoke prod |

## 12. Ferramentas e configurações canônicas

- `.github/workflows/ci.yml` orquestra os gates, com matriz por job.
- `.github/CODEOWNERS` define revisores por pasta.
- `.github/pull_request_template.md` impõe descrição padrão.
- `.pre-commit-config.yaml` e `lefthook.yml` para hooks locais.
- `pyproject.toml`/`package.json` centralizam scripts.
- `coverage.toml` com gates por área.
- `playwright.config.ts` com projetos por viewport e por suite (visual/e2e).
- `schemathesis` rodando contra OpenAPI exportado por FastAPI.

## 13. Indicadores de pipeline

| Indicador | Meta |
|-----------|------|
| Tempo médio de CI em PR | ≤ 12 min |
| Taxa de PRs com gate vermelho na primeira tentativa | ≤ 25% |
| Taxa de PR aprovada sem gate informativo verde | ≤ 5% |
| Falsos positivos de impact | ≤ 3% |
| Tempo de recuperação após falha em prod | ≤ 30 min |

## 14. Política de manutenção

- Pipeline é VIVO; mudanças passam por PR como qualquer outra.
- Mudança em pipeline exige `impact` rodando em modo full + post-mortem se gerar incidente.
- Auditoria mensal mede indicadores e ajusta gates.
