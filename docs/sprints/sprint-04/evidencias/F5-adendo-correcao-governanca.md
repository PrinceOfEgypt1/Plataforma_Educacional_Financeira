# F5 — Adendo Corretivo de Governança

**Sprint:** 4 / Fatia: F5 (adendo pós-entrega)
**Data:** 2026-05-08
**Origem:** Auditoria de Camaleão/Moisés sobre o commit fcf2e86
**Branch:** `sprint-4/f5-financiamento-imobiliario-rf-fin-001-claude`

---

## 1. Motivo do adendo

A auditoria de Camaleão/Moisés identificou quatro problemas documentais e textuais no commit
`fcf2e86` da Sprint 4/F5 — RF-FIN-001 — que precisavam ser corrigidos antes da aprovação final,
abertura de PR e eventual merge.

---

## 2. Problemas encontrados pela auditoria

| # | Problema | Arquivo |
|---|---------|----------|
| P1 | Linha canônica de RF-FIN-001 na tabela principal ainda aparecia como `pending` com `...` em todos os campos, contradizendo a seção §9 que dizia `pending -> done`. | `docs/19_Matriz_Rastreabilidade.md` linha 38 |
| P2 | Evidência F4 tinha título "# F4 — Fechamento da Sprint 4", sugerindo indevidamente que a Sprint 4 inteira foi fechada pela F4. | `docs/sprints/sprint-04/evidencias/F4-fechamento-sprint-4.md` |
| P3 | Descrição do módulo `financiamento-imobiliario` em `modules.ts` continha "CET detalhado", mas a implementação não calcula CET oficial. | `frontend/src/config/modules.ts` linha 105 |
| P4 | Conteúdo educacional continha expressões sobre "aprovação do crédito" em tom que poderia induzir expectativa. | `frontend/src/content/financiamento-imobiliario/nivel-1.ts` linha 24 e `nivel-2.ts` linha 39 |

---

## 3. Arquivos corrigidos

| Arquivo | Tipo de correção |
|---------|------------------|
| `docs/19_Matriz_Rastreabilidade.md` | Linha RF-FIN-001 atualizada de `pending` para `done (Sprint 4 F5)` com todos os campos preenchidos |
| `docs/sprints/sprint-04/evidencias/F4-fechamento-sprint-4.md` | Título corrigido para "F4 — Fechamento do RF-DIAG-001" + nota de governança adicionada |
| `frontend/src/config/modules.ts` | "CET detalhado" substituído por descrição educacional honesta |
| `frontend/src/content/financiamento-imobiliario/nivel-1.ts` | Frase sobre aprovação tornada neutra |
| `frontend/src/content/financiamento-imobiliario/nivel-2.ts` | Frase sobre aprovação tornada neutra |

---

## 4. Antes/depois resumido

### P1 — Matriz RF-FIN-001
**Antes:** `| RF-FIN-001 | financing | ... | ... | ... | ... | FI-01..FI-10 | ... | ... | ... | ... | 03,06,09,15,19 | pending |`
**Depois:** Linha completa com todos os caminhos reais de schemas, services, domínio, testes (unitários, integração, contrato, pedagógicos), docs vivos e `status = done (Sprint 4 F5)`

### P2 — Evidência F4
**Antes:** `# F4 — Fechamento da Sprint 4`
**Depois:** `# F4 — Fechamento do RF-DIAG-001 — Diagnóstico Financeiro` + nota de governança explícita

### P3 — modules.ts
**Antes:** `"Simule prazos, entrada e sistema de amortização para compra de imóvel com CET detalhado."`
**Depois:** `"Simule prazos, entrada e sistemas PRICE/SAC com custo total educacional e encargos declarados."`

### P4 — nivel-1.ts (aprovação)
**Antes:** `"...Uma entrada maior também pode facilitar a aprovação do crédito e reduzir o risco para o banco."`
**Depois:** `"...Uma entrada maior reduz o valor financiado e pode influenciar a avaliação da instituição financeira, mas a aprovação depende de critérios próprios do banco."`

### P4 — nivel-2.ts (aprovação)
**Antes:** `"...o SAC tem parcela inicial maior, o que pode inviabilizar a aprovação do crédito para quem tem renda mais restrita."`
**Depois:** `"...o SAC tem parcela inicial maior, o que pode aumentar a relação prestação/renda exigida pela instituição financeira."`

---

## 5. Escopo do adendo — confirmações

- **Não alterei** nenhum arquivo do módulo Diagnóstico Financeiro.
- **Não alterei** nenhuma lógica de cálculo financeiro.
- **Não alterei** nenhum arquivo de backend de diagnóstico.
- **Não alterei** package.json, lockfile, pyproject.toml, Makefile, .github, .xlsx.
- **Não abri** PR.
- **Não fiz** merge.
- **Não declarei** Sprint 4 concluída.

---

## 6. Confirmação de que Diagnóstico não foi alterado

```
git diff --name-only 68dede4...HEAD | grep -Ei 'diagnostic|diagnostico'
(sem saída — nenhuma alteração em Diagnóstico)
```

---

## 7. Confirmação de que planilha não foi alterada

Nenhum arquivo `.xlsx` foi modificado. A planilha de Backlog Operacional é responsabilidade
exclusiva do PO (Moisés/Camaleão). Claude Code não a modifica em nenhuma circunstância.

---

## 8. Confirmação de que Sprint 4 não foi declarada concluída

A Sprint 4 permanece em andamento. O que foi concluído neste adendo:
- RF-FIN-001 (Sprint 4 F5): candidato a `done`, aguarda auditoria de Camaleão/Moisés, merge em main e materialização no CI.
- RF-DIAG-001 (Sprint 4 F4): já em `done` desde o merge #29.

O fechamento formal da Sprint 4 depende de: validação final dos dois RFs, planilha operacional
atualizada pelo PO, e merge aprovado em main.

---

## 9. Status após o adendo

| Item | Status |
|------|--------|
| RF-FIN-001 | Candidato a `done` — aguarda auditoria e merge |
| Sprint 4 | Em andamento |
| Matriz de Rastreabilidade | Coerente (linha RF-FIN-001 preenchida e `done`) |
| "CET detalhado" | Removido |
| Título indevido F4 | Corrigido |
| Textos de aprovação | Neutralizados |
