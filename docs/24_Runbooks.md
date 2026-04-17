# DOCUMENTO 24 — RUNBOOKS E PROCEDIMENTOS OPERACIONAIS

**Versão:** 1.0
**Status:** VIVO

---

## 1. Estrutura

Cada runbook é um arquivo `RB-XXX-<slug>.md` em `docs/24_runbooks/`. Este documento é o índice + procedimentos transversais.

## 2. Runbooks iniciais

| ID | Nome | Quando usar |
|----|------|-------------|
| RB-001 | Erro 5xx em alta | Alerta de erro > 1% |
| RB-002 | Latência alta | Alerta p95 > 600ms |
| RB-003 | Spike no Sentry | Alerta de erros novos |
| RB-004 | Migration falhou em produção | Falha em CD |
| RB-005 | Smoke pós-deploy falhou | Trigger de rollback |
| RB-006 | Restaurar backup | Drill mensal e incidentes |
| RB-007 | Rotação de segredos | Trimestral |
| RB-008 | Reset de ambiente de homologação | Sob demanda |
| RB-009 | Suspensão de conta por DSAR | DSAR de eliminação |
| RB-010 | Investigação de regressão matemática | Quando suite financial quebra |

## 3. Estrutura de um runbook

```markdown
# RB-XXX — <título>

## Sintoma
## Hipótese mais provável
## Verificações
1. ...
## Mitigação
1. ...
## Resolução
## Pós-incidente
- post-mortem em 48h
- novo alerta/teste de regressão
```

## 4. Smoke checks padronizados

### 4.1 Smoke local
```
make smoke
```
Verifica: backend sobe, frontend sobe, `/health` 200, `POST /api/v1/interest/simple` retorna 200 com payload válido.

### 4.2 Smoke homologação
- Deploy ok.
- `/health/ready` 200 em até 60s.
- E2E mínimo verde.

### 4.3 Smoke produção
- `/health` 200 três vezes em 2 min.
- E2E mínimo de produção (subset não-destrutivo).
- Métricas estáveis na janela de 30 min.

## 5. Política de incidentes

1. Severidades: SEV1 (queda total), SEV2 (degradação ampla), SEV3 (degradação localizada), SEV4 (cosmético).
2. SEV1/2: war room imediata; comunicação a cada 30 min.
3. Post-mortem público (interno) obrigatório em até 48h.
4. Cada post-mortem gera: 1 ação de prevenção + 1 teste de regressão + 1 atualização de runbook.

## 6. Drills

- Trimestral: restore de backup (RB-006).
- Trimestral: rotação de segredos (RB-007).
- Anual: simulação de SEV1.

## 7. Política para a Claude Code

1. Sempre que criar alerta novo, criar runbook.
2. Sempre que diagnosticar incidente, atualizar runbook existente ou criar novo.
3. Sempre que executar ação destrutiva em ambiente real (mesmo homologação), seguir runbook documentado.
