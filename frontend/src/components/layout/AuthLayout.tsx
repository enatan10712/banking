import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/70 p-8 shadow-xl backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-primary">Banking Portal</h1>
          <p className="mt-2 text-sm text-slate-400">
            Securely manage your accounts and finances.
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
