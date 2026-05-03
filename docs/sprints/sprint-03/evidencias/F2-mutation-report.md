# F2 - Mutation report

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F2 - Dominio puro de amortizacao PRICE/SAC
**Executor:** Codex
**Data WSL:** 2026-05-02T23:34:42-03:00
**Branch:** sprint-3/f2-dominio-amortizacao-codex
**Commit-base:** 55d5d44

## 1. Objetivo

Registrar a tentativa real de teste de mutacao para o dominio de amortizacao. Nao foi fabricado score mutacional.

## 2. Versao instalada

```bash
$ cd /home/moses/workspace/Plataforma_Educacional_Financeira/backend
$ .venv/bin/python -m mutmut --version
python -m mutmut, version 3.5.0
```

Observacao: ao executar via `bash -lc`, o shell tambem emitiu aviso ambiental de pnpm/node (`/mnt/c/Program Files/nodejs/pnpm: 11: exec: node: not found`). A execucao de mutmut em si respondeu a versao.

## 3. Tentativa direta no backend

```bash
$ cd /home/moses/workspace/Plataforma_Educacional_Financeira/backend
$ .venv/bin/python -m mutmut print-time-estimates
FileNotFoundError: Could not figure out where the code to mutate is. Please specify it by adding "paths_to_mutate=code_dir" in setup.cfg to the [mutmut] section.
```

Resultado: falha de configuracao. O projeto nao possui configuracao oficial de `paths_to_mutate` para mutmut. Nao foi criado `setup.cfg` nem alterado `pyproject.toml`, pois isso estaria fora do escopo permitido da F2.

## 4. Tentativa em copia temporaria - sem fixture

Para nao alterar configuracao do projeto, foi criada uma copia temporaria minima em `/tmp` com dominio e testes de amortizacao. A primeira tentativa esqueceu a fixture financeira.

```text
MUTMUT_TMP=/tmp/f2-mutmut-amortization.okaz9fl8
    done in 370ms (4 files mutated, 0 ignored, 0 unmodified)
......F
FileNotFoundError: [Errno 2] No such file or directory: '/tmp/f2-mutmut-amortization.okaz9fl8/mutants/tests/fixtures/financial_cases.json'
failed to collect stats. runner returned 1
MUTMUT_RUN_EXIT=1
MUTMUT_RESULTS_EXIT=0
```

Resultado: falha operacional da copia temporaria, corrigida na tentativa seguinte incluindo `tests/fixtures/financial_cases.json`.

## 5. Tentativa em copia temporaria - com fixture e PYTHONPATH

```text
MUTMUT_TMP=/tmp/f2-mutmut-amortization.ul13_zd7
    done in 355ms (4 files mutated, 0 ignored, 0 unmodified)
.......................................                                  [100%]
Stopping early, because we could not find any test case for any mutant. It seems that the selected tests do not cover any code that we mutated.
MUTMUT_RUN_EXIT=1
MUTMUT_RESULTS_EXIT=0
```

Resultado: os 39 testes rodaram, mas o mutmut nao associou testes aos mutantes. Suspeita tecnica: a copia temporaria foi executada com `PYTHONPATH=.` apontando para a arvore original da copia durante a coleta.

## 6. Tentativa em copia temporaria - com fixture e sem PYTHONPATH

```text
MUTMUT_TMP=/tmp/f2-mutmut-amortization.1fdyuu3z
    done in 366ms (4 files mutated, 0 ignored, 0 unmodified)
.......................................                                  [100%]
Stopping early, because we could not find any test case for any mutant. It seems that the selected tests do not cover any code that we mutated.
MUTMUT_RUN_EXIT=1
MUTMUT_RESULTS_EXIT=0
```

Resultado: a remocao de `PYTHONPATH` nao resolveu a associacao entre testes e mutantes.

## 7. Status mutacional

Nao ha score mutacional valido para a F2 nesta execucao.

O que foi verificado de forma real:

- `mutmut` esta instalado na versao 3.5.0.
- A execucao direta no backend falha por ausencia de configuracao oficial `paths_to_mutate`.
- A execucao em copia temporaria gerou mutantes para 4 arquivos, mas nao conseguiu associar testes aos mutantes, apesar de executar os 39 testes com sucesso.
- Nenhum arquivo de configuracao do repositorio foi alterado para forcar a ferramenta.

## 8. Impacto e destino

Impacto: sem score mutacional objetivo nesta F2.

Mitigacao atual: testes unitarios deterministico/property-based, golden cases, cobertura de dominio 97.22%, greps de pureza e pipeline oficial verde.

Destino recomendado: se a auditoria exigir mutacao como gate bloqueante, definir em fatia propria uma configuracao oficial de mutmut no projeto ou uma rotina documentada de mutacao, fora do escopo estrito da F2.
