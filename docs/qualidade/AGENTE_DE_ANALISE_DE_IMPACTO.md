# ESPECIFICAÇÃO DO AGENTE DE ANÁLISE DE IMPACTO — PLATAFORMA EDUCACIONAL FINANCEIRA
## (versão madura — fecha NC-05)

**Versão:** 2.0
**Status canônico:** VIVO
**Estágio de maturidade:** **WARNING-ready** no Sprint 0; **BLOCKING-ready** ao final do Sprint 1 sob as condições da §11.
**Substitui integralmente:** Especificação v1.0.

> **Calibração honesta:** o agente **não nasce em modo blocking**. Adoção em três estágios é mandatória para evitar bloqueios espúrios e ganhar confiança nas regras. Detalhe em §11.

---

## 1. Missão
Atuar como **guardião técnico ativo** a cada conjunto de mudanças. A cada execução:
1. Determina o conjunto de arquivos alterados (`git diff` contra base).
2. Mapeia esses arquivos a **módulos, contratos, testes obrigatórios, documentos vivos, riscos de regressão e necessidades operacionais** (migration, seeds, design system, observabilidade, doc-via-código, regulatório).
3. Emite **relatório** (Markdown + JSON).
4. Sinaliza/orienta/bloqueia conforme **modo** (`local | pre-push | pr | merge`) e **estágio de adoção** (advisory → warning → blocking).

## 2. Localização

| Caminho | Função |
|---------|--------|
| `scripts/impact_analysis_guard.py` | Script principal |
| `scripts/impact/rules.yaml` | Regras declarativas (path-glob → impacto) |
| `scripts/impact/schema.yaml` | JSON-Schema do `rules.yaml` (validação da configuração) |
| `scripts/impact/templates/report.md.j2` | Template do relatório humano (opcional) |
| `tests/scripts/test_impact_analysis_guard.py` | Suite de testes do agente |
| `docs/_meta/living_docs.json` | Índice de documentos vivos consumido pelo agente |
| `docs/qualidade/AGENTE_DE_ANALISE_DE_IMPACTO.md` | Esta especificação |
| `reports/impact/` | Relatórios gerados (excluídos do `.gitignore` opcionalmente) |

## 3. Entradas

| Flag | Padrão | Descrição |
|------|--------|-----------|
| `--mode` | `local` | Modo de execução: `local`/`pre-push`/`pr`/`merge` |
| `--base` | `origin/main` | Ref base do diff |
| `--head` | `HEAD` | Ref head do diff |
| `--repo` | `.` | Caminho do repositório |
| `--rules` | `scripts/impact/rules.yaml` | Arquivo de regras |
| `--schema` | `scripts/impact/schema.yaml` | Schema do `rules.yaml` |
| `--out` | `reports/impact` | Diretório de relatórios |
| `--stage` | `auto` | Estágio: `advisory`/`warning`/`blocking`/`auto` (lê do rules.yaml) |
| `--fail-on` | (vazio) | Lista de severidades que disparam exit 1 (`block` no `auto` por padrão) |
| `--ignore` | (vazio) | Lista de IDs de regras a ignorar (sob política) |

Variáveis de ambiente úteis:
- `IMPACT_PR_LABELS=label1,label2` — labels da PR (override `impact-override:<id>`, `baseline:doc11`, `rebaseline:docXX`, `human-reviewed`).
- `IMPACT_PR_NUMBER` — número da PR.
- `IMPACT_PR_AUTHOR` — autor da PR.

## 4. Saídas

- `reports/impact/<timestamp>__<short-sha>.md` — relatório humano.
- `reports/impact/<timestamp>__<short-sha>.json` — relatório máquina.
- Saída padrão: resumo (achados, severidades, próximos passos).
- Códigos de saída:
  - `0` — sem bloqueio (nenhum `block` ou estágio não-blocking).
  - `1` — bloqueios encontrados em estágio blocking.
  - `2` — erro de configuração ou execução (rules.yaml inválido, git ausente, schema falha).
  - `3` — erro de uso (flag inválida, base ref inexistente).

## 5. Conteúdo do relatório

1. **Cabeçalho:** modo, estágio, base, head, autor, PR, contagem agregada.
2. **Por módulo:** arquivos tocados, severidade.
3. **Contratos impactados:** rotas e schemas; OpenAPI diff (quando existir baseline).
4. **Testes obrigatórios:** lista (consultando Estratégia de Testes §4 + rules.yaml).
5. **Documentos vivos a atualizar:** lista, com flag se foram tocados na PR.
6. **Risco de regressão:** financeira, pedagógica, visual, contrato.
7. **Necessidades operacionais:** migration, seeds, design system, doc-via-código, observabilidade, ADR, regulatório.
8. **Achados:** `block`, `warn`, `info` com `rule_id`, mensagem, arquivo(s), sugestão.
9. **Overrides aplicados:** quais regras foram bypass por label.
10. **Próximos passos sugeridos:** comandos `make` específicos.

## 6. Estratégia de fallback (robustez de paths)

Cobre fragilidades apontadas na NC-05:

1. **Path matching robusto:** usa `pathlib.PurePosixPath` e `fnmatch`/`pathspec` (gitignore-style); paths são normalizados para POSIX antes do match (compatibilidade Linux/macOS/Windows).
2. **Ausência de `git`:** se `git` não estiver disponível, o agente lê arquivos de `--changed-files` (lista, ou `STDIN`) como fallback.
3. **Ausência de base ref:** se `origin/main` não existir, tenta `main`; se também não, falha com exit 3 (erro de uso).
4. **Submódulos:** ignorados por padrão; configurável.
5. **Renames:** detectados via `git diff --find-renames`; tratados como "tocou origem + tocou destino".
6. **Arquivos binários:** detectados; regras opcionalmente as ignoram (`binary_safe: true`).
7. **Encoding:** força UTF-8 com `errors="replace"` para leituras (evita falhas em arquivos malformados).
8. **PR fechada/sem labels:** `IMPACT_PR_LABELS` ausente é tratado como lista vazia.
9. **Diff vazio:** se não há arquivos alterados, exit 0 com relatório "nada a fazer".

## 7. Política de erro

| Situação | Comportamento |
|----------|---------------|
| `rules.yaml` ausente | exit 2; mensagem orientando criar arquivo |
| `rules.yaml` inválido (schema) | exit 2; mensagem com erros do schema |
| Glob inválido em rules.yaml | exit 2; aponta a regra |
| Arquivo de regra de teste obrigatório não encontrado fisicamente (`requires_tests` aponta caminho inexistente) | warn no relatório (não bloqueia) |
| Falha de leitura de arquivo (encoding/perm) | warn no relatório; pula o arquivo |
| `git diff` falha | exit 2; mensagem com stderr do git |
| Timeout de execução | exit 2 após 60s |
| Modo blocking + bloqueios | exit 1 |
| Modo warning ou advisory + bloqueios | exit 0; sinaliza `warn` no relatório |

## 8. Validação da configuração

`scripts/impact/schema.yaml` (JSON-Schema YAML) define:
- `version: 1`
- `stage: advisory|warning|blocking`
- `modules: list[Module]`
- cada `Module`: `id` (slug único), `paths: list[str]`, `requires_tests`, `requires_docs_living`, `risks`, `requires_reversibility`, `forbid_changes_unless_rebaseline`, `requires_human_review`, `severity` (`info|low|medium|high|critical`).

Antes de executar o pipeline, agente valida `rules.yaml` contra `schema.yaml`. Falha aqui é exit 2.

## 9. Cenários de bloqueio e orientação

| Cenário | Comportamento (estágio `blocking`) |
|---------|-----------------------------------|
| Mudança em `app/domain/` sem teste correspondente tocado | block |
| Mudança em `app/api/` sem `tests/contract/` tocado | block |
| Mudança em `app/api/` sem Doc 06 atualizado | block |
| Mudança em `app/db/migrations/` sem `downgrade()` | block |
| Mudança em `docs/baseline/**` sem label `rebaseline:docXX` ou `baseline:doc11` | block |
| Mudança em conteúdo educacional sem label `human-reviewed` | warn (block ao Sprint 7+) |
| Mudança em `frontend/components/` sem visual snapshot tocado | block (Sprint 1+) |
| Adição de novo `feat:` sem REQ-ID no Doc 19 | warn (Sprint 1+) → block (Sprint 2+) |
| Mudança em `infra/` sem IaC scan referenciado | warn |
| Mudança em `app/services/indicators/` sem aviso de fonte/data-base no FE | block |

## 10. Edge cases relevantes
- PR contém apenas mudanças em `.github/` ou `Makefile`: regra `pipeline` aplica-se; mudança em workflow de CI exige atualização de Doc Pipeline.
- PR contém apenas mudanças em testes: passa sem bloqueios (testes não exigem docs vivos próprios).
- PR de release (`release/*`): exige tudo da PR comum + checklist Doc 25.
- Hotfix: `fix/hotfix-*` permite escopo mais estreito; ainda exige docs vivos.
- PR com label `human-reviewed` por humano com perfil de governança bypassa apenas regras `requires_human_review`.
- PR com label `impact-override:<rule_id>` bypassa **uma** regra específica + comentário obrigatório com justificativa.
- Override sem comentário é detectado e gera `warn` no relatório.

## 11. Estágios de adoção (calibração honesta)

### 11.1 Estágio `advisory` (Sprint P0)
- Roda em todas as PRs.
- Apenas comenta o relatório.
- **Nunca falha.**
- Objetivo: aprender padrões de violação e calibrar `rules.yaml` sem fricção.

### 11.2 Estágio `warning` (Sprint 0)
- Roda em todas as PRs.
- Falhas viram `warn` no relatório (anotação).
- **Não bloqueia merge.**
- Objetivo: visibilidade alta antes de bloquear.

### 11.3 Estágio `blocking` (Sprint 1+)
- Bloqueia merge quando há `block`.
- Override possível por label `impact-override:<rule_id>` + justificativa.
- Override só permitido a perfis com permissão (CODEOWNERS).

### 11.4 Critérios para passar `warning` → `blocking`
- Falsos positivos < 5% nas últimas 3 semanas.
- `rules.yaml` revisto pelo time.
- Documentação clara para cada regra.
- Treinamento mínimo para a equipe.

### 11.5 Reversão
- Regra que gere falso-positivo > 10% é colocada em `disabled: true` no `rules.yaml` e analisada na sprint seguinte.

## 12. Integração no pipeline

| Evento | Modo | Estágio efetivo | Bloqueia? |
|--------|------|-----------------|-----------|
| local (`make impact`) | `local` | qualquer | nunca bloqueia |
| pre-commit | (não roda; muito caro) | — | — |
| pre-push | `pre-push` | atual do projeto | bloqueia apenas em violações `critical` |
| PR (CI) | `pr` | atual do projeto | conforme estágio |
| merge (CI) | `merge` | sempre `blocking` | bloqueia em violações |

`stage: auto` no `rules.yaml` permite controle central; flag `--stage` sobrepõe.

## 13. Critérios de confiança
1. Suite `tests/scripts/test_impact_analysis_guard.py` ≥ 90% de cobertura.
2. Revisão semestral de `rules.yaml`.
3. Métricas semanais: nº execuções, nº bloqueios por regra, taxa de override, falsos positivos suspeitos (PRs com override que depois passaram sem mudança).
4. Versão semântica do agente (`__version__`) registrada no relatório.

## 14. Limitações conhecidas (declaradas honestamente)
1. **Não substitui revisão humana.** É heurística de impacto, não decisão.
2. **Não substitui testes.** Apenas indica quais devem rodar.
3. **Não impede regressões matemáticas.** Apenas garante que os testes corretos rodem.
4. **Depende de `rules.yaml`.** Regras incorretas geram falsos positivos/negativos. Auditoria periódica é mandatória.
5. **Não detecta mudança semântica.** Apenas mudança de arquivo + presença/ausência de testes/docs. Mudança lógica equivalente (refator semântico) pode passar.
6. **OpenAPI diff é simplificado** na v2.0 (compara endpoints e schemas top-level); diff profundo é v3.0.
7. **Não conhece fluxo da PR no GitHub** sem variáveis (`IMPACT_PR_*`); fora desse contexto opera com menos contexto.

## 15. Testes mínimos do script

`tests/scripts/test_impact_analysis_guard.py` cobre:
- Carregamento e validação do `rules.yaml`.
- Match de path-glob (POSIX, com gitignore-style).
- Detecção de `requires_docs_living` quando docs vivos foram/não foram tocados.
- Detecção de `requires_tests` quando testes foram/não foram tocados.
- Detecção de `requires_reversibility` em migrations sem `downgrade()`.
- Detecção de mudança em `static_baseline` sem label de rebaseline.
- Aplicação de overrides via labels.
- Comportamento por modo/estágio.
- Geração de relatórios MD e JSON.
- Códigos de saída.

## 16. Roadmap do agente

| Versão | Funcionalidade |
|--------|----------------|
| **2.0** (agora) | tudo desta especificação |
| **2.1** | OpenAPI diff aprimorado (ler arquivo OpenAPI versionado) |
| **2.2** | dependency graph leve (importações tocadas) |
| **3.0** | análise semântica AST (mudanças em assinaturas públicas detectadas) |
| **3.1** | integração com Sentry/Sentinel para correlação com bugs em prod |

## 17. Critérios de aceite desta especificação
- Estágios `advisory`/`warning`/`blocking` definidos sem ambiguidade.
- `rules.yaml` validado por schema.
- Política de erro objetiva.
- Edge cases listados.
- Limitações declaradas.
- Suite de testes mínima especificada.
- Roadmap evolutivo claro.
