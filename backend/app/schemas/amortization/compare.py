"""Schemas do endpoint POST /api/v1/amortization/compare."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.amortization.base import (
    Alert,
    AmortizationInBase,
    Chart,
    CompareSummary,
    Interpretation,
    TablesCompareAmortization,
)


class CompareAmortizationIn(AmortizationInBase):
    """Corpo da requisicao para comparar PRICE e SAC."""


class CompareAmortizationOut(BaseModel):
    """Carga util (data) da resposta comparativa PRICE x SAC."""

    model_config = ConfigDict(extra="forbid")

    summary: CompareSummary
    tables: TablesCompareAmortization = Field(default_factory=TablesCompareAmortization)
    charts: list[Chart] = Field(default_factory=list)
    interpretation: Interpretation
    alerts: list[Alert] = Field(default_factory=list)
