# F6 — Impact Agent

Data: 2026-05-03

## 1. Workflow

Arquivo lido:

- `.github/workflows/impact-agent.yml`

Trechos relevantes:

```text
name: Impact Agent (advisory)
Estágio: ADVISORY — este workflow observa e reporta, nunca bloqueia.
continue-on-error: true
```

## 2. Script

Arquivo lido:

- `scripts/impact_analysis_guard.py`

Trechos relevantes:

```text
Estágio atual: ADVISORY — reporta, nunca bloqueia (exit 0 sempre).
Promoção a WARNING/BLOCKING requer ADR-002/ADR-003.
sys.exit(0)   # ADVISORY: sempre exit 0
```

## 3. Decisão F6

O Impact Agent permanece em modo advisory na conclusão local da Sprint 3.

Não houve alteração em:

- `.github/workflows/impact-agent.yml`
- `.github/workflows/ci.yml`
- `scripts/impact_analysis_guard.py`

## 4. Motivo

A F6 é uma fatia de fechamento e validação final. Promoção do Impact
Agent para warning/blocking é mudança de governança/CI e exige ADR e
rodada própria fora do escopo desta F6.

## 5. Resultado

Impact Agent confirmado como advisory e não bloqueante.
