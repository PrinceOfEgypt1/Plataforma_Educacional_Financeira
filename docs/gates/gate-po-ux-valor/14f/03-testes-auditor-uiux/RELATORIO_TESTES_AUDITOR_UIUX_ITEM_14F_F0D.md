# Relatório — Item 14F-F0D — Testes do auditor UI/UX

## 1. Resumo executivo

Este item cria cobertura automatizada para o auditor `audit:uiux`, responsável por transformar violações do contrato UI/UX do módulo Financiamento Imobiliário em falhas objetivas.

## 2. Arquivo de teste criado

- `frontend/src/__tests__/scripts/auditorUiux.test.ts`

## 3. Cobertura criada

O teste cobre cinco dimensões:

1. integração do comando `audit:uiux` no `frontend/package.json`;
2. execução do auditor em modo `--contract-only`;
3. emissão de JSON estruturado em modo `--json --expect-fail`;
4. preservação do resumo atual de violações;
5. presença de evidências mínimas em cada violação reportada.

## 4. Comandos de validação

~~~bash
cd frontend
pnpm test -- src/__tests__/scripts/auditorUiux.test.ts
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
~~~

## 5. Estado esperado do auditor nesta etapa

O módulo Imóvel ainda deve reprovar quando auditado em modo `--expect-fail`.

Resumo protegido pelo teste:

| Severidade | Quantidade |
|---|---:|
| high | 19 |
| medium | 9 |
| low | 0 |
| total | 28 |

Códigos protegidos pelo teste:

| Código | Quantidade |
|---|---:|
| `UX-CTA-001` | 2 |
| `UX-CTA-002` | 2 |
| `UX-DUP-001` | 14 |
| `UX-DUP-002` | 9 |
| `UX-MOBILE-001` | 1 |

## 6. Interpretação

O teste não substitui o julgamento PO/UX, mas cria uma trava técnica para impedir que o auditor seja quebrado silenciosamente.

Enquanto o módulo Imóvel ainda estiver reprovado, o teste confirma que o auditor encontra as violações esperadas.

Quando as correções forem implementadas, a suíte deverá evoluir para refletir o novo estado aprovado.
