"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Kobo } from "@/lib/money";

export async function createOffer(data: {
  title: string;
  description: string;
  price_kobo: Kobo;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You need to be signed in." };
  }

  // Always created as a draft — publishing is a separate, gated action.
  const { data: offer, error } = await supabase
    .from("offers")
    .insert([
      {
        user_id: user.id,
        title: data.title,
        description: data.description,
        price_kobo: data.price_kobo,
        publish_status: "draft",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating offer:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/offers");
  return { success: true, offer };
}

export async function getOffers() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not signed in", offers: [] };

  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching offers:", error);
    return { success: false, error: error.message, offers: [] };
  }

  return { success: true, offers: offers ?? [] };
}

/** Public lookup for the buyer-facing checkout page. Published offers only. */
export async function getOfferById(id: string) {
  const admin = createAdminClient();

  const { data: offer, error } = await admin
    .from("offers")
    .select("*")
    .eq("id", id)
    .eq("publish_status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error fetching offer:", error);
    return { success: false, error: error.message, offer: null };
  }

  if (!offer) return { success: false, error: "Offer not found", offer: null };

  return { success: true, offer };
}
