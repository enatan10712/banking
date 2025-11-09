import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { adminAccounts } from "../../data/mockData";

const STATUS_OPTIONS = ["Any status", "Active", "Frozen", "Closed"];
const RISK_OPTIONS = ["All risk levels", "Low", "Medium", "High"];

export function AdminAccountsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Any status");
  const [riskFilter, setRiskFilter] = useState("All risk levels");

  const filteredAccounts = useMemo(() => {
    return adminAccounts.filter((account) => {
      const matchesSearch = `${account.owner} ${account.account}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "Any status" || account.status === statusFilter;
      const matchesRisk = riskFilter === "All risk levels" || account.risk === riskFilter;
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [search, statusFilter, riskFilter]);

  return (
    <section className="space-y-8">
      <PageHeader
        title="Admin · Accounts"
        subtitle="Monitor and control account status across the bank. Freeze or reopen accounts, check risk scores, and review history."
        actions={
          <Button leftIcon={<ShieldCheckIcon className="h-4 w-4" />}>Run compliance scan</Button>
        }
      />

      <Card className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            placeholder="Search owner or account name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            startIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
          <select
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 focus:border-primary focus:outline-none"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 focus:border-primary focus:outline-none"
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
          >
            {RISK_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={() => { setSearch(""); setStatusFilter("Any status"); setRiskFilter("All risk levels"); }}>
            Reset filters
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-800">
          <DataTable
            columns={[
              { header: "Account", cell: (row) => row.account },
              { header: "Owner", cell: (row) => row.owner },
              {
                header: "Status",
                cell: (row) => (
                  <Badge variant={row.status === "Active" ? "success" : row.status === "Frozen" ? "warning" : "danger"}>
                    {row.status}
                  </Badge>
                ),
              },
              {
                header: "Risk",
                cell: (row) => (
                  <Badge variant={row.risk === "Low" ? "success" : row.risk === "Medium" ? "warning" : "danger"}>
                    {row.risk}
                  </Badge>
                ),
              },
              { header: "Opened", cell: (row) => row.opened },
              {
                header: "Actions",
                cell: (row) => (
                  <div className="flex flex-wrap gap-2">
                    {row.status === "Frozen" ? (
                      <Button variant="ghost" size="md">Unfreeze</Button>
                    ) : (
                      <Button variant="ghost" size="md">Freeze</Button>
                    )}
                    <Button variant="ghost" size="md">View audit log</Button>
                  </div>
                ),
              },
            ]}
            data={filteredAccounts}
            emptyMessage="No accounts match the selected filters."
          />
        </div>
      </Card>

      <Card className="border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
        <div className="flex items-center gap-3">
          <ShieldExclamationIcon className="h-5 w-5" />
          <div>
            <p className="font-medium">Pending high-risk reviews</p>
            <p className="text-rose-100/80">
              Accounts flagged by fraud detection require secondary approval before reactivation.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
