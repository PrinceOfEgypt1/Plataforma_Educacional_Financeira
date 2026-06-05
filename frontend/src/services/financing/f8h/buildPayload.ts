/**
 * buildPayload — monta o request oficial F8H a partir das entradas de UI.
 * Nenhum cálculo financeiro: apenas formatação/serialização conforme contrato.
 */

import type { ComparePayload, UiInputs } from "../../../types/financingF8H";

/** Formata número monetário/encargo como string decimal de 2 casas. */
export function money(value: number): string {
  return value.toFixed(2);
}

/**
 * Regras do contrato:
 *   - valor_imovel / valor_entrada / encargos → string decimal (toFixed(2)).
 *   - prazo_meses → inteiro.
 *   - taxa_juros_mensal_percentual → PONTOS PERCENTUAIS, 4 casas:
 *       0.0085 (decimal) → "0.8500".
 *   - encargos opcionais entram apenas quando informados.
 */
export function buildPayload(inputs: UiInputs): ComparePayload {
  const payload: ComparePayload = {
    valor_imovel: money(inputs.valorImovel),
    valor_entrada: money(inputs.entrada),
    prazo_meses: Math.round(inputs.prazoMeses),
    taxa_juros_mensal_percentual: (inputs.taxaMensal * 100).toFixed(4),
  };

  const e = inputs.encargos;
  if (e) {
    if (e.seguroMensal !== undefined)
      payload.seguro_mensal = money(e.seguroMensal);
    if (e.tarifaMensal !== undefined)
      payload.tarifa_mensal = money(e.tarifaMensal);
    if (e.custoAdministrativoMensal !== undefined)
      payload.custo_administrativo_mensal = money(e.custoAdministrativoMensal);
    if (e.mipMensal !== undefined) payload.mip_mensal = money(e.mipMensal);
    if (e.dfiDfcMensal !== undefined)
      payload.dfi_dfc_mensal = money(e.dfiDfcMensal);
    if (e.taxaAdministracaoMensal !== undefined)
      payload.taxa_administracao_mensal = money(e.taxaAdministracaoMensal);
  }

  return payload;
}
