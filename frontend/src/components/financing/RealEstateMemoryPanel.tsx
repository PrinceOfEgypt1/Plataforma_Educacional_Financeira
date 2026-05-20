"use client";

/**
 * RealEstateMemoryPanel — Memória de cálculo redesenhada
 *
 * ITEM 14D-B: Redesenho visual completo. Step-cards numerados, var-pills,
 * fórmulas em código, ROUND_HALF_EVEN destacado.
 */

import { formatBRL, formatRatePct } from "@/lib/money";
import type {
  FinanciamentoFormulaUsada,
  FinanciamentoMemoriaCalculo,
} from "@/types/financing";
import { GlossaryTerm } from "@/components/education/GlossaryTerm";

interface Props {
  readonly memoria: FinanciamentoMemoriaCalculo;
  readonly formulasUsadas: ReadonlyArray<FinanciamentoFormulaUsada>;
}

function VarPill({
  varKey,
  value,
  label,
  accent,
}: {
  readonly varKey: string;
  readonly value: string;
  readonly label: string;
  readonly accent?: "cyan" | "amber" | "emerald" | "violet" | "default";
}) {
  const colors = {
    cyan: "border-cyan-400/25 bg-cyan-400/8",
    amber: "border-amber-400/25 bg-amber-400/8",
    emerald: "border-emerald-400/25 bg-emerald-400/8",
    violet: "border-violet-400/25 bg-violet-400/8",
    default: "border-white/8 bg-white/4",
  };
  const valColors = {
    cyan: "text-cyan-200",
    amber: "text-amber-200",
    emerald: "text-emerald-200",
    violet: "text-violet-200",
    default: "text-slate-100",
  };
  const tone = accent ?? "default";
  return (
    <div className={`rounded-lg border p-2 ${colors[tone]}`}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400/70">
        {varKey}
      </p>
      <p
        className={`mt-0.5 font-mono text-[12px] font-semibold ${valColors[tone]}`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] text-slate-500">{label}</p>
    </div>
  );
}

function StepCard({
  num,
  title,
  expr,
  result,
  accent,
}: {
  readonly num: number;
  readonly title: string;
  readonly expr: string;
  readonly result: string;
  readonly accent?: "cyan" | "amber" | "emerald";
}) {
  const colors = {
    cyan: "text-cyan-200",
    amber: "text-amber-200",
    emerald: "text-emerald-200",
  };
  const ac = accent ?? "cyan";
  return (
    <div className="rounded-lg border border-white/8 bg-slate-900/60 p-2.5 text-center">
      <div className="mx-auto mb-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/15 text-[10px] font-bold text-cyan-300">
        {num}
      </div>
      <p className="text-[10px] font-semibold text-slate-300">{title}</p>
      <p className="mt-1 font-mono text-[10px] text-slate-400">{expr}</p>
      <p className={`mt-0.5 font-mono text-[12px] font-semibold ${colors[ac]}`}>
        {result}
      </p>
    </div>
  );
}

export function RealEstateMemoryPanel({ memoria, formulasUsadas }: Props) {
  const { metodo, entradas, primeira_parcela, ultima_parcela, arredondamento } =
    memoria;
  const isSAC = metodo === "SAC";

  const pv = formatBRL(entradas.valor_financiado);
  const n = String(entradas.prazo_meses);
  const i = formatRatePct(entradas.taxa_juros_mensal);
  const amort1 = formatBRL(primeira_parcela.amortizacao);
  const juros1 = formatBRL(primeira_parcela.juros);
  const parc1 = formatBRL(primeira_parcela.prestacao);
  const saldo1 = formatBRL(primeira_parcela.saldo_final);
  const parcN = formatBRL(ultima_parcela.prestacao);

  return (
    <div
      className="space-y-3 overflow-y-auto"
      data-testid="financiamento-memory-panel"
    >
      {/* Narrativa pedagógica */}
      <div className="rounded-xl border border-emerald-200/12 bg-emerald-400/8 px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/70">
          Traduzindo os números
        </p>
        <p className="mt-1.5 text-[12px] leading-5.5 text-emerald-50/90">
          Nesta simulação, o{" "}
          <GlossaryTerm
            term="valor financiado"
            definition="Valor do imóvel menos a entrada. É sobre ele que os juros são calculados."
            accent="emerald"
          />{" "}
          foi <strong className="text-emerald-100">{pv}</strong>.{" "}
          {memoria.substituicao}
        </p>
      </div>

      {/* Fórmulas SAC + PRICE */}
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-emerald-200/12 bg-slate-950/50 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300/80">
            SAC — Amortização Constante
          </p>
          <pre className="rounded-lg bg-slate-950/80 p-2.5 font-mono text-[10px] leading-6 text-emerald-200">
            {`A  = PV ÷ n\nJ_t = Saldo_t × i\nEncargo_t = A + J_t\nSaldo_t = Saldo_{t-1} − A`}
          </pre>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
            {[
              ["PV", "valor financiado"],
              ["n", "prazo em meses"],
              ["i", "taxa mensal"],
              ["A", "amortização constante"],
              ["J_t", "juros no mês t"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-1.5">
                <span className="font-mono font-semibold text-emerald-300">
                  {k}
                </span>
                <span className="text-slate-400">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-violet-200/12 bg-slate-950/50 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300/80">
            PRICE — Parcela Constante (PMT)
          </p>
          <pre className="rounded-lg bg-slate-950/80 p-2.5 font-mono text-[10px] leading-6 text-violet-200">
            {`PMT = PV × [i × (1+i)^n]\n       ÷ [(1+i)^n − 1]\nJ_t = Saldo_t × i\nA_t = PMT − J_t`}
          </pre>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
            {[
              ["PMT", "prestação fixa"],
              ["A_t", "amortização variável"],
              ["J_t", "juros variáveis"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-1.5">
                <span className="font-mono font-semibold text-violet-300">
                  {k}
                </span>
                <span className="text-slate-400">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variáveis substituídas */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Valores substituídos · {metodo}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <VarPill
            varKey="PV"
            value={pv}
            label="Valor financiado"
            accent="cyan"
          />
          <VarPill varKey="n" value={`${n} meses`} label="Prazo" />
          <VarPill varKey="i" value={i} label="Taxa mensal" />
          {isSAC ? (
            <VarPill
              varKey="A"
              value={amort1}
              label="Amortização/mês"
              accent="emerald"
            />
          ) : (
            <VarPill
              varKey="PMT"
              value={parc1}
              label="Prestação fixa"
              accent="violet"
            />
          )}
          <VarPill
            varKey="J₁"
            value={juros1}
            label="Juros mês 1"
            accent="amber"
          />
          <VarPill
            varKey="Parc.₁"
            value={parc1}
            label="1ª parcela"
            accent="cyan"
          />
          <VarPill
            varKey="Parc.ₙ"
            value={parcN}
            label="Última parcela"
            accent="emerald"
          />
          <VarPill varKey="Saldo₁" value={saldo1} label="Saldo após mês 1" />
        </div>
      </div>

      {/* Passo a passo — 1ª parcela */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Passo a passo auditável · 1ª parcela {metodo}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {isSAC ? (
            <>
              <StepCard
                num={1}
                title="Amortização"
                expr={`PV ÷ n`}
                result={amort1}
                accent="emerald"
              />
              <StepCard
                num={2}
                title="Juros mês 1"
                expr={`PV × i`}
                result={juros1}
                accent="amber"
              />
              <StepCard
                num={3}
                title="1ª Parcela"
                expr={`A + J₁`}
                result={parc1}
                accent="cyan"
              />
              <StepCard
                num={4}
                title="Saldo após mês 1"
                expr={`PV − A`}
                result={saldo1}
                accent="emerald"
              />
            </>
          ) : (
            <>
              <StepCard
                num={1}
                title="Taxa mensal"
                expr={`i = taxa/100`}
                result={i}
              />
              <StepCard
                num={2}
                title="Fator PMT"
                expr={`[i × (1+i)^n] ÷ [(1+i)^n − 1]`}
                result="ver fórmula"
              />
              <StepCard
                num={3}
                title="PMT (parcela)"
                expr={`PV × fator`}
                result={parc1}
                accent="cyan"
              />
              <StepCard
                num={4}
                title="Juros mês 1"
                expr={`PV × i`}
                result={juros1}
                accent="amber"
              />
            </>
          )}
        </div>
      </div>

      {/* Arredondamento */}
      <div className="rounded-xl border border-cyan-200/10 bg-slate-950/50 px-3 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Arredondamento e resíduo
        </p>
        <p className="mt-1 text-[11px] leading-5 text-slate-300">
          <span className="font-mono font-semibold text-cyan-300">
            ROUND_HALF_EVEN
          </span>{" "}
          (bancário) aplicado em cada parcela. {arredondamento} Última parcela
          absorve o resíduo: <strong className="text-cyan-200">{parcN}</strong>.
        </p>
      </div>

      {/* Fórmulas usadas pela API */}
      {formulasUsadas.length > 0 && (
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Fórmulas declaradas pela API
          </p>
          <div className="space-y-1.5">
            {formulasUsadas.map((f) => (
              <div
                key={f.nome}
                className="rounded-lg border border-white/6 bg-slate-900/50 px-3 py-2"
              >
                <p className="text-[10px] font-semibold text-slate-200">
                  {f.nome}
                </p>
                <p className="font-mono text-[10px] text-emerald-300">
                  {f.expressao}
                </p>
                <p className="text-[10px] text-slate-500">{f.uso}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
