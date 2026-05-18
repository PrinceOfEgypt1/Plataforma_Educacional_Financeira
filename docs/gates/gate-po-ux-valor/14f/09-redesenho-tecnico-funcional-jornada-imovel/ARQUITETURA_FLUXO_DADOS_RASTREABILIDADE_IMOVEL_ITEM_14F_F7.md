# Arquitetura de fluxo de dados e rastreabilidade — Item 14F-F7

## Nota canônica F7

Este documento integra o redesenho técnico-funcional da jornada do módulo Imóvel.

A especificação F7 exige arquitetura de informação clara, rastreabilidade numérica, auditor UI/UX preservado como gate oficial, eliminação de menus concorrentes e manutenção do backend como fonte de verdade financeira.


## 1. Princípio

O backend deve ser a fonte oficial da verdade financeira.

O frontend deve validar entrada, enviar requisições, exibir dados, explicar resultados e renderizar visualizações. O frontend não deve recalcular valores financeiros centrais como fonte de verdade.

## 2. Fluxo técnico esperado

O fluxo técnico-funcional recomendado é:

1. Usuário informa valor, entrada, prazo, taxa e sistema.
2. Frontend valida formato e limites de entrada.
3. API client envia payload canônico.
4. FastAPI recebe a requisição.
5. Service orquestra a simulação.
6. Domínio financeiro executa cálculo com Decimal.
7. Motores SAC e PRICE retornam resultados rastreáveis.
8. Camada de enriquecimento adiciona CET, anatomia da parcela, memória e alertas.
9. Schema Pydantic serializa e quantiza valores.
10. JSON envelope retorna dados canônicos.
11. Frontend renderiza resumo, tabela, gráfico, memória e fontes usando a mesma base.

## 3. Responsabilidades por camada

| Camada | Responsabilidade | Não deve fazer |
|---|---|---|
| Frontend | Validar input, apresentar jornada, renderizar gráficos/tabelas, explicar | Recalcular verdade financeira central |
| API client | Chamar endpoint e tratar envelope | Alterar valores monetários |
| Router FastAPI | Receber requisição e devolver envelope | Implementar fórmula financeira |
| Service | Orquestrar domínio e enriquecimento | Duplicar cálculo do domínio |
| Domínio | Calcular SAC/PRICE com precisão | Renderizar interpretação visual |
| Schema | Serializar, quantizar, organizar resposta | Inventar dados não rastreados |
| UI | Exibir e explicar | Corrigir centavos por conta própria |

## 4. Rastreabilidade monetária

Todo valor monetário exibido em:

- resumo;
- tabela;
- gráfico;
- memória;
- comparação;
- leitura rápida;

deve derivar da mesma fonte canônica.

Se a primeira parcela é exibida como R$ 3.909,87 no resumo, esse valor deve ser o mesmo na tabela, na memória e nos dados do gráfico, salvo quando houver explicação explícita de arredondamento ou agrupamento.

## 5. Arredondamento e quantização

A regra de arredondamento deve ser definida pelo backend.

O frontend não deve usar formatação como fonte de verdade. Funções visuais de formatação podem existir, mas devem receber valores já canônicos.

Regra recomendada:

- backend calcula com Decimal;
- backend quantiza valores monetários;
- backend serializa valores monetários em formato canônico;
- frontend formata para leitura humana sem alterar significado financeiro.

## 6. Risco de divergência de centavos

Diferenças de R$ 0,01 entre resumo, tabela, gráfico e memória são inaceitáveis quando decorrem de recálculo ou formatação inconsistente.

A próxima implementação deve incluir testes que detectem divergência entre:

- soma das parcelas;
- total pago;
- total de juros;
- primeira parcela;
- última parcela;
- pontos do gráfico;
- memória de cálculo.

## 7. Aliases legados

Campos legados ou aliases de retrocompatibilidade devem ser tratados com cautela.

A especificação pós-F7 deve preferir campos canônicos. Se aliases forem mantidos por compatibilidade, isso deve ser documentado e testado para evitar ambiguidade.

## 8. Relação com UX

Rastreabilidade não é apenas uma regra técnica.

Ela melhora a confiança do usuário. A interface deve permitir que o usuário perceba que cada número vem de uma fonte consistente, auditável e explicável.

## 9. Critério de aceite

A nova jornada visual só pode ser considerada candidata a aceite se preservar rastreabilidade numérica entre backend, resumo, tabela, gráfico e memória.
