/**
 * Service frontend dos endpoints de amortizacao.
 *
 * Esta camada nao reimplementa PRICE/SAC. Ela apenas envia payloads tipados,
 * desembrulha o envelope padrao da API e normaliza erros para a UI.
 */

import { postJson, type PostOptions } from "@/lib/api/client";
import { toInterestApiError, type InterestApiError } from "@/lib/api/problem";
import type {
  CompareAmortizationIn,
  CompareAmortizationOut,
  PriceIn,
  PriceOut,
  SacIn,
  SacOut,
} from "@/types/amortization";

export type AmortizationApiError = InterestApiError;

const PATH_PRICE = "/amortization/price" as const;
const PATH_SAC = "/amortization/sac" as const;
const PATH_COMPARE = "/amortization/compare" as const;

async function post<TIn, TOut>(
  url: string,
  body: TIn,
  options: PostOptions,
): Promise<TOut> {
  try {
    return await postJson<TIn, TOut>(url, body, options);
  } catch (error) {
    throw toInterestApiError(error);
  }
}

export async function simularPrice(
  input: PriceIn,
  options: PostOptions = {},
): Promise<PriceOut> {
  return post<PriceIn, PriceOut>(PATH_PRICE, input, options);
}

export async function simularSac(
  input: SacIn,
  options: PostOptions = {},
): Promise<SacOut> {
  return post<SacIn, SacOut>(PATH_SAC, input, options);
}

export async function compararAmortizacao(
  input: CompareAmortizationIn,
  options: PostOptions = {},
): Promise<CompareAmortizationOut> {
  return post<CompareAmortizationIn, CompareAmortizationOut>(
    PATH_COMPARE,
    input,
    options,
  );
}
