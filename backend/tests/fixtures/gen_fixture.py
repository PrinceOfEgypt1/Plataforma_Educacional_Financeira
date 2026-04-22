"""Script determinístico para gerar backend/tests/fixtures/financial_cases.json.

Executado UMA única vez (pelo operador ou CI reprodutível) e o resultado
JSON é commitado como artefato canônico. Os testes de `test_simple.py` e
`test_compound.py` consomem o JSON diretamente; não recomputam os valores.

Fonte das expectativas:
    * Juros simples: fórmula fechada J = P · i · n. Exata e conferível a mão.
    * Juros compostos: iteração M_k = M_{k-1} · (1 + i) + aporte. Executada
      com `decimal.Decimal` em precisão 50 e ROUND_HALF_EVEN, depois
      quantizada a 2 casas.

Esta política de precisão é a MESMA que o domínio usa. Ou seja: o fixture é
o resultado da aplicação correta da política sobre as entradas canônicas,
independentemente da implementação do domínio. Se a implementação divergir,
o teste reprova — o que é exatamente o ponto.

Determinismo: sem randomness. Grade cartesiana com listas ordenadas de
entradas. Executar múltiplas vezes produz bytes idênticos.
"""

from __future__ import annotations

import json
from decimal import ROUND_HALF_EVEN, Decimal, localcontext
from pathlib import Path

Q = Decimal("0.01")


def q(x: Decimal) -> str:
    return str(x.quantize(Q, rounding=ROUND_HALF_EVEN))


def simple_expected(principal: Decimal, taxa: Decimal, prazo: int) -> dict:
    with localcontext() as ctx:
        ctx.prec = 50
        ctx.rounding = ROUND_HALF_EVEN
        juros = principal * taxa * Decimal(prazo)
        montante = principal + juros
    return {"juros_total": q(juros), "montante_final": q(montante)}


def compound_expected(principal: Decimal, taxa: Decimal, prazo: int, aporte: Decimal) -> dict:
    with localcontext() as ctx:
        ctx.prec = 50
        ctx.rounding = ROUND_HALF_EVEN
        montante = principal
        juros_acum = Decimal(0)
        for _ in range(prazo):
            juros_k = montante * taxa
            juros_acum += juros_k
            montante = montante + juros_k + aporte
        total_aportado = aporte * Decimal(prazo)
    return {
        "juros_total": q(juros_acum),
        "montante_final": q(montante),
        "total_aportado": q(total_aportado),
    }


def canonical_simple() -> list[dict]:
    return [
        {
            "id": "JS-01",
            "description": "Canônico Doc 15: P=1000, i=1% a.m., n=12m → J=120,00",
            "principal": "1000",
            "taxa": "0.01",
            "prazo": 12,
            "expected": simple_expected(Decimal("1000"), Decimal("0.01"), 12),
        },
        {
            "id": "JS-02",
            "description": "Canônico Doc 15: P=5000, i=2% a.m., n=3m → J=300,00",
            "principal": "5000",
            "taxa": "0.02",
            "prazo": 3,
            "expected": simple_expected(Decimal("5000"), Decimal("0.02"), 3),
        },
    ]


def canonical_compound() -> list[dict]:
    return [
        {
            "id": "JC-01",
            "description": "Canônico Doc 15: P=1000, i=1% a.m., n=12m, sem aporte",
            "principal": "1000",
            "taxa": "0.01",
            "prazo": 12,
            "aporte_mensal": "0",
            "expected": compound_expected(Decimal("1000"), Decimal("0.01"), 12, Decimal("0")),
        },
        {
            "id": "JC-02",
            "description": (
                "Canônico Doc 15 (plano Sprint 2 §linha 54): "
                "P=10000, i=2% a.m., n=24m, sem aporte — composto > simples"
            ),
            "principal": "10000",
            "taxa": "0.02",
            "prazo": 24,
            "aporte_mensal": "0",
            "expected": compound_expected(Decimal("10000"), Decimal("0.02"), 24, Decimal("0")),
        },
        {
            "id": "JC-03",
            "description": "Canônico Doc 15: P=1000, i=1% a.m., n=12m, aporte=100",
            "principal": "1000",
            "taxa": "0.01",
            "prazo": 12,
            "aporte_mensal": "100",
            "expected": compound_expected(Decimal("1000"), Decimal("0.01"), 12, Decimal("100")),
        },
    ]


def grid_simple() -> list[dict]:
    # 48 cenários determinísticos, zero sobreposição com canônicos (JS-01, JS-02)
    principals = [Decimal(p) for p in ("2000", "2500", "4000", "7500")]
    taxas_grid = [Decimal(t) for t in ("0.01", "0.015", "0.02")]
    prazos_grid = [3, 6, 12, 24]
    out: list[dict] = []
    idx = 1
    for principal in principals:
        for taxa in taxas_grid:
            for prazo in prazos_grid:
                out.append(
                    {
                        "id": f"GS-{idx:03d}",
                        "principal": str(principal),
                        "taxa": str(taxa),
                        "prazo": prazo,
                        "expected": simple_expected(principal, taxa, prazo),
                    }
                )
                idx += 1
    return out


def grid_compound() -> list[dict]:
    # 47 cenários: P(3) × i(2) × n(4) × aporte(2) = 48, menos 1 por sobreposição
    # com JC-02 (10000/0.02/24/0). Exclusões ativas:
    #   JC-01 (1000/0.01/12/0), JC-02 (10000/0.02/24/0), JC-03 (1000/0.01/12/100)
    # Como a grade de P não inclui 1000, as exclusões JC-01/JC-03 são naturais.
    # JC-02 requer exclusão explícita.
    principals = [Decimal(p) for p in ("2000", "5000", "10000")]
    taxas_grid = [Decimal(t) for t in ("0.01", "0.02")]
    prazos_grid = [6, 12, 24, 36]
    aportes_grid = [Decimal("0"), Decimal("100")]
    excluded = {(Decimal("10000"), Decimal("0.02"), 24, Decimal("0"))}
    out: list[dict] = []
    idx = 1
    for principal in principals:
        for taxa in taxas_grid:
            for prazo in prazos_grid:
                for aporte in aportes_grid:
                    if (principal, taxa, prazo, aporte) in excluded:
                        continue
                    out.append(
                        {
                            "id": f"GC-{idx:03d}",
                            "principal": str(principal),
                            "taxa": str(taxa),
                            "prazo": prazo,
                            "aporte_mensal": str(aporte),
                            "expected": compound_expected(principal, taxa, prazo, aporte),
                        }
                    )
                    idx += 1
    return out


def simple_rejections() -> list[dict]:
    return [
        {
            "id": "JS-03",
            "description": "Canônico Doc 15: prazo zero rejeitado",
            "principal": "1000",
            "taxa": "0.01",
            "prazo": 0,
            "expects_error": "InvalidTermError",
        },
        {
            "id": "JS-REJ-negprazo",
            "principal": "1000",
            "taxa": "0.01",
            "prazo": -1,
            "expects_error": "InvalidTermError",
        },
        {
            "id": "JS-REJ-zeroprincipal",
            "principal": "0",
            "taxa": "0.01",
            "prazo": 12,
            "expects_error": "InvalidPrincipalError",
        },
        {
            "id": "JS-REJ-negprincipal",
            "principal": "-100",
            "taxa": "0.01",
            "prazo": 12,
            "expects_error": "InvalidPrincipalError",
        },
        {
            "id": "JS-REJ-negtaxa",
            "principal": "1000",
            "taxa": "-0.01",
            "prazo": 12,
            "expects_error": "InvalidRateError",
        },
    ]


def compound_rejections() -> list[dict]:
    return [
        {
            "id": "JC-REJ-bothzero",
            "description": "principal=0 e aporte=0 → degenerado rejeitado",
            "principal": "0",
            "taxa": "0.01",
            "prazo": 12,
            "aporte_mensal": "0",
            "expects_error": "InvalidPrincipalError",
        },
        {
            "id": "JC-REJ-zeroprazo",
            "principal": "1000",
            "taxa": "0.01",
            "prazo": 0,
            "aporte_mensal": "0",
            "expects_error": "InvalidTermError",
        },
        {
            "id": "JC-REJ-negprincipal",
            "principal": "-100",
            "taxa": "0.01",
            "prazo": 12,
            "aporte_mensal": "0",
            "expects_error": "InvalidPrincipalError",
        },
        {
            "id": "JC-REJ-negtaxa",
            "principal": "1000",
            "taxa": "-0.01",
            "prazo": 12,
            "aporte_mensal": "0",
            "expects_error": "InvalidRateError",
        },
        {
            "id": "JC-REJ-negaporte",
            "principal": "1000",
            "taxa": "0.01",
            "prazo": 12,
            "aporte_mensal": "-50",
            "expects_error": "InvalidContributionError",
        },
    ]


def main() -> None:
    doc = {
        "version": 1,
        "description": (
            "Casos canônicos Doc 15 + grade determinística para diff de 100 "
            "cenários do domínio de juros. Gerado uma única vez via "
            "gen_fixture.py; reproduzível bit-a-bit."
        ),
        "rounding_policy": {
            "mode": "ROUND_HALF_EVEN",
            "internal_precision": 50,
            "display_decimal_places": 2,
        },
        "simple_cases": canonical_simple() + grid_simple(),
        "compound_cases": canonical_compound() + grid_compound(),
        "simple_rejections": simple_rejections(),
        "compound_rejections": compound_rejections(),
    }
    # sanity: total numérico deve ser 100
    total_numeric = len(doc["simple_cases"]) + len(doc["compound_cases"])
    assert total_numeric == 100, f"Cenários numéricos totais = {total_numeric}, esperado 100"
    # O script vive em backend/tests/fixtures/; gravamos o JSON lado-a-lado.
    out_path = Path(__file__).parent / "financial_cases.json"
    out_path.write_text(
        json.dumps(doc, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {out_path} ({out_path.stat().st_size} bytes)")
    print(f"Simples numéricos: {len(doc['simple_cases'])}")
    print(f"Compostos numéricos: {len(doc['compound_cases'])}")
    print(f"Total numérico: {total_numeric}")
    print(f"Rejeições simples: {len(doc['simple_rejections'])}")
    print(f"Rejeições compostas: {len(doc['compound_rejections'])}")


if __name__ == "__main__":
    main()
