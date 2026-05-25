# TEMPLATE OFICIAL — PROMPT COM CHECKLIST OPERACIONAL E AUDITÁVEL

Projeto: Plataforma Educacional Financeira / projetos derivados de governança forte
Status sugerido: documento de governança reutilizável
Uso sugerido no repositório: `docs/governance/prompts/TEMPLATE_PROMPT_COM_CHECKLIST_OPERACIONAL.md`
Versão: 1.0
Base conceitual: estudo “Less Back-and-Forth: A Comparative Study of Structured Prompting” — arXiv: https://arxiv.org/abs/2605.20149

---

## 1. Finalidade deste template

Este template deve ser usado para escrever prompts operacionais destinados a IAs executoras, auditoras, designers, agentes de código ou agentes de documentação.

O objetivo é reduzir ambiguidade, impedir entregas “otimistas”, aumentar rastreabilidade e transformar cada prompt em um contrato operacional verificável.

Um prompt operacional só deve ser considerado pronto quando deixar claro:

1. o que deve ser feito;
2. por quem, em qual papel;
3. com quais fontes;
4. dentro de qual escopo;
5. com quais restrições;
6. com quais entregáveis;
7. com quais critérios de aceite;
8. com qual autovalidação;
9. com qual protocolo de falha.

---

## 2. Princípio central

Prompt bom não é apenas prompt longo.

Prompt bom é aquele que reduz a liberdade de interpretação nos pontos críticos e deixa liberdade apenas onde ela é desejável.

A estrutura mínima obrigatória é:

- papel/regras;
- contexto;
- formato esperado;
- escopo permitido;
- escopo proibido;
- critérios de aceite;
- autovalidação;
- evidências;
- protocolo de falha.

---

## 3. Regra de uso obrigatório

Use este template sempre que o prompt envolver qualquer uma das situações abaixo:

- implementação de código;
- refatoração;
- alteração de UI/UX;
- auditoria;
- criação de documento oficial;
- atualização de governança;
- alteração de contrato/API;
- alteração em testes;
- alteração em pipeline;
- criação de PR;
- materialização em repositório;
- comparação contra protótipo, documentação, backlog ou contrato.

---

# PROMPT OPERACIONAL — MODELO COM CHECKLIST

```text
============================================================
[PROJETO] — [ITEM / SPRINT / FRENTE]
[TÍTULO OBJETIVO DO PROMPT]
============================================================

## 0. CABEÇALHO OPERACIONAL

Projeto:
Repositório oficial:
Diretório operacional:
Branch base obrigatória:
Branch de trabalho obrigatória:
Commit/base esperada:
Executor:
Auditor:
Tipo de tarefa:
Modo de entrega:
Data/versão do prompt:

Regra central:
[Escreva em uma frase o que não pode ser violado.]

============================================================
## 1. MISSÃO EM UMA FRASE
============================================================

[Descreva em uma única frase o resultado esperado.]

Exemplo:
Implementar [X] no [módulo Y], preservando [invariantes Z], com testes, documentação viva e evidências auditáveis.

============================================================
## 2. PAPEL DA IA EXECUTORA
============================================================

Você atuará como:

- [papel 1];
- [papel 2];
- [papel 3].

Comportamento obrigatório:

- operar como executor técnico disciplinado;
- não aprovar a própria entrega;
- não declarar sucesso sem evidência;
- não substituir implementação por intenção;
- não inventar arquitetura quando houver padrão real existente;
- registrar limitações honestas.

============================================================
## 3. CONTEXTO NECESSÁRIO
============================================================

[Informe apenas o contexto necessário para executar bem.]

Contexto do projeto:
- ...

Decisões anteriores:
- ...

Estado atual:
- ...

Problema que motivou esta tarefa:
- ...

Risco principal:
- ...

============================================================
## 4. FONTES OBRIGATÓRIAS
============================================================

Antes de executar, leia e use como fonte:

Documentos:
- [path 1]
- [path 2]

Código:
- [path 1]
- [path 2]

Evidências anteriores:
- [path 1]
- [path 2]

Protótipos/contratos/artefatos:
- [path 1]
- [path 2]

Regra:
Se uma fonte obrigatória não existir, pare e declare a ausência. Não invente conteúdo substituto.

============================================================
## 5. FASE 0 — BASELINE / DIAGNÓSTICO ANTES DE ALTERAR
============================================================

Antes de qualquer alteração, execute:

```bash
[comandos de baseline]
```

Critérios de validade da Fase 0:

- branch inicial esperada:
- HEAD esperado:
- origin/main esperado:
- working tree esperado:
- resíduos locais permitidos:
- resíduos locais proibidos:

Se a baseline estiver inválida, pare e responda:

PARADA OPERACIONAL: baseline inválida.

Esperado:
[estado esperado]

Encontrado:
[cole saída literal]

Nenhum arquivo foi alterado.

============================================================
## 6. ESCOPO PERMITIDO
============================================================

Você pode criar/alterar somente:

- [path permitido 1]
- [path permitido 2]
- [documento permitido 1]
- [teste permitido 1]

Se precisar alterar algo fora desta lista, pare e justifique antes de continuar.

============================================================
## 7. ESCOPO PROIBIDO
============================================================

É proibido alterar:

- [path proibido 1]
- [path proibido 2]
- [contrato proibido]
- [pipeline proibido]
- [backend/frontend, se aplicável]
- [planilha, se aplicável]

Também é proibido:

- criar módulo paralelo;
- enfraquecer testes;
- remover proteção sem matriz de equivalência;
- mascarar falha com CSS, mock ou configuração;
- alterar fórmula/contrato sem autorização;
- usar placeholder/TODO como entrega;
- fabricar evidências;
- declarar aceite humano;
- fazer push/PR/merge quando não autorizado.

============================================================
## 8. INVARIANTES QUE NÃO PODEM REGREDIR
============================================================

Preservar obrigatoriamente:

- arquitetura existente;
- contratos públicos existentes;
- testes já existentes;
- documentação viva impactada;
- integração real;
- acessibilidade;
- responsividade;
- rastreabilidade;
- qualidade visual, quando aplicável;
- verdade matemática, quando aplicável;
- privacidade/segurança, quando aplicável.

Regra:
Qualquer remoção relevante exige matriz de equivalência: item removido, motivo, substituto, teste equivalente e risco residual.

============================================================
## 9. REQUISITOS FUNCIONAIS
============================================================

A entrega deve fazer:

1. ...
2. ...
3. ...

Entradas obrigatórias:
- ...

Saídas obrigatórias:
- ...

Fluxos obrigatórios:
- ...

Estados obrigatórios:
- ...

============================================================
## 10. REQUISITOS TÉCNICOS / ARQUITETURAIS
============================================================

Obrigatório:

- seguir padrões reais do repositório;
- não duplicar lógica de domínio;
- manter separação de camadas;
- manter tipagem forte;
- manter contratos existentes;
- tratar erros no padrão oficial;
- preservar logs/evidências;
- atualizar documentação viva impactada.

Proibido:

- criar abstração horizontal genérica sem necessidade;
- usar `Any`, `type: ignore`, `float` em cálculo financeiro ou equivalente proibido;
- criar mock estático em lugar de integração real;
- resolver falha estrutural com gambiarra visual/configuração.

============================================================
## 11. REQUISITOS VISUAIS / UX / PRODUTO
============================================================

Use esta seção quando houver UI/UX.

Direção visual:
- ...

Regras obrigatórias:
- fonte mínima:
- paleta:
- contraste:
- responsividade:
- rolagem:
- componentes:
- efeitos premium:
- acessibilidade:
- estados loading/error/empty:

Proibido:
- interface genérica;
- microtexto ilegível;
- rolagem artificial escondida;
- contraste fraco;
- conteúdo pedagógico vazio;
- divergência visual sem justificativa.

============================================================
## 12. DADOS FIXOS / CASOS CANÔNICOS / CONTRATOS
============================================================

Dados fixos:
- ...

Casos canônicos:
- ...

Contratos:
- ...

Regra:
É proibido alterar esses dados sem autorização explícita no próprio prompt.

============================================================
## 13. ENTREGÁVEIS OBRIGATÓRIOS
============================================================

Entregar:

1. [arquivo/artefato 1]
2. [arquivo/artefato 2]
3. [relatório]
4. [evidências]
5. [script/checklist de validação]
6. [ZIP/PR/commit, se autorizado]

Cada entregável deve ter conteúdo real, não decorativo.

============================================================
## 14. TESTES, GATES E AUTOVALIDAÇÃO
============================================================

Execute no mínimo:

```bash
[comandos de teste/gate]
```

Validações adicionais:

```bash
[grep/diff/scripts/checklists]
```

A autovalidação deve comprovar:

- arquivos obrigatórios presentes;
- escopo respeitado;
- critérios de aceite cobertos;
- ausência de placeholders;
- ausência de alterações proibidas;
- execução dos testes/gates;
- limitações honestas.

Regra bloqueante:
Se qualquer validação falhar, não declare a entrega como concluída.

============================================================
## 15. GATE ANTI-ENTREGA RUIM
============================================================

Antes de entregar, responda objetivamente:

1. A missão foi cumprida?
2. Todas as fontes obrigatórias foram lidas?
3. O escopo permitido foi respeitado?
4. O escopo proibido permaneceu intacto?
5. Os invariantes foram preservados?
6. Os testes/gates foram executados?
7. A documentação viva impactada foi atualizada?
8. Há evidências verificáveis?
9. Há placeholders/TODOs substituindo entrega?
10. A entrega depende de aceite humano?
11. O que não foi verificado?
12. O que permanece pendente?

Se qualquer resposta for “não”, “parcial” ou “não verificado”, corrija antes de entregar ou declare bloqueio.

============================================================
## 16. PROTOCOLO DE FALHA
============================================================

Pare imediatamente se:

- baseline estiver inválida;
- fonte obrigatória não existir;
- comando essencial falhar;
- escopo exigir alteração proibida;
- teste/gate bloqueante falhar;
- houver risco de regressão não controlado;
- não for possível validar a entrega.

Formato da parada:

PARADA OPERACIONAL: [motivo]

O que foi tentado:
- ...

Evidência:
- ...

Arquivos alterados:
- ...

Próxima ação recomendada:
- ...

============================================================
## 17. MATERIALIZAÇÃO / COMMIT / PR
============================================================

[Escolha uma política explícita.]

Opção A — sem materialização:
- não fazer commit;
- não fazer push;
- não abrir PR;
- entregar ZIP/relatório.

Opção B — commit local:
- criar branch;
- fazer commit local;
- não fazer push;
- não abrir PR.

Opção C — PR autorizado:
- criar branch;
- fazer commit;
- fazer push;
- abrir PR;
- não fazer merge.

Opção D — merge autorizado:
- somente se explicitamente autorizado por Moisés;
- exigir checks verdes;
- provar equalização pós-merge.

Comandos autorizados:
```bash
[comandos]
```

Comandos proibidos:
```bash
[comandos]
```

============================================================
## 18. FORMATO DA RESPOSTA FINAL
============================================================

Responder nesta ordem:

1. Resumo executivo
2. Prova da baseline
3. Fontes lidas
4. Arquivos criados/alterados
5. O que foi implementado/especificado
6. Testes/gates executados
7. Evidências geradas
8. Documentação viva atualizada
9. Impact Agent / validação estrutural
10. Escopo negativo confirmado
11. Commit/ZIP/PR, se aplicável
12. Pendências honestas
13. Veredito operacional: pronto para auditoria ou bloqueado

============================================================
## 19. REGRA FINAL
============================================================

Você é executor/auditor técnico, não autoridade de aceite final.

É proibido declarar:

- aprovado pelo PO;
- aceito por Moisés;
- pronto para produção;
- homologado;
- final definitivo.

Use apenas:

- autoverificado tecnicamente;
- pronto para auditoria;
- bloqueado por [motivo];
- pendente de aceite humano.
```

---

## 4. Checklist rápido antes de enviar qualquer prompt

Antes de enviar, confirme:

| Item | Pergunta | OK? |
|---|---|---|
| 1 | A missão cabe em uma frase clara? | |
| 2 | O papel da IA foi definido? | |
| 3 | O contexto é suficiente sem ser confuso? | |
| 4 | As fontes obrigatórias foram listadas? | |
| 5 | O escopo permitido está explícito? | |
| 6 | O escopo proibido está explícito? | |
| 7 | Os invariantes antirregressão estão claros? | |
| 8 | Os entregáveis são verificáveis? | |
| 9 | Os critérios de aceite são objetivos? | |
| 10 | A autovalidação tem comandos/checklist? | |
| 11 | Existe protocolo de falha? | |
| 12 | O formato da resposta final está definido? | |
| 13 | O aceite humano está separado da autovalidação? | |

---

## 5. Observação de governança

Este template deve ser tratado como documento vivo. Sempre que uma entrega falhar por ambiguidade de prompt, o prompt causador deve ser analisado e este template deve ser refinado para prevenir repetição da falha.

---

## CHECKLIST CANÔNICO OBRIGATÓRIO

Esta seção define os rótulos oficiais mínimos que todo prompt operacional governado deve conter ou adaptar explicitamente.

### MISSÃO

Declare em uma frase objetiva o que deve ser entregue.

### PAPEL DA IA EXECUTORA

Defina o papel operacional da IA: implementadora, auditora, designer, QA, arquiteta, documentadora ou combinação aplicável.

### CONTEXTO OPERACIONAL

Informe o estado atual relevante: projeto, repositório, branch, base Git, decisões anteriores, artefatos de referência, protótipos, documentos vivos e restrições conhecidas.

### FONTES OBRIGATÓRIAS

Liste documentos, arquivos, protótipos, contratos, evidências, endpoints, scripts e padrões que devem ser lidos antes da execução.

### ESCOPO PERMITIDO

Liste objetivamente o que pode ser criado, alterado, removido ou validado.

### ESCOPO PROIBIDO

Liste objetivamente o que não pode ser alterado, mesmo que pareça conveniente para a IA executora.

### REQUISITOS FUNCIONAIS

Descreva o comportamento esperado da entrega.

### REQUISITOS TÉCNICOS

Descreva arquitetura, padrões de código, integração real, testes, contratos, performance, segurança e documentação via código quando aplicável.

### REQUISITOS VISUAIS E UX

Descreva hierarquia visual, layout, responsividade, acessibilidade, rolagem, tipografia, contraste, estados e aderência ao protótipo quando aplicável.

### INVARIANTES QUE NÃO PODEM REGREDIR

Liste proteções obrigatórias: contratos existentes, fórmulas, testes, documentação viva, auditorias, comportamento funcional, acessibilidade, segurança, integração real e decisões já aprovadas.

### ENTREGÁVEIS

Liste todos os arquivos, relatórios, scripts, evidências, ZIPs, commits locais ou artefatos esperados.

### CRITÉRIOS DE ACEITE

Defina condições objetivas para considerar a entrega pronta para auditoria.

### AUTOVALIDAÇÃO OBRIGATÓRIA

Defina comandos, scripts, testes, checklists, evidências e verificações que a IA executora deve realizar antes de declarar a entrega concluída.

### EVIDÊNCIAS OBRIGATÓRIAS

Defina quais logs, saídas de comandos, prints, hashes, relatórios ou provas materiais devem ser entregues.

### PROTOCOLO DE FALHA

Defina que a IA deve parar, declarar falha ou registrar limitação honesta quando não conseguir cumprir algum requisito, em vez de simular sucesso.

### FORMATO DA RESPOSTA FINAL

Defina a ordem exata da resposta final esperada.

### ACEITE HUMANO

Declare que autovalidação técnica não substitui auditoria do Camaleão, decisão de Moisés, aceite visual humano ou validação pedagógica/funcional quando aplicável.

<!-- PEF-PROMPT-CHECKLIST-V2-AUDITAVEL-START -->

## 20. REFORÇOS V2 — CONTRATO OPERACIONAL AUDITÁVEL

Esta seção endurece o template para frentes que possam gerar alteração em repositório, pacote, branch, PR, documentação viva, contrato, auditor, pipeline ou artefato materializável.

### 20.1 Metadados mínimos do contrato

Todo prompt operacional deve declarar, quando aplicável:

- template_version
- contrato_id
- projeto
- modulo_ou_frente
- po_responsavel
- ia_executora
- repo_path
- branch_alvo
- base_commit
- base_ref
- status_inicial

Se qualquer metadado crítico for desconhecido, a IA deve declarar a lacuna antes de executar.

### 20.2 Estados de entrega permitidos

Estados aceitos:

- GERADO
- VALIDADO_LOCALMENTE
- PR_ABERTO
- CHECKS_VERDES
- PO_REVIEW
- MERGED
- ENCERRADO
- BLOQUEADO

A IA não pode declarar MERGED sem evidência do merge. A IA também não pode declarar aceite visual, funcional ou de produto em nome do PO.

### 20.3 Arquivos autorizados e proibidos

Todo prompt operacional deve declarar arquivos autorizados e arquivos proibidos.

Regras:

- alterar arquivo fora da lista autorizada é falha de contrato;
- criar arquivo novo fora do escopo autorizado é falha de contrato;
- alterar package.json, lockfile, pipeline, auditor, backend, fórmula financeira ou documentação viva exige autorização explícita quando não estiver no escopo permitido;
- se descobrir necessidade legítima fora do escopo, a IA deve parar, registrar e pedir decisão.

### 20.4 Cláusula anti-scope-creep

Se a IA encontrar bug, inconsistência, melhoria visual, dívida técnica ou oportunidade fora do escopo:

1. registrar a observação;
2. não corrigir automaticamente;
3. não ampliar o escopo por conta própria;
4. não alterar auditor, teste ou pipeline para fazer a entrega passar;
5. solicitar decisão do PO quando a correção for necessária.

É proibido transformar uma frente curta em refatoração ampla sem autorização.

### 20.5 Critérios de aceite binários

Critérios de aceite devem ser verificáveis como TRUE/FALSE.

Exemplos fortes:

- comando X retorna exit code 0;
- arquivo Y existe;
- diff restrito aos paths autorizados;
- auditor Z retorna total igual a 0;
- teste focado N passa;
- nenhum marcador de conflito existe;
- nenhum TODO ou placeholder foi introduzido.

Critérios qualitativos só devem ser usados quando acompanhados de evidência objetiva, checklist visual, print, teste, auditor ou aceite humano explícito.

### 20.6 Evidências completas

Toda entrega operacional deve registrar:

- comando executado;
- diretório de execução;
- objetivo do comando;
- saída relevante;
- exit code;
- arquivos alterados;
- limitações;
- falhas encontradas;
- correções aplicadas.

É proibido selecionar apenas evidências favoráveis, ocultar falhas intermediárias ou substituir log por narrativa otimista.

### 20.7 Protocolo de falha com limite de autocorreção

Quando houver falha:

1. identificar a causa provável;
2. executar no máximo 2 ciclos de autocorreção;
3. não enfraquecer teste, auditor, contrato ou gate para passar;
4. não usar workaround silencioso;
5. se persistir, parar e registrar bloqueio.

Formato mínimo:

- STATUS: BLOQUEADO
- Falha:
- Evidência:
- Tentativas realizadas:
- Arquivos afetados:
- Risco:
- Decisão necessária do PO:

### 20.8 Separação entre validação técnica e aceite humano

Validação técnica não equivale a aceite humano.

A IA pode declarar que format, lint, typecheck, testes, auditor ou build passaram quando houver evidência.

A IA não pode declarar sozinha:

- aceito pelo PO;
- visualmente aprovado;
- produto aprovado;
- pronto para usuário final.

Esses estados dependem de decisão humana explícita.

<!-- PEF-PROMPT-CHECKLIST-V2-AUDITAVEL-END -->
