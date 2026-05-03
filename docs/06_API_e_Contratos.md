# DOCUMENTO 06 — API E CONTRATOS DE INTEGRAÇÃO
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente na auditoria de fechamento de não conformidades)
**Tipo:** API e Contratos de Integração
**Status canônico:** VIVO (atualizado a cada nova rota/contrato/versão)
**Substitui:** Documento 06 v1.0 integralmente.

---

## 1. Finalidade
Definir o padrão da API REST, suas convenções, o formato canônico de respostas, o tratamento padronizado de erros, o versionamento, a paginação, a idempotência, o rate-limit, os timeouts e as regras de evolução do contrato.

## 2. Estilo de integração adotado
- **REST sobre HTTPS**.
- **JSON** (`application/json`) como formato padrão.
- **OpenAPI 3.1** gerado a partir do código FastAPI (single source of truth).
- **Versionamento por prefixo de URL**: `/api/v1`, `/api/v2`.
- **Erros** em RFC 7807 (`application/problem+json`).
- **Tipagem forte** (Pydantic v2 + tipos TS gerados).

## 3. Convenções gerais

### 3.1 Prefixo base
`/api/v<N>` onde `N` é a versão major. Ex.: `/api/v1/interest/compound`.

### 3.2 Formato de dados
- Padrão: `application/json`.
- Exceções: `application/pdf`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

### 3.3 Convenção de nomes
- Caminhos REST em `kebab-case` (`/credit-card/revolving`).
- Campos JSON em `snake_case` (compatibilidade com Python; tipos gerados convertem para camelCase no cliente quando preferido).
- Enums em `UPPER_SNAKE_CASE`.

### 3.4 Datas
- ISO 8601 sempre em UTC (`2026-04-14T12:34:56Z`).
- Datas sem hora: `YYYY-MM-DD`.

### 3.5 Monetário
- Tipo: `string` decimal com 2 casas (ex.: `"1234.56"`) — evita imprecisão de IEEE 754.
- Cliente parseia para `Decimal`/`BigNumber`.
- Sem formatação local na API (sem `R$`, sem milhar). Formatação fica no frontend.

### 3.6 Percentual e fatores
- Taxa como **fração decimal** (`"0.01"` = 1%). Cliente formata para apresentação.
- Fatores até 8 casas decimais.

### 3.7 Identificadores
- UUID v4/v7 nas entidades persistidas.
- Nunca expor IDs internos sequenciais.

## 4. Estrutura padrão das respostas

### 4.1 Sucesso (envelope canônico)
```json
{
  "success": true,
  "message": "Operation executed successfully.",
  "data": { /* payload do endpoint */ },
  "meta": {
    "request_id": "8c3f...",
    "version": "v1",
    "generated_at": "2026-04-14T12:34:56Z"
  }
}
```

### 4.2 Erro (RFC 7807)
Resposta serve com `Content-Type: application/problem+json`.

```json
{
  "type": "https://api.financial-edu/errors/validation",
  "title": "Validation error",
  "status": 422,
  "detail": "Field 'principal_amount' must be > 0.",
  "instance": "/api/v1/interest/compound",
  "code": "VALIDATION_ERROR",
  "errors": [
    {"field": "principal_amount", "code": "GT_0", "message": "must be > 0"}
  ],
  "request_id": "8c3f..."
}
```

### 4.3 Resposta de simulação (estrutura pedagógica obrigatória)
Dentro de `data`, todo endpoint de simulação deve devolver:
- `summary` — indicadores principais (objeto).
- `tables` — lista de tabelas estruturadas (`{name, columns, rows}`).
- `charts` — lista de séries (`{name, type, x, y, ...}`) prontas para bibliotecas gráficas.
- `interpretation` — `{message, details[], hints[]}` em PT-BR.
- `alerts` — lista de `{level: "info"|"success"|"warning"|"danger", title, message}`.

Toda resposta sem **algum** desses blocos quando aplicável é defeito P1.

## 5. Categorias de erro oficiais

| `code` | `status` HTTP | Significado |
|--------|---------------|-------------|
| `VALIDATION_ERROR` | 422 | Payload inválido (Pydantic) |
| `BUSINESS_RULE_ERROR` | 400 | Regra de negócio violada (ex.: prazo > limite do produto) |
| `NOT_FOUND` | 404 | Recurso não existe |
| `CONFLICT` | 409 | Conflito de estado (ex.: idempotência) |
| `UNAUTHENTICATED` | 401 | Sem credencial (futuro) |
| `UNAUTHORIZED` | 403 | Sem permissão (futuro) |
| `RATE_LIMITED` | 429 | Rate limit excedido |
| `IDEMPOTENCY_REPLAYED` | 200/409 | Replay idempotente |
| `INTERNAL_ERROR` | 500 | Erro inesperado (sem stack ao usuário) |
| `UPSTREAM_TIMEOUT` | 504 | Timeout em integração externa (futuro) |

## 6. Códigos HTTP recomendados
- Sucesso: 200, 201, 202 (assíncrono futuro), 204.
- Erros de cliente: 400, 401, 403, 404, 409, 422, 429.
- Erros de servidor: 500, 502, 503, 504.

## 7. Versionamento (resumo; detalhe em Doc 27)
- Mudança aditiva (campo opcional novo, novo endpoint) → mesma versão.
- Mudança breaking → nova major (`/api/v(N+1)`) + manutenção da anterior por **≥ 2 sprints** com headers `Deprecation: <data>` e `Sunset: <data>` + ADR.

## 8. Paginação (cursor-based preferencial; offset para listas pequenas)

### 8.1 Cursor (preferencial)
Request: `?cursor=<opaque>&limit=50`
Response (`meta.pagination`):
```json
{
  "next_cursor": "eyJpZCI6...",
  "limit": 50,
  "has_more": true
}
```

### 8.2 Offset (apenas listas pequenas, ex.: glossário)
Request: `?page=1&page_size=20`
Response (`meta.pagination`):
```json
{
  "page": 1,
  "page_size": 20,
  "total_items": 87,
  "total_pages": 5
}
```

`limit` máximo: 100. Acima disso → 422.

## 9. Idempotência

Toda mutação (`POST`/`PUT`/`PATCH`/`DELETE`) suporta header opcional:
```
Idempotency-Key: <uuid v4 fornecido pelo cliente>
```

Comportamento:
- 1ª chamada com a chave: processa normalmente; salva resultado por 24h.
- 2ª chamada com a mesma chave + mesmo payload: retorna resposta original.
- 2ª chamada com a mesma chave + payload diferente: 409 + `IDEMPOTENCY_REPLAYED`.

Persistência: tabela `idempotency_keys (key, payload_hash, response_payload, created_at, expires_at)`.

## 10. Rate limiting
- Default: **120 requisições/minuto/IP** em produção.
- Cabeçalhos:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset` (epoch)
- Resposta 429 quando excedido com `Retry-After`.

## 11. Timeouts e resiliência
- Timeout de servidor: **5s** para endpoints de cálculo, **15s** para exportação.
- Timeout de integração externa (futuro): **3s** com 2 retries exponenciais.
- Circuit breaker (futuro) em integrações externas.

## 12. Cache HTTP
- Endpoints idempotentes de leitura (ex.: glossário): `Cache-Control: public, max-age=300, stale-while-revalidate=60` + `ETag`.
- Endpoints de simulação: `Cache-Control: no-store` (resultado depende de payload sensível).

## 13. CORS
- Configurado por ambiente.
- Em produção: lista explícita de origens (sem `*`).
- Headers permitidos: `Authorization`, `Content-Type`, `Idempotency-Key`, `X-Request-Id`.

## 14. Segurança de transporte e cabeçalhos
- HTTPS obrigatório em homolog/prod (HSTS habilitado).
- Cabeçalhos de segurança via middleware:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy: default-src 'self'; ...` (afinado por ambiente)
- Sem stack-trace ao usuário.

## 15. Endpoints oficiais do MVP

### 15.1 Infraestrutura
- `GET /health` — liveness mínimo.
- `GET /health/ready` — readiness (DB + dependências).
- `GET /health/live` — liveness simples.
- `GET /metrics` — Prometheus.
- `GET /api/v1/openapi.json` — schema OpenAPI 3.1.

### 15.2 Diagnóstico financeiro
- `POST /api/v1/diagnostic`

### 15.3 Juros
- `POST /api/v1/interest/simple`
- `POST /api/v1/interest/compound`
- `POST /api/v1/interest/compare`

### 15.4 Amortização
- `POST /api/v1/amortization/price`
- `POST /api/v1/amortization/sac`
- `POST /api/v1/amortization/compare`

### 15.5 Financiamentos
- `POST /api/v1/financing/real-estate`
- `POST /api/v1/financing/vehicle`

### 15.6 Empréstimos
- `POST /api/v1/loan/payroll` (consignado)
- `POST /api/v1/loan/cdc`

### 15.7 Cartão e rotativo
- `POST /api/v1/credit-card/revolving`

### 15.8 Atraso
- `POST /api/v1/late-payment`

### 15.9 Indicadores
- `GET /api/v1/indicators` (lista, paginação offset)
- `GET /api/v1/indicators/{indicator_code}`

### 15.10 Decisão investir vs quitar
- `POST /api/v1/invest-vs-debt`

### 15.11 Conteúdo educacional
- `GET /api/v1/education/contents` (paginação cursor)
- `GET /api/v1/education/contents/{slug}`
- `GET /api/v1/education/glossary` (paginação cursor)
- `GET /api/v1/education/glossary/{slug}`
- `GET /api/v1/education/faqs`

### 15.12 Exportação
- `POST /api/v1/export/pdf`
- `POST /api/v1/export/excel`

### 15.13 Persistência (a partir do Sprint 9)
- `GET /api/v1/me/simulations` (histórico)
- `GET /api/v1/me/simulations/{id}`
- `POST /api/v1/me/saved-scenarios`
- `GET /api/v1/me/saved-scenarios`
- `DELETE /api/v1/me/saved-scenarios/{id}`

### 15.14 LGPD/DSAR (a partir da Fase B)
- `POST /api/v1/me/dsar` (`{type: "access"|"delete"|"correct"|"portability"}`)

## 16. Exemplos canônicos de payloads

### 16.1 Diagnóstico (request)
```json
{
  "monthly_income": "5000.00",
  "fixed_expenses": "2200.00",
  "variable_expenses": "900.00",
  "monthly_debt_payments": "600.00",
  "saved_amount": "3500.00",
  "financial_goal": "Build emergency fund"
}
```

### 16.2 Juros compostos (request)
```json
{
  "principal_amount": "10000.00",
  "interest_rate": "0.01",
  "interest_rate_period": "MONTHLY",
  "term_months": 24,
  "monthly_contribution": "0.00"
}
```

### 16.3 Juros compostos (response — abreviada)
```json
{
  "success": true,
  "message": "Operation executed successfully.",
  "data": {
    "summary": {
      "final_amount": "12697.35",
      "total_interest": "2697.35",
      "effective_rate_period": "0.2697"
    },
    "tables": [
      {"name": "evolution", "columns": ["month","balance","interest"], "rows": [[1,"10100.00","100.00"], "..."]}
    ],
    "charts": [
      {"name": "balance_over_time", "type": "line", "x": [1,2,"..."], "y": ["10100.00","..."]}
    ],
    "interpretation": {
      "message": "Em 24 meses, R$10.000,00 a 1% a.m. tornam-se R$12.697,35.",
      "details": ["Juros somados: R$2.697,35.", "Capitalização mensal."],
      "hints": ["Compare com juros simples para ver o efeito da capitalização."]
    },
    "alerts": [
      {"level": "info", "title": "Educacional", "message": "Resultado é simulação; valores reais variam."}
    ]
  },
  "meta": {"request_id": "...", "version": "v1", "generated_at": "..."}
}
```

(Os demais payloads de Diagnóstico, PRICE/SAC, Imobiliário, Veículo, Consignado, CDC, Rotativo, Atraso, Investir vs Quitar mantêm os campos do v1.0, agora com **string decimal** em campos monetários e **enum UPPER_SNAKE_CASE** em períodos.)

### 16.4 Amortizacao PRICE/SAC (request)
```json
{
  "principal": "100000.00",
  "taxa_periodo": "0.01",
  "n_periodos": 12
}
```

### 16.5 Amortizacao PRICE/SAC (response -- abreviada)
```json
{
  "success": true,
  "message": "amortizacao_price_calculada",
  "data": {
    "summary": {
      "sistema": "PRICE",
      "principal": "100000.00",
      "taxa_periodo": "0.010000",
      "n_periodos": 12,
      "parcela": "8884.88",
      "total_pago": "106618.53",
      "total_juros": "6618.53",
      "saldo_final": "0.00"
    },
    "tables": {
      "amortizacao": [
        {
          "periodo": 1,
          "saldo_inicial": "100000.00",
          "juros": "1000.00",
          "amortizacao": "7884.88",
          "parcela": "8884.88",
          "saldo_final": "92115.12"
        }
      ]
    },
    "charts": [{"name": "saldo_devedor", "series": []}],
    "interpretation": {"headline": "...", "body": "..."},
    "alerts": []
  },
  "meta": {"request_id": "...", "version": "v1", "generated_at": "..."}
}
```

Contrato F3: `principal` deve ser maior que zero na borda de API/schema/service; `taxa_periodo` aceita zero e rejeita negativos; `n_periodos` deve ser inteiro positivo. Os Decimals monetarios sao serializados como string com duas casas e taxas como string com seis casas. O endpoint `POST /api/v1/amortization/compare` retorna o mesmo envelope canonico, com `tables.price`, `tables.sac` e resumo comparativo.


## 17. Compatibilidade e migração v1 → v2 (futuro)
Quando ocorrer, este documento listará campo a campo as mudanças, com data de sunset e exemplos lado a lado.

## 18. Contract testing (resumo; detalhe em Doc 09 e Estratégia de Testes)
- `schemathesis` contra OpenAPI gerado a cada PR.
- Pact consumer-driven em consideração para v2.
- Tipos TS gerados a partir do OpenAPI são commitados.

## 19. Critérios de aceite deste documento
Aceito quando:
- todos os endpoints do MVP estão listados com método e payload exemplar;
- erros estão padronizados por código + status + RFC 7807;
- versionamento, paginação, idempotência e rate-limit estão definidos sem ambiguidade;
- frontend pode gerar o cliente tipado a partir do OpenAPI sem fricção;
- contract tests rodam verde em CI.

## 20. Política de evolução deste documento
Este documento é VIVO. Atualização obrigatória em:
- nova rota;
- mudança de payload (request/response);
- mudança de erro;
- mudança de versionamento;
- mudança de cabeçalho de segurança ou rate-limit.

PR que toque `app/api/`, `app/schemas/` ou `frontend/src/lib/api/` deve atualizar este documento na mesma PR. Bloqueio gerenciado pelo agente de impacto.
