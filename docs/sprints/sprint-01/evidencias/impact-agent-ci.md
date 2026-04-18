# Impact Agent no CI — Sprint 1

**Status nesta fatia (3):** STUB — a ser finalizado pela **Fatia 4** com o
hash real do primeiro run verde do step `impact-advisory` no GitHub Actions.
**Plano de referência:** `sprint-1/00_plano/PLANO_EXECUCAO_SPRINT_1.md`
v1.1 §7 (Fatia 4 — CI) e §6.4 (divergência declarada em relação a CND-03).

---

## 1. O que a Fatia 4 vai materializar

- Novo job `impact-advisory` em `.github/workflows/ci.yml`:
  - `needs: []` (paralelo a backend/frontend — nunca bloqueia).
  - `continue-on-error: true` redundante à `sys.exit(0)` do script.
  - Passo único: `python scripts/impact_analysis_guard.py --base ${{ github.event.pull_request.base.sha || 'HEAD~1' }}`.
- Este arquivo será **atualizado no commit da Fatia 4** com:
  - URL do run (`https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira/actions/runs/<ID>`).
  - Hash do commit (`sha`) e branch associada.
  - Trecho final da saída do script (linhas `[impact]` relevantes).
  - Confirmação de que o job terminou em verde (advisory).

---

## 2. Por que advisory e não warning/blocking nesta sprint

CND-03 do `LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md` prevê a promoção
*advisory → warning → blocking* ao fim da Sprint 1. O **Prompt Sprint 1
§5.1.5** determina explicitamente "modo advisory (sem produzir bloqueio
indevido)". A divergência é intencional e formalmente declarada também em:

- `PLANO_EXECUCAO_SPRINT_1.md` v1.1 §6.4;
- `docs/sprints/sprint-01/validacao-oficial.md` §4;
- `docs/sprints/sprint-01/evidencias/pendencias-herdadas-fechamento.md`.

A promoção para *warning*/*blocking* é **pendência residual formal para a
Sprint 2**, condicionada à emissão de **ADR-0002 (critérios de WARNING)**
e instrumentação adicional de telemetria do agente.

---

## 3. Campos a serem preenchidos pela Fatia 4

- [ ] URL do workflow run: `<preencher>`
- [ ] SHA do commit que disparou o run: `<preencher>`
- [ ] Branch: `sprint-1`
- [ ] Data/hora UTC do run: `<preencher>`
- [ ] Último trecho do log (últimas ≤20 linhas do step):

```
<preencher — colar aqui o trecho final >
```

- [ ] Resultado: `advisory OK (exit 0)`
