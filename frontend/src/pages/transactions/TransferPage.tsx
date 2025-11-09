import { ArrowsRightLeftIcon, CalendarDaysIcon, PaperAirplaneIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { Input } from "../../components/ui/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Select } from "../../components/ui/Select";
import { accounts, scheduledTransfers } from "../../data/mockData";

const statusVariant: Record<string, "success" | "warning" | "danger" | "default"> = {
  Approved: "success",
  Pending: "warning",
  Rejected: "danger",
};

export function TransferPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        title="Transfer funds"
        subtitle="Initiate immediate or scheduled transfers between customer accounts with policy safeguards."
        actions={
          <Button variant="secondary" leftIcon={<ArrowsRightLeftIcon className="h-4 w-4" />}>
            Transfer policies
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="text-lg font-semibold text-white">Initiate transfer</h2>
            <p className="text-sm text-slate-400">
              Select source and destination accounts, confirm the amount, and optionally schedule for later.
            </p>
          </div>
          <form className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300" htmlFor="fromAccount">
                From account
              </label>
              <Select id="fromAccount" defaultValue={accounts[0]?.id.toString() ?? ""}>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300" htmlFor="toAccount">
                To account
              </label>
              <Select id="toAccount" defaultValue={accounts[1]?.id.toString() ?? ""}>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300" htmlFor="amount">
                Amount
              </label>
              <Input id="amount" type="number" placeholder="0.00" startIcon={<span className="text-slate-400">$</span>} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300" htmlFor="currency">
                Currency
              </label>
              <Select id="currency" defaultValue="USD">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300" htmlFor="reference">
                Reference
              </label>
              <Input id="reference" placeholder="Payment details for recipient" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-slate-300" htmlFor="schedule">
                Schedule (optional)
              </label>
              <Input
                id="schedule"
                type="datetime-local"
                startIcon={<CalendarDaysIcon className="h-4 w-4" />}
                defaultValue="2025-11-05T09:00"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full" size="lg" rightIcon={<PaperAirplaneIcon className="h-4 w-4" />}>
                Submit transfer
              </Button>
            </div>
          </form>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-white">Authorization & controls</h2>
              <p className="text-sm text-slate-400">
                Transfers above $10k require dual approval and AML monitoring is applied to every request.
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>• Daily limit remaining: <span className="font-semibold text-white">$18,750</span></li>
            <li>• FX markup automatically applied for cross-border payments.</li>
            <li>• Approved beneficiaries: 42 · Pending verification: 3</li>
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Scheduled transfers</h2>
          <Button variant="ghost" size="md">
            Manage schedule
          </Button>
        </div>
        <div className="mt-4">
          <DataTable
            columns={[
              { header: "ID", cell: (row) => row.id },
              { header: "From", cell: (row) => row.fromAccount },
              { header: "To", cell: (row) => row.toAccount },
              {
                header: "Amount",
                align: "right",
                cell: (row) => (
                  <span className="text-slate-100">
                    {row.currency} {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                ),
              },
              { header: "Scheduled", cell: (row) => row.scheduledFor },
              {
                header: "Status",
                cell: (row) => (
                  <Badge variant={statusVariant[row.status] ?? "default"}>{row.status}</Badge>
                ),
              },
            ]}
            data={scheduledTransfers}
            emptyMessage="No scheduled transfers in the sample data set."
          />
        </div>
      </Card>
    </section>
  );
}
