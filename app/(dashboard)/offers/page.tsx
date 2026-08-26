"use client";

import { useState, useTransition, useEffect } from "react";
import { TopFilters } from "@/components/dashboard/top-filters";
import { createOffer, getOffers } from "@/app/actions/offers";
import { publishItem, unpublishItem } from "@/app/actions/publish";
import { formatKobo, parseNairaInput } from "@/lib/money";
import { toast } from "sonner";
import { Loader2, Globe, Lock } from "lucide-react";

export default function OffersPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await getOffers();
        if (res.success) setOffers(res.offers || []);
      } finally {
        setLoadingOffers(false);
      }
    }
    loadOffers();
  }, []);

  const priceKobo = parseNairaInput(priceInput || "0");

  const handleCreateOffer = () => {
    if (!title.trim()) {
      toast.error("Give your offer a title.");
      return;
    }
    if (priceKobo === null) {
      toast.error("Enter a valid price.");
      return;
    }

    startTransition(async () => {
      // Created as a draft — publishing is a separate, gated step.
      const res = await createOffer({ title, description, price_kobo: priceKobo });

      if (res.success && res.offer) {
        setOffers([res.offer, ...offers]);
        setTitle("");
        setDescription("");
        setPriceInput("");
        toast.success("Offer saved as a draft.");
      } else {
        toast.error(res.error || "Could not create the offer.");
      }
    });
  };

  const handleTogglePublish = async (offer: any) => {
    const isLive = offer.publish_status === "published";
    const res = isLive
      ? await unpublishItem("offer", offer.id)
      : await publishItem("offer", offer.id);

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    setOffers((prev) =>
      prev.map((o) =>
        o.id === offer.id ? { ...o, publish_status: isLive ? "draft" : "published" } : o
      )
    );
    toast.success(isLive ? "Offer unpublished." : "Offer is live.");
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
                type="text"
                inputMode="decimal"
                value={priceInput}
                placeholder="0"
                onChange={(event) => setPriceInput(event.target.value)}
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
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save draft"}
            </button>
          </div>

          {offers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-text mb-3">Your Offers</h3>
              <div className="grid gap-2">
                {offers.map((o) => {
                  const isLive = o.publish_status === "published";
                  return (
                    <div key={o.id} className="flex justify-between items-center bg-muted p-3 rounded-lg border border-border">
                      <div className="min-w-0">
                        <p className="text-sm text-text font-medium truncate">{o.title}</p>
                        <p className="text-xs text-subtle flex items-center gap-1.5">
                          {formatKobo(Number(o.price_kobo ?? 0))}
                          <span className="text-subtle/50">·</span>
                          {isLive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-500">
                              <Globe className="h-3 w-3" /> Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Draft
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {isLive && (
                          <a href={`/offer/${o.id}`} target="_blank" className="text-xs text-subtle underline">
                            View
                          </a>
                        )}
                        <button
                          onClick={() => handleTogglePublish(o)}
                          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text"
                        >
                          {isLive ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                <div className="mt-4 font-bold text-white">{formatKobo(priceKobo ?? 0)}</div>
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
