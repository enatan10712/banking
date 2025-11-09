import { ArrowDownTrayIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { accounts, transactions } from "../../data/mockData";

export function AccountDetailsPage() {
  const { accountId } = useParams();
  const account = useMemo(
    () => accounts.find((item) => item.id.toString() === accountId),
    [accountId]
  );
  const accountTransactions = useMemo(
    () => transactions.filter((tx) => tx.account === account?.name),
    [account?.name]
  );

  if (!account) {
    return (
      <section className="space-y-6">
        <PageHeader title="Account not found" subtitle="Use the accounts list to select a valid account." />
        <Card>
          <p className="text-sm text-slate-400">
            This is sample data only. Once the backend is connected, this route will display real account
            information.
          </p>
        </Card>
      </section>
    );
  }

  const balanceFormatted = `${account.currency} ${account.balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;

  return (
    <section className="space-y-8">
      <PageHeader
        title={account.name}
        subtitle={`Account number ${account.number} · Last activity ${account.lastActivity}`}
        actions={
          <>
            <Button variant="secondary" leftIcon={<ShieldCheckIcon className="h-4 w-4" />}>
              Freeze account
            </Button>
            <Button leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}>Export statement</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          title="Current balance"
          value={balanceFormatted}
          subtitle="Net balance including pending transfers"
          intent={account.balance >= 0 ? "success" : "danger"}
        />
        <StatCard
          title="Status"
          value={account.status}
          subtitle="Updated automatically via core banking"
        />
        <StatCard
          title="Account type"
          value={account.type}
          subtitle="Product tier: Premium"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Customer profile</h2>
          <p className="mt-2 text-sm text-slate-400">
            Map this section to the customer service endpoint for full profile and KYC data.
          </p>
          <dl className="mt-6 grid gap-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <dt>Customer name</dt>
              <dd className="font-medium text-white">Priya Patel</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Email</dt>
              <dd className="font-medium text-white">priya.patel@bankpro.com</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Segment</dt>
              <dd>
                <Badge variant="success">Premier banking</Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Risk rating</dt>
              <dd>
                <Badge variant="warning">Moderate</Badge>
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Controls & compliance</h2>
          <ul className="mt-4 space-y-4 text-sm text-slate-300">
            <li className="flex justify-between">
              <span>AML monitoring</span>
              <Badge variant="success">Active</Badge>
            </li>
            <li className="flex justify-between">
              <span>Credit limit</span>
              <span className="font-medium text-white">$25,000.00</span>
            </li>
            <li className="flex justify-between">
              <span>Last review</span>
              <span className="font-medium text-white">Oct 28, 2025</span>
            </li>
            <li className="flex justify-between">
              <span>Next scheduled review</span>
              <span className="font-medium text-white">Jan 15, 2026</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        <div className="mt-4">
          <DataTable
            columns={[
              { header: "Reference", cell: (row) => row.reference },
              { header: "Type", cell: (row) => row.type },
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
            data={accountTransactions}
            emptyMessage="No activity recorded for this account in the sample data set."
          />
        </div>
      </Card>
    </section>
  );
}
