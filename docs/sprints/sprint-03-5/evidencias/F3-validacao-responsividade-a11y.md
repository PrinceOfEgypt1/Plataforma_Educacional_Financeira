# Sprint 3.5/F3 - Validacao de Responsividade e Acessibilidade Basica

Data: 2026-05-06

## Responsividade

Tamanhos considerados:

- desktop: 1280px+;
- tablet: 768px;
- mobile: 375px.

## Resultado por camada

### Desktop

- FATO: o cockpit preserva viewport controlado com `height: 100dvh` e `overflow: hidden` em `html`, `body`, `cockpit-app` e `cockpit-main`.
- FATO: a composicao principal continua no padrao `280px 1fr 300px`, alinhada ao cockpit financeiro da F2.
- FATO: grafico e KPIs permanecem na area central ampla.

### Tablet

- FATO: a F3 adicionou media query `max-width: 1100px`.
- FATO: a grade passa a duas colunas e move o painel educacional para largura total.
- FATO: topbar e subtabs usam scroll horizontal interno quando necessario.

### Mobile

- FATO: a F3 adicionou media query `max-width: 767px`.
- FATO: a grade passa a uma coluna.
- FATO: a rolagem, quando inevitavel pelo volume de conteudo, fica dentro de `.cockpit-content-grid`, nao no `body`.
- LIMITACAO: em mobile pequeno, o cockpit financeiro ainda e uma experiencia densa por natureza. A F3 evita corte lateral e scroll de pagina, mas uma futura fatia mobile dedicada pode refinar ordem, densidade e altura dos paineis.

## Acessibilidade basica

- FATO: subtabs usam `role="tablist"` e `role="tab"` com `aria-selected`.
- FATO: modais usam `role="dialog"`, `aria-modal`, titulo acessivel, fechamento por botao, Escape e clique no overlay.
- FATO: botoes possuem texto compreensivel (`Calcular`, `Calcular PRICE`, `Calcular SAC`, `Comparar`, `Aprofundar leitura`, `Entender a tabela`).
- FATO: campos possuem `label` e `htmlFor`.
- FATO: campos de taxa usam `type="text"` e `inputMode="decimal"`, evitando validacao nativa indevida para virgula decimal brasileira.
- FATO: o conteudo nao depende somente de cor; labels, textos, badges e icones textuais acompanham os estados.

## Veredito

A responsividade basica foi validada estruturalmente e recebeu ajuste fino em F3. A acessibilidade basica esta adequada para fechamento da Sprint 3.5, com residuo nao bloqueante de refinamento mobile dedicado em sprint futura.
