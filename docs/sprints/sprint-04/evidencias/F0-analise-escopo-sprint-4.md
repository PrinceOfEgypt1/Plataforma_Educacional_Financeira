# F0 — Análise de Escopo — Sprint 4

Data: 2026-05-06
Branch: sprint-4/f0-plano-execucao-claude
Commit base: c645138

---

## 1. Metodologia de análise

Esta análise é baseada exclusivamente em:
- código real do repositório (inventário F0-inventario-base.md);
- documentação versionada lida nesta rodada;
- histórico de PRs auditado (F0-git-baseline.md).

Separação rigorosa entre FATO, INFERÊNCIA e LIMITAÇÃO.

---

## 2. Estado herdado da Sprint 3.5

FATO: Sprint 3.5 encerrada e validada no commit c645138 (PR #22).
FATO: Módulos /juros e /amortizacao implementados com Financial Cockpit completo.
FATO: Infraestrutura de cockpit (FinancialCockpitShell, CockpitCharts, CockpitModal, CockpitPrimitives, CockpitTables) disponível e testada.
FATO: Padrão de vertical slice estabelecido: domain → service → API → frontend → content → docs.
FATO: Pipeline oficial verde na Sprint 3.5/F3.
FATO: 10 domínios backend são stubs vazios; 10 rotas frontend são stubs "em breve".
FATO: Nenhum módulo além de juros e amortização tem implementação real em código.

---

## 3. Candidatos ao escopo da Sprint 4

Baseado no Doc 10 §5 Fase 3 e Doc 19 (Matriz de Rastreabilidade):

| Candidato | REQ-ID | Doc 10 ref | Dependências |
| --- | --- | --- | --- |
| Diagnóstico Financeiro | RF-DIAG-* (pendente criação) | Fase 3 — 1º listado | Nenhuma: domínio independente |
| Financiamento Imobiliário | RF-FIN-001 | Fase 3 | Requer PRICE/SAC (já feito) |
| Financiamento de Veículo | RF-FIN-002 | Fase 3 | Requer PRICE/SAC (já feito) |
| Consignado | RF-LOA-001 | Fase 3 | Independente |
| CDC | RF-LOA-002 | Fase 3 | Independente |
| Cartão Rotativo | RF-CC-001 | Fase 3 | Independente |
| Parcela em Atraso | RF-LP-001 | Fase 3 | Independente |
| Indicadores | RF-IND-001 | Fase 3 | Requer dados externos (Selic, IPCA, etc.) |
| Investir vs Quitar | RF-IVQ-001 | Fase 6 (pós-MVP) | Requer juros e amortização (já feito) |

---

## 4. Análise comparativa dos candidatos

### 4.1 Diagnóstico Financeiro

FATO: listado primeiro na Fase 3 do Doc 10 §5.
FATO: Doc 08 §12.1 especifica conteúdo educacional mínimo (saúde financeira, comprometimento de renda, reserva de emergência, sobra mensal).
FATO: stub `/diagnostico` já existe no frontend.
FATO: stub `backend/app/domain/diagnostic/` já existe.
INFERÊNCIA: é o módulo de entrada lógica do produto — o usuário deve diagnosticar sua saúde financeira antes de simular juros ou financiamentos.
INFERÊNCIA: domínio puro independente (não requer dados externos nem outros módulos já implementados).
INFERÊNCIA: alinha com o princípio editorial "educação integrada ao uso" (Doc 08 §5 item 7).
INFERÊNCIA: as regras de negócio (comprometimento de renda ≤ 30%, reserva de emergência ≥ 3–6 meses, sobra mensal) são auditáveis no Doc 03.

### 4.2 Financiamentos (Imobiliário e Veículo)

INFERÊNCIA: candidatos fortes para Sprint 5. Dependem de PRICE/SAC (já prontos). Escopo maior que o diagnóstico (dois endpoints, dois cockpits, conteúdo duplo).

### 4.3 Consignado / CDC

INFERÊNCIA: candidatos para Sprint 5 ou 6. Escopo similar ao diagnóstico mas com regulatório mais denso (margem consignável, CET — Doc 18).

### 4.4 Indicadores

LIMITAÇÃO: indicadores dependem de dados externos (Selic, IPCA, TR). A estratégia de ingestão/atualização desses dados não está definida na documentação atual. Complexidade de infraestrutura não trivial.

### 4.5 Investir vs Quitar

INFERÊNCIA: pós-MVP conforme Doc 10 §5 Fase 6. Não é candidato para Sprint 4.

---

## 5. Recomendação de escopo

**ESCOPO RECOMENDADO PARA SPRINT 4: Diagnóstico Financeiro — fatia vertical completa.**

Justificativa objetiva:

1. FATO: é o primeiro módulo da Fase 3 no Doc 10.
2. FATO: é educacionalmente prioritário — um usuário deve entender sua saúde financeira antes de simular produtos.
3. INFERÊNCIA: domínio independente, regras auditáveis, sem dependência externa.
4. INFERÊNCIA: a infraestrutura de cockpit da Sprint 3.5 está pronta para recebê-lo sem alteração.
5. INFERÊNCIA: encaixa no padrão vertical slice já comprovado nas Sprints 2 e 3.

---

## 6. Fatias propostas

### Sprint 4 / F1 — Domínio puro (diagnóstico)

Escopo: implementar a lógica de diagnóstico financeiro como domínio puro no backend.

Entradas esperadas:
- renda_mensal (Decimal)
- total_despesas_fixas (Decimal)
- total_dividas_mensais (Decimal)
- total_reserva_atual (Decimal)

Saídas esperadas:
- comprometimento_renda (%)
- nivel_comprometimento (baixo/moderado/alto/critico)
- reserva_emergencia_meses (int)
- nivel_reserva (insuficiente/minima/adequada/confortavel)
- sobra_mensal (Decimal)
- nivel_saude_financeira (critica/fragil/moderada/boa/otima)
- alertas educativos gerados pelas regras

Arquivos prováveis:
- backend/app/domain/diagnostic/analyzer.py
- backend/app/domain/diagnostic/rules.py
- backend/tests/unit/domain/diagnostic/test_analyzer.py
- backend/tests/unit/domain/diagnostic/test_rules.py

---

### Sprint 4 / F2 — Service + API (diagnóstico)

Escopo: expor o domínio via service e endpoint REST.

Arquivos prováveis:
- backend/app/schemas/diagnostic/analyze.py
- backend/app/services/diagnostic/diagnostico_service.py
- backend/app/api/v1/diagnostic.py
- backend/app/api/v1/router.py (registrar novo router)
- docs/api/openapi.json (sincronizar)
- backend/tests/unit/services/diagnostic/test_diagnostico_service.py
- backend/tests/integration/api/diagnostic/test_analyze.py
- backend/tests/integration/api/diagnostic/test_errors.py
- backend/tests/contract/test_diagnostic.py

---

### Sprint 4 / F3 — Frontend /diagnostico (cockpit)

Escopo: implementar a página /diagnostico com Financial Cockpit, substituindo o stub.

Arquivos prováveis:
- frontend/src/app/(app)/diagnostico/page.tsx
- frontend/src/components/diagnostic/DiagnosticoCockpit.tsx
- frontend/src/components/diagnostic/DiagnosticoForm.tsx
- frontend/src/components/diagnostic/DiagnosticoSummary.tsx
- frontend/src/components/diagnostic/DiagnosticoAlerts.tsx
- frontend/src/components/diagnostic/DiagnosticoInterpretation.tsx
- frontend/src/services/diagnostic/diagnosticoService.ts
- frontend/src/__tests__/app/diagnostico.test.tsx
- frontend/src/__tests__/services/diagnostic/diagnosticoService.test.ts
- frontend/src/__tests__/components/diagnostic/*.test.tsx

---

### Sprint 4 / F4 — Conteúdo educacional + docs vivos

Escopo: criar conteúdo educacional do módulo diagnóstico e atualizar documentação viva.

Arquivos prováveis:
- frontend/src/content/diagnostico/nivel-1.ts
- frontend/src/content/diagnostico/nivel-2.ts
- frontend/src/content/diagnostico/glossario.ts
- frontend/src/content/diagnostico/alertas.ts
- frontend/src/content/diagnostico/index.ts
- frontend/src/__tests__/content/diagnostico/conteudo.test.ts
- docs/19_Matriz_Rastreabilidade.md (adicionar RF-DIAG-001)
- docs/07_UX_UI_e_Navegacao.md (registrar /diagnostico no Financial Cockpit)
- docs/08_Conteudo_Educacional.md (§13.4 materialização sprint 4)
- docs/sprints/sprint-04/relatorio-execucao.md (ao fechar)
- docs/sprints/sprint-04/validacao-oficial.md (ao fechar)

---

## 7. Riscos identificados

| Risco | Probabilidade | Mitigação |
| --- | --- | --- |
| Regras de negócio do diagnóstico não estão completamente especificadas no Doc 03 | Média | Ler Doc 03 §diagnóstico antes de F1; se insuficiente, registrar LIMITAÇÃO e propor decisão ao PO |
| Definição de "nível de saúde" pode ser subjetiva | Média | Definir limites numéricos concretos no plano F1 com aprovação do PO |
| Conteúdo educacional requer aprovação editorial (Doc 08 §7) | Baixa | Produzir rascunho em F4 e submeter a Camaleão antes do merge |
| Cockpit do diagnóstico pode precisar de layout diferente dos módulos existentes | Baixa | Reutilizar FinancialCockpitShell; diferenciar apenas nos campos de entrada |

---

## 8. Limitações desta análise

LIMITAÇÃO: as regras numéricas exatas do Diagnóstico Financeiro (thresholds de comprometimento, meses de reserva) precisam ser confirmadas no Doc 03. Esta análise usa valores de referência comuns (≤30% comprometimento, ≥3-6 meses de reserva) como estimativa.
LIMITAÇÃO: a existência de conteúdo educacional completo para diagnóstico no Doc 08 foi verificada ao nível de heading; os detalhes específicos requerem leitura do Doc 03 §diagnóstico na F1.
LIMITAÇÃO: o número exato de casos de teste matemáticos (Doc 15) para diagnóstico não foi verificado — podem estar ausentes ou apenas planejados.

---

## 9. Veredito de análise

INFERÊNCIA: o escopo da Sprint 4 é suficientemente determinável a partir da documentação existente para permitir o início de F1 após aprovação do PO.
INFERÊNCIA: o risco principal é a especificação das regras numéricas de negócio, endereçável na F1 com leitura do Doc 03.

**Decisão pendente do PO:** aprovar ou ajustar o escopo proposto (Diagnóstico Financeiro, 4 fatias) antes de iniciar Sprint 4/F1.
