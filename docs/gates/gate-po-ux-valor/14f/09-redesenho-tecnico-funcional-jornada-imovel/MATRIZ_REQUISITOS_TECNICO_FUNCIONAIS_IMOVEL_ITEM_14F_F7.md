# Matriz de requisitos técnico-funcionais — Item 14F-F7

## Nota canônica F7

Este documento integra o redesenho técnico-funcional da jornada do módulo Imóvel.

A especificação F7 exige arquitetura de informação clara, rastreabilidade numérica, auditor UI/UX preservado como gate oficial, eliminação de menus concorrentes e manutenção do backend como fonte de verdade financeira.


## 1. Objetivo

Converter as críticas da F6 em requisitos verificáveis para a próxima implementação do módulo Imóvel.

## 2. Matriz

| ID | Requisito | Origem | Tipo | Severidade | Critério de aceite |
|---|---|---|---|---|---|
| F7-REQ-001 | Adotar um único modelo de navegação guiada | F6-UX-002 | UX/IA | Crítica | Não existir menu concorrente para o mesmo conteúdo |
| F7-REQ-002 | Remover duplicidade semântica entre cards, abas, botões e CTAs | F6-UX-001/F6-UX-009 | UX | Crítica | Cada ação deve ter propósito e destino únicos |
| F7-REQ-003 | Substituir “Próximos passos” por etapa final com nome pedagógico validado | F6-UX-003 | UX/Conteúdo | Alta | A etapa final deve explicar decisão, limites e cuidados |
| F7-REQ-004 | Aumentar legibilidade tipográfica | F6-UX-006 | UI | Alta | Textos principais devem ser confortáveis em desktop e mobile |
| F7-REQ-005 | Eliminar rolagem global confusa no painel principal | F6-UX-007 | UX/Layout | Crítica | A rolagem deve ser interna apenas em componentes que exigem dados extensos |
| F7-REQ-006 | Melhorar uso do espaço | F6-UX-008 | UI/Layout | Alta | Não deve haver conteúdo apertado convivendo com áreas vazias grandes |
| F7-REQ-007 | Padronizar bordas, pesos, cards e espaçamentos | F6-UX-005 | UI | Média | Cards equivalentes devem ter padrão visual consistente |
| F7-REQ-008 | Transformar tela inicial em orientação de jornada | F6-UX-011 | UX/Conteúdo | Alta | Cards iniciais devem explicar o caminho do usuário |
| F7-REQ-009 | Preservar auditor UI/UX automático como gate mínimo | F5/F6 | Governança | Crítica | `pnpm audit:uiux` deve permanecer PASS |
| F7-REQ-010 | Garantir que frontend não seja fonte de verdade financeira | ENG-001 | Engenharia | Crítica | Valores centrais devem vir do backend, não de recálculo visual |
| F7-REQ-011 | Padronizar quantização e arredondamento | ENG-001 | Engenharia financeira | Crítica | Tabela, resumo, gráfico e memória devem usar a mesma base canônica |
| F7-REQ-012 | Evitar `toFixed(2)` como fonte de verdade financeira | ENG-001 | Engenharia financeira | Alta | Formatação visual não pode gerar divergência de cálculo |
| F7-REQ-013 | Remover ou isolar aliases legados de payload quando possível | Auditoria técnica | Engenharia | Média | Campos canônicos devem ter precedência documentada |
| F7-REQ-014 | Criar gráfico SAC x PRICE proporcional | F6/UX | Visualização | Alta | Gráfico deve ter altura, escala e leitura pedagógica adequadas |
| F7-REQ-015 | Garantir tabela financeira completa e controlada | F6/UX | Visualização | Alta | Tabela deve exibir todas as parcelas com rolagem interna delimitada |
| F7-REQ-016 | Memória de cálculo deve ser educativa | F6/UX | Conteúdo | Alta | Deve conter fórmula, variáveis, substituição, arredondamento e interpretação |
| F7-REQ-017 | Fontes e limites devem ficar integrados sem duplicidade | F6-UX-009 | Conteúdo/UX | Alta | Não pode haver “Fontes” e “Ver fontes” competindo pelo mesmo destino |
| F7-REQ-018 | Implementação futura deve preservar testes existentes | Governança | Qualidade | Crítica | Nenhum teste deve ser removido para facilitar aprovação |
| F7-REQ-019 | Implementação futura deve incluir testes de jornada | F6 | Qualidade | Crítica | Deve haver testes para fluxo guiado, avanço, retorno e estados |
| F7-REQ-020 | Implementação futura deve incluir teste de consistência numérica | ENG-001 | Qualidade financeira | Crítica | Diferenças de centavos entre resumo, tabela, gráfico e memória devem ser detectadas |

## 3. Regra de bloqueio

Qualquer implementação pós-F7 que mantenha menus concorrentes, duplicidades semânticas ou rolagem global confusa deve ser rejeitada automaticamente.
