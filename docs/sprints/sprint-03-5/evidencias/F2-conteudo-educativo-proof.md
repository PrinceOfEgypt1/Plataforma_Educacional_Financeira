# Sprint 3.5/F2 — Conteúdo educativo consolidado

## Escopo corrigido

A correção final consolidada alinhou o conteúdo educativo do cockpit ao arquivo de referência textual do Financial Cockpit, preservando a arquitetura real em React/Next e os dados vindos dos services/API.

## Juros

Painel direito:

- Juros Simples mantém abas `Conceito`, `Tabela` e `Cuidados`.
- Juros Compostos mantém abas `Conceito`, `Tabela` e `Cuidados`.
- Comparar Juros mantém aba `Análise`.
- As tabelas educacionais de Juros usam uma linha por período real retornado pelo service/API.
- Os botões de aprofundamento abrem o modal na aba correta.

Modal `Aprenda mais sobre juros`:

- Aba `Juros Simples`: definição, dois parágrafos explicativos, fórmula `M = P × (1 + i × n)`, termos, caso JS-01 e disclaimer.
- Aba `Juros Compostos`: definição, parágrafos explicativos, fórmula `M = P × (1 + i)ⁿ`, caso JC-01, parágrafo final e disclaimer.
- Aba `Comparação`: divergência para `n > 1`, exemplo de 12 meses, dívida vs investimento e disclaimer.
- Aba `Aportes`: aporte como dinheiro novo, distinção entre aporte e juro, composição do saldo final, caixa de efeito dos aportes e disclaimer.
- Aba `Cuidados`: quatro cuidados com severidades visuais e disclaimer.

## Amortização

Painel direito:

- PRICE mantém abas `Tabela`, `Glossário` e `Cuidados`.
- SAC mantém abas `Tabela` e `SAC × PRICE`.
- Comparar Amortização mantém abas `Análise`, `Tabela` e `Cuidados`.
- A tabela comparativa exibe `# | PMT Price | PMT SAC | Δ Parcela`, com uma linha por período real.
- A coluna delta usa âmbar quando SAC é maior que PRICE e verde quando PRICE passa a ser maior.

Modal `Entenda a amortização`:

- Aba `O que a tabela mostra`: três parágrafos, regra de fechamento da tabela, parágrafo final e disclaimer.
- Aba `PRICE`: parcela constante, composição interna, caso PR-01, parágrafo final e disclaimer.
- Aba `SAC`: amortização constante, parcela decrescente, caso SAC-01, parágrafo final e disclaimer.
- Aba `PRICE × SAC`: leitura lado a lado, fluxo vs custo, caso comparativo e disclaimer.
- Aba `Glossário`: grid com 10 cards: Principal, Taxa por período, Parcela, Juros do período, Amortização, Saldo devedor, Total pago, Total de juros, Saldo final e Número de períodos.
- Aba `Cuidados`: quatro cuidados educacionais e disclaimer.

## Prova por testes

Cobertura adicionada/ajustada em:

- `frontend/src/__tests__/app/juros.test.tsx`
- `frontend/src/__tests__/app/amortizacao.test.tsx`

Casos cobertos:

- presença de `Juros simples — em uma frase`;
- presença de `Juros sobre juros`;
- presença de `Quando divergem`;
- presença de `Aportes mensais — entrando dinheiro novo no caminho`;
- presença de `Tabela PRICE`;
- presença de `Tabela SAC`;
- presença de `PRICE × SAC — o essencial`;
- presença de `Glossário da amortização`;
- presença de `Cuidados educacionais`.

Resultado: `pnpm test -- --run` passou com 26 arquivos e 187 testes.
