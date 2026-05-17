# PEF — Critérios de Rejeição Automática Frontend/UI/UX

## 1. Finalidade

Este documento define situações que reprovam automaticamente uma entrega frontend da PEF.

A lista deve orientar auditorias humanas, prompts para IA executora e, progressivamente, scripts bloqueantes.

## 2. Rejeições de jornada

### UX-JOURNEY-REJECT-001 — Jornada inexistente ou confusa

Reprovar se o usuário não consegue identificar ação principal, resultado principal ou próximo passo.

### UX-JOURNEY-REJECT-002 — Zonas misturadas

Reprovar se o módulo mistura conteúdos de várias zonas em uma tela longa quando o contrato exige painéis mutuamente exclusivos.

### UX-JOURNEY-REJECT-003 — Estado ativo ausente

Reprovar se a navegação por abas, zonas ou etapas não indica claramente onde o usuário está.

## 3. Rejeições de CTAs e cards

### UX-CTA-REJECT-001 — Rótulo incompatível com destino

Reprovar se um botão promete uma ação específica e leva para destino genérico ou incorreto.

Exemplo:

```txt
"Ver CET" abre Resumo em vez de CET.
```

### UX-CTA-REJECT-002 — CTAs diferentes com o mesmo destino sem justificativa

Reprovar se botões ou cards diferentes conduzem ao mesmo destino sem diferença clara de propósito.

### UX-CARD-REJECT-001 — Card decorativo ou redundante

Reprovar se cards existem apenas para ocupar espaço, duplicam informação ou confundem a jornada.

## 4. Rejeições de informação financeira

### UX-FIN-REJECT-001 — Resultado sem rastreabilidade

Reprovar se resultado financeiro relevante não tem caminho claro para memória de cálculo, premissas e interpretação.

### UX-FIN-REJECT-002 — Informação repetida sem contexto

Reprovar se a mesma informação financeira aparece em múltiplos lugares sem função pedagógica distinta.

### UX-FIN-REJECT-003 — CET opaco

Reprovar se CET aparece sem explicação de componentes, hipóteses ou interpretação mínima.

## 5. Rejeições de tabela e gráfico

### UX-TABLE-REJECT-001 — Tabela longa sem controle de leitura

Reprovar se tabela financeira longa não possui paginação, blocos, rolagem interna delimitada ou orientação de leitura.

### UX-TABLE-REJECT-002 — Colunas sem explicação

Reprovar se saldo, juros, amortização, encargos, parcela ou saldo final aparecem sem cabeçalhos claros e sem orientação pedagógica.

### UX-CHART-REJECT-001 — Gráfico ilegível ou desproporcional

Reprovar se gráfico comparativo está achatado, sem altura suficiente, sem legenda clara, sem escala legível ou sem interpretação.

## 6. Rejeições de estados de UI

### UX-STATE-REJECT-001 — Loading ausente em ação assíncrona crítica

Reprovar se ação assíncrona crítica não mostra feedback.

### UX-STATE-REJECT-002 — Erro sem recuperação

Reprovar se erro técnico ou de validação não orienta como corrigir.

### UX-STATE-REJECT-003 — Estado vazio sem orientação

Reprovar se tela inicial ou estado vazio não explica o que o usuário deve fazer.

## 7. Rejeições de responsividade

### UX-MOBILE-REJECT-001 — Mobile inutilizável

Reprovar se em largura mobile a tela exige esforço excessivo, espreme conteúdo essencial, perde ações críticas ou mistura zonas.

### UX-MOBILE-REJECT-002 — Elemento fixo largo em mobile

Reprovar se sidebar, tabela, gráfico ou painel lateral compromete o espaço principal sem alternativa mobile.

## 8. Rejeições de acessibilidade

### UX-A11Y-REJECT-001 — Ação principal inacessível por teclado

Reprovar se a jornada principal não pode ser operada por teclado.

### UX-A11Y-REJECT-002 — Botão sem nome acessível

Reprovar se CTA crítico não tem nome acessível coerente.

### UX-A11Y-REJECT-003 — Foco invisível

Reprovar se elementos interativos críticos não possuem foco visível.

## 9. Rejeições técnicas de qualidade textual

### UX-TEXT-REJECT-001 — Texto temporário

Reprovar se código, interface, relatório ou documentação materializável contém `marcador de tarefa pendente`, `marcador temporário de conteúdo`, `marcador temporário de conteúdo`, `a definir` ou marcador equivalente como substituto de decisão real.

### UX-TEXT-REJECT-002 — Mojibake

Reprovar se houver acentuação corrompida em material oficial.

### UX-TEXT-REJECT-003 — Promessa fabricada

Reprovar se relatório afirma execução de browser, screenshots, HAR, Lighthouse, testes ou gates sem evidência material.

## 10. Rejeições de governança

### UX-GOV-REJECT-001 — Correção sem vínculo com critério

Reprovar se a entrega corrige UI/UX sem apontar qual critério de governança foi atendido.

### UX-GOV-REJECT-002 — Escopo visual sem evidência

Reprovar se mudança visual é proposta sem screenshot, teste de jornada ou saída do auditor.

### UX-GOV-REJECT-003 — Alteração fora do escopo

Reprovar se frontend visual altera backend, fórmula, API, dependência ou lockfile sem autorização explícita.

## 11. Relação com auditor automático

Cada rejeição deve ser mapeada futuramente para um código executável. O auditor pode começar com heurísticas estáticas simples e evoluir para validações AST, E2E e snapshots.
