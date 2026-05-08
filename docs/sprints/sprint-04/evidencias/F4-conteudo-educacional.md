# F4 — Conteúdo Educacional

## Arquivos de conteúdo criados

```
frontend/src/content/diagnostico/
  types.ts        ← tipos: EducationalContent, GlossaryEntry, AlertEducationalContent, DISCLAIMER_DIAGNOSTICO
  nivel-1.ts      ← 5 blocos nível essencial
  nivel-2.ts      ← 5 blocos nível intermediário
  glossario.ts    ← 12 termos obrigatórios
  alertas.ts      ← 6 alertas educacionais + getAlertaEducacional()
  index.ts        ← re-exports
```

## Sumário — Nível 1 (Essencial)

| Slug | Título |
|------|--------|
| `diagnostico-financeiro` | Diagnóstico financeiro — o que é e para que serve |
| `despesas-fixas-variaveis` | Despesas fixas e variáveis — por que separar |
| `dividas-mensais` | Dívidas mensais — comprometimento de renda |
| `reserva-emergencia` | Reserva de emergência — meses de proteção |
| `sobra-saude-financeira` | Sobra mensal e saúde financeira — como ler o resultado |

**Conteúdo cobre:** o que é diagnóstico financeiro, por que renda sozinha não mostra saúde, o que são despesas fixas, o que são despesas variáveis, o que são dívidas mensais, o que é reserva de emergência, o que é sobra mensal, o que é comprometimento de renda, o que significa cada nível de saúde financeira.

## Sumário — Nível 2 (Intermediário)

| Slug | Título |
|------|--------|
| `diagnostico-financeiro` | Renda, despesas, dívidas e reserva — como se relacionam |
| `dividas-mensais` | Por que dívida mensal alta pressiona o orçamento |
| `reserva-emergencia` | Por que reserva em meses é mais intuitiva que apenas valor em reais |
| `despesas-fixas-variaveis` | Diferença entre ganhar bem e ter equilíbrio financeiro |
| `sobra-saude-financeira` | Como interpretar score e alertas sem transformar em recomendação |

**Conteúdo cobre:** relação entre renda/despesas/dívidas/reserva, dívida alta como pressão do orçamento, reserva em meses vs valor absoluto em reais, "ganhar bem" ≠ equilíbrio, score e alertas sem recomendação individualizada.

## Glossário (12 termos obrigatórios)

| Slug | Termo |
|------|-------|
| `renda-mensal` | Renda mensal |
| `despesa-fixa` | Despesa fixa |
| `despesa-variavel` | Despesa variável |
| `divida-mensal` | Dívida mensal |
| `reserva-emergencia` | Reserva de emergência |
| `sobra-mensal` | Sobra mensal |
| `comprometimento-renda` | Comprometimento de renda |
| `score-financeiro` | Score financeiro |
| `alerta-critico` | Alerta crítico |
| `alerta-atencao` | Alerta de atenção |
| `saude-financeira` | Saúde financeira |
| `diagnostico-financeiro` | Diagnóstico financeiro |

Cada termo contém: slug, term, shortDefinition, fullDefinition, example, relatedModule: "diagnostic".

## Alertas Educacionais (6 códigos do backend)

| Código | Nível | Título |
|--------|-------|--------|
| `COMPROMETIMENTO_CRITICO` | critical | Comprometimento de renda crítico |
| `COMPROMETIMENTO_ALTO` | warning | Comprometimento de renda elevado |
| `RESERVA_CRITICA` | critical | Reserva de emergência crítica |
| `RESERVA_INSUFICIENTE` | warning | Reserva de emergência insuficiente |
| `SOBRA_NEGATIVA` | critical | Despesas superam a renda |
| `SOBRA_MINIMA` | warning | Sobra mensal mínima |

Cada alerta contém: code, title, explanation, whyItMatters, pedagogicalNote.

## Aviso Educacional (DISCLAIMER_DIAGNOSTICO)

```
"Este diagnóstico é educacional. Ele ajuda você a entender sinais da sua
vida financeira, mas não substitui análise profissional nem garante
resultado financeiro."
```

## Prova de ausência de promessa financeira

O lint pedagógico executado confirma:

```
edu_lint: 17 arquivo(s) analisado(s)
edu_lint: 0 bloqueio(s), 0 aviso(s)
```

O corpus de conteúdo não contém:
- "garantido", "garantimos", "retorno garantido", "rendimento garantido"
- "você deve", "você deveria", "recomendamos"
- "placeholder", "TODO", "FIXME", "em breve"
- Qualquer forma de recomendação financeira individualizada

Prova real: 293 testes passando, incluindo suite de lint pedagógico no `conteudo.test.ts`.
