/**
 * Barrel da camada de API — importe sempre via `@/lib/api`.
 */
export { getApiClient, postJson } from "./client";
export type { PostOptions } from "./client";

export {
  isResponseEnvelope,
  unwrapEnvelope,
  InvalidEnvelopeError,
} from "./envelope";
export type { ResponseEnvelope, ResponseMeta } from "./envelope";

export { toInterestApiError, describeApiError } from "./problem";
export type {
  InterestApiError,
  ProblemApiError,
  MethodNotAllowedApiError,
  NetworkApiError,
  UnknownApiError,
  ProblemDetailsBody,
} from "./problem";
