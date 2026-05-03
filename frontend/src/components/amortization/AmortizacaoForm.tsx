"use client";

import { useId, useState, type FormEvent } from "react";

import { FormSection } from "@/components/ui/FormSection";
import type { AmortizationIn } from "@/types/amortization";

import { SubmitBar, TextField } from "./formPrimitives";
import {
  validateAmortizationDraft,
  type AmortizationFormDraft,
  type FieldErrors,
} from "./formValidation";

export type AmortizacaoFormMode = "price" | "sac" | "compare";

export interface AmortizacaoFormProps {
  readonly mode: AmortizacaoFormMode;
  readonly onSubmit: (payload: AmortizationIn) => void | Promise<void>;
  readonly busy?: boolean;
  readonly defaultDraft?: AmortizationFormDraft;
}

interface FormCopy {
  readonly title: string;
  readonly description: string;
  readonly submitLabel: string;
  readonly ariaLabel: string;
  readonly testId: string;
}

const EMPTY_DRAFT: AmortizationFormDraft = {
  principal: "",
  taxaPeriodoPct: "",
  nPeriodos: "",
};

const FORM_COPY: Record<AmortizacaoFormMode, FormCopy> = {
  price: {
    title: "Sistema PRICE",
    description:
      "Informe valor financiado, taxa por periodo e prazo. O backend calcula a tabela.",
    submitLabel: "Calcular PRICE",
    ariaLabel: "Simulacao de amortizacao PRICE",
    testId: "amortizacao-price-form",
  },
  sac: {
    title: "Sistema SAC",
    description:
      "Informe valor financiado, taxa por periodo e prazo. O backend calcula a tabela.",
    submitLabel: "Calcular SAC",
    ariaLabel: "Simulacao de amortizacao SAC",
    testId: "amortizacao-sac-form",
  },
  compare: {
    title: "Comparar PRICE e SAC",
    description:
      "Use a mesma entrada para comparar custo total, juros e trajetoria das parcelas.",
    submitLabel: "Comparar sistemas",
    ariaLabel: "Comparacao de amortizacao PRICE e SAC",
    testId: "amortizacao-compare-form",
  },
};

export function AmortizacaoForm({
  mode,
  onSubmit,
  busy = false,
  defaultDraft = EMPTY_DRAFT,
}: AmortizacaoFormProps) {
  const base = useId();
  const [draft, setDraft] = useState<AmortizationFormDraft>(defaultDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const copy = FORM_COPY[mode];

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const result = validateAmortizationDraft(draft);
    if (!result.ok || result.value === null) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    void onSubmit(result.value);
  }

  function reset(): void {
    setDraft(EMPTY_DRAFT);
    setErrors({});
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={copy.ariaLabel}
      data-testid={copy.testId}
    >
      <FormSection title={copy.title} description={copy.description}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            id={`${base}-principal`}
            label="Principal (BRL)"
            value={draft.principal}
            onChange={(value) =>
              setDraft((current) => ({ ...current, principal: value }))
            }
            placeholder="100.000,00"
            inputMode="decimal"
            required
            suffix="R$"
            hint="Valor presente financiado."
            error={errors.principal ?? null}
            disabled={busy}
          />
          <TextField
            id={`${base}-taxa`}
            label="Taxa do periodo"
            value={draft.taxaPeriodoPct}
            onChange={(value) =>
              setDraft((current) => ({ ...current, taxaPeriodoPct: value }))
            }
            placeholder="1,00"
            inputMode="decimal"
            required
            suffix="%"
            hint="Ex.: 1,00 = 1% por periodo."
            error={errors.taxaPeriodoPct ?? null}
            disabled={busy}
          />
          <TextField
            id={`${base}-periodos`}
            label="Prazo (periodos)"
            value={draft.nPeriodos}
            onChange={(value) =>
              setDraft((current) => ({ ...current, nPeriodos: value }))
            }
            placeholder="12"
            inputMode="numeric"
            required
            hint="Entre 1 e 1200."
            error={errors.nPeriodos ?? null}
            disabled={busy}
          />
        </div>
        <SubmitBar
          label={copy.submitLabel}
          busy={busy}
          onReset={reset}
          hint="Calculo oficial executado pela API."
        />
      </FormSection>
    </form>
  );
}
