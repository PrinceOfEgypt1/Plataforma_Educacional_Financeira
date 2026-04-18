import type { Metadata } from "next";

import { ModulePage, buildModuleMetadata } from "@/components/shell/ModulePage";

export const metadata: Metadata = buildModuleMetadata("atraso");

export default function Page() {
  return <ModulePage moduleId="atraso" />;
}
