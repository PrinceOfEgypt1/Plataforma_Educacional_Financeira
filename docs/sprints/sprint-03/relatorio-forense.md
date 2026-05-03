# Sprint 3 — Relatório forense

Data: 2026-05-03
Base auditada: `main = origin/main = 81e8cbb`

## 1. Escopo da auditoria

Esta auditoria consolida as evidências das fatias F1 a F5 e registra a
validação final executada na F6. A F6 não criou funcionalidade nova e não
alterou backend, frontend funcional, OpenAPI, baseline, workflow ou
pipeline.

## 2. Cadeia de custódia da Sprint 3

| Fatia | PR | Commit | Evidência principal |
|-------|----|--------|---------------------|
| F1 | #12 | `55d5d44` | `F1-main-verify-baseline.md`, `F1-auditoria-plano-aplicado.md` |
| F2 | #13 | `dd23c6d` | `F2-domain-coverage.md`, `F2-grep-pureza-dominio.md` |
| F3 | #14 | `a297b9c` | `F3-openapi-diff.md`, `F3-contract-validation.md` |
| F4 | #15 | `f20780e` | `F4-frontend-tests.md`, `F4-gates-pipeline.md` |
| F5 | #16 | `81e8cbb` | `F5-tests.md`, `F5-gates-pipeline.md` |

## 3. Achados por camada

### Domínio financeiro

O domínio PRICE/SAC foi implementado na F2 com:

- `Decimal`;
- `ROUND_HALF_EVEN`;
- precisão interna alta;
- fechamento linha a linha;
- totalizadores derivados da tabela exibida;
- saldo final `0.00`.

Não há reescrita matemática nas fatias F3-F6.

### API e OpenAPI

A F3 expôs os endpoints públicos de amortização e sincronizou
`docs/api/openapi.json` com o runtime FastAPI. A validação F6 confirmou
que o OpenAPI versionado está sincronizado.

### Frontend

A F4 substituiu o placeholder de `/amortizacao` por uma experiência real.
O frontend valida formulário e renderiza o retorno da API, mas não
reimplementa PRICE/SAC.

### Conteúdo educacional

A F5 adicionou conteúdo versionado em `frontend/src/content/amortizacao/`
e o tornou visível na UI. O teste editorial cobre PRICE, SAC, comparação,
glossário, cuidados e ausência de conteúdo futuro materializado.

## 4. Resíduos não bloqueantes

### Warning Recharts/jsdom

Os testes frontend exibem warning de Recharts/ResponsiveContainer em jsdom:

```text
The width(0) and height(0) of chart should be greater than 0
```

Decisão: não bloqueante. O aviso ocorre no ambiente de teste sem layout
real, os testes passam e o build de produção gera a rota `/amortizacao`.
Este resíduo já foi registrado nas evidências F4/F5 e permanece
monitorado.

### Mutation testing / mutmut

O mutation testing foi tratado como stretch/resíduo não bloqueante nesta
Sprint. A mitigação atual é a cobertura unitária determinística,
property-based, fixtures/golden cases, integração, contrato, frontend e
pipeline oficial verde.

## 5. Falhas corrigidas durante a Sprint

- F2 corrigiu as falhas históricas de fechamento PRICE/SAC observadas em
  tentativas anteriores: totais divergentes, linha que não fechava e
  arquivos de teste corrompidos.
- F3 corrigiu o OpenAPI versionado que estava desatualizado desde juros,
  incluindo catch-up de juros e amortização.
- F4 ajustou asserts de teste para valores monetários que apareciam
  corretamente em mais de um lugar.
- F5 corrigiu um artefato local criado fora do WSL real durante aplicação
  de patch e repetiu os testes.
- F6 encontrou um cache `.next` inconsistente no primeiro `pnpm build`;
  o cache gerado foi removido de forma localizada e o build repetido com
  sucesso.

## 6. Escopo proibido

Verificações de diff não apontaram alteração rastreada em:

- `backend/`
- `frontend/` funcional fora dos relatórios já mergeados em F5
- `docs/api/openapi.json`
- `docs/baseline/`
- `.github/workflows/`
- `scripts/pipeline.sh`
- `Makefile`

Na F6, os arquivos novos são relatórios e evidências de fechamento.

## 7. Impact Agent

O Impact Agent permanece em estágio `ADVISORY`:

- workflow: `.github/workflows/impact-agent.yml`
- `continue-on-error: true`
- script: `scripts/impact_analysis_guard.py`
- comportamento: reporta e sai 0; não bloqueia PR.

Decisão: manter advisory neste fechamento. Promoção para warning/blocking
exige ADR e rodada específica fora da F6.

## 8. Conclusão forense

Com `EXIT_OPENAPI_CHECK=0`, `EXIT_LINT_PED=0`, `EXIT_PIPELINE=0` e
pipeline final verde, não há pendência técnica bloqueante identificada
para a Sprint 3 no estado local da F6.
