"use server";

import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculatePlatformFeeKobo, type Kobo, type PlatformFeeType } from "@/lib/money";
import { getPaymentProvider } from "@/lib/payments";
import { markOrderFailed, settleOrder } from "@/lib/orders";

interface CheckoutPayload {
  itemType: "offer" | "event";
  itemId: string;
  buyerEmail: string;
  buyerName?: string;
  buyerPhone?: string;
}

interface CheckoutResult {
  success: boolean;
  error?: string;
  authorizationUrl?: string | null;
  reference?: string | null;
  /** Free items complete instantly — there is no provider round-trip. */
  completedWithoutPayment?: boolean;
}

function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const host = headers().get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

/**
 * Starts a checkout.
 *
 * Paylance never receives the buyer's money. For paid items the provider
 * splits at transaction time using the creator's subaccount, so the
 * creator's share settles to their own bank and we only ever receive the
 * platform fee. A paid checkout without an active payout account is
 * refused here rather than falling back to a platform-custody charge.
 */
export async function createCheckoutSession(payload: CheckoutPayload): Promise<CheckoutResult> {
  try {
    if (!payload.itemId || !payload.itemType) {
      return { success: false, error: "Nothing to check out." };
    }
    if (!payload.buyerEmail) {
      return { success: false, error: "Please enter your email." };
    }

    const admin = createAdminClient();
    const item = await loadSellableItem(payload.itemType, payload.itemId);

    if (!item) {
      return { success: false, error: "This item is no longer available." };
    }
    if (item.publishStatus !== "published") {
      return { success: false, error: "This item isn't on sale yet." };
    }
    if (item.soldOut) {
      return { success: false, error: "This event is sold out." };
    }

    const reference = uuidv4();
    const grossKobo: Kobo = item.priceKobo;

    // ---- Free item: record the order, no money moves. ----
    if (grossKobo === 0) {
      const { data: order, error: insertError } = await admin
        .from("orders")
        .insert({
          reference,
          creator_id: item.creatorId,
          item_type: payload.itemType,
          offer_id: payload.itemType === "offer" ? item.id : null,
          event_id: payload.itemType === "event" ? item.id : null,
          item_title: item.title,
          quantity: 1,
          gross_kobo: 0,
          platform_fee_kobo: 0,
          provider_fee_kobo: 0,
          net_kobo: 0,
          status: "pending",
          buyer_email: payload.buyerEmail,
          buyer_name: payload.buyerName ?? null,
          buyer_phone: payload.buyerPhone ?? null,
        })
        .select()
        .single();

      if (insertError || !order) {
        console.error("Free registration failed:", insertError);
        return { success: false, error: "Could not complete your registration." };
      }

      const settled = await settleOrder({ reference, channel: "unknown" });
      if (!settled.ok) {
        return { success: false, error: "Could not complete your registration." };
      }

      return { success: true, reference, completedWithoutPayment: true, authorizationUrl: null };
    }

    // ---- Paid item: requires a connected bank account. ----
    const { data: payoutAccount } = await admin
      .from("payout_accounts")
      .select("provider_subaccount_id, status, platform_fee_type, platform_fee_value")
      .eq("creator_id", item.creatorId)
      .maybeSingle();

    if (
      !payoutAccount ||
      payoutAccount.status !== "active" ||
      !payoutAccount.provider_subaccount_id
    ) {
      // Deliberately not falling back to a non-split charge: that would put
      // the money in Paylance's account, which we must never do.
      return {
        success: false,
        error: "This creator hasn't finished setting up payments yet.",
      };
    }

    const platformFeeKobo = calculatePlatformFeeKobo(
      grossKobo,
      (payoutAccount.platform_fee_type ?? "percentage") as PlatformFeeType,
      payoutAccount.platform_fee_value ?? 900
    );

    const { error: insertError } = await admin.from("orders").insert({
      reference,
      creator_id: item.creatorId,
      item_type: payload.itemType,
      offer_id: payload.itemType === "offer" ? item.id : null,
      event_id: payload.itemType === "event" ? item.id : null,
      item_title: item.title,
      quantity: 1,
      gross_kobo: grossKobo,
      platform_fee_kobo: platformFeeKobo,
      provider_fee_kobo: 0,
      net_kobo: grossKobo - platformFeeKobo,
      status: "pending",
      buyer_email: payload.buyerEmail,
      buyer_name: payload.buyerName ?? null,
      buyer_phone: payload.buyerPhone ?? null,
    });

    if (insertError) {
      console.error("Order creation failed:", insertError);
      return { success: false, error: "Could not start checkout." };
    }

    const provider = getPaymentProvider();

    try {
      const { authorizationUrl } = await provider.initializeCheckout({
        reference,
        buyerEmail: payload.buyerEmail,
        amountKobo: grossKobo,
        platformFeeKobo,
        providerSubaccountId: payoutAccount.provider_subaccount_id,
        callbackUrl: `${siteOrigin()}/checkout/success?reference=${reference}`,
        metadata: {
          item_type: payload.itemType,
          item_id: item.id,
          creator_id: item.creatorId,
        },
      });

      return { success: true, authorizationUrl, reference };
    } catch (providerError) {
      await markOrderFailed(reference, "failed");
      console.error("Provider init failed:", providerError);
      return { success: false, error: "Could not start payment. Please try again." };
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return { success: false, error: "Something went wrong starting checkout." };
  }
}

/**
 * Fallback verification for the return page, in case the webhook is late.
 * Always re-checks with the provider — never trusts the redirect alone.
 */
export async function verifyCheckout(reference: string) {
  try {
    const admin = createAdminClient();

    const { data: order } = await admin
      .from("orders")
      .select("reference, status, item_title, gross_kobo")
      .eq("reference", reference)
      .maybeSingle();

    if (!order) return { success: false as const, error: "Order not found." };
    if (order.status === "paid") {
      return { success: true as const, status: "paid" as const, order };
    }
    // A free order settles inline, so anything still pending here is a payment.
    if (Number(order.gross_kobo) === 0) {
      return { success: true as const, status: order.status, order };
    }

    const verified = await getPaymentProvider().verifyTransaction(reference);

    if (verified.status === "paid") {
      const settled = await settleOrder({
        reference,
        providerReference: verified.providerReference,
        providerFeeKobo: verified.providerFeeKobo,
        channel: verified.channel,
        paidAt: verified.paidAt,
      });
      if (!settled.ok) return { success: false as const, error: settled.error };
      return { success: true as const, status: "paid" as const, order: { ...order, status: "paid" } };
    }

    if (verified.status === "failed" || verified.status === "abandoned") {
      await markOrderFailed(reference, verified.status);
    }

    return { success: true as const, status: verified.status, order };
  } catch (error) {
    console.error("Verify checkout error:", error);
    return { success: false as const, error: "Could not verify payment status." };
  }
}

interface SellableItem {
  id: string;
  creatorId: string;
  title: string;
  priceKobo: Kobo;
  publishStatus: string;
  soldOut: boolean;
}

async function loadSellableItem(
  itemType: "offer" | "event",
  itemId: string
): Promise<SellableItem | null> {
  const admin = createAdminClient();

  if (itemType === "event") {
    const { data } = await admin
      .from("events")
      .select("id, creator_id, title, price_kobo, publish_status, capacity, attendees_count")
      .eq("id", itemId)
      .maybeSingle();

    if (!data) return null;

    return {
      id: data.id,
      creatorId: data.creator_id,
      title: data.title,
      priceKobo: Number(data.price_kobo ?? 0),
      publishStatus: data.publish_status,
      soldOut:
        data.capacity !== null &&
        data.capacity !== undefined &&
        Number(data.attendees_count ?? 0) >= Number(data.capacity),
    };
  }

  const { data } = await admin
    .from("offers")
    .select("id, user_id, title, price_kobo, publish_status")
    .eq("id", itemId)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    creatorId: data.user_id,
    title: data.title,
    priceKobo: Number(data.price_kobo ?? 0),
    publishStatus: data.publish_status,
    soldOut: false,
  };
}
