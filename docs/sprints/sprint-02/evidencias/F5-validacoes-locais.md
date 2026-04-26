# F5 — Validações locais (sandbox e operador)

## 1. Resumo executivo

| Validação                   | Sandbox Linux (Cowork) |
|-----------------------------|------------------------|
| `prettier --check` (F5)     | **VERDE** — 7/7        |
| `edu_lint` default          | **VERDE** — 0/0/0      |
| `edu_lint --strict`         | **VERDE** — 0/0/0      |
| `living_docs.json` JSON     | **VERDE**              |
| `tsc --noEmit` (typecheck)  | **NÃO RODOU** — limitação ambiental (pnpm + FUSE) |
| `vitest run` (test)         | **NÃO RODOU** — mesma limitação |
| `pipeline.sh` (oficial)     | **NÃO RODA** aqui — vinculante no WSL Ubuntu |

A validação oficial dos gates não-rodados aqui acontece no WSL
Ubuntu pelo operador, conforme estabelecido na CLAUDE.md e no
PLANO Sprint 2. Esta evidência declara apenas o que foi
efetivamente executado no sandbox.

## 2. Saídas literais — sandbox Linux (Cowork)

### 2.1 prettier --check nos 7 arquivos da F5

Comando: rodar o `prettier@3.8.3` que vive em
`frontend/node_modules/.pnpm/` apontando para os arquivos do
DRAFT (a config do projeto Windows é honrada).

```
$ node /sessions/.../node_modules/.pnpm/prettier@3.8.3/.../bin/prettier.cjs --check \
    F5_OF_CONTEUDO_DOCS_DRAFT/frontend/src/content/juros/index.ts \
    F5_OF_CONTEUDO_DOCS_DRAFT/frontend/src/content/juros/nivel-1.ts \
    F5_OF_CONTEUDO_DOCS_DRAFT/frontend/src/content/juros/nivel-2.ts \
    F5_OF_CONTEUDO_DOCS_DRAFT/frontend/src/content/juros/glossario.ts \
    F5_OF_CONTEUDO_DOCS_DRAFT/frontend/src/components/interest/JurosSaibaMais.tsx \
    F5_OF_CONTEUDO_DOCS_DRAFT/frontend/src/__tests__/content/juros/conteudo.test.ts \
    F5_OF_CONTEUDO_DOCS_DRAFT/frontend/src/__tests__/components/interest/JurosSaibaMais.test.tsx

Checking formatting...
All matched files use Prettier code style!
EXIT=0
```

A primeira passagem reportou 5 arquivos fora do padrão; a segunda
(após `--write`) ficou 100% verde. Os arquivos no DRAFT já estão na
forma final aprovada pelo prettier.

### 2.2 edu_lint contra o corpus juros

```
$ python3 -m tools.edu_lint frontend/src/content

edu_lint: 4 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
EXIT=0
```

```
$ python3 -m tools.edu_lint --strict frontend/src/content

edu_lint: 4 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
EXIT=0
```

Detalhes em `F5-lint-pedagogico.md`.

### 2.3 living_docs.json — validação JSON

```
$ python3 -c "import json; json.load(open('docs/_meta/living_docs.json')); print('JSON OK')"
JSON OK
```

## 3. Limitação ambiental honestamente declarada

### 3.1 typecheck e vitest

**Não foi possível executar** `pnpm typecheck` e `pnpm test --run`
nesta sandbox Linux porque:

1. `pnpm` não está instalado no sandbox.
2. O `node_modules/` do projeto vive em FUSE, e o pnpm usa uma
   topologia de **symlinks relativos** dentro de
   `node_modules/.pnpm/`. Esses symlinks não resolvem
   corretamente sob o mount FUSE — `ls node_modules/react/`
   retorna *Input/output error*. Logo, o `tsc` e o `vitest` não
   conseguem importar `react`, `next`, `axios`, etc.
3. Tentativa de duplicar o `node_modules/` para `/tmp` via
   `cp -aL` produziu uma cópia parcial sem o setup pnpm
   funcional (o `tsc` não encontra `typescript`, `react`,
   `next` mesmo após a cópia).

Comprovação direta:

```
$ ls /sessions/.../Plataforma_Educacional_Financeira/frontend/node_modules/prettier/
ls: cannot access '.../node_modules/prettier/': Input/output error

$ ls /sessions/.../Plataforma_Educacional_Financeira/frontend/node_modules/react/
ls: cannot access '.../node_modules/react/': Input/output error

$ ls /sessions/.../Plataforma_Educacional_Financeira/frontend/node_modules/.pnpm/ | grep -i prettier
prettier@3.8.3
```

Os pacotes existem em `.pnpm/`, mas os links de superfície que o
node esperaria estão quebrados sob FUSE. O prettier funcionou
porque foi invocado diretamente pelo caminho absoluto dentro de
`.pnpm/`, sem depender da resolução de módulos. Já o `tsc` precisa
resolver `react`, `next`, `axios`, `clsx`, `tailwind-merge` e
outros — e nenhum deles aceita injeção por path.

### 3.2 Por que isso **não é** reprovação

Nenhuma das validações acima dependia do conteúdo entregue. A
falha vem do filesystem, não dos arquivos. O auditor explicitou
em §10 do prompt: *"Se o Windows falhar por node_modules/Next/pnpm,
não esconda. Registre como limitação ambiental conhecida. Não
declare reprovação funcional sem prova."* O mesmo princípio se
aplica aqui — o sandbox tem o mesmo tipo de limitação e a
validação oficial fica para o WSL Ubuntu.

## 4. Validação a executar pelo operador (vinculante)

### 4.1 Ordem sugerida no WSL Ubuntu

```bash
# 1. Aplicar o pacote (extrair ZIP por cima do repo)
cd ~/Plataforma_Educacional_Financeira
git checkout sprint-2/f5-conteudo-docs-vivos
unzip -o ~/Downloads/F5_OFICIAL_CONTEUDO_DOCS_VIVOS_PACOTE_v2.zip

# 2. Conferir o que entrou
git status -sb
git diff --stat

# 3. Lint pedagógico (subset Sprint 2)
make lint-pedagogical
echo "EXIT_LINT_PED=$?"

# 4. Format check do frontend
cd frontend && pnpm format:check
echo "EXIT_FMT=$?"

# 5. Typecheck
pnpm typecheck
echo "EXIT_TYPECHECK=$?"

# 6. Testes
pnpm test --run
echo "EXIT_TEST=$?"

# 7. Pipeline oficial
cd ..
bash scripts/pipeline.sh
echo "EXIT_PIPELINE=$?"
```

### 4.2 EXITs esperados (todos zero)

| Comando                     | EXIT esperado |
|-----------------------------|---------------|
| `make lint-pedagogical`     | 0             |
| `pnpm format:check`         | 0             |
| `pnpm typecheck`            | 0             |
| `pnpm test --run`           | 0 (testes da F4 + 8 novos de conteúdo + 5 novos de SaibaMais) |
| `bash scripts/pipeline.sh`  | 0 (`PIPELINE VERDE`) |

### 4.3 Se algum EXIT não for zero

- **Não** ajustar o gate. Reabrir discussão técnica com a saída
  literal do erro.
- **Não** declarar a F5 verde por declaração; só por execução.
- A planilha operacional só é atualizada após `EXIT_PIPELINE=0`
  no WSL Ubuntu (e a atualização é responsabilidade do
  PO/ChatGPT após merge no GitHub, não desta sessão).

## 5. O que **não foi** declarado nesta sessão

- Não foi declarado "PIPELINE VERDE" — esta sessão não rodou o
  pipeline oficial.
- Não foi declarado "typecheck verde" — essa execução depende do
  WSL Ubuntu.
- Não foi declarado "vitest verde" — idem.
- Não foi declarado "F5 aprovada" — depende da auditoria do
  PO/ChatGPT.
- Não houve `git add`, `git commit`, `git push`, abertura de PR,
  edição de planilha xlsx ou qualquer escrita em
  `C:\Users\Projetos\Plataforma_Educacional_Financeira` durante a
  sessão.
