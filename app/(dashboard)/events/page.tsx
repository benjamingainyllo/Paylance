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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowCreateForm(false)}>
          <div className="flex w-full max-w-5xl h-[85vh] rounded-3xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* Left Column: Cover Image & Theme */}
            <div className="relative hidden w-[400px] flex-col border-r border-zinc-800 bg-zinc-900/30 p-8 md:flex">
              <button 
                onClick={() => setShowCreateForm(false)}
                className="absolute top-6 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4 rotate-45" />
              </button>

              <div className="mt-12 flex-1 space-y-6">
                <div 
                  onDrop={handleImageDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-800/50 transition-all hover:border-blue-500/50"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="text-xs font-medium text-white">Change Image</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center text-zinc-500">
                      <ImagePlus className="mb-3 h-8 w-8 text-zinc-600" />
                      <p className="text-sm font-medium">Add Event Cover</p>
                      <p className="mt-1 text-xs text-zinc-600">Drag & drop or click</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-transform hover:scale-110">
                    <ImagePlus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                  <div>
                    <p className="text-[10px] uppercase text-zinc-500">Theme</p>
                    <p className="text-sm font-semibold text-white">Minimal Dark</p>
                  </div>
                  <button className="rounded-lg bg-zinc-800 p-2 text-zinc-400 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Event Details Form */}
            <form className="flex flex-1 flex-col overflow-y-auto p-8 md:p-10" onSubmit={handleCreateEvent}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-800">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Personal Calendar
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-800">
                  <Globe className="h-3.5 w-3.5" />
                  Public
                </div>
              </div>

              {/* Huge Event Name Input */}
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Event Name" 
                className="w-full bg-transparent text-4xl sm:text-5xl font-serif text-white placeholder:text-zinc-700 focus:outline-none mb-10"
              />

              {/* Start & End Date/Time Block */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
                <div className="flex-1 space-y-4 relative">
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-xs font-medium text-zinc-500">Start</div>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="flex-1 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 [color-scheme:dark]"
                    />
                    <input 
                      type="time" 
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-28 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 [color-scheme:dark]"
                    />
                  </div>
                  
                  <div className="absolute left-8 top-8 bottom-4 w-px bg-zinc-800"></div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 text-xs font-medium text-zinc-500">End</div>
                    <input 
                      type="date" 
                      className="flex-1 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 [color-scheme:dark]"
                    />
                    <input 
                      type="time" 
                      className="w-28 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 [color-scheme:dark]"
                    />
                  </div>
                </div>
                
                <div className="hidden sm:block w-px bg-zinc-800"></div>
                
                <div className="flex flex-col justify-center sm:pl-4">
                  <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <Globe className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">GMT+01:00</span>
                  </div>
                  <p className="text-xs text-zinc-500 pl-5">Lagos</p>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
                <MapPin className="h-5 w-5 text-zinc-500" />
                <div className="flex-1">
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Add Event Location" 
                    className="w-full bg-transparent text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-zinc-600">Offline location or virtual link</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10 flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
                <Search className="h-5 w-5 text-zinc-500 mt-0.5" />
                <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add Description" 
                  className="w-full resize-none bg-transparent text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              {/* Event Options */}
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Event Options</h3>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 divide-y divide-zinc-800 mb-8">
                
                {/* Ticket Price */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <Ticket className="h-4 w-4 text-zinc-500" /> Ticket Price
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsFree(!isFree); if (!isFree) setFormData({ ...formData, price: "0" }); }}
                      className={`text-xs font-semibold ${isFree ? 'text-emerald-400' : 'text-zinc-500'}`}
                    >
                      {isFree ? 'Free' : 'Paid'}
                    </button>
                    {!isFree && (
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0"
                        className="w-20 rounded-md bg-zinc-800 px-2 py-1 text-right text-sm text-white focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                {/* Require Approval */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <Users className="h-4 w-4 text-zinc-500" /> Require Approval
                  </div>
                  <button type="button" className="relative h-6 w-10 rounded-full bg-blue-600 transition-colors">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                  </button>
                </div>

                {/* Capacity */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <Users className="h-4 w-4 text-zinc-500" /> Capacity
                  </div>
                  <div className="text-sm text-zinc-500">Unlimited</div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center rounded-xl bg-[#c2415d] py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#a9364f] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
