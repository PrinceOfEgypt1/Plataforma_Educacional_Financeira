# Sprint 3.5/F2 - Implementacao UI/UX

Data: 2026-05-03
Branch: `sprint-3.5/f2-fundacao-visual-design-system-codex`

## 1. Objetivo da fatia

Materializar a fundacao visual e o design system aplicado antes do polimento
profundo das paginas reais em F3. A entrega fortalece shell, navegacao,
tokens, home, estados visuais e padrao de paginas internas, preservando
calculos, backend, API e contratos.

## 2. Alteracoes principais

### Tokens e base visual

- `frontend/src/styles/tokens.css`: adicionados tokens de superficie, marca
  suave, cor pedagogica, foco, radius e sombras.
- `frontend/src/styles/tokens.ts`: tokens equivalentes adicionados para manter
  contrato TypeScript.
- `frontend/tailwind.config.ts`: Tailwind passou a consumir CSS vars do design
  system em vez de cores hardcoded de marca.
- `frontend/src/app/globals.css`: fundo global da aplicacao e foco visivel
  passaram a usar tokens oficiais.

### Shell e navegacao

- `BackLink.tsx`: acao padronizada de voltar ao dashboard.
- `ModuleHeader.tsx`: cabecalho padronizado de modulo com grupo, status,
  titulo, descricao e acao de voltar.
- `MobileModuleNav.tsx`: menu compacto recolhivel para telas menores.
- `ShellLayout.tsx`, `Header.tsx`, `Sidebar.tsx` e `NavItem.tsx`: reforco de
  hierarquia, estados ativos, status semantico e organizacao visual.

### Home/dashboard

- `frontend/src/app/(app)/page.tsx`: primeira tela reorganizada para priorizar
  a acao principal e os modulos disponiveis.
- Modulos disponiveis e modulos em breve agora aparecem em secoes separadas.
- A home deixou de apresentar todos os 12 modulos como uma massa visual unica.

### Paginas internas

- `/juros` e `/amortizacao` receberam o `ModuleHeader` e a acao clara de
  voltar, sem redesenho profundo das areas funcionais.
- Modulos em breve passaram a usar o mesmo header, aviso informativo e estado
  vazio visualmente mais consistente.

### Componentes UI e estados

- `AlertBanner` ganhou superficie visual por nivel.
- `SummaryCard` e `EducationPanel` foram alinhados ao radius/sombra da
  fundacao visual.
- `EmptyState`, `LoadingState` e `ErrorState` ganharam superficies mais claras
  e coerentes com o design system.

## 3. Testes atualizados

- `home.test.tsx`: valida separacao entre disponiveis e em breve.
- `routes.test.tsx`: valida acao de voltar e aviso de modulo em breve.
- `ShellLayout.test.tsx`: valida navegacao compacta mobile.
- `tokens.test.ts`: valida novos tokens de fundacao visual.

## 4. Limites preservados

- Nenhuma mudanca em backend.
- Nenhuma mudanca em calculos financeiros.
- Nenhuma mudanca em API/OpenAPI.
- Nenhuma mudanca em pipeline/workflow.
- Nenhuma mudanca no Prompt-Mestre.
- Nenhuma mudanca em planilha operacional.
- Nenhuma mudanca em docs baseline.
- Nenhuma implementacao de Sprint 4 ou novo modulo financeiro.

## 5. Residuos e proximas fatias

- O polimento profundo de formulario, resultado, grafico, tabela,
  interpretacao e conteudo educacional de `/juros` e `/amortizacao` permanece
  para F3.
- Responsividade fina, breakpoints e validacao visual/a11y ampla permanecem
  para F4.
- Screenshot Playwright nao foi gerado porque o Chromium do Playwright nao esta
  instalado no ambiente WSL.
