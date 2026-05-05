# F2 - Prova do roteiro de navegacao

## Roteiro coberto

### Juros

- Abrir `/juros`.
- Conferir topbar global e subtabs.
- Conferir Juros Simples com valores padrao e resultado inicial.
- Alternar para Juros Compostos.
- Alternar para Comparar.
- Abrir modal "Aprofundar leitura".
- Navegar por Juros Simples, Juros Compostos, Comparacao, Aportes e Cuidados.

### Amortizacao

- Abrir `/amortizacao`.
- Conferir topbar global e subtabs.
- Conferir PRICE com valores padrao e resultado inicial.
- Alternar para SAC.
- Alternar para Comparar.
- Abrir modal "Entender a tabela".
- Navegar por O que a tabela mostra, PRICE, SAC, PRICE x SAC, Glossario e
  Cuidados.

### Modulos em breve

- Abrir Imovel.
- Abrir Consignado.
- Abrir CDC.
- Abrir Cartao.
- Abrir Investir x Quitar.
- Confirmar empty state elegante, sem funcionalidade falsa.

## Evidencias materiais

O roteiro foi coberto por testes automatizados e screenshots versionados em
viewport desktop. Os resultados financeiros foram obtidos via services/API, sem
reimplementacao de matematica financeira no frontend.
