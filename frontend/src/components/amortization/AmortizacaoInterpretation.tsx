import { EducationPanel } from "@/components/ui/EducationPanel";
import type { AmortizationInterpretation } from "@/types/amortization";

export interface AmortizacaoInterpretationProps {
  readonly interpretation: AmortizationInterpretation;
}

export function AmortizacaoInterpretation({
  interpretation,
}: AmortizacaoInterpretationProps) {
  const paragraphs = interpretation.body
    .split(/\n{2,}/g)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <EducationPanel title={interpretation.headline}>
      {paragraphs.length === 0 ? (
        <p>{interpretation.body}</p>
      ) : (
        paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
      )}
    </EducationPanel>
  );
}
