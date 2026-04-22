# Corpo da PR — F2

## Contexto
Recuperação controlada da F2 a partir do clone real local.

## Base
- Branch: `sprint-2/f2-dominio`
- Base: `origin/main @ 4f561f6`

## Escopo
Patch técnico líquido da F2 (Domínio Juros), sem frontend, sem API, sem services, sem schemas.

## Diff técnico líquido contra origin/main
- Total: **16 caminhos**
- Adicionados: **13**
- Modificados: **3**
- Removidos: **0**
- Renomeados: **0**

## Correção aplicada
- Remoção de `backend/pytest.ini` do diff técnico final.
- Motivo: o arquivo quebrava a coleta dos testes unitários globais do backend ao sobrescrever os markers definidos em `backend/pyproject.toml`.

## Gates reais no clone local
- ruff check: verde
- ruff format --check: verde
- pytest F2: verde
- cobertura F2: 100%
- diff-100: 100/100
- mutmut: acima do piso do plano

## Evidências
Ver `docs/sprints/sprint-02/evidencias/`.
