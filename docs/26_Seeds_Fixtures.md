# DOCUMENTO 26 — SEEDS, FIXTURES E DADOS DE DEMONSTRAÇÃO

**Versão:** 1.0
**Status:** VIVO

---

## 1. Princípios

1. **Determinismo.** Mesmo seed, mesmo dado.
2. **Sintético.** Nada de PII real.
3. **Versionado.** Seeds vivem no repositório; mudança via PR.
4. **Por ambiente.** `dev`, `test/CI`, `homolog`, `demo`.

## 2. Convenções

- Diretórios:
  - `backend/seeds/dev/` — dados ricos para uso local.
  - `backend/seeds/ci/` — dados mínimos para teste rápido.
  - `backend/seeds/homolog/` — dados realistas porém sintéticos.
  - `backend/seeds/demo/` — dados curados para apresentação.
- Comando: `python -m app.seeds.run --env dev`.
- Idempotente (rodar 2x = mesmo resultado).
- Sem `DELETE`/`TRUNCATE` em homolog/demo sem flag explícita.

## 3. Categorias de seed

| Categoria | Conteúdo |
|-----------|----------|
| Usuários | 5 contas sintéticas (`alice@demo.local`, etc.) com perfis variados |
| Simulações | Resultados pré-calculados de cenários canônicos para gráficos populados |
| Conteúdo educacional | Glossário + módulos do Doc 08 |
| Indicadores | Metadados dos indicadores do Doc 02 |

## 4. Fixtures de teste

- `tests/fixtures/financial/` — entradas para cada caso de Doc 15.
- `tests/fixtures/api/` — payloads mínimos por endpoint.
- `tests/fixtures/visual/` — datasets para snapshot visual.
- Geradores em `tests/factories/` (factory pattern, ex.: `factory_boy`).

## 5. Política para a Claude Code

1. Toda nova entidade exige seed mínimo e fixture de teste.
2. Toda mudança de schema atualiza seeds correspondentes.
3. Sem dado real em fixture/seed.
4. PR que altera schema sem atualizar seeds = bloqueio do agente de impacto.

## 6. Drill de seeds

- Mensal: rodar `seeds/run --env homolog` em ambiente isolado e validar smoke.
