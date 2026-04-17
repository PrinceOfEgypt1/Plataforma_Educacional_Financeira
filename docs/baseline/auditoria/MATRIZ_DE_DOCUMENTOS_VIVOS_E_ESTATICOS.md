# MATRIZ DE DOCUMENTOS VIVOS E ESTÁTICOS — PLATAFORMA EDUCACIONAL FINANCEIRA
## (versão corrigida — auditoria de fechamento de não conformidades)

**Versão:** 2.0
**Status:** ESTÁTICO — fixa categorias e política. Mudança apenas por nova rodada de auditoria.
**Substitui integralmente:** Matriz v1.0.

---

## 1. Categorias oficiais

Quatro categorias canônicas (e somente essas):

### 1.1 VIVO
Documento atualizado **durante o desenvolvimento**, em sincronia com o código, sempre que ocorrer mudança em sua área. Vive **obrigatoriamente dentro do repositório**, versionado em Git, sujeito a revisão em PR, validado pelo agente de impacto.

### 1.2 ESTÁTICO
Documento de natureza **fundacional**, que **não muda em desenvolvimento normal**. Mudança exige **rebaseline formal** (ADR + tag Git `baseline-vYYYY.MM.DD-docXX`).

### 1.3 HÍBRIDO
Documento cujo **núcleo é estático** e que possui **apêndice vivo** explicitamente delimitado por marcadores `<!-- BEGIN APÊNDICE VIVO -->` / `<!-- END APÊNDICE VIVO -->`. Núcleo segue regra de estático; apêndice segue regra de vivo.

### 1.4 BASELINE CANDIDATA *(nova categoria; fecha NC-03)*
Documento **congelado por design** durante o desenvolvimento, mas com **rebaseline obrigatório** disparado por gatilhos formais específicos. Diferente de "estático puro" porque carrega expectativa explícita de atualização periódica e disciplinada. Diferente de "vivo" porque não muda por PR comum.

**Aplica-se exclusivamente** ao **Documento 11 — Prompt-Mestre de Desenvolvimento** (justificativa em §4).

**Gatilhos de rebaseline obrigatório:**
1. Conclusão do **Prompt 2 — Gate Forense de Prontidão para Execução** (rebaseline 1).
2. Rebaseline formal do **Doc 03** (Regras de Negócio e Matemática Financeira).
3. Rebaseline formal do **Doc 04** (Arquitetura de Software) com mudança de stack ou de fronteira de módulo.
4. Mudança de **fase** do roadmap (Doc 10): de A para B, B para C, etc.
5. Decisão arquitetural transversal nova com efeito cross-cutting (ADR aceito de impacto amplo).
6. Auditoria sênior posterior (Prompt 3+, se houver).

**Política de mudança:**
- Sem PRs comuns alterando o Doc 11.
- Cada rebaseline gera tag `baseline-vYYYY.MM.DD-doc11` + ADR + assinatura do responsável de governança.
- Histórico de versões mantido no rodapé do próprio Doc 11.

## 2. Inventário canônico fixado (33 documentos)

> **Decisão de contagem (fecha NC-02):** a partir desta versão, o inventário canônico contém **33 documentos**. A planilha operacional `backlog_operacional_acompanhamento.xlsx` é tratada como **artefato anexo** (A1) e **não conta como documento**, evitando ambiguidades anteriores. A "Tabela dos tipos de testes.xlsx" é referência de entrada (insumo da auditoria), também tratada como anexo.

### 2.1 Originais (19 documentos: Doc 00 a Doc 18)

| # | Documento | Categoria | Local oficial no repositório |
|---|-----------|-----------|-------------------------------|
| 00 | Índice Geral | **VIVO** | `/docs/00_INDICE_GERAL.md` |
| 01 | Visão do Produto | **ESTÁTICO** | `/docs/baseline/01_Visao_do_Produto.md` |
| 02 | Escopo Funcional | **HÍBRIDO** | `/docs/02_Escopo_Funcional.md` |
| 03 | Regras de Negócio e Matemática Financeira | **ESTÁTICO** | `/docs/baseline/03_Regras_de_Negocio.md` |
| 04 | Arquitetura de Software | **VIVO** | `/docs/04_Arquitetura_de_Software.md` |
| 05 | Modelagem de Dados | **VIVO** | `/docs/05_Modelagem_de_Dados.md` |
| 06 | API e Contratos de Integração | **VIVO** | `/docs/06_API_e_Contratos.md` |
| 07 | UX/UI e Navegação | **VIVO** | `/docs/07_UX_UI_e_Navegacao.md` |
| 08 | Conteúdo Educacional | **VIVO** | `/docs/08_Conteudo_Educacional.md` |
| 09 | Qualidade, Testes e Critérios de Aceite | **VIVO** | `/docs/09_Qualidade_Testes.md` |
| 10 | Roadmap e Backlog Inicial | **HÍBRIDO** | `/docs/10_Roadmap.md` |
| 11 | **Prompt-Mestre de Desenvolvimento** | **BASELINE CANDIDATA** | `/docs/baseline/11_Prompt_Mestre.md` |
| 12 | Plano Operacional por Fases e Sprints | **VIVO** | `/docs/12_Plano_Operacional.md` |
| 13 | Backlog Técnico Detalhado | **VIVO** | `/docs/13_Backlog_Tecnico.md` |
| 14 | Especificação Física de Dados e Persistência | **VIVO** | `/docs/14_Especificacao_Fisica_Dados.md` |
| 15 | Casos de Teste Matemáticos e Massa de Validação | **HÍBRIDO** | `/docs/15_Casos_de_Teste_Matematicos.md` |
| 16 | Design System e Wireframes Operacionais | **VIVO** | `/docs/16_Design_System.md` |
| 17 | Infraestrutura, Segurança, Compliance e Deploy | **VIVO** | `/docs/17_Infra_Seguranca_Deploy.md` |
| 18 | Mapeamento Regulatório do Banco Central | **HÍBRIDO** | `/docs/18_Mapeamento_Regulatorio.md` |

### 2.2 Documentos novos numerados (9: Doc 19 a Doc 27)

| # | Documento | Categoria | Local oficial |
|---|-----------|-----------|---------------|
| 19 | Matriz de Rastreabilidade Requisitos↔Testes↔Código | **VIVO** | `/docs/19_Matriz_Rastreabilidade.md` |
| 20 | Catálogo de Decisões Arquiteturais (ADR) | **VIVO** | `/docs/20_ADR/` (índice + arquivos individuais) |
| 21 | Governança de Branches, PRs e Commits | **ESTÁTICO** | `/docs/baseline/21_Governanca_Branches_PRs.md` |
| 22 | LGPD e Tratamento de Dados | **HÍBRIDO** | `/docs/22_LGPD_Tratamento_Dados.md` |
| 23 | Observabilidade e Telemetria | **VIVO** | `/docs/23_Observabilidade.md` |
| 24 | Runbooks e Procedimentos Operacionais | **VIVO** | `/docs/24_Runbooks.md` (+ `/docs/24_runbooks/` individuais) |
| 25 | Release Readiness e Checklists | **VIVO** | `/docs/25_Release_Readiness.md` |
| 26 | Seeds, Fixtures e Dados de Demonstração | **VIVO** | `/docs/26_Seeds_Fixtures.md` |
| 27 | Versionamento de Contratos de API | **HÍBRIDO** | `/docs/27_Versionamento_API.md` |

### 2.3 Documentos centrais de governança/qualidade (5)

| Sigla | Documento | Categoria | Local oficial |
|-------|-----------|-----------|---------------|
| G1 | Governança Rígida de Execução — Claude Code | **ESTÁTICO** | `/docs/baseline/governanca/GOVERNANCA_RIGIDA_DE_EXECUCAO__CLAUDE_CODE.md` |
| G2 | Estratégia de Testes de Classe Mundial | **VIVO** | `/docs/qualidade/ESTRATEGIA_DE_TESTES_DE_CLASSE_MUNDIAL.md` |
| G3 | Padrões de Implementação e Qualidade de Código | **VIVO** | `/docs/qualidade/PADROES_DE_IMPLEMENTACAO.md` |
| G4 | Pipeline e Quality Gates | **VIVO** | `/docs/qualidade/PIPELINE_E_QUALITY_GATES.md` |
| G5 | Especificação do Agente de Análise de Impacto | **VIVO** | `/docs/qualidade/AGENTE_DE_ANALISE_DE_IMPACTO.md` |

## 3. Contagem fechada e auditável

| Métrica | Valor |
|---------|------|
| Originais | **19** |
| Novos numerados | **9** |
| Centrais de governança/qualidade | **5** |
| **Total documentos válidos** | **33** |

| Categoria | Quantidade | Documentos |
|-----------|-----------|------------|
| **VIVO** | **22** | 00, 04, 05, 06, 07, 08, 09, 12, 13, 14, 16, 17, 19, 20, 23, 24, 25, 26, G2, G3, G4, G5 |
| **ESTÁTICO** | **4** | 01, 03, 21, G1 |
| **HÍBRIDO** | **6** | 02, 10, 15, 18, 22, 27 |
| **BASELINE CANDIDATA** | **1** | 11 |
| **Total** | **33** | ✓ |

**Verificação cruzada:** 22 + 4 + 6 + 1 = **33** ✓.

### Artefatos anexos (não-documentos)
Para clareza, listamos os anexos do projeto que não entram na contagem documental:
- A1 `backlog_operacional_acompanhamento.xlsx` (planilha operacional — vive em `/docs/_acompanhamento/`).
- A2 `Tabela dos tipos de testes.xlsx` (insumo de auditoria, não-versionado no produto).
- A3 OpenAPI 3.1 gerado (`/api/v1/openapi.json`, gerado pelo backend).
- A4 `scripts/impact_analysis_guard.py`.
- A5 `scripts/impact/rules.yaml`.
- A6 `tests/scripts/test_impact_analysis_guard.py`.
- A7 `docs/_meta/living_docs.json` (índice consumido pelo agente).
- A8 ADRs individuais sob `/docs/20_ADR/` (referenciados pelo Doc 20; cada ADR é arquivo, mas o "documento" é o catálogo).

## 4. Reclassificação justificada do Doc 11 (fecha NC-03)

### Avaliação anterior (v1.0)
Tratado como **ESTÁTICO** puro.

### Limitação dessa classificação
Estático puro implica que a única forma de mudança é rebaseline formal "sob demanda excepcional". Isso não captura a natureza do Prompt-Mestre, que é **constituição operacional da Claude Code** e **deve mudar em momentos previsíveis**: após cada gate forense, após mudança de fase, após rebaseline do Doc 03/04. Não muda em PR comum, mas não é "imutável" — é "rebaseado em ritmo predeterminado".

### Classificação correta (v2.0)
**BASELINE CANDIDATA** (categoria nova, definida em §1.4).

### Justificativa técnica
1. **Natureza:** o Doc 11 instrui o agente IA sobre como construir; é constitucional para a execução.
2. **Estabilidade requerida durante o sprint:** alto. Não pode ser alterado em PR comum porque mudança altera comportamento do agente em todos os contextos.
3. **Necessidade de evolução previsível:** alta. Após gate forense (Prompt 2), aprendizados devem ser incorporados; após rebaseline matemática/arquitetural, deve refletir nova realidade.
4. **Diferença de "estático puro":** baseline candidata carrega **plano explícito de atualização**; estático puro não.
5. **Diferença de "vivo":** baseline candidata **bloqueia** mudança via PR comum; vivo a permite/exige.
6. **Operacionalmente útil:** rotula o Doc 11 com regra clara para a Claude Code (não tente alterá-lo sem rebaseline formal) e para o time (saiba quando atualizá-lo).

### Política operacional para Doc 11
- Vive em `/docs/baseline/11_Prompt_Mestre.md`.
- Histórico de versões no rodapé.
- Cada rebaseline:
  - cria PR exclusiva `baseline/doc11-vYYYY.MM.DD`;
  - acompanha ADR em `/docs/20_ADR/`;
  - tag Git `baseline-vYYYY.MM.DD-doc11`;
  - revisão por responsável de governança;
  - notificação ao time.
- Tentativa de modificação fora desse fluxo é **bloqueada pelo agente de impacto** (regra `static_baseline` aplicada também a baseline candidata, salvo presença de label `baseline:doc11` no PR).

## 5. Documentos vivos que DEVEM estar dentro do repositório

Lista completa, sem ambiguidade. **Todos os 22 vivos + 6 híbridos + 1 baseline candidata + 4 estáticos = 33 documentos** devem residir no repositório, distribuídos:
- **Vivos** (22): em `/docs/`, `/docs/qualidade/`, `/docs/20_ADR/`, `/docs/24_runbooks/`.
- **Híbridos** (6): em `/docs/` (apêndice vivo dentro do mesmo arquivo, marcado).
- **Baseline candidata** (1, Doc 11): em `/docs/baseline/`.
- **Estáticos** (4): em `/docs/baseline/` (recomendação forte; pode-se optar por base de conhecimento externa, mas perde-se rastreio Git).

Caminhos canônicos consolidados em `docs/_meta/living_docs.json` (consumido pelo agente de impacto).

## 6. Eventos que exigem atualização obrigatória (mapa executável)

A tabela é consumida pelo agente de impacto. PR que viole esta tabela é bloqueada (ver Pipeline §4.3).

| Evento | Documentos a atualizar (mínimo) |
|--------|----------------------------------|
| Nova rota / novo contrato | 06, 27, 19, 09 (testes contrato), 23 |
| Nova migration / mudança de schema | 05, 14, 26, 19 |
| Nova regra de negócio matemática | 03 (rebaseline formal — estático), 09, 15 (apêndice), 19 |
| Nova tela ou fluxo UX | 07, 16, 09 (snapshot visual), 19 |
| Mudança em design tokens | 16, 07 |
| Mudança arquitetural significativa | 04, novo ADR em 20, possivelmente rebaseline de 11 |
| Mudança em conteúdo educacional | 08, 19 |
| Mudança em pipeline/scripts | G4, G5, 17 |
| Mudança em testes (estratégia) | 09, G2, 19 |
| Novo dashboard/alerta | 23, 17, 24 |
| Incidente em produção | 24 (post-mortem), 23 (alerta novo), 25 (lição aprendida) |
| Nova versão de API | 06, 27, 19, ADR em 20 |
| Mudança em LGPD/base legal | 22, possivelmente rebaseline de 18 |
| Release | 25 (checklist preenchido), 24 (smoke pós-deploy) |
| Conclusão de Gate Forense (Prompt 2) | rebaseline obrigatório de 11; possivelmente de 04 e 17 |
| Mudança de fase do roadmap | 10 (apêndice vivo), 12, rebaseline de 11 |

## 7. Política rígida para documentos estáticos
1. Mudança **só** ocorre via rebaseline formal.
2. Rebaseline exige: ADR + revisão por responsável de governança + commit dedicado (`rebaseline(docXX): <motivo>`) + tag Git `baseline-vYYYY.MM.DD-docXX`.
3. PRs comuns que tentem alterar documento estático são **rejeitadas pelo agente de impacto**.
4. Estáticos da auditoria (G1, Doc 21) só mudam por nova rodada de auditoria sênior.

## 8. Política rígida para documentos vivos (calibrada — fecha NC-06)

### 8.1 Regras BLOQUEANTES (B)
- B-V1: PR não pode passar se documento vivo aplicável estiver desatualizado **e** a mudança for **arquitetural**, **de contrato**, **de schema**, **regulatória** ou **de regra de negócio**.
- B-V2: Documento vivo cuja `Última atualização:` esteja > 60 dias vencida em relação à última mudança de código na sua área é defeito P1 (bloqueia release).
- B-V3: Mudança em documento estático sem rebaseline formal é bloqueio absoluto.

### 8.2 Regras OBRIGATÓRIAS NÃO BLOQUEANTES (O)
- O-V1: PR puramente cosmética (rename, format, refactor sem efeito comportamental) **deve** atualizar a linha `Última atualização:` se tocar arquivo do documento vivo, mas **não bloqueia** se a mudança não tiver impacto material.
- O-V2: PR de teste/lint/build deve referenciar a área documental, sem obrigatoriedade de patch.
- O-V3: ADRs aceitos devem ser referenciados nos documentos vivos relacionados em até 7 dias úteis.

### 8.3 Regras RECOMENDADAS (R)
- R-V1: Auditoria trimestral leve verifica derivas entre código e doc vivo.
- R-V2: Documentos vivos têm seção `Histórico de revisões` no rodapé.
- R-V3: Diff-to-doc (comparação automática mensal) é recomendado.

### 8.4 Regras FUTURAS (F)
- F-V1: Geração automática de documentação derivada (TypeDoc/mkdocs) integrada à publicação contínua de docs site.
- F-V2: Knowledge graph dos artefatos vivos para análise semântica.

### 8.5 Resumo de severidade
A política não é "tudo bloqueia"; ela distingue mudanças que afetam a verdade do produto (B) de mudanças que apenas afetam a aparência do código (O). Isso elimina o risco de paralisia.

## 9. Política para documentos híbridos
1. Núcleo segue regra de estático.
2. Apêndice vivo: dentro do mesmo arquivo, claramente delimitado por marcadores HTML.
3. Agente de impacto bloqueia mudança no núcleo sem rebaseline; libera mudança no apêndice sob política de vivos.
4. Híbridos: 02, 10, 15, 18, 22, 27.

## 10. Política para baseline candidata (Doc 11)
Definida em §1.4 e §4. Resumo:
- Sem PR comum.
- Rebaseline obrigatório nos 6 gatilhos listados.
- Tag Git e ADR em cada rebaseline.
- Bloqueio por agente fora do fluxo formal.

## 11. Política para artefatos anexos (não-documentos)
- A1 (planilha) é **vivo operacional**: pode ser alterada em PR; opcionalmente substituída por dashboard.
- A2 (tabela de tipos) é **referência de auditoria**, não-versionada como documento do produto.
- A3 (OpenAPI gerado) é **derivado** do código; não-editável manualmente.
- A4–A7 (script, rules, tests, índice) seguem política de código (PR comum).
- A8 (ADRs individuais) compõem o Doc 20; cada ADR é vivo até `accepted` e congelado depois (mudança = novo ADR `superseded by`).

## 12. Validação final
Esta matriz é **fonte única de verdade** para classificação documental. Inconsistências em qualquer outro artefato (Pacote Canônico, Relatório, etc.) devem ser corrigidas para alinhar a esta. **Total fixado em 33 documentos**, distribuídos em **22 V + 4 E + 6 H + 1 BC**.
