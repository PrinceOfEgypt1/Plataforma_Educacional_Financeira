# F1 — Estado inicial do Impact Agent

## Comandos executados
- git ls-files | grep -Ei 'impact[_-]?agent'
- git ls-files .github/workflows/ 2>/dev/null | xargs grep -l -i 'impact' 2>/dev/null || true

## Artefatos encontrados
- .github/workflows/impact-agent.yml
- docs/adr/ADR-001-impact-agent.md
- docs/sprints/sprint-01/evidencias/impact-agent-ci.md

## Veredito
O workflow do Impact Agent existe e foi localizado no repositório antes da materialização doc-only da F1.
