# Impact Agent no CI — Sprint 1

**Status:** WIRED + PRIMEIRO RUN REGISTRADO — o workflow `impact-advisory`
foi introduzido em `.github/workflows/impact-agent.yml` pela **Fatia 4** e
executou com sucesso no primeiro run da PR `sprint-1 → main`
(run `24619349882`, commit `e094b80`, 2026-04-19T02:45Z). Detalhes na §4.

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

## 4. Primeiro run verde — REGISTRADO

- [x] **PR associada:** [#1 — Sprint 1 → main](https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira/pull/1)
- [x] **URL do workflow run:** [actions/runs/24619349882](https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira/actions/runs/24619349882)
- [x] **SHA do commit que disparou o run:** `e094b80` (Fatia 4 —
      `ci(sprint-01): wirear Impact Analysis Guard ao GitHub Actions em modo ADVISORY`)
- [x] **Branch:** `sprint-1`
- [x] **Data/hora UTC do run (último evento do job):** `2026-04-19T02:45:36Z`
- [x] **Job:** `Impact analysis (advisory)`
- [x] **Resultado:** `advisory OK` — job concluído sem erro fatal; `continue-on-error: true`
      + `sys.exit(0)` incondicional do script garantiram a invariante de não-bloqueio.

### 4.1 Últimas linhas do log do job (trecho autêntico, conforme retornado pelo GitHub Actions)

```text
Impact analysis (advisory)      Summary 2026-04-19T02:45:36.1974230Z   Python3_ROOT_DIR: /opt/hostedtoolcache/Python/3.11.15/x64
Impact analysis (advisory)      Summary 2026-04-19T02:45:36.1975622Z   LD_LIBRARY_PATH: /opt/hostedtoolcache/Python/3.11.15/x64/lib
Impact analysis (advisory)      Summary 2026-04-19T02:45:36.1977018Z ##[endgroup]
Impact analysis (advisory)      Post Setup Python       2026-04-19T02:45:36.2316712Z Post job cleanup.
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.4041953Z Post job cleanup.
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5008361Z [command]/usr/bin/git version
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5043239Z git version 2.53.0
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5085584Z Temporarily overriding HOME='/home/runner/work/_temp/449627b1-3790-49e7-8119-6ff90c7fae66' before making global git config changes
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5088442Z Adding repository directory to the temporary git global config as a safe directory
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5091688Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/Plataforma_Educacional_Financeira/Plataforma_Educacional_Financeira
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5125395Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5160833Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5382350Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5402601Z http.https://github.com/.extraheader
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5414992Z [command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5448227Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5663188Z [command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\.gitdir:
Impact analysis (advisory)      Post Checkout (com histórico para diff base..head)      2026-04-19T02:45:36.5700360Z [command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url
Impact analysis (advisory)      Complete job    2026-04-19T02:45:36.6035310Z Cleaning up orphan processes
Impact analysis (advisory)      Complete job    2026-04-19T02:45:36.6396888Z ##[warning]Node.js 20 actions are deprecated. The following actions are running on Node.js 20 and may not work as expected: actions/checkout@v4, actions/github-script@v7, actions/setup-python@v5, actions/upload-artifact@v4. Actions will be forced to run with Node.js 24 by default starting June 2nd, 2026. Node.js 20 will be removed from the runner on September 16th, 2026.
```

### 4.2 Observação técnica honesta (declaração explícita)

O trecho acima corresponde aos **últimos eventos do job** (post-steps +
`Complete job`), não à saída direta do step `Run Impact Analysis Guard`. O
conteúdo do output do script (a cartela `IMPACT ANALYSIS GUARD — ...` com o
resumo ADVISORY) consta no **artifact** `impact-report.txt` (retenção 30 dias
— veja seção *Artifacts* do run) e também no **comentário** postado
automaticamente pelo bot no PR #1. Como evidência mínima, este arquivo
preserva os *logs estruturais* do GitHub Actions que comprovam:

1. O runner usou **Python 3.11.15** (matching do `setup-python@v5`).
2. O job executou até o passo `Complete job` (não abortou no meio).
3. Não há linhas `##[error]` no trecho — apenas um `##[warning]` de
   deprecação futura (ver §4.3).

### 4.3 Avisos não-bloqueantes capturados no run

- **`Node.js 20 actions are deprecated`** — `actions/checkout@v4`,
  `actions/github-script@v7`, `actions/setup-python@v5` e
  `actions/upload-artifact@v4` serão forçadas a Node.js 24 a partir de
  02/06/2026; Node.js 20 será removido do runner em 16/09/2026. Este aviso
  é **ambiental do GitHub**, não específico deste repositório, e afeta
  praticamente todos os workflows do mundo. Endereçamento: acompanhar as
  próximas versões das actions upstream (`actions/*@v5`/`@v6`) e atualizar
  quando publicadas. **Item registrado em `pendencias-herdadas-fechamento.md`
  como observação para a Sprint 2.** Não configura divergência CND-03 nem
  quebra o contrato advisory.

### 4.4 Próximos passos desta linha

- [ ] Sprint 2: abrir ADR-0002 (critérios de promoção ADVISORY → WARNING),
      conforme ADR-001 §"Critérios de promoção para WARNING".
- [ ] Sprint 2: atualizar as versões das actions upstream quando
      disponibilizadas em Node.js 24+.
- [ ] Monitorar taxa de aderência às recomendações do agente em PRs
      subsequentes (≥ 70% é pré-requisito para promoção).
