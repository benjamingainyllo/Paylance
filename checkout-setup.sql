-- ============================================
-- Checkout & Ticketing Setup
-- Run this in your Supabase SQL Editor (after events-setup.sql)
-- Wires the `transactions` table up to event ticket sales/RSVPs
-- and adds an atomic helper for bumping event stats on sale.
-- ============================================

-- 1. Let a transaction reference an event (in addition to an offer)
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES public.events(id) ON DELETE SET NULL;

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS ticket_quantity INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS transactions_event_id_idx ON public.transactions(event_id);
CREATE INDEX IF NOT EXISTS transactions_reference_idx ON public.transactions(reference);

-- 2. Atomic increment for an event's attendee/revenue counters.
--    Called from the Paystack webhook (paid tickets) and the free-RSVP
--    path so concurrent sales never clobber each other.
CREATE OR REPLACE FUNCTION public.increment_event_stats(
  p_event_id UUID,
  p_attendees INTEGER,
  p_revenue NUMERIC
)
RETURNS void AS $$
BEGIN
  UPDATE public.events
  SET attendees_count = COALESCE(attendees_count, 0) + p_attendees,
      revenue = COALESCE(revenue, 0) + p_revenue,
      updated_at = now()
  WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
