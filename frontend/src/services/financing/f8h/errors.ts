/**
 * Erros da camada de dados F8H. Nomes com sufixo F8H para não colidir com
 * `FinanciamentoApiError` (já existente no service vivo do projeto).
 * Nenhum cálculo financeiro aqui.
 */

/** Erro de regra de domínio detectado ANTES de chamar o backend. */
export class FinancingF8HValidationError extends Error {
  readonly code = "FINANCING_F8H_VALIDATION_ERROR";
  constructor(message: string) {
    super(message);
    this.name = "FinancingF8HValidationError";
  }
}

/** Erro HTTP/contrato vindo do backend (não-2xx ou corpo inesperado). */
export class FinancingF8HApiError extends Error {
  readonly code = "FINANCING_F8H_API_ERROR";
  readonly status: number;
  /** request_id do envelope `meta`, quando presente. */
  readonly requestId?: string;
  /** corpo de erro bruto do backend, quando legível. */
  readonly body?: unknown;

  constructor(
    message: string,
    opts: { status: number; requestId?: string; body?: unknown },
  ) {
    super(message);
    this.name = "FinancingF8HApiError";
    this.status = opts.status;
    if (opts.requestId !== undefined) {
      this.requestId = opts.requestId;
    }
    this.body = opts.body;
  }
}
