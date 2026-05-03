# Sprint 3/F4 - Base branch

Data local da execucao: 2026-05-03.

## Objetivo

Comprovar que a F4 partiu de `main = origin/main = a297b9c` e foi executada em branch propria.

## Comandos e saidas

```bash
git fetch origin --prune
git checkout main
git reset --hard origin/main
```

Saida relevante:

```text
HEAD is now at a297b9c feat(amortization): expor service api e contrato (#14)
```

```bash
git branch --show-current
```

Saida:

```text
main
```

```bash
git rev-parse --short HEAD
git rev-parse --short origin/main
```

Saida:

```text
a297b9c
a297b9c
```

```bash
git checkout -b sprint-3/f4-frontend-amortizacao-codex
git branch --show-current
git status -sb
```

Saida:

```text
Switched to a new branch 'sprint-3/f4-frontend-amortizacao-codex'
sprint-3/f4-frontend-amortizacao-codex
## sprint-3/f4-frontend-amortizacao-codex
```

## Resultado

- Branch de trabalho: `sprint-3/f4-frontend-amortizacao-codex`.
- Commit-base: `a297b9c`.
- Confirmado: `main = origin/main = a297b9c`.
- Nao houve trabalho direto na `main`.
