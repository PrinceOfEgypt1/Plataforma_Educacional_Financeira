"""Schemas HTTP do dominio de amortizacao."""

from app.schemas.amortization.compare import CompareAmortizationIn, CompareAmortizationOut
from app.schemas.amortization.price import PriceIn, PriceOut
from app.schemas.amortization.sac import SacIn, SacOut

__all__ = [
    "CompareAmortizationIn",
    "CompareAmortizationOut",
    "PriceIn",
    "PriceOut",
    "SacIn",
    "SacOut",
]
