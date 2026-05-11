import { postJson, type PostOptions } from "@/lib/api/client";
import { toInterestApiError, type InterestApiError } from "@/lib/api/problem";
import type {
  FinanciamentoImobCompareOut,
  FinanciamentoImobCompareRequest,
  FinanciamentoImobOut,
  FinanciamentoImobRequest,
} from "@/types/financing";

export type FinanciamentoApiError = InterestApiError;

const PATH_REAL_ESTATE = "/financing/real_estate" as const;
const PATH_REAL_ESTATE_COMPARE = "/financing/real_estate/compare" as const;

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

export async function compararFinanciamentos(
  input: FinanciamentoImobCompareRequest,
  options: PostOptions = {},
): Promise<FinanciamentoImobCompareOut> {
  try {
    return await postJson<
      FinanciamentoImobCompareRequest,
      FinanciamentoImobCompareOut
    >(PATH_REAL_ESTATE_COMPARE, input, options);
  } catch (error) {
    throw toInterestApiError(error);
  }
}
