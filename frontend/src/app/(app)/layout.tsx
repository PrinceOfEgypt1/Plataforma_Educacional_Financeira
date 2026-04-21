import type { ReactNode } from "react";

import { ShellLayout } from "@/components/shell/ShellLayout";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Layout do grupo `(app)` — envelope visual completo da plataforma
 * (EducationalNotice + Sidebar + Header + área de conteúdo + footer).
 *
 * Todas as rotas dentro de `app/(app)/…/` herdam automaticamente esta
 * shell. Rotas futuras que não devam receber a shell (por exemplo,
 * `/login` ou `/embed`) podem viver fora do grupo `(app)` sem necessidade
 * de reescrever este layout.
 */
export default function AppGroupLayout({ children }: AppLayoutProps) {
  return <ShellLayout>{children}</ShellLayout>;
}
