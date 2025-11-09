import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <div
          className={clsx(
            "flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm text-slate-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40",
            error && "border-rose-500 focus-within:ring-rose-400",
            className
          )}
        >
          {startIcon ? <span className="text-slate-400">{startIcon}</span> : null}
          <input
            ref={ref}
            className={clsx(
              "flex-1 border-none bg-transparent py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            )}
            {...props}
          />
          {endIcon ? <span className="text-slate-400">{endIcon}</span> : null}
        </div>
        {error ? <p className="text-xs text-rose-400">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = "Input";
