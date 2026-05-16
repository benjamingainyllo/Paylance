"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createOffer(data: {
  title: string;
  description: string;
  price_naira: number;
  is_published: boolean;
}) {
  const { data: offer, error } = await supabase
    .from("offers")
    .insert([{ ...data }])
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
  const { data: offers, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching offers:", error);
    return { success: false, error: error.message, offers: [] };
  }

  return { success: true, offers };
}

export async function getOfferById(id: string) {
  const { data: offer, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching offer:", error);
    return { success: false, error: error.message, offer: null };
  }

  return { success: true, offer };
}
