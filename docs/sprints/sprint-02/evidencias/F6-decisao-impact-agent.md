# F6 — Decisão sobre o Impact Agent (Sprint 2)

**Status canônico:** evidência F6 (governança).
**Data desta sessão:** 2026-04-26.
**Branch:** `sprint-2/f6-fechamento-governanca` @ `f20a180`.
**Decisão recomendada:** **PRESERVAR `advisory`** (Opção A).
**Promoção para `blocking`:** **NÃO PROMOVIDA NESTA SPRINT** — adiada
explicitamente para a Sprint 3 ou para o ciclo P-Refino, com ADR
curta a abrir antes da próxima promoção tentada.

> Esta decisão **não promove**, **não rebaixa** e **não silencia** o
> agente. Ela apenas formaliza a posição-padrão prevista no PLANO
> Sprint 2 §3.4 e §5.6 (kill-switch acionado), tornando o registro
> auditável conforme o DoD obrigatório da F6.

---

## 1. Estado atual (fatos verificáveis)

### 1.1 Workflow no repositório

`.github/workflows/impact-agent.yml` está **presente** no repositório
em `f20a180` e roda no estágio **ADVISORY**:

- `name: Impact Agent (advisory)`;
- comentário-cabeçalho explícito: *"Estágio: ADVISORY — este workflow
  observa e reporta, nunca bloqueia."*;
- `continue-on-error: true` no job `impact-advisory`;
- step `Run Impact Analysis Guard` envolto em `set +e` + `exit 0`
  deliberado;
- comentário do bot na PR e summary do step são informativos, não
  bloqueantes.

Arquivos de governança que tocam no agente:
- `docs/adr/ADR-001-impact-agent.md` — define os critérios de
  promoção `advisory → warning → blocking`;
- `docs/sprints/sprint-01/evidencias/impact-agent-ci.md` — primeiro
  run verde (PR #1, run 24619349882, 2026-04-19T02:45Z);
- `docs/sprints/sprint-02/evidencias/impact-agent-estado-inicial.md`
  — confirma a presença do workflow antes da F1 da Sprint 2;
- `docs/baseline/gate-forense/MATRIZ_FORENSE_DE_PRONTIDAO_PARA_EXECUCAO.md`
  — registra C-11 "Impact Agent advisory" como aprovado.

### 1.2 Histórico de runs durante a Sprint 2

Os PRs mergeados durante a Sprint 2 — F2 (#6), F3 (#7), pipeline
operacional (#8), F4 (#9), F5 oficial (#10) — passaram pelo workflow
em modo advisory por construção do CI atual. Esta sessão de chat
**não tem acesso direto** ao GitHub para enumerar runs e contar
bloqueios espúrios. Logo, qualquer afirmação aqui sobre fricção
acumulada se apoia em fatos disponíveis em local (PLANO §5.6 ação 1
gatilho `(a)`):

- **Fato:** os 5 PRs da Sprint 2 mergearam.
- **Fato:** o workflow é `continue-on-error: true`, ou seja,
  matemática e politicamente não pode ter bloqueado nenhum merge.
- **Inferência (rotulada):** "fricção zero" no sentido literal só
  pode ser confirmada lendo os comentários de advisory em cada PR.
  Esta sessão não fez essa leitura — e o auditor explicitou em
  §6 do prompt F6 que não temos permissão de mexer em workflows ou
  consultar GitHub.

### 1.3 Avaliação dos 3 gatilhos do PLANO §5.6 ação 1

| Gatilho | Critério                                                            | Estado nesta F6                                                                             | Verde? |
|---------|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------|--------|
| (a)     | Baixa fricção comprovada — zero bloqueios espúrios em F2–F5         | Indireto: workflow é `continue-on-error: true`, então sem prova **direta** de fricção zero  | indeterminado |
| (b)     | Sprint dentro do budget — F2–F5 sem residual vermelho + folga        | Mergeadas com squash em sequência; F6 começou nesta sessão                                  | indeterminado (F6 em curso) |
| (c)     | Aprovação explícita do PO na revisão de fim de F5                    | **Não há registro nesta sessão** de aprovação explícita do PO para promover                 | NÃO    |

**Default do PLANO §3.4** quando qualquer gatilho falha ou é
indeterminado: **kill-switch acionado = preservar `advisory`**.

Como o gatilho `(c)` é **objetivamente NÃO** (sem registro de
aprovação explícita do PO nos artefatos da F5 ou em documento
desta sessão) e os outros dois são **indeterminados** sem leitura
do GitHub, **a regra é unívoca: preservar `advisory`**.

---

## 2. Opções avaliadas

### 2.1 Opção A — Preservar `advisory` (RECOMENDADA)

**Ações implicadas:** nenhuma alteração em `scripts/impact_analysis_guard.py`,
`.github/workflows/impact-agent.yml` ou `.github/workflows/ci.yml`.

**Por que faz sentido:**
- É o **default** estabelecido no PLANO §3.4 e §5.6.
- O gatilho `(c)` (aprovação do PO) não foi atendido — a sessão de
  chat não pode forjar essa aprovação.
- Promover sem prova de fricção zero arrisca falso-positivo no CI
  pós-merge da F6, comprometendo a Sprint 3 antes de começar.
- A sprint pode fechar **sem** promover — esse é exatamente o
  desenho do `CONDICIONAL` no PLANO §3.4.

**O que NÃO bloqueia o fechamento da Sprint 2:**
- A linha `CONDICIONAL` no PLANO §3.4 marca a promoção como
  desligável sem reprovar a sprint, desde que declarada
  explicitamente.
- Esta evidência É a declaração explícita exigida.

**Próximo passo:** ABRIR ADR curta antes da próxima tentativa de
promoção (Sprint 3 ou P-Refino) descrevendo: (i) leitura literal dos
comentários de advisory das PRs F2–F5 como prova de fricção;
(ii) dry-run do bloqueio em branch isolada com PR sintética
violadora; (iii) override documentado para mantenedores.

### 2.2 Opção B — Promover para `blocking` agora

**Por que NÃO foi escolhida:**
- Gatilho `(c)` falhou (sem aprovação explícita do PO nesta
  sessão).
- Promoção exige edição de `scripts/impact_analysis_guard.py` e
  `.github/workflows/ci.yml` — **fora do escopo permitido pelo
  prompt F6** §6 ("Não alterar workflows de CI").
- Promoção exige prova literal do bloqueio em PR sintética
  (`F6-impact-agent-bloqueando.md` no PLANO §5.6 ação 1) — sem
  acesso ao GitHub nesta sessão, essa prova não existe.

Logo, **B é tecnicamente impossível** sob as restrições da F6.

### 2.3 Opção C — Adiar com justificativa para sprint futura

A Opção C **é o que o PLANO §3.4 já prescreve** quando o
kill-switch é acionado: a promoção "migra para Sprint 3 ou
P-Refino, com ADR". Esta evidência cumpre o registro formal.

Em outras palavras: **A e C são a mesma decisão** — preservar
`advisory` agora, e endereçar a promoção em sprint futura com
ADR. Adotamos a redação "Opção A com adiamento explícito da
promoção (Opção C complementar)" para evitar ambiguidade.

---

## 3. Decisão recomendada

**Opção A — Preservar `advisory`. Promoção para `blocking` adiada
para Sprint 3 ou P-Refino, com ADR a abrir antes da próxima
tentativa.**

Critérios cumpridos:
- decisão **registrada explicitamente** (esta evidência);
- **nenhum** arquivo de workflow ou script tocado nesta F6;
- caminho de promoção futuro **nominado** (Sprint 3 / P-Refino);
- gate `CONDICIONAL` do PLANO §3.4 honrado (kill-switch declarado,
  não silenciado).

---

## 4. Justificativa

1. **Default técnico do PLANO §3.4.** Quando qualquer gatilho falha,
   preservar `advisory` é a regra; promover é exceção condicional.
2. **Aprovação do PO não registrada nesta sessão.** O gatilho `(c)`
   exige assinatura explícita do PO na revisão de fim de F5.
   Nenhum artefato desta sessão contém essa assinatura.
3. **Falta de prova operacional do bloqueio.** O PLANO §5.6 ação 1
   exige `F6-impact-agent-bloqueando.md` com log de bloqueio
   funcionando. Sem acesso ao GitHub na sessão, essa prova é
   impossível.
4. **Escopo do prompt F6.** §6 do prompt F6 proíbe alterar
   `.github/workflows/`. A promoção exigiria essa alteração.
5. **Risco × benefício.** O custo de preservar `advisory` é zero
   (continua observando e reportando). O custo de uma promoção
   sem prova é trancar PRs subsequentes em falso-positivo —
   exatamente o cenário que o kill-switch §3.4 pretende evitar.

---

## 5. Riscos da decisão

| Risco                                                                | Probabilidade | Mitigação                                                                                  |
|-----------------------------------------------------------------------|---------------|--------------------------------------------------------------------------------------------|
| Sprint 3 também adiar a promoção indefinidamente                       | Média         | ADR curta no início da Sprint 3 com prazo objetivo.                                         |
| Comentário advisory ser ignorado pelos revisores                       | Baixa-média   | Manter o bot postando o comentário (configuração atual). Reforçar em revisão de PR.        |
| Promoção vir junto com mudanças de código domain/api                   | Baixa         | A promoção é PR governança-only; isolar.                                                    |
| Esquecer de registrar a decisão e ela parecer omissão                  | (mitigado)    | Esta evidência É o registro. Doc 19 / living_docs.json refletem a decisão.                  |

---

## 6. Próximo passo (operador / Sprint 3)

1. Abrir ADR curta (`docs/adr/ADR-NNNN-impact-agent-promocao.md`) na
   primeira fatia da Sprint 3 ou na primeira fatia do ciclo
   P-Refino, com:
   - leitura literal dos comentários de advisory das PRs F2–F5
     como prova de fricção (gatilho `a`);
   - aprovação explícita do PO documentada (gatilho `c`);
   - plano de dry-run em branch isolada (PLANO §5.6 ação 1).
2. Materializar o dry-run (PR sintética violadora) **antes** de
   editar `scripts/impact_analysis_guard.py` ou `ci.yml`.
3. Capturar a rejeição em
   `docs/sprints/sprint-NN/evidencias/F-impact-agent-bloqueando.md`.
4. Só então editar `scripts/impact_analysis_guard.py` (ou step
   do CI) para `--mode blocking` e remover `continue-on-error`.
5. Manter rota de escape (override documentado para mantenedores).

Esta evidência **não** abre nenhuma dessas mudanças. Ela apenas
formaliza a decisão de **não fazer** a promoção nesta F6.

---

## 7. Coerência com outros artefatos

- `PLANO_EXECUCAO_SPRINT_2.md` §3.4 (CONDICIONAL com kill-switch) — honrado.
- `PLANO_EXECUCAO_SPRINT_2.md` §5.6 ação 1 — kill-switch acionado,
  decisão registrada como exigido.
- `docs/adr/ADR-001-impact-agent.md` — não modificado; promoção
  futura abrirá ADR-NNNN dedicada.
- `.github/workflows/impact-agent.yml` — **não tocado**.
- `.github/workflows/ci.yml` — **não tocado**.
- `scripts/impact_analysis_guard.py` — **não tocado**.

A decisão é **doc-only**. Nenhum comportamento de runtime do CI ou
dos scripts foi alterado pela F6.
