# `tools/edu_lint/` — Lint pedagógico (subset Sprint 2 / F5)

## Status honesto

Este diretório materializa um **subset determinístico** do lint
pedagógico especificado em **Doc 08 §20**. A implementação completa
(contagem por sigla, glossário cross-link, telemetria, regras de
cor/ícone) permanece planejada para a **Sprint 7**, conforme
roadmap e gate forense
(`docs/baseline/gate-forense/LISTA_DE_BLOQUEADORES_E_CONDICIONANTES.md`,
linha 100).

A motivação é cobrir o item §5.5.4 do PLANO Sprint 2 — *"Lint
pedagógico (Doc 08 §20) verde — `make lint:pedagogical` ou
equivalente"* — sem inventar uma especificação que ainda não foi
acordada. Tudo o que este script faz tem regra explícita no Doc 08.

## O que ele faz

Sem dependências externas (apenas `stdlib`). Varre arquivos de
conteúdo educacional do frontend e dos docs vivos relevantes e aplica
regras objetivas:

### Bloqueios (EXIT=1)

- Promessa de retorno (`vai render`, `rendimento garantido`) — Doc 08 §6.4.
- Imperativo aconselhativo (`você deveria`) — Doc 08 §6.1.
- Moralismo (`obviamente`, `é irresponsável`) — Doc 08 §6.1, §6.3.
- Placeholders (`lorem ipsum`, `placeholder`, `TODO`, `FIXME`).
- Aviso educacional ausente em arquivo de conteúdo de juros — exige
  pelo menos uma ocorrência da palavra `educacional` (Doc 08 §6.4).

### Avisos (não bloqueiam, salvo `--strict`)

- Termos-chave do glossário mínimo ausentes no corpus.
- Anti-padrões de a11y (`clique aqui`).

## Uso

```bash
# default (paths canônicos): frontend/src/content + docs/08_*.md
python -m tools.edu_lint

# alvo específico
python -m tools.edu_lint frontend/src/content/juros docs/08_Conteudo_Educacional.md

# avisos contam como bloqueio
python -m tools.edu_lint --strict
```

## Integração com Makefile

O alvo `lint-pedagogical` foi adicionado ao Makefile na F5 da Sprint 2.
Equivale a `python3 -m tools.edu_lint`.

```bash
make lint-pedagogical
```

## O que ainda falta (declarado, não escondido)

- Frase > 25 palavras → aviso (precisa de tokenização estável; fica
  para Sprint 7).
- Sigla não-explicada na 1ª ocorrência → bloqueio (precisa de
  glossário ativo de siglas; fica para Sprint 7).
- Termo sem entrada no glossário → aviso (depende de fonte
  estruturada do glossário em runtime; fica para Sprint 7).
- Cor como único veiculador → aviso (exige inspeção do JSX
  renderizado; provavelmente entra em a11y-lint).

Estas pendências são documentais e estão refletidas no relatório de
F5 e na evidência `docs/sprints/sprint-02/evidencias/F5-lint-pedagogico.md`.

## Compatibilidade

- Python ≥ 3.10 (usa `from __future__ import annotations`,
  `@dataclass(frozen=True)`).
- Sem dependências `pip`.
- Codificação UTF-8.
