import { describe, expect, it } from "vitest";

import { validateFinanciamentoDraft } from "@/components/financing/formValidation";

describe("validateFinanciamentoDraft — taxa mensal suspeita", () => {
  it("bloqueia taxa mensal acima de 5% e exibe mensagem dinâmica com taxa digitada (Item 14B)", () => {
    const result = validateFinanciamentoDraft({
      valorImovel: "870000",
      valorEntrada: "700000",
      prazoMeses: "120",
      taxaJurosMensalPercentual: "12,250",
      sistemaAmortizacao: "SAC",
      seguroMensal: "225",
      tarifaMensal: "25",
    });

    expect(result.ok).toBe(false);

    if (!result.ok) {
      // Mensagem dinâmica deve conter a taxa digitada (12,25)
      expect(result.errors.taxaJurosMensalPercentual).toContain("12,25%");
      expect(result.errors.taxaJurosMensalPercentual).toMatch(
        /muito acima do comum/i,
      );
      expect(result.errors.taxaJurosMensalPercentual).toMatch(
        /mensal.*anual|anual.*mensal/i,
      );
    }
  });

  it("mantém válida uma taxa mensal comum como 1,2500%", () => {
    const result = validateFinanciamentoDraft({
      valorImovel: "870000",
      valorEntrada: "700000",
      prazoMeses: "120",
      taxaJurosMensalPercentual: "1,2500",
      sistemaAmortizacao: "SAC",
      seguroMensal: "225",
      tarifaMensal: "25",
    });

    expect(result.ok).toBe(true);
  });

  it("mensagem dinâmica reflete diferentes taxas digitadas (Item 14B)", () => {
    const result975 = validateFinanciamentoDraft({
      valorImovel: "300000",
      valorEntrada: "60000",
      prazoMeses: "360",
      taxaJurosMensalPercentual: "9,75",
      sistemaAmortizacao: "PRICE",
      seguroMensal: "0",
      tarifaMensal: "0",
    });

    expect(result975.ok).toBe(false);
    if (!result975.ok) {
      expect(result975.errors.taxaJurosMensalPercentual).toContain("9,75%");
    }

    const result13 = validateFinanciamentoDraft({
      valorImovel: "300000",
      valorEntrada: "60000",
      prazoMeses: "360",
      taxaJurosMensalPercentual: "13,00",
      sistemaAmortizacao: "SAC",
      seguroMensal: "0",
      tarifaMensal: "0",
    });

    expect(result13.ok).toBe(false);
    if (!result13.ok) {
      expect(result13.errors.taxaJurosMensalPercentual).toContain("13,00%");
    }
  });

  it("mensagem usa vírgula como separador decimal (pt-BR) independente do locale — Item 14D-B", () => {
    // Entrada com ponto (como userEvent.type produz no jsdom)
    const result975dot = validateFinanciamentoDraft({
      valorImovel: "300000",
      valorEntrada: "60000",
      prazoMeses: "360",
      taxaJurosMensalPercentual: "9.75",
      sistemaAmortizacao: "PRICE",
      seguroMensal: "0",
      tarifaMensal: "0",
    });

    expect(result975dot.ok).toBe(false);
    if (!result975dot.ok) {
      const msg = result975dot.errors.taxaJurosMensalPercentual ?? "";
      expect(msg).toContain("9,75%");
      expect(msg).not.toMatch(/9\.75%/);
    }

    const result13 = validateFinanciamentoDraft({
      valorImovel: "300000",
      valorEntrada: "60000",
      prazoMeses: "360",
      taxaJurosMensalPercentual: "13",
      sistemaAmortizacao: "SAC",
      seguroMensal: "0",
      tarifaMensal: "0",
    });

    expect(result13.ok).toBe(false);
    if (!result13.ok) {
      const msg = result13.errors.taxaJurosMensalPercentual ?? "";
      expect(msg).toContain("13,00%");
      expect(msg).not.toMatch(/13\.00%/);
    }
  });

  it("mensagem contém menção a taxa mensal/anual e deslocamento de vírgula", () => {
    const result = validateFinanciamentoDraft({
      valorImovel: "300000",
      valorEntrada: "60000",
      prazoMeses: "360",
      taxaJurosMensalPercentual: "9.75",
      sistemaAmortizacao: "SAC",
      seguroMensal: "0",
      tarifaMensal: "0",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      const msg = result.errors.taxaJurosMensalPercentual ?? "";
      expect(msg).toMatch(/mensal|anual/i);
      expect(msg).toMatch(/vírgula|deslocamento/i);
    }
  });

  it("API não chamada: validateFinanciamentoDraft retorna ok:false para taxa suspeita — Item 14D-B", () => {
    const result = validateFinanciamentoDraft({
      valorImovel: "300000",
      valorEntrada: "60000",
      prazoMeses: "360",
      taxaJurosMensalPercentual: "9.75",
      sistemaAmortizacao: "SAC",
      seguroMensal: "0",
      tarifaMensal: "0",
    });
    // handleSimulate só chama a API se ok === true
    // Este teste prova que a validação bloqueia antes
    expect(result.ok).toBe(false);
  });
});
