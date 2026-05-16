"use client";

import { useEffect, useState, useTransition } from "react";
import { getOfferById } from "@/app/actions/offers";
import { createCheckoutSession } from "@/app/actions/checkout";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [offer, setOffer] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [includeBump, setIncludeBump] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadOffer() {
      const res = await getOfferById(params.id);
      if (res.success && res.offer) {
        setOffer(res.offer);
      }
      setLoading(false);
    }
    loadOffer();
  }, [params.id]);

  const handleCheckout = () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    startTransition(async () => {
      // Calculate total amount (base + order bump if selected)
      const bumpAmount = 15000; // Hardcoded bump price for MVP
      const totalAmount = offer.price_naira + (includeBump ? bumpAmount : 0);

      const res = await createCheckoutSession({
        offer_id: offer.id,
        email,
        amountInNaira: totalAmount,
      });

      if (res.success && res.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = res.authorization_url;
      } else {
        alert("Checkout failed: " + res.error);
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

  if (!offer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <p>Offer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-8">
        <div className="rounded-2xl border border-[#3a3a3a] bg-surface p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">{offer.title}</h1>
            <p className="mt-2 text-sm text-subtle">{offer.description}</p>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-muted p-4 border border-border">
              <div className="flex justify-between text-sm text-text font-medium mb-2">
                <span>Item</span>
                <span>Price</span>
              </div>
              <div className="flex justify-between text-sm text-subtle pb-4 border-b border-border">
                <span>{offer.title}</span>
                <span>₦{offer.price_naira.toLocaleString()}</span>
              </div>

              {/* MVP Order Bump */}
              <div className="py-4 border-b border-border">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeBump}
                    onChange={(e) => setIncludeBump(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border bg-black text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="block text-sm font-medium text-white group-hover:text-primary transition-colors">
                      Yes, add the VIP Strategy Session
                    </span>
                    <span className="block text-xs text-subtle mt-1">
                      One-time offer to get a 30-minute 1-on-1 strategy call. (+₦15,000)
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-4">
                <span>Total</span>
                <span>
                  ₦{(offer.price_naira + (includeBump ? 15000 : 0)).toLocaleString()}
                </span>
              </div>
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

            <button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full flex justify-center items-center rounded-xl bg-primary py-4 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-70 transition-all shadow-lg shadow-primary/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...
                </>
              ) : (
                `Pay ₦${(offer.price_naira + (includeBump ? 15000 : 0)).toLocaleString()}`
              )}
            </button>
            <p className="text-center text-xs text-subtle mt-4">
              Secured by Paystack 🔒
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
