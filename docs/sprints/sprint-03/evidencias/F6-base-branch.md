# F6 — Base branch

Data: 2026-05-03

## 1. Git inicial

```bash
git fetch origin --prune
git checkout main
git reset --hard origin/main
```

Saídas relevantes:

```text
Your branch is up to date with 'origin/main'.
Already on 'main'
HEAD is now at 81e8cbb docs(amortization): consolidar conteudo educacional e docs vivos (#16)
```

## 2. Verificação de `main`

```bash
git branch --show-current
git status -sb
git rev-parse --short HEAD
git rev-parse --short origin/main
```

Saída:

```text
main
## main...origin/main
81e8cbb
81e8cbb
```

```bash
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo "OK: main local = origin/main"
```

Saída:

```text
OK:
```

Observação: a mensagem foi truncada pelo quoting do shell, mas o comando
retornou exit code 0 e confirmou igualdade de SHA.

## 3. Histórico recente

```bash
git log --oneline --decorate -5
```

Saída:

```text
81e8cbb (HEAD -> main, origin/main) docs(amortization): consolidar conteudo educacional e docs vivos (#16)
f20780e feat(amortization): implementar frontend da pagina de amortizacao (#15)
a297b9c feat(amortization): expor service api e contrato (#14)
dd23c6d feat(amortization): implementar dominio puro PRICE e SAC (#13)
55d5d44 docs(sprint-3): materializar plano de execução F1 (#12)
```

## 4. Branch F6

```bash
git checkout -b sprint-3/f6-fechamento-governanca-codex
git branch --show-current
git status -sb
git rev-parse --short HEAD
git rev-parse --short origin/main
```

Saída:

```text
Switched to a new branch 'sprint-3/f6-fechamento-governanca-codex'
sprint-3/f6-fechamento-governanca-codex
## sprint-3/f6-fechamento-governanca-codex
81e8cbb
81e8cbb
```

## 5. Branches residuais

```bash
git branch --list 'sprint-3/*'
git branch -r --list 'origin/sprint-3/*'
```

Saída:

```text
* sprint-3/f6-fechamento-governanca-codex
<sem saída para branches remotas>
```

## 6. Interpretação

- Base da F6: `81e8cbb`.
- `main = origin/main = 81e8cbb`.
- Branch atual: `sprint-3/f6-fechamento-governanca-codex`.
- Não há branch remota residual `origin/sprint-3/*`.
- Não houve trabalho direto na `main`.
