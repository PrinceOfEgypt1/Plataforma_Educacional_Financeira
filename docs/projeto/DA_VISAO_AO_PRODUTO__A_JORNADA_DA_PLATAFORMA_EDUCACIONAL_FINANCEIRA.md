# Da Visão ao Produto — A Jornada da Plataforma Educacional Financeira

**Documento:** Narrativa histórica viva do projeto
**Tipo:** VIVO — atualizado a cada sprint concluída
**Versão:** 1.0 (criado na Sprint 4, fase documental)
**Data de criação:** 2026-05-06
**Autor inicial:** Claude Code (Codex)
**Referência no índice:** `docs/_meta/living_docs.json` → `doc_jornada_pef`

---

## 1. Apresentação

Este documento conta a história do desenvolvimento da Plataforma Educacional Financeira (PEF) desde sua concepção inicial até o estado atual do projeto. Não é um manual técnico nem uma especificação funcional — é uma narrativa de decisões, aprendizados, superações e evolução.

Ele existe para que qualquer pessoa que ingresse no projeto — desenvolvedor, auditor, contribuidor ou o próprio Moisés em sessões futuras — possa entender não apenas *o que* foi construído, mas *por que* foi construído dessa forma e *como* cada decisão moldou o produto que existe hoje.

O documento é vivo: deve ser atualizado ao final de cada sprint relevante, registrando o estado real, os números reais e as lições reais — sem embelezamento e sem omissões.

---

## 2. A Pré-história: Concepção e Documentação Base

Antes de uma linha de código ser escrita, o projeto PEF passou por um rigoroso processo de especificação. Moisés, o Product Owner, produziu ou coordenou a produção de um conjunto de documentos de baseline que definiram o produto de ponta a ponta.

Esse corpus documental incluiu:

- **Doc 01 — Visão do Produto:** propósito, público-alvo, problema central e valores do produto.
- **Doc 02 — Escopo Funcional:** 12 módulos funcionais do MVP e seus requisitos de alto nível.
- **Doc 03 — Regras de Negócio e Matemática Financeira:** fórmulas, thresholds, lógica de classificação — a fonte canônica para toda implementação matemática.
- **Doc 04 — Arquitetura de Software:** decisões de stack, padrões de camadas, modelo C4.
- **Doc 05 — Modelagem de Dados:** entidades, relacionamentos e estrutura de persistência.
- **Doc 06 — API e Contratos:** endpoints, envelopes, formatos de erro.
- **Doc 07 — UX/UI e Navegação:** 12 rotas canônicas, shells, design system.
- **Doc 08 — Conteúdo Educacional:** política editorial, níveis de profundidade, glossário.
- **Doc 09 — Qualidade e Testes:** pirâmide de testes, gates obrigatórios, métricas de cobertura.
- **Doc 10 — Roadmap:** 7 fases, 12 épicos, visão macro do MVP ao pós-MVP.
- **Doc 11 — Prompt-Mestre:** o instrumento operacional que orienta cada sessão de implementação.
- **Doc 12 — Plano Operacional:** mapeamento de sprints às fases do roadmap.
- **Doc 13 — Backlog Técnico Detalhado:** itens de trabalho com critérios de aceite.
- **Doc 15 — Casos de Teste Matemáticos:** massa de validação numérica com casos canônicos.
- **Doc 18 — Banner Educacional:** política do aviso educacional persistente.
- **Doc 19 — Matriz de Rastreabilidade:** mapeamento de requisitos a implementações.
- **Doc 27 — Versionamento de API:** política de versões da API REST.

Essa base documental pré-existente é um diferencial do projeto: raramente projetos começam com especificação tão completa. Ela estabeleceu contratos claros entre o que foi prometido e o que deve ser entregue — e tornou cada sprint auditável contra critérios objetivos.

A documentação original estava num pacote externo chamado `AUDITORIA_PROMPT_1_FINAL`. Uma condição da Sprint 0 era migrar esses documentos para dentro do repositório. Isso foi parcialmente resolvido na Sprint 1.

---

## 3. Os Alicerces Conceituais

### 3.1 Propósito e público

A Plataforma Educacional Financeira nasceu de uma premissa simples e poderosa: a maioria das pessoas que tomam decisões financeiras importantes — contratar um financiamento, usar o cartão rotativo, avaliar se devem quitar uma dívida ou investir — não dispõe de ferramentas que expliquem, em linguagem acessível, as consequências matemáticas reais dessas decisões.

O produto não é uma calculadora financeira genérica. É uma plataforma que calcula *e* educa simultaneamente. Cada resultado numérico vem acompanhado de contexto, alertas e interpretação pedagógica.

O público-alvo prioritário é o adulto brasileiro com renda média, que tem acesso a crédito, compreende intuitivamente conceitos como "parcela" e "juros", mas não domina a matemática financeira por trás deles.

### 3.2 A decisão de stack

A escolha técnica foi deliberada e está registrada no ADR (Architecture Decision Records) do projeto:

- **Backend:** FastAPI (Python 3.11+) + Pydantic v2 + SQLAlchemy 2 + PostgreSQL 15. Escolha orientada à clareza de tipos, facilidade de geração de OpenAPI e ecossistema matemático de Python (Decimal nativo).
- **Frontend:** Next.js 14 + TypeScript 5 (strict) + Tailwind CSS. Escolha orientada ao App Router moderno, tipagem forte e performance de produção.
- **Qualidade:** ruff + mypy (strict) + pytest + hypothesis + vitest + eslint + prettier. Nenhum gate opcional — todos os checks são obrigatórios em cada PR.

A decisão de usar `decimal.Decimal` para todos os cálculos financeiros, em vez de `float`, foi explicitada no Doc 03 e materializada desde o primeiro módulo financeiro. Isso evita erros de arredondamento que são comuns em aplicações financeiras desenvolvidas com ponto flutuante.

### 3.3 O modelo de governança

O projeto opera com um modelo triangular de responsabilidade:

1. **Claude Code (Codex):** implementa, testa, documenta e propõe.
2. **Camaleão (IA auditora / ChatGPT):** audita a entrega, verifica coerência entre declarado e entregue, identifica resíduos e emite veredito.
3. **Moisés (PO/operador):** decide aprovação final, autoriza merge, atualiza planilha operacional.

Nenhuma sprint é declarada encerrada sem os três papéis terem cumprido sua função. A Codex não tem autoridade para declarar aprovação; só pode propor veredito fundamentado em evidências reais.

---

## 4. Sprint 0 — A Fundação (15–17 de abril de 2026)

### 4.1 Contexto e objetivo

A Sprint 0 teve um único objetivo: tornar o repositório um ambiente de desenvolvimento real e funcional. Não havia módulo financeiro a implementar — havia infraestrutura a construir.

### 4.2 O que foi construído

Em dois dias e três commits (`b00eeb0` → `977cc74` → `7a83045`), foi materializado:

**Backend:**
- Scaffold FastAPI com arquitetura em camadas (domain / services / api / repositories / schemas)
- 11 domínios de negócio como esqueletos vazios, prontos para implementação futura
- PostgreSQL 16 com bancos `pef_dev` e `pef_test` verificados
- Alembic com migration inicial `89360d9f55b5` aplicada
- `/health/ready` com `SELECT 1` real no PostgreSQL (sem mock)
- `config.py` com pydantic-settings v2 e `PROJECT_ROOT` dinâmico

**Frontend:**
- Scaffold Next.js 14 + App Router + TypeScript 5.9 + Tailwind CSS
- `layout.tsx` com `lang="pt-BR"`, banner educacional persistente (Doc 18), metadados SEO
- `page.tsx` com grid de módulos, header, footer e ARIA labels
- Design system com `tokens.ts` e `tokens.css`

**Qualidade:**
- Pre-commit hooks: ruff, mypy, bandit, detect-secrets
- GitHub Actions CI com PostgreSQL efêmero
- `make verify` com 8 gates obrigatórios
- 21 testes — 3 unit + 3 integration (banco real) + 14 design tokens + 1 scaffold
- Cobertura: 78,95% (gate mínimo: 75%)

**Governança:**
- `scripts/export_openapi.py` — exporta spec runtime
- `scripts/impact_analysis_guard.py` — agente de impacto advisory (20 camadas, 11 domínios)
- ADR-001 sobre o agente de impacto
- Runbooks de setup, health e recovery
- `docs/ui/INVENTARIO_TELAS.md`

### 4.3 Os 17 problemas resolvidos

A Sprint 0 foi marcada por obstáculos infraestruturais. Dezessete problemas técnicos foram encontrados e resolvidos, incluindo: `pip3: command not found` (resolvido com `uv`), `externally-managed-environment` no Ubuntu, Alembic sem `alembic.ini`, `next.config.ts` não suportado pelo Next.js 14, falsos-positivos do detect-secrets em IDs hexadecimais do Alembic, e erros de configuração do pydantic-settings com listas no `.env`.

Cada problema encontrado foi documentado no relatório de execução — nenhum foi escondido.

### 4.4 Veredito

**APROVADA COM LIBERAÇÃO CONDICIONADA** (2026-04-17). O trabalho técnico foi real e substancial, mas 34 documentos de especificação ainda não tinham sido migrados para o repositório. A condição foi registrada formalmente e endereçada na Sprint 1.

---

## 5. Sprint 1 — O Contrato e o Shell (18 de abril de 2026)

### 5.1 Contexto e objetivo

Com a infraestrutura pronta, a Sprint 1 tinha dois objetivos complementares: estabelecer os contratos HTTP que todo endpoint futuro seguiria, e construir o shell de navegação que todo módulo futuro habitaria.

### 5.2 O que foi construído

**Contrato HTTP base (Fatia 1):**
- Envelope de sucesso: `{success, message, data, meta}`
- Erros no formato RFC 7807 (`application/problem+json`)
- Correlação via `X-Request-ID` (extraído do header ou gerado automaticamente)
- Versionamento por URL `/api/v1` (ADR-0006)
- 13 testes de envelope + 7 testes de erro + 3 testes de contrato

**Shell navegável (Fatia 2):**
- Sidebar + header + main + footer
- 12 rotas canônicas navegáveis (slugs do Doc 06/07)
- 3 estados reutilizáveis: Loading, Error, Empty
- 4 componentes UI: SummaryCard, AlertBanner, FormSection, EducationPanel
- Banner educacional persistente (Doc 18)
- `frontend/src/config/modules.ts` como fonte única dos módulos
- 61 testes de componentes + 12 testes de rotas

**Governança documental (Fatia 3):**
- Agente de impacto no CI em modo advisory (Fatia 4)
- Doc 04 §6.3 atualizado com contrato materializado
- `docs/ui/INVENTARIO_TELAS.md` refletindo 12 slugs reais
- `docs/19_Matriz_Rastreabilidade.md` com linhas da Sprint 1
- `docs/27_Versionamento_API.md` com `v1 active`
- `docs/_meta/living_docs.json` sincronizado (`$schema_version: 3`)
- README atualizado com guia de setup pós-Sprint 1
- Pendências herdadas da Sprint 0 formalmente encerradas

### 5.3 Divergência registrada

O `mypy` apresentava um erro pré-existente em `backend/app/db/migrations/env.py` (import-not-found do Alembic). Esse resíduo foi herdado da Sprint 0, declarado honestamente como pendência e endereçado em sprint de higiene posterior.

### 5.4 Veredito

**APROVADA** (2026-04-18), com pendências residuais formalmente declaradas: mypy em migrations (herdado), Playwright/snapshots visuais, e a promoção do agente de impacto de advisory para blocking (pendente de ADR-0002).

---

## 6. Sprint 2 — O Motor de Juros (até 26 de abril de 2026)

### 6.1 Contexto e objetivo

A Sprint 2 marcou a primeira implementação de lógica financeira real. O objetivo era implementar o módulo de juros — simples e compostos — de ponta a ponta: domínio puro, API, frontend e conteúdo educacional.

### 6.2 O que foi construído

**Domínio puro — juros (F2 / PR #6 / `e4e56ac`):**
- `backend/app/domain/interest/simple.py` — juros simples com tabela temporal
- `backend/app/domain/interest/compound.py` — juros compostos com aportes mensais
- Todos os casos JS-01..03 e JC-01..03 do Doc 15 cobertos por testes
- Property-based testing com hypothesis

**API e schemas (F3 / PR #7 / `2ae0bb2`):**
- `POST /api/v1/interest/simple`
- `POST /api/v1/interest/compound`
- `POST /api/v1/interest/compare`
- Schemas Pydantic v2, testes de integração e contrato

**Frontend `/juros` (F4 / PR #9 / `f1336d8`):**
- Formulário + resultado com summary cards, tabela, gráfico e alertas
- Estados Loading/Empty/Error/Success
- Integração real com a API

**Pipeline oficial emergencial (PR #8 / `7841049`):**
- `scripts/pipeline.sh` — orquestra todos os gates em sequência
- Critério de encerramento formal: `EXIT_PIPELINE=0` literal + mensagem `PIPELINE VERDE`

**Conteúdo educacional e docs vivos (F5 oficial / PR #10 / `f20a180`):**
- Conteúdo nível 1 e nível 2 em `frontend/src/content/juros/`
- Doc 08 (conteúdo educacional), Doc 09 (massa confirmada), Doc 15 (cross-links de casos) atualizados
- RF-INT-001 e RF-INT-002 na matriz de rastreabilidade promovidos para `done`
- `living_docs.json` atualizado (`updated_at=2026-04-26`)

### 6.3 A decisão de não promover o Impact Agent

Um dos momentos mais relevantes da Sprint 2 foi a decisão de *não* promover o agente de impacto de advisory para blocking. O critério condicional K1 foi deliberadamente acionado com kill-switch — a promoção dependia de ADR-NNNN (critérios formais de WARNING) que ainda não havia sido elaborado. A decisão foi registrada em `F6-decisao-impact-agent.md`. Isso é um exemplo do padrão de governança do projeto: preferir declarar explicitamente o que não foi feito a fingir que está feito.

### 6.4 Dois números que importam

Os casos JS-01 e JC-01 do Doc 15 são os alicerces da validação matemática:
- JS-01: R$ 1.000,00 a 1% ao mês por 12 meses → montante final exato de R$ 1.120,00
- JC-01: R$ 1.000,00 a 1% ao mês por 12 meses → montante final ≈ R$ 1.126,83

Esses números aparecem literalmente no conteúdo educacional do frontend, nos testes unitários do backend e na massa de validação do Doc 15. A coerência entre as três camadas é verificada em runtime por `frontend/src/__tests__/content/juros/conteudo.test.ts`.

### 6.5 Veredito

**APROVADA** (com protocolo de encerramento formal dependente do operador), com pendências residuais declaradas: casos JS-04..10 e JC-04..10 não exercidos, regressão pedagógica, mutation testing, responsividade mobile.

---

## 7. Sprint 3 — O Motor de Amortização (até 3 de maio de 2026)

### 7.1 Contexto e objetivo

Com juros funcionando de ponta a ponta, a Sprint 3 expandiu o motor financeiro para amortização de financiamentos — os sistemas PRICE e SAC, que são os mais usados no Brasil para financiamentos imobiliários e de veículos.

### 7.2 O que foi construído

A Sprint 3 seguiu exatamente o mesmo padrão vertical da Sprint 2: domínio → service → API → frontend → conteúdo → docs.

**Domínio PRICE/SAC (F2 / PR #13 / `dd23c6d`):**
- `backend/app/domain/amortization/` com implementações PRICE e SAC
- Tabelas de amortização completas com validação de invariantes (amortização constante no SAC, parcela constante no PRICE, saldo devedor convergindo a zero)
- Testes unitários cobrindo casos PR-01, PR-02, SAC-01, SAC-02 do Doc 15

**API e schemas (F3 / PR #14 / `a297b9c`):**
- `POST /api/v1/amortization/price`
- `POST /api/v1/amortization/sac`
- `POST /api/v1/amortization/compare`
- OpenAPI sincronizado com todos os endpoints de juros e amortização

**Frontend `/amortizacao` (F4 / PR #15 / `f20780e`):**
- Página real (não placeholder) com subtabs PRICE / SAC / Comparar
- Tabela de amortização sob demanda, gráfico de evolução, glossário e alertas

**Conteúdo e docs (F5 / PR #16 / `81e8cbb` — main final da Sprint 3):**
- Conteúdo educacional de amortização integrado ao frontend
- Doc 06, Doc 07, Doc 08, Doc 19 atualizados
- RF-AMO-001, RF-AMO-002 e RF-AMO-003 na matriz promovidos para `done`
- Snapshot: 138 testes unitários + 36 integração + 22 contrato + 189 frontend

### 7.3 Estado do repositório ao final

- `main = origin/main = 81e8cbb`
- Endpoints disponíveis: 10 (3 amortização + 3 juros + 1 contract/ping + 3 health)
- Testes totais: 385 (backend + frontend)
- Pipeline oficial: `EXIT_PIPELINE=0` — `PIPELINE VERDE`

### 7.4 Veredito

**APROVADA** (2026-05-03). Sem pendência técnica bloqueante. Resíduos não bloqueantes: warning Recharts/jsdom em testes frontend e mutation testing como stretch.

---

## 8. Sprint 3.5 — A Maturidade Visual (6 de maio de 2026)

### 8.1 Contexto e motivação

Entre a Sprint 3 e a Sprint 4, Moisés identificou que a interface estava funcional mas visualmente fragmentada. Os resultados existiam, mas a experiência de uso não era coerente nem didática o suficiente. Foi criada uma sprint intermediária dedicada exclusivamente à qualidade visual e de experiência — sem tocar no backend.

### 8.2 O que foi transformado

A Sprint 3.5 introduziu o conceito de **Financial Cockpit**: um layout unificado para todas as páginas de módulo, com KPIs em cards destacados no topo, subtabs por tipo de cálculo, gráfico central como elemento principal, e conteúdo educacional sob demanda (modais e painéis expansíveis).

Mudanças concretas:
- **Home:** compactada, com apresentação curta e atalhos diretos para módulos disponíveis
- **`/juros`:** Financial Cockpit com subtabs Simples / Compostos / Comparar, painel educacional e modal de aprofundamento
- **`/amortizacao`:** Financial Cockpit com subtabs PRICE / SAC / Comparar, tabela sob demanda, glossário, cuidados e modal de aprofundamento
- **Topbar de módulos:** navegação rápida entre todos os módulos do MVP
- **Conteúdo educacional:** acessível sem scroll obrigatório, via modais e painéis

A Sprint 3.5 também realizou um adendo de reconciliação (PR #19 versus PR #20) para garantir que as melhorias visuais não criassem divergências com a documentação anterior.

### 8.3 Evidência de conteúdo visual

A sprint produziu evidências fotográficas do estado final da interface — screenshots do cockpit de juros, do cockpit de amortização, dos modais educativos e dos estados de cálculo. Esses arquivos estão em `docs/sprints/sprint-03-5/evidencias/`.

### 8.4 Veredito

**APROVADA** (2026-05-06) com pendências não bloqueantes: warning Recharts/jsdom (herdado) e refino mobile dedicado para sprint futura.

Estado final após Sprint 3.5: `main = origin/main = 16c2aa4`.

---

## 9. Sprint 4 — O Diagnóstico Financeiro (em curso — 6 de maio de 2026)

### 9.1 Contexto e objetivo

A Sprint 4 inicia o épico mais estratégico do MVP: o Diagnóstico Financeiro. Este módulo é o coração da proposta educacional da plataforma — ele não simula um produto financeiro, ele analisa a saúde financeira do usuário e devolve uma interpretação compreensível, com alertas e orientações.

### 9.2 F0 — Rebaseline documental

Antes de implementar, foi necessário rebasear a documentação matemática do diagnóstico. O Doc 03 §7 e o Doc 15 §7 foram auditados e atualizados com valores canônicos exatos para os casos DG-01 e DG-02. Essa fase garantiu que a implementação partiria de uma especificação inequívoca.

### 9.3 F0.1 — Pesquisa e decisão matemática

Uma fase de pesquisa sobre as regras de negócio do diagnóstico produziu o documento `F1-dominio-regras.md`, que formalizou:

- As 5 entradas: renda_mensal, total_despesas_fixas, total_despesas_variaveis, total_dividas_mensais, total_reserva_atual
- As 5 fórmulas base (sobra, comprometimento, despesas essenciais, reserva em meses, sobra percentual)
- Os 3 classificadores com thresholds precisos (comprometimento, reserva, sobra)
- O score de 0 a 9 e seu mapeamento para 5 níveis de saúde
- O override de dois níveis para sobra negativa
- Os 6 alertas educativos com seus códigos, severidades e dimensões

### 9.4 F1 — Domínio puro do diagnóstico

A implementação do domínio puro foi um marco de qualidade do projeto. Entregou:

**Código de produção:**
- `backend/app/domain/diagnostic/_rounding.py` — política de precisão (28 dígitos internos, 2 casas exibição, ROUND_HALF_EVEN)
- `backend/app/domain/diagnostic/rules.py` — classificadores puros sem side effects
- `backend/app/domain/diagnostic/analyzer.py` — analisador principal com validação, cálculo e geração de alertas
- `backend/app/domain/diagnostic/__init__.py` — `DomainValidationError` com `code`, `message`, `field`, `value: object | None`

**Testes (76 novos, todos passando):**
- `test_rules.py` — 45 testes cobrindo todas as fronteiras dos 3 classificadores
- `test_analyzer.py` — 24 testes incluindo DG-01 e DG-02 canônicos verificados numericamente
- `test_properties.py` — 7 propriedades hypothesis × 200 exemplos (score 0–9, saude_nivel válido, invariantes algébricas, sobra<0→critica/fragil)

**Resultado dos gates:**
- ruff check: 0 erros
- ruff format: 0 diffs
- mypy --strict: 0 issues
- bandit: 0 issues
- pytest: 76/76 passando
- cobertura do domínio: 99,42% (gate: ≥80%)
- suite completa (214 testes): 214/214 passando — sem regressão

### 9.5 F1-A — Adendo corretivo de qualidade

Após a auditoria do Camaleão/Moisés, dois resíduos técnicos foram identificados no código de produção:

1. **5 × `# type: ignore[assignment]`** em `analyzer.py`, onde variáveis `object`-tipadas eram reatribuídas a `Decimal`-tipadas sem prova de tipo.
2. **`from typing import Any`** em `__init__.py`, com `value: Any = None` em `DomainValidationError`.

O adendo F1-A resolveu ambos cirurgicamente:
- Introduziu `_ensure_decimal(field, value)` — helper que valida o tipo, retorna `Decimal` tipado e levanta `DomainValidationError` com código estruturado. Eliminou todos os `type: ignore`.
- Substituiu `value: Any = None` por `value: object | None = None`. Removeu a importação de `Any`.

Após F1-A: zero `type: ignore` em código de produção. Zero uso de `Any`. mypy --strict: 0 issues.

### 9.6 Estado atual da Sprint 4

A Sprint 4 está em curso. As fases F0, F0.1, F0.1-A, F1 e F1-A foram concluídas. As fases seguintes (F2: service e API; F3: schemas; F4: frontend; F5: conteúdo e docs vivos; F6: fechamento) aguardam aprovação da F1 pelo Camaleão/Moisés para prosseguir.

---

## 10. A Arquitetura que Emergiu das Decisões

### 10.1 Arquitetura vertical em fatias

O projeto adotou desde cedo uma arquitetura de *vertical slices*: cada sprint entrega um módulo completo de ponta a ponta (domínio → service → API → frontend → conteúdo → docs), em vez de construir camadas horizontais (primeiro todo o backend, depois todo o frontend).

Essa decisão tem consequências profundas:
- Cada sprint entrega valor tangível e verificável.
- Cada sprint pode ser auditada independentemente.
- O risco de integração é distribuído ao longo do tempo, não concentrado no final.

### 10.2 Domínio puro como núcleo

O motor financeiro vive em `backend/app/domain/`. Essa camada não conhece HTTP, banco de dados, sessão ou usuário. Recebe `Decimal`, devolve dataclasses imutáveis (`frozen=True, slots=True`). Qualquer violação de precondição levanta `DomainValidationError` — uma exceção de domínio pura, sem acoplamento a HTTP.

Essa pureza tem um benefício direto: os testes do domínio são determinísticos, rápidos e testam exatamente a matemática — sem mocks de banco, sem setup de API, sem estado compartilhado.

### 10.3 Contrato HTTP como linguagem comum

O envelope de sucesso `{success, message, data, meta}` e o formato de erro RFC 7807 foram definidos na Sprint 1 e nunca foram alterados. Todo novo endpoint que surge simplesmente obedece ao contrato — o cliente do frontend não precisa de lógica especial para módulos diferentes.

O `X-Request-ID` em cada requisição permite rastrear qualquer operação da interface até o log do servidor — essencial para debugging em produção.

### 10.4 O agente de impacto como memória arquitetural

`scripts/impact_analysis_guard.py` analisa cada mudança de código e classifica o impacto em 20 camadas e 11 domínios. Em modo advisory, ele gera um relatório mas não bloqueia o build. Está integrado ao CI desde a Sprint 1.

A decisão de não promovê-lo para blocking na Sprint 2 foi deliberada: sem ADR-0002 (critérios formais), uma falha do agente seria indistinguível de um falso-positivo. A promoção é uma pendência formal registrada.

---

## 11. A Qualidade como Fundação Estrutural

### 11.1 A política de qualidade

O CLAUDE.md define qualidade como *estrutural, não cosmética*. Isso significa:
- Meta estratégica: 100% em lint, format, testes, cobertura e demais gates mensuráveis.
- Tolerância zero em lint com erro, format com diferença, testes obrigatórios falhando.
- Nenhuma entrega pode regredir qualidade já conquistada sem identificação de causa, plano de recuperação e decisão auditável.

### 11.2 Números acumulados

| Sprint | Testes (total acumulado) | Cobertura (domínio) |
|--------|--------------------------|---------------------|
| Sprint 0 | 21 | 78,95% |
| Sprint 1 | 82+ (backend) + 61+ (frontend) | — |
| Sprint 2 | 138 unit + 36 integration + 22 contract (backend) + 189 (frontend) | — |
| Sprint 3 | mesma base expandida com amortização | — |
| Sprint 4 / F1 | 214 (backend) + 189+ (frontend) | 99,42% (diagnostic) |

### 11.3 A pirâmide de testes

O projeto implementa a pirâmide completa:
- **Testes unitários:** domínio puro, rápidos, sem I/O
- **Testes de integração:** banco de dados real (não mock)
- **Testes de contrato:** verificam envelope HTTP e formatos de erro
- **Testes de propriedade:** hypothesis verifica invariantes algébricas com centenas de exemplos aleatórios
- **Testes frontend:** vitest para componentes React e lógica de interface

### 11.4 Honestidade técnica como prática

O projeto tem um padrão não escrito que se tornou explícito ao longo das sprints: declarar honestamente o que foi feito *e* o que não foi. Cada validação oficial tem uma seção de pendências residuais com destino concreto. Nenhuma pendência fica "sem sprint alvo".

---

## 12. A Governança Operacional como Diferencial

### 12.1 O rito de encerramento

Cada sprint segue um rito formal de encerramento:
1. Fase 0: verificar `main = origin/main`, branch atual, HEAD, working tree limpa.
2. Implementação em branch própria (`sprint-N/fx-descricao`).
3. Evidências produzidas e commitadas antes de propor veredito.
4. Veredito proposto pela Codex com base em execução real (não estimada).
5. Auditoria do Camaleão/Moisés.
6. Decisão do operador, merge, planilha.

### 12.2 O papel das evidências

Cada sprint produz artefatos de evidência concretos: saídas literais dos gates (`make-verify-backend.txt`), screenshots de interface, arquivos de staging proof, baselines git. Esses artefatos são commitados no repositório — não existem apenas na memória da sessão de chat.

### 12.3 Escopo como contrato

O CLAUDE.md e os planos de sprint definem explicitamente o que está *proibido* além do que está *autorizado*. Isso evita que melhorias não solicitadas introduzam instabilidade. Um bug fix não precisa de refatoração ao redor; uma entrega de domínio não inclui mudanças de frontend.

### 12.4 A sessão de chat como unidade de trabalho

O modelo operacional entende que uma sessão de chat é uma unidade de trabalho atômica. Quando a sessão termina, o estado deve estar num ponto de checkpoint: working tree limpa, evidências commitadas, pendências registradas. A sessão seguinte pode continuar de onde a anterior parou.

---

## 13. O Motor Matemático Financeiro

### 13.1 Fidelidade ao Doc 03

O Doc 03 — Regras de Negócio e Matemática Financeira — é a fonte canônica de toda implementação matemática. Nenhuma fórmula é implementada sem referência explícita a esse documento. Nenhuma fórmula é alterada sem uma mudança formal no Doc 03 (via adendo ou ADR).

### 13.2 Módulos implementados

| Módulo | Status | Sprint | Endpoints |
|--------|--------|--------|-----------|
| Juros Simples | ✅ Completo | Sprint 2 | `POST /api/v1/interest/simple` |
| Juros Compostos | ✅ Completo | Sprint 2 | `POST /api/v1/interest/compound` |
| Comparador de Juros | ✅ Completo | Sprint 2 | `POST /api/v1/interest/compare` |
| Amortização PRICE | ✅ Completo | Sprint 3 | `POST /api/v1/amortization/price` |
| Amortização SAC | ✅ Completo | Sprint 3 | `POST /api/v1/amortization/sac` |
| Comparador de Amortização | ✅ Completo | Sprint 3 | `POST /api/v1/amortization/compare` |
| Diagnóstico Financeiro | 🔄 Domínio pronto (Sprint 4/F1) | Sprint 4 | Pendente (F2+) |

### 13.3 Módulos planejados (pós-Sprint 4)

- Financiamento Imobiliário (Doc 15 §8 — FI-01, FI-02)
- Financiamento de Veículo (Doc 15 §9 — FV-01)
- Empréstimo Consignado (Doc 15 §10 — CON-01, CON-02)
- Crédito Pessoal / CDC (Doc 15 §11 — CDC-01)
- Cartão Rotativo (Doc 15 §12 — ROT-01, ROT-02)
- Parcela em Atraso (Doc 15 §13 — ATR-01, ATR-02)
- Indicadores Financeiros (Doc 15 §14 — IND-01, IND-02)
- Investir ou Quitar Dívida (Doc 15 §15 — IQD-01, IQD-02)

### 13.4 A política de Decimal

Todos os cálculos financeiros usam `decimal.Decimal` com precisão interna de 28 dígitos (`INTERNAL_PRECISION = 28`) e arredondamento `ROUND_HALF_EVEN` (arredondamento bancário). A conversão para 2 casas decimais (`money()`) ocorre *apenas na fronteira de apresentação* — nunca no meio de um cálculo. Isso garante que erros de arredondamento acumulativo não contaminam os resultados.

---

## 14. A Camada Educacional Integrada

### 14.1 Conteúdo como cidadão de primeira classe

A plataforma não tem uma seção separada de "educação financeira" — o conteúdo educacional é embutido em cada módulo, aparece junto com os resultados e é progressivo: nível 1 (introdução acessível) → nível 2 (aprofundamento) → nível 3 (pós-MVP).

### 14.2 O lint pedagógico

`python -m tools.edu_lint` verifica automaticamente se o conteúdo educacional obedece às políticas do Doc 08: comprimento adequado, vocabulário acessível, links de aprofundamento, coerência numérica. O lint pedagógico é parte do pipeline oficial.

### 14.3 Coerência numérica entre camadas

Os exemplos numéricos no conteúdo educacional (`frontend/src/content/juros/nivel-1.ts` e `nivel-2.ts`) usam exatamente os mesmos números dos casos JS-01 e JC-01 do Doc 15. Essa coerência é verificada em runtime por testes frontend dedicados — não é uma convenção manual.

---

## 15. As Fronteiras de Responsabilidade

### 15.1 Backend é a fonte da verdade matemática

Cálculos financeiros críticos pertencem exclusivamente ao backend. O frontend não recalcula — ele exibe o que recebeu. Isso evita divergência entre o que o usuário vê no navegador e o que o sistema realmente calculou.

### 15.2 Domínio puro vs. camadas externas

A regra de pureza do domínio é absoluta: `backend/app/domain/` não importa nada de `backend/app/api/`, `services/`, `schemas/` ou `repositories/`. A direção da dependência é sempre de fora para dentro. O `DomainValidationError` é local a cada subdomínio para evitar imports circulares.

### 15.3 O que o Claude Code não faz

O CLAUDE.md define explicitamente o que está fora do escopo da Codex:
- Não faz push nem abre PR sem autorização
- Não declara sprint aprovada sem veredito do operador
- Não altera planilha operacional
- Não corrige fora do patch autorizado
- Não usa script com path hardcoded
- Não trata vermelho residual como normal

---

## 16. O Roadmap e o Horizonte do MVP

### 16.1 Fases do roadmap

O Doc 10 define 7 fases:

| Fase | Nome | Status |
|------|------|--------|
| Fase 0 | Preparação e fundação | ✅ Sprint 0 |
| Fase 1 | Infraestrutura funcional | ✅ Sprint 1 |
| Fase 2 | Motor financeiro essencial | ✅ Sprints 2–3 |
| Fase 3 | Módulos centrais do MVP | 🔄 Sprint 4+ (diagnóstico em curso) |
| Fase 4 | Conteúdo e interpretação | 🔄 Parcial (juros + amortização) |
| Fase 5 | Consolidação do MVP | 📋 Planejada |
| Fase 6 | Pós-MVP prioritário | 📋 Futura |

### 16.2 O MVP e seus módulos obrigatórios

O MVP oficial (Doc 10 §8) requer 11 módulos:
1. ✅ Juros Simples e Compostos
2. ✅ PRICE e SAC
3. 🔄 Diagnóstico Financeiro (Sprint 4)
4. 📋 Financiamento Imobiliário
5. 📋 Financiamento de Veículo
6. 📋 Empréstimo Consignado
7. 📋 Crédito Pessoal / CDC
8. 📋 Cartão Rotativo
9. 📋 Parcela em Atraso
10. 📋 Indicadores (versão inicial)
11. 🔄 Conteúdo educacional inicial (parcial — juros e amortização prontos)

---

## 17. Pendências Formalmente Declaradas

As pendências abaixo são herdadas de sprints anteriores e têm destino formal:

| Pendência | Sprint de origem | Destino |
|-----------|-----------------|---------|
| Promoção Impact Agent advisory → blocking (ADR-0002) | Sprint 1 | Antes de Sprint de higiene |
| Casos JS-04..10 e JC-04..10 do Doc 15 | Sprint 2 | Sprints subsequentes |
| Testes de regressão pedagógica | Sprint 2 | Sprint 3+ |
| Mutation testing ≥ 80% (domínio de juros) | Sprint 2 | Candidato a P-Refino |
| Snapshot visual Playwright | Sprint 2 | P-Refino (se infra pronta) |
| Responsividade mobile dedicada (375px) | Sprint 3.5 | Sprint futura |
| Glossário ampliado (≥ 25 termos MVP) | Sprint 2 | Sprints subsequentes |
| FAQ inicial (Doc 08 §18) | Sprint 2 | Sprint 3+ |
| API: 15 endpoints de domínio do Doc 06 ainda não todos implementados | Sprint 1 | Contínuo (por módulo) |

---

## 18. Lições Aprendidas

### 18.1 Documentar antes de implementar tem valor real

A existência de uma base documental prévia completa (Docs 01–15 e além) não foi um luxo — foi uma alavanca operacional. Cada sprint pôde definir critérios de aceite precisos porque as especificações já existiam. A auditoria foi possível porque havia uma referência canônica.

### 18.2 Evidências precisam ser artefatos, não declarações

No início, havia uma tensão entre "declarar que passou" e "provar que passou". O projeto convergiu para um padrão: evidências são arquivos commitados, não afirmações em texto. Se o pytest passou, o log está em `evidencias/make-verify-backend.txt`. Se a interface está certa, os screenshots estão em `evidencias/`.

### 18.3 Resíduos declarados são melhores que resíduos escondidos

Cada sprint tem resíduos — coisas que ficaram pendentes, coisas que não couberam no escopo, coisas que dependem de ADR ainda não elaborado. O padrão do projeto é declará-los com destino formal, não fingir que não existem. Resíduo declarado é passivo gerenciável; resíduo escondido é bomba-relógio.

### 18.4 Qualidade sem regressão é mais valiosa que velocidade sem garantia

A regra de "nenhuma entrega pode regredir qualidade já conquistada" cria uma pressão positiva: as equipes futuras herdarão um codebase que nunca foi intencionalmente degradado para ganhar velocidade. O custo de manter essa disciplina por sprint é menor do que o custo de recuperar qualidade degradada acumulada.

### 18.5 O domínio puro é o ativo mais durável

A camada de domínio (`backend/app/domain/`) é o único componente do sistema que não depende de nenhum framework, nenhuma versão de banco, nenhuma convenção de API. Se o projeto um dia migrar de FastAPI para outro framework, ou de PostgreSQL para outro banco, o domínio sobrevive intocado. Isso foi uma escolha arquitetural explícita e tem se provado valiosa.

---

## 19. Glossário de Termos Operacionais

| Termo | Significado no contexto do projeto |
|-------|----------------------------------|
| **Codex** | Papel da Claude Code como implementadora |
| **Camaleão** | Papel da IA auditora (ChatGPT) que audita cada entrega |
| **PO** | Product Owner — Moisés, que decide aprovações finais |
| **Fase 0** | Verificação obrigatória de baseline antes de qualquer trabalho |
| **Fatia** | Uma fase de implementação dentro de uma sprint (F1, F2, ...) |
| **Gate** | Verificação de qualidade obrigatória (lint, format, testes, etc.) |
| **Resíduo** | Pendência declarada com destino formal |
| **Pipeline verde** | `EXIT_PIPELINE=0` com mensagem literal `PIPELINE VERDE` |
| **Domínio puro** | Camada de lógica financeira sem dependências externas |
| **Adendo** | Correção cirúrgica após auditoria, sem ampliar escopo |
| **Kill-switch** | Mecanismo de não-promoção deliberada de um critério condicional |
| **Canonical cases** | Casos de teste com valores numéricos exatos do Doc 15 |
| **Living doc** | Documento vivo — atualizado a cada sprint relevante |
| **ROUND_HALF_EVEN** | Arredondamento bancário — ≥ 0,5 vai para o par mais próximo |

---

## 20. Índice de Decisões Técnicas Críticas

| Decisão | Sprint | Referência |
|---------|--------|-----------|
| Stack FastAPI + Next.js + PostgreSQL | Pré-Sprint 0 | Doc 04 |
| `decimal.Decimal` para todos os cálculos financeiros | Pré-Sprint 0 | Doc 03 |
| Arquitetura vertical em fatias (não horizontal por camadas) | Sprint 0 | Implícito no plano |
| `uv venv` em vez de `pip` global | Sprint 0 | Relatório de execução Sprint 0 |
| `next.config.mjs` em vez de `.ts` | Sprint 0 | Relatório de execução Sprint 0 |
| Envelope `{success, message, data, meta}` | Sprint 1 | ADR-0005 / Doc 06 |
| RFC 7807 para erros | Sprint 1 | ADR-0005 / Doc 06 |
| Versionamento `/api/v1` por URL | Sprint 1 | ADR-0006 |
| Impact Agent em modo advisory (não blocking) | Sprint 2 | `F6-decisao-impact-agent.md` |
| `frozen=True, slots=True` em dataclasses de domínio | Sprint 2 | Doc 04 / padrão |
| `_ensure_decimal()` para type-safe validation | Sprint 4/F1-A | Adendo F1-A |
| `value: object | None` em vez de `Any` em erros de domínio | Sprint 4/F1-A | Adendo F1-A |

---

## 21. Índice de Documentos Referenciados

| Documento | Caminho | Tipo |
|-----------|---------|------|
| Visão do Produto | `docs/baseline/01_Visao_do_Produto.md` | Baseline |
| Escopo Funcional | `docs/02_Escopo_Funcional.md` | VIVO |
| Regras de Negócio | `docs/baseline/03_Regras_de_Negocio.md` | Baseline |
| Arquitetura de Software | `docs/04_Arquitetura_de_Software.md` | VIVO |
| API e Contratos | `docs/06_API_e_Contratos.md` | VIVO |
| UX/UI e Navegação | `docs/07_UX_UI_e_Navegacao.md` | VIVO |
| Conteúdo Educacional | `docs/08_Conteudo_Educacional.md` | VIVO |
| Qualidade e Testes | `docs/09_Qualidade_Testes.md` | VIVO |
| Roadmap | `docs/10_Roadmap.md` | VIVO |
| Casos de Teste Matemáticos | `docs/15_Casos_de_Teste_Matematicos.md` | VIVO |
| Índice Geral | `docs/00_INDICE_GERAL.md` | META |
| Living Docs | `docs/_meta/living_docs.json` | META |
| Regras Sprint 4 / F1 | `docs/sprints/sprint-04/evidencias/F1-dominio-regras.md` | Evidência |

---

## 22. Rastreabilidade: Commits e PRs

| Sprint | Commits / PRs chave | Descrição |
|--------|---------------------|-----------|
| Sprint 0 | `b00eeb0`, `977cc74`, `7a83045` | Scaffold → Sprint 0 → Adendo forense |
| Sprint 1 | PRs #1–#4 (fatias) | Contrato + shell navegável |
| Sprint 2 | PR #6 `e4e56ac`, PR #7 `2ae0bb2`, PR #8 `7841049`, PR #9 `f1336d8`, PR #10 `f20a180` | Motor de juros completo |
| Sprint 3 | PR #12 `55d5d44`, PR #13 `dd23c6d`, PR #14 `a297b9c`, PR #15 `f20780e`, PR #16 `81e8cbb` | Motor de amortização |
| Sprint 3.5 | PRs #19, #20 + reconciliação | UI/UX cockpit |
| Sprint 3.5 final | `16c2aa4` | main após Sprint 3.5 |
| Sprint 4/F1 | `601dc59` | Domínio puro do diagnóstico |
| Sprint 4/F1-A | `fea3b99` | Adendo corretivo de qualidade |

---

## 23. Métricas de Qualidade Acumuladas

**Estado ao final de Sprint 4/F1-A (2026-05-06):**

| Métrica | Valor |
|---------|-------|
| Testes backend (total) | 214 |
| Testes frontend (aproximado) | 189+ |
| Cobertura domínio diagnostic | 99,42% |
| Erros de lint (ruff) | 0 |
| Erros de format | 0 |
| Erros mypy --strict | 0 |
| Issues bandit (segurança) | 0 |
| `type: ignore` em produção | 0 |
| Uso de `Any` em produção | 0 |
| Endpoints implementados | 10 |
| Gates do pipeline | todos verdes |

---

## 24. Ambiente de Desenvolvimento

### 24.1 Requisitos

- Python 3.11+, Node.js 20+, pnpm 9+, PostgreSQL 15+
- Linux/WSL Ubuntu recomendado (Windows 11 com WSL2)
- `uv` para gerenciamento do ambiente Python

### 24.2 Setup rápido

```bash
git clone https://github.com/PrinceOfEgypt1/Plataforma_Educacional_Financeira.git
cd Plataforma_Educacional_Financeira
cp .env.example .env  # editar DATABASE_URL

# Backend
cd backend && uv venv .venv && uv pip install -e ".[dev]" --python .venv/bin/python
.venv/bin/python -m alembic upgrade head

# Frontend
cd ../frontend && pnpm install

# Verificar tudo
cd .. && make verify
```

### 24.3 Gates obrigatórios

```bash
bash scripts/pipeline.sh  # todos os gates — deve retornar EXIT_PIPELINE=0 + "PIPELINE VERDE"
```

---

## 25. Como Manter Esta História Viva

Este documento deve ser atualizado ao final de cada sprint relevante. A atualização deve:

1. Adicionar uma seção da nova sprint (ou expandir a seção em curso).
2. Atualizar o estado dos módulos no § 13.2.
3. Atualizar as métricas de qualidade no § 23.
4. Registrar novas decisões técnicas no § 20.
5. Mover pendências resolvidas para o histórico ou removê-las do § 17.
6. Atualizar a rastreabilidade no § 22 com novos commits e PRs.

O documento não deve ser reescrito — deve ser expandido. A história de decisões passadas tem valor; suprimi-la apaga o contexto que justifica o estado atual.

---

## 26. Referências Cruzadas com Documentos Vivos

| Seção deste documento | Documento vivo relacionado |
|----------------------|---------------------------|
| §2 — Alicerces documentais | Todos os docs de baseline (Docs 01–15) |
| §4 — Sprint 0 | `docs/sprints/sprint-00/` |
| §5 — Sprint 1 | `docs/sprints/sprint-01/` |
| §6 — Sprint 2 | `docs/sprints/sprint-02/` |
| §7 — Sprint 3 | `docs/sprints/sprint-03/` |
| §8 — Sprint 3.5 | `docs/sprints/sprint-03-5/` |
| §9 — Sprint 4 | `docs/sprints/sprint-04/` (em construção) |
| §11 — Qualidade | `docs/09_Qualidade_Testes.md` |
| §13 — Motor matemático | `docs/baseline/03_Regras_de_Negocio.md`, `docs/15_Casos_de_Teste_Matematicos.md` |
| §14 — Camada educacional | `docs/08_Conteudo_Educacional.md` |
| §16 — Roadmap e MVP | `docs/10_Roadmap.md`, `docs/12_Plano_Operacional.md` |
| §19 — Rastreabilidade | `docs/19_Matriz_Rastreabilidade.md` |
| §21 — Índice de docs | `docs/00_INDICE_GERAL.md`, `docs/_meta/living_docs.json` |

---

*Este documento foi criado na Sprint 4, fase documental (2026-05-06), na branch `docs/jornada-plataforma-educacional-financeira`. Ele registra a história do projeto até o estado da Sprint 4/F1-A, inclusive.*
