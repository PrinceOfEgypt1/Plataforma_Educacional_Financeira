/**
 * Utilitário `cn` — combinação de classes Tailwind.
 *
 * Encadeia `clsx` (seleção condicional) com `tailwind-merge` (deduplicação
 * coerente de classes conflitantes, ex.: `px-2 px-4` → `px-4`).
 *
 * Uso típico:
 *   <div className={cn("px-2 py-1", active && "bg-blue-600 text-white")} />
 */
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
