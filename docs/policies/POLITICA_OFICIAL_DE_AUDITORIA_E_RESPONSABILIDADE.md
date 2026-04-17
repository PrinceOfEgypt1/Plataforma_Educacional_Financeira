# POLÍTICA OFICIAL DE AUDITORIA E RESPONSABILIDADE DOS ARTEFATOS DE SPRINT

**Projeto:** Plataforma Educacional Financeira
**Versão:** 1.0
**Data:** 17 de abril de 2026
**Status:** VIGENTE

---

## 1. Finalidade

Esta política define a autoria, responsabilidade, fluxo de produção, revisão, aprovação e
versionamento dos artefatos oficiais de sprint da Plataforma Educacional Financeira. Seu objetivo
é impedir ambiguidade sobre:

- quem executa;
- quem relata a execução;
- quem audita;
- quem emite o veredito final;
- quais evidências são obrigatórias;
- quando uma sprint pode ser considerada oficialmente encerrada.

---

## 2. Princípios obrigatórios

Esta política segue os seguintes princípios do projeto:

1. documentação viva deve permanecer versionada no repositório;
2. toda mudança relevante deve avaliar e atualizar a documentação viva impactada;
3. a entrega da execução não equivale automaticamente à sua aprovação;
4. sucesso técnico não é sinônimo de sucesso de governança;
5. nenhuma sprint é considerada oficialmente encerrada sem evidência suficiente e veredito formal
   registrado.

---

## 3. Estrutura oficial de artefatos por sprint

Cada sprint aprovada ou em avaliação deve possuir uma pasta própria no repositório, no seguinte
padrão:

docs/sprints/sprint-XX/

Onde `XX` é o número da sprint com zero à esquerda. A pasta da sprint deve conter, no mínimo:

- `relatorio-execucao.md`
- `relatorio-forense.md` (quando aplicável)
- `validacao-oficial.md`
- `evidencias/`

Exemplo:
docs/sprints/sprint-00/
relatorio-execucao.md
relatorio-forense.md
validacao-oficial.md
evidencias/

---

## 4. Responsabilidade oficial por artefato

### 4.1 `relatorio-execucao.md`

**Responsável principal:** Claude Code

**Função:** Registrar a execução da sprint sob a perspectiva de implementação.

**Conteúdo mínimo obrigatório:**
- objetivo da sprint;
- escopo tratado;
- decisões técnicas;
- arquivos criados/alterados;
- testes criados/ajustados;
- quality gates executados;
- documentação atualizada;
- pendências honestamente declaradas;
- instruções de reprodução quando necessário.

**Regra:** Este documento não aprova a sprint. Ele apenas relata a execução.

---

### 4.2 `relatorio-forense.md`

**Responsável principal:** IA supervisora/auditora

**Função:** Registrar a auditoria técnica e documental da entrega da sprint, especialmente quando
houver:
- lacunas;
- adendos corretivos;
- necessidade de fechamento forense;
- divergência entre narrativa e evidência;
- necessidade de consolidação das provas.

**Conteúdo mínimo obrigatório:**
- escopo auditado;
- evidências analisadas;
- pontos aprovados;
- falhas, lacunas ou exageros identificados;
- pendências remanescentes;
- classificação da entrega;
- recomendação de homologação, homologação com ressalvas ou rejeição.

**Regra:** Este documento é obrigatório sempre que a auditoria identificar insuficiência,
inconsistência ou necessidade de saneamento complementar.

---

### 4.3 `validacao-oficial.md`

**Responsável principal:** IA supervisora/auditora

**Função:** Emitir o veredito oficial da sprint.

**Este é o documento de decisão final da sprint.**

**Conteúdo mínimo obrigatório:**
- identificação da sprint;
- artefatos avaliados;
- síntese executiva da validação;
- pendências reconhecidas;
- riscos residuais;
- veredito formal;
- condições para abertura da sprint seguinte.

**Status possíveis:**
- `APROVADA SEM RESSALVAS`
- `APROVADA COM RESSALVAS`
- `APROVADA COM LIBERAÇÃO CONDICIONADA`
- `NÃO APROVADA`

**Regra crítica:** Nenhuma sprint será considerada oficialmente encerrada sem a existência de
`validacao-oficial.md`.

---

### 4.4 `evidencias/`

**Responsabilidade operacional:** Claude Code

**Responsabilidade de qualificação/auditoria:** IA supervisora/auditora

**Função:** Armazenar as provas materiais da sprint.

**Exemplos de conteúdo:**
- saídas literais de comandos;
- logs de testes;
- logs de quality gates;
- exports OpenAPI;
- relatórios automáticos;
- capturas de tela;
- snapshots;
- relatórios de coverage;
- artefatos de build;
- arquivos auxiliares de validação.

**Regra:** A Claude Code produz e organiza as evidências. A IA supervisora define quais evidências
são obrigatórias, suficientes e válidas para auditoria e validação oficial.

---

## 5. Separação formal de papéis

### 5.1 Papel da Claude Code

A Claude Code é responsável por:
- implementar o trabalho técnico;
- criar e alterar código;
- executar testes;
- materializar documentação viva;
- produzir `relatorio-execucao.md`;
- reunir e salvar evidências em `evidencias/`;
- responder a adendos corretivos quando existirem.

### 5.2 Papel da IA supervisora/auditora

A IA supervisora é responsável por:
- avaliar criticamente a entrega da Claude Code;
- identificar exageros, lacunas, riscos e inconsistências;
- preparar prompts e adendos corretivos;
- produzir `relatorio-forense.md` quando necessário;
- produzir `validacao-oficial.md`;
- decidir o status final da sprint.

---

## 6. Fluxo oficial por sprint

### Etapa 1 — Execução

A Claude Code implementa o escopo da sprint, atualiza a documentação viva impactada, executa os
gates necessários e produz:
- `relatorio-execucao.md`
- `evidencias/`

### Etapa 2 — Auditoria

A IA supervisora analisa:
- código entregue;
- documentos atualizados;
- evidências;
- aderência ao Prompt-Mestre;
- aderência ao gate vigente;
- aderência ao escopo da sprint.

Se necessário, produz:
- `relatorio-forense.md`

### Etapa 3 — Validação oficial

Após auditoria suficiente, a IA supervisora emite:
- `validacao-oficial.md`

Somente após essa etapa a sprint pode ser tratada como oficialmente encerrada.

---

## 7. Regra de encerramento real

Uma sprint **não** é considerada encerrada apenas porque:
- a Claude Code afirmou que concluiu;
- houve commit;
- houve merge;
- os checks ficaram verdes;
- um relatório narrativo foi gerado.

A sprint só é considerada oficialmente encerrada quando:

1. os artefatos obrigatórios da sprint existirem no repositório;
2. as evidências mínimas estiverem disponíveis;
3. a documentação viva impactada tiver sido tratada;
4. a auditoria tiver sido realizada;
5. o `validacao-oficial.md` tiver sido emitido.

---

## 8. Regra de convivência entre os relatórios

Os artefatos têm funções diferentes e complementares:
- `relatorio-execucao.md` não substitui `relatorio-forense.md`
- `relatorio-forense.md` não substitui `validacao-oficial.md`
- `validacao-oficial.md` prevalece como decisão oficial da sprint

Quando coexistirem, a precedência interpretativa é:

1. `validacao-oficial.md`
2. `relatorio-forense.md`
3. `relatorio-execucao.md`
4. `evidencias/`

---

## 9. Atualização obrigatória

Sempre que houver nova sprint:
- deve ser criada a pasta `docs/sprints/sprint-XX/`;
- os artefatos aplicáveis devem ser materializados;
- o índice documental do projeto deve ser atualizado, se aplicável;
- o backlog/planejamento da sprint seguinte deve respeitar o veredito da sprint anterior.

---

## 10. Regras de nomenclatura e consistência

Padrão obrigatório:
- diretório em minúsculas: `docs/sprints/`
- sprint com zero à esquerda: `sprint-00`, `sprint-01`, `sprint-02`
- nomes de arquivos fixos:
  - `relatorio-execucao.md`
  - `relatorio-forense.md`
  - `validacao-oficial.md`

Isso evita drift, ambiguidade e variações desnecessárias de nomenclatura.

---

## 11. Relação com a documentação viva do projeto

Os artefatos de sprint são documentos vivos de governança operacional. Eles **não** substituem:
- arquitetura;
- API;
- modelagem;
- design system;
- roadmap;
- backlog;
- runbooks;
- ADRs;
- documentação técnica ou funcional.

Eles existem para registrar:
- o que foi feito;
- o que foi auditado;
- o que foi aprovado;
- e em que condições o projeto pode seguir.

---

## 12. Regra final

A Plataforma Educacional Financeira adota, a partir desta política, o seguinte critério oficial:

> **Nenhuma sprint será considerada oficialmente encerrada sem `validacao-oficial.md`.**

E:

> **A sprint seguinte só pode ser aberta de forma disciplinada se respeitar as pendências,
> restrições e condicionantes registradas no `validacao-oficial.md` da sprint anterior.**
