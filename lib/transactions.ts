import { createAdminClient } from "@/lib/supabase/admin";

// Flips a pending transaction to success exactly once, and — if it's an
// event ticket — bumps the event's attendee/revenue counters. Safe to call
// from multiple places (webhook + return-page verification) concurrently:
// the guarded update only ever "wins" for one caller.
export async function markTransactionSuccessful(reference: string) {
  const admin = createAdminClient();

  const { data: txn, error } = await admin
    .from("transactions")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (error) return { success: false as const, error: error.message };
  if (!txn) return { success: false as const, error: "Transaction not found" };
  if (txn.status === "success") return { success: true as const, transaction: txn, alreadyProcessed: true };

  const { data: updated, error: updateError } = await admin
    .from("transactions")
    .update({ status: "success" })
    .eq("id", txn.id)
    .eq("status", "pending")
    .select()
    .maybeSingle();

  if (updateError) return { success: false as const, error: updateError.message };

  if (!updated) {
    // Another caller already made this transition — don't double-count.
    return { success: true as const, transaction: txn, alreadyProcessed: true };
  }

  if (updated.event_id) {
    await admin.rpc("increment_event_stats", {
      p_event_id: updated.event_id,
      p_attendees: updated.ticket_quantity || 1,
      p_revenue: updated.amount,
    });
  }

  return { success: true as const, transaction: updated };
}
