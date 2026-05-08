# Evidência F2 — Service, API e Contrato

**Sprint:** 4 / Fatia F2  
**Data:** 2026-05-08  
**Executor:** Claude Code  

---

## Endpoint implementado

```
POST /api/v1/diagnostic/analyze
```

Rota registrada em `backend/app/api/v1/router.py` com prefixo `/diagnostic`, tag `diagnostic`.

---

## Arquivos criados/alterados

| Arquivo | Ação |
|---------|------|
| `backend/app/schemas/diagnostic/__init__.py` | Alterado (exportações) |
| `backend/app/schemas/diagnostic/analyze.py` | Criado |
| `backend/app/services/diagnostic/__init__.py` | Alterado (exportações) |
| `backend/app/services/diagnostic/diagnostico_service.py` | Criado |
| `backend/app/api/v1/diagnostic.py` | Criado |
| `backend/app/api/v1/router.py` | Alterado (registro do router) |
| `backend/tests/unit/services/diagnostic/test_diagnostico_service.py` | Criado |
| `backend/tests/integration/api/diagnostic/test_analyze.py` | Criado |
| `backend/tests/integration/api/diagnostic/test_errors.py` | Criado |
| `backend/tests/contract/test_diagnostic.py` | Criado |
| `docs/api/openapi.json` | Atualizado (script export_openapi.py) |
| `docs/06_API_e_Contratos.md` | Atualizado (§15.2, §16.1) |
| `docs/19_Matriz_Rastreabilidade.md` | Atualizado (RF-DIAG-001 adicionado) |
| `docs/_meta/living_docs.json` | Atualizado (notas doc_06, doc_19) |
| `docs/sprints/sprint-04/evidencias/F2-*.md` | Criados |

---

## Fluxo de dados

```
Request HTTP
    └── DiagnosticAnalyzeRequest (Pydantic v2, extra=forbid)
            └── analisar() [service — sem matemática]
                    └── analisar_diagnostico() [domínio puro F1]
                            └── DiagnosticoResultado
                    └── dict[str, Any] com Decimal preservado
            └── DiagnosticAnalyzeResponseData.model_validate(data)
            └── ok(out, message="diagnostico_financeiro_analisado")
                    └── ResponseEnvelope[DiagnosticAnalyzeResponseData]
Response HTTP
```

## Tratamento de erros

- `DomainValidationError` → capturado em `_raise_as_validation()` → `ValidationError(422)` → RFC 7807
- Validação Pydantic (campo inválido, extra, tipo) → FastAPI → RFC 7807 automático

---

## Casos canônicos exercitados

### DG-01 (cenário saudável com reserva insuficiente)

| Campo | Entrada | Resultado |
|-------|---------|-----------|
| renda_mensal | 5000.00 | — |
| total_despesas_fixas | 2000.00 | — |
| total_despesas_variaveis | 800.00 | — |
| total_dividas_mensais | 500.00 | — |
| total_reserva_atual | 4000.00 | — |
| sobra_mensal | — | 1700.00 |
| comprometimento_percentual | — | 10.00 |
| reserva_em_meses | — | 1.43 |
| sobra_percentual | — | 34.00 |
| score | — | 7 |
| saude_nivel | — | boa |
| alertas | — | RESERVA_INSUFICIENTE (warning) |

### DG-02 (cenário crítico)

| Campo | Entrada | Resultado |
|-------|---------|-----------|
| renda_mensal | 3000.00 | — |
| total_despesas_fixas | 2200.00 | — |
| total_despesas_variaveis | 700.00 | — |
| total_dividas_mensais | 500.00 | — |
| total_reserva_atual | 0.00 | — |
| sobra_mensal | — | -400.00 |
| comprometimento_percentual | — | 16.67 |
| reserva_em_meses | — | 0.00 |
| sobra_percentual | — | -13.33 |
| score | — | 3 |
| saude_nivel | — | critica (override) |
| alertas | — | RESERVA_CRITICA (critical) + SOBRA_NEGATIVA (critical) |

---

## Restrições respeitadas

- Nenhuma lógica financeira duplicada no service ou na API
- Nenhum float usado em cálculo
- Nenhum `type: ignore` em código de produção
- `Any` usado apenas em: retorno `dict[str, Any]` do service (padrão amortização) e `cast(Any, app)` em testes (padrão universal)
- Frontend não alterado
- Domínio F1 não alterado
- Módulos juros/amortização não alterados
- pyproject.toml, Makefile, .github/ não alterados
