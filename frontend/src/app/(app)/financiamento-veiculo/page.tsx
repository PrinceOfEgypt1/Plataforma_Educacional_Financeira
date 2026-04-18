import type { Metadata } from "next";

import { ModulePage, buildModuleMetadata } from "@/components/shell/ModulePage";

export const metadata: Metadata = buildModuleMetadata("financiamento-veiculo");

export default function Page() {
  return <ModulePage moduleId="financiamento-veiculo" />;
}
