import type { ReactNode } from "react";

import { FinancialCockpitShell } from "@/components/ui/cockpit";

export interface ShellLayoutProps {
  readonly children: ReactNode;
  readonly pathname?: string;
}

export function ShellLayout({ children, pathname }: ShellLayoutProps) {
  const pathnameProp = pathname !== undefined ? { pathname } : {};
  return (
    <FinancialCockpitShell {...pathnameProp}>{children}</FinancialCockpitShell>
  );
}
