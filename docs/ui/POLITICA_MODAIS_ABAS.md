# POLITICA DE MODAIS, ABAS E NAVEGACAO CONTEXTUAL

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 4.5 / F2
**Status:** documento vivo
**Base:** F0, F1 e contrato oficial de UI Components

---

## 1. Resumo executivo

Esta politica define quando usar modal, quando usar abas e como organizar
navegacao contextual na Plataforma Educacional Financeira.

A decisao central e simples: modal nao e navegacao principal. O fluxo central
de simulacao deve permanecer visivel em abas, secoes ou paineis persistentes.
Modais continuam permitidos para conteudo educativo secundario, ajuda pontual,
detalhe auxiliar, confirmacao e exportacao.

---

## 2. Quando usar modal

Modal e permitido para:

- `Saiba Mais` e conteudo educativo secundario;
- glossario contextual;
- aviso educacional;
- detalhe auxiliar que nao precise ficar persistente;
- confirmacao de acao irreversivel;
- fluxo de exportacao;
- ajuda pontual de baixa frequencia.

O modal deve complementar o fluxo, nao substitui-lo.

---

## 3. Quando nao usar modal

Modal nao deve ser usado para:

- formulario principal de simulacao;
- resultado principal de calculo;
- tabela financeira principal;
- comparacao central entre cenarios;
- navegacao principal entre modos do modulo;
- conteudo que o usuario precise consultar continuamente enquanto preenche o
  formulario;
- qualquer passo obrigatorio para entender o resultado basico.

Se o usuario precisa alternar varias vezes entre modal e tela principal, o
conteudo provavelmente deve virar aba, painel ou secao persistente.

---

## 4. Quando usar abas

Abas devem ser usadas quando o usuario alterna entre partes importantes do
fluxo sem perder contexto.

Usos recomendados:

- `Juros simples` / `Juros compostos` / `Comparar`;
- `PRICE` / `SAC` / `Comparar`;
- `Simular` / `Comparar`;
- visoes de resultado relacionadas;
- paineis educativos dentro do cockpit, quando persistentes.

Tabs devem expor:

- `role="tablist"`;
- `role="tab"`;
- `aria-selected`;
- relacao com painel quando aplicavel;
- foco visivel;
- navegacao por teclado quando a implementacao for customizada.

---

## 5. Quando substituir modal por abas ou secoes

Substitua modal por aba/secao quando:

- o conteudo e parte central da decisao financeira;
- o conteudo contem resultado calculado;
- o conteudo precisa ficar lado a lado com formulario ou tabela;
- o usuario precisa comparar estados;
- o modal teria scroll interno extenso;
- o modal seria aberto repetidamente no fluxo normal.

Mantenha modal quando:

- o conteudo e opcional;
- o conteudo e explicativo;
- a tela principal ficaria poluida;
- o usuario nao precisa consultar o conteudo a cada interacao.

---

## 6. Politica para Saiba Mais e conteudo educativo secundario

`Saiba Mais` pode usar `CockpitModal` quando:

- o conteudo explica conceitos, limites, glossario ou aviso educacional;
- o formulario e o resultado continuam visiveis fora do modal;
- fechar o modal retorna o usuario ao mesmo contexto;
- o modal nao altera dados de simulacao;
- as abas internas organizam conteudo educativo, nao navegacao principal.

Casos atuais aprovados como padrao secundario:

- `DiagnosticoSaibaMais`;
- `FinanciamentoSaibaMais`;
- modais educativos de `InterestCockpit`;
- modais educativos de `AmortizationCockpit`.

---

## 7. Variantes de modal por finalidade

| Variante | Uso | Requisitos |
|---|---|---|
| Ajuda educativa | `Saiba Mais`, glossario, explicacao | Tabs internas opcionais; disclaimer educacional |
| Confirmacao | acao irreversivel ou sensivel | botoes claros, foco inicial seguro, cancelamento facil |
| Exportacao | gerar PDF/Excel ou compartilhar | estado de carregamento, erro e sucesso |
| Detalhe secundario | informacao auxiliar | nao deve conter resultado principal |

Nao existe tamanho unico obrigatorio. A variante deve definir largura e altura
por finalidade, respeitando viewport e conteudo.

---

## 8. Requisitos de acessibilidade de modais

Todo modal deve:

- usar `role="dialog"`;
- usar `aria-modal="true"`;
- usar `aria-labelledby`;
- fechar por `Escape`;
- fechar por acao explicita visivel;
- evitar fechamento acidental em acao destrutiva;
- controlar foco dentro do modal quando implementado;
- devolver foco ao elemento acionador quando fechado;
- nao depender apenas de cor;
- ter titulo perceptivel.

`CockpitModal` ja cobre parte desses requisitos. A F3 deve avaliar foco
contido e retorno de foco como melhoria obrigatoria antes de novos usos
criticos.

---

## 9. Requisitos de acessibilidade de tabs

Tabs devem:

- expor `role="tablist"`;
- expor `role="tab"`;
- marcar aba ativa com `aria-selected`;
- associar painel com `aria-controls`/`aria-labelledby` quando houver
  `tabpanel`;
- permitir foco visivel;
- suportar teclado (`ArrowLeft`, `ArrowRight`, `Home`, `End`) quando a tablist
  seguir padrao APG completo;
- nao usar apenas cor para indicar selecao.

Quando o padrao for simplificado, a simplificacao deve ser documentada e
testada.

---

## 10. Comportamento responsivo

### Modais

- Devem caber em `90vw` ou equivalente.
- Devem limitar altura e permitir scroll vertical interno no corpo.
- Header e botao de fechar devem permanecer acessiveis.
- Conteudo longo deve ser dividido em tabs ou secoes.
- Em mobile, evitar modais que parecam uma segunda pagina principal.

### Abas

- Podem usar rolagem horizontal controlada quando forem navegacao contextual.
- Devem preservar foco visivel e item ativo.
- Labels devem permanecer compreensiveis.
- Em mobile, tabs numerosas podem virar dropdown/segmented control se aprovado
  em F3/F4.

Rolagem horizontal em tabs e aceitavel; rolagem horizontal em tabela financeira
como experiencia principal nao e aceitavel.

---

## 11. Checklist de conformidade

- [ ] Modal nao contem fluxo principal.
- [ ] Modal possui titulo, `role=dialog`, `aria-modal` e fechamento por Escape.
- [ ] Fechar modal preserva contexto do usuario.
- [ ] Conteudo central usa aba/secao/painel persistente.
- [ ] Tabs expõem `tablist`, `tab` e `aria-selected`.
- [ ] O estado ativo nao depende apenas de cor.
- [ ] Mobile foi considerado.
- [ ] `Saiba Mais` e claramente secundario.
- [ ] Exportacao/confirmacao possuem estados de erro/carregamento quando
      aplicavel.

---

## 12. Criterios de rejeicao automatica

Uma interface deve ser rejeitada se:

- usar modal como navegacao principal sem decisao formal;
- esconder resultado principal dentro de modal;
- usar modal para formulario principal;
- implementar tab sem semantica minima;
- criar modal sem Escape ou botao de fechar;
- perder contexto apos fechamento;
- quebrar acessibilidade de foco em fluxo critico;
- introduzir novo padrao de navegacao sem registrar no contrato.

---

*Fim do POLITICA_MODAIS_ABAS.md — Sprint 4.5/F2.*
