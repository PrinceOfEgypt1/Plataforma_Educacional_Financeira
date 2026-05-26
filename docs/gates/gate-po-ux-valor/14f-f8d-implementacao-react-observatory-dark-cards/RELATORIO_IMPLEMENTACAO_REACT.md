# Relatório de Implementação React — F8D

**Item:** 14F-F8D
**Data:** 2026-05-26
**Branch:** `claude/kind-gauss-5I5fw`

---

## 1. Fontes DM Sans + DM Mono

Adicionadas em `frontend/src/app/layout.tsx` via `next/font/google`:

```tsx
import { DM_Mono, DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});
```

CSS variables disponíveis globalmente: `--font-dm-sans`, `--font-dm-mono`.
Aplicadas em `ObservatoryDarkCards.tsx` via constantes:

```tsx
const DM_SANS = "var(--font-dm-sans), 'DM Sans', sans-serif";
const DM_MONO = "var(--font-dm-mono), 'DM Mono', monospace";
```

---

## 2. ObservatoryDarkCards.tsx — 7 UI primitivos

Arquivo criado com todos os 7 UI Elements do contrato F8C-v6.3:

| UI Element | Exports |
|-----------|---------|
| ScoreCard | `ScoreCard`, `ScoreCardProps` |
| MetricCard | `MetricCard`, `MetricCard Props`, `MetricRow` |
| ChecklistCard | `ChecklistCard`, `ChecklistCardProps`, `ChecklistRow` |
| BeforeAfterCard | `BeforeAfterCard`, `BeforeAfterCardProps`, `BeforeAfterSide` |
| QuestionCard | `QuestionCard`, `QuestionCardProps` |
| InsightBox | `InsightBox`, `InsightStrong`, `InsightBoxProps` |
| ApplyCard | `ApplyCard`, `ApplyCardProps` |
| Grids | `ObsScoreGrid`, `ObsTaskGrid`, `ObsQGrid`, `ObsApplyGrid` |
| Token palette | `OBS` |

Todos os valores de token são inline, extraídos do `guia-prompt-checklist.html`.
Sem dependência de Tailwind custom colors.

---

## 3. Correção SAC × PRICE → SAC x PRICE

Arquivo: `FinanciamentoCockpit.tsx`, linha 1340 (antes da correção).
Bug: título do ComparePanel usava `×` (U+00D7, multiplicação Unicode).
Correção: substituído por `x` minúsculo conforme contrato F8C-v6.3.

---

## 4. BeforeAfterCard no ComparePanel

Adicionado após `RealEstateCompareChart` no `ComparePanel`:

- Lado esquerdo (PRICE): 1ª parcela, última, total juros, total pago
- Lado direito (SAC): mesmas métricas
- `testId="compare-before-after-card"`
- Dados dinâmicos vindos de `compare.price.summary` e `compare.sac.summary`

---

## 5. QuestionCard + InsightBox na HomeView

Três QuestionCards adicionados antes do grid de FeatureCards:
1. "Qual valor de imóvel é compatível com sua renda mensal?" (`home-question-card-renda`)
2. "SAC ou PRICE — qual sistema faz mais sentido para o seu perfil?" (`home-question-card-sistema`)
3. "Quanto de entrada você tem disponível hoje?" (`home-question-card-entrada`)

InsightBox pedagógico: aviso de uso exclusivamente educacional.

---

## 6. RealEstateSummaryZone refatorado

Substituídos os componentes locais `MetricHero` / `MetricCard` por:
- `ObsScoreGrid` + `ScoreCard` × 3 (principal: primeira parcela, total juros, total pago)
- `InsightBox` (pedagógico, substitui bloco "Leitura rápida do cenário")
- `ScoreCard` × 3 adicionais (última parcela, prazo, total amortizado)

Os dados vêm de `summary` conforme antes — sem alteração de fonte de dados.

---

## 7. Gate de qualidade

| Gate | Status | Evidência |
|------|--------|-----------|
| format:check | PASS | 0 arquivos com diff |
| lint | PASS | ✔ No ESLint warnings or errors |
| typecheck | PASS | 0 erros |
| test | PASS | 493/493 (50 test files) |
| validate-observatory-cards.mjs | PASS | 86/86 checks |
| validate-spec.mjs (F8C-v6.2) | PASS | 0 falhas estruturais |

---

## 8. Limitações desta entrega

- Aceite visual humano: **não declarado** (obrigação do PO)
- `ChecklistCard` e `ApplyCard` criados e testados, integração futura sob demanda do PO
- UI testável em browser após `pnpm dev` — verificação visual humana obrigatória
