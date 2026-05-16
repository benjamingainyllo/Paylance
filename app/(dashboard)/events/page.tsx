"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, MapPin, Users, MoreHorizontal, Search, Ticket, Zap, DollarSign, TrendingUp, ImagePlus, Globe, ToggleLeft, ToggleRight } from "lucide-react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { EventDetailView } from "@/components/dashboard/event-detail-view";

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
  const [detailTab, setDetailTab] = useState<"overview" | "analytics" | "activity">("overview");
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    price: "0",
    mapLink: ""
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
      value: `₦${totalRevenue.toLocaleString()}`,
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
      value: events.length > 0 ? `₦${Math.round(totalRevenue / totalAttendees)}` : "₦0",
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
      mapLink: formData.mapLink,
      attendees: 0,
      status: "Upcoming",
      price: isFree ? 0 : parseFloat(formData.price),
      revenue: 0,
      image: imagePreview || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
      description: formData.description
    };

    setEvents([newEvent, ...events]);
    setShowCreateForm(false);
    setIsFree(false);
    setImagePreview(null);
    setFormData({ title: "", date: "", time: "", location: "", description: "", price: "0", mapLink: "" });
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
            onClick={() => setSelectedEvent(event)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20"
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
              <div className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-lg ${event.price === 0 ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                {event.price === 0 ? 'FREE' : `₦${event.price.toLocaleString()} / ticket`}
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
                <span className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-xs font-medium text-text transition-colors group-hover:bg-muted">
                  View Details
                </span>
                <div className="flex items-center gap-2">
                   <div className="text-right">
                      <p className="text-[10px] text-subtle uppercase">Revenue</p>
                      <p className="text-xs font-bold text-emerald-500">₦{event.revenue?.toLocaleString()}</p>
                   </div>
                   <button onClick={(e) => { e.stopPropagation(); }} className="rounded-lg p-2 text-subtle hover:bg-muted hover:text-text">
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

      {/* Event Detail View */}
      {selectedEvent && (
        <EventDetailView event={selectedEvent} onBack={() => setSelectedEvent(null)} />
      )}

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowCreateForm(false)}>
          <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-transparent px-8 pt-8 pb-6">
              <button 
                onClick={() => setShowCreateForm(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4 rotate-45" />
              </button>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Create New Event</h2>
              <p className="mt-1 text-sm text-white/60">Set up your next meetup, workshop, or virtual session.</p>
            </div>
            
            <form className="p-8 space-y-5 max-h-[60vh] overflow-y-auto" onSubmit={handleCreateEvent}>
              {/* Cover Image Upload */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <ImagePlus className="h-3 w-3" /> Cover Image
                </label>
                <div
                  onDrop={handleImageDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/30 transition-colors hover:border-blue-500/40 hover:bg-zinc-900/60 cursor-pointer overflow-hidden"
                  style={{ minHeight: imagePreview ? '160px' : '120px' }}
                  onClick={() => document.getElementById('event-image-input')?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white font-medium">Click to change</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-8 w-8 text-zinc-600 mb-2" />
                      <p className="text-xs text-zinc-500">Drag & drop or <span className="text-blue-400">browse</span></p>
                      <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input
                    id="event-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Event Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <Zap className="h-3 w-3" /> Event Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Creator Workshop Lagos" 
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Free / Paid Toggle + Price + Date + Time */}
              <div>
                <button
                  type="button"
                  onClick={() => { setIsFree(!isFree); if (!isFree) setFormData({ ...formData, price: "0" }); }}
                  className={`mb-4 flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    isFree
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {isFree ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  {isFree ? 'Free Event' : 'Paid Event'}
                </button>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                      <Ticket className="h-3 w-3" /> Price (₦)
                    </label>
                    <input 
                      type="number" 
                      required
                      disabled={isFree}
                      value={isFree ? '0' : formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      className={`h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all ${isFree ? 'opacity-40 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                      <CalendarIcon className="h-3 w-3" /> Date
                    </label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                      <CalendarIcon className="h-3 w-3" /> Time
                    </label>
                    <input 
                      type="time" 
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <MapPin className="h-3 w-3" /> Location
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Victoria Island, Lagos or Zoom link" 
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Map Link */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <Globe className="h-3 w-3" /> Map / Venue Link <span className="text-zinc-600 font-normal">(optional)</span>
                </label>
                <input 
                  type="url" 
                  value={formData.mapLink}
                  onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                  placeholder="https://maps.google.com/..." 
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                  <Search className="h-3 w-3" /> Description
                </label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell your audience what the event is about..." 
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-transparent py-3.5 text-sm font-semibold text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  🚀 Launch Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
