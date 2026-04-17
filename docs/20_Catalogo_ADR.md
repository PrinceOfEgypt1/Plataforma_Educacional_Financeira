# DOCUMENTO 20 — CATÁLOGO DE DECISÕES ARQUITETURAIS (ADR)

**Versão:** 1.0
**Status:** VIVO (índice + ADRs individuais)
**Localização:** `/docs/20_ADR/` no repositório (um arquivo por ADR).

---

## 1. Política

1. Toda decisão arquitetural que afete contrato, fronteira de módulo, escolha de stack, padrão transversal, política de evolução, performance ou segurança exige **um ADR**.
2. Formato Michael Nygard adaptado.
3. Status: `proposed`, `accepted`, `superseded by ADR-XXXX`, `deprecated`.
4. Numeração contínua, 4 dígitos: `ADR-0001`, `ADR-0002`, ...

## 2. Template canônico (ADR-XXXX-<slug>.md)

```markdown
# ADR-XXXX — <título conciso>

- **Status:** proposed | accepted | superseded by ADR-YYYY | deprecated
- **Data:** AAAA-MM-DD
- **Autoria:** <responsável>
- **Contexto:** <motivação, restrições, premissas>
- **Decisão:** <decisão tomada>
- **Alternativas consideradas:**
  - Alternativa A — prós/contras
  - Alternativa B — prós/contras
- **Consequências:** positivas e negativas, esperadas e potenciais
- **Impacto em documentos:** lista de docs vivos a atualizar
- **Métricas de validação:** como saberemos que a decisão foi acertada
- **Revisão programada:** quando esta decisão será reavaliada
```

## 3. ADRs sementes (já decididos pelo pacote documental original)

Estes ADRs formalizam decisões que **já estão tomadas** mas nunca foram registradas como ADR. Devem ser materializados como arquivos individuais.

| ADR | Decisão | Documento de referência |
|-----|---------|--------------------------|
| ADR-0001 | Frontend em Next.js + React + TypeScript | Doc 04 §4 |
| ADR-0002 | Backend em Python 3 + FastAPI | Doc 04 §4 |
| ADR-0003 | Postgres como banco oficial | Doc 04 §4 |
| ADR-0004 | Backend é fonte única da verdade matemática | Doc 04 §7 |
| ADR-0005 | Organização por domínio no backend | Doc 04 §11 |
| ADR-0006 | Versão de API explícita em URL (`/api/v1`) | Esta auditoria |
| ADR-0007 | Erros REST em formato RFC 7807 | Esta auditoria |
| ADR-0008 | Trunk-based development com squash merge | Doc 21 desta auditoria |
| ADR-0009 | Migrations expand-and-contract reversíveis | Esta auditoria |
| ADR-0010 | Estratégia de testes por pirâmide com mutação semanal no domínio | Esta auditoria |

## 4. Regras de manutenção

1. ADR só é alterado para corrigir typo; mudança de mérito = novo ADR `superseded by`.
2. ADR é referenciado em PRs por número (`Refs ADR-0006`).
3. ADR aceito vira referência canônica; documentos vivos passam a citá-lo.
4. ADRs são listados em `/docs/20_ADR/INDEX.md`.
