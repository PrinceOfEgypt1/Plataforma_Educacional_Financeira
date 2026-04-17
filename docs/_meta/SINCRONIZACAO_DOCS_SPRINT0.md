# Sincronização Documental — Sprint 0

**Data:** 17 de abril de 2026
**Sprint:** 0 — Fechamento Forense
**Status:** ENCERRADO

---

## 1. Artefatos materializados no Sprint 0

| Artefato | Caminho | Tipo | Criado neste sprint |
|----------|---------|------|---------------------|
| Impact Agent | `scripts/impact_analysis_guard.py` | Código | ✅ |
| OpenAPI Exporter | `scripts/export_openapi.py` | Código | ✅ |
| OpenAPI Spec | `docs/api/openapi.json` | Gerado | ✅ |
| ADR-001 Impact Agent | `docs/adr/ADR-001-impact-agent.md` | Governança | ✅ |
| RUN-001 Setup Local | `docs/runbooks/RUN-001-setup-local.md` | Runbook | ✅ |
| RUN-002 Health/Readiness | `docs/runbooks/RUN-002-health-readiness.md` | Runbook | ✅ |
| RUN-003 Recovery | `docs/runbooks/RUN-003-recovery-basic.md` | Runbook | ✅ |
| Inventário de Telas | `docs/ui/INVENTARIO_TELAS.md` | UI/UX | ✅ |
| Design Tokens (TS) | `frontend/src/styles/tokens.ts` | Frontend | ✅ |
| Design Tokens (CSS) | `frontend/src/styles/tokens.css` | Frontend | ✅ |
| Root Layout | `frontend/src/app/layout.tsx` | Frontend | ✅ |
| Home Page | `frontend/src/app/page.tsx` | Frontend | ✅ |
| Global CSS | `frontend/src/app/globals.css` | Frontend | ✅ |
| Test de Tokens | `frontend/src/__tests__/tokens.test.ts` | Teste | ✅ |
| Sync Matrix (este doc) | `docs/_meta/SINCRONIZACAO_DOCS_SPRINT0.md` | Meta | ✅ |

---

## 2. Documentos vivos referenciados em living_docs.json

| ID | Título | Caminho declarado | Existe? | Ação Sprint 0 |
|----|--------|-------------------|---------|---------------|
| doc-01 | Visão do Produto | `docs/baseline/01_Visao_do_Produto.md` | ❌ | Fora do escopo Sprint 0 — conteúdo existe em AUDITORIA_PROMPT_1_FINAL |
| doc-02 | Escopo Funcional | `docs/02_Escopo_Funcional.md` | ❌ | Idem |
| doc-03 | Regras de Negócio | `docs/baseline/03_Regras_de_Negocio.md` | ❌ | Idem |
| doc-04 | Arquitetura de Software | `docs/04_Arquitetura_de_Software.md` | ❌ | Idem |
| doc-05 | Modelagem de Dados | `docs/05_Modelagem_de_Dados.md` | ❌ | Idem |
| doc-06 | API e Contratos | `docs/06_API_e_Contratos.md` | ❌ | Parcialmente coberto por openapi.json |
| doc-09 | Qualidade e Testes | `docs/09_Qualidade_Testes.md` | ❌ | Conteúdo existe em AUDITORIA_PROMPT_1_FINAL |
| doc-19 | Matriz Rastreabilidade | `docs/19_Matriz_Rastreabilidade.md` | ❌ | Pendente Sprint 1 |
| doc-27 | Versionamento de API | `docs/27_Versionamento_API.md` | ❌ | Pendente Sprint 1 |

**Justificativa:** Os documentos de living_docs.json existem como artefatos de
auditoria/design em AUDITORIA_PROMPT_1_FINAL/ (pasta de análise). A migração
desses documentos para `docs/` é ação explícita do Sprint 1, não do Sprint 0.
O Sprint 0 se limitou a infraestrutura e scaffold — não ao conteúdo de produto.

---

## 3. Documentos impactados pelos artefatos do Sprint 0

| Documento impactado | Impacto | Atualizado? | Motivo se não |
|--------------------|---------|-------------|---------------|
| `docs/adr/ADR-001-impact-agent.md` | Criação nova | ✅ criado | — |
| `docs/api/openapi.json` | Gerado pela app | ✅ gerado | — |
| `docs/ui/INVENTARIO_TELAS.md` | Criação nova | ✅ criado | — |
| `docs/_meta/living_docs.json` | Paths declarados não existem | ⚠️ não atualizado | Atualização de living_docs.json requer decisão sobre onde os docs serão mantidos (repo vs. wiki) — pendente Sprint 1 |
| `README.md` | Setup mudou (alembic.ini, config.py) | ⚠️ não atualizado | Atualização planejada Sprint 1 com guia completo de setup |

---

## 4. Pendências documentais para Sprint 1

- [ ] Migrar docs de AUDITORIA_PROMPT_1_FINAL/ para `docs/` com paths corretos
- [ ] Atualizar `docs/_meta/living_docs.json` com paths reais
- [ ] Atualizar README.md com setup pós-Sprint 0
- [ ] Criar ADR-002 (critérios para promover impact agent para WARNING)
- [ ] Criar `docs/19_Matriz_Rastreabilidade.md`
- [ ] Criar `docs/27_Versionamento_API.md`
