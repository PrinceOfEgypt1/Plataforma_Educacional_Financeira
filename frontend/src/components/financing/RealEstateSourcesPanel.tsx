"use client";

/**
 * RealEstateSourcesPanel — Fontes, limites e alertas redesenhados
 *
 * ITEM 14D-B: 4 cards categorizados por cor (verde/vermelho/âmbar/âmbar)
 * + card violeta de referências. Tom educativo, não burocrático.
 */

import type {
  FinanciamentoFonte,
  FinanciamentoImobOut,
} from "@/types/financing";
import { GlossaryTerm } from "@/components/education/GlossaryTerm";

const DEFAULT_FONTES: ReadonlyArray<FinanciamentoFonte> = [
  {
    nome: "Banco Central do Brasil",
    tipo: "institucional",
    observacao:
      "Referência regulatória para CET, crédito e educação financeira.",
  },
  {
    nome: "Sistema Financeiro da Habitação",
    tipo: "institucional",
    observacao: "Normas para financiamentos habitacionais no Brasil.",
  },
  {
    nome: "Instituição financeira",
    tipo: "operacional",
    observacao:
      "A proposta formal e o CET oficial só podem ser fornecidos pela IF.",
  },
];

interface SourceCardProps {
  readonly title: string;
  readonly items: ReadonlyArray<string>;
  readonly tone: "green" | "red" | "amber";
}

function SourceCard({ title, items, tone }: SourceCardProps) {
  const styles = {
    green: {
      wrapper: "border-emerald-300/15 bg-emerald-400/8",
      head: "text-emerald-300",
      dot: "text-emerald-400",
      text: "text-emerald-50/80",
    },
    red: {
      wrapper: "border-rose-300/15 bg-rose-400/8",
      head: "text-rose-300",
      dot: "text-rose-400",
      text: "text-rose-50/80",
    },
    amber: {
      wrapper: "border-amber-300/15 bg-amber-400/8",
      head: "text-amber-300",
      dot: "text-amber-400",
      text: "text-amber-50/80",
    },
  };
  const s = styles[tone];
  return (
    <article className={`rounded-xl border p-3.5 ${s.wrapper}`}>
      <h3 className={`text-[11px] font-semibold ${s.head}`}>{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-[11px] leading-4.5">
            <span className={`flex-shrink-0 ${s.dot}`}>·</span>
            <span className={s.text}>{it}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

interface Props {
  readonly result: FinanciamentoImobOut | undefined;
}

export function RealEstateSourcesPanel({ result }: Props) {
  const fontes =
    result !== undefined && result.fontes.length > 0
      ? result.fontes
      : DEFAULT_FONTES;

  const dynamicAlerts =
    result !== undefined
      ? [...result.alertas, ...result.limites, ...result.mensagens_interface]
      : [];

  const limitsToShow =
    dynamicAlerts.length > 0
      ? dynamicAlerts
      : [
          "Simulação educacional — não substitui proposta formal.",
          "CET oficial inclui cartório, avaliação e registro.",
          "Aprovação depende de análise de crédito da IF.",
          "Seguros calculados por faixa etária e perfil real.",
          "Correção por TR/IPCA/índice contratual não está incluída.",
        ];

  return (
    <div
      className="space-y-3 overflow-y-auto"
      data-testid="financiamento-fontes-panel"
    >
      {/* Grade de 4 cards */}
      <div className="grid gap-3 md:grid-cols-2">
        <SourceCard
          tone="green"
          title="✅ A simulação considera"
          items={[
            "Valor do imóvel, entrada e valor financiado",
            "Prazo, taxa mensal fixa e sistema SAC ou PRICE",
            "Seguros e tarifas mensais quando informados",
            "Tabela completa de parcelas com fechamento exato",
            "Comparação SAC × PRICE com os mesmos parâmetros",
            "Amortização, juros e saldo devedor mês a mês",
          ]}
        />
        <SourceCard
          tone="red"
          title="❌ A simulação não considera"
          items={[
            "CET oficial completo (cartório, IOF, avaliação, registro)",
            "Proposta bancária formal ou aprovação de crédito",
            "Correção monetária por TR, IPCA ou índice contratual",
            "Seguro individual por faixa etária e perfil real",
            "FGTS como entrada ou amortização",
            "Encargos por inadimplência ou atraso",
          ]}
        />
        <SourceCard
          tone="amber"
          title="⚠ Confirmar com a instituição financeira"
          items={[
            "CET oficial e planilha de evolução do saldo",
            "Taxas reais vigentes para o seu perfil de crédito",
            "Valores atualizados de MIP e DFI",
            "Índice de correção aplicável ao contrato",
            "Regras de amortização antecipada e quitação",
          ]}
        />
        <SourceCard
          tone="amber"
          title="⚠ Avisos antes de contratar"
          items={limitsToShow.slice(0, 6)}
        />
      </div>

      {/* CET explicado com glossário */}
      <article className="rounded-xl border border-violet-300/15 bg-violet-400/8 px-4 py-3">
        <h3 className="text-[11px] font-semibold text-violet-200">
          O que é o{" "}
          <GlossaryTerm
            term="CET"
            definition="Custo Efetivo Total — reúne todos os encargos: juros, seguros, tarifas, IOF, cartório, registro. Só a IF pode calcular e fornecer o CET oficial."
            accent="violet"
          />{" "}
          e por que ele difere desta simulação
        </h3>
        <p className="mt-1.5 text-[11px] leading-5 text-violet-50/80">
          O CET representa o custo real total do financiamento. Esta simulação
          calcula juros e encargos informados, mas o CET oficial inclui outros
          itens como IOF, cartório e seguros reais. Sempre solicite o CET
          oficial em propostas formais.
        </p>
      </article>

      {/* Fontes institucionais */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Referências conceituais e institucionais
        </p>
        <div className="space-y-1.5">
          {fontes.map((f) => (
            <div
              key={f.nome}
              className="flex gap-3 rounded-lg border border-white/6 bg-slate-900/50 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-slate-200">
                  {f.nome}
                </p>
                <p className="text-[10px] text-slate-500">{f.observacao}</p>
              </div>
              <span className="flex-shrink-0 self-center rounded-md border border-white/10 px-1.5 py-0.5 text-[9px] text-slate-500">
                {f.tipo}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="sr-only" data-testid="fontes-round-half-even">
        ROUND_HALF_EVEN: arredondamento bancário aplicado em cada parcela.
      </p>
      <p className="text-[10px] leading-4.5 text-slate-600">
        Esta simulação é exclusivamente educacional. Não constitui proposta,
        contrato ou oferta de crédito. Dados fictícios quando não vinculados a
        simulação real do usuário.
      </p>
    </div>
  );
}
