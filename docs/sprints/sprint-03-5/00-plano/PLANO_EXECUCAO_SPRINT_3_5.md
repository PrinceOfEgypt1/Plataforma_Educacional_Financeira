# Sprint 3.5 - Plano de execucao UI/UX

Data: 2026-05-03
Branch: `sprint-3.5/f1-uiux-diagnostico-plano-codex`
Base: `main = origin/main = 4a9d30e`

## 1. Objetivo

A Sprint 3.5 existe para elevar a interface da Plataforma Educacional
Financeira ao padrao visual, organizacional, didatico e profissional exigido
pelo projeto antes da abertura da Sprint 4.

Esta sprint nao muda matematica financeira, contratos de API, OpenAPI,
backend, pipeline ou escopo de negocio. O foco e aplicar melhoria UI/UX sobre
as superficies ja materializadas e deixar criterios objetivos para rejeitar
entregas visualmente fracas.

## 2. Motivo da insercao antes da Sprint 4

A Sprint 3 fechou tecnicamente verde e entregou o modulo PRICE/SAC de ponta a
ponta. Mesmo assim, a aplicacao ainda se parece mais com um scaffold funcional
do que com um produto educacional financeiro premium.

O risco de seguir direto para a Sprint 4 e acumular novos modulos sobre uma
base visual crua: mais telas, mais componentes duplicados e mais custo futuro
para alinhar navegacao, densidade, responsividade, hierarquia, estados e
conteudo pedagogico.

## 3. Estado herdado da Sprint 3

- `main = origin/main = 4a9d30e`.
- PR #17 mergeada.
- Working tree inicial limpa.
- Sem branch residual `sprint-3/*`.
- OpenAPI sincronizado.
- Backend, frontend, lint pedagogico e pipeline oficiais verdes.
- `/juros` e `/amortizacao` sao paginas reais.
- Os demais modulos permanecem como placeholders navegaveis.
- Residuos conhecidos: warning Recharts/jsdom e mutation testing como stretch.

## 4. Escopo permitido

- Diagnosticar UI/UX atual.
- Inventariar rotas, componentes, estilos, tokens, conteudo e testes.
- Classificar problemas por gravidade, impacto, tipo e fatia recomendada.
- Definir criterios objetivos de excelencia visual, usabilidade,
  responsividade, acessibilidade e preservacao funcional.
- Planejar as proximas fatias da Sprint 3.5.
- Criar documentacao operacional e evidencias materiais.

## 5. Escopo proibido

- Redesenhar paginas inteiras nesta F1.
- Refatorar componentes de producao nesta F1.
- Trocar design system ou biblioteca de graficos.
- Alterar backend, calculos financeiros, schemas, contratos, OpenAPI,
  pipeline, workflows, Prompt-Mestre, docs baseline ou planilha.
- Criar Diagnostico Financeiro, Financiamento Imobiliario ou qualquer feature
  da Sprint 4.
- Declarar evidencia visual sem screenshot ou inspecao real.

## 6. Fatias propostas

### F1 - Diagnostico, plano e criterios UI/UX

Entregas desta fatia:

- Diagnostico forense de UI/UX.
- Inventario das superficies visuais.
- Matriz de problemas.
- Criterios objetivos de aceite.
- Plano da Sprint 3.5.
- Evidencias de Git, inventario e diagnostico.

Criterios de aceite:

- Branch correta em uso.
- Base Git comprovada.
- Nenhuma implementacao visual profunda.
- Artefatos e evidencias criados.
- Gates minimos executados e reportados honestamente.

### F2 - Fundacao visual e design system aplicado

Escopo recomendado:

- Revisar tokens realmente usados.
- Consolidar radius, sombras, cores, tipografia e escala de espacamento.
- Eliminar drift entre `tokens.ts`, `tokens.css`, Tailwind e componentes.
- Melhorar shell global, sidebar, header, home e tratamento mobile de
  navegacao.

Arquivos provaveis:

- `frontend/src/styles/tokens.css`
- `frontend/src/styles/tokens.ts`
- `frontend/tailwind.config.ts`
- `frontend/src/app/globals.css`
- `frontend/src/components/shell/`
- `frontend/src/components/ui/`
- `frontend/src/app/(app)/page.tsx`

Gates obrigatorios:

- `make lint-pedagogical`
- `cd frontend && pnpm typecheck`
- `cd frontend && pnpm test -- --run`
- `cd frontend && pnpm build`

### F3 - Polimento das paginas reais `/juros` e `/amortizacao`

Escopo recomendado:

- Reorganizar formularios, resultados, cards, graficos, tabelas e
  interpretacoes.
- Tornar a leitura de resultado mais orientada a decisao.
- Padronizar copy, acentos, labels, unidades e tom pedagogico.
- Reforcar que o calculo oficial segue no backend.

Arquivos provaveis:

- `frontend/src/app/(app)/juros/page.tsx`
- `frontend/src/app/(app)/amortizacao/page.tsx`
- `frontend/src/components/interest/`
- `frontend/src/components/amortization/`
- `frontend/src/content/juros/`
- `frontend/src/content/amortizacao/`
- testes em `frontend/src/__tests__/app/` e `frontend/src/__tests__/components/`

Gates obrigatorios:

- Typecheck, testes frontend, build e lint pedagogico.
- Testes de regressao de conteudo para juros e amortizacao.

### F4 - Responsividade, acessibilidade e estados

Escopo recomendado:

- Resolver navegacao mobile sem sidebar visivel.
- Revisar breakpoints 375px, 768px, 1280px e 1920px quando possivel.
- Validar foco, contraste, labels, aria, estados loading/error/empty/success.
- Melhorar tabelas e graficos em telas pequenas.
- Registrar evidencia visual real se Playwright/browser estiver disponivel.

Arquivos provaveis:

- `frontend/src/components/shell/`
- `frontend/src/components/states/`
- `frontend/src/components/ui/`
- `frontend/src/components/interest/`
- `frontend/src/components/amortization/`
- testes de acessibilidade e responsividade existentes ou novos.

Gates obrigatorios:

- Typecheck, testes frontend e build.
- Smoke visual/a11y quando o ambiente tiver browser instalado.

### F5 - Documentacao viva, evidencias e fechamento da Sprint 3.5

Escopo recomendado:

- Atualizar docs vivos impactados.
- Atualizar `docs/ui/INVENTARIO_TELAS.md`.
- Registrar criterios atendidos e residuos.
- Rodar gates finais.
- Preparar contexto de continuidade para Sprint 4.

Arquivos provaveis:

- `docs/07_UX_UI_e_Navegacao.md`
- `docs/08_Conteudo_Educacional.md`
- `docs/16_Design_System.md`
- `docs/19_Matriz_Rastreabilidade.md`, apenas se houver novo teste/cobertura
  rastreavel.
- `docs/_meta/living_docs.json`
- `docs/ui/INVENTARIO_TELAS.md`
- `docs/sprints/sprint-03-5/`

## 7. Riscos

- Acumulo de modulos sobre shell mobile incompleta.
- Duplicacao de primitivas entre juros e amortizacao.
- Hardcoded colors em graficos fora dos tokens.
- Home e inventario documental defasados em relacao aos modulos ja prontos.
- Tabelas longas e graficos podem funcionar tecnicamente, mas ainda parecer
  densos e pouco premium.
- Falta de browser Playwright no WSL limita evidencia visual automatizada.

## 8. Dependencias

- Node do NVM no WSL: `/home/moses/.nvm/versions/node/v22.21.1/bin`.
- Backend/API ja materializados para simulacoes reais.
- Playwright browsers precisam estar instalados para screenshots/a11y e2e.
- Decisao do PO para priorizar F2/F3/F4 antes da Sprint 4.

## 9. Gates obrigatorios da Sprint 3.5

Gates minimos por fatia documental/visual:

- `make lint-pedagogical`
- `cd frontend && pnpm typecheck`
- `cd frontend && pnpm test -- --run`
- `cd frontend && pnpm build`

Gates adicionais recomendados para fatias de UI:

- Testes de componentes atualizados.
- Smoke visual/a11y quando o browser estiver disponivel.
- Revisao manual de desktop, tablet e mobile.

## 10. Impacto documental

Nesta F1, docs vivos foram avaliados, mas nao alterados. A recomendacao e
deixar as atualizacoes de docs vivos para F5, depois que as melhorias visuais
forem materializadas e testadas.

Docs vivos provavelmente impactados em F5:

- `docs/07_UX_UI_e_Navegacao.md`
- `docs/08_Conteudo_Educacional.md`
- `docs/16_Design_System.md`
- `docs/ui/INVENTARIO_TELAS.md`
- `docs/_meta/living_docs.json`

## 11. Regra de planilha

A planilha operacional nao deve ser alterada pela Codex nesta branch. O registro
permanece sob decisao do PO Moises apos auditoria do Camaleao e materializacao
via GitHub/pipeline.
