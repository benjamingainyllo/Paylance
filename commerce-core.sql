-- ============================================================
-- Paylance — Commerce Core
-- Run this in the Supabase SQL Editor AFTER supabase-schema.sql.
--
-- Establishes the shared rail that Offers and Events both sit on:
--   payout_accounts · orders · settlements · webhook_events
--
-- Ground rules encoded here:
--   * Money is integer kobo (bigint), never naira, never numeric.
--   * No column is named after a payment processor.
--   * Nothing sellable is publishable without an active payout account.
--   * Paylance never holds funds — there is deliberately no balance,
--     no wallet and no withdrawal table anywhere in this schema.
-- ============================================================


-- ------------------------------------------------------------
-- 1. PAYOUT ACCOUNTS
--    The creator's bank connection and their provider subaccount.
--    This is what makes split payments possible, which is what
--    keeps the platform out of the money path.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payout_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  provider TEXT NOT NULL DEFAULT 'paystack',
  provider_subaccount_id TEXT,

  bank_code TEXT,
  bank_name TEXT,
  account_name TEXT,
  -- Only the last 4 digits are retained; the full number lives with the
  -- payment provider, not with us.
  account_number_last4 TEXT,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'disabled')),

  -- Fee model is per creator so it can change without a migration.
  --   percentage -> basis points (900 = 9.00%)
  --   flat       -> kobo
  platform_fee_type TEXT NOT NULL DEFAULT 'percentage'
    CHECK (platform_fee_type IN ('percentage', 'flat')),
  platform_fee_value INTEGER NOT NULL DEFAULT 900,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payout_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creators read own payout account" ON public.payout_accounts;
CREATE POLICY "Creators read own payout account" ON public.payout_accounts
  FOR SELECT USING (auth.uid() = creator_id);

-- Writes go through the server (service role) so the provider subaccount and
-- fee configuration can never be set from the browser.


-- ------------------------------------------------------------
-- 2. PUBLISH STATES on the sellable item types
--    `status` on events already means lifecycle (Upcoming/Past), so
--    publish state is a separate column rather than overloading it.
-- ------------------------------------------------------------
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS publish_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (publish_status IN ('draft', 'published', 'archived'));

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS publish_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (publish_status IN ('draft', 'published', 'archived'));

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Capacity is an event-specific concern; NULL means unlimited.
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS capacity INTEGER;

-- Money on items, in kobo. The old naira columns are left in place for now
-- so nothing breaks mid-migration; they are backfilled below and should be
-- dropped once no code reads them.
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS price_kobo BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS price_kobo BIGINT NOT NULL DEFAULT 0;

UPDATE public.events
  SET price_kobo = ROUND(COALESCE(price_naira, 0) * 100)
  WHERE price_kobo = 0 AND COALESCE(price_naira, 0) <> 0;

UPDATE public.offers
  SET price_kobo = ROUND(COALESCE(price_naira, 0) * 100)
  WHERE price_kobo = 0 AND COALESCE(price_naira, 0) <> 0;

-- Anything that already existed was visible publicly, so keep it visible.
UPDATE public.events SET publish_status = 'published' WHERE published_at IS NULL AND publish_status = 'draft';
UPDATE public.offers SET publish_status = 'published' WHERE is_published = true AND publish_status = 'draft';


-- Public may only read PUBLISHED items. Creators always see their own.
DROP POLICY IF EXISTS "Public can view events" ON public.events;
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (publish_status = 'published' OR auth.uid() = creator_id);

DROP POLICY IF EXISTS "Public can view published offers" ON public.offers;
CREATE POLICY "Public can view published offers" ON public.offers
  FOR SELECT USING (publish_status = 'published' OR auth.uid() = user_id);


-- Audience spend follows the same kobo rule as everything else.
ALTER TABLE public.audience
  ADD COLUMN IF NOT EXISTS total_spent_kobo BIGINT NOT NULL DEFAULT 0;

UPDATE public.audience
  SET total_spent_kobo = ROUND(COALESCE(total_spent, 0) * 100)
  WHERE total_spent_kobo = 0 AND COALESCE(total_spent, 0) <> 0;


-- ------------------------------------------------------------
-- 3. ORDERS
--    One ledger for every sale, across Offers and Events alike.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Our reference, generated before the provider is ever contacted.
  reference TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'paystack',
  provider_reference TEXT,

  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  item_type TEXT NOT NULL CHECK (item_type IN ('offer', 'event')),
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  item_title TEXT,               -- snapshotted so history survives edits
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),

  -- All money in kobo. gross = what the buyer paid.
  -- net = what settles to the creator = gross - platform_fee - provider_fee.
  gross_kobo BIGINT NOT NULL CHECK (gross_kobo >= 0),
  platform_fee_kobo BIGINT NOT NULL DEFAULT 0 CHECK (platform_fee_kobo >= 0),
  provider_fee_kobo BIGINT NOT NULL DEFAULT 0 CHECK (provider_fee_kobo >= 0),
  net_kobo BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'abandoned', 'refunded')),
  -- How the buyer funded it (card, transfer, OPay-style virtual account).
  -- A funding channel is NOT a payment provider.
  payment_channel TEXT,

  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  buyer_phone TEXT,

  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT orders_item_present CHECK (
    (item_type = 'offer' AND offer_id IS NOT NULL) OR
    (item_type = 'event' AND event_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS orders_creator_idx ON public.orders(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_event_idx ON public.orders(event_id);
CREATE INDEX IF NOT EXISTS orders_offer_idx ON public.orders(offer_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creators read own orders" ON public.orders;
CREATE POLICY "Creators read own orders" ON public.orders
  FOR SELECT USING (auth.uid() = creator_id);

-- Orders are only ever written server-side, after a verified provider event.


-- ------------------------------------------------------------
-- 4. SETTLEMENTS
--    Read-only record of money landing in the creator's own bank.
--    Reporting only — the platform never moves this money.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  provider TEXT NOT NULL DEFAULT 'paystack',
  provider_settlement_id TEXT,

  amount_kobo BIGINT NOT NULL CHECK (amount_kobo >= 0),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failed', 'reversed')),

  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (provider, provider_settlement_id)
);

CREATE INDEX IF NOT EXISTS settlements_creator_idx
  ON public.settlements(creator_id, settled_at DESC);

ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creators read own settlements" ON public.settlements;
CREATE POLICY "Creators read own settlements" ON public.settlements
  FOR SELECT USING (auth.uid() = creator_id);


-- ------------------------------------------------------------
-- 5. WEBHOOK EVENTS
--    Every inbound provider event, stored for idempotency and audit.
--    The unique constraint is what stops a replayed event from being
--    counted twice.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'paystack',
  provider_event_id TEXT,
  event_type TEXT NOT NULL,
  reference TEXT,
  payload JSONB NOT NULL,
  signature_valid BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (provider, provider_event_id)
);

CREATE INDEX IF NOT EXISTS webhook_events_reference_idx ON public.webhook_events(reference);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
-- No policies: service role only. Nothing in the browser reads this.


-- ------------------------------------------------------------
-- 6. PUBLISH GATE (server-side, not just a disabled button)
--    A paid item cannot become 'published' unless its creator has an
--    active payout account. Free items are allowed through so a creator
--    can run a free event before connecting a bank.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_publish_gate()
RETURNS TRIGGER AS $$
DECLARE
  owner_id UUID;
  item_price BIGINT;
  has_active_account BOOLEAN;
BEGIN
  IF NEW.publish_status <> 'published' THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'events' THEN
    owner_id := NEW.creator_id;
  ELSE
    owner_id := NEW.user_id;
  END IF;

  item_price := COALESCE(NEW.price_kobo, 0);

  IF item_price = 0 THEN
    RETURN NEW;  -- free items need no bank account
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.payout_accounts
    WHERE creator_id = owner_id
      AND status = 'active'
      AND provider_subaccount_id IS NOT NULL
  ) INTO has_active_account;

  IF NOT has_active_account THEN
    RAISE EXCEPTION 'Connect a bank account before publishing a paid item'
      USING ERRCODE = 'check_violation';
  END IF;

  NEW.published_at := COALESCE(NEW.published_at, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS events_publish_gate ON public.events;
CREATE TRIGGER events_publish_gate
  BEFORE INSERT OR UPDATE OF publish_status, price_kobo ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.enforce_publish_gate();

DROP TRIGGER IF EXISTS offers_publish_gate ON public.offers;
CREATE TRIGGER offers_publish_gate
  BEFORE INSERT OR UPDATE OF publish_status, price_kobo ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.enforce_publish_gate();


-- ------------------------------------------------------------
-- 7. Event counters
--    attendees_count is a denormalised convenience, not a balance.
--    Revenue is always derived from `orders`, never stored on the event.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_event_attendees(
  p_event_id UUID,
  p_attendees INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE public.events
  SET attendees_count = COALESCE(attendees_count, 0) + p_attendees,
      updated_at = now()
  WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Superseded: revenue is derived from orders now, not accumulated on the row.
DROP FUNCTION IF EXISTS public.increment_event_stats(UUID, INTEGER, NUMERIC);
