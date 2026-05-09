"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "educational" | "comparison";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-500 hover:bg-teal-400 text-black font-semibold focus-visible:outline-teal-400",
  secondary:
    "bg-transparent border border-teal-500/40 hover:border-teal-400 text-teal-300 hover:text-teal-200 focus-visible:outline-teal-400",
  educational:
    "bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 focus-visible:outline-amber-400",
  comparison:
    "bg-blue-600 hover:bg-blue-500 text-white font-semibold focus-visible:outline-blue-400",
};

export interface CockpitActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly icon?: ReactNode;
  readonly children: ReactNode;
}

export function CockpitActionButton({
  variant = "primary",
  icon,
  children,
  className,
  disabled,
  ...rest
}: CockpitActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {icon !== undefined && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
