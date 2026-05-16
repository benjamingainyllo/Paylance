"use client";

import { CircleDollarSign, Eye, Heart, Plus, Wallet } from "lucide-react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { RevenueDonutChart } from "@/components/dashboard/revenue-donut-chart";
import { TrafficSource } from "@/components/dashboard/traffic-source";
import { TopLocations } from "@/components/dashboard/top-locations";
import { TopProducts } from "@/components/dashboard/top-products";
import { RecentActivities } from "@/components/dashboard/recent-activities";

const metrics = [
  {
    title: "Total Revenue",
    value: "₦100",
    change: "vs last 7 days: 100%",
    icon: CircleDollarSign,
    iconColor: "#22C55E",
    iconBgColor: "rgba(34, 197, 94, 0.1)",
  },
  {
    title: "Store visits",
    value: "6",
    change: "vs last 7 days: 100%",
    icon: Eye,
    iconColor: "#F97316",
    iconBgColor: "rgba(249, 115, 22, 0.1)",
  },
  {
    title: "Leads/Sales",
    value: "1",
    change: "vs last 7 days: 100%",
    icon: Heart,
    iconColor: "#A855F7",
    iconBgColor: "rgba(168, 85, 247, 0.1)",
  },
  {
    title: "Products Created",
    value: "0",
    change: "vs last 7 days: 0%",
    icon: Plus,
    iconColor: "#3B82F6",
    iconBgColor: "rgba(59, 130, 246, 0.1)",
  }
];

export default function RevenuePage() {
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
          <RevenueDonutChart />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <TrafficSource />
        <TopLocations />
        <TopProducts />
      </div>

      <RecentActivities />
    </section>
  );
}
