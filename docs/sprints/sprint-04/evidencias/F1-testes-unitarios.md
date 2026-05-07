# F1 — Evidência de Testes Unitários

Data: 2026-05-06
Branch: sprint-4/f1-dominio-diagnostico-claude
Fase: F1 (domínio puro do diagnóstico financeiro)

---

## 1. Gates executados

| Gate | Resultado |
|------|-----------|
| ruff check (lint) | PASSOU — 0 erros |
| ruff format --check | PASSOU — 0 diffs |
| mypy --strict (4 arquivos) | PASSOU — 0 issues |
| bandit -r (400 linhas) | PASSOU — 0 issues |
| pytest (76 testes) | PASSOU — 76/76 |
| coverage (domain/diagnostic/) | 99.42% ≥ gate 80% |
| regressão suite unitária completa | PASSOU — 214/214 |

---

## 2. Cobertura por arquivo

| Arquivo | Stmts | Miss | Cover |
|---------|-------|------|-------|
| `app/domain/diagnostic/__init__.py` | 13 | 1 | 92% |
| `app/domain/diagnostic/_rounding.py` | 11 | 0 | 100% |
| `app/domain/diagnostic/analyzer.py` | 87 | 0 | 100% |
| `app/domain/diagnostic/rules.py` | 61 | 0 | 100% |
| **TOTAL** | **172** | **1** | **99.42%** |

Miss: linha 53 de `__init__.py` — `__repr__` de DomainValidationError (não acionado por testes diretos; aceitável).

---

## 3. Distribuição dos testes

| Arquivo | Testes | Tipo |
|---------|--------|------|
| `test_rules.py` | 45 | unitário |
| `test_analyzer.py` | 24 | unitário + casos canônicos |
| `test_properties.py` | 7 | property-based (hypothesis, 200 exemplos cada) |
| **Total F1** | **76** | |

---

## 4. Casos canônicos validados

### DG-01 — saude_nivel = "boa"
- Entradas: renda=5000, fixas=2000, variaveis=800, dividas=500, reserva=4000
- Saídas verificadas: sobra=1700, comprometimento=10%, reserva_em_meses=1.43, sobra_pct=34%
- Nível: baixo(3) + insuficiente(1) + boa(3) = score 7 → "boa"
- Alertas: [RESERVA_INSUFICIENTE]
- **PASSOU**

### DG-02 — saude_nivel = "critica" (override)
- Entradas: renda=3000, fixas=2200, variaveis=700, dividas=500, reserva=0
- Saídas verificadas: sobra=-400, comprometimento≈16.67%, reserva_em_meses=0
- Score raw = 3 → "fragil"; override: sobra<0 e reserva<1m → **"critica"**
- Alertas: [RESERVA_CRITICA, SOBRA_NEGATIVA]
- **PASSOU**

---

## 5. Propriedades verificadas por hypothesis

- `score` sempre entre 0 e 9
- `saude_nivel` sempre em {"critica", "fragil", "moderada", "boa", "otima"}
- `score == pontos_comprometimento + pontos_reserva + pontos_sobra`
- `sobra_mensal < 0 → saude_nivel ∈ {"critica", "fragil"}`
- `sobra_mensal` computado corretamente (4 termos)
- resultado é sempre `DiagnosticoResultado`
- alertas é sempre `tuple`

---

## 6. Validação de entradas coberta

- renda = 0 → RENDA_NAO_POSITIVA
- renda < 0 → RENDA_NAO_POSITIVA
- despesas/dividas/reserva < 0 → VALOR_NEGATIVO (por campo)
- fixas + variaveis = 0 → DESPESAS_ESSENCIAIS_ZERO
- tipo bool → TIPO_INVALIDO
- tipo float → TIPO_INVALIDO
- Decimal NaN → VALOR_NAO_FINITO
- Decimal Infinity → VALOR_NAO_FINITO

---

## 7. Imutabilidade

- DiagnosticoResultado: `@dataclass(frozen=True, slots=True)` — mutação levanta FrozenInstanceError ✓
- DiagnosticAlert: mesma política ✓

---

## 8. Sem regressão

Suite completa antes de F1: 138 testes.
Suite completa após F1: 214 testes (76 novos).
Resultado: **214/214 PASSOU**.

---

## 9. Conclusão

F1 — Domínio Puro do Diagnóstico Financeiro está **PRONTO PARA AUDITORIA**.

Gates obrigatórios: todos verdes.
Cobertura do domínio: 99.42% (gate: ≥80%).
Casos canônicos DG-01/DG-02: verificados com valores numéricos exatos.
Override dois níveis: verificado com testes diretos e property-based.
