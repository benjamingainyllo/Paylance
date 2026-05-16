"use client";

import { useEffect, useState } from "react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { Search, Filter, Download, MoreHorizontal, UserCheck, Users, Crown, ArrowUpRight, UsersRound } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { useCurrency } from "@/hooks/use-currency";

interface AudienceMember {
  id: string;
  email: string;
  name: string | null;
  stage: string;
  total_spent: number;
  purchase_count: number;
  last_offer: string | null;
  first_seen: string;
  last_seen: string;
}

const stageColors: Record<string, string> = {
  vip: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  customer: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  lead: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
};

export default function AudiencePage() {
  const { user } = useAuth();
  const supabase = createClient();
  const { formatPrice } = useCurrency();

  const [audience, setAudience] = useState<AudienceMember[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalVips, setTotalVips] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchAudience = async () => {
      const { data, count } = await supabase
        .from("audience")
        .select("*", { count: "exact" })
        .eq("creator_id", user.id)
        .order("last_seen", { ascending: false });

      if (data) {
        setAudience(data as AudienceMember[]);
        setTotalContacts(count || 0);
        setTotalCustomers(data.filter((a: any) => a.stage === "customer").length);
        setTotalVips(data.filter((a: any) => a.stage === "vip").length);
      }
    };

    fetchAudience();
  }, [user]);

  const filteredAudience = audience.filter(
    (a) =>
      !searchQuery ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const metrics = [
    {
      title: "Total contacts",
      value: String(totalContacts),
      icon: Users,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Customers",
      value: String(totalCustomers),
      icon: UserCheck,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "VIP buyers",
      value: String(totalVips),
      icon: Crown,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (str: string) => {
    const colors = [
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    ];
    const index = str.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-text">Audience</h1>
        <TopFilters />
      </div>
      
      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-subtle">{metric.title}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold tracking-tight text-text">{metric.value}</p>
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${metric.color} shadow-inner`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CRM Section */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between bg-muted/30">
          <div>
            <h2 className="text-lg font-bold text-text">Audience CRM</h2>
            <p className="text-sm text-subtle">Manage your contacts, leads, and paying customers.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-[200px] rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text placeholder:text-subtle focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {filteredAudience.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text">
              <thead className="bg-muted/50 text-xs uppercase text-subtle border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Contact</th>
                  <th className="px-6 py-4 font-semibold">Last Offer</th>
                  <th className="px-6 py-4 font-semibold">Stage</th>
                  <th className="px-6 py-4 font-semibold">Total Spent</th>
                  <th className="px-6 py-4 font-semibold">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAudience.map((person) => (
                  <tr key={person.id} className="group transition-colors hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${getAvatarColor(person.email)}`}>
                          {getInitials(person.name, person.email)}
                        </div>
                        <div>
                          <div className="font-semibold">{person.name || "Unknown"}</div>
                          <div className="text-xs text-subtle">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{person.last_offer || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stageColors[person.stage] || stageColors.lead}`}>
                        {person.stage.charAt(0).toUpperCase() + person.stage.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {formatPrice(Number(person.total_spent))}
                    </td>
                    <td className="px-6 py-4 text-subtle">
                      {timeAgo(person.last_seen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <UsersRound className="h-14 w-14 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-text">No audience yet</h3>
            <p className="mt-1 text-xs text-subtle max-w-xs mx-auto">
              When people buy your offers or subscribe, they&apos;ll appear here automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
