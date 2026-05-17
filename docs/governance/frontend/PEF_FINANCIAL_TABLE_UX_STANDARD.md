# PEF — Padrão Oficial de UX para Tabelas Financeiras

## 1. Finalidade

Este documento define o padrão oficial para tabelas financeiras na Plataforma Educacional Financeira.

Tabelas financeiras podem conter dezenas, centenas ou milhares de linhas. A PEF deve preservar todos os dados necessários, mas sem transformar a interface em uma muralha de números.

## 2. Princípio central

A tabela deve permitir leitura orientada, não apenas exibição bruta.

O usuário deve entender:

1. o que cada coluna significa;
2. que intervalo de linhas está vendo;
3. como navegar por blocos;
4. quais totais importam;
5. como a dívida, parcela, juros e amortização evoluem;
6. qual conclusão prática pode tirar.

## 3. Requisitos obrigatórios

### TABLE-UX-001 — Tamanho dinâmico

A tabela deve respeitar o prazo real da simulação.

Exemplos:

```txt
120 meses → 120 linhas
360 meses → 360 linhas
600 meses → 600 linhas
```

É proibido hardcodar quantidade de linhas para apenas parecer correto.

### TABLE-UX-002 — Leitura em blocos

Tabelas longas devem usar paginação, blocos, virtualização ou rolagem interna delimitada.

### TABLE-UX-003 — Cabeçalho claro

Colunas devem ter nomes claros e consistentes.

Exemplos:

```txt
Mês
Parcela
Juros
Amortização
Encargos
Saldo inicial
Saldo final
```

### TABLE-UX-004 — Resumo do bloco

Cada bloco/página deve oferecer resumo útil, como:

- intervalo de parcelas;
- juros do bloco;
- amortização do bloco;
- total pago no bloco;
- saldo inicial e final;
- leitura pedagógica.

### TABLE-UX-005 — Cabeçalho fixo ou alternativa equivalente

Quando a tabela tiver rolagem interna, o cabeçalho deve permanecer compreensível.

### TABLE-UX-006 — Totalizadores corretos

Rodapés e totalizadores não devem colocar valores em colunas semanticamente erradas.

Exemplo de erro proibido:

```txt
Exibir total pago na coluna de saldo.
```

### TABLE-UX-007 — Microcopy pedagógica

A tabela deve explicar, ainda que brevemente, como ler saldo, juros, amortização, encargos e parcela.

### TABLE-UX-008 — Mobile

Em mobile, tabela longa deve ter solução própria: blocos, cards por período, rolagem interna controlada ou alternativa equivalente.

## 4. Rejeições automáticas

Reprovar tabela se:

1. corta linhas do prazo real;
2. usa rolagem da página inteira como solução principal;
3. não explica colunas críticas;
4. tem totalizadores em colunas erradas;
5. não é utilizável em mobile;
6. mistura tabela com outras zonas sem separação clara;
7. ocupa espaço desproporcional sem orientação;
8. não tem teste para prazo longo quando aplicável.

## 5. Testes mínimos

Para módulo com tabela financeira longa, exigir testes para:

1. quantidade total de linhas ou registros;
2. navegação por páginas/blocos;
3. cabeçalhos;
4. totalizadores;
5. renderização de prazo longo;
6. presença de resumo pedagógico;
7. comportamento estrutural mobile quando possível.

## 6. Relação com auditor automático

O auditor deve verificar heurísticas estáticas iniciais:

- presença de paginação/blocos;
- presença de texto de leitura guiada;
- ausência de `max-height` sem contexto;
- ausência de hardcode suspeito de 12/24/360 sem relação declarada;
- existência de testes associados.
