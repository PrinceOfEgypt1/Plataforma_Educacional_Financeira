# F2 - Relatorio de execucao Codex

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F2 - Dominio puro de amortizacao PRICE/SAC
**Executor:** Codex
**Data WSL:** 2026-05-02T23:34:42-03:00
**Branch:** sprint-3/f2-dominio-amortizacao-codex
**Commit-base:** 55d5d44

## 1. Resumo executivo

A F2 implementa dominio puro para amortizacao PRICE e SAC, com `Decimal`, arredondamento `ROUND_HALF_EVEN`, fechamento financeiro linha a linha e ajuste final para eliminar residuos de centavos. Foram criados testes unitarios deterministos, testes property-based, golden cases em fixture e regressao pedagogica para o service publico de juros herdada da Sprint 2.

Nao foram implementados API, frontend, OpenAPI, schemas HTTP, services HTTP ou tela `/amortizacao`.

## 2. Branch usada

```bash
$ git branch --show-current
sprint-3/f2-dominio-amortizacao-codex
```

Confirmacao: nao houve trabalho direto na `main` apos a preparacao inicial.

## 3. Commit-base

```bash
$ git rev-parse --short HEAD
55d5d44

$ git rev-parse --short origin/main
55d5d44
```

Base oficial: `main = origin/main = 55d5d44`.

## 4. Arquivos lidos

Documentos e arquivos canonicos lidos antes da implementacao:

- CLAUDE.md
- README.md
- Makefile
- scripts/pipeline.sh
- .pre-commit-config.yaml
- docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md
- docs/sprints/sprint-03/evidencias/LEITURA_DOCUMENTAL_SPRINT_3.md
- docs/sprints/sprint-03/evidencias/F1-base-branch.md
- docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md
- docs/sprints/sprint-03/evidencias/F1-auditoria-plano-aplicado.md
- docs/sprints/sprint-03/evidencias/F1-staging-proof.md
- docs/02_Escopo_Funcional.md
- docs/04_Arquitetura_de_Software.md
- docs/06_API_e_Contratos.md
- docs/09_Qualidade_Testes.md
- docs/13_Backlog_Tecnico.md
- docs/15_Casos_de_Teste_Matematicos.md
- docs/19_Matriz_Rastreabilidade.md
- docs/25_Release_Readiness.md
- docs/_meta/living_docs.json
- docs/baseline/03_Regras_de_Negocio.md
- docs/baseline/11_Prompt_Mestre.md
- docs/baseline/21_Governanca_Branches_PRs.md
- backend/app/domain/interest/__init__.py
- backend/app/domain/interest/simple.py
- backend/app/domain/interest/compound.py
- backend/app/domain/interest/_rounding.py
- backend/app/services/interest/calcular_juros_service.py
- backend/tests/unit/domain/interest/test_simple.py
- backend/tests/unit/domain/interest/test_compound.py
- backend/tests/unit/domain/interest/test_properties.py
- backend/tests/unit/services/interest/test_calcular_juros_service.py
- backend/tests/fixtures/financial_cases.json
- backend/app/domain/amortization/__init__.py

Arquivos externos lidos apos os canonicos:

- Contexto Operacional - Plataforma Educacional Financeira - para Codex (`CONTEXTO COMPLETO PARA A CODEX.docx`)
- Prompt Operacional - Sprint 3/F2 (`PROMPT OPERACIONAL PARA A CODEX ? F2 DO ZERO.docx`)
- backlog_operacional_acompanhamento_sprint3_f1_fechada.xlsx

A planilha foi usada apenas como referencia operacional e nao foi alterada.

## 5. Arquivos criados

- backend/app/domain/amortization/_common.py
- backend/app/domain/amortization/price.py
- backend/app/domain/amortization/sac.py
- backend/tests/unit/domain/amortization/__init__.py
- backend/tests/unit/domain/amortization/test_price.py
- backend/tests/unit/domain/amortization/test_sac.py
- backend/tests/unit/domain/amortization/test_properties.py
- backend/tests/regression/pedagogical/__init__.py
- backend/tests/regression/pedagogical/test_interest.py
- docs/sprints/sprint-03/evidencias/F2-domain-coverage.md
- docs/sprints/sprint-03/evidencias/F2-domain-diff-cenarios.md
- docs/sprints/sprint-03/evidencias/F2-grep-pureza-dominio.md
- docs/sprints/sprint-03/evidencias/F2-staging-proof.md
- docs/sprints/sprint-03/evidencias/F2-mutation-report.md
- docs/sprints/sprint-03/evidencias/F2-relatorio-execucao-codex.md

## 6. Arquivos alterados

- backend/app/domain/amortization/__init__.py
- backend/tests/fixtures/financial_cases.json

Nao foram alterados docs baseline, Makefile, pipeline, workflows, API, schemas, services HTTP, frontend ou planilha.

## 7. Formulas implementadas

PRICE:

```text
PMT = PV * [ i * (1 + i)^n ] / [ (1 + i)^n - 1 ]
juros = saldo_anterior * taxa
amortizacao = parcela - juros
saldo_final = saldo_anterior - amortizacao
```

SAC:

```text
A = PV / n
juros = saldo_anterior * taxa
parcela = amortizacao + juros
saldo_final = saldo_anterior - amortizacao
```

Taxa zero e tratada explicitamente como amortizacao linear, sem juros.

## 8. Politica de arredondamento

- Tipo monetario: `Decimal`.
- Precisao interna: contexto local com precisao 34.
- Quantum de exibicao: `Decimal("0.01")`.
- Modo: `ROUND_HALF_EVEN`.
- Helper local em `backend/app/domain/amortization/_common.py`.
- Nenhuma dependencia de `app.domain.interest._rounding`.

## 9. Politica de fechamento da tabela

PRICE:

- Linhas 1 ate `n-1`: parcela regular quantizada; juros quantizado; amortizacao = parcela - juros.
- Linha `n`: amortizacao = principal - soma(amortizacoes anteriores); juros quantizado; parcela = juros + amortizacao; saldo final = `0.00`.

SAC:

- Linhas 1 ate `n-1`: amortizacao regular quantizada; juros quantizado; parcela = juros + amortizacao.
- Linha `n`: amortizacao = principal - soma(amortizacoes anteriores); juros quantizado; parcela = juros + amortizacao; saldo final = `0.00`.

Totais sao sempre derivados das linhas exibidas, nao de recomputacao independente.

## 10. Testes criados

- Testes deterministos PRICE: caso canonico, fechamento de tabela, taxa zero, prazo unitario, principal zero, invalidos, fixtures e imutabilidade.
- Testes deterministos SAC: caso canonico, decrescimo de parcelas/juros, taxa zero, prazo unitario, invalidos, fixtures e comparativo com PRICE.
- Testes property-based: invariantes de fechamento, totalizadores, saldo final, parcela/amortizacao regular ate penultima linha, taxa zero e comparativo SAC vs PRICE em cenarios materiais.
- Testes de regressao pedagogica do service publico de juros: preservacao de `summary`, `tables`, `charts`, `interpretation` e `alerts`.

## 11. Fixtures adicionadas

`backend/tests/fixtures/financial_cases.json` recebeu a secao `amortization` com casos PRICE, SAC, comparativos e massa grid de 36 combinacoes.

Caso canonico registrado:

- PRICE `PV=100000`, taxa `0.01`, prazo `12`: total pago `106618.53`, juros `6618.53`, saldo final `0.00`.
- SAC `PV=100000`, taxa `0.01`, prazo `12`: total pago `106500.00`, juros `6500.00`, saldo final `0.00`.

## 12. Evidencias criadas

- F2-domain-coverage.md
- F2-domain-diff-cenarios.md
- F2-grep-pureza-dominio.md
- F2-staging-proof.md
- F2-mutation-report.md
- F2-relatorio-execucao-codex.md

## 13. Comandos executados e saidas relevantes

Git inicial:

```bash
$ git checkout main
Already on 'main'
Your branch is up to date with 'origin/main'.

$ git reset --hard origin/main
HEAD is now at 55d5d44 docs(sprint-3): materializar plano de execu??o F1 (#12)

$ git branch --show-current
main

$ git status -sb
## main...origin/main

$ git rev-parse --short HEAD
55d5d44

$ git rev-parse --short origin/main
55d5d44
```

Criacao da branch:

```bash
$ git checkout -b sprint-3/f2-dominio-amortizacao-codex
Switched to a new branch 'sprint-3/f2-dominio-amortizacao-codex'
```

Valiacoes principais:

```bash
$ PYTHONPATH=backend backend/.venv/bin/python -m pytest backend/tests/unit/domain/amortization -q
39 passed in 0.70s

$ cd backend && .venv/bin/python -m pytest tests/unit -m unit
133 passed in 2.92s

$ cd backend && .venv/bin/python -m pytest tests/regression -m regression
3 passed in 0.13s

$ make lint-pedagogical
edu_lint: 5 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)

$ env PATH=/home/moses/.nvm/versions/node/v22.21.1/bin:... bash scripts/pipeline.sh
=== PIPELINE VERDE ===
[INFO] Todos os gates obrigatorios passaram.
```

## 14. Comandos nao executados

Nenhum comando obrigatorio de validacao ficou sem execucao.

A execucao de mutacao foi tentada, mas nao produziu score valido. Detalhes estao em `F2-mutation-report.md`.

## 15. Falhas encontradas e correcao

1. Property-based SAC vs PRICE inicialmente assumia que SAC teria juros menores para qualquer taxa/prazo/principal. Contraexemplo real: cenarios pequenos com arredondamento de centavos podem empatar. Correcao: restringir a propriedade a cenarios materiais (`principal >= 10000`, taxa >= `0.005`, prazo >= 3`) e manter igualdade/fechamento em propriedades separadas.
2. Ruff identificou pontos de estilo (`zip(strict=True)`, import ordering e linhas longas). Correcao: ajuste localizado e `ruff format` nos arquivos tocados.
3. Pipeline oficial falhou inicialmente porque `node` nao estava no PATH do WSL. Correcao ambiental sem alterar repo: execucao final com PATH temporario para `/home/moses/.nvm/versions/node/v22.21.1/bin`.
4. Mutmut nao possui configuracao oficial no projeto e, em copia temporaria, nao associou testes aos mutantes. Sem correcao no repo porque alterar configuracao do mutmut estaria fora do escopo permitido.

## 16. Riscos

- Sem score mutacional valido nesta execucao; mitigado por testes property-based, golden cases, cobertura 97.22%, greps forenses e pipeline oficial verde.
- O PATH padrao do WSL nao expoe `node`; o pipeline verde dependeu de PATH temporario com Node do nvm. Nao foi alterado arquivo de perfil/shell.
- A ultima parcela PRICE e ajustada para fechamento exato; isso e deliberado e documentado para evitar divergencia entre tabela e totais.

## 17. Pendencias

- Auditoria do Camaleao/Moises.
- Decisao do PO sobre push/PR.
- Opcional futuro: padronizar configuracao oficial de mutmut no projeto, se a equipe quiser transformar mutacao em gate formal.

## 18. Status final

Implementacao local da F2 validada nos gates obrigatorios. Pipeline oficial verde com PATH temporario para Node do nvm.

Nao houve merge. Nao houve push. Nao foi aberta PR.

A F2 nao esta declarada concluida; esta pronta para auditoria do Camaleao/Moises apos revisao dos artefatos e do diff.
