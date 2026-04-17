# DOCUMENTO 18 — MAPEAMENTO REGULATÓRIO DO BANCO CENTRAL E REQUISITOS NORMATIVOS APLICÁVEIS
## Plataforma Educacional Financeira

**Versão:** 2.0 (reescrito integralmente)
**Tipo:** Mapeamento Regulatório aplicado
**Status canônico:** HÍBRIDO — núcleo (regras e fontes) é estático; a **matriz cruzada regra↔módulo↔implementação↔teste** é apêndice vivo.

---

## 1. Finalidade
Mapear a regulamentação oficial do Banco Central do Brasil e do CMN aplicável ao produto, separando obrigatoriedade direta de referência técnica, e **vincular cada regra ao módulo, ao componente, ao teste e ao alerta correspondente** (lacuna L-38 fechada).

## 2. Níveis de aplicabilidade
- **Nível A** — orienta o produto já no modo educacional.
- **Nível B** — passa a importar fortemente em integração Open Finance ou atuação regulada.
- **Nível C** — orienta a comunicação do produto, sem regular automaticamente.

## 3. Conjunto regulatório oficial relevante mapeado

(O conteúdo das seções 3.1 a 3.10 — CET, encargos por atraso, tarifas, Selic, TR, taxas médias, Open Finance governança e técnico, segurança cibernética, material educativo BCB — é mantido íntegro do v1.0, com mesmas resoluções e fontes oficiais. Aqui referimos por subseção.)

- 3.1 CET — Resolução CMN 4.881/2020.
- 3.2 Encargos por atraso — Resolução CMN 4.882/2020.
- 3.3 Tarifas bancárias — Resolução CMN 3.919/2010.
- 3.4 Selic — página oficial BCB.
- 3.5 TR/poupança — página oficial BCB.
- 3.6 Taxas médias por modalidade — base oficial BCB.
- 3.7 Open Finance governança — Res. Conjunta 1/2020 e 4/2022.
- 3.8 Open Finance técnico — Res. BCB 32/2020.
- 3.9 Segurança cibernética — Res. BCB 85/2021 e CMN 4.893/2021 (+ atualização CMN 5.274/2025).
- 3.10 Material educativo oficial do BCB.

## 4. Regras que entram imediatamente na aplicação
Independente de a plataforma ser regulada ou não:
1. Transparência total de custos.
2. Separação visual e semântica entre juros, tarifas, tributos, seguros e outros encargos.
3. CET tratado como taxa anual consolidada quando informado.
4. Demonstração clara dos componentes do custo.
5. Cuidado regulatório com encargos por atraso.
6. Indicação de fonte e data-base ao usar Selic, TR, taxas médias.
7. Aviso de finalidade educacional persistente.

## 5. Decisões práticas para o produto
(Mantidas do v1.0 — CET, atraso, tarifas, indicadores, integrações futuras.)

## 6. Requisitos para UI e documentação
(Mantidos do v1.0.)

## 7. Tabela-resumo de aplicação regulatória
(Mantida do v1.0.)

## 8. Apêndice vivo — Matriz Regra ↔ Módulo ↔ Implementação ↔ Teste ↔ Alerta

<!-- BEGIN APÊNDICE VIVO -->

| Regra/Fonte | Módulo afetado | Local de implementação (BE/FE) | Teste cobertor | Alerta/UI obrigatório | REQ-ID (Doc 19) |
|-------------|----------------|--------------------------------|----------------|------------------------|------------------|
| CET — CMN 4.881/2020 | `loans/cdc`, `loans/payroll`, `credit_card/revolving` | BE: `app/domain/cet/`; FE: `components/cdc/CetBreakdown.tsx` | `tests/regression/financial/cet/`; `tests/contract/test_cdc.py` | UI exibe taxa nominal × CET × custo total; aviso "valores podem variar conforme contrato" | RF-LOA-002, RF-LOA-001, RF-CC-001 |
| Encargos por atraso — CMN 4.882/2020 | `late_payment`, `credit_card/revolving` | BE: `app/domain/late_payment/`; FE: `components/late/Breakdown.tsx` | `tests/regression/financial/late_payment/` | UI separa multa, juros de mora, correção; aviso "estimativa educacional" | RF-LP-001 |
| Tarifas — CMN 3.919/2010 | `loans/*`, `credit_card/*` | BE: `app/domain/fees/` (futuro); FE: linhas separadas em tabelas | `tests/regression/financial/fees/` (futuro) | tarifa exibida em linha distinta; ícone "i" com explicação | a definir (Sprint 5+) |
| Selic — página oficial BCB | `indicators` | BE: `app/services/indicators/selic.py`; FE: `components/indicators/SelicCard.tsx` | `tests/integration/api/test_indicators.py` | exibe valor + data-base + fonte | RF-IND-001 |
| TR/poupança — página oficial BCB | `indicators`, `education` | BE: `app/services/indicators/tr.py`; FE: `components/indicators/TrCard.tsx` | idem | exibe valor + data-base + fonte; texto pedagógico explicando diferença Selic vs TR | RF-IND-001 |
| Taxas médias por modalidade | `indicators`, `loans`, `financing` (benchmarks educativos) | BE: `app/services/indicators/medias.py` (futuro) | `tests/integration/api/test_indicators.py` | exibe valor + data-base; alerta "benchmark, não recomendação" | a definir (Sprint 6) |
| Open Finance governança | n/a (futuro) | n/a | n/a | n/a | a definir |
| Open Finance técnico | n/a (futuro) | n/a | n/a | n/a | a definir |
| Segurança cibernética — Res. BCB 85/2021 e CMN 4.893/2021 | transversal (Doc 17, Doc 22, Doc 23) | políticas em `docs/`; controles em `app/core/security.py` | SAST, DAST, dependency, secret, container, IaC scans (Doc 17 §8) | n/a | n/a |
| Material educativo BCB | `education`, `glossary` | FE: `content/`; BE: `app/services/education/` | `tests/regression/pedagogical/` | linguagem alinhada à oficial | RF-EDU-001 |

> Esta matriz é **viva**. Toda nova rota/módulo que toque tema regulatório deve adicionar/atualizar linha. O agente de impacto bloqueia PR se a linha não for tocada quando aplicável.

<!-- END APÊNDICE VIVO -->

## 9. Política para a Claude Code
1. Toda rota/feature regulada referencia a regra correspondente em código (comentário) e em PR.
2. Toda exibição de CET segue padrão visual obrigatório.
3. Toda exibição de Selic/TR exige fonte + data-base.
4. Aviso educacional persistente nunca é removido sem ADR + aprovação humana.
5. Mudança em §8 atualiza Doc 19 (rastreabilidade).

## 10. Critérios de aceite deste documento
Aceito quando:
- níveis A/B/C explícitos;
- regras imediatas listadas;
- matriz §8 fechada com todos os módulos do MVP;
- referências cruzadas com Docs 06, 09, 19, 22, 23, 17 consistentes.

## 11. Política de evolução
Núcleo (§§ 1–7) é estático: muda por rebaseline formal. Apêndice §8 é vivo: muda por PR comum sob política de docs vivos.
