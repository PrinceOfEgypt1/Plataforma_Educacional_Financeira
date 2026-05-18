# Prompt base para implementação pós-F7 — Módulo Imóvel

## Nota canônica F7

Este documento integra o redesenho técnico-funcional da jornada do módulo Imóvel.

A especificação F7 exige arquitetura de informação clara, rastreabilidade numérica, auditor UI/UX preservado como gate oficial, eliminação de menus concorrentes e manutenção do backend como fonte de verdade financeira.


## 1. Papel da IA executora

Você atuará como IA executora responsável por propor uma entrega auditável para o módulo Financiamento Imobiliário da Plataforma Educacional Financeira.

Esta execução deve respeitar o Item 14F-F7, que substitui a abordagem de remendos incrementais por redesenho técnico-funcional da jornada.

## 2. Objetivo

Implementar ou prototipar uma nova jornada guiada para o módulo Imóvel, preservando rastreabilidade numérica, clareza pedagógica e consistência visual.

## 3. Contexto obrigatório

- F5 promoveu o auditor UI/UX a gate oficial BLOCKING.
- F6 reprovou visualmente a interface atual.
- O auditor UI/UX estar zerado não significa aceite visual.
- A próxima entrega deve resolver arquitetura de informação e jornada, não apenas violações automáticas.

## 4. Escopo permitido

O prompt operacional específico deve declarar uma lista fechada de arquivos, componentes e testes permitidos, mantendo o escopo limitado, explícito e auditável.

Possíveis áreas permitidas:

- componentes React do módulo Imóvel;
- testes funcionais da jornada;
- documentação de evidência;
- ajustes de apresentação visual;
- integração com dados canônicos já existentes.

## 5. Escopo proibido

É proibido:

- alterar fórmulas financeiras sem autorização explícita;
- alterar backend para mascarar problema visual;
- alterar auditor UI/UX para facilitar aprovação;
- remover testes;
- reduzir cobertura;
- reintroduzir menus concorrentes;
- usar marcadores de pendência;
- entregar mojibake;
- aplicar patch pequeno que ignore a jornada;
- usar frontend como fonte de verdade financeira central.

## 6. Requisitos de UX

A entrega deve conter:

- um único modelo de navegação guiada;
- etapas claras;
- avanço e retorno;
- tela inicial orientadora;
- fontes legíveis;
- cards com propósito único;
- sem duplicidades semânticas;
- sem rolagem global confusa;
- tabela com rolagem interna delimitada;
- gráfico proporcional;
- memória de cálculo educativa;
- fontes e limites integrados.

## 7. Requisitos técnicos

A entrega deve preservar:

- auditor UI/UX total=0;
- rastreabilidade numérica;
- valores canônicos vindos do backend;
- testes existentes;
- typecheck;
- lint;
- build;
- testes unitários e funcionais.

## 8. Entrega obrigatória

A IA executora deve entregar:

- ZIP único auditável;
- relatório técnico em Markdown;
- lista de arquivos alterados;
- evidências de validação;
- descrição das decisões de UX;
- limitações conhecidas;
- declaração explícita de que não alterou escopo proibido.

## 9. Critério de rejeição automática

A entrega deve ser rejeitada se:

- mantiver dois menus concorrentes;
- mantiver cards sem função clara;
- mantiver duplicidade de destino;
- mantiver rolagem global confusa;
- diminuir legibilidade;
- alterar cálculo sem autorização;
- enfraquecer auditor;
- usar marcadores de pendência;
- apresentar mojibake;
- não comprovar testes.
