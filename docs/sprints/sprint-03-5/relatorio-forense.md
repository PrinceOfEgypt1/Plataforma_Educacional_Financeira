# Sprint 3.5 - Relatorio Forense

Data: 2026-05-06

## Escopo

Este relatorio fecha a cadeia de custodia da Sprint 3.5 e separa fatos,
inferencias e limitacoes sobre a materializacao da UI/UX.

## Fatos

- FATO: PR #18 foi mergeado e materializou a F1 diagnostica no commit `fc21560`.
- FATO: PR #19 foi fechado sem merge.
- FATO: PR #19 nao possui `mergedAt` nem `mergeCommit`.
- FATO: PR #20 foi mergeado e materializou a F2 no commit `e4cd127`.
- FATO: PR #21 foi mergeado e materializou a F2.1 no commit `2fcf231`.
- FATO: a F3 partiu de `main = origin/main = 2fcf231`.
- FATO: o cockpit atual usa services/API existentes no frontend.
- FATO: nao houve alteracao em backend, OpenAPI, workflows, baseline, Prompt-Mestre ou planilha na F3.

## Inferencias

- INFERENCIA: PR #20 substitui formalmente o PR #19 como materializacao valida da F2 porque esta na `main` e contem o Financial Cockpit aprovado para continuidade.
- INFERENCIA: a reconciliacao F2.1 resolve a ambiguidade operacional anterior e permite fechar a Sprint 3.5 com cadeia de custodia clara.

## Limitacoes

- LIMITACAO: warnings Recharts/jsdom sobre dimensoes zero em testes permanecem como residuo tecnico conhecido e nao bloqueante.
- LIMITACAO: a experiencia mobile do cockpit e estruturalmente densa. A F3 adiciona adaptacao basica, mas uma futura fatia especifica pode refinar a ordem visual em celulares.
- LIMITACAO: screenshots automatizados dependem de browser disponivel no ambiente. A validacao F3 combina inspecao estrutural, runtime local, testes e pipeline.

## Escopo preservado

Preservado integralmente:

- backend;
- calculos financeiros;
- contratos de API;
- OpenAPI;
- pipeline/workflows;
- Prompt-Mestre;
- docs baseline;
- planilha operacional.

## Residuos tecnicos

- Warning Recharts/jsdom em testes.
- Possivel refinamento mobile futuro.

## Evidencias reais

- `docs/sprints/sprint-03-5/evidencias/F3-git-baseline.md`
- `docs/sprints/sprint-03-5/evidencias/F3-auditoria-final-uiux.md`
- `docs/sprints/sprint-03-5/evidencias/F3-validacao-responsividade-a11y.md`
- `docs/sprints/sprint-03-5/evidencias/F3-gates.md`

## Veredito forense

A cadeia de custodia da Sprint 3.5 esta reconciliada. A F3 pode fechar a
sprint se os gates finais e o runtime local permanecerem verdes.
