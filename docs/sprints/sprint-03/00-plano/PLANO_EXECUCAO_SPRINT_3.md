# Plano de Execução — Sprint 3

**Plataforma Educacional Financeira (PEF)**
**Tema da Sprint:** Sistemas de Amortização — PRICE e SAC (segundo módulo matemático completo)
**Autor:** Equipe de Engenharia (papel coletivo operado pela IA executora)
**Data:** 2026-05-02
**Versão:** 1.1 (correção cirúrgica pós-auditoria — micro-adendo v2)
**Status:** ⏳ Aguardando aprovação do PO (Moisés) antes da abertura da primeira branch-de-fatia (`sprint-3/f1-preveo`)
**Escopo desta rodada:** **planejamento auditável** apenas. Nenhuma modificação de código ou de documento vivo será executada antes da aprovação. A posição da IA é deliberadamente **forense**, conforme `CLAUDE.md` e Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada) §1–§15.

---

## 0. Histórico de revisões

| Versão | Data | Autor | Alterações |
|---|---|---|---|
| 1.0 | 2026-05-02 | Equipe de Engenharia (executora de chat) | Versão inicial, pré-revisão do PO. Baseada em: (a) Contexto de Continuidade Pós-Sprint 2 fornecido no chat de retomada da Sprint 3; (b) `docs/sprints/sprint-02/{00-plano/PLANO_EXECUCAO_SPRINT_2.md, relatorio-execucao.md, validacao-oficial.md, evidencias/F6-decisao-impact-agent.md}` mergeados em `main` @ `840cbcb` (relatorio-forense lido apenas parcialmente nesta versão — corrigido na v1.1); (c) `Prompt Sprint 3.docx` (rodada de planejamento, sem código); (d) snapshot documental real lido em `840cbcb` — Docs 02, 03 (baseline), 04, 05, 06, 07, 08, 09, 10, 12, 13, 15, 16, 19, 25, 26, 27, baseline 21, `_meta/living_docs.json`, `docs/operacional/PIPELINE_OFICIAL_QUALIDADE.md`, `Makefile`, `scripts/pipeline.{sh,ps1}`, `.github/workflows/{ci,impact-agent}.yml` (Doc 11 e `docs/api/openapi.json` **não** foram lidos nesta v1.0 — corrigido na v1.1). |
| 1.1 | 2026-05-02 | Equipe de Engenharia (executora de chat) | Correção cirúrgica pós-auditoria do pacote v1 pelo Camaleão (micro-adendo v2). Seis ajustes: (B1) `docs/baseline/11_Prompt_Mestre.md` lido integralmente — incorporado em §2.3 como Fato adicional sobre divergência endpoint singular `price-sac` (Doc 11 §15) vs três endpoints `{price,sac,compare}` (Doc 06 §15.4 — vivo, prevalece); (B2) `docs/sprints/sprint-02/relatorio-forense.md` lido integralmente — confirmou cadeia de custódia da Sprint 2 sem novas lições estruturais, mas revelou que F3 da Sprint 2 declara ter regerado `docs/api/openapi.json` (linha §1.3) enquanto a leitura literal mostra openapi.json estagnado em 4 paths da Sprint 1 — Fato adicional em §2.2; (B3) `docs/api/openapi.json` lido integralmente — confirmado: 4 paths somente (`/api/v1/contract/ping`, `/health`, `/health/live`, `/health/ready`); zero `amortization`, `interest`, `price`, `sac`. Implicação: F3 da Sprint 3 regenera do zero e o diff inclui catch-up de juros + amortização novos; (B4) histórico v1.0 corrigido — `Doc 11` removido da lista de fontes lidas naquela versão, declarando honestamente o que ocorreu; (B5) caminho proibido `frontend/src/services/amortization/__init__placeholder.ts` substituído por `frontend/src/services/amortization/index.ts` (padrão Sprint 2: `frontend/src/services/interest.ts` + barrel mais sub-módulos); (B6) referências frágeis ao caminho local de sandbox `outputs/CONTEXTO_DE_CONTINUIDADE_POS_SPRINT_2.md` (10 ocorrências no plano v1) substituídas pelo texto neutro estável "Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada)". Nenhuma alteração de escopo, arquitetura, fatias ou critérios de aceite. |

> Toda revisão posterior é commit normal sobre este arquivo, com nova linha aqui (PLANO Sprint 2 §8.7).

---

## 1. Finalidade deste documento

Este é o **plano operacional** que precede qualquer alteração de código ou documento vivo na Sprint 3. Consolida o Discovery, enuncia decisões arquiteturais e editoriais, lista os arquivos que serão criados/alterados por fatia, a estratégia de testes, a estratégia documental (incluindo bloco **IMPACTO DOCUMENTAL**), o regime de governança e os critérios objetivos de aceite. **Nenhuma fatia começa antes da aprovação deste plano pelo PO.**

O plano respeita integralmente:
- a matriz **Fato / Inferência / Limitação** (sem inferência disfarçada de fato);
- o protocolo da Sprint 2 (Fase 0, fatias pequenas e demonstráveis, PR atômica por fatia, evidências imutáveis em `docs/sprints/sprint-03/evidencias/`, planilha operacional atualizada com aviso explícito do chat de origem, IMPACTO DOCUMENTAL em cada PR);
- o **Prompt Sprint 3** (entrega planejada, não código);
- as **lições aprendidas da Sprint 2** registradas em Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada) §8 e replicadas em §13 do prompt — todas obrigatórias.

Onde houver conflito entre planilha operacional e documentação real, **a documentação real (em `docs/`) prevalece** (Prompt Sprint 3 §4).

---

## 2. Leitura do estado atual (Fase 0 adaptada ao planejamento)

### 2.1 Contexto operacional — limitação ambiental declarada

A sessão de chat opera num sandbox WSL/FUSE com mount do repositório Windows. Foi detectada anomalia no `.git/HEAD` deste mount (descrita em Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada) §11 e Prompt Sprint 3 §6):

- `git rev-parse --short HEAD` falha com `fatal: Failed to resolve HEAD as a valid ref`;
- `git status -sb` reporta toda a árvore como `A` (added);
- `git reflog` falha com `fatal: your current branch appears to be broken`;
- `.git/HEAD` contém `ref: refs/heads/main\n` seguido de bytes nulos (visíveis com `od -c .git/HEAD`).

**Diagnóstico (Fato verificado):**
- as refs estão íntegras: `refs/heads/main`, `refs/remotes/origin/main` e `refs/remotes/origin/HEAD` apontam para `840cbcb` (`git for-each-ref` confirma);
- o objeto `840cbcb` é commit válido (`git cat-file -t 840cbcb` → `commit`; `git ls-tree -r 840cbcb --name-only | wc -l` → 333 arquivos);
- comandos de leitura por commit explícito funcionam: `git show 840cbcb:<path>`, `git ls-tree 840cbcb`, `git diff 840cbcb -- <path>`.

**Regra desta rodada (vinculante, conforme Prompt Sprint 3 §6):**
1. esta sessão **não tenta** corrigir `.git/HEAD`;
2. **não executa** `git add`, `git commit`, `git push`;
3. **não cria** branch nem abre PR;
4. **não declara** working tree limpa;
5. usa `840cbcb` apenas como referência explícita de leitura;
6. gera somente o plano off-repo.

A Fase 0 canônica da Sprint 3 (com `git status -sb` / `git branch --show-current` / `git rev-parse HEAD` verdes) **será executada pelo operador (Moisés) no WSL Ubuntu oficial**, antes de abrir `sprint-3/f1-preveo`. Saída registrada em `docs/sprints/sprint-03/evidencias/base-branch.md` (a ser materializada pela F1).

### 2.2 Fatos confirmados sobre o estado de saída da Sprint 2 (fonte: `840cbcb` no repo)

**Fato (commit oficial).** `main` em `840cbcb` — `docs(sprint-2): fechar governanca e validacao final (#11)`. Mensagem reproduzida literalmente via `git show --stat --no-patch 840cbcb`.

**Fato (sequência de PRs da Sprint 2, confirmada por `git log --oneline -7 840cbcb`):**

```
840cbcb  feat(sprint-2): fechamento + governança da Sprint 2 (#11)               — F6 v2 / encerramento
f20a180  feat(sprint-2): materializar conteúdo educacional e docs vivos (#10)   — F5 oficial v2
f1336d8  feat(sprint-2): implementar frontend de juros (#9)                      — F4
7841049  chore(sprint-2): materializar pipeline oficial (#8)                     — F5 emergencial / pipeline
2ae0bb2  feat(interest): expor endpoints REST de juros (#7)                       — F3
e4e56ac  feat(interest): implementar dominio de juros simples e compostos (#6)    — F2
0251c42  chore(governance): versionar CLAUDE.md e prompts operacionais (#5)        — F1
```

**Fato (artefatos canônicos da Sprint 2 mergeados em `main`, confirmados via `git cat-file -e 840cbcb:<path>`):**
- `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md`
- `docs/sprints/sprint-02/relatorio-execucao.md`
- `docs/sprints/sprint-02/relatorio-forense.md`
- `docs/sprints/sprint-02/validacao-oficial.md`
- `docs/sprints/sprint-02/evidencias/F6-decisao-impact-agent.md`
- pipeline oficial: `scripts/pipeline.sh`, `scripts/pipeline.ps1`
- workflow: `.github/workflows/impact-agent.yml` (modo `advisory`)

**Fato (estado funcional pós-Sprint 2, lido em `840cbcb`):**
- domínio juros: `backend/app/domain/interest/{simple,compound,_rounding}.py` presentes;
- API: `backend/app/api/v1/interest.py` presente; rotas `POST /api/v1/interest/{simple,compound,compare}`;
- frontend: `frontend/src/app/(app)/juros/page.tsx` presente como **página real** (não mais placeholder); 19+ arquivos de teste em `frontend/src/__tests__/`;
- conteúdo educacional: `frontend/src/content/juros/{types,index,nivel-1,nivel-2,glossario}.ts` presentes;
- lint pedagógico subset: `tools/edu_lint/` presente;
- placeholder atual de amortização: `frontend/src/app/(app)/amortizacao/page.tsx` ainda usa `<ModulePage moduleId="amortizacao" />` (a ser substituído pela F4 desta sprint).

**Fato (estado-zero do módulo amortização em `840cbcb`, confirmado via `git show 840cbcb:<path>`):**
- `backend/app/domain/amortization/__init__.py` — vazio (apenas existe);
- `backend/app/schemas/amortization/__init__.py` — vazio;
- `backend/app/services/amortization/__init__.py` — vazio;
- não há `backend/app/api/v1/amortization.py`;
- não há `frontend/src/components/amortization/`;
- não há `frontend/src/content/amortizacao/`;
- pasta `backend/tests/regression/` existe com apenas `__init__.py` (P2 da Sprint 2 — `pedagogical/test_interest.py` continua planejado).

**Fato (decisão registrada sobre Impact Agent, fonte `docs/sprints/sprint-02/evidencias/F6-decisao-impact-agent.md` em `840cbcb`):** preservar `advisory` (kill-switch §3.4 acionado). Workflow `.github/workflows/impact-agent.yml` permanece com `continue-on-error: true`. Promoção para `blocking` adiada para Sprint 3 ou P-Refino, **com ADR-NNNN a abrir antes da próxima tentativa**.

**Fato (`docs/api/openapi.json` em `840cbcb` — leitura literal v1.1):** o arquivo OpenAPI versionado contém apenas **4 paths** — `/api/v1/contract/ping`, `/health`, `/health/live`, `/health/ready` — todos da Sprint 1. Zero ocorrências de `amortization`, `interest`, `price` ou `sac` no JSON. Schemas: 5 componentes (`HTTPValidationError`, `Meta`, `PingData`, `ResponseEnvelope_PingData_`, `ValidationError`).

**Fato (divergência detectada — `relatorio-forense.md` Sprint 2 §1.3 vs estado real do openapi.json):** o relatório forense da Sprint 2 declara que `docs/api/openapi.json` foi "regerado por `scripts/export_openapi.py`" no commit `2ae0bb2` (F3 da Sprint 2), mas a leitura literal de `git show 2ae0bb2:docs/api/openapi.json` e `git show 840cbcb:docs/api/openapi.json` confirma que ambos contêm apenas os 4 paths de Sprint 1 — sem juros. **Implicação para a Sprint 3:** a F3 desta sprint deve regenerar o OpenAPI do zero; o diff resultante incluirá tanto os 3 endpoints novos de amortização **quanto** o catch-up dos 3 endpoints de juros da Sprint 2 que ficaram fora do JSON versionado. **Não-objetivo:** investigar a causa-raiz do salto de versão omitido — fora do escopo desta sprint; tratado como anomalia herdada da Sprint 2 a ser corrigida em silêncio na regeneração da F3.

**Fato (Doc 11 / baseline §15 — Endpoints mínimos):** o Prompt-Mestre (Doc 11 v1.0, baseline) lista, em §15, `POST /api/v1/amortization/price-sac` (endpoint **singular**). O Doc 06 v2.0 (vivo, "reescrito integralmente") em §15.4 lista **três endpoints** distintos: `POST /api/v1/amortization/{price,sac,compare}`. **Decisão (alinhada à precedência do próprio Doc 11 §3 — API e Contratos prevalece sobre Visão; e à governança §3 do Doc 27 — backend OpenAPI é fonte da verdade):** seguir Doc 06. Doc 11 é baseline imutável e não será editado nesta sprint; a divergência fica registrada como Fato e a próxima rebaseline de Doc 11 (fora desta sprint) deverá refletir os 3 endpoints. O Prompt da Sprint 3 §3 também usou o nome singular `price-sac` — esta v1.1 corrige o caminho seguindo a fonte vivência prevalente.

**Fato (massas confirmadas pós-merge — fonte: Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada) §1.1):**

| Métrica | Valor |
|---|---|
| Backend — testes unitários passando | **94** |
| Frontend — arquivos de teste | **21** |
| Frontend — testes passando | **149** |
| Build do frontend | **OK** |
| `EXIT_LINT_PED` | **0** |
| `EXIT_PIPELINE` | **0** (`PIPELINE VERDE` no WSL Ubuntu) |
| Impact Agent | **advisory** (mantido) |

> Estes valores **não foram re-executados** pela sessão de chat (limitação ambiental — §11 do contexto). São transcritos do contexto de continuidade, que registra a execução real do operador no WSL Ubuntu pós-merge da F6.

### 2.3 Fatos confirmados sobre o escopo da Sprint 3 (triangulação documental)

**Fato (Doc 02 §3 e §5 — Módulo 03):** Sistemas de Amortização (PRICE e SAC) é **MVP obrigatório**. Entradas: valor financiado, taxa, periodicidade, prazo. Saídas: tabelas PRICE e SAC, total pago, total de juros, comparação e gráficos.

**Fato (Doc 06 §15.4 — Endpoints oficiais do MVP — Amortização):** três endpoints canônicos:
- `POST /api/v1/amortization/price`
- `POST /api/v1/amortization/sac`
- `POST /api/v1/amortization/compare`

**Fato (Doc 13 §3.5 — Sprint 3 — PRICE e SAC):** itens de backlog:
- BE-011 schemas amortização
- BE-012 domain Price
- BE-013 domain SAC
- BE-014 service comparativo
- BE-015 endpoints `POST /api/v1/amortization/{price,sac,compare}`
- FE-013/14/15 página, formulário, visualização
- QA-010..QA-014 unit (PR-*, SAC-*), integration, contract, visual
- CONT-002 conteúdos amortização
- DOC-004 atualizações
- REQ-IDs: RF-AMO-001, RF-AMO-002

**Fato (Doc 19 §2 — linhas RF-AMO-001 e RF-AMO-002):**
- `RF-AMO-001`: módulo `amortization`, endpoint `POST /api/v1/amortization/price`, schema `PriceIn/Out`, service `CalcularPriceService`, domain `domain.amortization.price.calcular`, doc 15 ref **PR-01..PR-10**, docs vivos `03,06,09,15,19`, status `pending`.
- `RF-AMO-002`: módulo `amortization`, endpoint `POST /api/v1/amortization/sac`, schema `SacIn/Out`, service `CalcularSacService`, domain `domain.amortization.sac.calcular`, doc 15 ref **SAC-01..SAC-10**, docs vivos `03,06,09,15,19`, status `pending`.

**Fato (Doc 15 §5 — Casos PRICE):**
- **PR-01** (caso padrão): principal 100.000,00 / taxa 1% a.m. / prazo 12 meses → parcela constante; soma das amortizações ≈ principal; saldo devedor final ≈ zero.
- **PR-02** (verificação estrutural): juros da primeira parcela > juros da última; amortização da última > amortização da primeira.

**Fato (Doc 15 §6 — Casos SAC):**
- **SAC-01** (caso padrão): principal 100.000,00 / taxa 1% a.m. / prazo 12 meses → amortização constante ≈ 8.333,33 por período; parcela inicial > parcela final; saldo devedor final ≈ zero.
- **SAC-02** (verificação comparativa com PRICE): total de juros do SAC menor que total de juros do PRICE para mesma taxa e prazo.

**Fato (Doc 03 / baseline §10 — PRICE):** parcela `PMT = PV × [ i × (1 + i)^n ] / [ (1 + i)^n - 1 ]`. Por período: `juros = saldo devedor anterior × i`; `amortização = parcela − juros`; `novo saldo = saldo anterior − amortização`.

**Fato (Doc 03 / baseline §11 — SAC):** amortização constante `A = PV / n`. Por período: `juros = saldo devedor anterior × i`; `parcela = amortização + juros`; `novo saldo = saldo anterior − amortização`.

**Fato (Doc 07 §8):** rota `/amortizacao` é canônica no modelo de navegação oficial (já é shell em `frontend/src/app/(app)/amortizacao/page.tsx` com `ModulePage` placeholder).

**Fato (Doc 06 §3.5, §3.6, §4.3 e §16.2):** moeda como string decimal de 2 casas (`"100000.00"`); taxa como fração decimal string (`"0.01"`); periodicidade como enum `UPPER_SNAKE_CASE` (ex.: `MONTHLY`); prazo em meses como inteiro; resposta de simulação obriga `summary / tables / charts / interpretation / alerts` dentro de `data` (envelope canônico Sprint 1).

**Fato (Doc 06 §5):** erros padronizados — `VALIDATION_ERROR` (422), `BUSINESS_RULE_ERROR` (400), demais por categoria — sempre via RFC 7807 `application/problem+json`.

**Fato (Doc 09 §7):** gates de cobertura — `backend/app/domain/` ≥ 95% linhas / 90% branches; mutação ≥ 80% (semanal); `services/` 90/85; `api/` 85/80; FE críticos 85/80.

**Fato (Doc 12 §10 — Sprint 3 — PRICE e SAC):** HUs HU-014 a HU-017. Critérios: PRICE/SAC corretos; comparação; total pago e juros; tabela e gráfico coerentes; interpretação; testes (Doc 15 PR-*, SAC-*).

**Fato (Doc 25 §2 — checklist mestre de release):** seção §2.1 Qualidade exige todos os gates verdes, mutation ≥ 80% no domain, suite de regressão (financial, pedagogical, visual, contract) verde.

**Fato (Doc 26 §4):** convenção `tests/fixtures/financial/` por caso do Doc 15; já existe `backend/tests/fixtures/financial_cases.json` (criado/ampliado na Sprint 2).

**Fato (Doc 27 §4):** mudança aditiva de contrato (novo endpoint/campo opcional) **não exige** nova versão major. Os 3 endpoints novos são aditivos sobre `v1`.

### 2.4 Inferências declaradas (com rótulo explícito)

**Inferência (a verificar em F1):** como a Sprint 2 fechou em `840cbcb` com pipeline verde no WSL Ubuntu, `main` deve seguir verde no momento da abertura de `sprint-3/f1-preveo`. **Verificação obrigatória na F1 antes de qualquer código** — operador no WSL roda `bash scripts/pipeline.sh` em `main` puro e anexa saída em `evidencias/main-verify-baseline.md`. Se quebrar, Sprint 3 não inicia.

**Fato (promovido de Inferência na v1.1, após leitura literal do openapi.json e do router em `840cbcb`):** as rotas `POST /api/v1/amortization/{price,sac,compare}` **não existem** — confirmado em três fontes independentes: (a) `backend/app/api/v1/amortization.py` ausente em `840cbcb`; (b) `backend/app/api/v1/router.py` em `840cbcb` não inclui `amortization.router`; (c) `docs/api/openapi.json` em `840cbcb` não lista nenhum path com `amortization`. F3 da Sprint 3 cria as rotas do zero. **Sub-fato relacionado:** o openapi.json também não lista as rotas de juros (Sprint 2) — vide Fato sobre divergência forense × estado real acima.

**Inferência (a verificar em F1):** Impact Agent continua em `advisory` no `.github/workflows/impact-agent.yml`. Confirmado em `840cbcb` com `continue-on-error: true` e cabeçalho "Estágio: ADVISORY"; a leitura literal final é responsabilidade do operador antes de qualquer F2.

**Inferência (rotulada — não Fato):** os comentários de advisory das PRs #5..#11 da Sprint 2 mostram zero bloqueios espúrios. Esta sessão **não** tem acesso ao GitHub para enumerar comentários; a verificação literal é insumo necessário para o ADR de promoção (F1.b desta sprint).

**Inferência:** a reutilização parcial de componentes do módulo Juros (`SummaryGrid`, `EvolucaoSaldoChart`, `JurosAlerts`, `JurosInterpretation`, `formPrimitives`, `formValidation`, `AmortizacaoTables`) é viável, **mas** demanda extração para um nível mais genérico — provavelmente `frontend/src/components/finance/` ou similar — para evitar import cruzado entre módulos pares. **Verificação na F4** (não decidir antes do código existir).

### 2.5 Limitações ambientais honestamente declaradas

Conforme Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada) §11, replicado por escopo:

1. **Anomalia `.git/HEAD` no mount** — descrita em §2.1; impede `git status` confiável; mitigada com leitura por SHA explícito.
2. **Sem acesso ao GitHub.** Não dá para enumerar runs do CI, ler comentários de PRs, conferir checks. Insumo para ADR de promoção (F1.b) precisa ser coletado pelo operador.
3. **FUSE quebra symlinks pnpm.** `node_modules/react/` retorna I/O error. `pnpm typecheck` / `pnpm test --run` **não rodam** no sandbox.
4. **Python 3.10 no sandbox; projeto exige 3.11.** `pytest` falha em imports que dependem de 3.11+.
5. **Bash com timeout** de 45s por comando.
6. **Permissão de escrita restrita** no workspace mountado. Sem `git add/commit/push`.
7. **Validação oficial é exclusivamente WSL Ubuntu** via `bash scripts/pipeline.sh` (Doc PIPELINE_OFICIAL_QUALIDADE.md §1).

A consequência operacional é a mesma da Sprint 2: a sessão de chat **gera plano e, em fatias futuras, pacotes auditáveis OFF-REPO**; o operador no WSL aplica, valida, mergeia.

### 2.6 Mapeamento "planilha → documentos reais" (Prompt Sprint 3 §4)

A planilha operacional pode conter nomes genéricos herdados. A Sprint 3 usa **exclusivamente** os nomes reais abaixo:

| Nome genérico (planilha — possível) | Nome real (repo `840cbcb`) | Uso na Sprint 3 |
|---|---|---|
| `docs/formulas.md` | `docs/baseline/03_Regras_de_Negocio.md` (§10 PRICE, §11 SAC) | Consumir, **não editar** (baseline). Adendo formal se ambiguidade. |
| `docs/api-contract.md` | `docs/06_API_e_Contratos.md` (§15.4) | Atualizar §15.4 (já lista as 3 rotas) com exemplos request/response na F3. |
| `docs/architecture.md` | `docs/04_Arquitetura_de_Software.md` | Consumir; sem alteração nesta sprint. |
| `docs/content-guide.md` | `docs/08_Conteudo_Educacional.md` | Atualizar §13.1 (glossário do módulo amortização) na F5. |
| `docs/user-guide.md` | **inexistente** — material equivalente está em Doc 07 (UX/UI) + Doc 16 (Design System) | Consumir Doc 07 §8 e §9 e Doc 16 §2 para a F4; sem edição. |

> Documentos baseline (Doc 01, 03, 11, 21) **não são tocados em PR comum** desta sprint (Prompt Sprint 3 §4; PLANO Sprint 2 §7.2). Necessidade real → Adendo ou ADR formal, fora do fluxo das fatias.

---

## 3. Escopo proposto (o que está dentro e o que não está)

### 3.1 Dentro do escopo (MVP Sprint 3)

| Camada | Item | Fonte canônica |
|---|---|---|
| Domínio | `backend/app/domain/amortization/price.py` — função pura `calcular` (PRICE) | Doc 03 §10; Doc 13 BE-012 |
| Domínio | `backend/app/domain/amortization/sac.py` — função pura `calcular` (SAC) | Doc 03 §11; Doc 13 BE-013 |
| Domínio (utilitário) | `backend/app/domain/amortization/_common.py` — política de arredondamento e helpers compartilhados (ou reuso de `interest/_rounding.py` se aderente) | PLANO Sprint 2 §5.2 (mesmo padrão) |
| Schemas | `PriceIn/Out`, `SacIn/Out`, `CompareAmortizationIn/Out`, `AmortizationRowItem` | Doc 06 §3.5/§3.6/§4.3/§16; Doc 13 BE-011 |
| Service | `CalcularPriceService`, `CalcularSacService`, `CompararAmortizacaoService` (orquestrador comparativo) | Doc 13 BE-014 |
| API | `POST /api/v1/amortization/{price,sac,compare}` | Doc 06 §15.4; Doc 13 BE-015; Doc 19 RF-AMO-001/002 |
| Frontend | Página `/amortizacao` real (substitui placeholder `ModulePage`) | Doc 07 §8; Doc 13 FE-013 |
| Frontend | Tabs PRICE / SAC / Comparar; formulário tipado; tabela período; gráfico; interpretação; alertas; estados `loading/empty/error/success` | Doc 07 §9, §17, §21; Doc 13 FE-014/15 |
| Testes BE | Unit Doc 15 PR-01..PR-02 e SAC-01..SAC-02 + property-based mínima + service tests | Doc 09 §5.1; Doc 13 QA-010/011/012 |
| Testes BE | Integration rota→service→domínio para os 3 endpoints; `errors` (422/400) | Doc 09 §5.3; Doc 13 QA-013 |
| Testes BE | Contract (schemathesis) para os 3 endpoints novos | Doc 09 §5.4; Doc 13 QA-014 |
| Testes FE | Component tests para Tabs/Forms/Panels/SaibaMais; route test `/amortizacao`; conteudo.test (presença pedagógica) | Doc 09 §8 |
| Testes BE (débito Sprint 2) | Materializar `backend/tests/regression/pedagogical/test_interest.py` (P2 do contexto §5) | Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada) §5; PLANO Sprint 2 P2 |
| Conteúdo | Textos nível 1 e 2 de PRICE/SAC; glossário do módulo amortização | Doc 13 CONT-002; Doc 08 |
| Documental | Doc 06 §15.4 (exemplos), Doc 09 §16 (massa F4 + §16.2 backend), Doc 15 §5/§6 (cross-link código), Doc 19 (RF-AMO-001/002 → done), `docs/_meta/living_docs.json` | DOC-004; POLÍTICA OPERACIONAL DE SINCRONIZAÇÃO |
| Conteúdo | Atualização do glossário (Doc 08 §13) com termos novos do módulo amortização | Pendência P5 do contexto §5 (parcial) |
| Governança (**CONDICIONAL** — §3.4) | **ADR-NNNN — Impact Agent: avaliação de promoção `advisory → blocking`** com leitura literal dos advisories das PRs Sprint 2 + plano de dry-run + rota de escape | Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada) §10; PLANO Sprint 2 §5.6 ação 1 |
| Governança | Artefatos `docs/sprints/sprint-03/{relatorio-execucao.md, relatorio-forense.md, validacao-oficial.md, evidencias/}` | POLÍTICA OPERACIONAL; PLANO Sprint 2 §5.6 |
| Governança | Planilha operacional atualizada com aviso explícito do chat de origem em **cada** uma das fatias | POLÍTICA OPERACIONAL; PLANO Sprint 2 §9 critério C10 |

### 3.2 Fora do escopo (sprints seguintes ou pós-MVP)

| Item | Por que fica fora | Quando entra |
|---|---|---|
| Diagnóstico financeiro completo | Sprint 4 (Doc 12 §11) | Sprint 4 |
| Financiamento Imobiliário/Veículo | Sprint 4/5 (Doc 12 §11/§12) | Sprint 4/5 |
| Persistência de cenários | Sprint 9 (Doc 12 §16) | Sprint 9 |
| Exportação PDF/Excel | Sprint 8 (Doc 12 §15) | Sprint 8 |
| Casos PR-03..PR-10 e SAC-03..SAC-10 | Doc 15 §5/§6 declara apenas PR-01/PR-02 e SAC-01/SAC-02 hoje. Doc 19 referencia PR-01..PR-10 / SAC-01..SAC-10 mas o material da massa não está expandido. Expansão é doc-only e fica para Sprint 3+ via Adendo ao Doc 15. | Sprints subsequentes / Adendo |
| Lint pedagógico completo (Doc 08 §20) | Sprint 7 (roadmap), conforme contexto §5 P7 | Sprint 7 |
| Conteúdo Nível 3 | Pós-MVP; contexto §5 P4 | Pós-MVP |
| FAQ inicial (Doc 08 §18) | Sprint 3 STRETCH ou P-Refino — incluído como STRETCH §3.4 | STRETCH desta sprint |
| E2E Playwright completo de `/amortizacao` | Depende de infra estável de visual testing | P-Refino |
| Cache HTTP nos endpoints de amortização | `Cache-Control: no-store` por Doc 06 §12 (resultado depende de payload). Não introduzir cache. | — |
| Persistência em DB de simulações | `idempotency_keys` table existe na Sprint 1, mas nenhuma persistência funcional de simulações nesta sprint | Sprint 9 |

### 3.3 Não-objetivos explícitos

- **Não** refatorar o contrato-base (envelope, RFC 7807, pagination, idempotency); herdado da Sprint 1 e **não tocado**.
- **Não** introduzir novo ADR arquitetural além de **ADR-NNNN do Impact Agent** (CONDICIONAL §3.4); se outro tema exigir ADR, plano é **interrompido** e retorna a revisão.
- **Não** fazer deploy em HML/PROD — Sprint 3 encerra com `main` verde + artefatos completos; deploy fica fora desta sprint.
- **Não** alterar Docs baseline (01, 03, 11, 21). Necessidade real → Adendo / ADR formal, fora das fatias.
- **Não** alterar `docs/operacional/backlog_operacional_acompanhamento.xlsx` pela sessão de chat — atualização da planilha é responsabilidade do PO/ChatGPT (PLANO Sprint 2 §7 lista de proibidos).

### 3.4 Classificação CORE × STRETCH × CONDICIONAL (fronteira de fechamento)

Esta classificação existe para permitir fechamento honrado da Sprint 3 sob pressão de tempo/risco **sem sacrificar o essencial**. Itens STRETCH e CONDICIONAL são **explicitamente desligáveis** sem reprovar a sprint, sujeitos às três condições cumulativas da regra de ouro do kill-switch (PLANO Sprint 2 §3.4 / §9 critério C13).

| Categoria | Item | Justificativa | Kill-switch |
|---|---|---|---|
| **CORE** | Domínio `amortization.price` + `amortization.sac` (F2) com unit tests cobrindo PR-01/PR-02 e SAC-01/SAC-02 | Razão-de-ser da sprint (motor matemático). | Nenhum — sem isto, sprint reprovada. |
| **CORE** | Schemas + Service + Endpoints `POST /api/v1/amortization/{price,sac,compare}` (F3) com integration + contract tests | Contrato público do motor; sem isto, FE não tem o que consumir. | Nenhum. |
| **CORE** | Página `/amortizacao` real (F4) com formulário + resultado (summary + tabela + gráfico + interpretação + alertas) e estados `loading/empty/error/success` ativos | Materialização das HU-014..HU-017. | Nenhum. |
| **CORE** | Docs vivas mínimas: Doc 06 (exemplos das 3 rotas), Doc 19 (RF-AMO-001/002 → done com caminhos reais), `_meta/living_docs.json` (bump `updated_at` + notas) | Rastreabilidade exigida (POLÍTICA DE SINCRONIZAÇÃO). | Nenhum. |
| **CORE** | Artefatos `docs/sprints/sprint-03/{00-plano/PLANO_EXECUCAO_SPRINT_3.md, relatorio-execucao.md, relatorio-forense.md, validacao-oficial.md}` + planilha operacional atualizada com aviso explícito do chat | Rastreabilidade operacional exigida. | Nenhum. |
| **CORE** | Axe-core verde em `/amortizacao` (sem `serious`/`critical`) | A11y é trilho ético/legal não-negociável. | Nenhum. |
| **CORE** | `main` verde em CI ao fim de cada PR de fatia + smoke pós-fechamento + 30 min de observação sem regressão | Invariante do trunk-based. | Nenhum. |
| **CORE** | Conteúdo educacional **nível 1** (4 blocos amortização) revisado editorialmente; lint pedagógico verde nos textos entregues | Coerência editorial-matemática; lição S2 #1 (conteúdo invisível). | Nenhum. |
| **CORE** | Materializar `backend/tests/regression/pedagogical/test_interest.py` (débito Sprint 2 P2) | Pendência herdada com destino concreto definido no contexto §5. | Nenhum — débito declarado vence nesta sprint. |
| **STRETCH** | Property-based estendido (`max_examples` alto) + diff de 100 cenários adicionais em `backend/tests/fixtures/financial_cases.json` para PR/SAC (F2) | Reforça confiança; pode ir para job semanal off-peak sem comprometer correção. | Reduzir `max_examples` no CI regular; mover pesado para semanal; declarar em relatório. |
| **STRETCH** | **Mutation ≥ 80%** em `backend/app/domain/amortization/` | Meta de qualidade; não bloqueia fechamento se reportada abaixo, **desde que** declarada como pendência para P-Refino. | Reportar número real; se < 80%, documentar e manter gate como alvo. |
| **STRETCH** | Snapshot visual Playwright em `/amortizacao` (1 viewport) | Valor alto, infra dependente. | Se runner falhar por infra, snapshot de componente (JSX) e declarar pendência. |
| **STRETCH** | Conteúdo pedagógico **nível 2** (4 blocos N2) | N1 é CORE; N2 pode concluir em P-Refino. | Se F5 atrasar, N2 fica como sub-PR pós-fechamento curto. |
| **STRETCH** | Docs 08 (textos N1/N2 e glossário expandido), 09 (massa F4 confirmada para amortização), 15 (cross-links de PR-01/02 e SAC-01/02 marcados como exercidos) | Desejáveis para coerência editorial-matemática; não bloqueiam motor. | Se F5 apertar, Doc 08 N2 e Doc 15 cross-links podem ficar como PR pós-fechamento. |
| **STRETCH** | FAQ inicial (Doc 08 §18) — débito Sprint 2 P6 | Desejável; pode P-Refino. | Se F5 apertar, ficar como pendência declarada. |
| **STRETCH** | Glossário ≥ 25 termos do MVP (Doc 08 §18) — débito Sprint 2 P5 | Crescimento por módulo; Sprint 3 contribui com termos de amortização. | Sprint 3 entrega só os termos novos; meta ≥ 25 fica para módulos seguintes. |
| **CONDICIONAL** | **ADR-NNNN — Impact Agent: avaliação de promoção `advisory → blocking`** | Governança herdada como P1 do contexto §5; depende de leitura literal de advisories das PRs S2 (insumo do operador). | **Default kill-switch acionado:** se gatilhos do PLANO Sprint 2 §5.6 ação 1 não forem cumulativamente verdadeiros, ADR registra **decisão de adiamento** com destino (Sprint 4+/P-Refino). ADR é entregue **sempre** — só a decisão final (promover ou adiar) varia. |
| **CONDICIONAL** | Implementação técnica do `--mode blocking` em `scripts/impact_analysis_guard.py` + remoção do `continue-on-error: true` em `.github/workflows/ci.yml` (ou no workflow do agente) | Só executa **se** ADR-NNNN aprovar promoção. | Se ADR adiar, esta ação é desligada e migra para sprint futura. |
| **CONDICIONAL** | Responsividade mobile (375) verificada em `/amortizacao` — débito S2 P10 | Desejável; não-requisito MVP. | Reportar o que funciona; pendências viram tickets para P-Refino. |

**Regra de ouro do kill-switch (mantida da Sprint 2 §3.4):** se um item STRETCH ou CONDICIONAL ameaçar fechamento, é **explicitamente desligado** na PR da fatia correspondente, com nota em `docs/sprints/sprint-03/evidencias/` explicando **o que foi desligado, por quê, e para onde foi endereçado**. Silêncio sobre desligamento = residual oculto = falha de governança = reprovação na forense.

---

## 4. Macroestratégia

### 4.1 Princípios invioláveis (herdados da Sprint 2 §4.1)

1. **Modelo de branch/PR — único e explícito: branch-por-fatia derivada de `main`.**
   - Cada fatia F1–F6 cria sua própria branch a partir de `origin/main` **já atualizado no momento da abertura**, nomeada `sprint-3/fN-<slug>`: `sprint-3/f1-preveo`, `sprint-3/f2-dominio`, `sprint-3/f3-api`, `sprint-3/f4-frontend`, `sprint-3/f5-conteudo-docs-vivos`, `sprint-3/f6-fechamento-governanca`.
   - **Não existe branch-mãe `sprint-3` persistente.** Nada é acumulado em branch de integração.
   - **Cada PR é squash-merge em `main`**, uma por fatia. Seis PRs no total (F1–F6). Sem PR agregador final.
   - **Rollback é sempre `git revert <sha-do-squash>` em `main`**, fatia por fatia, em ordem inversa se necessário.
   - Próxima fatia só abre **após o merge da anterior**; nova branch sai de `main` com o merge da fatia anterior já incluído.
2. **PR atômica por fatia** (squash-merge direto em `main`). Seis PRs (F1–F6) com DoD da categoria cumprido integralmente.
3. **Commits atômicos por camada** dentro de cada branch-de-fatia, em ordem: `backend → frontend → docs → CI/governança`. Nenhum commit mistura camadas.
4. **Evidências imutáveis** em `docs/sprints/sprint-03/evidencias/` — saídas reais de comandos (logs, SHAs, números de cobertura, diffs de OpenAPI), não descrições.
5. **Bloco IMPACTO DOCUMENTAL obrigatório em cada PR** — lista docs vivos tocados, artefatos de sprint atualizados, e menção explícita à atualização da planilha.
6. **Nada é entregue com residual vermelho admitido em item CORE.** Gate quebrado → fatia volta e conserta antes do merge.
7. **Posição forense** — toda alteração é justificada por documento canônico; toda divergência é declarada antes de ser corrigida (Fato/Inferência/Limitação rotulados).

### 4.2 Ordem das fatias

```
F1 (Pré-voo + ADR Impact Agent — CONDICIONAL) → F2 (Domínio PRICE+SAC + débito P2) → F3 (Service + Endpoints + Integ/Contrato) → F4 (Frontend /amortizacao + a11y) → F5 (Conteúdo + Docs vivos) → F6 (Fechamento + Governança)
```

**Por que essa ordem.** Backend é fonte de verdade matemática (Doc 09 §6). FE só é construído depois que a API está contratualmente fechada (evita retrabalho). Conteúdo pedagógico vem após o comportamento existir (evita textos descrevendo algo que mudou). Governança final consolida e fecha; ADR do Impact Agent **vem na F1** porque é pendência herdada P1 do contexto §5 e o Prompt §6 da continuação reforça que "a primeira coisa da Sprint 3 deveria ser uma decisão sobre P1 antes de qualquer outra fatia".

### 4.3 Prefixo de commit-messages (Conventional Commits PT-BR, padrão Sprint 1/2)

- Backend: `feat(sprint-03/backend): ...` (ou `feat(amortization): ...` para escopo de domínio puro)
- Frontend: `feat(sprint-03/frontend): ...`
- Docs: `docs(sprint-03): ...`
- CI/Governança: `ci(sprint-03): ...` ou `chore(sprint-03/governance): ...`
- Testes: `test(sprint-03): ...`
- ADR: `docs(adr): ADR-NNNN — Impact Agent: avaliação de promoção`

### 4.4 Protocolo de Fase 0 (vinculante por fatia, executado pelo operador no WSL)

```bash
cd ~/workspace/Plataforma_Educacional_Financeira    # WSL Ubuntu (caminho oficial — contexto §11)
git fetch origin --prune
git status -sb
git branch --show-current
git rev-parse --short HEAD
git rev-parse --short origin/main
git log --oneline --decorate -5
```

**Critério de parada:** branch / HEAD / origin/main / working tree limpa **todos verdes** com o esperado da fatia. Caso contrário, parar e relatar.

Para a primeira fatia da Sprint 3, **commit-base esperado = `840cbcb`** (`main` pós-Sprint 2). Saída literal salva em `docs/sprints/sprint-03/evidencias/F1-base-branch.md`.

Sandbox de chat **não executa** Fase 0 oficial (limitação §2.5). A leitura por SHA explícito (`git show 840cbcb:<path>`) substitui pacotes de leitura, mas **não substitui** o gate de Fase 0 do operador.

---

## 5. Fatias de execução

> Cada fatia abaixo declara: **Objetivo · Pré-condições · Decisões arquiteturais (quando aplicável) · Ações · Arquivos afetados · DoR da categoria · DoD da categoria · Evidências exigidas · Riscos específicos**.

### 5.1 Fatia F1 — Pré-voo + ADR Impact Agent (CONDICIONAL)

**Objetivo.** Provar, antes de qualquer commit de código-novo, que `main` está verde, repositório limpo, e pré-condições da Sprint 3 satisfeitas. Materializar o **plano da Sprint 3** no repo (este arquivo). Materializar **ADR-NNNN — Impact Agent: avaliação de promoção** registrando a decisão (promover ou adiar) com base nos gatilhos do PLANO Sprint 2 §5.6 ação 1.

**Pré-condições.** Aprovação deste plano pelo PO.

**Decisões arquiteturais.**
- ADR-NNNN é **doc-only** nesta F1, **independente** da decisão. Se ADR aprovar promoção, a alteração técnica (`scripts/impact_analysis_guard.py --mode blocking` + workflow CI) fica para sub-fatia separada (F1.b ou F6) com prova de bloqueio funcionando.
- Numeração da ADR: próxima sequencial após `docs/adr/ADR-001-impact-agent.md` — provavelmente **ADR-002** (a confirmar via `ls docs/adr/` na F1).

**Ações.**
1. Operador executa Fase 0 canônica (§4.4); saída em `docs/sprints/sprint-03/evidencias/F1-base-branch.md`.
2. Operador roda `bash scripts/pipeline.sh` em `main` puro e anexa em `docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md`. **Regra-dura:** se `main` não estiver verde, Sprint 3 não inicia.
3. Confirmar modo atual do Impact Agent lendo `scripts/impact_analysis_guard.py` e `.github/workflows/impact-agent.yml` (esperado: `advisory`, `continue-on-error: true`). Registrar em `docs/sprints/sprint-03/evidencias/F1-impact-agent-estado-inicial.md`.
4. Coletar leitura literal dos comentários de advisory das PRs Sprint 2 (#5, #6, #7, #8, #9, #10, #11) — contagem de bloqueios espúrios, classificação de fricção. Operador faz a coleta no GitHub e anexa em `docs/sprints/sprint-03/evidencias/F1-advisories-sprint2-leitura.md`. Esta é a fonte do gatilho `(a)` do PLANO Sprint 2 §5.6.
5. Confirmar com o PO: gatilho `(b)` (sprint dentro do budget — F1 ainda não iniciou, então só pode ser confirmado **depois** da F5; consequência: ADR-NNNN da F1 registra **decisão preliminar** com revisão obrigatória na F6); gatilho `(c)` (aprovação explícita do PO). Registrar em `docs/sprints/sprint-03/evidencias/F1-decisao-impact-agent.md`.
6. Materializar este plano em `docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md`.
7. Materializar ADR-NNNN em `docs/adr/ADR-NNNN-impact-agent-promocao.md` com a decisão (promover ou adiar) e justificativa baseada na leitura literal dos advisories. Se decisão for **adiar**: ADR registra destino concreto (Sprint 4 / P-Refino) e fica nesse estado. Se decisão for **promover**: ADR registra plano de dry-run em PR sintética violadora + rota de escape (override de mantenedor com log).
8. Atualizar `docs/_meta/living_docs.json` com inclusão dos novos artefatos da Sprint 3.
9. Atualizar planilha operacional (responsabilidade do PO/ChatGPT) com aviso "Sprint 3 — F1 aberta, plano em revisão" + "Sprint 3 — F1 mergeada via PR #NN" após o merge.
10. Abrir **PR F1 → `main`** (squash-merge), contendo apenas:
    - este `docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md`;
    - `docs/adr/ADR-NNNN-impact-agent-promocao.md`;
    - 4 evidências da F1 (`F1-base-branch.md`, `F1-main-verify-baseline.md`, `F1-impact-agent-estado-inicial.md`, `F1-advisories-sprint2-leitura.md`, `F1-decisao-impact-agent.md`, `F1-staging-proof.md`);
    - atualização de `docs/_meta/living_docs.json`.

**Arquivos afetados (F1).**
- `docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md` (novo)
- `docs/adr/ADR-NNNN-impact-agent-promocao.md` (novo — número definido na F1)
- `docs/sprints/sprint-03/evidencias/F1-base-branch.md` (novo)
- `docs/sprints/sprint-03/evidencias/F1-main-verify-baseline.md` (novo)
- `docs/sprints/sprint-03/evidencias/F1-impact-agent-estado-inicial.md` (novo)
- `docs/sprints/sprint-03/evidencias/F1-advisories-sprint2-leitura.md` (novo)
- `docs/sprints/sprint-03/evidencias/F1-decisao-impact-agent.md` (novo)
- `docs/sprints/sprint-03/evidencias/F1-staging-proof.md` (novo — protocolo §8.6 do PLANO Sprint 2)
- `docs/_meta/living_docs.json` (atualização incremental)
- Planilha operacional (atualização — responsabilidade do PO; não tocada pelo chat)

**DoR (Infra/Governança + Geral, Doc 12 §3.1/§3.7).** §2.2, §2.3, §2.4 satisfeitos; plano revisado pelo PO; vinculação a RF-AMO-001/002 no Doc 19 (linhas já existentes; só serão promovidas a `done` na F5); impacto em contrato declarado (não aplicável nesta F1 — doc-only).

**DoD (Infra/Governança + Geral, Doc 12 §4.7).**
- `main` verde (`main-verify-baseline` anexado);
- ADR-NNNN materializada com decisão clara (promover ou adiar) + justificativa baseada em leitura literal de advisories;
- **PR da F1 squash-merged em `main`** (branch `sprint-3/f1-preveo` descartada após merge);
- planilha atualizada com aviso do chat (responsabilidade do PO);
- CI verde na PR da F1;
- Impact Agent **continua em `advisory`** durante toda a F1 (ADR doc-only não muda comportamento; mudança técnica fica para sub-fatia se decisão for promover).

**Evidências exigidas.** Os 6 sub-arquivos acima + URL da PR da F1 + screenshot/JSON do verde do CI.

**Riscos específicos.**
- `main` não verde no início → Sprint 3 em espera até saneamento (não iniciar).
- Impact Agent já em modo inesperado (`blocking` prematuro descoberto na leitura) → não é ruim per se, mas precisa ser registrado como Fato e tratado no ADR antes de avançar.
- Coleta de advisories da Sprint 2 trazer fricção alta inesperada → ADR pode adiar promoção; sprint segue normalmente.

---

### 5.2 Fatia F2 — Domínio Amortização (PRICE + SAC) + débito P2 (regression pedagogical)

**Objetivo.** Materializar o **motor matemático puro** de PRICE e SAC, com testes unitários contra Doc 15 PR-01/PR-02 e SAC-01/SAC-02, property-based mínima, e diff de cenários adicionais. Materializar `backend/tests/regression/pedagogical/test_interest.py` (débito P2 herdado da Sprint 2 — destino concreto declarado no contexto §5).

**Pré-condições.** F1 merged.

**Decisões arquiteturais.**
- Domínio é **função pura** — sem IO, sem `datetime.now()`, sem log, sem `print`. Grep negativo em PR (`open|requests|datetime\.now|print|logging` em `backend/app/domain/amortization/`) é parte do DoD.
- Tipagem de moeda: `Decimal` (Python), `ROUND_HALF_EVEN`, precisão interna alta (≥ 28 dígitos), exibição 2 casas (Doc 09 §12.2; Doc 04). Reuso do `_rounding.py` do módulo Juros se aderente; caso contrário, criar `backend/app/domain/amortization/_common.py`.
- Assinatura conceitual (a confirmar/refinar na implementação):
  - `calcular_price(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> PriceResultado`
  - `calcular_sac(principal: Decimal, taxa_periodo: Decimal, n_periodos: int) -> SacResultado`
- `PriceResultado` e `SacResultado` são dataclasses (ou Pydantic internos do domínio) com:
  - `parcela` (Decimal — única para PRICE; lista para SAC);
  - `total_pago` (Decimal);
  - `total_juros` (Decimal);
  - `tabela_periodo` (lista imutável de dict com `periodo, saldo_inicial, juros, amortizacao, parcela, saldo_final`);
  - `saldo_final` (Decimal — esperado próximo de zero para n × amortização ≥ principal).
- **Periodicidade da taxa** declarada no service (não no domínio puro). Domínio recebe **taxa por período** já normalizada; converter anual ↔ mensal acontece na borda do service (Doc 03 §6).
- Propriedades invariantes para property-based:
  - PRICE: parcela constante: `parcela_i == parcela_j` para todo `i, j ∈ [1..n]` (com tolerância de Decimal).
  - PRICE estrutural: `juros_periodo[1] > juros_periodo[n]`; `amortizacao_periodo[1] < amortizacao_periodo[n]` (PR-02 do Doc 15).
  - SAC: amortização constante: `amortizacao_periodo[i] == principal/n` para todo `i` (com tolerância).
  - SAC estrutural: `parcela_periodo[1] > parcela_periodo[n]`.
  - Comparativo: para mesma `(principal, taxa, n)` com taxa > 0 e n > 1: `total_juros_sac < total_juros_price`. (SAC-02 do Doc 15.)
  - Saldo final: `tabela[-1].saldo_final ≈ 0` (com tolerância apropriada).
  - Tabela: `len(tabela) == n_periodos`.
- Rejeitos via exceção de domínio: `DomainValidationError` (n ≤ 0, principal < 0, taxa < 0).

**Ações.**
1. Criar módulo `backend/app/domain/amortization/__init__.py` (já existe vazio — pode receber export controlado) + `price.py` + `sac.py` + (se necessário) `_common.py`.
2. Unit tests:
   - `backend/tests/unit/domain/amortization/__init__.py` (novo)
   - `backend/tests/unit/domain/amortization/test_price.py` exercendo **PR-01 e PR-02** (Doc 15 §5).
   - `backend/tests/unit/domain/amortization/test_sac.py` exercendo **SAC-01 e SAC-02** (Doc 15 §6), incluindo comparação SAC vs PRICE.
   - `backend/tests/unit/domain/amortization/test_properties.py` com Hypothesis — propriedades acima.
3. Massa de validação: ampliar `backend/tests/fixtures/financial_cases.json` (já criado na Sprint 2) com seção `amortization` cobrindo PR-01/PR-02 + SAC-01/SAC-02 + (STRETCH) ≥ 30 cenários canônicos adicionais derivados de grade `(taxa ∈ {0.005, 0.01, 0.02, 0.03}, n ∈ {6, 12, 24, 60, 120, 360}, principal ∈ {10000, 100000, 240000})`.
4. **Débito P2 (Sprint 2):** materializar `backend/tests/regression/pedagogical/test_interest.py` cobrindo presença de blocos `summary/tables/charts/interpretation/alerts` no payload do service de juros (compose), sem regressão em texto pedagógico.
5. Atualizar `docs/_meta/living_docs.json` com novos módulos de domínio.

**Arquivos afetados (F2).**
- `backend/app/domain/amortization/__init__.py` (atualizado)
- `backend/app/domain/amortization/price.py` (novo)
- `backend/app/domain/amortization/sac.py` (novo)
- `backend/app/domain/amortization/_common.py` (novo, opcional — alternativa: reuso de `interest/_rounding.py`)
- `backend/tests/unit/domain/amortization/__init__.py` (novo)
- `backend/tests/unit/domain/amortization/test_price.py` (novo)
- `backend/tests/unit/domain/amortization/test_sac.py` (novo)
- `backend/tests/unit/domain/amortization/test_properties.py` (novo)
- `backend/tests/fixtures/financial_cases.json` (ampliado — seção `amortization`)
- `backend/tests/regression/pedagogical/__init__.py` (novo)
- `backend/tests/regression/pedagogical/test_interest.py` (novo — débito Sprint 2 P2)
- `docs/sprints/sprint-03/evidencias/F2-domain-coverage.md` (novo — saída de cobertura)
- `docs/sprints/sprint-03/evidencias/F2-domain-diff-cenarios.md` (novo — saída do diff de cenários)
- `docs/sprints/sprint-03/evidencias/F2-mutation-report.md` (novo — STRETCH; saída de `mutmut` se rodado)
- `docs/sprints/sprint-03/evidencias/F2-grep-pureza-dominio.md` (novo — grep negativo provando ausência de `open|requests|datetime\.now|print|logging`)
- `docs/sprints/sprint-03/evidencias/F2-staging-proof.md` (novo — protocolo §8.6 PLANO S2)

**DoR (Backend-domínio, Doc 12 §3.4).** Referência explícita a Doc 03 §10/§11 (regras matemáticas) e Doc 15 §5/§6 (casos PR-* e SAC-*). Vinculação a RF-AMO-001 e RF-AMO-002 no Doc 19 (linhas já existentes — só status muda na F5).

**DoD (Backend-domínio, Doc 12 §4.4).**
- testes verdes contra PR-01, PR-02, SAC-01, SAC-02;
- propriedades Hypothesis verdes com `max_examples ≥ 100`;
- diff de cenários ampliado anexado à PR (mínimo PR-01/02 + SAC-01/02 + propriedades; STRETCH ≥ 30 cenários);
- cobertura `backend/app/domain/amortization/` ≥ **95% linhas / 90% branches**;
- mutação em `backend/app/domain/amortization/` reportada (STRETCH ≥ 80%);
- nenhum IO no módulo de domínio (grep negativo confirmando);
- lint/format/typecheck verdes;
- débito P2 materializado: `backend/tests/regression/pedagogical/test_interest.py` presente e verde no `pytest tests/regression -m regression`.

**Evidências exigidas.** Saídas acima + URL da PR + SHA do squash-merge em `main`.

**Riscos específicos.**
- Arredondamento HALF_EVEN vs HALF_UP em bordas → isolar política (`_common.py` ou `_rounding.py`); testar bordas.
- Hypothesis pesado em CI → limitar `max_examples` para job regular; mover pesado para semanal (PLANO Sprint 2 R3).
- Saldo final ficar > tolerância em PR-01 → revisar fórmula de arredondamento; documentar tolerância usada.

---

### 5.3 Fatia F3 — Service + Endpoints REST + Integração + Contrato

**Objetivo.** Expor o domínio da F2 pela API v1 nos 3 endpoints canônicos (Doc 06 §15.4), montar o payload pedagógico canônico (`summary/tables/charts/interpretation/alerts`), e validar por testes de integração e contrato.

**Pré-condições.** F2 merged. `make test-contract` herdado da Sprint 1.

**Decisões arquiteturais.**
- **Schemas (BE-011)** em `backend/app/schemas/amortization/`:
  - `base.py` — `AmortizationInBase` (campos comuns: `principal_amount`, `interest_rate`, `interest_rate_period`, `term_months`); `AmortizationRowItem` (linha de tabela período); enum `RatePeriod = MONTHLY|YEARLY` (espelha Doc 06 §3.6 + §16.2).
  - `price.py` — `PriceIn` (extends `AmortizationInBase`), `PriceOut` (com `summary`, `tables`, `charts`, `interpretation`, `alerts`).
  - `sac.py` — `SacIn`, `SacOut` (mesma estrutura).
  - `compare.py` — `CompareAmortizationIn`, `CompareAmortizationOut` (com seção comparativa).
- Pydantic v2 estrito; valores monetários como `Decimal` em código + serialização como **string** (Doc 06 §3.5; lição Sprint 2 #9).
- Validações: `principal_amount > 0`; `interest_rate ≥ 0`; `term_months ≥ 1`; `interest_rate_period` em enum `MONTHLY|YEARLY`. Conversão de taxa anual → mensal **acontece no service** (não no schema), conforme Doc 03 §6.
- **Service (BE-014)** em `backend/app/services/amortization/`:
  - `calcular_amortizacao_service.py` — funções `calcular_price`, `calcular_sac`, `comparar_price_sac`. Cada função:
    1. valida entrada (delegada ao Pydantic, não duplicar);
    2. normaliza taxa para período (mensal);
    3. delega ao domínio puro (F2);
    4. monta `summary` (5–7 métricas: `principal`, `total_pago`, `total_juros`, `parcela_inicial`, `parcela_final`, `n_periodos`);
    5. monta `tables` (tabela período conforme Doc 07 §15);
    6. monta `charts` (composição parcela = juros + amortização ao longo do tempo; saldo devedor decrescente);
    7. monta `interpretation` (texto pedagógico determinístico — F5 enriquece);
    8. monta `alerts` (níveis `info|success|warning|danger` conforme Doc 07 §17 / Doc 06 §4.3).
  - **Service magro / domínio grosso.** Grep-check de `for` loop aritmético em service é red-flag — fórmulas só no domínio.
- **Endpoint (BE-015)** em `backend/app/api/v1/amortization.py`:
  - `POST /api/v1/amortization/price`
  - `POST /api/v1/amortization/sac`
  - `POST /api/v1/amortization/compare`
  - Erros via `DomainError` → handler global Sprint 1 → `Problem+json` RFC 7807 (Doc 06 §4.2; sem duplicar tratamento).
  - **Idempotency-Key** declarado (header opcional) por consistência com Doc 06 §9.
  - Log estruturado com `request_id` em cada endpoint; métrica `amortizacao_calculos_total{tipo=price|sac|compare}` (Doc 09 §12.6; Doc 23).
- **Router** atualizado em `backend/app/api/v1/router.py` para incluir `amortization.router`.
- **OpenAPI** regenerado via `python scripts/export_openapi.py`; diff anexado em `evidencias/F3-openapi-diff.md`. **Atenção (v1.1):** o diff esperado **não é** apenas amortização — `docs/api/openapi.json` em `840cbcb` ainda contém apenas os 4 paths da Sprint 1 (juros nunca foram persistidos no JSON versionado, ver §2.2 Fato sobre divergência forense × estado real). A F3 desta sprint deve regenerar do zero e o diff resultante incluirá: (a) os 3 endpoints novos de amortização **e** (b) catch-up dos 3 endpoints de juros + schemas de juros que ficaram fora do JSON versionado da Sprint 2. Declarar honestamente o catch-up no `F3-openapi-diff.md`.

**Ações.**
1. Criar schemas Pydantic + validações (entrega CORE).
2. Criar service com unit tests próprios (sem FastAPI) — validação de composição `summary/tables/charts/interpretation/alerts`.
3. Criar endpoints + registrar em router v1.
4. Integration tests em `backend/tests/integration/api/amortization/`:
   - `test_price.py` — happy path PR-01;
   - `test_sac.py` — happy path SAC-01;
   - `test_compare.py` — `/compare` devolvendo SAC vs PRICE com SAC-02 sendo verdade;
   - `test_errors.py` — rejeição com `n=0`, `principal<0`, `taxa<0`, enum inválido (todos retornam 422 `VALIDATION_ERROR` ou 400 `BUSINESS_RULE_ERROR`).
5. Contract tests em `backend/tests/contract/test_amortization.py` — schemathesis sobre OpenAPI; verifica envelope canônico e RFC 7807.
6. Atualizar `docs/06_API_e_Contratos.md` §15.4 com exemplos request/response coerentes (linhas 211–213 já listam as rotas; falta o exemplo análogo a §16.3 para juros).
7. Atualizar `docs/19_Matriz_Rastreabilidade.md` linhas RF-AMO-001/002 com caminhos novos (status muda para `done` apenas na F5 quando FE consumir).
8. Anexar diff de OpenAPI em `evidencias/F3-openapi-diff.md`.

**Arquivos afetados (F3).**
- `backend/app/schemas/amortization/__init__.py` (atualizado)
- `backend/app/schemas/amortization/base.py` (novo)
- `backend/app/schemas/amortization/price.py` (novo)
- `backend/app/schemas/amortization/sac.py` (novo)
- `backend/app/schemas/amortization/compare.py` (novo)
- `backend/app/services/amortization/__init__.py` (atualizado)
- `backend/app/services/amortization/calcular_amortizacao_service.py` (novo)
- `backend/app/api/v1/amortization.py` (novo)
- `backend/app/api/v1/router.py` (atualização: inclusão de `amortization.router`)
- `backend/tests/unit/services/amortization/__init__.py` (novo)
- `backend/tests/unit/services/amortization/test_calcular_amortizacao_service.py` (novo)
- `backend/tests/integration/api/amortization/__init__.py` (novo)
- `backend/tests/integration/api/amortization/test_price.py` (novo)
- `backend/tests/integration/api/amortization/test_sac.py` (novo)
- `backend/tests/integration/api/amortization/test_compare.py` (novo)
- `backend/tests/integration/api/amortization/test_errors.py` (novo)
- `backend/tests/contract/test_amortization.py` (novo)
- `docs/06_API_e_Contratos.md` (atualização — exemplos request/response amortização)
- `docs/19_Matriz_Rastreabilidade.md` (atualização — caminhos RF-AMO-001/002)
- `docs/sprints/sprint-03/evidencias/F3-openapi-diff.md` (novo)
- `docs/sprints/sprint-03/evidencias/F3-api-coverage.md` (novo)
- `docs/sprints/sprint-03/evidencias/F3-staging-proof.md` (novo)

**DoR (Backend-rota nova, Doc 12 §3.3).** Payload in/out definidos (§5.3 deste plano); categoria de erro mapeada (DomainValidationError → 422 `VALIDATION_ERROR`; regra de negócio → 400 `BUSINESS_RULE_ERROR`); impacto em OpenAPI declarado (3 rotas novas).

**DoD (Backend-rota nova, Doc 12 §4.3).**
- OpenAPI runtime atualizado + diff anexado;
- contract test verde (schemathesis);
- log + métrica + correlação implementados;
- `Idempotency-Key` suportado nas 3 rotas (header opcional, propagado ao log);
- cobertura `backend/app/services/amortization/` ≥ 90/85; `backend/app/api/v1/amortization.py` ≥ 85/80;
- Doc 06 e Doc 19 atualizados **na mesma PR**.

**Evidências exigidas.** Saídas acima + URL da PR + SHA do merge.

**Riscos específicos.**
- Serialização de `Decimal` como string vs number divergente entre `Price` e `Sac` → fixar convenção única no envelope e cobrir por contract test (lição Sprint 2 #9).
- Lógica vazando do domínio para service → manter service magro.
- Composição do `summary` no `/compare` ficar ambígua (qual lado é "base" da diferença?) → padronizar `compare.summary.diferencas = SAC - PRICE` (juros menores em SAC) e documentar no Doc 06 + interpretation.

---

### 5.4 Fatia F4 — Frontend `/amortizacao` + component tests + a11y + (STRETCH) snapshot visual

**Objetivo.** Entregar a página `/amortizacao` real (substituindo o placeholder `<ModulePage />` atual) com tabs (PRICE / SAC / Comparar), formulário, resultado, tabela período, gráfico, interpretação e alertas, obedecendo Doc 07 §9 e §21.

**Pré-condições.** F3 merged. API fechada contratualmente.

**Decisões arquiteturais.**
- Rota: `frontend/src/app/(app)/amortizacao/page.tsx` — substituir o `<ModulePage moduleId="amortizacao" />` atual por componente real.
- **Estrutura de componentes** seguindo padrão de `frontend/src/components/interest/` da Sprint 2:
  - `frontend/src/components/amortization/AmortizacaoTabs.tsx` (tabs WAI-ARIA — análogo a `JurosTabs.tsx`)
  - `frontend/src/components/amortization/PriceForm.tsx`
  - `frontend/src/components/amortization/SacForm.tsx`
  - `frontend/src/components/amortization/CompararAmortizacaoForm.tsx`
  - `frontend/src/components/amortization/PricePanel.tsx`
  - `frontend/src/components/amortization/SacPanel.tsx`
  - `frontend/src/components/amortization/CompararAmortizacaoPanel.tsx`
  - `frontend/src/components/amortization/AmortizacaoTabela.tsx` (tabela período — paginada se `n > 24`)
  - `frontend/src/components/amortization/EvolucaoSaldoChart.tsx` (recharts; saldo devedor + composição parcela)
  - `frontend/src/components/amortization/AmortizacaoAlerts.tsx`
  - `frontend/src/components/amortization/AmortizacaoInterpretation.tsx`
  - `frontend/src/components/amortization/AmortizacaoSimulationState.ts` (estado da simulação — análogo a `JurosSimulationState.ts`)
  - `frontend/src/components/amortization/formValidation.ts`
  - `frontend/src/components/amortization/index.ts`
- **Reuso vs duplicação:** componentes neutros já criados na Sprint 2 podem ser reusados onde cabe — `SummaryCard` (`frontend/src/components/ui/SummaryCard.tsx`), `SummaryGrid` (em `interest/`, mas neutro), `LoadingState/EmptyState/ErrorState`, `EducationPanel`, `AlertBanner`. **Decisão:** se a reutilização exigir refatoração de componentes hoje em `interest/` para `components/finance/` ou `components/shared/`, **registrar como sub-tarefa** com PR separada (preferencialmente F4.b, doc-only de refator) — **não** misturar refator com nova feature na mesma PR (lição Sprint 1/2).
- **Tipos do contrato:** `frontend/src/types/amortization.ts` espelhando os schemas Pydantic da F3.
- **Serviço API:** `frontend/src/services/amortization/amortizationService.ts` (wrapper Axios usando `frontend/src/lib/api/client.ts` herdado).
- **Validação client-side:** alinhada ao contrato, **nunca mais rígida** que o backend (backend é fonte de verdade — Doc 09 §6).
- **Estados** `loading / success / error / empty` ativos via `LoadingState`, `EmptyState`, `ErrorState` da Sprint 1.
- **`exactOptionalPropertyTypes: true`** já é regra no `tsconfig.json` (lição Sprint 2 #7) — nunca passar prop opcional como `undefined` explícito.
- **Sem ciclos em barrel.** `index.ts` da pasta amortization expõe componentes; arquivos internos importam por caminho relativo, **não** via barrel (lição Sprint 2 #6).
- **a11y obrigatório:** axe-core sem `serious`/`critical`. Tabs com `role="tablist"`, `aria-controls`, `aria-selected`. Formulário com labels, mensagens de erro próximas ao campo, navegação por teclado (lição Sprint 2 padrão WAI-ARIA).

**Ações.**
1. Substituir `frontend/src/app/(app)/amortizacao/page.tsx` por componente real renderizando `<AmortizacaoTabs />`.
2. Criar componentes da pasta `components/amortization/` (se reuso de componentes de `interest/` exigir extração para `shared/finance/`, abrir sub-fatia F4.b doc-only de refator antes).
3. Criar `types/amortization.ts` e `services/amortization/`.
4. Tests (Vitest + Testing Library):
   - `frontend/src/__tests__/app/amortizacao.test.tsx` — render, integração, tabs; ganha 5 casos novos na F5 quando o `<AmortizacaoSaibaMais />` for integrado.
   - `frontend/src/__tests__/components/amortization/AmortizacaoTabs.test.tsx` — comportamento WAI-ARIA.
   - `frontend/src/__tests__/components/amortization/PriceForm.test.tsx` — render, validações client-side, submissão feliz, submissão com erro 422.
   - `frontend/src/__tests__/components/amortization/SacForm.test.tsx` — idem.
   - `frontend/src/__tests__/components/amortization/CompararAmortizacaoForm.test.tsx` — idem.
   - `frontend/src/__tests__/components/amortization/PricePanel.test.tsx` — render com payload fixture.
   - `frontend/src/__tests__/components/amortization/SacPanel.test.tsx` — idem.
   - `frontend/src/__tests__/components/amortization/CompararAmortizacaoPanel.test.tsx` — idem; verifica que SAC tem juros menores que PRICE no resumo comparativo.
   - `frontend/src/__tests__/components/amortization/formValidation.test.ts` — invariantes.
   - `frontend/src/__tests__/services/amortization/amortizationService.test.ts` — mock Axios.
5. **STRETCH:** snapshot visual em Playwright em 1 viewport fixa (1280) em `frontend/tests/visual/amortizacao.spec.ts` (kill-switch §3.4 se runner falhar).
6. axe-core obrigatório em `/amortizacao` sem `serious`/`critical`.
7. Verificação de responsividade 375/768/1280 — reportar o que funciona; mobile (375) é CONDICIONAL (P10 herdada).

**Arquivos afetados (F4).**
- `frontend/src/app/(app)/amortizacao/page.tsx` (atualizado — substitui placeholder)
- `frontend/src/components/amortization/{AmortizacaoTabs, PriceForm, SacForm, CompararAmortizacaoForm, PricePanel, SacPanel, CompararAmortizacaoPanel, AmortizacaoTabela, EvolucaoSaldoChart, AmortizacaoAlerts, AmortizacaoInterpretation, AmortizacaoSimulationState, formValidation, index}.tsx|.ts` (novos — 14 arquivos)
- `frontend/src/types/amortization.ts` (novo)
- `frontend/src/services/amortization/index.ts` + `frontend/src/services/amortization/amortizationService.ts` (novos — padrão análogo a `frontend/src/services/interest.ts` + index da Sprint 2; alternativa minimalista: arquivo único `frontend/src/services/amortization.ts` se preferido pela revisão de F4)
- `frontend/src/__tests__/app/amortizacao.test.tsx` (novo)
- `frontend/src/__tests__/components/amortization/*.test.tsx` (≥ 8 arquivos novos)
- `frontend/src/__tests__/services/amortization/amortizationService.test.ts` (novo)
- `frontend/tests/visual/amortizacao.spec.ts` (novo — STRETCH)
- `docs/sprints/sprint-03/evidencias/F4-fe-coverage.md` (novo)
- `docs/sprints/sprint-03/evidencias/F4-axe-report.md` (novo)
- `docs/sprints/sprint-03/evidencias/F4-visual-snapshot.md` (novo — STRETCH; hash + caminho do PNG)
- `docs/sprints/sprint-03/evidencias/F4-staging-proof.md` (novo)

**DoR (Frontend, Doc 12 §3.2).** Mockup/wireframe (referência: Doc 07 §9; Doc 16); estados de UI definidos; responsividade alvo 1280 desktop (mobile 375 declarado como CONDICIONAL).

**DoD (Frontend, Doc 12 §4.2).**
- snapshot visual aceito (1 viewport — STRETCH; substituível por snapshot de componente JSX via Vitest se infra falhar);
- axe-core sem `serious`/`critical`;
- responsividade verificada em 375/768/1280 — reportar o que funciona; mobile (375) pode ficar como pendência declarada;
- estados de UI presentes (`loading / empty / error / success`);
- cobertura `frontend/src/components/amortization/` ≥ 85/80;
- nenhum import circular em barrel `index.ts` (verificação por `pnpm build`).

**Evidências exigidas.** Relatório axe + relatório de cobertura FE + (STRETCH) hash do snapshot + URL da PR.

**Riscos específicos.**
- Divergência entre formatação de moeda FE (locale pt-BR) e resposta do BE (string `"100000.00"`) → padronizar `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'})` na borda; cobrir por teste (lição Sprint 2 R5 / S2).
- Tabela com prazo grande (>120 períodos para imobiliário futuro) → virtualização ou paginação. Default Sprint 3: paginação simples se `n > 24`.
- Reuso de componentes do módulo Juros gerar refator amplo na mesma fatia → **abrir sub-fatia F4.b doc-only** ou postpone refator para P-Refino.

---

### 5.5 Fatia F5 — Conteúdo Educacional + Docs vivos

**Objetivo.** Enriquecer a interpretação pedagógica com conteúdo Nível 1 (CORE) e Nível 2 (STRETCH) para PRICE e SAC; promover RF-AMO-001/002 a `done` no Doc 19; sincronizar todos os documentos vivos tocados ao longo da sprint.

**Pré-condições.** F4 merged. Textos "placeholder semântico vazio" da F4 substituídos.

**Decisões arquiteturais.**
- **Estrutura de conteúdo** seguindo padrão da Sprint 2 em `frontend/src/content/juros/`:
  - `frontend/src/content/amortizacao/types.ts` (reuso de `EducationalContent`/`GlossaryEntry`/`DISCLAIMER_EDUCACIONAL` de `juros/types.ts` — extração para `frontend/src/content/_shared/types.ts` se a duplicação for evidente; **decisão:** sub-fatia F5.b doc-only se necessário; default = duplicar para não embaralhar escopo).
  - `frontend/src/content/amortizacao/index.ts`
  - `frontend/src/content/amortizacao/nivel-1.ts` — 4 blocos N1 (PRICE intuitivo, SAC intuitivo, comparação, quando usar cada um).
  - `frontend/src/content/amortizacao/nivel-2.ts` — 4 blocos N2 (STRETCH; aprofundamento numérico alinhado a PR-01 e SAC-01).
  - `frontend/src/content/amortizacao/glossario.ts` — termos do módulo (parcela, amortização, saldo devedor, sistema PRICE, sistema SAC, juros simples vs compostos no contexto de financiamento, total pago, total de juros).
- **Componente de exibição** `frontend/src/components/amortization/AmortizacaoSaibaMais.tsx` análogo a `JurosSaibaMais.tsx` — reusa `<EducationPanel />`.
- **Integração visível na UI** (lição Sprint 2 #1 — corrige falha da F5 v1): a página `/amortizacao` renderiza, abaixo do `<AmortizacaoTabs />`, uma `<section data-testid="amortizacao-aprenda-mais">` com 4 cards `<AmortizacaoSaibaMais />` cobrindo os temas N1. Teste de integração em `__tests__/app/amortizacao.test.tsx` valida presença na DOM renderizada.
- **Sem placeholder semântico ativo.** Lição Sprint 2 #2 — proibido em doc vivo: `TBD`, `a preencher`, `EXIT real: (TBD)`, `valor futuro`, `resultado futuro`. Se o dado não existe, vai para relatório de chat, não para doc vivo.
- **Coerência texto ↔ número.** Toda afirmação numérica do texto referencia um campo do `summary` por nome (não literal), ou usa exatamente os números canônicos PR-01/SAC-01 (lição Sprint 2 #5 / Doc 08 §6.5).
- **Lint pedagógico** — subset existente (`tools/edu_lint/`) cobre o módulo amortização sem alteração de código (regras já são genéricas: promessa de retorno, moralismo, placeholders, disclaimer ausente).

**Ações.**
1. Conteúdo nível 1 (síntese pedagógica, Doc 08 §6) para PRICE, SAC, comparação, e "quando usar cada um" — 120–200 palavras por bloco.
2. **STRETCH:** Conteúdo nível 2 (aprofundamento) — exemplos numéricos alinhados a PR-01 e SAC-01 para coerência com Doc 15.
3. Glossário do módulo amortização (≥ 8 termos novos).
4. Componente `<AmortizacaoSaibaMais />` + integração visível na rota `/amortizacao` com `data-testid="amortizacao-aprenda-mais"`.
5. Tests novos:
   - `frontend/src/__tests__/content/amortizacao/conteudo.test.ts` — cobertura mínima dos blocos.
   - `frontend/src/__tests__/components/amortization/AmortizacaoSaibaMais.test.tsx`.
   - Reescrita de `frontend/src/__tests__/app/amortizacao.test.tsx` para incluir validação de presença na DOM renderizada (5 casos novos).
6. Revisão editorial humana (Doc 08 §7) registrada em `docs/sprints/sprint-03/evidencias/F5-revisao-editorial.md`.
7. Lint pedagógico verde — `make lint-pedagogical` ou `python -m tools.edu_lint frontend/src/content/amortizacao/`.
8. **Atualização de docs vivos tocados ao longo da sprint:**
   - Doc 06 — exemplos request/response das 3 rotas amortização (já iniciado na F3; F5 fecha com revisão).
   - Doc 08 — §13 (glossário materializado para amortização).
   - Doc 09 §16 — massa F4 amortização confirmada (caminhos exercidos).
   - Doc 15 §5/§6 — marcar PR-01/PR-02 e SAC-01/SAC-02 como **exercidos por código** (cross-link aos testes); declarar honestamente que PR-03..PR-10 e SAC-03..SAC-10 referenciados em Doc 19 ainda **não foram materializados na massa do Doc 15** (sub-pendência declarada — Adendo).
   - Doc 19 — RF-AMO-001 e RF-AMO-002 promovidos `pending → done` com caminhos finais; +§7 histórico Sprint 3.
   - `docs/_meta/living_docs.json` — bump `updated_at` + notas individuais.
   - **Doc 03 — FORA do escopo desta sprint** (decisão binária PLANO Sprint 2 §7.1/§7.2). Se exercício revelar ambiguidade no Doc 03, abrir Adendo formal ou ADR, nunca edit silencioso.
9. **STRETCH (P5/P6 herdados):** ampliar glossário para se aproximar de ≥ 25 termos do MVP; FAQ inicial em Doc 08 §18.
10. Atualização da planilha operacional (responsabilidade do PO) com aviso explícito "Sprint 3 — F5 concluída pelo chat [Sprint 3 / chat atual]".

**Arquivos afetados (F5).**
- `frontend/src/content/amortizacao/types.ts` (novo — ou import de `_shared/`)
- `frontend/src/content/amortizacao/index.ts` (novo)
- `frontend/src/content/amortizacao/nivel-1.ts` (novo — CORE)
- `frontend/src/content/amortizacao/nivel-2.ts` (novo — STRETCH)
- `frontend/src/content/amortizacao/glossario.ts` (novo)
- `frontend/src/components/amortization/AmortizacaoSaibaMais.tsx` (novo)
- `frontend/src/app/(app)/amortizacao/page.tsx` (atualização — integração `<section data-testid="amortizacao-aprenda-mais">`)
- `frontend/src/__tests__/content/amortizacao/conteudo.test.ts` (novo)
- `frontend/src/__tests__/components/amortization/AmortizacaoSaibaMais.test.tsx` (novo)
- `frontend/src/__tests__/app/amortizacao.test.tsx` (atualização — +5 casos da F5)
- `docs/06_API_e_Contratos.md` (revisão final dos exemplos amortização)
- `docs/08_Conteudo_Educacional.md` (atualização — §13 glossário; STRETCH §18 FAQ)
- `docs/09_Qualidade_Testes.md` (atualização — §16 massa F4 amortização confirmada)
- `docs/15_Casos_de_Teste_Matematicos.md` (atualização — cross-link código em PR-01/02 e SAC-01/02; declaração honesta sobre PR-03..10 / SAC-03..10)
- `docs/19_Matriz_Rastreabilidade.md` (atualização — RF-AMO-001/002 → done; +§7 Sprint 3)
- `docs/_meta/living_docs.json` (atualização — bump + notas)
- `docs/sprints/sprint-03/evidencias/F5-revisao-editorial.md` (novo)
- `docs/sprints/sprint-03/evidencias/F5-lint-pedagogico.md` (novo)
- `docs/sprints/sprint-03/evidencias/F5-validacoes-locais.md` (novo)
- `docs/sprints/sprint-03/evidencias/F5-staging-proof.md` (novo)
- Planilha operacional (atualização — responsabilidade do PO; não tocada pelo chat)

**DoR (Conteúdo, Doc 12 §3.5).** Persona "Iniciante Curioso" identificada (Doc 08); níveis 1 (CORE) e 2 (STRETCH) definidos; responsável editorial designado; artefatos relacionados (glossário) listados.

**DoD (Conteúdo, Doc 12 §4.5).**
- fluxo editorial completo (Doc 08 §7);
- versionamento bumpado em `docs/_meta/living_docs.json` se o esquema exigir;
- lint pedagógico verde (`EXIT_LINT_PED=0`);
- glossário do módulo amortização atualizado;
- integração visível na UI confirmada por teste de DOM (5+ casos novos no `app/amortizacao.test.tsx`).

**Evidências exigidas.** Relatório editorial + relatório do lint pedagógico + commit que fecha o bump + URL da PR + screenshot/JSON do verde do CI.

**Riscos específicos.**
- Texto contradizendo número (Doc 08 §6.5) — mitigação: toda afirmação numérica referencia campo do `summary` por nome ou usa números canônicos PR-01/SAC-01 (Doc 15).
- Over-engineering pedagógico — manter N1 em 120–200 palavras (lição Sprint 2 padrão F5).
- Reuso de `types.ts` de `juros/` gerar refator → preferir duplicar nesta sprint; refator vira sub-PR P-Refino.

---

### 5.6 Fatia F6 — Fechamento + Governança

**Objetivo.** Fechar oficialmente a Sprint 3: materializar relatórios de fechamento, atualizar planilha operacional com aviso do chat, reavaliar a decisão preliminar do Impact Agent (F1) com base no comportamento real durante F2–F5, e deixar `main` pronta para a Sprint 4. **A elevação efetiva do Impact Agent para `blocking`** (alteração técnica no `scripts/impact_analysis_guard.py` + workflow CI) ocorre nesta F6 **se e somente se** o ADR-NNNN da F1 aprovou promoção **e** o comportamento durante F2–F5 confirmou os gatilhos.

**Pré-condições.** F5 merged. Todos os gates CORE verdes. Cobertura conforme §3.4.

**Ações.**
1. Reavaliar decisão Impact Agent (revisão da F1):
   - Se ADR-NNNN F1 aprovou promoção **e** F2–F5 mostraram zero bloqueios espúrios **e** sprint dentro do budget **e** PO confirma → executar promoção técnica:
     - ajustar `scripts/impact_analysis_guard.py` (flag `--mode blocking` como default ou step do CI com `--mode blocking`);
     - ajustar `.github/workflows/impact-agent.yml` (ou `.github/workflows/ci.yml`) — sair de `continue-on-error: true` para `false`;
     - **provar o bloqueio funcionando:** abrir PR-de-controle intencionalmente violadora (ou dry-run em branch local) e capturar a rejeição em `docs/sprints/sprint-03/evidencias/F6-impact-agent-bloqueando.md`;
     - manter rota de escape documentada (override acessível apenas a mantenedores, com log).
   - Caso contrário (ADR adiou ou gatilhos não confirmaram) → preservar `advisory`; registrar decisão final em `docs/sprints/sprint-03/evidencias/F6-impact-agent-decisao-final.md`; ADR-NNNN é atualizada com decisão final.
2. Criar `docs/sprints/sprint-03/relatorio-execucao.md` (canônico — gabarito Sprint 1/2): narrativa cronológica, fatias, decisões, evidências.
3. Criar `docs/sprints/sprint-03/relatorio-forense.md`: divergências encontradas entre documentado e real, correções aplicadas, débito residual.
4. Criar `docs/sprints/sprint-03/validacao-oficial.md`: veredito (APROVADA / APROVADA COM PENDÊNCIAS / REPROVADA); critérios de §9 cobertos um a um.
5. Preencher checklist `docs/25_Release_Readiness.md` para Sprint 3 (mesmo sem deploy, manter prática).
6. Atualizar planilha operacional com aviso final "Sprint 3 — FECHADA em [data]; chat de origem: Sprint 3 / chat atual".
7. Criar `outputs/CONTEXTO_DE_CONTINUIDADE_POS_SPRINT_3.md` (espelho do contexto pós-Sprint 2 para alimentar a Sprint 4) — **off-repo**, em `outputs/` da sessão de chat, conforme convenção.

**Arquivos afetados (F6).**
- `docs/sprints/sprint-03/relatorio-execucao.md` (novo — **CORE**)
- `docs/sprints/sprint-03/relatorio-forense.md` (novo — **CORE**)
- `docs/sprints/sprint-03/validacao-oficial.md` (novo — **CORE**)
- `docs/sprints/sprint-03/evidencias/F6-impact-agent-decisao-final.md` (novo — **CORE**)
- `docs/sprints/sprint-03/evidencias/F6-validacao-final.md` (novo — **CORE**)
- `docs/sprints/sprint-03/evidencias/F6-relatorio-final-sprint-3.md` (novo — consolidado, opcional)
- `docs/sprints/sprint-03/evidencias/F6-staging-proof.md` (novo)
- `docs/adr/ADR-NNNN-impact-agent-promocao.md` (atualização — registro da decisão final)
- `outputs/CONTEXTO_DE_CONTINUIDADE_POS_SPRINT_3.md` (off-repo, próximo contexto)
- Planilha operacional (atualização final — responsabilidade do PO; não tocada pelo chat)
- **Só se ADR aprovar promoção:** `scripts/impact_analysis_guard.py` (atualização — `--mode blocking`)
- **Só se ADR aprovar promoção:** `.github/workflows/impact-agent.yml` ou `.github/workflows/ci.yml` (atualização — remoção de `continue-on-error: true`)
- **Só se ADR aprovar promoção:** `docs/sprints/sprint-03/evidencias/F6-impact-agent-bloqueando.md` (novo — prova do bloqueio)

**DoR (Infra/Segurança, Doc 12 §3.7).** Impacto em ambientes: somente CI; sem impacto HML/PROD. Janela e rollback: `git revert` da PR da F6. Para o bloco condicional do Impact Agent, DoR adicional: ADR-NNNN F1 aprovou promoção **e** F2–F5 mostraram baixa fricção real.

**DoD (Release, Doc 12 §4.8) — sempre obrigatório.**
- três relatórios de sprint (execução, forense, validação-oficial) publicados;
- decisão final do Impact Agent em ADR-NNNN atualizada e em `F6-impact-agent-decisao-final.md`;
- checklist `25_Release_Readiness.md` 100%;
- smoke pós-merge verde em `main`;
- janela de observação 30 min sem regressão;
- planilha operacional atualizada com aviso do chat (PO);
- contexto de continuidade pós-Sprint 3 entregue em `outputs/`.

**DoD (Infra/Segurança, Doc 12 §4.7) — só se ADR aprovou promoção.**
- IaC/CI atualizado (`.github/workflows/...`);
- runbook atualizado (elevar modo do agente gera novo comportamento);
- **prova explícita do bloqueio** anexada (`F6-impact-agent-bloqueando.md`);
- rota de escape documentada (override de mantenedor com log).

**Evidências exigidas.** Relatórios + decisão final + URL da PR + (se promovido) log do bloqueio funcionando.

**Riscos específicos.**
- Promover sem que F2–F5 tenham mostrado zero bloqueios espúrios → **kill-switch** §3.4: ADR-NNNN F1 não pode aprovar promoção sem leitura literal dos advisories da Sprint 2 confirmar baixa fricção; F6 só executa promoção se F2–F5 desta sprint também confirmarem.
- Esquecer de atualizar a planilha → DoD da F6 não cumprido (lição Sprint 1/2).
- Nunca rebaixar via `continue-on-error: true` silenciosamente — se necessidade futura, declarar em ADR explícita.

---

## 6. Estratégia de testes — mapeamento nas 14 camadas (Doc 09 §5)

| Camada | Uso na Sprint 3 | Fatia |
|---|---|---|
| 1. Unitário | `domain/amortization/{price,sac,_common}`; `services/amortization/calcular_amortizacao_service` | F2, F3 |
| 2. Componente (FE) | `AmortizacaoTabs`, `PriceForm`, `SacForm`, `CompararAmortizacaoForm`, `*Panel`, `AmortizacaoSaibaMais` | F4, F5 |
| 3. Integração | rota → service → domínio → (sem repo, pois Sprint 3 não persiste) | F3 |
| 4. Contrato | schemathesis sobre OpenAPI dos 3 endpoints novos | F3 |
| 5. Regressão (matemática/pedagógica/contrato) | diff de cenários PR/SAC (F2); regressão pedagógica do módulo Juros via débito P2 | F2, F5 |
| 6. Snapshot | UI (`AmortizacaoSaibaMais`, panels) via Vitest; OpenAPI runtime (diff anexado) | F3, F4 |
| 7. E2E | **fora do escopo**; snapshot visual leve cobre o essencial (Doc 09 §8) — STRETCH | — / F4 |
| 8. Acessibilidade | axe-core em `/amortizacao` | F4 |
| 9. Performance e carga | **fora do escopo**; reservar para P-Refino | — |
| 10. Mutação | mutmut em `backend/app/domain/amortization/` (semanal STRETCH, gate 80%) | F2 |
| 11. Segurança | bandit roda no pipeline padrão (F5-E02 do PIPE.md §4); sem mudanças de superfície sensível nesta sprint | (herdado/automático) |
| 12. Recuperação | **não aplicável** (sem persistência) | — |
| 13. Smoke | após cada merge na `main` (CI existente); smoke explícito após F6 | F6 |
| 14. Manuais orientados | revisão visual `/amortizacao` pelo PO antes do F4 mergear | F4 |

**Casos canônicos mínimos da Sprint 3 (Prompt §12):**

PV = 100.000,00 / taxa = 1% a.m. / prazo = 12 meses (PR-01 e SAC-01 do Doc 15). Validar:
- PRICE com parcela constante;
- SAC com amortização constante (≈ 8.333,33);
- saldo final próximo de zero (tolerância ± 0,01);
- total pago e total de juros calculados;
- comparação entre PRICE e SAC: SAC com total de juros menor;
- tabela com 12 períodos;
- coerência entre `summary`, `tables` e `charts` (Doc 06 §4.3; lição Sprint 2 #5).

PR-02 (estrutural): juros[1] > juros[12]; amortização[12] > amortização[1].

SAC-02 (comparativa): total_juros_sac < total_juros_price para mesma `(principal, taxa, n)`.

---

## 7. Estratégia documental — bloco IMPACTO DOCUMENTAL obrigatório por PR

Conforme POLÍTICA OPERACIONAL DE SINCRONIZAÇÃO DOCUMENTAL (herdada da Sprint 1/2), toda PR desta sprint traz o bloco abaixo no corpo da descrição (template — preencher por fatia):

```markdown
## IMPACTO DOCUMENTAL

**Sprint / Fatia:** Sprint 3 / F<N>
**Chat de origem:** Sprint 3 — chat atual
**Data:** YYYY-MM-DD

### Docs vivos tocados nesta PR
- [ ] docs/06_API_e_Contratos.md — <diff resumido>
- [ ] docs/08_Conteudo_Educacional.md — <diff resumido>
- [ ] docs/09_Qualidade_Testes.md — <diff resumido>
- [ ] docs/15_Casos_de_Teste_Matematicos.md — <cross-links>
- [ ] docs/19_Matriz_Rastreabilidade.md — linhas RF-AMO-001 / RF-AMO-002
- [ ] docs/_meta/living_docs.json — versão/data + notas

### Artefatos de sprint
- docs/sprints/sprint-03/<arquivo> — <descrição>
- docs/sprints/sprint-03/evidencias/<arquivo> — <descrição>

### Planilha operacional
- Atualizada: sim
- Aviso explícito do chat: sim — "Sprint 3 — F<N> [entregue | em curso | bloqueada] pelo chat [Sprint 3 / chat atual]"

### Referências cruzadas
- ADRs: <nenhuma nova | ADR-NNNN>
- Backlog Técnico (Doc 13 §3.5): itens <BE-NNN, FE-NNN, QA-NNN, CONT-NNN, DOC-NNN>
```

### 7.1 Docs vivos que **vão** ser tocados na Sprint 3

- `docs/06_API_e_Contratos.md` — exemplos request/response das 3 rotas amortização (F3 + F5 revisão).
- `docs/08_Conteudo_Educacional.md` — §13 (glossário do módulo amortização — F5); STRETCH §18 (FAQ inicial).
- `docs/09_Qualidade_Testes.md` — §16 (massa F4 amortização confirmada; backend amortização exercido — F5).
- `docs/15_Casos_de_Teste_Matematicos.md` — cross-link "Materializado em código:" em PR-01/PR-02 e SAC-01/SAC-02 (F5); declaração honesta sobre ausência de massa para PR-03..PR-10 e SAC-03..SAC-10.
- `docs/19_Matriz_Rastreabilidade.md` — RF-AMO-001/002 promovidos `pending → done` com caminhos finais; +§7 Sprint 3 histórico (F5).
- `docs/_meta/living_docs.json` — bump `updated_at` + notas individuais (F1, F2, F3, F4, F5, F6 incrementais).
- `docs/25_Release_Readiness.md` — checklist Sprint 3 preenchido (F6).
- `docs/adr/ADR-NNNN-impact-agent-promocao.md` — novo ADR (F1 + atualização final F6).

### 7.2 Docs vivos que **não** devem ser tocados nesta sprint (decisão binária)

- **`docs/baseline/03_Regras_de_Negocio.md` — FORA do escopo documental da Sprint 3.** As fórmulas PRICE/SAC já estão canonizadas em §10 e §11. Sprint 3 **consome**, não altera. Se ambiguidade real surgir, abrir Adendo formal ou ADR, fora das fatias.
- `docs/04_Arquitetura_de_Software.md` — Sprint 3 não altera arquitetura.
- `docs/baseline/11_Prompt_Mestre.md` — imutável por política.
- `docs/baseline/01_Visao_do_Produto.md` — imutável por política.
- `docs/baseline/21_Governanca_Branches_PRs.md` — imutável por política.
- ADRs anteriores (0001) — não reabertas nesta sprint.

### 7.3 Artefatos de sprint (obrigatórios ao fim da F6)

- `docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md` (este arquivo, materializado na F1)
- `docs/sprints/sprint-03/relatorio-execucao.md` (F6)
- `docs/sprints/sprint-03/relatorio-forense.md` (F6)
- `docs/sprints/sprint-03/validacao-oficial.md` (F6)
- `docs/sprints/sprint-03/evidencias/` — coleção das 6 fatias (F1..F6 staging-proof + decisões + execuções)

---

## 8. Governança operacional

### 8.1 Regime de PR e de branch

- **Modelo único — branch-por-fatia derivada de `main`** (§4.1). Não existe branch-mãe `sprint-3` persistente.
- Cada fatia abre sua própria branch `sprint-3/fN-<slug>` a partir do `main` já atualizado pelo merge da fatia anterior.
- **Seis PRs atômicas**, uma por fatia, **squash-merge direto em `main`**, em ordem F1 → F2 → F3 → F4 → F5 → F6. Sem PR agregador final.
- Cada PR passa obrigatoriamente por:
  - CI verde (build, lint, format, typecheck, unit, integration, contract, coverage gates conforme PIPE.md §4 e §5);
  - Impact Agent em modo `advisory` durante F1–F5 — promoção a `blocking` é CONDICIONAL (§3.4 e §5.1/§5.6);
  - revisão humana (PO);
  - bloco IMPACTO DOCUMENTAL preenchido;
  - protocolo §8.6 (staging/commit/pre-commit) evidenciado;
  - planilha operacional atualizada com aviso do chat (responsabilidade do PO).

### 8.2 Política de hotfix (Doc 12 §19)

- Bug crítico no meio da Sprint 3 → abrir `fix/hotfix-v2026.MM.DD-N` a partir de `main` com mesmo DoD em modo expresso; smoke pós-deploy + post-mortem em 48h. Hotfix **nunca** sai de uma branch-de-fatia em curso.

### 8.3 Rollback

- Cada PR é squash-merge → reverter = `git revert <sha>` no `main`. Nenhuma fatia deixa mudança acoplada a outra.

### 8.4 Impact Agent — regime durante a Sprint 3

- **Hoje (início Sprint 3):** modo `advisory`, `continue-on-error: true` (Fato §2.2; estado herdado).
- **F1:** materializar ADR-NNNN com **decisão preliminar** (promover ou adiar) baseada em leitura literal dos advisories Sprint 2 + aprovação PO. ADR é **sempre** entregue.
- **F2–F5:** **mantém `advisory`**. Relatórios do agente anexados a cada PR como evidência de fricção/não-fricção. Sem promoção mid-sprint.
- **F6:** se ADR-NNNN F1 aprovou promoção **e** F2–F5 confirmaram baixa fricção → executar promoção técnica + prova de bloqueio. Caso contrário → preservar `advisory` e atualizar ADR-NNNN com decisão final.
- **Não promover não reprova a Sprint 3.** Obrigação inescapável é registrar a decisão final em `F6-impact-agent-decisao-final.md` + ADR-NNNN atualizada.

### 8.5 Claude Code — regras vigentes (Doc 12 §20; Doc 09 §14; CLAUDE.md)

1. Não pular Fase 0.
2. Não pular DoR da categoria.
3. Não fechar item sem DoD da categoria.
4. Atualizar Doc 19 em toda PR que toca rota/feature.
5. Nunca declarar verde sem evidência anexada.
6. Fato × Inferência × Limitação sempre separados explicitamente.
7. Nenhum "depois" para dívida documental.
8. Toda PR com bloco IMPACTO DOCUMENTAL e aviso na planilha.
9. Executar protocolo obrigatório de staging/commit/pre-commit (§8.6) em cada fatia.

### 8.6 Protocolo obrigatório de staging/commit/pre-commit (prova por fatia, herdado da Sprint 2 §8.6)

Cada fatia da Sprint 3 **deve** executar, na ordem abaixo, e anexar a saída em `docs/sprints/sprint-03/evidencias/FN-staging-proof.md`. Sem essa evidência, a PR da fatia **não fecha DoD**.

```bash
# 1) Antes do stage:
git diff --name-only

# 2) Depois do stage, antes do commit:
git diff --cached --name-only

# 3) Pré-commit hook obrigatório (rodar antes do push):
pre-commit run --all-files

# 4) Depois do commit (prova do commit gravado):
git show --name-only --stat HEAD
```

**Regra-dura.** O relatório `FN-staging-proof.md` deve conter a saída literal dos quatro comandos, com carimbo de data/hora e SHA do commit. Prosa explicativa não substitui saída.

**Regra complementar.** A saída de `pre-commit run --all-files` é anexada **mesmo quando verde** — prova que o hook foi executado.

### 8.7 Validação oficial é WSL Ubuntu (lição Sprint 2 #9; PIPE.md §1)

- A execução **vinculante** dos gates é responsabilidade do operador no WSL Ubuntu via `bash scripts/pipeline.sh`. Saída esperada: `EXIT_PIPELINE=0` literal **+** mensagem `PIPELINE VERDE`.
- Sandbox de chat **não roda** o pipeline oficial (limitação §2.5).
- Windows é referência de desenvolvimento; WSL Ubuntu é referência de validação.
- Sem `EXIT_PIPELINE=0` literal anexado, a fatia **não pode** ser declarada verde (lição Sprint 2 #3).

### 8.8 Materialização do plano no repo (governança §8.7 PLANO Sprint 2)

- Este `PLANO_EXECUCAO_SPRINT_3.md` é artefato oficial versionado. Nasce no repo na F1.
- Revisões posteriores são commits normais com nova linha em §0.
- ADRs arquiteturais que surjam continuam separados em `docs/adr/`.

---

## 9. Critérios de aceite da Sprint 3 (nível de sprint)

A Sprint 3 é aceita quando **todos os critérios CORE** são verdadeiros. STRETCH e CONDICIONAL podem ser reportados abaixo do alvo sem reprovar a sprint, **desde que** a pendência esteja declarada nos relatórios de fechamento conforme regra de ouro §3.4.

### 9.1 Critérios CORE (obrigatórios para aceitar a Sprint 3)

1. **[CORE]** Endpoints `POST /api/v1/amortization/{price,sac,compare}` existem em `main`, com envelope canônico e tratamento RFC 7807.
2. **[CORE]** Casos do Doc 15 PR-01, PR-02, SAC-01 e SAC-02 estão exercidos por testes verdes.
3. **[CORE]** `backend/app/domain/amortization/` tem cobertura ≥ **95% linhas / 90% branches**.
4. **[CORE]** `/amortizacao` entrega resultado compreensível (tabs PRICE/SAC/Comparar + summary + tabela + gráfico + interpretação + alertas), com `loading/empty/error/success` tratados.
5. **[CORE]** Axe-core verde em `/amortizacao` (sem `serious`/`critical`).
6. **[CORE]** Textos de **nível 1** (4 blocos amortização) revisados editorialmente; lint pedagógico verde nos textos entregues; integração visível na DOM (`<section data-testid="amortizacao-aprenda-mais">`) provada por teste.
7. **[CORE]** Docs 06, 19 e `_meta/living_docs.json` atualizados na Sprint 3.
8. **[CORE]** Artefatos `docs/sprints/sprint-03/{00-plano/PLANO_EXECUCAO_SPRINT_3.md, relatorio-execucao.md, relatorio-forense.md, validacao-oficial.md}` presentes.
9. **[CORE]** ADR-NNNN — Impact Agent: avaliação de promoção materializada em `docs/adr/` com decisão clara (promover ou adiar) e justificativa baseada em leitura literal de advisories.
10. **[CORE]** `backend/tests/regression/pedagogical/test_interest.py` materializado e verde (débito P2 herdado da Sprint 2).
11. **[CORE]** Planilha operacional atualizada com aviso explícito do chat Sprint 3 em **cada** uma das 6 fatias (responsabilidade do PO).
12. **[CORE]** `main` verde em CI ao fim de cada PR de fatia; smoke pós-fechamento verde; 30 minutos de observação sem regressão.
13. **[CORE]** Protocolo §8.6 (staging/commit/pre-commit) evidenciado em `docs/sprints/sprint-03/evidencias/FN-staging-proof.md` para cada fatia.
14. **[CORE] Zero residual vermelho em item CORE.** Nenhum critério §9.1 (CORE 1–13) pode ser entregue abaixo do alvo. Desligamento é prerrogativa exclusiva de itens STRETCH (§9.2) e CONDICIONAL (§9.3), e ainda assim sujeito a três condições cumulativas (a) declaração explícita, (b) justificativa auditável, (c) destino concreto atribuído. Desligamento sem (a)+(b)+(c) é residual oculto = reprova de validação-oficial.

### 9.2 Critérios STRETCH (meta — reportáveis abaixo do alvo sem reprovar)

15. **[STRETCH]** Mutation ≥ 80% em `backend/app/domain/amortization/` reportado (se < 80%, registrar como pendência para P-Refino).
16. **[STRETCH]** Diff de cenários adicionais (≥ 30 cenários PR + SAC) anexado e reproduzível.
17. **[STRETCH]** Snapshot visual Playwright aceito em 1 viewport (substituível por snapshot de componente JSX se infra falhar).
18. **[STRETCH]** Textos de **nível 2** (4 blocos amortização) revisados.
19. **[STRETCH]** Doc 08 §18 — FAQ inicial; ampliação do glossário em direção a ≥ 25 termos do MVP (débitos P5/P6 herdados).
20. **[STRETCH]** Property-based estendido (`max_examples ≥ 200`) em `backend/tests/unit/domain/amortization/test_properties.py`.
21. **[STRETCH]** Doc 15 §5/§6 ampliado com PR-03..PR-10 e SAC-03..SAC-10 (Adendo formal, fora das fatias normais — pode ficar para Sprint 4+).

### 9.3 Critérios CONDICIONAL (governança — sujeitos a kill-switch §3.4)

22. **[CONDICIONAL]** Promoção efetiva do Impact Agent para `blocking` (alteração técnica em `scripts/impact_analysis_guard.py` + workflow CI) com prova operacional do bloqueio. **Só se** (a) ADR-NNNN F1 aprovou promoção, (b) leitura literal dos advisories Sprint 2 confirmou zero bloqueios espúrios, (c) F2–F5 confirmaram baixa fricção, (d) PO aprovou explicitamente, (e) sprint dentro do budget. Caso contrário, decisão documentada de adiar é aceitável como fechamento da Sprint 3 (não é reprovação).
23. **[CONDICIONAL]** Responsividade mobile (375) verificada em `/amortizacao` (débito P10 herdado).

---

## 10. Critérios de reprovação automática (sprint NÃO fecha)

Os critérios abaixo, se acionados, **reprovam automaticamente** o fechamento da Sprint 3 — **sem negociação, sem flexibilização**. Estão alinhados ao Prompt Sprint 3 §15 + lições da Sprint 2:

1. Sprint 3 implementou código nesta rodada de planejamento. (Esta rodada é doc-only — qualquer código materializado aqui = reprovação.)
2. Algum doc baseline (01, 03, 11, 21) foi alterado em PR de fatia comum (sem Adendo/ADR formal).
3. ZIP múltiplo ou relatório múltiplo na entrega da fatia (entrega sempre é 1 ZIP + 1 relatório .md).
4. Nomes genéricos de docs (`formulas.md`, `api-contract.md`, `user-guide.md`, etc.) usados como caminhos reais sem mapeamento (Prompt Sprint 3 §4).
5. Declaração de Fase 0 limpa sem prova confiável (sem saída literal `git status -sb` + `git rev-parse --short HEAD` em `evidencias/F1-base-branch.md`).
6. Limitação ambiental ocorrida e omitida (anomalia `.git/HEAD` ou outras — **devem** ser declaradas honestamente).
7. Plano superficial — fatias vagas, sem arquivos previstos, sem DoR/DoD por categoria, sem testes.
8. Falta de separação Fato / Inferência / Limitação.
9. Fatias não pequenas ou não auditáveis.
10. Sem previsão de testes mínimos.
11. Sem previsão de docs vivos atualizáveis na mesma PR.
12. Sem previsão de atualização da planilha operacional pelo PO.
13. Lições da Sprint 2 (§13 prompt; §11 deste plano) não carregadas.
14. WSL Ubuntu não tratado como ambiente oficial de validação.
15. Placeholder materializável (`TBD`, `a preencher`, `valor futuro`, etc.) presente em doc vivo.
16. Pipeline declarado verde sem `EXIT_PIPELINE=0` literal anexado.
17. Aprovação humana do PO declarada sem aprovação real.
18. Evidência falsa criada (arquivos de evidência sem saída real de comando).
19. `docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md` ausente do ZIP da F1.
20. `RELATORIO_GERACAO_PLANO_SPRINT_3.md` ausente da entrega desta rodada de planejamento.
21. `git add` / `git commit` / `git push` executados pela sessão de chat nesta rodada.
22. Branch criada / PR aberta pela sessão de chat nesta rodada.
23. Nenhuma evidência criada quando se afirma execução real de comando.
24. Item CORE entregue abaixo do alvo sem declaração honesta de pendência (residual oculto — §3.4 / §9.1 critério C14).

---

## 11. Lições aprendidas da Sprint 2 — obrigatórias na Sprint 3

Carregadas integralmente do Prompt Sprint 3 §13 + Contexto de Continuidade Pós-Sprint 2 (fornecido no chat de retomada) §8. **Todas vinculantes:**

1. Não confiar apenas no relatório textual da Claude Code; toda entrega futura deve ser auditada materialmente.
2. Exigir ZIP único + relatório .md único.
3. Não aceitar entrega incompleta.
4. Não aceitar placeholder materializável; placeholder semântico também é placeholder. Proibido em doc vivo: `TBD`, `a preencher`, `a ser preenchido`, `preencher depois`, `A confirmar pelo operador`, `EXIT real: (TBD)`, `valor futuro`, `resultado futuro`.
5. Conteúdo criado precisa gerar valor visível na UI; não aceitar componente criado sem integração real quando a feature for visível.
6. Comentários técnicos devem refletir comportamento real.
7. Evitar ciclos em barrel `index.ts`. Importações dentro de `nivel-1.ts`, `nivel-2.ts`, `glossario.ts` devem usar caminhos relativos sem reentrar via barrel.
8. Testes devem usar seletores escopados (lição da Sprint 2 / Vitest pattern).
9. Respeitar `exactOptionalPropertyTypes`. Não passar prop opcional como `undefined` quando o componente espera `string`.
10. Validar separadamente: format, typecheck, test, build e pipeline (verde em três não garante o quarto).
11. Não repetir solução que já falhou.
12. Validação oficial é no WSL Ubuntu (`bash scripts/pipeline.sh` → `EXIT_PIPELINE=0`).
13. Documentação deve refletir código/config/script real.
14. Não declarar verde sem evidência.
15. Não usar Windows como fonte oficial de pipeline.
16. Não editar baseline sem governança formal.
17. Não iniciar implementação sem Fase 0 limpa.
18. Não promover Impact Agent sem 3 gatilhos (PLANO Sprint 2 §3.4 / §5.6): (a) baixa fricção comprovada, (b) sprint no budget, (c) aprovação explícita do PO. Default = preservar advisory.
19. Caminho WSL é `~/workspace/Plataforma_Educacional_Financeira` (não `~/Plataforma_Educacional_Financeira`).
20. Critério de encerramento de fatia/sprint deve ser fechado — não criar pendência necessária para a própria fatia fechar.
21. Sintaxe ASCII em scripts PowerShell; sem here-strings com caracteres especiais; sem `§` (substituir por `sec.N`).
22. Não inventar capacidade do sandbox; declarar limitações honestamente.
23. Varredura de placeholders precisa ser literal e completa — listar todas as ocorrências encontradas e classificar (ativa / histórica / metalinguística / comando de busca).

---

## 12. Riscos, dependências e bloqueios

| # | Risco / Dependência | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | `main` não está verde no início da F1 | Baixa (Sprint 2 fechou com PR #11 verde) | Alto (Sprint 3 não começa) | F1 inspeciona primeiro; se falhar, abrir saneamento antes de criar `sprint-3/f1-preveo`. |
| R2 | Arredondamento HALF_EVEN diverge de expectativa humana em borda PRICE/SAC | Média | Médio | Isolar política em `_common.py`; cobrir bordas explícitas; documentar tolerância no Doc 09. |
| R3 | Hypothesis pesado em CI | Média | Baixo | Limitar `max_examples` por job; rodar pesado off-peak semanal (lição Sprint 2 R3). |
| R4 | Divergência OpenAPI × contract test | Baixa | Alto | Gerar OpenAPI em CI; schemathesis consome o gerado; diff anexado por fatia (lição Sprint 2 R4). |
| R5 | Reuso de componentes do módulo Juros gerar refator amplo | Média | Médio | Sub-fatia F4.b doc-only de refator antes; **nunca** misturar refator com nova feature na mesma PR. |
| R6 | Promover Impact Agent sem confirmar fricção real → falso positivo bloquear PR | Média | Médio | **Kill-switch §3.4 default preserva `advisory`.** Promoção só com leitura literal dos advisories Sprint 2 + confirmação F2–F5 + aprovação PO. Dry-run em PR sintética violadora antes de fechar F6. Rota de escape com log. |
| R7 | Revisão editorial demorar (pendência humana) | Média | Médio | Antecipar texto N1 já em F4 como `<AmortizacaoSaibaMais />` placeholder vazio integrado; F5 só preenche o conteúdo. |
| R8 | Mutation score < 80% em `domain/amortization/` | Média | Médio | Escrever testes focando em invariantes (não em literais); medir ao fim da F2. STRETCH — não bloqueia. |
| R9 | Divergência de serialização Decimal (string vs number) | Média | Alto | Padronizar string em envelope; cobrir por contract test (lição Sprint 2 R9 / S2). |
| R10 | Tempo total da sprint excedido | Média | Médio | Fatias pequenas; fatia que passar do budget é recortada antes de mergear. |
| R11 | PR-03..PR-10 / SAC-03..SAC-10 referenciados em Doc 19 mas não definidos em Doc 15 | Alta (já é Fato no `840cbcb`) | Baixo | Declaração honesta na F5 (Doc 15 fica como está; expansão é Adendo formal — Sprint 4+). Não inventar casos. |
| R12 | Doc 06 §15.4 lista `/compare` mas Doc 19 só tem RF-AMO-001/002 (sem RF-AMO-003 para `/compare`) | Alta (já é Fato) | Baixo | Tratar `/compare` como **endpoint de orquestração** que reusa RF-AMO-001+002 (não cria RF próprio); se PO discordar, abrir RF-AMO-003 em sub-fatia doc-only. |
| R13 | Reuso de tipos de `frontend/src/content/juros/types.ts` em `amortizacao/` gerar duplicação ou refator amplo | Média | Baixo | Default = duplicar (lição Sprint 2 — não embaralhar refator com feature). Extração para `_shared/types.ts` vira P-Refino. |
| R14 | Anomalia `.git/HEAD` no sandbox induzir conclusão errada sobre estado do repo | Baixa (já mitigada em §2.1) | Baixo | Sempre usar `git show 840cbcb:<path>` e `git ls-tree 840cbcb`; não declarar working tree limpa. |

### 12.1 Dependências externas

- Nenhuma dependência de serviço de terceiros para executar esta sprint (cálculo é puro; não há BCB, webhook, SMTP).
- Dependência de infraestrutura interna: CI (GitHub Actions), Playwright (STRETCH), pnpm + Node 20+, Python 3.11+ no WSL Ubuntu.

### 12.2 Bloqueios bloqueadores (stop-conditions)

A Sprint 3 é **pausada imediatamente** e volta a revisão se qualquer um acontecer:
- `main` não está verde na Fase 0;
- descobre-se que os endpoints de amortização **já existem** no backend (contradiz §2.4 — plano precisa ser reescrito);
- `backend/app/domain/amortization/` ou `backend/app/schemas/amortization/` ou `backend/app/services/amortization/` já contém código não-vazio (contradiz §2.2 Fato; revisar antes de F2/F3);
- lint pedagógico quebrado sem plano de correção;
- ADR-NNNN F1 aprova promoção do Impact Agent **e** dry-run F6 mostra impedimento técnico impossível de resolver na sprint → promoção é desagendada com ADR atualizada (mas isso **não** stop-condition para fechamento — preservar `advisory` é fechamento válido).

---

## 13. Pendências honestamente declaradas (no início da Sprint 3)

| # | Pendência | Natureza | Tratamento previsto |
|---|---|---|---|
| P1 | Fase 0 não executada pela IA (mount/sandbox) | Limitação ambiental (§2.1) | Executada pelo operador no CLI WSL autenticado; evidência em F1. |
| P2 | OpenAPI runtime atual inspecionado pela IA e encontrado estagnado em 4 paths da Sprint 1 | Anomalia documental herdada | F1 registra snapshot oficial no WSL; F3 regenera OpenAPI e anexa diff com catch-up de juros e novos endpoints de amortização. |
| P3 | Leitura literal dos advisories das PRs Sprint 2 não feita pela IA (sem GitHub) | Limitação ambiental | Operador coleta na F1; insumo do ADR-NNNN. |
| P4 | Massa adicional para PR/SAC em `financial_cases.json` ainda não materializada | Deliberada | F2 materializa como artefato explícito. |
| P5 | Mutation score real é desconhecido até F2 rodar | Deliberada | F2 reporta; STRETCH — não bloqueia. |
| P6 | E2E Playwright completo de `/amortizacao` fica fora | Deliberada | Documentado como pós-Sprint 3; snapshot visual leve cobre o essencial (STRETCH). |
| P7 | Responsividade mobile (375) é desejável, não obrigatória nesta sprint (P10 herdada) | Deliberada | F4 reporta o que funciona; o que não funcionar é pendência para P-Refino. |
| P8 | PR-03..PR-10 e SAC-03..SAC-10 referenciados em Doc 19 mas não definidos em Doc 15 §5/§6 | Documental — divergência já existente em `840cbcb` | Declaração honesta na F5; expansão de Doc 15 é Adendo formal, fora desta sprint. |
| P9 | Endpoint `/compare` não tem RF próprio em Doc 19 | Documental — divergência já existente | Tratar como orquestração de RF-AMO-001+002; abrir RF-AMO-003 só se PO solicitar. |
| P10 | Reuso de componentes `interest/` e `content/juros/types.ts` em amortização | Decisão deliberada | Default = duplicar nesta sprint; refator vira P-Refino. Sub-fatia F4.b/F5.b doc-only de refator se PO solicitar. |
| P11 | Anomalia `.git/HEAD` no sandbox WSL/FUSE | Limitação ambiental (§2.1) | Não tentar consertar; usar SHA explícito; declarar honestamente. |
| P12 | Casos JS-04..10 / JC-04..10 do Doc 15 ainda não exercidos (herdada Sprint 2 P3) | Deliberada | Sprints subsequentes — não escopo Sprint 3. |
| P13 | Conteúdo Nível 3 (Doc 08 §10, herdada Sprint 2 P4) | Deliberada | Pós-MVP / P-Refino. |
| P14 | Lint pedagógico completo (Doc 08 §20, herdada Sprint 2 P7) | Deliberada | Sprint 7 (roadmap). Sprint 3 mantém subset. |
| P15 | Glossário ≥ 25 termos do MVP (herdada Sprint 2 P5) | Parcial | Sprint 3 contribui com termos novos do módulo amortização (CORE) e STRETCH amplia. |
| P16 | FAQ inicial (Doc 08 §18, herdada Sprint 2 P6) | STRETCH | Sprint 3 entrega se folga; senão, P-Refino. |

---

## 14. Instruções para materialização futura (operador no WSL)

Após aprovação deste plano pelo PO, a F1 pode ser aberta. Sequência canônica para o operador:

```bash
# 1. Fase 0 oficial (canonical)
cd ~/workspace/Plataforma_Educacional_Financeira
git fetch origin --prune
git status -sb
git branch --show-current
git rev-parse --short HEAD              # esperado: 840cbcb
git rev-parse --short origin/main       # esperado: 840cbcb
git log --oneline --decorate -5

# 2. Validar main verde
bash scripts/pipeline.sh
echo "EXIT_PIPELINE=$?"                 # esperado: 0 + mensagem PIPELINE VERDE

# 3. Abrir branch da F1
git checkout -b sprint-3/f1-preveo

# 4. Aplicar pacote da F1 (entregue pela sessão de chat futura como ZIP único OFF-REPO)
unzip -o ~/Downloads/SPRINT_3_F1_PACOTE_v1.zip
git status -sb
git diff --stat

# 5. Rodar gates locais antes do commit
make lint-pedagogical                                         ; echo "EXIT_LINT_PED=$?"
cd frontend && pnpm format:check && pnpm typecheck && pnpm test --run
cd ../backend && .venv/bin/python -m ruff check . && .venv/bin/python -m ruff format --check . && .venv/bin/python -m mypy app/ && .venv/bin/python -m pytest tests/unit -m unit
cd ..
bash scripts/pipeline.sh                                      ; echo "EXIT_PIPELINE=$?"

# 6. Protocolo §8.6 (staging-proof)
git diff --name-only           # antes do stage
git add <arquivos esperados>
git diff --cached --name-only  # depois do stage, antes do commit
pre-commit run --all-files
git commit -m "docs(sprint-3): materializar plano + ADR Impact Agent + pré-voo F1"
git show --name-only --stat HEAD

# 7. Push + abrir PR squash → main
git push -u origin sprint-3/f1-preveo
# Abrir PR no GitHub com bloco IMPACTO DOCUMENTAL preenchido.
```

**Sequência por fatia (F2..F6):** o pacote ZIP da fatia + relatório `.md` correspondente são entregues pela sessão de chat futura. Operador aplica conforme o mesmo padrão acima, mudando apenas `<NOME>`. **Cada fatia abre apenas após o merge da anterior.**

---

## 15. Checklist final (pré-aprovação do PO)

### 15.1 Itens já verdes na entrega deste plano

- [x] Plano materializado em `docs/sprints/sprint-03/00-plano/PLANO_EXECUCAO_SPRINT_3.md` (este arquivo).
- [x] Estrutura mínima conforme Prompt Sprint 3 §9 (todas as 27+ seções obrigatórias presentes).
- [x] Fatias F1..F6 propostas com Objetivo / Pré-condições / Decisões / Ações / Arquivos / DoR / DoD / Evidências / Riscos.
- [x] Separa
