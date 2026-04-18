/**
 * Testes dos 4 componentes UI reutilizáveis — SummaryCard, AlertBanner,
 * FormSection, EducationPanel.
 *
 * Cada teste valida contrato de API + semântica ARIA + consumo dos tokens
 * via CSS var (sem hardcoded).
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  SummaryCard,
  AlertBanner,
  FormSection,
  EducationPanel,
} from "@/components/ui";

describe("<SummaryCard />", () => {
  it("exibe label e valor", () => {
    render(<SummaryCard label="Custo total" value="R$ 12.345,67" />);
    expect(screen.getByText("Custo total")).toBeInTheDocument();
    expect(screen.getByText("R$ 12.345,67")).toBeInTheDocument();
  });

  it("renderiza delta com tendência positiva por padrão apenas quando passado", () => {
    render(
      <SummaryCard
        label="Economia"
        value="R$ 200,00"
        delta="+R$ 50,00"
        trend="positive"
      />,
    );
    const delta = screen.getByTestId("summary-card-delta");
    expect(delta).toHaveTextContent(/\+R\$ 50,00/);
  });

  it("não renderiza delta quando não fornecido", () => {
    render(<SummaryCard label="Saldo" value="R$ 0,00" />);
    expect(screen.queryByTestId("summary-card-delta")).not.toBeInTheDocument();
  });

  it("aplica aria-label derivado do rótulo", () => {
    render(<SummaryCard label="Taxa" value="1,25% a.m." />);
    expect(
      screen.getByRole("article", { name: /resumo: taxa/i }),
    ).toBeInTheDocument();
  });
});

describe("<AlertBanner />", () => {
  it("nivel info usa role status", () => {
    render(<AlertBanner level="info">mensagem</AlertBanner>);
    expect(screen.getByTestId("alert-banner")).toHaveAttribute(
      "data-level",
      "info",
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("nivel warning usa role alert", () => {
    render(<AlertBanner level="warning">algo</AlertBanner>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("nivel error usa role alert", () => {
    render(<AlertBanner level="error">erro</AlertBanner>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renderiza título quando fornecido", () => {
    render(
      <AlertBanner level="warning" title="Atenção">
        texto
      </AlertBanner>,
    );
    expect(screen.getByText("Atenção")).toBeInTheDocument();
    expect(screen.getByText("texto")).toBeInTheDocument();
  });
});

describe("<FormSection />", () => {
  it("envolve filhos em fieldset/legend", () => {
    render(
      <FormSection title="Entrada de dados">
        <input aria-label="valor" />
      </FormSection>,
    );
    const fieldset = screen.getByTestId("form-section");
    expect(fieldset.tagName.toLowerCase()).toBe("fieldset");
    expect(fieldset.querySelector("legend")?.textContent).toContain(
      "Entrada de dados",
    );
  });

  it("renderiza descrição opcional", () => {
    render(
      <FormSection title="Parâmetros" description="Preencha os campos a seguir">
        <input aria-label="v" />
      </FormSection>,
    );
    expect(
      screen.getByText(/preencha os campos a seguir/i),
    ).toBeInTheDocument();
  });
});

describe("<EducationPanel />", () => {
  it("expõe role complementary com aria-label derivado", () => {
    render(
      <EducationPanel title="Sobre Juros Compostos">
        <p>conteúdo</p>
      </EducationPanel>,
    );
    const panel = screen.getByRole("complementary", {
      name: /conteúdo educativo: sobre juros compostos/i,
    });
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveTextContent("conteúdo");
  });
});
