"use client";

import { useCallback, useState, type FormEvent } from "react";

import { AlertBanner } from "@/components/ui/AlertBanner";
import { describeApiError } from "@/lib/api/problem";
import { formatBRL } from "@/lib/money";
import {
  compararFinanciamentos,
  simularFinanciamentoImobiliario,
  type FinanciamentoApiError,
} from "@/services/financing/financiamentoService";
import type {
  FinanciamentoFonte,
  FinanciamentoImobCompareOut,
  FinanciamentoImobOut,
  FinanciamentoImobSummary,
  FinanciamentoMemoriaCalculo,
} from "@/types/financing";

import { FinanciamentoCompareChart } from "./FinanciamentoCompareChart";
import { FinanciamentoCompareInsights } from "./FinanciamentoCompareInsights";
import { FinanciamentoCompareSummary } from "./FinanciamentoCompareSummary";
import { FinanciamentoSummary } from "./FinanciamentoSummary";
import { FinanciamentoTable } from "./FinanciamentoTable";
import {
  validateFinanciamentoDraft,
  type FinanciamentoDraft,
  type FinanciamentoFieldErrors,
} from "./formValidation";

const INITIAL_DRAFT: FinanciamentoDraft = {
  valorImovel: "",
  valorEntrada: "",
  prazoMeses: "",
  taxaJurosMensalPercentual: "",
  sistemaAmortizacao: "PRICE",
  seguroMensal: "",
  tarifaMensal: "",
};

type ActiveTab =
  | "conceito"
  | "simular"
  | "resultado"
  | "comparar"
  | "tabela"
  | "memoria"
  | "fontes";

type SimulateResult =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

type CompareResult =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "ok"; readonly result: FinanciamentoImobCompareOut }
  | { readonly status: "error"; readonly error: FinanciamentoApiError };

interface TabDefinition {
  readonly id: ActiveTab;
  readonly label: string;
}

interface FeatureCardDefinition {
  readonly label: string;
  readonly title: string;
  readonly summary: string;
  readonly action: string;
  readonly target: ActiveTab;
  readonly tone: string;
}

const TABS: ReadonlyArray<TabDefinition> = [
  { id: "conceito", label: "Conceito" },
  { id: "simular", label: "Simular" },
  { id: "resultado", label: "Resultado" },
  { id: "comparar", label: "Comparar SAC x PRICE" },
  { id: "tabela", label: "Tabela" },
  { id: "memoria", label: "Memória de cálculo" },
  { id: "fontes", label: "Fontes e limites" },
];

const FEATURE_CARDS: ReadonlyArray<FeatureCardDefinition> = [
  {
    label: "Conceito",
    title: "Entenda o financiamento imobiliário",
    summary:
      "Aprenda o que é, como funciona e quais fatores influenciam a aprovação.",
    action: "Entender",
    target: "conceito",
    tone: "from-indigo-900 to-indigo-700",
  },
  {
    label: "Resultado",
    title: "Resultado da simulação",
    summary: "Veja parcela, juros, encargos, custo total e total pago.",
    action: "Visualizar",
    target: "resultado",
    tone: "from-amber-950 to-amber-800",
  },
  {
    label: "Comparação",
    title: "Comparação SAC x PRICE",
    summary:
      "Compare primeira parcela, última parcela, total de juros e custo total.",
    action: "Comparar",
    target: "comparar",
    tone: "from-violet-950 to-violet-800",
  },
  {
    label: "Tabela",
    title: "Tabela de parcelas",
    summary:
      "A tabela respeita o prazo informado e preserva todas as parcelas.",
    action: "Visualizar tabela",
    target: "tabela",
    tone: "from-cyan-950 to-cyan-800",
  },
  {
    label: "Memória",
    title: "Memória de cálculo",
    summary:
      "Veja fórmula, substituição dos valores, arredondamento e rastreabilidade.",
    action: "Ver memória",
    target: "memoria",
    tone: "from-emerald-950 to-emerald-800",
  },
  {
    label: "Fontes",
    title: "Fontes, limites e avisos",
    summary:
      "Entenda por que a simulação não substitui análise bancária ou contrato real.",
    action: "Ver fontes",
    target: "fontes",
    tone: "from-slate-800 to-slate-700",
  },
  {
    label: "Alertas",
    title: "Atenção à simulação",
    summary:
      "Taxas, seguros, CET, renda, FGTS e regras da instituição podem alterar o resultado.",
    action: "Ver alertas",
    target: "fontes",
    tone: "from-rose-950 to-rose-800",
  },
];

const CONCEPT_ITEMS = [
  {
    title: "Como o financiamento nasce",
    body: "O valor do imóvel é o preço de compra. A entrada reduz o valor financiado. Sobre esse saldo incidem juros, amortização, seguros, tarifas e demais encargos conforme a instituição.",
  },
  {
    title: "SAC e PRICE",
    body: "No SAC, a amortização tende a ser constante: a parcela começa maior e cai com o saldo devedor. No PRICE, a prestação é suavizada no início, mas pode acumular mais juros ao longo do prazo.",
  },
  {
    title: "Renda, FGTS e aprovação",
    body: "Renda individual ou familiar, comprometimento mensal, documentação, avaliação do imóvel, seguros, FGTS e política da instituição influenciam a análise. Regras podem variar e devem ser confirmadas em fontes oficiais.",
  },
  {
    title: "Simulação não é contrato",
    body: "A simulação ensina cenários e custos prováveis. Contratação real depende de análise de crédito, CET, seguros, tarifas, avaliação do imóvel, legislação brasileira aplicável e proposta formal da instituição.",
  },
];

function parseMoney(raw: string): number {
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function EmptyState({ label }: { readonly label: string }) {
  return (
    <div
      className="grid h-full min-h-[220px] place-items-center rounded-2xl border border-dashed border-cyan-200/20 bg-slate-950/35 p-6 text-center"
      data-testid="financiamento-idle-state"
    >
      <div className="max-w-md">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">
          {label}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-50">
          Simule para liberar esta visão
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Use a aba Simular para gerar parcelas, comparação SAC x PRICE, memória
          de cálculo, tabela completa, fontes, limites e alertas.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  card,
  active,
  onSelect,
}: {
  readonly card: FeatureCardDefinition;
  readonly active: boolean;
  readonly onSelect: (tab: ActiveTab) => void;
}) {
  return (
    <article
      className={`min-h-[112px] rounded-2xl bg-gradient-to-br ${card.tone} p-3 shadow-lg shadow-black/20 ring-1 ring-white/10 ${
        active ? "outline outline-2 outline-cyan-200/70" : ""
      }`}
      data-testid={`financiamento-card-${card.target}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
        {card.label}
      </p>
      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white">
        {card.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/75">
        {card.summary}
      </p>
      <button
        className="mt-3 rounded-md bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
        type="button"
        onClick={() => onSelect(card.target)}
      >
        {card.action}
      </button>
    </article>
  );
}

interface CompactSimulationFormProps {
  readonly draft: FinanciamentoDraft;
  readonly errors: FinanciamentoFieldErrors;
  readonly busy: boolean;
  readonly onChange: (field: keyof FinanciamentoDraft, value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function FieldError({ message }: { readonly message: string | undefined }) {
  if (message === undefined) return null;

  return (
    <p className="mt-1 text-[10px] font-medium text-rose-200">{message}</p>
  );
}

function CompactInput({
  label,
  helper,
  field,
  value,
  error,
  onChange,
}: {
  readonly label: string;
  readonly helper: string;
  readonly field: keyof FinanciamentoDraft;
  readonly value: string;
  readonly error: string | undefined;
  readonly onChange: (field: keyof FinanciamentoDraft, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/65">
        {label}
      </span>
      <input
        className="mt-1 w-full rounded-lg border border-cyan-200/10 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-50 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        aria-label={label}
        aria-invalid={error !== undefined}
        aria-describedby={`${String(field)}-hint`}
      />
      <span
        id={`${String(field)}-hint`}
        className="mt-1 block text-[10px] leading-4 text-slate-400"
      >
        {helper}
      </span>
      <FieldError message={error} />
    </label>
  );
}

function CompactSimulationForm({
  draft,
  errors,
  busy,
  onChange,
  onSubmit,
}: CompactSimulationFormProps) {
  return (
    <form
      className="flex h-full min-h-0 flex-col rounded-2xl border border-cyan-200/10 bg-slate-950/45 p-3"
      onSubmit={onSubmit}
      data-testid="financiamento-compact-form"
      aria-label="Formulário de simulação do financiamento imobiliário"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">
            Simulação
          </p>
          <h3 className="text-base font-semibold text-slate-50">
            Dados do financiamento
          </h3>
        </div>
        <button
          className="shrink-0 rounded-lg bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          data-testid="financiamento-submit"
          disabled={busy}
        >
          {busy ? "Simulando..." : "Simular"}
        </button>
      </div>

      <div className="grid min-h-0 grid-cols-1 gap-2 md:grid-cols-2">
        <CompactInput
          label="Valor do imóvel (R$)"
          helper="Preço total do imóvel."
          field="valorImovel"
          value={draft.valorImovel}
          error={errors.valorImovel}
          onChange={onChange}
        />
        <CompactInput
          label="Entrada (R$)"
          helper="Valor pago de entrada."
          field="valorEntrada"
          value={draft.valorEntrada}
          error={errors.valorEntrada}
          onChange={onChange}
        />
        <CompactInput
          label="Prazo (meses)"
          helper="Quantidade de parcelas."
          field="prazoMeses"
          value={draft.prazoMeses}
          error={errors.prazoMeses}
          onChange={onChange}
        />
        <CompactInput
          label="Taxa de juros mensal (%)"
          helper="Taxa usada na simulação."
          field="taxaJurosMensalPercentual"
          value={draft.taxaJurosMensalPercentual}
          error={errors.taxaJurosMensalPercentual}
          onChange={onChange}
        />

        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/65">
            Sistema
          </span>
          <select
            className="mt-1 w-full rounded-lg border border-cyan-200/10 bg-slate-950/70 px-3 py-2 text-sm font-semibold text-slate-50 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            value={draft.sistemaAmortizacao}
            onChange={(event) =>
              onChange("sistemaAmortizacao", event.target.value)
            }
            aria-label="Sistema de amortização"
          >
            <option value="PRICE">PRICE</option>
            <option value="SAC">SAC</option>
          </select>
          <span className="mt-1 block text-[10px] leading-4 text-slate-400">
            Escolha PRICE ou SAC.
          </span>
          <FieldError message={errors.sistemaAmortizacao} />
        </label>

        <CompactInput
          label="Seguro mensal (R$)"
          helper="Opcional, se houver."
          field="seguroMensal"
          value={draft.seguroMensal}
          error={errors.seguroMensal}
          onChange={onChange}
        />
        <CompactInput
          label="Tarifa mensal (R$)"
          helper="Opcional, se houver."
          field="tarifaMensal"
          value={draft.tarifaMensal}
          error={errors.tarifaMensal}
          onChange={onChange}
        />

        <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/10 p-3 text-xs leading-5 text-emerald-50 md:col-span-2">
          <strong className="text-emerald-100">Renda, FGTS e aprovação:</strong>{" "}
          estes fatores não substituem a análise bancária, mas aparecem nas abas
          de conceito, fontes e limites para orientar a leitura educacional da
          simulação.
        </div>
      </div>
    </form>
  );
}

function ConceptPanel() {
  return (
    <section
      className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-2"
      data-testid="financiamento-conceito-panel"
    >
      {CONCEPT_ITEMS.map((item) => (
        <article
          key={item.title}
          className="rounded-2xl border border-cyan-200/10 bg-slate-950/45 p-4"
        >
          <h3 className="text-sm font-semibold text-cyan-100">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
        </article>
      ))}
      <article className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 lg:col-span-2">
        <h3 className="text-sm font-semibold text-amber-100">
          Fontes institucionais para conferência
        </h3>
        <p className="mt-2 text-sm leading-6 text-amber-50/80">
          Use Caixa Econômica Federal, Banco Central do Brasil, FGTS, legislação
          brasileira aplicável e canais oficiais da instituição financeira para
          validar regras, custos, documentação e condições vigentes. Este módulo
          não inventa tetos, percentuais ou aprovação.
        </p>
      </article>
    </section>
  );
}

function ResultPanel({ result }: { readonly result: FinanciamentoImobOut }) {
  const { summary } = result;
  return (
    <section className="grid h-full min-h-0 gap-3 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-2xl border border-cyan-200/10 bg-white/95 p-4 text-slate-950">
        <FinanciamentoSummary summary={summary} />
      </div>
      <div className="grid min-h-0 gap-3 md:grid-cols-2">
        <MetricCard
          label="Primeira parcela"
          value={formatBRL(summary.primeira_parcela)}
          note="Mostra o esforço mensal inicial."
        />
        <MetricCard
          label="Última parcela"
          value={formatBRL(summary.ultima_parcela)}
          note="Ajuda a comparar queda ou estabilidade da parcela."
        />
        <MetricCard
          label="Total de juros"
          value={formatBRL(summary.total_juros)}
          note="Custo financeiro acumulado no prazo."
        />
        <MetricCard
          label="Custo total"
          value={formatBRL(summary.custo_total)}
          note="Juros mais encargos declarados na simulação."
        />
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  note,
}: {
  readonly label: string;
  readonly value: string;
  readonly note: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold text-slate-50">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-300">{note}</p>
    </article>
  );
}

function ComparePanel({
  compare,
}: {
  readonly compare: FinanciamentoImobCompareOut;
}) {
  return (
    <section className="grid h-full min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
      <div className="min-h-0 overflow-hidden rounded-2xl border border-cyan-200/10 bg-white/95 p-4 text-slate-950">
        <FinanciamentoCompareSummary compare={compare} />
      </div>
      <div className="grid min-h-0 gap-3">
        <FinanciamentoCompareChart compare={compare} />
        <FinanciamentoCompareInsights compare={compare} />
      </div>
    </section>
  );
}

function MemoryPanel({
  memoria,
}: {
  readonly memoria: FinanciamentoMemoriaCalculo;
}) {
  const primeira = memoria.primeira_parcela;
  return (
    <section
      className="grid h-full min-h-0 gap-3 lg:grid-cols-[minmax(0,1fr)_300px]"
      data-testid="financiamento-memory-panel"
    >
      <div className="rounded-2xl border border-emerald-200/15 bg-slate-950/45 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/75">
          Fórmula usada
        </p>
        <code className="mt-2 block rounded-xl bg-emerald-300/10 p-3 font-mono text-sm text-emerald-100">
          {memoria.formula}
        </code>
        <h3 className="mt-4 text-sm font-semibold text-slate-50">
          Valores substituídos
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {memoria.substituicao}
        </p>
        <dl className="mt-4 grid gap-2 text-xs text-slate-200 md:grid-cols-3">
          {Object.entries(memoria.variaveis).map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <dt className="text-cyan-100">{key}</dt>
              <dd className="mt-1 font-mono">{String(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <aside className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 text-amber-50">
        <h3 className="text-sm font-semibold">
          Primeira parcela passo a passo
        </h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt>Juros</dt>
            <dd className="font-semibold">{formatBRL(primeira.juros)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Amortização</dt>
            <dd className="font-semibold">{formatBRL(primeira.amortizacao)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Encargos</dt>
            <dd className="font-semibold">{formatBRL(primeira.encargos)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Saldo devedor final</dt>
            <dd className="font-semibold">{formatBRL(primeira.saldo_final)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-amber-50/80">
          Arredondamento: {memoria.arredondamento}. Confira a mesma parcela na
          aba Tabela para rastrear entrada, fórmula, cálculo e resultado.
        </p>
      </aside>
    </section>
  );
}

function SourcesPanel({
  result,
}: {
  readonly result: FinanciamentoImobOut | undefined;
}) {
  const fontes: ReadonlyArray<FinanciamentoFonte> =
    result?.fontes.length === 0 || result === undefined
      ? [
          {
            nome: "Banco Central do Brasil",
            tipo: "institucional",
            observacao:
              "Referência para educação financeira, crédito e CET sem consulta automática neste módulo.",
          },
          {
            nome: "Caixa Econômica Federal",
            tipo: "institucional",
            observacao:
              "Referência pública para modalidades habitacionais; regras reais variam conforme produto e análise.",
          },
          {
            nome: "FGTS",
            tipo: "institucional",
            observacao:
              "Uso pode ocorrer como entrada, amortização ou liquidação quando regras oficiais forem atendidas.",
          },
        ]
      : result.fontes;
  const alertas =
    result === undefined
      ? [
          "Simulação educacional não substitui contrato real.",
          "CET, seguros, tarifas, renda, documentação, avaliação do imóvel e política da instituição podem alterar a contratação.",
          "Aprovação depende de análise de crédito e regras vigentes da instituição financeira.",
        ]
      : [...result.alertas, ...result.limites, ...result.mensagens_interface];

  return (
    <section
      className="grid h-full min-h-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]"
      data-testid="financiamento-fontes-panel"
    >
      <div className="rounded-2xl border border-cyan-200/10 bg-slate-950/45 p-4">
        <h3 className="text-sm font-semibold text-cyan-100">
          Fontes oficiais e limites da simulação
        </h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {fontes.map((fonte) => (
            <article
              key={`${fonte.nome}-${fonte.tipo}`}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <p className="text-xs font-semibold text-slate-50">
                {fonte.nome}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">
                {fonte.tipo}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {fonte.observacao}
              </p>
            </article>
          ))}
        </div>
      </div>
      <aside className="rounded-2xl border border-rose-200/20 bg-rose-300/10 p-4">
        <h3 className="text-sm font-semibold text-rose-100">
          Alertas úteis antes de decidir
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-rose-50/85">
          {alertas.map((alerta) => (
            <li key={alerta}>• {alerta}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

export function FinanciamentoCockpit() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("simular");
  const [draft, setDraft] = useState<FinanciamentoDraft>(INITIAL_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<FinanciamentoFieldErrors>({});
  const [simState, setSimState] = useState<SimulateResult>({ status: "idle" });
  const [cmpState, setCmpState] = useState<CompareResult>({ status: "idle" });

  const handleChange = useCallback(
    (field: keyof FinanciamentoDraft, value: string) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleSimulate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validation = validateFinanciamentoDraft(draft);
      if (!validation.ok) {
        setFieldErrors(validation.errors);
        return;
      }
      setSimState({ status: "loading" });
      try {
        const result = await simularFinanciamentoImobiliario(validation.value);
        setSimState({ status: "ok", result });
        setActiveTab("resultado");
      } catch (error) {
        setSimState({ status: "error", error: error as FinanciamentoApiError });
      }
    },
    [draft],
  );

  const handleCompare = useCallback(async () => {
    const validation = validateFinanciamentoDraft(draft);
    if (!validation.ok) {
      setFieldErrors(validation.errors);
      setActiveTab("simular");
      return;
    }
    const value = validation.value;
    setCmpState({ status: "loading" });
    try {
      const result = await compararFinanciamentos({
        valor_imovel: value.valor_imovel,
        valor_entrada: value.valor_entrada,
        prazo_meses: value.prazo_meses,
        taxa_juros_mensal_percentual: value.taxa_juros_mensal_percentual,
        ...(value.seguro_mensal !== undefined
          ? { seguro_mensal: value.seguro_mensal }
          : {}),
        ...(value.tarifa_mensal !== undefined
          ? { tarifa_mensal: value.tarifa_mensal }
          : {}),
      });
      setCmpState({ status: "ok", result });
      setActiveTab("comparar");
    } catch (error) {
      setCmpState({ status: "error", error: error as FinanciamentoApiError });
      setActiveTab("comparar");
    }
  }, [draft]);

  const simulated = simState.status === "ok" ? simState.result : undefined;
  const compared = cmpState.status === "ok" ? cmpState.result : undefined;
  const summary: FinanciamentoImobSummary | undefined = simulated?.summary;
  const entradaPct =
    summary !== undefined && parseMoney(summary.valor_imovel) > 0
      ? (parseMoney(summary.valor_entrada) / parseMoney(summary.valor_imovel)) *
        100
      : 0;

  return (
    <div
      className="h-[calc(100vh-7rem)] min-h-0 overflow-hidden rounded-3xl border border-cyan-200/10 bg-[#0a101e] text-slate-100 shadow-2xl shadow-black/35"
      data-testid="financiamento-cockpit"
      data-no-page-scroll="true"
    >
      <div className="grid h-full min-h-0 grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-3 p-4">
        <header className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-cyan-200/10 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
              Financiamento Imobiliário
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Cockpit educacional para entender, simular e comparar
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Experiência em abas, sem modal para conteúdo essencial, com tabela
              paginada, gráfico visível, memória de cálculo e leitura pedagógica
              sobre renda, entrada, FGTS, CET, seguros e aprovação.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-white/5 p-3">
            <MetricCard
              label="Entrada"
              value={summary ? `${entradaPct.toFixed(1)}%` : "—"}
              note="Reduz o saldo financiado."
            />
            <MetricCard
              label="Prazo"
              value={summary ? `${summary.prazo_meses}m` : "—"}
              note="Respeitado na tabela."
            />
            <MetricCard
              label="Tabela"
              value={simulated ? `${simulated.parcelas.length}` : "—"}
              note="parcelas geradas."
            />
          </div>
        </header>

        <section
          className="grid grid-cols-1 gap-2 md:grid-cols-4 xl:grid-cols-7"
          aria-label="Cards com ações internas"
        >
          {FEATURE_CARDS.map((card) => (
            <FeatureCard
              key={`${card.label}-${card.target}`}
              card={card}
              active={activeTab === card.target}
              onSelect={setActiveTab}
            />
          ))}
        </section>

        <nav
          className="grid grid-cols-2 gap-2 rounded-2xl border border-cyan-200/10 bg-slate-950/60 p-2 md:grid-cols-4 xl:grid-cols-7"
          role="tablist"
          aria-label="Abas do financiamento imobiliário"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 ${
                activeTab === tab.id
                  ? "bg-cyan-300 text-slate-950"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              data-testid={
                tab.id === "simular"
                  ? "tab-simular"
                  : tab.id === "comparar"
                    ? "tab-comparar"
                    : `tab-${tab.id}`
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main
          className="min-h-0 overflow-hidden rounded-3xl border border-cyan-200/10 bg-slate-900/80 p-4"
          data-testid="financiamento-tab-panel"
        >
          {activeTab === "conceito" && <ConceptPanel />}

          {activeTab === "simular" && (
            <section className="grid h-full min-h-0 gap-4 lg:grid-cols-[520px_minmax(0,1fr)]">
              <CompactSimulationForm
                draft={draft}
                errors={fieldErrors}
                busy={simState.status === "loading"}
                onChange={handleChange}
                onSubmit={handleSimulate}
              />
              <div className="grid min-h-0 gap-3">
                <div className="cockpit-insight-bar">
                  <span aria-hidden="true">FI</span>
                  <span>
                    Preencha os dados e simule para ver resultado, tabela,
                    memória de cálculo, fontes e limites. Depois use{" "}
                    <strong>Comparar SAC x PRICE</strong> para avaliar os dois
                    sistemas.
                  </span>
                </div>
                <button
                  className="rounded-2xl border border-violet-200/20 bg-violet-300/10 p-4 text-left text-violet-50 transition hover:bg-violet-300/15 focus:outline-none focus:ring-2 focus:ring-violet-200"
                  type="button"
                  aria-label="Comparar SAC x PRICE"
                  onClick={handleCompare}
                  disabled={cmpState.status === "loading"}
                >
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200/75">
                    Comparação
                  </span>
                  <span className="mt-1 block text-lg font-semibold">
                    Comparar SAC x PRICE
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-violet-50/80">
                    Gera primeira parcela, última parcela, total de juros, total
                    pago e leitura pedagógica das diferenças.
                  </span>
                </button>
                {simState.status === "error" && (
                  <AlertBanner level="error" title="Erro na simulação">
                    {describeApiError(simState.error)}
                  </AlertBanner>
                )}
                {cmpState.status === "error" && (
                  <AlertBanner level="error" title="Erro na comparação">
                    {describeApiError(cmpState.error)}
                  </AlertBanner>
                )}
              </div>
            </section>
          )}

          {activeTab === "resultado" &&
            (simulated ? (
              <ResultPanel result={simulated} />
            ) : (
              <EmptyState label="Resultado da simulação" />
            ))}

          {activeTab === "comparar" &&
            (compared ? (
              <ComparePanel compare={compared} />
            ) : cmpState.status === "loading" ? (
              <EmptyState label="Comparando SAC x PRICE" />
            ) : (
              <EmptyState label="Comparação SAC x PRICE" />
            ))}

          {activeTab === "tabela" &&
            (simulated ? (
              <FinanciamentoTable parcelas={simulated.parcelas} />
            ) : (
              <EmptyState label="Tabela de parcelas" />
            ))}

          {activeTab === "memoria" &&
            (simulated ? (
              <MemoryPanel memoria={simulated.memoria_calculo} />
            ) : (
              <EmptyState label="Memória de cálculo" />
            ))}

          {activeTab === "fontes" && <SourcesPanel result={simulated} />}
        </main>
      </div>
    </div>
  );
}
