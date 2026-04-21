# Plataforma Educacional Financeira

Plataforma web educacional para simulações de matemática financeira acessíveis ao público geral.

## Stack

| Camada     | Tecnologia                                               |
|------------|----------------------------------------------------------|
| Frontend   | Next.js 14+, React 18+, TypeScript 5+ (strict)           |
| Backend    | Python 3.11+, FastAPI, Pydantic v2                       |
| Banco      | PostgreSQL 15+                                           |
| Cache      | Redis 7+ (opcional)                                      |
| ORM        | SQLAlchemy 2.0+ / Alembic                                |
| Testes BE  | pytest, pytest-asyncio, hypothesis, schemathesis         |
| Testes FE  | Vitest 1.6+, @testing-library/react 16+, jsdom 24+       |

## Setup rápido

```bash
# 1. Clone e entre no diretório
git clone https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira.git
cd Plataforma_Educacional_Financeira

# 2. Configure variáveis de ambiente
cp .env.example .env
# edite .env conforme necessário (DATABASE_URL, etc.)

# 3. Suba o banco de dados
make up

# 4. Instale dependências
make install

# 5. Execute migrations
make migrate

# 6. Inicie o backend (em um terminal)
cd backend && uvicorn app.main:app --reload

# 7. Inicie o frontend (em outro terminal)
cd frontend && pnpm dev
```

Acesse `http://localhost:3000/` para a Home com o grid dos 12 módulos
(entregue na Sprint 1) e `http://localhost:8000/api/v1/contract/ping` para a
rota-demo de contrato-base.

## Comandos principais

```bash
make verify          # lint + format + typecheck + unit tests (backend + frontend)
make verify-full     # verificação completa
make test-unit       # testes unitários (backend)
make test-integration # testes de integração (backend)
make test-contract   # testes de contrato (envelope + RFC 7807) — Sprint 1
make migrate         # executa migrations
make healthcheck     # verifica saúde da API
make up              # sobe Postgres local
make down            # para serviços
```

Validação isolada do frontend (determinística):

```bash
cd frontend
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
```

## O que está materializado (pós-Sprint 1)

### Backend
- Contrato-base HTTP com envelope `{success, message, data, meta}` — `backend/app/core/envelope.py`.
- Erros RFC 7807 (`application/problem+json`) — `backend/app/core/errors.py`.
- Correlação via `X-Request-ID` — `backend/app/core/request_id.py`.
- Versionamento por URL `/api/v1` — `backend/app/api/v1/` (ADR-0006).
- Rota-demo pública: `GET /api/v1/contract/ping` retornando o envelope com metadados.
- 23 testes novos (13 unit + 10 contract).

### Frontend
- Shell navegável: `ShellLayout` + sidebar (9 grupos, 12 links) + header + main + footer + banner educacional (Doc 18).
- 12 rotas canônicas com slugs do Doc 06 (`/cartao-rotativo`, `/investir-vs-quitar`, etc.).
- Home com grid dos 12 módulos.
- 3 estados reutilizáveis (`LoadingState`, `ErrorState`, `EmptyState`) com API `{title, description, action?}`.
- 4 componentes UI (`SummaryCard`, `AlertBanner`, `FormSection`, `EducationPanel`).
- Fonte única dos módulos em `frontend/src/config/modules.ts`.
- 61 testes de componente e rota em Vitest + Testing Library.

### CI
- Job `impact-advisory` em `.github/workflows/ci.yml` rodando `scripts/impact_analysis_guard.py` em modo advisory (paralelo, não bloqueia).

## Documentação

Toda a documentação do projeto está em `/docs/`. Principais referências:

- `docs/baseline/01_Visao_do_Produto.md`
- `docs/04_Arquitetura_de_Software.md`
- `docs/06_API_e_Contratos.md`
- `docs/07_UX_UI_e_Navegacao.md`
- `docs/16_Design_System.md`
- `docs/18_Mapeamento_Regulatorio.md`
- `docs/27_Versionamento_API.md`
- `docs/adr/` — Decisões arquiteturais (ADR-0001..ADR-0007)
- `docs/sprints/sprint-00/` — Histórico da Sprint 0
- `docs/sprints/sprint-01/` — Histórico da Sprint 1

## Licença

Uso interno — todos os direitos reservados.
