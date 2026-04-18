import type { Metadata } from "next";

import { ModulePage, buildModuleMetadata } from "@/components/shell/ModulePage";

export const metadata: Metadata = buildModuleMetadata("amortizacao");

export default function Page() {
  return <ModulePage moduleId="amortizacao" />;
}
