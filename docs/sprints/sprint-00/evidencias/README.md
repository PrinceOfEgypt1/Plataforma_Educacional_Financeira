# Evidências — Sprint 00

Este diretório armazena evidências formais de auditoria da Sprint 00.

## Estrutura esperada

evidencias/
├── README.md               ← este arquivo
├── make-verify-output.txt  ← saída completa de make verify (a incluir)
├── pytest-output.txt       ← saída completa de pytest -v (a incluir)
├── vitest-output.txt       ← saída completa de vitest run (a incluir)
└── git-log.txt             ← saída de git log --oneline (a incluir)

## Evidências pendentes de inclusão

As evidências listadas acima devem ser geradas e commitadas no início da Sprint 01:

```bash
# em: ~/workspace/Plataforma_Educacional_Financeira
make verify > docs/sprints/sprint-00/evidencias/make-verify-output.txt 2>&1
cd backend && python -m pytest -v > ../docs/sprints/sprint-00/evidencias/pytest-output.txt 2>&1
cd frontend && npx vitest run > ../docs/sprints/sprint-00/evidencias/vitest-output.txt 2>&1
git log --oneline > docs/sprints/sprint-00/evidencias/git-log.txt
```

## Política de evidências (a partir de Sprint 01)

Conforme `docs/policies/POLITICA_OFICIAL_DE_AUDITORIA_E_RESPONSABILIDADE.md` §4.4, evidências devem ser capturadas **durante** a execução da sprint, não retroativamente.
