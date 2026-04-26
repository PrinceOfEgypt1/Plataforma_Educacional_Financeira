/**
 * Testes — classificação de erros da API (`toInterestApiError`).
 *
 * Cobrimos as 4 classes do discriminador e a lógica fina do 405 nativo
 * (assimetria documentada em E04).
 *
 * **Tipagem forte:** usamos o helper `makeAxiosError` (em `_helpers/axiosStubs`)
 * que constrói `AxiosError` com `headers: AxiosHeaders` e
 * `config: InternalAxiosRequestConfig` reais — sem `any`.
 */
import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { describeApiError, toInterestApiError } from "@/lib/api/problem";

import { makeAxiosError } from "../../_helpers/axiosStubs";

describe("toInterestApiError", () => {
  it("classifica 422 Problem+JSON como kind=problem", () => {
    const err = makeAxiosError(422, {
      type: "about:blank",
      title: "Validation Error",
      status: 422,
      detail: "principal não pode ser negativo",
      code: "VALIDATION_ERROR",
    });
    const classified = toInterestApiError(err);
    expect(classified.kind).toBe("problem");
    if (classified.kind !== "problem") throw new Error("expected problem");
    expect(classified.status).toBe(422);
    expect(classified.detail).toContain("principal");
    expect(classified.code).toBe("VALIDATION_ERROR");
  });

  it("classifica 405 nativo do Starlette como kind=method_not_allowed", () => {
    const err = makeAxiosError(
      405,
      { detail: "Method Not Allowed" },
      { allow: "POST" },
    );
    const classified = toInterestApiError(err);
    expect(classified.kind).toBe("method_not_allowed");
    if (classified.kind !== "method_not_allowed") {
      throw new Error("expected method_not_allowed");
    }
    expect(classified.status).toBe(405);
    expect(classified.allow).toBe("POST");
    expect(classified.detail).toBe("Method Not Allowed");
  });

  it("classifica falha sem response como kind=network", () => {
    const err = new AxiosError("ECONNREFUSED");
    const classified = toInterestApiError(err);
    expect(classified.kind).toBe("network");
    if (classified.kind !== "network") throw new Error("expected network");
    expect(classified.message).toContain("ECONNREFUSED");
  });

  it("classifica Error arbitrário como kind=unknown", () => {
    const classified = toInterestApiError(new Error("explodiu"));
    expect(classified.kind).toBe("unknown");
    if (classified.kind !== "unknown") throw new Error("expected unknown");
    expect(classified.message).toBe("explodiu");
  });

  it("classifica non-Error como kind=unknown com raw preservado", () => {
    const classified = toInterestApiError("ops");
    expect(classified.kind).toBe("unknown");
    if (classified.kind !== "unknown") throw new Error("expected unknown");
    expect(classified.raw).toBe("ops");
  });

  it("describeApiError produz mensagem legível para cada classe", () => {
    const messages = [
      describeApiError({
        kind: "problem",
        status: 422,
        title: "t",
        detail: "x",
        raw: { detail: "x" },
      }),
      describeApiError({
        kind: "method_not_allowed",
        status: 405,
        detail: "y",
      }),
      describeApiError({ kind: "network", message: "z" }),
      describeApiError({ kind: "unknown", message: "w" }),
    ];
    messages.forEach((m) => {
      expect(typeof m).toBe("string");
      expect(m.length).toBeGreaterThan(0);
    });
  });
});
