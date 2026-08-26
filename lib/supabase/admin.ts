import { createClient } from "@supabase/supabase-js";

// Service-role client for trusted server contexts only (webhooks, checkout
// server actions). Bypasses RLS — never import this from client components.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. The server needs it to record orders " +
        "and connect payout accounts. Get it from Supabase → Project Settings → API " +
        "(Legacy tab → service_role) and add it to your environment. It must never " +
        "be prefixed with NEXT_PUBLIC_."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
