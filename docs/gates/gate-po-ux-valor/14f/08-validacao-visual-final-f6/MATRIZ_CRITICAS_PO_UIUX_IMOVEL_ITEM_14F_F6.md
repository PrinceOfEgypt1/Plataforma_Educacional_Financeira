# Matriz de críticas PO/UX — Item 14F-F6

## 1. Objetivo

Esta matriz registra as críticas do PO durante a validação visual final curta do módulo Financiamento Imobiliário.

## Nota canônica de validação F6

Status canônico: REPROVADO VISUALMENTE.

Esta decisão registra que o auditor UI/UX automático permanece zerado e ativo como gate oficial, mas a validação manual do PO identificou necessidade de redesenho da jornada e da arquitetura de informação do módulo Financiamento Imobiliário.

## 2. Matriz

| ID | Evidência visual | Crítica do PO | Classificação | Severidade | Encaminhamento |
|---|---|---|---|---|---|
| F6-UX-001 | Tela inicial | Informação duplicada em elementos distintos da tela | Duplicidade semântica | Alta | Redesenhar tela inicial com função clara para cada bloco |
| F6-UX-002 | Tela de resultado | Dois modelos concorrentes de navegação: zonas numeradas e botões auxiliares | Arquitetura de informação | Crítica | Definir um único modelo de navegação |
| F6-UX-003 | Menu por zonas | Item “Próximos passos” aparece como zona sem narrativa suficientemente forte | Nomenclatura e jornada | Média | Reavaliar nomenclatura e posição como encerramento guiado |
| F6-UX-004 | Botões abaixo das zonas | Botões “Tabela”, “Comparar”, “Memória” e “Fontes” competem com as zonas | Navegação concorrente | Alta | Remover ou incorporar esses destinos ao fluxo principal |
| F6-UX-005 | Cards de resultado | Cards com bordas e pesos visuais inconsistentes | Consistência visual | Média | Unificar padrão visual dos cards |
| F6-UX-006 | Tela de resultado | Fontes pequenas apesar de haver espaço disponível | Legibilidade | Alta | Aumentar escala tipográfica e rever densidade visual |
| F6-UX-007 | Zona Parcela | Rolagem vertical presente em área que deveria evitar rolagem global confusa | Layout e navegação | Alta | Criar painel com rolagem interna delimitada apenas quando necessário |
| F6-UX-008 | Zona Interpretação | Conteúdo apertado em pequena área e grande espaço vazio sem função | Uso do espaço | Alta | Redesenhar distribuição em grid/painel proporcional |
| F6-UX-009 | Zona Próximos passos | Duplicidade entre “Fontes” e “Ver fontes” | Duplicidade de destino | Alta | Eliminar duplicidade ou diferenciar propósito de forma explícita |
| F6-UX-010 | Jornada geral | Usuário se perde e não percebe estrada clara de uso | Jornada do usuário | Crítica | Redesenhar fluxo: início, simulação, análise, comparação, decisão |
| F6-UX-011 | Tela inicial | Cards bonitos, mas sem conteúdo suficiente para orientar | Valor pedagógico | Alta | Transformar cards em orientação útil e contextual |
| F6-UX-012 | Experiência geral | A interface melhorou tecnicamente, mas permanece confusa | Aceite visual | Crítica | Reprovar visualmente e exigir redesenho |

## 3. Síntese da matriz

Total de críticas registradas: 12.

Distribuição por severidade:

- Crítica: 3
- Alta: 7
- Média: 2
- Baixa: 0

## 4. Conclusão da matriz

A reprovação da F6 não decorre de um defeito isolado. Ela decorre de uma combinação de problemas de jornada, navegação, hierarquia visual e arquitetura de informação.

O encaminhamento correto é redesenho do módulo, não nova rodada de remendos incrementais.
