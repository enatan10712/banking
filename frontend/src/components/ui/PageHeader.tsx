import type { ReactNode } from "react";
import clsx from "clsx";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header className={clsx("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", className)}>
      <div>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}
