import { TopFilters } from "@/components/dashboard/top-filters";
import { Search, Filter, Download, MoreHorizontal, UserCheck, Users, Crown, ArrowUpRight } from "lucide-react";

const metrics = [
  {
    title: "Total contacts",
    value: "12,405",
    change: "+14.2%",
    icon: Users,
    color: "from-blue-600 to-indigo-600",
  },
  {
    title: "Qualified leads",
    value: "3,892",
    change: "+5.1%",
    icon: UserCheck,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Repeat buyers",
    value: "1,240",
    change: "+22.4%",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
  },
];

const audience = [
  {
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    avatar: "SJ",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    offer: "Brand Design Masterclass",
    stage: "VIP",
    value: "₦450.00",
    date: "Just now",
    status: "online",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "mchen99@example.com",
    avatar: "MC",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    offer: "UI/UX Starter Kit",
    stage: "Customer",
    value: "₦49.00",
    date: "2 hours ago",
    status: "offline",
  },
  {
    id: 3,
    name: "Aisha Mohammed",
    email: "aisha.creates@example.com",
    avatar: "AM",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    offer: "Newsletter Subscription",
    stage: "Lead",
    value: "₦0.00",
    date: "5 hours ago",
    status: "online",
  },
  {
    id: 4,
    name: "David Smith",
    email: "d.smith.design@example.com",
    avatar: "DS",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    offer: "1-on-1 Consultation",
    stage: "VIP",
    value: "₦1,200.00",
    date: "Yesterday",
    status: "offline",
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    email: "elena.rod@example.com",
    avatar: "ER",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    offer: "Figma Templates Bundle",
    stage: "Customer",
    value: "₦89.00",
    date: "Yesterday",
    status: "online",
  },
];

const stageColors = {
  VIP: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Customer: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Lead: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
};

export default function AudiencePage() {
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
                    <span className="flex items-center text-xs font-medium text-emerald-500">
                      <ArrowUpRight className="mr-0.5 h-3 w-3" />
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${metric.color} shadow-inner`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 w-full bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100 blur-sm mix-blend-overlay"></div>
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
                className="h-9 w-[200px] rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text placeholder:text-subtle focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button className="flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-muted">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </button>
            <button className="flex h-9 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-muted">
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text">
            <thead className="bg-muted/50 text-xs uppercase text-subtle border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Recent Offer</th>
                <th className="px-6 py-4 font-semibold">Stage</th>
                <th className="px-6 py-4 font-semibold">Value</th>
                <th className="px-6 py-4 font-semibold">Last Active</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {audience.map((person) => (
                <tr key={person.id} className="group transition-colors hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${person.color}`}>
                          {person.avatar}
                        </div>
                        {person.status === 'online' && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-emerald-500"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{person.name}</div>
                        <div className="text-xs text-subtle">{person.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{person.offer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stageColors[person.stage as keyof typeof stageColors]}`}>
                      {person.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {person.value}
                  </td>
                  <td className="px-6 py-4 text-subtle">
                    {person.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-md p-2 text-subtle opacity-0 transition-opacity hover:bg-surface group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-border bg-muted/30 p-4 text-center">
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View all 12,405 contacts
          </button>
        </div>
      </div>
    </section>
  );
}
