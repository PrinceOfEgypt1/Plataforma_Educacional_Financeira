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

