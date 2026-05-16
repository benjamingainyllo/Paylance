"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Calendar as CalendarIcon, MapPin, Users, MoreHorizontal, Search, Ticket, Zap, DollarSign, TrendingUp, ImagePlus, Globe, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { EventDetailView } from "@/components/dashboard/event-detail-view";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/use-currency";

export default function EventsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const { formatPrice } = useCurrency();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFree, setIsFree] = useState(false);
  
  // Form State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    price: "0",
    mapLink: ""
  });

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      let finalImageUrl = null;
      
      // Upload image if selected
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from("event_covers")
          .upload(filePath, photoFile);
          
        if (uploadError) throw new Error("Failed to upload image: " + uploadError.message);
        
        const { data: publicUrlData } = supabase.storage
          .from("event_covers")
          .getPublicUrl(filePath);
          
        finalImageUrl = publicUrlData.publicUrl;
      }
      
      // Insert Event into Database
      const eventPrice = isFree ? 0 : parseFloat(formData.price || "0");
      
      const { data, error } = await supabase
        .from("events")
        .insert({
          creator_id: user.id,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          map_link: formData.mapLink,
          price_naira: eventPrice,
          is_free: isFree,
          cover_image_url: finalImageUrl,
          status: "Upcoming",
          attendees_count: 0,
          revenue: 0
        })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setEvents([data, ...events]);
      
      // Reset form
      setShowCreateForm(false);
      setIsFree(false);
      setImagePreview(null);
      setPhotoFile(null);
      setFormData({ title: "", date: "", time: "", location: "", description: "", price: "0", mapLink: "" });
      toast.success("Event created successfully!");
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create event");
    } finally {
      setIsSaving(false);
    }
  };

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
        )) : null}

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
        <div className="fixed inset-0 z-50 flex bg-[#0c0c0e]">
          
          {/* Left Sidebar */}
          <div className="w-[300px] border-r border-zinc-800 bg-zinc-900/50 flex flex-col hidden lg:flex">
            <div className="p-6">
              <button 
                onClick={() => setShowCreateForm(false)}
                className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-400 mb-8 transition-colors"
              >
                <span className="text-xl leading-none">&lsaquo;</span> Back to events
              </button>

              {/* Event Preview Card */}
              <div className="rounded-xl border border-zinc-800 bg-[#0c0c0e] overflow-hidden shadow-lg mb-8">
                <div className="h-20 w-full bg-gradient-to-r from-orange-500 to-rose-500">
                  {imagePreview && <img src={imagePreview} className="w-full h-full object-cover mix-blend-overlay opacity-50" />}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-base truncate">{formData.title || "Untitled Event"}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                    <CalendarIcon className="h-3 w-3" />
                    {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 w-fit text-xs text-zinc-300">
                    Draft <span className="opacity-50">▾</span>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-2">Steps</p>
                <div className="flex items-start gap-3 rounded-lg bg-blue-500/10 px-3 py-2">
                  <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-[4px] border-blue-500 bg-[#0c0c0e]"></div>
                  <div>
                    <p className="text-sm font-semibold text-blue-500">Build event page</p>
                    <p className="text-xs text-zinc-500 mt-1">Add all of your event details and let attendees know what to expect</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-3 py-2 opacity-50">
                  <div className="mt-0.5 flex h-4 w-4 rounded-full border border-zinc-600"></div>
                  <p className="text-sm font-medium text-zinc-400">Add tickets</p>
                </div>
                <div className="flex items-start gap-3 px-3 py-2 opacity-50">
                  <div className="mt-0.5 flex h-4 w-4 rounded-full border border-zinc-600"></div>
                  <p className="text-sm font-medium text-zinc-400">Publish</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col h-full bg-[#0c0c0e] overflow-hidden relative">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="flex items-center justify-between border-b border-zinc-800 p-4 lg:hidden">
              <button onClick={() => setShowCreateForm(false)} className="text-sm text-zinc-400">&lsaquo; Back</button>
              <span className="text-sm font-bold text-white">Create Event</span>
              <div className="w-10"></div>
            </div>

            <form className="flex-1 overflow-y-auto pb-32" onSubmit={handleCreateEvent}>
              <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6">
                
                {/* Hero Image Upload */}
                <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 aspect-video group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                       <ImagePlus className="w-16 h-16 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-4 shadow-xl hover:bg-zinc-100 transition-colors"
                    >
                       <ImagePlus className="h-6 w-6 text-blue-600 mb-2" />
                       <span className="text-sm font-bold text-blue-600">Upload photo</span>
                    </button>
                  </div>
                  {/* Floating Action Button (Always visible on empty state) */}
                  {!imagePreview && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-4 shadow-xl hover:bg-zinc-100 transition-colors"
                      >
                         <ImagePlus className="h-6 w-6 text-blue-600 mb-2" />
                         <span className="text-sm font-bold text-blue-600">Upload photo</span>
                      </button>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                {/* Event Title Block */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event Title" 
                    className="w-full bg-transparent text-3xl font-bold text-white placeholder:text-zinc-600 focus:outline-none mb-2"
                  />
                  <p className="text-sm text-zinc-500">A short and sweet sentence about your event.</p>
                </div>

                {/* Date & Location Block */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                  <div className="grid sm:grid-cols-2 gap-8">
                    {/* Date and Time */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6">Date and time</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">Start Date & Time</label>
                          <div className="flex gap-2">
                            <input 
                              type="date" 
                              required
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                              className="flex-1 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 [color-scheme:dark]"
                            />
                            <input 
                              type="time" 
                              required
                              value={formData.time}
                              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                              className="w-28 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 [color-scheme:dark]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6">Location</h3>
                      <div className="flex gap-3">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                          <MapPin className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Enter a location" 
                            className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-zinc-500 focus:outline-none mb-1"
                          />
                          <input 
                            type="url" 
                            value={formData.mapLink}
                            onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                            placeholder="Virtual link (optional)" 
                            className="w-full bg-transparent text-xs text-blue-500 placeholder:text-blue-500/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overview Block */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    Use this section to provide more details about your event. You can include things to know, venue information, accessibility options—anything that will help people know what to expect.
                  </p>
                  <textarea 
                    rows={5}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add Description" 
                    className="w-full resize-none rounded-xl bg-zinc-800 p-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>

                {/* Pricing Block */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Ticketing</h3>
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-800/30">
                    <div>
                      <p className="text-sm font-semibold text-white">Event Price</p>
                      <p className="text-xs text-zinc-500 mt-1">Is this event free or paid?</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => { setIsFree(!isFree); if (!isFree) setFormData({ ...formData, price: "0" }); }}
                        className={`text-sm font-semibold px-3 py-1.5 rounded-lg border transition-colors ${isFree ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'}`}
                      >
                        {isFree ? 'Free Event' : 'Paid'}
                      </button>
                      {!isFree && (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₦</span>
                          <input 
                            type="number" 
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0"
                            className="w-32 rounded-lg border border-zinc-700 bg-zinc-900 py-1.5 pl-8 pr-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800 bg-[#0c0c0e] p-4 flex justify-end gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <button 
                  type="button"
                  disabled={isSaving}
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center min-w-[160px] rounded-lg bg-[#d94826] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#c13d1d] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save and continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
