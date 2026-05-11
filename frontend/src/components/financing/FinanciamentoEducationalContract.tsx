import { formatBRL } from "@/lib/money";
import type { FinanciamentoImobOut } from "@/types/financing";

interface ContractCardProps {
  readonly tone: "blue" | "amber" | "green";
  readonly label: string;
  readonly title: string;
  readonly children: string;
}

const toneClass = {
  blue: "border-blue-200 bg-blue-50 text-blue-950",
  amber: "border-amber-200 bg-amber-50 text-amber-950",
  green: "border-emerald-200 bg-emerald-50 text-emerald-950",
} as const;

function ContractCard({ tone, label, title, children }: ContractCardProps) {
  return (
    <article
      className={`rounded-lg border p-3 ${toneClass[tone]}`}
      data-testid={`financiamento-contract-card-${label}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide">
        {label}
      </p>
      <h4 className="mt-1 text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs leading-5">{children}</p>
    </article>
  );
}

interface FinanciamentoEducationalContractProps {
  readonly result: FinanciamentoImobOut;
}

export function FinanciamentoEducationalContract({
  result,
}: FinanciamentoEducationalContractProps) {
  const memoria = result.memoria_calculo;
  const primeira = memoria.primeira_parcela;

  return (
    <section
      className="flex flex-col gap-4"
      data-testid="financiamento-educational-contract"
      aria-label="Contrato educacional do financiamento"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <ContractCard tone="blue" label="memoria" title="Memória de cálculo">
          {memoria.formula}
        </ContractCard>
        <ContractCard tone="amber" label="alerta" title="Risco da simulação">
          {result.alertas[0] ?? "Simulação educacional sem valor contratual."}
        </ContractCard>
        <ContractCard
          tone="green"
          label="tabela"
          title={`${result.metadados_calculo.linhas_tabela} linhas`}
        >
          A tabela respeita o prazo informado e preserva todas as parcelas.
        </ContractCard>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Rastreabilidade entre entrada, fórmula e resultado
        </h3>
        <dl className="mt-3 grid gap-2 text-xs text-gray-700 md:grid-cols-2">
          <div>
            <dt className="font-semibold">Substituição</dt>
            <dd>{memoria.substituicao}</dd>
          </div>
          <div>
            <dt className="font-semibold">Arredondamento</dt>
            <dd>{memoria.arredondamento}</dd>
          </div>
          <div>
            <dt className="font-semibold">Composição da primeira parcela</dt>
            <dd>
              Juros {formatBRL(primeira.juros)}, amortização{" "}
              {formatBRL(primeira.amortizacao)} e encargos{" "}
              {formatBRL(primeira.encargos)}.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Custo total</dt>
            <dd>{formatBRL(memoria.custo_total)}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Alertas e limites
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-700">
            {[...result.alertas, ...result.limites].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Fontes e mensagens para interface
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-700">
            {result.fontes.map((fonte) => (
              <li key={fonte.nome}>
                <strong>{fonte.nome}:</strong> {fonte.observacao}
              </li>
            ))}
            {result.mensagens_interface.map((mensagem) => (
              <li key={mensagem}>{mensagem}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
