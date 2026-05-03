# DOCUMENTO 08 — CONTEÚDO EDUCACIONAL
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente)
**Tipo:** Conteúdo Educacional
**Status canônico:** VIVO

---

## 1. Finalidade
Definir a estratégia editorial e pedagógica do produto, suas personas, suas métricas, sua política editorial, seu fluxo de revisão, seu versionamento de conteúdo e sua integração com cálculo, alertas e interpretação automática.

## 2. Papel do conteúdo educacional
O conteúdo é **pilar central**. Sem ele a plataforma é simulador; com ele é **plataforma de educação financeira aplicada**. Toda decisão de conteúdo passa pelo princípio: *o número não educa por si só*.

## 3. Persona pedagógica oficial

### 3.1 Persona principal — "Iniciante Curioso"
- Faixa etária: 18–45.
- Educação formal: ensino médio completo.
- Repertório financeiro: baixo/médio.
- Motivação: tomar decisões melhores sem se sentir burlado.
- Dor: jargão, fórmulas isoladas, telas frias.
- Linguagem ideal: PT-BR, frases curtas, exemplos concretos, sem moralismo.

### 3.2 Persona secundária — "Estudante de finanças/admin"
- Quer entender mecanismo formal além do número.
- Aceita aprofundamento opcional.

### 3.3 Persona terciária (futura) — "Educador"
- Usa conteúdo da plataforma como apoio.
- Demanda glossário, FAQs, exemplos confiáveis, fontes.

## 4. Funções principais da camada educacional
- **explicativa** (o que é);
- **interpretativa** (o que significa este resultado);
- **contextual** (por que isso importa para você);
- **preventiva** (alertas que evitam armadilhas);
- **formativa** (constrói repertório progressivo).

## 5. Princípios pedagógicos oficiais
1. Clareza antes de sofisticação.
2. Aplicação antes de abstração.
3. Progressão antes de excesso.
4. Contexto antes de fórmula isolada.
5. Linguagem humana antes de jargão.
6. Interpretação antes de número solto.
7. Educação integrada ao uso (não em "página separada esquecida").
8. Honestidade pedagógica: *isto é simulação, não conselho*.

## 6. Política editorial oficial

### 6.1 Tom de voz
- Claro, didático, respeitoso, humano, encorajador, tecnicamente correto.
- **Evitar:** linguagem fria, jargão excessivo, moralismo, alarmismo, paternalismo.
- **Não usar:** "você deveria", "obviamente", "é simples"; usar: "você pode", "por exemplo", "uma forma de pensar".

### 6.2 Regras de escrita
- Frases curtas (≤ 25 palavras como alvo).
- Um conceito por bloco.
- Explicação antes da abstração.
- Exemplos do cotidiano.
- Siglas sempre explicadas na 1ª ocorrência.
- Fórmula sempre acompanhada de tradução em prosa.
- Sem números sem unidade nem indicação de período.
- Sem promessas de retorno futuro.

### 6.3 Inclusão e respeito
- Sem assumir gênero, classe, escolaridade ou estado civil do leitor.
- Exemplos diversos (renda variável, autônomos, CLT, MEI).
- Sem julgamento moral sobre dívida ou consumo.

### 6.4 Conformidade regulatória editorial
- Aviso persistente "produto educacional, não consultoria".
- Indicar fonte e data-base ao usar Selic, TR, IPCA, taxas médias.
- Não prometer equivalência com contrato real.
- Distinguir taxa nominal de CET (ver Doc 18).

### 6.5 Acessibilidade do conteúdo
- Linguagem em nível de leitura ~6º ano (Flesch-Kincaid PT-BR adaptado).
- Cores não são o único veiculador de informação (usar ícone/texto também).
- Imagens com `alt`.
- Sem áudio essencial sem transcrição.

## 7. Fluxo editorial (obrigatório)

```
Rascunho → Revisão pedagógica → Revisão técnica → Revisão de tom → Aprovação editorial → Publicação
```

- **Rascunho:** autor (humano ou IA) cria.
- **Revisão pedagógica:** avalia clareza, progressão e adequação à persona.
- **Revisão técnica:** valida coerência com Doc 03 (matemática) e Doc 18 (regulatório).
- **Revisão de tom:** lint editorial + revisão humana.
- **Aprovação editorial:** responsável editorial assina (campo `approved_by` no metadado).
- **Publicação:** flag `is_published=true` + data + versão.

PR que adicione/altere conteúdo educacional sem registro do fluxo (campos no metadado) é **bloqueada** pelo agente de impacto.

## 8. Versionamento de conteúdo
Cada artefato (texto, glossário, FAQ, alerta) tem:
- `slug` estável;
- `version` semver textual (`1.0.0`);
- `revision_history` (lista de `{version, date, author, change}`);
- `approved_by`;
- `published_at`;
- `superseded_by` (slug + versão) quando aplicável.

Mudança material (não-cosmética) bumpa minor; mudança de fato/cálculo bumpa major.

## 9. Tipos oficiais de conteúdo
- **Explicação introdutória** — o que é, em 3–5 frases.
- **Explicação de conceito** — definição + exemplo + caveat.
- **Interpretação de resultado** — texto gerado a partir do payload de simulação.
- **Alerta educativo** — preventivo (ex.: "seu CET parece alto").
- **Exemplo prático** — cenário concreto cotidiano.
- **Dica financeira** — pílula curta.
- **FAQ** — pergunta + resposta curta.
- **Glossário** — termo + definição + exemplo + módulo relacionado.
- **Conteúdo aprofundado** — texto longo opcional (Nível 3).
- **Quiz** (futuro).

## 10. Organização por profundidade
- **Nível 1 — Essencial:** mínimo para usar o módulo (2–3 min de leitura).
- **Nível 2 — Intermediário:** entender mecanismo do cálculo (5–8 min).
- **Nível 3 — Aprofundamento:** opcional, para quem quer mais (10–20 min).

Cada artefato declara seu nível.

## 11. Integração com módulos
Cada módulo do Doc 02 deve conter:
- introdução curta (Nível 1);
- ajuda contextual em cada campo do formulário;
- interpretação automática do resultado;
- alerta educativo (quando aplicável);
- link para Nível 2/3 e glossário.

## 12. Conteúdo mínimo obrigatório por módulo do MVP

### 12.1 Diagnóstico Financeiro
Saúde financeira; comprometimento de renda; reserva de emergência; sobra mensal.

### 12.2 Juros
Diferença simples × compostos; efeito do tempo; capitalização; armadilhas comuns.

### 12.3 PRICE × SAC
Amortização; parcela fixa × decrescente; efeito no custo total; quando cada um faz sentido.

### 12.4 Financiamentos (Imobiliário e Veículo)
Valor financiado; entrada; parcela; comprometimento; total pago; comparação de sistemas.

### 12.5 Consignado e CDC
Margem consignável; CET; custo efetivo; quando consignado pode ser pior; armadilha do "parcela baixa".

### 12.6 Rotativo
Pagamento mínimo; saldo remanescente; juros do rotativo; armadilha de rolar fatura.

### 12.7 Atraso
Multa, juros de mora, correção monetária; crescimento da dívida; o que fazer ao atrasar.

### 12.8 Indicadores
CET, IOF, TR, Selic, IPCA, taxa real; quem publica e onde consultar.

### 12.9 Investir × Quitar
Custo de oportunidade; risco; previsibilidade; quando quitar dívida cara é melhor que investir.

## 13. Glossário oficial
Cada termo: `nome`, `slug`, `definicao_curta`, `definicao_completa`, `exemplo`, `modulo_relacionado`.

Termos mínimos do MVP:
juros, juros simples, juros compostos, amortização, saldo devedor, parcela, CET, IOF, TR, Selic, IPCA, taxa real, taxa nominal, rotativo, mora, multa, correção monetária, principal, montante, capitalização, PRICE, SAC, custo de oportunidade, comprometimento de renda, reserva de emergência, margem consignável.

### 13.1 Glossário materializado — Sprint 2 (módulo de juros)

A Sprint 2 / F5 oficial materializou o **glossário mínimo do
módulo de juros** em `frontend/src/content/juros/glossario.ts`,
contendo as 8 entradas exigidas pelo PLANO Sprint 2 §5.5:

| slug              | termo            | módulo relacionado |
|-------------------|------------------|--------------------|
| juros             | Juros            | interest           |
| juros-simples     | Juros simples    | interest           |
| juros-compostos   | Juros compostos  | interest           |
| principal         | Principal        | interest           |
| taxa              | Taxa             | interest           |
| prazo             | Prazo            | interest           |
| montante          | Montante         | interest           |
| aporte            | Aporte           | interest           |

Cada entrada carrega `term`, `shortDefinition`, `fullDefinition`,
`example` e `relatedModule`, conforme §13. Os exemplos numéricos
referenciam a massa do Doc 15 (JS-01, JC-01, JC-03) — não há número
inventado.

Os outros termos previstos para o MVP (CET, IOF, TR, Selic, IPCA,
taxa real, etc.) cobrem módulos não construídos nesta sprint
(financiamentos, rotativo, atraso, indicadores) e ficam para
sprints subsequentes. Esta entrega **não declara o glossário do
MVP completo** — declara apenas o subset do módulo de juros.

### 13.2 Glossário materializado — Sprint 3 (módulo de amortização)

A Sprint 3 / F5 materializou o **conteúdo educacional do módulo de
amortização PRICE/SAC** em `frontend/src/content/amortizacao/`, com:

- blocos Nível 1 em `nivel-1.ts`;
- blocos Nível 2 em `nivel-2.ts`;
- glossário mínimo em `glossario.ts`;
- cuidados educacionais em `alertas.ts`;
- integração visível na página `/amortizacao` por
  `frontend/src/components/amortization/AmortizacaoSaibaMais.tsx`.

O glossário materializado contém as entradas que aparecem no formulário,
no resumo, na tabela e na comparação:

| slug              | termo                | módulo relacionado |
|-------------------|----------------------|--------------------|
| principal         | Principal            | amortization       |
| taxa-periodo      | Taxa por período     | amortization       |
| numero-periodos   | Número de períodos   | amortization       |
| parcela           | Parcela              | amortization       |
| juros             | Juros                | amortization       |
| amortizacao       | Amortização          | amortization       |
| saldo-devedor     | Saldo devedor        | amortization       |
| total-pago        | Total pago           | amortization       |
| total-juros       | Total de juros       | amortization       |
| saldo-final       | Saldo final          | amortization       |
| price             | PRICE                | amortization       |
| sac               | SAC                  | amortization       |

O conteúdo cobre: conceito de amortização, parcela, juros,
amortização, saldo devedor, total pago, total de juros, saldo final,
PRICE, SAC, comparação PRICE x SAC e cuidados ao comparar parcela
mensal com custo total.

As mensagens educacionais deixam explícito que a simulação é ilustrativa
e não substitui contrato real, análise profissional ou condições
efetivas de financiamento. Os exemplos numéricos referenciam os casos
canônicos PR-01 e SAC-01 do Doc 15.

## 14. FAQ
- Perguntas reais (extraídas da persona) com resposta direta.
- Linkar para módulo, glossário, Nível 2/3.
- Organizada por módulo + transversais (privacidade, isenção educacional).

## 15. Exemplos práticos e analogias
Usar cenários cotidianos: salário e contas do mês; comprar casa; comprar carro; pagar fatura; atrasar boleto; guardar dinheiro; rolar fatura; investir vs quitar.

## 16. Alertas educativos (geração)
Todo módulo que tenha alerta gerado deve ter regra explícita:
- gatilho (condição numérica ou regra de negócio);
- nível (`info`, `success`, `warning`, `danger`);
- texto (versionado);
- referência pedagógica (link para conteúdo).

Alertas não devem ser alarmistas; devem orientar.

## 17. Interpretação automática (regras)
Padrão por simulação:
- mensagem principal (1–2 frases);
- detalhes complementares (2–4 bullets curtos);
- alerta opcional;
- convite a explorar conteúdo relacionado.

Todo template de interpretação é versionado; mudança passa por revisão pedagógica.

## 18. Estratégia para MVP
Conteúdo mínimo obrigatório do MVP:
- introdução curta em cada módulo;
- explicação resumida dos conceitos centrais;
- interpretação automática básica;
- alertas educativos básicos;
- glossário inicial (≥ 25 termos);
- FAQ inicial (≥ 15 perguntas).

## 19. Métricas pedagógicas obrigatórias

### 19.1 Métricas de produto educacional
- **Taxa de conclusão de módulo** — % de usuários que vão da intro ao resultado.
- **Profundidade média de leitura** (Nível 1/2/3 acessados).
- **Taxa de engajamento com glossário** (cliques).
- **Tempo médio de interpretação** (proxy de leitura real, com cap).
- **Taxa de acionamento de FAQ** por sessão.
- **Taxa de acionamento de "explicar como foi calculado"** (revela curiosidade técnica).

### 19.2 Métricas qualitativas
- Sessões com usuários reais (uma a cada 2 sprints) com roteiro padronizado.
- Relato qualitativo de "consegui entender" (mini-survey opcional, sem PII).

### 19.3 Anti-métricas (alertas)
- **Bounce alto na intro** → introdução fraca.
- **Pico de FAQ "como funciona o cálculo"** → interpretação fraca.
- **Cliques em "isto é confuso"** (botão sentinela) → ação corretiva imediata.

## 20. Lint pedagógico (regras automatizáveis)
- Frase > 25 palavras → aviso.
- Sigla não-explicada na 1ª ocorrência do artefato → bloqueio.
- Termo sem entrada no glossário → aviso.
- Cor como único veiculador (ex.: "veja o gráfico vermelho") → aviso.
- Promessa de retorno (`"vai render X%"`) → bloqueio.
- Moralismo (`"é irresponsável"`) → bloqueio.
- Falta de aviso educacional em página de simulação → bloqueio.

Ferramenta: lint customizado em `tools/edu_lint/` (Python), executado em CI quando PR toca conteúdo.

> **Nota Sprint 2 — F5.** O subset determinístico de
> `tools/edu_lint/` foi materializado nesta sprint (regras de
> bloqueio para promessa de retorno, moralismo, placeholders e
> aviso educacional ausente). A implementação completa
> (frase > 25 palavras, sigla, glossário ativo, cor) permanece
> planejada para a **Sprint 7**, conforme roadmap e Gate Forense.
> A evidência operacional está em
> `docs/sprints/sprint-02/evidencias/F5-lint-pedagogico.md`.

## 21. Política para a Claude Code (operacional)
1. Toda PR que adicione/altere conteúdo passa pelo fluxo editorial (§7).
2. Todo termo novo entra no glossário.
3. Todo alerta novo tem regra de gatilho documentada.
4. Toda mudança de conteúdo bumpa versão (§8).
5. Mudança em conteúdo é registrada em Doc 19 (rastreabilidade).
6. PR sem aprovação editorial → bloqueio do agente de impacto.

## 22. Critérios de aceite deste documento
Aceito quando:
- persona, política editorial, métricas e fluxo estão claros;
- glossário e FAQ iniciais estão dimensionados;
- lint pedagógico está especificado;
- versionamento está formalizado;
- referências cruzadas (Docs 02, 03, 06, 16, 18) consistentes.
