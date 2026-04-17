# ADR-0013 — structlog + Prometheus; OTel futuro

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Base sólida de logs e métricas desde o MVP; tracing quando houver múltiplos serviços.

## Decisão
Backend usa structlog (JSON), Prometheus client em /metrics. OpenTelemetry introduzido pós-MVP.

## Alternativas consideradas
Logs de texto: difícil parse; ELK direto: overhead inicial.

## Consequências
Positivas: simplicidade, integração com Grafana/Loki. Negativas: tracing não cobre MVP.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
