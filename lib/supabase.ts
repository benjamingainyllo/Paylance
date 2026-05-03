import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep bootstrapping safe before env configuration is added.
  console.warn("Supabase environment variables are not set yet.");
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
