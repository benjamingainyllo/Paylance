"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, Eye, FolderPlus, UserRoundPlus } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { TopFilters } from "@/components/dashboard/top-filters";
import { useCurrency } from "@/hooks/use-currency";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";

export default function OverviewPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const { formatPrice } = useCurrency();

  // Real metrics from database
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalOffers, setTotalOffers] = useState(0);
  const [storeVisits] = useState(0); // Will wire later with view tracking

  const userName = profile?.first_name || "Creator";
  const userBio = profile?.bio || "Track your revenue, audience, and growth experiments.";

  useEffect(() => {
    setMounted(true);

    if (!user) return;

    const fetchMetrics = async () => {
      // Fetch total revenue from successful transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("creator_id", user.id)
        .eq("status", "success");

      if (transactions) {
        const revenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
        setTotalRevenue(revenue);
      }

      // Fetch audience count
      const { count: audienceCount } = await supabase
        .from("audience")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", user.id);

      setTotalLeads(audienceCount || 0);

      // Fetch offers count
      const { count: offersCount } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setTotalOffers(offersCount || 0);
    };

    fetchMetrics();
  }, [user]);

  if (!mounted) return null;

  const metrics = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      change: "all time",
      icon: CircleDollarSign,
      iconColor: "#22C55E",
      iconBgColor: "rgba(34, 197, 94, 0.1)"
    },
    {
      title: "Store visits",
      value: String(storeVisits),
      change: "coming soon",
      icon: Eye,
      iconColor: "#F97316",
      iconBgColor: "rgba(249, 115, 22, 0.1)"
    },
    {
      title: "Audience",
      value: String(totalLeads),
      change: "total contacts",
      icon: UserRoundPlus,
      iconColor: "#8B5CF6",
      iconBgColor: "rgba(139, 92, 246, 0.1)"
    },
    {
      title: "Offers Created",
      value: String(totalOffers),
      change: "total offers",
      icon: FolderPlus,
      iconColor: "#505081",
      iconBgColor: "rgba(80, 80, 129, 0.1)"
    }
  ];

  return (
    <section className="space-y-4">
      <TopFilters />
      <header className="rounded-xl border border-border bg-muted p-4 md:p-5">
        <p className="mb-1 text-sm text-text">Welcome back, {userName}.</p>
        <div className="rounded-xl bg-gradient-to-r from-eclipse-medium to-eclipse-dark dark:from-eclipse-dark dark:to-eclipse-darkest p-4 md:p-6 shadow-sm border border-border/10">
          <p className="text-xs text-white/70 dark:text-eclipse-light">Creator OS</p>
          <h1 className="mt-1 text-xl md:text-2xl font-bold tracking-tight text-white">
            {userBio}
          </h1>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <PerformanceChart />
        <section className="rounded-xl border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-text">Revenue Snapshot</h3>
          <div className="mt-5 rounded-lg border border-border bg-muted p-4">
            {totalRevenue > 0 ? (
              <>
                <p className="text-sm font-medium text-text">Total earnings</p>
                <p className="mt-3 text-right text-sm font-semibold text-[#22c55e]">{formatPrice(totalRevenue)}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-text">No revenue yet</p>
                <p className="text-xs text-subtle mt-1">Create and publish an offer to start earning</p>
              </>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
