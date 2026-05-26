# README — Item 14F-F8D: Implementação React Observatory Dark Cards

**Gate:** PO / UX / Valor
**Item:** 14F-F8D
**Status:** Implementado — pendente aceite visual humano
**Branch:** `claude/kind-gauss-5I5fw`
**Data:** 2026-05-26

---

## Escopo

Implementação React governada pelos contratos:
- **F8C-v6.2** — Especificação Visual Determinística do módulo Imóvel
- **F8C-v6.3** — Adendo Visual Observatory Dark Cards

A implementação traduz os contratos visuais para código React real,
sem alterar backend, API, fórmulas financeiras ou lógica de domínio.

---

## Arquivos criados / alterados

### Novos

| Arquivo | Papel |
|---------|-------|
| `frontend/src/components/financing/ObservatoryDarkCards.tsx` | Biblioteca de 7 UI primitivos F8C-v6.3 |
| `frontend/src/__tests__/components/financing/ObservatoryDarkCards.test.tsx` | 34 testes dos 7 primitivos |
| `docs/gates/gate-po-ux-valor/14f-f8d-implementacao-react-observatory-dark-cards/` | Esta pasta documental |

### Alterados

| Arquivo | Mudança |
|---------|---------|
| `frontend/src/app/layout.tsx` | Adicionado DM Sans + DM Mono via `next/font/google` |
| `frontend/src/components/financing/RealEstateObservatoryShell.tsx` | Brand label usa DM Mono via inline style |
| `frontend/src/components/financing/RealEstateSummaryZone.tsx` | Refatorado para usar ScoreCard + InsightBox Observatory |
| `frontend/src/components/financing/FinanciamentoCockpit.tsx` | Corrigido SAC × PRICE → SAC x PRICE; adicionado BeforeAfterCard no ComparePanel; adicionado QuestionCard + InsightBox na HomeView |

---

## UI Elements utilizados por etapa

| Etapa | UI Element | Localização |
|-------|-----------|-------------|
| Preparar (HomeView) | QuestionCard × 3 | `FinanciamentoCockpit.tsx` — HomeView |
| Preparar (HomeView) | InsightBox | `FinanciamentoCockpit.tsx` — HomeView |
| Resultado (SummaryZone) | ScoreCard × 6 | `RealEstateSummaryZone.tsx` |
| Resultado (SummaryZone) | ObsScoreGrid | `RealEstateSummaryZone.tsx` |
| Resultado (SummaryZone) | InsightBox | `RealEstateSummaryZone.tsx` |
| Comparar (ComparePanel) | BeforeAfterCard | `FinanciamentoCockpit.tsx` — ComparePanel |

---

## Invariantes preservados

- Backend não alterado
- API não alterada
- Fórmulas financeiras não alteradas
- Domínio SAC/PRICE não alterado
- Integração real com API/tipos/serviços preservada
- Testes existentes: 459 → 493 (34 novos, nenhum removido)
- Nomenclatura: "SAC x PRICE" (x minúsculo, não ×)

---

## Aceite visual

O aceite visual humano (Moisés) é obrigatório e não foi declarado por IA.
Cf. `CONTRATO_VISUAL_IMOVEL_V6_3.json` → `ia_pode_declarar_aprovado: false`.
