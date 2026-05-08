# F4 — Fechamento da Sprint 4

## O que a Sprint 4 entregou por fatia

### F0 — Planejamento auditável
- PR #23 / commit 837ffc8
- PLANO_EXECUCAO_SPRINT_4.md, estrutura de evidências, mapa de fatias

### F0.1 — Pesquisa + rebaseline Doc 03 §7
- Commit 6046fd4
- Rebaseline dos thresholds do diagnóstico financeiro

### F1 — Domínio puro backend
- PR #25 / commit 16c2aa4
- `backend/app/domain/diagnostic/`: analyzer, rules, rounding
- Regras de comprometimento, reserva, sobra, saúde, alertas
- Testes unitários e de propriedade (hypothesis)

### F2 — Service + API + contrato + OpenAPI
- PR #27 / commit c7f817d
- `backend/app/services/diagnostic/diagnostico_service.py`
- `backend/app/api/v1/diagnostic.py` — POST /api/v1/diagnostic/analyze
- Schemas Pydantic, OpenAPI gerado
- Testes de contrato e integração

### F3 — Frontend /diagnostico
- PR #28 / commit f529d0b
- `DiagnosticoCockpit`, `DiagnosticoForm`, `DiagnosticoSummary`
- `DiagnosticoAlerts`, `DiagnosticoInterpretation`, `diagnosticoService`
- `frontend/src/types/diagnostic.ts`
- 39 testes novos — total: 229/229 verdes

### F4 — Conteúdo educacional + docs vivos + fechamento
- Commit atual (branch claude/add-chat-feature-ein1K)
- `frontend/src/content/diagnostico/` — 6 arquivos de conteúdo
- `DiagnosticoSaibaMais.tsx` — modal educacional integrado ao cockpit
- 64 testes novos — total: 293/293 verdes
- Docs vivos atualizados: 07, 08, 09, 15, 19, _meta
- Evidências F4 e relatórios oficiais da Sprint 4

## Estado final do RF-DIAG-001

```
RF-DIAG-001: done (condicional ao merge com CI verde)
```

Todos os critérios da vertical slice foram atendidos com prova material.

## Pendências honestas

1. **Lint ESLint e typecheck tsc**: não executáveis no ambiente do harness
   (node_modules ausente no PATH do CI local). Limitação ambiental
   pré-existente. Não é regressão da F4.

2. **Snapshot visual e axe-core**: recomendados pelo Impact Agent.
   Não aplicáveis sem browser no ambiente de harness.

3. **Merge, PR e planilha**: responsabilidade do PO (Moisés). Claude Code
   não fez push, não abriu PR, não atualizou planilha.

4. **CI remoto (GitHub Actions)**: é a prova final obrigatória para
   considerar a Sprint 4 homologada.
