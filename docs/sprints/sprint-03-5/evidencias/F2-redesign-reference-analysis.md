# F2 - Analise da referencia Financial Cockpit

Branch: `sprint-3.5/f2-financial-cockpit-fiel-codex`
Base: `main = origin/main = fc21560`

## Referencias lidas

- `redesign-financeiro.html`
- `prompt-plataforma-educacional-financeira.md`
- `redesign-financeiro (3).html`

O ZIP fornecido continha dois arquivos. A referencia anterior
`redesign-financeiro (3).html` e o roteiro de navegacao do prompt operacional
foram tratados como especificacao obrigatoria de aceite.

## Decisao de produto

A versao anterior da F2 foi reprovada porque ainda era uma interpretacao livre
do redesign. Nesta correcao, a regra passou a ser fidelidade ao cockpit da
Claude: topbar horizontal, subtabs, grid `280px 1fr 300px`, paleta escura
teal/amber, KPIs no topo, palco central amplo, painel direito contextual,
insight inferior e modais educacionais com overlay blur.

## Adaptacoes obrigatorias para o produto real

- O prototipo HTML calculava dados no frontend; a aplicacao real continua
  consumindo os services/API existentes.
- O prototipo usava graficos de HTML puro/Chart.js; a aplicacao usa Recharts ja
  presente no projeto.
- O prototipo era single-page; a aplicacao preserva rotas Next.js reais:
  `/`, `/juros`, `/amortizacao` e modulos em breve.
- Os modais foram implementados como componentes React acessiveis, com fechar
  por botao, `Esc` e clique no overlay.
- A tipografia foi aplicada com Syne e IBM Plex Mono via `next/font/google`.

## Regras preservadas

- Sem sidebar antiga.
- Sem scroll de pagina no desktop.
- Sem botao "Abrir" para grafico, tabela ou conteudo essencial.
- Graficos e tabelas em area central ampla.
- Empty states elegantes para modulos ainda nao implementados.
- Conteudo educacional preservado e reorganizado em painel/tabs/modais.
