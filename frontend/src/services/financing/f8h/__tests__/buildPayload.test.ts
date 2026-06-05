import { describe, it, expect } from "vitest";
import { buildPayload } from "../buildPayload";
import { compararFinanciamentosF8H } from "../financiamentoCompareService";
import { FinancingF8HValidationError } from "../errors";
import type { UiInputs } from "../../../../types/financingF8H";

const base: UiInputs = {
  valorImovel: 1_000_000,
  entrada: 820_000,
  prazoMeses: 120,
  taxaMensal: 0.0085,
  renda: 20_000,
  sistema: "SAC",
};

describe("A. buildPayload (F8H)", () => {
  it("taxa 0.0085 → '0.8500'", () => {
    expect(buildPayload(base).taxa_juros_mensal_percentual).toBe("0.8500");
  });
  it("taxa 0.0091 → '0.9100'", () => {
    expect(
      buildPayload({ ...base, taxaMensal: 0.0091 })
        .taxa_juros_mensal_percentual,
    ).toBe("0.9100");
  });
  it("monetários com toFixed(2)", () => {
    const p = buildPayload(base);
    expect(p.valor_imovel).toBe("1000000.00");
    expect(p.valor_entrada).toBe("820000.00");
  });
  it("prazo_meses inteiro", () => {
    const p = buildPayload({ ...base, prazoMeses: 120.4 });
    expect(p.prazo_meses).toBe(120);
  });
  it("encargos só quando informados", () => {
    expect(buildPayload(base).seguro_mensal).toBeUndefined();
    const com = buildPayload({
      ...base,
      encargos: { seguroMensal: 150, mipMensal: 30 },
    });
    expect(com.seguro_mensal).toBe("150.00");
    expect(com.mip_mensal).toBe("30.00");
    expect(com.tarifa_mensal).toBeUndefined();
  });
  it("rejeita entrada >= imóvel", async () => {
    await expect(
      compararFinanciamentosF8H({ ...base, entrada: 1_000_000 }),
    ).rejects.toBeInstanceOf(FinancingF8HValidationError);
  });
});
