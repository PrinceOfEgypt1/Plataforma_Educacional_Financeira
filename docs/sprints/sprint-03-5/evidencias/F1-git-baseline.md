# Sprint 3.5/F1 - Evidencia Git baseline

Data: 2026-05-03
Executor: Codex
Repo: `/home/moses/workspace/Plataforma_Educacional_Financeira`

## 1. Fase 0 obrigatoria

Comando executado no WSL:

```bash
git fetch origin --prune
echo '=== BRANCH ATUAL ==='
git branch --show-current
echo '=== STATUS ==='
git status -sb
echo '=== HEAD LOCAL ==='
git rev-parse --short HEAD
echo '=== ORIGIN/MAIN ==='
git rev-parse --short origin/main
echo '=== PROVA HEAD = ORIGIN/MAIN ==='
git diff --quiet HEAD origin/main && echo 'OK: HEAD local = origin/main'
echo '=== BRANCHES SPRINT 3 RESIDUAIS ==='
git branch --list 'sprint-3/*'
git branch -r --list 'origin/sprint-3/*'
echo '=== ULTIMOS COMMITS ==='
git log --oneline -5
```

Saida real:

```text
=== BRANCH ATUAL ===
main
=== STATUS ===
## main...origin/main
=== HEAD LOCAL ===
4a9d30e
=== ORIGIN/MAIN ===
4a9d30e
=== PROVA HEAD = ORIGIN/MAIN ===
OK: HEAD local = origin/main
=== BRANCHES SPRINT 3 RESIDUAIS ===
=== ULTIMOS COMMITS ===
4a9d30e docs(sprint-3): fechar governanca e validacao final (#17)
81e8cbb docs(amortization): consolidar conteudo educacional e docs vivos (#16)
f20780e feat(amortization): implementar frontend da pagina de amortizacao (#15)
a297b9c feat(amortization): expor service api e contrato (#14)
dd23c6d feat(amortization): implementar dominio puro PRICE e SAC (#13)
```

Resultado:

- Branch inicial: `main`.
- `HEAD local = origin/main`.
- Commit-base: `4a9d30e`.
- Working tree inicial: limpa.
- Branch residual `sprint-3/*`: nenhuma listada.

## 2. Criacao da branch obrigatoria

Comando executado:

```bash
git checkout -b sprint-3.5/f1-uiux-diagnostico-plano-codex
git branch --show-current
git status -sb
```

Saida real:

```text
sprint-3.5/f1-uiux-diagnostico-plano-codex
## sprint-3.5/f1-uiux-diagnostico-plano-codex
Switched to a new branch 'sprint-3.5/f1-uiux-diagnostico-plano-codex'
```

Observacao: o Git escreveu a mensagem de troca de branch apos os comandos de
status no stream capturado, mas a branch corrente foi confirmada corretamente.
