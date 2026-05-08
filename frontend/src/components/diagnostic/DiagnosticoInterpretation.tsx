import type {
  DiagnosticAnalyzeResponseData,
  NivelSaude,
} from "@/types/diagnostic";

const SAUDE_HEADLINE: Record<NivelSaude, string> = {
  critica: "Situação financeira crítica",
  ruim: "Situação financeira ruim",
  regular: "Situação financeira regular",
  boa: "Situação financeira boa",
  excelente: "Situação financeira excelente",
};

const SAUDE_BODY: Record<NivelSaude, string> = {
  critica:
    "Sua situação exige atenção imediata. Despesas superam ou consomem quase toda " +
    "a renda, e a reserva de emergência está crítica ou ausente. O primeiro passo " +
    "é mapear e cortar gastos não essenciais, e buscar renegociação de dívidas.",
  ruim:
    "Há desequilíbrio relevante entre receita e gastos, ou a reserva está muito " +
    "abaixo do recomendado. Concentre esforços em reduzir despesas variáveis e " +
    "estruturar uma reserva mínima antes de novos compromissos.",
  regular:
    "Sua situação está estável, mas há margem de melhoria. Avalie se é possível " +
    "reduzir o comprometimento com dívidas e aumentar a reserva de emergência " +
    "para ao menos 3 meses de despesas.",
  boa:
    "Você tem uma boa estrutura financeira. Continue monitorando o " +
    "comprometimento com dívidas e amplie gradualmente sua reserva para " +
    "6 meses ou mais, caso ainda não tenha atingido esse nível.",
  excelente:
    "Parabéns! Sua saúde financeira está excelente. Mantenha o controle dos " +
    "gastos, preserve a reserva de emergência e avalie oportunidades de " +
    "investimento adequadas ao seu perfil.",
};

export interface DiagnosticoInterpretationProps {
  readonly data: DiagnosticAnalyzeResponseData;
}

export function DiagnosticoInterpretation({
  data,
}: DiagnosticoInterpretationProps) {
  return (
    <div
      data-testid="diagnostico-interpretation"
      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="mb-1 text-sm font-semibold text-slate-700">
        {SAUDE_HEADLINE[data.saude_nivel]}
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        {SAUDE_BODY[data.saude_nivel]}
      </p>
      <p className="mt-2 text-xs text-slate-400">
        Esta interpretação é educacional e não substitui orientação de um
        profissional financeiro.
      </p>
    </div>
  );
}
