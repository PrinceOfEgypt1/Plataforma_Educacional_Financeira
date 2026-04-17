# VERIFICAÇÃO FINAL DO AGENTE DE ANÁLISE DE IMPACTO
## Plataforma Educacional Financeira — Gate Forense Prompt 2

**Versão:** 1.0
**Data:** 2026-04-14

---

## 1. O agente/script está suficientemente especificado?

**Sim — CONFIRMADO em 4 dimensões.**

### 1.1 Dimensão documental
**Arquivo:** `docs/qualidade/AGENTE_DE_ANALISE_DE_IMPACTO.md` (G5 v2.0, maduro).

Contém as 17 seções canônicas:
1. Missão
2. Localização (7 caminhos físicos declarados)
3. Entradas (10 flags + 3 variáveis de ambiente)
4. Saídas (2 relatórios + 4 códigos de saída)
5. Conteúdo do relatório (10 itens padronizados)
6. Estratégia de fallback (9 cenários: paths POSIX, git ausente, base ref ausente, submódulos, renames, binários, encoding, PR sem labels, diff vazio)
7. Política de erro (tabela de 10 situações)
8. Validação de configuração (schema externo)
9. Cenários de bloqueio (10 cenários)
10. Edge cases (7 cenários)
11. Estágios de adoção (advisory → warning → blocking) com critérios objetivos de transição
12. Integração no pipeline (4 modos × 4 eventos)
13. Critérios de confiança (cobertura ≥90%, revisão semestral, métricas semanais, `__version__`)
14. Limitações conhecidas (7 limitações declaradas honestamente)
15. Testes mínimos (9 classes de cobertura)
16. Roadmap (v2.1, v2.2, v3.0, v3.1)
17. Critérios de aceite

### 1.2 Dimensão de código
**Arquivo:** `scripts/impact_analysis_guard.py` — versão 2.0.0.

Verificação forense executada:
```
$ python scripts/impact_analysis_guard.py --version
impact_analysis_guard 2.0.0
```

Funções auditadas:
- `load_config()` — carrega e valida `rules.yaml`.
- `_validate_config()` — validação leve embutida (tipos, unicidade, padrão snake_case, severity válida).
- `_glob_match()` / `_glob_to_regex()` — path matching POSIX + gitignore-style.
- `changed_files()` — git diff com fallback `main` se `origin/main` ausente.
- `analyze()` — produz findings (`block`/`warn`/`info`) com sugestões.
- `write_report()` — dual output MD + JSON com checksum.
- `main()` — 4 modos, 4 estágios, 4 códigos de saída, `--changed-files` como fallback sem git.

### 1.3 Dimensão de configuração
**Arquivo:** `scripts/impact/rules.yaml` — 23 regras de produção cobrindo:
`domain_financial`, `api_surface`, `services`, `repositories`, `db_migrations`, `seeds_fixtures`, `backend_core`, `exporters`, `frontend_components`, `frontend_app`, `frontend_api_client`, `education_content`, `regulatory_indicators`, `compliance`, `pipeline`, `infra_iac`, `observability`, `lgpd_dsar`, `adrs`, `static_baseline`, `runbooks`, `release_readiness`, `openapi_artifact`.

**Arquivo:** `scripts/impact/schema.yaml` — JSON-Schema em YAML validando o `rules.yaml`.

### 1.4 Dimensão de testes
**Arquivo:** `scripts/tests/test_impact_analysis_guard.py`.

Execução forense nesta data:
```
$ pytest scripts/tests/test_impact_analysis_guard.py -q
27 passed in 0.09s
```

Cobertura de casos:
- Glob matching (simple, double-star, no-match, normalização POSIX) — 4 testes.
- Carregamento de config (mínimo, ausente, IDs duplicados, severity inválida, ID inválido) — 5 testes.
- Análise (docs vivos não tocados, testes não tocados, requisitos atendidos, override por label, migration sem downgrade, migration com downgrade, static_baseline bloqueia, static_baseline com rebaseline ok, human review warn/ok, advisory never blocks, disabled rule ignored) — 12 testes.
- Report (MD+JSON) — 1 teste.
- Main exit codes (nochange, missing rules, blocking blocks, advisory never fails) — 4 testes.

**Total: 27 testes cobrindo as trajetórias críticas.**

## 2. Ele realmente ajuda a impedir regressão?

**Sim — CONFIRMADO, em 4 mecanismos independentes.**

### 2.1 Por categoria de arquivo
O agente associa **todo arquivo alterado** a uma ou mais regras. Cada regra declara:
- `requires_tests`: testes que devem existir/ser tocados.
- `requires_docs_living`: docs vivos obrigatórios.
- `severity`: `critical` | `high` | `medium` | `low` | `info`.
- `risks`: categorias de regressão (ex.: `regression_financial`, `regression_pedagogical`, `visual_regression`, `contract_break`).

### 2.2 Por regressão matemática
Regra `domain_financial` com `severity: critical` exige:
- `backend/tests/unit/domain/**` tocado;
- `backend/tests/regression/financial/**` tocado;
- Doc 03, Doc 15 e Doc 19 atualizados.

**Efeito:** PR que toca `app/domain/interest/simple.py` e não adiciona teste correspondente **é bloqueada** (com agente em `blocking`).

### 2.3 Por regressão de contrato
Regra `api_surface` com `severity: critical` exige:
- `backend/tests/contract/**` tocado;
- `backend/tests/integration/**` tocado;
- Doc 06, Doc 27, Doc 19 atualizados.

### 2.4 Por regressão de schema
Regra `db_migrations` com `requires_reversibility: true` **lê o arquivo de migration** e verifica presença de `def downgrade(`. Ausência = bloqueio.

**Teste auditado:** `test_migration_without_downgrade_blocks` e `test_migration_with_downgrade_ok` — ambos verdes.

### 2.5 Por regressão visual/a11y
Regra `frontend_components` com `severity: high` exige:
- `frontend/tests/visual/**` tocado;
- `frontend/tests/a11y/**` tocado;
- Doc 07 e Doc 16 atualizados.

### 2.6 Por mudança em documento estático
Regra `static_baseline` com `forbid_changes_unless_rebaseline: true` bloqueia qualquer mudança em `docs/baseline/**` sem label `rebaseline:docXX` ou `baseline:doc11` na PR.

**Teste auditado:** `test_static_baseline_blocks_without_label` e `test_static_baseline_ok_with_rebaseline_label` — ambos verdes.

## 3. Ele cobre todos os aspectos exigidos?

Matriz de cobertura explicitada pelo Prompt 2:

| Aspecto exigido | Cobertura | Regra(s) em `rules.yaml` |
|-----------------|-----------|--------------------------|
| Módulos impactados | ✓ | `domain_financial`, `services`, `repositories`, `backend_core`, `exporters`, `frontend_components`, `frontend_app`, `education_content` |
| Contratos impactados | ✓ | `api_surface`, `frontend_api_client`, `openapi_artifact` |
| Testes impactados | ✓ | Toda regra com `requires_tests` declarado |
| Documentos vivos impactados | ✓ | Toda regra com `requires_docs_living` declarado; `static_baseline` para estáticos |
| Migrations | ✓ | `db_migrations` com `requires_reversibility: true` |
| Seeds/fixtures | ✓ | `seeds_fixtures` e `db_migrations` (cruzado) |
| Design system | ✓ | `frontend_components` inclui `frontend/src/styles/**` e aponta para Doc 16 |
| Documentação via código | Indireto | Não é uma regra dedicada; a política é exigida por G3 (padrões) e verificada em lint específico (`eslint-plugin-tsdoc`, `pydocstyle`); o agente valida que docs vivos sejam tocados, mas TSDoc/docstring por si são matéria de lint de código, não do agente |

**Observação forense (indireto):** cobertura de "documentação via código" é indireta porque compete ao lint de código, não ao agente. Banca considera tecnicamente correto — o agente opera no plano de artefatos (arquivos tocados/ausentes), não no plano semântico do código. O lint de documentação via código (`pydocstyle`, `eslint-plugin-tsdoc`) complementa isso em G3 e em G4 como gates bloqueantes de PR.

**Nenhum aspecto está descoberto.**

## 4. Ele deve bloquear ou apenas orientar?

**Resposta: DEPENDE DO ESTÁGIO, e isso é decisão deliberada e tecnicamente correta.**

Estágios calibrados honestamente (G5 §11):

| Estágio | Comportamento | Sprint alvo |
|---------|---------------|-------------|
| `advisory` | apenas comenta o relatório; **nunca falha** | Sprint P0 |
| `warning` | falhas viram `warn`; **não bloqueia merge** | Sprint 0 |
| `blocking` | bloqueia merge quando há `block` | **Sprint 1+** |

### Critérios objetivos de transição entre estágios (G5 §11.4)
- Falsos positivos < 5% em janela de 3 sprints consecutivas.
- Revisão formal do `rules.yaml` realizada.
- Documentação clara para cada regra.
- Treinamento mínimo da equipe.

### Por que isso é correto
Introduzir o agente já em `blocking` no P0 geraria falsos positivos (referências a arquivos ainda inexistentes — `docs/04_Arquitetura_de_Software.md` citado em regra quando o doc pode estar sendo justamente adicionado) e paralisaria o time. A escada advisory→warning→blocking é prática de adoção padrão em sistemas de governance.

### Condicionante forense
Banca exige ADR-0015 formalizando esses critérios (ver `LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md` CND-03). Sem ADR, a transição fica ao arbítrio — risco residual inaceitável em gate forense.

## 5. Em quais pontos do pipeline ele deve atuar?

Especificado em G5 §12:

| Evento do pipeline | Modo do agente | Comportamento |
|---------------------|----------------|----------------|
| Local (`make impact`) | `local` | nunca bloqueia; feedback para o desenvolvedor |
| pre-commit | (não roda) | custo alto, benefício baixo |
| pre-push | `pre-push` | bloqueia apenas violações `critical` |
| PR (GitHub Actions) | `pr` | conforme estágio atual (advisory/warning/blocking) |
| merge (GitHub Actions) | `merge` | **sempre** blocking |

### Verificação forense
- O script aceita `--mode {local,pre-push,pr,merge}` (confirmado na saída de `--help`).
- `rules.yaml` tem `stage: advisory` como valor inicial honesto.
- `--stage auto` permite o script ler o estágio do `rules.yaml`, centralizando o controle.

### Observação
O agente **complementa**, não substitui, os demais gates do pipeline (G4 §4.3). Exemplo: mesmo que o agente passe, um teste de contrato vermelho em `schemathesis` continua bloqueando merge. Isso é desenho correto — camadas independentes.

## 6. Análise de robustez

### 6.1 Pontos fortes
- Script tipado com `dataclass` e anotações.
- Validação leve de `rules.yaml` embutida (ID único, snake_case, severity válida, paths obrigatórios).
- Fallback para arquivos quando `git` ausente (`--changed-files`).
- Fallback de ref (`origin/main` → `main`).
- Suporte a overrides controlados (`impact-override:<id>`, `baseline:doc11`, `rebaseline:docXX`, `human-reviewed`).
- Códigos de saída distintos para cada classe de erro.
- Testes cobrem trajetórias críticas (27/27 verdes).

### 6.2 Pontos de atenção
- OpenAPI diff ainda simplificado na v2.0 (roadmap v2.1 melhora).
- Não detecta mudança semântica (refator equivalente pode passar) — declarado em G5 §14.
- Depende da qualidade de `rules.yaml` (falsos positivos/negativos se desatualizado).

### 6.3 Recomendações da banca
1. **ADR-0015** (CND-03) formalizando critérios de transição.
2. **Auditoria mensal** das métricas (taxa de override, falsos positivos) conforme G5 §13.
3. **Revisão semestral** do `rules.yaml`.
4. **Registro de cada execução** em `reports/impact/_history.jsonl` (previsto em G5 §11).

## 7. Conclusão da verificação

O agente de análise de impacto é **tecnicamente maduro, empíricamente testado e honestamente calibrado**.

| Pergunta | Resposta | Evidência |
|----------|----------|-----------|
| Está suficientemente especificado? | Sim | G5 com 17 seções completas + script v2.0.0 + 23 regras + schema + 27 testes |
| Ajuda a impedir regressão? | Sim | 4 mecanismos independentes (matemática, contrato, schema, visual) |
| Cobre módulos/contratos/testes/docs/migrations/seeds/design/doc-via-código? | Sim (doc-via-código é indireto, correto) | Tabela §3 |
| Deve bloquear ou apenas orientar? | Depende do estágio — correto | Calibração advisory→warning→blocking em G5 §11 |
| Em quais pontos do pipeline atua? | 4 pontos (local, pre-push, PR, merge) | G5 §12 |

**A especificação é SUFICIENTE para liberar a execução**, sob o condicionante CND-03 (ADR-0015 formalizando critérios de transição).

**Não é bloqueador forense**; é condicionante, porque o script funciona hoje em `advisory` sem falhar, e a promoção para `blocking` é planejada para o fim do Sprint 1, quando haverá código real para o agente guardar.
