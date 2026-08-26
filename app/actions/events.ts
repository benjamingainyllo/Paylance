"use server";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Public event lookup for the guest-facing page.
 *
 * Returns the host alongside the event: a guest is deciding whether to trust
 * a person with money, so the page can't render without knowing who that is.
 */
export async function getEventById(id: string) {
  const admin = createAdminClient();

  const { data: event, error } = await admin
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("publish_status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error fetching event:", error);
    return { success: false as const, error: error.message, event: null, host: null };
  }

  if (!event) {
    return { success: false as const, error: "Event not found", event: null, host: null };
  }

  const { data: host } = await admin
    .from("profiles")
    .select("handle, first_name, last_name, avatar_url")
    .eq("id", event.creator_id)
    .maybeSingle();

  return { success: true as const, event, host: host ?? null };
}
