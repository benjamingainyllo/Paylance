"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { completeDemoCheckout, getDemoOrder } from "@/app/actions/checkout";
import { formatKobo } from "@/lib/money";
import { Loader2, CreditCard, TriangleAlert } from "lucide-react";

/**
 * Stand-in for the payment provider's hosted checkout page.
 *
 * Only reachable while no real gateway is configured. It exists so the full
 * buy → pay → order → revenue flow can be walked through end to end during
 * development.
 */
export default function DemoCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      }
    >
      <DemoCheckoutContent />
    </Suspense>
  );
}

function DemoCheckoutContent() {
  const reference = useSearchParams().get("reference");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!reference) {
      setError("Missing payment reference.");
      setLoading(false);
      return;
    }

    let active = true;
    getDemoOrder(reference)
      .then((res) => {
        if (!active) return;
        if (res.success) setOrder(res.order);
        else setError(res.error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reference]);

  const finish = (outcome: "paid" | "failed") => {
    startTransition(async () => {
      const res = await completeDemoCheckout(reference as string, outcome);
      if (!res.success) {
        setError(res.error);
        return;
      }
      window.location.href = `/checkout/success?reference=${reference}`;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0a0a0a] px-4 text-center text-white">
        <p className="font-semibold">Can&apos;t open this checkout</p>
        <p className="text-sm text-zinc-500">{error ?? "Order not found."}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Unmissable: nothing here is real. */}
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-amber-400">Simulated checkout</p>
            <p className="mt-0.5 text-xs text-amber-200/70">
              No payment gateway is connected, so no money moves. This screen stands in for
              the real payment page so the rest of the flow can be tested.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 shadow-xl">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <CreditCard className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{order.item_title || "Your order"}</p>
              <p className="text-xs text-zinc-500">{order.buyer_email}</p>
            </div>
          </div>

          <div className="flex items-baseline justify-between py-6">
            <span className="text-sm text-zinc-400">Amount due</span>
            <span className="text-3xl font-bold text-white">
              {formatKobo(Number(order.gross_kobo))}
            </span>
          </div>

          {order.status !== "pending" ? (
            <p className="rounded-lg border border-zinc-800 bg-zinc-800/40 px-4 py-3 text-center text-sm text-zinc-400">
              This order is already marked <strong className="text-white">{order.status}</strong>.
            </p>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => finish("paid")}
                disabled={isPending}
                className="flex w-full items-center justify-center rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Simulate successful payment"}
              </button>
              <button
                onClick={() => finish("failed")}
                disabled={isPending}
                className="flex w-full items-center justify-center rounded-xl border border-zinc-700 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 disabled:opacity-60"
              >
                Simulate a failed payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
