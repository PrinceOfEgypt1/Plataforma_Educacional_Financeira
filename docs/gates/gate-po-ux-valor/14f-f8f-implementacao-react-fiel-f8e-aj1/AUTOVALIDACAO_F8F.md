# Autovalidação F8F-A

Logs literais e auditáveis dos comandos executados nesta rodada. Reprodutíveis
em qualquer ambiente que rode `pnpm` no diretório `frontend/`.

---

## 1. Estado da branch

```
$ git branch --show-current
claude/f8f-implementacao-react-fiel-f8e-aj1

$ git rev-parse --short origin/main
02c6085

$ git merge-base --short HEAD origin/main
02c6085
```

A branch foi criada a partir de `02c6085` (commit oficial do aceite visual
F8E-AJ1). Confirma o requisito 10.1 do prompt F8F.

## 2. Comandos pnpm em `frontend/`

### 2.1 `pnpm format:check`

```
> prettier --check .
All matched files use Prettier code style!
```

**Status:** OK

### 2.2 `pnpm lint`

```
> next lint && eslint . --ext .ts,.tsx
✔ No ESLint warnings or errors
```

**Status:** OK · 0 warnings · 0 errors

### 2.3 `pnpm typecheck`

```
> tsc --noEmit
(saída vazia = sucesso)
```

> **Histórico**: a primeira execução do typecheck no commit `4c2d60a` falhou com
> TS2352/TS2493/TS2339 por mocks insuficientes em
> `RealEstateF8FObservatory.test.tsx`. Correção forense aplicada em commit
> subsequente: (a) factories tipadas completas para `FinanciamentoImobOut`
> (`summary` + `parcelas` + `inputs_normalizados` + `anatomia_encargo` +
> `componentes_cet` + `memoria_calculo` + `formulas_usadas` +
> `explicacoes_pedagogicas` + `alertas` + `fontes` + `limites` +
> `metadados_calculo` + `mensagens_interface` + `chart_data`), sem `as`
> mascarador; (b) `MockedFunction<typeof simularFinanciamentoImobiliario>` /
> `MockedFunction<typeof compararFinanciamentos>` para tipar `vi.fn()`
> propriamente (vitest 1.6); (c) `mockResolvedValue` / `mockRejectedValue`
> em vez de implementações com parâmetros não usados; (d)
> `Object.defineProperty(window, "scrollTo", { value: vi.fn(), ... })` no
> `beforeEach` para silenciar o "not implemented" do JSDOM sem remover a
> chamada útil ao usuário.

**Status:** OK · 0 erros TypeScript

### 2.4 `pnpm test`

```
Test Files  50 passed (50)
     Tests  472 passed (472)
  Duration  33.28s
```

> **AJ2**: subiu de 469 → 472 (3 testes novos cobrindo: ausência do banner de
> governança na UI, NavFooter sempre montado fora do scroll, `f8f-scroll-area`
> com `overflowY:auto`/`overflowX:hidden`, e `f8f-checklist-contratar` com
> `data-columns="2"` na Etapa 7.2).

**Status:** OK · 469/469 testes passando, **inclusive**:
- `src/__tests__/app/financiamento-imobiliario.test.tsx` (68 testes do cockpit antigo) — preservados
- `src/__tests__/components/financing/RealEstateF8FObservatory.test.tsx` (10 testes novos do shell F8F-A)
- `src/__tests__/app/routes.test.tsx` (validação de todas as rotas)

### 2.5 `pnpm build`

```
✓ Generating static pages (16/16)
Route (app)                              Size     First Load JS
├ ○ /financiamento-imobiliario           23.2 kB         239 kB
```

**Status:** OK · build estático passando, rota `/financiamento-imobiliario`
empacotada sem erros.

## 3. Greps bloqueantes

### 3.1 Símbolo Unicode `×` em SAC/PRICE — arquivos modificados pela F8F-A

```bash
git diff --name-only origin/main..HEAD \
  | grep -E '\.(tsx?|jsx?)$' \
  | xargs grep -n -E 'SAC ×|× SAC|PRICE ×|× PRICE' 2>/dev/null
```

**Resultado:** (saída vazia) · **0 ocorrências**.

⚠ Os 10 pré-existentes em `main` (`FinanciamentoCompareChart.tsx`,
`RealEstateCompareChart.tsx`, `AmortizationCockpit.tsx`,
`CockpitCharts.tsx`, `RealEstateSourcesPanel.tsx`,
`RealEstateNextStepsZone.tsx`) **não foram tocados** pela F8F-A. Limpeza
global é trabalho de frente separada — registrado em `RELATORIO §8.1`.

### 3.2 Termos provisórios — arquivos modificados pela F8F-A

```bash
git diff --name-only origin/main..HEAD \
  | grep -E '\.(tsx?|jsx?|md|ts)$' \
  | xargs grep -n -E 'TODO|FIXME|lorem ipsum|placeholder|mock estático|a definir' 2>/dev/null
```

**Resultado:** (saída vazia) · **0 ocorrências**.

### 3.3 Escopo proibido (backend/infra/docker/tools/scripts)

```bash
git diff --name-only origin/main..HEAD \
  | grep -E '^(backend|infra|docker|tools|scripts)/'
```

**Resultado:** (saída vazia) · **0 arquivos** alterados nesses diretórios.

## 4. Diff resumido

```
$ git diff --stat origin/main..HEAD
```

Arquivos sob `frontend/`:
- `src/app/(app)/financiamento-imobiliario/page.tsx` (alterado)
- `src/components/financing/realEstateF8F/RealEstateF8FObservatory.tsx` (novo)
- `src/components/financing/realEstateF8F/elements.tsx` (novo)
- `src/components/financing/realEstateF8F/tokens.ts` (novo)
- `src/__tests__/components/financing/RealEstateF8FObservatory.test.tsx` (novo)

Arquivos sob `docs/`:
- `docs/gates/gate-po-ux-valor/14f-f8f-implementacao-react-fiel-f8e-aj1/README_ITEM_14F_F8F.md` (novo)
- `docs/gates/gate-po-ux-valor/14f-f8f-implementacao-react-fiel-f8e-aj1/RELATORIO_IMPLEMENTACAO_REACT_F8F.md` (novo)
- `docs/gates/gate-po-ux-valor/14f-f8f-implementacao-react-fiel-f8e-aj1/MATRIZ_FIDELIDADE_VISUAL_F8E_AJ1.md` (novo)
- `docs/gates/gate-po-ux-valor/14f-f8f-implementacao-react-fiel-f8e-aj1/AUTOVALIDACAO_F8F.md` (novo, este arquivo)
- `docs/gates/gate-po-ux-valor/14f-f8f-implementacao-react-fiel-f8e-aj1/EVIDENCIAS_VISUAIS_F8F.md` (novo)
- `docs/00_INDICE_GERAL.md` (atualizado com link F8F)
- `docs/_meta/living_docs.json` (atualizado)

## 5. Scripts de governança opcionais

### 5.1 `node scripts/governance/validate-observatory-cards.mjs`

```
[SKIP JUSTIFICADO] script inexistente nesta main.
```

### 5.2 `node scripts/governance/validate-spec.mjs`

```
[SKIP JUSTIFICADO] script inexistente nesta main.
```

A pasta `scripts/governance/` não existe em `02c6085`. Os scripts citados no
prompt F8F são planejados para frentes futuras; nesta rodada são SKIP
justificado conforme item 10.2 do prompt.

## 6. Resumo binário

| Check | Resultado |
|---|---|
| Branch limpa a partir de `02c6085` | OK |
| `pnpm format:check` | OK |
| `pnpm lint` | OK |
| `pnpm typecheck` | OK |
| `pnpm test` (472/472 após AJ2) | OK |
| `pnpm build` | OK |
| Grep `×` em SAC/PRICE no diff | OK (0 ocorrências) |
| Grep termos provisórios no diff | OK (0 ocorrências) |
| Diff fora de frontend/docs | OK (0 arquivos) |
| Implementação React fiel ao F8E-AJ1 | OK (matriz: 63 PASS / 7 PARCIAL / 0 FAIL) |
| Integração real com backend | OK (sem motor paralelo) |
| Backend/API/fórmulas inalterados | OK |
| PR aberto | OK (PR #73 draft, sem merge) |
| Sprint 5 liberada | NÃO |
| Aceite visual humano declarado | NÃO (depende do PO) |

**STATUS GLOBAL F8F-A: PASS técnico · aguarda auditoria humana**

---

## 7. Rodada AJ2 — correção visual curta e bloqueante

Em 2026-05-28, auditoria visual do PR #73 sinalizou 5 problemas. Correções
aplicadas cirurgicamente:

| # | Problema | Correção |
|---|---|---|
| 1 | Botões Anterior/Próxima cortados em zoom 100% nas Etapas 1, 4, 5.2, 5.3 | Reestrutura do shell em flex column: topo fixo (TopBar + Stepper + SubTabs) + área central scrollável (`f8f-scroll-area` com `overflow:auto`) + NavFooter fixo no rodapé visual (`flexShrink: 0`). Sticky removido dos blocos de topo (desnecessário no novo layout). |
| 2 | Tabelas densas (5.2/5.3) empurram a navegação para fora | Resolvido pelo scroll interno da área central. As tabelas paginadas (`RealEstateFinancingTable`, 12 linhas/página) cabem sem provocar scroll global; o `overflowY:auto` da área central cuida do resto. Sem scroll horizontal. |
| 3 | Card "Aviso de governança" atrapalha em todas as telas | Componente `GovernanceBanner` removido completamente da UI. Toda a informação de governança (fase, integração real, aceite humano pendente, Sprint 5 não liberada) permanece na documentação F8F (este diretório). |
| 4 | Tabela 6.3 (Variáveis) sem distribuição visual coerente | `tableLayout: fixed` + `<colgroup>` com larguras explícitas (110px / auto / 210px). Cabeçalhos: Símbolo centralizado, Descrição à esquerda, Valor à direita. Cabeçalhos e células espelham o mesmo alinhamento por coluna. |
| 5 | Card "Checklist antes de contratar" (7.2) alto demais | `ChecklistCard` ganha prop `columns?: 1 \| 2`. Quando `columns={2}`, os 10 itens são divididos ao meio em duas colunas separadas por borda vertical, com altura reduzida. Aplicado à Etapa 7.2. |

### 7.1 Testes adicionados na AJ2

- `não exibe mais o card 'Aviso de governança' na UI (F8F-AJ2 §3)`
- `NavFooter (Anterior/Próxima) está sempre montado fora do scroll central`
- `área central possui scroll interno (F8F-AJ2 §1, §2)`
- `checklist da Etapa 7.2 renderiza em 2 colunas (F8F-AJ2 §5)`

### 7.2 Validações pós-AJ2 (todas em `frontend/`)

| Comando | Resultado |
|---|---|
| `pnpm format:check` | OK |
| `pnpm lint` | OK · 0 warnings |
| `pnpm typecheck` | OK |
| `pnpm test` | **472/472 PASS** (3 novos da AJ2; teste antigo do banner foi substituído) |
| `pnpm build` | OK · `/financiamento-imobiliario` 23.1 kB / 239 kB |

### 7.3 Governança AJ2

- PR #73 continua **DRAFT**.
- `main` segue intacta em `02c6085`.
- F8F-B continua pendente.
- Aceite visual humano continua pendente.
- Sprint 5 continua bloqueada.
- Backend/API/fórmulas/infra/docker/tools/scripts: 0 arquivos alterados na AJ2.

---

## 8. Rodada AJ3 — pendência textual bloqueante (BLOCO 23A)

Auditoria de Camaleão (BLOCO 23A) identificou em
`frontend/src/components/financing/realEstateF8F/RealEstateF8FObservatory.tsx:2638`
a frase técnica desalinhada com a linguagem educacional do produto:

- **Antes (UI):** "Como o backend chegou a esses números"
- **Depois (UI):** "Como a aplicação chegou a esses números"

A frase aparece no `CardTitle` da Etapa 6.4 (Passo a Passo).

### 8.1 Antirregressão

Novo teste adicionado em `RealEstateF8FObservatory.test.tsx`:

```
it("Etapa 6.4 Passo a Passo usa 'aplicação' (F8F-AJ3)", async () => { ... })
```

Verifica explicitamente:

- `getByText(/Como a aplicação chegou a esses números/i)` — presente.
- `queryByText(/Como o backend chegou a esses números/i)` — **ausente**.

### 8.2 Greps de comprovação

```
$ grep -RIn "Como o backend chegou a esses números" frontend/src/components/
(nenhum resultado)

$ grep -RIn "Como a aplicação chegou a esses números" frontend/src/components/
frontend/src/components/financing/realEstateF8F/RealEstateF8FObservatory.tsx:2638
```

A única ocorrência da frase antiga em `frontend/src/__tests__/` é dentro de
`screen.queryByText(...)` no teste de antirregressão (verifica AUSÊNCIA no
DOM, não presença textual no produto).

### 8.3 Validações pós-AJ3 (em `frontend/`)

| Comando | Resultado |
|---|---|
| `pnpm format:check` | OK |
| `pnpm lint` | OK · 0 warnings |
| `pnpm typecheck` | OK |
| `pnpm test` | **473/473 PASS** (era 472; +1 antirregressão AJ3) |
| `pnpm build` | OK · `/financiamento-imobiliario` 23.1 kB / 239 kB |

### 8.4 Governança AJ3

- PR #73 continua **DRAFT**.
- `origin/main` segue intacta em `02c6085`.
- Backend / API / fórmulas / contratos / infra / docker / tools / scripts: **0 arquivos alterados**.
- Aceite visual humano: **não declarado**.
- Sprint 5: **não liberada**.
- F8F-B: continua pendente.
