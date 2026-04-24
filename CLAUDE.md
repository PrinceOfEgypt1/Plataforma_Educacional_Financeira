# CLAUDE.md — Instruções Operacionais do Workspace

**Projeto:** Plataforma Educacional Financeira (PEF)
**Escopo:** Este arquivo define o comportamento padrão esperado de
qualquer agente (Claude) operando neste repositório. Vale para todas
as sessões, rodadas e sprints, até revogação explícita registrada
em commit.

---

Este workspace é o repositório oficial de código no Windows.
O desenvolvimento desta rodada acontece aqui.
A pasta documental externa "Matemática Financeira" não é workspace
de desenvolvimento e não deve receber código, patch ou artefato
operacional desta rodada.

## POSTURA PADRÃO

Atue em modo forense e disciplinado.
Diagnóstico vem antes de correção.
Fato, inferência e limitação ambiental devem aparecer separados
com clareza.
Não invente contexto, não presuma verde, não trate hipótese como
prova.

## QUALIDADE (política permanente)

- Qualidade é estrutural, não cosmética.
- Meta estratégica: 100% em lint, format, testes, cobertura,
  mutation e demais gates mensuráveis.
- Meta não é igual a gate por entrega: o gate deve ser forte,
  objetivo e realista.
- Tolerância zero em:
  - lint com erro;
  - format com diferença;
  - testes obrigatórios falhando;
  - build/execução estrutural quebrada;
  - divergência entre declarado e entregue;
  - divergência entre evidência, código e materialização real.
- Nenhuma entrega pode regredir qualidade já conquistada sem:
  1. regressão identificada;
  2. causa justificada;
  3. plano formal de recuperação;
  4. decisão registrada de forma auditável.
- Nenhum score, métrica ou gate pode ser apresentado como
  presumido, otimista ou inferido. Toda afirmação de qualidade
  deve vir de execução real.
- Prioridade em conflito:
  1. consistência
  2. reprodutibilidade
  3. prova real
  4. governança
  5. velocidade

## PROTOCOLO OPERACIONAL

- Fase 0 obrigatória antes de qualquer trabalho relevante:
  - fetch
  - status
  - branch atual
  - HEAD
  - origin/main
  - prova literal do estado do repositório
- Working tree deve estar limpa antes de iniciar pacote.
- Escopo declarado deve coincidir com escopo commitado.
- Proibido corrigir fora do patch.
- Proibido auto-fix sem prova.
- Proibido usar script com path hardcoded.
- Proibido deixar o CI descobrir algo que o ambiente local já
  poderia provar.
- Proibido tratar vermelho residual como normal.

## STAGING E COMMIT

- Antes do commit, provar staging real.
- Depois do commit, provar exatamente quais arquivos entraram.
- Não declarar pacote pronto sem reconciliação entre:
  - working tree
  - staging
  - commit
  - evidência
  - materialização real

## GOVERNANÇA DOCUMENTAL

- Toda mudança relevante deve avaliar impacto documental.
- Toda entrega relevante deve mencionar impacto em documentos
  vivos.
- Ao concluir/materializar atividade relevante, a planilha de
  Backlog Operacional deve ser atualizada e isso deve ser
  avisado explicitamente no chat.
- O que é governança externa fica fora deste workspace.
- O que é documentação versionada do projeto fica dentro do
  repositório.

## REGRAS DE ESCOPO

- Não ampliar escopo sem base documental e sem prova de
  capacidade de entrega.
- Não misturar discovery, planejamento e implementação na mesma
  resposta sem separar claramente as fases.
- Não reabrir fases já homologadas sem instrução explícita.
- Se a Sprint 1 estiver homologada, não refazê-la.
- O estado da sprint corrente (qual fatia está aberta, qual foi
  homologada, qual foi abortada) é definido no contexto do chat,
  não neste arquivo.

## FONTE OFICIAL DA VERDADE

- Cálculos financeiros críticos pertencem ao backend.
- Não espalhar lógica financeira crítica no frontend.
- Não declarar comportamento matemático sem prova ou teste
  correspondente.

## HONESTIDADE TÉCNICA

- Se a causa real não está provada, não existe correção validada.
- Se houver dúvida material sobre fechamento, a entrega para.
- Não mascarar ausência de prova com linguagem confiante.
- Limitações do ambiente devem ser declaradas explicitamente.
- Se algo estiver bloqueado, declarar bloqueio com honestidade.

## REGRA FINAL

Este workspace é para desenvolvimento real no repositório do
Windows.
Não usar a pasta documental externa como área de código.
Não fabricar prova.
Não improvisar governança.
Não seguir adiante com base instável.