/**
 * Testes unitários da validação local — espelhamento Pydantic.
 */
import { describe, expect, it } from "vitest";

import { validateInterestDraft } from "@/components/interest/formValidation";

describe("validateInterestDraft", () => {
  it("rejeita draft vazio", () => {
    const r = validateInterestDraft(
      { principal: "", taxaMensalPct: "", prazoMeses: "" },
      { acceptAporte: false },
    );
    expect(r.ok).toBe(false);
    expect(r.errors.principal).toBeDefined();
    expect(r.errors.taxaMensalPct).toBeDefined();
    expect(r.errors.prazoMeses).toBeDefined();
  });

  it("rejeita principal negativo", () => {
    const r = validateInterestDraft(
      { principal: "-100", taxaMensalPct: "1", prazoMeses: "12" },
      { acceptAporte: false },
    );
    expect(r.ok).toBe(false);
    expect(r.errors.principal).toContain("negativo");
  });

  it("rejeita taxa negativa", () => {
    const r = validateInterestDraft(
      { principal: "1000", taxaMensalPct: "-1", prazoMeses: "12" },
      { acceptAporte: false },
    );
    expect(r.ok).toBe(false);
    expect(r.errors.taxaMensalPct).toContain("negativa");
  });

  it("rejeita prazo fora de [1, 1200]", () => {
    const below = validateInterestDraft(
      { principal: "1000", taxaMensalPct: "1", prazoMeses: "0" },
      { acceptAporte: false },
    );
    expect(below.ok).toBe(false);
    const above = validateInterestDraft(
      { principal: "1000", taxaMensalPct: "1", prazoMeses: "1201" },
      { acceptAporte: false },
    );
    expect(above.ok).toBe(false);
  });

  it("rejeita prazo não-inteiro", () => {
    const r = validateInterestDraft(
      { principal: "1000", taxaMensalPct: "1", prazoMeses: "12.5" },
      { acceptAporte: false },
    );
    expect(r.ok).toBe(false);
    expect(r.errors.prazoMeses).toBeDefined();
  });

  it("aceita draft válido sem aporte", () => {
    const r = validateInterestDraft(
      { principal: "1.000,00", taxaMensalPct: "1,00", prazoMeses: "12" },
      { acceptAporte: false },
    );
    expect(r.ok).toBe(true);
    expect(r.value?.principal).toBe("1000.00");
    expect(r.value?.taxa_mensal).toBe("0.010000");
    expect(r.value?.prazo_meses).toBe(12);
    expect(r.value).not.toHaveProperty("aporte_mensal");
  });

  it("aceita aporte opcional quando permitido", () => {
    const r = validateInterestDraft(
      {
        principal: "1000",
        taxaMensalPct: "1",
        prazoMeses: "12",
        aporteMensal: "50,00",
      },
      { acceptAporte: true },
    );
    expect(r.ok).toBe(true);
    expect(r.value?.aporte_mensal).toBe("50.00");
  });

  it("rejeita aporte negativo quando permitido", () => {
    const r = validateInterestDraft(
      {
        principal: "1000",
        taxaMensalPct: "1",
        prazoMeses: "12",
        aporteMensal: "-1",
      },
      { acceptAporte: true },
    );
    expect(r.ok).toBe(false);
    expect(r.errors.aporteMensal).toContain("negativo");
  });
});
