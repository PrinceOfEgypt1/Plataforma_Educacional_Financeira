"""Gerador idempotente de ``financial_cases.json``.

Regenera o arquivo de fixtures a partir das especificações
canônicas (Doc 15 §3-§4) e de uma grade determinística de 100
cenários adicionais de massa (Plano Sprint 2 §5.2, item 4).

Uso:
    python -m tests.fixtures.gen_fixture --check   # diff sem escrever
    python -m tests.fixtures.gen_fixture           # escreve o arquivo

O modo ``--check`` sai com código 1 se o fixture versionado
divergir da saída regenerada. Útil em CI para detectar drift.
"""

from __future__ import annotations

import argparse
import json
import sys
from decimal import ROUND_HALF_EVEN, Decimal, getcontext
from pathlib import Path
from typing import Any

# Precisão para o gerador (espelha ensure_precision do domínio).
getcontext().prec = 40

FIXTURE_PATH = Path(__file__).resolve().parent / "financial_cases.json"
QUANTUM = Decimal("0.01")


def _q(v: Decimal) -> str:
    return str(v.quantize(QUANTUM, rounding=ROUND_HALF_EVEN))


def _simples(p: Decimal, i: Decimal, n: int) -> tuple[str, str]:
    juros = p * i * Decimal(n)
    montante = p + juros
    return _q(juros), _q(montante)


def _composto(p: Decimal, i: Decimal, n: int, a: Decimal) -> str:
    saldo = p
    for _ in range(n):
        saldo = saldo + saldo * i + a
    return _q(saldo)


def _base_simples() -> list[dict[str, Any]]:
    return [
        {
            "id": "JS-01",
            "descricao": "principal=1000 i=1% a.m. n=12m",
            "principal": "1000.00",
            "taxa_mensal": "0.01",
            "prazo_meses": 12,
        },
        {
            "id": "JS-02",
            "descricao": "principal=5000 i=2% a.m. n=3m",
            "principal": "5000.00",
            "taxa_mensal": "0.02",
            "prazo_meses": 3,
        },
        {
            "id": "JS-04",
            "descricao": "taxa zero - sem juros",
            "principal": "2500.00",
            "taxa_mensal": "0",
            "prazo_meses": 10,
        },
        {
            "id": "JS-05",
            "descricao": "principal zero - degenerado valido",
            "principal": "0",
            "taxa_mensal": "0.01",
            "prazo_meses": 6,
        },
        {
            "id": "JS-06",
            "descricao": "prazo unitario",
            "principal": "1000.00",
            "taxa_mensal": "0.01",
            "prazo_meses": 1,
        },
    ]


def _base_compostos() -> list[dict[str, Any]]:
    return [
        {
            "id": "JC-01",
            "descricao": "principal=1000 i=1% a.m. n=12m sem aporte",
            "principal": "1000.00",
            "taxa_mensal": "0.01",
            "prazo_meses": 12,
            "aporte_mensal": "0",
        },
        {
            "id": "JC-02",
            "descricao": "principal=10000 i=2% a.m. n=24m sem aporte",
            "principal": "10000.00",
            "taxa_mensal": "0.02",
            "prazo_meses": 24,
            "aporte_mensal": "0",
        },
        {
            "id": "JC-03",
            "descricao": "principal=1000 i=1% a.m. n=12m aporte 100",
            "principal": "1000.00",
            "taxa_mensal": "0.01",
            "prazo_meses": 12,
            "aporte_mensal": "100.00",
        },
        {
            "id": "JC-04",
            "descricao": "taxa zero com aporte - soma linear",
            "principal": "500.00",
            "taxa_mensal": "0",
            "prazo_meses": 10,
            "aporte_mensal": "50.00",
        },
        {
            "id": "JC-05",
            "descricao": "prazo unitario composto",
            "principal": "1000.00",
            "taxa_mensal": "0.01",
            "prazo_meses": 1,
            "aporte_mensal": "0",
        },
    ]


# Grade determinística: 5 principais × 5 taxas × 4 prazos = 100 pontos,
# metade rotulada como simples (S-001..S-050), metade como compostos
# (C-001..C-050). Escolhas parametrizadas para cobrir faixas realistas
# de matemática financeira brasileira.
_GRID_PRINCIPAIS = ["100.00", "500.00", "1000.00", "5000.00", "10000.00"]
_GRID_TAXAS = ["0.005", "0.01", "0.015", "0.02", "0.03"]
_GRID_PRAZOS = [6, 12, 24, 36]


def _gera_grid_simples() -> list[dict[str, Any]]:
    massa: list[dict[str, Any]] = []
    idx = 1
    for p_str in _GRID_PRINCIPAIS:
        for i_str in _GRID_TAXAS:
            for n in _GRID_PRAZOS[:2]:  # 2 primeiros prazos → 50 pontos
                p = Decimal(p_str)
                i = Decimal(i_str)
                juros, montante = _simples(p, i, n)
                massa.append(
                    {
                        "id": f"S-{idx:03d}",
                        "principal": p_str,
                        "taxa_mensal": i_str,
                        "prazo_meses": n,
                        "juros_esperado": juros,
                        "montante_esperado": montante,
                    }
                )
                idx += 1
    return massa


def _gera_grid_compostos() -> list[dict[str, Any]]:
    massa: list[dict[str, Any]] = []
    idx = 1
    for p_str in _GRID_PRINCIPAIS:
        for i_str in _GRID_TAXAS:
            for n in _GRID_PRAZOS[2:]:  # 2 últimos prazos → 50 pontos
                p = Decimal(p_str)
                i = Decimal(i_str)
                montante = _composto(p, i, n, Decimal("0"))
                massa.append(
                    {
                        "id": f"C-{idx:03d}",
                        "principal": p_str,
                        "taxa_mensal": i_str,
                        "prazo_meses": n,
                        "aporte_mensal": "0",
                        "montante_esperado": montante,
                    }
                )
                idx += 1
    return massa


def build() -> dict[str, Any]:
    """Monta a estrutura de fixture, mantendo ordem estável."""
    simples_cases = _base_simples()
    compostos_cases = _base_compostos()

    for c in simples_cases:
        p = Decimal(c["principal"])
        i = Decimal(c["taxa_mensal"])
        n = int(c["prazo_meses"])
        juros, montante = _simples(p, i, n)
        c["juros_esperado"] = juros
        c["montante_esperado"] = montante

    for c in compostos_cases:
        p = Decimal(c["principal"])
        i = Decimal(c["taxa_mensal"])
        n = int(c["prazo_meses"])
        a = Decimal(c["aporte_mensal"])
        c["montante_esperado"] = _composto(p, i, n, a)

    grid_simples = _gera_grid_simples()
    grid_compostos = _gera_grid_compostos()

    return {
        "_meta": {
            "origem": "Doc 15 - Casos de Teste Matematicos + Plano Sprint 2 v1.2 §5.2",
            "rodada": "Sprint 2 / F2 - Dominio de Juros",
            "gerado_por": "backend/tests/fixtures/gen_fixture.py",
            "rounding": "ROUND_HALF_EVEN",
            "quantum": "0.01",
            "massa_grid_count_simples": len(grid_simples),
            "massa_grid_count_compostos": len(grid_compostos),
        },
        "simples": simples_cases,
        "compostos": compostos_cases,
        "massa_grid": {
            "simples": grid_simples,
            "compostos": grid_compostos,
        },
    }


def render(data: dict[str, Any]) -> str:
    """Serializa em JSON estável (ensure_ascii=True, indent=2)."""
    return json.dumps(data, ensure_ascii=True, indent=2, sort_keys=False) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="Apenas verifica divergência; não escreve.",
    )
    args = parser.parse_args()

    rendered = render(build())

    if args.check:
        if not FIXTURE_PATH.exists():
            sys.stderr.write(f"FIXTURE AUSENTE: {FIXTURE_PATH}\n")
            return 1
        current = FIXTURE_PATH.read_text(encoding="utf-8")
        if current != rendered:
            sys.stderr.write("FIXTURE DRIFT detectado.\n")
            return 1
        return 0

    FIXTURE_PATH.write_text(rendered, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
