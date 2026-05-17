# PEF — Scorecard Oficial UI/UX e Jornada do Usuário

## 1. Finalidade

Este scorecard define como avaliar objetivamente a qualidade frontend/UI/UX de módulos da Plataforma Educacional Financeira.

O scorecard deve ser usado em auditorias manuais curtas, auditorias automatizadas e decisões de aceite PO/UX.

## 2. Escala de nota

Cada critério recebe nota de 0 a 10.

| Nota | Significado |
|---:|---|
| 0 | Ausente, inexistente ou quebrado. |
| 1-3 | Muito fraco, confuso ou incompatível com o padrão. |
| 4-5 | Parcial, mas insuficiente para aceite. |
| 6 | Aceitável tecnicamente, mas fraco em qualidade percebida. |
| 7 | Bom, com ressalvas. |
| 8 | Muito bom e aceitável para produção. |
| 9 | Excelente. |
| 10 | Referência de qualidade para outros módulos. |

## 3. Critérios avaliados

| Código | Critério | Peso | Nota mínima |
|---|---|---:|---:|
| SC-JOURNEY | Jornada do usuário | 2 | 8 |
| SC-CLARITY | Clareza e compreensão imediata | 2 | 8 |
| SC-HIERARCHY | Hierarquia visual | 2 | 8 |
| SC-CTA | Coerência de CTAs, cards e destinos | 2 | 8 |
| SC-PEDAGOGY | Valor pedagógico | 2 | 8 |
| SC-FIN-AUDIT | Auditabilidade financeira | 2 | 8 |
| SC-TABLE | Tabelas financeiras | 1 | 7 |
| SC-CHART | Gráficos financeiros | 1 | 7 |
| SC-STATES | Estados loading/error/empty/success | 1 | 7 |
| SC-A11Y | Acessibilidade | 2 | 8 |
| SC-MOBILE | Responsividade | 2 | 8 |
| SC-CONSISTENCY | Consistência com design system | 1 | 7 |
| SC-PERFORMANCE | Performance percebida | 1 | 7 |
| SC-MAINTAINABILITY | Manutenibilidade frontend | 1 | 7 |

## 4. Cálculo da nota ponderada

A nota geral é calculada pela média ponderada.

Critérios com peso 2 representam áreas críticas para o produto educacional financeiro.

## 5. Critérios de aprovação

Um módulo só pode ser aprovado se atender simultaneamente:

```txt
Nota geral >= 8,0
Nenhum critério com peso 2 abaixo de 8
Nenhum critério com peso 1 abaixo de 7
Nenhum bloqueador aberto
Nenhuma violação de rejeição automática
```

## 6. Decisões possíveis

| Decisão | Condição |
|---|---|
| Aprovado | Atende todos os critérios mínimos e não possui bloqueadores. |
| Aprovado com ressalvas | Apenas problemas baixos ou médios, sem violação crítica e com aceite explícito do PO. |
| Reprovado | Nota insuficiente, bloqueador aberto ou violação de rejeição automática. |

## 7. Bloqueadores automáticos

Independente da nota, reprova automaticamente:

1. CTA que não cumpre a promessa do rótulo.
2. Botões/cards distintos levando ao mesmo destino sem justificativa.
3. Jornada principal confusa ou inexistente.
4. Resultado financeiro sem caminho para memória de cálculo.
5. Duplicação de informação que compromete compreensão.
6. Mobile inutilizável.
7. Estado de erro ausente em fluxo assíncrono crítico.
8. Texto temporário ou mojibake materializado.
9. Componente legado tratado como ativo quando gera conflito de comportamento ou teste.
10. Falha crítica de acessibilidade em ação principal.

## 8. Registro de avaliação

Toda avaliação deve registrar:

```txt
Módulo:
Rota:
Branch:
Commit:
Data:
Avaliador:
Critérios avaliados:
Nota por critério:
Bloqueadores:
Decisão final:
```

## 9. Relação com auditor automático

O auditor automático deve emitir códigos de erro vinculados aos critérios deste scorecard. A correção deve ser orientada pelo ID do erro, não por descrição genérica.
