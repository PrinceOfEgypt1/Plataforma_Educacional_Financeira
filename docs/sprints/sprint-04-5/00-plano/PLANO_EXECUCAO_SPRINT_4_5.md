# PLANO DE EXECUÇÃO — SPRINT 4.5
## Padronização de UI Components e Governança Visual

**Projeto:** Plataforma Educacional Financeira (PEF)
**Sprint:** 4.5 — F0 — Planejamento Auditável
**Data:** 2026-05-09
**Branch de entrega:** `claude/sprint-4-5-f0-plano-ui-components`
**Responsável pelo plano:** Claude Code (sandbox VM)
**Status:** RASCUNHO — aguardando aprovação de Moisés e auditoria do Camaleão

---

## 1. RESUMO EXECUTIVO

A Sprint 4.5 é uma sprint intermediária de governança visual entre a Sprint 4
(concluída, PR #31 mergeado) e a Sprint 5 (não iniciada).

O projeto acumulou quatro módulos ativos com padrões visuais parcialmente
divergentes: juros, amortização, diagnóstico e financiamento imobiliário. Cada
módulo foi entregue de forma incremental e funcional, mas sem um contrato
visual explícito e auditável. Antes de construir os próximos oito módulos sobre
essa base, é necessário:

1. Inventariar com exatidão os componentes e padrões existentes.
2. Identificar as divergências estruturais reais (comprovadas por leitura do
   código, não presumidas).
3. Definir contrato oficial de UI Components, políticas de tabelas financeiras,
   modais e abas.
4. Refatorar telas existentes de forma incremental, sem alterar regras
   financeiras.
5. Criar um auditor de interface em modo advisory para prevenir regressão
   visual futura.

**Decisão que este plano solicita:** aprovação formal para iniciar F1 após
leitura e concordância de Moisés e auditoria do Camaleão.

**O que NÃO foi feito nesta F0:** nenhuma implementação de código, nenhuma
alteração de regra financeira, nenhuma alteração da planilha de backlog,
nenhum PR aberto, nenhum merge, nenhuma alteração de main, nenhum início
de Sprint 5.

---

## 2. FASE 0 — ESTADO INICIAL COMPROVADO

Saída literal dos comandos de diagnóstico executados antes de qualquer trabalho:

```
===== IDENTIDADE DO AMBIENTE =====
root
vm
/home/user/Plataforma_Educacional_Financeira

===== RAIZ GIT =====
/home/user/Plataforma_Educacional_Financeira

===== REMOTES =====
origin  http://local_proxy@127.0.0.1:35749/git/PrinceOfEgypt1/Plataforma_Educacional_Financeira (fetch)
origin  http://local_proxy@127.0.0.1:35749/git/PrinceOfEgypt1/Plataforma_Educacional_Financeira (push)

===== BRANCH / STATUS =====
main
## main...origin/main

===== HEAD / ORIGIN MAIN =====
7cd90c2
7cd90c2
7cd90c2 feat(financing): evoluir financiamento imobiliário com comparação SAC x PRICE (#31)
e0f9da6 feat(financing): implementar financiamento imobiliário RF-FIN-001 (#30)
68dede4 feat(content): fechar Sprint 4 — conteúdo educacional do diagnóstico financeiro (#29)
f529d0b feat(ui): implementar cockpit do diagnóstico financeiro (#28)
c7f817d feat(api): expor diagnóstico financeiro

===== PROVA DE SINCRONIA COM GITHUB =====
OK: HEAD = origin/main

===== VERIFICAR SE O DIRETÓRIO DO MOISÉS EXISTE NESTE AMBIENTE =====
INFO: /home/moses/workspace/Plataforma_Educacional_Financeira não existe neste ambiente

===== VERIFICAR DIRETÓRIO DE SPRINTS =====
drwxr-xr-x  sprint-00
drwxr-xr-x  sprint-01
drwxr-xr-x  sprint-02
drwxr-xr-x  sprint-03
drwxr-xr-x  sprint-03-5
drwxr-xr-x  sprint-04
```

**Branch de trabalho criada:**
```
git checkout -B claude/sprint-4-5-f0-plano-ui-components origin/main
→ Switched to a new branch 'claude/sprint-4-5-f0-plano-ui-components'
→ branch set up to track 'origin/main'
```

---

## 3. FATOS, INFERÊNCIAS E LIMITAÇÕES

### Fatos (comprovados por leitura direta do código)

- **Dois sistemas de componentes coexistem:**
  - Sistema `cockpit/` (CockpitPrimitives, CockpitModal, CockpitTables,
    CockpitCharts): usado pelo módulo de amortização, baseado em classes CSS
    custom (`cockpit-table-wrap`, `cockpit-table`, `cockpit-modal-overlay`, etc.)
  - Sistema Tailwind direto: usado pelos módulos de financiamento e diagnóstico,
    com classes utilitárias inline sem abstração de componente.

- **`overflow-x-auto` presente como solução principal em dois locais:**
  - `frontend/src/components/financing/FinanciamentoTable.tsx:26`
    → `className="overflow-x-auto overflow-y-auto max-h-[32rem] border ..."`
  - `frontend/src/components/financing/FinanciamentoCompareSummary.tsx:136`
    → `className="overflow-x-auto border border-gray-100 rounded"`

- **`overflow-auto` (bidirecional, risco de rolagem horizontal) em três locais:**
  - `frontend/src/components/interest/AmortizacaoTables.tsx:32` (simples)
    → `className="max-h-[480px] overflow-auto rounded border ..."`
  - `frontend/src/components/interest/AmortizacaoTables.tsx:92` (composta)
    → `className="max-h-[480px] overflow-auto rounded border ..."`
  - `frontend/src/components/amortization/AmortizacaoTable.tsx:19`
    → `className="max-h-[520px] overflow-auto rounded border ..."`

- **Nenhum uso de `.slice()` para corte de linhas** foi encontrado em componentes
  de produção — as tabelas renderizam todas as linhas (sem corte artificial).

- **Cabeçalho fixo (`sticky top-0`) presente** em `AmortizacaoTable` e
  `FinanciamentoTable`, mas ausente nas tabelas de `CockpitTables.tsx`.

- **`CockpitModal` é usado em `AmortizationCockpit`** para conteúdo educacional
  secundário ("Saiba Mais") — uso defensável como modal de suporte, não como
  navegação principal.

- **`FinanciamentoCockpit` usa abas implementadas via `CockpitActionButton`
  com `role="tab"`** — abas de primeiro nível funcionais, sem `CockpitModal`
  para o conteúdo principal.

- **`DiagnosticoCockpit` não usa modal** — conteúdo principal em seções diretas;
  `DiagnosticoSaibaMais` provavelmente abre modal (não inspecionado em detalhe,
  mas padrão `SaibaMais` nos outros módulos usa `CockpitModal`).

- **`FinancialCockpitShell` contém `VISIBLE_MODULE_IDS` hardcoded** — lista
  parcial de 8 de 12 módulos que filtra a topbar, duplicando lógica que
  deveria vir exclusivamente de `MODULES`.

- **Dois componentes `EducationPanel` coexistem com nomes conflitantes:**
  - `components/ui/EducationPanel.tsx` — componente genérico com `role="complementary"`
  - `EducationPanel` exportado de `CockpitPrimitives.tsx` — wrapper de abas
    educativas do cockpit; mesma export name, contextos diferentes.

- **Design tokens definidos em `styles/tokens.ts`** com export TypeScript e
  referenciados via CSS vars. Contrato anti-drift documentado no próprio arquivo.

- **Estados loading/error/empty:** `LoadingState`, `ErrorState` e `EmptyState`
  existem em `components/states/` com API uniforme e acessibilidade adequada.
  `FinanciamentoCockpit` e `DiagnosticoCockpit` implementam estados inline
  próprios (cockpit-insight-bar para idle/loading), sem usar esses componentes.

- **`Header.tsx` e `Sidebar.tsx`** existem em `components/shell/` mas não são
  usados pela shell ativa (`FinancialCockpitShell`). São componentes órfãos ou
  de uma iteração anterior.

- **`docs/ui/`** contém apenas `INVENTARIO_TELAS.md` e arquivos de sincronização.
  Não existe `CONTRATO_UI_COMPONENTS.md`, `POLITICA_TABELAS_FINANCEIRAS.md` ou
  `POLITICA_MODAIS_ABAS.md`.

### Inferências (não provadas, marcadas como hipótese)

- **Hipótese:** `DiagnosticoSaibaMais` e `FinanciamentoSaibaMais` provavelmente
  usam `CockpitModal` internamente (padrão consistente com `AmortizationCockpit`),
  mas não foi confirmado por leitura completa desses arquivos nesta F0.

- **Hipótese:** a classe `cockpit-table-wrap` em `CockpitTables.tsx` pode ter
  comportamento de `overflow-x-auto` definida no CSS global, o que precisaria
  ser verificado no arquivo de estilos.

- **Hipótese:** `Header.tsx` e `Sidebar.tsx` foram substituídos pela topbar
  do `FinancialCockpitShell` a partir da Sprint 3 ou 4, mas permaneceram no
  repositório sem remoção formal.

### Limitações operacionais desta F0

- Este ambiente (sandbox VM) não executa o servidor de desenvolvimento Next.js
  nem tem browser disponível — portanto, diagnóstico visual direto não é possível.
  Todo diagnóstico é baseado em leitura estática do código.
- O arquivo de estilos global (CSS/tokens.css) não foi lido integralmente nesta F0.
- Os arquivos `DiagnosticoSaibaMais.tsx` e `FinanciamentoSaibaMais.tsx` não foram
  lidos em sua totalidade — a inferência sobre uso de `CockpitModal` deve ser
  confirmada na F1.

---

## 4. JUSTIFICATIVA PARA CRIAÇÃO DA SPRINT 4.5 ANTES DA SPRINT 5

### Problema estrutural comprovado

O projeto entregou quatro módulos funcionais usando dois sistemas de componentes
paralelos sem unificação formal:

| Módulo | Sistema de componentes | Tabelas | Estados | Modais |
|---|---|---|---|---|
| Juros | cockpit/ (CSS classes) | CockpitTables | inline cockpit | CockpitModal |
| Amortização | cockpit/ (CSS classes) | AmortizacaoTable + CockpitTables | inline cockpit | CockpitModal |
| Diagnóstico | Tailwind direto | — (sem tabela) | inline cockpit | provavelmente CockpitModal |
| Financiamento | Tailwind direto | FinanciamentoTable | inline cockpit | FinanciamentoSaibaMais |

### Risco de regressão na Sprint 5

Se a Sprint 5 for iniciada sem contrato visual definido:

1. Os próximos 8 módulos serão construídos sobre padrões ambíguos.
2. Cada novo desenvolvedor ou sessão de Claude tomará decisão local diferente.
3. O `overflow-x-auto` continuará sendo usado como solução default para tabelas.
4. A duplicação de lógica (`VISIBLE_MODULE_IDS`, dois `EducationPanel`) se propagará.
5. Reverter divergências depois de 12 módulos entregues será proporcionalmente
   mais custoso do que padronizar agora sobre 4 módulos.

### Por que Sprint 4.5 e não "cleanup da Sprint 5"

A Sprint 4.5 é governança, não limpeza. Seu produto são:
- Contratos formais e auditáveis (documentos vivos).
- Refatoração cirúrgica das telas existentes dentro do contrato.
- Auditor de interface que torna o contrato verificável mecanicamente.

Isso precisa existir *antes* da Sprint 5 para que a Sprint 5 nasça já aderente
ao padrão, não em débito com ele.

---

## 5. ESCOPO DA SPRINT 4.5

- Inventariar todos os componentes de UI existentes (código real, não presunção).
- Identificar e documentar divergências visuais e estruturais comprovadas.
- Definir e materializar contrato oficial de UI Components.
- Definir política para tabelas financeiras (sem `overflow-x-auto` como
  experiência principal).
- Definir política para modais, abas e navegação contextual.
- Padronizar componentes-base e variantes.
- Refatorar telas existentes de forma incremental e segura.
- Criar `auditor_de_interface` em modo advisory (script de análise estática).
- Atualizar documentos vivos impactados.
- Preparar base visual consistente para a Sprint 5.

---

## 6. FORA DE ESCOPO

- Implementação de novos módulos (Sprint 5).
- Alteração de regras financeiras, fórmulas ou contratos de API.
- Alteração de endpoints ou schemas de backend.
- Criação de funcionalidades novas em módulos existentes.
- Mudança de bibliotecas de terceiros (Recharts, Next.js, etc.).
- Alteração do Prompt-Mestre ou documentos de baseline superior.
- Alteração da planilha de backlog (controlada por Moisés e Camaleão).
- Abertura de PR sem autorização posterior de Moisés.
- Merge ou alteração de main.

---

## 7. DIAGNÓSTICO INICIAL DA UI ATUAL

### 7.1 Dois sistemas de componentes coexistentes

**Sistema A — cockpit/ (amortização e juros):**
- Baseado em classes CSS custom prefixadas `cockpit-*`.
- Componentes bem abstraídos: `CockpitPrimitives`, `CockpitModal`,
  `CockpitTables`, `CockpitCharts`.
- Modal educativo centralizado via `CockpitModal` com tabs internas.
- Tabelas sem sticky header na versão cockpit (`CockpitTables.tsx`).

**Sistema B — Tailwind direto (diagnóstico e financiamento):**
- Classes utilitárias Tailwind usadas inline nos componentes de página.
- Sem abstração de componente para padrões repetidos.
- `overflow-x-auto` como solução para tabelas financeiras largas.
- Estados idle/loading implementados inline com `cockpit-insight-bar`
  (mistura dos dois sistemas).

**Problema:** os módulos futuros da Sprint 5 precisarão escolher entre os dois
sistemas ou criar um terceiro. Sem decisão formal, a escolha será implícita.

### 7.2 Tabelas financeiras — estado atual

| Componente | Arquivo | overflow-x | sticky header | linhas |
|---|---|---|---|---|
| `InterestSimpleTable` | CockpitTables.tsx | via CSS classe | não | todas |
| `InterestCompoundTable` | CockpitTables.tsx | via CSS classe | não | todas |
| `AmortizationCockpitTable` | CockpitTables.tsx | via CSS classe | não | todas |
| `AmortizationCompareTable` | CockpitTables.tsx | via CSS classe | não | todas |
| `AmortizacaoSimplesTable` | interest/AmortizacaoTables.tsx | overflow-auto | sim | todas |
| `AmortizacaoCompostaTable` | interest/AmortizacaoTables.tsx | overflow-auto | sim | todas |
| `AmortizacaoTable` | amortization/AmortizacaoTable.tsx | overflow-auto | sim | todas |
| `FinanciamentoTable` | financing/FinanciamentoTable.tsx | **overflow-x-auto** | sim | todas |
| `FinanciamentoCompareSummary` | financing/FinanciamentoCompareSummary.tsx | **overflow-x-auto** | não | (resumo, ~8 rows) |

**Achados:**
- Nenhuma tabela usa `.slice()` ou limite artificial de linhas — dado positivo.
- `FinanciamentoTable` usa `overflow-x-auto` explícito como wrapper principal —
  violação da política proposta.
- `FinanciamentoCompareSummary` usa `overflow-x-auto` para tabela de resumo
  comparativo (poucas colunas, mais tolerável, mas ainda inconsistente).
- `overflow-auto` nas demais tabelas implica rolagem horizontal possível se o
  conteúdo transbordar — risco latente a ser endereçado.

### 7.3 Modais — estado atual

| Uso | Local | Tipo de conteúdo | Adequado? |
|---|---|---|---|
| `CockpitModal` em `AmortizationCockpit` | Amortização | Conteúdo educativo "Saiba Mais" | Aceitável (secundário) |
| `DiagnosticoSaibaMais` | Diagnóstico | Conteúdo educativo "Saiba Mais" | A confirmar na F1 |
| `FinanciamentoSaibaMais` | Financiamento | Conteúdo educativo "Saiba Mais" | A confirmar na F1 |

**Achados:**
- Nenhum módulo usa modal como navegação principal do fluxo — dado positivo.
- O padrão de "Saiba Mais" em modal é coerente entre módulos para conteúdo
  educativo secundário.
- Não há evidência de modal inadequado como fluxo principal nesta Sprint.

### 7.4 Navegação e shell — estado atual

- `FinancialCockpitShell` é a shell ativa, com topbar derivada de `MODULES`.
- `Header.tsx` e `Sidebar.tsx` existem mas não estão integrados à shell ativa
  — provavelmente órfãos de iteração anterior.
- `VISIBLE_MODULE_IDS` hardcoded em `FinancialCockpitShell` com 8 de 12 módulos
  — filtragem de topbar não derivada dinamicamente de `MODULES.status`.

### 7.5 Componentes duplicados / conflitantes

| Conflito | Arquivo A | Arquivo B | Impacto |
|---|---|---|---|
| `EducationPanel` duplo | `ui/EducationPanel.tsx` | `CockpitPrimitives.tsx` | Nome igual, semânticas diferentes |
| Shell dupla | `shell/Header.tsx` + `shell/Sidebar.tsx` | `FinancialCockpitShell` | Componentes órfãos acumulando |
| Módulo tabs via `CockpitActionButton` | `FinanciamentoCockpit` | `CockpitSubTabs` | Dois padrões de tab de módulo |

---

## 8. INVENTÁRIO PRELIMINAR DE UI COMPONENTS

Este inventário é baseado em leitura real dos arquivos. A F1 produzirá o
inventário completo e formal com campos expandidos.

### 8.1 Shell / Layout

| Componente | Arquivo | Status | Observação |
|---|---|---|---|
| `FinancialCockpitShell` | `ui/cockpit/FinancialCockpitShell.tsx` | ATIVO | Shell principal atual |
| `ShellLayout` | `shell/ShellLayout.tsx` | WRAPPER | Delega para FinancialCockpitShell |
| `Header` | `shell/Header.tsx` | ÓRFÃO? | Breadcrumb — não usado na shell ativa |
| `Sidebar` | `shell/Sidebar.tsx` | ÓRFÃO? | Navegação vertical — não usada |
| `NavItem` | `shell/NavItem.tsx` | ÓRFÃO? | Usado por Sidebar |
| `ModulePage` | `shell/ModulePage.tsx` | A verificar | |
| `EducationalNotice` | `shell/EducationalNotice.tsx` | A verificar | |

### 8.2 Componentes UI Base

| Componente | Arquivo | Status | Observação |
|---|---|---|---|
| `AlertBanner` | `ui/AlertBanner.tsx` | ATIVO | info/success/warning/error |
| `SummaryCard` | `ui/SummaryCard.tsx` | ATIVO | label + value + delta |
| `EducationPanel` | `ui/EducationPanel.tsx` | ATIVO | Painel educativo lateral |
| `FormSection` | `ui/FormSection.tsx` | ATIVO | fieldset/legend wrapper |

### 8.3 Cockpit Primitives

| Componente | Arquivo | Usado em |
|---|---|---|
| `CockpitSubTabs` | `ui/cockpit/CockpitPrimitives.tsx` | Amortização, Juros |
| `CockpitGrid` | idem | Todos os módulos |
| `CockpitInputPanel` | idem | Amortização, Juros |
| `CockpitField` | idem | Amortização, Juros |
| `CockpitSlider` | idem | Amortização |
| `CockpitButton` | idem | Amortização, Juros |
| `KpiStrip` / `KpiItem` | idem | Amortização, Juros |
| `CenterPanel` | idem | Amortização, Juros |
| `LegendItem` | idem | Amortização, Juros |
| `EducationPanel` (cockpit) | idem | Amortização, Juros — CONFLITO DE NOME |
| `EduTitle`, `EduText`, `EduFormula` | idem | Amortização, Juros |
| `MoreButton` | idem | Amortização |
| `CautionItem` | idem | Amortização |

### 8.4 Modal

| Componente | Arquivo | Observação |
|---|---|---|
| `CockpitModal` | `ui/cockpit/CockpitModal.tsx` | Modal com tabs internas + Esc + click-overlay |
| `ModalHeading`, `ModalText` | idem | Primitivos de conteúdo de modal |
| `ModalFormula`, `ModalExample` | idem | Primitivos de conteúdo de modal |
| `ModalDisclaimer` | idem | Disclaimer educacional fixo |

### 8.5 Tabelas

| Componente | Arquivo | Colunas | overflow |
|---|---|---|---|
| `InterestSimpleTable` | cockpit/CockpitTables.tsx | 3 | CSS classe |
| `InterestCompoundTable` | cockpit/CockpitTables.tsx | 3 | CSS classe |
| `AmortizationCockpitTable` | cockpit/CockpitTables.tsx | 5 | CSS classe |
| `AmortizationCompareTable` | cockpit/CockpitTables.tsx | 4 | CSS classe |
| `AmortizacaoSimplesTable` | interest/AmortizacaoTables.tsx | 4 | overflow-auto |
| `AmortizacaoCompostaTable` | interest/AmortizacaoTables.tsx | 5 | overflow-auto |
| `AmortizacaoTable` | amortization/AmortizacaoTable.tsx | 6 | overflow-auto |
| `FinanciamentoTable` | financing/FinanciamentoTable.tsx | 6-7 | **overflow-x-auto** |
| `FinanciamentoCompareSummary` (tabela) | financing/FinanciamentoCompareSummary.tsx | 3 | **overflow-x-auto** |

### 8.6 Gráficos

| Componente | Arquivo | Biblioteca |
|---|---|---|
| `AmortizationCompareChart` | cockpit/CockpitCharts.tsx | Recharts |
| `AmortizationCompositionChart` | cockpit/CockpitCharts.tsx | Recharts |
| `EvolucaoSaldoChart` | interest/EvolucaoSaldoChart.tsx | Recharts |
| `AmortizacaoSaldoChart` | amortization/AmortizacaoSaldoChart.tsx | Recharts |
| `FinanciamentoCompareChart` | financing/FinanciamentoCompareChart.tsx | Recharts |

### 8.7 Estados de Interface

| Componente | Arquivo | Acessibilidade |
|---|---|---|
| `LoadingState` | states/LoadingState.tsx | `role="status"`, `aria-busy`, `aria-live` |
| `ErrorState` | states/ErrorState.tsx | `role="alert"` |
| `EmptyState` | states/EmptyState.tsx | `role="status"` |

### 8.8 Botões / CTAs

| Componente | Arquivo | Variantes |
|---|---|---|
| `CockpitButton` | cockpit/CockpitPrimitives.tsx | 1 (submit, busy state) |
| `CockpitActionButton` | cockpit/CockpitActionButton.tsx | primary, secondary, educational, comparison |
| `MoreButton` | cockpit/CockpitPrimitives.tsx | 1 (link-like, trigger de modal) |

### 8.9 Formulários por módulo

| Componente | Arquivo | Primitivos usados |
|---|---|---|
| `DiagnosticoForm` | diagnostic/DiagnosticoForm.tsx | A verificar na F1 |
| `FinanciamentoForm` | financing/FinanciamentoForm.tsx | A verificar na F1 |
| `AmortizacaoForm` | amortization/AmortizacaoForm.tsx | A verificar na F1 |
| `JurosSimplesForm` | interest/JurosSimplesForm.tsx | CockpitField, CockpitSlider |
| `JurosCompostosForm` | interest/JurosCompostosForm.tsx | CockpitField, CockpitSlider |
| `formPrimitives` (interest) | interest/formPrimitives.tsx | Primitivos de campo custom |
| `formPrimitives` (amortization) | amortization/formPrimitives.tsx | Primitivos de campo custom |

---

## 9. PROBLEMAS E RISCOS OBSERVADOS

### 9.1 Problemas confirmados (comprovados por código)

**P-01 — `overflow-x-auto` como solução principal em FinanciamentoTable**
- Arquivo: `financing/FinanciamentoTable.tsx:26`
- Risco: em mobile ou viewport estreito, o usuário precisa rolar horizontalmente
  para ver colunas como "Saldo final". Para tabelas com 120, 360 ou 600 linhas,
  isso é a experiência principal — não aceitável.
- Gravidade: ALTA

**P-02 — `overflow-x-auto` em FinanciamentoCompareSummary**
- Arquivo: `financing/FinanciamentoCompareSummary.tsx:136`
- Tabela de resumo comparativo (3 colunas, ~8 linhas). Risco menor por volume
  reduzido, mas ainda inconsistente com a política proposta.
- Gravidade: MÉDIA

**P-03 — `overflow-auto` bidirecional nas tabelas de interest e amortization**
- Arquivos: `interest/AmortizacaoTables.tsx`, `amortization/AmortizacaoTable.tsx`
- `overflow-auto` ativa rolagem em qualquer direção quando o conteúdo transborda.
  Em tabelas com 6 colunas e valores monetários longos, pode gerar rolagem
  horizontal em viewports menores.
- Gravidade: MÉDIA (latente, depende do viewport)

**P-04 — Dois sistemas de componentes sem contrato unificado**
- Sistema cockpit/ (classes CSS custom) vs Tailwind direto.
- Resultado: nenhum dos dois é "o padrão" — cada módulo faz escolha implícita.
- Gravidade: ALTA (risco estrutural para Sprint 5)

**P-05 — `EducationPanel` com nome duplicado e semântica diferente**
- `ui/EducationPanel.tsx` (painel lateral genérico, `role="complementary"`)
- `EducationPanel` em `CockpitPrimitives.tsx` (wrapper de abas educativas)
- Importações ambíguas possíveis se módulos futuros importarem pelo nome sem
  qualificar o path.
- Gravidade: MÉDIA

**P-06 — `VISIBLE_MODULE_IDS` hardcoded em FinancialCockpitShell**
- Filtra topbar com lista estática. Quando Sprint 5 adicionar módulos, a topbar
  não exibirá automaticamente — precisará de edição manual em dois lugares.
- Gravidade: MÉDIA

**P-07 — `Header.tsx` e `Sidebar.tsx` órfãos**
- Componentes não usados que acumulam no repositório, confundem leitores novos
  e aumentam superfície de manutenção.
- Gravidade: BAIXA (mas deve ser formalizado: remover ou documentar razão)

**P-08 — Estados inline duplicados**
- `FinanciamentoCockpit` e `DiagnosticoCockpit` implementam estados idle e loading
  com `cockpit-insight-bar` + ícone emoji inline, sem usar `LoadingState` /
  `EmptyState` canônicos.
- Inconsistência entre módulos: amortização usa o padrão cockpit, financiamento
  e diagnóstico usam inline ad-hoc.
- Gravidade: BAIXA/MÉDIA

### 9.2 Riscos prospectivos

**R-01 — Sprint 5 herda `overflow-x-auto` como padrão**
- Sem política explícita, o próximo módulo provavelmente copiará o padrão de
  `FinanciamentoTable` por ser o mais recente.

**R-02 — Colisão de nomes de componentes em módulos futuros**
- Novos módulos importando `EducationPanel` podem pegar a versão errada.

**R-03 — Topbar incompleta ao adicionar módulos na Sprint 5**
- Se `VISIBLE_MODULE_IDS` não for corrigido, módulos novos não aparecerão
  na topbar sem intervenção manual.

**R-04 — Sem auditor, regressões visuais passam pelo CI**
- O CI atual valida lint, typecheck, testes e format — mas não detecta
  `overflow-x-auto` inadvertido, corte de linhas ou modal como nav principal.

---

## 10. CONTRATO VISUAL E ESTRUTURAL PROPOSTO

O contrato a ser formalizado na F2 deve estabelecer:

### 10.1 Hierarquia de componentes

```
Camada 1 — Shell
  FinancialCockpitShell (topbar, main, glow)

Camada 2 — Layout de Módulo
  CockpitGrid (input | center | education)
  CockpitInputPanel (aside de formulário)
  CenterPanel (KPIs + gráfico + insight)
  EducationPanel (painel educativo — lado direito)

Camada 3 — Conteúdo
  Tabelas financeiras (contrato visual comum; abstração final a decidir na F2)
  Gráficos (ChartCard com padrão Recharts)
  Resumos (KpiStrip, SummaryCard)
  Alertas (AlertBanner — níveis info/success/warning/error)
  Estados (LoadingState, ErrorState, EmptyState)

Camada 4 — Primitivos de Formulário
  CockpitField (input com label + unit + hint)
  CockpitSlider
  CockpitButton (submit)
  CockpitActionButton (CTA, variantes primary/secondary/educational/comparison)
  FormSection (fieldset/legend)

Camada 5 — Modal (uso restrito)
  CockpitModal (apenas para conteúdo secundário, não como nav principal)
```

### 10.2 Regra de divergência zero

A partir da F3, nenhum novo componente pode ser adicionado fora desta hierarquia
sem decisão formal registrada em ADR. A Sprint 4.5 produz a linha de base;
a Sprint 5 nasce dentro dela.

### 10.3 Tokens como fonte única de verdade visual

Toda propriedade visual (cor, espaçamento, tipografia, border-radius) deve
referenciar tokens de `styles/tokens.ts` ou as CSS vars correspondentes.
Valores hardcoded são violação do contrato.

---

## 11. POLÍTICA PROPOSTA PARA TABELAS FINANCEIRAS

### 11.1 Regras inegociáveis

1. **`overflow-x-auto` é proibido como wrapper principal de tabela financeira.**
   Não é solução de UX — é defer do problema para o usuário.

2. **Dados nunca podem ser ocultados ou cortados.** Nenhum `overflow-hidden`,
   nenhum `.slice()`, nenhum limite artificial de linhas (50, 100, etc.).

3. **Rolagem vertical é permitida e esperada** para prazos longos (120, 360,
   420, 600 meses). Usar `max-height` com `overflow-y-auto` e cabeçalho fixo.

### 11.2 Estratégia por largura de tabela

**Tabelas com até 4 colunas (ex.: juros simples, resumo comparativo):**
- Largura das colunas suficiente para `w-full` sem transbordar.
- Sem necessidade de estratégia especial de responsividade.

**Tabelas com 5-6 colunas (ex.: amortização PRICE/SAC, financiamento):**
- Desktop: `w-full`, colunas com `text-xs` e padding reduzido.
- Tablet (< 768px): considerar ocultar colunas secundárias com `hidden md:table-cell`.
- Mobile (< 480px): cards por parcela como alternativa à tabela (manter tabela
  acessível via `sr-only` ou accordion expansível).

**Tabelas com 7+ colunas:**
- Proibição de criação sem aprovação prévia — revisar necessidade de tabela vs
  visão hierárquica com detalhe expansível.

### 11.3 Requisitos técnicos obrigatórios

- `sticky top-0` no cabeçalho quando `max-height` for aplicado.
- `tabular-nums` em todas as células monetárias.
- `scope="col"` em `<th>` de coluna e `scope="row"` em `<th>` de linha.
- `caption` com `sr-only` para leitores de tela.
- Totalizadores na última linha quando relevante (total de juros, total pago).

### 11.4 Decisão de abstração adiada para F2

Esta F0 não decide definitivamente se haverá um único componente
`FinancialTable` para todas as tabelas. A F1 deve inventariar todas as tabelas
reais e a F2 deve decidir formalmente entre:

1. um componente único `FinancialTable` parametrizado;
2. componentes por módulo com contrato visual comum;
3. abordagem híbrida, com wrapper/base comum e renderização específica por
   domínio.

Até essa decisão ser formalizada na F2, a Sprint 4.5 exige contrato visual
comum para tabelas financeiras, sem impor abstração única prematuramente.

### 11.5 Critérios de detecção pelo auditor_de_interface

O `auditor_de_interface` deve sinalizar (modo advisory) qualquer ocorrência de:
- `overflow-x-auto` em wrapper de tabela financeira.
- `overflow-hidden` em elemento que contém dados numéricos.
- `.slice(` em componente de tabela.
- Ausência de `sticky top-0` quando `max-height` estiver presente.
- Ausência de `tabular-nums` em células monetárias.

---

## 12. POLÍTICA PROPOSTA PARA MODAIS, ABAS E NAVEGAÇÃO CONTEXTUAL

### 12.1 Quando usar modal

**Uso permitido:**
- Conteúdo educativo secundário ("Saiba Mais") que não faz parte do fluxo
  principal de simulação.
- Confirmações de ação irreversível.
- Ajuda contextual pontual.
- Exportação ou detalhes técnicos secundários.

**Uso proibido:**
- Navegação principal do módulo (tabs de conteúdo central devem ser abas inline).
- Formulário de simulação principal.
- Resultado de cálculo (deve ser renderizado na página, não em modal).
- Substituição de uma aba de primeiro nível.

### 12.2 Quando usar abas

**Uso obrigatório:**
- Alternância entre modos centrais do módulo (ex.: Simular | Comparar em
  financiamento; PRICE | SAC | Comparar em amortização).
- Alternância entre partes importantes do resultado sem perda de contexto.

**Componente canônico:** `CockpitSubTabs` ou `CockpitActionButton` com
`role="tab"` (a F2 decide qual dos dois é oficial para cada nível).

### 12.3 Padrão obrigatório para modais

Todo modal deve usar `CockpitModal` (ou o componente base oficial definido na
F2) com:
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby`.
- Fechamento por `Escape` (teclado) e click no overlay.
- Foco retornado ao elemento que abriu o modal ao fechar.
- Botão de fechar com `aria-label` explícito.
- Sem tamanho único artificial — deve admitir variantes (`sm`, `md`, `lg`).

### 12.4 Substituição modal → aba

Uma substituição modal → aba é **obrigatória** quando:
- O conteúdo do modal é o resultado principal do módulo.
- O usuário precisa alternar entre o modal e o formulário frequentemente.
- O modal exige scroll interno significativo.

Uma substituição é **proibida** sem justificativa quando:
- O conteúdo é genuinamente secundário e opcional.
- A aba quebraria o layout do módulo.

---

## 13. ESTRATÉGIA DO AUDITOR DE INTERFACE EM MODO ADVISORY

### 13.1 Conceito

O `auditor_de_interface` é um script de análise estática que roda como etapa
do CI (ou sob demanda localmente) e emite alertas (advisory — não bloqueia)
sobre violações do contrato visual.

Modo advisory significa: o build não falha, mas o relatório deve ser lido e
cada alerta respondido formalmente antes do merge.

Enquanto permanecer em modo advisory, o auditor não deve bloquear a Sprint 4.5.
Seus alertas, porém, não podem ser ignorados: alertas remanescentes devem ser
documentados, justificados, classificados por severidade, vinculados a decisão
formal de Moisés/Camaleão e rastreados como pendência ou exceção temporária.

### 13.2 Verificações propostas para a F5

**Categoria: Tabelas financeiras**
- `grep -r "overflow-x-auto"` em wrappers de `<table>` → ALERTA
- `grep -r "\.slice("` em componentes de tabela → ALERTA
- Ausência de `tabular-nums` em células com `formatBRL` → ALERTA
- `max-height` sem `sticky top-0` no `<thead>` → ALERTA

**Categoria: Modais**
- Modal sem `role="dialog"` → ALERTA
- Modal sem tratamento de `Escape` → ALERTA
- Modal com resultado de cálculo como conteúdo principal → ALERTA (heurística)

**Categoria: Tokens**
- Cor hardcoded fora de `tokens.ts` ou CSS vars → ALERTA
  (grep por `#[0-9a-fA-F]{3,6}` fora de `tokens.ts`)

**Categoria: Estados**
- Componente de módulo sem `data-testid` de estado idle/loading/error → ALERTA

### 13.3 Saída esperada

```
[auditor_de_interface] Advisory — 2026-05-09
ALERTA [tabela-overflow] financing/FinanciamentoTable.tsx:26
  → overflow-x-auto detectado como wrapper principal de tabela financeira
ALERTA [tabela-overflow] financing/FinanciamentoCompareSummary.tsx:136
  → overflow-x-auto detectado como wrapper principal de tabela financeira
Total: 2 alertas advisory (não bloqueante)
```

### 13.4 Localização proposta

`scripts/auditor_de_interface.sh` (shell) ou
`scripts/auditor_de_interface.py` (Python) — a F5 decide a implementação.
Saída: arquivo `reports/auditor_de_interface_YYYY-MM-DD.txt` e stdout.

---

## 14. DOCUMENTOS A CRIAR, ALTERAR, MANTER INTOCADOS OU SUBSTITUIR

### 14.1 Criar nesta F0

| Documento | Status |
|---|---|
| `docs/sprints/sprint-04-5/00-plano/PLANO_EXECUCAO_SPRINT_4_5.md` | CRIADO (este arquivo) |

### 14.2 Criar em fatias futuras da Sprint 4.5

| Documento | Fatia | Justificativa |
|---|---|---|
| `docs/sprints/sprint-04-5/00-plano/INVENTARIO_UI_COMPONENTS_ATUAIS.md` | F1 | Inventário completo e formal |
| `docs/ui/CONTRATO_UI_COMPONENTS.md` | F2 | Contrato oficial e auditável |
| `docs/ui/POLITICA_TABELAS_FINANCEIRAS.md` | F2 | Política com exemplos e código |
| `docs/ui/POLITICA_MODAIS_ABAS.md` | F2 | Política com exemplos e código |
| `docs/sprints/sprint-04-5/evidencias/` (estrutura) | F3-F6 | Evidências por fatia |
| `docs/sprints/sprint-04-5/relatorio-execucao.md` | F6 | Relatório forense de fechamento |
| `docs/sprints/sprint-04-5/validacao-oficial.md` | F6 | Validação e aceite formal |

### 14.3 Alterar em fatias futuras (com diff documentado)

| Documento | Fatia | O que muda |
|---|---|---|
| `docs/16_Design_System.md` | F2-F3 | Incluir contrato UI Components e tokens |
| `docs/07_UX_UI_e_Navegacao.md` | F2 | Incluir políticas de tabelas, modais e abas |
| `docs/09_Qualidade_Testes.md` | F5 | Incluir auditor_de_interface |
| `docs/10_Roadmap.md` | F6 | Registrar Sprint 4.5 como concluída |
| `docs/13_Backlog_Tecnico.md` | F6 | Atualizar débitos técnicos resolvidos |
| `docs/19_Matriz_Rastreabilidade.md` | F6 | Mapear novos componentes e políticas |
| `docs/_meta/living_docs.json` | F2 + F6 | Registrar novos documentos criados |
| `docs/00_INDICE_GERAL.md` | F6 | Incluir novos docs de UI |

### 14.4 Avaliar com cautela

| Documento | Risco |
|---|---|
| `docs/projeto/DA_VISAO_AO_PRODUTO__A_JORNADA_DA_PLATAFORMA_EDUCACIONAL_FINANCEIRA.md` | Documento narrativo — não alterar sem decisão de Moisés |

### 14.5 Não alterar sem rebaseline formal

- Prompt-Mestre
- Documentos de baseline superior
- Relatórios de sprints encerradas
- `docs/baseline/03_Regras_de_Negocio.md`

---

## 15. PLANO DE FATIAS DA SPRINT 4.5

A implementação só começa após aprovação formal da F0 por Moisés e auditoria
do Camaleão.

### F0 — Planejamento Auditável (esta fatia)

**Natureza:** documentação/diagnóstico
**Entregável:** `PLANO_EXECUCAO_SPRINT_4_5.md`
**Branch:** `claude/sprint-4-5-f0-plano-ui-components`
**Status:** EM EXECUÇÃO

**Conteúdo:**
- Diagnóstico real do ambiente e repositório (Fase 0).
- Diagnóstico da UI baseado em leitura real de código.
- Inventário preliminar de componentes.
- Proposta de contrato visual, políticas e estratégia.
- Plano de fatias e critérios de aceite.

---

### F1 — Inventário Real de UI Components e Divergências

**Natureza:** documentação + análise
**Branch proposta:** `claude/sprint-4-5-f1-inventario-ui`
**Entregável:** `docs/sprints/sprint-04-5/00-plano/INVENTARIO_UI_COMPONENTS_ATUAIS.md`

**Conteúdo:**
- Leitura completa de todos os componentes TSX (incluindo os não lidos na F0).
- Leitura do CSS global e `tokens.css` para confirmar classes `cockpit-*`.
- Leitura de `DiagnosticoSaibaMais.tsx` e `FinanciamentoSaibaMais.tsx`.
- Tabela expandida por componente: path, páginas que usam, divergências visuais,
  dependência de tokens, acessibilidade, responsividade, risco de regressão,
  decisão proposta (manter / refatorar / substituir / remover).
- Confirmação ou refutação das hipóteses desta F0.
- Sem implementação de código.

---

### F2 — Contrato Oficial de UI Components e Políticas

**Natureza:** documentação viva
**Branch proposta:** `claude/sprint-4-5-f2-contrato-ui`
**Entregáveis:**
- `docs/ui/CONTRATO_UI_COMPONENTS.md`
- `docs/ui/POLITICA_TABELAS_FINANCEIRAS.md`
- `docs/ui/POLITICA_MODAIS_ABAS.md`
- Atualização de `docs/16_Design_System.md`
- Atualização de `docs/07_UX_UI_e_Navegacao.md`
- Atualização de `docs/_meta/living_docs.json`

**Conteúdo:**
- Formalização do contrato proposto na F0 com base no inventário da F1.
- Políticas com exemplos de código correto e incorreto.
- Decisão sobre componentes a consolidar, remover ou criar.
- Sem implementação de componentes finais — apenas documentação de contrato.
- Aprovação de Moisés/Camaleão antes de avançar para F3.

---

### F3 — Implementação ou Consolidação dos Componentes-Base

**Natureza:** frontend + testes
**Branch proposta:** `claude/sprint-4-5-f3-base-components`
**Entregáveis:**
- Contrato visual comum para tabelas financeiras implementado conforme decisão
  da F2 (`FinancialTable`, componentes por módulo ou abordagem híbrida).
- Resolução do conflito `EducationPanel` duplo.
- Remoção formal de `Header.tsx`, `Sidebar.tsx` (se confirmados como órfãos na F1).
- Correção de `VISIBLE_MODULE_IDS` → derivação dinâmica de `MODULES.status`.
- Testes unitários para componentes novos/refatorados.
- Gates: lint ✓, typecheck ✓, pnpm test ✓, ruff check ✓, pytest ✓.

---

### F4 — Refatoração Incremental das Páginas Existentes

**Natureza:** frontend + testes + evidência visual
**Branch proposta:** `claude/sprint-4-5-f4-refatoracao-paginas`
**Entregáveis:**
- `FinanciamentoTable` → sem `overflow-x-auto` como wrapper principal.
- `FinanciamentoCompareSummary` → sem `overflow-x-auto`.
- `AmortizacaoTables` e `AmortizacaoTable` → estratégia responsiva definida.
- Estados idle/loading padronizados (se decidido na F2 que devem usar
  `LoadingState`/`EmptyState` canônicos).
- Zero alteração de regra financeira, fórmula ou contrato de API.
- Testes de regressão visual (se viável) ou snapshots.
- Gates: todos os gates da F3 + confirmação de comportamento nas páginas.

---

### F5 — auditor_de_interface em Modo Advisory

**Natureza:** scripts/qualidade + docs
**Branch proposta:** `claude/sprint-4-5-f5-auditor-interface`
**Entregáveis:**
- `scripts/auditor_de_interface.sh` ou `.py`.
- `docs/09_Qualidade_Testes.md` atualizado.
- Primeira execução com relatório `reports/auditor_de_interface_YYYY-MM-DD.txt`.
- Zero violações obrigatórias não justificadas sobre itens já corrigidos.
- Alertas advisory remanescentes, se existirem, documentados, justificados,
  classificados por severidade, vinculados a decisão formal de Moisés/Camaleão
  e rastreados como pendência ou exceção temporária.

---

### F6 — Validação, Relatório Forense e Fechamento

**Natureza:** governança + evidências
**Branch proposta:** `claude/sprint-4-5-f6-fechamento`
**Entregáveis:**
- `docs/sprints/sprint-04-5/relatorio-execucao.md`.
- `docs/sprints/sprint-04-5/relatorio-forense.md`.
- `docs/sprints/sprint-04-5/validacao-oficial.md`.
- Atualização de `docs/10_Roadmap.md`, `docs/13_Backlog_Tecnico.md`,
  `docs/19_Matriz_Rastreabilidade.md`, `docs/00_INDICE_GERAL.md`.
- `docs/_meta/living_docs.json` com todos os documentos da Sprint 4.5.
- Gates: todos os gates de F3-F5 + auditor_de_interface executado, com zero
  violações obrigatórias não justificadas e exceções advisory documentadas.
- Declaração formal de que a Sprint 5 pode ser iniciada.

---

## 16. CRITÉRIOS DE ACEITE POR FATIA

| Fatia | Critérios de aceite |
|---|---|
| F0 | Branch publicada no GitHub; plano com diagnóstico real (não presumido); nenhuma implementação; aprovação de Moisés + auditoria Camaleão |
| F1 | Inventário completo em doc; hipóteses F0 confirmadas ou refutadas; nenhum componente implementado |
| F2 | Três políticas materializadas em docs; docs vivos atualizados; aprovação antes da F3 |
| F3 | Componentes base consolidados; zero conflito de nome; gates passando; testes unitários |
| F4 | `overflow-x-auto` eliminado de tabelas financeiras; dados íntegros; responsividade verificada; zero regressão financeira; gates passando |
| F5 | Script auditor executando; relatório gerado; zero violações obrigatórias não justificadas sobre itens já corrigidos; alertas advisory remanescentes classificados e rastreados |
| F6 | Documentação forense completa; living_docs.json atualizado; declaração formal de prontidão para Sprint 5 |

---

## 17. EVIDÊNCIAS OBRIGATÓRIAS POR FATIA

### F0
- [x] Saída literal dos comandos de diagnóstico (seção 2 deste documento)
- [x] Branch `claude/sprint-4-5-f0-plano-ui-components` publicada no GitHub
- [x] Hash do commit de entrega (ver Anexo 25)
- [x] `git diff --name-only origin/main...HEAD` com apenas este arquivo

### F1
- [ ] Hash de HEAD usado para leitura de componentes
- [ ] Lista de todos os arquivos inspecionados
- [ ] Inventário completo com todas as colunas definidas
- [ ] Confirmação ou refutação de cada hipótese da F0

### F2
- [ ] Diff de cada documento criado/alterado
- [ ] `living_docs.json` com novos docs registrados
- [ ] Aprovação formal de Moisés antes do avanço para F3

### F3
- [ ] `pnpm lint` → zero erros
- [ ] `pnpm typecheck` → zero erros
- [ ] `pnpm test --run` → todos os testes passando
- [ ] `ruff check app tests` → All checks passed
- [ ] `pytest tests/ -q` → contagem ≥ Sprint 4 (sem regressão)
- [ ] `git diff --name-only` com apenas os arquivos declarados

### F4
- [ ] Todos os gates de F3
- [ ] `grep -r "overflow-x-auto"` em wrappers de tabela → zero resultados
- [ ] Comprovação de que nenhuma linha de dados foi cortada
- [ ] Snapshot ou evidência de comportamento em viewport mobile

### F5
- [ ] Script `auditor_de_interface` executando sem erro de runtime
- [ ] Relatório gerado com zero violações obrigatórias não justificadas sobre
      itens já corrigidos
- [ ] Alertas advisory remanescentes, se existirem, documentados, justificados,
      classificados por severidade e vinculados a decisão formal
- [ ] Saída incluída como evidência no commit

### F6
- [ ] Todos os gates de F3-F5
- [ ] Três documentos de fechamento criados
- [ ] `living_docs.json` refletindo estado final
- [ ] Declaração formal assinada no `validacao-oficial.md`

---

## 18. ESTRATÉGIA DE TESTES E VALIDAÇÃO

### Testes unitários (F3-F4)

- Cada componente novo ou refatorado deve ter testes com Vitest.
- Cobrir: renderização básica, props obrigatórias, `data-testid`, acessibilidade
  (role, aria-label).
- Não testar lógica financeira (pertence ao backend).

### Testes de regressão (F4)

- Verificar que o comportamento das páginas existentes não mudou após
  a refatoração de componentes.
- Foco em: dados exibidos corretamente, tabelas com todas as linhas,
  estados de erro/loading operacionais.

### Quality gates (todas as fatias de implementação)

```bash
# Backend
ruff check app tests          # zero erros
ruff format --check app tests # zero diferenças
python3 -m pytest tests/ -q   # ≥ Sprint 4 passando

# Frontend
pnpm lint                     # zero erros ESLint
pnpm format:check             # zero diferenças Prettier
pnpm typecheck                # zero erros TypeScript
pnpm test --run               # todos os testes passando
```

### Auditoria de interface (F5-F6)

```bash
scripts/auditor_de_interface.sh  # zero violações obrigatórias não justificadas
```

---

## 19. RISCOS, MITIGAÇÕES E CRITÉRIOS DE PARADA

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Refatoração de tabelas quebra testes existentes | MÉDIA | ALTO | Rodar testes antes e depois; não avançar se count cair |
| Escolha de abstração para tabelas muda layout visual | MÉDIA | MÉDIO | Decidir na F2 entre `FinancialTable`, componentes por módulo ou abordagem híbrida; implementar incrementalmente; manter componentes antigos até validação |
| Sprint 5 é iniciada em paralelo por outra sessão antes do fechamento da Sprint 4.5 | BAIXA | ALTO | Documentar bloqueio explícito; Moisés deve controlar abertura da Sprint 5 |
| Diagnóstico de F1 revela problema maior que o esperado | MÉDIA | MÉDIO | Registrar como bloqueio; escalar para decisão antes de F2 |
| auditor_de_interface detecta violações não previstas na F4 | BAIXA | MÉDIO | Tratar como oportunidade de melhoria, não como falha de sprint |

### Critérios de parada obrigatória

A sprint para e escala para Moisés/Camaleão se:
- Qualquer gate de qualidade regredir (testes que passavam param de passar).
- Refatoração de UI exigir mudança em regra financeira ou contrato de API.
- Inventário de F1 revelar problema estrutural maior não previsto neste plano.
- Qualquer evidência fabricada ou não reprodutível for detectada.

---

## 20. DEPENDÊNCIAS COM SPRINT 5

A Sprint 5 **só pode ser iniciada** após:
- F6 da Sprint 4.5 formalmente fechada com `validacao-oficial.md` assinado.
- `CONTRATO_UI_COMPONENTS.md` publicado e aprovado.
- `auditor_de_interface` operacional em modo advisory.
- Todos os gates passando sem regressão.

A Sprint 5 deve:
- Usar os componentes-base definidos na Sprint 4.5.
- Seguir as políticas de tabelas, modais e abas.
- Ter suas entregas verificadas pelo `auditor_de_interface` antes do merge.

---

## 21. PLANO DE ATUALIZAÇÃO DOCUMENTAL E LIVING_DOCS.JSON

### Sequência de atualização

| Fatia | Documentos | Ação |
|---|---|---|
| F0 | `living_docs.json` | NÃO alterar nesta fatia — sprint não aprovada ainda |
| F1 | Nenhum doc vivo | Apenas criação do inventário como artefato de análise |
| F2 | `living_docs.json`, `docs/ui/` (3 docs novos) | Criar e registrar |
| F2 | `docs/16_Design_System.md`, `docs/07_UX_UI_e_Navegacao.md` | Atualizar com diff documentado |
| F5 | `docs/09_Qualidade_Testes.md` | Incluir auditor |
| F6 | `docs/10_Roadmap.md`, `docs/13_Backlog_Tecnico.md` | Marcar Sprint 4.5 concluída |
| F6 | `docs/19_Matriz_Rastreabilidade.md`, `docs/00_INDICE_GERAL.md` | Atualizar |
| F6 | `living_docs.json` | Estado final com todos os documentos da Sprint 4.5 |

### Regra de atualização do living_docs.json

Todo documento criado deve ter entrada no `living_docs.json` com:
- `id` único sequencial
- `path` relativo ao repositório
- `category` (VIVO / ESTATICO / HIBRIDO / GOVERNANCA_SPRINT)
- `title`
- `materialized_in_repo: true`
- `note` com contexto da sprint

---

## 22. PLANO DE FECHAMENTO FORENSE DA SPRINT 4.5

O fechamento da Sprint 4.5 (F6) deve produzir:

### relatorio-execucao.md

- Tabela de fatias: status, branch, commit hash, arquivos entregues.
- Comparação: escopo declarado vs escopo commitado.
- Gates de qualidade executados e resultados.
- Divergências justificadas (se houver).

### relatorio-forense.md

- Estado de cada problema identificado (P-01 a P-08) após a sprint.
- Evidência de resolução ou decisão de adiar.
- Componentes órfãos: status final (removidos / mantidos com justificativa).
- Estado do auditor_de_interface: zero violações obrigatórias não justificadas,
  com alertas advisory remanescentes documentados e aceitos formalmente.

### validacao-oficial.md

- Checklist de aceite global.
- Declaração formal de que a Sprint 5 pode ser iniciada.
- Assinatura de Moisés (ou registro de aprovação no chat).

---

## 23. PENDÊNCIAS E PERGUNTAS PARA DECISÃO DE MOISÉS/CAMALEÃO

As seguintes decisões requerem input de Moisés/Camaleão antes da F1:

**D-01 — Aprovação do plano**
> Este plano está aprovado para execução? Podem iniciar a F1?

**D-02 — Componentes órfãos**
> `Header.tsx` e `Sidebar.tsx` em `components/shell/` devem ser removidos
> formalmente na F3 ou mantidos com documentação de razão? (Proposta: remover)

**D-03 — `VISIBLE_MODULE_IDS` em FinancialCockpitShell**
> A filtragem da topbar deve derivar de `MODULES.status === 'disponivel'`
> dinamicamente, ou a lista hardcoded deve ser mantida por controle explícito?
> (Proposta: derivação dinâmica, mas decisão de Moisés)

**D-04 — Estratégia de abstração para tabelas financeiras**
> Após o inventário completo da F1, a F2 deve decidir entre: (1) componente
> único `FinancialTable` parametrizado; (2) componentes por módulo com contrato
> visual comum; ou (3) abordagem híbrida com wrapper/base comum e renderização
> específica por domínio. Até essa decisão, a Sprint 4.5 exige contrato visual
> comum sem impor abstração única.

**D-05 — Estratégia mobile para tabelas financeiras**
> Para tabelas de 6+ colunas em mobile (< 480px): preferência entre:
> (a) Cards por parcela (mais confortável, mais trabalho)
> (b) Accordion expansível (compromisso)
> (c) Colunas secundárias ocultáveis via toggle
> (Sem preferência declarada neste plano — decisão de produto/UX)

**D-06 — `EducationPanel` duplo**
> Renomear o `EducationPanel` de `CockpitPrimitives.tsx` para `CockpitEduPanel`
> ou outro nome que elimine a ambiguidade? (Proposta: renomear)

**D-07 — auditor_de_interface: shell ou Python?**
> Preferência de implementação do auditor: shell script (simples, sem
> dependência) ou Python (mais flexível, já no toolchain do backend)?

---

## 24. ANEXO — COMANDOS DE LEITURA/DIAGNÓSTICO UTILIZADOS

Todos os comandos abaixo foram usados apenas para leitura. Nenhum alterou
arquivos de código, configuração ou histórico git.

```bash
# Fase 0 — Estado do repositório
whoami && hostname && pwd
git rev-parse --show-toplevel
git remote -v
git branch --show-current && git status -sb
git fetch origin --prune
git checkout main && git reset --hard origin/main
git rev-parse --short HEAD && git rev-parse --short origin/main
git log --oneline -5
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo "OK"
ls -ld /home/moses/workspace/Plataforma_Educacional_Financeira 2>/dev/null
ls -la docs/sprints

# Leitura de estrutura
find frontend/src -type f -name "*.tsx" | sort
find frontend/src -type f -name "*.ts" | sort

# Leitura de componentes (cat de arquivos individuais)
cat frontend/src/components/ui/cockpit/CockpitTables.tsx
cat frontend/src/components/ui/cockpit/CockpitModal.tsx
cat frontend/src/components/ui/cockpit/CockpitPrimitives.tsx
cat frontend/src/components/ui/cockpit/FinancialCockpitShell.tsx
cat frontend/src/components/ui/AlertBanner.tsx
cat frontend/src/components/ui/SummaryCard.tsx
cat frontend/src/components/ui/EducationPanel.tsx
cat frontend/src/components/ui/FormSection.tsx
cat frontend/src/components/shell/ShellLayout.tsx
cat frontend/src/components/shell/Header.tsx
cat frontend/src/components/shell/Sidebar.tsx
cat frontend/src/components/states/LoadingState.tsx
cat frontend/src/components/states/ErrorState.tsx
cat frontend/src/components/states/EmptyState.tsx
cat frontend/src/components/financing/FinanciamentoTable.tsx
cat frontend/src/components/financing/FinanciamentoCockpit.tsx
cat frontend/src/components/financing/FinanciamentoCompareSummary.tsx (parcial)
cat frontend/src/components/amortization/AmortizacaoTable.tsx
cat frontend/src/components/interest/AmortizacaoTables.tsx
cat frontend/src/components/amortization/AmortizationCockpit.tsx (parcial)
cat frontend/src/components/diagnostic/DiagnosticoCockpit.tsx
cat frontend/src/styles/tokens.ts

# Diagnóstico de overflow e slice
grep -rn "overflow-x-auto|overflow-x-scroll|overflow-x-hidden|overflow-hidden|overflow-auto" \
  frontend/src --include="*.tsx" --include="*.ts" (excluindo tests)
grep -rn "slice|\.slice(" frontend/src --include="*.tsx" --include="*.ts" (excluindo tests)

# Documentação
ls docs/
ls docs/sprints/sprint-04/
ls docs/ui/
ls docs/_meta/
cat docs/_meta/living_docs.json (parcial)

# Branch de trabalho
git checkout -B claude/sprint-4-5-f0-plano-ui-components origin/main
```

---

## 25. ANEXO — PROVA OPERACIONAL DA BRANCH DE ENTREGA

### Entrega original da F0 por Claude Code

```
Branch original: claude/sprint-4-5-f0-plano-ui-components
Base: origin/main @ 7cd90c2
Commit original da F0: f477dff
Arquivo entregue: docs/sprints/sprint-04-5/00-plano/PLANO_EXECUCAO_SPRINT_4_5.md
Diff original em relação à main: somente este arquivo
Status: branch publicada no GitHub e depois buscada no WSL de Moisés para auditoria
```

### Adendo corretivo pós-auditoria por Codex

Este adendo corretivo foi produzido localmente por Codex no WSL de Moisés, em
branch própria de correção:

```
Branch local de correção: codex/sprint-4-5-f0-adendo-corretivo
Base local de trabalho: auditoria/sprint-4-5-f0-plano @ f477dff
Escopo: ajustes documentais menores solicitados pelo Camaleão
Arquivo alterado: docs/sprints/sprint-04-5/00-plano/PLANO_EXECUCAO_SPRINT_4_5.md
Implementação: nenhuma
F1: não iniciada
Sprint 5: não iniciada
Commit/push do adendo: aguardando autorização expressa de Moisés
```

---

*Fim do PLANO_EXECUCAO_SPRINT_4_5.md — F0 — versão 1.0*
*Classificação: RASCUNHO — aguardando aprovação de Moisés e auditoria do Camaleão*
