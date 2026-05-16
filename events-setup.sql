-- ============================================
-- Events Table & Storage Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. CREATE EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  time TEXT,
  location TEXT,
  map_link TEXT,
  price_naira NUMERIC NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  status TEXT DEFAULT 'Upcoming',
  attendees_count INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view events
CREATE POLICY "Public can view events" ON public.events
  FOR SELECT USING (true);

-- Policy: Creators can insert their own events
CREATE POLICY "Creators can insert own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Policy: Creators can update their own events
CREATE POLICY "Creators can update own events" ON public.events
  FOR UPDATE USING (auth.uid() = creator_id);

-- Policy: Creators can delete their own events
CREATE POLICY "Creators can delete own events" ON public.events
  FOR DELETE USING (auth.uid() = creator_id);


-- 2. CREATE STORAGE BUCKET FOR EVENT COVERS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('event_covers', 'event_covers', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public can view event covers
CREATE POLICY "Public Access to Event Covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'event_covers');

-- Policy: Authenticated users can upload event covers
CREATE POLICY "Users can upload event covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event_covers' AND auth.role() = 'authenticated');

-- Policy: Authenticated users can update their event covers
CREATE POLICY "Users can update event covers" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event_covers' AND auth.role() = 'authenticated');
