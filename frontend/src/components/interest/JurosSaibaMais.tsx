/**
 * `<JurosSaibaMais />`
 *
 * Painel pedagógico integrado que renderiza um bloco de conteúdo educacional
 * (Nível 1 ou Nível 2) extraído de `frontend/src/content/juros/`.
 *
 * Este componente NÃO substitui `<JurosInterpretation />`. A interpretação
 * é gerada pelo backend a partir do payload de simulação (campo
 * `interpretation` do Doc 06 §16.3) e descreve o resultado específico do
 * usuário. O `<JurosSaibaMais />` complementa essa interpretação com
 * conteúdo estático e versionado revisado editorialmente (Doc 08 §7, §10).
 *
 * Mantém o mesmo wrapper visual (`<EducationPanel />`) para consistência
 * com a paleta e a a11y do Doc 18 — o painel é `role="complementary"`
 * com `aria-label` descritivo.
 */
import { EducationPanel } from "@/components/ui/EducationPanel";
import type { EducationalContent } from "@/content/juros";

export interface JurosSaibaMaisProps {
  readonly content: EducationalContent;
  readonly className?: string;
}

export function JurosSaibaMais({ content, className }: JurosSaibaMaisProps) {
  return (
    <EducationPanel
      title={content.title}
      {...(className !== undefined ? { className } : {})}
    >
      {content.paragraphs.map((paragraph, idx) => (
        <p key={idx} data-testid="juros-saiba-mais-paragraph">
          {paragraph}
        </p>
      ))}
      <p
        className="mt-2 text-xs text-slate-500"
        data-testid="juros-saiba-mais-disclaimer"
      >
        {content.disclaimer}
      </p>
    </EducationPanel>
  );
}
