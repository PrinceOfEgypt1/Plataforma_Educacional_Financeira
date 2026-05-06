import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MODULES } from "@/config/modules";

class NoopResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal("ResizeObserver", NoopResizeObserver);

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/services/interest", () => ({
  simularJurosSimples: vi.fn().mockResolvedValue({
    summary: {
      principal: "180000.00",
      taxa_mensal: "0.015000",
      prazo_meses: 60,
      juros_totais: "162000.00",
      montante_final: "342000.00",
    },
    tables: { amortizacao: [] },
    charts: [],
    interpretation: { headline: "", body: "" },
    alerts: [],
  }),
  simularJurosCompostos: vi.fn().mockResolvedValue({
    summary: {
      principal: "180000.00",
      taxa_mensal: "0.015000",
      prazo_meses: 60,
      aporte_mensal: "0.00",
      juros_totais: "260000.00",
      total_aportado: "0.00",
      total_investido: "180000.00",
      montante_final: "440000.00",
    },
    tables: { amortizacao: [] },
    charts: [],
    interpretation: { headline: "", body: "" },
    alerts: [],
  }),
  compararJuros: vi.fn().mockResolvedValue({
    summary: {
      principal: "180000.00",
      taxa_mensal: "0.015000",
      prazo_meses: 60,
      montante_simples: "342000.00",
      montante_composto: "440000.00",
      diferenca: "98000.00",
      razao: "1.286550",
    },
    tables: { simple: [], compound: [] },
    charts: [],
    interpretation: { headline: "", body: "" },
    alerts: [],
  }),
}));

vi.mock("@/services/amortization/amortizationService", () => ({
  simularPrice: vi.fn().mockResolvedValue({
    summary: {
      sistema: "PRICE",
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
      parcela: "8884.88",
      total_pago: "106618.53",
      total_juros: "6618.53",
      saldo_final: "0.00",
    },
    tables: { amortizacao: [] },
    charts: [],
    interpretation: { headline: "", body: "" },
    alerts: [],
  }),
  simularSac: vi.fn().mockResolvedValue({
    summary: {
      sistema: "SAC",
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
      amortizacao_constante: "8333.33",
      parcela_inicial: "9333.33",
      parcela_final: "8416.70",
      total_pago: "106500.00",
      total_juros: "6500.00",
      saldo_final: "0.00",
    },
    tables: { amortizacao: [] },
    charts: [],
    interpretation: { headline: "", body: "" },
    alerts: [],
  }),
  compararAmortizacao: vi.fn().mockResolvedValue({
    summary: {
      principal: "100000.00",
      taxa_periodo: "0.010000",
      n_periodos: 12,
      price: {
        sistema: "PRICE",
        principal: "100000.00",
        taxa_periodo: "0.010000",
        n_periodos: 12,
        parcela: "8884.88",
        total_pago: "106618.53",
        total_juros: "6618.53",
        saldo_final: "0.00",
      },
      sac: {
        sistema: "SAC",
        principal: "100000.00",
        taxa_periodo: "0.010000",
        n_periodos: 12,
        amortizacao_constante: "8333.33",
        parcela_inicial: "9333.33",
        parcela_final: "8416.70",
        total_pago: "106500.00",
        total_juros: "6500.00",
        saldo_final: "0.00",
      },
      diferenca_juros: "118.53",
      diferenca_total_pago: "118.53",
      menor_total_juros: "SAC",
    },
    tables: { price: [], sac: [] },
    charts: [],
    interpretation: { headline: "", body: "" },
    alerts: [],
  }),
}));

const emConstrucao = MODULES.filter(
  (module) => module.status === "em-construcao",
);
const disponiveis = MODULES.filter((module) => module.status === "disponivel");

describe("Rotas-base — módulos em breve", () => {
  for (const mod of emConstrucao) {
    it(`/${mod.slug} renderiza empty state elegante sem funcionalidade falsa`, async () => {
      const mod_ = await import(`@/app/(app)/${mod.slug}/page`);
      const Page = mod_.default as () => ReactElement;
      render(<Page />);

      expect(screen.getByTestId(`module-page-${mod.id}`)).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        mod.title,
      );
      expect(screen.getByText(/sem funcionalidade falsa/i)).toBeInTheDocument();
    });
  }
});

describe("Rotas-base — módulos disponíveis", () => {
  for (const mod of disponiveis) {
    it(`/${mod.slug} renderiza cockpit com título acessível`, async () => {
      const mod_ = await import(`@/app/(app)/${mod.slug}/page`);
      const Page = mod_.default as () => ReactElement;
      render(<Page />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        mod.title,
      );
      if (mod.slug === "juros") {
        expect(await screen.findByText("R$ 342.000,00")).toBeInTheDocument();
      }
      if (mod.slug === "amortizacao") {
        expect(await screen.findAllByText("R$ 8.884,88")).not.toHaveLength(0);
      }
    });
  }
});
