/**
 * Componentes educacionais estáticos do módulo de Amortização.
 *
 * A interpretação específica do resultado continua vindo da API
 * (`interpretation`). Estes componentes exibem conteúdo editorial versionado
 * de `frontend/src/content/amortizacao/`.
 */
import { EducationPanel } from "@/components/ui/EducationPanel";
import type {
  EducationalAlert,
  EducationalContent,
  GlossaryEntry,
} from "@/content/amortizacao";
import { cn } from "@/lib/cn";

export interface AmortizacaoSaibaMaisProps {
  readonly content: EducationalContent;
  readonly className?: string;
}

export function AmortizacaoSaibaMais({
  content,
  className,
}: AmortizacaoSaibaMaisProps) {
  return (
    <EducationPanel
      title={content.title}
      {...(className !== undefined ? { className } : {})}
    >
      {content.paragraphs.map((paragraph, idx) => (
        <p key={idx} data-testid="amortizacao-saiba-mais-paragraph">
          {paragraph}
        </p>
      ))}
      <p
        className="mt-2 text-xs text-slate-500"
        data-testid="amortizacao-saiba-mais-disclaimer"
      >
        {content.disclaimer}
      </p>
    </EducationPanel>
  );
}

export interface AmortizacaoGlossarioProps {
  readonly entries: ReadonlyArray<GlossaryEntry>;
}

export function AmortizacaoGlossario({ entries }: AmortizacaoGlossarioProps) {
  return (
    <dl
      className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
      data-testid="amortizacao-glossario-list"
    >
      {entries.map((entry) => (
        <div
          key={entry.slug}
          className="rounded-lg border border-slate-200 bg-white p-4 text-sm"
        >
          <dt
            className="font-semibold"
            style={{ color: "var(--color-brand-primary)" }}
          >
            {entry.term}
          </dt>
          <dd className="mt-1 text-slate-600">{entry.shortDefinition}</dd>
          <dd className="mt-2 text-xs leading-relaxed text-slate-500">
            {entry.example}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export interface AmortizacaoCuidadosProps {
  readonly alerts: ReadonlyArray<EducationalAlert>;
}

export function AmortizacaoCuidados({ alerts }: AmortizacaoCuidadosProps) {
  return (
    <ul
      className="grid grid-cols-1 gap-3 md:grid-cols-2"
      data-testid="amortizacao-cuidados-list"
    >
      {alerts.map((alert) => (
        <li
          key={alert.slug}
          className={cn(
            "rounded-lg border p-4 text-sm leading-relaxed",
            alert.severity === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-950"
              : "border-blue-100 bg-blue-50/50 text-slate-700",
          )}
        >
          <h3 className="font-semibold">{alert.title}</h3>
          <p className="mt-1">{alert.description}</p>
        </li>
      ))}
    </ul>
  );
}
