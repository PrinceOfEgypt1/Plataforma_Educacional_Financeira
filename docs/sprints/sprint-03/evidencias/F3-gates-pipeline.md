# F3 ? Gates e pipeline

Data: 2026-05-03

## Gates backend obrigatorios

### Ruff check

```bash
cd backend
.venv/bin/python -m ruff check .
```

Saida real:

```text
All checks passed!
```

### Ruff format

Primeira execucao real:

```text
Would reformat: tests/integration/api/amortization/test_compare.py
Would reformat: tests/integration/api/amortization/test_price.py
Would reformat: tests/integration/api/amortization/test_sac.py
3 files would be reformatted, 112 files already formatted
```

Correcao aplicada:

```bash
.venv/bin/python -m ruff format tests/integration/api/amortization/test_compare.py tests/integration/api/amortization/test_price.py tests/integration/api/amortization/test_sac.py
```

Saida real:

```text
3 files reformatted
```

Reexecucao:

```bash
.venv/bin/python -m ruff format --check .
```

Saida real:

```text
115 files already formatted
```

### Mypy

```bash
cd backend
.venv/bin/python -m mypy app/
```

Saida real:

```text
Success: no issues found in 73 source files
```

### Bandit

```bash
cd backend
.venv/bin/python -m bandit -r app/ -c pyproject.toml
```

Saida real relevante:

```text
Test results:
	No issues identified.
Total issues (by severity):
	Undefined: 0
	Low: 0
	Medium: 0
	High: 0
```

## Pytest obrigatorio

```bash
cd backend
.venv/bin/python -m pytest tests/unit/domain/amortization -q
```

Saida real:

```text
.......................................                                  [100%]
39 passed in 0.80s
```

```bash
cd backend
.venv/bin/python -m pytest tests/unit -m unit
```

Saida real relevante:

```text
collected 138 items
============================= 138 passed in 3.17s ==============================
```

```bash
cd backend
.venv/bin/python -m pytest tests/regression -m regression
```

Saida real:

```text
collected 3 items
============================== 3 passed in 0.17s ===============================
```

```bash
cd backend
.venv/bin/python -m pytest tests/integration -q
.venv/bin/python -m pytest tests/contract -q
```

Saidas reais:

```text
36 passed in 0.74s
22 passed in 0.74s
```

## Lint pedagogico

```bash
make -C /home/moses/workspace/Plataforma_Educacional_Financeira lint-pedagogical
```

Saida real:

```text
edu_lint: 5 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
```

`EXIT_LINT_PED=0`.

## Pipeline oficial

Comando executado com PATH do Node/NVM no WSL:

```bash
env PATH=/home/moses/.nvm/versions/node/v22.21.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin bash /home/moses/workspace/Plataforma_Educacional_Financeira/scripts/pipeline.sh
```

Saida real relevante:

```text
=== Pipeline Oficial de Qualidade (F5-E02) ? modo: standard ===
[ OK ] backend.ruff_check
[ OK ] backend.ruff_format_check
[ OK ] backend.mypy_app
[ OK ] backend.bandit
============================= 138 passed in 2.99s ==============================
[ OK ] backend.pytest_unit
[ OK ] frontend.install
[ OK ] frontend.lint
[ OK ] frontend.format_check
[ OK ] frontend.typecheck
Test Files  21 passed (21)
Tests  149 passed (149)
[ OK ] frontend.test
[ OK ] frontend.build
=== PIPELINE VERDE ===
[INFO] Todos os gates obrigat?rios passaram.
```

`EXIT_PIPELINE=0`.

Observacao: o pipeline reportou apenas avisos conhecidos de ambiente/teste frontend (`Vite CJS deprecated` e dimensoes de chart em teste). Eles nao alteraram o exit code e nao bloquearam o gate.
