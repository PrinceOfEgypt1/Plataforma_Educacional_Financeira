# Critérios de aceite para protótipo pós-F7 — Módulo Imóvel

## Nota canônica F7

Este documento integra o redesenho técnico-funcional da jornada do módulo Imóvel.

A especificação F7 exige arquitetura de informação clara, rastreabilidade numérica, auditor UI/UX preservado como gate oficial, eliminação de menus concorrentes e manutenção do backend como fonte de verdade financeira.


## 1. Objetivo

Definir critérios de aceite para a próxima entrega visual ou implementação React baseada na F7.

## 2. Critérios bloqueantes de UX

A entrega deve ser rejeitada se:

1. Existirem dois menus concorrentes para os mesmos destinos.
2. Houver duplicidade semântica entre card, botão e aba.
3. A jornada não indicar etapa atual, avanço e retorno.
4. A tela inicial não explicar o caminho do usuário.
5. “Próximos passos” aparecer como item genérico sem narrativa clara.
6. Fontes principais continuarem pequenas e difíceis de ler.
7. A interface mantiver rolagem global confusa.
8. Conteúdo ficar apertado enquanto há grandes áreas vazias.
9. Tabela aparecer como página longa sem rolagem interna delimitada.
10. Gráfico comparativo ficar achatado ou desproporcional.
11. Memória de cálculo não explicar fórmula, variáveis, valores substituídos e arredondamento.
12. Fontes e limites aparecerem duplicados em destinos concorrentes.

## 3. Critérios bloqueantes técnicos

A entrega deve ser rejeitada se:

1. Alterar backend ou fórmulas sem autorização explícita.
2. Enfraquecer ou remover o auditor UI/UX.
3. Remover testes para facilitar aprovação.
4. Reintroduzir divergência entre resumo, tabela, gráfico e memória.
5. Usar frontend como fonte de verdade financeira central.
6. Usar marcadores de pendência, rótulos provisórios ou expressões de indefinição como substituto de decisão.
7. Entregar mojibake em qualquer documento, código, relatório ou evidência.
8. Aplicar patch incremental sem respeitar a especificação de jornada.

## 4. Critérios positivos de aceite

A entrega candidata deve demonstrar:

- uma jornada guiada única;
- tela inicial orientadora;
- hierarquia visual clara;
- fontes legíveis;
- cards com propósito único;
- tabela controlada;
- gráfico proporcional;
- memória educativa;
- fontes e limites claros;
- rastreabilidade numérica;
- testes de jornada;
- auditor UI/UX total=0;
- build, lint, typecheck e testes verdes.

## 5. Evidências mínimas exigidas

A entrega futura deve apresentar:

- relatório técnico;
- prints ou descrição visual das etapas;
- lista de arquivos alterados;
- escopo permitido/proibido respeitado;
- resultado de auditor UI/UX;
- testes funcionais da jornada;
- validação de consistência numérica;
- evidência de que não houve alteração indevida em backend ou contrato financeiro.

## 6. Decisão de aceite

A implementação pós-F7 só deve ser materializada se passar por:

1. auditoria material do Camaleão;
2. validação técnica;
3. validação visual do PO;
4. decisão explícita de Moisés.
