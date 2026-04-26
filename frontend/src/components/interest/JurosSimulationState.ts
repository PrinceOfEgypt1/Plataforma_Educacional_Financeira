/**
 * Máquina de estados mínima compartilhada pelos orquestradores.
 *
 * Estados possíveis:
 *   - `idle`    — formulário em branco / nunca simulou
 *   - `loading` — requisição em voo
 *   - `ok`      — resposta recebida, `result` disponível
 *   - `error`   — falha, `error` (InterestApiError) disponível
 */
import type { InterestApiError } from "@/lib/api/problem";

export type SimulationState<TResult> =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: TResult }
  | { readonly status: "error"; readonly error: InterestApiError };

export const IDLE = { status: "idle" } as const;
export const LOADING = { status: "loading" } as const;
