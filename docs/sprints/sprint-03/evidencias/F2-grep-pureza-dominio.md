# F2 - Grep de pureza do dominio de amortizacao

**Projeto:** Plataforma Educacional Financeira
**Sprint:** 03
**Fatia:** F2 - Dominio puro de amortizacao PRICE/SAC
**Executor:** Codex
**Data WSL:** 2026-05-02T23:34:42-03:00
**Branch:** sprint-3/f2-dominio-amortizacao-codex
**Commit-base:** 55d5d44

## 1. Objetivo

Registrar greps forenses obrigatorios para confirmar que o dominio de amortizacao permanece puro, sem dependencia indevida do dominio de juros, sem `assert` em producao e sem IO/logging/rede.

## 2. Dependencia proibida do dominio de juros

```bash
$ grep -rnE "^(from|import)\s+app\.domain\.interest" backend/app/domain/amortization/
# sem saida
# exit code: 1
```

Resultado: zero matches. Nao ha import de `app.domain.interest` nem de helper privado `app.domain.interest._rounding`.

## 3. Assert em codigo de producao

```bash
$ grep -rnE "^[^#\"]*\bassert\s+" backend/app/domain/amortization/
# sem saida
# exit code: 1
```

Resultado: zero matches. Validacoes do dominio sao explicitas e levantam `DomainValidationError`.

## 4. IO, rede, print, logging e data corrente

```bash
$ grep -rnE "\bopen\s*\(|\brequests\b|datetime\.now|\bprint\s*\(|\blogging\b" backend/app/domain/amortization/
# sem saida
# exit code: 1
```

Resultado: zero matches. O dominio nao faz IO, nao acessa rede, nao imprime, nao usa logging e nao consulta data corrente.

## 5. Integridade basica do diff

```bash
$ git diff --check
# sem saida
# exit code: 0
```

Resultado: sem whitespace errors.

## 6. Caracteres nao ASCII nos Python novos/alterados

```bash
$ LC_ALL=C grep -nR --exclude='*.pyc' --exclude-dir='__pycache__' '[^ -~]' backend/app/domain/amortization backend/tests/unit/domain/amortization backend/tests/regression/pedagogical
# sem saida
# exit code: 1
```

Resultado: codigo Python criado/alterado sem caracteres nao ASCII.
