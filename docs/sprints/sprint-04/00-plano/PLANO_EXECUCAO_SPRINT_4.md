# PLANO_EXECUCAO_SPRINT_4.md

Projeto: Plataforma Educacional Financeira
Data: 2026-05-06
Branch de planejamento: sprint-4/f0-plano-execucao-claude
Elaborado por: Claude Code (rodada F0)
Status: AGUARDANDO AUDITORIA E APROVAÇÃO DO PO

---

## 1. Histórico de revisões

| Versão | Data | Autor | Alteração |
| --- | --- | --- | --- |
| 1.0 | 2026-05-06 | Claude Code (F0) | Criação inicial — planejamento documental auditável |
| 1.1 | 2026-05-06 | Claude Code (F0 — amend pós-auditoria) | Correções pós-auditoria Camaleão/Moisés: working tree em baseline, cobertura harmonizada (75% global / 80% domínio), Doc 03 com caminho real, trava de thresholds explícita, RF-DIAG-001 clarificado |

---

## 2. Estado oficial de partida

| Campo | Valor | Prova |
| --- | --- | --- |
| Commit base | c645138 | git rev-parse HEAD |
| main = origin/main | OK | test HEAD = origin/main |
| Sprint 3 | FECHADA | PR #17, commit 4a9d30e |
| Sprint 3.5 | FECHADA | PR #22, commit c645138 |
| PR #19 | CLOSED (sem merge) | gh pr view 19 — mergedAt: null |
| Sprint 3.5/F2 real | PR #20, commit e4cd127 | gh pr view 20 |
| Sprint 3.5/F3 | PR #22, commit c645138 | gh pr view 22 |
| Pipeline herdado | VERDE (Sprint 3.5/F3) | docs/sprints/sprint-03-5/validacao-oficial.md |
| Runtime herdado | VERDE — /, /juros, /amortizacao, /diagnostico | docs/sprints/sprint-03-5/evidencias/F3-gates.md |
| Working tree | sem alterações versionadas; `.claude/` local não rastreado e não incluído no commit | git status -sb / F0-git-baseline.md |
| Testes frontend | 188 passando | Sprint 3.5/F3 gates |
| Lint pedagógico | 0 bloqueios | Sprint 3.5/F3 gates |

---

## 3. FATO / INFERÊNCIA / LIMITAÇÃO

### Fatos (comprovados por código, arquivo, commit ou PR)

- FATO: main = origin/main = c645138 no momento da criação desta branch.
- FATO: Sprints 0, 1, 2, 3 e 3.5 estão formalmente fechadas.
- FATO: PR #19 foi fechado sem merge; a F2 da Sprint 3.5 foi materializada pelo PR #20.
- FATO: Os módulos /juros e /amortizacao têm Financial Cockpit implementado e testado.
- FATO: 10 domínios backend são stubs vazios (apenas __init__.py).
- FATO: 10 rotas frontend são stubs "em breve" (apenas page.tsx de estado "em construção").
- FATO: A infraestrutura de cockpit (FinancialCockpitShell, CockpitCharts, CockpitModal, etc.) está disponível e testada.
- FATO: O padrão de vertical slice foi estabelecido e comprovado nas Sprints 2 e 3.
- FATO: Doc 10 §5 lista Diagnóstico Financeiro como primeiro módulo da Fase 3.
- FATO: Doc 08 §12.1 especifica conteúdo educacional mínimo para o módulo de diagnóstico.
- FATO: stub /diagnostico existe em frontend/src/app/(app)/diagnostico/page.tsx.
- FATO: stub backend/app/domain/diagnostic/__init__.py existe.

### Inferências (prováveis a partir das evidências)

- INFERÊNCIA: o Diagnóstico Financeiro é o próximo módulo mais coerente para a Sprint 4, dada sua posição no roadmap e independência de outros módulos.
- INFERÊNCIA: a infraestrutura de cockpit pode ser reutilizada sem modificação.
- INFERÊNCIA: o padrão de 4 fatias (domain → service/API → frontend → content/docs) é aplicável ao diagnóstico.
- INFERÊNCIA: as regras de negócio do diagnóstico são baseadas em thresholds auditáveis (comprometimento de renda, reserva de emergência, sobra mensal).

### Limitações (não confirmadas ou indisponíveis)

- LIMITAÇÃO: os thresholds numéricos exatos das regras de diagnóstico (comprometimento, reserva, saúde) precisam ser confirmados em `docs/baseline/03_Regras_de_Negocio.md` no início da F1. Esta análise usa valores de referência comuns como estimativa. A F1 NÃO deve codificar thresholds antes de confirmar esta fonte ou obter decisão explícita do PO.
- LIMITAÇÃO: os casos de teste matemáticos do Doc 15 para diagnóstico não foram verificados — podem estar ausentes. Se ausentes, precisam ser criados na F1 ou F2.
- LIMITAÇÃO: o texto educacional específico para /diagnostico não foi lido em detalhe além do heading do Doc 08 §12.1.
- LIMITAÇÃO: o lint pedagógico será executado na F4; não há prova de conformidade anterior para conteúdo de diagnóstico.

---

## 4. Objetivo da Sprint 4

Implementar o **módulo Diagnóstico Financeiro** como vertical slice completo:
domínio puro → service e endpoint REST → frontend com Financial Cockpit → conteúdo educacional integrado → documentação viva atualizada.

Ao final da Sprint 4, a rota /diagnostico deve sair do estado "em breve" e se tornar um módulo funcional completo, com backend real, API exposta, frontend com cockpit, conteúdo educacional e testes em todas as camadas.

---

## 5. Justificativa da Sprint 4

1. **Sequência natural de produto:** o usuário deve entender sua saúde financeira antes de usar simuladores de juros ou financiamentos. O diagnóstico é a porta de entrada lógica do produto.
2. **Posição no roadmap:** é o primeiro módulo listado na Fase 3 do Doc 10 §5, imediatamente após o motor financeiro (juros + amortização) entregue nas Sprints 2 e 3.
3. **Domínio independente:** não requer dados externos (Selic, IPCA) nem módulos ainda não implementados. As regras (comprometimento de renda, reserva, sobra) são puramente matemáticas e auditáveis.
4. **Infraestrutura pronta:** o cockpit construído na Sprint 3.5 pode ser reutilizado sem alteração.
5. **Coerência editorial:** alinha com o princípio "educação integrada ao uso" (Doc 08 §5.7) e com a persona "Iniciante Curioso" (Doc 08 §3.1) — quem não conhece sua situação financeira não sabe o que simular.

---

## 6. Escopo permitido

- backend/app/domain/diagnostic/
- backend/app/schemas/diagnostic/
- backend/app/services/diagnostic/
- backend/app/api/v1/diagnostic.py
- backend/app/api/v1/router.py (adicionar registro do novo router)
- backend/tests/unit/domain/diagnostic/
- backend/tests/unit/services/diagnostic/
- backend/tests/integration/api/diagnostic/
- backend/tests/contract/test_diagnostic.py
- frontend/src/app/(app)/diagnostico/page.tsx (substituir stub)
- frontend/src/components/diagnostic/
- frontend/src/services/diagnostic/
- frontend/src/content/diagnostico/
- frontend/src/__tests__/app/diagnostico.test.tsx
- frontend/src/__tests__/components/diagnostic/
- frontend/src/__tests__/services/diagnostic/
- frontend/src/__tests__/content/diagnostico/
- docs/api/openapi.json (sincronizar endpoint novo)
- docs/19_Matriz_Rastreabilidade.md (adicionar RF-DIAG-001)
- docs/07_UX_UI_e_Navegacao.md (registrar /diagnostico)
- docs/08_Conteudo_Educacional.md (registrar materialização sprint 4)
- docs/sprints/sprint-04/ (artefatos documentais da sprint)
- docs/_meta/living_docs.json (atualizar ao fechar)

---

## 7. Escopo proibido

- Qualquer alteração fora do módulo diagnóstico
- Alterar lógica existente de juros, amortização ou qualquer módulo já implementado
- Criar novos módulos além do diagnóstico (financing, loans, credit_card, etc.)
- Alterar backend/app/domain/interest/, amortization/ (ou seus testes)
- Alterar frontend/src/app/(app)/juros/, amortizacao/
- Alterar frontend/src/components/interest/, amortization/ (exceto bug crítico documentado)
- Alterar .github/workflows/
- Alterar scripts/pipeline.sh, scripts/pipeline.ps1
- Alterar Makefile
- Alterar docker-compose*, Dockerfile*
- Alterar package.json, pnpm-lock.yaml
- Alterar pyproject.toml
- Alterar docs/baseline/
- Alterar docs/operacional/*.xlsx (planilha — nunca pela Claude Code)
- Alterar CLAUDE.md, README.md (exceto se atualização for parte do escopo documental)
- Fazer push, PR, merge ou release
- Iniciar Sprint 4/F1 sem aprovação do PO

---

## 8. Arquitetura impactada

### Backend
- Novo router: `app/api/v1/diagnostic.py`
- Registro em: `app/api/v1/router.py`
- Novo domínio puro: `app/domain/diagnostic/analyzer.py`, `rules.py`
- Novo service: `app/services/diagnostic/diagnostico_service.py`
- Novo schema: `app/schemas/diagnostic/analyze.py`
- OpenAPI: `docs/api/openapi.json` deve ser ressincronizado

### Frontend
- Nova página: `frontend/src/app/(app)/diagnostico/page.tsx` (substituição do stub)
- Novos componentes: `frontend/src/components/diagnostic/`
- Novo service: `frontend/src/services/diagnostic/diagnosticoService.ts`
- Novo conteúdo: `frontend/src/content/diagnostico/`
- Reutilização: `FinancialCockpitShell` e primitivos do cockpit (sem alteração)

### Sem impacto esperado
- DB/migrations (diagnóstico não requer persistência no MVP)
- Infraestrutura Docker
- CI/CD workflows
- Demais módulos existentes

---

## 9. Fatias propostas

### Sprint 4 / F0 — Planejamento documental (ESTA FATIA)

**Objetivo:** elaborar plano auditável antes de qualquer implementação.
**Entrada:** commit c645138 / Sprint 3.5 fechada.
**Saída:** PLANO_EXECUCAO_SPRINT_4.md + 3 evidências F0 + commit local documental.
**Arquivos:** docs/sprints/sprint-04/00-plano/ + evidencias/
**Testes:** nenhum (doc-only)
**DoR:** Sprint 3.5 fechada; main = c645138; branch criada.
**DoD:** plano criado; evidências criadas; commit local; lint pedagógico verde; escopo proibido vazio; auditoria do Camaleão; aprovação do PO.
**Risco:** nenhum (sem código).
**Critério de aceite:** documentos criados; fatos separados de inferências; nenhum código alterado; commit local sem push.
**Critério de rejeição:** qualquer arquivo de código alterado; push executado; Sprint 3.5 não fechada na base.

---

### Sprint 4 / F1 — Domínio puro (diagnóstico financeiro)

**Objetivo:** implementar a lógica de diagnóstico como domínio puro no backend, sem dependências externas.
**Entrada:** plano F0 aprovado; main atual.
**Saída:** `backend/app/domain/diagnostic/analyzer.py`, `rules.py`; testes unitários do domínio verdes.

**Arquivos prováveis:**
```
backend/app/domain/diagnostic/analyzer.py
backend/app/domain/diagnostic/rules.py
backend/tests/unit/domain/diagnostic/__init__.py
backend/tests/unit/domain/diagnostic/test_analyzer.py
backend/tests/unit/domain/diagnostic/test_rules.py
backend/tests/unit/domain/diagnostic/test_properties.py  (hypothesis)
```

**Testes obrigatórios:**
- Testes unitários do domínio puro: cada regra individualmente.
- Testes de propriedade (hypothesis): invariantes matemáticas (comprometimento ∈ [0%,100%], reserva ≥ 0, sobra = renda - despesas - dividas).
- Cobertura mínima: 80% nas funções de domínio.

**TRAVA OBRIGATÓRIA DE THRESHOLDS:**

Antes de escrever qualquer linha de código na F1, a Claude Code deve:

1. Ler `docs/baseline/03_Regras_de_Negocio.md` e localizar as seções de diagnóstico financeiro.
2. Verificar se os seguintes valores estão documentados de forma inequívoca:
   - threshold de comprometimento de renda (ex.: ≤30% = saudável);
   - threshold de reserva de emergência em meses (ex.: ≥3 meses = mínimo);
   - definição de sobra mensal (renda - despesas fixas - dívidas mensais);
   - classificação dos níveis de saúde financeira (ex.: crítica / frágil / moderada / boa / ótima) com limites numéricos associados.
3. Se estes valores **estiverem presentes e inequívocos**: prosseguir, registrar como FATO na evidência F1.
4. Se estes valores **estiverem ausentes ou ambíguos**: parar imediatamente, registrar LIMITAÇÃO com o trecho exato do documento, e aguardar decisão explícita do PO antes de codificar.

**É proibido transformar valores estimados (ex.: "30% é comum no mercado") em regra de negócio sem fonte documental ou decisão formal registrada.**

**DoR:**
- Plano F0 aprovado pelo PO.
- main atualizada; branch sprint-4/f1-dominio-diagnostico criada a partir de main.
- Trava de thresholds acima executada; resultado registrado na evidência F1-dominio-regras.md.

**DoD:**
- Domínio puro implementado sem dependência de DB, framework ou external.
- Testes unitários e de propriedade verdes.
- Mypy strict sem erro.
- Ruff sem erro.
- Coverage ≥ 80% no domínio.
- Nenhum frontend alterado.
- Lint pedagógico verde.
- PR criado; pipeline verde; aprovação de Camaleão e Moisés.

**Riscos:**
- Regras de negócio não completamente especificadas em `docs/baseline/03_Regras_de_Negocio.md` → registrar LIMITAÇÃO no início da F1 e propor decisão ao PO antes de codificar qualquer threshold.

**Critério de aceite:** domínio puro funcional, testado, sem alteração de código existente.
**Critério de rejeição:** regras inventadas sem base documental; testes falhando; mypy com erro; cobertura do domínio diagnóstico < 80% (gate específico desta fatia); thresholds codificados sem fonte documental ou aprovação do PO.

---

### Sprint 4 / F2 — Service + API + contrato (diagnóstico)

**Objetivo:** expor o domínio via service e endpoint REST; sincronizar OpenAPI; criar testes de integração e contrato.
**Entrada:** F1 mergeada; domínio diagnóstico implementado e testado.
**Saída:** `POST /api/v1/diagnostic/analyze` exposto; OpenAPI atualizado; testes de integração e contrato verdes.

**Arquivos prováveis:**
```
backend/app/schemas/diagnostic/__init__.py
backend/app/schemas/diagnostic/analyze.py
backend/app/services/diagnostic/__init__.py
backend/app/services/diagnostic/diagnostico_service.py
backend/app/api/v1/diagnostic.py
backend/app/api/v1/router.py  (registrar router de diagnóstico)
docs/api/openapi.json  (ressincronizar)
backend/tests/unit/services/diagnostic/__init__.py
backend/tests/unit/services/diagnostic/test_diagnostico_service.py
backend/tests/integration/api/diagnostic/__init__.py
backend/tests/integration/api/diagnostic/test_analyze.py
backend/tests/integration/api/diagnostic/test_errors.py
backend/tests/contract/test_diagnostic.py
docs/19_Matriz_Rastreabilidade.md  (adicionar RF-DIAG-001 com status in_progress)
```

**Testes obrigatórios:**
- Unit: service com mock do domínio.
- Integration: endpoint com TestClient (happy path + erros de validação).
- Contract: envelope, schema e RFC 7807.

**DoR:** F1 mergeada; main atualizada; branch sprint-4/f2 criada a partir de main.
**DoD:** endpoint exposto; OpenAPI atualizado; todos os testes verdes; envelope correto; RFC 7807 em erros; mypy strict; ruff; lint pedagógico.
**Critério de rejeição:** endpoint quebrado; OpenAPI desatualizado; testes falhando; envelope ausente.

---

### Sprint 4 / F3 — Frontend /diagnostico (cockpit)

**Objetivo:** substituir o stub /diagnostico por página funcional com Financial Cockpit, integrada à API.
**Entrada:** F2 mergeada; endpoint POST /api/v1/diagnostic/analyze disponível.
**Saída:** página /diagnostico funcional com formulário, KPIs, alertas, interpretação e painel educacional.

**Arquivos prováveis:**
```
frontend/src/app/(app)/diagnostico/page.tsx  (substituição do stub)
frontend/src/components/diagnostic/DiagnosticoCockpit.tsx
frontend/src/components/diagnostic/DiagnosticoForm.tsx
frontend/src/components/diagnostic/DiagnosticoSummary.tsx
frontend/src/components/diagnostic/DiagnosticoAlerts.tsx
frontend/src/components/diagnostic/DiagnosticoInterpretation.tsx
frontend/src/components/diagnostic/formValidation.ts
frontend/src/components/diagnostic/index.ts
frontend/src/services/diagnostic/diagnosticoService.ts
frontend/src/services/diagnostic/index.ts
frontend/src/types/diagnostic.ts
frontend/src/__tests__/app/diagnostico.test.tsx
frontend/src/__tests__/services/diagnostic/diagnosticoService.test.ts
frontend/src/__tests__/components/diagnostic/DiagnosticoForm.test.tsx
frontend/src/__tests__/components/diagnostic/DiagnosticoSummary.test.tsx
```

**Testes obrigatórios:**
- Page: render, formulário, estados (loading, erro, resultado).
- Service: chamada à API, tipagem da resposta.
- Componentes: form validation, summary, alertas.
- Governança: cockpit governance (reutilização dos primitivos).

**DoR:** F2 mergeada; endpoint testável localmente; branch sprint-4/f3 criada.
**DoD:** stub substituído; formulário funcional; resultado exibido; estados loading/erro/sucesso; testes verdes; typecheck; lint; pipeline verde.
**Critério de rejeição:** stub não substituído; testes falhando; typecheck com erro; lógica financeira no frontend.

---

### Sprint 4 / F4 — Conteúdo educacional + docs vivos

**Objetivo:** criar conteúdo educacional do módulo diagnóstico, integrar ao cockpit e atualizar documentação viva.
**Entrada:** F3 mergeada; página /diagnostico funcional.
**Saída:** conteúdo educacional integrado; docs vivos atualizados; RF-DIAG-001 fechado na matriz; lint pedagógico verde.

**Arquivos prováveis:**
```
frontend/src/content/diagnostico/nivel-1.ts
frontend/src/content/diagnostico/nivel-2.ts
frontend/src/content/diagnostico/glossario.ts
frontend/src/content/diagnostico/alertas.ts
frontend/src/content/diagnostico/index.ts
frontend/src/content/diagnostico/types.ts
frontend/src/__tests__/content/diagnostico/conteudo.test.ts
docs/19_Matriz_Rastreabilidade.md  (RF-DIAG-001 → done)
docs/07_UX_UI_e_Navegacao.md  (§9.3 materialização /diagnostico sprint 4)
docs/08_Conteudo_Educacional.md  (§13.4 glossário e conteúdo sprint 4)
docs/sprints/sprint-04/relatorio-execucao.md
docs/sprints/sprint-04/relatorio-forense.md
docs/sprints/sprint-04/validacao-oficial.md
docs/_meta/living_docs.json  (registrar novos documentos)
```

**Testes obrigatórios:**
- Testes editoriais do conteúdo (lint pedagógico; glossário completo; sem promessa de retorno; aviso educacional presente).
- Testes de runtime: conteúdo renderizado na página (data-testid).

**DoR:** F3 mergeada; conteúdo rascunhado.
**DoD:** conteúdo Nível 1 e 2 presentes; glossário com termos do módulo; lint pedagógico verde; RF-DIAG-001 = done; docs vivos atualizados; pipeline verde.
**Critério de rejeição:** lint pedagógico com bloqueio; glossário incompleto; RF-DIAG-001 não atualizado; docs vivos inconsistentes.

---

## 10. Estratégia de testes

| Camada | O que testar | Ferramentas |
| --- | --- | --- |
| Domain unit | Cada regra isolada; invariantes matemáticas | pytest, hypothesis |
| Service unit | Orquestração; mock do domínio | pytest |
| Integration | Endpoint real com TestClient; erros de validação | pytest, httpx |
| Contract | Envelope; schema; RFC 7807 | pytest |
| Frontend component | Formulário; estados; service mock | vitest, testing-library |
| Frontend service | Chamadas à API; tipagem | vitest |
| Content | Conformidade editorial; glossário; aviso | vitest |
| Regression pedagógica | Invariantes educacionais do diagnóstico | pytest |

Cobertura mínima do backend: 75% geral (herdado); 80% no domínio diagnóstico.

---

## 11. Estratégia documental

- Toda PR de implementação deve atualizar Doc 19 (linha RF-DIAG-*).
- Toda PR de conteúdo deve seguir o fluxo editorial do Doc 08 §7.
- OpenAPI deve ser ressincronizado na F2.
- Docs vivos afetados: 07, 08, 09, 15, 19, living_docs.json.
- Relatório de execução e fechamento criados na F4.
- Planilha operacional: NÃO alterada pela Claude Code.

### Nota sobre RF-DIAG-001 e requisitos do módulo diagnóstico

`RF-DIAG-001` é o identificador do requisito inicial do módulo Diagnóstico Financeiro. Ele cobre o fluxo central: receber dados financeiros do usuário e retornar diagnóstico de saúde financeira.

A Sprint 4 pode gerar um único requisito (`RF-DIAG-001`) se o módulo for implementado como endpoint único de análise, ou múltiplos requisitos (`RF-DIAG-001`, `RF-DIAG-002`, etc.) se forem identificadas sub-funcionalidades distintas durante a F1 (ex.: diagnóstico de renda separado de diagnóstico de reserva).

**Regra:** o número de linhas RF-DIAG-* na Matriz 19 deve refletir exatamente o que for implementado — nem mais, nem menos. A decisão é tomada na F1, após leitura de `docs/baseline/03_Regras_de_Negocio.md`. Por ora, o plano assume `RF-DIAG-001` como requisito único inicial, passível de expansão com justificativa.

---

## 12. Governança operacional

```
Claude Code planeja e implementa conforme prompt operacional de cada fatia
    ↓
Camaleão (ChatGPT) audita cada PR e valida fatos vs inferências
    ↓
Moisés decide merge e aprovação de cada fatia
    ↓
GitHub materializa (push + PR + merge)
    ↓
Pipeline CI prova verde
    ↓
Planilha operacional é atualizada por Moisés/Camaleão
```

Claude Code NÃO faz push, PR, merge ou atualização de planilha.

---

## 13. Critérios de aceite da Sprint 4

- [ ] Endpoint POST /api/v1/diagnostic/analyze funcionando e documentado no OpenAPI.
- [ ] Página /diagnostico funcional com cockpit (formulário, resultado, alertas, educacional).
- [ ] Testes backend verdes: unit (domain + service), integration, contract.
- [ ] Testes frontend verdes: page, components, service, content.
- [ ] Typecheck frontend: zero erros.
- [ ] Mypy strict backend: zero erros.
- [ ] Ruff backend: zero erros.
- [ ] Lint pedagógico: 0 bloqueios.
- [ ] RF-DIAG-001 na Matriz 19: status = done.
- [ ] Docs vivos 07, 08, 09, 15, 19 atualizados.
- [ ] Pipeline CI verde em todos os jobs.
- [ ] Planilha operacional atualizada pelo PO/Camaleão.

---

## 14. Critérios de reprovação automática

- Qualquer lint com erro.
- Qualquer formato com diferença.
- Qualquer teste obrigatório falhando.
- Lógica financeira implementada no frontend (ADR-0004).
- Push, PR ou merge feito pela Claude Code sem autorização.
- Planilha alterada pela Claude Code.
- Código de módulos existentes alterado sem justificativa formal.
- RF-DIAG-001 ausente ou incorreto na Matriz 19 ao fechar a F4.
- Docs vivos não atualizados na F4.

---

## 15. Riscos e mitigação

| Risco | Nível | Mitigação |
| --- | --- | --- |
| Regras numéricas do diagnóstico não especificadas em `docs/baseline/03_Regras_de_Negocio.md` | Médio | Ler o documento no início da F1; se insuficiente, parar e propor ao PO antes de codificar — ver trava explícita §9/F1 |
| Thresholds de saúde financeira subjetivos ou contestáveis | Médio | Exigir fonte citável (ex.: BCB, FEBRABAN, ou decisão formal do PO) na F1; registrar como INFERÊNCIA enquanto não confirmados; proibido transformar estimativa em regra de negócio |
| Conteúdo educacional não aprovado por Camaleão antes do merge F4 | Baixo | Submeter rascunho a Camaleão antes de fechar PR da F4 |
| Warning Recharts/jsdom herdado pode aparecer nos novos testes | Baixo | Residuo conhecido e não bloqueante; documentar se aparecer |
| Cockpit do diagnóstico pode ter layout diferente dos módulos numéricos | Baixo | Diagnóstico não produz gráficos de série temporal; cockpit pode ter layout de cards/gauges — definir na F3 |

---

## 16. Dependências

| Dependência | Estado | Impacto |
| --- | --- | --- |
| Sprint 3.5 fechada | FATO: confirmado | Sem impacto — pré-requisito atendido |
| Infraestrutura de cockpit | FATO: disponível | F3 pode reutilizar sem alteração |
| `docs/baseline/03_Regras_de_Negocio.md` §diagnóstico | LIMITAÇÃO: não lido em detalhe nesta rodada | Deve ser lido no início da F1; se thresholds ausentes, parar e propor ao PO |
| Doc 15 casos diagnóstico | LIMITAÇÃO: possivelmente ausente | Criar ou confirmar existência na F1 |
| Pipeline CI | FATO: verde | Pré-requisito atendido |

---

## 17. Pendências herdadas

- Warning Recharts/jsdom em testes: residuo não bloqueante, conhecido.
- Refinamento mobile do cockpit: planejado para sprint futura.
- Testes de regressão pedagógica do backend: pendentes (herdado das Sprints 2 e 3).
- Casos de teste JS-04..JS-10 e JC-04..JC-10 no Doc 15: planejados, não exercidos.

---

## 18. Plano de evidências

| Fatia | Evidências obrigatórias |
| --- | --- |
| F0 | F0-git-baseline.md, F0-inventario-base.md, F0-analise-escopo-sprint-4.md, PLANO_EXECUCAO_SPRINT_4.md |
| F1 | F1-git-baseline.md, F1-dominio-regras.md, F1-testes-unitarios.md |
| F2 | F2-git-baseline.md, F2-endpoint.md, F2-openapi.md, F2-testes-integracao.md |
| F3 | F3-git-baseline.md, F3-frontend-cockpit.md, F3-testes-frontend.md, F3-runtime.md |
| F4 | F4-git-baseline.md, F4-conteudo-editorial.md, F4-lint-pedagogico.md, F4-gates.md |
| Fechamento | relatorio-execucao.md, relatorio-forense.md, validacao-oficial.md |

---

## 19. Impacto na planilha

A planilha operacional (`docs/operacional/backlog_operacional_acompanhamento.xlsx`) NÃO será alterada pela Claude Code.
A atualização da planilha é responsabilidade exclusiva de Moisés e Camaleão, após auditoria e fechamento de cada fatia.

---

## 20. Próxima decisão requerida do PO

**Moisés deve aprovar ou ajustar antes de iniciar Sprint 4/F1:**

1. **Escopo da Sprint 4:** confirmar que o módulo Diagnóstico Financeiro é o objetivo da Sprint 4 (ou indicar outro módulo).
2. **Regras numéricas de negócio:** confirmar que `docs/baseline/03_Regras_de_Negocio.md` contém os thresholds exatos de comprometimento de renda, reserva de emergência, sobra mensal e nível de saúde financeira — ou especificá-los diretamente no prompt da F1. A F1 não pode codificar sem esta confirmação.
3. **Fatias aprovadas:** confirmar as 4 fatias (F1–F4) conforme propostas, ou ajustar.
4. **Autorização de início:** emitir prompt operacional de Sprint 4/F1 após aprovação deste plano pelo Camaleão.

**Fluxo esperado:**
```
Camaleão lê e audita este plano
    ↓
Camaleão emite parecer (aprovado / ajustes necessários)
    ↓
Moisés decide
    ↓
Se aprovado: Moisés emite PROMPT OPERACIONAL — SPRINT 4 / F1
    ↓
Claude Code inicia F1 a partir de main atualizada
```

Sem esta aprovação explícita, a Sprint 4/F1 NÃO deve ser iniciada.
