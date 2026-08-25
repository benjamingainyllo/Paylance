"use server";

import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculatePlatformFee, initializePaystackTransaction, verifyPaystackTransaction } from "@/lib/paystack";
import { markTransactionSuccessful } from "@/lib/transactions";

interface CheckoutPayload {
  offer_id?: string;
  event_id?: string;
  email: string;
  amountInNaira: number;
  customer_name?: string;
}

function getSiteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const headerList = headers();
  const host = headerList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function createCheckoutSession(payload: CheckoutPayload) {
  try {
    if (!payload.offer_id && !payload.event_id) {
      return { success: false, error: "Nothing to check out.", authorization_url: null, reference: null };
    }
    if (!payload.email) {
      return { success: false, error: "Please enter your email.", authorization_url: null, reference: null };
    }

    const admin = createAdminClient();

    // Resolve who gets credited for this sale.
    let creatorId: string | null = null;
    if (payload.offer_id) {
      const { data: offer } = await admin
        .from("offers")
        .select("user_id")
        .eq("id", payload.offer_id)
        .single();
      creatorId = offer?.user_id ?? null;
    } else if (payload.event_id) {
      const { data: event } = await admin
        .from("events")
        .select("creator_id")
        .eq("id", payload.event_id)
        .single();
      creatorId = event?.creator_id ?? null;
    }

    if (!creatorId) {
      return { success: false, error: "Could not find that item.", authorization_url: null, reference: null };
    }

    const reference = uuidv4();

    // Free event: register immediately, no Paystack round-trip needed.
    if (payload.event_id && payload.amountInNaira <= 0) {
      const { error: insertError } = await admin.from("transactions").insert({
        event_id: payload.event_id,
        creator_id: creatorId,
        customer_email: payload.email,
        customer_name: payload.customer_name ?? null,
        amount: 0,
        platform_fee: 0,
        ticket_quantity: 1,
        status: "success",
        reference,
      });

      if (insertError) {
        console.error("Error creating RSVP:", insertError);
        return { success: false, error: "Could not complete your RSVP.", authorization_url: null, reference: null };
      }

      await admin.rpc("increment_event_stats", {
        p_event_id: payload.event_id,
        p_attendees: 1,
        p_revenue: 0,
      });

      return { success: true, authorization_url: null, reference, isFree: true };
    }

    const { error: insertError } = await admin.from("transactions").insert({
      offer_id: payload.offer_id ?? null,
      event_id: payload.event_id ?? null,
      creator_id: creatorId,
      customer_email: payload.email,
      customer_name: payload.customer_name ?? null,
      amount: payload.amountInNaira,
      platform_fee: calculatePlatformFee(payload.amountInNaira),
      ticket_quantity: 1,
      status: "pending",
      reference,
    });

    if (insertError) {
      console.error("Error creating transaction:", insertError);
      return { success: false, error: "Could not start checkout.", authorization_url: null, reference: null };
    }

    const callbackUrl = `${getSiteOrigin()}/checkout/success?reference=${reference}`;

    const paystackRes = await initializePaystackTransaction({
      email: payload.email,
      amountInNaira: payload.amountInNaira,
      reference,
      callbackUrl,
      metadata: {
        offer_id: payload.offer_id ?? null,
        event_id: payload.event_id ?? null,
      },
    });

    if (!paystackRes?.status || !paystackRes?.data?.authorization_url) {
      return { success: false, error: paystackRes?.message || "Could not initialize payment.", authorization_url: null, reference };
    }

    return { success: true, authorization_url: paystackRes.data.authorization_url, reference };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: "Payments aren't configured yet. Please try again later.",
      authorization_url: null,
      reference: null,
    };
  }
}

// Called from the /checkout/success return page as a fallback in case the
// webhook hasn't landed yet — actively verifies with Paystack instead of
// just trusting the redirect.
export async function verifyCheckout(reference: string) {
  try {
    const admin = createAdminClient();

    const { data: txn, error } = await admin
      .from("transactions")
      .select("*, offers(title), events(title)")
      .eq("reference", reference)
      .maybeSingle();

    if (error || !txn) {
      return { success: false, error: "Transaction not found." };
    }

    if (txn.status === "success") {
      return { success: true, status: "success", transaction: txn };
    }

    const verification = await verifyPaystackTransaction(reference);

    if (verification?.data?.status === "success") {
      const result = await markTransactionSuccessful(reference);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      return { success: true, status: "success", transaction: { ...txn, status: "success" } };
    }

    return { success: true, status: verification?.data?.status ?? "pending", transaction: txn };
  } catch (error) {
    console.error("Verify checkout error:", error);
    return { success: false, error: "Could not verify payment status." };
  }
}
