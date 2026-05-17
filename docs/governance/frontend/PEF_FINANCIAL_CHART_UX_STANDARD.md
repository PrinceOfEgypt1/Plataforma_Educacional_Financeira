# PEF — Padrão Oficial de UX para Gráficos Financeiros

## 1. Finalidade

Este documento define o padrão oficial para gráficos financeiros na Plataforma Educacional Financeira.

Gráficos devem facilitar compreensão, comparação e tomada de consciência. Não devem existir apenas para decorar a tela.

## 2. Princípio central

Todo gráfico financeiro deve responder:

1. o que está sendo comparado;
2. qual variável está no eixo X;
3. qual variável está no eixo Y;
4. qual conclusão prática o usuário deve observar;
5. quais limitações existem;
6. como o gráfico se conecta ao resultado e à interpretação.

## 3. Requisitos obrigatórios

### CHART-UX-001 — Proporção visual adequada

O gráfico deve ter altura suficiente para leitura. Gráfico achatado horizontalmente reprova.

### CHART-UX-002 — Escala legível

Eixos, valores e legendas devem ser compreensíveis.

### CHART-UX-003 — Legenda clara

Séries comparadas devem ter identificação evidente.

### CHART-UX-004 — Interpretação pedagógica

Todo gráfico financeiro relevante deve ter texto de apoio explicando o que observar.

### CHART-UX-005 — Tooltip útil

Quando houver tooltip, ele deve mostrar valores formatados de forma compreensível.

### CHART-UX-006 — Acessibilidade

O gráfico deve ter alternativa textual ou descrição acessível quando necessário.

### CHART-UX-007 — Consistência visual

Gráficos comparativos equivalentes devem seguir padrão visual comum entre módulos.

## 4. Padrão para comparação PRICE × SAC

Quando comparar PRICE e SAC, o gráfico deve deixar claro:

1. evolução das parcelas;
2. diferença de comportamento ao longo do tempo;
3. valor inicial e final quando útil;
4. total pago ou total de juros em resumo complementar;
5. interpretação prática.

## 5. Rejeições automáticas

Reprovar gráfico se:

1. estiver visualmente achatado;
2. não tiver legenda clara;
3. não explicar o que o usuário deve observar;
4. usar escala confusa;
5. ocupar espaço desproporcional sem entregar compreensão;
6. não tiver alternativa textual mínima;
7. conflitar com padrão visual já aprovado em módulo similar.

## 6. Testes mínimos

Exigir testes para:

1. renderização do container;
2. presença de título/descrição;
3. presença de legenda ou nomes das séries;
4. altura mínima estrutural;
5. dados principais usados no gráfico;
6. fallback quando não houver dados.

## 7. Relação com auditor automático

O auditor deve verificar heurísticas iniciais:

- presença de altura mínima ou container proporcional;
- presença de título/descrição;
- presença de legenda;
- presença de texto interpretativo;
- ausência de componentes legados conflitantes com o gráfico ativo.
