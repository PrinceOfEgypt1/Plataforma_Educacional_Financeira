# VERIFICAÇÃO FINAL DOS DOCUMENTOS VIVOS
## Plataforma Educacional Financeira — Gate Forense Prompt 2

**Versão:** 1.0
**Data:** 2026-04-14

---

## 1. A lista de documentos vivos está correta?

**Sim — CONFIRMADO.**

Lista conferida contra `docs/_meta/living_docs.json` e `docs/baseline/auditoria/MATRIZ_DE_DOCUMENTOS_VIVOS_E_ESTATICOS.md` §3.

**22 documentos vivos:**
- Doc 00 Índice Geral
- Doc 04 Arquitetura de Software (v2.0)
- Doc 05 Modelagem de Dados
- Doc 06 API e Contratos (v2.0)
- Doc 07 UX/UI e Navegação
- Doc 08 Conteúdo Educacional (v2.0)
- Doc 09 Qualidade, Testes e Critérios de Aceite (v2.0)
- Doc 12 Plano Operacional (v2.0)
- Doc 13 Backlog Técnico (v2.0)
- Doc 14 Especificação Física de Dados (v2.0)
- Doc 16 Design System
- Doc 17 Infra/Segurança/Deploy (v2.0)
- Doc 19 Matriz de Rastreabilidade
- Doc 20 Catálogo ADR
- Doc 23 Observabilidade
- Doc 24 Runbooks
- Doc 25 Release Readiness
- Doc 26 Seeds/Fixtures
- G2 Estratégia de Testes de Classe Mundial
- G3 Padrões de Implementação
- G4 Pipeline e Quality Gates
- G5 Agente de Análise de Impacto

**Verificação cruzada:** `grep '"category": "VIVO"' docs/_meta/living_docs.json | wc -l` retorna 22. ✓

**Coerência com Matriz V/E §3:** 22 vivos, 4 estáticos, 6 híbridos, 1 baseline candidata = 33 ✓.

## 2. A lista de documentos estáticos está correta?

**Sim — CONFIRMADO.**

**4 documentos estáticos:**
- Doc 01 Visão do Produto
- Doc 03 Regras de Negócio e Matemática Financeira
- Doc 21 Governança de Branches/PRs/Commits
- G1 Governança Rígida da Claude Code (calibrada)

**Observação forense:** a classificação é correta tecnicamente. Doc 03 (matemática) e G1 (constituição de execução) precisam ser invariáveis durante sprints; Doc 01 (visão de produto) e Doc 21 (trunk-based) são decisões fundacionais.

**Nota sobre Doc 11 (Prompt-Mestre):** classificado à parte como **BASELINE CANDIDATA**, categoria nova (Matriz V/E §1.4). Decisão tecnicamente defensável: Doc 11 não é estático puro porque **deve** ser rebaseado após gatilhos específicos (conclusão de gate forense, rebaseline do Doc 03/04, mudança de fase); não é vivo porque não muda em PR comum.

## 3. Os documentos vivos que devem estar no repositório estão claramente definidos?

**Sim — CONFIRMADO.**

Todos os 33 documentos (incluindo vivos, estáticos, híbridos e baseline candidata) têm **caminho físico canônico** definido na Matriz V/E §2 e confirmado pela presença física no pacote:

| Categoria | Diretório canônico |
|-----------|---------------------|
| VIVO (22) | `/docs/`, `/docs/qualidade/`, `/docs/20_ADR/`, `/docs/24_runbooks/` |
| ESTÁTICO (4) | `/docs/baseline/`, `/docs/baseline/governanca/` |
| HÍBRIDO (6) | `/docs/` (apêndice vivo dentro do arquivo, delimitado por marcadores HTML) |
| BASELINE CANDIDATA (1) | `/docs/baseline/` (Doc 11) |

**Evidência física:** espelho completo presente em `AUDITORIA_PROMPT_1_FINAL/docs/`.

**Índice auxiliar:** `docs/_meta/living_docs.json` lista cada documento com `path`, `category` e `title`, pronto para ser consumido pelo agente.

## 4. A política de atualização está forte o suficiente?

**Sim — CONFIRMADO, com observação de calibração.**

### Pontos fortes da política

1. **Mapa evento→documentos vivos** em Matriz V/E §6 (15 eventos canônicos) consumível pelo agente.
2. **Regras bloqueantes** em G1 §2: PR que altera arquitetura, contrato, schema, regra de negócio, conteúdo educacional, observabilidade ou regulatório **não passa** sem atualizar docs vivos correspondentes.
3. **Regras calibradas**: PRs cosméticas (rename/format/refactor trivial) atualizam apenas a linha `Última atualização:`, evitando paralisia (G1 §2.1).
4. **Doc vivo desatualizado > 60 dias** em relação à mudança de código na sua área é **defeito P1** que bloqueia release (G1 §2.1 B-V2).
5. **Seção obrigatória** `Histórico de revisões` no rodapé.
6. **PR template** (Doc 21 §4.2) exige campo "Documentos vivos atualizados".
7. **Agente de impacto** (G5 + `rules.yaml`) aplica as regras automaticamente, reduzindo dependência de disciplina humana pura.

### Observação

A regra B-V2 ("doc vivo > 60 dias vencido = defeito P1") depende de uma referência temporal ("última mudança de código na sua área"). Em sprint inicial, essa referência pode ser ambígua para áreas sem código ainda. Banca forense considera aceitável porque:
- O agente de impacto detecta derivas a cada PR, não depende de janela de 60 dias.
- Auditoria trimestral leve (Matriz V/E §8.3 R-V1) complementa.

## 5. A política impede branch/PR sem atualização documental?

**Sim — CONFIRMADO, com duas camadas independentes.**

### Camada 1 — Agente de impacto (técnica, automatizada)

`scripts/impact_analysis_guard.py` + `rules.yaml` configurado para bloquear PR quando:
- arquivo em `backend/app/domain/**` é tocado sem correspondente em `docs/03_Regras_de_Negocio.md` ou `docs/15_Casos_de_Teste_Matematicos.md` ou `docs/19_Matriz_Rastreabilidade.md`;
- arquivo em `backend/app/api/**` sem atualização em `docs/06_API_e_Contratos.md` ou `docs/27_Versionamento_API.md`;
- migration sem atualização em `docs/05_Modelagem_de_Dados.md` + `docs/14_Especificacao_Fisica_Dados.md` + `docs/26_Seeds_Fixtures.md`;
- mudança em `frontend/components/**` ou `styles/**` sem `docs/07_UX_UI_e_Navegacao.md` ou `docs/16_Design_System.md`;
- mudança em `docs/baseline/**` sem label `rebaseline:docXX` ou `baseline:doc11` (bloqueio absoluto).

**Evidência:** `rules.yaml` tem 23 regras com `requires_docs_living` explícito; testes `test_impact_analysis_guard.py` validam o comportamento (27/27 verdes).

### Camada 2 — Governança humana (revisão)

G1 §2 (bloqueante) + Doc 21 §4.3 (revisão humana obrigatória com CODEOWNERS) + critérios objetivos de rejeição em G1 §20.

### Ressalva

A camada 1 opera plenamente apenas quando o agente está em estágio `blocking` (Sprint 1+). No Sprint P0 e Sprint 0, a camada 1 opera como `advisory`/`warning` (avisa mas não bloqueia). **Mitigação:** Sprint P0 e Sprint 0 têm escopo limitado a estrutura base e layout — sem mudanças em documentos vivos críticos (domínio, API, schema). Risco residual aceitável (RRA-01).

## 6. A política é auditável?

**Sim — CONFIRMADO.**

### Evidências físicas auditáveis

1. **`docs/_meta/living_docs.json`:** índice consumível programaticamente; cada entrada com `id`, `path`, `category`, `title`. Verificável via `jq`.
2. **`rules.yaml`:** regras declarativas com severidade, testes obrigatórios, docs vivos obrigatórios, risco; versionável em Git.
3. **`impact_analysis_guard.py` v2.0.0:** emite relatórios dual (Markdown + JSON) em `reports/impact/`. Cada execução guarda estado.
4. **Histórico de revisões** nos documentos vivos + `Última atualização:` no topo.
5. **ADRs obrigatórios** para decisões transversais (Doc 04, Doc 20) — histórico completo de decisões.
6. **Suite de testes do agente** (`scripts/tests/test_impact_analysis_guard.py`) com 27 testes verdes — comportamento do guardião é auditável via testes.
7. **Matriz de Rastreabilidade** (Doc 19) cruza REQ-ID ↔ endpoint ↔ schema ↔ domínio ↔ caso de teste ↔ docs vivos; cada PR atualiza uma linha.

### Mecanismos de auditoria

- **Auditoria trimestral leve** (Matriz V/E §8.3 R-V1): deriva entre código e doc vivo.
- **Auditoria mensal** das métricas do próprio agente (G5 §13): nº execuções, nº bloqueios, taxa de override, falsos positivos suspeitos.
- **Retrospectiva por sprint** inclui revisão do status de Doc 19.

## 7. Análise de riscos residuais da política documental

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Agente em `advisory`/`warning` no P0–Sprint 0 | Baixa | Escopo inicial sem mudanças em docs vivos críticos (RRA-01) |
| Deriva silenciosa entre código e doc vivo | Baixa | Auditoria trimestral + agente em cada PR a partir do Sprint 1 |
| Overrides abusivos (label `impact-override:<id>`) | Baixa | Override exige justificativa em comentário; métricas semanais detectam padrões |
| Doc 11 alterado fora de gatilho | Baixo | Regra `static_baseline` bloqueia sem label `baseline:doc11` |
| `rules.yaml` desatualizado em relação à estrutura real de pastas | Médio | Revisão semestral obrigatória (G5 §13); falsos negativos geram issue |

## 8. Conclusão da verificação

A política de documentos vivos é **forte, calibrada e auditável**. As 6 perguntas do Prompt 2 §Saída 4 foram todas respondidas afirmativamente com evidência direta.

| Pergunta | Resposta | Evidência |
|----------|----------|-----------|
| Lista de vivos correta? | Sim | `living_docs.json` + Matriz V/E §3 |
| Lista de estáticos correta? | Sim | Matriz V/E §2.1 + §2.2 |
| Vivos que devem estar no repo claramente definidos? | Sim | Caminhos canônicos na Matriz V/E §2 + espelho físico no pacote |
| Política de atualização forte? | Sim | G1 §2 + Matriz V/E §6 + rules.yaml |
| Política impede branch/PR sem atualização? | Sim | Agente (camada 1) + governança humana (camada 2) |
| Política é auditável? | Sim | `living_docs.json`, `rules.yaml`, relatórios do agente, ADRs, Doc 19, testes do agente |

**Nenhum bloqueador forense identificado neste item.**
