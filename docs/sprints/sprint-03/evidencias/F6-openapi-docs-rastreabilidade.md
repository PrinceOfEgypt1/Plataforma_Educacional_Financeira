# F6 — OpenAPI, docs e rastreabilidade

Data: 2026-05-03

## 1. OpenAPI versionado

```bash
jq -r '.paths | keys[]' docs/api/openapi.json
```

Saída:

```text
/api/v1/amortization/compare
/api/v1/amortization/price
/api/v1/amortization/sac
/api/v1/contract/ping
/api/v1/interest/compare
/api/v1/interest/compound
/api/v1/interest/simple
/health
/health/live
/health/ready
```

```bash
jq '{paths: (.paths | keys | length), schemas: (.components.schemas | keys | length)}' docs/api/openapi.json
```

Saída:

```json
{
  "paths": 10,
  "schemas": 43
}
```

```bash
jq -r '.components.schemas | keys[]' docs/api/openapi.json | grep -E 'Amort|Price|Sac|Interest|Juros|Problem|ResponseEnvelope'
```

Saída relevante:

```text
AmortizationPeriodRow
CompararJurosIn
CompararJurosOut
CompareAmortizationIn
CompareAmortizationOut
JurosCompostosIn
JurosCompostosOut
JurosSimplesIn
JurosSimplesOut
PriceIn
PriceOut
PriceSummary
ResponseEnvelope_CompareAmortizationOut_
ResponseEnvelope_PriceOut_
ResponseEnvelope_SacOut_
SacIn
SacOut
SacSummary
TablesCompareAmortization
```

## 2. Docs vivos impactados na Sprint 3

Sprint 3 atualizou docs vivos em F3/F5:

- `docs/06_API_e_Contratos.md`
- `docs/07_UX_UI_e_Navegacao.md`
- `docs/08_Conteudo_Educacional.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`

Na F6 não houve alteração adicional em docs vivos. O fechamento foi
registrado em `docs/sprints/sprint-03/`.

## 3. Matriz de rastreabilidade

Linhas finais em `docs/19_Matriz_Rastreabilidade.md`:

```text
RF-AMO-001 ... done (Sprint 3 F2/F3/F4/F5)
RF-AMO-002 ... done (Sprint 3 F2/F3/F4/F5)
RF-AMO-003 ... done (Sprint 3 F2/F3/F4/F5)
```

As linhas apontam para:

- testes de domínio;
- testes de service;
- testes de integração;
- testes de contrato;
- testes pedagógicos/runtime frontend;
- docs vivos `03,06,07,08,09,15,19`.

## 4. Escopo negativo

```bash
git diff -- backend frontend docs/api/openapi.json .github workflows scripts/pipeline.sh Makefile docs/baseline
```

Saída:

```text
<sem saída>
```

Interpretação: não há alteração rastreada em backend funcional, frontend
funcional, OpenAPI, workflows, pipeline, Makefile ou baseline.

## 5. Resultado

OpenAPI, docs vivos e matriz estão coerentes com a Sprint 3 concluída até
F5. A F6 consolida o fechamento em artefatos de sprint.
