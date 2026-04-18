import type { Metadata } from "next";

import { ModulePage, buildModuleMetadata } from "@/components/shell/ModulePage";

export const metadata: Metadata = buildModuleMetadata("educacao");

export default function Page() {
  return <ModulePage moduleId="educacao" />;
}
