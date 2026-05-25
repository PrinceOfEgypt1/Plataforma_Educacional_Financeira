# PEF — SPRINT 4/F2
## Prompt adaptado ao TEMPLATE OFICIAL — Prompt com Checklist Operacional e Auditável

```text
============================================================
PEF — SPRINT 4/F2
SERVICE + API + CONTRATO + OPENAPI DO DIAGNÓSTICO FINANCEIRO
PROMPT COM CHECKLIST OPERACIONAL E AUDITÁVEL
============================================================

## 0. CABEÇALHO OPERACIONAL

Projeto: Plataforma Educacional Financeira
Repo oficial: /home/moses/workspace/Plataforma_Educacional_Financeira
Branch obrigatória: sprint-4/f2-service-api-contrato-openapi-diagnostico-claude
Base obrigatória: main = origin/main = 8571b46
Tipo: implementação backend vertical do módulo Diagnóstico Financeiro
Executor: Claude Code
Auditoria: Camaleão/Moisés
Materialização autorizada: commit local somente
Push: proibido
PR: proibido
Merge: proibido

Regra central:
Esta F2 deve expor o domínio puro de Diagnóstico Financeiro via service, schemas, API, contrato, OpenAPI, testes e evidências, sem alterar frontend, pipeline, fórmulas ou arquitetura fora do escopo.

============================================================
## 1. MISSÃO EM UMA FRASE
============================================================

Implementar a fatia backend/API do Diagnóstico Financeiro em `POST /api/v1/diagnostic/analyze`, preservando o domínio puro como fonte oficial da verdade matemática, com OpenAPI, testes, documentação viva e evidências auditáveis.

============================================================
## 2. PAPEL DA IA EXECUTORA
============================================================

Você atuará como:

- Senior Backend Engineer;
- API Contract Engineer;
- QA/Test Engineer;
- Technical Writer de evidências forenses;
- executor local disciplinado.

Comportamento obrigatório:

- seguir padrões reais do repositório;
- não inventar arquitetura paralela;
- não duplicar matemática do domínio;
- não aprovar a própria entrega;
- não declarar vertical slice completo antes de F3/F4;
- não fabricar evidências;
- não fazer push;
- não criar PR;
- não fazer merge.

============================================================
## 3. CONTEXTO NECESSÁRIO
============================================================

A Sprint 4/F2 deve transformar o domínio puro do Diagnóstico Financeiro já implementado em `backend/app/domain/diagnostic/` em uma API consumível pelo frontend futuro da F3.

A fatia deve incluir:

- service backend;
- schemas Pydantic;
- endpoint REST;
- contrato HTTP;
- OpenAPI sincronizado;
- testes unitários, integração e contrato;
- evidências de execução;
- documentação viva mínima impactada.

Endpoint esperado:

`POST /api/v1/diagnostic/analyze`

Esta F2 não conclui a vertical slice completa, pois frontend e conteúdo educacional ainda dependem das próximas fatias.

============================================================
## 4. FASE 0 OBRIGATÓRIA — PROVA DE BASELINE
============================================================

Antes de qualquer alteração, execute:

```bash
cd /home/moses/workspace/Plataforma_Educacional_Financeira

git fetch --all --prune

echo "== FASE 0 — ESTADO INICIAL =="
pwd
git status -sb
git branch --show-current
git rev-parse --short HEAD
git rev-parse --short origin/main
git log --oneline --decorate -8

echo
echo "== PROVA HEAD = origin/main =="
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo "OK: HEAD local = origin/main"

echo
echo "== VERIFICAR RESÍDUOS NÃO VERSIONADOS =="
git status --porcelain
```

Critérios obrigatórios:

- branch inicial: `main`;
- HEAD local: `8571b46`;
- origin/main: `8571b46`;
- working tree sem alterações versionadas.

Se aparecer `.claude/` como untracked:

- registrar como resíduo local operacional;
- não apagar;
- não usar `git clean`;
- não usar `rm -rf`.

Se a baseline estiver incorreta, parar imediatamente e responder:

```text
PARADA OPERACIONAL: baseline inválida para iniciar Sprint 4/F2.

Esperado:
main = origin/main = 8571b46

Encontrado:
[cole saída literal]

Nenhum arquivo foi alterado.
```

============================================================
## 5. CRIAR BRANCH DA F2
============================================================

Se a Fase 0 estiver correta:

```bash
git switch -c sprint-4/f2-service-api-contrato-openapi-diagnostico-claude
```

Regras:

- não criar outra branch;
- não trabalhar direto na `main`.

============================================================
## 6. FONTES OBRIGATÓRIAS
============================================================

Leia e use como fonte antes de implementar:

Documentos:

- `docs/projeto/DA_VISAO_AO_PRODUTO__A_JORNADA_DA_PLATAFORMA_EDUCACIONAL_FINANCEIRA.md`
- `docs/sprints/sprint-04/00-plano/PLANO_EXECUCAO_SPRINT_4.md`
- `docs/baseline/03_Regras_de_Negocio.md`
- `docs/06_API_e_Contratos.md`
- `docs/09_Qualidade_Testes.md`
- `docs/15_Casos_de_Teste_Matematicos.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`

Evidências da Sprint 4 já materializadas:

- `docs/sprints/sprint-04/evidencias/F0-git-baseline.md`
- `docs/sprints/sprint-04/evidencias/F0-inventario-base.md`
- `docs/sprints/sprint-04/evidencias/F0-analise-escopo-sprint-4.md`
- `docs/sprints/sprint-04/evidencias/F0.1-pesquisa-diagnostico-financeiro.md`
- `docs/sprints/sprint-04/evidencias/F0.1-decisao-thresholds-diagnostico.md`
- `docs/sprints/sprint-04/evidencias/F0.1-A-adendo-corretivo.md`
- `docs/sprints/sprint-04/evidencias/F1-git-baseline.md`
- `docs/sprints/sprint-04/evidencias/F1-dominio-regras.md`
- `docs/sprints/sprint-04/evidencias/F1-testes-unitarios.md`

Domínio puro já existente:

- `backend/app/domain/diagnostic/__init__.py`
- `backend/app/domain/diagnostic/_rounding.py`
- `backend/app/domain/diagnostic/rules.py`
- `backend/app/domain/diagnostic/analyzer.py`
- `backend/tests/unit/domain/diagnostic/`

Padrões existentes de service/API/testes em juros e amortização:

- `backend/app/services/`
- `backend/app/api/v1/`
- `backend/app/schemas/`
- `backend/tests/unit/services/`
- `backend/tests/integration/api/`
- `backend/tests/contract/`

Regra:
A implementação deve seguir os padrões reais do repositório. Se uma fonte obrigatória não existir, registre e pare se ela for essencial para não inventar arquitetura.

============================================================
## 7. ESCOPO PERMITIDO
============================================================

Você pode criar ou alterar apenas o necessário para a F2:

- `backend/app/schemas/diagnostic/`
- `backend/app/services/diagnostic/`
- `backend/app/api/v1/diagnostic.py`
- `backend/app/api/v1/router.py`
- `backend/tests/unit/services/diagnostic/`
- `backend/tests/integration/api/diagnostic/`
- `backend/tests/contract/`
- `docs/api/openapi.json`
- `docs/06_API_e_Contratos.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`
- `docs/sprints/sprint-04/evidencias/`

Se a estrutura real do projeto usar nomes diferentes, siga o padrão real existente e explique no relatório.

============================================================
## 8. ESCOPO PROIBIDO
============================================================

É proibido alterar:

- `frontend/`
- `backend/app/domain/interest/`
- `backend/app/domain/amortization/`
- `backend/app/domain/diagnostic/`, exceto se houver bug comprovado e aprovado no relatório antes;
- `backend/app/db/`
- `backend/app/repositories/`
- `.github/`
- `scripts/`
- `Makefile`
- `package.json`
- `pnpm-lock.yaml`
- `pyproject.toml`
- `docker-compose*`
- `Dockerfile*`
- `docs/operacional/`

Também é proibido:

- iniciar frontend `/diagnostico`;
- criar componentes React;
- criar conteúdo educacional da F4;
- alterar planilha;
- alterar pipeline;
- alterar workflows;
- criar arquitetura horizontal genérica;
- criar abstrações amplas fora do diagnóstico;
- duplicar matemática do domínio no service ou na API;
- usar `float` para cálculo financeiro;
- usar `Any` indevido;
- usar `type: ignore`;
- fabricar evidências;
- fazer push;
- criar PR;
- fazer merge.

============================================================
## 9. INVARIANTES QUE NÃO PODEM REGREDIR
============================================================

Preservar obrigatoriamente:

- backend como fonte oficial da verdade matemática;
- domínio `diagnostic` como camada de cálculo/regras;
- envelope oficial de sucesso/erro;
- padrão `/api/v1`;
- contratos já existentes de juros e amortização;
- OpenAPI oficial em `docs/api/openapi.json`;
- documentação viva impactada;
- request_id/correlation id se já houver padrão;
- testes existentes;
- qualidade de tipagem;
- separação entre service, schema, API e domínio;
- ausência de frontend nesta fatia.

Qualquer remoção relevante de teste, contrato ou documentação exige matriz de equivalência e justificativa. Preferencialmente, não remover nada nesta F2.

============================================================
## 10. CONTRATO FUNCIONAL DA API
============================================================

Criar endpoint:

`POST /api/v1/diagnostic/analyze`

Request esperado, em português técnico coerente com o domínio:

```json
{
  "renda_mensal": "5000.00",
  "total_despesas_fixas": "2000.00",
  "total_despesas_variaveis": "800.00",
  "total_dividas_mensais": "500.00",
  "total_reserva_atual": "4000.00"
}
```

A representação exata deve seguir o padrão real dos schemas existentes: `Decimal`, `condecimal`, strings serializadas ou convenção já usada no projeto. Não inventar padrão novo se juros/amortização já estabeleceram um.

Response de sucesso deve seguir o envelope oficial do projeto:

```json
{
  "success": true,
  "message": "...",
  "data": {
    "renda_mensal": "5000.00",
    "total_despesas_fixas": "2000.00",
    "total_despesas_variaveis": "800.00",
    "total_dividas_mensais": "500.00",
    "total_reserva_atual": "4000.00",
    "sobra_mensal": "1700.00",
    "despesas_essenciais_mensais": "2800.00",
    "comprometimento_percentual": "10.00",
    "sobra_percentual": "34.00",
    "reserva_em_meses": "1.43",
    "comprometimento_nivel": "baixo",
    "reserva_nivel": "insuficiente",
    "sobra_nivel": "boa",
    "pontos_comprometimento": 3,
    "pontos_reserva": 1,
    "pontos_sobra": 3,
    "score": 7,
    "saude_nivel": "boa",
    "alertas": [
      {
        "code": "RESERVA_INSUFICIENTE",
        "level": "warning",
        "dimension": "reserva"
      }
    ]
  },
  "meta": {
    "request_id": "..."
  }
}
```

O formato exato do envelope, meta, message, erros e serialização Decimal deve obedecer ao padrão real já existente no backend.

============================================================
## 11. CASOS CANÔNICOS OBRIGATÓRIOS
============================================================

A F2 deve exercitar obrigatoriamente os casos DG-01 e DG-02 do Doc 15.

## 11.1 DG-01 — cenário saudável com reserva insuficiente

Entrada:

- `renda_mensal = 5000.00`
- `total_despesas_fixas = 2000.00`
- `total_despesas_variaveis = 800.00`
- `total_dividas_mensais = 500.00`
- `total_reserva_atual = 4000.00`

Resultado esperado:

- `sobra_mensal = 1700.00`
- `comprometimento_percentual = 10.00`
- `reserva_em_meses = 1.43`
- `sobra_percentual = 34.00`
- `comprometimento_nivel = baixo`
- `reserva_nivel = insuficiente`
- `sobra_nivel = boa`
- `score = 7`
- `saude_nivel = boa`
- alertas contém `RESERVA_INSUFICIENTE`

## 11.2 DG-02 — cenário crítico por sobra negativa e reserva crítica

Entrada:

- `renda_mensal = 3000.00`
- `total_despesas_fixas = 2200.00`
- `total_despesas_variaveis = 700.00`
- `total_dividas_mensais = 500.00`
- `total_reserva_atual = 0.00`

Resultado esperado:

- `sobra_mensal = -400.00`
- `comprometimento_percentual = 16.67`
- `reserva_em_meses = 0.00`
- `sobra_percentual = -13.33`
- `comprometimento_nivel = baixo`
- `reserva_nivel = critica`
- `sobra_nivel = negativa`
- `score = 3`
- `saude_nivel = critica`
- alertas contém `RESERVA_CRITICA` e `SOBRA_NEGATIVA`

============================================================
## 12. REQUISITOS TÉCNICOS
============================================================

## 12.1 Service

Criar service específico do diagnóstico, seguindo padrão real do projeto.

Regras:

- service chama o domínio;
- service não duplica matemática;
- service não recalcula thresholds;
- service não importa FastAPI diretamente, salvo se padrão existente permitir;
- service não conhece frontend;
- service não acessa banco;
- service não cria persistência;
- service não usa `float`;
- service não usa `Any`;
- service não usa `type: ignore`.

O service deve receber dados já validados pelo schema e chamar `analisar_diagnostico(...)` do domínio.

Erros de domínio (`DomainValidationError`) devem ser convertidos para o padrão de erro HTTP já existente do projeto, respeitando RFC 7807 / envelope de erro adotado.

## 12.2 Schemas

Criar schemas Pydantic v2 para:

- `DiagnosticAnalyzeRequest`
- `DiagnosticAnalyzeResponseData`
- `DiagnosticAlertResponse`

ou nomes equivalentes coerentes com o padrão do projeto.

Regras:

- usar `Decimal`;
- validar entradas monetárias conforme domínio;
- não aceitar `float` silenciosamente se o padrão do projeto rejeitar;
- gerar OpenAPI clara;
- incluir examples de DG-01 e/ou DG-02 quando o padrão do projeto permitir;
- manter nomes em `snake_case` se esse for o padrão dos contratos existentes.

Campos obrigatórios de entrada:

- `renda_mensal`
- `total_despesas_fixas`
- `total_despesas_variaveis`
- `total_dividas_mensais`
- `total_reserva_atual`

Campos obrigatórios de saída devem refletir o `DiagnosticoResultado` do domínio.

## 12.3 API / Router

Criar arquivo de rota específico se ainda não existir:

- `backend/app/api/v1/diagnostic.py`

Registrar no router v1:

- `backend/app/api/v1/router.py`

Regras:

- prefixo esperado: `/diagnostic`;
- endpoint esperado: `/analyze`;
- método: `POST`;
- rota final: `POST /api/v1/diagnostic/analyze`;
- tags coerentes: `Diagnostic` ou `Diagnóstico`, seguindo padrão existente;
- `response_model` coerente com envelope do projeto;
- erros convertidos para contrato oficial;
- request_id/correlation id preservado conforme Sprint 1.

Não alterar rotas de juros ou amortização, salvo se o router central exigir apenas inclusão do novo router.

## 12.4 OpenAPI

Atualizar o OpenAPI oficial:

- `docs/api/openapi.json`

Use o script/fluxo existente no projeto. Se houver script como:

```bash
python scripts/export_openapi.py
```

ou comando equivalente, use o padrão real do repositório.

O OpenAPI deve conter:

- `POST /api/v1/diagnostic/analyze`;
- schemas do request;
- schemas do response;
- schemas de erro conforme padrão;
- examples quando aplicável;
- tags coerentes.

Registrar evidência da geração/validação do OpenAPI.

============================================================
## 13. TESTES OBRIGATÓRIOS
============================================================

Criar testes em três níveis, seguindo padrões reais do projeto.

## 13.1 Testes unitários de service

Criar em:

- `backend/tests/unit/services/diagnostic/`

Cobrir:

- DG-01;
- DG-02;
- propagação/conversão de `DomainValidationError`;
- não duplicação de regra matemática no service;
- tipos de saída;
- alertas;
- `Decimal` preservado.

## 13.2 Testes de integração da API

Criar em:

- `backend/tests/integration/api/diagnostic/`

Cobrir:

- `POST /api/v1/diagnostic/analyze` com DG-01 retorna 200;
- `POST /api/v1/diagnostic/analyze` com DG-02 retorna 200;
- payload inválido retorna erro no padrão oficial;
- renda <= 0 retorna erro coerente;
- despesas essenciais = 0 retorna erro coerente;
- valores negativos indevidos retornam erro coerente;
- response envelope mantém `success/data/meta`;
- request_id/correlation id respeitado se já houver padrão.

## 13.3 Testes de contrato

Criar ou atualizar em:

- `backend/tests/contract/`

Cobrir:

- endpoint existe no OpenAPI;
- `POST /api/v1/diagnostic/analyze` está documentado;
- schemas esperados estão presentes;
- resposta segue envelope oficial;
- contrato não quebra endpoints já existentes.

============================================================
## 14. DOCUMENTAÇÃO E EVIDÊNCIAS
============================================================

## 14.1 Documentação permitida na F2

Atualizar apenas o necessário:

- `docs/06_API_e_Contratos.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/_meta/living_docs.json`

Atualizações esperadas:

- Doc 06: registrar endpoint `POST /api/v1/diagnostic/analyze`;
- Doc 19: adicionar/promover rastreabilidade de `RF-DIAG-001` para F2 parcialmente ou conforme padrão real;
- `living_docs.json`: nota de atualização nos docs impactados, se esse for o padrão já adotado.

Não atualizar Doc 08 nesta F2.
Não criar conteúdo educacional.
Não declarar `RF-DIAG-001` 100% concluído se frontend/conteúdo ainda faltam.
Use status honesto: backend/API concluído; vertical slice ainda em andamento até F3/F4.

## 14.2 Evidências obrigatórias da F2

Criar evidências em:

- `docs/sprints/sprint-04/evidencias/`

Arquivos sugeridos:

- `F2-git-baseline.md`
- `F2-service-api-contrato.md`
- `F2-openapi.md`
- `F2-testes.md`

As evidências devem conter saídas reais ou resumos com comandos executados. Não criar placeholders.

Registrar no mínimo:

- branch;
- HEAD;
- origin/main;
- arquivos alterados;
- endpoint criado;
- OpenAPI atualizado;
- testes executados;
- resultado dos gates;
- impact agent;
- pendências honestas.

============================================================
## 15. GATES OBRIGATÓRIOS LOCAIS
============================================================

Executar, no mínimo:

```bash
cd /home/moses/workspace/Plataforma_Educacional_Financeira

backend/.venv/bin/ruff check backend
backend/.venv/bin/ruff format --check backend

cd backend
.venv/bin/mypy .
.venv/bin/bandit -r app
.venv/bin/pytest tests/unit/services/diagnostic -q
.venv/bin/pytest tests/integration/api/diagnostic -q
.venv/bin/pytest tests/contract -q
.venv/bin/pytest tests/unit -q
.venv/bin/pytest tests/integration -q

cd ..
make impact || backend/.venv/bin/python scripts/impact_analysis_guard.py || true
```

Também executar o comando real de geração/validação do OpenAPI do projeto.

Se algum alvo não existir, não inventar sucesso. Registrar:

```text
COMANDO NÃO EXECUTADO: [motivo real]
```

Se algum gate falhar, parar e reportar.

============================================================
## 16. VALIDAÇÕES ADICIONAIS OBRIGATÓRIAS
============================================================

Após implementar, executar:

```bash
git diff --name-status origin/main..HEAD
```

Confirmar que o escopo não contém:

- `frontend/`
- `.github/`
- `docs/operacional/`
- `package.json`
- `pnpm-lock.yaml`
- `docker*`
- `Dockerfile*`

Verificar endpoint no OpenAPI:

```bash
grep -n '"/api/v1/diagnostic/analyze"' docs/api/openapi.json
```

Verificar ausência de padrões proibidos no novo código:

```bash
grep -R "type: ignore\|from typing import Any\|: Any\|dict\[\]" \
  backend/app/schemas/diagnostic \
  backend/app/services/diagnostic \
  backend/app/api/v1/diagnostic.py \
  backend/tests/unit/services/diagnostic \
  backend/tests/integration/api/diagnostic || true
```

Se houver uso em teste estritamente necessário, justificar.

============================================================
## 17. CRITÉRIOS DE ACEITE
============================================================

A F2 só será aceita para auditoria se:

- branch correta criada a partir de `8571b46`;
- endpoint `POST /api/v1/diagnostic/analyze` implementado;
- service chama domínio puro `diagnostic`;
- schemas Pydantic criados;
- OpenAPI atualizado;
- DG-01 e DG-02 cobertos por service/API;
- erros de domínio convertidos ao contrato oficial;
- testes unitários, integração e contrato criados;
- docs 06/19 atualizados de forma honesta;
- evidências F2 criadas;
- gates locais executados;
- Impact Agent executado;
- nenhum frontend alterado;
- nenhuma planilha alterada;
- nenhum push/PR/merge feito;
- commit local criado.

============================================================
## 18. CRITÉRIOS DE REJEIÇÃO AUTOMÁTICA
============================================================

Rejeitar se:

- trabalhar fora do repo oficial;
- trabalhar direto na `main`;
- base diferente de `8571b46`;
- alterar frontend;
- alterar planilha;
- alterar pipeline;
- alterar workflows;
- duplicar matemática do domínio no service/API;
- usar `float` em cálculo financeiro;
- usar `Any/type ignore` em produção;
- criar endpoint fora do padrão `/api/v1`;
- não atualizar OpenAPI;
- criar evidência fabricada;
- declarar vertical slice completo antes de F3/F4;
- fazer push;
- criar PR;
- fazer merge.

============================================================
## 19. PROTOCOLO DE FALHA
============================================================

Pare imediatamente e responda com `PARADA OPERACIONAL` se:

- baseline estiver inválida;
- fonte obrigatória essencial não existir;
- comando essencial falhar;
- precisar alterar escopo proibido;
- teste/gate bloqueante falhar;
- OpenAPI não puder ser gerado;
- não for possível criar evidências reais;
- não for possível criar commit local limpo.

Formato:

```text
PARADA OPERACIONAL: [motivo]

O que foi tentado:
[...]

Evidência:
[saída literal]

Arquivos alterados:
[...]

Próxima ação recomendada:
[...]
```

============================================================
## 20. COMMIT LOCAL
============================================================

Ao final, se tudo estiver correto:

```bash
git add \
  backend/app/schemas/diagnostic \
  backend/app/services/diagnostic \
  backend/app/api/v1/diagnostic.py \
  backend/app/api/v1/router.py \
  backend/tests/unit/services/diagnostic \
  backend/tests/integration/api/diagnostic \
  backend/tests/contract \
  docs/api/openapi.json \
  docs/06_API_e_Contratos.md \
  docs/19_Matriz_Rastreabilidade.md \
  docs/_meta/living_docs.json \
  docs/sprints/sprint-04/evidencias
```

Ajustar o `git add` conforme arquivos reais alterados.

Não adicionar:

- `.claude/`;
- planilha;
- arquivos fora do escopo.

Commit sugerido:

```bash
git commit -m "feat(api): expor diagnostico financeiro"
```

Não fazer push.
Não criar PR.
Não fazer merge.

============================================================
## 21. GATE ANTI-ENTREGA RUIM
============================================================

Antes de responder, confirme objetivamente:

1. A Fase 0 foi executada e registrada?
2. A branch correta foi criada?
3. Todas as fontes obrigatórias foram lidas ou ausências foram declaradas?
4. O endpoint foi implementado no path correto?
5. O service chama o domínio puro?
6. Os schemas usam o padrão real do projeto?
7. DG-01 e DG-02 foram cobertos?
8. OpenAPI foi atualizado?
9. Testes unitários foram executados?
10. Testes de integração foram executados?
11. Testes de contrato foram executados?
12. Docs vivos foram atualizados?
13. Evidências F2 foram criadas?
14. Impact Agent foi executado?
15. Escopo proibido ficou intacto?
16. Não houve push, PR ou merge?
17. Commit local foi criado?
18. Pendências honestas foram declaradas?
19. A entrega está pronta para auditoria Camaleão/Moisés?
20. A IA não aprovou a própria entrega?

Se qualquer resposta for “não”, “parcial” ou “não verificado”, corrigir antes de entregar ou declarar bloqueio.

============================================================
## 22. RESPOSTA FINAL ESPERADA
============================================================

Responder nesta ordem:

1. Resumo executivo
2. Prova da Fase 0
3. Branch criada
4. Documentos e padrões lidos
5. Arquivos criados/alterados
6. Endpoint implementado
7. Schemas criados
8. Service criado
9. OpenAPI atualizado
10. Testes criados/executados
11. Evidências F2 criadas
12. Docs vivos/rastreabilidade atualizados
13. Gates executados com resultados
14. Impact Agent
15. Escopo negativo confirmado
16. Commit local
17. Pendências honestas
18. Veredito: pronto para auditoria Camaleão/Moisés ou bloqueado

============================================================
## 23. REGRA FINAL
============================================================

Você é executor local.

Não aprove sua própria entrega.
Não materialize em main.
Não faça push.
Não crie PR.
Não faça merge.

A entrega correta termina com:

- commit local criado;
- sem push;
- sem PR;
- sem merge;
- pronto para auditoria Camaleão/Moisés.
============================================================
FIM DO PROMPT
============================================================
```
