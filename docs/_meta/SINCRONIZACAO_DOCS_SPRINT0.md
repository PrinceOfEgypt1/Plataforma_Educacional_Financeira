# Sincronização de Documentos Vivos — Sprint 00

**Sprint:** sprint-00
**Atualizado em:** 2026-04-17 (adendo de sincronização documental)
**Status da sprint:** APROVADA COM LIBERAÇÃO CONDICIONADA
**Referência:** `docs/sprints/sprint-00/validacao-oficial.md`

---

## 1. Documentos materializados no repositório (Sprint 00 + adendo de sincronização)

### 1.1 Artefatos criados na Sprint 00

| Caminho | Commit |
|---|---|
| `docs/policies/POLITICA_OFICIAL_DE_AUDITORIA_E_RESPONSABILIDADE.md` | 196a471 |
| `docs/adr/ADR-001-impact-agent.md` | 7a83045 |
| `docs/runbooks/RUN-001-setup-local.md` | 7a83045 |
| `docs/runbooks/RUN-002-health-readiness.md` | 7a83045 |
| `docs/runbooks/RUN-003-recovery-basic.md` | 7a83045 |
| `docs/sprints/sprint-00/relatorio-execucao.md` | 196a471 |
| `docs/sprints/sprint-00/relatorio-forense.md` | 196a471 |
| `docs/sprints/sprint-00/validacao-oficial.md` | 196a471 |
| `docs/sprints/sprint-00/evidencias/README.md` | 196a471 |
| `docs/ui/INVENTARIO_TELAS.md` | 7a83045 |
| `docs/api/openapi.json` | 7a83045 |

### 1.2 Pacote AUDITORIA_PROMPT_1_FINAL migrado (adendo de sincronização)

**Docs vivos (22):** 00_INDICE_GERAL, 02_Escopo_Funcional, 04_Arquitetura, 05_Modelagem,
06_API_Contratos, 07_UX_UI, 08_Conteudo_Educacional, 09_Qualidade_Testes,
10_Roadmap, 12_Plano_Operacional, 13_Backlog_Tecnico, 14_Especificacao_Fisica,
15_Casos_Teste_Matematicos, 16_Design_System, 17_Infra_Seguranca,
18_Mapeamento_Regulatorio, 19_Matriz_Rastreabilidade, 20_Catalogo_ADR,
22_LGPD, 23_Observabilidade, 24_Runbooks, 25_Release_Readiness,
26_Seeds_Fixtures, 27_Versionamento_API

**Baseline estático (4):** 01_Visao_Produto, 03_Regras_Negocio, 11_Prompt_Mestre, 21_Governanca_Branches

**Baseline auditoria (5):** relatorio_auditoria, matriz_lacunas, parecer_final,
matriz_vivos_estaticos, fechamento_nao_conformidades

**Baseline governança (1):** GOVERNANCA_RIGIDA_DE_EXECUCAO__CLAUDE_CODE

**ADRs arquiteturais (15):** ADR-0001 a ADR-0014 + INDEX.md → `docs/adr/`

**Qualidade G2–G5 (4):** AGENTE_ANALISE_IMPACTO, ESTRATEGIA_TESTES, PADROES_IMPLEMENTACAO, PIPELINE_QUALITY_GATES

**Runbook template (1):** RB-000-TEMPLATE

### 1.3 Gate forense preservado como evidência histórica

**6 documentos** → `docs/baseline/gate-forense/`

### 1.4 Artefatos operacionais auxiliares

| Caminho | Tipo |
|---|---|
| `docs/operacional/backlog_operacional_acompanhamento.xlsx` | Planilha operacional |
| `docs/sprints/sprint-00/evidencias/Relatorio_Sprint0_FORENSE.docx` | Evidência de sprint |
| `docs/sprints/sprint-00/evidencias/Relatorio_Sprint0_Plataforma_Educacional_Financeira.docx` | Evidência de sprint |

### 1.5 Novas políticas vigentes

| Caminho | Versão |
|---|---|
| `docs/policies/POLITICA_OPERACIONAL_DE_SINCRONIZACAO_DOCUMENTAL.md` | 1.0.0 |

---

## 2. Condições remanescentes da Sprint 00

| # | Condição | Status |
|---|---|---|
| C1 | Migrar docs de especificação para o repo e atualizar `living_docs.json` | ✅ RESOLVIDO — adendo de sincronização |
| C2 | `SINCRONIZACAO_DOCS_SPRINT0.md` no caminho correto | ✅ Resolvido em commit 196a471 |
| C3 | Confirmar identidade e caminho de `doc-27` | ✅ RESOLVIDO — `docs/27_Versionamento_API.md` migrado |

**Condições C1 e C3 foram resolvidas nesta rodada de sincronização.**

---

## 3. Itens excluídos explicitamente da documentação oficial

Os seguintes itens foram verificados e NÃO migrados para o repo conforme §5 da política:

- `.pytest_cache/` (no GATE_FORENSE_PROMPT_2)
- `__pycache__/` (nos pacotes externos)
- `*.pyc`
- Arquivos temporários de ferramenta
- `~$ompt Sprint 0.docx` (arquivo temporário do Word, lock file)

---

*Atualizado em: 2026-04-17 | Adendo de sincronização documental Sprint 00*
