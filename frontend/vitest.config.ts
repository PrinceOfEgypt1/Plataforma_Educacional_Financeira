/**
 * Configuração do Vitest para a Plataforma Educacional Financeira.
 *
 * - `environment: "jsdom"` habilita testes de componentes React
 *   (pendência P3 herdada da Sprint 0, fechada na Sprint 1).
 * - `setupFiles` carrega `@testing-library/jest-dom` globalmente.
 * - `include` restringe aos diretórios `src/__tests__/` e `src/**` a fim de
 *   evitar que `node_modules` ou `.next/` sejam varridos.
 */
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: [
      "src/__tests__/**/*.{test,spec}.{ts,tsx}",
      "src/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/__tests__/**",
        "src/tests/**",
        "src/**/*.d.ts",
        "src/app/**/layout.tsx",
      ],
    },
  },
});
