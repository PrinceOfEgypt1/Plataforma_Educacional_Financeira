# Sprint 3.5/F2 — Prova de taxa decimal pt-BR

## Problema corrigido

Antes da correção final, os campos de taxa do cockpit usavam `type="number"`, o que ativava validação nativa do navegador e podia bloquear valores válidos em pt-BR, como `1,50`.

## Correção aplicada

Arquivos corrigidos:

- `frontend/src/components/interest/InterestCockpit.tsx`
- `frontend/src/components/amortization/AmortizationCockpit.tsx`
- `frontend/src/components/ui/cockpit/CockpitPrimitives.tsx`

Decisões:

- campos de taxa passaram a usar `type="text"`;
- `inputMode="decimal"` foi preservado no componente primitivo;
- formulários do cockpit passaram a usar `noValidate`;
- a normalização segue centralizada em `frontend/src/lib/money.ts`;
- o frontend continua enviando taxa como string decimal ASCII para os services/API.

## Valores mínimos testados

Os testes cobrem a normalização dos seguintes valores:

```text
1
1,5
1,50
1.5
1.50
0,8
0,80
0.8
0.80
22
2,0
2,00
2.0
2.00
10,75
10.75
```

## Campos cobertos

- Juros Simples;
- Juros Compostos;
- Comparar Juros;
- PRICE;
- SAC;
- Comparar Amortização.

## Grep obrigatório

```text
=== 11.1 CAMPOS NUMBER ===
frontend/src/__tests__/app/cockpitGovernance.test.ts:47:    expect(source).not.toMatch(/type="number"/);
```

Interpretação: não há `type="number"` em campos reais do cockpit. A única ocorrência é a asserção de governança que impede regressão.

## Testes de regressão

- `frontend/src/__tests__/app/juros.test.tsx`
- `frontend/src/__tests__/app/amortizacao.test.tsx`
- `frontend/src/__tests__/app/cockpitGovernance.test.ts`

Resultado: `pnpm test -- --run` passou com 26 arquivos e 187 testes.
