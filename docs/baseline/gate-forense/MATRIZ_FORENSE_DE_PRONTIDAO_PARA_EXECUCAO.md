# MATRIZ FORENSE DE PRONTIDÃO PARA EXECUÇÃO
## Plataforma Educacional Financeira — Gate Forense Prompt 2

**Versão:** 1.0
**Data:** 2026-04-14
**Banca:** Banca Forense de Aprovação Final
**Pacote avaliado:** `AUDITORIA_PROMPT_1_FINAL/` (63 arquivos; 33 documentos canônicos)

---

## Legenda
- Status: **APROVADO** · **APROVADO COM RESSALVA** · **REPROVADO**
- Bloqueia? **SIM** · **NÃO**

## Matriz canônica (25 critérios)

| ID | Critério | Status | Evidência encontrada | Risco residual | Impacto no desenvolvimento | Bloqueia? | Ação corretiva |
|----|----------|--------|----------------------|----------------|----------------------------|-----------|----------------|
| C-01 | Completude documental | **APROVADO** | 33 documentos canônicos fisicamente presentes em `docs/`; contagem conciliada entre Pacote Canônico §2, Índice Final §2, `living_docs.json` (`total_documents: 33`) e Matriz V/E §3 | Docs 05, 07, 15, 16 permaneceram em v1.0 original (não reescritos) | Baixo; eram áreas não apontadas como lacunas importantes | NÃO | Manter em revisão durante P-Refino |
| C-02 | Coerência documental | **APROVADO** | Soma por categoria (22V+4E+6H+1BC=33) bate em 5 fontes cruzadas; nenhuma divergência numérica | Nenhum | — | NÃO | — |
| C-03 | Ausência de contradições graves | **APROVADO COM RESSALVA** | Governança G1 calibrada coerente com Pipeline G4 e Agente G5; Doc 06 v2.0 coerente com Doc 27 | Doc 06 v2.0 define `Idempotency-Key`, paginação cursor, RFC 7807 — Doc 05 v1.0 **não cita** `idempotency_keys` na modelagem lógica (apenas o Doc 14 v2.0 cita a tabela física) | Baixo; discrepância de detalhe lógico vs físico | NÃO | Atualizar Doc 05 com entidade `IdempotencyKey` (item P-Refino) |
| C-04 | Suficiência do escopo funcional | **APROVADO** | Doc 02 cobre 11 domínios; Doc 06 v2.0 lista 14 grupos de endpoints; Doc 13 v2.0 detalha por sprint | Quantificadores qualitativos em alguns critérios de Doc 02 | Baixo | NÃO | — |
| C-05 | Suficiência das regras matemáticas | **APROVADO** | Doc 03 (estático, inviolável) + Doc 15 (casos canônicos JS-*, JC-*, PR-*, SAC-* etc.) | Doc 15 mantido em v1.0 (não revisado na v2); massa numérica adequada mas não há property-based specs formais | Baixo | NÃO | Property-based em `tests/regression/financial/` no Sprint 2 (já previsto em G2) |
| C-06 | Suficiência regulatória e semântica de mercado | **APROVADO** | Doc 18 v2.0 apêndice vivo com matriz cruzada regra↔módulo↔implementação↔teste↔alerta; regras BACEN Nível A/B/C | Matriz do Doc 18 §8 tem linha "a definir" para tarifas e taxas médias | Médio-baixo (só acende no Sprint 5+) | NÃO | Preencher linha "a definir" antes do Sprint 5 |
| C-07 | Suficiência arquitetural | **APROVADO** | Doc 04 v2.0 com C4 1–3, fronteiras formais, 14 ADRs sementes materializados em `docs/20_ADR/`, unit of work, DI explícita | Diagramas C4 em prosa (não há imagens); suficiente para início | Baixo | NÃO | Gerar diagramas visuais opcionais em P-Refino |
| C-08 | Suficiência da modelagem física e lógica | **APROVADO** | Doc 05 (lógica) + Doc 14 v2.0 (física) com 21 tabelas; política expand-and-contract; backup/PITR/retenção; soft delete | Doc 05 não foi atualizado para refletir `idempotency_keys`, `dsar_requests`, `audit_log` adicionadas em Doc 14 v2.0 | Baixo-médio (discrepância lógica↔física) | NÃO | Sincronizar Doc 05 em P0 ou início de Sprint 9 |
| C-09 | Suficiência da API e contratos | **APROVADO** | Doc 06 v2.0 com RFC 7807, versionamento `/api/v1`, paginação cursor+offset, idempotência, rate-limit, timeouts, CORS; Doc 27 com política de versionamento; 14 grupos de endpoints listados | OpenAPI real só em runtime (declarado explicitamente fora do escopo) | Aceitável — justificativa técnica em Pacote Canônico §4 | NÃO | Confirmar `GET /api/v1/openapi.json` no smoke de Sprint 0 |
| C-10 | Suficiência de UX/UI e design system | **APROVADO COM RESSALVA** | Doc 07 (246 linhas) + Doc 16 (343 linhas) com tokens semânticos | Docs 07 e 16 mantidos em v1.0 (não reescritos); tokens ainda em prosa (não em JSON/CSS estruturado — lacuna L-26 em P-Refino); inventário formal de telas e estados (L-33) não consolidado | Médio — UX consistente depende disso no Sprint 1 | NÃO (condicionante) | Materializar `frontend/styles/tokens.{ts,css}` + inventário de telas até o Sprint 1 |
| C-11 | Suficiência do conteúdo educacional | **APROVADO** | Doc 08 v2.0 com 3 personas, política editorial, fluxo editorial, versionamento de conteúdo, métricas pedagógicas, lint pedagógico especificado | Lint pedagógico é especificação; implementação em `tools/edu_lint/` fica para Sprint 7 | Baixo | NÃO | Implementar lint pedagógico em Sprint 7 |
| C-12 | Suficiência do backlog e roadmap | **APROVADO** | Doc 10 (roadmap), Doc 12 v2.0 (plano por sprints com DoR/DoD por 7 categorias), Doc 13 v2.0 (backlog técnico com vinculação REQ-ID) | Sprint P0 introduz novas obrigações (materializar CI, hooks, Makefile) não presentes no Doc 13 v2.0 com prefixos canônicos | Baixo | NÃO | Doc 13 §3.1 (Sprint P0) já cobre; apenas executar |
| C-13 | Suficiência da estratégia de testes | **APROVADO** | G2 v2.0 com tabela canônica cobrindo 43 tipos da fonte (42+1), classificação OBR/REC/FUT, fase, severidade MERGE/RELEASE/INFO; gates de cobertura por área em G2 §7 | Performance, carga, recuperação, mutação dependem de Sprint ≥2 para materializar | Baixo — calibrado como cronograma | NÃO | Seguir roadmap de adoção G2 §13 |
| C-14 | Suficiência da qualidade de código e padrões de implementação | **APROVADO** | G3 com limites numéricos (arquivo ≤600, função ≤80, complexidade ≤15), naming, erro, logs, DTO, services, repository, padrões TSDoc/docstring | G3 mantido em v1 (não reauditado na v2); sólido, mas sem revisão explícita na rodada corretiva | Baixo | NÃO | Validação no primeiro PR real |
| C-15 | Suficiência da infraestrutura e deploy | **APROVADO** | Doc 17 v2.0 com IaC, 5 ambientes, containers multi-stage non-root, threat model STRIDE, SAST/DAST/dependency/secret/container/IaC, política de segredos + rotação, response a incidente | Runbooks RB-001..RB-010 referenciados em Doc 24 mas **só template RB-000 materializado** | Médio — afeta resposta a incidente em produção | NÃO (condicionante) | Materializar RB-001..RB-005 antes do deploy em produção (Sprint 8+) |
| C-16 | Suficiência da segurança | **APROVADO** | Threat model STRIDE Doc 17 §7; SAST bandit/semgrep em PR; DAST semanal; cabeçalhos HSTS/CSP/X-Content-Type-Options; cookies HttpOnly/Secure/SameSite=Lax; argon2id; Doc 22 LGPD com bases legais, DSAR, retenção; `audit_log` previsto | 2FA marcado como futuro; pen-test anual também; aceitáveis para MVP educacional sem PII sensível | Baixo para MVP | NÃO | Reavaliar em Fase B com autenticação |
| C-17 | Suficiência da governança da Claude Code | **APROVADO** | G1 v2.0 calibrada com 22 seções e ~105 regras etiquetadas [B]/[O]/[R]/[F] (~70 bloqueantes, ~20 obrigatórias não bloqueantes, ~10 recomendadas, ~5 futuras); 20 critérios objetivos de rejeição em §20; hierarquia em conflito §22 | Calibração é nova (v2); não há histórico de uso real para validar se equilíbrio está certo | Baixo — plano de reavaliação após 2 sprints é prudente | NÃO | Auditoria da calibração após Sprint 1 |
| C-18 | Suficiência da política de documentação viva | **APROVADO** | Matriz V/E v2.0 §6 com mapa "evento→documentos vivos"; G1 §2 bloqueante para alterações arquiteturais/contrato/schema/regra/conteúdo/regulatório; exceção para PRs cosméticas evita paralisia; `living_docs.json` materializado | Dependência crítica do agente em modo `blocking` (Sprint 1+) | Baixo com plano | NÃO | Confirmar promoção de estágio do agente no fim do Sprint 1 |
| C-19 | Suficiência da classificação vivo/estático | **APROVADO** | 4 categorias formais (VIVO, ESTÁTICO, HÍBRIDO, BASELINE CANDIDATA); Doc 11 reclassificado como BC com 6 gatilhos explícitos; contagem 22+4+6+1=33 auditável | Categoria BC é inédita; não há histórico; definida tecnicamente em Matriz V/E §1.4 e §4 | Baixo | NÃO | Executar 1º rebaseline do Doc 11 ao final do Prompt 2 (este gate) |
| C-20 | Suficiência do agente/script de análise de impacto | **APROVADO** | G5 v2.0 madura; script `impact_analysis_guard.py` v2.0.0 executável; `rules.yaml` com 23 regras cobrindo todos os módulos críticos; `schema.yaml` validando configuração; **27 testes unitários/integração verdes (27 passed in 0.09s)** | Inicia em modo `advisory`; migra para `warning` no Sprint 0; `blocking` no Sprint 1 — calibração honesta mas implica janela sem bloqueio real no P0 | Baixo — calibração explícita e documentada | NÃO (condicionante) | Emitir ADR formalizando critérios objetivos de transição (falsos positivos <5%, revisão de regras) antes do fim do Sprint 1 |
| C-21 | Suficiência dos quality gates | **APROVADO** | G4 com Makefile canônico, gates por evento (pre-commit, pre-push, PR, merge, pós-deploy); cobertura por área como gate bloqueante; política de rollback automático se smoke falhar em 5 min | G4 mantido em v1 (não re-auditado na v2); materialização física em `.github/workflows/ci.yml` é Sprint P0 — declarado fora do escopo documental | Baixo (plano claro) | NÃO (condicionante) | Materializar `ci.yml` + `Makefile` + hooks no P0 |
| C-22 | Capacidade de impedir regressão | **APROVADO** | Suite de regressão consolidada (financeira + pedagógica + visual + contrato); mutação semanal no `domain/` com score ≥80%; cobertura inviolável por área; tolerâncias inviáveis de afrouxar sem ADR (G1 §18) | Mutação semanal depende de Sprint ≥2; suite visual depende de Sprint 1 | Baixo — no cronograma | NÃO | Seguir adoção G2 §13 |
| C-23 | Capacidade de impedir quebra arquitetural | **APROVADO** | Fronteiras formais Doc 04 §12; `import-linter` (BE) + `madge` (FE) previstos em G3; ADRs obrigatórios para decisões transversais; agente bloqueia mudança em `domain/`, `api/`, `db/migrations/` sem testes/docs correspondentes | Depende de `import-linter`/`madge` configurados em Sprint 0 | Baixo | NÃO | Confirmar configuração em Sprint 0 |
| C-24 | Capacidade de impedir quebra de contrato | **APROVADO** | OpenAPI 3.1 como fonte única (Doc 06 §2, ADR-0006); `schemathesis` em CI (G2, G4); Doc 27 com política breaking/aditivo + manutenção ≥2 sprints + `Deprecation`/`Sunset`; tipos TS gerados a partir do OpenAPI | Contract testing real só opera no Sprint 1+ (após primeira rota) | Baixo | NÃO | Confirmar schemathesis funcional no Sprint 2 |
| C-25 | Capacidade de suportar desenvolvimento completo sem improviso destrutivo | **APROVADO** | Pacote autossuficiente (NCF-01..04 fechadas); DoR/DoD por 7 categorias; hierarquia em conflito; fluxo editorial; expand-and-contract; agentes guardiões especificados; pacote pode ser transplantado direto ao monorepo | Pressupõe execução disciplinada do Sprint P0 antes do Sprint 0 | Médio — condicionante explícito | **NÃO (com condicionantes obrigatórios)** | Cumprir condicionantes listados em `LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md` |

---

## Síntese numérica da matriz

| Status | Quantidade |
|--------|-----------|
| APROVADO | 23 |
| APROVADO COM RESSALVA | 2 (C-03, C-10) |
| REPROVADO | 0 |
| **Total** | **25** |

| Bloqueia execução? | Quantidade |
|---------------------|-----------|
| SIM (bloqueador absoluto) | 0 |
| NÃO (sem condicionante) | 18 |
| NÃO com condicionante | 7 (C-06, C-10, C-15, C-18, C-20, C-21, C-25) |

---

## Observações técnicas adicionais

1. **Zero reprovações.** Nenhum critério está em estado que impeça execução.
2. **2 ressalvas não-bloqueantes** (C-03, C-10) com ação corretiva objetiva já mapeada em P-Refino.
3. **7 condicionantes** executáveis dentro do cronograma já previsto (Sprint P0 e Sprint 0–1), detalhadas em `LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md`.
4. **Evidência empírica forte** para o agente: 27 testes verdes executados nesta data e reprodutíveis.
5. **Calibração honesta** evita falso GO: estágio `advisory`→`warning`→`blocking` mitiga risco de falsos positivos.
6. **Pontos de atenção residuais:**
   - Doc 05 ainda desatualizado em relação ao Doc 14 v2.0 (discrepância lógico/físico sobre `idempotency_keys`, `dsar_requests`, `audit_log`).
   - Runbooks RB-001..RB-010 não materializados (apenas template RB-000) — aceitável para MVP, obrigatório para produção.
   - Matriz de Rastreabilidade (Doc 19) ainda em forma de semente; população real ocorre sprint a sprint.
