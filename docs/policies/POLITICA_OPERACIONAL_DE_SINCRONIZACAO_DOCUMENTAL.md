# POLÍTICA OPERACIONAL DE SINCRONIZAÇÃO DOCUMENTAL

**Versão:** 1.0.0
**Data:** 2026-04-17
**Status:** VIGENTE

---

## 1. Finalidade

Esta política define como a documentação do projeto deve ser
materializada, versionada, sincronizada, atualizada e auditada nos
repositórios local e remoto.

O objetivo é impedir drift documental, perda de rastreabilidade,
divergência entre código e documentação, e dependência de arquivos
externos não governados pelo repositório.

---

## 2. Regra-mãe

Todo documento vivo do projeto deve existir no repositório oficial, em
caminho canônico, versionado em Git e sincronizado com o estado real do
código.

Nenhuma mudança relevante pode ser considerada completa se:

- alterar código e não tratar a documentação viva impactada;
- alterar documentação e não registrar o impacto correspondente;
- depender apenas de planilha, anexo externo ou conversa para representar o estado do projeto.

---

## 3. O que significa "subir documento"

Para este projeto, "subir documento" significa obrigatoriamente:

1. materializar o arquivo no caminho oficial do repositório;
2. versionar no Git local;
3. enviar ao remoto via commit/push;
4. atualizar os registros documentais impactados, incluindo quando aplicável:
   - `docs/_meta/living_docs.json`
   - índices documentais
   - meta-documentação
   - artefatos de sprint
   - matrizes de sincronização documental

---

## 4. Fontes documentais externas validadas que DEVEM ser migradas ou reconciliadas

A Claude Code deve tratar como obrigação operacional a migração ou
reconciliação no repositório dos documentos atuais e validados que ainda
estejam fora do repo oficial.

### 4.1 Pacote de auditoria documental

Origem externa validada:

- `AUDITORIA_PROMPT_1_FINAL/docs/**`
- `AUDITORIA_PROMPT_1_FINAL/docs/20_ADR/**`
- `AUDITORIA_PROMPT_1_FINAL/docs/baseline/**`
- `AUDITORIA_PROMPT_1_FINAL/docs/qualidade/**`
- `AUDITORIA_PROMPT_1_FINAL/docs/_meta/living_docs.json`

Regra:

- o conteúdo canônico deve existir no repositório em `docs/` e subpastas oficiais;
- se já existir versão correspondente no repo, a Claude Code deve reconciliar conteúdo, caminho e registro, não duplicar cegamente.

### 4.2 Pacote do gate forense

Origem externa validada:

- `GATE_FORENSE_PROMPT_2/*.md`

Regra:

- esses documentos devem ser preservados no repositório em localização
  oficial de baseline/anexos/governança definida pelo projeto;
- não podem permanecer apenas como arquivos soltos fora do repo.

### 4.3 Prompt-Mestre e baseline de governança

Origem externa validada:

- `Prompts/PROMPT-MESTRE DE DESENVOLVIMENTO v2.0 — PÓS-GATE FORENSE.docx`

Regra:

- o Prompt-Mestre deve existir no repositório em sua forma canônica governada;
- o arquivo externo pode ser preservado como anexo/baseline de referência;
- o conteúdo do Prompt-Mestre NÃO pode ser alterado em PR comum.

### 4.4 Artefatos operacionais auxiliares

Origem externa validada:

- `Documentação Inicial/backlog_operacional_acompanhamento.xlsx`
- `Relatorio_Sprint0_FORENSE.docx`
- `Relatorio_Sprint0_Plataforma_Educacional_Financeira.docx`

Regra:

- a planilha deve ser preservada e atualizada como artefato operacional auxiliar;
- os relatórios de sprint devem existir em forma canônica no repositório dentro de `docs/sprints/`;
- os arquivos `.docx` podem ser preservados como anexos/evidências,
  mas não substituem os documentos markdown canônicos da sprint.

---

## 5. O que NÃO deve ser migrado para a documentação oficial

Não devem ser tratados como documentação oficial do projeto:

- `.pytest_cache/**`
- `__pycache__/**`
- `*.pyc`
- caches transitórios
- artefatos temporários gerados por ferramenta
- arquivos redundantes sem função documental oficial

Esses itens não devem entrar na árvore documental viva do projeto.

---

## 6. Atualização obrigatória por mudança relevante

Toda mudança relevante deve atualizar, no mesmo ciclo:

- código impactado;
- testes impactados;
- documentos vivos impactados;
- artefatos da sprint, quando aplicável;
- registros/meta-documentos impactados;
- planilha operacional, quando houver mudança de status, pendência, gate, entregável ou evidência.

---

## 7. Documentos que tendem a exigir atualização frequente

Quando impactados, devem ser atualizados prioritariamente:

- `docs/04_Arquitetura_de_Software.md`
- `docs/05_Modelagem_de_Dados.md`
- `docs/06_API_e_Contratos.md`
- `docs/07_UX_UI_e_Navegacao.md`
- `docs/08_Conteudo_Educacional.md`
- `docs/09_Qualidade_Testes.md`
- `docs/12_Plano_Operacional.md`
- `docs/13_Backlog_Tecnico.md`
- `docs/14_Especificacao_Fisica_Dados.md`
- `docs/16_Design_System.md`
- `docs/17_Infra_Seguranca_Deploy.md`
- `docs/19_Matriz_Rastreabilidade.md`
- `docs/20_Catalogo_ADR.md`
- `docs/adr/INDEX.md`
- `docs/23_Observabilidade.md`
- `docs/24_Runbooks.md`
- `docs/25_Release_Readiness.md`
- `docs/26_Seeds_Fixtures.md`
- `docs/27_Versionamento_API.md`
- `docs/qualidade/AGENTE_DE_ANALISE_DE_IMPACTO.md`
- `docs/qualidade/PIPELINE_E_QUALITY_GATES.md`
- `docs/qualidade/PADROES_DE_IMPLEMENTACAO.md`

Apêndices vivos de documentos híbridos também devem ser atualizados quando impactados.

---

## 8. Prompt-Mestre

O Prompt-Mestre é baseline governada.

Regra:

- não alterar em PR comum;
- não tratar como documento vivo ordinário;
- qualquer mudança exige rebaseline formal.

---

## 9. Artefatos obrigatórios de sprint

Cada sprint deve manter sua pasta oficial em:

`docs/sprints/sprint-XX/`

Com, no mínimo:

- `relatorio-execucao.md`
- `relatorio-forense.md` quando aplicável
- `validacao-oficial.md`
- `evidencias/`

Nenhuma sprint é considerada oficialmente encerrada sem `validacao-oficial.md`.

---

## 10. Bloco obrigatório nas respostas da Claude Code

A partir desta política, toda resposta relevante da Claude Code deve
conter um bloco chamado:

### IMPACTO DOCUMENTAL

Com os seguintes itens:

- documentos vivos impactados;
- arquivos de documentação criados/alterados;
- registros/meta-documentos atualizados;
- se a planilha foi atualizada ou não, e por quê;
- commit e push correspondentes;
- pendências documentais remanescentes, se houver.

---

## 11. Regra de bloqueio

Nenhuma rodada relevante deve ser considerada completa se ocorrer
qualquer um dos casos abaixo:

- documento vivo impactado não tratado;
- artefato externo validado ainda não migrado/reconciliado sem justificativa explícita;
- `living_docs.json` ou registro equivalente divergente do estado real;
- sprint sem artefatos obrigatórios;
- documentação canônica substituída por anexo externo;
- alteração indevida do Prompt-Mestre.

---

## 12. Prioridade operacional imediata

Antes de avançar funcionalmente na Sprint 01, a Claude Code deve tratar
como obrigação prioritária:

1. migrar ou reconciliar no repositório o conjunto canônico de
   documentos ainda ausentes ou incompletamente registrados;
2. equalizar `docs/_meta/living_docs.json` com os caminhos e
   documentos oficiais realmente existentes;
3. garantir que os anexos oficiais de auditoria, gate forense, baseline
   e planilha operacional estejam preservados em localização governada no repositório;
4. registrar essas ações no bloco `IMPACTO DOCUMENTAL` e nos artefatos da sprint correspondente.

---

## 13. Regra final

Neste projeto, governança documental não é acessória.

Código, documentação viva, rastreabilidade, artefatos de sprint e
evidências devem evoluir de forma sincronizada, auditável e versionada.

Nenhum avanço funcional justifica deixar o projeto documentalmente ingovernável.
