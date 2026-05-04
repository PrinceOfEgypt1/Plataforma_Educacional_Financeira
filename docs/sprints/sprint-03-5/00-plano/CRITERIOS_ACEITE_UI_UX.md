# Sprint 3.5 - Criterios de aceite UI/UX

Data: 2026-05-03
Base: `4a9d30e`

## 1. Checklist de qualidade visual

- [ ] A home comunica claramente quais modulos estao disponiveis e quais estao
  em construcao.
- [ ] A primeira dobra parece produto real, nao scaffold tecnico.
- [ ] Hierarquia visual separa titulo, contexto, entrada, resultado-chave,
  detalhes e educacao.
- [ ] Cards nao competem todos com o mesmo peso.
- [ ] Tabelas tem tratamento legivel, densidade controlada e cabecalho claro.
- [ ] Graficos usam tokens e possuem contexto textual suficiente.
- [ ] Espacamentos seguem escala consistente.
- [ ] Radius, sombras e bordas tem padrao unico.
- [ ] A interface nao depende de uma paleta improvisada de slate/blue.
- [ ] Textos em PT-BR tem acentos, unidades e tom profissional.

## 2. Checklist de usabilidade

- [ ] Usuario entende rapidamente onde esta.
- [ ] Usuario entende o que cada modulo faz.
- [ ] Usuario identifica a acao principal sem competir com acoes secundarias.
- [ ] Formularios agrupam campos de forma logica.
- [ ] Labels permanecem sempre visiveis.
- [ ] Ajuda de campo explica unidade, periodo e exemplo.
- [ ] Erros aparecem perto do campo afetado.
- [ ] Resultado-chave aparece antes dos detalhes longos.
- [ ] Comparacoes explicam o trade-off financeiro, nao apenas a diferenca
  numerica.
- [ ] Placeholders indicam roadmap sem parecer tela abandonada.

## 3. Checklist de responsividade

- [ ] Mobile 375px tem navegacao global utilizavel.
- [ ] Tablet 768px nao perde hierarquia nem esconde acoes essenciais.
- [ ] Desktop 1280px usa largura confortavel sem linhas longas demais.
- [ ] Wide 1920px nao deixa conteudo excessivamente espalhado.
- [ ] Tabelas longas nao quebram layout.
- [ ] Graficos mantem altura, legenda e eixos legiveis.
- [ ] Formularios permanecem utilizaveis em coluna unica.
- [ ] Botoes e tabs nao quebram texto nem criam overflow incoerente.
- [ ] Aviso educacional persistente nao bloqueia uso em mobile.

## 4. Checklist de acessibilidade

- [ ] `lang="pt-BR"` permanece no HTML.
- [ ] Landmarks principais permanecem: banner, navigation, main, contentinfo e
  complementary quando aplicavel.
- [ ] Navegacao por teclado nao degrada.
- [ ] Foco visivel e consistente em links, tabs, inputs e botoes.
- [ ] Tabs seguem `tablist`, `tab`, `tabpanel`, `aria-selected`,
  `aria-controls` e teclado.
- [ ] Inputs tem `label`, `aria-describedby` e `aria-invalid` quando aplicavel.
- [ ] Estados loading usam `role="status"` e erro usa `role="alert"`.
- [ ] Cores nao sao unico canal de status financeiro.
- [ ] Contraste de texto normal atende WCAG AA.
- [ ] Graficos possuem descricao textual ou interpretacao proxima.

## 5. Checklist de consistencia de componentes

- [ ] Existe uma unica familia de primitivas de formulario ou justificativa
  explicita para variacoes.
- [ ] `SummaryCard`, `AlertBanner`, `EducationPanel`, `FormSection` e estados
  compartilham escala visual.
- [ ] `tokens.ts`, `tokens.css` e Tailwind nao divergem.
- [ ] Cores hardcoded fora de tokens sao eliminadas ou justificadas.
- [ ] Modulos prontos e placeholders usam o mesmo shell, mas com estados
  visuais distintos.
- [ ] Copy de juros e amortizacao segue o mesmo padrao de unidade, periodo,
  dinheiro e taxa.
- [ ] Resultados financeiros usam formatacao monetaria e percentual padronizada.

## 6. Checklist de preservacao funcional

- [ ] Nenhuma mudanca de UI reimplementa juros, PRICE ou SAC no frontend.
- [ ] Frontend continua apenas validando entrada, chamando API e exibindo
  payload.
- [ ] Services de juros e amortizacao preservam contratos.
- [ ] Schemas e OpenAPI nao sao alterados pela Sprint 3.5 sem prompt formal.
- [ ] Backend e dominio puro nao sao alterados.
- [ ] Testes existentes de juros e amortizacao continuam verdes.
- [ ] Valores financeiros exibidos continuam derivados do backend.
- [ ] Mudancas visuais nao alteram regra de arredondamento ou fechamento em
  centavos.

## 7. Criterios para rejeitar entrega visual fraca

Uma fatia da Sprint 3.5 deve ser rejeitada se:

- Apenas trocar cores sem resolver hierarquia, densidade e navegacao.
- Melhorar desktop e piorar mobile.
- Criar componente bonito que nao respeita tokens ou acessibilidade.
- Esconder problemas de tabela/grafico atras de overflow sem orientacao.
- Manter home dizendo que tudo esta em construcao.
- Manter pagina real com aparencia de scaffold.
- Introduzir calculo financeiro no frontend.
- Alterar contrato/API para acomodar UI.
- Declarar screenshot, a11y ou inspeccao visual sem evidencia real.
- Nao rodar gates minimos ou mascarar falha ambiental.

## 8. Criterios para considerar a Sprint 3.5 concluida

A Sprint 3.5 deve ser considerada concluida quando:

- Home, shell e navegacao global comunicam produto real.
- `/juros` e `/amortizacao` parecem modulos do mesmo produto.
- Mobile tem navegacao global e fluxo utilizavel.
- Cards, formularios, tabelas, graficos, alertas e estados tem padrao visual
  coerente.
- Conteudo educacional aparece no momento certo da jornada.
- Docs vivos e inventario de telas foram atualizados na fatia de fechamento.
- Gates minimos passaram.
- Evidencias de desktop/tablet/mobile e acessibilidade basica foram registradas
  quando o ambiente permitir.
- Nenhuma regressao funcional foi introduzida em juros ou PRICE/SAC.
