import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FinanciamentoEducationalContract } from "@/components/financing/FinanciamentoEducationalContract";
import type { FinanciamentoImobOut } from "@/types/financing";

const RESULT: FinanciamentoImobOut = {
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
    arredondamento: "ROUND_HALF_EVEN para centavos",
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
  formulas_usadas: [],
  explicacoes_pedagogicas: [],
  alertas: ["Simulacao educacional sem valor contratual."],
  fontes: [
    {
      nome: "Banco Central do Brasil",
      tipo: "referencia institucional",
      observacao: "Sem integracao automatica neste item.",
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

describe("FinanciamentoEducationalContract", () => {
  it("renderiza memoria, alerta, fontes e quantidade dinamica de linhas", () => {
    render(<FinanciamentoEducationalContract result={RESULT} />);

    expect(
      screen.getByTestId("financiamento-educational-contract"),
    ).toBeInTheDocument();
    expect(screen.getByText("Memória de cálculo")).toBeInTheDocument();
    expect(screen.getByText("Risco da simulação")).toBeInTheDocument();
    expect(screen.getByText("360 linhas")).toBeInTheDocument();
    expect(screen.getByText(/Banco Central do Brasil/i)).toBeInTheDocument();
  });
});
