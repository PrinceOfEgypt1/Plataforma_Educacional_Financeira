/**
 * `<ShellLayout />`
 *
 * Estrutura visual da shell: Sidebar + Header + área de conteúdo principal,
 * em grid responsivo. A sidebar desaparece em telas < md — o conteúdo segue
 * acessível e o Header permanece como âncora.
 *
 * Este componente é **orquestrador visual**; não acessa `usePathname` nem
 * estado global. A instrumentação de testes unitários fica pelo snapshot
 * leve em `ShellLayout.test.tsx` (§5.1.7 do Prompt Sprint 1).
 */
import type { ReactNode } from "react";

import { EducationalNotice } from "./EducationalNotice";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export interface ShellLayoutProps {
  readonly children: ReactNode;
  /** Pathname forçado — usado pelos testes para evitar mock global. */
  readonly pathname?: string;
}

export function ShellLayout({ children, pathname }: ShellLayoutProps) {
  // `exactOptionalPropertyTypes` exige que `pathname` seja passado apenas
  // quando explicitamente definido.
  const pathnameProp = pathname !== undefined ? { pathname } : {};
  return (
    <div
      data-testid="shell-layout"
      className="flex min-h-screen flex-col bg-slate-50"
    >
      <EducationalNotice />
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="hidden w-64 shrink-0 md:block">
          <Sidebar {...pathnameProp} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <Header {...pathnameProp} />
          <main
            id="main-content"
            role="main"
            aria-label="Conteúdo principal"
            className="flex-1 px-6 py-6"
          >
            {children}
          </main>
          <footer
            role="contentinfo"
            className="border-t border-slate-200 px-6 py-4 text-center text-xs
                       text-slate-400"
          >
            Os cálculos são aproximações educacionais. Consulte um profissional
            habilitado para decisões financeiras.
          </footer>
        </div>
      </div>
    </div>
  );
}
