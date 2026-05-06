import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

describe("Financial Cockpit — governança de código", () => {
  it("não contém cálculo financeiro crítico copiado do protótipo", () => {
    const files = [
      "src/components/interest/InterestCockpit.tsx",
      "src/components/amortization/AmortizationCockpit.tsx",
    ];
    const source = files
      .map((file) => readFileSync(join(ROOT, file), "utf8"))
      .join("\n");

    expect(source).not.toMatch(/Math\.pow/);
    expect(source).not.toMatch(/pmt\s*=/i);
    expect(source).not.toMatch(/juros\s*=/i);
    expect(source).not.toMatch(/montante\s*=/i);
    expect(source).not.toMatch(/amortizacao\s*=/i);
  });

  it("estrutura global declara overflow hidden e cockpit sem sidebar", () => {
    const globals = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");
    const shell = readFileSync(
      join(ROOT, "src/components/shell/ShellLayout.tsx"),
      "utf8",
    );

    expect(globals).toMatch(/overflow:\s*hidden/);
    expect(globals).toMatch(/grid-template-rows:\s*var\(--topbar-h\) 1fr/);
    expect(shell).not.toMatch(/Sidebar/);
  });

  it("mantém adaptação básica para tablet e mobile sem scroll de página", () => {
    const globals = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");

    expect(globals).toMatch(/@media\s*\(max-width:\s*1100px\)/);
    expect(globals).toMatch(/@media\s*\(max-width:\s*767px\)/);
    expect(globals).toMatch(
      /\.cockpit-content-grid\s*{[^}]*overflow-y:\s*auto/s,
    );
    expect(globals).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    expect(globals).toMatch(
      /\.cockpit-module-tabs,\s*\.cockpit-sub-tabs\s*{[^}]*overflow-x:\s*auto/s,
    );
  });

  it("campos de taxa do cockpit não usam validação nativa de input number", () => {
    const files = [
      "src/components/interest/InterestCockpit.tsx",
      "src/components/amortization/AmortizationCockpit.tsx",
      "src/components/ui/cockpit/CockpitPrimitives.tsx",
    ];
    const source = files
      .map((file) => readFileSync(join(ROOT, file), "utf8"))
      .join("\n");

    expect(source).not.toMatch(/type="number"/);
    expect(source).toMatch(/noValidate/);
    expect(source).toMatch(/inputMode = "decimal"/);
  });

  it("não contém truncamento artificial de 12 períodos no cockpit", () => {
    const files = [
      "src/components/interest/InterestCockpit.tsx",
      "src/components/amortization/AmortizationCockpit.tsx",
      "src/components/ui/cockpit/CockpitCharts.tsx",
      "src/components/ui/cockpit/CockpitTables.tsx",
    ];
    const source = files
      .map((file) => readFileSync(join(ROOT, file), "utf8"))
      .join("\n");

    expect(source).not.toMatch(/slice\(0,\s*12\)/);
    expect(source).not.toMatch(/limit.*12/i);
    expect(source).not.toMatch(/take.*12/i);
    expect(source).not.toMatch(/>\s*\.\.\.\s*</);
  });
});
