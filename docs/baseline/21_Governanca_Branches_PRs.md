# DOCUMENTO 21 — GOVERNANÇA DE BRANCHES, PRs E COMMITS

**Versão:** 1.0
**Status:** ESTÁTICO

---

## 1. Modelo de branching

- **Trunk-based** com short-lived branches.
- `main` é estável, sempre deployable.
- Branches de feature partem de `main` e morrem em ≤ 5 dias úteis.

## 2. Nomeação de branches

Formato: `<tipo>/<sprint>-<area>-<slug>`

| Tipo | Uso |
|------|-----|
| `feat` | nova feature/regra de negócio |
| `fix` | correção de bug |
| `chore` | tarefa operacional sem impacto funcional |
| `docs` | mudança documental |
| `refactor` | refator sem mudança funcional |
| `test` | adição/melhoria de testes |
| `perf` | ganho de performance |
| `build` | build/CI |
| `release` | branch de preparação de release |

Exemplos: `feat/s02-amortization-price-engine`, `fix/s03-credit_card-rotativo-arredondamento`.

## 3. Commits convencionais

Formato: `<tipo>(<escopo>): <descrição em imperativo, minúsculas, sem ponto>`

Exemplo: `feat(domain.interest): adicionar simulação de juros compostos com tabela`.

Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`, `perf`, `revert`.

Mensagens podem ter corpo (opcional) explicando o "por quê".

## 4. Pull Requests

### 4.1 Tamanho
- Alvo: ≤ 200 linhas.
- Limite blando: 400 linhas.
- Acima de 400 exige justificativa formal no corpo da PR.

### 4.2 Template
```markdown
## O quê
<resumo da mudança>

## Por quê
<motivação ligada ao backlog/regra de negócio>

## Como testar
<passos manuais ou comandos>

## Documentos vivos atualizados
- docs/XX_*.md
- docs/19_Matriz_Rastreabilidade.md (linha REQ-...)

## ADR vinculada
- ADR-XXXX (se houver)

## Plano de rollback
<como reverter>

## Risco
- nível: baixo | médio | alto
- justificativa: ...

## Checklist
- [ ] Lint/format/typecheck verdes
- [ ] Testes verdes
- [ ] Cobertura mantida/aumentada
- [ ] Documentos vivos atualizados
- [ ] Agente de impacto sem bloqueios
```

### 4.3 Revisão
- 1 humano aprovador obrigatório (não pode ser o autor).
- Revisor verifica: conformidade com Doc 04, Doc 06, Doc 09, Padrões de Implementação e Governança Rígida.
- CODEOWNERS por pasta direciona revisão.

### 4.4 Merge
- Squash merge.
- Mensagem do squash respeita commit convencional.
- Branch da feature é deletada após merge.

## 5. Tags e releases

- Tag de release: `vYYYY.MM.DD[-rcN]`.
- Tag de rebaseline (documento estático): `baseline-vYYYY.MM.DD-docXX`.
- Tag de hotfix: `vYYYY.MM.DD-hotfixN`.

## 6. Proteções de `main`

- Sem `force push`.
- Sem commit direto.
- Status checks obrigatórios: todos os gates bloqueantes do `07_PIPELINE_GOVERNANCA_E_QUALITY_GATES.md` § 4.3.
- Aprovação de 1 humano obrigatória.
- Histórico linear (squash).

## 7. Política para a Claude Code

1. Sempre criar branch de feature para cada item de backlog.
2. Sempre rebasear contra `main` antes de subir PR.
3. Sempre rodar `make verify` localmente.
4. Sempre rodar `make impact` localmente em modo `local`.
5. Sempre preencher o template completo de PR.
6. Nunca usar `--force` ou `--no-verify`.
