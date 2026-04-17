# MATRIZ DE LACUNAS E CORREÇÕES — PLATAFORMA EDUCACIONAL FINANCEIRA

**Versão:** 1.0
**Status:** ESTÁTICO (rebaseline formal). Substituível somente por nova rodada de auditoria.
**Total de lacunas mapeadas:** 38 (9 críticas, 10 importantes, 19 desejáveis/refinamento)

Legenda de criticidade:
- **C** = Crítica (bloqueia GO sem ajuste)
- **I** = Importante (degrada produto se ignorada)
- **D** = Desejável (refinamento de qualidade)

Legenda de bloqueio:
- **SIM** = bloqueia início ou continuidade do desenvolvimento
- **NÃO** = não bloqueia, mas deve ser tratado em sprint dedicada

---

## Tabela canônica de lacunas

| ID | Categoria | Documento afetado | Descrição da lacuna | Impacto no desenvolvimento | Criticidade | Ação recomendada | Atualizar existente? | Criar novo? | Bloqueia? |
|----|-----------|-------------------|---------------------|----------------------------|-------------|------------------|----------------------|-------------|-----------|
| L-01 | Governança IA | (transversal) | Não há governança rígida sobre como a Claude Code deve operar (DoR, DoD, branches, regressão, documentação viva) | IA pode pular validações, deixar testes, quebrar contratos, deteriorar arquitetura | C | Criar `GOVERNANCA_RIGIDA_DE_EXECUCAO__CLAUDE_CODE.md` | Não | **Sim** | SIM |
| L-02 | Testes | Doc 09 | Estratégia de testes incompleta: faltam fases, gates, mutação, snapshot, contrato Pact-style, performance, segurança | Cobertura percebida ≠ real; regressão silenciosa | C | Criar `ESTRATEGIA_DE_TESTES_DE_CLASSE_MUNDIAL.md` e ampliar Doc 09 | Sim (Doc 09) | **Sim** | SIM |
| L-03 | Pipeline | Doc 17 | Não há pipeline com gates obrigatórios mapeados, ordem de checks, política de bloqueio de merge e rollback | Merges quebrados, regressão em produção, rollback manual | C | Criar `PIPELINE_GOVERNANCA_E_QUALITY_GATES.md` | Sim (Doc 17) | **Sim** | SIM |
| L-04 | Guardião técnico | (transversal) | Sem agente/script de análise de impacto a cada mudança | Mudanças sem rastreio de impacto, docs vivos não atualizados | C | Criar `ESPECIFICACAO_DO_AGENTE_DE_ANALISE_DE_IMPACTO.md` + skeleton `scripts/impact_analysis_guard.py` | Não | **Sim** | SIM |
| L-05 | Governança documental | Todos | Sem classificação Vivo/Estático e sem política de atualização | Documentos congelam ou são alterados sem critério | C | Criar `MATRIZ_DE_DOCUMENTOS_VIVOS_E_ESTATICOS.md` | Não | **Sim** | SIM |
| L-06 | Rastreabilidade | Doc 02, 09, 13 | Sem matriz que cruze requisito ↔ teste ↔ código ↔ módulo | Impossível auditar cobertura real | C | Criar Doc novo 19 | Não | **Sim** | SIM |
| L-07 | Padrões de código | (transversal) | Sem limites numéricos (tamanho de arquivo/função/complexidade), sem padrões de erro/log/validação/DTO | Código heterogêneo, difícil revisão por IA | C | Criar `PADROES_DE_IMPLEMENTACAO_E_QUALIDADE_DE_CODIGO.md` | Não | **Sim** | SIM |
| L-08 | Contratos | Doc 06 | Sem política formal de versionamento de contratos, deprecação, contract testing, idempotência | Quebra silenciosa de contrato entre frontend e backend | C | Criar Doc novo 27; ampliar Doc 06 | Sim (Doc 06) | **Sim** | SIM |
| L-09 | Privacidade | Doc 17, 18 | LGPD mencionada, mas sem política operacional (bases legais, retenção, DSAR, anonimização, logs) | Risco regulatório e jurídico | C | Criar Doc novo 22 | Sim (Doc 17) | **Sim** | SIM |
| L-10 | Decisões arquiteturais | Doc 04 | Sem catálogo ADR (motivação, alternativas, consequências, status) | Decisões tornam-se folclore; reversões silenciosas | I | Criar Doc novo 20 (ADR-001..n) | Sim (Doc 04) | **Sim** | NÃO |
| L-11 | Branches/PRs | (transversal) | Sem governança de branches, PRs, commits convencionais, code review obrigatório | Histórico caótico, PRs gigantes, sem rastreio | I | Criar Doc novo 21 | Não | **Sim** | NÃO |
| L-12 | Observabilidade | Doc 04 §17, Doc 17 | Observabilidade reduzida a `/health` e logs estruturados | Diagnóstico em produção fica refém de tentativa-erro | I | Criar Doc novo 23 (logs estruturados, métricas, traces, alertas) | Sim (Doc 17) | **Sim** | NÃO |
| L-13 | Operação | Doc 17 | Sem runbooks, sem smoke checks formais, sem rotina de incidente | Incidente vira improviso | I | Criar Doc novo 24 | Sim (Doc 17) | **Sim** | NÃO |
| L-14 | Release | Doc 12, 17 | Sem release readiness checklist nem critério de pronto-para-produção | Releases inconsistentes | I | Criar Doc novo 25 | Sim (Doc 12) | **Sim** | NÃO |
| L-15 | Dados | Doc 14 | Sem definição de seeds, fixtures e dados de demonstração padronizados | Ambientes locais e CI divergem | I | Criar Doc novo 26 | Sim (Doc 14) | **Sim** | NÃO |
| L-16 | Arquitetura | Doc 04 | Falta diagrama C4 (Contexto, Container, Componente), política de evolução e fronteiras formais entre módulos | Limites de domínio ficam difusos | I | Atualizar Doc 04 com C4 e política de evolução | Sim (Doc 04) | Não | NÃO |
| L-17 | API | Doc 06 | Falta versionamento explícito (`/api/v1`), formato de erro padronizado RFC 7807, paginação, idempotência, rate limit | Inconsistência cliente-servidor | I | Atualizar Doc 06 com seções 7..12 propostas | Sim (Doc 06) | Não | NÃO |
| L-18 | Qualidade | Doc 09 | Doc 09 ficará referência genérica; precisa apontar para `ESTRATEGIA_DE_TESTES_DE_CLASSE_MUNDIAL.md` | Duplicação ou conflito | I | Atualizar Doc 09 com referência cruzada | Sim (Doc 09) | Não | NÃO |
| L-19 | Infra/Sec | Doc 17 | Sem IaC, threat model, gestão de segredos, rotação, plano de resposta a incidente, CSP/cabeçalhos HTTP | Riscos de segurança altos | I | Atualizar Doc 17 + Doc novo 24 | Sim (Doc 17) | Sim parcial | NÃO |
| L-20 | Pedagogia | Doc 08 | Falta persona pedagógica formal e métricas mensuráveis (taxa de conclusão, compreensão) | Conteúdo subjetivo, não mensurável | D | Atualizar Doc 08 com persona e métricas | Sim (Doc 08) | Não | NÃO |
| L-21 | Acessibilidade | Doc 07, 16 | Falta roteiro WCAG 2.2 AA formal e checklist axe-core | Risco legal e exclusão de usuários | D | Atualizar Doc 07/16; cobrir em estratégia de testes | Sim | Não | NÃO |
| L-22 | i18n | Doc 07 | Sem política de internacionalização mesmo em PT-BR only | Refatoração custosa no futuro | D | Atualizar Doc 07 com diretriz mínima i18n-ready | Sim | Não | NÃO |
| L-23 | Conteúdo | Doc 08 | Sem política editorial nem revisão por pares | Conteúdo inconsistente em tom/terminologia | D | Atualizar Doc 08 com política editorial | Sim | Não | NÃO |
| L-24 | Métricas | Doc 01 | Sem KPIs de produto e instrumentação esperada | Sem como medir sucesso | D | Atualizar Doc 01 com seção KPIs | Sim | Não | NÃO |
| L-25 | DoR/DoD | Doc 12 | DoR/DoD genéricos; faltam variantes por tipo (frontend, backend, conteúdo, regulatório) | Aceite ambíguo | D | Atualizar Doc 12 com variantes | Sim | Não | NÃO |
| L-26 | UX | Doc 16 | Tokens em texto, não em formato estruturado (JSON/YAML/CSS variables) | Difícil consumir programaticamente | D | Atualizar Doc 16 com tokens em JSON/CSS | Sim | Não | NÃO |
| L-27 | Frontend | Doc 04 | Falta menção a Server Components vs Client Components, estratégia de fetching, cache do Next | Decisões refeitas a cada componente | D | Atualizar Doc 04 §9 | Sim | Não | NÃO |
| L-28 | Backend | Doc 04 | Falta menção a injeção de dependência, padrão de transação, unit-of-work | Padrões reinventados por sprint | D | Atualizar Doc 04 §10 | Sim | Não | NÃO |
| L-29 | Banco | Doc 14 | Falta política de backup, restore, ponto-em-tempo, retenção | Risco de perda de dados | D | Atualizar Doc 14 | Sim | Não | NÃO |
| L-30 | Performance | Doc 09 | Faltam SLOs e SLIs (latência p95, erro rate, throughput) | Performance subjetiva | D | Cobrir em estratégia de testes e Doc 17 | Sim | Não | NÃO |
| L-31 | Segurança | (transversal) | Sem política de SAST/DAST/dependency scanning automático | Vulnerabilidades passam | D | Cobrir em pipeline e Doc 17 | Sim | Não | NÃO |
| L-32 | Conteúdo educacional | Doc 08 | Falta versionamento de conteúdo (revisões, autoria, aprovação) | Conteúdo não-rastreável | D | Atualizar Doc 08 + Doc novo 25 | Sim | Não | NÃO |
| L-33 | UX | Doc 07 | Falta inventário formal de telas e estados (vazio, erro, loading, sucesso) | Telas ad-hoc | D | Atualizar Doc 07 e Doc 16 | Sim | Não | NÃO |
| L-34 | API | Doc 06 | Falta política de timeouts, retries com backoff, circuit breaker | Resiliência fraca | D | Atualizar Doc 06 e Doc novo 23 | Sim | Não | NÃO |
| L-35 | Backlog | Doc 13 | Falta vínculo de cada item do backlog com requisito, contrato e teste | Não há rastreio | D | Atualizar Doc 13 + Doc novo 19 | Sim | Não | NÃO |
| L-36 | Banco | Doc 14 | Faltam padrões de migrations reversíveis, expand-and-contract, locking | Migrations arriscadas | D | Atualizar Doc 14 + Doc novo 26 | Sim | Não | NÃO |
| L-37 | Documentação via código | (transversal) | Não há exigência rígida por TSDoc/docstrings, geração automática (TypeDoc, mkdocs) | Documentação fica fora de sincronia | D | Cobrir em `PADROES_DE_IMPLEMENTACAO_E_QUALIDADE_DE_CODIGO.md` | Não | Sim (já criado) | NÃO |
| L-38 | Conteúdo | Doc 18 | Mapeamento regulatório precisa ser cruzado com módulos do produto (que regra acende em qual módulo) | Compliance solto da implementação | D | Atualizar Doc 18 com matriz regra ↔ módulo | Sim | Não | NÃO |

---

## Resumo de ações

| Ação | Quantidade |
|------|-----------|
| Documentos novos a criar | 9 (Docs 19–27) + 5 governança (Governança IA, Estratégia Testes, Padrões Código, Pipeline, Agente Impacto) |
| Documentos existentes a atualizar (significativo) | 8 (Doc 04, 06, 08, 09, 12, 13, 14, 17, 18) |
| Documentos mantidos sem alteração nesta auditoria | 9 (Doc 00, 01, 02, 03, 05, 07, 10, 11, 15, 16) — alguns marcados para refinamento desejável |
| Lacunas críticas que bloqueiam GO sem ajuste | 9 (L-01..L-09) |
| Lacunas importantes | 10 (L-10..L-19) |
| Lacunas desejáveis | 19 (L-20..L-38) |

> Importante: nesta auditoria foram **criados** os documentos que cobrem todas as lacunas críticas. As lacunas importantes têm seu novo documento ou patch de atualização **especificado** com escopo definido — o conteúdo definitivo das atualizações em documentos existentes deve ocorrer em uma sprint de "Patch Documental Pós-Auditoria" (P0), antes do Sprint 0 de desenvolvimento. As lacunas desejáveis são tratadas em sprint contínua de refinamento documental (P-Refino), em paralelo ao desenvolvimento.

## Política de tratamento

1. Toda lacuna **C** deve estar fechada antes do Sprint 0 de código.
2. Toda lacuna **I** deve estar fechada antes do encerramento do Sprint 1.
3. Toda lacuna **D** deve estar fechada até o final da Fase B do roadmap.
4. Reabertura de lacuna fechada exige justificativa em ADR (ver Doc novo 20).
5. Toda Pull Request que tocar área coberta por lacuna deve referenciar o ID da lacuna no corpo do PR e marcar como resolvida ou em curso.
