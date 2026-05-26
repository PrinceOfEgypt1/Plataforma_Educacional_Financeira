# Critérios de Aceite Visual — Observatory Dark Cards
## Item 14F-F8C-v6.3

**Status:** pendente_aprovacao_po
**Tipo:** Critérios binários (PASSA / FALHA)
**Data:** 2026-05-26

---

## Instrução de uso

Cada critério abaixo é binário: PASSA ou FALHA. Não há "parcialmente atendido". Para que a implementação React seja autorizada, todos os critérios BLOQUEANTES devem estar em estado PASSA, confirmado por aceite humano do PO.

A IA executora não pode declarar aceite visual. Somente o PO (Moisés) pode declarar aceite.

---

## Bloco A — Fontes

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| A1 | DM Sans está especificada como fonte principal para textos gerais | BLOQUEANTE | ESPECIFICADO — aguarda implementação |
| A2 | DM Mono está especificada como fonte numérica/técnica | BLOQUEANTE | ESPECIFICADO — aguarda implementação |
| A3 | Nenhuma outra fonte é usada sem decisão explícita do PO | BLOQUEANTE | ESPECIFICADO — aguarda implementação |
| A4 | Import correto das duas fontes do Google Fonts está documentado | BLOQUEANTE | ESPECIFICADO |
| A5 | DM Mono é usada em: Score value, Mini val, Checklist num, Before/After body, Question title, Apply block, Check example | BLOQUEANTE | ESPECIFICADO — aguarda implementação |

---

## Bloco B — Tokens de cor

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| B1 | Token `--bg` (`#030811`) registrado e aplicado ao fundo geral | BLOQUEANTE | ESPECIFICADO |
| B2 | Token `--surface` (`#0a1628`) registrado e aplicado ao fundo dos cards | BLOQUEANTE | ESPECIFICADO |
| B3 | Token `--surface2` (`#0f1e35`) registrado | BLOQUEANTE | ESPECIFICADO |
| B4 | Token `--border` (`#1a2f50`) registrado e aplicado às bordas padrão | BLOQUEANTE | ESPECIFICADO |
| B5 | Token `--accent` (`#3b82f6`) registrado e aplicado ao azul principal | BLOQUEANTE | ESPECIFICADO |
| B6 | Token `--accent2` (`#06b6d4`) registrado e aplicado ao ciano | BLOQUEANTE | ESPECIFICADO |
| B7 | Token `--gold` (`#f59e0b`) registrado e aplicado a exemplos e insights | BLOQUEANTE | ESPECIFICADO |
| B8 | Token `--green` (`#10b981`) registrado e aplicado ao estado vencedor/after | BLOQUEANTE | ESPECIFICADO |
| B9 | Token `--red` (`#ef4444`) registrado e aplicado ao estado before/negativo | BLOQUEANTE | ESPECIFICADO |
| B10 | Token `--text` (`#e2e8f0`) registrado e aplicado ao texto principal | BLOQUEANTE | ESPECIFICADO |
| B11 | Token `--text-muted` (`#64748b`) registrado | BLOQUEANTE | ESPECIFICADO |
| B12 | Token `--text-dim` (`#94a3b8`) registrado e aplicado a labels e notas | BLOQUEANTE | ESPECIFICADO |
| B13 | Nenhum token de cor genérico ("azul", "verde", "cinza escuro") é usado em substituição | BLOQUEANTE | ESPECIFICADO — aguarda implementação |

---

## Bloco C — Escala tipográfica

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| C1 | Escala tipográfica completa registrada no Design System | BLOQUEANTE | ESPECIFICADO |
| C2 | Body: 15px, DM Sans, line-height 1.6 | BLOQUEANTE | ESPECIFICADO |
| C3 | Score value: 2.4rem, DM Mono, font-weight 500, line-height 1 | BLOQUEANTE | ESPECIFICADO |
| C4 | Score label: 0.78rem, DM Sans, font-weight 700, uppercase, letter-spacing 0.08em | BLOQUEANTE | ESPECIFICADO |
| C5 | Section h2: 1.1rem, DM Sans, font-weight 700, uppercase, letter-spacing 0.06em, ciano | BLOQUEANTE | ESPECIFICADO |
| C6 | Checklist number: 0.9rem, DM Mono, font-weight 500, azul | BLOQUEANTE | ESPECIFICADO |
| C7 | Mini value: 0.75rem, DM Mono, text-align right | BLOQUEANTE | ESPECIFICADO |
| C8 | Before/After body: 0.8rem, DM Mono, line-height 1.7 | BLOQUEANTE | ESPECIFICADO |
| C9 | Question title: 0.7rem, DM Mono, uppercase, letter-spacing 0.1em | BLOQUEANTE | ESPECIFICADO |
| C10 | Apply block: 0.75rem, DM Mono, line-height 1.7, dourado | BLOQUEANTE | ESPECIFICADO |

---

## Bloco D — Layout tokens

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| D1 | Layout tokens registrados (max-width, padding, gaps) | BLOQUEANTE | ESPECIFICADO |
| D2 | score-grid: 3 colunas, gap 1rem | BLOQUEANTE | ESPECIFICADO |
| D3 | task-grid: 2 colunas, gap 1rem | BLOQUEANTE | ESPECIFICADO |
| D4 | ba-grid: 2 colunas iguais, gap 1.2rem | BLOQUEANTE | ESPECIFICADO |
| D5 | q-grid: 3 colunas, gap 1rem | BLOQUEANTE | ESPECIFICADO |
| D6 | apply-grid: 2 colunas, gap 1rem | BLOQUEANTE | ESPECIFICADO |

---

## Bloco E — UI Elements

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| E1 | Score Card especificado com label, valor, barra, nota, cores e tamanhos | BLOQUEANTE | ESPECIFICADO |
| E2 | Score Card estado comum: border `1px solid #1a2f50` | BLOQUEANTE | ESPECIFICADO |
| E3 | Score Card estado destacado: border-color `#10b981`, box-shadow `rgba(16,185,129,.12)` | BLOQUEANTE | ESPECIFICADO |
| E4 | Máximo 2 cards destacados por tela | BLOQUEANTE | ESPECIFICADO |
| E5 | Metric Card especificado com mini barras, valores alinhados à direita, width 32px | BLOQUEANTE | ESPECIFICADO |
| E6 | Metric Card mini-label width 100px | BLOQUEANTE | ESPECIFICADO |
| E7 | Checklist Card especificado com header gradient, linhas numeradas, exemplo/detalhe | BLOQUEANTE | ESPECIFICADO |
| E8 | Checklist Card border `1px solid #3b82f6` (azul, não a borda padrão) | BLOQUEANTE | ESPECIFICADO |
| E9 | Checklist Card grid de linha: `30px 160px 1fr` | BLOQUEANTE | ESPECIFICADO |
| E10 | Before/After Card especificado com 2 colunas, before borda padrão, after borda verde | BLOQUEANTE | ESPECIFICADO |
| E11 | Before/After Card sem uso de sinal de multiplicação Unicode em "SAC x PRICE" | BLOQUEANTE | ESPECIFICADO |
| E12 | Question Card especificado com watermark numérico (`rgba(59,130,246,.06)`, 4rem, DM Mono) | BLOQUEANTE | ESPECIFICADO |
| E13 | Insight Box especificado com gradiente dourado sutil, border `rgba(245,158,11,.25)` | BLOQUEANTE | ESPECIFICADO |
| E14 | Apply Card especificado com tag ciano, bloco interno DM Mono dourado | BLOQUEANTE | ESPECIFICADO |

---

## Bloco F — Distribuição textual e layout interno

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| F1 | Regra de distribuição textual interna dos cards registrada | BLOQUEANTE | ESPECIFICADO |
| F2 | Nenhum card pode parecer "amontoado" | BLOQUEANTE | AGUARDA implementação |
| F3 | Nenhum texto pode encostar visualmente na borda | BLOQUEANTE | AGUARDA implementação |
| F4 | Valores numéricos alinhados à direita em linhas de métrica | BLOQUEANTE | ESPECIFICADO |
| F5 | Labels alinhados à esquerda | BLOQUEANTE | ESPECIFICADO |
| F6 | Números financeiros usam DM Mono obrigatoriamente | BLOQUEANTE | ESPECIFICADO |
| F7 | Títulos usam caixa alta e letter-spacing quando a referência usa | BLOQUEANTE | ESPECIFICADO |
| F8 | Cards do mesmo grupo têm altura visual equivalente | RECOMENDADO | AGUARDA implementação |
| F9 | Grids mantêm alinhamento horizontal entre cards vizinhos | RECOMENDADO | AGUARDA implementação |

---

## Bloco G — Regras de governança e escopo

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| G1 | Regra de proibição de interpretação livre registrada | BLOQUEANTE | ESPECIFICADO |
| G2 | Mapeamento dos 7 UI Elements por etapa da jornada presente | BLOQUEANTE | ESPECIFICADO |
| G3 | As 7 etapas da jornada F8C-v6.2 preservadas e referenciadas | BLOQUEANTE | ESPECIFICADO |
| G4 | Preservação e não enfraquecimento da F8C-v6.2 declarada | BLOQUEANTE | ESPECIFICADO |
| G5 | Proibição de alteração de frontend declarada | BLOQUEANTE | ESPECIFICADO |
| G6 | Proibição de alteração de backend declarada | BLOQUEANTE | ESPECIFICADO |
| G7 | Implementação React não autorizada declarada | BLOQUEANTE | ESPECIFICADO |
| G8 | Aprovação humana obrigatória declarada | BLOQUEANTE | ESPECIFICADO |
| G9 | IA executora não pode declarar aceite visual | BLOQUEANTE | ESPECIFICADO |
| G10 | IA executora não pode declarar Sprint 5 liberada | BLOQUEANTE | ESPECIFICADO |

---

## Bloco H — Nomenclatura

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| H1 | "SAC x PRICE" (letra x minúscula) é a única forma autorizada | BLOQUEANTE | ESPECIFICADO |
| H2 | Ausência de sinal de multiplicação Unicode em referências a SAC x PRICE | BLOQUEANTE | ESPECIFICADO |
| H3 | Ausência de "SAC" sozinho quando a comparação for o tema | BLOQUEANTE | ESPECIFICADO |

---

## Bloco I — Contrato JSON e validação

| # | Critério | Tipo | Estado atual |
|---|---|---|---|
| I1 | CONTRATO_VISUAL_IMOVEL_V6_3.json é JSON válido | BLOQUEANTE | A verificar |
| I2 | Campo `implementacao_react_autorizada = false` presente | BLOQUEANTE | A verificar |
| I3 | Campo `fidelidade_visual.interpretacao_livre_permitida = false` presente | BLOQUEANTE | A verificar |
| I4 | Campo `aprovacao_humana.obrigatoria = true` presente | BLOQUEANTE | A verificar |
| I5 | Campo `ia_pode_declarar_aprovado = false` presente | BLOQUEANTE | A verificar |
| I6 | Script validate-observatory-cards.mjs executa sem erros | BLOQUEANTE | A verificar |
| I7 | Script retorna exit code 0 em todos os checks | BLOQUEANTE | A verificar |

---

## Declaração final

Este adendo é uma entrega documental/contratual. Nenhuma implementação React foi feita. Nenhum arquivo de frontend ou backend foi alterado. O aceite visual humano ainda não ocorreu e depende exclusivamente do PO (Moisés). Todos os critérios marcados como "AGUARDA implementação" serão verificados somente após a futura implementação React ser autorizada e executada.
