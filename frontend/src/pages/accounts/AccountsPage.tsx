import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Select } from "../../components/ui/Select";
import { accounts } from "../../data/mockData";

export function AccountsPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        title="Accounts portfolio"
        subtitle="Search, filter, and manage customer accounts across all business units."
        actions={
          <>
            <Button variant="secondary" leftIcon={<ArrowPathIcon className="h-4 w-4" />}>
              Refresh
            </Button>
            <Button leftIcon={<PlusIcon className="h-4 w-4" />}>Open account</Button>
          </>
        }
      />

      <Card className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Input placeholder="Search by name or number" className="md:col-span-2" />
          <Select defaultValue="all">
            <option value="all">All account types</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit</option>
          </Select>
          <Select defaultValue="status-all">
            <option value="status-all">All statuses</option>
            <option value="active">Active</option>
            <option value="frozen">Frozen</option>
            <option value="closed">Closed</option>
          </Select>
        </div>
        <DataTable
          columns={[
            { header: "Account", cell: (row) => row.name },
            { header: "Number", cell: (row) => row.number },
            { header: "Type", cell: (row) => row.type },
            {
              header: "Balance",
              align: "right",
              cell: (row) => (
                <span className={row.balance < 0 ? "text-rose-400" : "text-emerald-400"}>
                  {row.currency} {row.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              ),
            },
            {
              header: "Status",
              cell: (row) => (
                <Badge variant={row.status === "Active" ? "success" : "warning"}>{row.status}</Badge>
              ),
            },
            { header: "Updated", cell: (row) => row.lastActivity },
          ]}
          data={accounts}
        />
      </Card>
    </section>
  );
}
