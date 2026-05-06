# Adendo de Reconciliacao - Sprint 3.5/F2

Data: 2026-05-06
Escopo: reconciliacao documental pos-PR #20

## Veredito material

A Sprint 3.5/F2 deve ser registrada como materializada pelo PR #20, commit
`e4cd127 feat(ui): implementar financial cockpit fiel para juros e amortizacao`.

O PR #19 foi fechado sem merge e nao deve ser usado como referencia de
fechamento da F2.

## Cadeia de custodia

| PR | Estado | Commit | Conclusao |
| --- | --- | --- | --- |
| #18 | MERGED | `fc21560` | Materializou Sprint 3.5/F1 diagnostica/documental. |
| #19 | CLOSED | N/A | Fechado sem merge; supersedido. |
| #20 | MERGED | `e4cd127` | Materializou Sprint 3.5/F2 Financial Cockpit. |

## Estado operacional aceito

- `main = origin/main = e4cd127`.
- Financial Cockpit materializado em `/juros` e `/amortizacao`.
- Home compactada.
- Botoes principais padronizados.
- Breadcrumb sem `Dashboard` no frontend.
- Escopo proibido preservado.
- Pipeline oficial verde.
- Runtime local verde para `/`, `/juros`, `/amortizacao` e `/diagnostico`.

## Residuos

- Warning Recharts/jsdom em testes permanece como residuo nao bloqueante.
- Ruido documental anterior sobre o fluxo da F2 foi reconciliado nesta
  microfatia F2.1.

## Governanca

Esta reconciliacao nao altera codigo de producao, frontend funcional, backend,
API/OpenAPI, calculos financeiros, pipeline/workflows, baseline, Prompt-Mestre
ou planilha.

Sprint 3.5/F3 somente deve iniciar apos auditoria e aprovacao desta F2.1.
