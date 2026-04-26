/**
 * Smoke test — /juros renderiza o módulo real (não o placeholder).
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* ResizeObserver — recharts usa em runtime; jsdom não traz nativamente.
 * Tipado sem `any`: interface local + `vi.stubGlobal`. */
interface MinimalResizeObserver {
  observe(): void;
  unobserve(): void;
  disconnect(): void;
}
class NoopResizeObserver implements MinimalResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal("ResizeObserver", NoopResizeObserver);

vi.mock("next/navigation", () => ({
  usePathname: () => "/juros",
  useRouter: () => ({ push: () => {} }),
}));

import JurosPage from "@/app/(app)/juros/page";

describe("JurosPage", () => {
  it("renderiza tabs e formulário inicial (juros simples)", () => {
    render(<JurosPage />);
    expect(screen.getByTestId("juros-page")).toBeInTheDocument();
    expect(screen.getByTestId("juros-tabs")).toBeInTheDocument();
    expect(screen.getByTestId("juros-simples-form")).toBeInTheDocument();
    // NÃO deve aparecer o texto do placeholder genérico.
    expect(screen.queryByText(/Módulo em construção/i)).not.toBeInTheDocument();
  });
});
