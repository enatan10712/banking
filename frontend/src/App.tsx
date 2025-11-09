import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AccountsPage } from "./pages/accounts/AccountsPage";
import { AccountDetailsPage } from "./pages/accounts/AccountDetailsPage";
import { TransactionsPage } from "./pages/transactions/TransactionsPage";
import { TransferPage } from "./pages/transactions/TransferPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminAccountsPage } from "./pages/admin/AdminAccountsPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { QueryProvider } from "./providers/QueryProvider";

export default function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/:accountId" element={<AccountDetailsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/accounts" element={<AdminAccountsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </QueryProvider>
  );
}
