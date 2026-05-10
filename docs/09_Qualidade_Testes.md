# DOCUMENTO 09 — QUALIDADE, TESTES E CRITÉRIOS DE ACEITE
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente)
**Tipo:** Qualidade, Testes e Critérios de Aceite (visão conceitual)
**Status canônico:** VIVO
**Relação com a Estratégia de Testes:** este documento define **conceito, princípios, critérios de aceite e rejeição**. A operação detalhada (matriz dos 43 tipos, fases, gates) está em **`governanca_qualidade/ESTRATEGIA_DE_TESTES_DE_CLASSE_MUNDIAL.md`**. Os dois são complementares e são ambos vivos.

---

## 1. Finalidade
Definir o conceito de qualidade do produto, as dimensões avaliadas, a estratégia conceitual de testes, os critérios de aceite por dimensão e os critérios objetivos de rejeição.

## 2. Conceito de qualidade
Qualidade significa que a solução:
- calcula corretamente (precisão matemática);
- comunica corretamente (interpretação pedagógica fiel ao número);
- apresenta com clareza (UI legível, hierarquia adequada);
- trata erros de forma previsível (mensagens humanas e padronizadas);
- mantém coerência entre frontend, backend e regras de negócio;
- é testável em todas as camadas;
- é sustentável (refator não destrói o que existe);
- é utilizável por pessoas reais (acessibilidade, responsividade).

## 3. Dimensões de qualidade
1. **Funcional** — faz o que diz que faz.
2. **Matemática** — fórmula, periodicidade, arredondamento corretos.
3. **Pedagógica** — texto fiel ao número, linguagem clara.
4. **Técnica** — arquitetura, tipagem, contratos respeitados.
5. **De experiência** — UI clara, fluxos compreensíveis, acessibilidade.
6. **Operacional** — observabilidade, runbooks, recuperação.
7. **De segurança** — validação, segredos, headers, LGPD.
8. **Regulatória** — conformidade educacional com Doc 18.

## 4. Princípios oficiais de qualidade
- correção antes de sofisticação;
- testar o que importa primeiro (matemática, contrato, jornadas críticas);
- automatização sempre que possível;
- clareza nos critérios;
- qualidade contínua, não fase final;
- regressão é inaceitável (matemática, pedagógica, contrato, visual).

## 5. Camadas de teste (visão conceitual)
1. Unitário (domínio puro, utilitários, hooks).
2. Componente (FE — comportamento + render).
3. Integração (rota → service → domínio → repository com Postgres efêmero).
4. Contrato (OpenAPI, schemathesis).
5. Regressão (matemática, pedagógica, visual, contrato).
6. Snapshot (UI + saídas estáveis).
7. E2E (jornadas críticas).
8. Acessibilidade (axe-core).
9. Performance e carga (k6/locust).
10. Mutação (qualidade dos testes do domínio).
11. Segurança (SAST/DAST/dependency).
12. Recuperação (restore, falha simulada).
13. Smoke (local, sprint, deploy hml/prod).
14. Manuais orientados (revisão visual, exploratório).

> A matriz aplicada e a classificação de cada um dos 43 tipos da tabela de referência está em `governanca_qualidade/ESTRATEGIA_DE_TESTES_DE_CLASSE_MUNDIAL.md` §4. Este documento não duplica essa tabela; apenas referencia.

## 6. Estratégia conceitual de testes do backend
O backend é a fonte oficial da matemática. Tem testes para:
- fórmulas financeiras (com massa do Doc 15 + property-based);
- regras de negócio (limites, validações cruzadas);
- validação de entrada;
- respostas da API (estrutura, status, tipos);
- tratamento padronizado de erros (RFC 7807);
- montagem de payloads pedagógicos (`summary`, `tables`, `charts`, `interpretation`, `alerts`).

## 7. Cobertura mínima por área (gate bloqueante de PR)

| Área | Linhas | Branches | Mutação |
|------|--------|----------|---------|
| `backend/app/domain/` | 95% | 90% | ≥ 80% (semanal) |
| `backend/app/services/` | 90% | 85% | — |
| `backend/app/api/` | 85% | 80% | — |
| `backend/app/repositories/` | 85% | 80% | — |
| `frontend/src/components/critical/` | 85% | 80% | — |
| `frontend/src/lib/` | 85% | 80% | — |
| Demais áreas | 75% | 70% | — |

## 8. Estratégia conceitual de testes do frontend
- Componentes críticos têm cobertura ≥85%.
- Snapshot visual em telas críticas (Playwright).
- Testes de fluxo: simular juros, PRICE/SAC, financiamento, rotativo, atraso, investir vs quitar.
- Acessibilidade axe-core obrigatória nas telas tocadas pela PR.
- Responsividade em 375/768/1280 (1920 desejável).

## 9. Testes do conteúdo educacional (pedagógico)
- Suite `tests/regression/pedagogical/` valida presença e coerência de `summary`, `tables`, `charts`, `interpretation`, `alerts` para cada módulo.
- Lint pedagógico (Doc 08 §20) executado em PRs que tocam conteúdo.
- Revisão humana editorial (Doc 08 §7) registrada.

## 10. Testes da camada de exportação
Validar:
- geração de PDF;
- geração de Excel;
- integridade dos dados exportados;
- coerência entre exibido e exportado.

## 11. Testes manuais orientados
Roteiro por sprint e por release:
- clareza visual e hierarquia;
- legibilidade;
- entendimento do resultado;
- qualidade de textos e alertas;
- exploração de bordas (entradas estranhas, valores extremos).

## 12. Critérios gerais de aceite

### 12.1 Funcional
- Cumpre o objetivo do módulo.
- Recebe corretamente as entradas e valida obrigatoriedade.
- Produz saídas coerentes em casos típicos e de borda.
- Exibe resultados compreensíveis.
- Apresenta interpretação quando aplicável.

### 12.2 Matemático
- Usa a fórmula correta.
- Respeita periodicidade.
- Respeita arredondamento (HALF_EVEN; ±0,01 em moeda).
- Mantém coerência entre `summary`, tabela e gráfico.
- Passa em todos os casos canônicos do Doc 15.

### 12.3 Técnico
- Respeita arquitetura e fronteiras de módulo (Doc 04).
- Mantém separação de responsabilidades.
- Segue contratos da API (Doc 06; Doc 27).
- Trata erros conforme padrão RFC 7807.
- Não introduz duplicação descontrolada.
- Inclui testes mínimos (§7).

### 12.4 UX/UI
- Tela compreensível para a persona principal.
- Navegação faz sentido sem instrução adicional.
- Resultado tem hierarquia adequada.
- Estados `loading`, `vazio`, `erro`, `sucesso` presentes.
- Acessível por teclado; passa em axe-core sem `serious`/`critical`.

### 12.5 Pedagógico
- Explica o que está sendo calculado.
- Explica por que isso importa.
- Usa linguagem clara (Doc 08 §6).
- Não contradiz os resultados matemáticos.
- Tem aviso educacional persistente.

### 12.6 Operacional
- Tem log estruturado e métrica de latência/erro (Doc 23).
- Tem entrada em runbook (Doc 24) quando gera alerta novo.
- Migrations reversíveis (Doc 14).

### 12.7 Segurança e privacidade
- Sem segredos no código.
- Sem PII em logs.
- Validação de entrada rigorosa.
- Headers de segurança aplicados.
- Conforme Doc 22 (LGPD).

### 12.8 Regulatório
- Aviso de finalidade educacional persistente.
- Quando exibir CET/Selic/TR, indicar fonte e data-base.
- Não prometer equivalência com contrato real.

## 13. Critérios de rejeição (resumo; expandido em Governança Rígida §20)
- Fórmula incorreta ou massa do Doc 15 quebrada.
- Resposta da API inconsistente com OpenAPI.
- Contrato quebrado sem versionamento.
- Frontend confuso (sem estados básicos, sem hierarquia).
- Ausência de interpretação mínima.
- Ausência de testes essenciais.
- Violação grave de arquitetura.
- Divergência entre `summary`, tabela e gráfico.
- Módulo calcula sem explicar.
- Cobertura abaixo do gate.
- Documentação viva não atualizada.
- Lint pedagógico bloqueante violado.

## 14. Política para a Claude Code (operacional)
1. Toda função pública nasce com teste.
2. Toda rota nasce com teste de integração e contrato.
3. Toda fórmula nasce vinculada a casos do Doc 15.
4. Toda PR atualiza Doc 19 (rastreabilidade).
5. Ver detalhes operacionais em `governanca_qualidade/ESTRATEGIA_DE_TESTES_DE_CLASSE_MUNDIAL.md` e `governanca_qualidade/PIPELINE_E_QUALITY_GATES.md`.

## 15. Critérios de aceite deste documento
Aceito quando:
- conceito de qualidade, dimensões e princípios estão claros;
- camadas de teste e cobertura mínima estão definidas;
- critérios de aceite e rejeição estão objetivos;
- referência cruzada com a Estratégia de Testes está explícita e sem duplicação.


## 16. Massa de testes confirmada — Sprint 2 (F2/F3/F4/F5)

Esta seção é apêndice vivo. Cada sprint que confirma execução real
de massa adiciona uma sub-seção com data, fonte e contagem.

### 16.1 Frontend — F4 (juros)

Materializado e exercido no pipeline WSL Ubuntu durante a F4 da
Sprint 2:

| Métrica                            | Valor confirmado |
|------------------------------------|------------------|
| Arquivos `*.test.ts(x)`            | 19               |
| Casos de teste exercidos           | 112              |
| Origem da contagem                 | Pipeline WSL F4  |

Diretórios cobertos:

- `frontend/src/__tests__/app/` — rotas e páginas críticas
- `frontend/src/__tests__/components/` — Header, Sidebar,
  ShellLayout, EducationPanel, Forms, Panels, Tabs, etc.
- `frontend/src/__tests__/components/interest/` — formulários,
  validação, painéis, visualização
- `frontend/src/__tests__/lib/` — `money`, `api/envelope`,
  `api/problem`
- `frontend/src/__tests__/services/interest/` — service de juros
- `frontend/src/__tests__/tokens.test.ts` — tokens de design
  (Doc 16)

A contagem final de testes será registrada nos relatórios de sprint e na planilha operacional após a validação oficial no WSL Ubuntu, conforme a política descrita em §16.3.

| Arquivo (F5 — adições)                                                | Casos esperados |
|-----------------------------------------------------------------------|-----------------|
| `frontend/src/__tests__/content/juros/conteudo.test.ts`               | 8               |
| `frontend/src/__tests__/components/interest/JurosSaibaMais.test.tsx`  | 5               |

### 16.2 Backend — F2/F3 (juros)

Exercidos no pipeline durante F2/F3:

| Caminho                                                              | Status            |
|----------------------------------------------------------------------|-------------------|
| `backend/tests/unit/domain/interest/test_simple.py`                   | exercido          |
| `backend/tests/unit/domain/interest/test_compound.py`                 | exercido          |
| `backend/tests/unit/domain/interest/test_properties.py`               | exercido          |
| `backend/tests/unit/services/interest/test_calcular_juros_service.py` | exercido          |
| `backend/tests/integration/api/interest/test_simple.py`               | exercido          |
| `backend/tests/integration/api/interest/test_compound.py`             | exercido          |
| `backend/tests/integration/api/interest/test_compare.py`              | exercido          |
| `backend/tests/integration/api/interest/test_errors.py`               | exercido          |
| `backend/tests/contract/test_interest.py`                             | exercido          |
| `backend/tests/regression/pedagogical/test_interest.py`               | **planejado** (não materializado nesta sprint) |

### 16.3 Validação oficial — política

A validação oficial dos gates desta sprint é executada pelo
operador no WSL Ubuntu, conforme `scripts/pipeline.sh`. Resultados
de execução são registrados no relatório de fechamento da sprint
correspondente quando o pipeline retorna `EXIT_PIPELINE=0`. Este
documento vivo não armazena resultados pontuais de execução —
isso fica a cargo dos relatórios de sprint e da planilha
operacional.


---

## Sprint 4 — Testes do módulo Diagnóstico Financeiro (F4)

### Testes de conteúdo educacional

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `frontend/src/__tests__/content/diagnostico/conteudo.test.ts` | 51 | Estrutura, cobertura pedagógica N1/N2, disclaimer, glossário, alertas, lint pedagógico |

### Testes de componentes (F4)

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `frontend/src/__tests__/components/diagnostic/DiagnosticoSaibaMais.test.tsx` | 9 | Botão, modal, abas, glossário, alertas, aviso, nível 2, Escape |
| `frontend/src/__tests__/components/diagnostic/DiagnosticoInterpretation.test.tsx` | 4 | Interpretação por nível, aviso educacional |

### Totais pós-F4

| Momento | Testes |
|---------|--------|
| Antes da Sprint 4 | 190 |
| Após F3 | 229 (+39) |
| Após F4 | 293 (+64) |

Nenhuma regressão introduzida.

### Gates de qualidade (F4)

| Gate | Resultado |
|------|-----------|
| Prettier | VERDE |
| Vitest 293/293 | VERDE |
| Next.js build | VERDE |
| edu_lint 0 bloqueios | VERDE |
| ESLint | LIMITAÇÃO AMBIENTAL (pré-existente) |
| tsc typecheck | LIMITAÇÃO AMBIENTAL (pré-existente) |

---

## Sprint 4 F5 — Testes do módulo Financiamento Imobiliário

### Testes de backend

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `backend/tests/unit/domain/financing/test_real_estate.py` | 29 | Domínio puro: PRICE, SAC, taxa zero, encargos, 7 casos de erro de validação |
| `backend/tests/unit/services/financing/test_simular_financiamento_service.py` | 9 | Conversão taxa%, sumário, parcelas, SAC<PRICE juros, erros |
| `backend/tests/integration/api/financing/test_real_estate.py` | 6 | Envelope, summary, 360 parcelas, encargos |
| `backend/tests/integration/api/financing/test_errors.py` | 6 | 422 para payload inválido, sistema inválido, entrada≥imóvel, prazo zero, imóvel zero, encargo negativo |
| `backend/tests/contract/test_financing.py` | 7 | Estrutura do envelope, chaves do summary/parcela, RFC 7807, PRICE e SAC retornam 200 |

### Testes de frontend

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `frontend/src/__tests__/app/financiamento-imobiliario.test.tsx` | 12 | Cockpit, formulário, campos, seletor sistema, submit, idle, SaibaMais, status disponível |
| `frontend/src/__tests__/components/financing/FinanciamentoSaibaMais.test.tsx` | 8 | Botão, modal, abas, glossário, aviso, nível 2, Escape |
| `frontend/src/__tests__/content/financiamento-imobiliario/conteudo.test.ts` | 39 | Disclaimer, N1, N2, glossário 12 termos, lint pedagógico |
| `frontend/src/__tests__/services/financing/financiamentoService.test.ts` | 3 | Endpoint correto, dados desembrulhados, falha de rede |

### Totais pós-F5

| Momento | Testes |
|---------|--------|
| Antes da Sprint 4 | 190 |
| Após F3 | 229 (+39) |
| Após F4 | 293 (+64) |
| Após F5 | 354 (+61) |

Nenhuma regressão introduzida.

### Gates de qualidade (F5)

| Gate | Resultado |
|------|-----------|
| ruff check (backend) | VERDE |
| ruff format --check (backend) | VERDE |
| pytest 58/58 (backend financing unit + integration + contract) | VERDE |
| Prettier (frontend) | VERDE |
| Vitest 354/354 | VERDE |
| ESLint | VERDE |
| tsc typecheck | VERDE |
| Next.js build | VERDE |

---

## Sprint 4.5 F5 — Auditor de Interface Advisory

### Ferramenta adicionada

| Comando | Escopo | Semântica |
|---------|--------|-----------|
| `pnpm --dir frontend audit:interface` | Auditoria estática de UI Components, tabelas financeiras, cockpit e documentação viva | Advisory: achados não bloqueiam; erros operacionais falham |

### Testes adicionados

| Arquivo | Testes | Cobertura |
|---------|--------|-----------|
| `frontend/src/__tests__/app/auditorDeInterface.test.ts` | 2 | Execução advisory com exit code 0; erro operacional com exit code 1 |

### Regras cobertas

- tabelas financeiras sem rolagem horizontal como experiência principal;
- tabelas financeiras sem cortes artificiais por `.slice()`;
- `<caption>`, `scope="col"`, `scope="row"` e numerais tabulares;
- sticky header restrito a `.cockpit-table thead th`;
- topbar do cockpit derivada de `visibleInCockpit` e `getCockpitVisibleModules`;
- uso de `CockpitEducationPanel` sem duplicar `EducationPanel` no cockpit;
- contrato mínimo de ARIA nos primitivos;
- política de modais como apoio contextual;
- registro do auditor em `living_docs`.

### Política de bloqueio

O `auditor_de_interface` nasce em modo advisory. O objetivo é zero violações
obrigatórias não justificadas, mas alertas advisory podem existir
temporariamente quando documentados, justificados, classificados por severidade,
vinculados a decisão formal de Moisés/Camaleão e rastreados como pendência ou
exceção temporária.

---

## Sprint 4.5 F6 — Fechamento formal e validação final

### Validações de fechamento

| Comando | Resultado |
|---------|-----------|
| `pnpm --dir frontend format:check` | VERDE |
| `pnpm --dir frontend lint` | VERDE |
| `pnpm --dir frontend typecheck` | VERDE |
| `pnpm --dir frontend test` | VERDE — 45 arquivos, 390 testes |
| `pnpm --dir frontend build` | VERDE |
| `pnpm --dir frontend audit:interface` | VERDE — 0 critical-advisory, 0 warning, 18 info |
| `python3 -m json.tool docs/_meta/living_docs.json >/tmp/living_docs_f6_validado.json` | VERDE |
| `git diff --check origin/main...HEAD` | VERDE |
| `make verify` | VERDE |
| Checagem de acentuação corrompida em arquivos versionados Markdown/JSON/TXT | VERDE |

### Observações

- A suíte Vitest manteve avisos conhecidos do Recharts em JSDOM sobre dimensões
  `0x0`; os testes passaram.
- A F6 não executou validação visual por browser ou screenshot.
- A planilha operacional será atualizada por Camaleão/Moisés após decisão e
  merge.
