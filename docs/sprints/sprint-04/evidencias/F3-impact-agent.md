# F3 — Impact Agent

## Execução real do Impact Agent local

### Descoberta da CLI

```bash
python3 scripts/impact_analysis_guard.py --help
```
```
usage: impact_analysis_guard.py [-h] [--base BASE] [--files [FILES ...]]

options:
  -h, --help           show this help message and exit
  --base BASE
  --files [FILES ...]
```

### Execução com arquivos F3 explícitos

```bash
python3 scripts/impact_analysis_guard.py --files \
  frontend/src/app/(app)/diagnostico/page.tsx \
  frontend/src/components/diagnostic/DiagnosticoCockpit.tsx \
  frontend/src/components/diagnostic/DiagnosticoForm.tsx \
  frontend/src/components/diagnostic/DiagnosticoSummary.tsx \
  frontend/src/components/diagnostic/DiagnosticoAlerts.tsx \
  frontend/src/components/diagnostic/DiagnosticoInterpretation.tsx \
  frontend/src/components/diagnostic/formValidation.ts \
  frontend/src/components/diagnostic/index.ts \
  frontend/src/services/diagnostic/diagnosticoService.ts \
  frontend/src/services/diagnostic/index.ts \
  frontend/src/types/diagnostic.ts \
  frontend/src/config/modules.ts
```

### Saída literal

```
╔══════════════════════════════════════════════════════════════╗
║   IMPACT ANALYSIS GUARD — Plataforma Educacional Financeira  ║
║   Estágio: ADVISORY (não bloqueia)  |  ADR-001               ║
╚══════════════════════════════════════════════════════════════╝

  Risco             : MEDIUM
  Arquivos alterados: 12
  Camadas afetadas  : fe_app, fe_components
  Domínios afetados : nenhum mapeado

  Arquivos:
    • frontend/src/app/(app)/diagnostico/page.tsx
    • frontend/src/components/diagnostic/DiagnosticoCockpit.tsx
    • frontend/src/components/diagnostic/DiagnosticoForm.tsx
    • frontend/src/components/diagnostic/DiagnosticoSummary.tsx
    • frontend/src/components/diagnostic/DiagnosticoAlerts.tsx
    • frontend/src/components/diagnostic/DiagnosticoInterpretation.tsx
    • frontend/src/components/diagnostic/formValidation.ts
    • frontend/src/components/diagnostic/index.ts
    • frontend/src/services/diagnostic/diagnosticoService.ts
    • frontend/src/services/diagnostic/index.ts
    • frontend/src/types/diagnostic.ts
    • frontend/src/config/modules.ts

  📋 Ações recomendadas:
    →  Páginas Next.js alteradas: verificar roteamento e states
    →  Componentes FE alterados: rodar snapshot visual e axe-core

  Estágio: ADVISORY — este agente observa e reporta, nunca bloqueia.
  Critérios de promoção: docs/adr/ADR-001-impact-agent.md
```

## Análise do resultado

- **Risco: MEDIUM** — esperado para fatia de frontend puro
- **Camadas afetadas: fe_app, fe_components** — correto, apenas frontend
- **Domínios afetados: nenhum mapeado** — correto, backend não foi tocado
- **Backend: ausente** — confirma que o escopo proibido (backend/) não foi alterado
- **OpenAPI: ausente** — confirma que `docs/api/openapi.json` não foi alterado

## Nota sobre execução com `--base main`

Quando executado com `--base main`, o agente reporta os arquivos da F2 (backend)
porque o branch local `main` aponta para um commit anterior ao squash da F2.
A execução com `--files` acima é a forma correta de avaliar o impacto da F3 isoladamente.

Estágio: ADVISORY — o agente nunca bloqueia por ADR-001.
