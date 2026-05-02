# F1 — Base Branch — Sprint 3

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F1 — Pré-voo e plano
**Data:** 2026-05-02T18:40:21-03:00
**Ambiente:** WSL Ubuntu

## 1. Objetivo

Registrar a prova inicial de que a branch da F1 da Sprint 3 foi criada a partir da main pós-Sprint 2, com base oficial no commit 840cbcb.

## 2. Comandos e saídas literais

```bash
$ pwd
/home/moses/workspace/Plataforma_Educacional_Financeira

$ git branch --show-current
sprint-3/f1-preveo

$ git status -sb
## sprint-3/f1-preveo
?? docs/sprints/sprint-03/

$ git rev-parse --short HEAD
840cbcb

$ git rev-parse --short origin/main
840cbcb

$ test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo "OK: HEAD local = origin/main"
OK: HEAD local = origin/main

$ git log --oneline --decorate -6
840cbcb (HEAD -> sprint-3/f1-preveo, origin/main, main) docs(sprint-2): fechar governanca e validacao final (#11)
f20a180 feat(sprint-2): materializar conteúdo educacional e docs vivos (#10)
f1336d8 feat(sprint-2): implementar frontend de juros (#9)
7841049 chore(sprint-2): materializar pipeline oficial (#8)
2ae0bb2 feat(interest): expor endpoints REST de juros (#7)
e4e56ac feat(interest): implementar dominio de juros simples e compostos (#6)

$ git branch --list "sprint-2/*"

$ git branch -r --list "origin/sprint-2/*"
```

## 3. Interpretação

- Branch atual: `sprint-3/f1-preveo`.
- Base esperada: `840cbcb`.
- `origin/main` esperado: `840cbcb`.
- Branch residual local da Sprint 2 removida antes da abertura da F1.
- Não há branch remota `origin/sprint-2/*` listada.

## 4. Observação operacional

Esta evidência não declara a F1 concluída. Ela apenas registra a base Git inicial para a materialização do plano da Sprint 3.
