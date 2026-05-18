# Especificação de redesenho da jornada — Item 14F-F7

## Nota canônica F7

Este documento integra o redesenho técnico-funcional da jornada do módulo Imóvel.

A especificação F7 exige arquitetura de informação clara, rastreabilidade numérica, auditor UI/UX preservado como gate oficial, eliminação de menus concorrentes e manutenção do backend como fonte de verdade financeira.


## 1. Princípio central

O módulo Financiamento Imobiliário deve deixar de ser uma tela com blocos concorrentes e passar a ser uma jornada guiada.

A experiência deve funcionar como uma estrada pedagógica:

1. Entender.
2. Simular.
3. Ler o resultado.
4. Explorar a parcela.
5. Comparar cenários.
6. Conferir memória, fontes e limites.
7. Decidir com consciência.

## 2. Modelo único de navegação

A nova interface deve adotar apenas um modelo principal de navegação.

É proibido manter dois menus concorrentes, como:

- zonas numeradas;
- botões paralelos de tabela, comparação, memória e fontes;
- cards que levam aos mesmos destinos sem diferença clara de propósito.

A navegação deve ser uma trilha guiada, com estado atual visível, avanço e retorno claros.

## 3. Proposta de jornada

A nova jornada deve ser organizada em etapas semânticas:

| Etapa | Nome sugerido | Função |
|---|---|---|
| 1 | Preparar | Explicar o que será simulado e quais dados serão necessários |
| 2 | Simular | Coletar valor do imóvel, entrada, prazo, taxa e sistema |
| 3 | Resultado | Mostrar parcela inicial, última parcela, total pago, juros e saldo |
| 4 | Entender a parcela | Decompor amortização, juros, seguros, tarifas e encargos |
| 5 | Comparar sistemas | Comparar SAC e PRICE com gráfico proporcional e leitura guiada |
| 6 | Conferir cálculo | Exibir memória de cálculo, fórmulas, arredondamento e rastreabilidade |
| 7 | Decidir | Apresentar fontes, limites, alertas, cuidados e checklist antes do contrato |

## 4. Substituição do termo “Próximos passos”

O termo “Próximos passos” não deve aparecer como item genérico de menu principal sem narrativa forte.

Quando a interface tratar da etapa final, preferir nomes mais claros:

- Decidir;
- Antes de contratar;
- Checklist final;
- Conferência final.

A escolha final deve ser validada visualmente pelo PO.

## 5. Tela inicial

A tela inicial não deve apenas exibir cards bonitos.

Ela deve explicar a jornada e orientar o usuário:

- o que será calculado;
- o que o usuário precisa informar;
- o que será comparado;
- que a simulação não substitui proposta bancária;
- onde encontrar memória, fontes e limites.

Os cards da tela inicial devem ter propósito único. Cada card deve responder a uma pergunta do usuário ou iniciar uma etapa clara da jornada.

## 6. Resultado principal

O resultado principal deve ser a tela de leitura imediata do financiamento.

Ela deve priorizar:

- primeira parcela;
- última parcela;
- total de juros;
- total pago;
- saldo amortizado;
- sistema escolhido;
- prazo;
- taxa mensal.

A leitura deve ser maior, legível e com hierarquia visual clara.

## 7. Entender a parcela

A etapa de parcela deve explicar a composição do valor mensal.

Ela deve evitar rolagem global confusa.

Quando o conteúdo for maior que o painel, usar:

- bloco expansível;
- rolagem interna delimitada;
- cards compactos;
- resumo fixo;
- microcopy contextual.

## 8. Comparar sistemas

A comparação SAC x PRICE deve usar gráfico proporcional, com altura adequada, eixo Y legível e leitura pedagógica.

O gráfico não deve ficar achatado.

A comparação deve explicar:

- qual sistema começa mais caro;
- qual reduz mais rápido;
- impacto no total pago;
- relação entre fluxo de caixa e custo total.

## 9. Conferir cálculo

A memória de cálculo deve mostrar:

- fórmula;
- variáveis;
- valores substituídos;
- arredondamento;
- quantização;
- rastreabilidade;
- interpretação prática.

Ela não deve ser apenas uma lista técnica.

## 10. Decidir

A etapa final deve reunir:

- fontes;
- limites;
- alertas;
- itens que não estão incluídos;
- necessidade de proposta formal;
- CET oficial;
- custos de cartório, ITBI, seguros e avaliação, quando aplicável;
- checklist antes de assinar contrato.

## 11. Regras visuais mínimas

A nova interface deve observar:

- fontes maiores e legíveis;
- melhor uso do espaço;
- bordas e pesos visuais consistentes;
- cards com função clara;
- contraste adequado;
- sem grandes vazios sem função;
- sem conteúdo comprimido em espaços pequenos;
- sem rolagem global descontrolada;
- tabelas com rolagem interna delimitada;
- gráfico proporcional;
- estado ativo claro da etapa atual;
- botão de voltar ou retorno ao início quando fizer sentido.

## 12. Resultado esperado da próxima implementação

A próxima implementação deve permitir que o usuário entenda onde está, o que já fez, o que falta fazer e por que cada informação existe.
