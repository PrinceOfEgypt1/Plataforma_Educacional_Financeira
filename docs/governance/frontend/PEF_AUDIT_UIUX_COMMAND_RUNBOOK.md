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
| `pnpm audit:uiux` | **Gate oficial bloqueante.** Executa o auditor em modo padrão. Falha se houver qualquer violação. |
| `pnpm audit:uiux:contract` | Valida apenas o contrato UI/UX e os arquivos declarados. |
| `pnpm audit:uiux:expect-fail` | Uso forense/regressivo. Espera pelo menos uma violação; falha se o auditor estiver limpo. **Não é o gate oficial.** |
| `pnpm --silent audit:uiux:json` | Emite JSON estruturado da auditoria atual (sem `--expect-fail`). |

## 4. Comandos operacionais

Para executar o gate oficial:

~~~bash
cd frontend
pnpm audit:uiux
~~~

Para validar apenas o contrato:

~~~bash
cd frontend
pnpm audit:uiux:contract
~~~

Para uso forense/regressivo (não é gate oficial):

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

Após a conclusão do Item 14F-F4C (PR #60), o auditor `audit:uiux` do módulo Financiamento Imobiliário está **zerado** (total=0, issues=[]).

A partir do Item 14F-F5, o auditor foi promovido para:

**Gate oficial BLOCKING para o módulo Financiamento Imobiliário.**

O comando `pnpm audit:uiux` é executado como gate obrigatório em:

- **CI (GitHub Actions):** `.github/workflows/ci.yml` — step "Audit UI/UX (gate bloqueante)"
- **Pipeline local:** `scripts/pipeline.sh` — gate `frontend.audit_uiux`
- **Makefile:** `make verify` inclui `audit-uiux-fe`

Qualquer regressão que introduza violação UI/UX **bloqueia** o pipeline.

### Nota sobre `audit:uiux:expect-fail`

O script `pnpm audit:uiux:expect-fail` continua existindo para uso forense e regressivo. Ele **não é o gate oficial**. O gate oficial é `pnpm audit:uiux` (sem `--expect-fail`).

Após F4C, `--expect-fail` retorna status 1 quando não há violações — esse é o comportamento correto e esperado.

## 6. Uso correto

O auditor deve ser usado para:

- transformar críticas de interface em IDs objetivos;
- gerar evidência JSON;
- orientar prompts cirúrgicos de correção;
- impedir regressão futura como gate bloqueante;
- separar opinião visual de reprovação técnica verificável.

## 7. Uso incorreto

O auditor não deve ser usado para:

- aprovar sozinho uma interface;
- substituir o aceite visual e pedagógico do PO;
- alterar contrato para esconder falhas;
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
| 14F-F4A | Corrige duplicações (RC-001). |
| 14F-F4B | Corrige CTAs e mobile da sidebar (RC-002, RC-004). |
| 14F-F4C | Zera o auditor corrigindo NextStepsZone (RC-003). |
| 14F-F5 | Promove o auditor a gate oficial BLOCKING. |

## 9. Critério de aceite deste runbook

O comando está integrado quando:

- os scripts oficiais existem no `frontend/package.json`;
- `pnpm audit:uiux` executa como gate oficial bloqueante;
- `pnpm audit:uiux:contract` executa com sucesso;
- `pnpm --silent audit:uiux:json` gera JSON parseável sem `--expect-fail`;
- `pnpm audit:uiux:expect-fail` está documentado como uso forense/regressivo, não como gate oficial;
- no estado limpo pós-F4C, `expect-fail` falha corretamente por não encontrar violações;
- o teste específico do auditor passa;
- o CI executa `pnpm audit:uiux`;
- o pipeline local executa `frontend.audit_uiux`;
- `make verify` inclui `audit-uiux-fe`.
