# F3 — Frontend Cockpit — Diagnóstico Financeiro

## Arquivos criados/alterados

### Criados (novos)
```
frontend/src/types/diagnostic.ts
frontend/src/services/diagnostic/diagnosticoService.ts
frontend/src/services/diagnostic/index.ts
frontend/src/components/diagnostic/DiagnosticoCockpit.tsx
frontend/src/components/diagnostic/DiagnosticoForm.tsx
frontend/src/components/diagnostic/DiagnosticoSummary.tsx
frontend/src/components/diagnostic/DiagnosticoAlerts.tsx
frontend/src/components/diagnostic/DiagnosticoInterpretation.tsx
frontend/src/components/diagnostic/formValidation.ts
frontend/src/components/diagnostic/index.ts
frontend/src/__tests__/app/diagnostico.test.tsx
frontend/src/__tests__/services/diagnostic/diagnosticoService.test.ts
frontend/src/__tests__/components/diagnostic/DiagnosticoForm.test.tsx
frontend/src/__tests__/components/diagnostic/DiagnosticoSummary.test.tsx
frontend/src/__tests__/components/diagnostic/DiagnosticoAlerts.test.tsx
docs/sprints/sprint-04/evidencias/F3-git-baseline.md
docs/sprints/sprint-04/evidencias/F3-frontend-cockpit.md
docs/sprints/sprint-04/evidencias/F3-testes-frontend.md
docs/sprints/sprint-04/evidencias/F3-runtime.md
docs/sprints/sprint-04/evidencias/F3-impact-agent.md
```

### Alterados (modificações mínimas)
```
frontend/src/app/(app)/diagnostico/page.tsx   ← stub substituído por página real
frontend/src/config/modules.ts                ← diagnostico: "em-construcao" → "disponivel"
```

---

## Arquitetura de componentes

```
DiagnosticoCockpit.tsx          (estado global: idle | loading | ok | error)
├── DiagnosticoForm.tsx         (formulário com 5 campos, validação local, submit)
├── DiagnosticoSummary.tsx      (KPI cards: score, sobra, comprometimento, reserva, despesas)
├── DiagnosticoAlerts.tsx       (alertas retornados pela API com severidade visual)
└── DiagnosticoInterpretation.tsx (interpretação educacional baseada em saude_nivel)

formValidation.ts               (validação tipada dos 5 campos, sem lógica financeira)
```

**Separação de responsabilidades mantida:**
- `page.tsx`: mínimo — apenas metadata e `<DiagnosticoCockpit />`
- `DiagnosticoCockpit`: estado async, sem JSX de resultado embutido
- `DiagnosticoForm`: apenas formulário, sem lógica de exibição de resultado
- `DiagnosticoSummary`: apenas renderização dos KPIs vindos da API
- `DiagnosticoAlerts`: apenas mapeamento de `alert.level` → AlertLevel visual
- `DiagnosticoInterpretation`: textos educacionais baseados em enum `saude_nivel`
- `formValidation.ts`: validação local (campos vazios, negativos, renda ≤ 0)
- `diagnosticoService.ts`: apenas HTTP + desembrulho do envelope + normalização de erro

---

## Prova de que /diagnostico não é mais stub

**Antes (stub):**
```tsx
import { ModulePage, buildModuleMetadata } from "@/components/shell/ModulePage";
export default function Page() {
  return <ModulePage moduleId="diagnostico" />;
}
```
Gerava rota com **162 B** de First Load JS.

**Depois (F3):**
```tsx
import { DiagnosticoCockpit } from "@/components/diagnostic/DiagnosticoCockpit";
export default function DiagnosticoPage() {
  return (<><h1 className="sr-only">...</h1><DiagnosticoCockpit /></>);
}
```
Gera rota com **5.78 kB** de First Load JS — confirmado no build.

**Teste que prova:** `diagnostico.test.tsx > não exibe texto de stub 'em construção'`
```
screen.queryByText(/em construção/i) → null ✓
screen.queryByText(/em breve/i)       → null ✓
screen.getByTestId("diagnostico-cockpit") → presente ✓
```

---

## Justificativa de reutilização do Financial Cockpit

Componentes reutilizados do sistema de design existente:
- `CockpitGrid`, `CockpitInputPanel`, `CockpitField`, `CockpitButton` — primitivos do cockpit
- `AlertBanner` — faixa de alerta padronizada
- `SummaryCard` — card de KPI com trend e hint
- `formatBRL` de `@/lib/money` — formatação monetária para exibição

Sem criação de abstração horizontal nova. Fatia vertical estrita.

---

## Declaração explícita: ausência de lógica financeira crítica no frontend

O frontend da F3 **NÃO** calcula:
- score
- saude_nivel
- comprometimento_percentual
- sobra_mensal
- reserva_em_meses
- pontos por dimensão
- qualquer threshold financeiro

Todos esses valores vêm exclusivamente de `POST /api/v1/diagnostic/analyze`.

O frontend apenas:
- valida campos vazios, negativos ou renda ≤ 0 (validação de formulário, não financeira)
- formata strings decimais vindas da API com `formatBRL` e `toLocaleString` para exibição
- mapeia enums `saude_nivel`, `comprometimento_nivel` etc. em labels PT-BR e `SummaryCardTrend`
- exibe textos educacionais baseados em enum (texto fixo por nível, não calculado)

Conformidade com ADR-0004 comprovada. Verificável pelo auditor lendo:
- `DiagnosticoCockpit.tsx`: zero operações aritméticas
- `DiagnosticoSummary.tsx`: zero cálculos, apenas formatação
- `DiagnosticoAlerts.tsx`: zero cálculos, apenas mapeamento de código para label
- `formValidation.ts`: apenas validação de formulário (campo vazio, negativo, zero)
