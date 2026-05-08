/**
 * Service frontend do endpoint de diagnóstico financeiro.
 *
 * Esta camada não reimplementa regras financeiras. Apenas envia o payload
 * tipado, desembrulha o envelope padrão da API e normaliza erros para a UI.
 */

import { postJson, type PostOptions } from "@/lib/api/client";
import { toInterestApiError, type InterestApiError } from "@/lib/api/problem";
import type {
  DiagnosticAnalyzeRequest,
  DiagnosticAnalyzeResponseData,
} from "@/types/diagnostic";

export type DiagnosticoApiError = InterestApiError;

const PATH_ANALYZE = "/diagnostic/analyze" as const;

export async function analisarDiagnostico(
  input: DiagnosticAnalyzeRequest,
  options: PostOptions = {},
): Promise<DiagnosticAnalyzeResponseData> {
  try {
    return await postJson<DiagnosticAnalyzeRequest, DiagnosticAnalyzeResponseData>(
      PATH_ANALYZE,
      input,
      options,
    );
  } catch (error) {
    throw toInterestApiError(error);
  }
}
