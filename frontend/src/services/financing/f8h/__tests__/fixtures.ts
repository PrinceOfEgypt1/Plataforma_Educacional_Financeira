/**
 * Loader das 3 fixtures REAIS do contrato (HTTP 200). Apenas testes.
 * Sem números financeiros hard-coded: tudo vem dos JSON reais.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import type {
  CompareResponse,
  ComparePayload,
  UiInputs,
} from "../../../../types/financingF8H";

const here = dirname(fileURLToPath(import.meta.url));
// f8h/__tests__ -> f8h -> financing -> services -> src
const FIX_DIR = join(here, "..", "..", "..", "..", "__fixtures__", "financing");

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(FIX_DIR, name), "utf-8")) as T;
}

export interface RealScenario {
  id: string;
  request: ComparePayload;
  response: CompareResponse;
  uiInputs: UiInputs;
}

function toUiInputs(req: ComparePayload): UiInputs {
  return {
    valorImovel: Number(req.valor_imovel),
    entrada: Number(req.valor_entrada),
    prazoMeses: req.prazo_meses,
    taxaMensal: Number(req.taxa_juros_mensal_percentual) / 100, // "0.8500" -> 0.0085
    renda: 20000, // somente UI
    sistema: "SAC",
  };
}

const IDS = [
  "cenario_1000000_820000_120_085",
  "cenario_1300000_1130000_120_085",
  "cenario_900000_730000_120_091",
] as const;

export const REAL_SCENARIOS: RealScenario[] = IDS.map((id) => {
  const request = load<ComparePayload>(`request_${id}.json`);
  const response = load<CompareResponse>(`response_${id}.json`);
  return { id, request, response, uiInputs: toUiInputs(request) };
});
