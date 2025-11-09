import type { ComponentType, SVGProps } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

type SidebarLink = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const primaryNav: SidebarLink[] = [
  { to: "/dashboard", label: "Dashboard", icon: ChartBarIcon },
  { to: "/accounts", label: "Accounts", icon: BanknotesIcon },
  { to: "/transactions", label: "Transactions", icon: CurrencyDollarIcon },
  { to: "/transfer", label: "Transfer", icon: CurrencyDollarIcon },
  { to: "/reports", label: "Reports", icon: ShieldCheckIcon },
];

const adminNav: SidebarLink[] = [
  { to: "/admin/users", label: "Admin Users", icon: UserGroupIcon },
  { to: "/admin/accounts", label: "Admin Accounts", icon: ShieldCheckIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black/60 transition-opacity lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-900/95 px-6 py-8 shadow-2xl",
          "transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar navigation"
      >
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">BankPro</p>
            <h1 className="text-lg font-semibold text-primary">Digital Banking</h1>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-700 p-1 text-slate-400 transition hover:text-primary lg:hidden"
            onClick={onClose}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="sr-only">Close navigation</span>
          </button>
        </div>

        <nav className="flex-1 space-y-8 overflow-y-auto">
          <div>
            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Overview</p>
            <ul className="space-y-2">
              {primaryNav.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      )
                    }
                    onClick={onClose}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Administration</p>
            <ul className="space-y-2">
              {adminNav.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                      )
                    }
                    onClick={onClose}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
          <div className="flex items-center gap-3">
            <UserCircleIcon className="h-10 w-10 text-primary" />
            <div>
              <p className="font-semibold text-white">Admin User</p>
              <p className="text-xs text-slate-400">Last login: 2h ago</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
