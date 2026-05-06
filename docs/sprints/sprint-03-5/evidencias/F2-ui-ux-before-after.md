# F2 - UI/UX before after

## Antes

A aplicacao funcionava, mas a experiencia visual ainda parecia documental:

- rolagem vertical excessiva;
- sidebar antiga consumindo largura util;
- cards empilhados;
- formulario, resultado, grafico, tabela e educacao competindo no mesmo fluxo;
- botoes "Abrir" usados como paliativo de arquitetura de informacao;
- graficos e tabelas sem protagonismo visual;
- modulos em breve pouco integrados ao shell.

## Depois

A F2 recriou o cockpit financeiro como layout de produto:

- topbar global com modulos horizontais;
- subtabs por modulo;
- cockpit sem sidebar;
- painel esquerdo fixo para entradas;
- KPIs no topo da area central;
- palco central grande para grafico/tabela;
- painel direito educacional com tabs;
- faixa inferior de insight;
- modais educacionais com tabs obrigatorias;
- empty states premium para modulos em breve;
- tela inicial de Juros e Amortizacao com valores padrao e resultado carregado
  pelos services.

## Preservacao funcional

Nao houve alteracao em backend, API, OpenAPI, dominio financeiro, pipeline,
workflows, Prompt-Mestre, planilha, baseline ou `docs/_meta/living_docs.json`.
Os calculos continuam vindo dos services/API existentes.
