# F5 — Lint Pedagógico (Sprint 2)

## 1. Estado anterior

Antes desta F5, o projeto **não tinha** comando real de lint pedagógico
materializado:

- `Makefile` declarava `docs-check` apenas em `.PHONY` (linha 9), sem
  corpo de regra correspondente.
- `package.json` do frontend não tinha script `lint:content` ou
  `lint:pedagogical`.
- `scripts/` continha apenas `pipeline.ps1`, `pipeline.sh`,
  `export_openapi.py` e `impact_analysis_guard.py`, sem nada
  pedagógico.
- Doc 08 §20 prescrevia `tools/edu_lint/` (Python) — caminho
  inexistente até esta sessão.
- Gate Forense
  (`docs/baseline/gate-forense/LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md`,
  linha 100) reconhecia explicitamente: *"`tools/edu_lint/`
  especificado em Doc 08 §20; implementação em Sprint 7 conforme
  roadmap."*
- PLANO Sprint 2 §5.5 e §9.1 exigiam `make lint:pedagogical`
  **verde** como pré-requisito do DoD desta F5.

Ou seja: havia uma **tensão documentada** entre o roadmap (Sprint 7)
e o DoD da Sprint 2 (agora). A F5-OF resolve essa tensão entregando
o **subset determinístico** que cobre as regras do Doc 08 §20 que
não dependem de NLP, sem inventar uma especificação maior do que a
acordada e sem prometer a implementação completa.

## 2. O que foi materializado

### 2.1 `tools/edu_lint/`

- `tools/__init__.py`
- `tools/edu_lint/__init__.py`
- `tools/edu_lint/__main__.py` — entry-point para `python -m tools.edu_lint`
- `tools/edu_lint/edu_lint.py` — lint determinístico (stdlib only)
- `tools/edu_lint/README.md` — escopo, limites e roadmap explícito

### 2.2 Regras implementadas (subset de Doc 08 §20)

Bloqueios (EXIT=1):
- promessa de retorno (`vai render`, `rendimento garantido`) — §6.4;
- imperativo aconselhativo (`você deveria`) — §6.1;
- moralismo (`obviamente`, `é irresponsável`) — §6.1, §6.3;
- placeholders (`Lorem ipsum`, `placeholder`, `TODO`, `FIXME`);
- aviso educacional ausente no corpus juros — §6.4 (regra por
  *corpus*, não por arquivo, para permitir glossário sem
  duplicação do disclaimer).

Avisos (EXIT=0 sem `--strict`, EXIT=1 com `--strict`):
- termos-chave do glossário mínimo ausentes do corpus;
- anti-padrão de a11y (`clique aqui`).

Auto-exclusão para evitar falso positivo:
- `docs/08_Conteudo_Educacional.md` (define os termos como exemplos
  do que evitar — citá-los faz parte da especificação);
- `tools/edu_lint/` (o próprio lint cita os padrões nas regras).

### 2.3 Pendências honestas (registradas no README do lint)

A implementação **não cobre ainda**:
- frase > 25 palavras (precisa de tokenização estável);
- sigla não-explicada na 1ª ocorrência (precisa de glossário ativo
  de siglas);
- termo sem entrada no glossário (precisa de glossário runtime);
- cor como único veiculador (exige inspeção de JSX renderizado).

Estas pendências foram **planejadas explicitamente** para a
Sprint 7, conforme Doc 08 §20 e Gate Forense. **Não há promessa de
implementação dentro desta F5.**

## 3. Comandos executados — saídas literais

### 3.1 Sandbox Linux (Cowork)

Ambiente: Python 3.10.12, sem dependências externas além de stdlib.

```
$ cd outputs/F5_OF_CONTEUDO_DOCS_DRAFT
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

Aplicado contra o Doc 08 vigente do repositório (com auto-exclusão
ativa):

```
$ python3 -m tools.edu_lint frontend/src/content \
    /sessions/.../Plataforma_Educacional_Financeira/docs/08_Conteudo_Educacional.md

edu_lint: 4 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
EXIT=0
```

(O total é 4 e não 5 porque o Doc 08 está na lista
`SELF_REFERENTIAL_PATHS` — comportamento descrito no README do
lint.)

### 3.2 Comprovação de que o lint **detecta** violações reais

Para evitar a suspeita de "lint que não bloqueia nada", criei um
arquivo temporário com gatilhos e rodei contra ele:

```
$ cat > /tmp/ruim.md << 'EOF'
> Este investimento vai render 25% ao mês, garantido.
> Você deveria parar de usar cartão. Obviamente é irresponsável.
> Lorem ipsum dolor.
> TODO: revisar.
EOF
$ python3 -m tools.edu_lint /tmp/ruim.md
/tmp/ruim.md:1: block: promessa de retorno ('vai render') vetada (Doc 08 sec.6.4)
/tmp/ruim.md:2: block: imperativo aconselhativo ('voce deveria') vetado (Doc 08 sec.6.1)
/tmp/ruim.md:2: block: moralismo ('obviamente') vetado (Doc 08 sec.6.1)
/tmp/ruim.md:2: block: moralismo ('e irresponsavel') vetado (Doc 08 sec.6.3)
/tmp/ruim.md:3: block: placeholder 'lorem ipsum' nao pode chegar ao conteudo
/tmp/ruim.md:4: block: marcador 'TODO' presente em arquivo de conteudo

edu_lint: 1 arquivo(s) analisado(s)
edu_lint: 6 bloqueio(s), 0 aviso(s)
EXIT=1
```

(Esta saída é incluída como prova de viabilidade do detector. O
arquivo `/tmp/ruim.md` não faz parte da entrega.)

## 4. Integração com o operador

### 4.1 Makefile (proposta cirúrgica)

A F5 propõe adicionar ao `Makefile` o alvo:

```make
lint-pedagogical:  ## Lint pedagogico (subset Doc 08 §20)
	$(PYTHON) -m tools.edu_lint
```

E acrescentar `lint-pedagogical` ao `.PHONY`.

A entrega já vem com o patch de Makefile (`Makefile.patch` na
pasta de evidências) ou, alternativamente, com o Makefile completo
no DRAFT. **Decisão de integração final é do operador** — o pacote
inclui ambas as opções.

### 4.2 WSL Ubuntu (validação oficial)

```bash
cd /caminho/para/repo
make lint-pedagogical
echo "EXIT=$?"
```

Esperado: `EXIT=0`. Se `EXIT=1`, ler as linhas indicadas e ajustar
o conteúdo (não o lint).

## 5. Limitações honestas

1. O sandbox Linux desta sessão roda Python 3.10. O projeto declara
   Python 3.11+. O lint usa apenas funcionalidades 3.10-compat
   (`from __future__ import annotations`, `dataclass(frozen=True)`),
   portanto roda em ambos. Mas a **execução vinculante** é a do
   operador no WSL Ubuntu.

2. O lint não substitui a revisão humana editorial. Ele detecta
   violações objetivas; nuances de tom, progressão pedagógica e
   alinhamento com a persona continuam exigindo revisão humana
   (registrada em `F5-revisao-editorial.md`).

3. O lint atual cobre **apenas o módulo de juros** (corpus
   `frontend/src/content/juros/`). A extensão para outros módulos
   é trivial mas fica como follow-up — o módulo de juros é o
   único da Sprint 2.

## 6. Status final

- **Comando existe?** Sim — `python -m tools.edu_lint`
  (e proposta de `make lint-pedagogical`).
- **Verde nos artefatos da F5?** Sim — 0 bloqueios, 0 avisos.
- **Cobertura honesta?** Subset do Doc 08 §20 com pendências
  explícitas para Sprint 7.
- **Falsos positivos?** Tratados via auto-exclusão documentada.
- **Implementação completa do Doc 08 §20?** **Não nesta F5.** A
  implementação completa segue planejada para a Sprint 7.
