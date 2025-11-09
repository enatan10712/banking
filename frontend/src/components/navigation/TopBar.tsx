import { Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl border border-slate-700 p-2 text-slate-300 transition hover:border-primary hover:text-primary lg:hidden"
          onClick={onToggleSidebar}
        >
          <Bars3Icon className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </button>
        <div>
          <h2 className="text-xl font-semibold text-white">Overview</h2>
          <p className="text-sm text-slate-400">Track balances, transfers, and recent activity.</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800"
        >
          <BellIcon className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
              EN
            </span>
            <span>Admin</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Menu.Button>
        </Menu>
      </div>
    </header>
  );
}
