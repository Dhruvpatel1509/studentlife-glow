-- Add wallet balance to profiles table
ALTER TABLE public.profiles
ADD COLUMN wallet_balance DECIMAL(10,2) DEFAULT 0.00 NOT NULL;

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable RLS on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can view events"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policy to allow users to update their own wallet balance
CREATE POLICY "Users can view their own wallet balance"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own wallet balance"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);