# Sprint 3 / F6 - Staging proof

Data local da coleta: 2026-05-03

## Objetivo

Registrar a prova de escopo e staging da F6 antes do commit local.

A F6 e uma fatia exclusivamente documental de fechamento, governanca e validacao final da Sprint 3. O staging deve conter apenas relatorios e evidencias autorizados para a F6.

## Estado antes do staging

Comando:

```bash
git branch --show-current
git status -sb
git rev-parse --short HEAD
git rev-parse --short main
git rev-parse --short origin/main
```

Saida:

```text
sprint-3/f6-fechamento-governanca-codex
## sprint-3/f6-fechamento-governanca-codex
?? docs/sprints/sprint-03/contexto-continuidade-pos-sprint-03.md
?? docs/sprints/sprint-03/evidencias/F6-base-branch.md
?? docs/sprints/sprint-03/evidencias/F6-impact-agent.md
?? docs/sprints/sprint-03/evidencias/F6-openapi-docs-rastreabilidade.md
?? docs/sprints/sprint-03/evidencias/F6-pipeline-final.md
?? docs/sprints/sprint-03/evidencias/F6-relatorio-execucao-codex.md
?? docs/sprints/sprint-03/evidencias/F6-validacao-final.md
?? docs/sprints/sprint-03/relatorio-execucao.md
?? docs/sprints/sprint-03/relatorio-forense.md
?? docs/sprints/sprint-03/validacao-oficial.md
81e8cbb
81e8cbb
81e8cbb
```

Observacao operacional: alguns comandos executados via WSL nesta maquina exibem ao final a mensagem ambiental `/mnt/c/Program Files/nodejs/pnpm: 11: exec: node: not found`, com codigo de saida 0. A mensagem nao alterou o resultado Git acima.

## Branches residuais Sprint 3

Comando:

```bash
git branch --list 'sprint-3/*'
git branch -r --list 'origin/sprint-3/*'
```

Saida:

```text
* sprint-3/f6-fechamento-governanca-codex
```

Interpretacao: ha apenas a branch local atual da F6. Nao ha branch remota `origin/sprint-3/*`.

## Arquivos F6 presentes antes do staging

Comando:

```bash
find docs/sprints/sprint-03 -maxdepth 2 -type f \
  \( -name 'relatorio-*.md' -o -name 'validacao-oficial.md' \
  -o -name 'contexto-continuidade-pos-sprint-03.md' -o -name 'F6-*.md' \) \
  | sort
```

Saida:

```text
docs/sprints/sprint-03/contexto-continuidade-pos-sprint-03.md
docs/sprints/sprint-03/evidencias/F6-base-branch.md
docs/sprints/sprint-03/evidencias/F6-impact-agent.md
docs/sprints/sprint-03/evidencias/F6-openapi-docs-rastreabilidade.md
docs/sprints/sprint-03/evidencias/F6-pipeline-final.md
docs/sprints/sprint-03/evidencias/F6-relatorio-execucao-codex.md
docs/sprints/sprint-03/evidencias/F6-validacao-final.md
docs/sprints/sprint-03/relatorio-execucao.md
docs/sprints/sprint-03/relatorio-forense.md
docs/sprints/sprint-03/validacao-oficial.md
```

Observacao: este arquivo `F6-staging-proof.md` foi criado imediatamente apos a coleta acima para registrar a propria prova de staging.

## Escopo esperado para staging

Arquivos autorizados e criados pela F6:

```text
docs/sprints/sprint-03/contexto-continuidade-pos-sprint-03.md
docs/sprints/sprint-03/evidencias/F6-base-branch.md
docs/sprints/sprint-03/evidencias/F6-impact-agent.md
docs/sprints/sprint-03/evidencias/F6-openapi-docs-rastreabilidade.md
docs/sprints/sprint-03/evidencias/F6-pipeline-final.md
docs/sprints/sprint-03/evidencias/F6-relatorio-execucao-codex.md
docs/sprints/sprint-03/evidencias/F6-staging-proof.md
docs/sprints/sprint-03/evidencias/F6-validacao-final.md
docs/sprints/sprint-03/relatorio-execucao.md
docs/sprints/sprint-03/relatorio-forense.md
docs/sprints/sprint-03/validacao-oficial.md
```

## Prova pos-staging

Comando:

```bash
git status -sb
```

Saida:

```text
## sprint-3/f6-fechamento-governanca-codex
A  docs/sprints/sprint-03/contexto-continuidade-pos-sprint-03.md
A  docs/sprints/sprint-03/evidencias/F6-base-branch.md
A  docs/sprints/sprint-03/evidencias/F6-impact-agent.md
A  docs/sprints/sprint-03/evidencias/F6-openapi-docs-rastreabilidade.md
A  docs/sprints/sprint-03/evidencias/F6-pipeline-final.md
A  docs/sprints/sprint-03/evidencias/F6-relatorio-execucao-codex.md
A  docs/sprints/sprint-03/evidencias/F6-staging-proof.md
A  docs/sprints/sprint-03/evidencias/F6-validacao-final.md
A  docs/sprints/sprint-03/relatorio-execucao.md
A  docs/sprints/sprint-03/relatorio-forense.md
A  docs/sprints/sprint-03/validacao-oficial.md
```

Comando:

```bash
git diff --cached --name-status
```

Saida:

```text
A	docs/sprints/sprint-03/contexto-continuidade-pos-sprint-03.md
A	docs/sprints/sprint-03/evidencias/F6-base-branch.md
A	docs/sprints/sprint-03/evidencias/F6-impact-agent.md
A	docs/sprints/sprint-03/evidencias/F6-openapi-docs-rastreabilidade.md
A	docs/sprints/sprint-03/evidencias/F6-pipeline-final.md
A	docs/sprints/sprint-03/evidencias/F6-relatorio-execucao-codex.md
A	docs/sprints/sprint-03/evidencias/F6-staging-proof.md
A	docs/sprints/sprint-03/evidencias/F6-validacao-final.md
A	docs/sprints/sprint-03/relatorio-execucao.md
A	docs/sprints/sprint-03/relatorio-forense.md
A	docs/sprints/sprint-03/validacao-oficial.md
```

Comando:

```bash
git diff --cached --check
```

Saida:

```text
<sem saída>
```

Interpretacao: o staging contem somente arquivos novos autorizados da F6,
sem erro de whitespace detectado pelo Git.

## Confirmacao de escopo proibido

Comando executado apos a criacao dos documentos:

```bash
git diff -- backend frontend docs/api/openapi.json .github scripts/pipeline.sh Makefile docs/baseline
```

Saida:

```text
<sem saída>
```

Interpretacao: nao houve alteracao em backend, frontend, OpenAPI,
baseline, pipeline, workflows ou Makefile.
