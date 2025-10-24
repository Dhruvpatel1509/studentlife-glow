-- Add likes and prosts columns to events table
ALTER TABLE public.events 
ADD COLUMN likes integer DEFAULT 0 NOT NULL,
ADD COLUMN prosts integer DEFAULT 0 NOT NULL;

-- Update existing events with dummy data for likes and prosts
UPDATE public.events 
SET 
  likes = floor(random() * 100 + 10)::integer,
  prosts = floor(random() * 50 + 5)::integer;