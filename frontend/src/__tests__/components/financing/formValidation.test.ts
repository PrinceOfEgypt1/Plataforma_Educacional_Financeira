import { describe, expect, it } from "vitest";

import { validateFinanciamentoDraft } from "@/components/financing/formValidation";
import type { FinanciamentoDraft } from "@/components/financing/formValidation";

const VALID_DRAFT: FinanciamentoDraft = {
  valorImovel: "300000",
  valorEntrada: "60000",
  prazoMeses: "120",
  taxaJurosMensalPercentual: "0.7",
  sistemaAmortizacao: "PRICE",
  seguroMensal: "",
  tarifaMensal: "",
};

describe("validateFinanciamentoDraft — parser pt-BR", () => {
  it("parseia valor pt-BR com separador de milhar e vírgula decimal", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      valorImovel: "1.000.000,00",
      valorEntrada: "200.000,00",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.valor_imovel).toBe("1000000.00");
      expect(result.value.valor_entrada).toBe("200000.00");
    }
  });

  it("parseia valor no formato americano (sem vírgula)", () => {
    const result = validateFinanciamentoDraft(VALID_DRAFT);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.valor_imovel).toBe("300000.00");
    }
  });

  it("parseia taxa com vírgula decimal pt-BR", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      taxaJurosMensalPercentual: "0,7",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.taxa_juros_mensal_percentual).toBe("0.7000");
    }
  });

  it("rejeita valor de imóvel zero", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      valorImovel: "0",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.valorImovel).toBeDefined();
    }
  });

  it("rejeita entrada igual ao valor do imóvel", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      valorEntrada: "300000",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.valorEntrada).toBeDefined();
    }
  });

  it("aceita entrada zero", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      valorEntrada: "0",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.valor_entrada).toBe("0.00");
    }
  });

  it("aceita seguro e tarifa vazios como zero (omitidos do payload)", () => {
    const result = validateFinanciamentoDraft(VALID_DRAFT);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.seguro_mensal).toBeUndefined();
      expect(result.value.tarifa_mensal).toBeUndefined();
    }
  });

  it("inclui seguro no payload quando positivo", () => {
    const result = validateFinanciamentoDraft({
      ...VALID_DRAFT,
      seguroMensal: "150,00",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.seguro_mensal).toBe("150.00");
    }
  });
});
