# CONTRATO OFICIAL DE UI COMPONENTS

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 4.5 / F2
**Status:** documento vivo
**Base:** F0 `PLANO_EXECUCAO_SPRINT_4_5.md` e F1
`INVENTARIO_UI_COMPONENTS_ATUAIS.md`

---

## 1. Resumo executivo

Este contrato define a linguagem oficial de UI Components da Plataforma
Educacional Financeira. Ele transforma o diagnostico da Sprint 4.5/F0 e o
inventario real da F1 em regras de uso para novas telas, refatoracoes futuras e
auditorias de interface.

A decisao central da F2 e adotar um contrato visual comum, sem implementar
codigo nesta fatia. A F3/F4 devem aplicar estas regras em componentes reais,
mantendo intactas regras financeiras, formulas, endpoints e contratos de API.

---

## 2. Escopo

Neste projeto, UI Component e qualquer elemento reutilizavel ou padrao de tela
que organize entrada, navegacao, resultado, alerta, explicacao, tabela, grafico,
modal, estado ou acao do usuario.

Entram no contrato:

- shell e layout de modulo;
- navegacao global e contextual;
- botoes, CTAs e tabs;
- formularios, campos e validacao visual;
- cards, KPIs, paineis e resumos;
- alertas e estados;
- tabelas financeiras;
- graficos;
- modais e conteudo educativo;
- componentes legados e candidatos a remocao.

Ficam fora deste contrato:

- regras financeiras e matematicas;
- contratos de API;
- schemas de backend;
- planilha operacional de backlog;
- conteudo editorial que nao altere estrutura visual.

---

## 3. Hierarquia oficial

| Camada | Papel | Componentes / padroes |
|---|---|---|
| Shell | Moldura global da aplicacao | `ShellLayout`, `FinancialCockpitShell` |
| Layout de modulo | Distribui entrada, centro analitico e contexto | `CockpitGrid`, `CockpitInputPanel`, `CenterPanel`, painel educativo |
| Primitivos | Elementos pequenos de uso recorrente | campos, botoes, tabs, labels, hints |
| Compostos | Blocos com comportamento e semantica propria | KPIs, cards, alertas, estados, modais |
| Dominio | Componentes especificos de modulo | `DiagnosticoSummary`, `FinanciamentoTable`, etc. |
| Legados | Componentes mantidos ate decisao formal | `Header`, `Sidebar`, `NavItem`, panels antigos |

Novos componentes devem nascer na camada correta. Criar componente fora desta
hierarquia exige justificativa registrada na PR e, quando estrutural, ADR ou
documento vivo correspondente.

---

## 4. Componentes oficiais por categoria

### 4.1 Shell e navegacao

| Componente | Status oficial | Regra |
|---|---|---|
| `FinancialCockpitShell` | shell ativa oficial | Deve ser a referencia visual da plataforma enquanto a Sprint 4.5 estiver vigente |
| `ShellLayout` | adapter oficial | Deve continuar delegando para a shell ativa |
| `ModulePage` | placeholder oficial | Permitido para modulos `em-construcao`, sem funcionalidade falsa |
| `Header`, `Sidebar`, `NavItem` | legado / candidato a remocao | Nao usar em novas telas sem decisao F2/F3 explicita |
| `visibleInCockpit` + `getCockpitVisibleModules` | regra oficial F3 | A topbar do cockpit deve derivar da configuracao de modulos, nao de array local na shell |

### 4.2 Botoes, CTAs e tabs

| Componente | Uso permitido | Observacao |
|---|---|---|
| `CockpitButton` | acao primaria de formulario cockpit | F3 adicionou `aria-busy`, `aria-label` opcional e `busyLabel` retrocompativel |
| `CockpitActionButton` | CTAs e tabs especificas quando justificado | Nao deve competir com `CockpitSubTabs` sem regra clara |
| `CockpitSubTabs` | alternancia principal entre modos do cockpit | Padrao recomendado para tabs de primeiro nivel em modulos cockpit |
| `MoreButton` | abrir explicacao secundaria | Deve abrir modal/ajuda sem substituir fluxo principal |

### 4.3 Formularios e campos

| Componente | Uso permitido | Regra |
|---|---|---|
| `CockpitInputPanel` | container de entrada em cockpit | Deve agrupar o formulario do modulo |
| `CockpitField` | campo simples de texto/numerico | F3 adicionou `error`, `aria-invalid`, `aria-describedby` e `ariaDescribedBy` opcionais |
| `CockpitSlider` | parametro numerico em faixa controlada | Deve exibir unidade e limite claro |
| `FormSection` | agrupamento semantico fora do cockpit | Permitido para telas que nao usem o grid cockpit |

### 4.4 Cards, KPIs, paineis e resumos

| Componente | Uso permitido | Regra |
|---|---|---|
| `KpiStrip` / `KpiItem` | KPIs dentro do cockpit | Deve priorizar numeros principais e comparacoes |
| `CenterPanel` | area central de resultado | Deve conter KPIs, grafico/tabela e insight contextual |
| `SummaryCard` | cards reutilizaveis fora ou dentro de grids | Deve usar tokens para tendencias financeiras |
| Resumos de dominio | resumo especifico de modulo | Permitido quando obedecer tokens, hierarquia e acessibilidade |

### 4.5 Alertas e estados

| Componente | Status oficial | Regra |
|---|---|---|
| `AlertBanner` | alerta base oficial | Deve mapear severidade para semantica visual e ARIA |
| `LoadingState` | estado base oficial | Deve representar carregamento global de uma superficie |
| `ErrorState` | estado base oficial | Deve representar erro estrutural ou recuperavel |
| `EmptyState` | estado base oficial | Deve representar ausencia de dados ou modulo indisponivel |
| `cockpit-insight-bar` | insight contextual | Pode complementar, mas nao substitui estado global quando exigido |

### 4.6 Tabelas financeiras

Tabelas financeiras seguem `docs/ui/POLITICA_TABELAS_FINANCEIRAS.md`.

A decisao oficial da F2 e abordagem hibrida:

- contrato visual comum obrigatorio;
- wrapper/base comum ou componente base a decidir/implementar em F3/F4;
- componentes por dominio permitidos quando a semantica financeira exigir;
- proibicao de `overflow-x-auto` como experiencia principal;
- proibicao de corte artificial de linhas.

### 4.7 Graficos

Graficos devem:

- usar series e legendas legiveis;
- ter alternativa textual no painel ou no resumo;
- usar tokens para cores novas;
- evitar hex/rgba novos fora da camada de tokens;
- manter proporcao responsiva.

### 4.8 Modais, abas e paineis educativos

Modais e abas seguem `docs/ui/POLITICA_MODAIS_ABAS.md`.

`CockpitModal` permanece permitido para conteudo educativo secundario,
`Saiba Mais`, detalhe auxiliar, confirmacao e exportacao. Modal nao deve ser
navegacao principal do modulo.

### 4.9 Conteudo educativo

| Componente | Status | Regra |
|---|---|---|
| `EducationPanel` de `ui/EducationPanel.tsx` | painel educativo base | Manter para conteudo complementar fora do cockpit |
| `CockpitEducationPanel` de `CockpitPrimitives.tsx` | painel educativo cockpit oficial | Nome F3 elimina conflito com `EducationPanel` base |
| `DiagnosticoSaibaMais` / `FinanciamentoSaibaMais` | modais educativos validos | Podem permanecer como conteudo secundario |

---

## 5. Tokens e proibicao de hardcodes novos

Fontes canonicas:

- `frontend/src/styles/tokens.ts`
- `frontend/src/styles/tokens.css`

Regras:

- cores, espacamentos, raios, sombras e tipografia novos devem vir de tokens;
- novas cores hardcoded em TSX/CSS sao proibidas sem justificativa formal;
- variaveis cockpit em `globals.css` sao camada temporaria controlada;
- F3/F4 devem mapear variaveis cockpit ao design system ou documentar excecoes;
- Tailwind direto pode existir apenas quando seguir tokens/classes autorizadas
  pelo contrato.

---

## 6. Politica de componentes legados

Componentes legados nao devem ser removidos nesta F2.

| Item | Classificacao F2 | Acao futura |
|---|---|---|
| `Header`, `Sidebar`, `NavItem` | legado / candidato a remocao | F3 decide remocao ou preservacao documentada |
| `JurosTabs`, panels/forms antigos de juros | legado provavel | F3 decide se remove ou reaproveita |
| `AmortizacaoTabs`, panels/forms antigos de amortizacao | legado provavel | F3 decide se remove ou reaproveita |
| `EducationPanel` duplicado | resolvido na F3 | Cockpit usa `CockpitEducationPanel`; base permanece `EducationPanel` |
| `VISIBLE_MODULE_IDS` | resolvido na F3 | Substituido por `visibleInCockpit` e `getCockpitVisibleModules` |

Enquanto nao houver decisao:

- nao usar legados em novas telas;
- nao criar novos imports ambiguos;
- nao duplicar comportamento ja coberto por componente oficial.

---

## 7. Decisoes derivadas para F3/F4

| Decisao | Fatia sugerida | Resultado esperado |
|---|---|---|
| Resolver `EducationPanel` duplicado | F3 | `CockpitEducationPanel` ou namespace equivalente |
| Resolver `VISIBLE_MODULE_IDS` | F3 | navegacao derivada de `MODULES.status` ou visibilidade explicita |
| Implementar contrato de tabelas | F3/F4 | remover scroll horizontal como experiencia principal |
| Padronizar estados | F3/F4 | `LoadingState`, `ErrorState`, `EmptyState` usados quando aplicavel |
| Mapear tokens cockpit | F3/F4 | reduzir hardcodes e drift visual |
| Decidir componentes legados | F3 | remover ou manter com justificativa |

---

## 7.1 Materializacao F3 — componentes-base

A Sprint 4.5/F3 concretizou as correcoes estruturais autorizadas por este
contrato sem alterar backend, API, regra financeira ou tabelas financeiras.

Decisoes materializadas:

- `EducationPanel` base permanece em `frontend/src/components/ui/EducationPanel.tsx`;
- o painel educativo do cockpit foi renomeado para `CockpitEducationPanel`;
- `FinancialCockpitShell` deixou de conter `VISIBLE_MODULE_IDS`;
- a visibilidade da topbar agora e declarada em `MODULES.visibleInCockpit`;
- a funcao `getCockpitVisibleModules` centraliza a regra de navegacao do
  cockpit;
- `CockpitButton` passou a expor estado ocupado por `aria-busy`;
- `CockpitField` passou a aceitar erro acessivel via `aria-invalid` e
  `aria-describedby`.

A lista visivel preservada na F3 foi:

- `diagnostico`;
- `juros`;
- `amortizacao`;
- `financiamento-imobiliario`;
- `consignado`;
- `cdc`;
- `cartao-rotativo`;
- `investir-vs-quitar`.

Nao houve decisao F3 para remover `Header`, `Sidebar`, `NavItem`, componentes
legados de juros/amortizacao ou para aplicar a politica de tabelas financeiras.
Esses pontos permanecem como pendencia consciente para F4/F5 ou decisao futura.

---

## 7.2 Materializacao F4 — tabelas financeiras

A Sprint 4.5/F4 aplicou a politica de tabelas financeiras sem criar um
`FinancialTable` monolitico. A abordagem continua hibrida:

- tabelas cockpit mantem componentes especificos em `CockpitTables`;
- financiamento imobiliario mantem `FinanciamentoTable` por dominio;
- comparativo PRICE x SAC usa cards responsivos quando a representacao tabular
  larga prejudica o mobile;
- classes e semantica comuns foram padronizadas por contrato: caption, scope,
  valores tabulares, cabecalho fixo e rolagem vertical para series longas.

Padroes oficiais concretizados:

- `FinanciamentoTable` usa tabela desktop e cards mobile equivalentes;
- `FinanciamentoCompareSummary` usa `dl` responsivo para comparacao PRICE x SAC;
- `.cockpit-table-wrap` e wrapper vertical para tabelas financeiras do cockpit;
- tabelas financeiras tocadas na F4 renderizam todas as linhas recebidas.

---

## 8. Checklist de conformidade para novas telas

- [ ] Usa `FinancialCockpitShell` via `ShellLayout`.
- [ ] Usa componente oficial da categoria correta.
- [ ] Nao cria tabela financeira sem seguir a politica de tabelas.
- [ ] Nao usa modal como navegacao principal.
- [ ] Usa tokens ou CSS vars oficiais para valores visuais novos.
- [ ] Trata `idle`, `loading`, `error`, `empty` e `success` quando aplicavel.
- [ ] Inclui labels, `aria-*`, foco visivel e semantica HTML adequada.
- [ ] Funciona em desktop, tablet e mobile sem ocultar informacao essencial.
- [ ] Nao importa componente legado sem justificativa.
- [ ] Nao introduz regra financeira, API ou schema por decisao de UI.

---

## 9. Criterios de rejeicao automatica

Uma nova interface deve ser rejeitada se:

- criar componente visual fora da hierarquia sem justificativa;
- usar `overflow-x-auto` como solucao principal de tabela financeira;
- cortar linhas financeiras com `.slice`, limite fixo ou paginacao falsa;
- esconder dados financeiros essenciais sem alternativa equivalente;
- usar modal para fluxo principal de simulacao;
- adicionar hardcodes visuais novos sem token ou excecao formal;
- duplicar componente oficial existente;
- depender apenas de cor para comunicar estado;
- quebrar o aviso de produto educacional;
- alterar regra financeira, API ou backend em uma fatia de UI.

---

## 10. Relacao com outros documentos

- Politica de tabelas: `docs/ui/POLITICA_TABELAS_FINANCEIRAS.md`
- Politica de modais e abas: `docs/ui/POLITICA_MODAIS_ABAS.md`
- Inventario F1: `docs/sprints/sprint-04-5/00-plano/INVENTARIO_UI_COMPONENTS_ATUAIS.md`
- Design System: `docs/16_Design_System.md`
- UX/UI: `docs/07_UX_UI_e_Navegacao.md`

---

*Fim do CONTRATO_UI_COMPONENTS.md — Sprint 4.5/F2.*
