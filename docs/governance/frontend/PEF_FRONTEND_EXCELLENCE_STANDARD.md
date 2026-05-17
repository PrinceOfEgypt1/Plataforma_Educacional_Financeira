# PEF — Padrão Oficial de Excelência Frontend/UI/UX

## 1. Finalidade

Este documento define o padrão oficial de excelência frontend, UI/UX e jornada do usuário da Plataforma Educacional Financeira.

A PEF não deve aceitar uma tela apenas porque ela compila, passa em testes ou possui botões tecnicamente clicáveis. Uma tela só pode ser considerada excelente quando funciona, ensina, orienta, reduz esforço cognitivo, apresenta números de forma auditável, é acessível, é responsiva e permite que o usuário compreenda a decisão financeira simulada.

## 2. Princípio central

Toda tela da PEF deve responder, com clareza, às seguintes perguntas do usuário:

1. Onde estou?
2. O que esta tela faz?
3. Qual é o próximo passo recomendado?
4. Que dados preciso informar?
5. Qual resultado foi calculado?
6. De onde saiu esse número?
7. O que esse número significa na prática?
8. Quais riscos, limitações ou hipóteses foram considerados?
9. O que devo comparar antes de decidir?
10. Como posso conferir a memória de cálculo?

Se a tela não consegue responder a essas perguntas, ela não atende ao padrão oficial de excelência.

## 3. Requisitos de jornada

### UX-JOURNEY-001 — Jornada dominante clara

Cada módulo deve ter uma jornada principal explícita. O usuário não deve precisar descobrir o fluxo por tentativa e erro.

Para módulos de simulação financeira, a jornada recomendada é:

```txt
Entender → Simular → Resultado principal → Detalhamento → Memória de cálculo → Tabela/Gráfico → Interpretação → Próximos passos
```

### UX-JOURNEY-002 — Painéis mutuamente exclusivos

Quando o módulo usar zonas, abas ou etapas, elas devem funcionar como painéis mutuamente exclusivos, e não como simples rolagem longa que mistura conteúdos de zonas diferentes.

Critério futuro de auditoria:

```txt
Falhar se CTAs ou tabs forem implementados como rolagem para seções misturadas quando o contrato do módulo exigir tabbed single-panel interaction.
```

### UX-JOURNEY-003 — Estado ativo sempre visível

O usuário deve saber qual zona, aba, etapa ou modo está ativo. O estado ativo deve ser visualmente claro e acessível.

### UX-JOURNEY-004 — Próximo passo explícito

Após cada ação principal, a interface deve mostrar uma orientação clara para o próximo passo.

## 4. Requisitos de CTAs, botões e cards

### UX-CTA-001 — CTA com promessa e destino coerentes

Todo CTA deve cumprir a promessa do próprio rótulo.

Exemplos:

| Rótulo | Destino obrigatório |
|---|---|
| Ver CET | Zona, painel ou conteúdo de CET |
| Ver interpretação | Zona, painel ou conteúdo de interpretação |
| Ver gráfico | Gráfico ou comparação visual |
| Ver tabela | Tabela financeira |
| Ver memória | Memória de cálculo |
| Ver fontes | Fontes, limites e hipóteses |

É proibido que um botão com rótulo específico leve a uma área genérica sem abrir o conteúdo prometido.

### UX-CTA-002 — CTAs diferentes não devem ter o mesmo destino sem justificativa

Botões diferentes podem apontar para o mesmo destino apenas se houver justificativa explícita de enquadramento, propósito ou contexto.

Sem justificativa, isso deve ser tratado como duplicação de jornada.

### UX-CARD-001 — Cards devem ter propósito único

Cada card deve ter função clara. Cards diferentes não devem repetir a mesma informação, o mesmo destino e a mesma ação com aparência diferente.

### UX-CARD-002 — Card não é enfeite

Cards devem informar, orientar, alertar ou conduzir. Um card que apenas ocupa espaço visual sem alterar a compreensão do usuário deve ser removido, consolidado ou redesenhado.

## 5. Requisitos de informação financeira

### UX-FIN-001 — Resultado sem memória é insuficiente

Todo resultado financeiro relevante deve ter caminho claro para sua memória de cálculo.

### UX-FIN-002 — Premissas devem ser visíveis

A tela deve exibir as premissas usadas, como valor financiado, entrada, taxa, prazo, sistema de amortização, encargos, arredondamento e limitações.

### UX-FIN-003 — Interpretação pedagógica obrigatória

A tela deve explicar o significado prático do resultado, não apenas mostrar números.

### UX-FIN-004 — CET deve ser tratado como transparência, não como detalhe escondido

Quando CET existir ou for simulado, deve ser apresentado com explicação clara sobre o que compõe o custo efetivo.

## 6. Requisitos visuais

### UI-HIERARCHY-001 — Hierarquia visual clara

A tela deve deixar evidente:

1. título do módulo;
2. objetivo do módulo;
3. ação principal;
4. resultado principal;
5. detalhes técnicos;
6. explicação pedagógica;
7. próximos passos.

### UI-DENSITY-001 — Densidade equilibrada

É proibido despejar simultaneamente excesso de cards, números, zonas, faixas e painéis sem progressão clara.

### UI-CONSISTENCY-001 — Componentes devem seguir padrão comum

Módulos diferentes devem usar padrões visuais compatíveis. A PEF não deve parecer uma coleção de telas sem relação entre si.

## 7. Requisitos de estados de UI

### UX-STATE-001 — Estado vazio

Antes da simulação, a tela deve informar claramente o que fazer.

### UX-STATE-002 — Estado loading

Toda ação assíncrona deve mostrar feedback, impedir duplicidade acidental quando necessário e preservar a compreensão do usuário.

### UX-STATE-003 — Estado de erro

Erros devem ser humanos, recuperáveis e posicionados perto da causa quando possível.

### UX-STATE-004 — Estado de sucesso

Após uma simulação bem-sucedida, a interface deve destacar o resultado principal e sugerir o próximo passo.

## 8. Requisitos de acessibilidade

### UX-A11Y-001 — Operável por teclado

A jornada principal deve ser navegável por teclado.

### UX-A11Y-002 — Foco visível

Elementos interativos devem apresentar foco visível.

### UX-A11Y-003 — Nome acessível

Botões, abas, campos e gráficos devem ter nome acessível compatível com sua finalidade.

### UX-A11Y-004 — Sem dependência exclusiva de cor

Cores podem reforçar significado, mas não podem ser a única forma de transmitir status, severidade ou ação.

## 9. Requisitos de responsividade

### UX-MOBILE-001 — Mobile não é desktop espremido

A versão mobile deve ser usável como experiência própria. Sidebars, tabelas e grids devem se adaptar sem comprimir o conteúdo principal.

### UX-MOBILE-002 — Ações essenciais permanecem acessíveis

Se um componente lateral for ocultado no mobile, suas ações essenciais devem continuar acessíveis por outro mecanismo claro.

## 10. Requisitos de texto e qualidade linguística

### UX-TEXT-001 — Proibição de texto temporário

É proibido materializar texto como `marcador de tarefa pendente`, `marcador temporário de conteúdo`, `marcador temporário de conteúdo`, `a definir`, `em breve` como substituto de decisão ou implementação real.

### UX-TEXT-002 — Proibição de mojibake

Textos com acentuação corrompida são inadmissíveis em código, documentação, interface, relatórios e evidências.

Exemplos proibidos:

```txt
texto com acentuação corrompida em palavra equivalente a observações
texto com acentuação corrompida em palavra equivalente a evidências
texto com acentuação corrompida em palavra equivalente a cálculo
texto com acentuação corrompida em palavra equivalente a não
texto com acentuação corrompida em nome próprio
texto com acentuação corrompida no nome do assistente
```

## 11. Critério de excelência

Um módulo atinge excelência quando:

1. a jornada é clara;
2. os CTAs cumprem o que prometem;
3. cards possuem propósito único;
4. informações não são repetidas desnecessariamente;
5. resultado, memória, tabela, gráfico e interpretação se complementam;
6. a interface é elegante e compreensível;
7. estados de UI estão tratados;
8. desktop e mobile são utilizáveis;
9. a experiência é acessível;
10. o usuário entende melhor o conceito financeiro após usar o módulo.

## 12. Relação com auditoria executável

Este padrão deve ser convertido progressivamente em auditorias automatizadas.

A documentação define a régua. O auditor executável deve transformar violações em erros com código, arquivo, evidência e severidade.
