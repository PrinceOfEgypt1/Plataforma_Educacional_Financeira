# PEF — Template Oficial de Jornada de Módulo Financeiro Educacional

## 1. Finalidade

Este documento define a estrutura de jornada recomendada para módulos da Plataforma Educacional Financeira.

Nem todos os módulos precisam ter todas as zonas, mas todo módulo deve declarar sua jornada antes de implementação ou refatoração visual relevante.

## 2. Estrutura recomendada

```txt
1. Conceito
2. Simulação
3. Resultado principal
4. Detalhamento financeiro
5. Memória de cálculo
6. Tabela ou evolução temporal
7. Comparação ou cenário alternativo
8. Interpretação pedagógica
9. Fontes, limites e hipóteses
10. Próximos passos
```

## 3. Zona 1 — Conceito

Objetivo: explicar o que o módulo faz e por que isso importa.

Deve conter:

- explicação curta;
- exemplo simples;
- principais variáveis;
- alerta sobre limites da simulação;
- chamada para simular.

Não deve conter:

- excesso de teoria;
- cálculo completo;
- tabela longa;
- cards sem ação.

## 4. Zona 2 — Simulação

Objetivo: coletar dados com mínimo atrito.

Deve conter:

- campos claros;
- exemplos de preenchimento;
- validação contextual;
- CTA principal único;
- estado loading;
- erro recuperável.

## 5. Zona 3 — Resultado principal

Objetivo: mostrar o resultado mais importante primeiro.

Deve conter:

- principal número ou conclusão;
- resumo das premissas;
- cards de resultado com propósito único;
- próximos caminhos: parcela, CET, memória, tabela, comparação, interpretação.

## 6. Zona 4 — Detalhamento financeiro

Objetivo: decompor o resultado em partes compreensíveis.

Exemplos:

- parcela;
- juros;
- amortização;
- encargos;
- saldo devedor;
- custo total;
- CET.

Cada detalhe deve explicar o significado, não apenas mostrar valor.

## 7. Zona 5 — Memória de cálculo

Objetivo: tornar o cálculo rastreável.

Deve conter:

- fórmula;
- variáveis;
- substituição com valores reais;
- arredondamento;
- hipóteses;
- limites.

## 8. Zona 6 — Tabela ou evolução temporal

Objetivo: permitir leitura controlada de séries longas.

Deve conter:

- cabeçalho fixo ou estrutura equivalente;
- blocos/paginação;
- resumo do bloco;
- orientação de leitura;
- formatação consistente;
- totalizadores corretos.

## 9. Zona 7 — Comparação

Objetivo: comparar cenários de forma honesta e legível.

Deve conter:

- gráfico proporcional;
- legenda clara;
- eixos compreensíveis;
- explicação do que observar;
- resumo de diferença prática.

## 10. Zona 8 — Interpretação pedagógica

Objetivo: converter números em entendimento.

Deve responder:

- o resultado é alto ou baixo?
- por que isso aconteceu?
- qual variável mais influenciou?
- o que o usuário deveria comparar?
- quais riscos existem?

## 11. Zona 9 — Fontes, limites e hipóteses

Objetivo: estabelecer confiança e transparência.

Deve conter:

- fontes quando houver;
- hipóteses assumidas;
- limitações;
- avisos sobre estimativas;
- fronteira entre simulação educacional e decisão financeira real.

## 12. Zona 10 — Próximos passos

Objetivo: orientar ação posterior.

Deve conter:

- revisar dados;
- comparar sistemas;
- testar prazo/taxa/entrada;
- verificar CET real do contrato;
- consultar fontes oficiais ou documentos reais;
- salvar/exportar quando aplicável.

## 13. Declaração obrigatória de jornada

Cada módulo deve manter uma declaração de jornada com:

```txt
Módulo:
Rota:
Usuário-alvo:
Objetivo principal:
Ação primária:
Resultado principal:
Zonas existentes:
Zonas não aplicáveis:
CTAs críticos:
Estados obrigatórios:
Critérios de reprovação específicos:
```

## 14. Relação com auditor automático

O contrato executável de cada módulo deve ser derivado desta jornada. O auditor deve comparar CTAs, zonas e destinos reais com a jornada declarada.
