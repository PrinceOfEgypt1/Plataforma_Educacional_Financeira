# F2 — README operacional reconstruído a partir do clone real

## Estado real desta rodada

- Branch: `sprint-2/f2-dominio`
- Base: `origin/main @ 4f561f6`
- Fonte de verdade: clone local real
- Escopo: patch técnico líquido da F2 (Domínio Juros)

## Diff técnico líquido contra origin/main

Total: **16 caminhos**
- Adicionados: **13**
- Modificados: **3**
- Removidos: **0**
- Renomeados: **0**

## Observação corretiva

`backend/pytest.ini` foi removido do estado técnico final da F2, pois conflitava com a configuração global de pytest do backend definida em `backend/pyproject.toml`.

## Gates reais já capturados

- `F2-ruff-check.txt`
- `F2-ruff-format.txt`
- `F2-pytest.txt`
- `F2-coverage.txt`
- `F2-diff-100.txt`
- `F2-mutmut.txt`
- `F2-base-branch.txt`
- `F2-staging-proof.md`
