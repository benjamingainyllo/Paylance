// Legacy compatibility — re-exports the browser client
// New code should import from @/lib/supabase/client or @/lib/supabase/server
import { createClient } from "@/lib/supabase/client";

export const supabase = createClient();
