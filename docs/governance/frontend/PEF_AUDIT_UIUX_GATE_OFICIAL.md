# PEF — Auditor UI/UX: Gate Oficial

## 1. Resumo

O auditor UI/UX da Plataforma Educacional Financeira é um gate **BLOCKING** que protege o módulo Financiamento Imobiliário contra regressões de interface e experiência do usuário.

Promovido a gate oficial no Item 14F-F5, após o módulo ter sido zerado no Item 14F-F4C (PR #60).

## 2. Decisão de governança

| Atributo | Valor |
|---|---|
| Estágio | **BLOCKING** |
| Módulo protegido | Financiamento Imobiliário |
| Rota protegida | `/financiamento-imobiliario` |
| Contrato | `docs/governance/frontend/contracts/financiamento-imobiliario.uiux.contract.json` |
| Auditor | `frontend/scripts/auditor-uiux.mjs` |
| Gate oficial promovido em | Item 14F-F5 |
| Decisão registrada por | Claude (Anthropic) — 2026-05-17 |

## 3. Comando oficial

```bash
cd frontend
pnpm audit:uiux
```

Comportamento:
- **total=0** → exit 0 (PASS)
- **total>0** → exit 1 (FAIL, pipeline bloqueado)

## 4. Onde o gate é executado

| Ambiente | Arquivo | Gate |
|---|---|---|
| CI (GitHub Actions) | `.github/workflows/ci.yml` | Step "Audit UI/UX (gate bloqueante)" |
| Pipeline local | `scripts/pipeline.sh` | Gate `frontend.audit_uiux` (obrigatório) |
| Makefile | `Makefile` | Target `audit-uiux-fe` (parte de `make verify`) |

## 5. Como interpretar falha

Se `pnpm audit:uiux` falhar, significa que um ou mais componentes do módulo Financiamento Imobiliário violam o contrato UI/UX.

Para diagnosticar:

```bash
# Ver violações em formato legível
pnpm audit:uiux

# Ver violações em JSON
pnpm --silent audit:uiux:json

# Validar apenas o contrato (sem escanear componentes)
pnpm audit:uiux:contract
```

## 6. Como corrigir regressão

1. Leia a saída do auditor — cada violação tem código, arquivo, linha e evidência.
2. Identifique a causa raiz (CTA duplicado, destino genérico, falta de responsividade, etc.).
3. Corrija o componente, não o auditor.
4. Execute `pnpm audit:uiux` novamente.
5. Execute `pnpm test` para garantir que nenhum teste quebrou.
6. Apenas após total=0, faça o commit.

## 7. Sobre `audit:uiux:expect-fail`

O script `pnpm audit:uiux:expect-fail` **não é o gate oficial**. Ele existe para uso forense e regressivo em cenários onde violações são esperadas (ex: durante desenvolvimento de correções).

Após F4C, `--expect-fail` retorna status 1 quando não há violações — esse é o comportamento correto.

O gate oficial é `pnpm audit:uiux` (sem `--expect-fail`).

## 8. Regra para novos módulos

Quando um novo módulo for auditado:

1. Criar contrato UI/UX em `docs/governance/frontend/contracts/`.
2. Registrar o módulo no auditor (`auditor-uiux.mjs`).
3. Executar `pnpm audit:uiux` e registrar o estado inicial.
4. Corrigir violações até total=0.
5. Promover a gate bloqueante seguindo o mesmo processo do Item 14F.

## 9. Histórico de promoção

| Etapa | O que aconteceu |
|---|---|
| 14F-F0C | Auditor criado como ferramenta de diagnóstico. |
| 14F-F0E | Runbook operacional publicado. Status: não bloqueante. |
| 14F-F1 | FAIL oficial registrado (12 violações). |
| 14F-F4A | Duplicações corrigidas (12 → 5). |
| 14F-F4B v2 | CTAs e mobile corrigidos (5 → 1). |
| 14F-F4C | Última violação corrigida (1 → 0). |
| **14F-F5** | **Promovido a gate BLOCKING.** |
