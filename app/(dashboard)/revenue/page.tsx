"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, Eye, Heart, Plus, Wallet, ShoppingBag, ArrowUpRight } from "lucide-react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useCurrency } from "@/hooks/use-currency";

interface Transaction {
  id: string;
  amount: number;
  customer_email: string;
  customer_name: string | null;
  status: string;
  created_at: string;
  offer_id: string | null;
}

export default function RevenuePage() {
  const { user } = useAuth();
  const supabase = createClient();
  const { formatPrice } = useCurrency();

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [offersCount, setOffersCount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch transactions
      const { data: txns } = await supabase
        .from("transactions")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (txns) {
        setTransactions(txns as Transaction[]);
        const successTxns = txns.filter((t: any) => t.status === "success");
        setTotalRevenue(successTxns.reduce((sum: number, t: any) => sum + Number(t.amount), 0));
        setTotalSales(successTxns.length);
      }

      // Fetch offers count
      const { count } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setOffersCount(count || 0);
    };

    fetchData();
  }, [user]);

  const metrics = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      change: "all time",
      icon: CircleDollarSign,
      iconColor: "#22C55E",
      iconBgColor: "rgba(34, 197, 94, 0.1)",
    },
    {
      title: "Store visits",
      value: "0",
      change: "coming soon",
      icon: Eye,
      iconColor: "#F97316",
      iconBgColor: "rgba(249, 115, 22, 0.1)",
    },
    {
      title: "Total Sales",
      value: String(totalSales),
      change: "completed orders",
      icon: Heart,
      iconColor: "#A855F7",
      iconBgColor: "rgba(168, 85, 247, 0.1)",
    },
    {
      title: "Products Created",
      value: String(offersCount),
      change: "total offers",
      icon: Plus,
      iconColor: "#3B82F6",
      iconBgColor: "rgba(59, 130, 246, 0.1)",
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-text">Revenue</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.href = "/payouts"}
            className="flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 text-xs font-semibold text-text transition-colors hover:bg-muted"
          >
            <Wallet className="h-4 w-4" />
            Withdraw
          </button>
          <TopFilters />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2.5fr_1fr]">
        <div className="rounded-xl border border-border bg-surface p-4 md:p-5">
          <PerformanceChart />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 md:p-5">
          <h3 className="text-sm font-semibold text-text mb-4">Revenue Breakdown</h3>
          {totalRevenue > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-subtle">Gross</span>
                <span className="font-semibold text-text">{formatPrice(totalRevenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-subtle">Platform fee (5%)</span>
                <span className="font-semibold text-text">-{formatPrice(totalRevenue * 0.05)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-text">Net</span>
                <span className="font-bold text-[#22c55e]">{formatPrice(totalRevenue * 0.95)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-subtle">No revenue yet</p>
              <p className="text-xs text-zinc-600 mt-1">Start selling offers to track earnings</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-border bg-surface p-4 md:p-5">
        <h3 className="text-sm font-semibold text-text mb-4">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                <div>
                  <p className="text-sm font-medium text-text">{txn.customer_name || txn.customer_email}</p>
                  <p className="text-xs text-subtle">{new Date(txn.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${txn.status === "success" ? "text-[#22c55e]" : "text-amber-500"}`}>
                    {formatPrice(Number(txn.amount))}
                  </p>
                  <p className="text-[10px] uppercase text-subtle">{txn.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CircleDollarSign className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm font-medium text-text">No transactions yet</p>
            <p className="text-xs text-subtle mt-1">When customers buy your offers, transactions will appear here</p>
          </div>
        )}
      </div>
    </section>
  );
}
