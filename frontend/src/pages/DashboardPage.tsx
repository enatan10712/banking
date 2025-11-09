import { useMemo } from "react";
import { ArrowUpRightIcon, BanknotesIcon, ChartBarIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import type { TooltipProps } from "recharts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { DataTable } from "../components/ui/DataTable";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { accounts, cashflow, transactions } from "../data/mockData";

export function DashboardPage() {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const activeCount = accounts.filter((account) => account.status === "Active").length;
  const outgoingTransfers = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const { totalInflow, totalOutflow, netFlow } = useMemo(() => {
    const inflow = cashflow.reduce((sum, day) => sum + day.inflow, 0);
    const outflow = cashflow.reduce((sum, day) => sum + day.outflow, 0);
    return {
      totalInflow: inflow,
      totalOutflow: outflow,
      netFlow: inflow - outflow,
    };
  }, []);

  type CashflowTooltipEntry = NonNullable<TooltipProps<number, string>["payload"]>[number];

  const renderCashflowTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || payload.length === 0 || typeof label !== "string") {
      return null;
    }
    const inflowPoint = payload.find(
      (item: CashflowTooltipEntry) => item?.dataKey === "inflow"
    );
    const outflowPoint = payload.find(
      (item: CashflowTooltipEntry) => item?.dataKey === "outflow"
    );
    const inflowValueRaw = inflowPoint?.value ?? 0;
    const outflowValueRaw = outflowPoint?.value ?? 0;
    const inflowValue = typeof inflowValueRaw === "number" ? inflowValueRaw : Number(inflowValueRaw);
    const outflowValue = typeof outflowValueRaw === "number" ? outflowValueRaw : Number(outflowValueRaw);

    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-200 shadow-xl">
        <p className="font-semibold text-white">{label}</p>
        <p className="mt-1 text-emerald-400">Inflow: ${inflowValue.toLocaleString()}</p>
        <p className="text-rose-400">Outflow: ${outflowValue.toLocaleString()}</p>
        <p className="text-slate-300">Net: ${(inflowValue - outflowValue).toLocaleString()}</p>
      </div>
    );
  };

  return (
    <section className="space-y-8">
      <PageHeader
        title="Executive Overview"
        subtitle="Monitor KPIs, review cash positions, and take action on flagged activity."
        actions={<Button rightIcon={<ArrowUpRightIcon className="h-4 w-4" />}>View full report</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Net across all active accounts"
          icon={<BanknotesIcon className="h-8 w-8" />}
          intent="success"
          trend={{ label: "+4.2% vs last month", direction: "up" }}
        />
        <StatCard
          title="Active Accounts"
          value={`${activeCount}`}
          subtitle="Customers and corporate entities"
          icon={<ChartBarIcon className="h-8 w-8" />}
          trend={{ label: "2 new accounts", direction: "up" }}
        />
        <StatCard
          title="Outgoing Transfers"
          value={`$${outgoingTransfers.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          subtitle="Past 7 days"
          intent="warning"
          trend={{ label: "1.8% above average", direction: "up" }}
        />
        <StatCard
          title="Compliance Alerts"
          value="3"
          subtitle="Awaiting review"
          intent="danger"
          trend={{ label: "2 escalated today", direction: "up" }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Top balances</h2>
              <p className="text-sm text-slate-400">Accounts ranked by current balance.</p>
            </div>
            <Button variant="ghost" size="md">
              Manage accounts
            </Button>
          </div>
          <ul className="mt-6 space-y-4">
            {accounts.map((account) => (
              <li key={account.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-100">{account.name}</p>
                  <p className="text-xs text-slate-500">{account.number}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {account.currency} {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-slate-500">Updated {account.lastActivity}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Cashflow snapshot</h2>
              <p className="text-sm text-slate-400">Daily inflow vs outflow over the past week.</p>
            </div>
            <div className="text-right text-sm text-slate-300">
              <p>
                Net flow: <span className={netFlow >= 0 ? "text-emerald-400" : "text-rose-400"}>${netFlow.toLocaleString()}</span>
              </p>
              <p>
                Total inflow: <span className="text-emerald-400">${totalInflow.toLocaleString()}</span>
              </p>
              <p>
                Total outflow: <span className="text-rose-400">${totalOutflow.toLocaleString()}</span>
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflow} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#6b7280" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#6b7280"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip content={renderCashflowTooltip} wrapperStyle={{ outline: "none" }} />
                <Area type="monotone" dataKey="inflow" stroke="#22c55e" strokeWidth={2} fill="url(#inflowGradient)" />
                <Area type="monotone" dataKey="outflow" stroke="#f87171" strokeWidth={2} fill="url(#outflowGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent transactions</h2>
            <p className="text-sm text-slate-400">Latest activity across all monitored accounts.</p>
          </div>
          <Button variant="ghost" size="md">
            See all
          </Button>
        </div>
        <div className="mt-4">
          <DataTable
            columns={[
              { header: "Transaction", cell: (row) => row.reference },
              { header: "Account", cell: (row) => row.account },
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
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <DocumentArrowDownIcon className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-white">Reports & exports</h2>
            <p className="text-sm text-slate-400">Generate ready-to-share summaries for stakeholders.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-500">Balances</p>
            <p className="mt-2 font-semibold text-white">Consolidated balance sheet</p>
            <Button variant="ghost" size="md" className="mt-3">
              Export CSV
            </Button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-500">Transactions</p>
            <p className="mt-2 font-semibold text-white">High-value activity report</p>
            <Button variant="ghost" size="md" className="mt-3">
              Schedule PDF
            </Button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-500">Savings</p>
            <p className="mt-2 font-semibold text-white">Goal progress snapshot</p>
            <Button variant="ghost" size="md" className="mt-3">
              Open in notebook
            </Button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-wide text-slate-500">Compliance</p>
            <p className="mt-2 font-semibold text-white">Flagged transactions digest</p>
            <Button variant="ghost" size="md" className="mt-3">
              Notify admins
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
