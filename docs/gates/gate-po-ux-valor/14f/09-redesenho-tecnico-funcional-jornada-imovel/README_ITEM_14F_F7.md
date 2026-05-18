# Item 14F-F7 — Redesenho técnico-funcional da jornada do módulo Imóvel

## Nota canônica F7

Este documento integra o redesenho técnico-funcional da jornada do módulo Imóvel.

A especificação F7 exige arquitetura de informação clara, rastreabilidade numérica, auditor UI/UX preservado como gate oficial, eliminação de menus concorrentes e manutenção do backend como fonte de verdade financeira.


## 1. Identificação

- Projeto: Plataforma Educacional Financeira
- Gate: PO/UX/Valor
- Item: 14F-F7
- Módulo: Financiamento Imobiliário
- Tipo: redesenho técnico-funcional de jornada
- Estado de entrada: F5 concluída com auditor UI/UX como gate oficial BLOCKING; F6 concluída com reprovação visual formal pelo PO
- Escopo: documentação, arquitetura de informação, requisitos de jornada, rastreabilidade e critérios de aceite
- Fora de escopo: implementação React, alteração de backend, alteração de fórmulas financeiras, alteração do auditor UI/UX para facilitar aprovação

## 2. Decisão de governança

A F7 nasce da reprovação visual F6. A decisão central é interromper remendos incrementais no módulo Imóvel e produzir uma especificação de redesenho antes de qualquer nova implementação.

O módulo Imóvel deve ser redesenhado como uma jornada guiada, com um único modelo de navegação, hierarquia visual clara, rastreabilidade numérica e linguagem pedagógica.

## 3. Objetivo da F7

Criar uma base técnica e funcional para orientar a próxima implementação do módulo Imóvel, garantindo que a futura entrega não repita os problemas da F6:

- menus concorrentes;
- duplicidade semântica;
- fontes pequenas;
- conteúdo apertado;
- grandes áreas vazias;
- rolagem global confusa;
- cards decorativos sem função;
- ausência de estrada pedagógica;
- risco de divergência entre tabela, gráfico, resumo e memória.

## 4. Artefatos desta pasta

- `ESPECIFICACAO_REDESENHO_JORNADA_IMOVEL_ITEM_14F_F7.md`
- `MATRIZ_REQUISITOS_TECNICO_FUNCIONAIS_IMOVEL_ITEM_14F_F7.md`
- `ARQUITETURA_FLUXO_DADOS_RASTREABILIDADE_IMOVEL_ITEM_14F_F7.md`
- `CRITERIOS_ACEITE_PROTOTIPO_IMOVEL_ITEM_14F_F7.md`
- `PROMPT_BASE_IMPLEMENTACAO_POS_F7_IMOVEL_ITEM_14F_F7.md`

## 6. Regra técnica canônica

O backend deve permanecer como fonte de verdade financeira.

A futura interface deve renderizar, explicar e organizar os valores recebidos, mas não deve transformar o frontend em fonte de verdade financeira para parcela, juros, saldo, totais, tabela, gráfico ou memória de cálculo.

## 5. Resultado esperado

Ao final da F7, a Plataforma Educacional Financeira deverá possuir uma especificação clara para redesenhar o módulo Imóvel sem improviso visual e sem remendo incremental.
