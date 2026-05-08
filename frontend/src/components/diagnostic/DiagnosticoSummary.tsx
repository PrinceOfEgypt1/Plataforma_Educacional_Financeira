import {
  SummaryCard,
  type SummaryCardTrend,
} from "@/components/ui/SummaryCard";
import { formatBRL } from "@/lib/money";
import type {
  DiagnosticAnalyzeResponseData,
  NivelComprometimento,
  NivelReserva,
  NivelSaude,
  NivelSobra,
} from "@/types/diagnostic";

const SAUDE_LABEL: Record<NivelSaude, string> = {
  critica: "Crítica",
  ruim: "Ruim",
  regular: "Regular",
  boa: "Boa",
  excelente: "Excelente",
};

const COMPROMETIMENTO_LABEL: Record<NivelComprometimento, string> = {
  baixo: "Baixo",
  medio: "Médio",
  alto: "Alto",
  critico: "Crítico",
};

const RESERVA_LABEL: Record<NivelReserva, string> = {
  insuficiente: "Insuficiente",
  adequada: "Adequada",
  boa: "Boa",
  excelente: "Excelente",
};

const SOBRA_LABEL: Record<NivelSobra, string> = {
  negativa: "Negativa",
  baixa: "Baixa",
  boa: "Boa",
  excelente: "Excelente",
};

function comprometimentoTrend(nivel: NivelComprometimento): SummaryCardTrend {
  if (nivel === "baixo") return "positive";
  if (nivel === "medio") return "neutral";
  if (nivel === "alto") return "warning";
  return "negative";
}

function reservaTrend(nivel: NivelReserva): SummaryCardTrend {
  if (nivel === "excelente") return "positive";
  if (nivel === "boa") return "neutral";
  if (nivel === "adequada") return "warning";
  return "negative";
}

function sobraTrend(nivel: NivelSobra): SummaryCardTrend {
  if (nivel === "excelente") return "positive";
  if (nivel === "boa") return "neutral";
  if (nivel === "baixa") return "warning";
  return "negative";
}

function saudeTrend(nivel: NivelSaude): SummaryCardTrend {
  if (nivel === "excelente") return "positive";
  if (nivel === "boa") return "neutral";
  if (nivel === "regular") return "warning";
  return "negative";
}

function formatPct(value: string): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return (
    n.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + "%"
  );
}

function formatMeses(value: string): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  return (
    n.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + " meses"
  );
}

export interface DiagnosticoSummaryProps {
  readonly data: DiagnosticAnalyzeResponseData;
}

export function DiagnosticoSummary({ data }: DiagnosticoSummaryProps) {
  return (
    <div data-testid="diagnostico-summary" className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryCard
          label="Score"
          value={`${String(data.score)} / 9`}
          trend={saudeTrend(data.saude_nivel)}
          hint={`Saúde: ${SAUDE_LABEL[data.saude_nivel]}`}
        />
        <SummaryCard
          label="Sobra mensal"
          value={formatBRL(data.sobra_mensal)}
          trend={sobraTrend(data.sobra_nivel)}
          hint={SOBRA_LABEL[data.sobra_nivel]}
        />
        <SummaryCard
          label="Comprometimento"
          value={formatPct(data.comprometimento_percentual)}
          trend={comprometimentoTrend(data.comprometimento_nivel)}
          hint={COMPROMETIMENTO_LABEL[data.comprometimento_nivel]}
        />
        <SummaryCard
          label="Reserva"
          value={formatMeses(data.reserva_em_meses)}
          trend={reservaTrend(data.reserva_nivel)}
          hint={RESERVA_LABEL[data.reserva_nivel]}
        />
        <SummaryCard
          label="Despesas essenciais"
          value={formatBRL(data.despesas_essenciais_mensais)}
          hint="Fixas + variáveis"
        />
      </div>
    </div>
  );
}
