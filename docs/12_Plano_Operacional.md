# DOCUMENTO 12 — PLANO OPERACIONAL POR FASES E SPRINTS
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente)
**Tipo:** Plano Operacional por Fases e Sprints
**Status canônico:** VIVO

---

## 1. Finalidade
Transformar o Doc 11 (Prompt-Mestre) e o Doc 10 (Roadmap) em plano executável por fases e sprints, com **DoR/DoD por tipo de tarefa**, premissas operacionais e critérios de transição entre sprints.

## 2. Premissas operacionais
- Cada sprint pode ser **1 semana** (execução por IA) ou **2 semanas** (equipe humana).
- Cada sprint produz incremento executável demonstrável.
- Item só está pronto quando atende ao DoD da sua categoria (§4).
- Sprint **P0 — Patch Documental** precede o Sprint 0 e fecha as lacunas importantes da auditoria (Docs 04, 06, 08, 09, 12, 13, 14, 17, 18 — agora reescritos por esta auditoria) e as referências ao agente/governança/pipeline/agente.

## 3. Definition of Ready (DoR)

### 3.1 DoR — variante geral
Item entra em sprint quando:
- objetivo está claro;
- dependências resolvidas;
- entradas e saídas definidas;
- regra matemática conhecida (se aplicável);
- critério de aceite escrito;
- estimativa relativa atribuída;
- domínio identificado;
- impacto em contrato (sim/não) identificado;
- impacto em schema (sim/não) identificado;
- documentos vivos a atualizar identificados;
- vinculação a REQ-ID do Doc 19 (rastreabilidade);
- não está bloqueado por lacuna crítica em aberto.

### 3.2 DoR — Frontend
Adicional:
- mockup ou wireframe disponível (Doc 16);
- estados de UI definidos (`loading`, `empty`, `error`, `success`);
- responsividade alvo definida.

### 3.3 DoR — Backend (rota nova)
Adicional:
- payload in/out definidos (Doc 06);
- categoria de erro mapeada;
- impacto em OpenAPI definido.

### 3.4 DoR — Backend (domínio)
Adicional:
- referência a Doc 03 (regras matemáticas);
- casos do Doc 15 identificados.

### 3.5 DoR — Conteúdo educacional
Adicional:
- persona alvo identificada;
- nível (1/2/3) definido;
- artefatos relacionados (glossário, FAQ) identificados;
- responsável editorial designado.

### 3.6 DoR — Regulatório (impacto Doc 18)
Adicional:
- fonte regulatória (resolução, página oficial) identificada;
- aviso/disclaimer aplicável definido.

### 3.7 DoR — Infra/Segurança
Adicional:
- impacto em ambientes (dev/hml/prod) listado;
- impacto em segredos/variáveis listado;
- janela e plano de rollback definidos (se aplicável).

## 4. Definition of Done (DoD)

### 4.1 DoD — variante geral
Item está pronto quando:
- código implementado conforme aceite;
- testes verdes (unit, integ, contrato, regressão pertinentes);
- cobertura mantida ou aumentada;
- lint, format, typecheck verdes;
- documentos vivos correspondentes atualizados na mesma PR;
- agente de impacto sem bloqueios;
- revisor humano aprovou;
- ADR criado se decisão arquitetural;
- entrada em Doc 19 (rastreabilidade) atualizada.

### 4.2 DoD — Frontend
Adicional:
- snapshot visual aceito;
- axe-core sem `serious`/`critical`;
- responsividade verificada nos 3 breakpoints;
- estados de UI presentes.

### 4.3 DoD — Backend (rota nova)
Adicional:
- OpenAPI atualizado;
- contract test verde;
- log + métrica + correlação implementados;
- `Idempotency-Key` suportado em mutações.

### 4.4 DoD — Backend (domínio)
Adicional:
- testes contra todos os casos relevantes do Doc 15;
- property-based mínima onde aplicável;
- diff numérico de 100 cenários anexado à PR (modo `make domain:diff`).

### 4.5 DoD — Conteúdo educacional
Adicional:
- fluxo editorial completo (Doc 08 §7);
- versionamento bumpado (Doc 08 §8);
- lint pedagógico verde;
- glossário/FAQ atualizados se necessário.

### 4.6 DoD — Regulatório
Adicional:
- aviso/disclaimer presente;
- fonte e data-base exibidas (quando indicador BCB).

### 4.7 DoD — Infra/Segurança
Adicional:
- IaC atualizado se aplicável;
- runbook criado/atualizado se houver alerta novo;
- migrations reversíveis testadas em hml.

### 4.8 DoD — Release
Adicional:
- checklist `25_Release_Readiness.md` 100%;
- smoke pós-deploy verde;
- janela de observação 30 min sem regressão.

## 5. Estrutura geral do plano

| Fase | Objetivo | Sprints |
|------|----------|---------|
| **P0** | Patch Documental Pós-Auditoria | P0 |
| **A** | Fundação técnica | Sprint 0, Sprint 1 |
| **B** | Núcleo Financeiro | Sprint 2, Sprint 3 |
| **C** | Módulos Centrais do MVP | Sprint 4, Sprint 5, Sprint 6 |
| **D** | Camada Educacional e Consolidação | Sprint 7 |
| **E** | Fechamento do MVP e Pós-MVP Prioritário | Sprint 8, Sprint 9 |
| **F** | Estabilização contínua e refino | sprint contínuo P-Refino paralelo |

## 6. Sprint P0 — Patch Documental Pós-Auditoria
**Objetivo:** materializar no repositório todos os artefatos da auditoria v2 e ativar o agente/pipeline em modo correto.

### Entregas
- Mover/salvar todos os 33 documentos válidos para `/docs/` conforme Matriz Vivo/Estático.
- Materializar ADRs sementes (ADR-0001..ADR-0014).
- Configurar `.github/workflows/ci.yml`, hooks locais (`lefthook`/`pre-commit`), `Makefile`.
- Configurar `scripts/impact_analysis_guard.py` em modo **advisory** no PR.
- Criar `docs/_meta/living_docs.json` (índice de docs vivos).
- Materializar templates de PR e CODEOWNERS.

### Critério de aceite
- CI roda verde (mesmo com agente em advisory);
- repositório possui todos os documentos vivos e estáticos;
- agente emite relatório em PR sem bloquear ainda.

## 7. Sprint 0 — Estrutura base do projeto
**Objetivo:** criar a fundação técnica do produto.

### Histórias de usuário
- HU-001 — Estrutura inicial do sistema
- HU-002 — Backend inicial funcional
- HU-003 — Frontend inicial funcional
- HU-004 — Comunicação inicial frontend↔backend
- HU-005 — Health check (`/health`, `/health/ready`, `/health/live`)

### Critérios
- frontend e backend sobem;
- `/health` e `/metrics` respondem;
- frontend consome `/health`;
- teste mínimo do backend;
- README explica execução local;
- agente de impacto passa para modo **warning** (ainda não bloqueante).

## 8. Sprint 1 — Layout, navegação e contratos-base
**Objetivo:** base navegável e padrão mínimo de comunicação.

### Histórias
- HU-006 a HU-009 (navegação, página inicial, componentes-base, contrato-base).

### Critérios
- sidebar e header funcionais;
- páginas-base acessíveis (axe-core verde);
- estados-base disponíveis;
- contrato-base estável (RFC 7807 + envelope canônico).
- agente de impacto entra em modo **blocking** ao final desta sprint.

## 9. Sprint 2 — Juros Simples e Compostos
**Objetivo:** primeiro módulo financeiro completo.

### Histórias HU-010 a HU-013.

### Critérios
- juros simples e compostos corretos;
- diferença absoluta e percentual;
- tabela, gráfico, interpretação e alertas;
- testes do domínio (Doc 15: JS-* e JC-*) e integração.

## 10. Sprint 3 — PRICE e SAC
HU-014 a HU-017. Critérios: PRICE/SAC corretos; comparação; total pago e juros; tabela e gráfico coerentes; interpretação; testes (Doc 15: PR-*, SAC-*).

## 11. Sprint 4 — Diagnóstico + Financiamento Imobiliário
HU-018 a HU-021. Critérios detalhados conforme v1 + DoD por categoria.

## 12. Sprint 5 — Veículo + Consignado + CDC
HU-022 a HU-025.

## 13. Sprint 6 — Rotativo + Atraso + Indicadores
HU-026 a HU-029.

## 14. Sprint 7 — Glossário, FAQ, explicações contextuais
HU-030 a HU-033.

## 15. Sprint 8 — Exportação, responsividade, regressão
HU-034 a HU-037.

## 16. Sprint 9 — Investir ou Quitar + persistência inicial + cenários salvos
HU-038 a HU-040.

## 17. Sprint contínuo P-Refino (paralelo a partir do Sprint 1)
**Objetivo:** fechar lacunas desejáveis (L-20..L-38 da Matriz de Lacunas) e aprofundar conteúdo, acessibilidade, performance, observabilidade.

## 18. Critérios de transição entre sprints
Sprint só fecha quando:
- todas as histórias atendem ao DoD da sua categoria;
- demo executável foi feita;
- relatório de impacto consolidado da sprint registrado;
- backlog da próxima sprint refinado e em DoR.

## 19. Política de hotfix
- Criação imediata de branch `fix/hotfix-vYYYY.MM.DD-N`.
- Mesmo DoD, em modo expresso.
- Smoke pós-deploy + post-mortem em até 48h.

## 20. Política para a Claude Code
1. Não pular DoR; item sem DoR não entra em sprint.
2. Não fechar item sem DoD da sua categoria.
3. Não acumular dívida documental para "depois".
4. Atualizar Doc 19 (rastreabilidade) em toda PR.

## 21. Critérios de aceite deste documento
- DoR/DoD por categoria explícitos;
- fases e sprints alinhadas ao Doc 10 (Roadmap);
- Sprint P0 explícita;
- política de hotfix definida.
