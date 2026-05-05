# F2 - Prova visual do layout

## Composicao entregue

O cockpit final replica a arquitetura visual do HTML da Claude:

```text
Topbar PEF / Lab + modulos + Produto educacional
Subtabs do modulo atual
Painel esquerdo 280px | Centro 1fr | Painel direito 300px
KPIs no topo do centro
Grafico/tabela em palco amplo
Insight inferior
```

## Elementos obrigatorios

- Paleta: `#182138`, `#1e2a46`, `#223253`, `#00d4c8`, `#f59e0b`,
  `#10b981`, `#f43f5e`, `#e2eaf5`.
- Tipografia: Syne para interface; IBM Plex Mono para numeros, KPIs, tabelas,
  formulas e exemplos.
- Modais: overlay com blur, caixa central `min(760px, 90vw)`, `max-height:
  82vh`, tabs internas e fechamento por botao, overlay e `Esc`.
- Graficos: Recharts com tooltip rico e area central ampla.
- Tabelas: linhas por periodo em area dedicada, sem `...`.
- Empty states: Imovel, Consignado, CDC, Cartao e Investir x Quitar.

## Screenshots obrigatorios

As capturas foram geradas como artefatos versionados para auditoria visual do
PO/Camaleao.

### Telas principais

- `F2-screenshot-juros-simples.png`
- `F2-screenshot-juros-compostos.png`
- `F2-screenshot-juros-comparar.png`
- `F2-screenshot-amortizacao-price.png`
- `F2-screenshot-amortizacao-sac.png`
- `F2-screenshot-amortizacao-comparar.png`

### Modais

- `F2-modal-juros-simples.png`
- `F2-modal-juros-compostos.png`
- `F2-modal-juros-comparacao.png`
- `F2-modal-juros-aportes.png`
- `F2-modal-juros-cuidados.png`
- `F2-modal-amortizacao-o-que-a-tabela-mostra.png`
- `F2-modal-amortizacao-price.png`
- `F2-modal-amortizacao-sac.png`
- `F2-modal-amortizacao-price-sac.png`
- `F2-modal-amortizacao-glossario.png`
- `F2-modal-amortizacao-cuidados.png`

### Modulos em breve

- `F2-screenshot-em-breve-imovel.png`
- `F2-screenshot-em-breve-consignado.png`
- `F2-screenshot-em-breve-cdc.png`
- `F2-screenshot-em-breve-cartao.png`
- `F2-screenshot-em-breve-investir-quitar.png`
