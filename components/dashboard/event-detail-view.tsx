"use client";

import { useState } from "react";
import {
  ArrowLeft, CalendarIcon, MapPin, Users, Ticket, DollarSign,
  TrendingUp, BarChart3, Activity, Eye, Share2, Edit3, Clock,
  UserPlus, CreditCard, ChevronRight, ExternalLink, Zap, CheckCircle2
} from "lucide-react";
import { Calendar as CalendarLucide } from "lucide-react";
import {
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar, AreaChart, Area
} from "recharts";

// Mock analytics data per event
const ticketSalesData = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  tickets: Math.floor(Math.random() * 12) + (i > 7 ? 8 : 2),
  revenue: Math.floor(Math.random() * 500) + (i > 7 ? 300 : 50),
}));

const attendeeSourceData = [
  { source: "Instagram", count: 38, color: "#E1306C" },
  { source: "Twitter/X", count: 22, color: "#1DA1F2" },
  { source: "Direct Link", count: 18, color: "#A855F7" },
  { source: "WhatsApp", count: 14, color: "#25D366" },
  { source: "Other", count: 8, color: "#6B7280" },
];

const hourlyViewsData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  views: Math.floor(Math.random() * 30) + (i > 8 && i < 22 ? 15 : 2),
}));

const mockActivities = [
  { id: 1, type: "registration", user: "Chinedu Okafor", time: "2 min ago", detail: "Registered for the event", avatar: "CO", color: "bg-blue-500" },
  { id: 2, type: "payment", user: "Amina Bello", time: "8 min ago", detail: "Purchased 2 tickets", amount: "₦50", avatar: "AB", color: "bg-emerald-500" },
  { id: 3, type: "view", user: "Anonymous", time: "12 min ago", detail: "Viewed event page", avatar: "?", color: "bg-zinc-500" },
  { id: 4, type: "registration", user: "Tolu Adeyemi", time: "25 min ago", detail: "Registered for the event", avatar: "TA", color: "bg-blue-500" },
  { id: 5, type: "share", user: "Kemi Dosunmu", time: "34 min ago", detail: "Shared event on Instagram", avatar: "KD", color: "bg-pink-500" },
  { id: 6, type: "payment", user: "Emeka Nwosu", time: "1 hour ago", detail: "Purchased 1 ticket", amount: "₦25", avatar: "EN", color: "bg-emerald-500" },
  { id: 7, type: "view", user: "Anonymous", time: "1 hour ago", detail: "Viewed event page", avatar: "?", color: "bg-zinc-500" },
  { id: 8, type: "registration", user: "Fatima Yusuf", time: "2 hours ago", detail: "Registered for the event", avatar: "FY", color: "bg-blue-500" },
  { id: 9, type: "share", user: "David Okoro", time: "3 hours ago", detail: "Shared event via WhatsApp", avatar: "DO", color: "bg-green-500" },
  { id: 10, type: "payment", user: "Blessing Eze", time: "4 hours ago", detail: "Purchased 3 tickets", amount: "₦75", avatar: "BE", color: "bg-emerald-500" },
];

function getActivityIcon(type: string) {
  switch (type) {
    case "registration": return <UserPlus className="h-3.5 w-3.5" />;
    case "payment": return <CreditCard className="h-3.5 w-3.5" />;
    case "view": return <Eye className="h-3.5 w-3.5" />;
    case "share": return <Share2 className="h-3.5 w-3.5" />;
    default: return <Activity className="h-3.5 w-3.5" />;
  }
}

interface EventDetailViewProps {
  event: any;
  onBack: () => void;
}

export function EventDetailView({ event, onBack }: EventDetailViewProps) {
  const [tab, setTab] = useState<"overview" | "analytics" | "activity">("overview");

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: Eye },
    { key: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { key: "activity" as const, label: "Activity", icon: Activity },
  ];

  const totalSourceCount = attendeeSourceData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto">
      {/* Hero Banner */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden bg-zinc-900">
        {event.cover_image_url ? (
          <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-700">
            <CalendarLucide className="h-12 w-12 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="rounded-full bg-blue-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-lg">
            {event.status}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{event.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <CalendarLucide className="h-4 w-4" />
              {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Date TBD"} • {event.time || "TBA"}
            </span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location || "Online"}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{event.attendees_count || 0} attending</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 md:px-6 pb-12">
        {/* Tab Navigation */}
        <div className="sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 bg-black/80 backdrop-blur-xl border-b border-zinc-800/60 mb-6">
          <div className="flex items-center gap-1 py-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors border-b-2 ${
                  tab === t.key
                    ? "border-blue-500 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* ============ OVERVIEW TAB ============ */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Revenue", value: `₦${Number(event.revenue || 0).toLocaleString()}`, icon: DollarSign, accent: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Attendees", value: (event.attendees_count || 0).toString(), icon: Users, accent: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Ticket Price", value: event.is_free ? "FREE" : `₦${Number(event.price_naira || 0).toLocaleString()}`, icon: Ticket, accent: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "Page Views", value: "234", icon: Eye, accent: "text-orange-500", bg: "bg-orange-500/10" },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${m.bg} mb-3`}>
                    <m.icon className={`h-4 w-4 ${m.accent}`} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{m.label}</p>
                  <p className={`mt-1 text-xl font-bold ${m.accent}`}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* About + Details */}
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-white mb-4">About This Event</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {event.description || "No description provided. Join us for an exciting session with fellow creators."}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-zinc-800/40 p-4 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date & Time</p>
                    <p className="text-sm font-medium text-white">
                      {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Date TBD"}
                    </p>
                    <p className="text-xs text-zinc-400">{event.time || "TBA"}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-800/40 p-4 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Location</p>
                    <p className="text-sm font-medium text-white">{event.location || "Online"}</p>
                    {event.map_link && (
                      <a href={event.map_link} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline mt-1">
                        Open Map <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white">Quick Stats</h3>
                {[
                  { label: "Conversion Rate", value: "32%" },
                  { label: "Avg. Registration Time", value: "1.4 min" },
                  { label: "Repeat Attendees", value: "18%" },
                  { label: "Social Shares", value: "47" },
                  { label: "Refund Rate", value: "2%" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">{s.label}</span>
                    <span className="text-xs font-bold text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ ANALYTICS TAB ============ */}
        {tab === "analytics" && (
          <div className="space-y-6">
            {/* Ticket Sales Chart */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Ticket Sales</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Daily ticket purchases over the last 14 days</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" /> +42% vs prior
                </div>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ticketSalesData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ticketGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#3f3f46" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                    <YAxis stroke="#3f3f46" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
                    <Area type="monotone" dataKey="tickets" stroke="#3B82F6" strokeWidth={2} fill="url(#ticketGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Revenue Chart */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Revenue Trend</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketSalesData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="day" stroke="#3f3f46" tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
                      <YAxis stroke="#3f3f46" tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
                      <Bar dataKey="revenue" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Attendee Sources */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-white mb-5">Attendee Sources</h3>
                <div className="space-y-4">
                  {attendeeSourceData.map((s) => (
                    <div key={s.source}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-zinc-400">{s.source}</span>
                        <span className="text-xs font-bold text-white">{s.count} ({Math.round(s.count / totalSourceCount * 100)}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(s.count / totalSourceCount) * 100}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Page Views Chart */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Event Page Views</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Hourly traffic to your event page (today)</p>
                </div>
                <span className="text-xs font-bold text-white">234 total views</span>
              </div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyViewsData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="hour" stroke="#3f3f46" tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} interval={3} />
                    <YAxis stroke="#3f3f46" tick={{ fontSize: 9, fill: "#71717a" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 12, fontSize: 12 }} labelStyle={{ color: "#fff" }} itemStyle={{ color: "#fff" }} />
                    <Line type="monotone" dataKey="views" stroke="#F97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ============ ACTIVITY TAB ============ */}
        {tab === "activity" && (
          <div className="space-y-6">
            {/* Live indicator */}
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-4">
              <div className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs font-medium text-zinc-300">Live Activity Feed — Showing real-time registrations, purchases & interactions</p>
            </div>

            {/* Activity List */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <div className="divide-y divide-zinc-800/50">
                {mockActivities.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/20 transition-colors">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${a.color} text-white text-xs font-bold`}>
                      {a.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{a.user}</p>
                        <span className="shrink-0 text-zinc-600">{getActivityIcon(a.type)}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{a.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {a.amount && <p className="text-xs font-bold text-emerald-400">{a.amount}</p>}
                      <p className="text-[10px] text-zinc-600">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Registrations Today", value: "12", accent: "text-blue-400" },
                { label: "Tickets Sold Today", value: "8", accent: "text-emerald-400" },
                { label: "Page Views Today", value: "67", accent: "text-orange-400" },
                { label: "Shares Today", value: "5", accent: "text-pink-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
                  <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
