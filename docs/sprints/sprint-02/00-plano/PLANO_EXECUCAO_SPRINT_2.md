# Plano de Execução — Sprint 2

**Plataforma Educacional Financeira**
**Tema da Sprint:** Motor de Juros — Juros Simples e Juros Compostos (primeiro módulo matemático completo)
**Autor:** Equipe de Engenharia (papel coletivo operado pela IA executora)
**Data:** 2026-04-21
**Versão:** 1.2 (revisão corretiva de consistência interna — 2026-04-21)
**Status:** ⏳ Aguardando aprovação do PO (Moisés) antes da abertura da primeira **branch-de-fatia** (`sprint-2/f1-preveo`)
**Escopo regulatório:** este plano trata apenas de **planejamento auditável**. Nenhuma modificação de código ou de documento vivo será executada antes da aprovação. A posição do agente é deliberadamente **forense**, conforme o `CONTEXTO DE CONTINUIDADE - POS-SPRINT1` §1–§11.

---

## 0. Histórico de revisões

| Versão | Data | Autor | Alterações |
|---|---|---|---|
| 1.0 | 2026-04-21 | Equipe de Engenharia | Versão inicial, pré-revisão do PO. Baseada em: (a) FECHAMENTO_SPRINT_1.md; (b) CONTEXTO DE CONTINUIDADE - POS-SPRINT1 §1–§11; (c) Prompt Sprint 2 (rodada de planejamento, sem código); (d) snapshot documental em `AUDITORIA_PROMPT_1_FINAL/docs/` — Docs 02, 03, 06, 07, 08, 09, 11, 12, 13, 15, 19, `_meta/living_docs.json`, ADRs relevantes, e `POLITICAS/POLITICA_OPERACIONAL_DE_SINCRONIZACAO_DOCUMENTAL.md`. |
| 1.1 | 2026-04-21 | Equipe de Engenharia | Revisão cirúrgica pós-leitura do PO. Seis ajustes incorporados: (1) resolvida a ambiguidade "branch única × seis PRs" — adotado modelo único **branch-por-fatia derivada de `main`**, squash-merge por fatia, sem branch-mãe persistente (§4.1, §5.1); (2) **Impact Agent → `blocking`** rebaixado a **governança condicional com kill-switch explícito** (default: preservar `advisory`); fora do fechamento obrigatório da Sprint 2 (§3.4, §5.6, §9, §10 R6, §12 rec. 4); (3) nova §8.7 **institucionalizando** que todo `PLANO_EXECUCAO_SPRINT_XX.md` é artefato oficial versionado no repo, incluindo **porte retroativo** do plano da Sprint 1 para `docs/sprints/sprint-01/00-plano/`; (4) nova §8.6 com **protocolo obrigatório** de staging/commit/pre-commit (`git diff --name-only`, `git diff --cached --name-only`, `git show --name-only --stat HEAD`, `pre-commit run --all-files`) como prova por fatia; (5) **Doc 03** decidido binariamente como **fora do escopo documental da Sprint 2** (§7.1, §7.2), salvo ADR ou Adendo formal; (6) nova §3.4 marcando explicitamente **CORE × STRETCH × CONDICIONAL** — CORE = motor + API + `/juros` + testes essenciais + docs vivas mínimas; o restante rotulado e sujeito a kill-switch se ameaçar o fechamento. Nenhum outro conteúdo foi reescrito. |
| 1.2 | 2026-04-21 | Equipe de Engenharia | Revisão corretiva de **consistência interna** pós-leitura do PO. Quatro ajustes cirúrgicos: (1) propagação completa do modelo **branch-por-fatia** — §8.1 reescrita, §8.2 hotfix alinhado, DoD de F1 e evidência de F2 corrigidas, §10 R1 ajustado; eliminada toda referência remanescente a "branch única `sprint-2`" e a merge "na branch `sprint-2`"; (2) propagação completa do status **CONDICIONAL** do Impact Agent — §8.4 reescrita como "regime durante a Sprint 2" (default `advisory`, promoção só por gatilhos); §3.1 linha de governança marcada CONDICIONAL; §4.2 ordem e racional ajustados; §10 bloqueios bloqueadores ajustado; (3) **`warning` eliminado** — removida menção informal em §8.4 e formalizado que só existem `advisory` e `blocking`; (4) **critério CORE nº 13 endurecido** — zero residual vermelho em item CORE, desligamento exclusivo de STRETCH/CONDICIONAL sujeito a três condições cumulativas (declaração + justificativa + destino concreto); kill-switch não é licença para omissão. Nenhum conteúdo conceitual novo. |
| 1.3 | 2026-04-25 | Sessão F5 oficial (chat) | Revisão **somente de status histórico** (não-conceitual): (a) F1 concluída via PR #5; (b) F2 (domínio juros) concluída; (c) F3 (endpoints REST de juros) concluída via PR #7; (d) F4 (frontend de juros) concluída via PR #9 — 19 arquivos / 112 testes confirmados no pipeline WSL Ubuntu; (e) F5 oficial (Conteúdo Educacional + Docs vivos) materializada nesta sessão como pacote DRAFT auditável; (f) F5 emergencial (Pipeline Oficial) materializada via PR #8 — atividade operacional fora do plano original. Nenhuma fatia foi reescrita; nenhum critério de aceite foi alterado. F6 segue pendente. |

---

## 1. Finalidade deste documento

Este é o **plano operacional** que precede qualquer alteração de código ou de documento vivo na Sprint 2. Consolida o Discovery, enuncia as decisões arquiteturais e editoriais, lista os arquivos que serão criados/alterados por fatia, a estratégia de testes, a estratégia documental (incluindo bloco **IMPACTO DOCUMENTAL**), o regime de governança e os critérios objetivos de aceite. **Nenhuma fatia começa antes da aprovação deste plano.**

O plano respeita integralmente:
- a matriz **Fato / Inferência / Limitação** (sem inferência disfarçada de fato);
- o protocolo da **Sprint 1** (Fase 0, fatias pequenas e demonstráveis, PR atômica por fatia, evidências imutáveis em `docs/sprints/sprint-02/evidencias/`, planilha operacional atualizada com aviso explícito deste chat, IMPACTO DOCUMENTAL em cada PR);
- o **Prompt Sprint 2** (entrega planejada, não código) e os 12 blocos de resposta obrigatórios no chat de entrega do plano.

---

## 2. Leitura do estado atual (Fase 0 adaptada ao planejamento)

### 2.1 Contexto operacional — limitação declarada

Este ambiente é a **pasta mãe de governança/documentação** (`Matemática Financeira/`), não o diretório `.git` do repositório. Portanto, os comandos canônicos da **Fase 0** (`git fetch origin --prune`, `git status -sb`, `git branch --show-current`, `git rev-parse --short HEAD`, `git rev-parse --short origin/main`) **não são executáveis pela IA a partir deste mount**. Esta é uma **limitação explícita** e **não** uma evasão do protocolo: a Fase 0 continua obrigatória — ela será executada pelo operador Moisés, no CLI autenticado do repositório, no primeiro passo da Fatia F1 da Sprint 2. A saída será registrada em `docs/sprints/sprint-02/evidencias/base-branch.md`.

### 2.2 Fatos confirmados sobre o estado imediatamente anterior (fonte: FECHAMENTO_SPRINT_1.md)

**Fato:** PR #1 foi **squash-merged** em `main`; a branch `sprint-1` foi removida do remoto; o backlog da Sprint 1 foi entregue na íntegra (FastAPI skeleton com envelope + RFC 7807, Next.js shell com sidebar/header/12 rotas-base, docs sincronizados, CI base, Impact Agent em modo `advisory`); pacotes de estabilização e correção P07–P15 foram aplicados; P15 fechou o ciclo.

**Fato:** A Sprint 1 deixou como **dívida herdada em aberto**:
1. o **Agente de Análise de Impacto** continua em modo `advisory`, não em `blocking`. A meta documentada (Doc `AGENTE_DE_ANALISE_DE_IMPACTO.md` e Doc 12 §8) é que ele transite para `blocking` **ao final da Sprint 1**. Essa transição **não aconteceu** ao fim da Sprint 1. Interpretação honesta: a Sprint 2 deverá tratar a elevação para `blocking` como **item explícito e auditado**, com evidência do funcionamento do bloqueio;
2. eventuais resíduos de higiene de CI (e.g., prettier/lockfile) foram tratados pelos pacotes P13–P15 no fim da Sprint 1; a Fatia F1 da Sprint 2 confirmará que o `main` está verde antes de tocar em qualquer coisa.

### 2.3 Fatos confirmados sobre o escopo da Sprint 2 (triangulação documental)

**Fato (Doc 13 §3.4 "Sprint 2 — Juros Simples e Compostos"):** backlog operacional contempla `BE-006` (schemas `JurosSimplesIn/Out`, `JurosCompostosIn/Out`), `BE-007` (domínio `interest.simple`), `BE-008` (domínio `interest.compound`), `BE-009` (`CalcularJurosService`), `BE-010` (endpoints `POST /api/v1/interest/{simple,compound,compare}`), `FE-010/011/012` (página `/juros`, formulário, visualização), `QA-005` (unit Doc 15 JS-*/JC-*), `QA-006` (property-based), `QA-007` (integration), `QA-008` (contract), `QA-009` (visual snapshot), `CONT-001` (textos nível 1 e 2), `DOC-003` (docs 06/09/19).

**Fato (Doc 12 §9 "Sprint 2 — Juros Simples e Compostos"):** objetivos e critérios: juros simples e compostos corretos; diferença absoluta e percentual; tabela, gráfico, interpretação e alertas; testes do domínio (Doc 15 JS-* e JC-*) e de integração. HUs: **HU-010 a HU-013**.

**Fato (Doc 15 §3–§4):** casos de teste canônicos JS-01 (1.000,00 / 1%a.m. / 12m → juros 120,00; montante 1.120,00), JS-02 (5.000 / 2% a.m. / 3m → juros 300,00; montante 5.300,00), JS-03 (prazo zero → rejeitar), JC-01 (1.000 / 1% a.m. / 12m → montante ~1.126,83), JC-02 (10.000 / 2% a.m. / 24m → composto > simples), JC-03 (com aporte mensal). Esses são os casos numéricos oficiais de referência.

**Fato (Doc 19 — Matriz de Rastreabilidade):** requisitos funcionais `RF-INT-001` (simples) e `RF-INT-002` (compostos) mapeiam 1:1 para: `POST /api/v1/interest/simple` → `JurosSimplesIn/Out` → `CalcularJurosSimplesService` → `domain.interest.simple.calcular` → casos JS-01..10 → docs 03, 06, 09, 15, 19. `RF-INT-002` é análogo para compostos.

**Fato (Doc 07 §8):** a rota `/juros` é canônica no modelo de navegação oficial.

**Fato (Doc 06):** todo endpoint novo herda automaticamente o envelope canônico `{success, message, data, meta}` (sucesso) e RFC 7807 `application/problem+json` (erro), já materializados na Sprint 1. O payload de simulação de juros tem a forma canônica `{summary, tables, charts, interpretation, alerts}` (Docs 06 e 09).

**Fato (Doc 09 §6 e §7):** o backend é a fonte oficial da matemática; cobertura mínima em `backend/app/domain/` é **95% linhas / 90% branches** com **mutação ≥ 80% semanal** (gate bloqueante). `services/` 90/85; `api/` 85/80; componentes FE críticos 85/80.

**Fato (Doc 12 §4):** DoR e DoD são **por categoria** — Backend-rota, Backend-domínio, Frontend, Conteúdo, Regulatório, Infra, Release. Aplicar o DoD correto por artefato é obrigatório.

**Fato (POLÍTICA OPERACIONAL DE SINCRONIZAÇÃO DOCUMENTAL):** toda entrega toca (a) docs vivos no repo, (b) planilha operacional consolidada, (c) relatórios de sprint em `docs/sprints/sprint-02/{relatorio-execucao.md, relatorio-forense.md, validacao-oficial.md, evidencias/}`; cada PR traz bloco **IMPACTO DOCUMENTAL** obrigatório; a planilha é atualizada com aviso explícito informando o chat onde foi produzida.

### 2.4 Inferências declaradas (com rótulo explícito)

**Inferência:** como a Sprint 1 foi entregue com shell + contrato-base já verdes, o `main` atual **deve** estar em estado compatível para abrir `sprint-2` a partir dele sem rebase defensivo. **Verificação obrigatória na F1 antes de qualquer código** — se houver divergência, o plano é interrompido e retorno a revisão.

**Inferência:** as rotas `POST /api/v1/interest/simple` e `POST /api/v1/interest/compound` ainda **não existem** (coerente com o backlog da Sprint 2). **Verificação obrigatória na F1** — rodar `make openapi:export` ou equivalente para ler o OpenAPI atual do backend; se os endpoints já existirem, o plano precisa ser revisado para distinguir criação de refino.

**Inferência:** o Agente de Impacto continuou em `advisory` até o fim da Sprint 1 sem um PR específico que o elevasse a `blocking`. **Verificação obrigatória na F1** — ler `scripts/impact_analysis_guard.py` e o step correspondente em `.github/workflows/ci.yml` e confirmar o modo atual.

### 2.5 Limitações honestamente declaradas

1. **Fase 0 não executada pela IA.** O operador (Moisés) executará no CLI do repositório, ver §2.1. Sem a execução, **nenhum commit desta sprint pode iniciar**.
2. **Valor preciso de JC-01** (Doc 15 §4 traz "aproximadamente 1.126,83"). O teste do domínio deve computar o valor de referência com alta precisão (`Decimal`) e comparar com tolerância `±0,01` no valor exibido; o número a 4 casas é derivado do próprio motor, não de um literal fixo fora dele.
3. **Massa de 100 cenários** do DoD Backend-domínio (`make domain:diff` — Doc 12 §4.4) não tem, nesta auditoria, arquivo materializado já pronto. A F2 deste plano tratará a geração/revisão da massa (`tests/fixtures/financial_cases.json`) como trabalho explícito.
4. **Estratégia visual E2E** (snapshot Playwright em `/juros`) depende de infraestrutura que foi estabilizada na Sprint 1. A F4 confirma o runner antes de declarar gate visual pronto.
5. **Lint pedagógico** (Doc 08 §20) é pré-requisito para o DoD de Conteúdo. A F5 revalida o comando `make lint:pedagogical` (ou equivalente) antes da revisão editorial.

---

## 3. Escopo proposto (o que está dentro e o que não está)

### 3.1 Dentro do escopo (MVP Sprint 2)

| Camada | Item | Fonte canônica |
|---|---|---|
| Domínio | `backend/app/domain/interest/simple.py` — função pura `calcular_juros_simples` | Doc 03 §X (fórmulas); Doc 13 §3.4 BE-007 |
| Domínio | `backend/app/domain/interest/compound.py` — função pura `calcular_juros_compostos` (com e sem aporte mensal) | Doc 13 §3.4 BE-008; Doc 15 JC-01..03 |
| Schemas | `JurosSimplesIn/Out`, `JurosCompostosIn/Out`, `CompararJurosIn/Out` | Doc 13 §3.4 BE-006; Doc 06 (envelope) |
| Service | `CalcularJurosService` — orquestra domínio + monta payload pedagógico | Doc 13 §3.4 BE-009; Doc 06 (`summary/tables/charts/interpretation/alerts`) |
| API | `POST /api/v1/interest/simple`, `POST /api/v1/interest/compound`, `POST /api/v1/interest/compare` | Doc 13 §3.4 BE-010; Doc 07 §8 (`/juros`); Doc 19 (RF-INT-001/002) |
| Frontend | Página `/juros` com formulário, resultado, tabela, gráfico, interpretação, alertas | Doc 13 FE-010/011/012; Doc 07 §9 |
| Frontend | Estados `loading / empty / error / success` ativos | Doc 07 §21 |
| Testes | Unit domínio (Doc 15 JS-01..03 e JC-01..03) + property-based mínima | Doc 09 §5.1; Doc 13 QA-005/006 |
| Testes | Integração rota→service→domínio | Doc 09 §5.3; Doc 13 QA-007 |
| Testes | Contrato (schemathesis) para os 3 endpoints novos | Doc 09 §5.4; Doc 13 QA-008 |
| Testes | Component tests FE para formulário e visualização | Doc 09 §8 |
| Testes | Visual snapshot em `/juros` (1 viewport estável) | Doc 09 §5.6; Doc 13 QA-009 |
| Testes | Axe-core em `/juros` sem `serious`/`critical` | Doc 09 §5.8 |
| Conteúdo | Textos nível 1 (síntese pedagógica) e nível 2 (aprofundamento) para juros simples e compostos | Doc 13 CONT-001; Doc 08 |
| Documental | Docs 06 (endpoints novos), 09 (massa), 15 (casos exercidos), 19 (linhas RF-INT-001/002 vinculadas aos arquivos), `_meta/living_docs.json` (revisão) | DOC-003; POLÍTICA OPERACIONAL |
| Governança (**CONDICIONAL** — §3.4) | **Avaliar promoção do Impact Agent de `advisory` para `blocking`** com evidência do bloqueio funcionando **apenas se** os três gatilhos do §5.6 ação 1 forem verdadeiros. Default = preservar `advisory`. | Doc `AGENTE_DE_ANALISE_DE_IMPACTO.md`; Doc 12 §8 |
| Governança | Artefatos `docs/sprints/sprint-02/{relatorio-execucao.md, relatorio-forense.md, validacao-oficial.md, evidencias/}` | POLÍTICA OPERACIONAL |
| Governança | Planilha operacional atualizada com aviso explícito do chat Sprint 2 | POLÍTICA OPERACIONAL |

### 3.2 Fora do escopo (pós-MVP ou sprints seguintes)

| Item | Por que fica fora | Quando entra |
|---|---|---|
| PRICE e SAC | Sprint 3 (Doc 12 §10) | Sprint 3 |
| Diagnóstico financeiro | Sprint 4 (Doc 12 §11) | Sprint 4 |
| Persistência de cenários | Sprint 9 (Doc 12 §16) | Sprint 9 |
| Exportação PDF/Excel | Sprint 8 (Doc 12 §15) | Sprint 8 |
| Observabilidade avançada (SLO, dashboards) | Sprint contínuo P-Refino | P-Refino |
| Cache Redis no endpoint de juros | Desejável, não obrigatório no MVP | Pós-MVP |
| E2E Playwright completo de `/juros` | Depende de infraestrutura fluida | Pós Sprint 2 (snapshot visual leve é suficiente) |

### 3.3 Não-objetivos explícitos

- **Não** refatorar o contrato-base (envelope, RFC 7807) — ele é herdado da Sprint 1 e **não é tocado**.
- **Não** introduzir novo ADR arquitetural — a Sprint 2 **usa** as ADRs 0001–0014 existentes; se surgir necessidade real de nova ADR (p.ex., política de aporte em juros compostos), o plano é **interrompido** e retorno a revisão do PO.
- **Não** fazer deploy em HML/PROD — Sprint 2 encerra com `main` verde e artefatos completos; qualquer deploy é tratado fora desta sprint.

### 3.4 Classificação CORE × STRETCH × CONDICIONAL (fronteira de fechamento)

Esta classificação existe para que, se a sprint for pressionada por tempo ou risco, **o fechamento possa ser honrado sem sacrificar o essencial**. Itens STRETCH e CONDICIONAL são explicitamente **desligáveis** sem reprovar a sprint — desde que declarados nos relatórios de fechamento como pendência consciente, não como residual oculto.

| Categoria | Item | Justificativa da categoria | Kill-switch |
|---|---|---|---|
| **CORE** | Domínio `interest.simple` + `interest.compound` (F2) com unit tests cobrindo JS-01..03 e JC-01..03 | É a razão-de-ser da sprint (motor matemático). | Nenhum — sem isto, sprint reprovada. |
| **CORE** | Schemas + Service + Endpoints `POST /api/v1/interest/{simple,compound,compare}` (F3) com integration + contract tests | Contrato público do motor; sem isto, o FE não tem o que consumir. | Nenhum. |
| **CORE** | Página `/juros` (F4) com formulário + resultado (summary + tabela + gráfico + alertas) e estados `loading/empty/error/success` | Materialização da HU-010..013. | Nenhum. |
| **CORE** | Docs vivas mínimas: Doc 06 (endpoints), Doc 19 (RF-INT-001/002 com caminhos), `_meta/living_docs.json` | Rastreabilidade exigida por POLÍTICA DE SINCRONIZAÇÃO. | Nenhum. |
| **CORE** | Artefatos `docs/sprints/sprint-02/{00-plano/…, relatorio-execucao.md, relatorio-forense.md, validacao-oficial.md}` + planilha operacional atualizada com aviso do chat | Rastreabilidade operacional exigida. | Nenhum. |
| **CORE** | Axe-core verde em `/juros` sem `serious`/`critical` | A11y é trilho ético/legal não-negociável. | Nenhum. |
| **CORE** | `main` verde em CI ao fim de cada PR de fatia | Invariante do trunk-based. | Nenhum. |
| **STRETCH** | Property-based estendido (`max_examples` alto) + diff de 100 cenários em `tests/fixtures/financial_cases.json` (F2) | Reforça confiança, mas pode ser desligado para semanal/off-peak sem quebrar correção. | Se Hypothesis pesar no CI, reduzir `max_examples` e mover job pesado para semanal. Declarar em relatório. |
| **STRETCH** | **Mutation ≥ 80%** em `backend/app/domain/interest/` | Meta de qualidade; não bloqueia fechamento da sprint se reportada abaixo, **desde que** fique como pendência explícita para P-Refino. | Reportar número real; se < 80%, documentar e manter gate como alvo, não como reprovação da sprint. |
| **STRETCH** | Snapshot visual Playwright em `/juros` (1 viewport) | Valor alto, mas dependente de infra de visual testing estável. | Se runner falhar por infra, usar snapshot de componente (JSX → textual) em F4 e declarar pendência. |
| **STRETCH** | Conteúdo pedagógico **nível 2** (aprofundamento) (F5) | Nível 1 é CORE pedagógico; nível 2 pode ser concluído em P-Refino. | Se revisão editorial atrasar, entregar só nível 1 revisado + nível 2 em draft marcado. |
| **STRETCH** | Docs 08 (textos níveis 1/2), 09 (massa confirmada), 15 (cross-links de casos exercidos) | Desejáveis para coerência editorial-matemática plena, mas não bloqueiam o motor. | Se F5 apertar, Doc 08 nível 2 e Doc 15 cross-links podem ficar como PR pós-fechamento curto. |
| **CONDICIONAL** | **Elevação do Impact Agent de `advisory` para `blocking`** + prova operacional do bloqueio (F6) | **Governança**, não entrega funcional. Histórico pós-Sprint 1 mostra estabilidade em `advisory` — promoção deve depender de baixa fricção comprovada, não de calendário. | **Default: kill-switch acionado** — preservar `advisory`. Promover somente se os três gatilhos de §5.6 ação 1 forem verdadeiros (F1–F5 sem bloqueios espúrios + sprint no budget + aprovação explícita do PO). Caso contrário, promoção migra para Sprint 3 ou P-Refino, com ADR. |
| **CONDICIONAL** | Responsividade mobile (375) verificada em `/juros` | Desejável; não-requisito MVP. | Reportar o que funciona; pendências viram tickets para P-Refino. |

**Regra de ouro do kill-switch.** Se um item STRETCH ou CONDICIONAL ameaçar o fechamento da sprint (risco de empurrar CORE para atraso), ele é **explicitamente desligado** na PR da fatia correspondente, com nota em `docs/sprints/sprint-02/evidencias/` explicando **o que foi desligado, por quê, e para onde foi endereçado**. Silêncio sobre desligamento = residual oculto = falha de governança (regra da Sprint 1).

---

## 4. Macroestratégia

### 4.1 Princípios invioláveis (herdados da Sprint 1)

1. **Modelo de branch/PR — ÚNICO E EXPLÍCITO: branch-por-fatia derivada de `main`.**
   - Cada fatia F1–F6 cria sua própria branch a partir de `origin/main` **já atualizado no momento da abertura**, nomeada `sprint-2/fN-<slug>`, p.ex.: `sprint-2/f1-preveo`, `sprint-2/f2-dominio`, `sprint-2/f3-api`, `sprint-2/f4-frontend`, `sprint-2/f5-conteudo`, `sprint-2/f6-fechamento`.
   - **Não existe branch-mãe `sprint-2` persistente.** Nada é acumulado em uma branch de integração. Cada branch-de-fatia vai direto para `main` via PR.
   - **Cada PR é squash-merge em `main`**, uma por fatia. Seis PRs no total (F1–F6). Não há PR agregador final.
   - **Rollback é sempre `git revert <sha-do-squash>` no `main`**, fatia por fatia, em ordem inversa se precisar (F6 → F5 → …). Cada fatia permanece atomicamente reversível.
   - A **próxima fatia só abre após o merge da anterior**; a nova branch-de-fatia sai do `main` com o merge da fatia anterior já incluído (rebase implícito por construção). Isto elimina merges complicados entre fatias.
   - Trunk-based estrito: `main` é sempre a verdade; nenhuma branch-de-fatia vive mais que sua própria PR.
2. **PR atômica por fatia** (squash-merge direto em `main`), não PR-gigante. Seis PRs (uma por fatia F1–F6), cada uma com DoD da sua categoria cumprido integralmente.
3. **Commits atômicos por camada** dentro de cada branch-de-fatia, nesta ordem: `backend → frontend → docs → CI/governança`. Nenhum commit mistura camadas. (No squash-merge os commits se agregam; a ordem fica preservada no histórico da branch-de-fatia antes do squash.)
4. **Evidências imutáveis** em `docs/sprints/sprint-02/evidencias/` — saídas reais de comandos (logs, SHAs, números de cobertura, diffs de OpenAPI), não descrições.
5. **Bloco IMPACTO DOCUMENTAL obrigatório em cada PR** — lista docs vivos tocados, artefatos de sprint atualizados, e menção explícita à atualização da planilha operacional.
6. **Nada é entregue com residual vermelho admitido.** Se um gate falha, a fatia volta e se conserta antes do merge.
7. **Posição forense** — toda alteração é justificada por documento canônico; toda divergência é declarada antes de ser corrigida.

### 4.2 Ordem das fatias

`F1 (Pré-voo) → F2 (Domínio) → F3 (Service + Endpoints + Integ/Contrato) → F4 (Frontend + a11y + snapshot) → F5 (Conteúdo + Docs vivos) → F6 (Fechamento + Governança; promoção do Impact Agent é CONDICIONAL)`

**Por que essa ordem:** o backend é a fonte de verdade matemática (Doc 09 §6). O FE só é construído depois que a API está contratualmente fechada (evita retrabalho de contrato). Conteúdo pedagógico e docs vivos vêm depois do comportamento existir (evita textos descrevendo algo que mudou). Governança (avaliação condicional da promoção do Impact Agent) fica no fim porque **se** a promoção ocorrer, ela precisa exercer o bloqueio sobre PR real com a sprint já madura; **se não** ocorrer, a decisão é registrada como fechamento válido (default = preservar `advisory`).

### 4.3 Prefixo de commit-messages (Conventional Commits PT-BR, padrão Sprint 1)

- Backend: `feat(sprint-02/backend): ...`
- Frontend: `feat(sprint-02/frontend): ...`
- Docs: `docs(sprint-02): ...`
- CI/Governança: `ci(sprint-02): ...`
- Testes: `test(sprint-02): ...`

---

## 5. Fatias de execução

> Cada fatia abaixo declara: **Objetivo · Pré-condições · Arquivos afetados · DoR da categoria · DoD da categoria · Evidências exigidas · Riscos específicos**.

### 5.1 Fatia F1 — Pré-voo e higiene herdada

**Objetivo.** Provar, antes de qualquer commit de código-novo, que o `main` está verde, o repositório está limpo, e as pré-condições de governança da Sprint 2 estão satisfeitas. Não introduz código de domínio.

**Pré-condições.** Aprovação deste plano pelo PO.

**Ações.**
1. Executar Fase 0 canônica (Moisés no CLI): `git fetch origin --prune`, `git status -sb`, `git branch --show-current`, `git rev-parse --short HEAD`, `git rev-parse --short origin/main`. Saída salva em `docs/sprints/sprint-02/evidencias/base-branch.md`.
2. Rodar `make verify` (ou `make verify:full`) em `main` e anexar saída em `docs/sprints/sprint-02/evidencias/main-verify-baseline.md`. **Regra-dura:** se `main` não estiver verde, a Sprint 2 não começa.
3. Confirmar modo atual do Impact Agent lendo `scripts/impact_analysis_guard.py` e o step em `.github/workflows/ci.yml`. Registrar em `docs/sprints/sprint-02/evidencias/impact-agent-estado-inicial.md`.
4. Criar **a primeira branch-de-fatia** `sprint-2/f1-preveo` a partir de `origin/main` (modelo §4.1; **sem** branch-mãe `sprint-2` persistente). Cada fatia subsequente abrirá sua própria branch `sprint-2/fN-<slug>` a partir do `main` já atualizado pelo merge da fatia anterior.
5. Abrir a PR de planejamento (`docs(sprint-02): plano de execução + pré-voo F1`) — **PR F1 → `main`** (squash-merge) — contendo **apenas**:
   - este arquivo `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md`;
   - os dois artefatos de evidência acima;
   - atualização inicial de `docs/_meta/living_docs.json` se houver.

**Arquivos afetados (F1).**
- `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` (novo)
- `docs/sprints/sprint-02/evidencias/base-branch.md` (novo)
- `docs/sprints/sprint-02/evidencias/main-verify-baseline.md` (novo)
- `docs/sprints/sprint-02/evidencias/impact-agent-estado-inicial.md` (novo)
- Planilha operacional (atualização: linha "Sprint 2 — F1 aberta, plano em revisão", com aviso do chat de origem).

**DoR (Infra/Governança + Geral).** §2.2, §2.3, §2.4 satisfeitos; plano revisado pelo PO; vinculação a RF-INT-001/002 no Doc 19; impacto em contrato declarado (não aplicável nesta fatia).

**DoD (Infra/Governança + Geral).** `main` verde (`make verify` verde anexado); **PR da F1 squash-merged em `main`** (a branch `sprint-2/f1-preveo` é descartada após o merge); planilha atualizada com aviso do chat; CI verde na PR da F1.

**Evidências exigidas.** As três sub-evidências acima + URL da PR da F1 + screenshot/JSON do verde do CI.

**Riscos específicos.** `main` não verde → Sprint 2 em espera até P16+ saneamento (não iniciar). Impact Agent já em modo inesperado (`blocking` prematuro) → não é ruim per se, mas precisa ser registrado como fato e não descoberto mais adiante.

---

### 5.2 Fatia F2 — Domínio Juros (Simples + Compostos)

**Objetivo.** Materializar o **motor matemático puro** de juros simples e compostos, com testes unitários contra Doc 15 + property-based + diff de 100 cenários.

**Pré-condições.** F1 merged.

**Decisões arquiteturais.**
- Domínio é **função pura**, sem IO, sem `datetime.now()`, sem log.
- Tipagem de moeda: `Decimal` (Python), `ROUND_HALF_EVEN`, precisão interna alta (≥ 28 dígitos), exibição 2 casas (Doc 09 §12.2; Doc 04).
- Assinatura base (conceitual — materializada na fatia):
  - `calcular_juros_simples(principal: Decimal, taxa_mensal: Decimal, prazo_meses: int) -> SimplesResultado`
  - `calcular_juros_compostos(principal: Decimal, taxa_mensal: Decimal, prazo_meses: int, aporte_mensal: Decimal | None = None) -> CompostosResultado`
- `SimplesResultado` e `CompostosResultado` são dataclasses (ou Pydantic internos do domínio) com `juros_totais`, `montante_final`, `tabela_periodo` (lista de dict imutável com `periodo, saldo_inicial, juros_periodo, aporte?, saldo_final`).
- Propriedades invariantes para property-based:
  - Simples: `montante_final == principal + principal * taxa_mensal * prazo_meses` (com tolerância da aritmética de Decimal).
  - Compostos sem aporte: `montante_final == principal * (1 + taxa_mensal) ** prazo_meses`.
  - Para qualquer prazo > 0 e taxa > 0: `montante_composto >= montante_simples` (igualdade só em prazo ≤ 1).
  - Tabela: `len(tabela) == prazo_meses`; `tabela[-1].saldo_final == montante_final` (com tolerância).
- Rejeitos explícitos via exceções de domínio: `DomainValidationError` (prazo ≤ 0, principal < 0, taxa inválida, aporte < 0).

**Ações.**
1. Criar módulo `backend/app/domain/interest/__init__.py` + `simple.py` + `compound.py`.
2. Criar `backend/app/domain/interest/_rounding.py` (ou reusar utilitário existente do domínio) para isolar política de arredondamento.
3. Unit tests:
   - `backend/tests/unit/domain/interest/test_simple.py` exercendo **JS-01, JS-02, JS-03** (Doc 15 §3).
   - `backend/tests/unit/domain/interest/test_compound.py` exercendo **JC-01, JC-02, JC-03** (Doc 15 §4), incluindo comparação simples vs composto.
   - `backend/tests/unit/domain/interest/test_properties.py` com Hypothesis — propriedades acima, shrink configurado, `max_examples` calibrado para CI aceitável.
4. Massa de validação: materializar `backend/tests/fixtures/financial_cases.json` cobrindo ao menos JS-01..03 + JC-01..03 + 100 cenários canônicos adicionais (derivados determinísticos de grade taxa/prazo/principal). `make domain:diff` (ou script equivalente) gera o diff numérico anexado à PR (Doc 12 §4.4).
5. Atualizar `docs/_meta/living_docs.json` se a convenção do projeto exigir registro de novos módulos de domínio.

**Arquivos afetados (F2).**
- `backend/app/domain/interest/__init__.py`, `simple.py`, `compound.py`, `_rounding.py` (novos)
- `backend/tests/unit/domain/interest/test_simple.py`, `test_compound.py`, `test_properties.py` (novos)
- `backend/tests/fixtures/financial_cases.json` (novo ou ampliado)
- `docs/sprints/sprint-02/evidencias/F2-domain-coverage.md` (novo — saída de cobertura)
- `docs/sprints/sprint-02/evidencias/F2-domain-diff-100.md` (novo — saída de `make domain:diff`)
- `docs/sprints/sprint-02/evidencias/F2-mutation-report.md` (novo — saída de `mutmut` em `backend/app/domain/interest/`, se disponível)

**DoR (Backend-domínio).** Referência explícita a Doc 03 (regras matemáticas) e Doc 15 (casos JS-* e JC-*). Vinculação a RF-INT-001 e RF-INT-002 no Doc 19 (linha já existe no estado base, apenas a ser marcada).

**DoD (Backend-domínio, Doc 12 §4.4).**
- testes verdes contra JS-01..03 e JC-01..03;
- propriedades Hypothesis verdes com `max_examples ≥ 100`;
- `diff` de 100 cenários anexado à PR;
- cobertura `backend/app/domain/interest/` ≥ **95% linhas / 90% branches**;
- mutação em `backend/app/domain/interest/` ≥ **80%** (reportar número, mesmo se job semanal);
- nenhum IO no módulo de domínio (grep negativo confirmando ausência de `open`, `requests`, `datetime.now`, `print`, `logging`);
- lint/format/typecheck verdes.

**Evidências exigidas.** Saídas acima + URL da PR + SHA do squash-merge em `main`.

**Riscos específicos.** Arredondamento divergente (HALF_EVEN vs HALF_UP) em bordas → mitigar isolando `_rounding.py` e testando bordas explícitas. Hypothesis excessivamente pesado no CI → limitar `max_examples` para o job regular, manter job pesado semanal/off-peak.

---

### 5.3 Fatia F3 — Service + Endpoints REST + Integração + Contrato

**Objetivo.** Expor o domínio da F2 pela API v1, montar o payload pedagógico canônico (`summary/tables/charts/interpretation/alerts`), e validar por testes de integração e contrato.

**Pré-condições.** F2 merged. `make test-contract` já existente (Sprint 1).

**Decisões arquiteturais.**
- Service em `backend/app/services/interest/calcular_juros_service.py` — orquestra: valida entrada (via schemas Pydantic), delega ao domínio, monta `summary` (5–7 métricas-chave), `tables` (tabela período), `charts` (serializada, não renderizada), `interpretation` (texto pedagógico produzido por função determinística — a F5 enriquece textos), `alerts` (lista de alertas com nível conforme Doc 07 §17).
- Schemas Pydantic v2 em `backend/app/schemas/interest.py` — `JurosSimplesIn`, `JurosSimplesOut`, `JurosCompostosIn`, `JurosCompostosOut`, `CompararJurosIn`, `CompararJurosOut`, `SimulacaoEnvelope` (reusa contrato-base).
- Endpoints em `backend/app/api/v1/interest.py` — `POST /simple`, `POST /compound`, `POST /compare`.
- Erros via `DomainError` → handler global da Sprint 1 → `Problem+json` RFC 7807 (sem duplicar tratamento).
- **Idempotency-Key** declarado no contrato (header opcional) para futuros usos, ainda que o motor seja determinístico agora (Doc 06; Doc 12 §4.3).
- Log estruturado com `request_id` em cada endpoint + métrica `juros_calculos_total{tipo=simple|compound|compare}` (Doc 09 §12.6; Doc 23).

**Ações.**
1. Criar schemas Pydantic + validações (prazo > 0, taxa ≥ 0, principal ≥ 0, aporte opcional ≥ 0; valores em string com `Decimal` ou `Annotated[Decimal, ...]`).
2. Criar service com unit tests próprios (sem FastAPI) — validação de composição `summary/tables/charts/interpretation/alerts`.
3. Criar endpoints + registrar no router v1.
4. Integration tests em `backend/tests/integration/interest/` — sobem app com `TestClient` + Postgres efêmero (ou stub, se não houver persistência nesta sprint), cobrem:
   - happy path JS-01, JS-02, JC-01, JC-02, JC-03;
   - rejeição JS-03 (prazo zero → 422 `VALIDATION_ERROR`);
   - valores inválidos (principal negativo → 422);
   - `/compare` devolvendo diferença absoluta e percentual coerentes.
5. Contract tests (schemathesis) em `backend/tests/contract/test_interest.py` — consome OpenAPI gerado em runtime e exerce cada endpoint; verifica envelope canônico + forma de `Problem+json` em erros.
6. Atualizar OpenAPI runtime (`openapi.json` exportado) e anexar diff em `docs/sprints/sprint-02/evidencias/F3-openapi-diff.md`.
7. Atualizar `docs/06_API_e_Contratos.md` adicionando as três rotas e exemplos de request/response coerentes com a implementação.

**Arquivos afetados (F3).**
- `backend/app/schemas/interest.py` (novo)
- `backend/app/services/interest/calcular_juros_service.py` (novo)
- `backend/app/api/v1/interest.py` (novo)
- `backend/app/api/v1/router.py` (atualização: inclusão de `interest.router`)
- `backend/tests/unit/services/test_calcular_juros_service.py` (novo)
- `backend/tests/integration/interest/test_simple.py`, `test_compound.py`, `test_compare.py`, `test_errors.py` (novos)
- `backend/tests/contract/test_interest.py` (novo)
- `docs/06_API_e_Contratos.md` (atualização, vivo)
- `docs/19_Matriz_Rastreabilidade.md` (atualização — linhas RF-INT-001/002 recebem os caminhos novos)
- `docs/sprints/sprint-02/evidencias/F3-openapi-diff.md` (novo)
- `docs/sprints/sprint-02/evidencias/F3-api-coverage.md` (novo)

**DoR (Backend-rota nova).** Payload in/out definidos (§5.3 deste plano); categoria de erro mapeada (DomainValidationError → 422 `VALIDATION_ERROR`); impacto em OpenAPI declarado (3 rotas novas).

**DoD (Backend-rota nova, Doc 12 §4.3).**
- OpenAPI runtime atualizado + diff anexado;
- contract test verde (schemathesis);
- log + métrica + correlação implementados;
- `Idempotency-Key` suportado nas 3 rotas (header opcional, propagado ao log);
- cobertura `backend/app/services/interest/` ≥ 90/85; `backend/app/api/v1/interest.py` ≥ 85/80;
- Doc 06 e Doc 19 atualizados **na mesma PR**.

**Evidências exigidas.** Saídas acima + URL da PR + SHA do merge.

**Riscos específicos.** Serialização de `Decimal` como string vs number divergente entre `Simple` e `Compound` → fixar convenção única no envelope e cobrir por contract test. Redundância entre service e domínio (lógica vazando para service) → manter service magro e domínio grosso; grep-check de `for` loop aritmético em service é sinal de alerta.

---

### 5.4 Fatia F4 — Frontend `/juros` + component tests + a11y + snapshot visual

**Objetivo.** Entregar a página `/juros` com formulário, resultado, tabela, gráfico, interpretação e alertas, obedecendo Doc 07 §9 (estrutura padrão do módulo) e §21 (estados de interface).

**Pré-condições.** F3 merged. API fechada contratualmente.

**Decisões arquiteturais.**
- Rota: `frontend/src/app/(app)/juros/page.tsx`.
- Formulário em `frontend/src/components/juros/JurosForm.tsx`:
  - modos: "Simples", "Composto", "Comparar";
  - campos: `principal` (BRL), `taxa_mensal` (%), `prazo_meses` (inteiro), `aporte_mensal?` (BRL, visível no modo Composto);
  - validação client-side alinhada ao contrato (nunca mais rígida que o backend; o backend é a fonte de verdade);
  - estado de submissão com `loading / success / error` (Doc 07 §21).
- Visualização em `frontend/src/components/juros/JurosResultado.tsx`:
  - `SummaryCard` com `juros_totais`, `montante_final`, `diferenca_absoluta_simples_vs_composto` (quando aplicável);
  - `DataTable` com a tabela-período (paginada se prazo > 24);
  - `ComparisonChart` (recharts) — composição Juros vs Principal ao longo do tempo; série adicional para Simples quando em modo Comparar;
  - `EducationPanel` com texto nível 1 (placeholder até a F5 enriquecer);
  - `AlertBanner` para níveis `informativo / positivo / atenção / risco` (Doc 07 §17).
- Estados não-felizes tratados por `LoadingState`, `ErrorState`, `EmptyState` já existentes (Sprint 1).
- Consumo da API: cliente em `frontend/src/lib/api/interest.ts` com tipagem derivada do OpenAPI da Sprint 2 (gerada em build ou hand-written estrito).

**Ações.**
1. Criar estrutura acima.
2. Tests (Vitest + Testing Library):
   - `JurosForm.test.tsx` — render, validações client-side, submissão feliz, submissão com erro 422 do backend renderizando mensagem amigável.
   - `JurosResultado.test.tsx` — render com payload fixture; snapshot leve.
   - `page.test.tsx` — integração simples dos dois + estados.
3. Snapshot visual em Playwright (1 viewport fixa — 1280 desktop — Doc 07 §22) em `frontend/tests/visual/juros.spec.ts`.
4. `axe-core` obrigatório na página `/juros` sem `serious`/`critical`.

**Arquivos afetados (F4).**
- `frontend/src/app/(app)/juros/page.tsx` (novo)
- `frontend/src/components/juros/{JurosForm,JurosResultado,JurosTabela,JurosGrafico,JurosAlertas}.tsx` (novos)
- `frontend/src/lib/api/interest.ts` (novo)
- `frontend/src/__tests__/juros/*.test.tsx` (novos)
- `frontend/tests/visual/juros.spec.ts` (novo)
- `docs/sprints/sprint-02/evidencias/F4-fe-coverage.md` (novo)
- `docs/sprints/sprint-02/evidencias/F4-axe-report.md` (novo)
- `docs/sprints/sprint-02/evidencias/F4-visual-snapshot.md` (novo — hash + caminho do PNG)

**DoR (Frontend, Doc 12 §3.2).** Mockup/wireframe (referência: Doc 07 §9); estados de UI definidos; responsividade alvo 1280 desktop (móvel fica como desejável — deixar declarado).

**DoD (Frontend, Doc 12 §4.2).**
- snapshot visual aceito (1 viewport);
- axe-core sem `serious`/`critical`;
- responsividade verificada em 375/768/1280 (Doc 09 §8) — reportar o que funciona e o que fica como pendência residual (se houver);
- estados de UI presentes (`loading / empty / error / success`);
- cobertura `frontend/src/components/juros/` ≥ 85/80.

**Evidências exigidas.** Relatório axe + relatório de cobertura FE + hash do snapshot + URL da PR.

**Riscos específicos.** Divergência entre formatação de moeda FE (locale pt-BR) e resposta do BE → padronizar `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'})` e cobrir em teste. Gráfico com tabela grande (>120 períodos) → virtualização/paginação da tabela; gráfico decimate.

---

### 5.5 Fatia F5 — Conteúdo Educacional + Docs vivos

**Objetivo.** Enriquecer a interpretação pedagógica e os textos de nível 1 e 2 para juros simples e compostos; sincronizar todos os documentos vivos tocados.

**Pré-condições.** F4 merged. Textos placeholder da F4 em produção.

**Ações.**
1. Conteúdo nível 1 (síntese pedagógica, Doc 08 §6) para simples e compostos — linguagem clara, 120–200 palavras por conceito.
2. Conteúdo nível 2 (aprofundamento) — exemplos numéricos alinhados a JS-01 e JC-01 para coerência com Doc 15.
3. Revisão editorial humana (Doc 08 §7) registrada em `docs/sprints/sprint-02/evidencias/F5-revisao-editorial.md`.
4. Lint pedagógico (Doc 08 §20) verde — `make lint:pedagogical` ou equivalente.
5. Atualização de docs vivos tocados ao longo da sprint:
   - Doc 06 — endpoints finalizados;
   - Doc 08 — glossário mínimo (juros, taxa, aporte, montante);
   - Doc 09 — massa confirmada exercida;
   - Doc 15 — marcar quais casos foram exercidos por código (cross-link);
   - Doc 19 — linhas RF-INT-001/002 com os caminhos finais;
   - `docs/_meta/living_docs.json` — data de última modificação atualizada.
   - **Doc 03 — FORA do escopo desta sprint** (decisão binária §7.1/§7.2). Se surgir real necessidade de nota, abrir **Adendo formal** ou **ADR**, nunca edit silencioso.
6. Atualização da planilha operacional com aviso explícito "Sprint 2 — F5 concluída pelo chat [Sprint 2 / chat atual]".

**Arquivos afetados (F5).**
- `frontend/src/content/juros/{nivel-1, nivel-2}.ts` (ou MD)
- `backend/app/services/interest/textos_pedagogicos.py` (se a interpretação é montada no BE)
- Docs vivos acima
- `docs/sprints/sprint-02/evidencias/F5-revisao-editorial.md` (novo)
- `docs/sprints/sprint-02/evidencias/F5-lint-pedagogico.md` (novo)
- Planilha operacional (atualização)

**DoR (Conteúdo, Doc 12 §3.5).** Persona "Iniciante Curioso" identificada; níveis 1 e 2 definidos; responsável editorial designado; artefatos relacionados (glossário) listados.

**DoD (Conteúdo, Doc 12 §4.5).**
- fluxo editorial completo;
- versionamento bumpado em `docs/_meta/living_docs.json` se o esquema exigir;
- lint pedagógico verde;
- glossário mínimo atualizado.

**Evidências exigidas.** Relatório editorial + relatório do lint pedagógico + commit que fecha o bump.

**Riscos específicos.** Texto contradizendo número (Doc 08 §6.5) — mitigação: toda afirmação numérica no texto referencia um campo do `summary` por nome, não por literal. Over-engineering pedagógico — manter nível 1 em 120–200 palavras.

---

### 5.6 Fatia F6 — Fechamento + Governança (Impact Agent `blocking` é CONDICIONAL)

**Objetivo.** Fechar oficialmente a Sprint 2: materializar relatórios de fechamento, atualizar planilha operacional com aviso do chat, e deixar o `main` pronto para a Sprint 3. **A elevação do Impact Agent para `blocking` NÃO é objetivo obrigatório de fechamento** — é governança **CONDICIONAL** com kill-switch (§3.4). A posição-padrão é **preservar `advisory`**.

**Pré-condições.** F5 merged. Todos os gates CORE verdes. Cobertura conforme §3.4.

**Ações.**
1. **Impact Agent → `blocking` — CONDICIONAL com kill-switch.** Esta ação **só é executada se, cumulativamente**, os três gatilhos abaixo forem verdadeiros:
   - (a) **baixa fricção comprovada** — os relatórios do agente anexados às PRs F2–F5 mostram **zero bloqueios espúrios** (ou qualquer fricção foi explicada);
   - (b) **sprint dentro do budget** — F2–F5 mergearam sem residual vermelho e há folga de tempo suficiente para abrir a PR da promoção, rodar o dry-run e consertar falso-positivos caso apareçam;
   - (c) **aprovação explícita do PO** na revisão de fim de F5.

   **Default = kill-switch acionado = preservar `advisory`.** Se qualquer gatilho falhar, a promoção **é removida da Sprint 2** e registrada como pendência para Sprint 3 ou sprint contínuo P-Refino, com ADR curta descrevendo a decisão.

   Se, e **somente se**, os três gatilhos passarem:
   - ajustar `scripts/impact_analysis_guard.py` (flag `--mode blocking` como default ou step do CI com `--mode blocking`);
   - ajustar `.github/workflows/ci.yml` — o step do agente sai de `continue-on-error: true` para `false`;
   - **provar o bloqueio funcionando:** abrir uma PR de controle intencionalmente violadora (ou dry-run em branch local) e capturar a rejeição em `docs/sprints/sprint-02/evidencias/F6-impact-agent-bloqueando.md`;
   - manter rota de escape documentada (override acessível apenas a mantenedores, com log) para evitar trava em falso positivo.

   Qualquer que seja o resultado (promovido ou preservado), registrar a decisão e a justificativa em `docs/sprints/sprint-02/evidencias/F6-impact-agent-decisao.md`.
2. Criar `docs/sprints/sprint-02/relatorio-execucao.md` (canônico, conforme gabarito da Sprint 1 e Sprint 0) — narrativa cronológica, fatias, decisões, evidências.
3. Criar `docs/sprints/sprint-02/relatorio-forense.md` — divergências encontradas entre documentado e real, correções aplicadas, débito residual.
4. Criar `docs/sprints/sprint-02/validacao-oficial.md` — veredito: APROVADA / APROVADA COM LIBERAÇÃO CONDICIONADA / REPROVADA; lista de condicionantes se houver.
5. Preencher checklist `25_Release_Readiness.md` para Sprint 2 (Doc 12 §4.8) — mesmo que não haja deploy, manter a prática.
6. Atualizar planilha operacional com o aviso final "Sprint 2 — FECHADA em [data]; chat de origem: Sprint 2 / chat atual".
7. Criar FECHAMENTO_SPRINT_2.md no espelho `Matemática Financeira/SPRINTS DESENVOLVIDAS/sprint-2/` para paridade com a convenção da Sprint 1.

**Arquivos afetados (F6).**
- `docs/sprints/sprint-02/relatorio-execucao.md` (novo — **CORE**)
- `docs/sprints/sprint-02/relatorio-forense.md` (novo — **CORE**)
- `docs/sprints/sprint-02/validacao-oficial.md` (novo — **CORE**)
- `docs/sprints/sprint-02/evidencias/F6-impact-agent-decisao.md` (novo — **CORE**, registra a decisão: promover ou preservar)
- `FECHAMENTO_SPRINT_2.md` (espelho na pasta de governança — **CORE**)
- Planilha operacional (atualização final — **CORE**)
- `scripts/impact_analysis_guard.py` (atualização — **só se condicional aprovada**)
- `.github/workflows/ci.yml` (atualização — **só se condicional aprovada**)
- `docs/sprints/sprint-02/evidencias/F6-impact-agent-bloqueando.md` (novo — **só se condicional aprovada**)

**DoR (Infra/Segurança, Doc 12 §3.7).** Impacto em ambientes: somente CI; sem impacto em HML/PROD. Janela e rollback: reverter é `git revert` do PR da F6. Para o bloco condicional do Impact Agent, DoR adicional: três gatilhos do §5.6 ação 1 avaliados e registrados.

**DoD (Release, Doc 12 §4.8) — sempre obrigatório.**
- três relatórios de sprint (execução, forense, validação-oficial) publicados;
- `docs/sprints/sprint-02/evidencias/F6-impact-agent-decisao.md` presente com decisão fundamentada;
- checklist `25_Release_Readiness.md` 100%;
- smoke pós-merge verde na `main`;
- janela de observação 30 min sem regressão;
- planilha operacional atualizada com aviso do chat.

**DoD (Infra/Segurança, Doc 12 §4.7) — só se condicional aprovada.**
- IaC/CI atualizado (`.github/workflows/ci.yml`);
- runbook atualizado (elevar modo do agente gera novo comportamento);
- **prova explícita do bloqueio** anexada (`F6-impact-agent-bloqueando.md`).

**Evidências exigidas.** Relatórios + decisão do Impact Agent (sempre) + URL da PR + log do bloqueio funcionando (se promovido).

**Riscos específicos.** (a) Promover sem os três gatilhos e trancar CI por falso positivo → kill-switch §3.4 impede. (b) Nunca desligar via `continue-on-error: true` silenciosamente — se no futuro houver necessidade de voltar a `advisory`, declarar em ADR explícita. (c) Não confundir "preservar `advisory`" com "omitir decisão" — o relatório F6-impact-agent-decisao.md é obrigatório independente da escolha.

---

## 6. Estratégia de testes — mapeamento nas 14 camadas (Doc 09 §5)

| Camada | Uso na Sprint 2 | Fatia |
|---|---|---|
| 1. Unitário | `domain/interest/{simple,compound,_rounding}`; `services/interest` | F2, F3 |
| 2. Componente (FE) | `JurosForm`, `JurosResultado`, componentes-filho | F4 |
| 3. Integração | rota → service → domínio → (sem repo, pois Sprint 2 não persiste) | F3 |
| 4. Contrato | schemathesis sobre OpenAPI dos 3 endpoints novos | F3 |
| 5. Regressão (matemática/pedagógica/contrato) | diff de 100 cenários (F2); regressão pedagógica vs textos (F5) | F2, F5 |
| 6. Snapshot | UI (`JurosResultado`); OpenAPI runtime (diff anexado) | F3, F4 |
| 7. E2E | **fora do escopo**; snapshot visual leve cobre o essencial (Doc 09 §8) | — |
| 8. Acessibilidade | axe-core em `/juros` | F4 |
| 9. Performance e carga | **fora do escopo**; reservar para P-Refino | — |
| 10. Mutação | mutmut em `backend/app/domain/interest/` (semanal obrigatório, gate 80%) | F2 |
| 11. Segurança | SAST já corre em CI; sem mudanças de superfície sensível | (herdado) |
| 12. Recuperação | **não aplicável** (sem persistência) | — |
| 13. Smoke | após cada merge na `main` (CI existente); smoke explícito após F6 | F6 |
| 14. Manuais orientados | revisão visual `/juros` pelo PO antes do F4 mergear | F4 |

**Referência cruzada:** `AUDITORIA_PROMPT_1_FINAL/docs/governanca_qualidade/ESTRATEGIA_DE_TESTES_DE_CLASSE_MUNDIAL.md` e `.../PIPELINE_E_QUALITY_GATES.md` são as fontes operacionais — este plano não duplica a matriz dos 43 tipos, apenas a referencia.

---

## 7. Estratégia documental — **bloco IMPACTO DOCUMENTAL** (obrigatório por PR)

Conforme `POLITICAS/POLITICA_OPERACIONAL_DE_SINCRONIZACAO_DOCUMENTAL.md`, toda PR desta sprint traz o bloco abaixo no corpo da descrição (template):

```markdown
## IMPACTO DOCUMENTAL

**Sprint / Fatia:** Sprint 2 / F<N>
**Chat de origem:** Sprint 2 — chat atual
**Data:** YYYY-MM-DD

### Docs vivos tocados nesta PR
- [ ] docs/06_API_e_Contratos.md — <diff resumido>
- [ ] docs/08_Conteudo_Educacional.md — <diff resumido>
- [ ] docs/09_Qualidade_Testes.md — <diff resumido>
- [ ] docs/15_Casos_de_Teste_Matematicos.md — <cross-links>
- [ ] docs/19_Matriz_Rastreabilidade.md — linhas RF-INT-001 / RF-INT-002
- [ ] docs/_meta/living_docs.json — versão/data

### Artefatos de sprint
- docs/sprints/sprint-02/<arquivo> — <descrição>
- docs/sprints/sprint-02/evidencias/<arquivo> — <descrição>

### Planilha operacional
- Atualizada: sim
- Aviso explícito do chat: sim — "Sprint 2 — F<N> [entregue | em curso | bloqueada] pelo chat [Sprint 2 / chat atual]"

### Referências cruzadas
- ADRs: <nenhuma nova | ADR-NNNN>
- Backlog Técnico (Doc 13): itens <BE-NNN, FE-NNN, QA-NNN, CONT-NNN, DOC-NNN>
```

### 7.1 Docs vivos que **vão** ser tocados na Sprint 2

- `docs/06_API_e_Contratos.md` — adicionar as 3 rotas de juros, exemplos request/response, tabela de erros.
- `docs/08_Conteudo_Educacional.md` — glossário mínimo (juros, taxa, aporte, montante); textos nível 1/2.
- `docs/09_Qualidade_Testes.md` — confirmar massa exercida; manter tabela de cobertura atualizada.
- `docs/15_Casos_de_Teste_Matematicos.md` — marcar JS-01..03 e JC-01..03 como **exercidos por código** (cross-link aos testes).
- `docs/19_Matriz_Rastreabilidade.md` — linhas RF-INT-001 e RF-INT-002 com os caminhos definitivos.
- `docs/_meta/living_docs.json` — atualização de datas.

### 7.2 Docs vivos que **não** devem ser tocados (decisão binária)

- **`docs/03_Regras_Matematicas.md` — FORA do escopo documental da Sprint 2.** Decisão binária: nenhuma edição do Doc 03 nesta sprint. As fórmulas de juros simples e compostos já estão canonizadas ali; a Sprint 2 **consome** o Doc 03, não o altera. Se — e somente se — o exercício da implementação revelar ambiguidade, erro ou lacuna material no Doc 03, a correção **não** entra por edit direto: abre-se **Adendo formal** (artefato separado) ou **ADR**, com aprovação do PO, **fora** do fluxo normal das PRs de fatia.
- `docs/04_Arquitetura_de_Software.md` — a Sprint 2 não altera arquitetura.
- `docs/11_Prompt_Mestre.md` (baseline) — imutável por política.
- ADRs 0001–0014 — não são reabertas nesta sprint.

### 7.3 Artefatos de sprint (obrigatórios ao fim da F6)

- `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` (este arquivo, a ser portado)
- `docs/sprints/sprint-02/relatorio-execucao.md`
- `docs/sprints/sprint-02/relatorio-forense.md`
- `docs/sprints/sprint-02/validacao-oficial.md`
- `docs/sprints/sprint-02/evidencias/` (coleção listada nas fatias)

---

## 8. Governança operacional

### 8.1 Regime de PR e de branch

- **Modelo único — branch-por-fatia derivada de `main`** (§4.1). Não existe branch-mãe `sprint-2` persistente.
- Cada fatia abre sua própria branch `sprint-2/fN-<slug>` a partir do `main` já atualizado pelo merge da fatia anterior.
- **Seis PRs atômicas**, uma por fatia, **squash-merge direto em `main`**, em ordem: F1 → F2 → F3 → F4 → F5 → F6. Não há PR agregador final.
- Cada PR passa obrigatoriamente por:
  - CI verde (build, lint, format, typecheck, unit, integration, contract, coverage gates);
  - Impact Agent em modo `advisory` ao longo de F1–F6 — promoção a `blocking` é **CONDICIONAL** (§3.4 e §5.6 ação 1), não automática;
  - revisão humana (PO);
  - bloco IMPACTO DOCUMENTAL preenchido;
  - protocolo §8.6 (staging/commit/pre-commit) evidenciado;
  - planilha operacional atualizada com aviso do chat.

### 8.2 Política de hotfix (Doc 12 §19)

- Se aparecer bug `crítico` no meio da Sprint 2, abrir `fix/hotfix-v2026.MM.DD-N` a partir de `main` com mesmo DoD em modo expresso; smoke pós-deploy + post-mortem em 48h. Hotfix **nunca** sai de uma branch-de-fatia em curso — sai sempre do `main` para não embaralhar escopo de sprint com escopo de correção.

### 8.3 Rollback

- Cada PR é squash-merge, então reverter = `git revert <sha>` no `main`. Nenhuma fatia deixa mudança acoplada a outra.

### 8.4 Impact Agent — regime durante a Sprint 2

Esta seção substitui qualquer ideia anterior de "plano de elevação automática". Só existem dois modos reconhecidos pelo projeto: **`advisory`** (relatório sem bloqueio) e **`blocking`** (reprovação de PR em CI). Não há estágio intermediário chamado `warning` ou equivalente; qualquer menção anterior a `warning` é obsoleta e eliminada nesta revisão.

- **Hoje (início Sprint 2):** modo `advisory` (inferência §2.4, a ser verificada em F1).
- **F1–F6 — estado-padrão:** **mantém `advisory`**. Relatórios do agente anexados a cada PR como evidência de fricção/não-fricção. Nenhuma promoção automática ao longo da sprint.
- **F6 — promoção para `blocking` é CONDICIONAL** (§3.4, §5.6 ação 1): só ocorre se os três gatilhos forem cumulativamente verdadeiros (baixa fricção comprovada em F1–F5 + sprint no budget + aprovação explícita do PO). **Default = preservar `advisory`.**
- **Não promover não reprova a Sprint 2.** A única obrigação inescapável é registrar a decisão em `docs/sprints/sprint-02/evidencias/F6-impact-agent-decisao.md`, com justificativa e destino (permanece em `advisory` com reavaliação em Sprint 3 / P-Refino / ADR).

### 8.5 Claude Code — regras vigentes (Doc 12 §20; Doc 09 §14; CONTEXTO DE CONTINUIDADE §6)

1. Não pular Fase 0.
2. Não pular DoR da categoria.
3. Não fechar item sem DoD da categoria.
4. Atualizar Doc 19 em toda PR.
5. Nunca declarar verde sem evidência anexada.
6. Fato × Inferência × Limitação sempre separados.
7. Nenhum "depois" para dívida documental.
8. Toda PR com bloco IMPACTO DOCUMENTAL e aviso na planilha.
9. **Executar o protocolo obrigatório de staging/commit/pre-commit** (§8.6) em cada fatia.

### 8.6 Protocolo obrigatório de staging/commit/pre-commit (prova por fatia)

O contexto operacional pós-Sprint 1 tornou obrigatório o conjunto de comandos-prova abaixo. Cada fatia da Sprint 2 **deve** executá-los, nesta ordem, e anexar a saída em `docs/sprints/sprint-02/evidencias/FN-staging-proof.md`. Sem essa evidência, a PR da fatia **não fecha DoD**.

**Antes do stage (inspeção do working tree não-staged):**

```bash
# Caminho do repo (exemplo):
# /caminho/para/repo
git diff --name-only
```
Finalidade: listar os arquivos modificados antes do `git add`. Permite confirmar que o conjunto alterado bate com o escopo da fatia e não carrega ruído.

**Depois do stage, antes do commit (inspeção do staging):**

```bash
git diff --cached --name-only
```
Finalidade: confirmar que **exatamente** os arquivos planejados foram staged (nem mais, nem menos). Se divergir do escopo da fatia, desfazer stage e reavaliar.

**Pré-commit hook obrigatório (antes do push):**

```bash
pre-commit run --all-files
```
Finalidade: rodar a suite de hooks (lint, format, typecheck, secret scan etc.) sobre todo o working tree, não só arquivos staged — garante ausência de regressão lateral. Se falhar: **não** commitar; corrigir, voltar ao §8.6 passo 1. Nunca usar `--no-verify`.

**Depois do commit (prova do commit efetivamente gravado):**

```bash
git show --name-only --stat HEAD
```
Finalidade: verificar que o último commit contém exatamente o conjunto esperado + o resumo numérico das alterações (linhas adicionadas/removidas por arquivo). Serve como prova imutável anexada à PR.

**Regra-dura.** O relatório `FN-staging-proof.md` **deve** conter a saída literal dos quatro comandos, com carimbo de data/hora e SHA do commit. Prosa explicativa não substitui a saída. DoD da fatia depende da presença desse relatório.

**Regra complementar.** A saída de `pre-commit run --all-files` é anexada **mesmo quando verde** — é a prova de que o hook foi executado, não apenas de que foi instalado.

### 8.7 Institucionalização dos planos de execução no repo (governança)

A partir desta revisão v1.1, fica **registrada como regra de governança explícita**:

1. **Todo `PLANO_EXECUCAO_SPRINT_XX.md` é artefato oficial versionado no repositório**, localizado em `docs/sprints/sprint-<XX>/00-plano/PLANO_EXECUCAO_SPRINT_<XX>.md`. Não pode viver apenas na pasta de governança no sistema de arquivos do PO.
2. O **plano da Sprint 2 já nasce nesse lugar** — a primeira PR (F1) o materializa no repo como parte do escopo doc-only.
3. **O plano da Sprint 1 deve ser portado retroativamente** para `docs/sprints/sprint-01/00-plano/PLANO_EXECUCAO_SPRINT_1.md` como **artefato histórico oficial**. O porte é trabalho pequeno (copiar o arquivo já existente na pasta de governança, ajustar caminhos internos e declarar-se como "v1.1-histórica, publicada retroativamente em Sprint 2/F1" no histórico de revisões do próprio plano). Esse porte é obrigação da **F1 da Sprint 2**, como parte da PR F1 ou como sub-PR doc-only imediatamente subsequente. Não é aceitável continuar com o plano da Sprint 1 fora do repo.
4. Regra válida retroativa e prospectivamente: Sprint 0 (se aplicável), Sprint 1 (porte retroativo), Sprint 2 (nativo) e todas as sprints seguintes.
5. O plano **não** é imutável depois de mergeado — revisões subsequentes são commits normais sobre o próprio arquivo, com nova linha no histórico de revisões do plano. ADRs arquiteturais que surjam do plano continuam sendo artefatos separados em `docs/adr/`.
6. A existência do plano no repo é **pré-condição operacional** para qualquer fatia de código da sprint. Se, em uma sprint futura, o plano não estiver no repo ainda, a primeira fatia é doc-only (mesma regra aplicada aqui).

O silêncio sobre essa regra acabou. A v1.1 a torna pública e auditável.

---

## 9. Critérios de aceite da Sprint 2 (nível de sprint, não de fatia)

A Sprint 2 é aceita quando **todos os critérios CORE** são verdadeiros. Critérios STRETCH e CONDICIONAL podem ser reportados abaixo do alvo sem reprovar a sprint, **desde que** a pendência esteja declarada nos relatórios de fechamento (§3.4 regra de ouro do kill-switch).

### 9.1 Critérios CORE (obrigatórios para aceitar a Sprint 2)

1. **[CORE]** Endpoints `POST /api/v1/interest/{simple,compound,compare}` existem em `main`, com envelope canônico e tratamento RFC 7807.
2. **[CORE]** Casos do Doc 15 JS-01..03 e JC-01..03 estão exercidos por testes verdes.
3. **[CORE]** `backend/app/domain/interest/` tem cobertura ≥ 95% linhas / 90% branches.
4. **[CORE]** `/juros` entrega resultado compreensível (summary + tabela + gráfico + interpretação + alertas), com `loading/empty/error/success` tratados.
5. **[CORE]** Axe-core verde em `/juros` (sem `serious`/`critical`).
6. **[CORE]** Textos de **nível 1** revisados editorialmente; lint pedagógico verde nos textos entregues.
7. **[CORE]** Docs 06, 19 e `_meta/living_docs.json` atualizados na Sprint 2.
8. **[CORE]** Artefatos `docs/sprints/sprint-02/{00-plano/PLANO_EXECUCAO_SPRINT_2.md, relatorio-execucao.md, relatorio-forense.md, validacao-oficial.md}` presentes.
9. **[CORE]** Plano da Sprint 1 portado retroativamente para `docs/sprints/sprint-01/00-plano/PLANO_EXECUCAO_SPRINT_1.md` (§8.7).
10. **[CORE]** Planilha operacional atualizada com aviso explícito do chat Sprint 2 em **cada** uma das 6 fatias.
11. **[CORE]** `main` verde em CI ao fim de cada PR de fatia; smoke pós-fechamento verde; 30 minutos de observação sem regressão.
12. **[CORE]** Protocolo §8.6 (staging/commit/pre-commit) evidenciado em `docs/sprints/sprint-02/evidencias/FN-staging-proof.md` para cada fatia.
13. **[CORE] Zero residual vermelho em item CORE.** Nenhum critério de §9.1 (CORE 1–12) pode ser entregue abaixo do alvo — sem exceção, sem negociação, sem "declaração que cobre". Se um item CORE quebra, a fatia volta e conserta antes do merge. **Desligamento é prerrogativa exclusiva de itens STRETCH (§9.2) e CONDICIONAL (§9.3)**, e ainda assim sujeito a três condições **cumulativas**:
    - (a) **declaração explícita** na PR da fatia e nos relatórios de fechamento (`relatorio-execucao.md` + `relatorio-forense.md` + `validacao-oficial.md`), citando o item pelo número em §9.2/§9.3;
    - (b) **justificativa auditável** (motivo técnico, risco de atraso medido, gatilho de §3.4 acionado — nunca "ficou sem tempo" solto);
    - (c) **destino concreto atribuído** (Sprint 3 / P-Refino com ticket aberto / ADR criada / Adendo formal publicado), com SHA, número ou caminho do artefato-destino registrado no momento do desligamento.

    Desligamento sem (a)+(b)+(c) é **residual oculto**, é **reprova** de validação-oficial, e deve ser tratado como falha de governança na forense. **A existência de kill-switch não é licença para omissão.**

### 9.2 Critérios STRETCH (meta — reportáveis abaixo do alvo sem reprovar)

14. **[STRETCH]** Mutation ≥ 80% em `backend/app/domain/interest/` **reportado** (se < 80%, registrar como pendência para P-Refino).
15. **[STRETCH]** Diff numérico de 100 cenários anexado e reproduzível.
16. **[STRETCH]** Snapshot visual Playwright aceito em 1 viewport (substituível por snapshot de componente se infra falhar).
17. **[STRETCH]** Textos de **nível 2** (aprofundamento) revisados; Docs 08, 09, 15 atualizados.
18. **[STRETCH]** Responsividade 375/768/1280 verificada em `/juros`.

### 9.3 Critérios CONDICIONAL (governança — sujeitos a kill-switch §3.4)

19. **[CONDICIONAL]** Agente de Impacto em `blocking` com prova operacional do bloqueio — **só se** os três gatilhos do §5.6 ação 1 forem verdadeiros. Caso contrário, decisão documentada de preservar `advisory` é aceitável como fechamento da Sprint 2 (não é reprovação).

---

## 10. Riscos, dependências e bloqueios

| # | Risco / Dependência | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | `main` não está verde no início da F1 | Baixa (Sprint 1 fechou com P15) | Alto (Sprint 2 não começa) | F1 inspeciona primeiro; se falhar, abrir P16 de saneamento antes de criar a primeira branch-de-fatia `sprint-2/f1-preveo`. |
| R2 | Arredondamento HALF_EVEN diverge de expectativa humana em borda | Média | Médio | Isolar `_rounding.py`; cobrir bordas explícitas; documentar decisão no Doc 09. |
| R3 | Hypothesis pesado em CI | Média | Baixo | Limitar `max_examples` por job; rodar job pesado off-peak semanal. |
| R4 | Divergência OpenAPI × contract test | Baixa | Alto | Gerar OpenAPI em CI; schemathesis consome o gerado; diff anexado por fatia. |
| R5 | Gráfico no FE lento com prazo > 120 | Baixa | Baixo | Virtualizar tabela; decimate do gráfico; documentado. |
| R6 | Elevar Impact Agent → falso positivo bloqueador | Média | Médio | **Kill-switch default preserva `advisory`** (§3.4, §5.6 ação 1). Promoção só com os três gatilhos: baixa fricção em F1–F5 + sprint no budget + aprovação explícita do PO. Dry-run antes de fechar F6; rota de escape com log; ADR se exceção estrutural. |
| R7 | Revisão editorial demorar (pendência humana) | Média | Médio | Antecipar texto nível 1 já em F4 como placeholder; F5 só enriquece. |
| R8 | Mutation score < 80% | Média | Médio | Escrever testes de domínio com foco em **invariantes**, não em literais; medir ao fim da F2 e corrigir na mesma fatia. |
| R9 | Divergência de serialização Decimal (string vs number) | Média | Alto | Padronizar em envelope; cobrir por contract test; comunicar em Doc 06. |
| R10 | Tempo total da sprint excedido | Média | Médio | Fatias pequenas; fatia que passar do seu budget é recortada antes de mergear. |

### 10.1 Dependências externas

- Nenhuma dependência de serviço de terceiros para executar esta sprint (cálculo é puro; não há BCB, nem webhook, nem SMTP).
- Dependência de infraestrutura interna: CI, Playwright, Postgres efêmero (somente se integration tests exigirem — caso contrário, `TestClient` puro).

### 10.2 Bloqueios bloqueadores (stop-conditions)

A Sprint 2 é **pausada imediatamente** e volta a revisão se qualquer um acontecer:
- `main` não está verde na Fase 0;
- descobre-se que os endpoints de juros **já existem** no backend (contradiz escopo — plano precisa ser reescrito);
- lint pedagógico quebrado sem plano de correção;
- (Removido da lista de stop-conditions em v1.2: "Impact Agent não sobe para `blocking`" deixou de ser stop-condition — preservar `advisory` é fechamento válido da Sprint 2, §3.4 e §8.4. Só vira stop-condition o cenário em que, **aprovada** a promoção pelos três gatilhos, surge impedimento técnico impossível de resolver na F6 — neste caso, a promoção é desagendada com ADR.)

---

## 11. Pendências honestamente declaradas

| # | Pendência | Natureza | Tratamento |
|---|---|---|---|
| P1 | Fase 0 não executada pela IA (mount é pasta de governança) | Limitação ambiental | Executada pelo operador no CLI autenticado; evidência em `F1`. |
| P2 | OpenAPI runtime atual não inspecionado pela IA | Limitação ambiental | F1 coleta o snapshot pré-mudança e o diff pós-mudança. |
| P3 | `Prompt Sprint 1.docx` usado como referência estrutural em vez do `PLANO_EXECUCAO_SPRINT_1.md` durante parte do Discovery | Limitação transitória (resolvida no fim da sessão — o plano da Sprint 1 foi acessível após o rename da pasta `SPRINTS/` → `SPRINTS DESENVOLVIDAS/`) | Nenhuma — registrada aqui para honestidade histórica. |
| P4 | Massa `tests/fixtures/financial_cases.json` ainda não materializada | Deliberada | F2 materializa como artefato explícito. |
| P5 | Mutation score real é desconhecido até F2 rodar | Deliberada | F2 reporta; se < 80%, corrige na mesma fatia antes de mergear. |
| P6 | E2E Playwright completo de `/juros` fica fora | Deliberada | Documentado como pós-Sprint 2; snapshot visual leve cobre o essencial. |
| P7 | Responsividade mobile (375) é desejável, não obrigatória nesta sprint | Deliberada | F4 reporta o que funciona; o que não funcionar é pendência para P-Refino. |
| P8 | Valor exato de JC-01 a 4 casas (Doc 15 §4 traz "aproximadamente 1.126,83") | Deliberada | Teste calcula referência via `Decimal` e valida exibição com tolerância 0,01. |
| P9 | Cache Redis não implementado no endpoint de juros | Deliberada | Fora do MVP Sprint 2; pode entrar em P-Refino. |

---

## 12. Recomendações operacionais

1. **Aprovar este plano antes de F1.** Qualquer alteração de escopo depois de merge da F1 vira ADR — o custo de ajuste cresce com o tempo.
2. **Executar a Fase 0 do jeito canônico.** Não pular o `git fetch origin --prune` sob alegação de "já fetchei outro dia" — a evidência é o log de HOJE.
3. **Abrir a F1 como PR-doc-only.** Primeira PR da sprint deve ser o plano materializado + evidências de pré-voo; nada de código-novo na F1. Isso garante que o plano foi lido e aceito antes de qualquer compilação ser alterada.
4. **Promoção do Impact Agent para `blocking` é CONDICIONAL — default é preservar `advisory`.** Elevar cedo (F1) transforma o agente em gargalo antes de exercer. Promoção na F6 depende dos três gatilhos em §5.6 ação 1 (baixa fricção em F1–F5 + sprint no budget + aprovação explícita do PO). Se qualquer gatilho falha, o kill-switch §3.4 ativa e a promoção migra para Sprint 3 ou P-Refino com ADR. A decisão (promover ou preservar) é **sempre** registrada em `F6-impact-agent-decisao.md` — nunca omitida.
5. **Nunca mergear fatia com residual vermelho admitido.** Se algo falhou, conserta na fatia; não empurrar para "a próxima".
6. **Planilha operacional é doc vivo.** Atualizada a cada fatia, com aviso explícito do chat de origem. Sem atualização = DoD da fatia não cumprido.
7. **Usar `Decimal` no backend sempre que tocar moeda ou taxa.** Float aparecendo no grep do domínio é red-flag.
8. **Proteger o domínio.** Nada de `datetime.now()`, `requests`, `open`, `print`, `logging` dentro de `backend/app/domain/interest/`. Grep negativo em cada PR de F2.
9. **Número de referência sempre derivado do motor.** Não esconder `1.126,83` como literal em teste; calcular com `Decimal` e comparar com tolerância.
10. **Textos pedagógicos leem campos por nome.** Nunca um texto com número fixo que pode discordar do `summary`.

---

## 13. Apêndice A — tabela de rastreabilidade backlog (Doc 13 §3.4) → arquivos canônicos

| Item Doc 13 | Descrição canônica | Arquivo(s) no repo (caminhos-alvo) | Fatia |
|---|---|---|---|
| BE-006 | Schemas `JurosSimplesIn/Out`, `JurosCompostosIn/Out`, `CompararJurosIn/Out` | `backend/app/schemas/interest.py` | F3 |
| BE-007 | Domínio juros simples | `backend/app/domain/interest/simple.py` | F2 |
| BE-008 | Domínio juros compostos | `backend/app/domain/interest/compound.py` | F2 |
| BE-009 | Service | `backend/app/services/interest/calcular_juros_service.py` | F3 |
| BE-010 | Endpoints | `backend/app/api/v1/interest.py` (+ `router.py`) | F3 |
| FE-010 | Página `/juros` | `frontend/src/app/(app)/juros/page.tsx` | F4 |
| FE-011 | Formulário | `frontend/src/components/juros/JurosForm.tsx` | F4 |
| FE-012 | Visualização | `frontend/src/components/juros/JurosResultado.tsx` + filhos | F4 |
| QA-005 | Unit Doc 15 JS-*/JC-* | `backend/tests/unit/domain/interest/test_simple.py`, `test_compound.py` | F2 |
| QA-006 | Property-based | `backend/tests/unit/domain/interest/test_properties.py` | F2 |
| QA-007 | Integration | `backend/tests/integration/interest/test_*.py` | F3 |
| QA-008 | Contract | `backend/tests/contract/test_interest.py` | F3 |
| QA-009 | Visual snapshot | `frontend/tests/visual/juros.spec.ts` | F4 |
| CONT-001 | Textos nível 1 e 2 | `frontend/src/content/juros/*` (ou `backend/app/services/interest/textos_pedagogicos.py`) | F5 |
| DOC-003 | Docs 06/09/19 | `docs/06_*`, `docs/09_*`, `docs/19_*` | F3, F5 |

---

## 14. Apêndice B — tabela de rastreabilidade HU (Doc 12 §9) → fatia

| HU | Descrição | Fatia |
|---|---|---|
| HU-010 | Calcular juros simples e obter resultado completo | F2 + F3 |
| HU-011 | Calcular juros compostos (com e sem aporte) | F2 + F3 |
| HU-012 | Comparar simples vs composto | F3 |
| HU-013 | Ver tabela período, gráfico, interpretação e alertas | F3 (payload) + F4 (UI) + F5 (texto) |

---

## 15. Apêndice C — lições herdadas da Sprint 1 ativas nesta sprint

1. **Fatia pequena, PR atômica, squash-merge.** Seis PRs.
2. **Evidência em log, não em prosa.** `docs/sprints/sprint-02/evidencias/` com saídas reais.
3. **IMPACTO DOCUMENTAL em toda PR.** Sem exceção.
4. **Planilha operacional com aviso do chat.** Cada atualização menciona o chat de origem.
5. **Fase 0 antes de qualquer coisa.** Sem o log, não se começa.
6. **Sem flakiness.** Rotas/config determinísticos; nada gated só por `APP_DEBUG`.
7. **Sem residual vermelho admitido.** Gate quebrado → volta e conserta.
8. **Docs vivos na mesma PR que toca o comportamento.** Dívida documental para "depois" não existe.
9. **Fato × Inferência × Limitação explícitos.** Este plano carrega o rótulo em §2.

---

**FIM DO PLANO — versão 1.2 — Sprint 2.**
Aguardando aprovação do Product Owner para iniciar a Fatia F1 (branch `sprint-2/f1-preveo`).
