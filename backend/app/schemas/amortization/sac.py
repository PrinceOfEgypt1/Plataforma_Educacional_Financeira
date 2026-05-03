"""Schemas do endpoint POST /api/v1/amortization/sac."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.amortization.base import (
    Alert,
    AmortizationInBase,
    AmortizationPeriodRow,
    Chart,
    Interpretation,
    SacSummary,
)


class SacIn(AmortizationInBase):
    """Corpo da requisicao para amortizacao SAC."""


class SacOut(BaseModel):
    """Carga util (data) da resposta SAC."""

    model_config = ConfigDict(extra="forbid")

    summary: SacSummary
    tables: dict[str, list[AmortizationPeriodRow]] = Field(default_factory=dict)
    charts: list[Chart] = Field(default_factory=list)
    interpretation: Interpretation
    alerts: list[Alert] = Field(default_factory=list)
