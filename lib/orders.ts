import { createAdminClient } from "@/lib/supabase/admin";
import type { Kobo } from "@/lib/money";
import type { PaymentChannel } from "@/lib/payments";

/**
 * Settling an order — the one place a pending order becomes paid.
 *
 * Called from the webhook and from the checkout return page. Both can fire
 * for the same order, so this must be safe to run concurrently and more
 * than once: the guarded UPDATE only ever succeeds for a single caller.
 */
export interface SettleOrderInput {
  reference: string;
  providerReference?: string | null;
  providerFeeKobo?: Kobo | null;
  channel?: PaymentChannel | null;
  paidAt?: string | null;
}

export async function settleOrder(input: SettleOrderInput) {
  const admin = createAdminClient();

  const { data: order, error } = await admin
    .from("orders")
    .select("*")
    .eq("reference", input.reference)
    .maybeSingle();

  if (error) return { ok: false as const, error: error.message };
  if (!order) return { ok: false as const, error: "Order not found" };
  if (order.status === "paid") {
    return { ok: true as const, order, alreadySettled: true };
  }

  const providerFeeKobo = input.providerFeeKobo ?? order.provider_fee_kobo ?? 0;
  const netKobo = Math.max(
    0,
    Number(order.gross_kobo) - Number(order.platform_fee_kobo) - Number(providerFeeKobo)
  );

  // Guarded on status so a concurrent settle can't double-apply.
  const { data: updated, error: updateError } = await admin
    .from("orders")
    .update({
      status: "paid",
      provider_reference: input.providerReference ?? order.provider_reference,
      provider_fee_kobo: providerFeeKobo,
      net_kobo: netKobo,
      payment_channel: input.channel ?? order.payment_channel,
      paid_at: input.paidAt ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("status", "pending")
    .select()
    .maybeSingle();

  if (updateError) return { ok: false as const, error: updateError.message };

  if (!updated) {
    // Someone else won the race. Not an error, and not something to count twice.
    return { ok: true as const, order, alreadySettled: true };
  }

  if (updated.event_id) {
    await admin.rpc("increment_event_attendees", {
      p_event_id: updated.event_id,
      p_attendees: updated.quantity ?? 1,
    });
  }

  await upsertAudienceMember(updated);

  return { ok: true as const, order: updated };
}

export async function markOrderFailed(reference: string, status: "failed" | "abandoned") {
  const admin = createAdminClient();
  await admin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("reference", reference)
    .eq("status", "pending");
}

/** A buyer becomes an audience contact the moment they actually pay. */
async function upsertAudienceMember(order: any) {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data: existing } = await admin
    .from("audience")
    .select("id, total_spent_kobo, purchase_count")
    .eq("creator_id", order.creator_id)
    .eq("email", order.buyer_email)
    .maybeSingle();

  if (existing) {
    await admin
      .from("audience")
      .update({
        total_spent_kobo: Number(existing.total_spent_kobo ?? 0) + Number(order.gross_kobo),
        purchase_count: Number(existing.purchase_count ?? 0) + 1,
        last_offer: order.item_title ?? null,
        stage: "buyer",
        last_seen: now,
      })
      .eq("id", existing.id);
    return;
  }

  await admin.from("audience").insert({
    creator_id: order.creator_id,
    email: order.buyer_email,
    name: order.buyer_name ?? null,
    stage: "buyer",
    total_spent_kobo: Number(order.gross_kobo),
    purchase_count: 1,
    last_offer: order.item_title ?? null,
    first_seen: now,
    last_seen: now,
  });
}
