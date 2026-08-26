-- ============================================================
-- Paylance — complete database setup
--
-- This is the ONLY SQL file you need. Run the whole thing in the
-- Supabase SQL Editor.
--
-- Safe to run as many times as you like: everything is written to
-- create what's missing and skip what already exists. It will not
-- duplicate tables, drop your data, or fail halfway because
-- something was already there.
-- ============================================================


-- ============================================================
-- PART 1 — Accounts and profiles
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  handle TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  category TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Give every new signup a profile row automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================================
-- PART 2 — The things a creator sells
-- Money lives in integer kobo (100 kobo = ₦1). Never naira, never
-- decimals — see lib/money.ts.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price_kobo BIGINT NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  slug TEXT UNIQUE,
  offer_type TEXT DEFAULT 'digital',
  publish_status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  time TEXT,
  location TEXT,
  map_link TEXT,
  price_kobo BIGINT NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  status TEXT DEFAULT 'Upcoming',
  publish_status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  capacity INTEGER,
  attendees_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- If these tables already existed from an older version, add whatever
-- is missing rather than assuming the new shape.
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS price_kobo BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS publish_status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS offer_type TEXT DEFAULT 'digital';

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price_kobo BIGINT NOT NULL DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS publish_status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS capacity INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS attendees_count INTEGER DEFAULT 0;

-- Carry over any prices that were stored in naira by an older version.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='offers' AND column_name='price_naira') THEN
    EXECUTE 'UPDATE public.offers SET price_kobo = ROUND(COALESCE(price_naira,0)*100)
             WHERE price_kobo = 0 AND COALESCE(price_naira,0) <> 0';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='events' AND column_name='price_naira') THEN
    EXECUTE 'UPDATE public.events SET price_kobo = ROUND(COALESCE(price_naira,0)*100)
             WHERE price_kobo = 0 AND COALESCE(price_naira,0) <> 0';
  END IF;

  -- Anything already public under the old flag stays public.
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='offers' AND column_name='is_published') THEN
    EXECUTE 'UPDATE public.offers SET publish_status = ''published''
             WHERE is_published = true AND publish_status = ''draft''';
  END IF;
END $$;

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- The public may only see PUBLISHED items. Creators always see their own.
DROP POLICY IF EXISTS "Public can view published offers" ON public.offers;
CREATE POLICY "Public can view published offers" ON public.offers
  FOR SELECT USING (publish_status = 'published' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own offers" ON public.offers;
CREATE POLICY "Users can manage their own offers" ON public.offers
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can view events" ON public.events;
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (publish_status = 'published' OR auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can insert own events" ON public.events;
CREATE POLICY "Creators can insert own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can update own events" ON public.events;
CREATE POLICY "Creators can update own events" ON public.events
  FOR UPDATE USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can delete own events" ON public.events;
CREATE POLICY "Creators can delete own events" ON public.events
  FOR DELETE USING (auth.uid() = creator_id);


-- ============================================================
-- PART 3 — Buyers
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  stage TEXT DEFAULT 'lead',
  total_spent_kobo BIGINT NOT NULL DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  last_offer TEXT,
  first_seen TIMESTAMPTZ DEFAULT now(),
  last_seen TIMESTAMPTZ DEFAULT now(),
  UNIQUE (creator_id, email)
);

ALTER TABLE public.audience ADD COLUMN IF NOT EXISTS total_spent_kobo BIGINT NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema='public' AND table_name='audience' AND column_name='total_spent') THEN
    EXECUTE 'UPDATE public.audience SET total_spent_kobo = ROUND(COALESCE(total_spent,0)*100)
             WHERE total_spent_kobo = 0 AND COALESCE(total_spent,0) <> 0';
  END IF;
END $$;

ALTER TABLE public.audience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own audience" ON public.audience;
CREATE POLICY "Users can view their own audience" ON public.audience
  FOR SELECT USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can manage their own audience" ON public.audience;
CREATE POLICY "Users can manage their own audience" ON public.audience
  FOR ALL USING (auth.uid() = creator_id);


-- ============================================================
-- PART 4 — Getting paid
--
-- Paylance NEVER holds creator money. The payment provider splits
-- each payment as it happens and sends the creator's share straight
-- to their own bank. That is why there is no wallet, no balance and
-- no withdrawals anywhere in this schema.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.payout_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  provider TEXT NOT NULL DEFAULT 'paystack',
  provider_subaccount_id TEXT,

  bank_code TEXT,
  bank_name TEXT,
  account_name TEXT,
  -- Only the last 4 digits are kept here; the full number stays with
  -- the payment provider.
  account_number_last4 TEXT,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'disabled')),

  -- Fee model per creator, so it can change without a migration.
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


-- One ledger for every sale, across offers AND events.
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  reference TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'paystack',
  provider_reference TEXT,

  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  item_type TEXT NOT NULL CHECK (item_type IN ('offer', 'event')),
  offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  item_title TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),

  gross_kobo BIGINT NOT NULL CHECK (gross_kobo >= 0),
  platform_fee_kobo BIGINT NOT NULL DEFAULT 0 CHECK (platform_fee_kobo >= 0),
  provider_fee_kobo BIGINT NOT NULL DEFAULT 0 CHECK (provider_fee_kobo >= 0),
  net_kobo BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'abandoned', 'refunded')),
  -- How the buyer funded it (card, transfer, virtual account).
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


-- Record of money landing in the creator's own bank. Reporting only.
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


-- Every inbound provider event, stored so a replayed event can't be
-- counted twice.
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
-- No policies on purpose: server-side only, nothing in a browser reads it.


-- ============================================================
-- PART 5 — Rules the database enforces itself
-- ============================================================

-- You cannot publish something you charge for until your bank is
-- connected. Enforced here as well as in the app, so it holds even if
-- someone calls the database directly. Free items are allowed through.
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

  -- Free items publish without a bank account — nothing is being sold.
  IF item_price = 0 THEN
    NEW.published_at := COALESCE(NEW.published_at, now());
    RETURN NEW;
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


-- Keep updated_at honest.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_offers_updated_at ON public.offers;
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();


-- Bump an event's attendee count. Called after a payment is confirmed.
-- Revenue is always derived from `orders`, never stored on the event.
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

DROP FUNCTION IF EXISTS public.increment_event_stats(UUID, INTEGER, NUMERIC);


-- ============================================================
-- PART 6 — Image storage
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('event_covers', 'event_covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('offer_covers', 'offer_covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Event Covers" ON storage.objects;
DROP POLICY IF EXISTS "Paylance public read" ON storage.objects;
CREATE POLICY "Paylance public read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'event_covers', 'offer_covers'));

DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload event covers" ON storage.objects;
DROP POLICY IF EXISTS "Paylance authenticated upload" ON storage.objects;
CREATE POLICY "Paylance authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('avatars', 'event_covers', 'offer_covers')
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update event covers" ON storage.objects;
DROP POLICY IF EXISTS "Paylance authenticated update" ON storage.objects;
CREATE POLICY "Paylance authenticated update" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('avatars', 'event_covers', 'offer_covers')
    AND auth.role() = 'authenticated'
  );


-- ============================================================
-- Done. You should see "Success. No rows returned".
-- ============================================================
