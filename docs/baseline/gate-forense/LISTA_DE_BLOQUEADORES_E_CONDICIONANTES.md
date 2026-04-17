# LISTA DE BLOQUEADORES E CONDICIONANTES
## Plataforma Educacional Financeira — Gate Forense Prompt 2

**Versão:** 1.0
**Data:** 2026-04-14

---

## 1. Bloqueadores absolutos

> Bloqueadores absolutos impedem o início da execução.

**Nenhum bloqueador absoluto identificado.**

## 2. Condicionantes obrigatórios

> Condicionantes obrigatórios permitem o início da execução **desde que** sejam cumpridos no cronograma declarado. Falha em cumprir qualquer um reabre o gate forense.

### CND-01 — Materialização do pipeline de CI e ferramentas locais
**Origem:** Critério C-21 da Matriz Forense.
**Documento:** G4 (`docs/qualidade/PIPELINE_E_QUALITY_GATES.md`).
**Exigência:** materializar fisicamente no repositório de código, no **Sprint P0**:
- `.github/workflows/ci.yml` com todos os gates bloqueantes do G4 §4.3;
- `Makefile` com os alvos canônicos (`verify`, `verify:full`, `test:unit`, `test:integration`, `test:contract`, `test:visual`, `test:e2e`, `test:regression`, `test:mutation`, `healthcheck`, `impact`, `secret:scan`, `sast`, `deps:audit`);
- `lefthook.yml` **ou** `.pre-commit-config.yaml` com hooks de pre-commit/pre-push do G4 §4.1–4.2;
- `.github/CODEOWNERS`;
- `.github/pull_request_template.md` (conteúdo em Doc 21 §4.2).

**Prioridade:** P0 (alta).
**Evidência necessária para liberar:** PR inicial de Sprint 0 com CI verde em todos os gates bloqueantes.

### CND-02 — OpenAPI gerado em runtime e versionado em `docs/api/`
**Origem:** Critério C-09.
**Documento:** Doc 06 v2.0 + ADR-0006.
**Exigência:** ao final do **Sprint 0**, confirmar que `GET /api/v1/openapi.json` responde com OpenAPI 3.1 válido e exportar snapshot para `docs/api/openapi.json` commitado (artefato gerado mas versionado para rastreabilidade).

**Prioridade:** P0 (média).
**Evidência necessária para liberar:** `docs/api/openapi.json` presente no repositório com `openapi: "3.1.0"`.

### CND-03 — Promoção do estágio do agente com ADR
**Origem:** Critério C-20.
**Documento:** G5 (`docs/qualidade/AGENTE_DE_ANALISE_DE_IMPACTO.md`) §11.
**Exigência:** emitir **ADR-0015** formalizando os critérios objetivos de transição entre estágios (advisory → warning → blocking):
- falsos positivos <5% em 3 sprints consecutivas de observação;
- revisão formal do `rules.yaml` ao menos uma vez;
- treinamento mínimo da equipe documentado.
Após o ADR, migrar o estágio conforme G5 §11: `warning` ao final do **Sprint 0**; `blocking` ao final do **Sprint 1**.

**Prioridade:** P1 (alta).
**Evidência necessária para liberar:** ADR-0015 em `docs/20_ADR/` + `stage: blocking` em `rules.yaml` ao final do Sprint 1.

### CND-04 — Sincronização Doc 05 ↔ Doc 14 v2.0
**Origem:** Critério C-03 (ressalva) + C-08.
**Documento:** Doc 05 (Modelagem de Dados).
**Exigência:** adicionar entidades lógicas correspondentes às tabelas novas do Doc 14 v2.0 (`idempotency_keys`, `dsar_requests`, `audit_log`) no Doc 05 para eliminar discrepância lógica/física.

**Prioridade:** P0 ou início do Sprint 9 (baixa-média).
**Evidência necessária para liberar:** Doc 05 com as 3 entidades adicionadas, sem divergência de nomes ou tipos.

### CND-05 — Materialização de pelo menos 5 runbooks operacionais antes de produção
**Origem:** Critério C-15.
**Documento:** Doc 24 (`docs/24_Runbooks.md`) + pasta `docs/24_runbooks/`.
**Exigência:** materializar como arquivos individuais, antes do deploy em produção no **Sprint 8+**:
- RB-001 (Erro 5xx em alta)
- RB-002 (Latência alta)
- RB-003 (Spike no Sentry)
- RB-004 (Migration falhou em produção)
- RB-005 (Smoke pós-deploy falhou)

**Prioridade:** P2 (média — pré-produção).
**Evidência necessária para liberar:** 5 arquivos `RB-00X-<slug>.md` em `docs/24_runbooks/` antes do primeiro deploy em produção.

### CND-06 — Tokens do Design System em formato estruturado
**Origem:** Critério C-10 (ressalva).
**Documento:** Doc 16 (Design System).
**Exigência:** até o final do **Sprint 1**, gerar `frontend/styles/tokens.ts` **e** `frontend/styles/tokens.css` a partir do Doc 16, com todos os tokens semânticos codificados.

**Prioridade:** P1 (média).
**Evidência necessária para liberar:** arquivos presentes no frontend; lint bloqueia uso de cor/tipografia fora dos tokens.

### CND-07 — Inventário formal de telas e estados antes do Sprint 4
**Origem:** Critério C-10 (ressalva).
**Documento:** Doc 07 (UX/UI e Navegação).
**Exigência:** antes do **Sprint 4**, acrescentar ao Doc 07 um inventário formal listando todas as telas do MVP, cada uma com seus estados (`loading`, `vazio`, `erro`, `sucesso`) e breakpoints validados.

**Prioridade:** P1 (média).
**Evidência necessária para liberar:** seção nova no Doc 07 com inventário completo.

## 3. Itens não bloqueantes

> Itens que recomendamos endereçar mas que não bloqueiam nem liberam execução.

### NB-01 — Property-based testing formal no domínio financeiro
Especificar invariantes matemáticas (ex.: `montante >= principal` para taxa ≥ 0; `soma(parcelas) ≈ total_pago`) em `tests/regression/financial/` via Hypothesis a partir do Sprint 2. Não bloqueia porque a massa do Doc 15 já cobre os casos canônicos.

### NB-02 — Geração visual dos diagramas C4
Diagramas C4 do Doc 04 estão em prosa. Gerar imagens Mermaid ou PlantUML durante P-Refino. Não bloqueia porque a prosa é suficiente para a Claude Code interpretar.

### NB-03 — Implementação do lint pedagógico
`tools/edu_lint/` especificado em Doc 08 §20; implementação em Sprint 7 conforme roadmap. Revisão humana editorial cobre o gap até lá.

### NB-04 — Tarifas e taxas médias no Doc 18 §8
Linhas "a definir" na matriz regulatória; atualizar antes do Sprint 5 (quando módulos de loans/financing tocam tarifas).

### NB-05 — Reavaliação da calibração da G1 após Sprint 1
Calibração [B]/[O]/[R]/[F] é nova; reavaliar se a distribuição ~70/20/10/5 está equilibrada após uso real, em sprint de retrospectiva.

## 4. Riscos residuais aceitos

> Riscos conhecidos que foram tecnicamente aceitos com justificativa e mitigação documentadas.

### RRA-01 — Janela advisory/warning do agente no P0–Sprint 0
O agente não bloqueia em P0 e apenas avisa no Sprint 0. Aceitamos porque:
- Sprint P0 tem escopo restrito (configuração de repositório e infra mínima).
- Sprint 0 cria estrutura base sem código de domínio.
- Risco de regressão real só surge a partir do Sprint 2 (módulos financeiros), quando o agente já está em `blocking`.

### RRA-02 — OpenAPI só em runtime
Artefato é gerado pelo FastAPI; não pode ser pré-commitado sem código. Aceitamos porque:
- Declarado explicitamente em Pacote Canônico §4.
- Smoke do Sprint 0 confirma o endpoint.
- CND-02 exige snapshot versionado ao final do Sprint 0.

### RRA-03 — Runbooks RB-001..RB-010 não materializados no MVP
Aceitamos porque:
- Template RB-000 está presente.
- Alertas correspondentes só existem a partir do Sprint 6 (observabilidade plena).
- CND-05 exige materialização antes de produção.

### RRA-04 — Docs 05, 07, 15, 16 em v1 original
Aceitamos porque:
- Nenhum foi apontado como lacuna importante na auditoria v1.
- Refinamentos desejáveis (L-26, L-33) estão no P-Refino.
- CND-06 e CND-07 cobrem os pontos materiais.

### RRA-05 — Fixtures concretas criadas sprint a sprint
Aceitamos porque:
- Doc 26 é conceitual e claro.
- Fixtures reais dependem do código.
- DoD de domínio exige caso do Doc 15.

## 5. Riscos residuais NÃO aceitáveis

> Riscos que, se não mitigados, forçariam reprovação.

**Nenhum identificado.**

Caso, durante a execução, surja risco desta natureza (ex.: descoberta de contradição grave entre Doc 04 e Doc 06, ou quebra da suite de regressão matemática sem ADR), o gate forense é automaticamente reaberto.

## 6. Quadro-resumo

| Categoria | Quantidade | Prazo mais distante |
|-----------|-----------|---------------------|
| Bloqueadores absolutos | 0 | — |
| Condicionantes obrigatórios | 7 | Sprint 8+ (CND-05) |
| Itens não bloqueantes | 5 | contínuo |
| Riscos residuais aceitos | 5 | documentados |
| Riscos residuais não aceitáveis | 0 | — |

## 7. Critérios de reversão da aprovação

A aprovação é automaticamente reaberta em qualquer das situações:
1. CND-01 não cumprido no Sprint P0 (CI ausente ou vermelho persistente).
2. CND-03 não cumprido ao fim do Sprint 1 (agente permanece em `warning`).
3. Quebra não justificada da suite de regressão matemática.
4. Documento estático alterado sem rebaseline formal.
5. Doc 11 alterado fora de gatilho (Matriz V/E §1.4).
6. Qualquer descoberta de contradição grave entre documentos que não estava mapeada.

Em qualquer desses casos, a banca forense deve ser convocada novamente.
