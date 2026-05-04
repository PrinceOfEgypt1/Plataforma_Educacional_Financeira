/**
 * Testes dos Design System Tokens — Sprint 0
 * Garantem que os tokens estão definidos e coerentes.
 * O impact agent detecta mudanças em tokens como risco HIGH —
 * qualquer mudança aqui deve ser intencional.
 */
import { describe, it, expect } from "vitest";
import { tokens } from "../styles/tokens";

describe("Design Tokens — Brand", () => {
  it("define cor primária da marca", () => {
    expect(tokens.colors.brand.primary).toBe("#1B4F72");
  });
  it("define cor secundária da marca", () => {
    expect(tokens.colors.brand.secondary).toBe("#2E75B6");
  });
  it("define cor de destaque", () => {
    expect(tokens.colors.brand.accent).toBe("#27AE60");
  });
  it("define cor suave de marca para superfícies", () => {
    expect(tokens.colors.brand.soft).toBe("#E8F1F7");
  });
});

describe("Design Tokens — Visual foundation", () => {
  it("define tokens de aprendizado e superfície", () => {
    expect(tokens.colors.learning.primary).toBe("#7C3AED");
    expect(tokens.colors.learning.soft).toBe("#F3E8FF");
    expect(tokens.colors.surface.app).toBe("#F5F7FB");
    expect(tokens.colors.surface.default).toBe("#FFFFFF");
  });
});

describe("Design Tokens — Financial", () => {
  it("positivo e negativo são cores distintas", () => {
    expect(tokens.colors.financial.positive).not.toBe(
      tokens.colors.financial.negative,
    );
  });
  it("positivo é verde (contexto de ganho)", () => {
    expect(tokens.colors.financial.positive.toLowerCase()).toContain("16a3");
  });
  it("negativo é vermelho (contexto de custo/juro)", () => {
    expect(tokens.colors.financial.negative.toLowerCase()).toContain("dc26");
  });
  it("define todas as 4 cores financeiras", () => {
    const { positive, negative, neutral, warning } = tokens.colors.financial;
    expect([positive, negative, neutral, warning].every(Boolean)).toBe(true);
  });
});

describe("Design Tokens — Typography", () => {
  it("fontFamily.sans contém Inter como primeira opção", () => {
    expect(tokens.typography.fontFamily.sans).toMatch(/^Inter/);
  });
  it("fontFamily.mono contém JetBrains Mono", () => {
    expect(tokens.typography.fontFamily.mono).toContain("JetBrains Mono");
  });
  it("define tamanhos de fonte base e sm", () => {
    expect(tokens.typography.fontSize.base).toBe("1rem");
    expect(tokens.typography.fontSize.sm).toBe("0.875rem");
  });
});

describe("Design Tokens — Spacing", () => {
  it("define espaçamento de página", () => {
    expect(tokens.spacing.page).toBeDefined();
  });
  it("espaço de seção é maior que espaço de card", () => {
    const toRem = (v: string) => parseFloat(v);
    expect(toRem(tokens.spacing.section)).toBeGreaterThan(
      toRem(tokens.spacing.card),
    );
  });
});

describe("Design Tokens — Breakpoints", () => {
  it("mobile < tablet < desktop", () => {
    const toNum = (v: string) => parseInt(v, 10);
    expect(toNum(tokens.breakpoints.mobile)).toBeLessThan(
      toNum(tokens.breakpoints.tablet),
    );
    expect(toNum(tokens.breakpoints.tablet)).toBeLessThan(
      toNum(tokens.breakpoints.desktop),
    );
  });
});

describe("Design Tokens — Integridade geral", () => {
  it("todos os tokens são strings não-vazias", () => {
    const flatten = (obj: Record<string, unknown>): string[] =>
      Object.values(obj).flatMap((v) =>
        typeof v === "object" && v !== null
          ? flatten(v as Record<string, unknown>)
          : [v as string],
      );
    const values = flatten(tokens as unknown as Record<string, unknown>);
    expect(values.every((v) => typeof v === "string" && v.length > 0)).toBe(
      true,
    );
  });
});
