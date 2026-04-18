# Relatório de Execução — Sprint 1

**Sprint:** 01
**Responsável:** Claude Code (executora), Moisés (operador)
**Período:** 17–18 de abril de 2026
**Plano de referência:** `sprint-1/00_plano/PLANO_EXECUCAO_SPRINT_1.md` v1.1
**Prompt de referência:** `Prompt Sprint 1` §1 a §13
**Status:** CONCLUÍDA — pendente apenas Fatia 4 (CI advisory) e abertura do PR

> Nota relacional com a Sprint 0 (PLANO v1.1 §13.3): as condicionantes C1 e C3
> registradas em `docs/sprints/sprint-00/validacao-oficial.md` §4 passam a
> estar **atendidas a partir da Sprint 1**. O veredito histórico da Sprint 0
> ("APROVADA COM LIBERAÇÃO CONDICIONADA") permanece **inalterado**; esta
> sprint não reabre, não reprocessa e não altera artefato algum da Sprint 0.

---

## 1. Objetivo da Sprint

Materializar o **contrato-base da API** (backend) e o **shell navegável do
frontend** com 12 rotas, estados reutilizáveis e componentes UI, de modo que
toda feature de domínio criada a partir da Sprint 2 já herde: envelope de
sucesso, erros RFC 7807, correlação via `X-Request-ID`, layout acessível e
fonte única de módulos. Em paralelo, fechar as pendências documentais
herdadas pela §9 do `relatorio-execucao.md` da Sprint 0 e acoplar o agente
de impacto ao CI em modo advisory.

---

## 2. Escopo tratado

### 2.1 Backend (Fatia 1)

- `backend/app/core/envelope.py` — `ResponseEnvelope[T]`, `Meta`, `make_meta`, `ok`.
- `backend/app/core/errors.py` — `Problem` (RFC 7807) + hierarquia
  `DomainError` com 5 subclasses (`ValidationError`, `BusinessRuleError`,
  `NotFoundError`, `ConflictError`, `RateLimitedError`) mapeando 1:1 os
  códigos do Doc 06 §5.
- `backend/app/core/request_id.py` — `RequestIdMiddleware` que extrai ou
  gera `X-Request-ID` e o expõe via `contextvars`.
- `backend/app/api/v1/{__init__,router,contract}.py` — agrupamento oficial
  por versão (ADR-0006), com rota-demo `/api/v1/contract/ping` e rota
  interna de exercício dos ramos de erro (debug, não publicada no OpenAPI).
- `backend/app/main.py` — handlers globais para `DomainError`,
  `RequestValidationError` e `Exception`; registro do middleware e do
  router v1.
- Testes: `tests/unit/test_envelope.py` (13 casos) e
  `tests/contract/{test_contract_base,test_error_handling}.py` (10 casos).

### 2.2 Frontend (Fatia 2)

- Shell navegável com `ShellLayout` (sidebar + header + main + footer +
  banner educacional persistente do Doc 18).
- Grupo de rotas `src/app/(app)/` com **12 páginas** — slugs canônicos do
  Doc 06 (`/cartao-rotativo`, `/investir-vs-quitar`, etc.).
- Home (`/`) com grid responsivo dos 12 módulos.
- 3 estados reutilizáveis (`LoadingState`, `ErrorState`, `EmptyState`) com
  API uniforme `{title, description, action?}`.
- 4 componentes UI reutilizáveis (`SummaryCard`, `AlertBanner`,
  `FormSection`, `EducationPanel`) — todos consumindo exclusivamente as CSS
  vars dos tokens (anti-drift com `tokens.test.ts`).
- Fonte única dos 12 módulos em `src/config/modules.ts` com helpers
  `findModuleByPathname` e `groupModules`.
- Infra de testes `vitest + jsdom + @testing-library/react` e suíte de **61
  casos em 8 arquivos** (shell, estados, UI, Home, varredura das 12 rotas).

### 2.3 Docs (Fatia 3)

- Artefatos canônicos da Sprint 1: este relatório de execução,
  `relatorio-forense.md`, `validacao-oficial.md` + índice de evidências.
- Atualização do Doc 04 §6.3 (C4 Nível 3 — componentes do backend) para
  refletir a materialização em `app/core/` e `app/api/v1/`.
- Atualização do Doc 27 (registro oficial de `v1 active` no apêndice vivo).
- Atualização do Doc 19 (linhas de rastreabilidade do contrato-base).
- Atualização do Inventário de Telas (12 slugs canônicos + status real).
- README atualizado para refletir o estado pós-Sprint 1.
- `living_docs.json` sincronizado.
- `SINCRONIZACAO_DOCS_SPRINT01.md` como matriz desta sprint.
- `pendencias-herdadas-fechamento.md` fechando os itens da §9 Sprint 0.

### 2.4 CI (Fatia 4)

- Job `impact-advisory` no `.github/workflows/ci.yml` rodando
  `scripts/impact_analysis_guard.py` em modo advisory (sem bloquear).
- Evidência em `evidencias/impact-agent-ci.md` registrando o
  primeiro run verde do step no CI da própria PR.

---

## 3. Decisões técnicas registradas

| # | Decisão | Motivação |
|---|---|---|
| 1 | `ResponseEnvelope[T]` como modelo Pydantic genérico | Evita duplicação por endpoint, preserva tipagem estrita no OpenAPI. |
| 2 | `Problem` com `model_config = ConfigDict(extra="allow")` e `media_type="application/problem+json"` | Cumpre RFC 7807 literal + permite campos customizados sem violar spec. |
| 3 | `app/core/request_id.py` por `ContextVar` | Correlação fim-a-fim sem `Depends` em todo endpoint. |
| 4 | Rota-demo de erro registrada somente em `APP_ENV != "prod"` **com** `include_in_schema=False` | Disponível em testes (`ci`) sem vazar na OpenAPI pública; produção não registra. |
| 5 | Grupo de rotas `src/app/(app)/` envolvendo também a Home | Shell uniforme em todas as páginas sem duplicação de wrapper. |
| 6 | Template `ModulePage` para as 12 páginas | DRY preservando um `page.tsx` físico por slug (metadados e testes determinísticos). |
| 7 | `esbuild: { jsx: "automatic" }` no `vitest.config.ts` | Compatibilidade com `tsconfig jsx: "preserve"` (que Next compila mas Vitest não). |
| 8 | Prop opcional `pathname` em `<Sidebar/>` e `<Header/>` com *conditional spread* `{...(pathname !== undefined ? { pathname } : {})}` | `exactOptionalPropertyTypes: true` rejeita passagem explícita de `undefined` — padrão canônico para testes determinísticos. |
| 9 | Consumo exclusivo via `var(--color-*)` em todos os componentes | Preserva `tokens.test.ts` herdado da Sprint 0; não altera `tailwind.config.ts`. |
| 10 | CI job `impact-advisory` **separado**, com `continue-on-error: true` redundante | Isolamento e defesa-em-profundidade (o script já faz `sys.exit(0)`). |

---

## 4. Arquivos criados e alterados

### Commit `f0b7d5a` (Sprint 1 · Fatia 1 · backend)

12 arquivos, **+715 / −25 linhas**. Principais:
`backend/app/core/{envelope,errors,request_id}.py`,
`backend/app/api/v1/{__init__,router,contract}.py`,
`backend/app/main.py` (alterado),
`backend/tests/unit/test_envelope.py`,
`backend/tests/contract/{test_contract_base,test_error_handling}.py`,
`backend/tests/unit/test_health.py` (higiene PT023),
`backend/tests/integration/api/test_health_integration.py` (higiene PT023).

### Commit `28b5771` (Sprint 1 · Fatia 2 · frontend)

43 arquivos, **+1785 / −186 linhas**. Principais:
`frontend/vitest.config.ts`, `frontend/src/tests/setup.ts`,
`frontend/src/lib/cn.ts`, `frontend/src/config/modules.ts`,
`frontend/src/app/layout.tsx` (alterado), `frontend/src/app/page.tsx`
(removido/realocado), `frontend/src/app/(app)/{layout,page}.tsx`,
12 × `frontend/src/app/(app)/<slug>/page.tsx`,
`frontend/src/components/shell/{ShellLayout,Sidebar,Header,NavItem,EducationalNotice,ModulePage}.tsx`,
`frontend/src/components/states/{LoadingState,ErrorState,EmptyState,index}.ts(x)`,
`frontend/src/components/ui/{SummaryCard,AlertBanner,FormSection,EducationPanel,index}.ts(x)`,
7 × `frontend/src/__tests__/**`.

### Commit `docs(sprint-01): ...` (Sprint 1 · Fatia 3 · docs)

Criados:
`docs/sprints/sprint-01/{relatorio-execucao,relatorio-forense,validacao-oficial}.md`,
`docs/sprints/sprint-01/evidencias/{README,openapi-diff,impact-agent-ci,pendencias-herdadas-fechamento}.md`,
`docs/sprints/sprint-01/evidencias/screens/README.md`,
`docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md`.

Alterados:
`docs/04_Arquitetura_de_Software.md` (§6.3 — +2 sub-bullets),
`docs/ui/INVENTARIO_TELAS.md` (§1 e §6 — 12 slugs canônicos),
`README.md` (pós-Sprint 1),
`docs/19_Matriz_Rastreabilidade.md` (+2 linhas),
`docs/27_Versionamento_API.md` (apêndice vivo — `v1 active | 2026-04`),
`docs/_meta/living_docs.json` (sprint-01 entries + `generated_at`),
`docs/api/openapi.json` (regenerado — inclui `/api/v1/contract/ping`).

### Commit `ci(sprint-01): ...` (Sprint 1 · Fatia 4 · CI)

1 arquivo alterado: `.github/workflows/ci.yml` (job `impact-advisory`).

---

## 5. Testes criados e ajustados

### Backend

- `tests/unit/test_envelope.py` — **13 casos** unitários do envelope e do
  contexto de `request_id`.
- `tests/contract/test_contract_base.py` — **3 casos** de contrato de
  sucesso sobre `GET /api/v1/contract/ping`.
- `tests/contract/test_error_handling.py` — **7 casos** de contrato para
  os 5 ramos `DomainError` + `ValidationError` + `Exception`.
- Higiene PT023 em `tests/unit/test_health.py` e
  `tests/integration/api/test_health_integration.py` (sem mudança de comportamento).

### Frontend

- `src/__tests__/components/Sidebar.test.tsx` — **4 casos**.
- `src/__tests__/components/Header.test.tsx` — **4 casos**.
- `src/__tests__/components/ShellLayout.test.tsx` — **4 casos** + snapshot leve.
- `src/__tests__/components/states.test.tsx` — **9 casos** (3 estados).
- `src/__tests__/components/ui.test.tsx` — **11 casos** (4 componentes).
- `src/__tests__/app/home.test.tsx` — **3 casos**.
- `src/__tests__/app/routes.test.tsx` — **12 casos** (varredura por slug).
- Removido: `src/__tests__/placeholder.test.ts` (scaffold da Sprint 0,
  substituído pelos testes reais acima).

**Total Sprint 1:** 23 casos backend + 61 casos frontend = **84 casos** novos.

---

## 6. Quality gates executados

### Backend — `make verify && make test-contract`

- `backend/.venv/bin/python -m pytest tests/unit/test_envelope.py -v -m unit`
  → **13 passed**.
- `backend/.venv/bin/python -m pytest tests/contract -v -m contract`
  → **10 passed**.
- `make verify` — passa em ruff/pytest-unit; **mypy segue acusando o erro
  pré-existente** `import-not-found` em `backend/app/db/migrations/env.py`
  (stubs de `alembic` ausentes). Declarado honestamente e mantido como
  pendência para sprint de higiene dedicada (§9 abaixo).

### Frontend — `pnpm lint && pnpm format:check && pnpm typecheck && pnpm test`

- `pnpm lint` → "No ESLint warnings or errors."
- `pnpm format:check` → "All matched files use Prettier code style!"
- `pnpm typecheck` → clean.
- `pnpm test` → **8 arquivos, 61/61 testes verdes** em ~4 s.

### Evidências no repo

- `docs/sprints/sprint-01/evidencias/base-branch.md` — saída dos comandos
  de §2.1 do PLANO (capturada nos CLI_BLOCKs de cada fatia).
- `docs/sprints/sprint-01/evidencias/make-verify-backend.txt` — saída
  integral de `make verify` pós-Fatia 1.
- `docs/sprints/sprint-01/evidencias/make-verify-frontend-*.txt` — saídas
  integrais das etapas de frontend pós-Fatia 2.
- `docs/sprints/sprint-01/evidencias/make-test-contract.txt` — saída
  integral de `make test-contract` pós-Fatia 1.
- `docs/sprints/sprint-01/evidencias/openapi-diff.md` — diff v0→v1 da
  spec pública.
- `docs/sprints/sprint-01/evidencias/impact-agent-ci.md` — prova do step
  no CI da PR (finalizado na Fatia 4).

---

## 7. Problemas encontrados e resolvidos

1. **`git apply --check` falhou no início da Fatia 1** porque o baseline da
   Sprint 0 continha erros ruff PT023 (`@pytest.mark.unit()` vs `@pytest.mark.unit`).
   Correção: higiene mínima nos dois arquivos de teste sem mudança de
   comportamento, aplicada dentro da própria Fatia 1.
2. **`ReferenceError: React is not defined` em 30+ testes de componente
   no Vitest**, porque `tsconfig.json` usa `jsx: "preserve"` (que Next
   compila, mas Vitest/esbuild não). Correção determinística: adicionar
   `esbuild: { jsx: "automatic" }` em `frontend/vitest.config.ts`.
3. **"Found multiple elements with text /carregando/i"** em
   `states.test.tsx`, porque `LoadingState` renderiza o título visível **e**
   uma mensagem `sr-only`. Correção: `getAllByText(...).length >= 1`.
4. **`getByRole("link", { name: "Juros" })` falhando** na Sidebar porque o
   nome acessível inclui o badge "em breve". Correção: matcher regex com
   *escape* de caracteres especiais do shortTitle.
5. **`querySelector('[role="navigation"]')` retornando `null`** — o elemento
   `<nav>` tem role **implícito**. Correção: usar
   `screen.getByRole("navigation", { name: /módulos/i })` do Testing
   Library, que resolve roles implícitos.
6. **TS2375 de `exactOptionalPropertyTypes`** ao passar
   `<Sidebar pathname={pathname} />` com `pathname: string | undefined`.
   Correção: *conditional spread*
   `const pathnameProp = pathname !== undefined ? { pathname } : {};`.

---

## 8. Documentação atualizada nesta sprint

- **Vivos atualizados:** `04_Arquitetura_de_Software.md` (§6.3),
  `27_Versionamento_API.md` (apêndice vivo), `19_Matriz_Rastreabilidade.md`
  (linhas do contrato-base), `ui/INVENTARIO_TELAS.md` (12 slugs canônicos),
  `README.md` (pós-Sprint 1), `_meta/living_docs.json`.
- **Novos criados nesta sprint:** `SINCRONIZACAO_DOCS_SPRINT01.md`,
  `sprints/sprint-01/relatorio-execucao.md`, `relatorio-forense.md`,
  `validacao-oficial.md`, índice e itens de `evidencias/`.
- **Não alterados (rastreabilidade declarada):** Docs 00, 02, 03, 05, 06,
  07, 08, 09, 10, 12, 13–18, 20 (ADR-0006 e ADR-0007 já existiam
  pré-Sprint 1 e foram apenas referenciados).

---

## 9. Pendências honestamente declaradas

| Pendência | Motivo | Sprint alvo |
|-----------|--------|-------------|
| `mypy import-not-found` em `backend/app/db/migrations/env.py` (stubs de `alembic` ausentes) | Herdado da Sprint 0; fora do escopo documental desta sprint | Sprint de higiene (candidata à Sprint 2) |
| Playwright / snapshots visuais completos das 12 rotas | §12 do Prompt Sprint 1 exclui E2E complexo; parcialmente coberto por snapshot leve de `ShellLayout` | Sprint 2 |
| ADR-0002 (critérios de *WARNING* do agente de impacto) | §12 do Prompt Sprint 1 exclui evolução do agente; Fatia 4 entrega apenas *advisory* | Sprint 2 |
| Promoção do agente de impacto de `advisory` → `warning` → `blocking` | Divergência com CND-03 declarada em §6.4 do PLANO e em `validacao-oficial.md` | Sprint 2 |
| `openapi.json` passa a incluir `/api/v1/contract/ping` mas os 15 endpoints de domínio do Doc 06 permanecem **não implementados** | Prompt Sprint 1 §12 exclui implementação de domínios | Sprints 2–5 |

---

## 10. Instruções de reprodução

```bash
# Clonar e entrar
git clone https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira.git
cd Plataforma_Educacional_Financeira
cp .env.example .env   # editar DATABASE_URL local se necessário

# Backend
cd backend && uv venv .venv && uv pip install -e ".[dev]" --python .venv/bin/python
.venv/bin/python -m alembic upgrade head
cd ..

# Frontend
(cd frontend && pnpm install --prefer-offline)

# Quality gates — pipeline completo
make verify                         # backend + frontend
make test-contract                  # contratos RFC 7807 (Sprint 1)

# Validação isolada do frontend (determinística)
(cd frontend && pnpm lint && pnpm format:check && pnpm typecheck && pnpm test)

# OpenAPI
backend/.venv/bin/python scripts/export_openapi.py

# Agente de impacto (advisory)
backend/.venv/bin/python scripts/impact_analysis_guard.py --base HEAD~1
```

---

## 11. Referências

- `docs/sprints/sprint-01/relatorio-forense.md`
- `docs/sprints/sprint-01/validacao-oficial.md`
- `docs/sprints/sprint-01/evidencias/pendencias-herdadas-fechamento.md`
- `docs/_meta/SINCRONIZACAO_DOCS_SPRINT01.md`
- `docs/adr/ADR-0006-api-versioning-url.md`
- `docs/adr/ADR-0007-http-errors-rfc7807.md`
- `docs/sprints/sprint-00/validacao-oficial.md` (histórico — não alterado)
