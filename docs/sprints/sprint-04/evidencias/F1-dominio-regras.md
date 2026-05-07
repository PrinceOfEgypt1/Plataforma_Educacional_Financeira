# F1 — Confirmação de Regras do Domínio

Data: 2026-05-06
Fase: pré-implementação — aprovação antes do código
Fonte: docs/baseline/03_Regras_de_Negocio.md §7 (v1.1)

---

## 1. Entradas

| Campo | Tipo | Restrição |
|-------|------|-----------|
| renda_mensal | Decimal | > 0 |
| total_despesas_fixas | Decimal | ≥ 0 |
| total_despesas_variaveis | Decimal | ≥ 0 |
| total_dividas_mensais | Decimal | ≥ 0 |
| total_reserva_atual | Decimal | ≥ 0 |

Erro de entrada se `total_despesas_fixas + total_despesas_variaveis = 0` (divisão indefinida).

---

## 2. Fórmulas base

```
sobra_mensal = renda_mensal - total_despesas_fixas - total_despesas_variaveis - total_dividas_mensais
comprometimento_pct = (total_dividas_mensais / renda_mensal) × 100
despesas_essenciais_mensais = total_despesas_fixas + total_despesas_variaveis
reserva_em_meses = total_reserva_atual / despesas_essenciais_mensais
sobra_pct = (sobra_mensal / renda_mensal) × 100
```

---

## 3. Classificação do comprometimento

| Faixa | Nível | Pontos |
|-------|-------|--------|
| ≤ 20% | "baixo" | 3 |
| > 20% e ≤ 30% | "moderado" | 2 |
| > 30% e ≤ 40% | "alto" | 1 |
| > 40% | "critico" | 0 |

---

## 4. Classificação da reserva

| Faixa (meses) | Nível | Pontos |
|---------------|-------|--------|
| < 1 | "critica" | 0 |
| ≥ 1 e < 3 | "insuficiente" | 1 |
| ≥ 3 e < 6 | "minima" | 2 |
| ≥ 6 e < 12 | "adequada" | 3 |
| ≥ 12 | "confortavel" | 3 |

---

## 5. Classificação da sobra

| Faixa (% da renda) | Nível | Pontos |
|--------------------|-------|--------|
| < 0% | "negativa" | 0 |
| ≥ 0% e < 10% | "minima" | 1 |
| ≥ 10% e < 20% | "moderada" | 2 |
| ≥ 20% | "boa" | 3 |

---

## 6. Score e saúde financeira

```
score = pontos_comprometimento + pontos_reserva + pontos_sobra  (0–9)
```

| Score | saude_nivel |
|-------|-------------|
| 0–1 | "critica" |
| 2–3 | "fragil" |
| 4–5 | "moderada" |
| 6–7 | "boa" |
| 8–9 | "otima" |

---

## 7. Override dois níveis (sobra negativa)

```
SE sobra_mensal < 0:
    SE reserva_em_meses < 1  → saude_nivel = "critica" (força)
    SE reserva_em_meses ≥ 1  → saude_nivel máximo = "fragil"
                                (qualquer nível > "fragil" é capado para "fragil")
```

---

## 8. Alertas educativos

| Condição | code | level | dimension |
|----------|------|-------|-----------|
| comprometimento_nivel = "critico" | COMPROMETIMENTO_CRITICO | critical | comprometimento |
| comprometimento_nivel = "alto" | COMPROMETIMENTO_ALTO | warning | comprometimento |
| reserva_nivel = "critica" | RESERVA_CRITICA | critical | reserva |
| reserva_nivel = "insuficiente" | RESERVA_INSUFICIENTE | warning | reserva |
| sobra_nivel = "negativa" | SOBRA_NEGATIVA | critical | sobra |
| sobra_nivel = "minima" | SOBRA_MINIMA | warning | sobra |

---

## 9. Casos de referência (DG-01 / DG-02)

### DG-01
- renda=5000, fixas=2000, variaveis=800, dividas=500, reserva=4000
- comprometimento = 500/5000×100 = 10% → "baixo" (3 pts)
- despesas_essenciais = 2000+800 = 2800
- reserva_em_meses = 4000/2800 ≈ 1.43 → "insuficiente" (1 pt)
- sobra = 5000-2000-800-500 = 1700 → sobra_pct = 34% → "boa" (3 pts)
- score = 7 → "boa"
- sem override (sobra ≥ 0)
- **saude_nivel = "boa"**
- alertas: RESERVA_INSUFICIENTE (warning)

### DG-02
- renda=3000, fixas=2200, variaveis=700, dividas=500, reserva=0
- comprometimento = 500/3000×100 ≈ 16.67% → "baixo" (3 pts)
- despesas_essenciais = 2200+700 = 2900
- reserva_em_meses = 0/2900 = 0 → "critica" (0 pts)
- sobra = 3000-2200-700-500 = -400 → sobra_pct ≈ -13.33% → "negativa" (0 pts)
- score = 3 → "fragil" (raw)
- override: sobra<0 AND reserva<1 → **saude_nivel = "critica"**
- alertas: RESERVA_CRITICA (critical), SOBRA_NEGATIVA (critical)
