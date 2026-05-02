# F1 — Staging / Pre-commit Proof — Sprint 3

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F1 — Pré-voo e plano
**Data:** 2026-05-02T18:45:18-03:00
**Ambiente:** WSL Ubuntu

## 1. Objetivo

Registrar a prova de inspeção do working tree, staging e execução do pre-commit antes do commit da F1.

## 2. Estado antes do stage

```bash
$ git branch --show-current
sprint-3/f1-preveo

$ git status -sb
## sprint-3/f1-preveo
A  docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md
A  docs/sprints/sprint-03/evidencias/F1-auditoria-plano-aplicado.md
A  docs/sprints/sprint-03/evidencias/F1-base-branch.md
A  docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md
AM docs/sprints/sprint-03/evidencias/F1-staging-proof.md
A  docs/sprints/sprint-03/evidencias/LEITURA_DOCUMENTAL_SPRINT_3.md

$ git status --short
A  docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md
A  docs/sprints/sprint-03/evidencias/F1-auditoria-plano-aplicado.md
A  docs/sprints/sprint-03/evidencias/F1-base-branch.md
A  docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md
AM docs/sprints/sprint-03/evidencias/F1-staging-proof.md
A  docs/sprints/sprint-03/evidencias/LEITURA_DOCUMENTAL_SPRINT_3.md

$ find docs/sprints/sprint-03 -type f -print | sort
docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md
docs/sprints/sprint-03/evidencias/F1-auditoria-plano-aplicado.md
docs/sprints/sprint-03/evidencias/F1-base-branch.md
docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md
docs/sprints/sprint-03/evidencias/F1-staging-proof.md
docs/sprints/sprint-03/evidencias/LEITURA_DOCUMENTAL_SPRINT_3.md

$ git diff --name-only
docs/sprints/sprint-03/evidencias/F1-staging-proof.md
```

## 3. Observação sobre arquivos untracked

Neste momento os arquivos da Sprint 3 ainda podiam estar untracked; por isso `git diff --name-only` pode não listar novos arquivos. A fonte correta para este estado é `git status --short` + `find docs/sprints/sprint-03`.

## 4. Estado após o stage

```bash
$ git diff --cached --name-only
docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md
docs/sprints/sprint-03/evidencias/F1-auditoria-plano-aplicado.md
docs/sprints/sprint-03/evidencias/F1-base-branch.md
docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md
docs/sprints/sprint-03/evidencias/F1-staging-proof.md
docs/sprints/sprint-03/evidencias/LEITURA_DOCUMENTAL_SPRINT_3.md

$ git status -sb
## sprint-3/f1-preveo
A  docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md
A  docs/sprints/sprint-03/evidencias/F1-auditoria-plano-aplicado.md
A  docs/sprints/sprint-03/evidencias/F1-base-branch.md
A  docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md
AM docs/sprints/sprint-03/evidencias/F1-staging-proof.md
A  docs/sprints/sprint-03/evidencias/LEITURA_DOCUMENTAL_SPRINT_3.md
```

## 5. Pre-commit

```bash
$ pre-commit run --all-files
[INFO] Installing environment for https://github.com/pre-commit/mirrors-mypy.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
An unexpected error has occurred: CalledProcessError: command: ('/home/moses/.local/share/uv/tools/pre-commit/bin/python', '-mvirtualenv', '/home/moses/.cache/pre-commit/repov5adsr39/py_env-python3.11', '-p', 'python3.11')
return code: 1
stdout:
    RuntimeError: failed to find interpreter for Builtin discover of python_spec='python3.11'
stderr: (none)
Check the log at /home/moses/.cache/pre-commit/pre-commit.log

$ echo EXIT_PRECOMMIT=3
EXIT_PRECOMMIT=3
```

## 6. Resultado

❌ Pre-commit falhou. A F1 não deve ser commitada até correção.

---

## 7. Recuperação ambiental do pre-commit via uv

**Data:** 2026-05-02T18:54:01-03:00

A execução anterior do `pre-commit run --all-files` falhou com `EXIT_PRECOMMIT=3` porque o hook `mypy` exige `language_version: python3.11`, mas o interpretador `python3.11` não estava disponível no WSL.

A configuração do projeto não foi alterada. A correção aplicada foi ambiental: instalação do Python 3.11 via `uv python install 3.11` e criação de link `~/.local/bin/python3.11`.

```bash
$ uv python find 3.11
/home/moses/.local/share/uv/python/cpython-3.11-linux-x86_64-gnu/bin/python3.11

$ command -v python3.11
/home/moses/.local/bin/python3.11

$ python3.11 --version
Python 3.11.15

$ pre-commit clean
pre-commit clean executado.
```

## 8. Nova execução do pre-commit após recuperação ambiental

```bash
$ pre-commit run --all-files
[INFO] Initializing environment for https://github.com/pre-commit/pre-commit-hooks.
[WARNING] repo `https://github.com/pre-commit/pre-commit-hooks` uses deprecated stage names (commit, push) which will be removed in a future version.  Hint: often `pre-commit autoupdate --repo https://github.com/pre-commit/pre-commit-hooks` will fix this.  if it does not -- consider reporting an issue to that repo.
[INFO] Initializing environment for https://github.com/astral-sh/ruff-pre-commit.
[INFO] Initializing environment for https://github.com/pre-commit/mirrors-mypy.
[INFO] Initializing environment for https://github.com/pre-commit/mirrors-mypy:pydantic>=2.7.0,pydantic-settings>=2.2.0.
[INFO] Initializing environment for https://github.com/Yelp/detect-secrets.
[INFO] Initializing environment for https://github.com/PyCQA/bandit.
[INFO] Initializing environment for https://github.com/PyCQA/bandit:tomli.
[INFO] Installing environment for https://github.com/pre-commit/pre-commit-hooks.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
[INFO] Installing environment for https://github.com/astral-sh/ruff-pre-commit.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
[INFO] Installing environment for https://github.com/pre-commit/mirrors-mypy.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
[INFO] Installing environment for https://github.com/Yelp/detect-secrets.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
[INFO] Installing environment for https://github.com/PyCQA/bandit.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
trim trailing whitespace.................................................Failed
- hook id: trailing-whitespace
- exit code: 1
- files were modified by this hook

Fixing docs/sprints/sprint-02/operacional/PROMPT_OPERACIONAL_FINAL_SPRINT_2.md
Fixing docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md

fix end of files.........................................................
Failed
- hook id: end-of-file-fixer
- exit code: 1
- files were modified by this hook

Fixing docs/sprints/sprint-03/evidencias/F1-staging-proof.md
Fixing docs/09_Qualidade_Testes.md
Fixing docs/sprints/sprint-03/evidencias/LEITURA_DOCUMENTAL_SPRINT_3.md
Fixing Makefile
Fixing CLAUDE.md
Fixing scripts/pipeline.ps1

check yaml...............................................................Failed
- hook id: check-yaml
- files were modified by this hook
check json...............................................................Failed
- hook id: check-json
- files were modified by this hook
check for merge conflicts................................................Failed
- hook id: check-merge-conflict
- files were modified by this hook
check for added large files..............................................Failed
- hook id: check-added-large-files
- files were modified by this hook
don't commit to branch...................................................Failed
- hook id: no-commit-to-branch
- files were modified by this hook
ruff.....................................................................Failed
- hook id: ruff
- files were modified by this hook

All checks passed!

ruff-format..............................................................Failed
- hook id: ruff-format
- files were modified by this hook

92 files left unchanged

mypy.....................................................................Failed
- hook id: mypy
- files were modified by this hook

Success: no issues found in 64 source files

Detect secrets...........................................................Failed
- hook id: detect-secrets
- exit code: 1
- files were modified by this hook

warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
ERROR: Potential secrets about to be committed to git repo!

Secret Type: Basic Auth Credentials
Location:    docs/sprints/sprint-02/operacional/PROMPT_OPERACIONAL_FINAL_SPRINT_2.md:151

Possible mitigations:
  - For information about putting your secrets in a safer place, please ask in
    #security
  - Mark false positives with an inline `pragma: allowlist secret` comment

If a secret has already been committed, visit
https://help.github.com/articles/removing-sensitive-data-from-a-repository
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md', CRLF will be replaced by LF the next time Git touches it

bandit...................................................................Failed
- hook id: bandit
- files were modified by this hook

[main]	INFO	profile include tests: None
[main]	INFO	profile exclude tests: B101
[main]	INFO	cli include tests: None
[main]	INFO	cli exclude tests: None
[main]	INFO	using config: backend/pyproject.toml
[main]	INFO	running on Python 3.12.3
Working... ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100% 0:00:00
Run started:2026-05-02 21:54:25.345881

Test results:
	No issues identified.

Code scanned:
	Total lines of code: 1766
	Total lines skipped (#nosec): 0
	Total potential issues skipped due to specifically being disabled (e.g., #nosec BXXX): 0

Run metrics:
	Total issues (by severity):
		Undefined: 0
		Low: 0
		Medium: 0
		High: 0
	Total issues (by confidence):
		Undefined: 0
		Low: 0
		Medium: 0
		High: 0
Files skipped (0):


$ echo EXIT_PRECOMMIT_RETRY=1
EXIT_PRECOMMIT_RETRY=1
```

## 9. Resultado final do pre-commit

❌ Pre-commit ainda falhou após correção ambiental via uv. A F1 não deve ser commitada até nova análise.

---

## 10. Decisão operacional após falha do pre-commit --all-files

**Data:** 2026-05-02T18:56:51-03:00


A execução de `pre-commit run --all-files` foi tentada e registrada nesta evidência. Ela falhou por motivos fora do escopo material da F1:

- ausência inicial de `python3.11`, corrigida ambientalmente via `uv`;
- modificações automáticas em arquivos antigos fora de `docs/sprints/sprint-03/`;
- detecção de possível segredo em documento operacional da Sprint 2, fora do conjunto de arquivos alterados pela F1.

Para evitar escopo lateral indevido, os arquivos antigos alterados automaticamente foram restaurados, e a validação abaixo é escopada exclusivamente aos arquivos staged da F1.

Esta decisão não dispensa o pipeline oficial: a F1 já possui `EXIT_LINT_PED=0` e `EXIT_PIPELINE=0` registrados em `F1-main-verify-baseline.md`.

## 11. Pre-commit escopado aos arquivos staged da F1

```bash
$ pre-commit run --files $(git diff --cached --name-only)
trim trailing whitespace.................................................Failed
- hook id: trailing-whitespace
- files were modified by this hook
fix end of files.........................................................
Failed
- hook id: end-of-file-fixer
- exit code: 1
- files were modified by this hook

Fixing docs/sprints/sprint-03/evidencias/F1-staging-proof.md

check yaml...........................................(no files to check)Skipped
check json...........................................(no files to check)Skipped
check for merge conflicts................................................Failed
- hook id: check-merge-conflict
- files were modified by this hook
check for added large files..............................................Failed
- hook id: check-added-large-files
- files were modified by this hook
don't commit to branch...................................................Failed
- hook id: no-commit-to-branch
- files were modified by this hook
ruff.................................................(no files to check)Skipped
ruff-format..........................................(no files to check)Skipped
mypy.................................................(no files to check)Skipped
Detect secrets...........................................................Failed
- hook id: detect-secrets
- files were modified by this hook
bandit...............................................(no files to check)Skipped

$ echo EXIT_PRECOMMIT_SCOPED=1
EXIT_PRECOMMIT_SCOPED=1
```

## 12. Resultado final do staging/pre-commit

❌ Pre-commit escopado ainda falhou. A F1 não deve ser commitada até nova análise.
