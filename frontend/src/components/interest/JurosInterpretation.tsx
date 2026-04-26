/**
 * Bloco pedagógico — headline + body.
 *
 * Reutiliza `<EducationPanel />`. Preserva quebras de linha do `body`
 * em parágrafos separados para legibilidade.
 */
import { EducationPanel } from "@/components/ui/EducationPanel";
import type { Interpretation } from "@/types/interest";

export interface JurosInterpretationProps {
  readonly interpretation: Interpretation;
}

export function JurosInterpretation({
  interpretation,
}: JurosInterpretationProps) {
  const paragraphs = interpretation.body
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <EducationPanel title={interpretation.headline}>
      {paragraphs.length === 0 ? (
        <p>{interpretation.body}</p>
      ) : (
        paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
      )}
    </EducationPanel>
  );
}
