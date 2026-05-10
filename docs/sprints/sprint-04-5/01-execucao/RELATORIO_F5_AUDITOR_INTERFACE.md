# RELATÓRIO F5 — AUDITOR DE INTERFACE ADVISORY

Sprint: 4.5
Fatia: F5 — Auditor de Interface Advisory e Fechamento Visual
Branch: `codex/sprint-4-5-f5-auditor-interface-advisory`
Base: `origin/main @ 7e62283`

## 1. Objetivo

Materializar um `auditor_de_interface` leve, local e não bloqueante para apoiar
a governança visual da Sprint 4.5 antes da F6.

A F5 não encerra a Sprint 4.5, não inicia F6, não inicia Sprint 5 e não
substitui aprovação de Moisés/Camaleão.

## 2. Arquivos alterados

- `frontend/scripts/auditor-de-interface.mjs`
- `frontend/package.json`
- `frontend/src/__tests__/app/auditorDeInterface.test.ts`
- `docs/ui/AUDITOR_DE_INTERFACE.md`
- `docs/09_Qualidade_Testes.md`
- `docs/16_Design_System.md`
- `docs/_meta/living_docs.json`
- `docs/sprints/sprint-04-5/01-execucao/RELATORIO_F5_AUDITOR_INTERFACE.md`

## 3. Regras do auditor

O auditor executa checagens estáticas em modo advisory:

- tabelas financeiras sem `overflow-x-auto`, `overflow-x-scroll` ou
  `overflowX` como experiência principal;
- ausência de `.slice()` em tabelas financeiras e pontos de preservação de
  linhas;
- presença de `<caption>`, `scope="col"`, `scope="row"` e numerais tabulares;
- sticky header restrito a `.cockpit-table thead th`;
- topbar do cockpit derivada de `visibleInCockpit` e
  `getCockpitVisibleModules`;
- ausência de `VISIBLE_MODULE_IDS` em `FinancialCockpitShell`;
- uso de `CockpitEducationPanel` sem reintroduzir `EducationPanel` duplicado no
  cockpit;
- presença de `aria-busy`, `aria-invalid` e `aria-describedby` nos primitivos;
- política de modais como apoio contextual, não navegação principal;
- registro do auditor em `docs/_meta/living_docs.json`.

## 4. Semântica advisory

Achados de interface não bloqueiam a execução por exit code enquanto o auditor
estiver em modo advisory. Erros operacionais, como arquivo obrigatório ausente
ou falha de leitura, retornam exit code diferente de zero.

Alertas advisory remanescentes devem ser documentados, justificados,
classificados por severidade, vinculados a decisão formal de Moisés/Camaleão e
rastreados como pendência ou exceção temporária.

## 5. Resultado do auditor

Comando:

```bash
pnpm --dir frontend audit:interface
```

Resultado:

- `critical-advisory`: 0
- `warning`: 0
- `info`: 18
- exit code: 0

## 6. Validações executadas

| Comando                                                                               | Resultado                                       |
| ------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `pnpm --dir frontend format:check`                                                    | VERDE                                           |
| `pnpm --dir frontend lint`                                                            | VERDE                                           |
| `pnpm --dir frontend typecheck`                                                       | VERDE                                           |
| `pnpm --dir frontend test`                                                            | VERDE — 45 arquivos, 390 testes                 |
| `pnpm --dir frontend build`                                                           | VERDE                                           |
| `pnpm --dir frontend audit:interface`                                                 | VERDE — 0 critical-advisory, 0 warning, 18 info |
| `python3 -m json.tool docs/_meta/living_docs.json >/tmp/living_docs_f5_validado.json` | VERDE                                           |
| `git diff --check origin/main...HEAD`                                                 | VERDE                                           |

Observação: a suíte Vitest manteve avisos conhecidos do Recharts em ambiente
JSDOM sobre dimensões `0x0`; os testes passaram.

## 7. Fora de escopo confirmado

- nenhuma regra financeira alterada;
- nenhuma API alterada;
- nenhum endpoint alterado;
- nenhum backend alterado;
- nenhuma planilha alterada;
- nenhum diretório da Sprint 5 criado;
- F6 não iniciada;
- Sprint 5 não iniciada;
- main não alterada diretamente.

## 8. Pendências para F6

- revisão final de Moisés/Camaleão sobre o relatório F5;
- decisão formal sobre manter o auditor apenas advisory ou evoluir regras em
  fase futura;
- fechamento formal da Sprint 4.5 somente após F6.
