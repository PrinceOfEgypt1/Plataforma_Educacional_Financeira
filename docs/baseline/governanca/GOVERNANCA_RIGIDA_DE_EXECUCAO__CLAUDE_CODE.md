# GOVERNANÇA RÍGIDA DE EXECUÇÃO — CLAUDE CODE
## Plataforma Educacional Financeira (versão calibrada — fecha NC-06)

**Versão:** 2.0
**Status:** ESTÁTICO — constituição de execução. Mudança apenas por rebaseline formal.
**Substitui integralmente:** Governança v1.0.

> Este documento é a **lei de execução**. A Claude Code o carrega ao iniciar cada sessão e o referencia explicitamente em decisões relevantes.
>
> **Calibração de severidade** (fecha NC-06): cada regra é etiquetada como
> **[B]** Bloqueante (impede merge/release), **[O]** Obrigatória não bloqueante (deve cumprir, mas não trava o pipeline), **[R]** Recomendada (boa prática), **[F]** Futura (adoção planejada).
>
> Esta calibração elimina o risco de governança paralisante mantendo rigor onde o produto realmente exige.

---

## 0. Princípios constitucionais (todos [B])

1. **[B]** Backend é a fonte única da verdade matemática. Sem duplicar fórmula no frontend.
2. **[B]** Documentação viva caminha com o código — exceto quando a mudança não tiver impacto material na verdade do produto (ver §2.1).
3. **[B]** Sem teste, não há pronto. Código sem teste é código não entregue.
4. **[B]** Contrato é lei. Mudança breaking exige versionamento + ADR.
5. **[B]** Regressão matemática e pedagógica é defeito intolerável.
6. **[O]** Pequeno e reversível: PRs pequenas, migrations reversíveis.
7. **[R]** Tornar evidente, não tornar engenhoso.
8. **[O]** Escrever para quem virá depois — humano ou IA.

## 1. Branch e fluxo de trabalho

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Modelo trunk-based com short-lived branches | [B] | `main` protegida |
| Branches permitidas: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`, `perf`, `release` | [B] | Outros prefixos rejeitados |
| Vida máxima de branch de feature: 5 dias úteis | [O] | Acima exige justificativa em PR |
| PR ≤ 400 linhas alteradas (excluindo lock, snapshots, migrations) | [O] | Acima exige justificativa formal |
| Rebase contra `main` se branch > 24h | [R] | Recomendado para evitar conflitos |
| Squash merge | [B] | Histórico linear |
| Sem commit direto em `main` | [B] | Política do repositório |
| Sem `--force` em branches compartilhadas | [B] | — |
| Cada PR tem 1 humano revisor formal | [B] | Não pode ser autor da PR |

## 2. Atualização documental (calibrada)

### 2.1 Regras
| Regra | Sev. | Detalhe |
|-------|------|---------|
| PR que altera **arquitetura, contrato, schema, regra de negócio, conteúdo educacional, observabilidade, regulatório** atualiza docs vivos correspondentes na mesma PR | [B] | Lista em Matriz V/E §6 |
| PR puramente cosmética (rename, format, refactor sem efeito comportamental) atualiza apenas linha `Última atualização:` se tocar arquivo do doc vivo | [O] | Não bloqueia |
| PR que tente alterar **estático** sem rebaseline formal | [B] | Bloqueado pelo agente |
| PR que tente alterar **baseline candidata (Doc 11)** sem label `baseline:doc11` + ADR | [B] | Bloqueado pelo agente |
| Bump de `Última atualização:` + entrada em `Histórico de revisões` | [O] | Em PRs com mudança material |
| Atualizações documentais aparecem na mesma PR (ou commit imediatamente seguinte) | [B] | Sem PR documental "depois" |
| Decisão arquitetural relevante exige novo ADR em `/docs/20_ADR/` | [B] | Mudança de stack, fronteira de módulo, padrão transversal |
| Documento vivo > 60 dias vencido em relação à última mudança de código na sua área | [B] | Bloqueia release (defeito P1) |

## 3. Qualidade de código

| Regra | Sev. | Detalhe |
|-------|------|---------|
| TypeScript estrito (`strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`) | [B] | — |
| Python 3.11+ com `mypy --strict` | [B] | — |
| Sem `any`/`Any` sem comentário aprovado | [B] | `// @ts-allow-any: <motivo>` ou `# type: ignore[<código>]: <motivo>` |
| Limites numéricos (arquivo ≤ 600 linhas, função ≤ 80, complexidade ≤ 15, aninhamento ≤ 4, args ≤ 7) | [B] | Limites duros; alvos em Doc Padrões §4 |
| Sem código morto/comentado/`console.log`/`print` deixado | [O] | Lint avisa; merge passa se isolado |
| Sem dependências novas sem ADR | [B] | — |
| Lint, format, typecheck verdes | [B] | Gate de PR |
| Sem dependências circulares | [B] | `madge` (FE) + `import-linter` (BE) |
| Sem regra matemática duplicada FE↔BE | [B] | — |

## 4. Testes (resumo; detalhe em Estratégia de Testes)

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Toda função pública nova tem teste unitário | [B] | — |
| Toda rota nova tem integration + contract test | [B] | — |
| Toda fórmula tem teste contra Doc 15 + property-based quando aplicável | [B] | — |
| Cobertura por área (ver Doc Padrões §4 e Estratégia §7) | [B] | PR que reduz cobertura é bloqueada |
| Teste flaky quarentenado em ≤ 24h | [O] | Bloqueia release se > 5 dias úteis |
| Suíte de regressão matemática inviolável | [B] | — |
| Suíte de regressão pedagógica inviolável | [B] | — |
| Snapshot visual: quebra exige aprovação humana (novo baseline) | [B] | — |
| Sem `skip`/`xit`/`only` deixado | [B] | Lint próprio bloqueia |
| Mutação `domain/` ≥ 80% (semanal) | [B] (release) | Bloqueia release |

## 5. Contratos de API

| Regra | Sev. | Detalhe |
|-------|------|---------|
| OpenAPI 3.1 gerado pelo FastAPI é a fonte única | [B] | — |
| Mudança aditiva = mesma versão | [B] | — |
| Mudança breaking = nova major + manutenção da anterior por ≥ 2 sprints + ADR | [B] | Doc 27 |
| Erros em RFC 7807 | [B] | — |
| Idempotência via `Idempotency-Key` em mutações | [B] | — |
| Cliente FE consome via tipos gerados | [B] | — |

## 6. Proteção contra regressão

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Tolerâncias matemáticas do Doc 15 invioláveis sem ADR + rebaseline | [B] | — |
| Cobertura nunca diminui abaixo do mínimo | [B] | — |
| Suite de regressão pedagógica inviolável | [B] | — |
| Suite de regressão visual exige aprovação humana de novo baseline | [B] | — |
| Suite de regressão de contrato exige caminho de versionamento | [B] | — |

## 7. UX/UI

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Toda nova tela tem estados `loading`, `vazio`, `erro`, `sucesso`, navegável por teclado | [B] | — |
| axe-core sem `serious`/`critical` | [B] | — |
| Componentes só usam tokens do Doc 16 | [B] | Lint visual |
| Layout testado em 375/768/1280 | [B] | 1920 [R] |
| Snapshot visual atualizado e revisado por humano | [B] | — |

## 8. Design system

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Adição de token requer atualização do Doc 16 | [B] | — |
| Adição de token transversal requer ADR | [B] | — |
| Sem componente "primitivo" duplicado | [O] | Reusar/estender o do DS |
| Variantes de componente declaradas explicitamente | [O] | Sem prop `style` aberto sem motivo |
| Tokens em arquivo único `frontend/styles/tokens.{ts,css}` | [B] | Gerados a partir do Doc 16 |

## 9. Definition of Done (DoD)
Item está pronto quando **todos** os critérios aplicáveis (Doc 12 §4) estão verdes.

## 10. Definition of Ready (DoR)
Item entra em sprint quando **todos** os critérios da categoria (Doc 12 §3) estão verdes.

## 11. Observabilidade mínima

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Toda rota nova tem log estruturado (correlation_id, latência, status) | [B] | — |
| Toda rota nova tem métrica de latência + erro | [B] | — |
| Toda exceção não-prevista é logada em ERROR | [B] | Sem stack-trace ao usuário |
| Endpoints `/health/live`, `/health/ready`, `/health/live`, `/metrics` | [B] | — |
| Toda integração externa (futuro) tem timeout, retry e métrica | [O] | Quando integração existir |

## 12. Migrações de banco

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Migrations geradas por Alembic | [B] | — |
| Migrations reversíveis (`upgrade`+`downgrade` testados) | [B] | — |
| Padrão expand-and-contract para mudanças destrutivas | [B] | Doc 14 §6 |
| Migrations rodam em CI contra Postgres efêmero | [B] | — |
| Mudança em schema atualiza Docs 05 e 14 na mesma PR | [B] | — |
| Sem `DROP COLUMN`/`DROP TABLE` na mesma PR que introduz substituto | [B] | — |
| `ALTER TABLE ... SET NOT NULL` proibido em tabelas grandes (usar `NOT VALID` + `VALIDATE`) | [B] | — |
| Criação de índice em prod via `CREATE INDEX CONCURRENTLY` | [B] | — |

## 13. Documentação via código

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Backend Python: docstrings Google em funções/classes públicas | [B] | `pydocstyle` |
| Frontend TS: TSDoc em funções públicas, hooks, componentes públicos | [B] | `eslint-plugin-tsdoc` |
| Pipeline gera TypeDoc + mkdocs em release | [B] | Falha bloqueia release |
| Docstring/TSDoc vazio é defeito de lint | [O] | Lint customizado avisa |
| Schemas Pydantic com `description` em campos públicos | [O] | Avisa; não bloqueia |

## 14. Pipeline (resumo; detalhe em Pipeline e Quality Gates)

| Regra | Sev. | Detalhe |
|-------|------|---------|
| pre-commit: format, lint rápido, typecheck rápido, secret scan | [B] | — |
| pre-push: tudo do pre-commit + unit | [B] | Local |
| PR: tudo + integ + contrato + visual + smoke E2E + axe + cobertura + agente + SAST | [B] | Detalhe em Pipeline §4.3 |
| merge: rebuild + smoke + publish docs | [B] | — |
| pós-deploy: smoke + janela de observação | [B] | — |

## 15. Release

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Checklist `25_Release_Readiness.md` 100% | [B] | — |
| Tag `vYYYY.MM.DD` + changelog | [B] | — |
| Smoke pós-deploy registrado em Doc 24 | [B] | — |

## 16. Rollback

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Plano de rollback escrito em Doc 25 | [B] | — |
| Rollback automático se smoke pós-deploy falhar em ≤ 5 min | [B] | — |
| Migrations destrutivas só em PR posterior | [B] | — |
| Post-mortem em ≤ 48h | [B] | Doc 24 |

## 17. PRs e commits

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Commits convencionais (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `build:`, `ci:`, `perf:`, `revert:`) | [B] | — |
| Mensagens consistentes em PT ou EN por PR | [O] | — |
| Template de PR completo (`.github/pull_request_template.md`) | [B] | — |
| PR vincula item de backlog | [B] | — |
| PR não mistura refator amplo com mudança funcional | [O] | Salvo justificativa |

## 18. Não regressão matemática

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Suite `tests/regression/financial/` é carimbo dourado | [B] | — |
| Tolerância: ±0,01 em moeda; ±0,000001 em fatores; mudança requer ADR | [B] | — |
| Property-based para invariantes onde aplicável | [O] | — |
| Diff numérico de 100 cenários anexado à PR de domínio | [O] | `make domain:diff` |

## 19. Não regressão pedagógica

| Regra | Sev. | Detalhe |
|-------|------|---------|
| Resposta de cálculo contém `summary`, `tables`, `charts` (quando aplicável), `interpretation`, `alerts` | [B] | Validado por suite |
| Suite pedagógica valida presença/coerência | [B] | — |
| Mudança de copy passa por revisão humana | [B] | — |
| Conteúdo novo segue checklist editorial (Doc 08 §7) | [B] | — |
| Lint pedagógico ativo (Doc 08 §20) | [B] (Sprint 7+) | Antes disso, [O] |

## 20. Critérios objetivos de rejeição [B]

A entrega é **rejeitada** se **qualquer** abaixo for verdadeiro:
1. CI vermelho em qualquer gate **MERGE** da Estratégia §6.
2. Cobertura abaixo do mínimo §4.
3. Documentação viva aplicável não atualizada (NC §2.1) na PR.
4. Documentação estática alterada sem rebaseline + ADR + tag.
5. Função/arquivo acima do limite duro §3.
6. `any`/`Any` introduzido sem justificativa aprovada.
7. Regra matemática duplicada FE↔BE.
8. Suite de regressão matemática quebrada.
9. Suite de regressão pedagógica quebrada.
10. Snapshot visual quebrado sem aprovação humana de novo baseline.
11. Contrato quebrado sem versionamento.
12. Migration não-reversível.
13. Sem testes para função pública nova.
14. ADR ausente quando exigido.
15. Plano de rollback ausente em PR de release.
16. Lint, format ou typecheck vermelhos.
17. Secret scan vermelho.
18. Agente de impacto bloqueando sem que o bloqueio tenha sido tratado/overridado conforme política.
19. PR mistura refator amplo com mudança funcional sem justificativa.
20. PR > 400 linhas sem justificativa formal.

## 21. Severidade calibrada — síntese

| Severidade | Regras (#) |
|------------|-----------|
| **[B] Bloqueante** | ~70 regras objetivas (são as que afetam verdade do produto, regressão, contratos, segurança, integridade) |
| **[O] Obrigatória não bloqueante** | ~20 regras (afetam disciplina, mas não verdade do produto) |
| **[R] Recomendada** | ~10 regras (boas práticas, melhoria contínua) |
| **[F] Futura** | ~5 regras (adotadas conforme roadmap) |

Esta calibração elimina paralisia: PRs cosméticas, refactors triviais, ajustes de typo não viram odisseias; mas qualquer mudança que toque a verdade do produto enfrenta governança total.

## 22. Anexos
- **A.** Template de PR — `.github/pull_request_template.md`.
- **B.** Comandos canônicos — `make verify`, `make verify:full`, `make impact`, `make rebaseline`.
- **C.** Hierarquia em conflito documental: Doc 03 > Doc 18 > Doc 04 > Doc 06 > Doc 09 > demais. Em conflito instrução humana × este documento, prevalece este; sinalizar.
