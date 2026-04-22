# F2 — Staging Proof

## 1. Contexto

- Branch: `sprint-2/f2-dominio`
- Base: `origin/main @ 4f561f6`
- Escopo: patch técnico líquido da F2 (Domínio Juros)
- Fonte de verdade: clone local real

## 2. Conteúdo vinculante do estado técnico líquido

Total: **16 caminhos** (**13 adicionados, 3 modificados, 0 removidos, 0 renomeados**).

- `M` `backend/app/__init__.py`
- `M` `backend/app/domain/__init__.py`
- `M` `backend/app/domain/interest/__init__.py`
- `A` `backend/app/domain/interest/_rounding.py`
- `A` `backend/app/domain/interest/compound.py`
- `A` `backend/app/domain/interest/simple.py`
- `A` `backend/requirements-dev.txt`
- `A` `backend/setup.cfg`
- `A` `backend/tests/conftest.py`
- `A` `backend/tests/fixtures/financial_cases.json`
- `A` `backend/tests/fixtures/gen_fixture.py`
- `A` `backend/tests/unit/domain/__init__.py`
- `A` `backend/tests/unit/domain/interest/__init__.py`
- `A` `backend/tests/unit/domain/interest/test_compound.py`
- `A` `backend/tests/unit/domain/interest/test_properties.py`
- `A` `backend/tests/unit/domain/interest/test_simple.py`

## 3. Observação corretiva

- `backend/pytest.ini` foi removido do estado técnico final da F2.
- Motivo: o arquivo sobrescrevia a configuração global de pytest do backend e quebrava os markers `unit` do projeto.
- A configuração válida do backend permanece em `backend/pyproject.toml`.

## 4. Gates reais capturados no clone local

- `F2-ruff-check.txt`
- `F2-ruff-format.txt`
- `F2-pytest.txt`
- `F2-coverage.txt`
- `F2-diff-100.txt`
- `F2-mutmut.txt`
- `F2-base-branch.txt`
