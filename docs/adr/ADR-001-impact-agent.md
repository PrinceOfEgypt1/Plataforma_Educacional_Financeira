# ADR-001: Impact Analysis Guard — Agente de Análise de Impacto

**Data:** 17 de abril de 2026
**Status:** ACCEPTED
**Sprint:** Sprint 0 — Fechamento Forense
**Arquivo:** `scripts/impact_analysis_guard.py`

---

## Contexto

A Plataforma Educacional Financeira possui 11 domínios financeiros com
lógica matemática crítica. Mudanças transversais (config, migrations, domain)
têm alto potencial de causar regressões silenciosas. Precisamos de um mecanismo
que observe o risco de cada PR antes de merge.

## Decisão

Implementar o **Impact Analysis Guard** (`scripts/impact_analysis_guard.py`)
com evolução em três estágios progressivos, cada um exigindo ADR dedicado.

| Estágio    | Comportamento                          | Exit code      | Ativado em       |
|------------|----------------------------------------|----------------|------------------|
| ADVISORY   | Reporta risco, nunca bloqueia          | sempre 0       | **Sprint 0 atual** |
| WARNING    | Bloqueia se risk == CRITICAL           | 1 se CRITICAL  | Requer ADR-002   |
| BLOCKING   | Bloqueia se risk >= HIGH               | 1 se >= HIGH   | Requer ADR-003   |

## Estágio atual: ADVISORY

O agente:
- Analisa `git diff` entre HEAD e base ref (default: HEAD~1)
- Classifica arquivos por camada: domain, api, migration, config, fe_components, etc.
- Classifica arquivos por domínio de negócio (11 domínios mapeados)
- Calcula nível de risco: LOW / MEDIUM / HIGH / CRITICAL
- Emite avisos cross-cutting (ex: migration + api na mesma PR)
- Gera advisory com ações recomendadas por camada
- **Exit code sempre 0** — nunca bloqueia pipeline

## Integração atual

**Local:** `make impact` (target no Makefile raiz)
**CI:** ainda não integrado — próxima ação pós-Sprint 0

## Critérios de promoção para WARNING (requer ADR-002)

- [ ] Estágio ADVISORY operacional por ≥ 2 sprints consecutivos
- [ ] Taxa de aderência às recomendações ≥ 70% nas PRs revisadas
- [ ] Pelo menos 1 caso documentado onde o agente detectou risco real
- [ ] Equipe validou os thresholds de CRITICAL (zero falsos positivos aceitáveis)

## Critérios de promoção para BLOCKING (requer ADR-003)

- [ ] Estágio WARNING operacional por ≥ 3 sprints
- [ ] False positive rate para CRITICAL < 5% medido empiricamente
- [ ] Mecanismo de supressão pontual documentado (SKIP=impact)
- [ ] Treinamento da equipe nos critérios de supressão realizado

## Manutenção do agente

Quando adicionar novo domínio ou camada:
1. Atualizar `LAYER_MAP` e `DOMAIN_MAP` em `scripts/impact_analysis_guard.py`
2. Atualizar este ADR com o novo mapeamento
3. Rodar `make impact --base HEAD~1` após mudança para validar saída

## Consequências

**Positivas:**
- Visibilidade imediata do risco de cada PR
- Base empírica para promoção a WARNING/BLOCKING
- Trilha auditável de risco por commit

**Negativas:**
- Overhead local mínimo (~1s de execução no git diff)
- Requer atualização manual dos mapas quando domínios são adicionados
