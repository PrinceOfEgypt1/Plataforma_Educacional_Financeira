# Relatório de não aceite visual — Item 14F-F6

## 1. Resumo oficial

A validação visual final curta do módulo Financiamento Imobiliário foi reprovada pelo PO.

O estado técnico anterior era favorável: o auditor UI/UX estava zerado, o comando `pnpm audit:uiux` havia sido promovido a gate oficial BLOCKING, o PR de F5 estava materializado na `main` e o módulo não apresentava violações automáticas no contrato UI/UX vigente.

Mesmo assim, a inspeção visual manual demonstrou que a experiência do usuário ainda não atende ao nível esperado para um produto educacional financeiro claro, elegante e guiado.

## Nota canônica de validação F6

Status canônico: REPROVADO VISUALMENTE.

Esta decisão registra que o auditor UI/UX automático permanece zerado e ativo como gate oficial, mas a validação manual do PO identificou necessidade de redesenho da jornada e da arquitetura de informação do módulo Financiamento Imobiliário.

## 2. Resultado

Status da F6: REPROVADA VISUALMENTE.

Decisão:

- Não aceitar o módulo Imóvel como visualmente pronto.
- Não replicar esse padrão para outros módulos.
- Não usar esta interface como referência de design system.
- Não liberar Sprint 5 com base nesta experiência visual.
- Exigir redesenho de arquitetura de informação e jornada antes de nova implementação.

## 3. Evidência qualitativa do PO

Durante a navegação manual, o PO registrou os seguintes problemas principais:

1. Informação duplicada na tela inicial.
2. Navegação confusa por coexistência de dois modelos de menu.
3. Presença de zona chamada “Próximos passos” sem justificativa narrativa forte.
4. Botões “Tabela”, “Comparar”, “Memória” e “Fontes” competindo com as zonas numeradas.
5. Cards com bordas, pesos e estilos inconsistentes.
6. Fontes pequenas, apesar de haver espaço disponível na tela.
7. Rolagem vertical ainda presente em área que deveria funcionar como painel controlado.
8. Conteúdo apertado em regiões pequenas e grandes áreas livres sem função.
9. Duplicidade semântica entre “Fontes” e “Ver fontes”.
10. Ausência de jornada clara, com início, avanço, retorno e conclusão pedagógica.

## 4. Diagnóstico de arquitetura de informação

A interface atual mistura dois paradigmas:

- Navegação por zonas numeradas: Resumo, Parcela, CET, Interpretação e Próximos passos.
- Botões auxiliares paralelos: Tabela, Comparar, Memória e Fontes.

Essa coexistência cria concorrência cognitiva. O usuário não sabe se deve seguir as zonas, clicar nos botões auxiliares, usar a sidebar ou voltar ao início. O resultado é uma experiência com aparência técnica, mas sem “estrada” pedagógica.

## 5. Diagnóstico de jornada do usuário

A jornada esperada para o módulo Imóvel deveria conduzir o usuário por uma narrativa clara:

1. Entender o financiamento.
2. Preencher a simulação.
3. Ler o resultado principal.
4. Entender a parcela.
5. Comparar SAC e PRICE.
6. Conferir CET, fontes, limites e memória de cálculo.
7. Tomar uma decisão mais consciente.

A interface atual não expressa essa estrada de forma clara. Ela apresenta blocos de informação e ações, mas a relação entre eles ainda é confusa.

## 6. Diagnóstico visual

A validação manual indicou problemas de:

- hierarquia visual;
- proporção;
- legibilidade;
- consistência entre cards;
- uso do espaço;
- excesso de áreas vazias;
- conteúdo comprimido;
- rolagem inadequada;
- botões redundantes;
- falta de unidade visual.

A existência de cards coloridos e elementos visualmente mais modernos não é suficiente quando esses elementos não sustentam uma jornada compreensível.

## 7. Relação com o auditor UI/UX

O auditor UI/UX automático é mantido como avanço importante. Ele conseguiu bloquear classes objetivas de regressão, como duplicidades formais, problemas de CTA e regras específicas do contrato.

Entretanto, a F6 demonstra uma limitação importante: auditor automático zerado não equivale a aceite visual, pedagógico e narrativo.

Conclusão: o auditor deve continuar ativo como gate mínimo, mas o aceite visual do PO permanece necessário para avaliar qualidade de experiência, clareza pedagógica e maturidade de produto.

## 8. Causa raiz

A causa raiz não é um componente isolado.

A causa raiz é a falta de uma arquitetura de informação única, com jornada guiada, hierarquia clara e modelo de navegação sem concorrência.

## 9. Decisão de governança

A próxima etapa não deve ser uma correção pontual em componente específico.

A próxima etapa deve ser um redesenho de jornada do módulo Imóvel, antes de nova implementação React.

## 10. Requisitos para a próxima etapa

A próxima etapa deve exigir, no mínimo:

1. Um único modelo de navegação.
2. Remoção de menus concorrentes.
3. Eliminação de duplicidades semânticas.
4. Jornada pedagógica explícita.
5. Indicação clara de etapa atual, avanço e retorno.
6. Fontes mais legíveis.
7. Melhor aproveitamento do espaço.
8. Layout sem rolagem global confusa.
9. Tabela com rolagem interna controlada.
10. Gráfico proporcional.
11. Memória de cálculo realmente explicativa.
12. Fontes e limites integrados sem duplicidade de destino.
13. Cards com propósito claro, não apenas aparência decorativa.
14. Consistência de bordas, pesos visuais e espaçamentos.
15. Validação visual pelo PO antes de replicação para outros módulos.

## 11. Conclusão

A F6 encerra com não aceite visual.

O módulo Financiamento Imobiliário está tecnicamente mais protegido do que antes, mas ainda não alcançou a experiência de usuário desejada para a Plataforma Educacional Financeira.

A decisão recomendada é abrir uma nova etapa de redesenho de jornada, com foco em arquitetura de informação, clareza pedagógica e experiência visual.
