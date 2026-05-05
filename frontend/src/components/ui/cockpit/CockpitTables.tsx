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
        <thead>
          <tr>
            <th>Mês</th>
            <th>Juros</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.periodo}>
              <td>{row.periodo}</td>
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
        <thead>
          <tr>
            <th>Mês</th>
            <th>Juros</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.periodo}>
              <td>{row.periodo}</td>
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
        <thead>
          <tr>
            <th>#</th>
            <th>Parcela</th>
            <th>Juros</th>
            <th>Amort.</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.periodo}>
              <td>{row.periodo}</td>
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
