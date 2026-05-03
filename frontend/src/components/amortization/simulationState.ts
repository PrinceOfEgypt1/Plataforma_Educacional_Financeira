import type { AmortizationApiError } from "@/services/amortization/amortizationService";

export type SimulationState<T> =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: T }
  | { readonly status: "error"; readonly error: AmortizationApiError };

export const IDLE: SimulationState<never> = { status: "idle" } as const;
export const LOADING: SimulationState<never> = {
  status: "loading",
} as const;
