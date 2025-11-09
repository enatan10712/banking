import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "../navigation/Sidebar";
import { TopBar } from "../navigation/TopBar";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <TopBar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto bg-slate-950/60 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
