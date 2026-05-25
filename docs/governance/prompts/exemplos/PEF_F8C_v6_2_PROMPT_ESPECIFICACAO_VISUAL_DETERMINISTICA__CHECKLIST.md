# PEF — ITEM 14F-F8C-v6.2
## Prompt adaptado ao TEMPLATE OFICIAL — Prompt com Checklist Operacional e Auditável
> Marcador de escopo governado: SEM IMPLEMENTAÇÃO REACT / SEM PATCH / SEM ALTERAR REPO.

```text
============================================================
PEF — ITEM 14F-F8C-v6.2
ESPECIFICAÇÃO VISUAL DETERMINÍSTICA DO MÓDULO IMÓVEL
PROMPT COM CHECKLIST OPERACIONAL E AUDITÁVEL
============================================================

## 0. CABEÇALHO OPERACIONAL

Projeto: Plataforma Educacional Financeira — PEF
Módulo: Financiamento Imobiliário
Item: 14F-F8C-v6.2
Tipo de tarefa: especificação visual determinística
Executor: IA design/UX/produto/documentação
Auditoria: Camaleão/Moisés
Modo de entrega: ZIP único + relatório + script de validação
Materialização em repo: proibida nesta rodada
Implementação React: proibida nesta rodada
Patch: proibido nesta rodada
Commit/push/PR/merge: proibidos nesta rodada

Regra central:
Esta rodada deve produzir uma especificação visual determinística, não uma nova implementação e não um protótipo livre.

============================================================
## 1. MISSÃO EM UMA FRASE
============================================================

Criar uma especificação visual determinística, tela por tela, aba por aba e componente por componente, para que uma futura implementação React do módulo Financiamento Imobiliário seja fiel à direção visual aprovada pelo PO, sem alterar o repositório, backend, frontend, fórmulas ou contratos.

============================================================
## 2. PAPEL DA IA EXECUTORA
============================================================

Você atuará como:

- Product Designer sênior;
- UX/UI Designer sênior;
- Design System Architect;
- especialista em produto educacional financeiro;
- especialista em visualização de dados financeiros;
- auditor de legibilidade, contraste, responsividade e usabilidade;
- redator técnico de especificações determinísticas para implementação futura.

Comportamento obrigatório:

- não inventar livremente uma “interface bonita”;
- não criar index.html, salvo autorização explícita;
- não criar React;
- não criar patch;
- não alterar repo;
- não declarar aceite do PO;
- especificar decisões visuais de forma verificável;
- registrar limitações honestas;
- diferenciar autovalidação técnica de aprovação humana.

============================================================
## 3. CONTEXTO NECESSÁRIO
============================================================

As tentativas anteriores de correção visual do módulo Imóvel falharam porque as IAs executoras receberam liberdade excessiva para criar uma interface bonita.

A entrega F8C-v6.1 não deve ser usada como base visual oficial, pois:

1. não atendeu à direção visual desejada pelo PO;
2. eliminou rolagem com solução artificial de viewport/overflow, sem composição premium;
3. criou excesso de espaço vazio;
4. empobreceu a densidade útil das telas;
5. gerou aparência de formulário esticado;
6. alterou indevidamente o cenário demonstrativo;
7. tratou design como distribuição mecânica de cards;
8. não aplicou de forma relevante efeitos premium como Aurora/Gradient Border;
9. não produziu experiência visual encantadora, moderna e confiável.

Decisão de processo:
A partir deste item, a IA não deve decidir layout, cores, densidade, hierarquia ou composição visual por conta própria. A entrega deve funcionar como contrato visual para uma futura implementação React.

============================================================
## 4. FONTES OBRIGATÓRIAS
============================================================

Use como fonte conceitual:

- especificação F8A-v2 aprovada visualmente pelo PO, se disponível no ambiente executor;
- documentação vigente do módulo Financiamento Imobiliário, se disponível;
- padrão oficial de telas do Gate PO/UX/Valor, se disponível;
- contratos UI/UX existentes, se disponíveis;
- diretrizes visuais deste próprio prompt, que prevalecem para esta rodada.

Regra:
Se alguma fonte externa citada não estiver disponível no ambiente executor, registre a ausência em `AUTOVALIDACAO_E_AUDITORIA.md` e siga somente com as regras explícitas deste prompt. Não invente histórico ou aprovação inexistente.

============================================================
## 5. ESCOPO PERMITIDO
============================================================

Você pode criar somente um pacote ZIP contendo documentos e script de validação.

Arquivos obrigatórios dentro do ZIP:

1. `ESPECIFICACAO_VISUAL_DETERMINISTICA_IMOVEL.md`
2. `DESIGN_SYSTEM_IMOVEL_DETERMINISTICO.md`
3. `MATRIZ_ETAPAS_ABAS_COMPONENTES.md`
4. `MATRIZ_CRITERIOS_ACEITE_VISUAL.md`
5. `CONTRATO_VISUAL_IMOVEL_V6_2.json`
6. `WIREFRAME_TEXTUAL_DETERMINISTICO.md`
7. `AUTOVALIDACAO_E_AUDITORIA.md`
8. `validate-spec.mjs`

Conteúdo permitido:

- arquitetura oficial da interface;
- design system do módulo;
- regras de composição;
- regras de rolagem;
- regras de abas internas por etapa;
- especificação de cada etapa;
- especificação de cada aba;
- especificação de cards, tabelas, gráficos, formulários e CTAs;
- critérios de aceite visual;
- plano de validação e autovalidação;
- contrato visual JSON consumível em auditoria futura.

============================================================
## 6. ESCOPO PROIBIDO
============================================================

É proibido:

- implementar React;
- criar patch;
- alterar frontend real;
- alterar backend;
- alterar fórmulas;
- alterar contrato da API;
- abrir PR;
- fazer commit;
- fazer push;
- fazer merge;
- criar index.html nesta rodada, salvo autorização explícita;
- usar F8C-v6.1 como base visual oficial;
- alterar cenário financeiro demonstrativo;
- usar comparação SAC x PRICE com bases injustas;
- declarar a entrega como aprovada, aceita ou final pelo PO;
- substituir especificação por frases genéricas como “criar visual premium”;
- usar placeholder, TODO, “definir depois” ou “ajustar futuramente” como substituto de especificação.

============================================================
## 7. INVARIANTES QUE NÃO PODEM REGREDIR
============================================================

Preservar obrigatoriamente:

- finalidade educacional e de simulação;
- clareza pedagógica;
- cenário financeiro demonstrativo fixo;
- comparação justa SAC x PRICE;
- legibilidade;
- contraste;
- fonte mínima;
- ausência de rolagem vertical global desnecessária em desktop 1920x1080;
- navegação por 7 etapas;
- abas internas contextuais;
- densidade útil sem compressão ilegível;
- uso moderado de Aurora Gradient Border;
- aceite humano do PO como etapa obrigatória posterior.

============================================================
## 8. DADOS FIXOS / CENÁRIO FINANCEIRO DEMONSTRATIVO
============================================================

É proibido alterar estes dados sem autorização explícita:

- Valor do imóvel: R$ 870.000,00
- Entrada: R$ 700.000,00
- Valor financiado: R$ 170.000,00
- Prazo: 120 meses
- Taxa mensal: 0,85% a.m.
- Encargos mensais demonstrativos: R$ 205,00
- Encargos totais em 120 meses: R$ 24.600,00
- Sistema principal: SAC
- Comparação secundária: PRICE, usando a mesma taxa mensal quando a comparação for pedagógica de sistema.

Regra obrigatória para SAC x PRICE:

- mesmo principal;
- mesmo prazo;
- mesma taxa;
- mesmos encargos;
- mesma regra de total pago.

Total pago = principal + juros totais + encargos totais.

É proibido usar taxas diferentes para SAC e PRICE em comparação apresentada como comparação de sistemas, salvo se a tela declarar explicitamente outro cenário. Para esta especificação, não criar outro cenário.

============================================================
## 9. REQUISITOS VISUAIS / UX / PRODUTO
============================================================

Direção visual oficial:

A interface deve parecer:

- produto educacional financeiro premium;
- moderna;
- clara;
- viva;
- confiável;
- sofisticada;
- didática;
- organizada;
- confortável de ler;
- visualmente superior ao estado atual.

A interface não deve parecer:

- planilha apertada;
- formulário esticado;
- dashboard genérico;
- wireframe cinza;
- tela bancária burocrática;
- protótipo cru;
- página com cards soltos;
- tela artificialmente presa por overflow hidden;
- composição pobre com muito vazio inútil.

## 9.1 Tipografia

Fonte principal: Manrope

Fallback:

`font-family: "Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;`

Escala mínima:

- título principal da etapa: 22px a 28px;
- subtítulo da etapa: 13px a 16px;
- títulos de cards: 14px a 18px;
- texto comum: mínimo 13px;
- tabelas: mínimo 13px;
- labels auxiliares: mínimo 11px;
- números financeiros principais: 26px a 44px;
- números financeiros secundários: 18px a 26px.

Proibido:

- microtexto para fazer caber;
- fonte menor que 10px;
- tabela com fonte menor que 13px;
- labels importantes apagadas;
- números financeiros pequenos demais.

## 9.2 Paleta oficial

Usar:

- `--navy: #071B3A;`
- `--deep-blue: #082A5E;`
- `--royal-blue: #2563EB;`
- `--purple: #6426A8;`
- `--violet: #7C3AED;`
- `--green: #0B5D3B;`
- `--teal: #007C78;`
- `--cyan: #0088A9;`
- `--gold: #B77900;`
- `--orange: #C76A00;`
- `--indigo: #29338C;`
- `--soft-bg: #F2F6FB;`
- `--white: #FFFFFF;`

Regra obrigatória:
Em fundo escuro, azul-marinho, azul-escuro, roxo forte, verde escuro, teal forte, índigo, laranja forte ou dourado forte:

- texto principal branco;
- títulos brancos;
- números brancos;
- subtítulos brancos ou branco suavizado com contraste suficiente.

Proibido:

- texto preto sobre fundo escuro;
- cinza escuro sobre fundo azul-marinho;
- azul escuro sobre fundo azul escuro;
- contraste fraco;
- vermelho como cor de atenção comum.

Vermelho só pode ser usado para erro crítico real. Para atenção educacional, usar dourado ou laranja.

## 9.3 Efeito premium — Aurora Gradient Border

Incluir no design system componente premium chamado `Aurora Gradient Border`.

Também pode ser referido como:

- Gradient Border;
- Aurora Border;
- Aurora Glow;
- Glowing Border;
- Neon Border;
- Iridescent/Shimmer Border.

Uso permitido:

1. CTA principal da etapa Simular;
2. card principal da etapa Resultado;
3. card de decisão da etapa Decidir;
4. card vencedor/insight da etapa Comparar;
5. alertas educativos estratégicos;
6. componentes de insight, decisão ou ação recomendada.

Regra:

- no máximo 1 ou 2 elementos Aurora por tela;
- nunca aplicar em todos os cards;
- nunca aplicar em tabela inteira;
- nunca prejudicar legibilidade;
- brilho externo discreto;
- borda com gradiente elegante;
- aparência premium, não infantil;
- animação opcional e sutil, respeitando `prefers-reduced-motion`.

Critério:
O efeito deve chamar atenção de forma sofisticada, não carnavalesca.

============================================================
## 10. REGRA DE ROLAGEM E VIEWPORT
============================================================

O PO rejeita fortemente barras de rolagem verticais.

Objetivo:
Em desktop 1920x1080, cada combinação “etapa + aba ativa” deve caber na viewport sem barra de rolagem vertical do navegador.

Proibido resolver isso com:

- `body overflow:hidden` sem boa composição;
- cards esvaziados;
- remoção de conteúdo relevante;
- espaços vazios gigantes;
- microfontes;
- compressão ilegível;
- conteúdo cortado;
- rodapé cobrindo conteúdo;
- scroll dentro de scroll;
- tabs com scrollbar;
- áreas pequenas com scrollbar vertical.

Solução correta:

- navegação em duas camadas;
- abas internas contextuais;
- conteúdo por aba com densidade útil;
- tabelas paginadas;
- gráficos proporcionais;
- cards bem dimensionados;
- headers compactos;
- stepper compacto;
- bottom navigation compacta;
- subdivisão por abas, subvisões, paginação ou cards alternáveis quando houver muito conteúdo.

============================================================
## 11. ARQUITETURA OFICIAL — NAVEGAÇÃO EM DUAS CAMADAS
============================================================

Camada 1: stepper principal com 7 etapas:

1. Preparar
2. Simular
3. Resultado
4. Entender
5. Comparar
6. Conferir
7. Decidir

Camada 2: abas internas contextuais dentro de cada etapa.

Cada tela deve exibir:

- uma etapa ativa;
- uma aba interna ativa;
- conteúdo útil, bonito e legível;
- nenhuma rolagem vertical desnecessária;
- navegação inferior clara.

Proibido:

- microbotões ilegíveis;
- esconder conteúdo essencial;
- usar scroll vertical para compensar má arquitetura;
- criar dezenas de abas confusas;
- usar nomes genéricos como “Info 1” ou “Info 2”.

============================================================
## 12. ABAS OBRIGATÓRIAS POR ETAPA
============================================================

Etapa 1 — Preparar:

1. Visão Geral
2. Entrada
3. Valor Financiado
4. SAC x PRICE
5. Cuidados

Etapa 2 — Simular:

1. Dados do Imóvel
2. Condições
3. Custos
4. Sistema
5. Resumo

Etapa 3 — Resultado:

1. Resumo
2. Cenário
3. Alertas
4. Interpretação

Etapa 4 — Entender:

1. Parcela
2. Amortização
3. Juros
4. Saldo Devedor
5. SAC x PRICE

Etapa 5 — Comparar:

1. Resumo Comparativo
2. Tabela SAC
3. Tabela PRICE
4. Gráfico
5. Leitura Pedagógica

Etapa 6 — Conferir:

1. Fórmulas SAC
2. Fórmulas PRICE
3. Variáveis
4. Passo a Passo
5. Auditoria

Etapa 7 — Decidir:

1. Diagnóstico
2. Checklist
3. Próximos Passos
4. Cuidados
5. Conclusão

============================================================
## 13. PADRÃO DE LAYOUT GLOBAL
============================================================

A especificação deve definir o layout global com:

1. Topbar institucional:
   - altura compacta;
   - fundo navy/deep-blue;
   - texto branco;
   - logo PEF;
   - módulo ativo;
   - badge produto educacional.

2. Header da etapa:
   - título da etapa;
   - subtítulo curto;
   - indicador “Etapa X de 7”;
   - progresso visual discreto;
   - altura sem excesso.

3. Stepper:
   - horizontal;
   - compacto;
   - círculos numerados;
   - conectores;
   - etapa atual evidente;
   - etapas concluídas marcadas.

4. Abas internas:
   - horizontais;
   - nomes claros;
   - aba ativa evidente;
   - sem scrollbar;
   - quebra elegante em telas menores.

5. Área de conteúdo:
   - grid proporcional;
   - uso inteligente de largura;
   - sem grande vazio inútil;
   - sem compressão;
   - conteúdo relevante por aba.

6. Navegação inferior:
   - botão Voltar;
   - indicador etapa/aba;
   - botão Próximo/Finalizar;
   - altura compacta;
   - sem cobrir conteúdo.

============================================================
## 14. ESPECIFICAÇÃO DETERMINÍSTICA DAS ETAPAS E ABAS
============================================================

Para cada etapa e cada aba, produzir obrigatoriamente:

- objetivo da aba;
- conteúdo obrigatório;
- layout exato em grid;
- componentes usados;
- posição dos componentes;
- hierarquia visual;
- cores;
- regra de contraste;
- comportamento sem scroll;
- critério de aceite.

Formato obrigatório:

### Etapa X — Nome
#### Aba Y — Nome

Objetivo:
...

Layout:
- Região A: ...
- Região B: ...
- Região C: ...

Componentes:
- Card A: título, conteúdo, cor, destaque, tamanho relativo.
- Card B: ...
- Tabela: colunas, linhas visíveis, paginação.
- Gráfico: tipo, legenda, cores.

Regras:
- ...

Critério de aceite:
- ...

============================================================
## 15. REGRAS ESPECÍFICAS PARA COMPONENTES
============================================================

## 15.1 Tabelas

Requisitos:

- mostrar uma tabela por vez;
- fonte mínima 13px;
- cabeçalho navy/deep-blue com texto branco;
- valores monetários alinhados;
- colunas com respiro;
- linhas com separação clara;
- paginação por blocos;
- máximo de 8 a 10 linhas visíveis por página;
- rodapé/totais em fundo escuro com texto branco;
- sem duas tabelas completas lado a lado;
- sem tabela espremida;
- sem microtexto;
- sem scroll vertical interno.

Colunas mínimas:

- Parcela;
- Saldo inicial;
- Juros;
- Amortização;
- Encargos;
- Total da parcela;
- Saldo final.

Cores semânticas:

- saldo: azul marinho/índigo;
- juros: roxo;
- amortização: verde escuro/teal;
- encargos: dourado/laranja;
- total: azul forte/navy;
- economia: verde escuro.

## 15.2 Formulários

Formulários devem seguir:

- grid rígido;
- labels alinhados;
- inputs com mesma altura;
- hints consistentes;
- estados de foco;
- unidades claras;
- agrupamento por abas;
- nenhuma coluna quebrada;
- nenhum campo desalinhado;
- nenhum input solto.

Na etapa Simular, não mostrar todos os campos de uma vez se isso gerar rolagem ou confusão. Distribuir em:

- Dados do Imóvel;
- Condições;
- Custos;
- Sistema;
- Resumo.

## 15.3 Gráficos

Gráficos devem:

- explicar, não decorar;
- ter legenda clara;
- usar cores consistentes;
- ter escala legível;
- não depender de microtexto;
- ser acompanhados de interpretação pedagógica.

Gráficos mínimos:

1. comparação SAC x PRICE de total pago, juros e encargos;
2. evolução do saldo devedor;
3. composição da parcela.

## 15.4 Conteúdo pedagógico

Cada etapa deve conter:

- conceito;
- exemplo;
- interpretação;
- alerta;
- memória de cálculo quando aplicável;
- fonte/limite quando necessário.

Proibido:

- texto longo empilhado;
- blocos vazios;
- cards genéricos sem valor;
- lorem ipsum;
- placeholder;
- frase motivacional sem conteúdo financeiro;
- explicação errada ou contraditória.

============================================================
## 16. ENTREGÁVEIS OBRIGATÓRIOS
============================================================

Gerar ZIP único contendo:

1. `ESPECIFICACAO_VISUAL_DETERMINISTICA_IMOVEL.md`
2. `DESIGN_SYSTEM_IMOVEL_DETERMINISTICO.md`
3. `MATRIZ_ETAPAS_ABAS_COMPONENTES.md`
4. `MATRIZ_CRITERIOS_ACEITE_VISUAL.md`
5. `CONTRATO_VISUAL_IMOVEL_V6_2.json`
6. `WIREFRAME_TEXTUAL_DETERMINISTICO.md`
7. `AUTOVALIDACAO_E_AUDITORIA.md`
8. `validate-spec.mjs`

O ZIP deve ter SHA256 real informado na resposta final.

============================================================
## 17. AUTOVALIDAÇÃO OBRIGATÓRIA
============================================================

Criar `validate-spec.mjs`.

O script deve validar, no mínimo:

1. presença de todos os arquivos obrigatórios;
2. presença das 7 etapas;
3. presença das abas obrigatórias por etapa;
4. presença do cenário financeiro fixo;
5. ausência de dados proibidos alterados;
6. presença da regra de mesma taxa para SAC e PRICE em comparação justa;
7. presença das regras de rolagem;
8. presença das regras de Aurora Gradient Border;
9. presença dos critérios de aceite;
10. presença da matriz etapa/aba/componente;
11. ausência de termos como “placeholder”, “TODO”, “definir depois”, “ajustar futuramente” como substitutos de especificação;
12. confirmação de que a entrega não pede implementação React.

O script deve falhar com exit code diferente de zero se encontrar problema estrutural.

Criar `AUTOVALIDACAO_E_AUDITORIA.md` contendo:

- comando executado;
- resultado do script;
- falhas encontradas;
- correções feitas;
- limitações honestas;
- itens não verificados, se houver.

Regra bloqueante:
Se a validação falhar, não declarar a entrega como concluída.

============================================================
## 18. GATE ANTI-ENTREGA RUIM
============================================================

Antes de entregar, responder objetivamente:

1. A especificação define cada etapa?
2. A especificação define cada aba?
3. A especificação define cada componente?
4. A especificação define layout, cor, hierarquia e conteúdo?
5. A especificação impede liberdade criativa excessiva da IA implementadora?
6. A especificação preserva o cenário R$ 870.000 / R$ 700.000 / R$ 170.000?
7. A comparação SAC x PRICE usa base justa?
8. A regra sem rolagem está bem definida?
9. A arquitetura de abas internas está bem definida?
10. A regra Aurora/Gradient Border está definida?
11. As tabelas têm critérios claros?
12. Os formulários têm critérios claros?
13. Os gráficos têm critérios claros?
14. O script `validate-spec.mjs` foi criado?
15. O script foi executado?
16. O script passou?
17. A entrega está livre de placeholders?
18. A entrega é apenas especificação, sem React e sem patch?
19. As limitações foram registradas?
20. O aceite visual humano do PO continua obrigatório?

Se qualquer resposta for “não”, “parcial” ou “não verificado”, corrigir antes de entregar ou declarar falha.

============================================================
## 19. PROTOCOLO DE FALHA
============================================================

Pare e declare falha se:

- não conseguir gerar qualquer arquivo obrigatório;
- não conseguir criar ou executar `validate-spec.mjs`;
- o script de validação falhar;
- precisar alterar repo para concluir;
- precisar implementar React para concluir;
- precisar criar index.html sem autorização;
- não conseguir preservar o cenário financeiro fixo;
- não conseguir especificar todas as etapas e abas.

Formato:

PARADA OPERACIONAL: [motivo]

Evidência:
[saída literal ou descrição verificável]

Arquivos gerados:
[...]

Limitações:
[...]

============================================================
## 20. SAÍDA FINAL ESPERADA
============================================================

Ao final, informar:

1. nome do ZIP gerado;
2. SHA256 real do ZIP;
3. estrutura de arquivos;
4. resumo do que foi especificado;
5. resultado do `validate-spec.mjs`;
6. limitações honestas;
7. confirmação de que não gerou patch;
8. confirmação de que não implementou React;
9. confirmação de que a entrega é apenas especificação visual determinística;
10. confirmação de que aprovação final depende do PO.

Incluir obrigatoriamente:

"Esta entrega foi autoverificada estruturalmente, mas permanece pendente de aprovação visual e funcional do PO."

É proibido declarar:

- aprovado;
- final;
- pronto para implementação;
- aceito pelo PO.

============================================================
FIM DO PROMPT
============================================================
```
