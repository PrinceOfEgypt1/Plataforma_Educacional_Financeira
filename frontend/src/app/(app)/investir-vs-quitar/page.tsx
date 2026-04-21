import type { Metadata } from "next";

import { ModulePage, buildModuleMetadata } from "@/components/shell/ModulePage";

export const metadata: Metadata = buildModuleMetadata("investir-vs-quitar");

export default function Page() {
  return <ModulePage moduleId="investir-vs-quitar" />;
}
