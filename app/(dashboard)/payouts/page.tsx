"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  Building2, 
  CreditCard,
  Search,
  Filter,
  Download
} from "lucide-react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { MetricCard } from "@/components/dashboard/metric-card";

const mockPayouts = [
  {
    id: "PAY-8273",
    date: "May 2, 2026",
    amount: 1250,
    status: "Paid",
    bank: "Zenith Bank (****8293)",
    reference: "NaijaCreator-TRF-902"
  },
  {
    id: "PAY-8192",
    date: "April 25, 2026",
    amount: 850,
    status: "Paid",
    bank: "Zenith Bank (****8293)",
    reference: "NaijaCreator-TRF-811"
  },
  {
    id: "PAY-8012",
    date: "April 18, 2026",
    amount: 2100,
    status: "Paid",
    bank: "Access Bank (****1102)",
    reference: "NaijaCreator-TRF-705"
  },
  {
    id: "PAY-7956",
    date: "April 10, 2026",
    amount: 1600,
    status: "Paid",
    bank: "Access Bank (****1102)",
    reference: "NaijaCreator-TRF-662"
  }
];

export default function PayoutsPage() {
  const [mounted, setMounted] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const metrics = [
    {
      title: "Available Balance",
      value: "Rwf 850,400",
      change: "Safe to withdraw",
      icon: Wallet,
      iconColor: "#3B82F6",
      iconBgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: "Pending Balance",
      value: "Rwf 120,000",
      change: "Locked for 3 days",
      icon: Clock,
      iconColor: "#F97316",
      iconBgColor: "rgba(249, 115, 22, 0.1)",
    },
    {
      title: "Total Withdrawn",
      value: "Rwf 5.2M",
      change: "Lifetime payouts",
      icon: CheckCircle2,
      iconColor: "#22C55E",
      iconBgColor: "rgba(34, 197, 94, 0.1)",
    },
    {
      title: "Processing",
      value: "Rwf 0",
      change: "Active withdrawals",
      icon: AlertCircle,
      iconColor: "#A855F7",
      iconBgColor: "rgba(168, 85, 247, 0.1)",
    }
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowWithdrawModal(false);
      setAmount("");
    }, 2000);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-text">Payouts</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-95"
          >
            <ArrowUpRight className="h-4 w-4" />
            Withdraw Funds
          </button>
        </div>
      </div>

      <TopFilters />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Payout History */}
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h3 className="text-sm font-semibold text-text">Withdrawal History</h3>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-subtle hover:text-text transition-colors">
                <Search className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-subtle hover:text-text transition-colors">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-subtle">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-subtle">Reference</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-subtle">Account</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-subtle">Amount</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-subtle">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockPayouts.map((payout) => (
                  <tr key={payout.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-6 py-4 text-xs font-medium text-text">{payout.date}</td>
                    <td className="px-6 py-4 text-[11px] text-subtle font-mono">{payout.id}</td>
                    <td className="px-6 py-4 text-xs text-subtle">{payout.bank}</td>
                    <td className="px-6 py-4 text-xs font-bold text-text">Rwf {payout.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border p-4 text-center">
            <button className="text-xs font-bold text-blue-500 hover:text-blue-400">View all history</button>
          </div>
        </div>

        {/* Bank Details & Limits */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text">Payout Accounts</h3>
              <button className="text-xs font-bold text-blue-500 hover:text-blue-400">Add New</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl border border-blue-500/30 bg-blue-600/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-text">Zenith Bank PLC</p>
                  <p className="text-[10px] text-subtle mt-0.5">**** 8293 • Primary</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:border-zinc-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-text">Access Bank</p>
                  <p className="text-[10px] text-subtle mt-0.5">**** 1102 • Savings</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold text-text mb-4">Withdrawal Limits</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-subtle uppercase font-bold tracking-widest">Daily Limit</span>
                  <span className="text-text font-bold">Rwf 850,400 / Rwf 2.5M</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '34%' }}></div>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-zinc-500">
                Your withdrawal limit is based on your account tier and activity. <button className="text-blue-500 font-bold">Request limit increase</button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-surface p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-blue-500">
                <Wallet className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-text">Withdraw Funds</h2>
              <p className="mt-2 text-sm text-subtle">Transfer your earnings to your local bank account.</p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-subtle">Withdrawal Amount</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-500">Rwf</div>
                   <input 
                     type="number" 
                     required
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     placeholder="0.00" 
                     className="h-16 w-full rounded-2xl border border-zinc-800 bg-black pl-14 pr-4 text-2xl font-bold text-text focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                   />
                   <button 
                     type="button"
                     onClick={() => setAmount("850400")}
                     className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-zinc-700"
                   >
                     MAX
                   </button>
                </div>
                <div className="flex items-center justify-between pt-1">
                   <span className="text-[10px] text-subtle">Available: Rwf 850,400</span>
                   <span className="text-[10px] text-subtle">Minimum: Rwf 1,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-subtle">Payout Destination</label>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text">Zenith Bank PLC</p>
                      <p className="text-xs text-subtle mt-0.5">**** 8293 • Instant Transfer</p>
                    </div>
                    <button type="button" className="text-xs font-bold text-blue-500">Change</button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-muted/30 p-4">
                 <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-subtle">Platform Fee (0%)</span>
                    <span className="text-text font-medium">Rwf 0</span>
                 </div>
                 <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-border">
                    <span className="text-text">Total to Receive</span>
                    <span className="text-emerald-500">Rwf {amount ? parseFloat(amount).toLocaleString() : "0"}</span>
                 </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 rounded-2xl border border-zinc-800 bg-transparent py-4 text-sm font-bold text-text transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!amount || isProcessing}
                  className="flex-1 rounded-2xl bg-white py-4 text-sm font-bold text-black shadow-lg transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Confirm Withdrawal"}
                </button>
              </div>
              <p className="text-center text-[10px] text-zinc-500">
                Funds typically arrive in your account within 2-3 business days.
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
