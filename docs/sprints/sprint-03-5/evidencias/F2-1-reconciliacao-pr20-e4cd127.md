# Sprint 3.5/F2.1 - Reconciliacao PR #20 / e4cd127

Data: 2026-05-06
Branch: `sprint-3.5/f2-1-reconciliacao-documental-pr20-codex`
Base: `main = origin/main = e4cd127`

## 1. Objetivo

Registrar a verdade material da Sprint 3.5/F2 apos a auditoria forense da
cadeia de custodia dos PRs #18, #19 e #20.

Esta evidencia e somente documental. Nao altera frontend funcional, backend,
API/OpenAPI, calculos, pipeline/workflows, baseline, Prompt-Mestre ou planilha.

## 2. Contexto da divergencia operacional

Durante a Sprint 3.5 houve mistura operacional entre fluxos de chat e PRs. O
PR #19 chegou a ser tratado em conversas anteriores como candidato de
materializacao da F2, mas a auditoria de Git/GitHub demonstrou que ele foi
fechado sem merge e nao representa o estado final da `main`.

## 3. Fatos comprovados

- FATO: PR #18 materializou a Sprint 3.5/F1.
- FATO: PR #18 esta `MERGED`.
- FATO: PR #18 gerou o commit `fc21560`.
- FATO: PR #19 esta `CLOSED`.
- FATO: PR #19 tem `mergedAt = null`.
- FATO: PR #19 tem `mergeCommit = null`.
- FATO: PR #19 foi supersedido e nao deve ser usado como referencia de
  fechamento da F2.
- FATO: PR #20 materializou a Sprint 3.5/F2.
- FATO: PR #20 esta `MERGED`.
- FATO: PR #20 gerou o commit `e4cd127`.
- FATO: `main = origin/main = e4cd127`.
- FATO: PR #20 trouxe o Financial Cockpit para `/juros` e `/amortizacao`.
- FATO: a Home foi compactada, os botoes principais foram padronizados e o
  breadcrumb nao contem `Dashboard` no frontend.
- FATO: o escopo proibido foi preservado na F2 real: sem alteracao em backend,
  OpenAPI, pipeline/workflows, baseline, Prompt-Mestre ou planilha.
- FATO: o pipeline oficial esta verde.
- FATO: runtime local limpo respondeu HTTP 200 para `/`, `/juros`,
  `/amortizacao` e `/diagnostico`.

## 4. Evidencias literais resumidas

### PR #18

```text
number: 18
state: MERGED
mergedAt: 2026-05-04T01:21:33Z
mergeCommit: fc2156010bcfda59b1d02f5a585af120ae0ee58a
title: docs(sprint-3.5): diagnosticar UI/UX atual e planejar melhoria visual
```

### PR #19

```text
number: 19
state: CLOSED
closedAt: 2026-05-06T01:04:08Z
mergedAt: null
mergeCommit: null
title: feat(ui): aplicar fundacao visual da Sprint 3.5
```

### PR #20

```text
number: 20
state: MERGED
mergedAt: 2026-05-06T00:53:30Z
mergeCommit: e4cd127c58a1ae7475325568433569d8fe32380d
title: feat(ui): implementar financial cockpit fiel para juros e amortizacao
```

### Main atual

```text
=== STATUS LOCAL ===
## main...origin/main
=== BRANCH ATUAL ===
main
=== HEAD LOCAL ===
e4cd127
=== ORIGIN/MAIN ===
e4cd127
=== PROVA HEAD = ORIGIN/MAIN ===
OK: HEAD local = origin/main
```

### Pipeline oficial

```text
edu_lint: 11 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
backend: 138 passed
frontend: Test Files 26 passed (26)
frontend: Tests 187 passed (187)
frontend.build: OK
=== PIPELINE VERDE ===
```

### Runtime local

```text
/              HTTP/1.1 200 OK
/juros         HTTP/1.1 200 OK
/amortizacao   HTTP/1.1 200 OK
/diagnostico   HTTP/1.1 200 OK
```

## 5. Decisoes documentadas

- DECISAO: aceitar PR #20 / `e4cd127` como materializacao real da Sprint
  3.5/F2.
- DECISAO: PR #19 nao deve ser usado como referencia de fechamento da F2.
- DECISAO: qualquer proxima fatia da Sprint 3.5 deve partir da verdade
  operacional `main = origin/main = e4cd127`, salvo nova decisao do PO.

## 6. Pendencias e residuos

- Pendencia nao bloqueante: warning conhecido de Recharts/jsdom sobre dimensoes
  zero em ambiente de teste permanece como residuo tecnico de teste, sem falha
  de gate.
- Pendencia documental reconciliada nesta F2.1: documentacao anterior da F2
  continha ruido operacional de chat/PR e agora registra explicitamente que o
  PR #20 e a materializacao real.

## 7. Proxima etapa

Sprint 3.5/F3 so deve ser iniciada apos auditoria e aprovacao desta
reconciliacao documental pelo Camaleao/Moises.
