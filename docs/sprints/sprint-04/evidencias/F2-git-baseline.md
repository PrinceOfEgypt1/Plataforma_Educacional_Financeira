# Evidência F2 — Git Baseline

**Sprint:** 4 / Fatia F2  
**Data:** 2026-05-08  
**Executor:** Claude Code  

---

## Fase 0 — Estado inicial (antes de qualquer alteração)

```
Branch inicial: claude/financial-education-platform-jROjN
HEAD:           8571b46
origin/main:    8571b46
OK: HEAD local = origin/main
Working tree:   limpa (sem alterações versionadas)
```

## Branch F2 criada

```
git switch -c sprint-4/f2-service-api-contrato-openapi-diagnostico-claude
Branch: sprint-4/f2-service-api-contrato-openapi-diagnostico-claude
Base:   8571b46 (= origin/main)
```

## Log de commits na base

```
8571b46 docs(projeto): iniciar jornada histórica da plataforma
16c2aa4 feat(domain): implementar diagnóstico financeiro puro
6046fd4 docs(sprint-4): rebaseline do diagnóstico financeiro
837ffc8 docs(sprint-4): criar plano de execução (#23)
c645138 docs(sprint-3.5): validar e fechar melhoria UIUX (#22)
```

## Pendência conhecida F1-A

- Commit `fea3b99` (tipagem mypy strict — remoção de `type: ignore` e `Any` do domínio) existe apenas localmente no WSL do Moisés.
- Não presente em `origin/main` no momento de início da F2.
- F2 parte de `8571b46` conforme instrução do PO.
- Impacto: nenhum, pois o domínio em `8571b46` já passa em mypy strict no ambiente F2.
