import type { Metadata } from "next";

import { ModulePage, buildModuleMetadata } from "@/components/shell/ModulePage";

export const metadata: Metadata = buildModuleMetadata("diagnostico");

export default function Page() {
  return <ModulePage moduleId="diagnostico" />;
}
