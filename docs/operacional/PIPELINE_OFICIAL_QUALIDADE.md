# Pipeline Oficial de Qualidade (PEF)

**Versão documental:** F5-E02
**Escopo:** contrato executável de qualidade que reproduz localmente os
gates da CI oficial. Corrige a F5-E01, que permitia `PIPELINE VERDE`
mesmo com backend ou frontend ausentes.

---

## 1. Princípio

Sem `PIPELINE VERDE`, não há entrega aprovada. "Verde" significa que
**todos** os gates obrigatórios rodaram e passaram, e que o ambiente
tinha os pré-requisitos mínimos para cada domínio. Pré-requisito
ausente em modo padrão não vira `SKIP`; vira `PIPELINE FALHOU`.

Consequências diretas desta política em F5-E02:

1. Modo padrão exige backend **e** frontend. Sem `backend/.venv`, sem
   Node, sem pnpm ou sem qualquer das ferramentas listadas adiante,
   o pipeline aborta. Não há mensagem de "sigamos sem backend".
2. Bandit deixa de ser gate extra do modo `--full` e passa a ser gate
   obrigatório do modo padrão. Segurança estática roda em toda
   execução.
3. `SKIP` só é permitido em `--full`, e apenas para gates
   explicitamente listados como opcionais (seção 5).
4. `PIPELINE VERDE` só é impresso quando todos os gates obrigatórios
   (modo padrão ou modo padrão + extras obrigatórios de `--full`)
   passaram. Gates opcionais com SKIP não invalidam verde, mas
   aparecem explicitamente no log.

## 2. Quando rodar

| Momento                           | Modo       |
|-----------------------------------|------------|
| Antes de qualquer `git push`      | padrão     |
| Antes de abrir PR                 | `--full`   |
| Ao receber review solicitando    | `--full`   |
| Antes de marcar entrega aprovada  | `--full`   |
| Em CI oficial                     | `--full`   |

## 3. Pré-requisitos

### 3.1 Backend (modo padrão exige)

- Diretório `backend/` existe.
- `backend/.venv/` existe com Python instalado.
  - Linux/macOS/sandbox: `backend/.venv/bin/python`
  - Windows: `backend\.venv\Scripts\python.exe`
- As 4 ferramentas abaixo respondem a `python -m TOOL --version`:
  - `ruff`
  - `mypy`
  - `bandit`
  - `pytest`

Instalação típica:

```powershell
cd C:\Users\Projetos\Plataforma_Educacional_Financeira\backend
uv venv .venv
uv pip install -e ".[dev]" --python .venv\Scripts\python.exe
```

```bash
cd /path/to/repo/backend
uv venv .venv
uv pip install -e ".[dev]"
```

Sem isso, o pipeline aborta em padrão. **Não existe modo "backend
indisponível mas pipeline verde".**

### 3.2 Frontend (modo padrão exige)

- Diretório `frontend/` existe.
- `node` no PATH (Node >= 20).
- `pnpm` disponível — direto no PATH **ou** via `corepack pnpm`
  (recomendação: `corepack enable`).

Sem qualquer um desses, o pipeline aborta em padrão.

## 4. Modo padrão — gates obrigatórios

Todos executados em ordem. Qualquer falha aborta com exit 1 e
mensagem explícita. **Backend e frontend são ambos obrigatórios** no
modo padrão; ausência de qualquer um vira `PIPELINE FALHOU`.

### Backend (5 gates, Bandit incluído)

| # | Gate                         | Comando                                                    |
|---|------------------------------|------------------------------------------------------------|
| 1 | `backend.ruff_check`         | `python -m ruff check .`                                   |
| 2 | `backend.ruff_format_check`  | `python -m ruff format --check .`                          |
| 3 | `backend.mypy_app`           | `python -m mypy app/`                                      |
| 4 | `backend.bandit`             | `python -m bandit -r app/ -c pyproject.toml`               |
| 5 | `backend.pytest_unit`        | `python -m pytest tests/unit -m unit`                      |

Nota sobre `mypy app/`: é o escopo oficial da F5-E02. A evolução
planejada é `mypy app/ tests/` após as dívidas de anotação em `tests/`
serem pagas. Até lá, `app/` é o baseline obrigatório.

**Bandit roda no modo padrão por política F5-E02.** Não é mais gate
opcional de `--full`. Segurança estática faz parte de toda execução.

### Frontend (6 gates)

| # | Gate                       | Comando                                |
|---|----------------------------|----------------------------------------|
| 1 | `frontend.install`         | `pnpm install --frozen-lockfile`       |
| 2 | `frontend.lint`            | `pnpm lint`                            |
| 3 | `frontend.format_check`    | `pnpm format:check`                    |
| 4 | `frontend.typecheck`       | `pnpm typecheck`                       |
| 5 | `frontend.test`            | `pnpm test -- --run`                   |
| 6 | `frontend.build`           | `pnpm build`                           |

## 5. Modo `--full` — extras

Roda **tudo** do modo padrão, então adiciona:

### Backend

| # | Gate                          | Status     | Comando                                                                 | Motivo de SKIP                               |
|---|-------------------------------|------------|-------------------------------------------------------------------------|----------------------------------------------|
| 1 | `backend.detect_secrets`      | opcional   | `python -m detect_secrets scan --baseline .secrets.baseline`            | ferramenta não instalada no venv             |
| 2 | `backend.pytest_integration`  | opcional   | `python -m pytest tests/integration -m integration`                     | `tests/integration` ausente                  |
| 3 | `backend.pytest_contract`     | opcional   | `python -m pytest tests/contract -m contract`                           | `tests/contract` ausente                     |
| 4 | `backend.pytest_regression`   | opcional   | `python -m pytest tests/regression -m regression`                       | `tests/regression` ausente                   |

### Frontend

| # | Gate                       | Status       | Comando                   | Motivo de SKIP                                    |
|---|----------------------------|--------------|---------------------------|---------------------------------------------------|
| 1 | `frontend.test_coverage`   | obrigatório  | `pnpm test:coverage`      | — (nunca SKIP; falhar aborta)                     |
| 2 | `frontend.e2e_smoke`       | opcional     | `pnpm test:e2e:smoke`     | script ausente no `package.json` ou browsers fora |
| 3 | `frontend.a11y`            | opcional     | `pnpm test:a11y`          | script ausente ou tooling de a11y fora            |

**Regra absoluta:** qualquer gate não listado explicitamente como
opcional nesta seção é obrigatório. Não existe gate com SKIP silencioso.
**SKIP só é permitido em gates opcionais do modo `--full`.** Em modo
padrão, qualquer ausência de pré-requisito ou ferramenta vira
`PIPELINE FALHOU`.

## 6. Semântica do SKIP

- `SKIP` exige mensagem explícita com o motivo, emitida no log.
- `SKIP` só ocorre em `--full`, e apenas nos 6 gates listados em §5.
- Em modo padrão, qualquer tentativa de pular vira `PIPELINE FALHOU`.
- `PIPELINE VERDE` impresso ao final:
  - em modo padrão: todos os 11 gates passaram.
  - em modo `--full`: todos os gates obrigatórios passaram; gates
    opcionais ou passaram ou foram explicitamente marcados `SKIP`.

## 7. Mensagens de falha

Ao falhar, o pipeline imprime:

```
=== PIPELINE FALHOU ===
Etapa:  <nome do gate ou do pré-requisito>
Motivo: <causa específica, incluindo comando e exit code quando relevante>
```

Exemplos:

```
Etapa:  Pré-requisito Backend
Motivo: backend/.venv não encontrado. Crie com: uv venv .venv ...
```

```
Etapa:  Pré-requisito Frontend
Motivo: pnpm não encontrado (nem direto, nem via corepack). Rode: corepack enable
```

```
Etapa:  backend.ruff_format_check
Motivo: Comando falhou em /path/backend: python -m ruff format --check .
```

## 8. Interação com a F4-E04

A F4-E04 (frontend/juros) **só pode ser materializada após F5
aprovada** — ou seja, depois que esta política F5 estiver no
repositório e que o pipeline imprimir `PIPELINE VERDE` em ambos os
modos. Especificamente:

1. A F5 (entrega corrente) deve estar materializada no repositório
   (scripts e doc em `scripts/` + `docs/operacional/`).
2. `.\scripts\pipeline.ps1` impressa `PIPELINE VERDE` no Windows
   **antes** da aplicação do overlay F4-E04 — ou, se o estado atual
   do repositório já traz o frontend reprovado em `format:check`, o
   operador deve documentar essa reprovação e aplicar a F4-E04 como
   justamente o conserto que faz a pipe virar.
3. `.\scripts\pipeline.ps1` impressa `PIPELINE VERDE` no Windows
   **depois** da aplicação da F4-E04.
4. `.\scripts\pipeline.ps1 -Full` impressa `PIPELINE VERDE` no
   Windows depois da aplicação da F4-E04 (gate coverage
   obrigatório).
5. Evidências (ambas saídas literais) arquivadas em
   `docs/sprints/sprint-02/evidencias/`.

Sem esses itens, F4-E04 não é considerada materializada.

## 9. Códigos de saída

| Code | Significado              |
|------|--------------------------|
| 0    | `PIPELINE VERDE`         |
| 1    | `PIPELINE FALHOU`        |
| 2    | Uso inválido ou `--help` |

## 10. Evolução prevista

- Adicionar `mypy tests/` depois que as anotações em `tests/` forem
  completadas. Até lá, `mypy app/` é o baseline obrigatório.
- Elevar `frontend.test_coverage` para padrão após estabilização da
  Sprint 2 (hoje é obrigatório só em `--full`).
- Agregar `pnpm audit --prod` como gate de segurança frontend quando
  o processo de triage de CVEs transitórios estiver firmado.
- Consolidar `backend.detect_secrets` como obrigatório depois que a
  ferramenta estiver no `pyproject.toml [dev]`.

Cada promoção destas exige fatia própria na governança e atualização
deste documento. Não há promoção silenciosa.
