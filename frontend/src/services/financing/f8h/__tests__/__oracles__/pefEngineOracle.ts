/**
 * Oráculo test-only do engine.js do protótipo F8E/F8H.
 *
 * Governança:
 * - Este arquivo só pode ser importado por testes.
 * - O engine.js é carregado via VM em sandbox local.
 * - Nenhum código de produção deve importar este módulo.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Script, createContext } from "node:vm";

export interface PrototypeEngineInputs {
  valorImovel: number;
  entrada: number;
  prazoMeses: number;
  taxaMensal: number;
  encargos?: number;
  renda?: number;
}

export interface PrototypeEngineRow {
  k: number;
  si: number;
  j: number;
  a: number;
  e: number;
  p: number;
  t: number;
  sf: number;
}

export interface PrototypeEngineSummary {
  system: "SAC" | "PRICE";
  PV: number;
  n: number;
  i: number;
  E: number;
  parcela1: number;
  parcelaN: number;
  parcela1SemEnc: number;
  parcelaN_SemEnc: number;
  parcelaMax: number;
  parcelaMin: number;
  jurosTotais: number;
  encargosTotais: number;
  totalPago: number;
  custoCredito: number;
  pctJuros: number;
  cetMes: number;
  cetAno: number;
  rows: PrototypeEngineRow[];
}

export interface PrototypeEngineResult {
  inputs: {
    valorImovel: number;
    entrada: number;
    PV: number;
    n: number;
    i: number;
    E: number;
    renda: number;
  };
  pctEntrada: number;
  taxaAnual: number;
  sac: PrototypeEngineSummary;
  price: PrototypeEngineSummary;
  economiaSACvsPRICE: number;
  comprometimento: (parcela: number) => number;
}

interface PrototypeEngineApi {
  compute: (inputs: PrototypeEngineInputs) => PrototypeEngineResult;
}

let cachedEngine: PrototypeEngineApi | null = null;

function loadPrototypeEngine(): PrototypeEngineApi {
  if (cachedEngine !== null) {
    return cachedEngine;
  }

  const here = dirname(fileURLToPath(import.meta.url));
  const enginePath = join(here, "engine.js");
  const code = readFileSync(enginePath, "utf-8");

  const sandbox: {
    window: { PEF?: PrototypeEngineApi };
    console: Console;
    Math: Math;
    Number: NumberConstructor;
    isFinite: typeof isFinite;
  } = {
    window: {},
    console,
    Math,
    Number,
    isFinite,
  };

  const context = createContext(sandbox);
  new Script(code, { filename: enginePath }).runInContext(context);

  if (sandbox.window.PEF === undefined) {
    throw new Error("engine.js não expôs window.PEF no sandbox de teste.");
  }

  cachedEngine = sandbox.window.PEF;
  return cachedEngine;
}

export function computeWithPrototypeEngine(
  inputs: PrototypeEngineInputs,
): PrototypeEngineResult {
  return loadPrototypeEngine().compute(inputs);
}
