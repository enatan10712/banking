import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <select
          ref={ref}
          className={clsx(
            "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
            error && "border-rose-500 focus:ring-rose-400",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error ? <p className="text-xs text-rose-400">{error}</p> : null}
      </div>
    );
  }
);

Select.displayName = "Select";
