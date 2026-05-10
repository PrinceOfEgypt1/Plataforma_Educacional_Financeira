# PADRÃO OFICIAL DE TELAS — GATE PO/UX/VALOR

## 1. Identificação do documento

| Campo | Registro |
| --- | --- |
| Projeto | Plataforma Educacional Financeira |
| Gate | Gate PO/UX/Valor — Reestruturação Educacional e Auditável |
| Item | Item 6 — Definir padrão oficial de telas |
| Documento | Padrão oficial de telas educacionais, financeiras, auditáveis e encantadoras |
| Data de referência | 2026-05-10 |
| Estado considerado | Itens 2, 3, 4 e 5 concluídos; Sprint 5 congelada |
| Natureza | Documento normativo de UX/UI e experiência educacional |

A Plataforma Educacional Financeira só deve avançar quando cada módulo for capaz de calcular corretamente, explicar de forma clara, mostrar memória de cálculo, comparar cenários, alertar riscos, citar fontes e encantar o usuário.

## 2. Contexto do padrão oficial de telas

Este padrão nasce do não aceite visual/pedagógico parcial da Sprint 4.5, da matriz de 178 perguntas do Item 3 e do plano de reestruturação do Item 4. Ele converte a direção do Gate em critérios de tela para auditoria, prototipação, Value Gate e aceite do PO.

## 3. Problema que este padrão resolve

O padrão resolve a ausência de uma referência oficial para decidir se uma tela financeira apenas funciona ou se realmente ensina, explica, compara, alerta, cita fontes, mostra memória de cálculo e encanta.

Sem este padrão, o projeto corre o risco de repetir o problema que motivou o Gate: entregas tecnicamente verdes, mas visualmente pouco convincentes, pedagogicamente fracas ou incapazes de demonstrar valor para o usuário.

O problema central não é apenas layout. É a falta de uma definição operacional de qualidade para telas financeiras educacionais. Uma tela pode estar correta do ponto de vista de código, mas ainda assim falhar se o usuário não entender o que calculou, por que o resultado importa, quais limites existem e como comparar cenários com segurança.

## 4. O que este padrão é

É um padrão documental para organizar telas de módulos financeiros. Ele define anatomia, hierarquia, abas, estados, tabelas, memória, fontes, ações, linguagem e critérios de evidência para auditoria futura.

Este padrão é uma régua de qualidade visual, pedagógica e financeira. Ele deve orientar auditoria, prototipação, Value Gate, aceite do PO e replicação para outros módulos.

Ele também funciona como ponte entre a matriz de perguntas do Item 3 e a implementação futura. As perguntas estratégicas foram convertidas aqui em expectativas de tela: o que precisa aparecer, por que aparece, qual evidência produz e qual risco surge se faltar.

## 5. O que este padrão não é

Este padrão não é implementação, protótipo visual, contrato final da API, Value Gate final, auditoria das telas atuais, escolha definitiva de módulo-piloto nem liberação da Sprint 5.

Este padrão não libera a Sprint 5. Este padrão não conclui o Gate PO/UX/Valor. Ele define critérios oficiais para orientar os próximos itens, mas não substitui contrato educacional da API, auditoria, prototipação, Value Gate, aceite do PO ou implementação futura.

## 6. Princípios visuais e pedagógicos

A tela deve ensinar no lugar certo, usar hierarquia clara, evitar conteúdo essencial escondido, reduzir fricção, preservar contexto e conduzir o usuário de conceito para simulação, resultado, interpretação, memória, comparação, fontes e limites.

O conteúdo pedagógico deve ocupar áreas nobres quando for essencial para a compreensão. Modais podem apoiar dúvidas pontuais, mas não devem carregar sozinhos a explicação principal do módulo.

A hierarquia visual deve deixar evidente o caminho de aprendizagem: primeiro o usuário entende o problema, depois informa dados, depois visualiza resultado, interpreta significado, audita a memória de cálculo, compara alternativas e consulta fontes e limites.

## 7. Princípios financeiros e matemáticos

Todo cálculo relevante deve ter fórmula, substituição de valores, etapas, premissas, arredondamento e relação com tabela ou gráfico quando aplicável. Resultado sem memória de cálculo não atende ao padrão futuro da plataforma.

O padrão deve separar número, interpretação e evidência. O número mostra o resultado; a interpretação explica o significado; a evidência permite conferir como o resultado foi produzido.

Em módulos financeiros, a tela deve evitar conclusões simplistas. Menor parcela, menor juros, menor custo total ou menor prazo não devem ser apresentados como resposta absoluta sem explicar trade-offs, limites da simulação e contexto educacional.

## 8. Princípios legais, normativos e de fontes oficiais

Fontes, datas de referência, limites e avisos fazem parte da confiança do produto. A tela deve diferenciar cálculo matemático, prática de mercado, simulação educacional e contrato real.

Quando uma informação depender de fonte oficial, indicador externo, regra normativa ou premissa de mercado, a interface deve informar origem, data de referência e limite de uso.

A aplicação não deve parecer consultoria financeira personalizada, proposta bancária, contrato, recomendação de investimento ou parecer jurídico. O usuário deve entender que está diante de uma simulação educacional auditável.

## 9. Princípios de encantamento

Encantamento não é decoração. É clareza percebida, sensação de domínio, fluidez, confiança, organização, beleza funcional, vontade de continuar aprendendo e ausência de fricção desnecessária.

Uma tela encanta quando o usuário sente que o assunto difícil ficou compreensível. O encantamento nasce da combinação entre boa hierarquia, linguagem clara, resultado bem explicado, tabela legível, memória acessível, fontes confiáveis e ações óbvias.

Critérios observáveis de encantamento:

- o usuário entende rapidamente o que a tela faz;
- o resultado principal é imediatamente compreensível;
- a explicação educacional aparece no lugar certo;
- a tabela não parece espremida, escondida ou cortada;
- a memória de cálculo é fácil de acessar e entender;
- fontes e limites aumentam confiança;
- a tela parece produto sério, não formulário solto.

## 10. Estrutura mínima obrigatória de uma tela de módulo

Uma tela de módulo financeiro deve possuir, no mínimo: cabeçalho do módulo, explicação curta de valor, área de entrada de dados, resultado principal, interpretação educacional, memória de cálculo, comparação quando aplicável, tabela quando aplicável, gráfico quando aplicável, fontes oficiais e datas de referência, limites da simulação, alertas e riscos e ações claras do usuário.

Cada área deve existir para produzir evidência: compreensão, cálculo, auditoria, comparação, confiança ou continuidade de uso.

## 11. Anatomia oficial de um módulo educacional auditável

| Área | Função | Obrigatória? | Quando aparece | Evidência que deve produzir | Risco se ausente | Item futuro relacionado |
| --- | --- | --- | --- | --- | --- | --- |
| Cabeçalho | Identificar módulo, propósito e contexto | Sim | Sempre | Título, subtítulo e status do módulo | Usuário não entende onde está | Item 10 |
| Resumo de valor | Explicar o que a tela ajuda a decidir | Sim | Sempre | Frase curta de valor e uso | Tela parece calculadora comum | Item 10 |
| Conceito | Ensinar o conceito financeiro essencial | Sim | Antes ou junto da simulação | Texto pedagógico em área nobre ou aba | Usuário preenche sem entender | Item 10 |
| Entrada de dados | Coletar dados com orientação e validação | Sim | Sempre que houver cálculo | Campos, unidades, exemplos e validações | Entrada errada gera resultado enganoso | Item 12 |
| Validação | Prevenir dados inválidos ou incompletos | Sim | Durante preenchimento e submissão | Mensagens específicas e ações corretivas | Erro vira frustração ou cálculo falso | Item 11 |
| Resultado principal | Mostrar síntese do cálculo | Sim | Após cálculo bem-sucedido | Valor principal, unidade e leitura curta | Número aparece sem significado | Item 13 |
| Interpretação | Explicar significado, implicação e cuidado | Sim | Após resultado | Texto educacional conectado ao resultado | Resultado não orienta decisão | Item 13 |
| Memória de cálculo | Permitir auditoria do cálculo | Sim | Sempre que houver cálculo financeiro relevante | Fórmula, substituição, etapas e arredondamento | Resultado não é auditável | Item 7 |
| Tabela | Exibir evolução financeira tabular | Quando aplicável | Prazos, amortização, evolução ou parcelas | Linhas conforme prazo e colunas legíveis | Evidência central fica escondida | Item 8 |
| Comparação | Comparar alternativas e trade-offs | Quando aplicável | Cenários múltiplos ou escolhas financeiras | Tabela ou cartões comparativos | Usuário escolhe pelo menor número isolado | Item 10 |
| Gráfico | Apoiar leitura visual de tendência | Quando útil | Evolução, composição ou comparação | Gráfico com escala, legenda e descrição | Visual decorativo distorce leitura | Item 10 |
| Fontes | Sustentar dados e regras externas | Quando exigível | Indicadores, normas ou premissas externas | Fonte, data e natureza da referência | Confiança e rastreabilidade caem | Item 7 |
| Limites | Declarar o que a simulação não cobre | Sim | Sempre | Lista curta de limitações | Usuário interpreta como contrato real | Item 11 |
| Alertas | Apontar risco financeiro ou pedagógico | Quando aplicável | Endividamento, custo efetivo, fonte ausente | Alerta contextual e proporcional | Risco passa despercebido | Item 11 |
| Ações | Permitir continuidade clara | Sim | Sempre | Voltar ao início, nova simulação, limpar dados | Usuário fica preso ou confuso | Item 10 |
| Estados de carregamento | Indicar processamento | Sim | Durante cálculo ou busca futura | Mensagem e estado visual | Usuário repete ação ou abandona | Item 11 |
| Estados de erro | Explicar falha e próxima ação | Sim | Erro técnico ou validação | Mensagem, causa provável e correção | Erro parece quebra silenciosa | Item 11 |
| Estados vazios | Orientar início ou ausência de dados | Sim | Antes de resultado ou sem dados | Mensagem inicial e ação disponível | Tela parece incompleta | Item 10 |
| Ajuda contextual | Apoiar dúvida pontual | Quando útil | Termos técnicos e observações breves | Dúvidas interrompem fluxo | Item 10 |

## 12. Hierarquia visual obrigatória

A hierarquia deve priorizar: valor do módulo, entrada orientada, resultado principal, interpretação, memória, comparação, tabela/gráfico, fontes/limites e ações. Nenhum conteúdo essencial deve parecer apêndice lateral irrelevante.

Ordem recomendada de atenção:

1. O usuário entende o propósito da tela.
2. O usuário sabe quais dados precisa informar.
3. O usuário enxerga o resultado principal sem esforço.
4. O usuário recebe interpretação educacional do resultado.
5. O usuário consegue auditar a memória de cálculo.
6. O usuário consegue comparar cenários quando isso for relevante.
7. O usuário consulta tabela, gráficos, fontes, limites e avisos.
8. O usuário encontra ações claras para continuar.

Essa hierarquia pode ser adaptada por módulo, mas não pode inverter valor pedagógico: explicação essencial não deve ficar escondida enquanto elementos secundários ocupam a área principal.

## 13. Padrão de página inicial

A página inicial deve comunicar imediatamente que o produto é uma plataforma educacional financeira auditável. Deve destacar aprendizagem, simulação, comparação, memória de cálculo, fontes e clareza, não apenas navegação para calculadoras.

A home deve transmitir valor antes de listar módulos. O usuário precisa perceber que a aplicação ajuda a entender juros, dívidas, amortização, financiamento e decisões financeiras, não apenas preencher campos.

Elementos mínimos esperados:

- frase clara de proposta de valor;
- destaque para aprender, simular, comparar e auditar cálculos;
- indicação de que a plataforma mostra memória de cálculo;
- referência a fontes, limites e simulação educacional;
- navegação para módulos com rótulos consistentes;
- ausência de densidade excessiva logo no primeiro contato.

Critério de reprovação: a página inicial não deve parecer apenas um menu de calculadoras. Ela deve apresentar o valor educacional da Plataforma Educacional Financeira.

## 14. Padrão de tela de diagnóstico financeiro

A tela de diagnóstico financeiro deve explicar o que é diagnóstico financeiro, quais dados serão considerados, quais limites existem e como o resultado deve ser interpretado.

O resultado não pode aparecer como pontuação ou card isolado sem orientação educacional. A tela deve traduzir o resultado em leitura compreensível: situação geral, pontos de atenção, sinais de risco, próximos passos educativos e limites da análise.

Elementos mínimos esperados:

- conceito curto de diagnóstico financeiro;
- entrada de dados com rótulos e exemplos claros;
- resultado principal com interpretação;
- orientação educacional conectada aos dados informados;
- alertas proporcionais sobre endividamento, comprometimento ou inconsistência;
- limites da simulação, deixando claro que não é consultoria financeira personalizada;
- ações como Nova simulação, Limpar dados, Ver interpretação e Voltar ao início.

Critério de reprovação: diagnóstico financeiro que apenas mostra números ou cards sem interpretação, orientação educacional e limites não atende ao padrão.

## 15. Padrão de tela de juros simples e compostos

A tela de juros simples e juros compostos deve explicar a diferença conceitual entre os regimes, permitir simulação clara e mostrar memória de cálculo de cada resultado.

Quando houver comparação, a tela deve destacar como o crescimento muda ao longo do tempo. A comparação não deve ser apenas visual; precisa explicar por que juros compostos aceleram o crescimento e em quais contextos essa diferença importa.

Elementos mínimos esperados:

- conceito de juros simples;
- conceito de juros compostos;
- campos com capital, taxa, prazo e unidade temporal;
- resultado principal com interpretação educacional;
- memória de cálculo com fórmula, substituição e etapas;
- tabela de evolução quando aplicável;
- gráfico apenas se ajudar a entender a diferença de comportamento;
- comparação entre regimes quando ambos forem simulados;
- fontes e limites quando houver premissas externas.

Critério de reprovação: tela de juros simples ou compostos que calcula, mas não explica fórmula, substituição, prazo, taxa e diferença entre regimes.

## 16. Padrão de tela de amortização PRICE

PRICE deve explicar parcela constante, composição entre juros e amortização, evolução do saldo devedor e custo total. O usuário precisa entender que a parcela pode permanecer constante enquanto juros e amortização mudam por dentro.

A tela deve destacar:

- valor da parcela;
- total pago;
- total de juros;
- evolução do saldo;
- composição da parcela ao longo do tempo;
- memória de cálculo da prestação, quando aplicável;
- tabela com mês, saldo, juros, amortização e parcela.

O padrão visual deve dar protagonismo à tabela quando ela for a evidência central. Cards de resumo são úteis, mas não substituem a tabela nem a memória de cálculo.

## 17. Padrão de tela de amortização SAC

SAC deve explicar amortização constante, parcelas decrescentes e impacto da parcela inicial. A tabela deve destacar amortização, juros, parcela e saldo com alinhamento numérico e legibilidade.

A tela deve deixar claro que a amortização é constante, mas os juros tendem a diminuir conforme o saldo devedor cai. Essa explicação é essencial para o usuário não interpretar a parcela inicial maior como pior escolha sem comparação adequada.

Elementos mínimos esperados:

- conceito de amortização constante;
- destaque da primeira parcela, última parcela, total pago e total de juros;
- memória de cálculo da amortização e dos juros;
- tabela completa conforme prazo;
- interpretação educacional dos efeitos de parcelas decrescentes.

## 18. Padrão de tela de comparação PRICE x SAC

A comparação PRICE x SAC deve apresentar diferenças entre os sistemas sem induzir conclusão simplista. A tela precisa comparar parcela inicial, parcela final, total pago, total de juros, evolução do saldo e esforço financeiro ao longo do prazo.

A comparação deve citar explicitamente PRICE e SAC, explicar o trade-off entre previsibilidade de parcela e redução progressiva, e mostrar custo total de forma compreensível.

Elementos mínimos esperados:

- resumo lado a lado de PRICE e SAC;
- diferença absoluta e percentual quando fizer sentido;
- gráfico ou tabela comparativa quando ajudar a leitura;
- memória de cálculo ou link claro para memória de cada sistema;
- alerta de que a escolha real depende de contrato, renda, perfil e condições da instituição;
- interpretação educacional, não recomendação personalizada.

Critério de reprovação: comparação que apenas aponta “menor custo” ou “menor parcela” sem explicar trade-offs.

## 19. Padrão de tela de financiamento imobiliário

A tela de financiamento imobiliário deve tratar prazo, entrada, taxa, sistema de amortização, seguros/tarifas quando aplicável, tabela longa, comparação SAC x PRICE e limites da simulação.

Como financiamentos imobiliários podem ter 120, 240, 360, 420 ou até 600 meses, a tabela deve ser dinâmica e proporcional ao prazo informado. Não é aceitável cortar a tabela principal sem informar claramente o critério de exibição.

Elementos mínimos esperados:

- explicação curta sobre financiamento imobiliário;
- entrada orientada para valor do imóvel, entrada, prazo, taxa e sistema;
- resultado principal com parcela, total pago, juros e saldo;
- tabela completa conforme prazo;
- comparação SAC x PRICE quando aplicável;
- gráfico apenas se melhorar leitura de evolução;
- memória de cálculo;
- fontes, limites e avisos sobre diferença entre simulação e contrato real;
- ações claras como Nova simulação, Limpar dados, Comparar cenário e Ver memória de cálculo.

Critério de reprovação: financiamento imobiliário com tabela espremida, incompleta, escondida ou incapaz de refletir prazo dinâmico.

## 20. Padrão para módulos futuros

Todo módulo futuro deve nascer obedecendo a este padrão, salvo justificativa explícita registrada em documentação viva. O padrão mínimo é: valor, conceito, entrada, resultado, interpretação, memória, tabela ou gráfico quando aplicável, fontes, limites, alertas e ações.

Módulos futuros não devem copiar telas existentes de forma automática. Eles devem reaplicar a anatomia oficial considerando o domínio financeiro específico: dívidas, consórcios, cheque especial, cartão, investimentos, renegociação, financiamentos ou outros.

Critério de aceite para módulo futuro: antes de implementar, deve existir clareza sobre qual problema financeiro o módulo resolve, qual cálculo executa, qual memória produz, quais fontes usa e como será avaliado pelo Value Gate.

## 21. Padrão de abas educacionais

Abas candidatas oficiais: Conceito, Simular, Resultado, Memória de Cálculo, Tabela, Comparar, Gráficos, Fontes e Limites, Cuidados.

Nem toda tela precisa exibir todas as abas ao mesmo tempo. Abas devem aparecer conforme módulo e maturidade do fluxo. O conteúdo educativo essencial não deve ficar escondido apenas em modal. Modais e modais auxiliares podem existir para apoio contextual, mas não devem carregar o conteúdo essencial da aprendizagem. A escolha final de abas por módulo será refinada no protótipo do Item 10.

Critério de qualidade: se a informação é necessária para o usuário compreender o cálculo, interpretar o resultado, auditar a memória ou entender limites e fontes, ela deve estar em área nobre, aba principal ou fluxo central, e não apenas em modal periférico.

Exemplo correto: em Juros Compostos, a aba Conceito explica capital, taxa e prazo; a aba Simular recebe os dados; a aba Resultado mostra montante e juros; a aba Memória de Cálculo mostra fórmula e substituição; a aba Tabela mostra evolução; a aba Fontes e Limites explica premissas e finalidade educacional.

Contraexemplo proibido: uma tela que mostra apenas campos e resultado, colocando toda explicação em um botão pequeno “Entenda” ou em modal lateral, sem integrar conceito, memória e limites ao fluxo principal.

## 22. Padrão de área de entrada de dados

Entradas devem informar unidade, formato, exemplo, intervalo aceito e impacto esperado. Campos devem validar antes do cálculo e preservar dados quando ocorrer erro técnico.

A área de entrada deve ajudar o usuário a preencher melhor, não apenas rejeitar erros. Sempre que possível, rótulos e textos de ajuda devem explicar o significado financeiro do dado.

Critérios obrigatórios:

- unidade visível, como reais, percentual, meses ou anos;
- exemplo de preenchimento quando houver risco de ambiguidade;
- validação específica por campo;
- preservação dos dados após erro;
- mensagem clara quando faltar informação;
- separação entre erro de validação e erro técnico;
- indicação de impacto educacional quando o campo alterar fortemente o resultado.

## 23. Padrão de área de resultado

O resultado principal deve ser imediatamente compreensível, com unidade, legenda, leitura curta e ponte para interpretação. Não basta exibir valor monetário ou percentual isolado.

A área de resultado deve responder rapidamente: o que foi calculado, qual é o número principal, qual sua unidade, como interpretar e onde auditar.

Critérios obrigatórios:

- valor principal em hierarquia superior;
- unidade e legenda sem ambiguidade;
- resumo interpretativo próximo ao número;
- acesso visível à memória de cálculo;
- conexão com tabela, gráfico ou comparação quando aplicável;
- indicação de limitações quando o resultado depender de premissas incompletas.

## 24. Padrão de interpretação educacional

A interpretação deve responder: o que este resultado significa, por que importa, qual cuidado observar e qual limitação impede conclusão contratual ou recomendação personalizada.

Ela deve ser escrita em linguagem clara e conectada aos dados informados pelo usuário. A interpretação não deve parecer texto genérico reutilizado sem relação com o resultado.

Critérios obrigatórios:

- explicar significado financeiro do resultado;
- indicar consequência ou leitura prática;
- separar fato, inferência e limite;
- apontar cuidado relevante sem alarmismo;
- evitar recomendação personalizada indevida;
- sugerir próximo passo educacional quando aplicável.

## 25. Padrão de memória de cálculo

A memória de cálculo é obrigatória sempre que houver cálculo financeiro relevante. Deve incluir fórmula usada, descrição da fórmula, substituição dos valores, etapas intermediárias, arredondamento, premissas, resultado final, relação com tabela e relação com fonte ou regra.

A memória deve ser compreensível para usuário leigo, mas suficientemente rigorosa para auditoria. Ela não pode ser apenas uma fórmula solta.

Estrutura mínima esperada:

1. Nome do cálculo.
2. Fórmula usada.
3. Explicação curta da fórmula.
4. Substituição dos valores informados.
5. Etapas intermediárias.
6. Critério de arredondamento.
7. Resultado final.
8. Relação com tabela ou gráfico.
9. Fonte, regra ou premissa quando aplicável.

Critério de reprovação: resultado financeiro relevante sem memória de cálculo acessível, legível e coerente com o algoritmo executado.

## 26. Padrão de comparação de cenários

Comparar cenários exige mostrar diferenças absolutas, percentuais e trade-offs de prazo, taxa, entrada, parcela, custo total e risco. A comparação deve explicar, não apenas ranquear.

Comparações devem evitar a falsa ideia de que existe sempre uma resposta universal. O menor custo total pode exigir parcela inicial maior; a menor parcela pode aumentar custo total; prazo maior pode reduzir parcela e elevar juros.

Critérios obrigatórios:

- indicar quais variáveis mudaram;
- manter premissas visíveis;
- mostrar diferença absoluta e percentual quando útil;
- explicar trade-off principal;
- permitir retornar à memória de cálculo;
- alertar que a decisão real depende de contrato, renda, instituição e contexto pessoal.

## 27. Padrão de tabelas financeiras longas

Tabelas financeiras devem ter tamanho dinâmico conforme o prazo em meses do financiamento ou simulação.

Exemplos obrigatórios:

- Financiamento de 360 meses deve permitir renderizar 360 linhas.
- Financiamento de 120 meses deve permitir renderizar 120 linhas.
- Financiamento de 600 meses deve permitir renderizar 600 linhas.

É proibido aplicar solução hardcoded apenas para "mostrar 360 linhas". É proibido cortar linhas da tabela sem deixar isso claro ao usuário. É proibido esconder a tabela principal quando ela for a evidência central do cálculo.

O padrão exige cabeçalho fixo ou solução equivalente, rolagem vertical controlada, rolagem horizontal apenas quando inevitável, colunas legíveis, alinhamento numérico, totais e subtotais, responsividade, acessibilidade por teclado e possibilidade futura de exportação, sem implementar exportação neste item.

## 28. Padrão de gráficos

Gráficos devem apoiar leitura visual de tendência, composição ou comparação. Eles não devem decorar a tela nem substituir tabela, memória de cálculo ou interpretação.

Um gráfico só deve aparecer quando melhora a compreensão. Para evolução temporal, deve deixar claro eixo, escala, unidade e série. Para composição, deve explicar partes do total. Para comparação, deve evitar distorção visual.

Critérios obrigatórios:

- título claro;
- legenda quando houver mais de uma série;
- unidade visível;
- escala legível;
- descrição educacional curta;
- coerência com tabela e resultado;
- acessibilidade mínima por texto complementar.

## 29. Padrão de fontes, limites e avisos

A tela deve mostrar fonte oficial quando aplicável, data de referência, limite da simulação, diferença entre simulação educacional e contrato real, diferença entre cálculo matemático e prática de mercado e aviso de que a aplicação não substitui análise profissional, bancária, contábil ou jurídica.

Fontes e limites não devem ficar invisíveis. Eles fazem parte da confiança do produto e devem estar acessíveis em área própria, aba ou bloco contextual.

Critérios obrigatórios:

- fonte oficial ou origem da premissa;
- data de referência;
- descrição do limite da simulação;
- aviso de finalidade educacional;
- distinção entre cálculo e contrato;
- cuidado contra recomendação financeira personalizada indevida;
- mensagem específica quando fonte oficial estiver indisponível futuramente.

## 30. Padrão de alertas e riscos

Alertas devem ser proporcionais, pedagógicos e contextualizados. Devem indicar endividamento, custo efetivo, fonte indisponível, dados insuficientes, prazo longo, comprometimento de renda ou limitação relevante quando aplicável.

Alerta não deve assustar sem explicar. Também não deve suavizar risco real. O objetivo é ajudar o usuário a interpretar a simulação com mais responsabilidade.

Critérios obrigatórios:

- mensagem curta e específica;
- relação clara com dados ou resultado;
- orientação educacional, não prescrição personalizada;
- indicação de onde o usuário pode entender melhor;
- distinção entre alerta financeiro, erro de validação e limite da simulação.

## 31. Padrão de ações do usuário

Ações recomendadas: Voltar ao início, Nova simulação, Limpar dados, Comparar cenário, Ver memória de cálculo, Ver fontes e limites e Exportar futuramente, quando implementado.

Ações devem ser reais, compreensíveis e compatíveis com o estado da tela. A interface não deve oferecer ação que não existe, não funciona ou não faz sentido no contexto.

Padrão mínimo:

- Voltar ao início: retorna à página inicial ou visão de módulos.
- Nova simulação: inicia novo fluxo preservando o contexto do módulo.
- Limpar dados: remove entradas informadas com intenção clara.
- Comparar cenário: aparece apenas quando a comparação for suportada.
- Ver memória de cálculo: aparece após cálculo relevante.
- Ver fontes e limites: sempre que houver fonte, premissa ou aviso importante.
- Exportar: somente quando implementado; até lá pode ser previsto como capacidade futura, não como botão funcional.

## 32. Padrão de botões e navegação

Botões devem representar ações reais. O botão “Sair” não deve aparecer enquanto não houver autenticação, sessão real ou perfil de usuário. Sem autenticação, preferir Voltar ao início, Nova simulação ou Limpar dados.

A navegação deve deixar claro se o usuário está iniciando nova simulação, retornando ao início, limpando dados, comparando cenário, abrindo memória de cálculo ou consultando fontes e limites.

Ações sem efeito real, ambíguas ou incompatíveis com o estado da aplicação devem ser removidas ou substituídas por ações compreensíveis.

## 33. Padrão de estados da tela

| Estado | Mensagem esperada | Ação disponível | Risco se mal tratado |
| --- | --- | --- | --- |
| Estado inicial | Explique o objetivo do módulo e convide à simulação | Preencher dados ou aprender conceito | Tela parecer vazia ou genérica |
| Estado com dados parciais | Indique o que falta e preserve o que já foi informado | Completar campos | Usuário tentar calcular sem dados suficientes |
| Estado de carregamento | Informe que o cálculo está sendo preparado | Aguardar ou cancelar quando existir suporte | Usuário repetir clique ou desconfiar |
| Estado de sucesso | Mostre resultado, interpretação e próximos caminhos | Ver memória, comparar, tabela, fontes ou nova simulação | Resultado virar número solto |
| Estado de erro de validação | Explique campo, regra e correção | Corrigir dados | Erro parecer punição ou falha técnica |
| Estado de erro técnico | Informe falha técnica sem perder dados do usuário | Tentar novamente ou voltar | Perda de confiança |
| Estado sem resultado | Explique por que ainda não há resultado | Informar dados ou revisar critérios | Usuário achar que a tela quebrou |
| Estado com resultado incompleto ou limitado | Mostre a limitação e o que está ausente | Ver limites ou complementar dados | Usuário interpretar estimativa como completa |
| Estado com alerta educacional | Apresente risco e contexto | Ler cuidados, comparar alternativa | Risco financeiro ficar invisível |
| Estado com fonte oficial indisponível | Explique indisponibilidade e data conhecida | Usar premissa manual ou aguardar | Fonte desatualizada parecer oficial |

## 34. Padrão de responsividade

A tela deve funcionar em diferentes larguras sem esconder conteúdo essencial. Em telas menores, a hierarquia deve ser reorganizada, não destruída.

Responsividade não significa apenas empilhar blocos. A experiência móvel deve preservar: explicação, entrada, resultado, interpretação, memória, tabela quando aplicável, fontes e ações.

Critérios obrigatórios:

- leitura confortável em telas pequenas;
- ações principais visíveis;
- tabelas com rolagem controlada quando necessário;
- cards não devem comprimir números críticos;
- abas devem permanecer navegáveis;
- conteúdo educativo essencial não deve desaparecer;
- estados de erro e validação devem continuar claros.

## 35. Padrão de acessibilidade

A tela deve ser navegável, legível e compreensível. Acessibilidade não deve ser tratada como ajuste final, mas como parte do padrão oficial.

Critérios mínimos:

- contraste adequado;
- foco visível;
- rótulos associados a campos;
- mensagens de erro específicas;
- navegação por teclado quando aplicável;
- textos alternativos ou descrições para gráficos relevantes;
- tabelas com cabeçalho compreensível;
- linguagem clara para reduzir barreira cognitiva.

## 36. Padrão de linguagem e microcopy

A linguagem deve ser clara, culta, educativa e precisa. Deve evitar promessa de economia garantida, recomendação personalizada, jargão sem explicação e mensagens que culpabilizem o usuário.

Microcopy deve ajudar o usuário a agir e aprender. Botões, labels, mensagens de erro, avisos e textos de ajuda devem usar termos consistentes entre módulos.

Critérios obrigatórios:

- verbos claros em botões;
- nomes financeiros corretos;
- explicação de jargões;
- tom respeitoso;
- ausência de promessa indevida;
- separação entre simulação, contrato e orientação educacional.

## 37. Padrão de densidade visual

Densidade visual deve favorecer compreensão. A tela não deve parecer documento colado, painel lotado ou formulário sem hierarquia.

Conteúdo denso deve ser organizado em abas, blocos, cards ou seções progressivas. Tabelas longas devem ter espaço próprio, não disputar área com textos laterais pequenos.

Critérios obrigatórios:

- resultado principal com respiro visual;
- explicação essencial em área nobre;
- tabela com espaço suficiente;
- fontes e limites acessíveis, mas sem poluir a leitura inicial;
- uso equilibrado de cards;
- ausência de excesso de botões simultâneos.

## 38. Padrão de consistência entre módulos

Diagnóstico, juros, amortização, financiamento e módulos futuros devem compartilhar anatomia, ações, estados, linguagem, padrão de tabelas, memória e fontes, mantendo adaptações por domínio financeiro.

Consistência não significa telas idênticas. Significa que o usuário reconhece a lógica da plataforma em qualquer módulo: entender, simular, interpretar, auditar, comparar, consultar fontes e agir.

Critérios obrigatórios:

- mesmos nomes para ações equivalentes;
- padrão comum de abas quando aplicável;
- memória de cálculo com estrutura semelhante;
- tabelas com alinhamento e comportamento consistentes;
- alertas e limites com linguagem compatível;
- diferenças de domínio documentadas no protótipo ou implementação.

## 39. Padrão de evidência para auditoria futura

Cada tela futura deve produzir evidência auditável: print ou descrição visual, checklist de padrão, memória de cálculo, comportamento de tabela, estados principais, fontes/limites e critérios de aceite do PO quando aplicável.

A auditoria futura não deve depender apenas de opinião visual. Deve haver critérios observáveis para afirmar se uma tela atende ou não ao padrão.

Evidências mínimas esperadas:

- captura ou descrição da tela em estado inicial;
- captura ou descrição com resultado;
- prova de memória de cálculo;
- prova de tabela quando aplicável;
- prova de fontes e limites;
- prova de estados de erro ou validação;
- registro de aceite, ressalva ou reprovação do PO no Item 13.

## 40. Relação com contrato educacional da API

Este padrão cria demanda para campos estruturados como resultado, interpretacao, memoriaCalculo, formula, substituicoes, etapas, fontes, limites, alertas, comparacoes, tabela, graficos e metadadosEducacionais. O contrato final da API será definido no Item 7.

A relação com a API é direta: se a tela precisa explicar, auditar e contextualizar, o backend não deve entregar apenas números soltos quando o cálculo for relevante.

Demandas prováveis para o Item 7:

- resultado estruturado;
- interpretação educacional;
- memória de cálculo;
- fórmula e substituições;
- etapas intermediárias;
- critérios de arredondamento;
- fontes e datas;
- limites da simulação;
- alertas;
- dados tabulares;
- metadados educacionais;
- comparações estruturadas quando aplicável.

Este Item 6 não fecha o contrato. Ele apenas define as necessidades de tela que o contrato educacional da API deverá considerar.

## 41. Relação com auditoria das telas atuais

As telas atuais serão auditadas contra este padrão no Item 8: Home, Diagnóstico financeiro, Juros simples, Juros compostos, Comparação de juros, Amortização PRICE, Amortização SAC, Comparação PRICE x SAC, Financiamento imobiliário e Comparação SAC x PRICE no financiamento.

A auditoria deve verificar se cada tela possui valor claro, conceito, entrada orientada, resultado, interpretação, memória, tabela, gráfico, fontes, limites, alertas e ações, conforme aplicável.

O Item 8 deve separar:

- aderências já existentes;
- lacunas visuais;
- lacunas pedagógicas;
- lacunas matemáticas ou de memória;
- lacunas de fontes e limites;
- problemas de ação, navegação e estado;
- riscos de confundir cálculo funcional com experiência educacional aceita.

## 42. Relação com prototipação

Este padrão não substitui protótipo. Ele define critérios. O protótipo do Item 10 deverá transformar critérios em experiência visual validável.

A prototipação deve testar organização, hierarquia, abas, densidade visual, tabela, memória de cálculo, fontes, ações e estados antes de implementação. O protótipo deve tornar visível o que este documento define em linguagem normativa.

Critérios para o Item 10:

- transformar padrão em tela navegável ou representação visual suficientemente clara;
- permitir avaliação do PO antes de codar;
- evidenciar como conteúdo educativo aparece em área nobre;
- mostrar comportamento de tabela longa;
- mostrar acesso à memória de cálculo;
- mostrar fontes, limites, alertas e ações;
- reduzir risco de implementação tecnicamente correta, mas visualmente reprovada.

## 43. Relação com Value Gate

O Value Gate do Item 11 deverá transformar este padrão em checklist objetivo. Deve reprovar tela que calcula mas não explica, esconde memória, corta tabela essencial, usa modal como única fonte de educação essencial, não cita fontes/limites quando exigível ou parece funcional sem encantar nem comunicar valor.

## 44. Relação com aceite do PO

Merge técnico não é aceite visual/pedagógico. Checks verdes não são aceite do Product Owner. O PO deve avaliar a tela contra este padrão, e o aceite deve ser explícito, rastreável e registrado no Item 13.

O aceite do PO deve considerar valor percebido, clareza, encantamento, compreensão educacional, organização visual, tabela, memória, fontes, limites e ações. A tela pode passar em testes e ainda assim ser reprovada pelo PO.

Estados possíveis no Item 13:

- aceito sem ressalvas;
- aceito com ressalvas documentadas;
- reprovado visualmente;
- reprovado pedagogicamente;
- reprovado por ausência de evidência;
- reprovado por não atender ao padrão oficial.

Essa separação protege o projeto contra a repetição do erro de confundir conclusão técnica com produto aceito.

## 45. Relação com liberação futura da Sprint 5

A Sprint 5 permanece congelada.

Este padrão não libera a Sprint 5. Este padrão não conclui o Gate PO/UX/Valor. A liberação da Sprint 5 só pode ocorrer no Item 15, se os itens anteriores forem satisfatórios, houver evidência suficiente e o Product Owner registrar aceite explícito quando aplicável.

O padrão oficial de telas é condição preparatória para auditoria, prototipação, Value Gate, implementação piloto, aceite e replicação, mas não substitui nenhuma dessas etapas.

## 46. Critérios de aceite deste padrão

Este padrão será aceito quando cumprir simultaneamente os critérios abaixo:

- possuir 51 seções numeradas;
- definir anatomia oficial de módulo educacional auditável;
- tratar página inicial, diagnóstico, juros, amortização, comparação e financiamento imobiliário;
- definir padrão de abas, entradas, resultados, interpretação, memória, comparação, tabelas, gráficos, fontes, limites, alertas, ações e estados;
- registrar regra explícita para tabelas dinâmicas de 120, 360 e 600 meses;
- proibir solução hardcoded para “mostrar 360 linhas”;
- proibir botão “Sair” sem autenticação, sessão real ou perfil de usuário;
- preparar Item 7, Item 8, Item 10, Item 11, Item 13, Item 14 e Item 15;
- manter Sprint 5 congelada.

### Referências qualificadas usadas como fundamento

As referências abaixo não substituem as decisões do projeto. Elas servem como fundamento técnico para tornar o padrão menos opinativo e mais auditável.

| Referência qualificada | Princípio aproveitado | Uso no padrão da Plataforma |
| --- | --- | --- |
| W3C/WCAG | Acessibilidade perceptível, operável, compreensível e robusta | Foco visível, teclado, contraste, textos alternativos, rótulos e compreensão de estados |
| Nielsen Norman Group | Heurísticas de usabilidade, consistência, prevenção de erro, controle do usuário e ajuda | Value Gate, estados da tela, ações claras, feedback e critérios de reprovação |
| GOV.UK Design System | Erros devem informar o que aconteceu e como corrigir | Validação por campo, resumo de erro, mensagens específicas e preservação dos dados |
| U.S. Web Design System | Serviços públicos acessíveis, mobile-friendly e centrados em necessidades reais | Responsividade, consistência, linguagem clara e inclusão |
| CFPB Design System | Transparência, informação suficiente e controle do usuário em decisões financeiras | Fontes, limites, custo total, comparação responsável e simulação educacional |
| CFPB Data Visualization Guidelines | Visualizações devem transmitir significado e apoiar comparação | Gráficos financeiros com escala, legenda, unidade e interpretação |
| IBM Carbon Design System | Componentes consistentes, tabelas e acessibilidade por teclado | Tabelas longas, navegação por teclado, foco, cabeçalho e legibilidade |
| Material Design | Hierarquia, layout, interação e fundamentos de interface | Organização visual, estados, navegação e densidade |
| Microsoft Fluent | Consistência, inclusão, acessibilidade e experiência em produto | Linguagem, estados, ações e consistência entre módulos |

### Exemplos operacionais obrigatórios

| Situação | Exemplo correto | Contraexemplo proibido | Evidência exigida | Critério de reprovação |
| --- | --- | --- | --- | --- |
| Página inicial | Explica que a plataforma ajuda a aprender, simular, comparar e auditar cálculos financeiros | Home que parece apenas menu de calculadoras | Print ou descrição mostrando proposta de valor antes da lista de módulos | Reprovar se não comunicar valor educacional |
| Diagnóstico financeiro | Mostra resultado, interpretação, orientação educacional, limites e próximos passos | Cards numéricos sem explicação | Estado com resultado preenchido e texto interpretativo | Reprovar se calcular sem orientar |
| Juros simples e compostos | Explica diferença entre regimes, mostra fórmula, substituição, tabela e comparação | Resultado final sem fórmula nem evolução | Memória de cálculo e tabela de evolução | Reprovar se não explicar diferença entre regimes |
| Amortização PRICE | Explica parcela constante, juros, amortização, saldo e custo total | Mostrar apenas valor da parcela | Tabela com mês, juros, amortização, parcela e saldo | Reprovar se tabela ou memória ficarem secundárias |
| Amortização SAC | Explica amortização constante, parcelas decrescentes e saldo | Mostrar apenas primeira parcela | Tabela completa e interpretação da parcela decrescente | Reprovar se o usuário não entender a lógica do SAC |
| Comparação PRICE x SAC | Mostra parcela inicial, parcela final, total pago, juros, saldo e trade-offs | Dizer apenas qual é “mais barato” | Quadro comparativo e explicação dos trade-offs | Reprovar se induzir conclusão simplista |
| Financiamento imobiliário | Tabela dinâmica conforme prazo, comparação SAC x PRICE, fontes e limites | Cortar tabela longa ou esconder linhas essenciais | Simulação com 120, 360 e 600 meses | Reprovar se não respeitar prazo dinâmico |
| Tabela longa | Cabeçalho fixo ou solução equivalente, rolagem controlada, alinhamento numérico e teclado | Tabela espremida, cortada ou hardcoded | Evidência visual e teste de quantidade de linhas | Reprovar se prazo informado não corresponder às linhas |
| Gráfico | Mostra escala, unidade, legenda e interpretação | Gráfico decorativo sem explicar tendência | Print ou descrição com legenda e texto de leitura | Reprovar se gráfico não ajudar compreensão |
| Validação de campo | Campo “Prazo” informa unidade, exemplo e erro específico | Mensagem genérica “dados inválidos” | Estado de erro com campo preservado e correção clara | Reprovar se erro não disser como corrigir |
| Fontes e limites | Mostra fonte, data, premissa, limite e finalidade educacional | Fonte escondida ou ausente quando necessária | Bloco ou aba Fontes e Limites | Reprovar se simulação parecer contrato real |
| Botão “Sair” | Sem autenticação, usar Voltar ao início, Nova simulação ou Limpar dados | Botão “Sair” sem sessão real | Print ou descrição das ações disponíveis | Reprovar se houver ação falsa ou ambígua |
| Memória de cálculo | Fórmula, substituição, etapas, arredondamento e resultado final | Fórmula solta ou inexistente | Bloco de memória coerente com resultado | Reprovar se resultado relevante não for auditável |
| Conteúdo educativo | Conceito e cuidados em aba ou área central | Conteúdo essencial apenas em modais | Aba Conceito/Cuidados ou bloco central | Reprovar se aprendizagem depender de modal periférico |
| Estado de carregamento | Informa que cálculo está sendo processado e evita clique repetido | Tela sem resposta após ação | Estado visual e texto claro | Reprovar se usuário não souber o que está acontecendo |
| Estado vazio | Explica como iniciar e quais dados preencher | Tela vazia ou silenciosa | Estado inicial com orientação | Reprovar se parecer quebrada |
| Acessibilidade | Foco visível, teclado, rótulos, contraste e mensagens claras | Interação apenas por mouse ou cor | Evidência de navegação e foco | Reprovar se impedir uso básico por teclado |
| Microcopy | Usa linguagem financeira correta e explicada | Jargão bancário sem explicação | Labels, erros e textos de ajuda | Reprovar se linguagem gerar ambiguidade |
| Alertas | Indica risco com contexto e cuidado educacional | Alerta alarmista ou inexistente | Alerta associado ao resultado | Reprovar se risco relevante ficar invisível |
| Aceite do PO | PO avalia contra critérios visuais e pedagógicos | Merge técnico tratado como aceite | Registro de aceite, ressalva ou reprovação | Reprovar se não houver aceite explícito no Item 13 |

### Regra de transformação de referência em evidência

Toda referência usada neste padrão deve ser convertida em evidência observável. Não basta citar uma fonte qualificada; o padrão deve mostrar como ela aparece na tela, no comportamento, na mensagem, na tabela, no gráfico ou no critério de reprovação.

Fórmula operacional adotada: Referência qualificada → princípio adotado → exemplo correto → contraexemplo proibido → evidência exigida → critério de reprovação.

Essa regra deve orientar o Item 8, o Item 10, o Item 11 e o Item 13.

## 47. Riscos e mitigação

| Risco | Mitigação |
| --- | --- |
| Padrão virar genérico | Amarrar cada regra a evidência e item futuro. |
| Conteúdo educativo continuar escondido | Exigir abas ou áreas nobres para aprendizagem essencial. |
| Tabela longa ser cortada | Exigir renderização dinâmica conforme prazo e aviso de limitações. |
| API não sustentar a tela | Preparar campos para o Item 7. |
| Aceite técnico substituir aceite do PO | Registrar aceite explícito no Item 13. |

## 48. Política anti-obsolescência documental

Este padrão não substitui a matriz do Item 3 nem o plano do Item 4. Ele transforma parte das perguntas e do plano em critérios visuais/pedagógicos. Documentos históricos permanecem históricos.

Nenhum rascunho, backup, draft, placeholder ou evidência temporária deve entrar no repositório. Evidências da Codex ficam apenas no ZIP. Todo documento novo deve estar registrado em `living_docs.json` quando esse arquivo existir. Todo documento relevante deve aparecer no índice geral quando o índice existir. A planilha não deve ser atualizada neste item.

### Como evitar obsolescência deste padrão

Este documento deve permanecer útil enquanto representar critérios oficiais de tela. Se no futuro surgir uma matriz permanente de valor e qualidade do produto, este padrão deve ser tratado como documento histórico do Gate e como insumo técnico, não como concorrente.

Alterações futuras neste padrão só devem ocorrer quando houver mudança real em critérios de tela, evidência, auditoria, acessibilidade, contrato educacional da API ou Value Gate. Atualizações cosméticas, duplicação de documentos e rascunhos paralelos devem ser evitados.

As referências qualificadas registradas neste documento não tornam o padrão dependente de uma biblioteca visual específica. Elas fundamentam critérios gerais de qualidade, mas a identidade visual e pedagógica da Plataforma Educacional Financeira permanece própria.

## 49. Escopo proibido neste item

Este item não implementa código, não altera frontend, não altera backend, não muda testes, não atualiza planilha, não cria protótipo, não escolhe módulo-piloto, não cria Value Gate final e não libera Sprint 5.

Também é proibido tratar este documento como conclusão do Gate. Ele é uma etapa normativa intermediária.

Qualquer alteração material em componentes, rotas, API, cálculo, layout real, planilha ou testes deve ocorrer em item futuro apropriado e com escopo próprio.

## 50. Próximos passos

Próximos passos do Gate:

1. Item 7 — Definir contrato educacional da API.
2. Item 8 — Auditar telas atuais contra este padrão.
3. Item 9 — Escolher módulo-piloto.
4. Item 10 — Prototipar antes de codar.
5. Item 11 — Criar Value Gate.
6. Item 12 — Implementar piloto.
7. Item 13 — Obter aceite do PO.
8. Item 14 — Replicar padrão.
9. Item 15 — Avaliar liberação futura da Sprint 5.

Nenhum desses passos deve ser pulado. O padrão oficial de telas só cumpre sua função se for usado como régua para as próximas decisões.

## 51. Veredito final do Item 6

Este documento define o padrão oficial de telas do Gate PO/UX/Valor e prepara auditoria, contrato educacional da API, prototipação, Value Gate, aceite do PO e replicação futura.

Este padrão não implementa, não prototipa, não conclui o Gate e não libera a Sprint 5. A Sprint 5 permanece congelada até que os itens posteriores produzam evidência suficiente e aceite formal do Product Owner, se cabível.

Veredito: o Item 6 estabelece a régua visual, pedagógica, financeira e auditável que impedirá que novas telas sejam aceitas apenas por funcionarem tecnicamente.
