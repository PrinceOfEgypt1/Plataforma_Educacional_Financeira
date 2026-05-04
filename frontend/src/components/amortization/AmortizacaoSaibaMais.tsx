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
    <div
      className="grid grid-cols-1 gap-2 md:grid-cols-2"
      data-testid="amortizacao-glossario-list"
    >
      {entries.map((entry) => (
        <details
          key={entry.slug}
          className="group rounded-xl border border-slate-200 bg-white text-sm"
        >
          <summary
            className="flex cursor-pointer list-none items-center justify-between
                       gap-3 px-3 py-2.5 font-semibold text-slate-800
                       focus:outline-none focus-visible:ring-2
                       focus-visible:ring-[var(--color-focus)]
                       focus-visible:ring-offset-2"
          >
            <span>{entry.term}</span>
            <span
              aria-hidden="true"
              className="text-xs text-slate-400 group-open:text-[var(--color-brand-primary)]"
            >
              +
            </span>
          </summary>
          <div className="border-t border-slate-100 px-3 py-3 text-slate-600">
            <p>{entry.shortDefinition}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {entry.example}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}

export interface AmortizacaoCuidadosProps {
  readonly alerts: ReadonlyArray<EducationalAlert>;
}

export function AmortizacaoCuidados({ alerts }: AmortizacaoCuidadosProps) {
  return (
    <ul
      className="grid grid-cols-1 gap-2 md:grid-cols-2"
      data-testid="amortizacao-cuidados-list"
    >
      {alerts.map((alert) => (
        <li key={alert.slug}>
          <details
            className={cn(
              "group rounded-xl border text-sm leading-relaxed",
              alert.severity === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-950"
                : "border-blue-100 bg-blue-50/50 text-slate-700",
            )}
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between
                         gap-3 px-3 py-2.5 font-semibold focus:outline-none
                         focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]
                         focus-visible:ring-offset-2"
            >
              <span>{alert.title}</span>
              <span aria-hidden="true" className="text-xs opacity-70">
                +
              </span>
            </summary>
            <p className="border-t border-current/10 px-3 py-3">
              {alert.description}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
