"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, MapPin, Users, MoreHorizontal, Search, Ticket, Zap, CheckCircle2, DollarSign, TrendingUp } from "lucide-react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";

const mockEvents = [
  {
    id: 1,
    title: "Creator Meetup Lagos",
    date: "May 24, 2026",
    time: "10:00 AM",
    location: "Victoria Island, Lagos",
    attendees: 45,
    status: "Upcoming",
    price: 25,
    revenue: 1125,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    description: "Join fellow creators in Lagos for a day of networking, collaboration, and inspiration. We'll discuss content strategies and growth hacks for 2026."
  },
  {
    id: 2,
    title: "Digital Monetization Workshop",
    date: "June 12, 2026",
    time: "2:00 PM",
    location: "Virtual (Zoom)",
    attendees: 120,
    status: "Upcoming",
    price: 15,
    revenue: 1800,
    image: "https://images.unsplash.com/photo-1591115765373-520b7a21715b?w=800&auto=format&fit=crop&q=60",
    description: "Learn how to turn your audience into a sustainable business. We'll cover everything from digital products to subscription models."
  }
];

export default function EventsPage() {
  const [mounted, setMounted] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    price: "0"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
  const totalRevenue = events.reduce((sum, event) => sum + (event.revenue || 0), 0);
  const upcomingEvents = events.filter(e => e.status === "Upcoming").length;

  const eventMetrics = [
    {
      title: "Event Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "vs last 30 days +100%",
      icon: DollarSign,
      iconColor: "#22C55E",
      iconBgColor: "rgba(34, 197, 94, 0.1)"
    },
    {
      title: "Total RSVPs",
      value: totalAttendees.toString(),
      change: "vs last 30 days +100%",
      icon: Users,
      iconColor: "#3B82F6",
      iconBgColor: "rgba(59, 130, 246, 0.1)"
    },
    {
      title: "Avg. Ticket Price",
      value: events.length > 0 ? `$${Math.round(totalRevenue / totalAttendees)}` : "$0",
      change: "Across all events",
      icon: Ticket,
      iconColor: "#A855F7",
      iconBgColor: "rgba(168, 85, 247, 0.1)"
    },
    {
      title: "Upcoming",
      value: upcomingEvents.toString(),
      change: "Active registrations",
      icon: Zap,
      iconColor: "#F97316",
      iconBgColor: "rgba(249, 115, 22, 0.1)"
    }
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent = {
      id: events.length + 1,
      title: formData.title,
      date: new Date(formData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: formData.time,
      location: formData.location,
      attendees: 0,
      status: "Upcoming",
      price: parseFloat(formData.price),
      revenue: 0,
      image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=800&auto=format&fit=crop&q=60`,
      description: formData.description
    };

    setEvents([newEvent, ...events]);
    setShowCreateForm(false);
    setFormData({ title: "", date: "", time: "", location: "", description: "", price: "0" });
  };

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
            onClick={() => setShowCreateForm(true)}
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
              +24% growth
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
               <span className="text-xs font-bold text-text">78%</span>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-xs text-subtle">Average Attendance</span>
               <span className="text-xs font-bold text-text">82 creators</span>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-xs text-subtle">Top Channel</span>
               <span className="text-xs font-bold text-text">Instagram (45%)</span>
            </div>
            <div className="mt-8 pt-8 border-t border-border">
               <p className="text-xs font-medium text-text mb-4">Event Types</p>
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                       <span className="text-[11px] text-subtle">Workshops</span>
                    </div>
                    <span className="text-[11px] font-bold text-text">60%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                       <span className="text-[11px] text-subtle">Meetups</span>
                    </div>
                    <span className="text-[11px] font-bold text-text">30%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                       <span className="text-[11px] text-subtle">Virtual</span>
                    </div>
                    <span className="text-[11px] font-bold text-text">10%</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-zinc-700"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                {event.status}
              </div>
              <div className="absolute bottom-3 left-3 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                ${event.price} / ticket
              </div>
            </div>
            
            <div className="p-5">
              <h2 className="text-base font-bold text-text">{event.title}</h2>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-subtle">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {event.date} • {event.time}
                </div>
                <div className="flex items-center gap-2 text-xs text-subtle">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-subtle">
                  <Users className="h-3.5 w-3.5" />
                  {event.attendees} creators attending
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-xs font-medium text-text transition-colors hover:bg-muted"
                >
                  View Details
                </button>
                <div className="flex items-center gap-2">
                   <div className="text-right">
                      <p className="text-[10px] text-subtle uppercase">Revenue</p>
                      <p className="text-xs font-bold text-emerald-500">${event.revenue?.toLocaleString()}</p>
                   </div>
                   <button className="rounded-lg p-2 text-subtle hover:bg-muted hover:text-text">
                     <MoreHorizontal className="h-5 w-5" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Create Placeholder */}
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-transparent transition-all hover:border-zinc-700 hover:bg-muted/10"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-subtle">
            <Plus className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-text">Create New Event</p>
          <p className="mt-1 text-xs text-subtle text-center px-8">Host a meetup, workshop or virtual session for your audience.</p>
        </button>
      </div>

      {/* Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-surface shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="relative h-64 w-full">
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title} 
                className="h-full w-full object-cover"
              />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-colors"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>
              <div className="absolute top-4 left-4 rounded-full bg-blue-600 px-4 py-1.5 text-[11px] font-bold text-white shadow-lg">
                {selectedEvent.status}
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-text">{selectedEvent.title}</h2>
                  <p className="mt-1 text-sm text-blue-500 font-medium">${selectedEvent.price} per ticket</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-subtle">Total Revenue</p>
                   <p className="text-xl font-bold text-emerald-500">${selectedEvent.revenue?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-subtle">Date & Time</p>
                  <p className="text-sm font-medium text-text">{selectedEvent.date} • {selectedEvent.time}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-subtle">Location</p>
                  <p className="text-sm font-medium text-text">{selectedEvent.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-subtle">Attendees</p>
                  <p className="text-sm font-medium text-text">{selectedEvent.attendees} creators</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-subtle">About this event</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {selectedEvent.description || "No description provided for this event. Join us for an exciting session with fellow creators to learn, network, and grow together."}
                </p>
              </div>

              <div className="mt-10 flex gap-4">
                <button className="flex-1 rounded-xl bg-white py-4 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Edit Event
                </button>
                <button className="flex-1 rounded-xl border border-border bg-muted/50 py-4 text-sm font-bold text-text transition-colors hover:bg-muted">
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-surface p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-bold text-text">Create Event</h2>
            <p className="mt-1 text-sm text-subtle">Fill in the details for your upcoming event.</p>
            
            <form className="mt-8 space-y-5" onSubmit={handleCreateEvent}>
              <div className="space-y-2">
                <label className="text-xs font-medium text-subtle uppercase tracking-wider">Event Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Creator Workshop" 
                  className="h-11 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-text focus:border-white/20 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-medium text-subtle uppercase tracking-wider">Price ($)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="h-11 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-text focus:border-white/20 focus:outline-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-medium text-subtle uppercase tracking-wider">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="h-11 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-text focus:border-white/20 focus:outline-none [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-medium text-subtle uppercase tracking-wider">Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="h-11 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-text focus:border-white/20 focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-subtle uppercase tracking-wider">Location</label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Lagos, Nigeria or Zoom Link" 
                  className="h-11 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-text focus:border-white/20 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-subtle uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell your audience what the event is about..." 
                  className="w-full rounded-xl border border-zinc-800 bg-black p-4 text-sm text-text focus:border-white/20 focus:outline-none"
                />
              </div>

              <div className="mt-8 flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-transparent py-3 text-sm font-semibold text-text transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
