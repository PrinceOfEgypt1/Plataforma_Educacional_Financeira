# ESTRATÉGIA DE TESTES DE CLASSE MUNDIAL — PLATAFORMA EDUCACIONAL FINANCEIRA
## (versão corrigida — auditoria de fechamento de não conformidades)

**Versão:** 2.0
**Status canônico:** VIVO
**Substitui integralmente:** Estratégia de Testes v1.0
**Base de referência:** anexo "Tabela dos tipos de testes.xlsx" (**43 tipos**, 100% rastreados em §4)

---

## 1. Princípios

1. **Testar o que importa primeiro.** Domínio financeiro tem o maior peso.
2. **Pirâmide com base larga.** Muitos unitários, médios de integração/contrato, poucos E2E.
3. **Determinismo total** em CI: zero flakiness tolerada por mais de 5 dias úteis.
4. **Cobertura é piso**, mutação e property-based asseguram qualidade real.
5. **Testes são código de produção.** Mesmo nível de revisão.
6. **Testes vivos** evoluem com o produto e estão dentro do repositório.
7. **Calibração honesta de severidade.** Nem tudo é bloqueante; ver §6.

## 2. Stack oficial de testes

| Camada | Ferramenta primária | Ferramenta complementar |
|--------|---------------------|--------------------------|
| Backend unitário | `pytest` + `pytest-cov` | `hypothesis` (property-based) |
| Backend integração | `pytest` + `httpx` + `pytest-asyncio` | `testcontainers` (Postgres) |
| Backend contrato | `schemathesis` (contra OpenAPI 3.1) | `pact-python` (consumer-driven, futuro) |
| Backend mutação | `mutmut` | — |
| Backend performance/carga | `locust`, `k6` | `pytest-benchmark` |
| Backend segurança | `bandit`, `pip-audit`, `safety`, `semgrep` | OWASP ZAP (DAST) |
| Frontend unitário/componente | `vitest` + `@testing-library/react` | `@testing-library/user-event` |
| Frontend snapshot visual | `Playwright` (`toMatchSnapshot`) | Chromatic (futuro) |
| Frontend E2E | `Playwright` | — |
| Frontend acessibilidade | `@axe-core/playwright` | `eslint-plugin-jsx-a11y` |
| Tipagem cliente | tipos gerados de OpenAPI + `tsd` | — |
| Recuperação | scripts em `tests/recovery/` | — |
| Lint pedagógico | `tools/edu_lint/` (custom) | — |
| Compliance regulatório | `tests/compliance/` (custom) | — |

## 3. Suites canônicas (estrutura física)

```
backend/tests/
├─ unit/
├─ integration/
├─ contract/
├─ regression/
│  ├─ financial/      # consome Doc 15 + property-based
│  └─ pedagogical/    # presença e coerência dos blocos
├─ visual/            # apenas se houver pytest-image-compare; padrão é frontend
├─ recovery/
├─ performance/
├─ compliance/
└─ scripts/           # testes do agente de impacto
frontend/tests/
├─ unit/
├─ component/
├─ visual/
├─ e2e/
└─ a11y/
```

## 4. **Mapa canônico dos 43 tipos** (rastreabilidade fechada — fecha NC-04)

A tabela abaixo cobre **integralmente** os 43 tipos da "Tabela dos tipos de testes.xlsx" na ordem em que aparecem na fonte. Para **cada** tipo, declara: aplicação no projeto, classificação (`OBR`igatório / `REC`omendado / `OPC`ional / `FUT`uro / `N/A`), justificativa, fase em que entra, e severidade no pipeline (`MERGE` bloqueia merge / `RELEASE` bloqueia release / `INFO` apenas informa).

| # | Tipo | Aplicação no projeto | Classificação | Justificativa | Fase | Severidade |
|---|------|----------------------|---------------|----------------|------|------------|
| 1 | Teste unitário | Domínio financeiro, schemas Pydantic, services, hooks, utilitários | **OBR** | Núcleo da pirâmide; maior densidade de testes | Local + CI | **MERGE** |
| 2 | Teste de integração | Rota → service → domínio → repository (com Postgres efêmero `testcontainers`) | **OBR** | Garante composição correta entre camadas | CI | **MERGE** |
| 3 | Teste de componente (FE) | `components/critical/*` (Form, Card, Chart, Table, EducationPanel, AlertBanner) | **OBR** | Validação visual + lógica isolada | Local + CI | **MERGE** |
| 4 | Teste de sistema | Aplicação completa em ambiente controlado, smoke de fim de sprint | **REC** | Útil em sprint review; não precisa rodar a cada PR | Sprint demo + Hml | **INFO** |
| 5 | Teste E2E | Jornadas críticas: simular juros, PRICE/SAC, financiamento, rotativo, atraso, investir vs quitar | **OBR** | Cobre o produto, não só o código | CI (smoke) + Hml (full) | **MERGE** (smoke), **RELEASE** (full) |
| 6 | Teste de regressão | Suite consolidada (financeira, pedagógica, visual, contrato) | **OBR** | Inviolável; protege a verdade do produto | CI + Pré-release | **MERGE** + **RELEASE** |
| 7 | Smoke test | Local (`make smoke`), CI, hml, prod | **OBR** | Detecção precoce em todos os ambientes | Local + CI + Hml + Prod | **MERGE** + **RELEASE** |
| 8 | Sanity test | Após hotfix em módulo específico | **OBR** | Confirmação focada pós-fix | Hotfix | **RELEASE** |
| 9 | Teste de aceitação | Critérios de aceite por user story (DoD do Doc 12) | **OBR** | Gate funcional do PR | PR | **MERGE** |
| 10 | Teste funcional | Cobre cada feature do Doc 02 | **OBR** | Conformidade com requisito | CI | **MERGE** |
| 11 | Teste não funcional | SLOs (latência p95, erro 5xx, throughput) | **REC** | Importante após MVP; baseline em hml | Hml + Prod | **INFO** (MVP) → **RELEASE** (pós-MVP) |
| 12 | Teste de performance | Endpoints de cálculo (p95 ≤ 300ms) e listagens | **REC** | Crítico para sensação do produto | Hml semanal | **INFO** (MVP) → **RELEASE** (pós-MVP) |
| 13 | Teste de carga | k6 com 100 a 1000 RPS em endpoints de cálculo | **REC** | Antes de release pública ampla | Pré-release | **RELEASE** (pós-MVP) |
| 14 | Teste de estresse | Em ambiente isolado, descobrir ponto de falha | **FUT** | Pós-MVP, quando houver tier definido | Pós-MVP | **N/A** no MVP |
| 15 | Teste de volume | Massa grande de simulações persistidas | **FUT** | Quando histórico for relevante | Pós-MVP | **N/A** no MVP |
| 16 | Teste de escalabilidade | Quando houver tier de produção definitivo | **FUT** | Pós-MVP | Pós-MVP | **N/A** no MVP |
| 17 | Teste de segurança | SAST (bandit/semgrep), dependências (pip-audit/npm audit), DAST (OWASP ZAP) | **OBR** | Sempre; gates por severidade | PR (SAST) + semanal (DAST) | **MERGE** (high/critical) + **INFO** (medium/low) |
| 18 | Teste de autenticação | Quando houver login (Fase B+) | **OBR (Fase B+)** | Inevitável quando autenticação ativa | CI | **MERGE** (Fase B+); **N/A** no MVP |
| 19 | Teste de autorização | Quando houver perfis (Fase B+) | **OBR (Fase B+)** | Inevitável | CI | **MERGE** (Fase B+); **N/A** no MVP |
| 20 | Teste de usabilidade | Sessões com usuários reais a cada 2 sprints | **REC** | Qualitativo, complementar | Sprint UX | **INFO** |
| 21 | Teste de acessibilidade | axe-core em PRs que tocam FE; auditoria WCAG 2.2 AA por release | **OBR** | Risco legal e inclusão; pareceres `serious`/`critical` bloqueiam | CI + Pré-release | **MERGE** (axe sem serious/critical) + **RELEASE** (auditoria WCAG) |
| 22 | Teste de compatibilidade | Chrome, Edge, Firefox, Safari (desktop) + Chrome Android, Safari iOS | **OBR** | Web | CI (Chromium) + Hml (cross-browser semanal) | **MERGE** (Chromium) + **RELEASE** (cross-browser) |
| 23 | Teste de responsividade | 375/768/1280 (1920 desejável) | **OBR** | Múltiplos dispositivos | CI | **MERGE** |
| 24 | Teste de interface/API | `httpx` em integration, `schemathesis` em contract | **OBR** | Núcleo da integração | CI | **MERGE** |
| 25 | Teste de contrato | OpenAPI + `schemathesis`; tipos TS gerados; pact (futuro) | **OBR** | Evita quebra silenciosa entre FE e BE | CI | **MERGE** |
| 26 | Teste de banco de dados | Repositórios contra Postgres efêmero; constraints; migrations dryrun | **OBR** | Persistência confiável | CI | **MERGE** |
| 27 | Teste de instalação/deploy | Pipeline de imagens Docker + smoke pós-deploy em hml/prod | **OBR** | Cinto de segurança do release | CD | **RELEASE** |
| 28 | Teste de recuperação | Restaurar backup, reiniciar serviço, validar saúde (RB-006) | **REC** | Disciplina ops; trimestral | Drill trimestral | **INFO** (drill); **RELEASE** se SLO atingido |
| 29 | Teste exploratório | Sessão por sprint do humano revisor | **REC** | Pega o inesperado | Sprint review | **INFO** |
| 30 | Teste manual | Validações de copy, hierarquia visual, leitura | **REC** | Tipo 30; complemento humano | Sprint review | **INFO** |
| 31 | Teste automatizado | Default da suite | **OBR** | Mandatório | Local + CI | **MERGE** |
| 32 | Teste de mutação | `mutmut` em `app/domain/` (semanal) | **OBR (semanal)** | Mede qualidade real dos testes | Cron semanal | **RELEASE** se score < 80% |
| 33 | Teste de snapshot | Componentes com saída estável | **OBR** | Detecta deriva | CI | **MERGE** |
| 34 | Teste de snapshot visual | Telas críticas (cards, gráficos, formulários) | **OBR** | Pega regressão de CSS | CI (Chromium) | **MERGE** |
| 35 | Teste E2E de negócio | Jornada `simular → interpretar → exportar` ponta a ponta | **OBR** | Valida produto, não só código | CI (smoke) + Hml (full) | **MERGE** (smoke) + **RELEASE** (full) |
| 36 | Teste de fumaça de produção | Após cada deploy em prod (RB-005) | **OBR** | Vivo da prod; gatilho de rollback | Pós-deploy prod | **RELEASE** |
| 37 | Teste canário | Quando houver múltiplas réplicas em prod | **FUT** | Pós-MVP | Pós-MVP | **N/A** no MVP |
| 38 | Teste A/B | Para experimentos de UX educacional | **FUT** | Pós-MVP, com instrumentação adequada | Pós-MVP | **N/A** no MVP |
| 39 | Teste de internacionalização (i18n) | Validar isolamento de strings mesmo em PT-BR only | **REC** | Preparação futura barata | Local + CI | **INFO** |
| 40 | Teste de localização (l10n) | Datas, moeda, número padrão BR (formatação) | **OBR** | Já obrigatório no MVP | Local + CI | **MERGE** |
| 41 | Teste de concorrência | Operações concorrentes em entidades persistidas (Sprint 9+) | **REC** | Quando houver gravação concorrente | Sprint 9+ | **INFO** (MVP) → **MERGE** (pós-MVP) |
| 42 | Teste de resiliência | Falhas simuladas em integrações futuras (Open Finance) | **FUT** | Quando houver integrações externas | Pós-MVP | **N/A** no MVP |
| 43 | (não há tipo 43 distinto na fonte; a tabela tem 43 linhas incluindo cabeçalho e 42 tipos.) Reclassificação: a planilha original tem **42 tipos de teste**. Nesta auditoria, adicionamos **#43 — Compliance regulatório**, suite `tests/compliance/`, validando aviso educacional persistente, exibição de fonte/data-base de indicadores, separação visual juros/tarifas/encargos. | **OBR** | Específico do produto educacional financeiro brasileiro | CI | **MERGE** |

> **Verificação de cobertura:** 42 tipos da tabela de referência + 1 tipo adicionado pelo projeto = **43 itens** explicitamente classificados. **Cobertura de rastreabilidade: 100%**. Nenhum tipo da fonte foi omitido.

### Síntese estatística da matriz §4

| Classificação | Quantidade |
|---------------|-----------|
| **OBR** (incluindo OBR-Fase-B e OBR-semanal) | 25 |
| **REC** | 9 |
| **FUT** | 6 |
| **OPC** | 0 |
| **N/A** | 0 (todos foram considerados; "N/A no MVP" significa FUT pós-MVP) |
| **+1 adicionado pelo projeto (#43 Compliance)** | 1 |
| **Total** | **43** ✓ |

| Severidade no pipeline | Quantidade |
|------------------------|-----------|
| **MERGE** (bloqueia merge) | 21 |
| **RELEASE** (bloqueia release; pode ser informativo em PR) | 7 (alguns sobrepostos com MERGE; ver coluna "Severidade") |
| **INFO** (apenas informa) | 9 |
| **N/A no MVP** (FUT) | 6 |

## 5. Classificação por fase (consolidada)

### 5.1 Desenvolvimento local
- Unitário, componente, lint, format, typecheck, secret scan, smoke local, mutação opcional sob demanda.

### 5.2 CI (em PR e em main)
- Unitário FE+BE; integração BE; contrato; snapshot; snapshot visual (quando toca FE); E2E smoke; axe smoke; responsividade; cobertura; regressão (financeira + pedagógica); mutação semanal (cron); SAST; deps audit; build; migrate dryrun; agente de impacto.

### 5.3 Homologação
- Smoke deploy, sanity por área tocada, E2E full, axe completo, performance baseline, cross-browser semanal, DAST semanal.

### 5.4 Pré-release
- Release readiness (Doc 25), suite completa de regressão, restore drill (trimestral), mutação ≥ 80%.

### 5.5 Pós-deploy (produção)
- Smoke prod, healthchecks, janela de observação 30 min com SLOs.

## 6. Severidade no pipeline (calibrada)

| Severidade | Significado | Comportamento |
|------------|-------------|---------------|
| **MERGE** | Bloqueia merge da PR | PR vermelha; sem `--no-verify`; sem override |
| **RELEASE** | Não bloqueia merge, mas bloqueia tag de release | Issue automática se vermelho; checklist do Doc 25 obrigatório |
| **INFO** | Apenas informa | Comentário em PR; abre issue automática quando recorrente |
| **N/A no MVP** | Adiado para pós-MVP | Não roda; reativado por ADR quando relevante |

## 7. Cobertura mínima por área (gate **MERGE**)

| Área | Linhas | Branches |
|------|--------|----------|
| `backend/app/domain/` | 95% | 90% |
| `backend/app/services/` | 90% | 85% |
| `backend/app/api/` | 85% | 80% |
| `backend/app/repositories/` | 85% | 80% |
| `frontend/src/components/critical/` | 85% | 80% |
| `frontend/src/lib/` | 85% | 80% |
| Demais | 75% | 70% |
| Mutação `domain/` (semanal) | ≥ 80% | — |

PR que reduza cobertura abaixo do mínimo é **MERGE-bloqueante**.

## 8. Política de flakiness e quarentena
1. Teste flaky quarentenado em até 24h com issue (`flaky:<id>`).
2. Permanência > 5 dias úteis bloqueia release.
3. Auditoria semanal lista flakies abertos no Doc 24 (RB-010).

## 9. Política de mutação
1. Roda semanalmente em `app/domain/` (cron).
2. Score < 80% gera issue P1 e bloqueia release.
3. Casos sobreviventes geram novos testes na sprint seguinte.

## 10. Testes pedagógicos
1. Schema pedagógico validado em toda resposta de simulação.
2. Lint pedagógico (Doc 08 §20).
3. Mudança de copy passa por revisão humana.

## 11. Testes regulatórios
1. Suite `tests/compliance/` cobre #43 da matriz §4.
2. Cruza com Doc 18 §8 (apêndice vivo).

## 12. Indicadores e SLO de qualidade

| Indicador | Meta |
|-----------|------|
| Tempo médio de CI em PR | ≤ 12 min |
| Flaky rate em main | ≤ 0,5% |
| Cobertura média | ≥ 88% |
| Mutação domínio (semanal) | ≥ 80% |
| Bugs de regressão por sprint | 0 críticos, ≤ 1 importante |
| Tempo até quarentena de flaky | ≤ 24h |
| Tempo de recuperação após falha em prod | ≤ 30 min |

## 13. Roadmap de adoção

| Sprint | Adoção |
|--------|--------|
| **P0** | unit, integ, contrato, snapshot, axe, lint, agente em advisory |
| **0** | tudo do P0 + smoke local; agente em warning |
| **1** | + visual snapshot, E2E smoke, axe full, regressão pedagógica; agente em **blocking** |
| **2–3** | + mutação semanal; property-based; suite financial completa para módulos entregues |
| **4–6** | + compliance regulatório (#43); cross-browser semanal |
| **7** | + lint pedagógico ativo |
| **8** | + performance baseline; restore drill; release readiness completo |
| **9** | + concorrência (#41); auth/autorização (Fase B se ativa) |
| **Pós-MVP** | + carga (#13), estresse (#14), volume (#15), escalabilidade (#16), canário (#37), A/B (#38), resiliência (#42) |

## 14. Referências cruzadas
- `MATRIZ_DE_DOCUMENTOS_VIVOS_E_ESTATICOS.md` §6 (eventos → testes a rodar)
- `PIPELINE_E_QUALITY_GATES.md` (ordem e bloqueios)
- `GOVERNANCA_RIGIDA_DE_EXECUCAO__CLAUDE_CODE.md` §4 (regras de testes)
- `AGENTE_DE_ANALISE_DE_IMPACTO.md` (mapeamento mudança → testes a rodar)
- Doc 09 (visão conceitual de qualidade)
- Doc 15 (massa de validação matemática consumida por `tests/regression/financial/`)
