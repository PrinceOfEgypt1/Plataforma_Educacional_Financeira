# DOCUMENTO 25 — RELEASE READINESS E CHECKLISTS

**Versão:** 1.0
**Status:** VIVO

---

## 1. Critério geral de pronto-para-release

Uma release **só pode** ser publicada se **todos** os critérios abaixo estiverem verdes.

## 2. Checklist mestre de release

### 2.1 Qualidade
- [ ] Todos os gates do pipeline (Doc 07 §4.3 e §4.5) verdes.
- [ ] Cobertura mantida ou aumentada.
- [ ] Suite de regressão (financial, pedagogical, visual, contract) verde.
- [ ] Mutation score do domain ≥ 80%.
- [ ] Sem flakies abertos > 5 dias úteis.

### 2.2 Documentação
- [ ] Todos os documentos vivos referenciados pelo agente de impacto atualizados.
- [ ] CHANGELOG atualizado a partir de commits convencionais.
- [ ] ADRs novas em estado `accepted`.
- [ ] Doc 19 (rastreabilidade) sem linhas em `pending` para o escopo da release.

### 2.3 Segurança e compliance
- [ ] SAST/dependency scan sem vulnerabilidades críticas em aberto.
- [ ] DPIA leve preenchida para qualquer novo dado pessoal.
- [ ] LGPD §10 (Doc 22) verificado.

### 2.4 Operação
- [ ] Plano de rollback escrito.
- [ ] Migrations reversíveis testadas em homologação.
- [ ] Smoke pós-deploy preparado.
- [ ] Runbooks novos publicados (se houver alerta novo).
- [ ] Janela de release combinada e comunicada.

### 2.5 UX/UI/Conteúdo
- [ ] Snapshot visual aceito.
- [ ] Acessibilidade WCAG 2.2 AA validada nas telas tocadas.
- [ ] Conteúdo educacional novo passou por revisão editorial.

### 2.6 Aprovação
- [ ] Revisor humano aprovou release.
- [ ] Tag `vYYYY.MM.DD[-rcN]` criada.

## 3. Checklists por módulo (referência)

Cada módulo (`interest`, `amortization`, `financing`, `loans`, `credit_card`, `late_payment`, `indicators`, `invest_vs_debt`, `education`, `export`) tem um checklist próprio com seus testes e docs vivos. O agente de impacto consolida automaticamente.

## 4. Processo de release

1. Abrir branch `release/vYYYY.MM.DD-rcN` partir de `main`.
2. Rodar pipeline completo + agente de impacto + checklist mestre.
3. Deploy em homologação.
4. Smoke + sanity em homologação.
5. Aprovar release (humano).
6. Deploy em produção.
7. Smoke pós-deploy + janela de observação 30 min.
8. Tag `vYYYY.MM.DD`.
9. Publicar CHANGELOG.

## 5. Política de hotfix

1. Branch `fix/hotfix-vYYYY.MM.DD-N` a partir da tag em produção.
2. Mesma checklist, em modo expresso.
3. Tag `vYYYY.MM.DD-hotfixN`.
4. Backport para `main` na mesma janela.

## 6. Política para a Claude Code

1. Não publicar release sem checklist 100%.
2. Sem hotfix "rápido" que pule checklist.
3. Toda exceção exige aprovação humana registrada.
