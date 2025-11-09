import type { ReactNode } from "react";
import clsx from "clsx";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    label: string;
    direction: "up" | "down";
  };
  intent?: "default" | "success" | "warning" | "danger";
}

const intentStyles: Record<NonNullable<StatCardProps["intent"]>, string> = {
  default: "border-slate-800",
  success: "border-emerald-500/40",
  warning: "border-amber-500/40",
  danger: "border-rose-500/40",
};

export function StatCard({ title, value, subtitle, icon, trend, intent = "default" }: StatCardProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3 rounded-2xl border bg-slate-900/80 p-6 shadow-lg shadow-black/20",
        intentStyles[intent]
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        {icon ? <span className="text-primary">{icon}</span> : null}
      </div>
      {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
      {trend ? (
        <p
          className={clsx(
            "text-xs font-medium",
            trend.direction === "up" ? "text-emerald-400" : "text-rose-400"
          )}
        >
          {trend.label}
        </p>
      ) : null}
    </div>
  );
}
