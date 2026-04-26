/**
 * Testes — envelope canônico (`isResponseEnvelope`, `unwrapEnvelope`).
 */
import { describe, expect, it } from "vitest";

import {
  InvalidEnvelopeError,
  isResponseEnvelope,
  unwrapEnvelope,
} from "@/lib/api/envelope";

describe("isResponseEnvelope", () => {
  it("aceita envelope canônico", () => {
    const ok = {
      success: true,
      message: "ok",
      data: { foo: 1 },
      meta: { request_id: "r", version: "v1", generated_at: "t" },
    };
    expect(isResponseEnvelope(ok)).toBe(true);
  });

  it("rejeita null, undefined e primitivos", () => {
    expect(isResponseEnvelope(null)).toBe(false);
    expect(isResponseEnvelope(undefined)).toBe(false);
    expect(isResponseEnvelope("x")).toBe(false);
    expect(isResponseEnvelope(42)).toBe(false);
  });

  it("rejeita objetos sem chaves obrigatórias", () => {
    expect(isResponseEnvelope({})).toBe(false);
    expect(isResponseEnvelope({ success: true })).toBe(false);
    expect(isResponseEnvelope({ success: true, message: "m", data: 1 })).toBe(
      false,
    );
  });
});

describe("unwrapEnvelope", () => {
  it("retorna data quando a forma é válida", () => {
    const envelope = {
      success: true,
      message: "ok",
      data: { value: 123 },
      meta: { request_id: "r", version: "v1", generated_at: "t" },
    };
    const data = unwrapEnvelope<{ value: number }>(envelope);
    expect(data.value).toBe(123);
  });

  it("lança InvalidEnvelopeError quando a forma é inválida", () => {
    expect(() => unwrapEnvelope({ data: { value: 1 } })).toThrow(
      InvalidEnvelopeError,
    );
  });
});
