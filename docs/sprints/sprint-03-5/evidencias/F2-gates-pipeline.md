# F2 - Gates e pipeline

## Gates frontend

Executar antes do fechamento:

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test -- --run`
- `pnpm build`

## Gates raiz

Executar antes do fechamento:

- `make lint-pedagogical`
- `bash scripts/pipeline.sh`

## Resultado final

```text
pnpm lint: OK
pnpm format:check: OK
pnpm typecheck: OK
pnpm test -- --run: OK - 25 arquivos / 177 testes
pnpm build: OK - 16/16 paginas estaticas
make lint-pedagogical: OK - 11 arquivos analisados, 0 bloqueios, 0 avisos
bash scripts/pipeline.sh: OK
EXIT_LINT_PED=0
EXIT_PIPELINE=0
PIPELINE VERDE
```

## Observacoes

O pipeline oficial executou backend ruff, ruff format check, mypy, bandit,
pytest unitario, frontend install, lint, format check, typecheck, testes e
build. Todos os gates obrigatorios passaram.

Aviso nao bloqueante observado durante os testes frontend: warning conhecido de
Recharts/jsdom sobre dimensao zero em ambiente de teste. Nao houve falha
funcional, de teste, typecheck ou build.
