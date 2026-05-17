# PEF — Padrão de Propósito de Componentes Frontend

## 1. Finalidade

Este documento define como componentes visuais da PEF devem ser criados, reutilizados e avaliados.

A PEF deve evitar componentes sem propósito, duplicados, visualmente bonitos mas semanticamente confusos, ou cards/botões diferentes que conduzem o usuário ao mesmo lugar sem justificativa.

## 2. Princípio do propósito único

Todo componente deve ter propósito declarado.

Um componente deve existir para:

1. informar;
2. orientar;
3. coletar dados;
4. exibir resultado;
5. explicar cálculo;
6. comparar cenários;
7. alertar;
8. conduzir a uma ação;
9. apoiar acessibilidade ou navegação.

Se não cumpre nenhuma dessas funções, deve ser removido, consolidado ou redesenhado.

## 3. Contrato mínimo de componente

Todo componente relevante deve ter:

```txt
Nome:
Tipo:
Propósito:
Quando usar:
Quando não usar:
Entradas/props:
Saídas/eventos:
Estados:
Comportamento mobile:
Requisitos de acessibilidade:
Testes mínimos:
```

## 4. Botões e CTAs

### COMP-CTA-001 — CTA primário

Deve representar a ação dominante da tela ou zona.

Só deve existir um CTA primário por contexto visual principal.

### COMP-CTA-002 — CTA secundário

Deve apoiar a jornada sem competir com o CTA primário.

### COMP-CTA-003 — CTA contextual

Deve levar ao conteúdo prometido pelo próprio rótulo.

Exemplo:

```txt
Ver CET → CET
Ver interpretação → Interpretação
Ver memória → Memória de cálculo
```

## 5. Cards

### COMP-CARD-001 — Card de métrica

Mostra um número principal e sua interpretação curta.

### COMP-CARD-002 — Card de insight

Explica uma consequência prática do resultado.

### COMP-CARD-003 — Card de alerta

Chama atenção para risco, inconsistência ou cuidado.

### COMP-CARD-004 — Card de navegação

Leva o usuário para uma zona específica, e seu destino deve ser único e coerente.

### COMP-CARD-005 — Proibição de card redundante

Cards diferentes não devem repetir número, texto, destino e CTA sem finalidade distinta.

## 6. Zonas e painéis

Zonas devem organizar a jornada. Elas não devem ser usadas como depósito de conteúdo.

Cada zona deve ter:

1. título claro;
2. objetivo;
3. conteúdo principal;
4. ação ou próximo passo;
5. relação com a zona anterior e posterior.

## 7. Componentes legados

Componentes legados podem permanecer temporariamente, mas devem ser classificados como:

```txt
ativo
legado-em-uso
legado-sem-uso
obsoleto
removível
```

É proibido que componente legado conflite com componente ativo em:

- `data-testid`;
- nomes acessíveis;
- exports públicos;
- testes que fazem parecer que ambos são oficiais;
- documentação.

## 8. data-testid

`data-testid` deve ser único para o papel do componente testado.

Se houver componente legado, o testid deve indicar isso, por exemplo:

```txt
financiamento-table-legacy
financiamento-compare-chart-legacy
```

## 9. Relação com auditor automático

O auditor UI/UX deve detectar:

1. CTAs distintos com mesmo destino sem justificativa;
2. cards com mesmo destino e labels diferentes sem justificativa;
3. data-testid duplicado;
4. componente legado exportado como ativo sem documentação;
5. label de CTA incompatível com destino;
6. ausência de nome acessível em componente interativo crítico.
