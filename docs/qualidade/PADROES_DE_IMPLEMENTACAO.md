# PADRÕES DE IMPLEMENTAÇÃO E QUALIDADE DE CÓDIGO — PLATAFORMA EDUCACIONAL FINANCEIRA

**Versão:** 1.0
**Status:** VIVO
**Aplicabilidade:** Backend (Python/FastAPI), Frontend (Next.js/React/TypeScript), scripts e infraestrutura.

---

## 1. Convenções de código frontend

### 1.1 Linguagem e configuração
- TypeScript estrito (`"strict": true`, `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true`).
- ESLint com `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `eslint-plugin-import`, `eslint-plugin-unicorn`.
- Prettier para formatação. Sem divergência entre ESLint e Prettier.
- Importações ordenadas (built-in → externos → aliases → relativos).

### 1.2 Estrutura
- `src/app/` — rotas Next.js (App Router).
- `src/components/` — componentes apresentacionais e de container; subpastas por domínio.
- `src/components/critical/` — componentes críticos (testes obrigatórios + cobertura ≥85%).
- `src/lib/api/` — cliente API gerado a partir do OpenAPI.
- `src/lib/finance/` — adaptadores (sem regra matemática autoritativa; apenas formatação e parsing).
- `src/hooks/` — hooks customizados.
- `src/types/` — tipos compartilhados (gerados quando possível).
- `src/styles/` — tokens (gerados a partir do Doc 16) e estilos globais.

### 1.3 React/Next
- Server Components por padrão; Client Components somente quando há interatividade ou `useState`/`useEffect` necessários.
- `'use client'` no topo de qualquer arquivo cliente.
- Fetch em Server Components; no cliente, via hooks dedicados (`useSimulation`, etc.).
- Sem `useEffect` para data fetching quando puder ser Server Component.
- Estados de UI explícitos: `loading`, `empty`, `error`, `success` (componente padrão `<UIState />`).

## 2. Convenções de código backend

### 2.1 Linguagem e configuração
- Python 3.11+.
- `ruff` (lint + isort), `black` (format), `mypy --strict`, `bandit` (segurança).
- Tipagem: nada de `Any` sem justificativa.
- Pydantic v2 para schemas (request/response).

### 2.2 Estrutura
- `app/api/` — routers FastAPI; thin (apenas validação + delegação a service).
- `app/schemas/` — Pydantic in/out, separados (`SimulationIn`, `SimulationOut`).
- `app/services/` — orquestração do caso de uso.
- `app/domain/` — fórmulas e regras puras (sem I/O, sem framework).
- `app/repositories/` — acesso a dados (SQLAlchemy + sessão injetada).
- `app/core/` — configuração, segurança, logging, dependências.
- `app/db/` — sessão, modelos ORM, migrations Alembic.
- `tests/` — espelha estrutura.

### 2.3 FastAPI
- Routers por domínio (`/interest`, `/amortization`, `/financing`, ...).
- Versão na URL (`/api/v1/...`).
- Dependências injetadas via `Depends()`.
- Sem lógica em endpoint além de delegação e composição de resposta.

## 3. Naming conventions

| Item | Convenção |
|------|-----------|
| Arquivo Python | `snake_case.py` |
| Arquivo TS | `kebab-case.ts` (utilitários) / `PascalCase.tsx` (componente) |
| Classe | `PascalCase` |
| Função/método | `snake_case` (Python) / `camelCase` (TS) |
| Constante | `UPPER_SNAKE_CASE` |
| Variável booleana | `is_*`, `has_*`, `should_*` |
| Tabela DB | `snake_case_plural` (`simulations`, `users`) |
| Coluna DB | `snake_case` |
| Endpoint REST | `kebab-case` |
| Branch Git | conforme Doc 21 |
| Commit | conforme Doc 21 (convencional) |

## 4. Limites numéricos (gates de qualidade)

| Métrica | Alvo | Limite duro (bloqueia) |
|---------|------|------------------------|
| Linhas por arquivo | ≤ 400 | 600 |
| Linhas por função/método | ≤ 50 | 80 |
| Argumentos por função | ≤ 5 | 7 |
| Profundidade de aninhamento | ≤ 3 | 4 |
| Complexidade ciclomática | ≤ 10 | 15 |
| Cognitive complexity | ≤ 12 | 18 |
| Imports por arquivo | — | 30 |
| Tempo de função pura | — | 100 ms (alerta), 500 ms (bloqueio em hot path) |

> Validados por `radon`/`xenon` (Python) e `eslint-plugin-sonarjs`/`complexity` (TS).

## 5. Modularidade e separação de responsabilidades

1. **Regra de ouro:** domínio puro não importa framework, ORM, HTTP ou logging não-estruturado.
2. Service não toca SQL diretamente — sempre via repositório.
3. Endpoint não chama domínio diretamente — sempre via service.
4. Componente apresentacional não chama API — usa hook ou recebe via prop.
5. Hooks isolam side-effects; componentes ficam puros sempre que possível.
6. Sem dependências circulares (`madge` no FE, `import-linter` no BE).

## 6. Padrões de erro

### 6.1 Backend
- Erros conhecidos: subclasses de `AppError(Exception)` com `code`, `http_status`, `message`, `detail` opcional.
- Catch genérico apenas em handler global FastAPI; nunca em service/domain.
- Resposta de erro: `application/problem+json` (RFC 7807) com `type`, `title`, `status`, `detail`, `instance`, `code`.

### 6.2 Frontend
- `Result<T, E>` ou `try/catch` localizado.
- Toda chamada à API trata `loading`, `error`, `success`.
- Sem `alert()`/`console.error` deixado.
- Mensagens de erro humanizadas (sem stack trace).

## 7. Padrões de logs

- Backend: `structlog` com formato JSON; campos obrigatórios `timestamp`, `level`, `service`, `correlation_id`, `event`, `domain`, `route` (quando aplicável).
- Frontend: `console.*` proibido em código de produção; usar `logger` interno (com sampling em produção).
- Sem PII em logs (CPF, e-mail mascarados; valores monetários permitidos).
- Logs em `INFO` para fluxo normal, `WARN` para casos de borda esperados, `ERROR` para exceções.

## 8. Padrões de validação

- Backend: validação no schema Pydantic (limites de moeda, taxa, prazo conforme Doc 03).
- Frontend: validação no formulário com `zod` ou `yup`; espelha Pydantic.
- Validação financeira específica (intervalos): centralizada em `app/domain/validators/`.

## 9. Padrões de DTO/schema

- DTO de entrada e DTO de saída **separados** por endpoint (ex.: `JurosCompostosIn`, `JurosCompostosOut`).
- Sem reutilizar modelo ORM como schema HTTP.
- Decimal: `Decimal` no domínio; `str` ou `Decimal` no JSON com precisão definida (Doc 03 §3).

## 10. Padrões de services

- Um service por caso de uso (`CalcularPriceService`, `CalcularAtrasoService`, ...).
- Service recebe entrada validada e devolve saída estruturada (incluindo `summary`, `tables`, `charts`, `interpretation`, `alerts`).
- Service é testável sem rodar API.

## 11. Padrões de repositório

- Um repositório por agregado (`SimulationRepository`, `UserRepository`).
- Métodos com nomes intencionais (`get_by_id`, `list_by_user`, `save`).
- Sem queries SQL fora de repositório.
- Transações explícitas em service via context manager (`with uow:`).

## 12. Padrões de testes (resumo cruzando com Doc 09 e Estratégia)

- Espelha estrutura (`tests/<area>/...`).
- Um teste = um comportamento.
- AAA: Arrange–Act–Assert.
- `pytest` fixtures por escopo apropriado; sem fixtures mágicas globais.
- Para cada bug encontrado, um teste de regressão antes do fix.

## 13. Padrões de comentários

- Comentário explica **por quê**, não **o quê**.
- Sem comentário óbvio (`# incrementa contador`).
- Sem código comentado deixado.
- TODO/FIXME exigem ID de issue (`# TODO(#123): ...`).

## 14. Padrões de documentação via código (alta exigência)

### 14.1 Backend
- **Docstrings Google style** em todas as funções públicas, classes e módulos relevantes.
- Exemplo:
  ```python
  def juros_compostos(principal: Decimal, taxa: Decimal, n: int) -> Decimal:
      """Calcula montante por juros compostos.

      Args:
          principal: Capital inicial em Reais (>0).
          taxa: Taxa por período em fração decimal (ex.: 0.01 = 1%).
          n: Número de períodos (>0).

      Returns:
          Montante final, arredondado a 2 casas (HALF_EVEN).

      Raises:
          ValidationError: se algum parâmetro estiver fora dos intervalos do Doc 03.
      """
  ```
- Pydantic: `description=` em todos os campos públicos.
- `mkdocs-material` gera site de docs a partir do código + Markdowns vivos.

### 14.2 Frontend
- **TSDoc** em todas as funções públicas, hooks e componentes públicos.
- Exemplo:
  ```ts
  /**
   * Hook que executa simulação de juros compostos contra a API.
   * @param input parâmetros validados pelo schema do formulário.
   * @returns estado `{loading, data, error}` da simulação.
   * @example
   * const { loading, data } = useJurosCompostos({ principal: 1000, taxa: 0.01, n: 12 });
   */
  ```
- `TypeDoc` gera docs a cada release.

### 14.3 Geração automática
- Pipeline gera `docs-site/` a partir de TypeDoc + mkdocs no job `docs:build`.
- Falha de geração bloqueia release.
- Sem TSDoc/docstring vazio (lint customizado: `eslint-plugin-tsdoc` + `pydocstyle`).

## 15. Padrões de segurança no código

- Sem segredos no repositório (segredos via `.env` + `direnv` local; vault em produção).
- Pre-commit `gitleaks`/`detect-secrets`.
- Validação rigorosa de entrada (whitelist > blacklist).
- Sanitização de saída (sem HTML não-escapado).
- CSP estrito no Next; cookies `HttpOnly`, `Secure`, `SameSite=Lax`.
- Headers HTTP de segurança via middleware (HSTS, X-Content-Type-Options, Referrer-Policy).

## 16. Padrões de performance

- Decimal apenas onde a precisão importa (domínio); float em estatística.
- Sem N+1 em queries (lint via `sqlcommenter` / inspeção em CI).
- Paginação obrigatória em listagens > 50 itens.
- Cache só com invalidação clara (Redis opcional).
- React: `memo`/`useMemo`/`useCallback` justificados; sem otimização prematura.

## 17. Padrões para Claude Code (operacionais)

1. Antes de iniciar, ler **este documento + Governança Rígida + matriz Vivo/Estático + lacunas pendentes**.
2. Toda função nova nasce com docstring/TSDoc + teste.
3. Toda decisão de arquitetura nasce com ADR.
4. Toda função de domínio financeiro tem caso em `tests/regression/financial/` referenciando o Doc 15.
5. Toda PR roda `make verify` localmente antes de subir.
6. Toda PR roda o agente de impacto e responde aos avisos.

## 18. Anti-padrões proibidos

- "TODO arrumar depois" sem ID de issue.
- "OK por enquanto" em comentário.
- Funções `process()`, `handle()`, `do()` sem complemento semântico.
- Variáveis `x`, `tmp`, `data`, `info` em código não-trivial.
- Catch genérico (`except Exception`) fora do handler global.
- `try/except: pass`.
- Comentário em inglês mal-traduzido em código com identificadores em português.
- Mistura inconsistente PT/EN nos identificadores: padrão = identificadores em **inglês**, copy/textos pedagógicos em **português**.

## 19. Geração e revisão automatizada

- `make verify` localmente.
- CI roda tudo em PR.
- Revisão por humano final é obrigatória mesmo com tudo verde.
