# F4 — Git Baseline

## Branch de desenvolvimento

```
Branch: claude/add-chat-feature-ein1K
  (branch imposto pelo harness Claude Code — base permanece f529d0b)
```

## HEAD e alinhamento com origin/main

```
HEAD local : f529d0b
origin/main: f529d0b
OK: HEAD local = origin/main
```

## Commit base

```
f529d0b feat(ui): implementar cockpit do diagnóstico financeiro (#28)
```

## Prova de baseline (saída real)

```
=== FASE 0 — BASELINE SPRINT 4/F4 ===
branch: claude/add-chat-feature-ein1K
HEAD:   f529d0b
origin/main: f529d0b
OK: HEAD local = origin/main
working tree: limpa no início
```

## Arquivos criados/alterados na F4

### Criados (novos — untracked no início)

```
frontend/src/content/diagnostico/types.ts
frontend/src/content/diagnostico/nivel-1.ts
frontend/src/content/diagnostico/nivel-2.ts
frontend/src/content/diagnostico/glossario.ts
frontend/src/content/diagnostico/alertas.ts
frontend/src/content/diagnostico/index.ts
frontend/src/components/diagnostic/DiagnosticoSaibaMais.tsx
frontend/src/__tests__/content/diagnostico/conteudo.test.ts
frontend/src/__tests__/components/diagnostic/DiagnosticoSaibaMais.test.tsx
frontend/src/__tests__/components/diagnostic/DiagnosticoInterpretation.test.tsx
docs/07_UX_UI_e_Navegacao.md
docs/08_Conteudo_Educacional.md
docs/09_Requisitos_Funcionais.md
docs/15_Plano_de_Testes.md
docs/19_Matriz_Rastreabilidade.md
docs/_meta/living_docs.json (atualizado)
docs/sprints/sprint-04/evidencias/F4-git-baseline.md
docs/sprints/sprint-04/evidencias/F4-conteudo-educacional.md
docs/sprints/sprint-04/evidencias/F4-docs-vivos.md
docs/sprints/sprint-04/evidencias/F4-matriz-rastreabilidade.md
docs/sprints/sprint-04/evidencias/F4-testes-gates.md
docs/sprints/sprint-04/evidencias/F4-impact-agent.md
docs/sprints/sprint-04/evidencias/F4-fechamento-sprint-4.md
docs/sprints/sprint-04/relatorio-execucao.md
docs/sprints/sprint-04/relatorio-forense.md
docs/sprints/sprint-04/validacao-oficial.md
```

### Modificados (tracked — diff vs f529d0b)

```
frontend/src/components/diagnostic/DiagnosticoCockpit.tsx
frontend/src/components/diagnostic/index.ts
```

## Verificação de escopo proibido

```
git diff --name-only HEAD | grep -E '^(backend/|docs/api/openapi.json|\.github/|scripts/...)'
→ OK: nenhuma alteração proibida detectada
```
