# Plataforma Educacional Financeira

Plataforma web educacional para simulações de matemática financeira acessíveis ao público geral.

## Stack

| Camada     | Tecnologia                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 14+, React 18+, TypeScript 5+  |
| Backend    | Python 3.11+, FastAPI, Pydantic v2     |
| Banco      | PostgreSQL 15+                          |
| Cache      | Redis 7+ (opcional)                     |
| ORM        | SQLAlchemy 2.0+ / Alembic              |
| Testes BE  | pytest, hypothesis, schemathesis        |
| Testes FE  | vitest, @testing-library/react, Playwright |

## Setup rápido

```bash
# 1. Clone e entre no diretório
git clone https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira.git
cd Plataforma_Educacional_Financeira

# 2. Configure variáveis de ambiente
cp .env.example .env
# edite .env conforme necessário

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

## Comandos principais

```bash
make verify          # lint + format + typecheck + unit tests
make verify-full     # verificação completa
make test-unit       # testes unitários
make test-integration # testes de integração
make migrate         # executa migrations
make healthcheck     # verifica saúde da API
make up              # sobe Postgres local
make down            # para serviços
```

## Documentação

Toda a documentação do projeto está em `/docs/`. Principais referências:

- `docs/baseline/01_Visao_do_Produto.md`
- `docs/04_Arquitetura_de_Software.md`
- `docs/06_API_e_Contratos.md`
- `docs/20_ADR/` — Decisões arquiteturais

## Licença

Uso interno — todos os direitos reservados.
