import type { HTMLAttributes } from "react";
import clsx from "clsx";

const variants = {
  default: "bg-slate-800 text-slate-200",
  success: "bg-emerald-500/10 text-emerald-300",
  warning: "bg-amber-500/10 text-amber-300",
  danger: "bg-rose-500/10 text-rose-300",
} as const;

type Variant = keyof typeof variants;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ children, className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
