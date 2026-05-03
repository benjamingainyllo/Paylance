"use client";

import { useMemo, useState } from "react";
import { TopFilters } from "@/components/dashboard/top-filters";

export default function OffersPage() {
  const [name, setName] = useState("Benjamin Gainyllo Joel");
  const [handle, setHandle] = useState("benjtech");
  const [headline, setHeadline] = useState("Design systems that convert followers into premium clients.");
  const [offer, setOffer] = useState("Brand Design Masterclass - $49");

  const profileUrl = useMemo(() => `hub.africa/${handle}`, [handle]);

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
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
            />
            <input
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
            />
            <textarea
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              rows={3}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
            />
            <input
              value={offer}
              onChange={(event) => setOffer(event.target.value)}
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-text outline-none"
            />
            <button className="rounded-lg bg-primary py-2 text-sm font-medium text-white">+ Add New Offer</button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#3a3a3a] bg-gradient-to-b from-[#2b477f] to-[#0f172a] p-4">
          <div className="rounded-[1.5rem] bg-black/30 p-6 text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-[#d9d9d9]" />
            <h2 className="font-semibold text-white">{name}</h2>
            <p className="text-xs text-[#f3f4f6]">@{handle}</p>
            <p className="mt-3 text-[11px] text-white/80">{headline}</p>
            <div className="mt-5 rounded-lg border border-white/20 p-3 text-xs text-white">{offer}</div>
            <button className="mt-4 rounded-full border border-white/40 px-4 py-2 text-xs text-white">
              Buy now
            </button>
            <p className="mt-6 text-[10px] text-white/70">{profileUrl}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
