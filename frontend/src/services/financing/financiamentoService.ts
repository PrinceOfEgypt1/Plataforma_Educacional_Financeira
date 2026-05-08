/**
 * Service frontend do endpoint de financiamento imobiliário.
 *
 * Esta camada não reimplementa cálculos financeiros. Apenas envia o payload
 * tipado, desembrulha o envelope padrão da API e normaliza erros para a UI.
 */

import { postJson, type PostOptions } from "@/lib/api/client";
import { toInterestApiError, type InterestApiError } from "@/lib/api/problem";
import type {
  FinanciamentoImobOut,
  FinanciamentoImobRequest,
} from "@/types/financing";

export type FinanciamentoApiError = InterestApiError;

const PATH_REAL_ESTATE = "/financing/real_estate" as const;

export async function simularFinanciamentoImobiliario(
  input: FinanciamentoImobRequest,
  options: PostOptions = {},
): Promise<FinanciamentoImobOut> {
  try {
    return await postJson<FinanciamentoImobRequest, FinanciamentoImobOut>(
      PATH_REAL_ESTATE,
      input,
      options,
    );
  } catch (error) {
    throw toInterestApiError(error);
  }
}
