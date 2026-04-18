/**
 * Barrel dos estados reutilizáveis.
 *
 * Consumidores devem sempre importar via
 *   `import { LoadingState, ErrorState, EmptyState } from "@/components/states";`
 * para permitir refatorações futuras (ex.: mover para um pacote interno) sem
 * quebrar call-sites.
 */
export { LoadingState } from "./LoadingState";
export type { LoadingStateProps } from "./LoadingState";

export { ErrorState } from "./ErrorState";
export type { ErrorStateProps } from "./ErrorState";

export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";
