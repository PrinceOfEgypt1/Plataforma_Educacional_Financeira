# Evidências visuais — Sprint 1

**Status:** opcional nesta sprint (ver PLANO v1.1 §6.3 — Snapshots visuais
com Playwright ficam como pendência residual para Sprint 2).

---

## O que colocar aqui

Capturas de tela (PNG) opcionais das seguintes superfícies:

1. **Home** (`/`) — grid dos 12 módulos.
2. **12 rotas** (`/juros`, `/amortizacao`, `/financiamento-imobiliario`,
   `/financiamento-veiculo`, `/consignado`, `/cdc`, `/cartao-rotativo`,
   `/atraso`, `/indicadores`, `/investir-vs-quitar`, `/diagnostico`,
   `/educacao`) — cada uma renderizada no shell.
3. **3 estados reutilizáveis** (`LoadingState`, `ErrorState`, `EmptyState`)
   — idealmente capturadas via Storybook ou por uma página de demo
   (não materializada nesta sprint).

## Convenção de nome

`<slug>_<breakpoint>.png` onde:

- `<slug>` ∈ {`home`, `juros`, ..., `loading`, `error`, `empty`}
- `<breakpoint>` ∈ {`mobile-375`, `tablet-768`, `desktop-1280`}

Exemplo: `home_desktop-1280.png`.

## Aviso

Nenhuma evidência visual é obrigatória para a aprovação da Sprint 1; o
conteúdo das telas já é validado determinisricamente por Vitest +
@testing-library/react (61/61 verdes). Esta pasta existe para futuras
capturas opcionais e para servir como referência à Sprint 2 quando
Playwright for integrado.
