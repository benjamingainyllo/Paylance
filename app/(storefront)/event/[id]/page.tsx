"use client";

import { useEffect, useState, useTransition } from "react";
import { getEventById } from "@/app/actions/events";
import { createCheckoutSession } from "@/app/actions/checkout";
import { Loader2, Calendar, MapPin, Users, ExternalLink, CheckCircle2 } from "lucide-react";

export default function EventCheckoutPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [rsvpComplete, setRsvpComplete] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      const res = await getEventById(params.id);
      if (res.success && res.event) {
        setEvent(res.event);
      }
      setLoading(false);
    }
    loadEvent();
  }, [params.id]);

  const handleCheckout = () => {
    if (!email) {
      setCheckoutError("Please enter your email.");
      return;
    }
    setCheckoutError(null);

    startTransition(async () => {
      const res = await createCheckoutSession({
        event_id: event.id,
        email,
        customer_name: name || undefined,
        amountInNaira: event.is_free ? 0 : Number(event.price_naira),
      });

      if (res.success && res.isFree) {
        setRsvpComplete(true);
      } else if (res.success && res.authorization_url) {
        window.location.href = res.authorization_url;
      } else {
        setCheckoutError(res.error || "Something went wrong.");
      }
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <p>Event not found.</p>
      </div>
    );
  }

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "Date TBD";

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6">
        <div className="overflow-hidden rounded-2xl border border-[#3a3a3a] bg-surface shadow-xl">
          <div className="relative h-40 w-full bg-muted">
            {event.cover_image_url ? (
              <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-subtle">
                <Calendar className="h-10 w-10 opacity-20" />
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white">{event.title}</h1>
              {event.description && <p className="mt-2 text-sm text-subtle">{event.description}</p>}
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-muted p-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-text">
                <Calendar className="h-4 w-4 text-subtle" />
                {formattedDate} {event.time ? `• ${event.time}` : ""}
              </div>
              <div className="flex items-center gap-2 text-sm text-text">
                <MapPin className="h-4 w-4 text-subtle" />
                <span className="truncate">{event.location || "Online"}</span>
                {event.map_link && (
                  <a href={event.map_link} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline shrink-0">
                    Map <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-text">
                <Users className="h-4 w-4 text-subtle" />
                {event.attendees_count || 0} attending
              </div>
            </div>

            {rsvpComplete ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                <p className="text-sm font-semibold text-white">You&apos;re in!</p>
                <p className="text-xs text-subtle">A confirmation has been sent to {email}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-subtle mb-1">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm text-white placeholder-subtle outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-subtle mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm text-white placeholder-subtle outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>

                {checkoutError && <p className="text-xs text-red-400">{checkoutError}</p>}

                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full flex justify-center items-center rounded-xl bg-primary py-4 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-70 transition-all shadow-lg shadow-primary/20"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...
                    </>
                  ) : event.is_free ? (
                    "RSVP — It's Free"
                  ) : (
                    `Pay ₦${Number(event.price_naira).toLocaleString()}`
                  )}
                </button>
                {!event.is_free && (
                  <p className="text-center text-xs text-subtle mt-4">Secured by Paystack 🔒</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
