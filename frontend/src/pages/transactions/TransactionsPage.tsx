import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Select } from "../../components/ui/Select";
import { transactions } from "../../data/mockData";

export function TransactionsPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        title="Transactions"
        subtitle="Slice the general ledger by account, type, value, or date to investigate activity."
        actions={
          <Button variant="secondary" leftIcon={<FunnelIcon className="h-4 w-4" />}>
            Save filter set
          </Button>
        }
      />

      <Card className="space-y-6">
        <div className="grid gap-4 md:grid-cols-6">
          <Input
            className="md:col-span-2"
            placeholder="Search reference, counterparty, or account"
            startIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
          <Select defaultValue="all" className="md:col-span-1">
            <option value="all">All types</option>
            <option value="transfer-in">Transfer in</option>
            <option value="transfer-out">Transfer out</option>
            <option value="interest">Interest</option>
            <option value="card">Card payment</option>
          </Select>
          <Select defaultValue="amount">
            <option value="amount">Amount</option>
            <option value="highest">Highest first</option>
            <option value="lowest">Lowest first</option>
            <option value="latest">Latest first</option>
          </Select>
          <Input type="date" defaultValue="2025-11-01" />
          <Input type="date" defaultValue="2025-11-03" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>Showing sample data. Connect API to enable live query results.</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="success">3 incoming</Badge>
            <Badge variant="danger">2 outgoing</Badge>
          </div>
        </div>
        <DataTable
          columns={[
            { header: "Reference", cell: (row) => row.reference },
            { header: "Account", cell: (row) => row.account },
            {
              header: "Type",
              cell: (row) => <Badge variant={row.amount < 0 ? "danger" : "success"}>{row.type}</Badge>,
            },
            {
              header: "Amount",
              align: "right",
              cell: (row) => (
                <span className={row.amount < 0 ? "text-rose-400" : "text-emerald-400"}>
                  {row.amount < 0 ? "-" : "+"}${Math.abs(row.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              ),
            },
            { header: "Counterparty", cell: (row) => row.counterparty },
            { header: "Timestamp", cell: (row) => row.createdAt },
          ]}
          data={transactions}
        />
      </Card>
    </section>
  );
}
