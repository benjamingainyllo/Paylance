"use server";

import { supabase } from "@/lib/supabase";

export async function getEventById(id: string) {
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return { success: false, error: error.message, event: null };
  }

  return { success: true, event };
}
