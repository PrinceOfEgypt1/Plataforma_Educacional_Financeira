# Sprint 3.5/F2 - Evidencia Git baseline

Data: 2026-05-03
Executor: Codex
Repo: `/home/moses/workspace/Plataforma_Educacional_Financeira`

## 1. Fase 0 obrigatoria

Comando executado no WSL:

```bash
git fetch origin --prune
echo "=== BRANCH ATUAL ==="
git branch --show-current
echo "=== STATUS ==="
git status -sb
echo "=== HEAD LOCAL ==="
git rev-parse --short HEAD
echo "=== ORIGIN/MAIN ==="
git rev-parse --short origin/main
echo "=== PROVA HEAD = ORIGIN/MAIN ==="
git diff --quiet HEAD origin/main && echo "OK: HEAD local = origin/main"
echo "=== ULTIMOS COMMITS ==="
git log --oneline -5
echo "=== BRANCHES SPRINT 3.5 RESIDUAIS ==="
git branch --list "sprint-3.5/*"
git branch -r --list "origin/sprint-3.5/*"
```

Saida real:

```text
=== BRANCH ATUAL ===
main
=== STATUS ===
## main...origin/main
=== HEAD LOCAL ===
fc21560
=== ORIGIN/MAIN ===
fc21560
=== PROVA HEAD = ORIGIN/MAIN ===
OK: HEAD local = origin/main
=== ULTIMOS COMMITS ===
fc21560 docs(sprint-3.5): diagnosticar UI/UX atual e planejar melhoria visual (#18)
4a9d30e docs(sprint-3): fechar governanca e validacao final (#17)
81e8cbb docs(amortization): consolidar conteudo educacional e docs vivos (#16)
f20780e feat(amortization): implementar frontend da pagina de amortizacao (#15)
a297b9c feat(amortization): expor service api e contrato (#14)
=== BRANCHES SPRINT 3.5 RESIDUAIS ===
```

Resultado:

- Branch inicial: `main`.
- `HEAD local = origin/main`.
- Commit-base: `fc21560`.
- Working tree inicial: limpa.
- Branch residual `sprint-3.5/*`: nenhuma listada antes da criacao da F2.

## 2. Criacao da branch obrigatoria

Comando executado:

```bash
git checkout -b sprint-3.5/f2-fundacao-visual-design-system-codex
git branch --show-current
git status -sb
```

Saida real:

```text
sprint-3.5/f2-fundacao-visual-design-system-codex
## sprint-3.5/f2-fundacao-visual-design-system-codex
Switched to a new branch 'sprint-3.5/f2-fundacao-visual-design-system-codex'
```

## 3. Escopo confirmado

- F2 iniciada a partir de `main = origin/main = fc21560`.
- Trabalho executado apenas no repo WSL oficial.
- Nenhum push, PR ou merge realizado nesta etapa.
- Nenhuma alteracao em backend, calculos financeiros, API, OpenAPI, pipeline,
  workflow, Prompt-Mestre, planilha ou docs baseline.
