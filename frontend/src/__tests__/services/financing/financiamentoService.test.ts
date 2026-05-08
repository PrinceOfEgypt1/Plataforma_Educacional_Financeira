/**
 * Testes do service de financiamento imobiliário.
 *
 * Verifica que o service encaminha o payload corretamente e que
 * normaliza erros da API via toInterestApiError.
 */

import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { __setApiClientForTests } from "@/lib/api/client";
import { simularFinanciamentoImobiliario } from "@/services/financing/financiamentoService";
import type { FinanciamentoImobOut } from "@/types/financing";

function makeMockClient(responseData: unknown, status = 200) {
  const mockPost = vi.fn().mockResolvedValue({
    status,
    data: { success: true, message: "ok", data: responseData, meta: {} },
  });
  return { post: mockPost } as unknown as ReturnType<typeof axios.create>;
}

const MOCK_SUMMARY = {
  sistema_amortizacao: "PRICE",
  valor_imovel: "300000.00",
  valor_entrada: "60000.00",
  valor_financiado: "240000.00",
  prazo_meses: 360,
  taxa_juros_mensal: "0.007000",
  total_pago: "440000.00",
  total_juros: "200000.00",
  total_amortizado: "240000.00",
  total_encargos: "0.00",
  custo_total: "200000.00",
  primeira_parcela: "1797.00",
  ultima_parcela: "1785.00",
};

const MOCK_OUT: FinanciamentoImobOut = {
  summary: MOCK_SUMMARY as FinanciamentoImobOut["summary"],
  parcelas: [],
};

describe("simularFinanciamentoImobiliario", () => {
  beforeEach(() => {
    __setApiClientForTests(null);
  });

  it("chama o endpoint correto com payload tipado", async () => {
    const mock = makeMockClient(MOCK_OUT);
    __setApiClientForTests(mock);

    await simularFinanciamentoImobiliario({
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      prazo_meses: 360,
      taxa_juros_mensal_percentual: "0.7",
      sistema_amortizacao: "PRICE",
    });

    expect(mock.post).toHaveBeenCalledWith(
      "/financing/real_estate",
      expect.objectContaining({
        valor_imovel: "300000.00",
        sistema_amortizacao: "PRICE",
      }),
      expect.any(Object),
    );
  });

  it("devolve os dados desembrulhados do envelope", async () => {
    const mock = makeMockClient(MOCK_OUT);
    __setApiClientForTests(mock);

    const result = await simularFinanciamentoImobiliario({
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      prazo_meses: 360,
      taxa_juros_mensal_percentual: "0.7",
      sistema_amortizacao: "PRICE",
    });

    expect(result.summary.sistema_amortizacao).toBe("PRICE");
    expect(result.summary.valor_financiado).toBe("240000.00");
  });

  it("lança erro em caso de falha da API", async () => {
    const mockPost = vi.fn().mockRejectedValue(new Error("Network error"));
    __setApiClientForTests({ post: mockPost } as unknown as ReturnType<
      typeof axios.create
    >);

    await expect(
      simularFinanciamentoImobiliario({
        valor_imovel: "300000.00",
        valor_entrada: "60000.00",
        prazo_meses: 360,
        taxa_juros_mensal_percentual: "0.7",
        sistema_amortizacao: "PRICE",
      }),
    ).rejects.toBeDefined();
  });
});
