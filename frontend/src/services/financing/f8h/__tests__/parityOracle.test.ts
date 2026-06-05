/**
 * C. Oráculo de paridade — engine.js do protótipo como REFERÊNCIA somente de teste.
 *
 * Governança:
 * - O engine.js não é motor de produção.
 * - O engine.js vive em __tests__/__oracles__.
 * - Este teste valida paridade aproximada entre o protótipo aprovado e as
 *   fixtures reais do backend para evitar divergência grosseira de contrato.
 */

import { describe, expect, it } from "vitest";

import { computeWithPrototypeEngine } from "./__oracles__/pefEngineOracle";
import { REAL_SCENARIOS } from "./fixtures";

const MONEY_TOLERANCE = 1.0;

function dec(value: string | number | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(
      `Valor financeiro inválido no teste de oráculo: ${String(value)}`,
    );
  }
  return parsed;
}

function expectMoneyClose(actual: number, expected: string | number): void {
  expect(Math.abs(actual - dec(expected))).toBeLessThanOrEqual(MONEY_TOLERANCE);
}

describe("C. Oráculo de paridade engine.js — test-only", () => {
  it.each(REAL_SCENARIOS.map((scenario) => [scenario.id, scenario] as const))(
    "%s: mantém paridade aproximada com fixtures reais do backend",
    (_id, scenario) => {
      const result = computeWithPrototypeEngine({
        valorImovel: scenario.uiInputs.valorImovel,
        entrada: scenario.uiInputs.entrada,
        prazoMeses: scenario.uiInputs.prazoMeses,
        taxaMensal: scenario.uiInputs.taxaMensal,
        encargos: 0,
        renda: scenario.uiInputs.renda,
      });

      const sac = scenario.response.data.sac.summary;
      const price = scenario.response.data.price.summary;
      const comparacao = scenario.response.data.comparacao;

      if (comparacao === undefined) {
        throw new Error("Fixture sem data.comparacao.");
      }

      expect(result.sac.rows).toHaveLength(sac.prazo_meses);
      expect(result.price.rows).toHaveLength(price.prazo_meses);

      expectMoneyClose(result.sac.PV, sac.valor_financiado);
      expectMoneyClose(result.price.PV, price.valor_financiado);

      expectMoneyClose(result.sac.jurosTotais, sac.total_juros);
      expectMoneyClose(result.price.jurosTotais, price.total_juros);

      expectMoneyClose(result.sac.totalPago, sac.total_pago);
      expectMoneyClose(result.price.totalPago, price.total_pago);

      expectMoneyClose(result.sac.parcela1, sac.primeira_parcela);
      expectMoneyClose(result.sac.parcelaN, sac.ultima_parcela);
      expectMoneyClose(result.price.parcela1, price.primeira_parcela);
      expectMoneyClose(result.price.parcelaN, price.ultima_parcela);

      expectMoneyClose(
        result.economiaSACvsPRICE,
        comparacao.diferenca_total_pago,
      );

      expectMoneyClose(result.sac.rows.at(-1)?.sf ?? Number.NaN, 0);
      expectMoneyClose(result.price.rows.at(-1)?.sf ?? Number.NaN, 0);
    },
  );
});
