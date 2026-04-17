# DOCUMENTO 13 — BACKLOG TÉCNICO DETALHADO
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente)
**Tipo:** Backlog Técnico Detalhado por Sprint
**Status canônico:** VIVO

---

## 1. Finalidade
Decompor o Doc 12 em tarefas técnicas concretas, com vinculação obrigatória a **REQ-ID** (Doc 19), **contrato** (Doc 06), **schema** (Doc 14), **testes** e **documentos vivos** a atualizar.

## 2. Convenções

### 2.1 Prefixos
- `FE-` Frontend
- `BE-` Backend
- `QA-` Testes/Qualidade
- `DOC-` Documentação
- `OPS-` Operação/Setup/Infra
- `CONT-` Conteúdo educacional
- `SEC-` Segurança
- `ADR-` Decisão Arquitetural

### 2.2 Estrutura padrão de cada item
```
ID: BE-005
Título: Schemas de juros (request/response)
REQ-ID: RF-INT-001, RF-INT-002
Domínio: interest
Contrato impactado: SIM (cria JurosSimplesIn/Out, JurosCompostosIn/Out)
Schema DB impactado: NÃO
Docs vivos a atualizar: 06, 19, 27
Testes obrigatórios: tests/unit/schemas/test_interest.py; tests/contract/test_interest.py
DoD aplicável: §4.3 (Backend rota nova) — porém este item é só schemas
Estimativa: 3 pontos
Status: pending
```

### 2.3 Regra de ouro
Nenhuma sprint deve encerrar com:
- módulo visual sem contrato estável;
- cálculo sem teste;
- endpoint sem tratamento RFC 7807;
- interface sem estados básicos;
- alteração relevante sem doc viva atualizada;
- regra matemática sem caso do Doc 15.

## 3. Backlog técnico por sprint

### 3.1 Sprint P0 — Patch Documental
- OPS-000 mover docs para `/docs/` (vivo + estático em baseline) — REQ: governança
- OPS-000a configurar `.github/workflows/ci.yml`
- OPS-000b configurar `lefthook.yml` + `.pre-commit-config.yaml`
- OPS-000c criar `Makefile` com alvos canônicos
- OPS-000d criar `docs/_meta/living_docs.json`
- OPS-000e criar templates (`pull_request_template.md`, `CODEOWNERS`)
- ADR-0001..ADR-0014 materializar como arquivos individuais
- OPS-000f instalar agente em modo `advisory`

### 3.2 Sprint 0 — Estrutura base
- OPS-001 estrutura raiz do repositório (REQ: HU-001)
- OPS-002 `.env.example` + `direnv` opcional
- BE-001 inicializar FastAPI + estrutura `app/`
- BE-002 `/health`, `/health/ready`, `/health/live`, `/metrics`
- BE-003 logger structlog + correlation_id middleware
- FE-001 inicializar Next.js + TS estrito
- FE-002 cliente API base (vazio, gera tipos de OpenAPI)
- FE-003 página inicial técnica mínima
- QA-001 teste mínimo do backend (`/health`)
- QA-002 teste mínimo do frontend (render)
- DOC-001 README (setup, scripts, links docs vivos)
- OPS-003 ativar agente de impacto em modo `warning`

### 3.3 Sprint 1 — Layout e contrato-base
- FE-004 layout global; FE-005 sidebar; FE-006 header; FE-007 rotas-base
- FE-008 estados `<UIState />` (loading/empty/error/success)
- FE-009 componentes-base reutilizáveis (Button, Card, Form, Table, Chart wrapper)
- BE-004 contrato-base (envelope canônico de sucesso e RFC 7807)
- BE-005 middleware de cabeçalhos de segurança
- QA-003 contract test base (schemathesis vazio + estrutura)
- QA-004 axe-core na página inicial
- DOC-002 atualizar Doc 04 e Doc 06 com base navegável e contrato
- OPS-004 ativar agente em modo `blocking` ao final

### 3.4 Sprint 2 — Juros (REQ: RF-INT-001, RF-INT-002)
- BE-006 schemas (`JurosSimplesIn/Out`, `JurosCompostosIn/Out`)
- BE-007 domain `interest.simple`; BE-008 `interest.compound`
- BE-009 service `CalcularJurosService` (compose ambos)
- BE-010 endpoints `POST /api/v1/interest/{simple,compound,compare}`
- FE-010 página `/interest`; FE-011 formulário; FE-012 visualização (cards/tabela/gráfico)
- QA-005 unit `tests/regression/financial/interest/` (Doc 15 JS-*, JC-*)
- QA-006 property-based (montante > principal para taxa>0)
- QA-007 integration test
- QA-008 contract test
- QA-009 visual snapshot da página
- CONT-001 textos educacionais nível 1 e 2 (Doc 08)
- DOC-003 atualizar Docs 06, 09, 19 (rastreabilidade)

### 3.5 Sprint 3 — PRICE e SAC (REQ: RF-AMO-001, RF-AMO-002)
- BE-011 schemas amortização; BE-012 domain Price; BE-013 domain SAC; BE-014 service comparativo
- BE-015 endpoints `POST /api/v1/amortization/{price,sac,compare}`
- FE-013/14/15 página, formulário, visualização
- QA-010..QA-014 unit (PR-*, SAC-*), integration, contract, visual
- CONT-002 conteúdos amortização
- DOC-004 atualizações

### 3.6 Sprint 4 — Diagnóstico + Imobiliário
- BE-016..BE-019 Diagnóstico (REQ: RF-DIA-001)
- BE-020..BE-024 Imobiliário (REQ: RF-FIN-001)
- FE-016..FE-021 telas e fluxos
- QA-015..QA-020 testes
- CONT-003 conteúdos
- DOC-005, DOC-006

### 3.7 Sprint 5 — Veículo + Consignado + CDC
- BE-025..BE-036; FE-022..FE-030; QA-021..QA-026; CONT-004; DOC-007
- Atenção regulatória: CET (Doc 18 §2.1)

### 3.8 Sprint 6 — Rotativo + Atraso + Indicadores
- BE-037..BE-049; FE-031..FE-039; QA-027..QA-032; CONT-005; DOC-008

### 3.9 Sprint 7 — Glossário, FAQ, educação contextual
- BE-050..BE-052 conteúdo educacional
- FE-040..FE-044 telas, EducationPanel, microcopy
- QA-033..QA-035 testes (incluindo lint pedagógico)
- CONT-006 glossário ≥25 termos; FAQ ≥15 perguntas
- DOC-009

### 3.10 Sprint 8 — Exportação, responsividade, regressão
- BE-053 exporter PDF; BE-054 exporter Excel; BE-055 rotas export
- FE-045..FE-049
- QA-036..QA-040 (incluindo regressão consolidada)
- DOC-010

### 3.11 Sprint 9 — Investir/Quitar + persistência inicial + cenários salvos
- BE-056..BE-063 (REQ: RF-IVQ-001 + RF-PER-001)
- FE-050..FE-055
- QA-041..QA-045 (incluindo testes de migrations reversíveis)
- CONT-007
- DOC-011

## 4. Ordem real de execução
1. P0 (patch documental + governance ativada)
2. Sprint 0 (estrutura)
3. Sprint 1 (layout + contrato-base)
4. Sprint 2 (juros)
5. Sprint 3 (amortização)
6. Sprint 4 (diagnóstico + imobiliário)
7. Sprint 5 (veículo + consignado + CDC)
8. Sprint 6 (rotativo + atraso + indicadores)
9. Sprint 7 (glossário/FAQ/educação)
10. Sprint 8 (exportação + regressão + fechamento MVP)
11. Sprint 9 (investir/quitar + persistência + cenários salvos)

Em paralelo: P-Refino contínuo.

## 5. Responsabilidades principais
Iguais ao v1.0, complementadas por **CONT-** (conteúdo) e **SEC-** (segurança), com responsável humano explícito por categoria.

## 6. Política de vinculação obrigatória
Todo item de backlog (independente de prefixo) deve ter:
- REQ-ID(s);
- domínio;
- impacto em contrato;
- impacto em schema;
- docs vivos a atualizar;
- testes obrigatórios;
- DoD aplicável.

Sem isso, item **não passa em DoR** (Doc 12 §3).

## 7. Política para a Claude Code
1. Toda PR cita o(s) ID(s) do backlog implementado(s).
2. Toda PR atualiza o status do item correspondente.
3. Toda PR atualiza Doc 19 (rastreabilidade) — uma linha por REQ-ID novo/alterado.
4. Sem misturar refator amplo com mudança funcional sem justificativa.

## 8. Critérios de aceite deste documento
- Itens vinculados a REQ-ID;
- DoR/DoD aplicáveis explicitados por item;
- ordem real de execução documentada;
- política de vinculação obrigatória explicitada.
