"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, MapPin, Users, MoreHorizontal, Search, Ticket, Zap, DollarSign, TrendingUp } from "lucide-react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { EventDetailView } from "@/components/dashboard/event-detail-view";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/use-currency";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } else {
      setEvents(data || []);
    }
  };

  if (!mounted) return null;


  const filteredEvents = events.filter(event => 
    event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAttendees = events.reduce((sum, event) => sum + (event.attendees_count || 0), 0);
  const totalRevenue = events.reduce((sum, event) => sum + (Number(event.revenue) || 0), 0);
  const upcomingEventsCount = events.filter(e => e.status === "Upcoming").length;

  const eventMetrics = [
    {
      title: "Event Revenue",
      value: formatPrice(totalRevenue),
      change: events.length > 0 ? "Total lifetime" : "No revenue yet",
      icon: DollarSign,
      iconColor: "#22C55E",
      iconBgColor: "rgba(34, 197, 94, 0.1)"
    },
    {
      title: "Total RSVPs",
      value: totalAttendees.toString(),
      change: events.length > 0 ? "All events" : "No RSVPs yet",
      icon: Users,
      iconColor: "#3B82F6",
      iconBgColor: "rgba(59, 130, 246, 0.1)"
    },
    {
      title: "Avg. Ticket Price",
      value: totalAttendees > 0 ? formatPrice(Math.round(totalRevenue / totalAttendees)) : formatPrice(0),
      change: "Across all events",
      icon: Ticket,
      iconColor: "#A855F7",
      iconBgColor: "rgba(168, 85, 247, 0.1)"
    },
    {
      title: "Upcoming",
      value: upcomingEventsCount.toString(),
      change: "Active registrations",
      icon: Zap,
      iconColor: "#F97316",
      iconBgColor: "rgba(249, 115, 22, 0.1)"
    }
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-text">Events</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex items-center">
             <Search className="absolute left-3 h-4 w-4 text-subtle" />
             <input 
               type="text" 
               placeholder="Search events..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="h-9 w-full sm:w-64 rounded-lg border border-border bg-muted/50 pl-9 pr-4 text-xs text-text focus:border-white/20 focus:outline-none"
             />
          </div>
          <button 
            onClick={() => router.push('/events/create')}
            className="flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>
      </div>

      <TopFilters />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {eventMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text">Event Revenue Analysis</h3>
              <p className="text-xs text-subtle mt-1">Ticket sales growth over time</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs font-medium text-text">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              Tracking
            </div>
          </div>
          <div className="h-[300px]">
             <PerformanceChart />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-sm font-semibold text-text">Quick Stats</h3>
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
               <span className="text-xs text-subtle">RSVP Rate</span>
               <span className="text-xs font-bold text-text">0%</span>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-xs text-subtle">Average Attendance</span>
               <span className="text-xs font-bold text-text">0 creators</span>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-xs text-subtle">Top Channel</span>
               <span className="text-xs font-bold text-text">N/A</span>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
               <p className="text-xs font-medium text-text mb-4">Event Types</p>
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                       <span className="text-[11px] text-subtle">Workshops</span>
                    </div>
                    <span className="text-[11px] font-bold text-text">0%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                       <span className="text-[11px] text-subtle">Meetups</span>
                    </div>
                    <span className="text-[11px] font-bold text-text">0%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                       <span className="text-[11px] text-subtle">Virtual</span>
                    </div>
                    <span className="text-[11px] font-bold text-text">0%</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {events.length > 0 ? filteredEvents.map((event) => (
          <div 
            key={event.id} 
            onClick={() => setSelectedEvent(event)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20"
          >
            <div className="relative h-40 w-full overflow-hidden bg-muted">
              {event.cover_image_url ? (
                <img 
                  src={event.cover_image_url} 
                  alt={event.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-subtle">
                  <CalendarIcon className="h-8 w-8 opacity-20" />
                </div>
              )}
              <div className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                {event.status}
              </div>
              <div className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-lg ${event.is_free ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                {event.is_free ? 'FREE' : `${formatPrice(Number(event.price_naira))} / ticket`}
              </div>
            </div>
            
            <div className="p-5">
              <h2 className="text-base font-bold text-text">{event.title}</h2>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-subtle">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'} • {event.time || 'TBA'}
                </div>
                <div className="flex items-center gap-2 text-xs text-subtle">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{event.location || 'Online'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-subtle">
                  <Users className="h-3.5 w-3.5" />
                  {event.attendees_count || 0} attending
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-xs font-medium text-text transition-colors group-hover:bg-muted">
                  View Details
                </span>
                <div className="flex items-center gap-2">
                   <div className="text-right">
                      <p className="text-[10px] text-subtle uppercase">Revenue</p>
                      <p className="text-xs font-bold text-emerald-500">{formatPrice(Number(event.revenue || 0))}</p>
                   </div>
                   <button onClick={(e) => { e.stopPropagation(); }} className="rounded-lg p-2 text-subtle hover:bg-muted hover:text-text">
                     <MoreHorizontal className="h-5 w-5" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        )) : null}        {/* Create Placeholder */}
        <button 
          onClick={() => router.push('/events/create')}
          className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-transparent transition-all hover:border-zinc-700 hover:bg-muted/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-subtle">
            <Plus className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-text">Create New Event</p>
          <p className="mt-1 text-xs text-subtle text-center px-8">Host a meetup, workshop or virtual session for your audience.</p>
        </button>
      </div>

      {/* Event Detail View */}
      {selectedEvent && (
        <EventDetailView event={selectedEvent} onBack={() => setSelectedEvent(null)} />
      )}
    </section>
  );
}
