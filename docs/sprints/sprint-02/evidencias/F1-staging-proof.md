# Fatia F1 — Evidência 4 de 4 · Protocolo §8.6 (staging / pre-commit / commit único)

**Finalidade.** Provar literalmente que o protocolo obrigatório do §8.6 do Plano Sprint 2 v1.2 foi cumprido na PR #F1. A F1 é executada como **um único commit na branch `sprint-2/f1-preveo`**; esta evidência é **parte desse commit** e reflete, por construção, o HEAD final da branch imediatamente antes do push. Não existe `git commit --amend` nem commit adicional posterior nesta branch.

**Quem executa.** Operador humano, no working tree da branch `sprint-2/f1-preveo`.

**Quando executar.** Todas as saídas das seções §2, §3 e §4 são **capturadas ou especificadas antes do único commit**. A seção §4 tem um formato especial: ela não é um log pós-fato, mas uma **especificação auditável** do estado que `git show --name-only --stat HEAD` deve produzir imediatamente após o commit.

**Regra de ouro desta fatia.** A branch `sprint-2/f1-preveo` terá exatamente **um commit** além de `origin/main`. Se algum processo gerar um segundo commit (ex.: `pre-commit` reformatando arquivos), o operador faz `git reset --soft HEAD~1` do primeiro, re-roda os hooks, re-captura as saídas e produz **um único commit consolidado** — não dois. `git commit --amend` é permitido localmente **antes do push**; após o push, a branch F1 é imutável.

---

## 1. Arquivos esperados no commit único da F1 (escopo doc-only)

Lista canônica — deve coincidir 1-para-1 com `git diff --cached --name-only` (§2.3) e com `git show --name-only HEAD` (§4.1):

```
docs/sprints/sprint-01/00-plano/PLANO_EXECUCAO_SPRINT_1.md       (novo — porte retroativo v1.1-histórica)
docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md       (novo — v1.2 aprovada)
docs/sprints/sprint-02/evidencias/base-branch.md                 (novo — Fase 0)
docs/sprints/sprint-02/evidencias/main-verify-baseline.md        (novo — baseline)
docs/sprints/sprint-02/evidencias/main-verify-baseline.log       (novo — log bruto)
docs/sprints/sprint-02/evidencias/impact-agent-estado-inicial.md (novo — ponto-zero)
docs/sprints/sprint-02/evidencias/F1-staging-proof.md            (novo — este arquivo)
```

**Nenhum** arquivo fora de `docs/sprints/` pode aparecer. Se aparecer, **parar**, isolar e re-rodar o protocolo.

---

## 2. Antes do commit (saídas brutas — preencher)

### 2.1 `git diff --name-only` (working tree vs. HEAD)
```
<colar saída literal — deve listar exatamente os 7 arquivos da §1>
```

### 2.2 `git add <arquivos>` (listar arquivos explicitamente, sem `.` nem `-A`)
Comando executado (copiar exatamente como foi rodado):
```bash
<colar o comando git add que foi efetivamente usado>
```

### 2.3 `git diff --cached --name-only`
```
<colar saída literal — deve coincidir 1-para-1 com a lista da §1>
```

### 2.4 `pre-commit run --all-files`
```
<colar saída literal, incluindo todos os hooks e o status final (Passed/Failed)>
```

**Diagnóstico pre-commit:**
- [ ] ✅ Todos os hooks `Passed` **sem** ter reformatado arquivos.
- [ ] ⚠️ Algum hook reformatou arquivos **antes** do commit — re-executar §2.1, §2.3 e §2.4 e sobrescrever as saídas acima antes de seguir para §3.
- [ ] ⛔ Hook falhou sem auto-correção — **não commitar**. Corrigir manualmente e reiniciar o protocolo.

> **Importante.** Se `pre-commit` tocou este próprio arquivo (ex.: adicionou newline final), a §2.3 deve ser re-capturada **depois** da reformatação e **antes** do commit. Nunca deixar §2.3 desatualizada em relação ao que de fato vai para o commit.

---

## 3. Commit único

### 3.1 Comando (exato a ser usado)
```bash
git commit -m "docs(sprint-02): plano de execução v1.2 aprovado + pré-voo F1

- Institucionaliza docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md (v1.2)
- Porta retroativamente docs/sprints/sprint-01/00-plano/PLANO_EXECUCAO_SPRINT_1.md (v1.1-histórica)
- Registra Fase 0, baseline de make verify em main e estado inicial do Impact Agent
- Escopo: doc-only. Zero alteração em domain/, services/, api/, frontend.
- Refs: §5.1, §8.6, §8.7 do PLANO_EXECUCAO_SPRINT_2.md v1.2"
```

### 3.2 Política de commit único
- Nenhum `git commit` adicional é permitido nesta branch após este.
- `git commit --amend` é aceitável **antes do push**, apenas se for para consolidar reformatação de hooks ou corrigir a própria §2/§4 antes de tornar a branch pública. Cada amend **obriga** re-capturar §2.3 e revalidar §4.
- Depois de `git push -u origin sprint-2/f1-preveo`, a branch é **imutável**: zero commits adicionais, zero amends, zero force-push.

---

## 4. Estado esperado do HEAD — especificação auditável

Esta seção **não é um log**. É a especificação **pré-commit** do que `git show --name-only --stat HEAD` deve produzir imediatamente após o comando da §3.1. O operador **verifica** e só faz push quando bate exatamente.

### 4.1 Lista de arquivos exigida (ordem alfabética por caminho completo)

```
docs/sprints/sprint-01/00-plano/PLANO_EXECUCAO_SPRINT_1.md
docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md
docs/sprints/sprint-02/evidencias/F1-staging-proof.md
docs/sprints/sprint-02/evidencias/base-branch.md
docs/sprints/sprint-02/evidencias/impact-agent-estado-inicial.md
docs/sprints/sprint-02/evidencias/main-verify-baseline.log
docs/sprints/sprint-02/evidencias/main-verify-baseline.md
```

(Observação: `git show --name-only HEAD` pode ordenar por status ou por caminho dependendo da configuração local; o critério de aceite é **conjunto igual**, não ordem igual.)

### 4.2 `--stat` — critério de aceite
- Cada arquivo é **novo** (modo `A` ou simples adição; sem `D`/`R`).
- Total de arquivos modificados = **7**, exatamente.
- Nenhum arquivo fora de `docs/sprints/` aparece.

### 4.3 Verificação a executar pelo operador (não preencher aqui)
```bash
git show --name-only --stat HEAD
```

Critério binário:
- [ ] ✅ Saída casa com §4.1 e §4.2 → branch pronta para push.
- [ ] ⛔ Qualquer divergência → **não fazer push**. `git reset --soft HEAD~1`, corrigir staging, re-rodar §2 e §3. A branch F1 só é publicada quando o HEAD bate com esta especificação.

> **Por que a especificação mora dentro do commit.** Em vez de o arquivo carregar o SHA do próprio commit (auto-referência impossível sem amend e sem log posterior), ele carrega a **forma canônica** do commit — lista de arquivos e propriedades do diff. Qualquer auditor futuro, sobre o squash-merge em `main` ou sobre o commit da branch, pode re-executar `git show --name-only --stat <ref>` e comparar contra §4.1/§4.2 **independentemente** do valor do SHA. A auditabilidade não depende do squash para se consertar.

---

## 5. O que **não** está nesta evidência (e por quê)

Metadados que só existem depois do HEAD final da branch — SHA do commit, timestamp de commit, nº da PR, URL da PR — **não** são registrados neste arquivo, porque sua inclusão exigiria um commit posterior que mudaria o próprio SHA, invalidando a auto-referência.

Esses metadados são capturados e comunicados conforme o §8.7 do plano v1.2:
- No **chat com o PO**, no momento do push e abertura da PR (ver `AVISO_PLANILHA.md`).
- Na **linha do Backlog Operacional** atualizada após o squash-merge (idem).
- Via `git log`/`git show` sobre a branch ou sobre o commit de squash em `main`, a qualquer tempo.

A prova §8.6 desta evidência — estado do staging e especificação do HEAD — é **completa e imutável** desde o commit único. O valor absoluto do SHA não agrega auditabilidade que o `--stat` canônico não já provê.

---

## 6. Assinatura operacional

- **Operador:** `<preencher antes do commit>`
- **Data/hora da captura de §2 (UTC ISO 8601):** `<preencher antes do commit>`
- **SHA esperado de `origin/main` na base da branch** (copiar de `base-branch.md` §2.5): `<preencher antes do commit>`

O SHA final do commit da F1 **não** é registrado aqui — consultar `git log sprint-2/f1-preveo -1` antes do merge, ou `git log main --grep='pré-voo F1' -1` após o squash-merge.

---

**Referência cruzada:** §8.6 (protocolo obrigatório de staging/commit/pre-commit), §8.7 (institucionalização dos planos e comunicação de merge), §9.1 (critérios CORE #2 `git diff --name-only` limpo após merge, #4 protocolo §8.6 cumprido em cada fatia) do `PLANO_EXECUCAO_SPRINT_2.md` v1.2.
