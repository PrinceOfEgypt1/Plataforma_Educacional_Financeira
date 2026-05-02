# F6 — Validação Final (Sprint 2)

**Branch:** `sprint-2/f6-fechamento-governanca`
**HEAD:** `f20a180`
**Tipo:** evidência de fechamento (governança).
**Escopo desta sessão:** doc-only. Nenhum arquivo de runtime
(backend, frontend, tests, scripts, workflows, configs) foi
alterado.

> Esta evidência **não declara** `PIPELINE VERDE` nem promove a
> Sprint 2 a `APROVADA`. Ela registra **literalmente** o que foi
> executado nesta sessão de chat (sandbox) e o que **deve** ser
> executado pelo operador no WSL Ubuntu antes do encerramento
> formal da sprint.

## 1. O que foi executado nesta sessão (sandbox Linux)

### 1.1 Fase 0 — prova literal do estado do repositório

```
$ cd C:\Users\Projetos\Plataforma_Educacional_Financeira
$ git status -sb
## sprint-2/f6-fechamento-governanca...origin/main

$ git branch --show-current
sprint-2/f6-fechamento-governanca

$ git rev-parse --short HEAD
f20a180

$ git rev-parse --short origin/main
f20a180

$ git log --oneline --decorate -5
f20a180 (HEAD -> sprint-2/f6-fechamento-governanca, origin/main, origin/HEAD, main) feat(sprint-2): materializar conteúdo educacional e docs vivos (#10)
f1336d8 (sprint-2/f5-conteudo-docs-vivos) feat(sprint-2): implementar frontend de juros (#9)
7841049 chore(sprint-2): materializar pipeline oficial (#8)
2ae0bb2 feat(interest): expor endpoints REST de juros (#7)
e4e56ac feat(interest): implementar dominio de juros simples e compostos (#6)
```

Critérios de parada — todos verdes:
- branch == `sprint-2/f6-fechamento-governanca` ✓
- HEAD == `f20a180` ✓
- origin/main == `f20a180` ✓
- working tree limpo ✓

### 1.2 Validação JSON de `living_docs.json` patchado

```
$ python3 -c "import json; json.load(open('docs/_meta/living_docs.json')); print('JSON OK')"
JSON OK
```

### 1.3 Verificação de coerência interna dos arquivos da F6 v2

Todos os arquivos novos/alterados desta F6 v2 são `.md` ou `.json`
(doc-only). Não há código que dispare typecheck/lint adicional. As
linguagens de programação do repositório (Python backend, TypeScript
frontend) **não foram alteradas** nesta F6.

### 1.4 Varredura literal por placeholders nos arquivos da F6 e no plano da Sprint 2

Comando, executado contra `outputs/F6_FECHAMENTO_GOVERNANCA_DRAFT_V2`
e contra o plano da Sprint 2 vigente:

```
$ for pat in 'TBD' 'TODO' 'FIXME' 'placeholder' 'a preencher' \
             'a ser preenchido' 'preencher depois' \
             'A confirmar pelo operador' 'EXIT real' \
             'valor futuro' 'resultado futuro'; do
    grep -rn "$pat" outputs/F6_FECHAMENTO_GOVERNANCA_DRAFT_V2 \
                    Plataforma_Educacional_Financeira/docs/sprints/sprint-02/00-plano \
      --include='*.md' --include='*.json' 2>/dev/null
  done
```

#### 1.4.1 Lista completa de ocorrências encontradas (transparente, classificada)

| Arquivo                                                                         | Linha | Padrão            | Classificação                                                                         | Ação |
|---------------------------------------------------------------------------------|-------|-------------------|---------------------------------------------------------------------------------------|------|
| `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` (texto histórico)   | 354   | `placeholder`     | **Histórica** — texto descreve a F4: *"`EducationPanel` com texto nível 1 (placeholder até a F5 enriquecer)"*. A F5 oficial (PR #10 / `f20a180`) já materializou o conteúdo e a integração visível. Hoje, em `main`, **não existe placeholder ativo** nesse local. | **Mantida** como contexto histórico. **Não é** placeholder ativo. |
| `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` (texto histórico)   | 397   | `placeholder`     | **Histórica** — texto da pré-condição da F5: *"Textos placeholder da F4 em produção"*. Descreve a fronteira de entrada da F5 (cenário de antes da F5 oficial). A F5 oficial substituiu esses textos. | **Mantida** como contexto histórico. **Não é** placeholder ativo. |
| `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md` (tabela de riscos §10)| 723   | `placeholder`     | **Histórica/risco** — linha do risco R7: *"Antecipar texto nível 1 já em F4 como placeholder; F5 só enriquece"*. Estratégia adotada na elaboração do plano. F5 oficial enriqueceu como previsto. | **Mantida** como contexto histórico. **Não é** placeholder ativo. |
| `docs/sprints/sprint-02/evidencias/F6-validacao-final.md`                        | (várias) | `TBD`, `TODO`, `FIXME`, `placeholder`, `a preencher`, `a ser preenchido`, `preencher depois`, `A confirmar pelo operador`, `EXIT real`, `valor futuro`, `resultado futuro` | **Comando de busca** — todas em §1.4 e §1.4.1 deste documento, dentro de bloco `for pat in '...'` ou da própria lista de classificação. | **Manter.** Auto-evidente. |
| `docs/sprints/sprint-02/evidencias/F6-relatorio-final-sprint-2.md` §6 tabela Doc 09 | (1 linha) | `TBD`, `placeholder` | **Metalinguística** — descreve que Doc 09 §16.3 foi reescrita "sem TBD, sem tabela vazia". | **Manter.** Auto-evidente. |
| `docs/sprints/sprint-02/relatorio-execucao.md` §7                                | (1 linha) | `TBD`, `placeholder` | **Metalinguística** — descreve a correção F5 v1 (`Doc 09 §16.3 com placeholder TBD` foi reescrita). | **Manter.** Descreve correção. |
| `docs/sprints/sprint-02/validacao-oficial.md` §4.2                               | (1 linha) | `TBD`             | **Metalinguística** — descreve correção F5 v1 (Doc 09 §16.3 com TBD).             | **Manter.** Descreve correção. |
| `docs/sprints/sprint-02/relatorio-forense.md` §1.6                                | (1 linha) | `placeholder`     | **Metalinguística** — descreve que `/juros/page.tsx` substituiu o "placeholder genérico `ModulePage`" e que Doc 09 §16.3 foi reescrita "sem placeholder". | **Manter.** Descreve correção. |

#### 1.4.2 Conclusões

- Em **arquivos novos/alterados pela F6 v2** (5 arquivos novos +
  2 patches: `relatorio-execucao.md`, `relatorio-forense.md`,
  `validacao-oficial.md`, `F6-decisao-impact-agent.md`,
  `F6-validacao-final.md`, `F6-relatorio-final-sprint-2.md`,
  `living_docs.json` e `PLANO_EXECUCAO_SPRINT_2.md`):
  - **zero** ocorrências ativas/bloqueantes;
  - todas as ocorrências são **metalinguísticas** (descrevem o que
    foi removido/corrigido) ou são o **comando de busca** em si.
- Em **arquivos pré-existentes** que vieram do projeto (plano
  `PLANO_EXECUCAO_SPRINT_2.md`):
  - 3 ocorrências históricas de `placeholder` em §5.4 (linha 354),
    §5.5 (linha 397) e §10 R7 (linha 723).
  - Classificadas como **histórica** acima — nenhuma representa
    placeholder ativo em `main`.

> **Reescrita preventiva considerada e descartada.** O auditor
> permitiu reescrita das ocorrências históricas se elas pudessem
> "causar confusão". Esta evidência opta por **mantê-las
> textualmente**, com a classificação acima, para preservar o
> registro histórico do plano (que é um documento vivo de
> rastreabilidade da Sprint 2 e descreve fatos do momento em que
> foi escrito). A reescrita seria reescrever história — preferimos
> classificar honestamente.

## 2. O que NÃO foi executado nesta sessão e por quê

| Comando                              | Status            | Motivo                                                                                |
|--------------------------------------|-------------------|---------------------------------------------------------------------------------------|
| `bash scripts/pipeline.sh`           | NÃO EXECUTADO     | Política — pipeline oficial é vinculante apenas no WSL Ubuntu (CLAUDE.md + PLANO §10).|
| `make lint-pedagogical`              | NÃO EXECUTADO     | F6 v2 é doc-only; o lint pedagógico apenas confirma o que a F5 oficial já entregou.   |
| `pnpm format:check`                  | NÃO EXECUTADO     | F6 v2 não toca arquivos `.ts`/`.tsx`.                                                  |
| `pnpm typecheck`                     | NÃO EXECUTADO     | Idem.                                                                                  |
| `pnpm test --run`                    | NÃO EXECUTADO     | Idem.                                                                                  |
| `make verify` (suite completa)       | NÃO EXECUTADO     | Vinculante apenas no operador.                                                         |
| Dry-run de Impact Agent `blocking`   | NÃO EXECUTADO     | A decisão F6 é preservar `advisory` (`F6-decisao-impact-agent.md`).                    |

Nenhum desses é placeholder. Todos têm motivo objetivo documentado
(F6 v2 é doc-only por desenho do prompt do micro-adendo).

## 3. O que o operador deve executar no WSL Ubuntu antes do
   encerramento formal

```bash
# 1. Estado da branch da F6
cd ~/workspace/Plataforma_Educacional_Financeira
git checkout sprint-2/f6-fechamento-governanca
git status -sb
git rev-parse --short HEAD          # esperado: f20a180 (ou ahead após aplicar pacote F6 v2)
git rev-parse --short origin/main   # esperado: f20a180

# 2. Aplicar o pacote F6 v2 (extrair ZIP por cima do repo)
unzip -o ~/Downloads/F6_FECHAMENTO_GOVERNANCA_SPRINT_2_PACOTE_v2.zip
git status -sb
git diff --stat

# 3. Lint pedagógico (subset Sprint 2 — F5 oficial)
make lint-pedagogical
echo "EXIT_LINT_PED=$?"          # esperado: 0

# 4. Frontend gates
cd frontend
pnpm format:check
echo "EXIT_FMT=$?"               # esperado: 0

pnpm typecheck
echo "EXIT_TYPECHECK=$?"         # esperado: 0

pnpm test --run
echo "EXIT_TEST=$?"              # esperado: 0

# 5. Backend gates
cd ../backend
.venv/bin/python -m ruff check .
echo "EXIT_RUFF=$?"
.venv/bin/python -m ruff format --check .
echo "EXIT_FMT_BE=$?"
.venv/bin/python -m mypy app/
echo "EXIT_MYPY=$?"
.venv/bin/python -m pytest tests/unit -m unit
echo "EXIT_PYTEST_UNIT=$?"

# 6. Pipeline oficial — VINCULANTE
cd ..
bash scripts/pipeline.sh
echo "EXIT_PIPELINE=$?"          # exigido: 0 e mensagem PIPELINE VERDE
```

Esperado: todos `EXIT_*=0`. Se algum gate retornar erro:
- **Não vendar o gate.** Não alterar configuração para mascarar.
- **Não declarar a Sprint 2 aprovada.**
- Reabrir discussão técnica colocando a saída literal do erro no
  chat de fechamento.

## 4. Critério de encerramento formal

A Sprint 2 só é declarada **APROVADA** após, **cumulativamente**:

1. Auditoria do pacote F6 v2 concluída pelo PO/ChatGPT.
2. `bash scripts/pipeline.sh` → `EXIT_PIPELINE=0` no WSL Ubuntu pelo
   operador, com mensagem `PIPELINE VERDE` literal.
3. PR da F6 mergeado em `main` via squash-merge.
4. Smoke pós-merge na `main` verde.
5. Janela de observação de 30 minutos sem regressão (PLANO §5.6 DoD
   Release).
6. Atualização da planilha operacional pelo PO/ChatGPT com aviso
   final "Sprint 2 — FECHADA em [data]" (esta atualização **não** é
   feita pela sessão de chat).

Os três relatórios canônicos (`relatorio-execucao.md`,
`relatorio-forense.md`, `validacao-oficial.md`) **JÁ ESTÃO
MATERIALIZADOS** no pacote F6 v2 (Opção A do micro-adendo) e
**NÃO** são mais critério pendente. O critério acima é fechado e
independente de qualquer arquivo futuro a ser produzido por sub-PR.

Enquanto qualquer item acima estiver pendente, esta evidência
declara: **Sprint 2 NÃO ENCERRADA**.

## 5. Resumo do que esta sessão (F6 v2) entrega

- 3 evidências em `docs/sprints/sprint-02/evidencias/`:
  - `F6-decisao-impact-agent.md` (mantido da v1, decisão íntegra);
  - `F6-validacao-final.md` (este documento — reescrito na v2);
  - `F6-relatorio-final-sprint-2.md` (consolidado executivo —
    reescrito na v2 para resolver contradição da v1).
- 3 **canônicos da Sprint 2** em `docs/sprints/sprint-02/`
  (Opção A do micro-adendo F6 v2):
  - `relatorio-execucao.md`;
  - `relatorio-forense.md`;
  - `validacao-oficial.md`.
- 1 patch cirúrgico no plano (linhas 1.4 e 1.5 no histórico de
  revisões).
- 1 patch cirúrgico em `docs/_meta/living_docs.json` (3 entradas
  novas para os canônicos da Sprint 2 + `updated_at` + `update_reason`).

Nenhum outro arquivo é tocado. Em particular: backend, frontend,
testes, scripts, workflows, package.json, lockfiles, tsconfig,
pyproject e Doc 03 **NÃO** foram alterados pela F6 v2. A planilha
xlsx **NÃO** foi tocada.

## 6. Não-ações confirmadas

- Sem `git add` / `commit` / `push` / abertura de PR nesta sessão.
- Sem escrita em `C:\Users\Projetos\Plataforma_Educacional_Financeira`.
- Sem alteração de `backend/app/`, `frontend/src/`, `tests/`,
  `scripts/pipeline.*`, `.github/workflows/`, `package.json`,
  `pnpm-lock.yaml`, `pyproject.toml`, `tsconfig.json`, ESLint,
  Prettier, Vitest configs, Doc 03, planilha xlsx.
- Sem promoção do Impact Agent para `blocking`.
- Sem declaração de pipeline verde, vitest verde, typecheck verde,
  Sprint 2 aprovada ou aprovação humana do PO nesta sessão.
