# Matriz de Comparação contra a F8D Reprovada — 14F-F8E

**Princípio**: comparação honesta, não autopromocional. Quando esta entrega tem fragilidade, ela é declarada aqui mesmo.

A F8D foi tratada como **antirreferência**: nada da sua composição visual foi reaproveitado. O ponto de partida foi o `guia-prompt-checklist.html` aprovado pelo PO, não a tela reprovada.

---

## Tabela comparativa

| # | Critério | F8D reprovada | F8E proposta | Evidência prática |
|---|---|---|---|---|
| 1 | Aparência de **cockpit antigo** (dashboard técnico engessado) | Sim | Não | F8E nasce do zero como single-page educacional, com stepper sticky e sub-tabs contextuais por etapa — não há HUD/painel de controle estilo console. |
| 2 | **Sensação de remendo** sobre estrutura preexistente | Sim | Não | F8E é um arquivo HTML autônomo de ~2.000 linhas, sem reaproveitamento de marcação anterior. Cada painel foi construído a partir dos tokens do contrato F8C-v6.3. |
| 3 | **Hierarquia visual premium** | Não | Sim | Toda card segue o padrão `eyebrow (mono) → título (sans 1rem, branco) → corpo (sans 0,82–0,9rem, texto-dim) → ação`. Espaçamento interno padronizado em `1.2–1.4rem`. |
| 4 | Cards com **unidade visual** | Não | Sim | Todos os cards usam `background #0a1628`, `border 1px solid #1a2f50`, `border-radius 12–14px`. ScoreCard, MetricCard, ChecklistCard etc. compartilham o mesmo DNA visual. |
| 5 | Uso real de **Observatory Dark Cards** | Parcial | Sim | Paleta aplicada por CSS variables exatamente como no `CONTRATO_VISUAL_IMOVEL_V6_3.json`. Inclui Cards Aurora com borda em gradiente para destaques de síntese. |
| 6 | **Navegação clara em 7 etapas** | Parcial | Sim | Stepper sticky no topo com numeração mono, label DM Sans e estado ativo destacado por gradiente. Sub-tabs por etapa abaixo. |
| 7 | **Densidade controlada** | Não | Sim | Layout em grid com proporções 60/40, 65/35 e 1/1; nenhum painel ultrapassa 6 unidades visuais simultâneas. Banner de governança no rodapé separa o conteúdo do aviso. |
| 8 | **Sem rolagem confusa** | Não | Sim | Rolagem vertical controlada por painel; tabelas paginadas (8 linhas/página) ficam dentro de `scroll-x` interno, sem provocar rolagem horizontal global. |
| 9 | **Parece produto final** | Não | Sim, candidato a aceite | Acabamento em hover (translateY -2px), gradientes radiais ambientais no plano de fundo, status pill mono no topo, micro-fade entre painéis. |
| 10 | **Tipografia DM Sans + DM Mono** consistente | Parcial | Sim | DM Sans em corpo e títulos; DM Mono em números, labels técnicos, KPIs, fórmulas e tags. Fallbacks declarados. |
| 11 | **Conteúdo pedagógico real** (não apenas estrutura) | Parcial | Sim | Todas as 35 abas têm texto educacional do cenário fixo, sem rascunhos. Inclui auditoria de 5 verificações, checklist de 10 itens e 4 ApplyCards. |
| 12 | **Cenário fixo aplicado** (R$ 870k / R$ 700k / R$ 170k / 120m / 0,85%) | Parcial | Sim | Cenário aparece no painel superior fixo, na simulação, no resultado, nas tabelas SAC e PRICE, e na auditoria. Valores derivados (parcela 1, juros totais, economia) calculados em JS no protótipo. |
| 13 | **Aceite visual humano possível sem rodar backend** | Parcial | Sim | Arquivo HTML autônomo. Não exige `pnpm`, `npm`, build, Docker, banco de dados. Abre direto no navegador. |
| 14 | **Risco de mascarar falha visual com CSS superficial** | Sim (na F8D) | Não | Aqui não houve tentativa de "pintar" o cockpit antigo; o protótipo foi construído da arquitetura visual para cima. |
| 15 | **Sem implementação React (escopo da frente)** | N/A | Sim, intencional | F8E é explicitamente protótipo visual; nenhuma linha de React, JSX, TSX ou backend foi escrita. Frontend real permanece intocado. |

---

## Onde a F8E tem fragilidade declarada honestamente

| Fragilidade | Por que existe | Mitigação |
|---|---|---|
| **Sem screenshots automatizados** | Ambiente cloud headless desta sessão não tem Chromium/Playwright | Opção B do prompt: `evidencias/COMO_VALIDAR_VISUALMENTE.md` orienta a captura manual em 4 viewports |
| **Cálculos em JS no protótipo, não no backend** | Por contrato F8E proíbe motor financeiro | Aviso explícito no rodapé do `index.html`; valores demonstrativos consistentes com o cenário fixo |
| **Avaliação visual final depende exclusivamente do PO** | Por contrato, IA não pode declarar aprovado | É a intenção: a frente F8E existe justamente para que o aceite humano seja a única porta para a F8F |
| **Densidade de informação em telas pequenas (< 380px)** | Otimização principal foi 1920×1080 e notebook | Cards empilham via media queries até 700px; abaixo disso ainda funciona mas com mais rolagem |
| **Cards Aurora têm gradiente animado discreto** | Acabamento decorativo | Pode ser removido ou ajustado em iteração futura sem mudar arquitetura |
| **Sem tema light** | Por contrato Observatory Dark é a estética obrigatória | Não está no escopo desta frente |

---

## Conclusão honesta

A F8E **não tenta esconder** o que herdou de risco da F8D: o ambiente cloud não permite screenshots automáticos, e o aceite final cabe exclusivamente ao PO.

O que ela faz é diferente: **abandonar a base visual reprovada** e reconstruir a tela a partir dos tokens, da tipografia e da hierarquia que encantaram o PO no `guia-prompt-checklist.html`. A intenção é entregar uma interface que **pareça produto** já na primeira impressão, e que tenha a profundidade pedagógica necessária nas 35 abas para sustentar essa primeira impressão.

Se Moisés abrir, navegar e disser "sim, é isso", a frente F8F nasce com um alvo visual concreto. Se disser "não é isso", a próxima rodada de protótipo começa com diagnóstico em vez de adivinhação.
