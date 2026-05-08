# F4 — Matriz de Rastreabilidade (RF-DIAG-001)

## Estado anterior (antes da F4)

```
RF-DIAG-001: in_progress
Última atualização: F3 (f529d0b) — frontend cockpit entregue
```

## Estado posterior (após F4)

```
RF-DIAG-001: done
Critério: todos os quatro segmentos da vertical slice estão materializados
```

## Justificativa material por fatia

| Fatia | Entrega | Commit/PR | Prova |
|-------|---------|-----------|-------|
| F1 | Domínio puro backend/app/domain/diagnostic/ | PR #25 / 16c2aa4 | Testes backend passando |
| F2 | Service + API + contrato OpenAPI | PR #27 / c7f817d | Testes backend, OpenAPI gerado |
| F3 | Frontend /diagnostico com cockpit, formulário, KPIs, alertas, interpretação | PR #28 / f529d0b | 229/229 testes frontend, build verde |
| F4 | Conteúdo educacional + docs vivos + fechamento | commit F4 | 293/293 testes, build verde, lint pedagógico verde |

## Critérios de done verificados

| Critério | Status | Prova |
|----------|--------|-------|
| Domínio entregue na F1 | ATENDIDO | PR #25 mergeado |
| Service/API/contrato entregues na F2 | ATENDIDO | PR #27 mergeado |
| Frontend entregue na F3 | ATENDIDO | PR #28 mergeado |
| Conteúdo educacional entregue na F4 | ATENDIDO | content/diagnostico/* existe e é testado |
| Testes obrigatórios existem e passam | ATENDIDO | 293/293 verdes |
| Docs vivos atualizados | ATENDIDO | Docs 07, 08, 09, 15, 19 atualizados |
| Gates verdes | ATENDIDO (com limitação ambiental declarada) | format, tests, build, lint pedagógico |

## Decisão

RF-DIAG-001 pode ser promovido para **done** após merge da F4 com CI verde.

A declaração como done é baseada em prova material, não em intenção.
O CI remoto (GitHub Actions) é a prova final — a declaração aqui é condicional ao merge.
