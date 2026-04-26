/**
 * Envelope canônico de sucesso — Doc 06 §4.1.
 *
 * O backend sempre devolve respostas 2xx neste formato. O frontend
 * **nunca** consome `data` diretamente do axios: passa pelo
 * `unwrapEnvelope` para garantir a forma esperada.
 */

export interface ResponseMeta {
  readonly request_id: string;
  readonly version: string;
  readonly generated_at: string;
}

export interface ResponseEnvelope<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly meta: ResponseMeta;
}

/** Type guard — garante que o valor tem a forma esperada do envelope. */
export function isResponseEnvelope<T>(
  value: unknown,
): value is ResponseEnvelope<T> {
  if (value === null || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v["success"] === "boolean" &&
    typeof v["message"] === "string" &&
    "data" in v &&
    typeof v["meta"] === "object" &&
    v["meta"] !== null
  );
}

/**
 * Extrai a carga útil do envelope. Lança `InvalidEnvelopeError` se a
 * forma divergir — prefere falhar rápido a propagar `undefined`
 * silencioso pela aplicação.
 */
export class InvalidEnvelopeError extends Error {
  readonly received: unknown;

  constructor(received: unknown) {
    super(
      "Resposta do backend não segue o envelope canônico " +
        "{ success, message, data, meta }.",
    );
    this.name = "InvalidEnvelopeError";
    this.received = received;
  }
}

export function unwrapEnvelope<T>(payload: unknown): T {
  if (!isResponseEnvelope<T>(payload)) {
    throw new InvalidEnvelopeError(payload);
  }
  return payload.data;
}
