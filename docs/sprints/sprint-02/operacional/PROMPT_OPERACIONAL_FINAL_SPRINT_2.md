# PROMPT_OPERACIONAL_FINAL_SPRINT_2

Projeto: Plataforma Educacional Financeira  
Escopo desta rodada: Reinício operacional da Sprint 2 no repositório do Windows  
Natureza: Prompt operacional de execução, subordinado ao plano da sprint e à governança do workspace

---

## 1. HIERARQUIA OPERACIONAL OBRIGATÓRIA

Nesta rodada, a execução deve obedecer à seguinte ordem de precedência:

1. `docs/sprints/sprint-02/00-plano/PLANO_EXECUCAO_SPRINT_2.md`
2. `CLAUDE.md` na raiz do workspace
3. Política Oficial de Qualidade do projeto, conforme consolidada nas instruções do workspace
4. `docs/operacional/PROMPT_MESTRE_DE_DESENVOLVIMENTO_v2_0_POS_GATE_FORENSE.md` como referência estratégica de alto nível

Regra dura:
- o Plano da Sprint 2 determina o trabalho da sprint;
- o `CLAUDE.md` determina a postura operacional persistente;
- a Política de Qualidade determina os padrões mínimos e as proibições permanentes;
- o Prompt-Mestre orienta arquitetura, visão de produto e coerência estrutural, mas **não substitui** o plano da sprint nem o prompt operacional da rodada.

Em caso de conflito entre ambição macro do Prompt-Mestre e escopo imediato da sprint atual, prevalece o escopo imediato da sprint atual.

---

## 2. ESTADO OFICIAL DESTA RODADA

Considere como fatos vinculantes já decididos:

1. A F1 da Sprint 2 já foi concluída/homologada e **não será refeita**.
2. A tentativa anterior da F2 foi abortada.
3. O desenvolvimento desta nova rodada ocorrerá **diretamente no repositório do Windows**.
4. A pasta documental externa `Matemática Financeira` **não é** o workspace de desenvolvimento desta rodada.
5. O ponto correto da Sprint 2 agora é: **pré-início da F2 reiniciada**, com prova inicial obrigatória e Gate 0 antes de qualquer implementação.

---

## 3. WORKSPACE OFICIAL

O workspace operacional desta sessão é o repositório do Windows.

Você deve tratar este repositório como:
- fonte oficial de código desta rodada;
- working tree principal de desenvolvimento;
- local onde devem ocorrer alterações de código, testes, configs e documentação versionada do projeto.

Você está proibida de:
- usar a pasta documental externa como área de código;
- gerar patch técnico fora do repositório;
- misturar governança externa com implementação no workspace de código;
- tratar a pasta documental como repo operacional.

---

## 4. OBJETIVO EXATO DESTA RODADA

Seu objetivo nesta rodada é:

- **não** replanejar a Sprint 2;
- **não** refazer a F1;
- **não** retomar a tentativa abortada da F2 como base;
- **não** improvisar um pacote ZIP;
- **não** começar codando sem prova prévia;

Seu objetivo é:

1. provar que o workspace e o repositório estão corretos;
2. executar a prova inicial obrigatória;
3. executar o Gate 0 de reinício;
4. somente se o Gate 0 passar, iniciar a **F2 — Domínio de Juros (Simples + Compostos)**.

---

## 5. REGRA DE PARTIDA

Você **não** deve começar a F2 diretamente.

A ordem obrigatória é:

### Etapa A — Prova do workspace e do repositório
### Etapa B — Prova inicial obrigatória
### Etapa C — Gate 0 de reinício
### Etapa D — Somente se tudo passar: implementação da F2

---

## 6. PROVA DO WORKSPACE E DO REPOSITÓRIO

Antes de qualquer implementação, execute e mostre a saída literal de:

```bash
pwd
find /sessions -type d -name ".git" 2>/dev/null
git rev-parse --git-dir
git remote -v
git branch --show-current
git rev-parse --short HEAD
git rev-parse --short origin/main
```

Depois disso, declare apenas uma destas duas frases:

- `Workspace correto e repositório apto para prova inicial e Gate 0.`
ou
- `Workspace incorreto ou repositório não apto. Execução bloqueada.`

Se o repositório não estiver apto, pare imediatamente.

---

## 7. PROVA INICIAL OBRIGATÓRIA

Se o workspace estiver apto, execute e mostre a saída literal de:

```bash
git fetch origin --prune
git checkout main
git pull --ff-only origin main
git checkout -B sprint-2/f2-dominio-reinicio origin/main

git branch --show-current
git status -sb
git rev-parse --short HEAD
git rev-parse --short origin/main
git diff --name-only origin/main..HEAD
```

Critérios esperados:
- branch correta: `sprint-2/f2-dominio-reinicio`
- working tree limpa
- base partindo de `origin/main`
- diff inicial vazio contra a base recém-checada

Se qualquer prova acima falhar, pare e declare bloqueio.

---

## 8. GATE 0 DE REINÍCIO

Se a prova inicial passar, execute e mostre a saída literal de:

```bash
cd backend

python -m ruff check .
python -m ruff format --check .
python -m mypy app/
python -m bandit -r app/ -c pyproject.toml
DATABASE_URL='postgresql+psycopg://postgres:postgres@localhost:5432/pef_test' APP_ENV=ci python -m pytest tests/unit -v --cov=app --cov-report=xml -m unit
```

### Regra de decisão do Gate 0
- se o Gate 0 falhar, **pare imediatamente**;
- entregue um **RELATÓRIO DE BLOQUEIO DE BASELINE**;
- não implemente a F2;
- não “corrija em cima” sem autorização explícita;
- não trate falha de baseline como se fosse falha da fatia.

Se o Gate 0 passar, a F2 fica liberada.

---

## 9. ESCOPO AUTORIZADO DA F2

Somente após a liberação do Gate 0, você poderá iniciar a F2 com foco em:

- domínio puro de juros simples e compostos;
- uso de `Decimal`;
- regras de arredondamento controladas;
- fixtures/golden cases;
- testes unitários do domínio;
- testes property-based do domínio;
- validação contra os gates reais relevantes.

### Arquivos preferencialmente autorizados
- `backend/app/domain/interest/__init__.py`
- `backend/app/domain/interest/_rounding.py`
- `backend/app/domain/interest/simple.py`
- `backend/app/domain/interest/compound.py`
- `backend/tests/unit/domain/interest/test_simple.py`
- `backend/tests/unit/domain/interest/test_compound.py`
- `backend/tests/unit/domain/interest/test_properties.py`
- `backend/tests/fixtures/financial_cases.json`
- `backend/tests/fixtures/gen_fixture.py`

### Arquivos proibidos, salvo prova e justificativa excepcional
- `backend/pytest.ini`
- `backend/app/main.py`
- `backend/tests/unit/test_health.py`
- qualquer arquivo de frontend
- qualquer área fora da F2
- qualquer pacote operacional antes do verde real

---

## 10. REGRAS MATEMÁTICAS MÍNIMAS DA F2

Respeite rigorosamente:

### Juros simples
- `J = PV × i × n`
- `FV = PV × (1 + i × n)`

### Juros compostos
- `FV = PV × (1 + i)^n`

Regras obrigatórias:
- explicitar periodicidade da taxa;
- não misturar taxa anual com prazo mensal sem conversão clara;
- backend como fonte oficial da verdade;
- arredondar preferencialmente só na apresentação;
- entradas inválidas devem produzir erro estruturado.

Casos mínimos obrigatórios de validação:
- juros simples: principal 1000, taxa 1% a.m., prazo 12, montante 1120,00
- juros compostos: principal 1000, taxa 1% a.m., prazo 12, montante aproximado 1126,83

---

## 11. TESTES E PROVAS DA F2

Depois da implementação da F2, execute e mostre a saída literal de:

```bash
cd backend

python -m ruff check .
python -m ruff format --check .
python -m mypy app/
python -m bandit -r app/ -c pyproject.toml
python -m pytest tests/unit/domain/interest/ -q
python -m pytest --cov=app.domain.interest --cov-branch tests/unit/domain/interest/
python -m pytest tests/unit/domain/interest/ --collect-only
DATABASE_URL='postgresql+psycopg://postgres:postgres@localhost:5432/pef_test' APP_ENV=ci python -m pytest tests/unit -v --cov=app --cov-report=xml -m unit
```

Se `tests/unit -m unit` falhar, a rodada não fecha.
Se houver regressão estrutural fora da F2, a rodada não fecha.
Se algum gate for presumido em vez de provado, a rodada não fecha.

---

## 12. PACOTE OPERACIONAL — PROIBIDO ANTES DO VERDE REAL

Antes do verde real, você está proibida de gerar:
- README operacional da fatia
- COMANDOS.md
- CORPO_DA_PR.md
- AVISO_PLANILHA.md
- ZIP
- pacote auditado
- staging proof textual de fechamento

Primeiro:
- código
- testes
- gates reais
- prova literal

Só depois, se e somente se tudo estiver verde, você poderá materializar o pacote operacional da F2.

---

## 13. FORMATO OBRIGATÓRIO DA RESPOSTA

Sua resposta deve vir nesta ordem:

1. Resumo da rodada
2. Prova do workspace e do repositório
3. Resultado da prova inicial
4. Resultado do Gate 0
5. Decisão binária: F2 liberada ou bloqueada
6. Arquivos que pretende tocar
7. Implementação completa dos arquivos alterados
8. Testes criados/ajustados
9. Saídas literais dos gates executados
10. Impacto documental identificado
11. Pendências honestamente declaradas
12. Veredito final da rodada

---

## 14. PROIBIÇÕES ABSOLUTAS

Você não pode:
- refazer a F1;
- reabrir a tentativa abortada da F2 como base;
- reutilizar branch ou PR antigas;
- criar `backend/pytest.ini`;
- adaptar a rodada para modo patch;
- gerar pacote antes do verde real;
- ampliar escopo para F3/F4/F5/F6;
- tratar a pasta documental externa como workspace de código;
- apresentar prova presumida;
- continuar implementando se a baseline estiver bloqueada.

---

## 15. VEREDITO BINÁRIO OBRIGATÓRIO

Ao final da rodada, use apenas um destes vereditos:

- **F2 LIBERADA PARA IMPLEMENTAÇÃO**
ou
- **F2 BLOQUEADA POR BASELINE / GATE 0**

---

## 16. REGRA FINAL

Este prompt operacional existe para disciplinar a retomada real da Sprint 2 no repositório do Windows.

Você deve:
- provar antes de agir;
- validar antes de implementar;
- parar diante de bloqueio real;
- e só desenvolver a F2 quando a base estiver objetivamente apta.

Não improvise.
Não presuma.
Não acelere sacrificando prova.
