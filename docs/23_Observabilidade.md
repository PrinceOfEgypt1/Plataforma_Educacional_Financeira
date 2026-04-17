# DOCUMENTO 23 — OBSERVABILIDADE E TELEMETRIA

**Versão:** 1.0
**Status:** VIVO

---

## 1. Pilares

1. **Logs estruturados** (eventos discretos, contexto, correlação).
2. **Métricas** (séries temporais agregáveis: latência, throughput, erro, saturação).
3. **Tracing distribuído** (futuro, quando houver múltiplos serviços).
4. **Alertas** (sinalização proativa baseada em SLO).

## 2. Stack oficial

| Pilar | Ferramenta | Observação |
|-------|------------|------------|
| Logs | `structlog` (BE) + JSON; pipeline para Loki ou Cloudwatch | Frontend usa `pino`-style ou wrapper interno |
| Métricas | Prometheus client (`prometheus_client`) + endpoint `/metrics` | Grafana para dashboards |
| Tracing | OpenTelemetry SDK (futuro) | Jaeger ou Tempo |
| Erros | Sentry (frontend e backend) | Mascaramento de PII obrigatório |
| Health | `/health`, `/health/ready`, `/health/live` | k8s-friendly |

## 3. Convenções de log

Campos obrigatórios: `timestamp`, `level`, `service`, `correlation_id`, `event`, `domain`, `route` (quando aplicável), `latency_ms` (quando aplicável), `outcome` (`ok|error|warn`).

Sem PII (ver Doc 22 §9).

## 4. Métricas mínimas obrigatórias

- `http_requests_total{route, method, status}` (counter)
- `http_request_duration_seconds{route, method}` (histogram, buckets `[0.05,0.1,0.2,0.5,1,2,5]`)
- `simulation_runs_total{module, outcome}` (counter)
- `app_errors_total{type}` (counter)
- `db_queries_total{op}` (counter, opcional)
- `db_query_duration_seconds{op}` (histogram, opcional)
- `process_*` (default do Prometheus client)

## 5. SLOs e SLIs

| Serviço | SLI | SLO |
|---------|-----|-----|
| API de cálculo | latência p95 por rota | ≤ 300 ms |
| API de cálculo | erro 5xx | ≤ 0,5% |
| FE renderização | LCP (Lighthouse) | ≤ 2,5 s |
| FE renderização | INP | ≤ 200 ms |
| Disponibilidade | uptime mensal | ≥ 99,5% |

Mudança de SLO exige ADR.

## 6. Alertas

| Alerta | Condição | Severidade | Destino |
|--------|----------|------------|---------|
| Erro 5xx > 1% por 5 min | métrica | alta | runbook RB-001 |
| Latência p95 > 600ms por 10 min | métrica | média | runbook RB-002 |
| Sentry > 10 erros novos/h | métrica | média | runbook RB-003 |
| Cobertura cai abaixo do gate | CI | alta | bloqueio de PR |
| Migration falha em produção | CD | crítica | runbook RB-004 |
| Smoke pós-deploy falha | CD | crítica | rollback automático + RB-005 |

## 7. Dashboards mínimos

- Visão geral (RPS, erro, latência, infra).
- Por módulo (interest, amortization, financing, ...).
- Por release (comparativo entre versões).
- Pedagógico (cobertura de blocos pedagógicos por simulação — % com `interpretation` populada).

## 8. Política para a Claude Code

1. Toda rota nova é instrumentada com log + métrica de latência e erro.
2. Toda exceção não-prevista é logada em nível ERROR com correlação.
3. Toda alteração que adicione alerta atualiza este documento + Doc 24.
4. Toda alteração de SLO exige ADR.
