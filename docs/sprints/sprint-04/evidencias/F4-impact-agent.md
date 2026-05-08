# F4 — Impact Agent

## Comando executado

```bash
python3 scripts/impact_analysis_guard.py --files \
  frontend/src/content/diagnostico/types.ts \
  frontend/src/content/diagnostico/nivel-1.ts \
  frontend/src/content/diagnostico/nivel-2.ts \
  frontend/src/content/diagnostico/glossario.ts \
  frontend/src/content/diagnostico/alertas.ts \
  frontend/src/content/diagnostico/index.ts \
  frontend/src/components/diagnostic/DiagnosticoSaibaMais.tsx \
  frontend/src/components/diagnostic/DiagnosticoCockpit.tsx \
  frontend/src/components/diagnostic/index.ts \
  frontend/src/__tests__/content/diagnostico/conteudo.test.ts \
  frontend/src/__tests__/components/diagnostic/DiagnosticoSaibaMais.test.tsx \
  frontend/src/__tests__/components/diagnostic/DiagnosticoInterpretation.test.tsx
```

## Saída real

```
╔══════════════════════════════════════════════════════════════╗
║   IMPACT ANALYSIS GUARD — Plataforma Educacional Financeira  ║
║   Estágio: ADVISORY (não bloqueia)  |  ADR-001               ║
╚══════════════════════════════════════════════════════════════╝

  Risco             : MEDIUM
  Arquivos alterados: 12
  Camadas afetadas  : fe_components
  Domínios afetados : nenhum mapeado

  Arquivos:
    • frontend/src/content/diagnostico/types.ts
    • frontend/src/content/diagnostico/nivel-1.ts
    • frontend/src/content/diagnostico/nivel-2.ts
    • frontend/src/content/diagnostico/glossario.ts
    • frontend/src/content/diagnostico/alertas.ts
    • frontend/src/content/diagnostico/index.ts
    • frontend/src/components/diagnostic/DiagnosticoSaibaMais.tsx
    • frontend/src/components/diagnostic/DiagnosticoCockpit.tsx
    • frontend/src/components/diagnostic/index.ts
    • frontend/src/__tests__/content/diagnostico/conteudo.test.ts
    • frontend/src/__tests__/components/diagnostic/DiagnosticoSaibaMais.test.tsx
    • frontend/src/__tests__/components/diagnostic/DiagnosticoInterpretation.test.tsx

  📋 Ações recomendadas:
    →  Componentes FE alterados: rodar snapshot visual e axe-core

  Estágio: ADVISORY — este agente observa e reporta, nunca bloqueia.
  Critérios de promoção: docs/adr/ADR-001-impact-agent.md
```

## Interpretação

- **Risco MEDIUM** esperado: 12 arquivos alterados, todos frontend.
- **Backend não afetado**: domínios afetados = nenhum mapeado. Confirma que
  nenhuma regra financeira foi alterada.
- **Ação recomendada**: snapshot visual e axe-core. Não aplicável no
  ambiente de harness (sem browser). A rota `/diagnostico` foi validada
  pelo build Next.js estático.
- **Estágio ADVISORY**: não bloqueia. Resultado consistente com F3.
