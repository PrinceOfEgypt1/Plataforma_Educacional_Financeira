# Sprint 3.5/F2 — Testes da correção final consolidada

## Testes criados/ajustados

- `frontend/src/__tests__/app/juros.test.tsx`
- `frontend/src/__tests__/app/amortizacao.test.tsx`
- `frontend/src/__tests__/app/cockpitGovernance.test.ts`
- `frontend/src/__tests__/components/cockpitDynamicData.test.tsx`

## Cobertura adicionada

- taxa com vírgula e ponto em Juros Simples, Juros Compostos e Comparar Juros;
- taxa com vírgula e ponto em PRICE, SAC e Comparar Amortização;
- ausência de `type="number"` nos campos reais de taxa do cockpit;
- presença de `noValidate` nos formulários do cockpit;
- normalização interna de vírgula para ponto antes de chamar services/API;
- tabelas de juros com 24 linhas;
- tabelas PRICE/SAC/comparação com 60 linhas;
- gráficos de juros com 24 pontos;
- gráficos PRICE/SAC/comparação com 60 pontos;
- conteúdo educativo obrigatório dos painéis e modais;
- ausência de truncamento artificial de 12 períodos;
- preservação do shell sem sidebar renderizada.

## Execução

```text
pnpm lint
Resultado: OK — No ESLint warnings or errors

pnpm format:check
Resultado: OK — All matched files use Prettier code style

pnpm typecheck
Resultado: OK — tsc --noEmit

pnpm test -- --run
Resultado: OK — 26 arquivos / 187 testes

pnpm build
Resultado: OK — 16/16 páginas estáticas
```

Observação: os testes com Recharts em jsdom continuam emitindo warning conhecido de largura/altura zero. O warning não bloqueia os testes e já existia como resíduo ambiental de jsdom.
