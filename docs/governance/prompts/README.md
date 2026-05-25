# Pacote — Prompt com Checklist Operacional e Auditável

Este pacote contém os artefatos solicitados por Moisés:

1. `GOVERNANCA_TEMPLATE_PROMPT_COM_CHECKLIST.md`
   Template oficial reutilizável para governança de prompts.

2. `PEF_F8C_v6_2_PROMPT_ESPECIFICACAO_VISUAL_DETERMINISTICA__CHECKLIST.md`
   Prompt F8C-v6.2 adaptado ao novo modelo de checklist.

3. `PEF_SPRINT_4_F2_DIAGNOSTICO_API__PROMPT_CHECKLIST.md`
   Prompt Sprint 4/F2 adaptado ao novo modelo de checklist.

## Uso sugerido no repositório

- Template:
  - `docs/governance/prompts/TEMPLATE_PROMPT_COM_CHECKLIST_OPERACIONAL.md`

- Prompts adaptados:
  - `docs/governance/prompts/exemplos/PEF_F8C_v6_2_PROMPT_ESPECIFICACAO_VISUAL_DETERMINISTICA__CHECKLIST.md`
  - `docs/governance/prompts/exemplos/PEF_SPRINT_4_F2_DIAGNOSTICO_API__PROMPT_CHECKLIST.md`

## Referência conceitual

Estudo: “Less Back-and-Forth: A Comparative Study of Structured Prompting”
arXiv: https://arxiv.org/abs/2605.20149

## Observação

Os prompts adaptados mantêm a intenção operacional dos anexos originais, mas reorganizam as instruções em formato de contrato/checklist, com separação explícita entre:

- missão;
- papel da IA;
- contexto;
- fontes obrigatórias;
- baseline;
- escopo permitido;
- escopo proibido;
- invariantes;
- requisitos;
- entregáveis;
- testes/gates;
- autovalidação;
- protocolo de falha;
- resposta final.
