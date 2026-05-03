# Sprint 3/F4 - Validacao UI/UX

## Objetivo

Comprovar que `/amortizacao` deixou de usar o placeholder `ModulePage` e passou a expor uma experiencia funcional para PRICE, SAC e comparacao.

## Implementacao validada

- Pagina real: `frontend/src/app/(app)/amortizacao/page.tsx`.
- Tabs WAI-ARIA: `PRICE`, `SAC`, `Comparar`.
- Formulario real com campos:
  - `principal`;
  - `taxa_periodo`;
  - `n_periodos`.
- Validacao local:
  - principal obrigatorio e maior que zero;
  - taxa obrigatoria e maior ou igual a zero;
  - prazo obrigatorio, inteiro e entre 1 e 1200.
- Estados visiveis:
  - idle;
  - loading;
  - erro;
  - sucesso.
- Resultado visivel:
  - resumo financeiro;
  - tabela de amortizacao;
  - grafico de saldo devedor;
  - interpretacao pedagogica;
  - alertas.

## Teste especifico da pagina

```bash
cd frontend
pnpm test -- --run src/__tests__/app/amortizacao.test.tsx
```

Saida relevante:

```text
Test Files  1 passed (1)
Tests  7 passed (7)
```

## Build da rota

```bash
cd frontend
pnpm build
```

Saida relevante:

```text
✓ Compiled successfully
✓ Generating static pages (16/16)
/amortizacao                         5.29 kB         224 kB
```

## Resultado

`/amortizacao` nao contem mais texto de placeholder como "Modulo em construcao" e foi marcada como `disponivel` em `frontend/src/config/modules.ts`.
