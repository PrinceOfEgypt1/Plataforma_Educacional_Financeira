import { describe, it, expect } from "vitest";
import { adaptCompareResponse } from "../adaptCompareResponse";
import { REAL_SCENARIOS } from "./fixtures";
import type { UiModel } from "../../../../types/financingF8H";

const CENTS = 0.01;

function allFinite(model: UiModel): boolean {
  const nums: number[] = [
    model.pctEntrada,
    model.taxaAnual,
    model.economiaSACvsPRICE,
    ...[model.sac, model.price].flatMap((s) => [
      s.PV,
      s.n,
      s.i,
      s.E,
      s.parcela1,
      s.parcelaN,
      s.parcela1SemEnc,
      s.parcelaN_SemEnc,
      s.parcelaMax,
      s.parcelaMin,
      s.jurosTotais,
      s.encargosTotais,
      s.totalPago,
      s.custoCredito,
      s.pctJuros,
      s.taxaEfetivaAnual,
      ...s.rows.flatMap((r) => [r.k, r.si, r.j, r.a, r.e, r.p, r.t, r.sf]),
    ]),
  ];
  return nums.every((x) => Number.isFinite(x));
}

describe.each(REAL_SCENARIOS)("B. adaptCompareResponse (F8H) — $id", (sc) => {
  const model = adaptCompareResponse(sc.response, sc.uiInputs);

  it("UiModel completo, sem NaN/Infinity", () => {
    expect(model.inputs).toBeDefined();
    expect(model.sac).toBeDefined();
    expect(model.price).toBeDefined();
    expect(typeof model.comprometimento).toBe("function");
    expect(allFinite(model)).toBe(true);
  });
  it("i lido como DECIMAL (≈0.0085/0.0091, nunca 0.85)", () => {
    expect(model.sac.i).toBeCloseTo(sc.uiInputs.taxaMensal, 6);
    expect(model.price.i).toBeCloseTo(sc.uiInputs.taxaMensal, 6);
    expect(model.sac.i).toBeLessThan(0.1);
  });
  it("rows.length === prazo_meses (120) em SAC e PRICE", () => {
    expect(model.sac.rows.length).toBe(model.sac.n);
    expect(model.price.rows.length).toBe(model.price.n);
    expect(model.sac.rows.length).toBe(120);
  });
  it("saldo final da última parcela == 0", () => {
    expect(model.sac.rows.at(-1)!.sf).toBe(0);
    expect(model.price.rows.at(-1)!.sf).toBe(0);
  });
  it("Σ amortizações ≈ PV (≤ 1 centavo × n)", () => {
    for (const s of [model.sac, model.price]) {
      const somaA = s.rows.reduce((acc, r) => acc + r.a, 0);
      expect(Math.abs(somaA - s.PV)).toBeLessThanOrEqual(CENTS * s.n);
    }
  });
  it("p == a + j em cada linha", () => {
    for (const s of [model.sac, model.price])
      for (const r of s.rows)
        expect(Math.abs(r.p - (r.a + r.j))).toBeLessThanOrEqual(CENTS);
  });
  it("economiaSACvsPRICE === comparacao.diferenca_total_pago", () => {
    const esperado = Number(sc.response.data.comparacao.diferenca_total_pago);
    expect(model.economiaSACvsPRICE).toBeCloseTo(esperado, 2);
  });
  it("SAC mais barato que PRICE (totalPago)", () => {
    expect(model.sac.totalPago).toBeLessThan(model.price.totalPago);
  });
  it("zero recálculo: i/totais batem com o summary bruto", () => {
    const s = sc.response.data.sac.summary;
    expect(model.sac.i).toBeCloseTo(Number(s.taxa_juros_mensal), 8);
    expect(model.sac.totalPago).toBeCloseTo(Number(s.total_pago), 2);
    expect(model.sac.jurosTotais).toBeCloseTo(Number(s.total_juros), 2);
  });
});
