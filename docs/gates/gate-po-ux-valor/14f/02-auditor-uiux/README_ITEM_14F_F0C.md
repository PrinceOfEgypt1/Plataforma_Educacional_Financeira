# PEF — Item 14F-F0C — Auditor automático UI/UX

## 1. Objetivo

Criar o auditor automático `audit:uiux` para transformar violações de UI/UX do módulo Financiamento Imobiliário em falhas objetivas, rastreáveis e corrigíveis.

## 2. Relação com os itens anteriores

- O Item 14F-F0A criou a governança documental frontend/UI/UX.
- O Item 14F-F0B criou o contrato UI/UX executável do módulo Imóvel.
- O Item 14F-F0C cria o primeiro auditor que consome esse contrato e avalia o módulo atual.

## 3. Arquivos criados ou alterados

- `frontend/scripts/auditor-uiux.mjs`
- `frontend/package.json`
- `docs/gates/gate-po-ux-valor/14f/02-auditor-uiux/README_ITEM_14F_F0C.md`
- `docs/gates/gate-po-ux-valor/14f/02-auditor-uiux/MANIFESTO_ARQUIVOS_ITEM_14F_F0C.md`
- `docs/gates/gate-po-ux-valor/14f/02-auditor-uiux/RELATORIO_AUDITOR_UIUX_ITEM_14F_F0C.md`

## 4. Comando criado

~~~bash
cd frontend
pnpm audit:uiux
~~~

## 5. Modos de execução

~~~bash
pnpm audit:uiux -- --contract-only
pnpm audit:uiux -- --expect-fail
node scripts/auditor-uiux.mjs --json --expect-fail
~~~

## 6. Resultado esperado neste item

Neste momento o auditor não deve ser obrigatório no CI.

O módulo Imóvel atual ainda deve reprovar, porque o objetivo do Item 14F-F0C é criar o mecanismo de reprovação objetiva, não corrigir a interface.

## 7. Próximo passo

Após materializar este item, o próximo passo é organizar as violações por grupos corretivos e preparar prompts cirúrgicos para correção.
