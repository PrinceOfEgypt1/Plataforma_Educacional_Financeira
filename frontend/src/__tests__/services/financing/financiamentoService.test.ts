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

const MOCK_OUT: FinanciamentoImobOut = {
  summary: {
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
  },
  parcelas: [],
  inputs_normalizados: {
    valor_imovel: "300000.00",
    valor_entrada: "60000.00",
    valor_financiado: "240000.00",
    prazo_meses: 360,
    taxa_juros_mensal: "0.007000",
    sistema_amortizacao: "PRICE",
  },
  memoria_calculo: {
    metodo: "PRICE",
    entradas: {
      valor_imovel: "300000.00",
      valor_entrada: "60000.00",
      valor_financiado: "240000.00",
      prazo_meses: 360,
      taxa_juros_mensal: "0.007000",
      sistema_amortizacao: "PRICE",
    },
    formula: "PMT = PV * i * (1 + i)^n / ((1 + i)^n - 1)",
    variaveis: { PV: "240000.00", i: "0.007000", n: 360 },
    substituicao: "PV=240000.00; i=0.007000; n=360",
    arredondamento: "ROUND_HALF_EVEN",
    primeira_parcela: {
      numero: 1,
      saldo_inicial: "240000.00",
      juros: "1680.00",
      amortizacao: "117.00",
      encargos: "0.00",
      prestacao: "1797.00",
      saldo_final: "239883.00",
    },
    ultima_parcela: {
      numero: 360,
      saldo_inicial: "1785.00",
      juros: "12.00",
      amortizacao: "1773.00",
      encargos: "0.00",
      prestacao: "1785.00",
      saldo_final: "0.00",
    },
    custo_total: "200000.00",
    resultado_final: { total_pago: "440000.00" },
  },
  formulas_usadas: [
    {
      nome: "prestacao",
      expressao: "prestacao = juros + amortizacao + encargos",
      uso: "Mostra a composicao da parcela.",
    },
  ],
  explicacoes_pedagogicas: ["Explicacao educacional."],
  alertas: ["Simulacao educacional sem valor contratual."],
  fontes: [
    {
      nome: "Banco Central do Brasil",
      tipo: "referencia institucional",
      observacao: "Sem integracao automatica.",
    },
  ],
  limites: ["Nao ha consulta a API oficial externa."],
  metadados_calculo: {
    moeda: "BRL",
    criterio_arredondamento: "ROUND_HALF_EVEN para centavos",
    linhas_tabela: 360,
    prazo_dinamico_respeitado: true,
    contrato_educacional_api: "Item 7",
  },
  mensagens_interface: ["Compare SAC e PRICE antes de decidir."],
  chart_data: {
    saldo_devedor: [],
    prestacoes: [],
    juros_amortizacao: [],
  },
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
      expect.objectContaining({}),
    );
  });

  it("devolve dados educacionais desembrulhados do envelope", async () => {
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
    expect(result.memoria_calculo.formula).toContain("PMT");
    expect(result.metadados_calculo.linhas_tabela).toBe(360);
  });

  it("lanca erro em caso de falha da API", async () => {
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
