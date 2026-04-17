# DOCUMENTO 04 — ARQUITETURA DE SOFTWARE
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente na auditoria de fechamento de não conformidades)
**Tipo:** Arquitetura de Software
**Status canônico:** VIVO (atualizado a cada ADR aceito ou mudança estrutural)
**Substitui:** Documento 04 v1.0 integralmente.

---

## 1. Finalidade
Definir a arquitetura oficial do produto, suas fronteiras de módulo, sua stack tecnológica, seus padrões transversais, sua política de evolução e as decisões arquiteturais de referência. Este documento é a fonte oficial de verdade para qualquer decisão arquitetural de implementação.

## 2. Objetivo arquitetural central
Construir um produto que seja simultaneamente:
- didático (favorece compreensão antes da sofisticação);
- tecnicamente confiável (matemática inviolável, contratos estáveis);
- escalável (cresce sem refator destrutivo);
- modular (acopla por contrato, separa por responsabilidade);
- testável (cada camada testável em isolamento);
- visualmente moderno (UX/UI rica, mas guiada por sistema);
- pronto para evolução futura (Open Finance, autenticação, multicanal).

## 3. Diretriz arquitetural principal
A arquitetura é **híbrida, modular e em camadas**, composta por:
- **frontend web desacoplado** (Next.js/React/TypeScript, App Router);
- **backend de domínio financeiro** (Python 3.11+/FastAPI);
- **banco de dados relacional** (PostgreSQL);
- **camada opcional de cache** (Redis, ativado conforme necessidade);
- **contratos REST explícitos e versionados** (`/api/v1`, OpenAPI 3.1).

## 4. Stack oficial (decisões formalizadas em ADR)
| Camada | Tecnologia | ADR |
|--------|-----------|-----|
| Frontend | Next.js 14+ (App Router), React 18+, TypeScript 5+ estrito | ADR-0001 |
| Backend | Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0+ | ADR-0002 |
| Banco | PostgreSQL 15+ | ADR-0003 |
| Cache | Redis 7+ (opcional, ativado por flag) | ADR-0004 |
| Migrations | Alembic | ADR-0009 |
| ORM | SQLAlchemy 2.0+ (estilo declarativo + sessão escopo de request) | ADR-0011 |
| Estilização | Tailwind CSS + tokens do Doc 16 | ADR-0012 |
| Testes BE | pytest, hypothesis, schemathesis, mutmut | ADR-0010 |
| Testes FE | vitest, @testing-library/react, Playwright | ADR-0010 |
| Observabilidade | structlog (BE), Prometheus client, OpenTelemetry (futuro) | ADR-0013 |
| Containerização | Docker (multi-stage), docker-compose (dev) | ADR-0014 |

## 5. Estilos arquiteturais combinados
- **Arquitetura em camadas** (UI → API → Service → Domain → Repository → DB).
- **Organização por domínio** (bounded contexts financeiros).
- **Cliente-servidor desacoplado** (FE consome API REST tipada).
- **Backend autoritativo para matemática** (frontend nunca duplica fórmula).
- **Evolução incremental** (expand-and-contract, ADRs, versionamento de contrato).

## 6. Visão macro (modelo C4 sintético)

### 6.1 C4 Nível 1 — Contexto
- **Pessoas:** estudante/leigo financeiro (principal), educador (secundário, futuro), administrador (futuro).
- **Sistemas externos imediatos:** nenhum no MVP. Futuros: provedor de e-mail, fontes oficiais BCB (Selic, TR), Open Finance.

### 6.2 C4 Nível 2 — Containers
- **frontend-web** (Next.js, server+client components).
- **backend-api** (FastAPI).
- **postgres-db** (PostgreSQL).
- **cache-redis** (Redis, opcional).
- **storage-files** (filesystem local em dev; objeto/S3-like em prod, para PDFs/Excel).

### 6.3 C4 Nível 3 — Componentes do backend
- `app/api/` — routers REST por domínio.
- `app/schemas/` — Pydantic in/out (separados por endpoint).
- `app/services/` — orquestradores de caso de uso.
- `app/domain/` — fórmulas e regras puras (sem framework, sem I/O).
- `app/repositories/` — acesso a dados (SQLAlchemy).
- `app/core/` — configuração, segurança, logging, dependências.
- `app/db/` — sessão, modelos ORM, migrations.
- `app/exporters/` — geração de PDF (ReportLab) e Excel (openpyxl).

### 6.4 C4 Nível 3 — Componentes do frontend
- `src/app/` — rotas (App Router).
- `src/components/` — componentes apresentacionais e de container (subpastas por domínio).
- `src/components/critical/` — componentes críticos (cobertura ≥85%).
- `src/lib/api/` — cliente API gerado a partir do OpenAPI.
- `src/lib/finance/` — adaptadores (formatação, parsing) — sem regra matemática autoritativa.
- `src/hooks/` — hooks customizados.
- `src/styles/` — tokens (gerados a partir do Doc 16) + estilos globais.
- `src/types/` — tipos compartilhados (gerados quando possível).

## 7. Princípios arquiteturais obrigatórios
1. **Backend é a fonte única da verdade matemática.** Frontend nunca recalcula fórmula autoritativa.
2. **Separação por responsabilidade.** Endpoint thin; service orquestra; domain é puro; repository isola SQL.
3. **Baixo acoplamento, alta coesão.** Domínios não importam uns aos outros sem necessidade explícita.
4. **Testabilidade.** Toda fronteira é testável isoladamente.
5. **Tipagem e contratos claros.** TypeScript estrito; Pydantic em todas as superfícies.
6. **Evolução incremental.** Mudança breaking exige ADR + versionamento.
7. **Observabilidade by design.** Toda rota tem log + métrica.
8. **Segurança by design.** Validação rigorosa de entrada; sem stack-trace ao usuário.
9. **Documentação viva.** Contrato OpenAPI gerado pelo código; ADRs registram decisões.
10. **Reversibilidade.** Migrations reversíveis; releases reversíveis.

## 8. Por que arquitetura híbrida
- separa **UX rica** (frontend) do **motor financeiro rigoroso** (backend);
- facilita **evolução paralela** das duas camadas;
- protege a **matemática** de regressões disfarçadas em mudanças de UI;
- mantém **contratos** como única superfície de mudança coordenada.

## 9. Arquitetura do frontend

### 9.1 Responsabilidades
- renderização da interface;
- navegação e roteamento;
- formulários com validação client-side (espelho do Pydantic);
- consumo da API (via cliente tipado);
- visualização de cards, tabelas, gráficos e mensagens;
- estados de UI (`loading`, `vazio`, `erro`, `sucesso`).

### 9.2 Não deve conter
- cálculo financeiro autoritativo;
- regras centrais de amortização;
- lógica de negócio que possa divergir do backend.

### 9.3 Server Components vs Client Components
- **Server Components por padrão** (zero JavaScript cliente quando não há interatividade).
- **Client Components** (`'use client'`) somente quando há `useState`, `useEffect`, eventos do DOM, ou bibliotecas client-only (gráficos interativos).
- Fetch de dados em Server Components quando possível; em hooks dedicados (`useSimulation`) quando cliente.
- Cache do Next: `revalidate` por rota; nunca usar `force-cache` em endpoints de simulação (que mudam por payload).

### 9.4 Estratégia de fetching
- Cliente tipado em `src/lib/api/` é a única superfície de chamada à API.
- Sem `fetch` direto em componentes.
- Tratamento padronizado de loading/empty/error via componente `<UIState />`.

### 9.5 Regras
- TypeScript estrito (`strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`).
- Sem `any` sem comentário aprovado.
- Componentes só usam tokens do Doc 16; sem cores ad-hoc.

## 10. Arquitetura do backend

### 10.1 Responsabilidades
- expor endpoints REST `/api/v1/...`;
- validar payloads (Pydantic);
- aplicar regras de negócio (services);
- executar cálculos (domain puro);
- montar respostas estruturadas (`summary`, `tables`, `charts`, `interpretation`, `alerts`);
- persistir dados quando necessário (repositories);
- gerar relatórios (exporters);
- emitir logs e métricas (core).

### 10.2 Injeção de dependências
- FastAPI `Depends()` para sessão de DB, settings, request-context.
- Sem singletons mutáveis; estado por request quando aplicável.

### 10.3 Padrão de transação (Unit of Work)
- Sessão de DB criada por request, fechada no fim.
- Service que realiza mais de uma escrita usa contexto explícito (`with uow:`).
- Sem `commit` espalhado em repositories.

### 10.4 Regras
- Endpoint **thin**: validação + delegação a service.
- Service não toca SQL — sempre via repository.
- Domain puro: sem framework, sem ORM, sem I/O.
- Tipagem mypy `--strict`.

## 11. Organização por domínio (bounded contexts)
Domínios oficiais:
- `diagnostic` — diagnóstico financeiro
- `interest` — juros simples e compostos
- `amortization` — PRICE e SAC
- `financing` — imobiliário e veículo
- `loans` — consignado e CDC
- `credit_card` — rotativo
- `late_payment` — parcela em atraso
- `indicators` — Selic, TR, IPCA, IOF, CET
- `invest_vs_debt` — decisão investir vs quitar
- `education` — conteúdo, glossário, FAQ
- `export` — geração de PDF e Excel

Cada domínio tem espelho em `app/domain/<nome>/`, `app/services/<nome>/`, `app/api/<nome>.py`, `app/schemas/<nome>.py`, `tests/unit/domain/<nome>/`, `tests/integration/api/test_<nome>.py`, `tests/regression/financial/<nome>/`.

## 12. Fronteiras formais entre módulos
Regras:
1. Domínio A **não importa** módulos de domínio B sem ADR.
2. Compartilhamento entre domínios ocorre por **service de composição** (ex.: `services/comparison/`) que orquestra dois domínios via interfaces.
3. `core/` pode ser importado por qualquer camada.
4. `domain/` **não importa** `services/`, `api/`, `repositories/`, `db/`, `core/log` (apenas tipos).
5. `services/` **não importa** `api/`.
6. `repositories/` **não importa** `services/` ou `api/`.
7. Sem ciclos de import (`import-linter` no backend, `madge` no frontend).

## 13. Fluxo arquitetural de uma requisição
1. Usuário preenche formulário no frontend e submete.
2. Frontend valida client-side e dispara requisição via cliente tipado.
3. Router FastAPI recebe; Pydantic valida payload.
4. Service do caso de uso é invocado.
5. Service chama função pura de `domain/` para o cálculo.
6. Service compõe resposta com `summary`, `tables`, `charts`, `interpretation`, `alerts`.
7. Resposta serializada pelo Pydantic out-schema.
8. Frontend renderiza estados (loading/empty/error/success).
9. Logs e métricas registrados em cada etapa.

## 14. Contratos entre frontend e backend
Governados pelo Doc 06 (API e Contratos) e pelo Doc 27 (Versionamento). Princípios:
- Versão na URL: `/api/v1`.
- OpenAPI 3.1 gerado pelo FastAPI é a fonte única.
- Erros padronizados em RFC 7807 (`application/problem+json`).
- Idempotência via `Idempotency-Key` em mutações.
- Mudança breaking exige nova major version + ADR.

## 15. Estratégia de persistência
- PostgreSQL como banco oficial; UTF-8; UTC.
- UUID v4/v7 como PK das entidades principais.
- Soft delete onde aplicável (ver Doc 14).
- Migrations Alembic, **expand-and-contract**, sempre reversíveis.
- Sem `DROP COLUMN`/`DROP TABLE` na mesma PR que introduz substituto.

## 16. Estratégia de exportação
- Backend gera PDF (ReportLab) e Excel (openpyxl).
- Geração assíncrona quando o relatório for grande (futuro).
- Metadados persistidos em `reports`; arquivo em storage.
- Smoke de exportação no pipeline.

## 17. Segurança arquitetural
- Validação rigorosa de payloads (Pydantic + validators de domínio).
- Sem stack-trace exposto (handler global FastAPI).
- Segredos via `.env` em dev, vault em produção.
- CORS controlado por ambiente.
- Headers HTTP de segurança via middleware (HSTS, X-Content-Type-Options, Referrer-Policy, CSP).
- Cookies `HttpOnly`, `Secure`, `SameSite=Lax`.
- Detalhe operacional em Doc 17 e Doc 22.

## 18. Observabilidade arquitetural
- Logs estruturados (structlog, JSON) com `correlation_id`.
- Métricas Prometheus em `/metrics`.
- Health checks: `/health`, `/health/ready`, `/health/live`.
- Tracing OpenTelemetry (futuro, quando houver múltiplos serviços).
- Detalhe operacional em Doc 23.

## 19. Política de evolução arquitetural
1. Toda decisão estrutural exige **ADR** (Doc 20).
2. Mudança de stack exige ADR + análise de migração + janela de rebaseline.
3. Substituição de componente segue **strangler pattern** quando possível.
4. Refator não-trivial nasce com **plano de não-regressão** (suite ampliada).
5. Auditoria arquitetural anual (revisão dos ADRs aceitos).

## 20. Estrutura de pastas oficial

```text
financial-education-platform/
├─ frontend/
│  ├─ src/
│  │  ├─ app/
│  │  ├─ components/
│  │  │  ├─ critical/
│  │  │  └─ <dominio>/
│  │  ├─ lib/
│  │  │  ├─ api/
│  │  │  └─ finance/
│  │  ├─ hooks/
│  │  ├─ types/
│  │  ├─ content/         # textos pedagógicos versionados
│  │  └─ styles/
│  ├─ tests/
│  ├─ package.json
│  └─ tsconfig.json
├─ backend/
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ api/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  ├─ domain/
│  │  ├─ repositories/
│  │  ├─ core/
│  │  ├─ db/
│  │  │  └─ migrations/
│  │  └─ exporters/
│  ├─ seeds/
│  ├─ tests/
│  │  ├─ unit/
│  │  ├─ integration/
│  │  ├─ contract/
│  │  ├─ regression/
│  │  ├─ visual/         # apenas se compartilhar com FE
│  │  └─ recovery/
│  └─ pyproject.toml
├─ docs/
│  ├─ baseline/          # estáticos e baseline candidata
│  ├─ qualidade/         # estratégia de testes, padrões, pipeline, agente
│  ├─ 20_ADR/            # ADRs individuais
│  ├─ 24_runbooks/       # runbooks individuais
│  └─ _meta/             # índices auxiliares (living_docs.json)
├─ docker/
├─ scripts/
│  ├─ impact/
│  │  └─ rules.yaml
│  └─ impact_analysis_guard.py
├─ .github/
│  ├─ CODEOWNERS
│  ├─ pull_request_template.md
│  └─ workflows/
├─ .env.example
├─ Makefile
└─ README.md
```

## 21. ADRs sementes referenciados
- ADR-0001 Frontend Next.js+React+TS
- ADR-0002 Backend Python+FastAPI
- ADR-0003 Postgres como banco oficial
- ADR-0004 Backend é fonte única da matemática
- ADR-0005 Organização por domínio
- ADR-0006 Versão de API explícita (`/api/v1`)
- ADR-0007 Erros REST RFC 7807
- ADR-0008 Trunk-based + squash merge
- ADR-0009 Migrations expand-and-contract reversíveis
- ADR-0010 Pirâmide de testes com mutação semanal no domínio
- ADR-0011 SQLAlchemy 2.0 + sessão por request
- ADR-0012 Tailwind + tokens do Doc 16
- ADR-0013 structlog + Prometheus
- ADR-0014 Docker multi-stage

Detalhe dos ADRs em `/docs/20_ADR/`.

## 22. Política de revisão deste documento
Este documento é VIVO. Atualizações são obrigatórias em:
- novo ADR aceito;
- mudança de stack;
- mudança de fronteira de módulo;
- adição/remoção de domínio;
- mudança em padrão transversal (DI, transação, observabilidade).

Toda PR que altere `app/domain/`, `app/services/`, `app/api/`, `app/db/`, `frontend/src/lib/api/` ou `scripts/impact/rules.yaml` deve atualizar este documento se a mudança tocar princípios arquiteturais ou fronteiras de módulo.

## 23. Critérios de aceite deste documento
Aceito quando:
- Claude Code consegue derivar fronteiras de módulo sem ambiguidade;
- ADRs sementes existem como arquivos individuais em `/docs/20_ADR/`;
- C4 níveis 1–3 estão materializados (mesmo que em prosa);
- política de evolução está clara;
- referências cruzadas (Docs 06, 14, 17, 20, 22, 23, 27) estão consistentes.
