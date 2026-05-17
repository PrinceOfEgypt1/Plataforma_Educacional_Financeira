# PEF — Runbook do comando audit:uiux

## 1. Objetivo

Este runbook define o uso oficial do comando `audit:uiux` no frontend da Plataforma Educacional Financeira.

O comando existe para auditar a aderência do módulo Financiamento Imobiliário ao contrato UI/UX versionado.

## 2. Escopo atual

Módulo auditado nesta fase:

- Financiamento Imobiliário
- Rota: `/financiamento-imobiliario`
- Contrato: `docs/governance/frontend/contracts/financiamento-imobiliario.uiux.contract.json`
- Auditor: `frontend/scripts/auditor-uiux.mjs`

## 3. Scripts oficiais

Os scripts oficiais ficam no `frontend/package.json`.

| Script | Finalidade |
|---|---|
| `pnpm audit:uiux` | Executa o auditor em modo padrão. |
| `pnpm audit:uiux:contract` | Valida apenas o contrato UI/UX e os arquivos declarados. |
| `pnpm audit:uiux:expect-fail` | Executa auditoria esperando reprovação objetiva do módulo atual. |
| `pnpm --silent audit:uiux:json` | Emite JSON estruturado da auditoria atual. |

## 4. Comandos operacionais

Para validar apenas o contrato:

~~~bash
cd frontend
pnpm audit:uiux:contract
~~~

Para registrar o estado atual de reprovação objetiva:

~~~bash
cd frontend
pnpm audit:uiux:expect-fail
~~~

Para gerar evidência JSON:

~~~bash
cd frontend
pnpm --silent audit:uiux:json > /tmp/pef-audit-uiux-imovel.json
~~~

Para rodar o teste automatizado do auditor:

~~~bash
cd frontend
pnpm test -- src/__tests__/scripts/auditorUiux.test.ts
~~~

## 5. Status de bloqueio

Nesta fase, o auditor `audit:uiux` é uma ferramenta de governança e diagnóstico.

Ele ainda não deve ser promovido para gate obrigatório do CI oficial, porque o módulo Financiamento Imobiliário ainda possui reprovações conhecidas e materialmente registradas.

A promoção para gate bloqueante só deve ocorrer depois de:

1. correções UI/UX do módulo Imóvel;
2. nova auditoria sem violações bloqueantes;
3. aceite PO/UX;
4. atualização dos testes do auditor para o novo estado aprovado;
5. decisão explícita registrada em documentação de governança.

## 6. Uso correto

O auditor deve ser usado para:

- transformar críticas de interface em IDs objetivos;
- gerar evidência JSON;
- orientar prompts cirúrgicos de correção;
- impedir regressão futura após aceite PO/UX;
- separar opinião visual de reprovação técnica verificável.

## 7. Uso incorreto

O auditor não deve ser usado para:

- aprovar sozinho uma interface;
- substituir o aceite visual e pedagógico do PO;
- alterar contrato para esconder falhas;
- bloquear CI enquanto o módulo ainda está oficialmente reprovado;
- mascarar problemas mudando apenas testes ou contadores.

## 8. Relação com os itens 14F

| Item | Papel |
|---|---|
| 14F-F0A | Define governança frontend/UI/UX. |
| 14F-F0B | Define contrato UI/UX executável do módulo Imóvel. |
| 14F-F0C | Cria o auditor automático `audit:uiux`. |
| 14F-F0D | Cria testes do auditor. |
| 14F-F0E | Formaliza a integração operacional do comando. |
| 14F-F1 | Registra o FAIL oficial do módulo com base no auditor. |

## 9. Critério de aceite deste runbook

O comando está integrado quando:

- os scripts oficiais existem no `frontend/package.json`;
- o modo `contract-only` executa com sucesso;
- o modo `expect-fail` reproduz a reprovação atual;
- o modo JSON gera saída parseável;
- o teste específico do auditor passa;
- a documentação informa que o auditor ainda não é gate bloqueante de CI.
