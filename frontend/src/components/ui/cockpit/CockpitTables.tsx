import { formatBRL } from "@/lib/money";
import type { AmortizationPeriodRow } from "@/types/amortization";
import type { PeriodoCompostoRow, PeriodoSimplesRow } from "@/types/interest";

export function InterestSimpleTable({
  rows,
}: {
  readonly rows: ReadonlyArray<PeriodoSimplesRow>;
}) {
  return (
    <div className="cockpit-table-wrap" data-testid="cockpit-table-simple">
      <table className="cockpit-table">
        <caption className="sr-only">Evolução mensal de juros simples</caption>
        <thead>
          <tr>
            <th scope="col">Mês</th>
            <th scope="col">Juros</th>
            <th scope="col">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.periodo}>
              <th scope="row">{row.periodo}</th>
              <td>{formatBRL(row.juros_periodo)}</td>
              <td>{formatBRL(row.saldo_final)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InterestCompoundTable({
  rows,
}: {
  readonly rows: ReadonlyArray<PeriodoCompostoRow>;
}) {
  return (
    <div className="cockpit-table-wrap" data-testid="cockpit-table-compound">
      <table className="cockpit-table">
        <caption className="sr-only">
          Evolução mensal de juros compostos
        </caption>
        <thead>
          <tr>
            <th scope="col">Mês</th>
            <th scope="col">Juros</th>
            <th scope="col">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.periodo}>
              <th scope="row">{row.periodo}</th>
              <td>{formatBRL(row.juros_periodo)}</td>
              <td>{formatBRL(row.saldo_final)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AmortizationCockpitTable({
  rows,
}: {
  readonly rows: ReadonlyArray<AmortizationPeriodRow>;
}) {
  return (
    <div
      className="cockpit-table-wrap"
      data-testid="cockpit-table-amortization"
    >
      <table className="cockpit-table">
        <caption className="sr-only">Tabela de amortização do cockpit</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Parcela</th>
            <th scope="col">Juros</th>
            <th scope="col">Amort.</th>
            <th scope="col">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.periodo}>
              <th scope="row">{row.periodo}</th>
              <td>{formatBRL(row.parcela)}</td>
              <td>{formatBRL(row.juros)}</td>
              <td>{formatBRL(row.amortizacao)}</td>
              <td>{formatBRL(row.saldo_final)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function toNumber(value: string | undefined): number {
  if (value === undefined) return 0;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function formatSignedBRL(value: number): string {
  const formatted = formatBRL(Math.abs(value).toFixed(2));
  if (value === 0) return formatted;
  return `${value > 0 ? "+" : "-"} ${formatted}`;
}

export function AmortizationCompareTable({
  priceRows,
  sacRows,
}: {
  readonly priceRows: ReadonlyArray<AmortizationPeriodRow>;
  readonly sacRows: ReadonlyArray<AmortizationPeriodRow>;
}) {
  const max = Math.max(priceRows.length, sacRows.length);
  return (
    <div
      className="cockpit-table-wrap"
      data-testid="cockpit-table-amortization-compare"
    >
      <table className="cockpit-table">
        <caption className="sr-only">
          Comparação de parcelas PRICE e SAC no cockpit
        </caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">PMT Price</th>
            <th scope="col">PMT SAC</th>
            <th scope="col">Δ Parcela</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: max }, (_, index) => {
            const price = priceRows[index];
            const sac = sacRows[index];
            const difference =
              toNumber(sac?.parcela) - toNumber(price?.parcela);
            return (
              <tr key={index + 1}>
                <th scope="row">{index + 1}</th>
                <td>{price ? formatBRL(price.parcela) : "..."}</td>
                <td>{sac ? formatBRL(sac.parcela) : "..."}</td>
                <td
                  className={
                    difference > 0
                      ? "delta-amber"
                      : difference < 0
                        ? "delta-green"
                        : undefined
                  }
                >
                  {formatSignedBRL(difference)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
