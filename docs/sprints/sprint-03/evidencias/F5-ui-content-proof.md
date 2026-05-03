# F5 — Prova de conteúdo visível na UI

Data: 2026-05-03

## Arquivos de UI envolvidos

- `frontend/src/app/(app)/amortizacao/page.tsx`
- `frontend/src/components/amortization/AmortizacaoSaibaMais.tsx`

## Seções visíveis adicionadas

- `data-testid="amortizacao-aprenda-mais"`
- `data-testid="amortizacao-glossario"`
- `data-testid="amortizacao-cuidados"`

## Conteúdo exibido na página

- Seção "Entenda a amortização".
- Explicação de PRICE como parcela constante.
- Explicação de SAC como amortização constante.
- Comparação PRICE x SAC.
- Glossário da amortização.
- Cuidados educacionais.
- Disclaimer educacional em cada painel.

## Teste direcionado de página

```bash
cd frontend
pnpm test -- --run src/__tests__/app/amortizacao.test.tsx
```

Saída relevante:

```text
✓ src/__tests__/app/amortizacao.test.tsx  (8 tests) 703ms

Test Files  1 passed (1)
Tests  8 passed (8)
```

Observação real do teste:

```text
stderr | src/__tests__/app/amortizacao.test.tsx > AmortizacaoPage > ...
The width(0) and height(0) of chart should be greater than 0
```

Interpretação: o aviso vem do Recharts em ambiente jsdom sem dimensões
reais de layout. O teste passou e o aviso já aparecia nos fluxos de
gráfico; não indica falha funcional da F5.

## Interpretação

A F5 não apenas criou arquivos de conteúdo. O conteúdo foi renderizado
na página `/amortizacao` e os testes provam presença real no DOM.
