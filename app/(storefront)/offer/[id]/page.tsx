"use client";

import { useEffect, useState, useTransition } from "react";
import { getOfferById } from "@/app/actions/offers";
import { createCheckoutSession } from "@/app/actions/checkout";
import { formatKobo } from "@/lib/money";
import { Loader2 } from "lucide-react";

export default function OfferCheckoutPage({ params }: { params: { id: string } }) {
  const [offer, setOffer] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOffer() {
      try {
        const res = await getOfferById(params.id);
        if (active && res.success && res.offer) setOffer(res.offer);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOffer();
    return () => {
      active = false;
    };
  }, [params.id]);

  const priceKobo = Number(offer?.price_kobo ?? 0);

  const handleCheckout = () => {
    if (!email) {
      setCheckoutError("Please enter your email.");
      return;
    }
    setCheckoutError(null);

    startTransition(async () => {
      const res = await createCheckoutSession({
        itemType: "offer",
        itemId: offer.id,
        buyerEmail: email,
        buyerName: name || undefined,
      });

      if (res.success && res.authorizationUrl) {
        window.location.href = res.authorizationUrl;
      } else if (res.success && res.completedWithoutPayment) {
        window.location.href = `/checkout/success?reference=${res.reference}`;
      } else {
        setCheckoutError(res.error || "Checkout failed.");
      }
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0a0a0a] text-white">
        <p className="font-semibold">Offer not found</p>
        <p className="text-sm text-zinc-500">This offer may have been removed or unpublished.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">{offer.title}</h1>
            {offer.description && (
              <p className="mt-2 text-sm text-zinc-400">{offer.description}</p>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-800/40 p-4">
              <div className="flex justify-between text-sm font-medium text-zinc-300">
                <span>{offer.title}</span>
                <span>{formatKobo(priceKobo)}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-zinc-800 pt-4 text-base font-bold text-white">
                <span>Total</span>
                <span>{formatKobo(priceKobo)}</span>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-400">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chidi Okonkwo"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-400">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-blue-500"
                required
              />
            </div>

            {checkoutError && <p className="text-xs text-red-400">{checkoutError}</p>}

            <button
              onClick={handleCheckout}
              disabled={isPending}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-500 disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                </>
              ) : (
                `Pay ${formatKobo(priceKobo)}`
              )}
            </button>

            <p className="text-center text-xs text-zinc-500">
              No account needed. Card or bank transfer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
