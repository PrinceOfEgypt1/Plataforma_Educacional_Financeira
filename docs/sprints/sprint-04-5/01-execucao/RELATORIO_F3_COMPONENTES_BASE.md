# RELATORIO F3 — COMPONENTES-BASE E CORRECOES ESTRUTURAIS

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 4.5
**Fatia:** F3 — Componentes-base e correcoes estruturais controladas
**Branch:** `codex/sprint-4-5-f3-componentes-base-correcao-estrutural`
**Base inicial comprovada:** `main = origin/main @ c955f32`
**Status:** pronto para auditoria por PR

---

## 1. Base inicial comprovada

A Fase 0 foi executada no WSL a partir da `main` equalizada com `origin/main`.

Provas registradas:

- `git status -sb`: `## main...origin/main`
- branch inicial: `main`
- `git rev-parse --short HEAD`: `c955f32`
- `git rev-parse --short origin/main`: `c955f32`
- prova: `OK: HEAD local = origin/main`
- documentos normativos da F2 presentes:
  - `docs/ui/CONTRATO_UI_COMPONENTS.md`
  - `docs/ui/POLITICA_TABELAS_FINANCEIRAS.md`
  - `docs/ui/POLITICA_MODAIS_ABAS.md`
  - `docs/sprints/sprint-04-5/00-plano/INVENTARIO_UI_COMPONENTS_ATUAIS.md`
- Sprint 5: `OK: Sprint 5 nao iniciada`

Observacao operacional: uma primeira tentativa da Fase 0 sofreu interferencia
de quoting entre PowerShell e WSL no trecho com `$(...)`. A prova foi refeita
por comandos menores no WSL, com base e branch comprovadas antes da edicao.

---

## 2. Arquivos alterados

Frontend:

- `frontend/src/components/ui/cockpit/CockpitPrimitives.tsx`
- `frontend/src/components/ui/cockpit/FinancialCockpitShell.tsx`
- `frontend/src/config/modules.ts`
- `frontend/src/components/interest/InterestCockpit.tsx`
- `frontend/src/components/amortization/AmortizationCockpit.tsx`
- `frontend/src/components/diagnostic/DiagnosticoForm.tsx`
- `frontend/src/components/financing/FinanciamentoForm.tsx`
- `frontend/src/__tests__/components/ui/FinancialCockpitShell.test.tsx`
- `frontend/src/__tests__/components/ui/cockpitPrimitives.test.tsx`

Documentacao:

- `docs/ui/CONTRATO_UI_COMPONENTS.md`
- `docs/16_Design_System.md`
- `docs/_meta/living_docs.json`
- `docs/sprints/sprint-04-5/01-execucao/RELATORIO_F3_COMPONENTES_BASE.md`

---

## 3. Decisoes tomadas

### 3.1 `EducationPanel` duplicado

O componente cockpit antes exportado como `EducationPanel` em
`CockpitPrimitives.tsx` foi renomeado para `CockpitEducationPanel`.

Decisao:

- `EducationPanel` base permanece em `frontend/src/components/ui/EducationPanel.tsx`;
- `CockpitEducationPanel` passa a ser o painel educativo especifico do cockpit;
- imports em `InterestCockpit.tsx` e `AmortizationCockpit.tsx` foram atualizados;
- o barrel `frontend/src/components/ui/cockpit/index.ts` continua exportando os
  primitivos, agora sem export ambiguo de `EducationPanel`.

### 3.2 Visibilidade da topbar do cockpit

A lista local `VISIBLE_MODULE_IDS` foi removida de `FinancialCockpitShell.tsx`.

Decisao:

- a propriedade `visibleInCockpit` foi adicionada a `ModuleEntry`;
- `MODULES` declara explicitamente quais modulos aparecem na topbar;
- `getCockpitVisibleModules` centraliza a regra;
- a lista visivel atual foi preservada:
  - `diagnostico`
  - `juros`
  - `amortizacao`
  - `financiamento-imobiliario`
  - `consignado`
  - `cdc`
  - `cartao-rotativo`
  - `investir-vs-quitar`

Motivo: derivar apenas de `status === "disponivel"` removeria modulos
`em-construcao` que hoje aparecem como `EM BREVE`, alterando a navegacao
funcional atual. A visibilidade explicita preserva a intencao existente sem
array escondido dentro da shell.

### 3.3 Acessibilidade de primitivos cockpit

`CockpitButton` recebeu props opcionais e retrocompativeis:

- `aria-busy` quando `busy=true`;
- `ariaLabel`;
- `busyLabel`.

`CockpitField` recebeu props opcionais e retrocompativeis:

- `error`;
- `ariaDescribedBy`;
- `aria-invalid`;
- `aria-describedby`.

`DiagnosticoForm` e `FinanciamentoForm` passaram a enviar erros reais pela prop
`error`, preservando as mensagens de ajuda como `hint`.

---

## 4. O que foi implementado

- Renomeacao do painel educativo cockpit para `CockpitEducationPanel`.
- Atualizacao dos usos em juros e amortizacao.
- Regra de visibilidade do cockpit centralizada em `modules.ts`.
- Remocao de `VISIBLE_MODULE_IDS` de `FinancialCockpitShell`.
- Testes para garantir export/import sem ambiguidade entre `EducationPanel` e
  `CockpitEducationPanel`.
- Testes para `getCockpitVisibleModules` e preservacao da lista visivel atual.
- Testes de acessibilidade para `CockpitField` e `CockpitButton`.
- Atualizacao documental do contrato F2 e do Doc 16 para refletir a F3.

---

## 5. O que ficou para F4/F5

- Aplicar a politica de tabelas financeiras em F4.
- Avaliar responsividade e experiencia principal das tabelas financeiras em F4.
- Decidir remocao ou preservacao final de `Header`, `Sidebar`, `NavItem` e
  componentes legados de juros/amortizacao em fatia futura apropriada.
- Criar e calibrar o `auditor_de_interface` em modo advisory na F5.
- Mapear variaveis cockpit remanescentes para tokens de design system em uma
  etapa posterior, sem ampliar escopo na F3.

---

## 6. Testes executados

Ambiente local:

- WSL Ubuntu
- Node: `/home/moses/.nvm/versions/node/v22.21.1/bin/node`
- pnpm: `/home/moses/.nvm/versions/node/v22.21.1/bin/pnpm`

Comandos e resultados:

```bash
pnpm --dir frontend lint
```

Resultado resumido: verde. `next lint && eslint . --ext .ts,.tsx` sem erros ou
warnings.

```bash
pnpm --dir frontend typecheck
```

Resultado resumido: verde. `tsc --noEmit` sem erros.

```bash
pnpm --dir frontend test
```

Resultado resumido: verde. `43 passed (43)`, `381 passed (381)`.

Observacao: os testes mantiveram warnings ja conhecidos do Recharts em ambiente
JSDOM sobre largura/altura zero de graficos. Eles nao falharam os testes e nao
foram introduzidos por esta F3.

```bash
pnpm --dir frontend build
```

Resultado resumido: verde. `next build` compilou, validou tipos/lint no build e
gerou `16/16` paginas estaticas.

---

## 7. Validacoes de escopo

Executadas localmente antes do commit e previstas para repeticao apos o commit:

- nenhum arquivo em `backend/`, `database/`, `infra/`, `scripts/finance`;
- nenhuma pasta ou arquivo de Sprint 5;
- nenhum `any`, `@ts-ignore` ou `@ts-expect-error` novo no diff;
- `git diff --check` limpo;
- `docs/_meta/living_docs.json` validado com `python3 -m json.tool`.

---

## 8. Provas negativas

- Backend nao alterado.
- API nao alterada.
- Regras financeiras nao alteradas.
- Calculos, arredondamentos, PRICE, SAC, juros e diagnostico nao alterados.
- Planilha operacional nao alterada.
- Sprint 5 nao criada e nao iniciada.
- F4/F5 nao iniciadas.
- Tabelas financeiras nao foram refatoradas em massa.
- Nenhum placeholder/TODO foi deixado como entrega.
- Nenhum `any`, `@ts-ignore` ou `@ts-expect-error` indevido foi introduzido.
- Merge nao realizado.
