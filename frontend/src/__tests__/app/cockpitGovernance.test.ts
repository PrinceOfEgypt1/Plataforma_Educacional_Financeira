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
});
