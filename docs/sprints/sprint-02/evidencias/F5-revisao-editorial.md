# F5 — Revisão Editorial (Sprint 2)

**Status:** revisão editorial técnica preparada; **aprovação final do
PO (Moisés) pendente**.

> Este documento **não declara aprovação humana**. A política
> editorial do Doc 08 §7 exige assinatura do responsável editorial
> (campo `approved_by`). Esse passo acontece após a auditoria do
> ChatGPT/PO. Até lá, todo conteúdo entregue na F5 está em fase de
> *Revisão pedagógica* (3º degrau do fluxo §7), não em
> *Aprovação editorial* (5º degrau).

## 1. Escopo da revisão

Conteúdo coberto:

| Slug                | Nível | Caminho                                                      |
|---------------------|-------|--------------------------------------------------------------|
| juros-simples       | 1     | `frontend/src/content/juros/nivel-1.ts`                       |
| juros-compostos     | 1     | `frontend/src/content/juros/nivel-1.ts`                       |
| comparacao-juros    | 1     | `frontend/src/content/juros/nivel-1.ts`                       |
| aportes-mensais     | 1     | `frontend/src/content/juros/nivel-1.ts`                       |
| juros-simples       | 2     | `frontend/src/content/juros/nivel-2.ts`                       |
| juros-compostos     | 2     | `frontend/src/content/juros/nivel-2.ts`                       |
| comparacao-juros    | 2     | `frontend/src/content/juros/nivel-2.ts`                       |
| aportes-mensais     | 2     | `frontend/src/content/juros/nivel-2.ts`                       |
| (8 termos)          | —     | `frontend/src/content/juros/glossario.ts`                     |

Glossário mínimo entregue (Doc 08 §13 + PLANO Sprint 2 §5.5):
juros, juros-simples, juros-compostos, principal, taxa, prazo,
montante, aporte.

## 2. Critérios editoriais aplicados

Sustentados pelo **Doc 08** (versão 2.0):

### 2.1 Princípios pedagógicos (§5)

- [x] Clareza antes de sofisticação.
- [x] Aplicação antes de abstração.
- [x] Progressão antes de excesso (Nível 1 = essencial; Nível 2 =
      aprofundamento).
- [x] Contexto antes de fórmula isolada.
- [x] Linguagem humana antes de jargão.
- [x] Interpretação antes de número solto (cada número citado vem
      de Doc 15 e é nomeado).
- [x] Educação integrada ao uso (textos referenciam o módulo, não
      vivem em "página separada esquecida"; o componente
      `<JurosSaibaMais />` permite encaixe direto nos painéis).
- [x] Honestidade pedagógica: o disclaimer "produto educacional,
      não consultoria" está no rodapé de todo bloco.

### 2.2 Tom de voz (§6.1)

- [x] Claro, didático, respeitoso, humano.
- [x] Sem "você deveria", sem "obviamente", sem "é simples".
- [x] Frases curtas (alvo ≤ 25 palavras — checagem manual amostral).
- [x] Sem moralismo sobre dívida ou consumo.

### 2.3 Regras de escrita (§6.2)

- [x] Um conceito por bloco (4 temas × 2 níveis = 8 blocos).
- [x] Explicação antes da abstração (cada tema começa com a
      essência, exemplo numérico vem em seguida).
- [x] Exemplos do cotidiano (saldo, dívida, aplicação).
- [x] Fórmula sempre acompanhada de tradução em prosa (na verdade,
      neste nível 1/2 não usamos fórmula formal — fica para Nível 3,
      Sprint 7).
- [x] Sem números sem unidade (todos em R$/mês/% explícitos).
- [x] Sem promessa de retorno futuro.

### 2.4 Inclusão e respeito (§6.3)

- [x] Sem assumir gênero, classe, escolaridade ou estado civil.
- [x] Sem julgamento moral sobre dívida ou consumo.

### 2.5 Conformidade regulatória editorial (§6.4)

- [x] Disclaimer "produto educacional, não consultoria" presente
      em **todo** bloco via `DISCLAIMER_EDUCACIONAL`.
- [x] Sem prometer equivalência com contrato real.
- [x] Sem citar Selic/TR/IPCA/CET sem fonte (esses indicadores
      não são citados nesta F5).

### 2.6 Coerência numérica com Doc 15

- [x] Todos os exemplos numéricos vêm da massa oficial de
      validação (JS-01, JC-01, JC-03).
- [x] Os valores literais que aparecem no texto (R$ 1.000,00,
      R$ 1.120,00, R$ 1.126,83, 1% ao mês, 12 meses) batem
      exatamente com o Doc 15.
- [x] Coerência verificada pelo teste runtime
      `frontend/src/__tests__/content/juros/conteudo.test.ts`,
      que falha o build se o texto deixar de citar os números
      esperados.

## 3. Pontos revisados (lista cirúrgica)

| Tema             | Risco editorial original                  | Decisão na revisão                                                                 |
|------------------|--------------------------------------------|------------------------------------------------------------------------------------|
| Juros simples N1 | "linear" pode soar técnico                 | Mantido + parágrafo de tradução: "a cada mês entra a mesma quantia de juros".     |
| Juros compostos N1 | "juros sobre juros" sozinho é jargão     | Definição usada apenas após a explicação literal de "incidem sobre o saldo já acumulado". |
| Comparação N1    | risco de dar conselho financeiro           | Reescrito como observação descritiva: "o módulo não recomenda decisões".           |
| Aportes N1       | risco de confundir aporte com juros        | Parágrafo dedicado: "Aporte não é juro." Depois explica a separação na tabela.    |
| Juros simples N2 | risco de cair em fórmula sem prosa         | Cálculo descrito em prosa primeiro; números de JS-01 entram em parágrafo separado. |
| Juros compostos N2 | "capitalização" é termo do Doc 03         | Definida em uma frase + remetida ao Doc 03 para tratamento formal.                |
| Comparação N2    | risco de juízo sobre "qual é melhor"       | Substituído por leitura crítica: "o cálculo não diz qual regime é melhor".         |
| Aportes N2       | risco de detalhar coluna que não existe    | Descrição alinhada ao contrato real do Doc 06 (`aporte_mensal` opcional).         |
| Glossário        | risco de definição circular                | Cada termo: definição curta direta + definição completa com mecanismo + exemplo numérico extraído de Doc 15. |

## 4. Pendências honestamente declaradas

1. **Aprovação editorial do PO**: ainda não ocorreu. O texto está
   pronto para revisão humana de Moisés. Esta F5 **não substitui**
   essa aprovação.
2. **Conteúdo Nível 3** (aprofundamento opcional, 10–20 min de
   leitura) **não foi escrito** nesta F5. Doc 08 §10 reconhece
   que Nível 3 é opcional para o MVP.
3. **Glossário ampliado**: Doc 08 §18 fala em ≥ 25 termos para o
   MVP. Esta F5 entrega os 8 termos exigidos pelo PLANO Sprint 2
   §5.5, todos do módulo de juros. Os outros ≥17 termos (CET, IOF,
   TR, Selic, IPCA, taxa real, taxa nominal, etc.) cobrem módulos
   ainda não construídos (financiamento, rotativo, atraso) e
   ficam fora do escopo desta sprint.
4. **FAQ inicial** (Doc 08 §18, ≥ 15 perguntas) **não foi escrita**
   nesta F5. PLANO Sprint 2 §5.5 não exige FAQ na F5.
5. **Lint pedagógico completo** (Doc 08 §20): apenas o subset
   determinístico foi implementado nesta F5. Veja
   `F5-lint-pedagogico.md` para detalhes.

## 5. Verificações automáticas executadas (substituto runtime do
   review humano)

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

Suite de teste runtime (Vitest) `conteudo.test.ts` cobre, no
ambiente do operador:

- presença dos quatro temas obrigatórios em N1 e N2;
- formato de cada bloco (slug, semver, nível, parágrafos ≥ 3,
  disclaimer);
- ausência de termos editorialmente proibidos (regex);
- presença de "educacional" e "consultoria" no disclaimer;
- cobertura mínima do glossário e qualidade mínima de cada entrada;
- coerência numérica com JS-01 (juros simples) e JC-01 (juros
  compostos).

A execução vinculante desses testes ocorre no WSL Ubuntu, junto
ao `pipeline.sh`. Saídas locais do sandbox Linux desta sessão
estão em `F5-validacoes-locais.md`.

## 6. Próximo passo (operador / PO)

1. Auditar este conteúdo (texto a texto) contra os critérios da
   §2 deste documento.
2. Se aprovado, registrar em `living_docs.json` e (em uma sprint
   futura) preencher `approved_by` no esquema versionado de
   conteúdo (Doc 08 §8) — esse esquema ainda não está
   materializado em runtime, então o registro fica documental.
3. Rodar `make lint-pedagogical` no WSL Ubuntu antes de aprovar.
4. Rodar `pnpm test --run` (frontend) no WSL Ubuntu — esperado:
   inclusão dos novos testes sem regressão.
