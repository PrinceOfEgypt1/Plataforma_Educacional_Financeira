# F2 - Prova de ausencia de scroll de pagina

## Regra aplicada

O shell usa viewport controlado com `100dvh` e `overflow: hidden` na estrutura
principal. A janela nao deve depender de scroll vertical ou horizontal para uso
desktop.

CSS materializado:

- `html`, `body` e `.cockpit-body`: `overflow: hidden`;
- `.cockpit-shell`: `height: 100dvh`;
- `.cockpit-main`: grid com `grid-template-columns: 280px minmax(0, 1fr) 300px`;
- `.cockpit-stage`: `min-height: 0` para evitar vazamento vertical;
- scroll interno permitido apenas em `.table-scroll`, `.modal-body` e painel
  educacional quando necessario.

## Evidencia visual

Os screenshots versionados em `docs/sprints/sprint-03-5/evidencias/` foram
gerados em viewport desktop `1728x900`.

Arquivos principais:

- `F2-screenshot-juros-simples.png`
- `F2-screenshot-juros-compostos.png`
- `F2-screenshot-juros-comparar.png`
- `F2-screenshot-amortizacao-price.png`
- `F2-screenshot-amortizacao-sac.png`
- `F2-screenshot-amortizacao-comparar.png`

## Medicao automatizada

Com dev server em `localhost:3000`, Playwright mediu as rotas em viewport
`1728x900`:

```text
{"route":"/","viewport":"1728x900","scrollHeight":900,"clientHeight":900,"scrollWidth":1728,"clientWidth":1728,"bodyOverflow":"hidden","htmlOverflow":"hidden"}
{"route":"/juros","viewport":"1728x900","scrollHeight":900,"clientHeight":900,"scrollWidth":1728,"clientWidth":1728,"bodyOverflow":"hidden","htmlOverflow":"hidden"}
{"route":"/amortizacao","viewport":"1728x900","scrollHeight":900,"clientHeight":900,"scrollWidth":1728,"clientWidth":1728,"bodyOverflow":"hidden","htmlOverflow":"hidden"}
{"route":"/financiamento-imobiliario","viewport":"1728x900","scrollHeight":900,"clientHeight":900,"scrollWidth":1728,"clientWidth":1728,"bodyOverflow":"hidden","htmlOverflow":"hidden"}
{"route":"/consignado","viewport":"1728x900","scrollHeight":900,"clientHeight":900,"scrollWidth":1728,"clientWidth":1728,"bodyOverflow":"hidden","htmlOverflow":"hidden"}
{"route":"/cdc","viewport":"1728x900","scrollHeight":900,"clientHeight":900,"scrollWidth":1728,"clientWidth":1728,"bodyOverflow":"hidden","htmlOverflow":"hidden"}
{"route":"/cartao-rotativo","viewport":"1728x900","scrollHeight":900,"clientHeight":900,"scrollWidth":1728,"clientWidth":1728,"bodyOverflow":"hidden","htmlOverflow":"hidden"}
{"route":"/investir-vs-quitar","viewport":"1728x900","scrollHeight":900,"clientHeight":900,"scrollWidth":1728,"clientWidth":1728,"bodyOverflow":"hidden","htmlOverflow":"hidden"}
```

Resultado: em todas as rotas medidas, `scrollHeight = clientHeight`,
`scrollWidth = clientWidth`, `bodyOverflow = hidden` e `htmlOverflow = hidden`.

## Residuos honestos

O objetivo desta F2 e desktop sem scroll de pagina. Em viewports menores que os
breakpoints suportados, o layout pode exigir adaptacao futura de responsividade
na fatia dedicada, preservando a regra de nao depender de scroll de pagina para
desktop.
