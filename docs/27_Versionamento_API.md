# DOCUMENTO 27 — VERSIONAMENTO DE CONTRATOS DE API

**Versão:** 1.0
**Status:** HÍBRIDO (núcleo de regras estáticas; índice de versões e changelog vivos)

---

## 1. Princípios

1. Backend é a fonte da verdade do contrato; OpenAPI é gerado a partir do código.
2. Versão explícita na URL: `/api/v1`, `/api/v2`.
3. **Aditivo** (campo opcional novo, novo endpoint) = compatível, não exige nova versão.
4. **Breaking** (remoção, renome, mudança de tipo, mudança de obrigatoriedade, mudança de semântica) = nova versão major + manutenção da anterior por ≥ 2 sprints + ADR.

## 2. Schema padrão de resposta

- Sucesso: estrutura por endpoint (Doc 06 §4).
- Erro: RFC 7807 (`application/problem+json`) — `type`, `title`, `status`, `detail`, `instance`, `code`.

## 3. Convenções

- Datas: ISO 8601, sempre UTC.
- Decimais: string com 2 casas para moeda (`"1234.56"`); fatores numéricos com até 8 casas.
- Booleanos: `true/false`.
- Enums: `UPPER_SNAKE_CASE`.
- Paginação cursor-based: `?cursor=...&limit=...`; resposta inclui `next_cursor`.
- Idempotência: `Idempotency-Key` em mutações.
- Rate limit: cabeçalhos `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.
- Cache: `Cache-Control` apropriado por endpoint.

## 4. Processo de mudança breaking

1. Abrir ADR (Doc 20) com decisão de major bump.
2. Implementar nova versão `/api/v(n+1)`.
3. Manter versão anterior por ≥ 2 sprints com aviso de deprecação no header `Deprecation: <data>` e `Sunset: <data>`.
4. Cliente frontend migra; teste de contrato cobre ambas.
5. Após sunset, remover versão antiga em PR distinta.

## 5. Contract testing

- `schemathesis` contra OpenAPI gerado.
- Pact (consumer-driven) — adoção futura quando houver consumers externos.

## 6. Apêndice vivo: índice de versões

<!-- BEGIN APÊNDICE VIVO -->
| Versão | Status | Início | Sunset previsto |
|--------|--------|--------|-----------------|
| v1 | active | 2026-MM-DD | — |
<!-- END APÊNDICE VIVO -->

## 7. Política para a Claude Code

1. Sem alteração breaking sem ADR e sem nova versão.
2. Toda alteração de contrato atualiza Doc 06 + Doc 27 + Doc 19 (rastreabilidade).
3. Toda alteração de contrato exige teste de contrato.
4. Cliente frontend nunca acessa rota sem types gerados.
