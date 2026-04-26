/**
 * Testes — helpers de formatação monetária.
 */
import { describe, expect, it } from "vitest";

import {
  brlInputToDecimalString,
  formatBRL,
  formatRatePct,
  pctInputToRateString,
} from "@/lib/money";

describe("formatBRL", () => {
  it("formata string decimal como BRL em pt-BR", () => {
    expect(formatBRL("1234.56")).toMatch(/1\.234,56/);
    expect(formatBRL("0.00")).toMatch(/0,00/);
  });

  it("lança em string inválida", () => {
    expect(() => formatBRL("abc")).toThrow();
    expect(() => formatBRL("")).toThrow();
  });
});

describe("formatRatePct", () => {
  it("converte taxa decimal em porcentagem", () => {
    expect(formatRatePct("0.010000")).toMatch(/1,00\s*%/);
    expect(formatRatePct("0.100000")).toMatch(/10,00\s*%/);
  });
});

describe("brlInputToDecimalString", () => {
  it("normaliza entrada pt-BR para ASCII", () => {
    expect(brlInputToDecimalString("1.234,56")).toBe("1234.56");
    expect(brlInputToDecimalString("R$ 100,00")).toBe("100.00");
    expect(brlInputToDecimalString("")).toBe("");
  });
});

describe("pctInputToRateString", () => {
  it("converte percentual em decimal puro 6 casas", () => {
    expect(pctInputToRateString("1,00")).toBe("0.010000");
    expect(pctInputToRateString("10%")).toBe("0.100000");
    expect(pctInputToRateString("")).toBe("");
    expect(pctInputToRateString("abc")).toBe("");
  });
});
