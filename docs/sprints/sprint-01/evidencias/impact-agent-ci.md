# Impact Agent no CI — Sprint 1

**Status:** WIRED — o workflow `impact-advisory` foi introduzido em
`.github/workflows/impact-agent.yml` pela **Fatia 4**. O primeiro run verde
será registrado na seção §4 deste documento assim que a PR da Sprint 1 for
aberta.

**Plano de referência:** `sprint-1/00_plano/PLANO_EXECUCAO_SPRINT_1.md`
v1.1 §7 (Fatia 4 — CI) e §6.4 (divergência declarada em relação a CND-03).
**ADR:** `docs/adr/ADR-001-impact-agent.md`.

---

## 1. O que a Fatia 4 materializou

- **Novo workflow dedicado** `.github/workflows/impact-agent.yml`:
  - Trigger: `pull_request` em `main` (events `opened`, `synchronize`, `reopened`).
  - Runtime: Python 3.11, Ubuntu latest.
  - `permissions.pull-requests: write` (apenas para postar comentário — não
    escreve em código, não abre PRs, não cria commits).
  - `continue-on-error: true` redundante a `sys.exit(0)` do script.
  - Passo único de execução:
    ```
    python scripts/impact_analysis_guard.py --base ${{ steps.base.outputs.sha }}
    ```
    onde `steps.base.outputs.sha` resolve de
    `github.event.pull_request.base.sha` com fallback para `HEAD~1`.
  - Concurrency group por número de PR para economizar minutos de CI.
- **Comentário de PR** gerado por `actions/github-script@v7`:
  - Strip de códigos ANSI antes de postar.
  - **Dedup**: se já existir um comentário do agente na PR, ele é
    *atualizado* em vez de duplicado.
  - Header com link clicável para o run (`actions/runs/<ID>`).
- **Artifact** `impact-report.txt` com retenção de 30 dias.
- **Step summary** publicado em `GITHUB_STEP_SUMMARY`.
- **Não toca** `.github/workflows/ci.yml`: o agente vive em workflow próprio
  para não interferir com a matriz de testes que já existe.

## 2. Por que advisory e não warning/blocking nesta sprint

CND-03 do `LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md` prevê a promoção
*advisory → warning → blocking* ao fim da Sprint 1. O **Prompt Sprint 1
§5.1.5** determina explicitamente "modo advisory (sem produzir bloqueio
indevido)". A divergência é intencional e formalmente declarada também em:

- `PLANO_EXECUCAO_SPRINT_1.md` v1.1 §6.4;
- `docs/sprints/sprint-01/validacao-oficial.md` §4;
- `docs/sprints/sprint-01/evidencias/pendencias-herdadas-fechamento.md`.

A promoção para *warning*/*blocking* é **pendência residual formal para a
Sprint 2**, condicionada à emissão de **ADR-0002 (critérios de WARNING)** e
instrumentação adicional de telemetria do agente (ADR-001 §"Critérios de
promoção para WARNING").

## 3. Contrato de não-bloqueio (prova dupla)

A advisory é garantida por **dois mecanismos independentes**:

1. **Script** — `scripts/impact_analysis_guard.py` termina com `sys.exit(0)`
   incondicionalmente (cf. ADR-001 §"Estágio atual: ADVISORY").
2. **Workflow** — `continue-on-error: true` no job, por defesa em
   profundidade, caso o script venha a mudar no futuro.

Qualquer alteração que derrube o contrato advisory deverá:
- atualizar ADR-001 e abrir ADR-0002 (WARNING) ou ADR-0003 (BLOCKING);
- atualizar este documento;
- registrar na matriz de rastreabilidade (Doc 19).

## 4. Primeiro run verde (preencher ao abrir a PR da Sprint 1)

- [ ] URL do workflow run: `<preencher com o link de actions/runs/<ID> após abrir a PR>`
- [ ] SHA do commit que disparou o run: `<preencher>`
- [ ] Branch: `sprint-1`
- [ ] Data/hora UTC do run: `<preencher>`
- [ ] Último trecho do log (últimas ≤20 linhas do step `Run Impact Analysis Guard`):

```
<preencher — colar aqui o trecho final do log>
```

- [ ] Resultado: `advisory OK (exit 0)`
- [ ] Comentário postado na PR: `<link permanente para o comentário>`

O preenchimento desses campos é a evidência de **operação efetiva** do agente
em CI (não apenas de configuração). Enquanto não preenchidos, o status segue
**WIRED, aguardando primeiro run**.
