# Comandos operacionais — F2

## Contexto
- Branch: sprint-2/f2-dominio
- Base: origin/main @ 4f561f6
- HEAD técnico local: 438eab8

## 1. Conferir estado atual
git status -sb
git branch --show-current
git rev-parse --short HEAD
git rev-parse --short origin/main
git diff --name-status origin/main..HEAD

## 2. Conferir evidências reais
ls -1 docs/sprints/sprint-02/evidencias/F2-*
sed -n '1,220p' docs/sprints/sprint-02/evidencias/F2-staging-proof.md

## 3. Staging da camada operacional reconstruída
git add   docs/sprints/sprint-02/operacional/README-F2.md   docs/sprints/sprint-02/operacional/CORPO-DA-PR-F2.md   docs/sprints/sprint-02/operacional/AVISO-PLANILHA-F2.md   docs/sprints/sprint-02/operacional/COMANDOS-F2.md   docs/sprints/sprint-02/evidencias/F2-base-branch.txt   docs/sprints/sprint-02/evidencias/F2-ruff-check.txt   docs/sprints/sprint-02/evidencias/F2-ruff-format.txt   docs/sprints/sprint-02/evidencias/F2-pytest.txt   docs/sprints/sprint-02/evidencias/F2-coverage.txt   docs/sprints/sprint-02/evidencias/F2-diff-100.txt   docs/sprints/sprint-02/evidencias/F2-mutmut.txt   docs/sprints/sprint-02/evidencias/F2-staging-proof.md

## 4. Conferir o índice
git status -sb
git diff --cached --name-status
git diff --cached --name-only

## 5. Commit operacional
git commit -m "docs(f2): reconstruir camada operacional a partir do clone real"

## 6. Conferência final
git status -sb
git log --oneline -2
git show --name-status --stat --oneline --decorate HEAD
