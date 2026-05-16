"use client";

import { useState, useTransition, useEffect } from "react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { createOffer, getOffers } from "@/app/actions/offers";
import { Loader2 } from "lucide-react";

export default function OffersPage() {
  const [title, setTitle] = useState("Brand Design Masterclass");
  const [description, setDescription] = useState("Design systems that convert followers into premium clients.");
  const [priceNaira, setPriceNaira] = useState(49000);
  const [isPending, startTransition] = useTransition();
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    async function loadOffers() {
      const res = await getOffers();
      if (res.success) {
        setOffers(res.offers || []);
      }
    }
    loadOffers();
  }, []);

  const handleCreateOffer = () => {
    startTransition(async () => {
      const res = await createOffer({
        title,
        description,
        price_naira: priceNaira,
        is_published: true,
      });

      if (res.success && res.offer) {
        setOffers([res.offer, ...offers]);
        alert("Offer created successfully!");
      } else {
        alert("Error creating offer: " + res.error);
      }
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-text">Offers</h1>
        <TopFilters />
      </div>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <button className="rounded-lg bg-primary px-4 py-2 text-xs text-white">Offer Builder</button>
            <button className="rounded-lg bg-muted px-4 py-2 text-xs text-subtle">Checkout Settings</button>
          </div>

          <div className="grid gap-3">
            <div>
              <label className="text-xs text-subtle mb-1 block">Offer Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-subtle mb-1 block">Price (₦)</label>
              <input
                type="number"
                value={priceNaira}
                onChange={(event) => setPriceNaira(Number(event.target.value))}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-subtle mb-1 block">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
              />
            </div>
            
            <button 
              onClick={handleCreateOffer}
              disabled={isPending}
              className="mt-2 flex items-center justify-center rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "+ Save Offer"}
            </button>
          </div>

          {offers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-text mb-3">Your Offers</h3>
              <div className="grid gap-2">
                {offers.map(o => (
                  <div key={o.id} className="flex justify-between items-center bg-muted p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm text-text font-medium">{o.title}</p>
                      <p className="text-xs text-subtle">₦{o.price_naira.toLocaleString()}</p>
                    </div>
                    <a href={`/offer/${o.id}`} target="_blank" className="text-xs text-primary underline">View Checkout</a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-[#3a3a3a] bg-gradient-to-b from-[#2b477f] to-[#0f172a] p-4">
          <div className="rounded-[1.5rem] bg-black/30 p-6 text-center flex flex-col h-full justify-between">
            <div>
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-[#d9d9d9]" />
              <h2 className="font-semibold text-white">Your Name</h2>
              <p className="text-xs text-[#f3f4f6]">@yourhandle</p>
              
              <div className="mt-8 bg-white/5 rounded-xl border border-white/10 p-4 text-left">
                <h3 className="text-white font-medium text-sm">{title || "Offer Title"}</h3>
                <p className="mt-2 text-[11px] text-white/70">{description || "Offer description goes here..."}</p>
                <div className="mt-4 font-bold text-white">₦{priceNaira.toLocaleString()}</div>
              </div>
            </div>
            
            <button className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-white">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
