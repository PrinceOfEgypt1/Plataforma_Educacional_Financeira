# F6 — Pipeline final

Data: 2026-05-03

## 1. Lint pedagógico

```bash
make lint-pedagogical
```

Saída:

```text
python3 -m tools.edu_lint

edu_lint: 11 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
```

Resultado: `EXIT_LINT_PED=0`.

## 2. Pipeline oficial

```bash
bash scripts/pipeline.sh
```

Saída relevante:

```text
=== Pipeline Oficial de Qualidade (F5-E02) — modo: standard ===
[INFO] Repositório: /home/moses/workspace/Plataforma_Educacional_Financeira
[ OK ] backend.ruff_check
[ OK ] backend.ruff_format_check
[ OK ] backend.mypy_app
[ OK ] backend.bandit
[ OK ] backend.pytest_unit
[ OK ] frontend.install
[ OK ] frontend.lint
[ OK ] frontend.format_check
[ OK ] frontend.typecheck
[ OK ] frontend.test
[ OK ] frontend.build

=== PIPELINE VERDE ===
[INFO] Modo: standard
[INFO] Todos os gates obrigatórios passaram.
```

Saídas quantitativas do pipeline:

```text
backend.pytest_unit: 138 passed
frontend.test: Test Files 24 passed (24), Tests 189 passed (189)
frontend.build: Compiled successfully; 16 static pages generated
```

Resultado: `EXIT_PIPELINE=0`.

## 3. Observações reais de ambiente

O shell WSL emitiu ruído recorrente ao final de alguns comandos:

```text
/mnt/c/Program Files/nodejs/pnpm: 11: exec: node: not found
```

Interpretação: ruído pós-comando do ambiente. Os comandos documentados
retornaram exit code 0 quando registrados como verdes.

Também apareceu aviso de atualização do pnpm durante o pipeline:

```text
Update available! 9.12.2 -> 10.33.2.
```

Interpretação: informativo, não bloqueante.

## 4. Resultado

Pipeline final da Sprint 3/F6 verde.
