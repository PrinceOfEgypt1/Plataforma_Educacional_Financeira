"""Schemas do endpoint POST /api/v1/amortization/price."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.amortization.base import (
    Alert,
    AmortizationInBase,
    AmortizationPeriodRow,
    Chart,
    Interpretation,
    PriceSummary,
)


class PriceIn(AmortizationInBase):
    """Corpo da requisicao para amortizacao PRICE."""


class PriceOut(BaseModel):
    """Carga util (data) da resposta PRICE."""

    model_config = ConfigDict(extra="forbid")

    summary: PriceSummary
    tables: dict[str, list[AmortizationPeriodRow]] = Field(default_factory=dict)
    charts: list[Chart] = Field(default_factory=list)
    interpretation: Interpretation
    alerts: list[Alert] = Field(default_factory=list)
